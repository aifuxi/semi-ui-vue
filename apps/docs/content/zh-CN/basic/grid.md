---
title: 'Grid 栅格'
description: '24 栅格系统。'
type: 'basic'
order: 20
icon: 'doc-grid'
---

## 概述

布局的栅格化系统，我们是基于行（row）和列（col）来定义信息区块的外部框架，以保证页面的每个区域能够稳健地排布起来。

## 弹性布局

我们的栅格化系统支持 Flex 布局，允许子元素在父节点内的水平对齐方式 - 居左、居中、居右、等宽排列、分散排列。子元素与子元素之间，支持顶部对齐、垂直居中对齐、底部对齐的方式。同时，支持使用 `order` 来定义元素的排列顺序。

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/grid` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-basic-grid-1" title="如何引入" kind="import" />

### 基础使用

从堆叠到水平排列。

使用单一的一组 Row 和 Col 栅格组件，就可以创建一个基本的栅格系统，所有 Col 必须放在 Row 内。

<DemoBlock id="zh-CN-basic-grid-2" title="基础使用" kind="live" />

### Gutter 间隔

栅格常常需要和间隔进行配合，你可以使用 Row 的 `gutter` 属性，我们推荐使用 (16+8n)px 作为栅格间隔。(n 是自然数)

垂直间隔可以使用数组形式，数组第一项为横向间隔，第二项为垂直间隔。

如果要支持响应式，可以写成 `{ xs: 8, sm: 16, md: 24, lg: 32 }`

**从`1.11.0`版本起支持数组形式的垂直间隔**

深色为内容物区域，浅色为间隔

<DemoBlock id="zh-CN-basic-grid-3" title="Gutter 间隔" kind="live" />

### Offset 偏移

<DemoBlock id="zh-CN-basic-grid-4" title="Offset 偏移" kind="live" />

### Flex 布局

使用 `row-flex` 定义 Flex 布局，其子元素根据不同的值 `start`,`center`,`end`,`space-between`,`space-around`，分别定义其在父节点里面的排版方式。

<DemoBlock id="zh-CN-basic-grid-5" title="Flex 布局" kind="live" />

### Flex 子元素垂直对齐

<DemoBlock id="zh-CN-basic-grid-6" title="Flex 子元素垂直对齐" kind="live" />

### Flex 元素排序

通过 Flex 布局的 Order 来改变元素的排序。

<DemoBlock id="zh-CN-basic-grid-7" title="Flex 元素排序" kind="live" />

### 响应式

参照 Bootstrap 的 响应式设计，预设六个响应尺寸：`xs`, `sm`, `md`, `lg`, `xl`, `xxl`。

<DemoBlock id="zh-CN-basic-grid-8" title="响应式" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/grid/types.ts` 的公开类型为准。

#### Vue 用法

- Row 的默认插槽放置 Col；Col 的默认插槽放置列内容。
- `gutter` 支持数值、六断点对象，或按“水平、垂直”排列的二元组；二元组两项也可分别使用断点对象。
- `align` 与 `justify` 仅在 `type="flex"` 时生效。

#### Vue 插槽

**Row**

| 插槽    | 作用域参数 | 说明       |
| ------- | ---------- | ---------- |
| default | {}         | Col 子组件 |

**Col**

| 插槽    | 作用域参数 | 说明   |
| ------- | ---------- | ------ |
| default | {}         | 列内容 |

### Row

| 属性      | 说明                                                                                                     | 类型                                            | 默认值  |
| --------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ------- |
| type      | 布局模式，可选 `flex`，[现代浏览器](http://caniuse.com/#search=flex) 下有效                              | GridRowType                                     | —       |
| align     | flex 布局下的垂直对齐方式：`top` `middle` `bottom`                                                       | GridRowAlign                                    | —       |
| justify   | flex 布局下的水平排列方式：`start` `end` `center` `space-around` `space-between`                         | GridRowJustify                                  | `start` |
| gutter    | 栅格间隔，可以写成像素值或支持响应式的对象写法 `{ xs: 8, sm: 16, md: 24}` **从1.11.0版本起支持垂直间隔** | GridGutter \| readonly [GridGutter, GridGutter] | 0       |
| prefixCls | 样式类名前缀                                                                                             | string                                          | `semi`  |

### Col

| 属性      | 说明                                         | 类型              | 默认值 |
| --------- | -------------------------------------------- | ----------------- | ------ |
| span      | 栅格占位格数，为 0 时相当于 `display: none`  | number            | -      |
| order     | 栅格顺序，`flex` 布局模式下有效              | number            | 0      |
| offset    | 栅格左侧的间隔格数，间隔内不可以有栅格       | number            | 0      |
| push      | 栅格向右移动格数                             | number            | 0      |
| pull      | 栅格向左移动格数                             | number            | 0      |
| prefixCls | 样式类名前缀                                 | string            | `semi` |
| xs        | `&lt;576px` 响应式栅格，可为栅格数或对象配置 | GridResponsiveCol | -      |
| sm        | `≥575px` 响应式栅格，可为栅格数或对象配置    | GridResponsiveCol | -      |
| md        | `≥768px` 响应式栅格，可为栅格数或对象配置    | GridResponsiveCol | -      |
| lg        | `≥992px` 响应式栅格，可为栅格数或对象配置    | GridResponsiveCol | -      |
| xl        | `≥1200px` 响应式栅格，可为栅格数或对象配置   | GridResponsiveCol | -      |
| xxl       | `≥1600px` 响应式栅格，可为栅格数或对象配置   | GridResponsiveCol | -      |
