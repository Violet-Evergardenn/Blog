## ADDED Requirements

### Requirement: 路由配置
系统 SHALL 使用 React Router DOM v7 配置以下路由：`/`（首页）、`/essays`（文章列表）、`/essays/:id`（文章详情）、`/projects`（项目展示）、`/pictures`（图片墙）、`/about`（关于）、`/blogroll`（优秀博客/友链）。

#### Scenario: 路由正确导航
- **WHEN** 用户访问上述任一路由路径
- **THEN** 对应的页面组件正确渲染

### Requirement: 页面占位组件
每个路由路径 SHALL 对应一个占位页面组件，显示页面名称文字，确认路由系统正常工作。

#### Scenario: 占位页面显示
- **WHEN** 用户访问 `/projects`
- **THEN** 页面显示"项目展示"占位文字

### Requirement: 404 页面
系统 SHALL 对未匹配的路由路径显示 404 页面。

#### Scenario: 未知路由
- **WHEN** 用户访问不存在的路径如 `/unknown`
- **THEN** 显示 404 页面