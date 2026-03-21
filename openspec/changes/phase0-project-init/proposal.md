## Why

搭建 ivy-neko 个人博客项目的基础架构。项目采用 **Kinetic Orange** 数字粗野主义风格（黑橙白高对比 + 硬边框 + 重排版），对标 X-plore (lvyovo-wiki.tech) 的功能覆盖，但在视觉表达上彻底差异化。需要建立完整的前端脚手架、Design Tokens、路由配置和数据层，为后续所有页面开发提供坚实基础。

## What Changes

- 使用 Vite 初始化 React + TypeScript 项目
- 安装并配置核心依赖：`react-router-dom`、`tailwindcss`、`@tailwindcss/vite`、`framer-motion`、`zustand`
- 建立标准化项目目录结构（`components/`、`pages/`、`hooks/`、`stores/`、`types/`、`utils/`、`data/`、`router/`、`styles/`）
- 配置 Kinetic Orange Design Tokens（`#FF4D00` 橙 / `#000` 黑 / `#FFF` 白、Archivo Black / Space Mono / Inter 字体栈）
- 实现全局黑底基色 + 硬边框 + 粗野主义排版系统
- 配置 React Router 路由系统（首页、文章列表、文章详情、项目、图片墙、关于、友链）
- 创建基础 Layout 组件（Floating Pill Navigation 胶囊导航 + 内容区域）
- 配置 Mock 数据结构（文章、项目、图片等 TypeScript 类型定义 + 示例数据）

## Capabilities

### New Capabilities
- `project-scaffold`: Vite + React + TS 脚手架初始化与依赖管理
- `global-styles`: Kinetic Orange Design Tokens —— 黑橙白色系、Archivo Black/Space Mono/Inter 字体、硬边框系统、跑马灯/旋转动效、文字选中高亮
- `routing`: React Router 路由配置与页面占位符
- `layout-shell`: Floating Pill Navigation 胶囊导航 + Layout 壳组件
- `mock-data`: Mock 数据层 —— TypeScript 类型定义与示例数据

### Modified Capabilities
<!-- 无已有能力需要修改，这是全新项目 -->

## Impact

- **代码**: 从零创建整个前端项目结构
- **依赖**: React 19, TypeScript, Vite 6, Tailwind CSS 4, React Router DOM, Framer Motion, Zustand
- **字体**: Google Fonts 引入 Archivo Black, Space Mono, Inter
- **构建**: Vite 开发服务器 + 生产构建配置
- **后续影响**: 所有后续 Phase 的页面开发都将基于此 Kinetic Orange 基础架构