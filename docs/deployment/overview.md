# 🚀 喜爱云官网 部署指南

本文档提供完整的项目部署说明，包括测试环境和生产环境的自动化部署流程。

## 🏗️ 部署架构

项目采用 **GitHub Actions + Docker + 阿里云** 的自动化部署架构：

```
GitHub Repository
    ↓ (Push to branch)
GitHub Actions CI/CD
    ↓ (Build & Push)
阿里云容器镜像服务 (ACR)
    ↓ (Pull & Deploy)
阿里云 ECS 服务器
    ↓
Docker Compose (Next.js + Nginx)
    ↓
Let's Encrypt SSL 证书
```

## 📋 环境说明

### 测试环境
- **分支**: `dev`
- **域名**: `dev-sass-kit.xiaiyun.tech`
- **自动部署**: 推送到 `dev` 分支自动触发
- **部署路径**: `/app/test`

### 生产环境
- **分支**: `master`
- **域名**: `xiaiyun.tech`
- **自动部署**: 推送到 `master` 分支自动触发
- **部署路径**: `/opt/makerkit`

## 🔧 前置准备

### 1. 阿里云 ECS 服务器

- **系统要求**: Ubuntu 22.04 LTS / 阿里云CentOS 7.9
- **最低配置**: 2核2G
- **推荐配置**: 4核8G
- **存储空间**: 至少 40GB
- **安全组规则**:
  - 入方向: 22 (SSH), 80 (HTTP), 443 (HTTPS)
  - 出方向: 所有
### 1.1 服务器环境配置

- 新建一台服务器，选择Ubuntu 22.04 LTS / 阿里云CentOS 7.9，配置最低配置：2核2G
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
```


### 2. 阿里云容器镜像服务 (ACR)

1. 登录[阿里云容器镜像服务](https://cr.console.aliyun.com)
2. 创建命名空间（如：`your-namespace`）
3. 创建镜像仓库（如：`makerkit-web`）
4. 获取访问凭证

### 3. Supabase 项目

1. 在 [Supabase](https://app.supabase.io) 创建项目
2. 获取项目 URL 和密钥
3. 配置认证设置：
   - Site URL: `https://your-domain.com`
   - Redirect URLs:
     ```
     https://your-domain.com/auth/callback
     https://your-domain.com/auth/confirm
     https://your-domain.com/update-password
     ```
4. 配置邮件模板
   将项目中对应的邮件模板，复制到supabase的邮件模板中

### 4. 域名解析

- 在阿里云域名控制台，购买域名，并解析到服务器IP
- 一级域名：xiaiyun.tech
- 二级域名：xxxxx.xiaiyun.tech

```bash
# 在阿里云域名控制台，购买域名，并解析到服务器IP
# 一级域名：xiaiyun.tech
# 二级域名：xxxxx.xiaiyun.tech

- 域名：xiaiyun.tech
- 解析记录：
  - 记录类型：A
  - 主机记录：@
  - 记录值：服务器IP
  - 解析线路：默认
  - TTL：600
```

## 🔑 GitHub Secrets 配置

在 GitHub 仓库设置中配置以下 Secrets：

### 生产环境配置

| Secret 名称 | 描述 | 示例值 |
|------------|------|--------|
| `ACR_REGISTRY` | 生产环境 ACR 注册表地址 | `registry.cn-hangzhou.aliyuncs.com` |
| `ACR_NAMESPACE` | 生产环境 ACR 命名空间 | `your-namespace` |
| `ACR_USERNAME` | 生产环境 ACR 用户名 | `your-username` |
| `ACR_PASSWORD` | 生产环境 ACR 密码 | `your-password` |
| `ECS_HOST` | 生产服务器 IP 地址 | `47.100.xxx.xxx` |
| `ECS_USER` | 生产服务器 SSH 用户名 | `root` |
| `ECS_PASSWORD` | 生产服务器 SSH 密码 | `your-password` |
| `DOMAIN_NAME` | 生产环境域名 | `xiaiyun.tech` |

### 测试环境配置

| Secret 名称 | 描述 | 示例值 |
|------------|------|--------|
| `TEST_ACR_REGISTRY` | 测试环境 ACR 注册表地址 | `registry.cn-hangzhou.aliyuncs.com` |
| `TEST_ACR_NAMESPACE` | 测试环境 ACR 命名空间 | `your-test-namespace` |
| `TEST_ACR_USERNAME` | 测试环境 ACR 用户名 | `your-test-username` |
| `TEST_ACR_PASSWORD` | 测试环境 ACR 密码 | `your-test-password` |
| `TEST_ECS_HOST` | 测试服务器 IP 地址 | `47.100.xxx.xxx` |
| `TEST_ECS_USER` | 测试服务器 SSH 用户名 | `root` |
| `TEST_ECS_PASSWORD` | 测试服务器 SSH 密码 | `your-test-password` |
| `TEST_DOMAIN` | 测试环境域名 | `dev-sass-kit.xiaiyun.tech` |

### Supabase 数据库配置

| Secret 名称 | 描述 | 示例值 |
|------------|------|--------|
| `SUPABASE_URL` | 生产环境 Supabase 项目 URL | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | 生产环境 Supabase 匿名密钥 | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_SERVICE_ROLE_KEY` | 生产环境 Supabase 服务角色密钥 | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `TEST_SUPABASE_URL` | 测试环境 Supabase 项目 URL | `https://xxx-test.supabase.co` |
| `TEST_SUPABASE_ANON_KEY` | 测试环境 Supabase 匿名密钥 | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `TEST_SUPABASE_SERVICE_ROLE_KEY` | 测试环境 Supabase 服务角色密钥 | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### 邮件服务配置

| Secret 名称 | 描述 | 示例值 |
|------------|------|--------|
| `EMAIL_USER` | 生产环境邮件服务用户名 | `noreply@xiaiyun.tech` |
| `EMAIL_PASSWORD` | 生产环境邮件服务密码/授权码 | `your-email-password` |
| `EMAIL_SENDER` | 生产环境发件人邮箱地址 | `noreply@xiaiyun.tech` |
| `CONTACT_EMAIL` | 联系邮箱地址 | `contact@xiaiyun.tech` |
| `TEST_EMAIL_USER` | 测试环境邮件服务用户名 | `test@xiaiyun.tech` |
| `TEST_EMAIL_PASSWORD` | 测试环境邮件服务密码/授权码 | `your-test-email-password` |

### 配置说明

**🔴 必需配置项目**
- 所有 ACR 相关配置（用于 Docker 镜像存储）
- 所有 ECS 相关配置（用于服务器部署）
- 所有 Supabase 相关配置（用于数据库和认证）
- 域名配置（用于 SSL 证书和路由）

**🟡 可选配置项目**
- 邮件服务配置（用于发送通知邮件，如注册确认、密码重置等）
- 如不配置邮件服务，相关功能将无法使用

## 🚀 自动部署

### 部署测试环境

```bash
git checkout dev
git push origin dev
```

GitHub Actions 会自动：
1. 运行代码质量检查（ESLint, TypeScript）
2. 构建 Docker 镜像
3. 推送到阿里云 ACR
4. SSH 登录服务器并部署
5. 配置 Nginx 和 SSL 证书

### 部署生产环境

```bash
git checkout master
git push origin master
```

## 🔐 SSL 证书配置
- 以下是手动申请证书的步骤，自动部署无需手动申请证书，证书由阿里云自动申请
- 以下是手动续期的步骤，自动部署无需手动续期，证书由阿里云自动续期
### 首次申请证书

```bash
# 测试环境示例
cd /app/test

# 申请证书
docker run --rm -v $(pwd)/certbot/conf:/etc/letsencrypt \
  -v $(pwd)/certbot/www:/var/www/certbot \
  certbot/certbot certonly --webroot \
  -w /var/www/certbot \
  -d dev-sass-kit.xiaiyun.tech \
  --email your-email@example.com \
  --agree-tos \
  --non-interactive

# 重启 Nginx
docker compose restart nginx
```

### 自动续期

部署脚本会自动设置 cron 任务，每周检查并续期证书：

```bash
# 查看 cron 任务
crontab -l

# 手动续期
cd /app/test
docker run --rm -v $(pwd)/certbot/conf:/etc/letsencrypt \
  -v $(pwd)/certbot/www:/var/www/certbot \
  certbot/certbot renew
```

## 🔍 故障排查

### 查看服务状态

```bash
# 测试环境
cd /app/test
docker compose ps
docker compose logs --tail=50

# 查看特定服务日志
docker compose logs app --tail=100
docker compose logs nginx --tail=100
```

### 常见问题

1. **端口被占用**
   ```bash
   # 查找占用端口的进程
   sudo lsof -i :80
   sudo lsof -i :443
   ```

2. **Docker 镜像拉取失败**
   ```bash
   # 手动登录 ACR
   docker login --username=your-username registry.cn-hangzhou.aliyuncs.com
   ```

3. **SSL 证书申请失败**
   - 确保域名已正确解析到服务器 IP
   - 检查防火墙是否开放 80 端口
   - 查看 certbot 日志

### 数据库迁移问题（本地终端）
- 本地终端： supabase login
- 本地终端： supabase link --project-ref 项目ID
```bash
# 迁移数据库到线上环境
export SUPABASE_PROJECT_REF="项目ID" && pnpm --filter web supabase:deploy

# 慎用：会清空线上环境数据库所有数据
npx supabase db reset --linked
```
