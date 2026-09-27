---
title: 'Spin 加载器'
description: '加载器组件用于告知用户内容正在加载且需要一段不确定的时长。'
type: 'feedback'
order: 93
icon: 'doc-spin'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/spin` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-feedback-spin-1" title="如何引入" kind="import" />

### 基本用法

<DemoBlock id="zh-CN-feedback-spin-2" title="基本用法" kind="live" />

### 尺寸

组件定义了三种尺寸：大、中（默认）、小。

<DemoBlock id="zh-CN-feedback-spin-3" title="尺寸" kind="live" />

### 带文字的

通过 `tip` 属性可设置当 Spin 用作包裹元素时的文字。

<DemoBlock id="zh-CN-feedback-spin-4" title="带文字的" kind="live" />

### 自定义指示符

可以通过设置 `indicator` 属性自定义 Spin 的指示符样式。

<DemoBlock id="zh-CN-feedback-spin-5" title="自定义指示符" kind="live" />

### 延迟显示

通过 delay 设置延迟显示 `loading` 的效果
组件是否处于 `loading` 状态由传入的 `spinning` 值决定，loading 为受控属性

<DemoBlock id="zh-CN-feedback-spin-6" title="延迟显示" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/spin/types.ts` 的公开类型为准。

#### Vue 用法

- `indicator` 与 `tip` 同时支持 VNode prop；模板中优先使用同名插槽，插槽内容优先于 prop。

#### Vue 插槽

**Spin**

| 插槽      | 作用域参数 | 说明               |
| --------- | ---------- | ------------------ |
| default   | {}         | 被加载器包裹的内容 |
| indicator | {}         | 自定义加载指示符   |
| tip       | {}         | 自定义加载说明     |

| 属性             | 说明                                          | 类型                    | 默认值   |
| ---------------- | --------------------------------------------- | ----------------------- | -------- |
| childStyle       | 内部子元素的样式                              | StyleValue              | -        |
| class            | Vue 原生类名                                  | HTMLAttributes['class'] | —        |
| className        | 样式类名                                      | HTMLAttributes['class'] | —        |
| delay            | 延迟显示加载效果的时间                        | number                  | 0        |
| indicator        | 加载指示符                                    | VNodeChild              | 无       |
| size             | 组件大小，可选值为 `small`, `middle`, `large` | SpinSize                | `middle` |
| spinning         | 是否处于加载中的状态                          | boolean                 | true     |
| style            | 内联样式                                      | StyleValue              | -        |
| tip              | 当 spin 作为包裹元素时，可以自定义描述文字    | VNodeChild              | 无       |
| wrapperClassName | 包裹元素的类名                                | string                  | 无       |

## 文案规范

- 准确地说明加载状态，使用比如“Loading”, “Submitting”, “Processing”等词
- 使用尽量少的词汇去描述状态

## FAQ

- **怎么修改 icon 的颜色？**

可以通过给 .semi-spin-wrapper 类添加 color 属性覆盖原有的颜色（推荐以更高权重覆盖）

```
.custom .semi-spin-wrapper {
color: red;
}
```
