## Context

这是一个全新的个人博客项目（ivy-neko），参考站点 lvyovo-wiki.tech。设计风格为薄荷绿渐变背景 + 毛玻璃（Glassmorphism）卡片 + 可爱动漫风。当前需要搭建项目基础架构，包括脚手架、样式系统、路由和数据层，为后续 8 个开发阶段提供基础。

技术栈：React 18 + TypeScript + Vite + Tailwind CSS + React Router DOM + Zustand + Framer Motion + pixi-live2d-display。开发阶段使用 Mock 数据，后续接 Node.js 后端 API。部署目标为自有云服务器。

## Goals / Non-Goals

**Goals:**
- 搭建可运行的 Vite + React + TS 脚手架
- 建立清晰的项目目录结构，支撑后续所有页面开发
- 配置 Tailwind CSS 自定义主题（薄荷绿色系、毛玻璃效果）
- 实现全局渐变背景效果
- 配置路由系统，所有页面路由就绪（含占位页面）
- 创建 Layout 壳组件骨架
- 定义 Mock 数据的 TypeScript 类型和示例数据

**Non-Goals:**
- 不实现具体页面内容（首页组件、文章系统等属于后续 Phase）
- 不集成 Live2D（仅预留位置，Phase 8 实现）
- 不搭建后端 API
- 不处理响应式适配的完整方案（后续 Phase 处理）
- 不实现暗色模式

## Decisions

### 1. 构建工具：Vite
- **选择**: Vite 6
- **理由**: 极快的冷启动和 HMR，对 React + TS 原生支持好，社区活跃
- **替代方案**: Next.js（SSR 过重，博客不需要）、Create React App（已不推荐）

### 2. CSS 方案：Tailwind CSS 4
- **选择**: Tailwind CSS v4（使用新的 CSS-first 配置方式）
- **理由**: 原子化 CSS 开发效率高，自定义主题灵活，v4 性能更好
- **自定义主题**: 通过 `@theme` 定义薄荷绿色系（mint-50 ~ mint-900）和毛玻璃工具类
- **替代方案**: CSS Modules（组件隔离好但自定义主题不够灵活）、Styled Components（CSS-in-JS 运行时开销）

### 3. 路由：React Router DOM v7
- **选择**: React Router DOM v7 (data router)
- **理由**: React 生态最成熟的路由库，v7 的 data router 模式支持数据预加载
- **路由结构**:
  - `/` → 首页
  - `/essays` → 文章列表
  - `/essays/:id` → 文章详情
  - `/projects` → 项目展示
  - `/pictures` → 图片墙
  - `/about` → 关于
  - `/blogroll` → 优秀博客/友链

### 4. 状态管理：Zustand
- **选择**: Zustand
- **理由**: 轻量、API 简洁、无 Provider 包裹，适合中小型项目
- **替代方案**: Redux Toolkit（过重）、Jotai（原子化方式不太适合博客场景）

### 5. 目录结构
```
src/
├── assets/           # 静态资源
├── components/       # 组件
│   ├── ui/           # 基础 UI 组件（GlassCard 等）
│   ├── layout/       # 布局组件
│   └── common/       # 共享组件
├── pages/            # 页面组件
├── hooks/            # 自定义 Hooks
├── stores/           # Zustand stores
├── types/            # TS 类型定义
├── utils/            # 工具函数
├── data/             # Mock 数据
├── router/           # 路由配置
├── styles/           # 全局样式
├── App.tsx
└── main.tsx
```

### 6. 全局样式架构
- **背景**: 使用 CSS 固定渐变背景 `linear-gradient(135deg, #fefce8 0%, #d1fae5 50%, #a7f3d0 100%)`
- **毛玻璃卡片**: Tailwind 自定义工具类 `glass-card` = `backdrop-blur-xl bg-white/60 rounded-2xl border border-white/20 shadow-lg`
- **字体**: 系统字体栈 + 可选自定义中文字体

## Risks / Trade-offs

- **[Tailwind CSS v4 兼容性]** → v4 较新，部分社区插件可能不兼容。**缓解**: 如遇问题回退到 v3
- **[Mock 数据维护成本]** → Mock 数据和实际 API 结构可能不一致。**缓解**: 类型定义尽量贴近未来 API 结构，使用统一的 service 层抽象
- **[pixi-live2d-display 体积]** → Live2D 库较大，影响首屏加载。**缓解**: 延迟加载 + 代码分割，Phase 8 实现时处理