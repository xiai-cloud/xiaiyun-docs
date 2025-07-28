# 喜爱云技术文档

喜爱云团队的内部技术文档中心，包含项目部署、开发指南等内容。

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run docs:dev

# 构建文档
npm run docs:build

# 预览构建结果
npm run docs:preview
```

### 部署说明

本项目使用 GitHub Actions 自动部署到 GitHub Pages，支持以下特性：

- ✅ 自动构建和部署
- ✅ 访问控制（开发人员专用）
- ✅ 响应式设计
- ✅ 全文搜索
- ✅ 深度目录导航

## 🔐 访问控制

为保护内部文档，本站点启用了访问控制机制：

### 访问方式

1. 访问部署后的网站
2. 输入有效的访问码
3. 验证成功后即可正常浏览文档

### 当前访问码

**⚠️ 仅供开发团队使用，请勿外泄**

- `xiaiyun2024` - 主访问码
- `dev-team-access` - 开发团队访问码  
- `docs-viewer-2024` - 文档查看者访问码

### 本地开发

本地开发环境 (`localhost`) 自动跳过认证检查，无需输入访问码。

## 📁 项目结构

```
xiaiyun-docs/
├── docs/
│   ├── .vitepress/
│   │   ├── config.js          # VitePress 配置
│   │   └── theme/             # 自定义主题
│   ├── public/
│   │   └── auth.html          # 认证页面
│   ├── deployment/            # 部署文档
│   └── index.md              # 首页
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Actions 部署配置
└── README.md
```

## 🛠️ 部署配置

### GitHub Pages 设置

1. 在 GitHub 仓库中启用 Pages 功能
2. 设置 Source 为 "GitHub Actions"
3. 推送代码到 `main` 或 `master` 分支自动触发部署

### 访问码管理

如需修改访问码，请编辑 `docs/public/auth.html` 文件中的 `ACCESS_CODES` 数组：

```javascript
const ACCESS_CODES = [
    'your-new-access-code',
    'another-access-code'
];
```

### 安全建议

1. **定期更换访问码** - 建议每季度更换一次访问码
2. **访问记录监控** - 关注 GitHub Pages 的访问统计
3. **团队成员管理** - 及时更新离职成员的访问权限
4. **代码审查** - 所有文档更改都需要经过代码审查

## 📝 文档编写

### 新增文档

1. 在对应目录下创建 `.md` 文件
2. 更新 `docs/.vitepress/config.js` 中的侧边栏配置
3. 提交并推送到远程仓库

### 文档格式

- 使用 Markdown 格式编写
- 支持 VitePress 扩展语法
- 图片资源放在 `docs/public/images/` 目录

### 示例

```markdown
# 标题

## 子标题

::: tip 提示
这是一个提示框
:::

::: warning 警告
这是一个警告框
:::

::: danger 危险
这是一个危险提示框
:::
```

## 🔧 技术栈

- **文档框架**: VitePress 1.6.3
- **构建工具**: Vite
- **部署平台**: GitHub Pages
- **CI/CD**: GitHub Actions
- **认证方案**: 前端 JavaScript 验证

## 📞 联系我们

- **开发团队**: 喜爱云技术团队
- **问题反馈**: 请在 GitHub Issues 中提交
- **访问码申请**: 联系项目管理员

---

**⚠️ 重要提醒**: 
- 本文档包含敏感的部署和配置信息
- 请勿将访问码分享给非授权人员
- 发现安全问题请立即联系开发团队# Force redeploy 2025年 7月28日 星期一 18时49分35秒 CST
