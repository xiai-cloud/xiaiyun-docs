# 🔐 账号密码登录系统

## 📝 系统说明

我们已经将复杂的双重认证系统简化为传统的账号密码登录方式，更加直观易用。

## 🚀 快速开始

### 访问方式

1. 访问部署后的网站
2. 输入用户名和密码
3. 选择是否记住登录状态（7天 vs 24小时）
4. 点击登录即可访问文档

## 👥 默认账号

### 生产环境账号（需要在 Vercel 中配置）

| 角色 | 用户名 | 密码 | 权限 |
|------|--------|------|------|
| 🔑 管理员 | `admin` | `xiaiyun2025` | 完全访问 |
| 👨‍💻 开发者 | `developer` | `dev123456` | 开发文档 |
| 👀 查看者 | `viewer` | `view123456` | 只读访问 |

### 本地开发测试账号

| 用户名 | 密码 | 角色 |
|--------|------|------|
| `admin` | `xiaiyun2025` | 管理员 |
| `developer` | `dev123456` | 开发者 |
| `viewer` | `view123456` | 查看者 |
| `test` | `test123` | 测试用户 |

## ⚙️ Vercel 环境变量配置

在 Vercel Dashboard 中设置以下环境变量：

### 必需的环境变量

```bash
# 管理员账号
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-admin-password-here

# 开发者账号  
DEV_USERNAME=developer
DEV_PASSWORD=your-dev-password-here

# 查看者账号
VIEWER_USERNAME=viewer  
VIEWER_PASSWORD=your-viewer-password-here

# JWT 签名密钥（至少32位）
JWT_SECRET=your-super-secret-jwt-key-32-chars-min
```

### 推荐的安全配置

```bash
# 管理员账号 - 高权限
ADMIN_USERNAME=xiaiyun_admin
ADMIN_PASSWORD=XY2025@Admin#Secure!

# 开发者账号 - 开发权限
DEV_USERNAME=xiaiyun_dev
DEV_PASSWORD=XY2025@Dev#Code!

# 查看者账号 - 只读权限  
VIEWER_USERNAME=xiaiyun_viewer
VIEWER_PASSWORD=XY2025@View#Read!

# JWT密钥 - 强随机密钥
JWT_SECRET=XiaiYun2025SecureJWTKeyForDocumentationSystem32Chars
```

## 🔧 配置步骤

### 1. 生成强密码

```bash
# 使用在线工具生成强密码
# https://passwordsgenerator.net/

# 或使用命令行工具
openssl rand -base64 16  # 生成16位随机密码
```

### 2. 在 Vercel 中设置环境变量

#### 方式一：通过 Vercel CLI

```bash
# 设置管理员账号
vercel env add ADMIN_USERNAME
# 输入: xiaiyun_admin

vercel env add ADMIN_PASSWORD  
# 输入: 你的强密码

# 设置开发者账号
vercel env add DEV_USERNAME
# 输入: xiaiyun_dev

vercel env add DEV_PASSWORD
# 输入: 你的强密码

# 设置查看者账号
vercel env add VIEWER_USERNAME
# 输入: xiaiyun_viewer

vercel env add VIEWER_PASSWORD
# 输入: 你的强密码

# 设置JWT密钥
vercel env add JWT_SECRET
# 输入: 32位以上的随机字符串
```

#### 方式二：通过 Vercel Dashboard

1. 登录 [vercel.com](https://vercel.com)
2. 选择项目 → **Settings** → **Environment Variables**
3. 点击 **Add** 按钮，逐个添加上述环境变量
4. 每个变量都选择 **Production**, **Preview**, **Development** 三个环境

### 3. 重新部署

设置完环境变量后，触发重新部署：

```bash
# 推送代码触发部署
git push origin master

# 或在 Vercel Dashboard 中手动重新部署
```

## 🔒 安全特性

### 登录安全

- ✅ **密码保护** - 账号密码存储在服务端环境变量
- ✅ **会话管理** - JWT令牌，24小时自动过期
- ✅ **记住登录** - 可选7天长期登录
- ✅ **设备指纹** - 防止令牌在不同设备间滥用
- ✅ **防暴力破解** - 登录失败延迟响应
- ✅ **基础防护** - 禁用开发者工具等

### 权限管理

- **管理员** - 完全访问权限，可查看所有文档
- **开发者** - 开发文档访问权限
- **查看者** - 只读访问权限

## 📱 用户体验

### 登录流程

1. **访问网站** → 自动跳转到登录页面
2. **输入账号** → 用户名和密码
3. **选择记住** → 可选择记住7天或24小时
4. **登录成功** → 跳转到文档首页

### 登录页面特性

- 🎨 **现代化UI** - 渐变背景，卡片式设计
- 📱 **响应式** - 支持手机、平板、桌面设备
- 🔍 **账号提示** - 点击"忘记密码"显示测试账号
- ⌨️ **快捷操作** - 支持回车键快速登录
- 🔒 **安全提醒** - 显示安全使用建议

## 🛠️ 本地开发

本地开发时：

- **跳过网络认证** - 使用模拟API响应
- **测试账号** - 内置多个测试账号
- **即时反馈** - 无需部署即可测试登录流程

启动方式：

```bash
npm run docs:dev
# 访问 http://localhost:5173
# 使用任意测试账号登录
```

## 🔄 账号管理

### 修改密码

在 Vercel 环境变量中更新对应的密码：

```bash
# 例如修改管理员密码
ADMIN_PASSWORD=new-secure-password-2025
```

### 添加新用户

在 `api/login.js` 中添加新的用户配置：

```javascript
const VALID_USERS = [
  // 现有用户...
  {
    username: process.env.NEW_USERNAME || 'newuser',
    password: process.env.NEW_PASSWORD || 'newpassword',
    role: 'viewer'
  }
];
```

同时在 Vercel 中添加对应的环境变量。

### 删除用户

从环境变量和代码中移除对应的用户配置。

## 📊 监控建议

### 访问统计

- 关注 Vercel Analytics，监控访问量
- 查看 Functions 日志，检查登录尝试
- 定期检查是否有异常访问

### 安全审计

- **每月** - 检查登录日志，查看异常尝试
- **每季度** - 更换所有账号密码
- **每年** - 全面安全审计和系统更新

## 🚨 应急处理

### 忘记密码

1. 查看 Vercel 环境变量中的密码配置
2. 或临时修改环境变量为已知密码
3. 登录后及时修改回安全密码

### 账号被锁

1. 检查 Vercel Functions 日志
2. 确认是否有恶意登录尝试
3. 必要时更换所有账号密码

### 紧急访问

如遇系统故障，可临时注释掉认证检查：

```javascript
// 在 docs/.vitepress/config.js 中临时注释认证代码
// if (!isAuthenticated && !currentPath.includes('/login.html')) {
//   location.href = basePath + '/login.html';
// }
```

---

## 📞 技术支持

如需帮助，请联系：

- **开发团队** - 技术实现问题
- **系统管理员** - 账号权限问题  
- **安全团队** - 安全相关问题

**记住**：定期更换密码，保护文档安全！