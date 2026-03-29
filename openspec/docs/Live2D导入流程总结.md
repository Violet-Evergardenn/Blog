# Live2D 导入流程总结

## 1. 技术栈与依赖
项目使用 Vue 3 + Vite，Live2D 渲染基于 Pixi。

在 [package.json](package.json) 中，核心依赖是：

- pixi-live2d-display
- pixi.js

其中：

- pixi-live2d-display 负责把 Cubism 模型接入到 Pixi 渲染体系
- pixi.js 负责 WebGL/Canvas 渲染舞台

## 2. Cubism Core 的引入方式
这个项目不是在组件内 import Cubism Core，而是在 HTML 入口直接注入脚本：

- [index.html](index.html)

通过 script 标签先加载 public 目录下的 core 文件，再加载 Vue 入口。这样可以保证 Live2D 运行时在页面环境中可用。

## 3. 模型资源放置位置
模型静态资源放在 Vite 的 public 目录下，当前结构是：

- [public/阿米娅/阿米娅(1).model3.json](public/阿米娅/阿米娅(1).model3.json)
- [public/阿米娅/阿米娅(1).moc3](public/阿米娅/阿米娅(1).moc3)
- [public/阿米娅/阿米娅(1).physics3.json](public/阿米娅/阿米娅(1).physics3.json)
- 以及纹理目录 public/阿米娅/阿米娅(1).8192

因为在 public 下，运行时可以直接通过根路径访问，比如：

- /阿米娅/阿米娅(1).model3.json

## 4. Vue 中的实际加载流程
实际显示组件是 [src/components/ShowLive2d.vue](src/components/ShowLive2d.vue)，在 [src/App.vue](src/App.vue) 中被使用。

导入链路如下：

1. 在组件内导入 Pixi 与 Live2DModel。
2. 把 PIXI 挂到 window（window.PIXI = PIXI），满足插件运行时依赖。
3. onMounted 时创建 PIXI.Application，并把 canvas 作为 view。
4. 调用 Live2DModel.from('/阿米娅/阿米娅(1).model3.json') 异步加载模型。
5. 将 model addChild 到 app.stage，设置缩放、位置等参数。
6. 监听窗口变化并重算模型位置。
7. 组件卸载时销毁 model 和 app，避免内存泄漏。

## 5. 表情与动作是如何接入的
除了 model3.json，项目还额外维护了表情配置：

- [public/阿米娅/expression.json](public/阿米娅/expression.json)

在 [src/components/ShowLive2d.vue](src/components/ShowLive2d.vue) 中会 fetch 这个 JSON，并把 expressions 放到 model.expressions。

后续通过自定义 expression 方法，按参数插值写入 coreModel 参数，实现：

- 眨眼
- 开心/惊讶/生气
- 预设动作切换
- 配合文本长度的口型动画

## 6. 业务触发链路（聊天驱动表情）
上层由聊天组件驱动模型状态更新：

- [src/components/ChatBox.vue](src/components/ChatBox.vue) 发送消息后，拿到后端返回的 text + emotion
- [src/App.vue](src/App.vue) 接收消息并更新传给 ShowLive2d 的 props
- ShowLive2d watch 到 componentKey/emotion 变化后触发表情与口型动画

## 7. 一句话总结
这个项目的 Live2D 导入方式可以概括为：

- 入口 HTML 预加载 Cubism Core
- Vue 组件中用 Pixi + pixi-live2d-display 动态加载 public 下的 model3.json
- 再用自定义 expression.json 与业务事件（聊天返回情绪）驱动参数动画

即：导入（加载模型）和驱动（表情/口型）是分开的，两层都在前端完成。