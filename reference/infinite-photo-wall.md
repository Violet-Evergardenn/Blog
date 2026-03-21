# 无限滚动照片墙实现思路文档

> 基于 Vue 3 + GSAP 实现，支持鼠标拖拽 & 触摸拖拽，四个方向均可无限循环滚动。

---

## 一、效果描述

- 页面铺满一个深色背景区域
- 内部有 **3 行照片**，每行 6 张，横向排列
- 用户可以通过 **鼠标拖拽** 或 **手指滑动** 在上下左右任意方向移动照片墙
- 移动时，超出边界的照片会 **瞬间传送** 到对面，形成 **无限循环** 的视觉效果
- 拖拽松手后，照片有 **惯性缓动动画**（GSAP `power4.out`）

---

## 二、核心原理

### 2.1 "传送门"无限循环

这是整个功能最核心的逻辑。每张照片记录自身的 **初始位置（x, y）** 和 **当前偏移量（movx, movy）**。

当照片的 `实际位置 = 初始位置 + 偏移量` 超出容器边界时，立刻将偏移量调整，使其出现在对面：

```js
// 向右拖出右边界 → 传送到左侧
if (img.movx + img.x > container_width) {
    img.movx -= container_width;
    duration = 0; // 传送是瞬间的，不需要动画
}

// 向左拖出左边界 → 传送到右侧
if (img.movx + img.x < -photo_width) {
    img.movx += container_width;
    duration = 0;
}

// 垂直方向同理
if (img.movy + img.y > container_height) {
    img.movy -= container_height;
    duration = 0;
}
if (img.movy + img.y < -photo_height) {
    img.movy += container_height;
    duration = 0;
}
```

**关键点：** 传送时 `duration = 0`（无动画），正常移动时 `duration = 1`（有缓动）。这样传送动作是不可见的，用户感知不到跳变。

### 2.2 数据结构

每张照片在初始化（`resize`）时，都会被记录为一个对象存入数组：

```js
img_data = imgs.map((img) => ({
    node: img,       // DOM 节点引用
    x: img.offsetLeft,  // 初始 X 坐标（相对容器）
    y: img.offsetTop,   // 初始 Y 坐标（相对容器）
    movx: 0,            // 当前 X 偏移量（由拖拽累加）
    movy: 0,            // 当前 Y 偏移量（由拖拽累加）
    ani: null,          // GSAP 动画实例（用于 kill 打断）
}));
```

### 2.3 GSAP 动画驱动位移

实际位移通过 GSAP 的 `gsap.to()` 应用到 DOM 的 `transform: translate()` 上：

```js
if (img.ani) img.ani.kill(); // 打断上一次动画，避免冲突

img.ani = gsap.to(img.node, {
    transform: `translate(${img.movx}px, ${img.movy}px)`,
    duration,          // 正常移动为 1，传送为 0
    ease: 'power4.out' // 惯性缓出效果
});
```

每次移动都会先 `kill()` 掉上一帧的动画，防止动画堆叠导致的卡顿。

---

## 三、布局方案

### 3.1 容器缩放适配（`scale` 方案）

整个照片墙容器使用固定的"设计稿尺寸"进行内部布局，然后通过 CSS `scale` 缩放来适配不同屏幕宽度：

```js
const standard_width = 1440; // 设计基准宽度（移动端为 600）
scale_nums = document.body.offsetWidth / standard_width;
container.style.transform = `scale(${scale_nums})`;
```

这样内部所有尺寸计算（`offsetWidth`、`offsetLeft` 等）都基于同一基准，不受屏幕实际尺寸影响。

> ⚠️ 拖拽时移动距离需要除以 `scale_nums` 还原真实像素值：
> ```js
> const distanceX = (x - mouse_x) / scale_nums;
> ```

### 3.2 CSS 布局结构

```
.infinitebox（全屏容器，overflow: hidden）
  └── .photos（绝对定位，flex 列方向）
        ├── .photos_line（一行，flex 行方向）
        │     ├── .photos_line_photo（单张照片卡片）
        │     └── ...（共 6 张）
        ├── .photos_line
        └── .photos_line
```

- 照片尺寸使用 `em` 单位，配合不同媒体查询的 `font-size` 调整，实现响应式等比缩放
- 照片有 `border-radius` 圆角、`overflow: hidden` 裁切，以及 `:hover` 放大效果

### 3.3 字体尺寸响应式

通过媒体查询改变 `font-size`，所有用 `em` 定义的尺寸都会跟着自动缩放：

```css
@media screen and (min-aspect-ratio: 1.9/1) {
    .photos_line, .photos_line_photo {
        font-size: 1.3px; /* 宽屏时缩小 */
    }
}
@media screen and (max-aspect-ratio: 0.8/1) {
    .photos_line, .photos_line_photo {
        font-size: 1.3px; /* 竖屏时也缩小 */
    }
}
```

---

## 四、交互事件

### 4.1 鼠标事件

| 事件 | 作用 |
|------|------|
| `mousedown` | 开始拖拽，记录起始坐标 |
| `mousemove` | 计算位移差值，调用 `move()` |
| `mouseup` | 停止拖拽 |
| `mouseleave` | 鼠标离开容器，停止拖拽（防止拖出容器后失控） |

### 4.2 触摸事件

| 事件 | 作用 |
|------|------|
| `touchstart` | 记录第一个触摸点坐标 |
| `touchmove` | 获取 `touches[0]`，调用 `move()` |
| `touchend` | 停止拖拽 |

鼠标和触摸事件共用同一个 `move(x, y)` 函数，逻辑统一。

---

## 五、初始化流程

```
onMounted()
  ├── init()          ← 加载图片数据，分配到 imgs1/imgs2/imgs3（3行各6张）
  └── nextTick()
        ├── resize()  ← 等 DOM 渲染完毕后，记录所有照片的初始坐标和容器尺寸
        └── 监听 window resize 事件，窗口变化时重新执行 resize()

onBeforeUnmount()
  └── 移除 resize 监听，防止内存泄漏
```

---

## 六、在其他项目中复用的要点

1. **依赖 GSAP**：`npm install gsap`，用于平滑动画和 `kill()` 打断机制
2. **图片需预先分组**：将所有图片分成 N 行，每行 M 张，保证铺满容器后仍有"溢出"的图可供传送
3. **传送逻辑的前提**：照片总宽度（行）或总高度（列）需要 **大于等于容器尺寸 + 单张照片尺寸**，否则传送后会出现空白
4. **`resize` 需要在 `nextTick` 后执行**：确保 DOM 已渲染，否则 `offsetWidth` 等属性为 0
5. **`duration = 0` 是无缝传送的关键**：传送瞬间不能有过渡动画
6. **`scale` 方案简化响应式计算**：避免在 JS 中手动计算各种屏幕尺寸下的坐标，统一按设计稿尺寸算，最后整体缩放

---

## 七、简化版核心代码骨架

```js
// 初始化：记录每张图片的初始位置
const initImgData = () => {
    img_data = [...document.querySelectorAll('.photo-item')].map(img => ({
        node: img,
        x: img.offsetLeft,
        y: img.offsetTop,
        movx: 0,
        movy: 0,
        ani: null,
    }));
    containerW = container.offsetWidth;
    containerH = container.offsetHeight;
    photoW = img_data[0]?.node.offsetWidth ?? 0;
    photoH = img_data[0]?.node.offsetHeight ?? 0;
};

// 核心移动逻辑
const move = (dx, dy) => {
    img_data.forEach(img => {
        let duration = 1;
        img.movx += dx;
        img.movy += dy;

        // 水平传送
        if (img.movx + img.x > containerW)  { img.movx -= containerW; duration = 0; }
        if (img.movx + img.x < -photoW)     { img.movx += containerW; duration = 0; }
        // 垂直传送
        if (img.movy + img.y > containerH)  { img.movy -= containerH; duration = 0; }
        if (img.movy + img.y < -photoH)     { img.movy += containerH; duration = 0; }

        if (img.ani) img.ani.kill();
        img.ani = gsap.to(img.node, {
            transform: `translate(${img.movx}px, ${img.movy}px)`,
            duration,
            ease: 'power4.out'
        });
    });
};
```

---

*文档生成于 2026/03/19，基于 `src/components/InfiniteSliding.vue` 源码分析*
