---
title: '卡片'
description: '常规的卡片容器，可以承载标题、段落、图片、列表等内容。'
locale: 'zh-CN'
slug: 'card'
category: 'show'
order: 65
englishTitle: 'Card'
icon: 'doc-card'
upstream: 'show/card'
---

## 代码演示

### 如何引入

```ts
import { Card, CardMeta, CardGroup } from '@aifuxi/semi-ui-vue/card';
import '@aifuxi/semi-theme-default/card.css';
```

### 基础卡片

基础卡片包含标题、内容等部分。

::demo-block{demo="card/zh-cn/Basic" title="基础卡片"}
::

### 简洁卡片

卡片可以只设置内容区域。

::demo-block{demo="card/zh-cn/Simple" title="简洁卡片"}
::

### 封面

可以使用 `cover` 属性设置封面。

::demo-block{demo="card/zh-cn/Cover" title="封面"}
::

### 边线和外边框

可以使用 `bordered` 设置卡片是否有外边框，默认为 true 。同时，也可以使用 `headerLine` 设置内容区和标题区是否有边线， `footerLine` 设置内容区和页尾区是否有边线。

::demo-block{demo="card/zh-cn/Border" title="边线和外边框"}
::

### 阴影

可以使用 `shadows` 设置显示阴影的时机，可选值为: `hover`（hover 时显示阴影）、`always`（始终显示阴影），如果不设置该属性则没有阴影。

::demo-block{demo="card/zh-cn/Shadows" title="阴影"}
::

### 更灵活的内容展示

可以利用 `Card.Meta` 支持更灵活的内容，允许设置 `title`、`avatar`、`description`。

::demo-block{demo="card/zh-cn/Flexible" title="更灵活的内容展示"}
::

### 内部卡片

卡片内部可以嵌套其他卡片。

::demo-block{demo="card/zh-cn/Inner" title="内部卡片"}
::

### 栅格卡片

在系统概览页面常常和栅格进行配合。

::demo-block{demo="card/zh-cn/Grid" title="栅格卡片"}
::

### 内置预加载

可以使用 `Card` 的 `loading` 属性来设置卡片内容区是否显示占位元素，当它为 true 时将显示占位元素，反之则不显示。

::demo-block{demo="card/zh-cn/Loading" title="内置预加载"}
::

### 更丰富的预加载效果

`Card` 自带的 `loading` 属性只能设置内容区的预加载效果，如果你想要设置其他部分的预加载，或者自定义更丰富的预加载效果，你可以结合 Skeleton 组件来实现。

::demo-block{demo="card/zh-cn/Skeleton" title="更丰富的预加载效果"}
::

### 带页签的卡片

可以结合 Tabs 组件，实现带页签的卡片。

::demo-block{demo="card/zh-cn/Tabs" title="带页签的卡片"}
::

### 卡片操作区

`actions` 插槽支持多个操作节点，也可传入 VNodeChild 数组，元素间将以 12px 的水平间距展示于内容区底部。

::demo-block{demo="card/zh-cn/Actions" title="卡片操作区"}
::

### 卡片组

`CardGroup` 中的卡片将呈现为等间距排列，利用 `spacing` 属性可以设置卡片间距大小。

::demo-block{demo="card/zh-cn/Group" title="卡片组"}
::

### 网格型卡片组

使用 `CardGroup` 的 `type` 属性，可以将卡片组设置为网格型。

::demo-block{demo="card/zh-cn/GridGroup" title="网格型卡片组"}
::

### API 参考

**Card**

| 属性               | 说明                                                                      | 类型               | 默认值 | 版本 |
| ------------------ | ------------------------------------------------------------------------- | ------------------ | ------ | ---- |
| actions            | 卡片操作组，位于卡片内容区的底部                                          | Array<VNodeChild\> | -      | -    |
| bodyStyle          | 卡片内容区内联样式                                                        | CSSProperties      | -      | -    |
| bordered           | 是否设置卡片的外边框                                                      | boolean            | true   | -    |
| class              | 卡片的样式类名                                                            | string             | -      | -    |
| cover              | 卡片封面                                                                  | VNodeChild         | -      | -    |
| headerExtraContent | 卡片标题右侧的额外内容                                                    | VNodeChild         | -      | -    |
| footer             | 自定义卡片页脚                                                            | VNodeChild         | -      | -    |
| footerLine         | 卡片页脚区与内容区是否有边线                                              | boolean            | false  | -    |
| footerStyle        | 卡片页脚区内联样式                                                        | CSSProperties      | -      | -    |
| header             | 自定义卡片头部，若传入将覆盖 `title` 和 `headerExtraContent`              | VNodeChild         | -      | -    |
| headerLine         | 卡片标题区与内容区是否有边线                                              | boolean            | true   | -    |
| headerStyle        | 卡片标题区内联样式                                                        | CSSProperties      | -      | -    |
| loading            | 是否设置加载时的占位                                                      | boolean            | false  | -    |
| shadows            | 设置显示阴影的时机，如果不设置该属性则没有阴影，可选值：`hover`、`always` | string             | -      | -    |
| style              | 卡片内联样式                                                              | CSSProperties      | -      | -    |
| title              | 卡片标题                                                                  | VNodeChild         | -      | -    |

**CardGroup**

| 属性    | 说明                                                                          | 类型               | 默认值 | 版本 |
| ------- | ----------------------------------------------------------------------------- | ------------------ | ------ | ---- |
| class   | 卡片组的样式类名                                                              | string             | -      | -    |
| spacing | 间距尺寸，支持数值或数组，数组形如: `[水平间距,垂直间距]`                     | number \| number[] | 16     | -    |
| style   | 卡片组的内联样式                                                              | CSSProperties      | -      | -    |
| type    | 可以把卡片组设置为网格型，设置完该属性后将覆盖 `spacing` 属性，可选值：`grid` | string             | -      | -    |

**Card.Meta**

| 属性        | 说明     | 类型          | 默认值 | 版本 |
| ----------- | -------- | ------------- | ------ | ---- |
| avatar      | 头像     | VNodeChild    | -      | -    |
| class       | 类名     | string        | -      | -    |
| description | 描述     | VNodeChild    | -      | -    |
| style       | 内联样式 | CSSProperties | -      | -    |
| title       | 标题     | VNodeChild    | -      | -    |

## Accessibility

- Card 支持传入 `aria-label` 来表示该 Card 作用
- Card loading 时，将开启 `aria-busy`
- Card 为容器型组件，卡片内部的任何元素需要遵循各自的可访问性指南

## 文案规范

- 卡片标题
  - 卡片标题应具有信息描述性，聚焦最重要的信息
  - 尽量将标题限制在 1 个短语或句段中
  - 卡片标题应句子大小写书写
  - 不要以标点符号结尾（除了问号）
- 正文
  - 可操作的：使用祈使句而不是“你可以”来描述正文，可以更好的告诉用户可以做什么

| ✅ 推荐用法                    | ❌ 不推荐用法                          |
| ------------------------------ | -------------------------------------- |
| Get order progress for details | You can get order progress for details |

- 总是优先说最重要的信息
- 使用 “Need to”而不是”must“

## 设计变量

::token-table{component="card"}
::

## FAQ

**为什么 title 没有显示？**

检查是否传入 header 插槽或 prop；完整 header 会覆盖 title 和 headerExtraContent。

## React → Vue 迁移

| React                                                | Vue                                                         |
| ---------------------------------------------------- | ----------------------------------------------------------- |
| children                                             | 默认插槽                                                    |
| title / header / headerExtraContent / cover / footer | 同名具名插槽或 VNodeChild prop，插槽优先                    |
| actions 数组                                         | actions 插槽放置多个顶层节点，或 readonly VNodeChild[] prop |
| Card.Meta                                            | CardMeta，保留 Card.Meta 组合成员                           |
| Meta 的 avatar / title / description                 | 同名插槽或 VNodeChild prop                                  |
| className                                            | class；兼容 className                                       |

header 插槽覆盖 title 和 headerExtraContent。CardGroup 的 spacing 运行时默认值为 16，上游 API 表中的 12px 与固定 Adapter 不一致，本文以 Adapter 为准。卡片本身没有选中状态或 v-model。Card 使用的远程封面、头像已替换为现有本地示例资源。
