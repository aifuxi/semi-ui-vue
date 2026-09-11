---
title: '栅格'
description: '24 栅格系统。'
locale: 'zh-CN'
slug: 'grid'
category: 'basic'
order: 20
englishTitle: 'Grid'
icon: 'doc-grid'
upstream: 'basic/grid'
---

以下章节与示例逐项对应只读 Semi Design v2.102.0 文档。API 表中的版本号指上游版本；运行与源码均来自当前 Vue SFC。

## 概述

布局的栅格化系统，我们是基于行（row）和列（col）来定义信息区块的外部框架，以保证页面的每个区域能够稳健地排布起来。

## 弹性布局

我们的栅格化系统支持 Flex 布局，允许子元素在父节点内的水平对齐方式 - 居左、居中、居右、等宽排列、分散排列。子元素与子元素之间，支持顶部对齐、垂直居中对齐、底部对齐的方式。同时，支持使用 `order` 来定义元素的排列顺序。

## 代码演示

### 如何引入

```ts
import { Col, Row } from '@aifuxi/semi-ui-vue/grid';
import '@aifuxi/semi-theme-default/grid.css';
```

### 基础使用

从堆叠到水平排列。

使用单一的一组 Row 和 Col 栅格组件，就可以创建一个基本的栅格系统，所有 Col 必须放在 Row 内。

::demo-block{demo="grid/zh-cn/Basic" title="基础使用"}
::

### Gutter 间隔

栅格常常需要和间隔进行配合，你可以使用 Row 的 `gutter` 属性，我们推荐使用 (16+8n)px 作为栅格间隔。(n 是自然数)

垂直间隔可以使用数组形式，数组第一项为横向间隔，第二项为垂直间隔。

如果要支持响应式，可以写成 `{ xs: 8, sm: 16, md: 24, lg: 32 }`

**从`1.11.0`版本起支持数组形式的垂直间隔**

深色为内容物区域，浅色为间隔

::demo-block{demo="grid/zh-cn/Gutter" title="Gutter 间隔"}
::

### Offset 偏移

::demo-block{demo="grid/zh-cn/Offset" title="Offset 偏移"}
::

### Flex 布局

使用 `<Row type="flex">` 定义 Flex 布局，其子元素根据不同的值 `start`,`center`,`end`,`space-between`,`space-around`，分别定义其在父节点里面的排版方式。

::demo-block{demo="grid/zh-cn/Flex" title="Flex 布局"}
::

### Flex 子元素垂直对齐

::demo-block{demo="grid/zh-cn/VerticalAlign" title="Flex 子元素垂直对齐"}
::

### Flex 元素排序

通过 Flex 布局的 Order 来改变元素的排序。

::demo-block{demo="grid/zh-cn/Order" title="Flex 元素排序"}
::

### 响应式

参照 Bootstrap 的 响应式设计，预设六个响应尺寸：`xs`, `sm`, `md`, `lg`, `xl`, `xxl`。

::demo-block{demo="grid/zh-cn/Responsive" title="响应式"}
::

## API 参考

### Row

| 属性    | 说明                                                                                                          | 类型                                  | 默认值 |
| ------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------- | ------ |
| align   | flex 布局下的垂直对齐方式：`top` `middle` `bottom`                                                            | string                                |        |
| class   | 类名                                                                                                          | string                                |        |
| gutter  | 栅格间隔，可以写成像素值或支持响应式的对象写法 `{ xs: 8, sm: 16, md: 24}`<br />**从1.11.0版本起支持垂直间隔** | number\|object\|Array<number\|object> | `0`    |
| justify | flex 布局下的水平排列方式：`start` `end` `center` `space-around` `space-between`                              | string                                | —      |
| style   | 自定义样式                                                                                                    | CSSProperties                         |        |
| type    | 布局模式，可选 `flex`，[现代浏览器](http://caniuse.com/#search=flex) 下有效                                   | string                                |        |

### Col

| 属性   | 说明                                        | 类型           | 默认值 |
| ------ | ------------------------------------------- | -------------- | ------ |
| lg     | `≥992px` 响应式栅格，可为栅格数或对象配置   | number\|object | -      |
| md     | `≥768px` 响应式栅格，可为栅格数或对象配置   | number\|object | -      |
| offset | 栅格左侧的间隔格数，间隔内不可以有栅格      | number         | —      |
| order  | 栅格顺序，`flex` 布局模式下有效             | number         | —      |
| pull   | 栅格向左移动格数                            | number         | —      |
| push   | 栅格向右移动格数                            | number         | —      |
| sm     | `≥576px` 响应式栅格，可为栅格数或对象配置   | number\|object | -      |
| span   | 栅格占位格数，为 0 时相当于 `display: none` | number         | -      |
| xl     | `≥1200px` 响应式栅格，可为栅格数或对象配置  | number\|object | -      |
| xs     | `<576px` 响应式栅格，可为栅格数或对象配置   | number\|object | -      |
| xxl    | `≥1600px` 响应式栅格，可为栅格数或对象配置  | number\|object | -      |

## 设计变量

::token-table{component="grid"}
::

## 无障碍

使用原生 `class`、`style`、`id`、`role`、`aria-*` 与 `data-*` 属性。布局不应改变阅读顺序；有交互的子组件应提供明确名称，且能用键盘操作。

## React → Vue 迁移

| React              | Vue                 |
| ------------------ | ------------------- |
| `children`         | `default` 插槽      |
| `className`        | 原生 `class`        |
| `gutter={[16,24]}` | `:gutter="[16,24]"` |
| `xs={{ span:8 }}`  | `:xs="{ span:8 }"`  |

Row / Col 还公开 `prefixCls: string`，默认 `semi`。Col 必须在 Row 内。六个断点属性也支持 `ColSize` 对象：`span`、`order`、`offset`、`push`、`pull`。`justify`、`offset`、`order`、`push`、`pull` 的 prop 默认值为未设置；对应浏览器布局效果分别为起始对齐或零偏移。`sm` 的实际源码断点为 576px（已纠正上游表格中的 575px）。视觉排序不改变 DOM 与屏幕阅读器的阅读顺序。
