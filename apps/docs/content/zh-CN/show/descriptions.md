---
title: 'Descriptions 描述列表'
description: '描述列表用于键值对的呈现。'
type: 'show'
order: 69
icon: 'doc-descriptions'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/descriptions` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-show-descriptions-1" title="如何引入" kind="import" />

### 基本用法

可以通过 `props.data` 以键值对 `{ key: value }` 数组方式传入数据
key、value 均支持 VNodeChild 类型，你可以传入字符串或更高自由度的 VNodeChild 自由定制渲染效果

<DemoBlock id="zh-CN-show-descriptions-2" title="基本用法" kind="live" />

### 设置对齐方式

可以通过设置 `align` 值选择对齐方式，支持 `center`, `justify`, `left`, 和 `plain`。默认对齐方式为 `center`
当 row 为 true 时，该配置无效

<DemoBlock id="zh-CN-show-descriptions-3" title="设置对齐方式" kind="live" />

### 声明式子组件

除了通过 `data` prop 声明数据外，还可以在默认插槽中声明 `DescriptionsItem`。
注意 `Description.Item` 应当是 `Description` 的直接子元素。

<DemoBlock id="zh-CN-show-descriptions-4" title="声明式子组件" kind="live" />

### 设置布局模式

可以通过 `layout` 设置布局模式（v2.54.0 后支持）, 默认为 `vertical` 纵向布局。

<DemoBlock id="zh-CN-show-descriptions-5" title="设置布局模式" kind="live" />

横向布局可设置 layout为 `horizontal`。当设置 horizontal 时，可配合 column 指定每行最大列数

<DemoBlock id="zh-CN-show-descriptions-6" title="设置布局模式" kind="live" />

### 双行显示

可以通过设置 `row` 可选择双行显示，支持三种不同的大小：`small`, `medium`, `large`。默认大小为 `medium`，此时 align 配置不再生效

<DemoBlock id="zh-CN-show-descriptions-7" title="双行显示" kind="live" />

### 自定义 Key 样式

可以通过 `keyStyle` 属性自定义 key 的样式，例如设置固定宽度实现对齐效果。该属性支持所有 CSS 样式，如 `width`、`maxWidth`、`textAlign`、`color` 等。

<DemoBlock id="zh-CN-show-descriptions-8" title="自定义 Key 样式" kind="live" />

也可以配合 `DescriptionsItem` 使用：

<DemoBlock id="zh-CN-show-descriptions-9" title="自定义 Key 样式" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/descriptions/types.ts`、`packages/ui/src/descriptions/index.ts` 的公开类型为准。

#### Vue 用法

- 非空 `data` 优先于默认插槽；空数组回退到声明式 `DescriptionsItem`。
- `DescriptionsItem` 同时作为 `Descriptions.Item` 静态成员和具名导出提供。

#### Vue 插槽

**Descriptions**

| 插槽    | 作用域参数 | 说明                    |
| ------- | ---------- | ----------------------- |
| default | {}         | DescriptionsItem 子组件 |

**DescriptionsItem**

| 插槽    | 作用域参数 | 说明                      |
| ------- | ---------- | ------------------------- |
| default | {}         | 属性值                    |
| key     | {}         | 键值，优先于 itemKey prop |

### Descriptions

| 属性      | 说明                                                             | 类型                            | 默认值     |
| --------- | ---------------------------------------------------------------- | ------------------------------- | ---------- |
| align     | 描述列表的对齐方式，可选 `center`、 `justify`、 `left`、 `plain` | DescriptionsAlign               | `center`   |
| row       | 是否双行显示                                                     | boolean                         | false      |
| size      | 设置双行显示时的列表的大小，可选 `small`、 `medium`、 `large`    | DescriptionsSize                | `medium`   |
| class     | Vue 原生类名                                                     | HTMLAttributes['class']         | —          |
| className | 样式类名                                                         | HTMLAttributes['class']         | 无         |
| style     | 列表的样式                                                       | StyleValue                      | 无         |
| data      | 列表显示的内容                                                   | readonly DescriptionsDataItem[] | 无         |
| layout    | 列表布局模式，可选 `vertical`、`horizontal` **v&gt;=2.54.0**     | DescriptionsLayout              | `vertical` |
| column    | `horizontal` 横向布局下，每行的总列数 **v&gt;=2.54.0**           | number                          | 3          |

### DataItem

| 属性      | 说明                                         | 类型                                | 默认值 |
| --------- | -------------------------------------------- | ----------------------------------- | ------ |
| key       | 键值                                         | VNodeChild                          | -      |
| value     | 属性值                                       | VNodeChild \| (() =&gt; VNodeChild) | -      |
| hidden    | 该数据是否需要展示                           | boolean                             | false  |
| span      | 单元格应跨越的列数 **v&gt;=2.54.0**          | number                              | 1      |
| keyStyle  | key 的自定义样式，可用于设置宽度、对齐方式等 | StyleValue                          | -      |
| class     | Item 样式类名                                | HTMLAttributes['class']             | —      |
| className | Item 样式类名                                | HTMLAttributes['class']             | —      |
| style     | Item 内联样式                                | StyleValue                          | —      |

### DescriptionItem

| 属性      | 说明                                         | 类型                    | 默认值 |
| --------- | -------------------------------------------- | ----------------------- | ------ |
| hidden    | 该数据是否需要展示                           | boolean                 | false  |
| class     | Vue 原生类名                                 | HTMLAttributes['class'] | —      |
| className | Item 样式类名                                | HTMLAttributes['class'] | -      |
| style     | Item 外部wrapper: tr 的内联样式              | StyleValue              | -      |
| itemKey   | 键值                                         | VNodeChild              | -      |
| span      | 单元格应跨越的列数 **v&gt;=2.54.0**          | number                  | 1      |
| keyStyle  | key 的自定义样式，可用于设置宽度、对齐方式等 | StyleValue              | -      |

## 文案规范

- 字段名和值都按 Sentence case 原则书写大小写
