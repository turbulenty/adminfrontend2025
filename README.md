# 全栈管理系统 - 前端

基于 React + TypeScript + Vite 构建的现代化管理系统前端应用,支持多语言切换。

## 技术栈

- **React 19** - 用户界面框架
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 快速的前端构建工具
- **MUI (Material-UI)** - React UI 组件库
- **React Router** - 前端路由管理
- **Axios** - HTTP 请求库
- **Recharts** - 图表可视化
- **react-i18next** - 国际化多语言支持

## 主要功能

### 1. 仪表盘 (Dashboard)
- 用户数据统计卡片(总用户数、活跃用户、今日新增等)
- 用户增长趋势折线图
- 用户角色分布饼图
- 概览

### 2. 用户管理
- 用户列表展示(分页、搜索)
- 添加/编辑/删除用户
- 用户角色管理(Admin、Manager、User)
- 用户状态管理(Active、Inactive)

### 3. 系统设置
- 系统名称配置
- API 端点配置
- 刷新间隔设置
- 功能开关(通知、自动刷新)
- 系统设置的保存和读取

### 4. 多语言支持
- 中文简体
- 日本語
- English

### 5. 其它功能
- 左侧导航栏和顶部栏布局
- 用户登录/注册
- 个人资料管理
- 账户设置管理
- 系统通知（可开/关、一键已读）

## 项目结构

```
admin-frontend-2025/
├── public/              # 静态资源
├── src/
│   ├── assets/         # 图片等资源文件
│   ├── components/     # 可复用组件
│   │   └── StatCard.tsx
│   ├── layouts/        # 布局组件
│   │   └── DashboardLayout.tsx
│   ├── locales/        # 多语言翻译文件
│   │   ├── zh/
│   │   ├── ja/
│   │   └── en/
│   ├── pages/          # 页面组件
│   │   ├── Dashboard.tsx
│   │   ├── UsersPage.tsx
│   │   ├── SettingsPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── services/       # API 服务
│   │   └── api.ts
│   ├── hooks/          # 自定义 Hooks
│   ├── i18n.ts         # 国际化配置
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

## 安装与运行

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境

修改 `src/services/api.ts` 中的 API 基础地址,或在设置页面配置:

```typescript
const API_BASE_URL = 'http://localhost:8080';
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173`

### 4. 构建生产版本

```bash
npm run build
```

构建产物在 `dist/` 目录

### 5. 预览生产构建

```bash
npm run preview
```

## 主要依赖

```json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.11.0",
    "@mui/material": "^7.3.6",
    "@mui/icons-material": "^7.3.6",
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "axios": "^1.13.2",
    "recharts": "^3.6.0",
    "i18next": "^23.x",
    "react-i18next": "^14.x"
  }
}
```

## 开发规范

- 使用 TypeScript 严格模式
- 组件使用函数式组件 + Hooks
- 使用 ESLint 进行代码检查
- 遵循 React 最佳实践

## API 对接

前端通过 Axios 调用后端 RESTful API:

- 基础地址: `http://localhost:8080`
- 认证方式: 基于 Session
- 请求格式: JSON
- 响应格式: JSON

### 主要 API 端点:

### 认证相关
- `POST /api/auth/login` - 登录
- `POST /api/auth/register` - 注册
- `PUT /api/auth/change-password` - 修改密码

### 用户管理
- `GET /api/users` - 获取用户列表(支持分页和搜索)
- `GET /api/users/current` - 获取当前登录用户信息
- `POST /api/users` - 创建用户
- `PUT /api/users/{id}` - 更新用户
- `DELETE /api/users/{id}` - 删除用户

### 仪表盘数据
- `GET /api/dashboard/stats` - 获取统计数据
- `GET /api/dashboard/role-distribution` - 获取角色分布
- `GET /api/dashboard/user-growth` - 获取用户增长趋势

### 通知管理
- `GET /api/notifications` - 获取通知列表
- `GET /api/notifications/unread-count` - 获取未读通知数量
- `PUT /api/notifications/mark-all-read` - 标记全部已读

### 系统设置
- `GET /api/settings` - 获取系统设置
- `PUT /api/settings` - 更新系统设置


## 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 许可证

MIT License

## 作者

开发者: CHEN YANYE
