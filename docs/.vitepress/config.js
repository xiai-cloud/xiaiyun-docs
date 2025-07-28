import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '喜爱云技术文档',
  description: '喜爱云团队技术文档中心',
  lang: 'zh-CN',

  // GitHub Pages 部署配置
  base: process.env.NODE_ENV === 'production' ? '/xiaiyun-docs/' : '/',

  markdown: {
    toc: { level: [1, 2, 3, 4, 5, 6] },
    anchor: { level: [1, 2, 3, 4, 5, 6] }
  },

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '部署运维', link: '/deployment/overview' }
    ],

    sidebar: {
      '/deployment/': [
        {
          text: '喜爱云官网-部署运维',
          items: [
            { text: '喜爱云官网-部署', link: '/deployment/overview' },
            { text: '阿波罗-部署', link: '/deployment/apollo' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-org/xiaicloud' }
    ],

    footer: {
      message: '基于 MIT 许可发布',
      copyright: 'Copyright © 2025 喜爱云团队'
    },

    search: {
      provider: 'local'
    },

    outline: {
      level: 'deep',
      label: '页面导航'
    }
  },

  // 自定义 head 标签，添加认证脚本
  head: [
    [
      'script',
      {},
      `
        // 认证检查脚本
        (function() {
          // 开发环境跳过认证
          if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
            return;
          }
          
          // 检查是否已认证（支持新旧两种认证方式）
          const oldAuth = localStorage.getItem('xiaiyun-docs-auth') === 'verified';
          const secureToken = localStorage.getItem('xiaiyun-docs-secure-token');
          const tokenExpiry = localStorage.getItem('xiaiyun-docs-token-expiry');
          
          // 检查新的安全令牌
          const secureAuth = secureToken && tokenExpiry && Date.now() < parseInt(tokenExpiry);
          
          const isAuthenticated = oldAuth || secureAuth;
          const currentPath = location.pathname;
          
          // 如果未认证且不在登录页面，跳转到安全认证页面
          if (!isAuthenticated && !currentPath.includes('/auth-secure.html') && !currentPath.includes('/auth.html')) {
            const basePath = '/xiaiyun-docs';
            location.href = basePath + '/auth-secure.html';
          }
        })();
      `
    ]
  ]
})