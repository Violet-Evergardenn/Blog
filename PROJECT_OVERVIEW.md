# Ivy-Neko 博客项目概述

## 🎨 项目简介

**Ivy-Neko** 是一个个人博客网站项目，采用现代化的前端技术栈构建。项目最初设计为"薄荷绿渐变 + 毛玻璃卡片 + 可爱动漫风"，但在实际开发中演变为**"Kinetic Orange (活力橙)"** 风格 —— 一种大胆、高对比度的粗野主义（Brutalism）设计美学。

---

## 🏗️ 技术栈

| 类别 | 技术 |
|------|------|
| **框架** | React 19 + TypeScript |
| **构建工具** | Vite 6 |
| **样式** | Tailwind CSS v4 (CSS-first 配置) |
| **路由** | React Router DOM v7 |
| **状态管理** | Zustand |
| **动画** | Framer Motion + GSAP |
| **Markdown** | react-markdown + remark-gfm |
| **代码高亮** | react-syntax-highlighter |

---

## 📁 项目结构

```
d:\learn\Blog\
├── openspec/                    # OpenSpec 规范驱动开发配置
│   ├── changes/                 # 变更记录
│   │   └── phase0-project-init/ # 项目初始化阶段
│   │       ├── design.md        # 设计决策文档
│   │       ├── proposal.md      # 提案文档
│   │       ├── tasks.md         # 任务清单
│   │       └── specs/           # 各模块规范
│   └── config.yaml              # OpenSpec 配置
│
├── public/                      # 静态资源
│   ├── blog-img/               # 博客文章配图
│   ├── home-img/               # 首页图片资源
│   ├── posts/                  # Markdown 博客文章
│   ├── background.png          # 全局背景图
│   └── favicon.svg             # 站点图标
│
├── reference/                   # 设计参考图
│
├── src/
│   ├── components/             # 组件
│   │   ├── common/            # 通用组件
│   │   ├── layout/            # 布局组件
│   │   │   ├── Layout.tsx     # 页面布局壳
│   │   │   └── Navbar.tsx     # 导航栏
│   │   └── ui/                # UI 组件
│   │       ├── BrutalistCard.tsx   # 粗野主义卡片
│   │       ├── EssayCard.tsx       # 文章卡片
│   │       ├── ListCard.tsx        # 列表卡片
│   │       └── PhotoCard.tsx       # 照片卡片
│   │
│   ├── data/                   # 数据层
│   │   ├── bloglinks.ts       # 友链数据
│   │   ├── essays.ts          # 文章数据 (Mock)
│   │   ├── pictures.ts        # 图片数据
│   │   ├── projects.ts        # 项目数据
│   │   └── index.ts           # 数据导出
│   │
│   ├── hooks/                  # 自定义 Hooks
│   │   └── useImagePreloader.ts
│   │
│   ├── pages/                  # 页面组件
│   │   ├── Home/              # 首页
│   │   ├── Essays/            # 文章列表
│   │   ├── EssayDetail/       # 文章详情
│   │   ├── Projects/          # 项目展示
│   │   ├── Pictures/          # 图片墙
│   │   ├── About/             # 关于页面
│   │   ├── Blogroll/          # 友链页面
│   │   └── NotFound/          # 404 页面
│   │
│   ├── router/                 # 路由配置
│   │   └── index.tsx          # React Router 配置
│   │
│   ├── stores/                 # Zustand 状态管理
│   │
│   ├── styles/                 # 全局样式
│   │   └── index.css          # Tailwind + 自定义样式
│   │
│   ├── types/                  # TypeScript 类型定义
│   │   ├── essay.ts           # 文章类型
│   │   ├── project.ts         # 项目类型
│   │   ├── picture.ts         # 图片类型
│   │   ├── bloglink.ts        # 友链类型
│   │   └── index.ts           # 类型导出
│   │
│   ├── utils/                  # 工具函数
│   │
│   ├── App.tsx                 # 应用入口
│   └── main.tsx                # 渲染入口
│
├── package.json
├── vite.config.ts             # Vite 配置 (含自定义博客索引插件)
├── tsconfig.json              # TypeScript 配置
├── tailwindcss 配置           # 内联在 index.css 中 (v4 方式)
└── eslint.config.js           # ESLint 配置
```

---

## 🎨 设计风格：Kinetic Orange (活力橙)

### 核心特征

| 元素 | 设计 |
|------|------|
| **主色调** | 活力橙 `#FF4D00` (brand) |
| **背景色** | 纯黑 `#000000` |
| **文字色** | 纯白 `#FFFFFF` |
| **边框** | 2px 实线，高对比度 |
| **圆角** | 极少使用，仅 Pill 形状允许圆角 |
| **阴影** | 硬阴影 (Hard Shadow) `8px 8px 0 #000` |

### 字体系统

| 用途 | 字体 |
|------|------|
| **Display** | Archivo Black (大标题) |
| **Body** | Inter (正文) |
| **Mono** | Space Mono (代码、标签) |

### 设计原则

1. **粗野主义 (Brutalism)** - 大胆、直接、无修饰
2. **高对比度** - 黑底白字 + 橙色强调
3. **硬边设计** - 直角边框，拒绝圆角（除 Pill 外）
4. **动态交互** - 悬停时的位移和阴影变化
5. **功能优先** - 每个元素都有明确目的

---

## 🛣️ 路由结构

```
/                    → 首页 (Home)
/essays              → 文章列表 (Essays)
/essays/:id          → 文章详情 (EssayDetail)
/projects            → 项目展示 (Projects)
/pictures            → 图片墙 (Pictures)
/about               → 关于 (About)
/blogroll            → 友链 (Blogroll)
*                    → 404 (NotFound)
```

---

## 📝 内容管理

### Markdown 文章系统

项目使用 **Vite 虚拟模块** 实现 Markdown 文章管理：

- 文章存放于 `public/posts/*.md`
- 使用 `front-matter` 解析 YAML 前置元数据
- 自定义 Vite 插件 `generateBlogIndex` 自动生成文章索引
- 支持热更新 (HMR)

### 文章数据结构

```typescript
interface Essay {
  id: string
  title: string
  date: string
  content: string
  tags: string[]
  summary: string
  coverImage?: string
  isRead: boolean
}
```

---

## 🧩 核心组件

### BrutalistCard (粗野主义卡片)

项目的核心 UI 组件，体现设计系统：

```tsx
// 三种变体
variant: 'default'  // 透明背景 + 白边框
       | 'dark'     // 黑背景 + 黑边框
       | 'brand'    // 橙色背景 + 橙边框
```

### 首页 Bento 布局

首页采用 **瀑布流式 Bento Grid** 设计：

- 三列不规则布局
- 每个卡片都有独特的悬停交互
- Live2D 展示区、项目入口、图库、关于我、音乐播放器、友链
- 底部旋转文字指示器

---

## ⚙️ 构建配置

### Vite 自定义插件

```typescript
// 自动生成博客文章索引
virtual:blog-posts

// 功能：
// 1. 扫描 public/posts/*.md
// 2. 解析 front-matter 元数据
// 3. 按日期降序排序
// 4. 导出为 JS 模块
// 5. 支持文件监听热更新
```

### Tailwind CSS v4 配置

使用新的 **CSS-first** 配置方式：

```css
@theme {
  --color-brand: #FF4D00;
  --font-display: 'Archivo Black', sans-serif;
  /* ... */
}

@utility brutalist-card {
  border: 2px solid #000000;
  background: #000000;
}
```

---

## 🚀 开发规范

### 代码组织原则

1. **按功能分组** - 页面、组件、数据、类型分离
2. **类型优先** - 所有数据都有 TypeScript 接口定义
3. **Mock 数据** - 开发阶段使用 Mock 数据，API 就绪后可无缝切换
4. **路径别名** - 使用 `@/` 指向 `src/` 目录

### 命名规范

- 组件：PascalCase (`EssayCard.tsx`)
- 工具/Hook：camelCase (`useImagePreloader.ts`)
- 类型：PascalCase (`Essay`, `Project`)
- 常量：UPPER_SNAKE_CASE (Tabs, NavLinks)

---

## 📦 依赖亮点

| 包 | 用途 |
|---|------|
| `framer-motion` | 流畅的 React 动画 |
| `gsap` | 复杂时间轴动画 |
| `react-markdown` | Markdown 渲染 |
| `remark-gfm` | GitHub 风格 Markdown 扩展 |
| `zustand` | 轻量级状态管理 |
| `front-matter` | Markdown 元数据解析 |

---

## 🎯 项目特色

1. **OpenSpec 驱动开发** - 使用规范驱动开发流程管理项目
2. **自定义 Vite 插件** - 实现 Markdown 内容管理系统
3. **粗野主义美学** - 独特的视觉设计风格
4. **性能优化** - 图片预加载、代码分割准备
5. **TypeScript 全栈** - 类型安全的开发体验

---

## 🔮 未来规划

根据 OpenSpec 变更记录，项目规划了多个开发阶段：

- ✅ Phase 0: 项目初始化 (已完成)
- 🔄 Phase 1+: 各功能模块逐步实现
- 📋 Phase 8: Live2D 集成 (计划中)

---

*项目基于 React + Vite + TypeScript 构建，采用 Kinetic Orange 粗野主义设计风格。*
