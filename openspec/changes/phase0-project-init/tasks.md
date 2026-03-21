## 1. 项目脚手架初始化

- [x] 1.1 使用 `npm create vite@latest` 创建 React + TypeScript 项目（在当前目录下）
- [x] 1.2 安装核心依赖：`react-router-dom`、`tailwindcss`、`@tailwindcss/vite`、`framer-motion`、`zustand`
- [x] 1.3 安装开发依赖：`@types/node`（支持路径别名）
- [x] 1.4 配置 `vite.config.ts` 路径别名（`@` → `src/`）
- [x] 1.5 配置 `tsconfig.json` / `tsconfig.app.json` 路径别名映射

## 2. 目录结构创建

- [x] 2.1 创建 `src/components/ui/` 目录（基础 UI 组件）
- [x] 2.2 创建 `src/components/layout/` 目录（布局组件）
- [x] 2.3 创建 `src/components/common/` 目录（共享组件）
- [x] 2.4 创建 `src/pages/` 目录（页面组件）
- [x] 2.5 创建 `src/hooks/` 目录（自定义 Hooks）
- [x] 2.6 创建 `src/stores/` 目录（Zustand stores）
- [x] 2.7 创建 `src/types/` 目录（TypeScript 类型）
- [x] 2.8 创建 `src/utils/` 目录（工具函数）
- [x] 2.9 创建 `src/data/` 目录（Mock 数据）
- [x] 2.10 创建 `src/router/` 目录（路由配置）
- [x] 2.11 创建 `src/styles/` 目录（全局样式）
- [x] 2.12 创建 `src/assets/` 目录（静态资源）

## 3. 全局样式系统

- [x] 3.1 配置 Tailwind CSS v4：在 `src/styles/index.css` 中引入 `@import "tailwindcss"` 和 `@plugin "@tailwindcss/vite"`
- [x] 3.2 配置 `@theme` 自定义薄荷绿色系（mint-50 ~ mint-900）
- [x] 3.3 实现全局渐变背景样式（`linear-gradient(135deg, #fefce8 0%, #d1fae5 50%, #a7f3d0 100%)`），固定定位覆盖视口
- [x] 3.4 创建 `glass-card` 工具类（backdrop-blur-xl, bg-white/60, rounded-2xl, border-white/20, shadow-lg）
- [x] 3.5 在 `main.tsx` 中引入全局样式文件

## 4. 路由配置

- [x] 4.1 创建 `src/router/index.tsx`，使用 `createBrowserRouter` 配置路由
- [x] 4.2 创建占位页面组件：`src/pages/Home/index.tsx`
- [x] 4.3 创建占位页面组件：`src/pages/Essays/index.tsx`
- [x] 4.4 创建占位页面组件：`src/pages/EssayDetail/index.tsx`
- [x] 4.5 创建占位页面组件：`src/pages/Projects/index.tsx`
- [x] 4.6 创建占位页面组件：`src/pages/Pictures/index.tsx`
- [x] 4.7 创建占位页面组件：`src/pages/About/index.tsx`
- [x] 4.8 创建占位页面组件：`src/pages/Blogroll/index.tsx`
- [x] 4.9 创建 404 页面组件：`src/pages/NotFound/index.tsx`
- [x] 4.10 在 `App.tsx` 中接入 `RouterProvider`

## 5. Layout 壳组件

- [x] 5.1 创建 `src/components/layout/Layout.tsx`，包含导航栏区域 + `<Outlet />` 内容区域
- [x] 5.2 创建 `src/components/layout/Navbar.tsx`，实现左上角毛玻璃导航栏占位（头像 + 图标按钮），支持路由跳转
- [x] 5.3 在路由配置中将 Layout 作为根布局组件

## 6. TypeScript 类型定义

- [x] 6.1 创建 `src/types/essay.ts`：定义 Essay 接口（id, title, date, content, tags, summary, coverImage?, isRead）
- [x] 6.2 创建 `src/types/project.ts`：定义 Project 接口（id, name, year, description, tags, icon, websiteUrl）
- [x] 6.3 创建 `src/types/picture.ts`：定义 Picture 接口（id, src, title, date, description）
- [x] 6.4 创建 `src/types/bloglink.ts`：定义 BlogLink 接口（id, name, url, avatar, description）
- [x] 6.5 创建 `src/types/index.ts`：统一导出所有类型

## 7. Mock 数据

- [x] 7.1 创建 `src/data/essays.ts`：至少 3 篇示例文章数据
- [x] 7.2 创建 `src/data/projects.ts`：至少 4 个示例项目数据（参考 reference 中的 Algo-Atlas, X-Plore, nano-Json-RPC, boost-searcher 等）
- [x] 7.3 创建 `src/data/pictures.ts`：至少 5 条示例图片数据
- [x] 7.4 创建 `src/data/bloglinks.ts`：至少 3 条示例友链数据
- [x] 7.5 创建 `src/data/index.ts`：统一导出所有 Mock 数据

## 8. 基础 UI 组件

- [x] 8.1 创建 `src/components/ui/GlassCard.tsx`：可复用毛玻璃卡片组件，支持 className 扩展

## 9. 验证与清理

- [x] 9.1 运行 `npm run dev` 确认开发服务器启动正常
- [ ] 9.2 验证所有路由页面可正常访问
- [ ] 9.3 验证全局渐变背景和毛玻璃效果正确显示
- [ ] 9.4 运行 `npm run build` 确认生产构建无错误
- [x] 9.5 清理 Vite 默认生成的多余文件（App.css, assets/react.svg 等）
