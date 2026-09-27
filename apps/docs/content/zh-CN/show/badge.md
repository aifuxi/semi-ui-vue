---
title: 'Badge 徽章'
description: '用徽章来给用户提示。'
type: 'show'
order: 63
icon: 'doc-badge'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/badge` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-show-badge-1" title="如何引入" kind="import" />

### 基本用法

Badge 的基本类型为 `count`。如果传入 `dot` 则显示为小圆点，两者互斥，优先渲染小圆点。当传入是节点类型时，将直接渲染该节点。

<DemoBlock id="zh-CN-show-badge-2" title="基本用法" kind="live" />

### 设置显示数字最大值

可以通过设置 `overflowCount` 值设置显示数字的最大值，当实际数值超过该值时将以 `${overflowCount}+` 的格式显示。

<DemoBlock id="zh-CN-show-badge-3" title="设置显示数字最大值" kind="live" />

### 设置徽标位置

可以通过设置 `position` 设置位置，支持：`leftTop`， `leftBottom`， `rightTop`（默认）， `rightBottom`。

<DemoBlock id="zh-CN-show-badge-4" title="设置徽标位置" kind="live" />

### 设置徽标样式

可以通过设置 `theme` 和 `type` 设置徽标的样式。其中 `theme` 支持三种形式：`solid`, `light`, `inverted`。默认形式为 `solid`。

<DemoBlock id="zh-CN-show-badge-5" title="设置徽标样式" kind="live" />

`type` 支持如下类型：`primary`，`secondary`，`tertiary`，`warning` 和 `danger`。默认类型为 `primary`。

<DemoBlock id="zh-CN-show-badge-6" title="设置徽标样式" kind="live" />

### 独立使用

当 Badge 作为独立元素时可以单独使用。

<DemoBlock id="zh-CN-show-badge-7" title="独立使用" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/badge/types.ts`、`packages/ui/src/badge/index.ts` 的公开类型为准。

#### Vue 事件

**Badge**

| 事件       | 参数                | 说明         |
| ---------- | ------------------- | ------------ |
| click      | [event: MouseEvent] | 点击徽标     |
| mouseenter | [event: MouseEvent] | 指针进入徽标 |
| mouseleave | [event: MouseEvent] | 指针离开徽标 |

#### Vue 插槽

**Badge**

| 插槽    | 作用域参数 | 说明         |
| ------- | ---------- | ------------ |
| default | {}         | 徽标基底内容 |
| count   | {}         | 徽标内容     |

| 属性           | 说明                                                                                   | 类型                    | 默认值     |
| -------------- | -------------------------------------------------------------------------------------- | ----------------------- | ---------- |
| class          | —                                                                                      | HTMLAttributes['class'] | —          |
| className      | 外侧 className                                                                         | HTMLAttributes['class'] | -          |
| count          | 展示的内容                                                                             | VNodeChild              | 无         |
| countClassName | 内容区域 className                                                                     | HTMLAttributes['class'] | 无         |
| countStyle     | 徽章内容的样式, v2.59.1后生效                                                          | StyleValue              | 无         |
| dot            | 不展示数字，显示小圆点                                                                 | boolean                 | false      |
| overflowCount  | 最大的展示数字值                                                                       | number                  | 无         |
| position       | 徽章位置，可选 `leftTop`、 `leftBottom`、 `rightTop`、 `rightBottom`                   | BadgePosition           | `rightTop` |
| style          | —                                                                                      | StyleValue              | —          |
| theme          | 徽章主题，可选 `solid`、 `light`、 `inverted`                                          | BadgeTheme              | `solid`    |
| type           | 徽章类型，可选 `primary`、 `secondary`、 `tertiary`、 `danger`、 `warning`、 `success` | BadgeType               | `primary`  |

## 文案规范

- Badge内容若为英文时，首字母应大写
