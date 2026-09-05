---
title: '头像'
description: '头像，支持图片或字符展示。'
locale: 'zh-CN'
slug: 'avatar'
category: 'show'
order: 62
englishTitle: 'Avatar'
icon: 'doc-avatar'
upstream: 'show/avatar'
---

## 代码演示

### 如何引入

```vue
<script setup lang="ts">
import { Avatar, AvatarGroup } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/avatar.css';
</script>
```

### 尺寸

可以通过 `size` 属性设置图标大小，支持`extra-extra-small`，`extra-small`，`small`，`default`，`medium`，`large`，`extra-large`。

::demo-block{demo="avatar/zh-cn/Size" title="尺寸"}
::

### 颜色

Avatar 支持默认色板的 16 种颜色和白色，包括：`amber`、 `blue`、 `cyan`、 `green`、 `grey`、 `indigo`、 `light-blue`、 `light-green`、 `lime`、 `orange`、 `pink`、 `purple`、 `red`、 `teal`、 `violet`、 `yellow`。也可以通过 `style` 来自定义颜色样式。默认为`grey`。

::demo-block{demo="avatar/zh-cn/Color" title="颜色"}
::

### 自适应字符大小

字符类型的头像，字体大小会根据头像宽度自适应调整。使用`gap`调整字符头像距离左右两侧的像素大小。

::demo-block{demo="avatar/zh-cn/Adaptive" title="自适应字符大小"}
::

### 图片

可以通过 `src` 设置图片格式的头像。

::demo-block{demo="avatar/zh-cn/Image" title="图片"}
::

### 形状

Avatar 支持 `circle`、`square` 两种形状，默认为 `circle`。

::demo-block{demo="avatar/zh-cn/Shape" title="形状"}
::

### 事件

Avatar 支持 `@click`、`@mouseenter`、`@mouseleave`。其中 `hover` 状态下可以通过 `hoverMask` 属性传入覆盖层的内容。覆盖层无默认样式。

::demo-block{demo="avatar/zh-cn/Hover" title="事件"}
::

### 顶部和底部 Slot

::demo-block{demo="avatar/zh-cn/Slots" title="顶部和底部 Slot"}
::

#### 顶部

::demo-block{demo="avatar/zh-cn/TopSlot" title="顶部"}
::

#### 底部

::demo-block{demo="avatar/zh-cn/BottomSlot" title="底部"}
::

### 额外边框

::demo-block{demo="avatar/zh-cn/Border" title="额外边框"}
::

### 额外动效

通过 `:border="{ motion: true }"` 和 contentMotion 开启边框和内容区域的额外动效

::demo-block{demo="avatar/zh-cn/Animation" title="额外动效"}
::

### 头像组

可以通过 AvatarGroup 将 `avatar` 显示为组。

::demo-block{demo="avatar/zh-cn/Group" title="头像组"}
::

可以通过 `maxCount` 设置展示的头像数量。

::demo-block{demo="avatar/zh-cn/MaxCount" title="头像组"}
::

可以通过 `renderMore` 自定义 more 标签。

::demo-block{demo="avatar/zh-cn/More" title="头像组"}
::

可以通过 `overlapFrom` 控制头像组的覆盖方式。可选值有 `start` 和 `end`，分别表示左边覆盖右边和右边覆盖左边。默认值为 `start`。

::demo-block{demo="avatar/zh-cn/Overlap" title="头像组"}
::

## API 参考

### Avatar

| 属性                | 说明                                       | 类型                                | 默认值   |
| ------------------- | ------------------------------------------ | ----------------------------------- | -------- |
| `alt`               | 图片或字符的替代文本                       | `string`                            | `—`      |
| `border`            | 额外边框；对象可设置颜色和动画             | `boolean \| AvatarBorder`           | `false`  |
| `bottomSlot`        | 底部装饰配置，详见下表                     | `AvatarBottomSlot`                  | `—`      |
| `class / className` | 样式类，className 为兼容别名               | `HTMLAttributes["class"]`           | `—`      |
| `style`             | 内联样式                                   | `StyleValue`                        | `—`      |
| `color`             | 默认色板颜色，包括 white                   | `AvatarColor`                       | `grey`   |
| `contentMotion`     | 内容区域缩放动画                           | `boolean`                           | `false`  |
| `hoverMask`         | 悬停覆盖层，没有默认覆盖层样式             | `VNodeChild`                        | `—`      |
| `gap`               | 字符距离头像两侧的像素间隔                 | `number`                            | `3`      |
| `imgAttr`           | 原生 img 属性                              | `ImgHTMLAttributes`                 | `—`      |
| `shape`             | circle、square                             | `AvatarShape`                       | `circle` |
| `size`              | 预设尺寸或合法 CSS 宽度，如 60px           | `AvatarSize`                        | `medium` |
| `src`               | 图片资源地址                               | `string`                            | `—`      |
| `srcSet`            | 响应式图片资源                             | `string`                            | `—`      |
| `topSlot`           | 顶部装饰配置，详见下表                     | `AvatarTopSlot`                     | `—`      |
| `onError`           | 图片失败回调；返回 false 阻止默认 fallback | `(event: Event) => boolean \| void` | `—`      |

### AvatarBottomSlot

| 属性        | 说明               | 类型                      | 默认值      |
| ----------- | ------------------ | ------------------------- | ----------- |
| `render`    | 完全自定义底部渲染 | `() => VNodeChild`        | `—`         |
| `shape`     | circle、square     | `AvatarShape`             | `—`         |
| `text`      | 底部内容           | `VNodeChild`              | `—`         |
| `bgColor`   | 底部背景色         | `string`                  | `CSS token` |
| `textColor` | 内容颜色           | `string`                  | `CSS token` |
| `className` | 内容类名           | `HTMLAttributes["class"]` | `—`         |
| `style`     | 底部容器样式       | `StyleValue`              | `—`         |

### AvatarTopSlot

| 属性                          | 说明               | 类型                      | 默认值                      |
| ----------------------------- | ------------------ | ------------------------- | --------------------------- |
| `render`                      | 完全自定义顶部渲染 | `() => VNodeChild`        | `—`                         |
| `gradientStart / gradientEnd` | 背景渐变起止色     | `string`                  | `var(--semi-color-primary)` |
| `text`                        | 顶部内容           | `VNodeChild`              | `—`                         |
| `textColor`                   | 内容颜色           | `string`                  | `CSS token`                 |
| `className`                   | 顶部容器类名       | `HTMLAttributes["class"]` | `—`                         |
| `style`                       | 顶部容器样式       | `StyleValue`              | `—`                         |

### AvatarBorder

| 属性     | 说明         | 类型      | 默认值                      |
| -------- | ------------ | --------- | --------------------------- |
| `color`  | 边框颜色     | `string`  | `var(--semi-color-primary)` |
| `motion` | 边框扩散动画 | `boolean` | `false`                     |

### AvatarGroup

| 属性          | 说明                        | 类型                                                       | 默认值   |
| ------------- | --------------------------- | ---------------------------------------------------------- | -------- |
| `maxCount`    | 最多显示数量，剩余项显示 +N | `number`                                                   | `—`      |
| `overlapFrom` | 头像重叠方向 start、end     | `AvatarGroupOverlapFrom`                                   | `start`  |
| `renderMore`  | 自定义剩余头像节点          | `(restNumber: number, restAvatars: VNode[]) => VNodeChild` | `—`      |
| `shape`       | circle、square              | `AvatarShape`                                              | `circle` |
| `size`        | 预设尺寸或合法 CSS 宽度     | `AvatarSize`                                               | `medium` |

插槽：`default` 为内容，`#hoverMask` 为覆盖层，`#topSlot="{ config }"` / `#bottomSlot="{ config }"` 自定义配置的装饰。`AvatarGroup` 支持 `#more="{ restNumber, restAvatars }"`。

事件：`@click(event)` 接收 MouseEvent 或 KeyboardEvent；`@mouseenter(event)`、`@mouseleave(event)` 接收 MouseEvent。`onError` 保留为函数 prop，因为返回值会控制 fallback，请使用 `:on-error="handleError"`。

七种预设尺寸依次为 20、24、32、40、48、72、128px。顶部/底部装饰只适用于受支持的预设尺寸，顶部装饰还要求 circle 形状。

## Accessibility

- Avatar 一般不用于操作，不需要被获取焦点。但当 Avatar 可以被点击操作时（如：Semi 官网上方的头像）需要被聚焦，并响应键盘 `Enter` 事件。
- 当 Avatar 与其他组件结合使用时，需要同时检查该组件的可访问性指南。
- Avatar的`alt`属性可以被屏幕阅读器读取，使用头像组件时，请使用`alt` 属性解释头像的内容。

```vue
<!-- 替代文本应描述实际图片内容。 -->
<Avatar alt="示例图片" src="/demos/photo.svg" style="margin: 4px" />
<Avatar alt="姜鹏志">LL</Avatar>
```

## 设计变量

::token-table{component="avatar"}
::

## 文案规范

使用易识别的姓名缩写或图片。alt 说明人物或内容本身，避免重复“某某的图片”等无效信息。

## FAQ

**为什么装饰没有显示？** 顶部/底部装饰依赖受支持的预设尺寸，顶部还要求 circle 形状。

**如何阻止图片失败后的 fallback？** 传入返回 false 的 onError 函数；否则组件回退到内容。

**为什么组内单项 size 没生效？** AvatarGroup 统一向成员应用组级 size 和 shape。

## React → Vue

| React                                   | Vue                                       |
| --------------------------------------- | ----------------------------------------- |
| `children`                              | default 插槽                              |
| `hoverMask ReactNode`                   | hoverMask 插槽或 VNodeChild               |
| `topSlot / bottomSlot render`           | 配置函数返回 VNodeChild，或对应作用域插槽 |
| `renderMore(restNumber, restAvatars)`   | #more="{ restNumber, restAvatars }"       |
| `React.cloneElement`                    | Vue cloneVNode                            |
| `onClick / onMouseEnter / onMouseLeave` | @click / @mouseenter / @mouseleave        |
| `onError`                               | :on-error 函数 prop，保留返回值           |
| `className / CSSProperties`             | class（兼容 className）/ StyleValue       |
