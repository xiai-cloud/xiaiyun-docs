# 🚀 Apollo Dashboard 部署指南

本文档提供 Apollo Dashboard 项目的完整部署说明，包括测试环境和生产环境的自动化部署流程。

## 🏗️ 部署架构

项目采用 **GitHub Actions + Docker + 阿里云 ACR + ECS** 的现代化自动部署架构：

```
GitHub Repository
    ↓ (Push to branch)
GitHub Actions CI/CD
    ↓ (Build & Push)
阿里云容器镜像服务 (ACR)
    ↓ (Pull & Deploy)
阿里云 ECS 服务器
    ↓
Docker Compose (Next.js + Nginx + SSL)
    ↓
Let's Encrypt SSL 证书
```

## 📋 环境配置

### 测试环境
- **触发分支**: `develop`, `test`
- **推荐域名**: `test-apollo.example.com`
- **自动部署**: 推送到分支时自动触发
- **部署路径**: `/opt/webs-test`
- **端口配置**: 8080 (可配置备用端口 8090)

### 生产环境
- **触发分支**: `master`, `main`
- **推荐域名**: `apollo.example.com`
- **自动部署**: 推送到分支时自动触发
- **部署路径**: `/opt/webs-prod`
- **端口配置**: 80/443 (HTTP/HTTPS)

## 🔧 服务器环境准备

### 1. 阿里云 ECS 服务器配置

#### 1.1 服务器规格要求
```bash
# 系统要求
系统版本: Ubuntu 22.04 LTS / CentOS 7.9
最低配置: 2核2G内存, 40GB存储空间
推荐配置: 4核8G内存, 100GB存储空间

# 安全组配置
入方向规则:
- SSH: 22端口
- HTTP: 80端口  
- HTTPS: 443端口
- 自定义: 8080端口 (测试环境)
出方向规则: 全部允许
```

#### 1.2 服务器环境安装
```bash
# 登录服务器
ssh root@服务器IP

# 安装Docker 和 Docker Compose
参考阿里云文档：
[阿里云文档](https://help.aliyun.com/zh/ecs/use-cases/install-and-use-docker)
[运维建站](https://www.1majie.com/maintance?id=20&type=%E8%BF%90%E7%BB%B4%E5%BB%BA%E7%AB%99)

# 检查docker 和 docker compose 安装是否成功，并验证是否成功
sudo docker -v
sudo docker compose -v

# 安装其他必要工具
sudo apt install -y curl lsof git htop

# 安装nodejs
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20

# 安装pm2
npm install -g pm2

```

### 2. 阿里云容器镜像服务 (ACR) 配置

1. 登录 [阿里云容器镜像服务控制台](https://cr.console.aliyun.com)
2. 创建命名空间（推荐：`apollo-dashboard`）
3. 创建镜像仓库（名称：`webs-apollo-dashboard`）
4. 获取访问凭证：
   - 访问地址：`registry.cn-hangzhou.aliyuncs.com`
   - 用户名和密码

### 3. Supabase 项目配置

#### 3.1 创建 Supabase 项目
1. 登录 [Supabase Dashboard](https://app.supabase.io)
2. 创建新项目（分别创建生产和测试项目）
3. 获取项目配置：
   - Project URL: `https://xxx.supabase.co`
   - Anon Key: `eyJhbGciOiJIUzI1NiI...`
   - Service Role Key: `eyJhbGciOiJIUzI1NiI...`

#### 3.2 配置认证设置
```bash
# 生产环境配置
Site URL: https://your-domain.com
Redirect URLs:
- https://your-domain.com/auth/callback
- https://your-domain.com/auth/confirm
- https://your-domain.com/update-password

# 测试环境配置
Site URL: https://test-your-domain.com
Redirect URLs:
- https://test-your-domain.com/auth/callback
- https://test-your-domain.com/auth/confirm
- https://test-your-domain.com/update-password
```

#### 3.3 部署数据库模式
```bash
# 本地开发环境操作
cd /path/to/apollo-dashboard
supabase login
supabase link --project-ref YOUR_PROJECT_ID

# 部署数据库模式到线上
export SUPABASE_PROJECT_REF="YOUR_PROJECT_ID"
pnpm supabase:deploy
```

#### 3.4 配置邮件模板

```bash
# 将项目中对应的邮件模板，复制到supabase的邮件模板中
```

#### 3.5 Supabase 配置webhook

- 在supabase的webhook中，配置webhook

<img src="https://collect-picurl-1301560453.cos.ap-nanjing.myqcloud.com/undefined20250728150927283.png?imageSlim"/>

<img src="https://collect-picurl-1301560453.cos.ap-nanjing.myqcloud.com/undefined20250728151141953.png?imageSlim"/>

### 4. 域名和DNS配置

```bash
# 域名解析设置示例
域名: apollo.example.com
记录类型: A
主机记录: @
记录值: 服务器公网IP
TTL: 600

# 测试环境子域名
域名: test-apollo.example.com
记录类型: A
主机记录: test-apollo
记录值: 服务器公网IP
TTL: 600
```

## 🔑 GitHub Secrets 配置

在 GitHub 仓库的 Settings > Secrets and variables > Actions 中配置以下环境变量：

### 生产环境 Secrets

| Secret 名称 | 描述 | 示例值 |
|------------|------|--------|
| `ACR_REGISTRY` | ACR 注册表地址 | `registry.cn-hangzhou.aliyuncs.com` |
| `ACR_NAMESPACE` | ACR 命名空间 | `apollo-dashboard` |
| `ACR_USERNAME` | ACR 用户名 | `your-username` |
| `ACR_PASSWORD` | ACR 密码 | `your-password` |
| `PROD_ECS_HOST` | 生产服务器 IP | `47.100.xxx.xxx` |
| `PROD_ECS_USER` | 服务器 SSH 用户名 | `root` |
| `PROD_ECS_PASSWORD` | 服务器 SSH 密码 | `your-password` |
| `PROD_ECS_PORT` | 生产服务器 SSH 端口 | `22` |
| `PROD_DOMAIN_NAME` | 生产域名 | `apollo.example.com` |

### 测试环境 Secrets

| Secret 名称 | 描述 | 示例值 |
|------------|------|--------|
| `TEST_ECS_HOST` | 测试服务器 IP | `47.100.xxx.xxx` |
| `TEST_ECS_USER` | 测试服务器 SSH 用户名 | `root` |
| `TEST_ECS_PASSWORD` | 测试服务器 SSH 密码 | `your-password` |
| `TEST_ECS_PORT` | 测试服务器 SSH 端口 | `22` |
| `TEST_DOMAIN_NAME` | 测试域名 | `test-apollo.example.com` |
| `TEST_SSL_DOMAIN` | SSL 证书域名 | `test-apollo.example.com` |
| `TEST_SSL_EMAIL` | SSL 证书邮箱 | `admin@example.com` |
| `TEST_PORT` | 测试环境端口 | `8080` |
| `TEST_PRODUCT_NAME` | 测试环境产品名称 | `Apollo Dashboard Test` |

### Supabase 数据库配置

| Secret 名称 | 描述 | 示例值 |
|------------|------|--------|
| **生产环境** |
| `PROD_SUPABASE_URL` | Supabase 项目 URL | `https://xxx.supabase.co` |
| `PROD_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | `eyJhbGciOiJIUzI1NiI...` |
| `PROD_SUPABASE_SERVICE_ROLE_KEY` | Supabase 服务角色密钥 | `eyJhbGciOiJIUzI1NiI...` |
| `PROD_SITE_URL` | 生产环境站点 URL | `https://apollo.example.com` |
| **测试环境** |
| `TEST_SUPABASE_URL` | 测试 Supabase 项目 URL | `https://xxx-test.supabase.co` |
| `TEST_SUPABASE_ANON_KEY` | 测试 Supabase 匿名密钥 | `eyJhbGciOiJIUzI1NiI...` |
| `TEST_SUPABASE_SERVICE_ROLE_KEY` | 测试 Supabase 服务角色密钥 | `eyJhbGciOiJIUzI1NiI...` |
| `TEST_SITE_URL` | 测试环境站点 URL | `https://test-apollo.example.com` |

### 邮件服务配置 (可选)

| Secret 名称 | 描述 | 示例值 |
|------------|------|--------|
| **生产环境** |
| `PROD_EMAIL_HOST` | SMTP 服务器地址 | `smtp.qq.com` |
| `PROD_EMAIL_PORT` | SMTP 端口 | `465` |
| `PROD_EMAIL_USER` | 邮箱用户名 | `noreply@example.com` |
| `PROD_EMAIL_PASSWORD` | 邮箱密码/授权码 | `your-email-password` |
| `PROD_EMAIL_SENDER` | 发件人邮箱 | `noreply@example.com` |
| `PROD_CONTACT_EMAIL` | 联系邮箱 | `contact@example.com` |
| **测试环境** |
| `TEST_EMAIL_HOST` | 测试 SMTP 服务器 | `smtp.qq.com` |
| `TEST_EMAIL_PORT` | 测试 SMTP 端口 | `465` |
| `TEST_EMAIL_USER` | 测试邮箱用户名 | `test@example.com` |
| `TEST_EMAIL_PASSWORD` | 测试邮箱密码 | `test-password` |
| `TEST_EMAIL_SENDER` | 测试发件人邮箱 | `test@example.com` |
| `TEST_CONTACT_EMAIL` | 测试联系邮箱 | `test@example.com` |

### AI 服务配置 (可选)

| Secret 名称 | 描述 | 示例值 |
|------------|------|--------|
| `TEST_TIKHUB_API_KEY` | TikHub API 密钥 | `your-tikhub-key` |
| `TEST_DASHSCOPE_API_KEY` | DashScope API 密钥 | `your-dashscope-key` |
| `TEST_OPEN_ROUTER_API_KEY` | OpenRouter API 密钥 | `your-openrouter-key` |
| `AMAP_API_KEY` | 高德地图 API 密钥 | `your-amap-key` |

### Webhook 配置

| Secret 名称 | 描述 | 示例值 |
|------------|------|--------|
| `SUPABASE_DB_WEBHOOK_SECRET` | 数据库 Webhook 密钥 | `your-webhook-secret` |

### 其他配置变量

| Secret 名称 | 描述 | 示例值 |
|------------|------|--------|
| `DOMAIN_NAME` | 通用域名配置 | `apollo.example.com` |

## 🔧 Worker 服务部署

Apollo Dashboard 包含独立的 Worker 服务，需要单独部署配置。Worker 服务负责处理后台任务和 AI 相关功能。

### 本地打包及部署

```bash
# 进入项目目录
cd apps/apollo-dashboard

# 执行打包脚本
./scripts/build-workers.sh

# 生成 workers-deploy.tar.gz 文件

```
**！！！！打包完成控制台会输出对应部署步骤，请根据提示进行部署！！！！**

### Worker 服务管理

#### 服务状态查看

```bash
# 查看所有服务状态
pm2 status
pm2 logs --lines 100
```

#### 服务重启和更新

```bash
# 重启所有 Worker 服务
pm2 restart all

# 重启特定服务
pm2 restart worker-service-1

# 重新加载服务（无停机时间）
pm2 reload all

# 停止服务
pm2 stop all

# 删除服务
pm2 delete all
```

#### 服务监控

```bash
# 查看服务资源使用情况
pm2 monit

# 查看详细信息
pm2 show worker-service-1

# 查看日志文件位置
pm2 logs --format
```
### 测试环境部署

```bash
# 推送到测试分支触发部署
git checkout develop
git add .
git commit -m "feat: 新功能开发"
git push origin develop
```

### 生产环境部署

```bash
# 推送到主分支触发部署
git checkout main
git merge develop
git push origin main
```

## 🔐 SSL 证书管理

- ssl证书管理和申请以及续期由脚本自动处理，无需手动处理（下方命令仅供参考）

### 自动申请和配置

部署脚本会自动处理 SSL 证书：

```bash
# 证书申请条件检查
1. 域名正确解析到服务器 IP
2. 80 端口可以正常访问
3. Nginx 服务正常运行

# 证书存储位置
/opt/webs-prod/certbot/conf/live/your-domain.com/
├── fullchain.pem    # 完整证书链
├── privkey.pem      # 私钥文件
├── cert.pem         # 证书文件
└── chain.pem        # 证书链文件
```

### 自动续期设置

```bash
# 系统会自动添加 cron 任务
0 0 * * 0 cd /opt/webs-prod && docker run --rm \
  -v $(pwd)/certbot/conf:/etc/letsencrypt \
  -v $(pwd)/certbot/www:/var/www/certbot \
  certbot/certbot renew --webroot -w /var/www/certbot \
  && docker compose restart nginx

# 检查 cron 任务
crontab -l
```

### 手动续期

```bash
# 登录服务器
ssh root@服务器IP

# 进入项目目录
cd /opt/webs-prod

# 手动续期证书
docker run --rm \
  -v $(pwd)/certbot/conf:/etc/letsencrypt \
  -v $(pwd)/certbot/www:/var/www/certbot \
  certbot/certbot renew --webroot -w /var/www/certbot

# 重启 Nginx
docker compose restart nginx
```

## 🔍 故障排查

### 查看服务状态

```bash
# 查看容器运行状态
docker compose ps

# 查看应用日志
docker logs webs-apollo-dashboard-prod --tail=100
docker logs webs-nginx-prod --tail=100

# 查看实时日志
docker compose logs -f
```
