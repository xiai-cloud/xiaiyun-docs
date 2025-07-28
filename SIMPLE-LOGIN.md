# 🔐 简单登录系统

## 📝 系统说明

最简化的账号密码登录系统，只需要一套用户名和密码即可访问文档。

## 🚀 快速开始

### 默认账号

```bash
用户名：xiaiyun
密码：xiaiyun2025
```

### 登录方式

1. 访问网站自动跳转到登录页面
2. 输入用户名和密码
3. 选择是否记住登录状态（7天 或 24小时）
4. 点击登录即可访问文档

## ⚙️ Vercel 环境变量配置

只需要在 Vercel Dashboard 中设置 **3个环境变量**：

### 必需的环境变量

```bash
# 文档访问账号
DOC_USERNAME=xiaiyun

# 文档访问密码  
DOC_PASSWORD=xiaiyun2025

# JWT 签名密钥（至少32位随机字符）
JWT_SECRET=your-super-secret-jwt-key-32-chars-min
```

### 推荐的安全配置

```bash
# 自定义用户名
DOC_USERNAME=your-custom-username

# 强密码
DOC_PASSWORD=Your-Secure-Password-2025!

# 强随机密钥
JWT_SECRET=XiaiYun2025SecureJWTKeyForDocs32Chars
```

## 🔧 配置步骤

### 1. 生成强密码和密钥

```bash
# 生成强密码（16位）
openssl rand -base64 16

# 生成JWT密钥（32位）  
openssl rand -base64 32
```

### 2. 在 Vercel 中设置环境变量

#### 方式一：通过 Vercel CLI

```bash
# 设置用户名
vercel env add DOC_USERNAME
# 输入你的用户名，如：xiaiyun

# 设置密码
vercel env add DOC_PASSWORD
# 输入你的强密码

# 设置JWT密钥
vercel env add JWT_SECRET  
# 输入32位随机密钥
```

#### 方式二：通过 Vercel Dashboard

1. 登录 [vercel.com](https://vercel.com)
2. 选择项目 → **Settings** → **Environment Variables**
3. 点击 **Add** 按钮添加以下3个变量：
   - `DOC_USERNAME` 
   - `DOC_PASSWORD`
   - `JWT_SECRET`
4. 每个变量都选择 **Production**, **Preview**, **Development**

### 3. 重新部署

```bash
# 推送代码触发自动部署
git push origin master

# 或在 Vercel Dashboard 手动重新部署
```

## 🔒 安全特性

- ✅ **服务端验证** - 账号密码存储在环境变量中，前端无法获取
- ✅ **会话管理** - JWT令牌，24小时自动过期
- ✅ **记住登录** - 可选7天长期登录状态
- ✅ **设备指纹** - 防止令牌在不同设备间滥用
- ✅ **防暴力破解** - 登录失败2秒延迟响应
- ✅ **基础防护** - 禁用F12、右键菜单等

## 📱 登录页面特性

- 🎨 **现代化设计** - 渐变背景，卡片式布局
- 📱 **响应式适配** - 支持手机、平板、桌面
- 🔍 **账号提示** - 点击"忘记密码"查看默认账号
- ⌨️ **快捷操作** - 支持回车键快速登录
- 🔒 **安全提醒** - 显示使用建议

## 🛠️ 本地开发

本地开发时无需配置环境变量：

```bash
# 启动开发服务器
npm run docs:dev

# 访问 http://localhost:5173
# 使用默认账号登录：xiaiyun / xiaiyun2025
```

## 🔄 修改账号密码

### 在线修改

1. 在 Vercel Dashboard 中更新环境变量
2. 重新部署应用
3. 通知团队成员新的账号密码

### 代码默认值

如果不设置环境变量，系统会使用代码中的默认值：

```javascript
// api/login.js 中的默认值
const VALID_USERNAME = process.env.DOC_USERNAME || 'xiaiyun';
const VALID_PASSWORD = process.env.DOC_PASSWORD || 'xiaiyun2025';
```

## 📊 使用建议

### 密码强度建议

```bash
# 弱密码（不推荐）
xiaiyun2025

# 中等强度
XiaiYun2025!

# 强密码（推荐）
XY-SecureDoc-2025@#$
```

### 安全维护

- **每季度** - 更换账号密码
- **每月** - 检查Vercel日志，查看登录尝试
- **及时** - 有人员变动时立即更换密码

### 团队分享

安全地将账号密码分享给团队：

```markdown
## 喜爱云文档访问账号

**用户名**：`your-username`
**密码**：`your-password`  
**网址**：https://your-domain.vercel.app

⚠️ 请妥善保管，不要分享给无关人员
⚠️ 建议收到后立即保存到密码管理器
```

## 🚨 故障排查

### 登录失败

1. **检查账号密码** - 确认输入正确
2. **检查环境变量** - 在Vercel中验证配置
3. **清除缓存** - 刷新浏览器或清除localStorage
4. **查看日志** - 在Vercel Functions中查看错误

### 无法访问

1. **检查部署状态** - 确认Vercel部署成功
2. **检查域名** - 确认访问地址正确
3. **检查网络** - 确认网络连接正常

### 忘记密码

1. 查看Vercel环境变量配置
2. 或临时修改代码中的默认密码
3. 重新部署应用

## 📁 文件结构

```
xiaiyun-docs/
├── api/
│   └── login.js              # 登录验证API
├── docs/
│   ├── .vitepress/
│   │   └── config.js         # 认证检查配置
│   └── public/
│       └── login.html        # 登录页面
├── vercel.json               # Vercel部署配置
└── SIMPLE-LOGIN.md          # 本说明文档
```

## 🎯 总结

现在系统非常简单：

- **1套账号密码** - 所有人使用相同账号
- **3个环境变量** - 只需配置用户名、密码、JWT密钥
- **1个API接口** - `/api/login` 处理登录
- **1个登录页面** - 现代化登录界面

既简单易用，又保持了必要的安全性！

---

**需要帮助？** 请联系开发团队获取技术支持。