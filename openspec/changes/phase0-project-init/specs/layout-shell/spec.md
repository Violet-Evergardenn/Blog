## ADDED Requirements

### Requirement: Layout 壳组件
系统 SHALL 提供全局 Layout 组件，包裹所有页面。Layout MUST 包含：顶部导航栏区域、主内容区域（使用 `<Outlet />` 渲染子路由）。

#### Scenario: Layout 包裹页面
- **WHEN** 用户访问任意路由
- **THEN** 页面被 Layout 组件包裹，顶部导航栏可见，内容区域渲染对应页面

### Requirement: 顶部导航栏占位
Layout SHALL 包含顶部导航栏区域，初始为占位状态，显示导航图标位置（头像、文章、项目、关于、推荐、博客），左上角对齐，毛玻璃背景样式。

#### Scenario: 导航栏渲染
- **WHEN** 页面加载完成
- **THEN** 左上角显示毛玻璃样式的导航栏占位区域