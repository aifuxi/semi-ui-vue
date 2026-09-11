---
title: '悬浮按钮'
description: '悬浮按钮是可以悬浮在页面上的可操作按钮'
locale: 'zh-CN'
slug: 'float-button'
category: 'basic'
order: 23
englishTitle: 'FloatButton'
icon: 'doc-floatButton'
upstream: 'basic/floatbutton'
---

## 代码演示

### 如何引入

FloatButton 自 2.85.0 支持。

```vue
<script setup lang="ts">
import { FloatButton, FloatButtonGroup } from '@aifuxi/semi-ui-vue/float-button';
import '@aifuxi/semi-theme-default/float-button.css';
</script>
```

### 基本用法

::demo-block{demo="float-button/zh-cn/Basic" title="基本用法"}
::

### 尺寸

支持三种尺寸：默认，小，大。

::demo-block{demo="float-button/zh-cn/Size" title="尺寸"}
::

### 形状

支持两种形状：round（默认）、square。

::demo-block{demo="float-button/zh-cn/Shape" title="形状"}
::

### 点击跳转

通过 `href` 设置跳转地址。固定实现仅特殊处理 `target="_blank"`，此时打开新窗口；其他值及未设置时均在当前页面跳转。

::demo-block{demo="float-button/zh-cn/Link" title="点击跳转"}
::

### AI 风格 - 多彩悬浮按钮

可设置 `colorful` 为 true，展示多彩的悬浮按钮。

::demo-block{demo="float-button/zh-cn/Colorful" title="AI 风格 - 多彩悬浮按钮"}
::

### 带徽章的

::demo-block{demo="float-button/zh-cn/Badge" title="带徽章的"}
::

### 悬浮按钮组

可通过 `items` 传入子项

::demo-block{demo="float-button/zh-cn/Group" title="悬浮按钮组"}
::

## API 参考

### FloatButton

| 属性       | 说明                                                                                      | 类型                    | 默认值    |
| ---------- | ----------------------------------------------------------------------------------------- | ----------------------- | --------- |
| `shape`    | 样式，支持 round、 square                                                                 | `FloatButtonShape`      | `round`   |
| `colorful` | 多彩悬浮按钮                                                                              | `boolean`               | `false`   |
| `icon`     | 显示图标                                                                                  | `VNodeChild`            | `—`       |
| `href`     | 点击跳转的链接, 同 [href](https://developer.mozilla.org/zh-CN/docs/Web/API/Location/href) | `string`                | `—`       |
| `target`   | `_blank` 打开新窗口；其他值在当前页面跳转                                                 | `string`                | `—`       |
| `disabled` | 禁用状态                                                                                  | `boolean`               | `false`   |
| `size`     | 尺寸，支持 default、small、large                                                          | `FloatButtonSize`       | `default` |
| `badge`    | 徽章参数                                                                                  | `FloatButtonBadgeProps` | `—`       |

### FloatButtonBadge

| 属性             | 说明                             | 类型                             | 默认值     |
| ---------------- | -------------------------------- | -------------------------------- | ---------- |
| `count`          | 徽章显示内容                     | `VNodeChild`                     | `—`        |
| `dot`            | 使用圆点徽章                     | `boolean`                        | `false`    |
| `type`           | 徽章语义颜色                     | `FloatButtonBadgeType`           | `primary`  |
| `theme`          | 徽章主题：solid、light、inverted | `FloatButtonBadgeTheme`          | `solid`    |
| `position`       | 徽章位置                         | `FloatButtonBadgePosition`       | `rightTop` |
| `overflowCount`  | 徽章最大显示数值                 | `number`                         | `—`        |
| `style`          | 样式                             | `CSSProperties`                  | `—`        |
| `className`      | 样式类名                         | `string`                         | `—`        |
| `countClassName` | 计数节点类名                     | `string`                         | `—`        |
| `countStyle`     | 计数节点样式                     | `CSSProperties`                  | `—`        |
| `onClick`        | 点击回调函数                     | `(event: MouseEvent) => unknown` | `—`        |
| `onMouseEnter`   | 鼠标进入回调                     | `(event: MouseEvent) => unknown` | `—`        |
| `onMouseLeave`   | 鼠标离开回调                     | `(event: MouseEvent) => unknown` | `—`        |

### FloatButtonGroupItem

在 FloatButtonProps 基础上增加以下字段。

| 属性      | 说明        | 类型         | 默认值 |
| --------- | ----------- | ------------ | ------ |
| `value`   | item 的标识 | `string`     | `—`    |
| `content` | 文本内容    | `VNodeChild` | `—`    |

### FloatButtonGroup

| 属性       | 说明           | 类型                              | 默认值  |
| ---------- | -------------- | --------------------------------- | ------- |
| `disabled` | 禁用状态       | `boolean`                         | `false` |
| `items`    | 单个子项的信息 | `readonly FloatButtonGroupItem[]` | `—`     |

FloatButton 提供 #icon 插槽，派发 `@click(event: MouseEvent)`。FloatButtonGroup 的 items 必填，支持 `#item="{ item, index }"`，派发 `@click(value, event: MouseEvent)`。组内 content 接受 Vue 节点。使用 class/style 原生属性，className 不是 Vue 样式 prop。badge 内部回调仍是函数字段，类型为 FloatButtonBadgeProps，不是 Badge 的所有属性。

Group 的 item 类型继承 FloatButtonProps，但固定实现只读取 icon、content、badge 和 value，不执行 item 的 href、target 或 disabled。Group 自身的 disabled 只添加状态类，不拦截点击回调。

## Accessibility

为仅图标操作提供可访问名称。固定源码按钮使用指针点击语义，仅添加 aria-label 不会产生原生按钮键盘行为；需要键盘操作时应在业务中提供可访问入口。

## 文案规范

使用简短操作名称，组内文字应易于区分。

## 设计变量

::token-table{component="floatButton"}
::

## FAQ

**按钮在哪里定位？** 默认相对视口固定定位，可通过 style 设置 bottom、insetInlineEnd。

**禁用后为什么不跳转？** 单个 FloatButton 的 disabled 会阻止点击处理和 href 跳转；Group 的 disabled 不具有这一拦截行为。

**组点击返回什么？** 返回 MouseEvent 及事件目标的 `data-value`。点击 item 自身时为配置的 value；点击图标等后代节点时可能为 undefined。

## React → Vue

| React                              | Vue                      |
| ---------------------------------- | ------------------------ |
| `icon ReactNode`                   | `#icon / VNodeChild`     |
| `FloatButtonGroup items[].content` | `VNodeChild`             |
| `onClick`                          | `@click`                 |
| `className`                        | `class native attribute` |
