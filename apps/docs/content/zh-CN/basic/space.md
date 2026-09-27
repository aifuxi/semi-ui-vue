---
title: 'Space 间距'
description: '设置组件之间的间距。'
type: 'basic'
order: 27
icon: 'doc-space'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/space` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-basic-space-1" title="如何引入" kind="import" />

### 基本用法

<DemoBlock id="zh-CN-basic-space-2" title="基本用法" kind="live" />

### 对齐方式

可使用 `align` 设置对齐方式，可选值：`start`、`center`（默认）、`end`、`baseline`。

<DemoBlock id="zh-CN-basic-space-3" title="对齐方式" kind="live" />

### 间距尺寸

可使用 `spacing` 设置间距大小，内置可选值：`tight`（8px，默认）、`medium`（16px）、`loose`（24px），并且支持传入 number 来自定义间距大小，也支持传入 array 来同时设置水平和垂直方向的间距。

<DemoBlock id="zh-CN-basic-space-4" title="间距尺寸" kind="live" />

### 间距方向

可使用 `vertical` 设置间距是否为垂直方向，默认情况下为 false。

<DemoBlock id="zh-CN-basic-space-5" title="间距方向" kind="live" />

### 设置换行

当间距为水平方向时，可使用 `wrap` 设置是否自动换行，默认情况下为 false。

<DemoBlock id="zh-CN-basic-space-6" title="设置换行" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/space/types.ts` 的公开类型为准。

#### Vue 用法

- `spacing` 数组依次表示水平、垂直间距。
- `wrap` 只在水平方向生效；`vertical=true` 时不会换行。

#### Vue 插槽

**Space**

| 插槽    | 作用域参数 | 说明           |
| ------- | ---------- | -------------- |
| default | {}         | 需要排列的内容 |

| 属性     | 说明                                                       | 类型              | 默认值   | 版本        |
| -------- | ---------------------------------------------------------- | ----------------- | -------- | ----------- |
| align    | 对齐方式, 支持 `start`、`end`、`center`、`baseline`        | SpaceAlign        | `center` | &gt;=1.17.0 |
| spacing  | 间距尺寸, 支持 `loose`、`medium`、`tight` 或 number、array | SpaceSpacingValue | `tight`  | &gt;=1.17.0 |
| vertical | 是否为垂直间距                                             | boolean           | false    | &gt;=1.17.0 |
| wrap     | 是否自动换行                                               | boolean           | false    | &gt;=1.17.0 |
