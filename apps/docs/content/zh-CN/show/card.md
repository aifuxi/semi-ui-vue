---
title: 'Card 卡片'
description: '常规的卡片容器，可以承载标题、段落、图片、列表等内容。'
type: 'show'
order: 65
icon: 'doc-card'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/card` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-show-card-1" title="如何引入" kind="import" />

### 基础卡片

基础卡片包含标题、内容等部分。

<DemoBlock id="zh-CN-show-card-2" title="基础卡片" kind="live" />

### 简洁卡片

卡片可以只设置内容区域。

<DemoBlock id="zh-CN-show-card-3" title="简洁卡片" kind="live" />

### 封面

可以使用 `cover` 属性设置封面。

<DemoBlock id="zh-CN-show-card-4" title="封面" kind="live" />

### 边线和外边框

可以使用 `bordered` 设置卡片是否有外边框，默认为 true。同时，也可以使用 `headerLine` 设置内容区和标题区是否有边线， `footerLine` 设置内容区和页尾区是否有边线。

<DemoBlock id="zh-CN-show-card-5" title="边线和外边框" kind="live" />

### 阴影

可以使用 `shadows` 设置显示阴影的时机，可选值为: `hover`（hover 时显示阴影）、`always`（始终显示阴影），如果不设置该属性则没有阴影。

<DemoBlock id="zh-CN-show-card-6" title="阴影" kind="live" />

### 更灵活的内容展示

可以利用 `Card.Meta` 支持更灵活的内容，允许设置 `title`、`avatar`、`description`。

<DemoBlock id="zh-CN-show-card-7" title="更灵活的内容展示" kind="live" />

### 内部卡片

卡片内部可以嵌套其他卡片。

<DemoBlock id="zh-CN-show-card-8" title="内部卡片" kind="live" />

### 栅格卡片

在系统概览页面常常和栅格进行配合。

<DemoBlock id="zh-CN-show-card-9" title="栅格卡片" kind="live" />

### 内置预加载

可以使用 `Card` 的 `loading` 属性来设置卡片内容区是否显示占位元素，当它为 true 时将显示占位元素，反之则不显示。

<DemoBlock id="zh-CN-show-card-10" title="内置预加载" kind="live" />

### 更丰富的预加载效果

`Card` 自带的 `loading` 属性只能设置内容区的预加载效果，如果你想要设置其他部分的预加载，或者自定义更丰富的预加载效果，你可以结合 Skeleton 组件来实现。

<DemoBlock id="zh-CN-show-card-11" title="更丰富的预加载效果" kind="live" />

### 带页签的卡片

可以结合 Tabs 组件，实现带页签的卡片。

<DemoBlock id="zh-CN-show-card-12" title="带页签的卡片" kind="live" />

### 卡片操作区

`actions` 接收 VNodeChild 数组，元素间将以 12px 的水平间距展示于内容区底部。

<DemoBlock id="zh-CN-show-card-13" title="卡片操作区" kind="live" />

### 卡片组

`CardGroup` 中的卡片将呈现为等间距排列，利用 `spacing` 属性可以设置卡片间距大小。

<DemoBlock id="zh-CN-show-card-14" title="卡片组" kind="live" />

### 网格型卡片组

使用 `CardGroup` 的 `type` 属性，可以将卡片组设置为网格型。

<DemoBlock id="zh-CN-show-card-15" title="网格型卡片组" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/card/types.ts`、`packages/ui/src/card/index.ts` 的公开类型为准。

#### Vue 用法

- `Card.Meta` 同时作为 `Card.Meta` 静态成员和 `CardMeta` 具名导出；`CardGroup` 为具名导出。
- Card 与 CardMeta 的内容均保留 VNode prop；同名插槽优先。
- `CardGroup type="grid"` 时忽略 spacing 并使用网格布局。

#### Vue 插槽

**Card**

| 插槽               | 作用域参数 | 说明             |
| ------------------ | ---------- | ---------------- |
| default            | {}         | 卡片主体内容     |
| actions            | {}         | 内容区底部操作组 |
| cover              | {}         | 卡片封面         |
| footer             | {}         | 卡片页脚         |
| header             | {}         | 完整自定义头部   |
| headerExtraContent | {}         | 标题右侧额外内容 |
| title              | {}         | 卡片标题         |

**CardMeta**

| 插槽        | 作用域参数 | 说明 |
| ----------- | ---------- | ---- |
| avatar      | {}         | 头像 |
| description | {}         | 描述 |
| title       | {}         | 标题 |

**CardGroup**

| 插槽    | 作用域参数 | 说明        |
| ------- | ---------- | ----------- |
| default | {}         | Card 子组件 |

### Card

| 属性               | 说明                                                                      | 类型                    | 默认值 | 版本 |
| ------------------ | ------------------------------------------------------------------------- | ----------------------- | ------ | ---- |
| actions            | 操作 VNode 数组；actions 插槽优先                                         | readonly VNodeChild[]   | -      | -    |
| bodyStyle          | 卡片内容区内联样式                                                        | StyleValue              | -      | -    |
| bordered           | 是否设置卡片的外边框                                                      | boolean                 | true   | -    |
| class              | Vue 原生类名                                                              | HTMLAttributes['class'] | —      |      |
| className          | 样式类名                                                                  | HTMLAttributes['class'] | -      | -    |
| cover              | 封面 VNode；cover 插槽优先                                                | VNodeChild              | -      | -    |
| footer             | 页脚 VNode；footer 插槽优先                                               | VNodeChild              | -      | -    |
| footerLine         | 卡片页脚区与内容区是否有边线                                              | boolean                 | false  | -    |
| footerStyle        | 卡片页脚区内联样式                                                        | StyleValue              | -      | -    |
| header             | 头部 VNode；header 插槽优先                                               | VNodeChild              | -      | -    |
| headerExtraContent | 标题右侧 VNode；headerExtraContent 插槽优先                               | VNodeChild              | -      | -    |
| headerLine         | 卡片标题区与内容区是否有边线                                              | boolean                 | true   | -    |
| headerStyle        | 卡片标题区内联样式                                                        | StyleValue              | -      | -    |
| loading            | 是否设置加载时的占位                                                      | boolean                 | false  | -    |
| shadows            | 设置显示阴影的时机，如果不设置该属性则没有阴影，可选值：`hover`、`always` | CardShadows             | -      | -    |
| style              | 卡片内联样式                                                              | StyleValue              | -      | -    |
| title              | 标题 VNode；title 插槽优先                                                | VNodeChild              | -      | -    |

### CardGroup

| 属性      | 说明                                                                          | 类型                        | 默认值 | 版本 |
| --------- | ----------------------------------------------------------------------------- | --------------------------- | ------ | ---- |
| class     | Vue 原生类名                                                                  | HTMLAttributes['class']     | —      |      |
| className | 样式类名                                                                      | HTMLAttributes['class']     | -      | -    |
| spacing   | 间距尺寸，支持数值或数组，数组形如: `[水平间距,垂直间距]`                     | number \| readonly number[] | 16     | -    |
| style     | 卡片组的内联样式                                                              | StyleValue                  | -      | -    |
| type      | 可以把卡片组设置为网格型，设置完该属性后将覆盖 `spacing` 属性，可选值：`grid` | CardGroupType               | -      | -    |

### Card.Meta

| 属性        | 说明                             | 类型                    | 默认值 | 版本 |
| ----------- | -------------------------------- | ----------------------- | ------ | ---- |
| avatar      | 头像 VNode；avatar 插槽优先      | VNodeChild              | -      | -    |
| class       | Vue 原生类名                     | HTMLAttributes['class'] | —      |      |
| className   | 样式类名                         | HTMLAttributes['class'] | -      | -    |
| description | 描述 VNode；description 插槽优先 | VNodeChild              | -      | -    |
| style       | 内联样式                         | StyleValue              | -      | -    |
| title       | 标题 VNode；title 插槽优先       | VNodeChild              | -      | -    |

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
