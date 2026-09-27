---
title: 'Avatar 头像'
description: '头像，支持图片或字符展示。'
type: 'show'
order: 62
icon: 'doc-avatar'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/avatar` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-show-avatar-1" title="如何引入" kind="import" />

### 尺寸

可以通过 `size` 属性设置图标大小，支持`extra-extra-small`，`extra-small`，`small`，`default`，`medium`，`large`，`extra-large`。

<DemoBlock id="zh-CN-show-avatar-2" title="尺寸" kind="live" />

### 颜色

Avatar 支持默认色板的 15 种颜色和白色，包括：`amber`、 `blue`、 `cyan`、 `green`、 `grey`、 `indigo`、 `light-blue`、 `light-green`、 `lime`、 `orange`、 `pink`、 `purple`、 `red`、 `teal`、 `violet`、 `yellow`。也可以通过 `style` 来自定义颜色样式。默认为`grey`。

<DemoBlock id="zh-CN-show-avatar-3" title="颜色" kind="live" />

### 自适应字符大小

字符类型的头像，字体大小会根据头像宽度自适应调整。使用`gap`调整字符头像距离左右两侧的像素大小。

<DemoBlock id="zh-CN-show-avatar-4" title="自适应字符大小" kind="live" />

### 图片

可以通过 `src` 设置图片格式的头像。

<DemoBlock id="zh-CN-show-avatar-5" title="图片" kind="live" />

### 形状

Avatar 支持 `circle`、`square` 两种形状，默认为 `circle`。

<DemoBlock id="zh-CN-show-avatar-6" title="形状" kind="live" />

### 事件

Avatar 支持 `click`、`mouseenter`、`mouseleave` 事件。悬停覆盖层可通过 `#hoverMask` 插槽或 `hoverMask` 属性传入，覆盖层无默认样式。

<DemoBlock id="zh-CN-show-avatar-7" title="事件" kind="live" />

### 顶部和底部 Slot

<DemoBlock id="zh-CN-show-avatar-8" title="顶部和底部 Slot" kind="live" />

#### 顶部

<DemoBlock id="zh-CN-show-avatar-9" title="顶部" kind="live" />

#### 底部

<DemoBlock id="zh-CN-show-avatar-10" title="底部" kind="live" />

### 额外边框

<DemoBlock id="zh-CN-show-avatar-11" title="额外边框" kind="live" />

### 额外动效

通过 `border={motion:true}` 和 contentMotion 开启边框和内容区域的额外动效

<DemoBlock id="zh-CN-show-avatar-12" title="额外动效" kind="live" />

### 头像组

可以通过 AvatarGroup 将 `avatar` 显示为组。

<DemoBlock id="zh-CN-show-avatar-13" title="头像组" kind="live" />

可以通过 `maxCount` 设置展示的头像数量。

<DemoBlock id="zh-CN-show-avatar-14" title="头像组" kind="live" />

可以通过 `#more` 插槽或 `renderMore` 属性自定义 more 标签。

<DemoBlock id="zh-CN-show-avatar-15" title="头像组" kind="live" />

可以通过 `overlapFrom` 控制头像组的覆盖方式。可选值有 `start` 和 `end`，分别表示左边覆盖右边和右边覆盖左边。默认值为 `start`。

<DemoBlock id="zh-CN-show-avatar-16" title="头像组" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/avatar/types.ts`、`packages/ui/src/avatar/index.ts` 的公开类型为准。

#### Vue 事件

**Avatar**

| 事件       | 参数                                 | 说明               |
| ---------- | ------------------------------------ | ------------------ |
| click      | [event: MouseEvent \| KeyboardEvent] | 点击或键盘激活头像 |
| mouseenter | [event: MouseEvent]                  | 指针进入头像       |
| mouseleave | [event: MouseEvent]                  | 指针离开头像       |

#### Vue 插槽

**Avatar**

| 插槽       | 作用域参数                   | 说明         |
| ---------- | ---------------------------- | ------------ |
| default    | {}                           | 头像内容     |
| hoverMask  | {}                           | 悬停覆盖层   |
| bottomSlot | { config: AvatarBottomSlot } | 底部附加内容 |
| topSlot    | { config: AvatarTopSlot }    | 顶部附加内容 |

**AvatarGroup**

| 插槽    | 作用域参数                                   | 说明               |
| ------- | -------------------------------------------- | ------------------ |
| default | {}                                           | Avatar 子组件      |
| more    | { restNumber: number; restAvatars: VNode[] } | 自定义剩余头像内容 |

---

### Avatar

| 属性          | 说明                                                                                                                                                                                       | 类型                                 | 默认值   |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------ | -------- |
| alt           | 图像的替代文本描述                                                                                                                                                                         | string                               | -        |
| border        | 额外边框 （&gt;=2.52.0）                                                                                                                                                                   | boolean \| AvatarBorder              | -        |
| bottomSlot    | 底部 Slot 配置 （&gt;= 2.52.0 ）                                                                                                                                                           | AvatarBottomSlot                     | -        |
| class         | —                                                                                                                                                                                          | HTMLAttributes['class']              | —        |
| className     | 类名                                                                                                                                                                                       | HTMLAttributes['class']              | -        |
| color         | 指定头像的颜色，支持 `amber`、 `blue`、 `cyan`、 `green`、 `grey`、 `indigo`、 `light-blue`、 `light-green`、 `lime`、 `orange`、 `pink`、 `purple`、 `red`、 `teal`、 `violet`、 `yellow` | AvatarColor                          | `grey`   |
| contentMotion | 头像内容区域动效 （&gt;=2.xx.0）                                                                                                                                                           | boolean                              | -        |
| gap           | 字符头像距离左右两侧的像素大小                                                                                                                                                             | number                               | 3        |
| hoverMask     | hover 时头像内容覆盖层                                                                                                                                                                     | VNodeChild                           | -        |
| imgAttr       | 原生 img 属性                                                                                                                                                                              | ImgHTMLAttributes                    | -        |
| onError       | 图片加载失败的事件，返回 false 会关闭组件默认的 fallback 行为                                                                                                                              | (event: Event) =&gt; boolean \| void | -        |
| shape         | 指定头像的形状，支持 `circle`、`square`                                                                                                                                                    | AvatarShape                          | `circle` |
| size          | 设置头像的大小，支持 `extra-extra-small`、`extra-small`、`small`、`default`、`medium`、`large`、`extra-large` 和 合法的 width 属性值例如 "10px"                                            | AvatarSize                           | `medium` |
| src           | 图片类头像的资源地址                                                                                                                                                                       | string                               | -        |
| srcSet        | 设置图片类头像响应式资源地址                                                                                                                                                               | string                               | -        |
| style         | 样式名                                                                                                                                                                                     | StyleValue                           | -        |
| topSlot       | 顶部 Slot 配置 （&gt;= 2.52.0 ）                                                                                                                                                           | AvatarTopSlot                        | -        |

### AvatarGroup

| 属性        | 说明                                                                                                                                             | 类型                                                        | 默认值   |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- | -------- |
| maxCount    | 最大数量限制，超出后显示+N                                                                                                                       | number                                                      | -        |
| overlapFrom | 设置头像覆盖方向，支持 `start`, `end`                                                                                                            | AvatarGroupOverlapFrom                                      | `start`  |
| renderMore  | 自定义渲染 more 标签                                                                                                                             | (restNumber: number, restAvatars: VNode[]) =&gt; VNodeChild | -        |
| shape       | 指定头像的形状，支持`circle`、`square`                                                                                                           | AvatarShape                                                 | `circle` |
| size        | 设置头像的大小，支持 `extra-extra-small`, `extra-small`、`small`、`default`、`medium`、`large`、`extra-large` 和合法的 width 属性值例，如 "10px" | AvatarSize                                                  | `medium` |

## Accessibility

- Avatar 一般不用于操作，不需要被获取焦点。但当 Avatar 可以被点击操作时（如：Semi 官网上方的头像）需要被聚焦，并响应键盘 `Enter` 事件。
- 当 Avatar 与其他组件结合使用时，需要同时检查该组件的可访问性指南。
- Avatar的`alt`属性可以被屏幕阅读器读取，使用头像组件时，请使用`alt` 属性解释头像的内容。

<DemoBlock id="zh-CN-show-avatar-17" title="Accessibility" kind="code" />
