---
title: 'PinCode 验证码输入'
description: '用于便捷直观地输入验证码'
type: 'input'
order: 43
icon: 'doc-pincode'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/pin-code` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

PinCode 从 2.62.0 开始支持

<DemoBlock id="zh-CN-input-pincode-1" title="如何引入" kind="code" />

### 基本使用

<DemoBlock id="zh-CN-input-pincode-2" title="基本使用" kind="live" />

### 受控

使用 `v-model` 双向绑定验证码字符串，也可使用兼容的 `v-model:value`。

<DemoBlock id="zh-CN-input-pincode-3" title="受控" kind="live" />

### 限制验证码格式

#### 设置位数

通过 count 设置位数，默认 6 位，下方 Demo 设置为 4 位

<DemoBlock id="zh-CN-input-pincode-4" title="设置位数" kind="live" />

#### 设置字符范围

使用 format 控制可输入的字符范围

- 传入 "number" 只允许设置数字
- 传入 “mixed” 允许数字和字母
- 传入正则表达式，只允许输入可通过正则判定的字符
- 传入函数，验证码会在输入的时候以字符为单位被依次作为参数分别单独传入进行校验，当函数返回 true 时，允许该字符被输入进 PinCode

<DemoBlock id="zh-CN-input-pincode-5" title="设置字符范围" kind="live" />

### 手动聚焦失焦

使用模板 ref 上的 `focus` 与 `blur` 方法，入参为对应 Input 的序号

<DemoBlock id="zh-CN-input-pincode-6" title="手动聚焦失焦" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/pin-code/types.ts` 的公开类型为准。

- `v-model` 对应 `modelValue` 与 `update:modelValue`；兼容入口 `value` 可通过 `v-model:value` 绑定。

#### Vue 用法

- `format` 的函数形式是逐字符校验 callback prop，不转换为事件。
- `focus(index)` 和 `blur(index)` 的 index 从 0 开始。

#### Vue 实例方法

**PinCodeExposed**

| 方法    | 签名                       | 说明                   |
| ------- | -------------------------- | ---------------------- |
| `focus` | (index: number) =&gt; void | 聚焦指定序号的输入格   |
| `blur`  | (index: number) =&gt; void | 让指定序号的输入格失焦 |

#### Vue 事件

**PinCode**

| 事件              | 参数            | 说明                |
| ----------------- | --------------- | ------------------- |
| change            | [value: string] | 任一输入格的值变化  |
| complete          | [value: string] | 全部输入格填写完成  |
| update:modelValue | [value: string] | 更新默认 v-model    |
| update:value      | [value: string] | 更新兼容 value 绑定 |

| 属性         | 说明                              | 类型                    | 默认值    | 版本 |
| ------------ | --------------------------------- | ----------------------- | --------- | ---- |
| autoFocus    | 是否自动聚焦到第一个元素          | boolean                 | true      |      |
| className    | 类名                              | HTMLAttributes['class'] | —         |      |
| count        | 验证码位数                        | number                  | 6         |      |
| defaultValue | 输入框内容默认值                  | string                  | —         |      |
| disabled     | 禁用                              | boolean                 | false     |      |
| format       | 验证码单个字符格式限制            | PinCodeFormat           | `number`  |      |
| modelValue   | `v-model` 绑定值                  | string \| undefined     | —         |      |
| size         | 输入框大小，large、default、small | InputSize               | `default` |      |
| style        | 样式                              | StyleValue              | —         |      |
| value        | 兼容受控值                        | string \| undefined     | —         |      |

## 实例方法

绑定在组件实例上的方法，可以通过 ref 调用实现某些特殊交互

| 方法  | 签名                      | 说明                   |
| ----- | ------------------------- | ---------------------- |
| focus | `(index: number) => void` | 聚焦指定序号的输入格   |
| blur  | `(index: number) => void` | 让指定序号的输入格失焦 |
