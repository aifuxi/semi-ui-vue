---
title: 'Banner 通知横幅'
description: '横幅通常用于标识全页的状态或通知等。它通常是常驻的，需要用户主动将其关闭。'
type: 'feedback'
order: 87
icon: 'doc-banner'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/banner` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-feedback-banner-1" title="如何引入" kind="import" />

### 基本用法

<DemoBlock id="zh-CN-feedback-banner-2" title="基本用法" kind="live" />

### 不同类型

支持4种类型：`info`、`warning`、`danger`、`success`。默认为 `info`。

<DemoBlock id="zh-CN-feedback-banner-3" title="不同类型" kind="live" />

### 非全屏模式

可以设置 `fullMode={false}` 使用非全屏模式的 banner 样式。
通过 `bordered` 属性可以设置边框。

<DemoBlock id="zh-CN-feedback-banner-4" title="非全屏模式" kind="live" />

<DemoBlock id="zh-CN-feedback-banner-5" title="非全屏模式" kind="code" />

### 自定义内容

可以通过默认插槽自定义底部额外内容。

<DemoBlock id="zh-CN-feedback-banner-6" title="自定义内容" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/banner/types.ts` 的公开类型为准。

#### Vue 用法

- `title`、`description`、`icon`、`closeIcon` 同时支持 VNode prop 和同名插槽，插槽优先。
- 组件没有受控 visible API；关闭后会移除自身 DOM，需由调用方重新挂载。

#### Vue 事件

**Banner**

| 事件  | 参数                | 说明                                |
| ----- | ------------------- | ----------------------------------- |
| close | [event: MouseEvent] | 关闭按钮激活时触发，随后移除 Banner |

#### Vue 插槽

**Banner**

| 插槽        | 作用域参数 | 说明         |
| ----------- | ---------- | ------------ |
| default     | {}         | 底部额外内容 |
| closeIcon   | {}         | 关闭图标     |
| description | {}         | 描述内容     |
| icon        | {}         | 类型图标     |
| title       | {}         | 标题         |

| 属性        | 说明                                              | 类型                    | 默认值 | 版本 |
| ----------- | ------------------------------------------------- | ----------------------- | ------ | ---- |
| bordered    | 是否展示边框，仅在非全屏模式下有效                | boolean                 | false  | 1.0  |
| class       | Vue 原生类名                                      | HTMLAttributes['class'] | —      |      |
| className   | 样式类名                                          | HTMLAttributes['class'] | -      | -    |
| closeIcon   | 自定义关闭icon，为 null 时不显示关闭按钮          | VNodeChild              | -      | 1.0  |
| description | 描述内容                                          | VNodeChild              | -      | 1.0  |
| fullMode    | 是否为全屏模式                                    | boolean                 | true   | 1.0  |
| icon        | 自定义 icon，为 null 时不显示 icon                | VNodeChild              | -      | 1.0  |
| style       | 样式名                                            | StyleValue              | -      | -    |
| title       | 标题                                              | VNodeChild              | -      | 1.0  |
| type        | 类型，支持 `info`, `success`, `danger`, `warning` | BannerType              | `info` | -    |

## Accessibility

### ARIA

- 组件的 `role` 为 'alert'
- 关闭按钮的 `aria-label` 为 'Close'

### 键盘和焦点

- Banner 的关闭按钮可以使用 `Tab` 键聚焦，按钮聚焦后，敲击 `Enter` 键或 `Space` 键可以关闭 banner

## 文案规范

- 全屏 Banner
- 尽量保持内容一行展示完全
- 使用正确的标点符号，句子内使用逗号，句子间使用句号
- 非全屏 Banner
- 标题
- 使用精简的语言进行说明
- 标题上尽量避免使用逗号，句号等标点符号，有且只有是疑问句的时候，支持使用问号结尾
- 正文
- 在信息传递完整的前提下，尽可能地将正文压缩至 1 -2 句话
- 对标题进行详尽地描述或者解释，而不是对标题的重复说明
- 使用正确的标点符号，句子内使用逗号，句子间使用句号
