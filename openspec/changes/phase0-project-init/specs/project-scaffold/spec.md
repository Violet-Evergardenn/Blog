## ADDED Requirements

### Requirement: Vite 项目初始化
系统 SHALL 使用 Vite 6 + React 18 + TypeScript 模板初始化项目，生成可运行的开发环境。

#### Scenario: 项目创建并启动
- **WHEN** 开发者执行 `npm create vite` 并安装依赖后运行 `npm run dev`
- **THEN** 浏览器可访问本地开发服务器且页面正常渲染

### Requirement: 核心依赖安装
系统 SHALL 安装以下核心依赖：react-router-dom、tailwindcss、framer-motion、zustand、@pixi/live2d-display（pixi-live2d-display）。

#### Scenario: 所有依赖安装成功
- **WHEN** 执行 `npm install` 后
- **THEN** 所有依赖成功安装，无版本冲突错误

### Requirement: 项目目录结构
项目 SHALL 包含标准化目录结构：`src/components/`（含 ui/、layout/、common/ 子目录）、`src/pages/`、`src/hooks/`、`src/stores/`、`src/types/`、`src/utils/`、`src/data/`、`src/router/`、`src/styles/`、`src/assets/`。

#### Scenario: 目录结构完整
- **WHEN** 检查 src 目录
- **THEN** 所有规定的目录和子目录存在