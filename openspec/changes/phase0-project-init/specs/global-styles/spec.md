## ADDED Requirements

### Requirement: 全局渐变背景
页面 SHALL 显示从淡黄白色到薄荷绿色的固定渐变背景（`linear-gradient(135deg, #fefce8 0%, #d1fae5 50%, #a7f3d0 100%)`），背景 MUST 覆盖整个视口且不随内容滚动。

#### Scenario: 背景渲染
- **WHEN** 用户访问任意页面
- **THEN** 页面背景显示为柔和的薄荷绿渐变效果，且在滚动时背景保持固定

### Requirement: Tailwind CSS 自定义主题
系统 SHALL 通过 Tailwind CSS v4 的 `@theme` 配置自定义薄荷绿色系（mint-50 到 mint-900），并提供毛玻璃效果的工具类。

#### Scenario: 自定义颜色可用
- **WHEN** 在组件中使用 `bg-mint-100` 等自定义颜色类名
- **THEN** 元素正确显示对应的薄荷绿色

### Requirement: 毛玻璃卡片样式
系统 SHALL 提供 `glass-card` CSS 工具类，实现毛玻璃效果：半透明白色背景（bg-white/60）、背景模糊（backdrop-blur-xl）、圆角（rounded-2xl）、白色半透明边框、柔和阴影。

#### Scenario: 毛玻璃卡片渲染
- **WHEN** 给元素添加 `glass-card` 类名
- **THEN** 元素显示毛玻璃效果，可透过看到背后渐变背景