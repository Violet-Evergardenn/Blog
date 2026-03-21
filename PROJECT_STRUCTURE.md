# Ivy Neko Blog - 项目结构文档

> 项目技术栈：React 19 + TypeScript + Vite + Tailwind CSS 4 + React Router 7
> 设计风格：Kinetic Orange（动能橙）- 高对比度、粗野主义美学

---

## 📁 目录结构总览

```
d:\BLOG\blogNow
├── openspec/              # 项目规格文档和设计提案
├── public/                # 静态资源
├── reference/             # 设计参考图片
├── src/                   # 源代码
│   ├── assets/            # 项目资源（图片、字体等）
│   ├── components/        # React组件
│   ├── data/              # 模拟数据
│   ├── hooks/             # 自定义React Hooks
│   ├── pages/             # 页面组件
│   ├── router/            # 路由配置
│   ├── stores/            # 状态管理（Zustand）
│   ├── styles/            # 全局样式
│   ├── types/             # TypeScript类型定义
│   └── utils/             # 工具函数
├── 配置文件...
└── package.json
```

---

## 📂 详细目录说明

### 1. `/openspec/` - 项目规格文档
**用途**：存放项目的设计提案、规格说明和任务追踪

| 文件/目录 | 说明 |
|---------|------|
| `config.yaml` | OpenSpec配置文件 |
| `specs/` | 规格文档目录 |
| `changes/` | 变更历史记录 |
| `changes/phase0-project-init/` | 项目初始化阶段文档 |
| `changes/phase0-project-init/design.md` | 设计文档 |
| `changes/phase0-project-init/proposal.md` | 项目提案 |
| `changes/phase0-project-init/tasks.md` | 任务列表 |
| `changes/phase0-project-init/specs/` | 各模块规格说明 |
| `changes/phase0-project-init/specs/global-styles/spec.md` | 全局样式规格 |
| `changes/phase0-project-init/specs/layout-shell/spec.md` | 布局外壳规格 |
| `changes/phase0-project-init/specs/mock-data/spec.md` | 模拟数据规格 |
| `changes/phase0-project-init/specs/project-scaffold/spec.md` | 项目脚手架规格 |
| `changes/phase0-project-init/specs/routing/spec.md` | 路由规格 |

---

### 2. `/public/` - 静态资源
**用途**：存放不需要经过构建的静态文件

| 文件 | 说明 |
|-----|------|
| `favicon.svg` | 网站图标 |
| `icons.svg` | SVG图标集合 |

---

### 3. `/reference/` - 设计参考
**用途**：存放UI设计参考图片

| 文件 | 说明 |
|-----|------|
| `about-me.png` | 关于我页面参考 |
| `essay-detail-image.png` | 文章详情图片参考 |
| `essay-detail.png` | 文章详情页参考 |
| `essay-list.png` | 文章列表页参考 |
| `index.png` | 首页参考 |
| `infinite-photo-wall.md` | 无限照片墙说明 |
| `live2d.png` | Live2D参考 |
| `picture-detail.png` | 图片详情页参考 |
| `picture.png` | 图片页参考 |
| `PixPin_2026-03-16_20-59-24.png` | 截图参考 |

---

### 4. `/src/` - 源代码

#### 4.1 `/src/assets/` - 项目资源
**状态**：目前为空，用于存放图片、字体等资源文件

---

#### 4.2 `/src/components/` - React组件

##### `/src/components/common/` - 通用组件
**状态**：目前为空（`.gitkeep`占位）
**用途**：存放跨页面复用的通用组件

##### `/src/components/layout/` - 布局组件
| 文件 | 说明 |
|-----|------|
| `Layout.tsx` | 主布局组件（包含Navbar和Outlet） |
| `Navbar.tsx` | 导航栏组件 |

##### `/src/components/ui/` - UI组件
| 文件 | 说明 |
|-----|------|
| `BrutalistCard.tsx` | 粗野主义风格卡片组件 |

---

#### 4.3 `/src/data/` - 模拟数据
**用途**：存放应用的模拟数据

| 文件 | 说明 |
|-----|------|
| `index.ts` | 数据导出聚合文件 |
| `essays.ts` | 文章数据 |
| `projects.ts` | 项目数据 |
| `pictures.ts` | 图片数据 |
| `bloglinks.ts` | 友情链接数据 |

---

#### 4.4 `/src/hooks/` - 自定义Hooks
**状态**：目前为空（`.gitkeep`占位）
**用途**：存放自定义React Hooks

---

#### 4.5 `/src/pages/` - 页面组件
**用途**：存放路由对应的页面组件

| 目录/文件 | 路由路径 | 说明 |
|----------|---------|------|
| `Home/index.tsx` | `/` | 首页 |
| `Essays/index.tsx` | `/essays` | 文章列表页 |
| `EssayDetail/index.tsx` | `/essays/:id` | 文章详情页 |
| `Projects/index.tsx` | `/projects` | 项目展示页 |
| `Pictures/index.tsx` | `/pictures` | 图片墙页 |
| `Pictures/InfinitePhotoWall.tsx` | - | 无限照片墙组件 |
| `About/index.tsx` | `/about` | 关于我页 |
| `Blogroll/index.tsx` | `/blogroll` | 友情链接页 |
| `NotFound/index.tsx` | `*` | 404页面 |

---

#### 4.6 `/src/router/` - 路由配置
| 文件 | 说明 |
|-----|------|
| `index.tsx` | React Router路由配置定义 |

**路由结构**：
```
/                    -> Home (首页)
/essays              -> Essays (文章列表)
/essays/:id          -> EssayDetail (文章详情)
/projects            -> Projects (项目)
/pictures            -> Pictures (图片墙)
/about               -> About (关于我)
/blogroll            -> Blogroll (友情链接)
*                    -> NotFound (404)
```

---

#### 4.7 `/src/stores/` - 状态管理
**状态**：目前为空（`.gitkeep`占位）
**用途**：存放Zustand状态管理store

---

#### 4.8 `/src/styles/` - 全局样式
| 文件 | 说明 |
|-----|------|
| `index.css` | 全局样式、Tailwind配置、自定义工具类 |

**样式特点**：
- **设计风格**：Kinetic Orange（动能橙）
- **主色调**：黑色背景 (#000000) + 橙色强调 (#FF4D00)
- **字体**：Archivo Black（标题）、Inter（正文）、Space Mono（等宽）
- **组件**：粗野主义卡片、Pill形状、分割线

---

#### 4.9 `/src/types/` - TypeScript类型定义
| 文件 | 说明 |
|-----|------|
| `index.ts` | 类型导出聚合文件 |
| `essay.ts` | 文章类型定义 |
| `project.ts` | 项目类型定义 |
| `picture.ts` | 图片类型定义 |
| `bloglink.ts` | 友情链接类型定义 |

---

#### 4.10 `/src/utils/` - 工具函数
**状态**：目前为空（`.gitkeep`占位）
**用途**：存放通用工具函数

---

### 5. 配置文件

| 文件 | 说明 |
|-----|------|
| `package.json` | 项目依赖和脚本配置 |
| `vite.config.ts` | Vite构建配置 |
| `tsconfig.json` | TypeScript基础配置 |
| `tsconfig.app.json` | 应用TypeScript配置 |
| `tsconfig.node.json` | Node环境TypeScript配置 |
| `eslint.config.js` | ESLint配置 |
| `index.html` | HTML入口文件 |
| `.gitignore` | Git忽略配置 |

---

## 🎨 设计风格速查

### 颜色系统
| 名称 | 值 | 用途 |
|-----|---|------|
| `--color-brand` | #FF4D00 | 品牌橙色（强调色） |
| `--color-black` | #000000 | 主背景色 |
| `--color-white` | #FFFFFF | 主文字色 |
| `--color-white-80` | rgba(255,255,255,0.8) | 次要文字 |
| `--color-white-20` | rgba(255,255,255,0.2) | 边框、分割线 |
| `--color-white-5` | rgba(255,255,255,0.05) | 微弱背景 |

### 字体系统
| 名称 | 字体 | 用途 |
|-----|------|------|
| `--font-display` | Archivo Black | 大标题、展示文字 |
| `--font-body` | Inter | 正文、UI文字 |
| `--font-mono` | Space Mono | 代码、标签、元数据 |

### 工具类
| 类名 | 说明 |
|-----|------|
| `text-display` | 展示字体样式 |
| `text-mono` | 等宽字体样式 |
| `brutalist-card` | 粗野主义卡片（黑底黑边） |
| `brutalist-card-dark` | 深色粗野主义卡片（透明底白边） |
| `pill` | 胶囊形状 |
| `divider` | 分割线 |
| `animate-marquee` | 跑马灯动画 |
| `animate-spin-slow` | 慢速旋转动画 |

---

## 🔍 快速定位指南

### 要找页面？
→ 去 `/src/pages/[PageName]/index.tsx`

### 要找组件？
→ 通用组件：`/src/components/common/`
→ 布局组件：`/src/components/layout/`
→ UI组件：`/src/components/ui/`

### 要找样式？
→ 全局样式：`/src/styles/index.css`
→ 组件样式：在组件文件内使用Tailwind类

### 要找类型？
→ 类型定义：`/src/types/`

### 要找数据？
→ 模拟数据：`/src/data/`

### 要找路由？
→ 路由配置：`/src/router/index.tsx`

### 要找设计文档？
→ 规格文档：`/openspec/`
→ 设计参考：`/reference/`

---

## 📦 依赖速查

### 核心框架
- `react` ^19.2.4 - React核心
- `react-dom` ^19.2.4 - React DOM
- `react-router-dom` ^7.13.1 - 路由

### 样式
- `tailwindcss` ^4.2.1 - CSS框架
- `@tailwindcss/vite` ^4.2.1 - Tailwind Vite插件

### 动画
- `framer-motion` ^12.38.0 - React动画库
- `gsap` ^3.14.2 - 专业动画库

### 状态管理
- `zustand` ^5.0.12 - 轻量级状态管理

---

*文档生成时间：2026-03-21*
*项目：Ivy Neko Blog*
