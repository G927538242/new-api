#!/usr/bin/env bash
# ============================================================
# new-api 本地构建脚本（阿里云 Linux x86_64 部署用）
# 用法：
#   ./build.sh          # 构建 Linux amd64 二进制 + 前端产物
#   ./build.sh --arm64  # 构建 Linux arm64（ARM 架构服务器）
# 输出：
#   dist/new-api-linux-amd64   后端二进制（内嵌前端）
#   dist/web/                  前端静态文件（Nginx 托管）
# ============================================================
set -euo pipefail

cd "$(dirname "$0")/../.."   # 定位到项目根目录（new-api/）

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
info()  { echo -e "${GREEN}[INFO]${NC} $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $*"; }
fail()  { echo -e "${RED}[ERROR]${NC} $*"; exit 1; }

ARCH="${1:-amd64}"
case "$ARCH" in
  --arm64) GOARCH=arm64 ;;
  *)       GOARCH=amd64 ;;
esac

# ---------- 1. 构建前端 ----------
info "构建前端 (rsbuild)..."
if [ ! -d web/node_modules ]; then
  warn "web/node_modules 不存在，执行 npm install..."
  (cd web && npm install --frozen-lockfile) || fail "npm install 失败"
fi
# 生产构建：禁用 VITE_REACT_APP_SERVER_URL（走同域相对路径，由 Nginx 反代）
(cd web && VITE_REACT_APP_SERVER_URL= npm run build) || fail "前端构建失败"
[ -d web/dist ] || fail "前端构建产物 web/dist 不存在"

# ---------- 2. 构建后端（交叉编译，内嵌 web/dist）----------
info "构建后端 (GOOS=linux GOARCH=$GOARCH)..."
command -v go >/dev/null 2>&1 || fail "未找到 go 命令"
CGO_ENABLED=0 GOOS=linux GOARCH=$GOARCH \
  go build -trimpath -ldflags "-s -w" -o new-api .
[ -f new-api ] || fail "后端构建失败"

# ---------- 3. 收集产物 ----------
info "收集产物到 deploy/aliyun/dist/ ..."
rm -rf deploy/aliyun/dist
mkdir -p deploy/aliyun/dist/web
mv new-api "deploy/aliyun/dist/new-api-linux-${GOARCH}"
cp -r web/dist/. deploy/aliyun/dist/web/

info "构建完成！产物列表："
ls -lh deploy/aliyun/dist/
ls -lh deploy/aliyun/dist/web/ | head -20
info "部署目录：deploy/aliyun/dist/"
info "将该目录上传到服务器后，参考 deploy/aliyun/README.md 完成安装"
