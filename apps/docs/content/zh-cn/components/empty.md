---
title: '空状态'
description: '空状态时的展示占位图。'
locale: 'zh-CN'
slug: 'empty'
category: 'show'
order: 71
englishTitle: 'Empty'
icon: 'doc-empty'
upstream: 'show/empty'
---

## 代码演示

### 如何引入

```vue
<script setup lang="ts">
import { Empty } from '@aifuxi/semi-ui-vue/empty';
import '@aifuxi/semi-theme-default/empty.css';
</script>
```

### 基本用法

通过 `image` 设置占位图片，可以从 `@aifuxi/semi-illustrations-vue` 中手动引入对应的插画（插画默认宽高是200x200），也可以传入自定义的插画。目前拥有的插画可以查看[占位图插画](#占位图插画建设中)。

增加一系列暗色模式的插画，并支持通过 `darkModeImage` 传入暗色模式下需要使用的插画，以更好地适配暗色模式。

::demo-block{demo="empty/zh-cn/Basic" title="基本用法"}
::

### 自定义

通过默认插槽可以实现自定义的底部操作内容。

::demo-block{demo="empty/zh-cn/Custom" title="自定义"}
::

也可以不使用图片。

::demo-block{demo="empty/zh-cn/WithoutImage" title="自定义"}
::

### 不同布局

支持 2 种类型的布局：`vertical`、`horizontal`。默认为 `vertical`。

::demo-block{demo="empty/zh-cn/Layout" title="不同布局"}
::

### 占位图插画(建设中)

目前 `@aifuxi/semi-illustrations-vue` 中支持以下插画。

::demo-block{demo="empty/zh-cn/Illustrations" title="占位图插画(建设中)"}
::

## API 参考

| 属性                | 说明                                   | 类型                      | 默认值     |
| ------------------- | -------------------------------------- | ------------------------- | ---------- |
| `class / className` | 样式类，className 为兼容别名           | `HTMLAttributes["class"]` | `—`        |
| `style`             | 内联样式                               | `StyleValue`              | `—`        |
| `darkModeImage`     | 深色插图；响应 body 的 theme-mode 属性 | `EmptyImage`              | `—`        |
| `description`       | 内容说明                               | `VNodeChild`              | `—`        |
| `image`             | 插画节点、图片 URL 或 SVG symbol 配置  | `EmptyImage`              | `—`        |
| `imageStyle`        | 图像区域样式                           | `StyleValue`              | `—`        |
| `layout`            | vertical、horizontal                   | `EmptyLayout`             | `vertical` |
| `title`             | 标题                                   | `VNodeChild`              | `—`        |

### EmptySvgNode

| 属性            | 说明                                      | 类型     | 默认值 |
| --------------- | ----------------------------------------- | -------- | ------ |
| `id`            | 当前文档中的 SVG symbol id，用 use 引用   | `string` | `—`    |
| `viewBox / url` | 公开结构保留字段；symbol 分支只按 id 引用 | `string` | `—`    |

插槽：`image`、`darkModeImage`、`title`、`description`，以及承载底部操作的 `default`。命名插槽优先于对应属性。使用成对的明暗插图，文档主题变化时组件选择对应版本。

## Accessibility

### ARIA

- Empty 插图的 aria-hidden 为 true

## 文案规范

- 标题
  - 标题应该简洁易懂
- 正文
  - 可以展示展示空状态的具体原因，也可以展示后续的操作行为去帮助用户消除空状态
  - 不要重复标题上的内容
  - 尽量保持正文在 1-2 句话内
- 动作按钮
  - 按钮文案需要足够清晰和容易理解
  - 使用 动词 + 名词 的格式

## 设计变量

::token-table{component="empty"}
::

## FAQ

**为什么深色模式下插图没有切换？** 需要提供 darkModeImage 或对应插槽，并通过 document.body 的 theme-mode 属性切换主题。

**操作按钮放在哪里？** 放入默认插槽，组件将其渲染在 footer。

**可以没有插画吗？** 可以，使用标题和描述解释状态，并在适当时给出明确操作。

## React → Vue

| React                             | Vue                                 |
| --------------------------------- | ----------------------------------- |
| `children`                        | default 插槽，位于底部操作区域      |
| `image / darkModeImage ReactNode` | 同名插槽或 EmptyImage               |
| `title / description ReactNode`   | 同名插槽或 VNodeChild               |
| `@douyinfe/semi-illustrations`    | @aifuxi/semi-illustrations-vue      |
| `className / CSSProperties`       | class（兼容 className）/ StyleValue |
