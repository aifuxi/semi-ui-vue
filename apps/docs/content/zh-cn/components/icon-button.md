---
title: '图标按钮'
description: 'IconButton 对齐 Semi Design `v2.102.0` 中仍保留导出的图标按钮。固定上游 changelog 已将它标记为'
locale: 'zh-CN'
slug: 'icon-button'
category: 'other'
order: 100
englishTitle: 'IconButton'
---

IconButton 对齐 Semi Design `v2.102.0` 中仍保留导出的图标按钮。固定上游 changelog 已将它标记为
“不再推荐”，因此新代码通常应直接使用 `Button` 的 `#icon` slot；当你需要兼容既有 IconButton 导入和
固定 `with-icon` DOM/class 契约时，可以继续使用本组件。

::demo-block{demo="icon-button/zh-CN/Example1" title="图标按钮"}
::

## API

| 属性                  | 类型                                                              | 默认值          | 说明                                                     |
| --------------------- | ----------------------------------------------------------------- | --------------- | -------------------------------------------------------- |
| `type`                | `'primary' \| 'secondary' \| 'tertiary' \| 'warning' \| 'danger'` | `'primary'`     | 按钮类型                                                 |
| `theme`               | `'solid' \| 'borderless' \| 'light' \| 'outline'`                 | `'light'`       | 按钮主题                                                 |
| `size`                | `'default' \| 'small' \| 'large'`                                 | `'default'`     | 按钮尺寸                                                 |
| `iconPosition`        | `'left' \| 'right'`                                               | `'left'`        | 图标相对文字的位置                                       |
| `iconSize`            | Icon size                                                         | -               | 作为 `#icon` slot prop 暴露；固定 Adapter 不强制写入图标 |
| `iconStyle`           | Vue `StyleValue`                                                  | -               | 作为 `#icon` slot prop 暴露；由调用方决定是否应用        |
| `loading`             | `boolean`                                                         | `false`         | 非 disabled 时用固定加载图标替换 icon                    |
| `disabled`            | `boolean`                                                         | `false`         | 同步原生 disabled 和 `aria-disabled`，并阻止公开鼠标事件 |
| `noHorizontalPadding` | `boolean \| 'left' \| 'right' \| ('left' \| 'right')[]`           | `false`         | 移除指定方向的水平 padding                               |
| `block`               | `boolean`                                                         | `false`         | 块级宽度                                                 |
| `circle`              | `boolean`                                                         | `false`         | 圆形样式                                                 |
| `colorful`            | `boolean`                                                         | `false`         | 启用固定多彩图标 fill 契约                               |
| `htmlType`            | `'button' \| 'reset' \| 'submit'`                                 | `'button'`      | 原生 button type                                         |
| `prefixCls`           | `string`                                                          | `'semi-button'` | class 前缀                                               |
| `contentClass`        | Vue class value                                                   | -               | 内容 span 的附加 class，对应 React `contentClassName`    |

原生 `class`、`style`、`id`、`aria-*` 与 `data-*` 会落到根 button。

## Slots

| Slot      | Slot props                      | 说明                                          |
| --------- | ------------------------------- | --------------------------------------------- |
| `icon`    | `{ fill, iconSize, iconStyle }` | 图标内容；icon-only 时应同时提供 `aria-label` |
| `default` | -                               | 可选文字内容；省略时保持固定 icon-only class  |

## Events

组件发出 `click`、`mousedown`、`mouseenter` 和 `mouseleave`，参数都是原生 `MouseEvent`。disabled 时
不发出这些事件。

完整源码证据、RTL/SSR/视觉矩阵和 deviation 见 [对齐矩阵](https://github.com/aifuxi/semi-ui-vue/blob/master/docs/components/icon-button/alignment.md)，React 迁移方式见
[React → Vue](#react-vue)。
