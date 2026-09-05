---
title: '描述列表'
description: '描述列表用于键值对的呈现。'
locale: 'zh-CN'
slug: 'descriptions'
category: 'show'
order: 69
englishTitle: 'Descriptions'
icon: 'doc-descriptions'
upstream: 'show/descriptions'
---

## 代码演示

### 如何引入

```vue
<script setup lang="ts">
import { Descriptions } from '@aifuxi/semi-ui-vue/descriptions';
import '@aifuxi/semi-theme-default/descriptions.css';
</script>
```

### 基本用法

可以通过 `props.data` 以 `{ key, value }` 对象数组方式传入数据  
key、value 均支持 `VNodeChild`。简单内容传字符串；复杂节点可由 Vue `h()` 创建，或改用 `DescriptionsItem` 的默认插槽和 `#key` 插槽。

::demo-block{demo="descriptions/zh-cn/Basic" title="基本用法"}
::

### 设置对齐方式

可以通过设置 `align` 值选择对齐方式，支持 `center`, `justify`, `left`, 和 `plain`。默认对齐方式为 `center`  
当 row 为 true 时，该配置无效

::demo-block{demo="descriptions/zh-cn/Alignment" title="设置对齐方式"}
::

### 模板写法（对应 JSX 写法）

除了通过 props.data 声明数据外，还可以通过 默认插槽与 `DescriptionsItem` 声明数据  
注意 `DescriptionsItem` 应当是 `Descriptions` 的直接子元素。

::demo-block{demo="descriptions/zh-cn/Items" title="模板写法"}
::

### 设置布局模式

可以通过 `layout` 设置布局模式（上游自 v2.54.0 支持）, 默认为 `vertical` 纵向布局 。

::demo-block{demo="descriptions/zh-cn/Vertical" title="设置布局模式"}
::

横向布局可设置 layout为 `horizontal` 。当设置 horizontal 时，可配合 column 指定每行最大列数

::demo-block{demo="descriptions/zh-cn/Horizontal" title="设置布局模式"}
::

### 双行显示

可以通过设置 `row` 可选择双行显示，支持三种不同的大小：`small`, `medium`, `large`。默认大小为 `medium`，此时 align 配置不再生效

::demo-block{demo="descriptions/zh-cn/DoubleRow" title="双行显示"}
::

### 自定义 Key 样式

可以通过 `keyStyle` 属性自定义 key 的样式，例如设置固定宽度实现对齐效果。该属性支持所有 CSS 样式，如 `width`、`maxWidth`、`textAlign`、`color` 等。

::demo-block{demo="descriptions/zh-cn/KeyStyle" title="自定义 Key 样式"}
::

也可以配合 Vue 模板写法使用：

::demo-block{demo="descriptions/zh-cn/ItemKeyStyle" title="自定义 Key 样式"}
::

## API 参考

### Descriptions

| 属性                | 说明                                               | 类型                              | 默认值     |
| ------------------- | -------------------------------------------------- | --------------------------------- | ---------- |
| `align`             | center、justify、left、plain；row 为 true 时不适用 | `DescriptionsAlign`               | `center`   |
| `class / className` | 外层样式类                                         | `HTMLAttributes["class"]`         | `—`        |
| `data`              | 描述项数组；非空时优先于默认插槽                   | `readonly DescriptionsDataItem[]` | `[]`       |
| `row`               | 双行显示：键在上，值在下                           | `boolean`                         | `false`    |
| `size`              | 双行显示尺寸 small、medium、large                  | `DescriptionsSize`                | `medium`   |
| `style`             | 外层样式                                           | `StyleValue`                      | `—`        |
| `layout`            | vertical、horizontal                               | `DescriptionsLayout`              | `vertical` |
| `column`            | horizontal 布局每行列数                            | `number`                          | `3`        |

### DataItem (`DescriptionsDataItem`)

| 属性                | 说明                        | 类型                              | 默认值 |
| ------------------- | --------------------------- | --------------------------------- | ------ |
| `key`               | 标签节点                    | `VNodeChild`                      | `—`    |
| `value`             | 值节点或返回值节点的函数    | `VNodeChild / (() => VNodeChild)` | `—`    |
| `hidden`            | true 隐藏该项，不占布局位置 | `boolean`                         | `—`    |
| `span`              | 跨列数                      | `number`                          | `1`    |
| `keyStyle`          | 标签样式                    | `StyleValue`                      | `—`    |
| `class / className` | 纵向布局中行样式类          | `HTMLAttributes["class"]`         | `—`    |
| `style`             | 纵向布局中行样式            | `StyleValue`                      | `—`    |

### DescriptionsItem

| 属性                | 说明                      | 类型                      | 默认值 |
| ------------------- | ------------------------- | ------------------------- | ------ |
| `itemKey`           | 标签节点，也可用 key 插槽 | `VNodeChild`              | `—`    |
| `hidden`            | true 隐藏该项             | `boolean`                 | `—`    |
| `class / className` | 纵向布局 tr 的样式类      | `HTMLAttributes["class"]` | `—`    |
| `style`             | 纵向布局 tr 的样式        | `StyleValue`              | `—`    |
| `span`              | 跨列数                    | `number`                  | `1`    |
| `keyStyle`          | 标签样式                  | `StyleValue`              | `—`    |

`DescriptionsItem` 应作为 `Descriptions` 的直接子节点，默认插槽为值，`#key` 为标签。横向布局按可见项的 `span` 分组；末项未指定 span 时补齐剩余列。

## 文案规范

- 字段名和值都按 Sentence case 原则书写大小写

## 设计变量

::token-table{component="descriptions"}
::

## Accessibility

使用明确的字段标签，并保持键值顺序有意义。组件渲染 table 行与单元格；值包含操作时使用原生链接或按钮并保留键盘焦点行为。

## FAQ

**为什么 row 下 align 不生效？** 双行显示使用独立的上下排列布局。

**为什么 column 不生效？** 仅 `layout="horizontal"` 按 column 分组，span 控制占用列数。

**为什么 Item 没有显示？** 检查 hidden，以及是否传入了优先级更高的非空 data 数组。

## React → Vue

| React                                   | Vue                                               |
| --------------------------------------- | ------------------------------------------------- |
| `Descriptions.Item children`            | DescriptionsItem 默认插槽                         |
| `itemKey={<Node />}`                    | key 插槽或 :item-key                              |
| `data 中的 ReactNode / render function` | VNodeChild / 返回 VNodeChild 的函数；使用 Vue h() |
| `JSX 内联 style 数字`                   | 长度值用带单位的 CSS 字符串，如 100px             |
| `className / CSSProperties`             | class（兼容 className）/ StyleValue               |

示例使用公开 Vue 组件子路径；预览和源码编辑器读取同一个 SFC。参考基线为本地 Semi Design v2.102.0 submodule（`cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`）。
