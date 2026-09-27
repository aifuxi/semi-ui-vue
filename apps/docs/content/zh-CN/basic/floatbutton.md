---
title: 'FloatButton 悬浮按钮'
description: '悬浮按钮是可以悬浮在页面上的可操作按钮'
type: 'basic'
order: 23
icon: 'doc-floatButton'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/float-button` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

FloatButton 自 2.85.0 支持。

<DemoBlock id="zh-CN-basic-floatbutton-1" title="如何引入" kind="import" />

### 基本用法

<DemoBlock id="zh-CN-basic-floatbutton-2" title="基本用法" kind="live" />

### 尺寸

支持三种尺寸：默认，小，大。

<DemoBlock id="zh-CN-basic-floatbutton-3" title="尺寸" kind="live" />

### 形状

默认定义了两种形状：square（默认）、circle。

<DemoBlock id="zh-CN-basic-floatbutton-4" title="形状" kind="live" />

### 点击跳转

可通过 `href` 设置跳转地址, `target` 指定目标网页应该在哪个窗口或框架中打开。

<DemoBlock id="zh-CN-basic-floatbutton-5" title="点击跳转" kind="live" />

### AI 风格 - 多彩悬浮按钮

可设置 `colorful` 为 true，展示多彩的悬浮按钮。

<DemoBlock id="zh-CN-basic-floatbutton-6" title="AI 风格 - 多彩悬浮按钮" kind="live" />

### 带徽章的

<DemoBlock id="zh-CN-basic-floatbutton-7" title="带徽章的" kind="live" />

### 悬浮按钮组

可通过 `items` 传入子项

<DemoBlock id="zh-CN-basic-floatbutton-8" title="悬浮按钮组" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/float-button/types.ts` 的公开类型为准。

#### Vue 用法

- `badge` 使用 `FloatButtonBadgeProps`；其中 `onClick`、`onMouseEnter`、`onMouseLeave` 是嵌套配置的真实 callback props。
- `FloatButtonGroupItem` 继承全部 `FloatButtonProps`，并增加 `value` 和 `content`。
- `icon` 和 `content` 可传 VNode；Button 的 `#icon`、Group 的 `#item` 插槽优先。

#### Vue 事件

**FloatButton**

| 事件  | 参数                | 说明                 |
| ----- | ------------------- | -------------------- |
| click | [event: MouseEvent] | 未禁用时点击按钮触发 |

**FloatButtonGroup**

| 事件  | 参数                               | 说明               |
| ----- | ---------------------------------- | ------------------ |
| click | [value: string, event: MouseEvent] | 点击组内子项时触发 |

#### Vue 插槽

**FloatButton**

| 插槽 | 作用域参数 | 说明                       |
| ---- | ---------- | -------------------------- |
| icon | {}         | 按钮图标，优先于 icon prop |

**FloatButtonGroup**

| 插槽 | 作用域参数      | 说明               |
| ---- | --------------- | ------------------ |
| item | { item, index } | 自定义组内子项内容 |

### FloatButton

| 属性     | 说明                                                                                                                 | 类型                  | 默认值    |
| -------- | -------------------------------------------------------------------------------------------------------------------- | --------------------- | --------- |
| shape    | 样式，支持 round、 square                                                                                            | FloatButtonShape      | `round`   |
| colorful | 多彩悬浮按钮                                                                                                         | boolean               | false     |
| icon     | 显示图标                                                                                                             | VNodeChild            | -         |
| href     | 点击跳转的链接, 同 [href](https://developer.mozilla.org/zh-CN/docs/Web/API/Location/href)                            | string                | -         |
| target   | 指定在何处显示链接的 URL, 同 [target](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/a#target) | string                | -         |
| disabled | 禁用状态                                                                                                             | boolean               | false     |
| size     | 尺寸，支持 default、small、large                                                                                     | FloatButtonSize       | `default` |
| badge    | 徽章参数                                                                                                             | FloatButtonBadgeProps | -         |

### FloatButtonBadgeProps

`badge` prop 的配置项。

| 属性           | 说明                            | 类型                              | 默认值     |
| -------------- | ------------------------------- | --------------------------------- | ---------- |
| count          | 徽章内容                        | VNodeChild                        | —          |
| dot            | 是否显示为小圆点                | boolean                           | false      |
| type           | 徽章类型                        | FloatButtonBadgeType              | `primary`  |
| theme          | 徽章主题                        | FloatButtonBadgeTheme             | `solid`    |
| position       | 徽章位置                        | FloatButtonBadgePosition          | `rightTop` |
| overflowCount  | 数字上限，超出后显示加号        | number                            | —          |
| style          | 徽章内容样式，优先于 countStyle | CSSProperties                     | —          |
| className      | 徽章根元素类名                  | string                            | —          |
| countClassName | 徽章内容类名                    | string                            | —          |
| countStyle     | 徽章内容备用样式                | CSSProperties                     | —          |
| onClick        | 徽章点击 callback               | (event: MouseEvent) =&gt; unknown | —          |
| onMouseEnter   | 指针移入徽章 callback           | (event: MouseEvent) =&gt; unknown | —          |
| onMouseLeave   | 指针移出徽章 callback           | (event: MouseEvent) =&gt; unknown | —          |

### FloatButtonGroupItem

在 `FloatButtonProps` 基础上增加以下参数。

| 属性     | 说明        | 类型                  | 默认值    |
| -------- | ----------- | --------------------- | --------- |
| shape    | —           | FloatButtonShape      | `round`   |
| colorful | —           | boolean               | false     |
| icon     | —           | VNodeChild            | —         |
| href     | —           | string                | —         |
| target   | —           | string                | —         |
| disabled | —           | boolean               | false     |
| size     | —           | FloatButtonSize       | `default` |
| badge    | —           | FloatButtonBadgeProps | —         |
| value    | item 的标识 | string                | -         |
| content  | 文本内容    | VNodeChild            | -         |

### FloatButtonGroup

| 属性     | 说明           | 类型                                    | 默认值 |
| -------- | -------------- | --------------------------------------- | ------ |
| disabled | 禁用状态       | boolean                                 | false  |
| items    | 单个子项的信息 | readonly FloatButtonGroupItem[]（必填） | -      |
