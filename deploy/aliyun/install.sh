#!/usr/bin/env bash
# ============================================================
# new-api 阿里云部署安装脚本（在 ECS 服务器上执行）
# 前提：dist/ 目录（构建产物）已上传到服务器 /opt/new-api/
# 用法：
#   ./install.sh              # 安装并启动
#   ./install.sh --update     # 仅更新二进制/前端并重启
#   ./install.sh --status     # 查看状态
#   ./install.sh --logs       # 查看后端日志
#   ./install.sh --restart    # 重启服务
#   ./install.sh --uninstall  # 卸载服务
# ============================================================
set -euo pipefail

cd "$(dirname "$0")"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
info()  { echo -e "${GREEN}[INFO]${NC} $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $*"; }
fail()  { echo -e "${RED}[ERROR]${NC} $*"; exit 1; }

SERVICE_NAME=new-api
INSTALL_DIR=/opt/new-api
SERVICE_FILE=/etc/systemd/system/${SERVICE_NAME}.service
NGINX_CONF=/etc/nginx/conf.d/${SERVICE_NAME}.conf

# ---------- 参数解析 ----------
case "${1:-}" in
  --status)    systemctl status $SERVICE_NAME --no-pager; exit 0 ;;
  --logs)      journalctl -u $SERVICE_NAME -f -n 200 --no-pager; exit 0 ;;
  --restart)   systemctl restart $SERVICE_NAME; info "已重启 $SERVICE_NAME"; exit 0 ;;
  --uninstall)
    systemctl stop $SERVICE_NAME 2>/dev/null || true
    systemctl disable $SERVICE_NAME 2>/dev/null || true
    rm -f "$SERVICE_FILE" "$NGINX_CONF"
    systemctl daemon-reload
    systemctl reload nginx 2>/dev/null || true
    warn "已卸载服务，数据目录 $INSTALL_DIR 保留"
    exit 0 ;;
  --update)    UPDATE=1 ;;
  "")          UPDATE=0 ;;
  *)           fail "未知参数: $1" ;;
esac

# ---------- 检查 root ----------
[ "$(id -u)" = "0" ] || fail "请使用 root 用户执行（sudo -i）"

# ---------- 1. 检查依赖 ----------
command -v systemctl >/dev/null 2>&1 || fail "未检测到 systemd"
if [ -d /etc/nginx ] && command -v nginx >/dev/null 2>&1; then
  HAS_NGINX=1
else
  HAS_NGINX=0
  warn "未检测到 Nginx，将跳过 Nginx 配置（请手动安装 Nginx 或改为后端直接托管前端）"
fi

# ---------- 2. 检查产物 ----------
if [ ! -f dist/new-api-linux-amd64 ]; then
  fail "未找到 dist/new-api-linux-amd64，请先在本地执行 build.sh 并上传"
fi
[ -d dist/web ] || fail "未找到 dist/web 目录（前端产物）"

# ---------- 3. 创建目录并放置文件 ----------
info "部署文件到 $INSTALL_DIR ..."
mkdir -p "$INSTALL_DIR/logs"

if [ "$UPDATE" = "1" ]; then
  # 更新模式：替换二进制和前端
  cp -f dist/new-api-linux-amd64 "$INSTALL_DIR/new-api"
else
  # 首次安装
  [ -f "$INSTALL_DIR/new-api" ] && cp -f dist/new-api-linux-amd64 "$INSTALL_DIR/new-api" || cp dist/new-api-linux-amd64 "$INSTALL_DIR/new-api"
fi
chmod +x "$INSTALL_DIR/new-api"

# 前端产物
mkdir -p "$INSTALL_DIR/web"
cp -rf dist/web/. "$INSTALL_DIR/web/"

# .env（仅首次创建）
if [ ! -f "$INSTALL_DIR/.env" ]; then
  if [ -f .env.example ]; then
    cp .env.example "$INSTALL_DIR/.env"
    warn "已生成 $INSTALL_DIR/.env，请编辑填写 SESSION_SECRET 等配置后重启服务"
  fi
fi

# ---------- 4. 安装 systemd 服务 ----------
info "安装 systemd 服务 ..."
cp -f new-api.service "$SERVICE_FILE"
systemctl daemon-reload
systemctl enable $SERVICE_NAME >/dev/null 2>&1 || true

# 若 .env 存在且已配置，则启动；否则提示用户
if [ -f "$INSTALL_DIR/.env" ]; then
  systemctl restart $SERVICE_NAME
  info "后端服务已启动"
else
  warn "未生成 .env，请先编辑 $INSTALL_DIR/.env 后执行: systemctl restart $SERVICE_NAME"
fi

# ---------- 5. 安装 Nginx 配置（如存在）----------
if [ "$HAS_NGINX" = "1" ]; then
  info "安装 Nginx 配置 ..."
  cp -f new-api.conf "$NGINX_CONF"
  # 替换 server_name 占位（可手动修改）
  nginx -t && systemctl reload nginx || warn "Nginx 配置检查失败，请手动检查 $NGINX_CONF"
  info "Nginx 已配置，前端入口 http://服务器IP/"
fi

# ---------- 6. 健康检查 ----------
info "等待服务就绪..."
for i in $(seq 1 15); do
  if curl -sf http://127.0.0.1:4340/api/status >/dev/null 2>&1; then
    info "后端 API 正常！"
    break
  fi
  sleep 1
done

info "部署完成！访问 http://服务器IP/ （首次访问请初始化 root 账号）"
info "查看日志: ./install.sh --logs"
