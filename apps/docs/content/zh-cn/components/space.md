---
title: '间距'
description: '设置组件之间的间距。'
locale: 'zh-CN'
slug: 'space'
category: 'basic'
order: 27
englishTitle: 'Space'
icon: 'doc-space'
upstream: 'basic/space'
---

以下章节与示例逐项对应只读 Semi Design v2.102.0 文档。API 表中的版本号指上游版本；运行与源码均来自当前 Vue SFC。

## 代码演示

### 如何引入

```ts
import { Space } from '@aifuxi/semi-ui-vue/space';
import '@aifuxi/semi-theme-default/space.css';
```

### 基本用法

::demo-block{demo="space/zh-cn/Basic" title="基本用法"}
::

### 对齐方式

可使用 `align` 设置对齐方式，可选值：`start`、`center`（默认）、`end`、`baseline`。

::demo-block{demo="space/zh-cn/Alignment" title="对齐方式"}
::

### 间距尺寸

可使用 `spacing` 设置间距大小，内置可选值：`tight`（8px，默认）、`medium`（16px）、`loose`（24px），并且支持传入 number 来自定义间距大小，也支持传入 array 来同时设置水平和垂直方向的间距。

::demo-block{demo="space/zh-cn/Spacing" title="间距尺寸"}
::

### 间距方向

可使用 `vertical` 设置间距是否为垂直方向，默认情况下为 false。

::demo-block{demo="space/zh-cn/Vertical" title="间距方向"}
::

### 设置换行

当间距为水平方向时，可使用 `wrap` 设置是否自动换行，默认情况下为 false。

::demo-block{demo="space/zh-cn/Wrap" title="设置换行"}
::

## API参考

| 属性     | 说明                                                       | 类型                  | 默认值   | 版本     |
| -------- | ---------------------------------------------------------- | --------------------- | -------- | -------- |
| align    | 对齐方式, 支持 `start`、`end`、`center`、`baseline`        | string                | `center` | >=1.17.0 |
| class    | 样式类名                                                   | string                | -        | >=1.17.0 |
| spacing  | 间距尺寸, 支持 `loose`、`medium`、`tight` 或 number、array | string\|number\|array | `tight`  | >=1.17.0 |
| style    | 内联样式                                                   | CSSProperties         | -        | >=1.17.0 |
| vertical | 是否为垂直间距                                             | boolean               | false    | >=1.17.0 |
| wrap     | 是否自动换行                                               | boolean               | false    | >=1.17.0 |

## 设计变量

::token-table{component="space"}
::

## 无障碍

使用原生 `class`、`style`、`id`、`role`、`aria-*` 与 `data-*` 属性。布局不应改变阅读顺序；有交互的子组件应提供明确名称，且能用键盘操作。

## React → Vue 迁移

| React                 | Vue                                 |
| --------------------- | ----------------------------------- |
| `children` / Fragment | 默认插槽，Fragment 展开为直接子节点 |
| `className` / `style` | 原生 `class` / `style`              |
| `spacing={[8,16]}`    | `:spacing="[8,16]"`                 |
| Array.map             | 带稳定 key 的 `v-for`               |

数组第一项控制水平间距，第二项控制垂直间距。`vertical` 为 true 时忽略 `wrap`。数字 spacing 会覆盖调用方 `style` 中同轴 `column-gap` / `row-gap`。默认 spacing 为 `tight`；上游英文 API 表的 `medium` 是文档错误，已依据 Adapter 与 Vue 源码修正。
