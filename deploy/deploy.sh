#!/usr/bin/env bash
# ============================================
# 阿里云一键部署脚本（在 ECS 服务器上执行）
# 用法:
#   ./deploy.sh             # 部署/更新（使用已有 .env）
#   ./deploy.sh --init      # 首次部署（从 .env.example 生成 .env）
#   ./deploy.sh --logs      # 查看日志
#   ./deploy.sh --down      # 停止服务
# ============================================
set -euo pipefail

cd "$(dirname "$0")"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
info()  { echo -e "${GREEN}[INFO]${NC} $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $*"; }
fail()  { echo -e "${RED}[ERROR]${NC} $*"; exit 1; }

# ---------- 参数解析 ----------
case "${1:-}" in
  --init)   INIT=1 ;;
  --logs)   exec docker compose logs -f --tail=200 ;;
  --down)   exec docker compose down ;;
  "")       INIT=0 ;;
  *)        fail "未知参数: $1" ;;
esac

# ---------- 1. 检查/安装 Docker ----------
if ! command -v docker >/dev/null 2>&1; then
  warn "未检测到 Docker，开始安装..."
  if command -v apt-get >/dev/null 2>&1; then
    export DEBIAN_FRONTEND=noninteractive
    apt-get update && apt-get install -y docker.io docker-compose-v2 || apt-get install -y docker.io docker-compose
  elif command -v yum >/dev/null 2>&1; then
    yum install -y docker docker-compose-plugin || yum install -y docker docker-compose
  else
    fail "无法自动安装 Docker，请手动安装后重试"
  fi
  systemctl enable --now docker || service docker start || true
fi
docker --version >/dev/null 2>&1 || fail "Docker 安装失败"
docker compose version >/dev/null 2>&1 || fail "缺少 docker compose 插件（docker-compose-v2 / compose-plugin）"

# ---------- 2. 生成 .env ----------
if [ ! -f .env ]; then
  if [ "${INIT:-0}" != "1" ] && [ ! -f .env.example ]; then
    fail ".env 不存在，且无 .env.example，请先创建 .env"
  fi
  [ ! -f .env.example ] && cp /dev/null .env.example
  cp .env.example .env
  warn "已生成 .env，请编辑填写 SQL_DSN（RDS 连接串）、Redis 密码、SESSION_SECRET 后再执行 ./deploy.sh"
  exit 1
fi

# 校验 .env 关键配置未被修改
check_env() {
  local k="$1"
  local v
  v=$(grep -E "^${k}=" .env | head -1 | cut -d= -f2- || true)
  case "$v" in
    ""|change-me*|your_*) return 1 ;;
  esac
}
check_env SQL_DSN       || fail "SQL_DSN 未配置或仍为示例值，请修改 .env"
check_env REDIS_PASSWORD || fail "REDIS_PASSWORD 未配置或仍为示例值，请修改 .env"
check_env SESSION_SECRET  || fail "SESSION_SECRET 未配置或仍为示例值，请修改 .env"

# ---------- 3. 构建并启动 ----------
info "开始构建镜像（首次构建约需数分钟）..."
docker compose build
info "启动服务..."
docker compose up -d
info "等待服务就绪..."
for i in $(seq 1 30); do
  if curl -sf http://127.0.0.1:"${PORT:-3000}"/api/status >/dev/null 2>&1; then
    info "部署成功！访问 http://服务器IP:${PORT:-3000} （首次打开请初始化 root 账号）"
    exit 0
  fi
  sleep 2
done
warn "服务已启动但健康检查未通过，查看日志: ./deploy.sh --logs"
exit 1
