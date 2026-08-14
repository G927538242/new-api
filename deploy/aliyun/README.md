# new-api 阿里云部署指南（systemd + Nginx 前后端分离）

> 部署模式：**前后端分离**。Nginx 托管前端静态文件，后端 API 服务由 systemd 管理。
> 相比 Docker 方案更轻量，适合单机 ECS。

## 目录结构

```
deploy/aliyun/
├── build.sh            # ① 本地构建脚本（交叉编译 Linux 二进制 + 前端）
├── new-api.service     # ② systemd 服务文件（后端）
├── new-api.conf        # ③ Nginx 配置（前端 + API 反代）
├── .env.example        # ④ 后端环境变量模板
├── install.sh          # ⑤ 服务器安装脚本
└── dist/               # 构建产物（build.sh 生成，上传用）
```

---

## 一、本地构建（在你的 Mac 上执行）

```bash
cd new-api/deploy/aliyun
chmod +x build.sh
./build.sh              # 默认构建 amd64；ARM 服务器用 ./build.sh --arm64
```

构建完成后生成 `dist/` 目录：
- `dist/new-api-linux-amd64` — 后端二进制（已内嵌前端）
- `dist/web/` — 前端静态文件（供 Nginx 托管）

## 二、上传到服务器

```bash
# 方式1：scp（推荐先建立 SSH 信任，避免交互）
scp -r dist root@<服务器IP>:/tmp/new-api-dist

# 方式2：本地 rsync
rsync -avz dist/ root@<服务器IP>:/tmp/new-api-dist/
```

> 提示：如果首次连接提示主机指纹确认，可先执行
> `ssh-keyscan -H <服务器IP> >> ~/.ssh/known_hosts` 消除交互。

## 三、服务器安装（root 执行）

```bash
# 1. 将产物放到 /opt/new-api
mkdir -p /opt/new-api
cd /opt/new-api
cp -r /tmp/new-api-dist .        # 即 /opt/new-api/dist
cp /tmp/new-api-dist/../aliyun 下的 new-api.service、new-api.conf、install.sh、.env.example 到 /opt/new-api/

# 2. 编辑环境变量
cp .env.example .env
vim .env    # 必改：SESSION_SECRET（openssl rand -hex 32 生成）
            # 可选：SQL_DSN（用 MySQL/RDS 时）、REDIS_CONN_STRING

# 3. 安装并启动
chmod +x install.sh
./install.sh
```

> 若服务器未安装 Nginx：
> ```bash
> # Ubuntu/Debian
> apt install -y nginx
> # CentOS/RHEL
> yum install -y nginx
> ```

## 四、运维命令

```bash
# 查看后端日志（实时）
./install.sh --logs

# 查看服务状态
./install.sh --status

# 重启服务
./install.sh --restart

# 更新版本（重新构建后上传 dist 覆盖，再执行）
./install.sh --update

# 卸载
./install.sh --uninstall
```

## 五、阿里云安全组配置

在 ECS 控制台 → 安全组 → 入方向规则放行：

| 端口 | 用途 |
|------|------|
| 80 | HTTP（Nginx 前端入口） |
| 443 | HTTPS（如配置证书） |
| 22 | SSH（默认已有） |

> 后端 4340 端口**不要**对外开放（仅 Nginx 内网反代），避免绕过鉴权。

## 六、HTTPS 配置（可选）

若已购买域名并完成 ICP 备案，可用 certbot 自动申请证书：

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

然后将 `new-api.conf` 中 `server_name _` 改为你的域名后重新执行 certbot。

## 七、常见问题

1. **前端页面能打开但接口 502** → 检查后端是否启动：`systemctl status new-api`；再确认 Nginx 代理地址 `127.0.0.1:4340` 与后端 `PORT` 一致。
2. **登录后会话丢失/重启需重新登录** → `.env` 中 `SESSION_SECRET` 为空或变更过，设为固定随机串。
3. **上传大文件失败** → Nginx 已设置 `client_max_body_size 256m`，若素材库视频超 200MB 需调大。
4. **sqlite 数据库位置** → 默认在 `/opt/new-api/new-api.db`，备份该文件即可。
5. **SSE 流式输出卡顿** → 确认 Nginx 流式 location 已生效（`proxy_buffering off`）。
