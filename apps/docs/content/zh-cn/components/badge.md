---
title: '徽章'
description: '用徽章来给用户提示。'
locale: 'zh-CN'
slug: 'badge'
category: 'show'
order: 63
englishTitle: 'Badge'
icon: 'doc-badge'
upstream: 'show/badge'
---

## 代码演示

### 如何引入

```vue
<script setup lang="ts">
import { Badge } from '@aifuxi/semi-ui-vue/badge';
import '@aifuxi/semi-theme-default/badge.css';
</script>
```

### 基本用法

Badge 的基本类型为 `count`。如果传入 `dot` 则显示为小圆点，两者互斥，优先渲染小圆点。当传入是节点类型时，将直接渲染该节点。

::demo-block{demo="badge/zh-cn/Basic" title="基本用法"}
::

### 设置显示数字最大值

可以通过设置 `overflowCount` 值设置显示数字的最大值，当实际数值超过该值时将以 `${overflowCount}+` 的格式显示。

::demo-block{demo="badge/zh-cn/Overflow" title="设置显示数字最大值"}
::

### 设置徽标位置

可以通过设置 `position` 设置位置，支持：`leftTop`， `leftBottom`， `rightTop`（LTR 默认，RTL 默认为 `leftTop`）， `rightBottom`。

::demo-block{demo="badge/zh-cn/Position" title="设置徽标位置"}
::

### 设置徽标样式

可以通过设置 `theme` 和 `type` 设置徽标的样式。其中 `theme` 支持三种形式：`solid`, `light`, `inverted`。默认形式为 `solid`。

::demo-block{demo="badge/zh-cn/Theme" title="设置徽标样式"}
::

`type` 支持如下类型：`primary`，`secondary`，`tertiary`，`warning`、`danger` 和 `success`。默认类型为 `primary`。

::demo-block{demo="badge/zh-cn/Type" title="设置徽标样式"}
::

### 独立使用

当 Badge 作为独立元素时可以单独使用。

::demo-block{demo="badge/zh-cn/Standalone" title="独立使用"}
::

## API 参考

| 属性                | 说明                                                   | 类型                      | 默认值                        |
| ------------------- | ------------------------------------------------------ | ------------------------- | ----------------------------- |
| `class / className` | 外层样式类                                             | `HTMLAttributes["class"]` | `—`                           |
| `count`             | 展示内容；复杂节点也可用 count 插槽                    | `VNodeChild`              | `—`                           |
| `countClassName`    | 内容区域样式类                                         | `HTMLAttributes["class"]` | `—`                           |
| `dot`               | 显示圆点，优先于 count                                 | `boolean`                 | `false`                       |
| `overflowCount`     | 数字显示上限；超过后显示 N+，缺省不限                  | `number`                  | `—`                           |
| `position`          | leftTop、leftBottom、rightTop、rightBottom             | `BadgePosition`           | `LTR: rightTop; RTL: leftTop` |
| `countStyle`        | 徽章内容样式                                           | `StyleValue`              | `—`                           |
| `style`             | 兼容上游：作用于徽章内容，优先于 countStyle            | `StyleValue`              | `—`                           |
| `theme`             | solid、light、inverted                                 | `BadgeTheme`              | `solid`                       |
| `type`              | primary、secondary、tertiary、danger、warning、success | `BadgeType`               | `primary`                     |

插槽：`default` 提供基底，`count` 提供自定义徽标节点。事件：`@click`、`@mouseenter`、`@mouseleave`，参数均为原生 `MouseEvent`。

## 文案规范

- Badge内容若为英文时，首字母应大写

## 设计变量

::token-table{component="badge"}
::

## Accessibility

状态提示不能只依靠圆点颜色，应同时提供可见文字。Badge 是 span，不自带键盘控件语义。需要触发操作时，应由具有可访问名称的按钮或链接承载。

## FAQ

**为什么 count 没有显示？** `dot` 优先。数字上限只作用于数字 count；自定义节点走自定义徽标样式。

**为什么 style 改的是徽标而不是基底？** 这是固定上游兼容语义；要改变基底，请设置默认插槽内元素的样式。

## React → Vue

| React                                   | Vue                                 |
| --------------------------------------- | ----------------------------------- |
| `children`                              | default 插槽                        |
| `count={<Node />}`                      | count 插槽或 VNodeChild 属性        |
| `onClick / onMouseEnter / onMouseLeave` | @click / @mouseenter / @mouseleave  |
| `className / CSSProperties`             | class（兼容 className）/ StyleValue |

示例使用公开 Vue 组件子路径；预览和源码编辑器读取同一个 SFC。参考基线为本地 Semi Design v2.102.0 submodule（`cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`）。
