---
title: '验证码输入'
description: '用于便捷直观地输入验证码'
locale: 'zh-CN'
slug: 'pin-code'
category: 'input'
order: 43
englishTitle: 'PinCode'
icon: 'doc-pincode'
upstream: 'input/pincode'
---

## 代码演示

### 如何引入

PinCode 从 2.62.0 开始支持

```ts
import { PinCode } from '@aifuxi/semi-ui-vue/pin-code';
import '@aifuxi/semi-theme-default/pin-code.css';
```

### 基本使用

::demo-block{demo="pin-code/zh-cn/Basic" title="基本使用"}
::

### 受控

使用 value 传入验证码字符串，配合 @change 受控使用

::demo-block{demo="pin-code/zh-cn/Controlled" title="受控"}
::

### 限制验证码格式

#### 设置位数

通过 count 设置位数，默认 6 位，下方 Demo 设置为 4 位

::demo-block{demo="pin-code/zh-cn/Count" title="设置位数"}
::

#### 设置字符范围

使用 format 控制可输入的字符范围

- 传入 "number" 只允许设置数字
- 传入 “mixed” 允许数字和字母
- 传入正则表达式，只允许输入可通过正则判定的字符
- 传入函数，验证码会在输入的时候以字符为单位被依次作为参数分别单独传入进行校验，当函数返回 true 时，允许该字符被输入进 PinCode

::demo-block{demo="pin-code/zh-cn/Format" title="设置字符范围"}
::

### 手动聚焦失焦

使用 Ref 上方法 focus 与 blur，入参为对应 Input 的序号

::demo-block{demo="pin-code/zh-cn/Focus" title="手动聚焦失焦"}
::

## API 参考

### PinCodeProps

| 属性           | 类型                      | 默认值      | 说明                                                  |
| -------------- | ------------------------- | ----------- | ----------------------------------------------------- |
| `autoFocus`    | `boolean`                 | `true`      | 是否自动聚焦到第一个元素                              |
| `className`    | `HTMLAttributes['class']` | `—`         | 类名                                                  |
| `count`        | `number`                  | `6`         | 验证码位数                                            |
| `defaultValue` | `string`                  | `—`         | 非受控初始值；后续变化使用 v-model。                  |
| `disabled`     | `boolean`                 | `false`     | 禁用                                                  |
| `format`       | `PinCodeFormat`           | `'number'`  | 验证码单个字符格式限制                                |
| `modelValue`   | `string \| undefined`     | `—`         | 双向绑定值，使用 v-model；不要与 value 同时传入。     |
| `size`         | `InputSize`               | `'default'` | 输入框大小，large、default、small                     |
| `style`        | `StyleValue`              | `—`         | Vue 样式对象或数组。                                  |
| `value`        | `string \| undefined`     | `—`         | 受控值；与 v-model:value 配合时由 update:value 同步。 |

`—` 表示未设置独立默认值。普通 `class` / `style` 可用于 Vue 属性绑定；Boolean 默认值以当前实现为准。

### 事件

| 事件                | 参数              | 说明                                    |
| ------------------- | ----------------- | --------------------------------------- |
| `change`            | `[value: string]` | 选择或输入导致值变化。                  |
| `complete`          | `[value: string]` | 已填满 count 位；不表示服务端验证成功。 |
| `update:modelValue` | `[value: string]` | 同步 v-model 值。                       |
| `update:value`      | `[value: string]` | 同步 v-model:value 值。                 |

通过 `@change` 监听值变化；双向绑定使用 `v-model` 或 `v-model:value`。

### 插槽

PinCode 没有公开插槽。

## Methods

通过模板 ref 调用公开实例方法。

```ts
export interface PinCodeExposed {
  blur(index: number): void;
  focus(index: number): void;
}
```

## 类型定义

```ts
export type PinCodeFormat = 'number' | 'mixed' | RegExp | ((character: string) => boolean);
```

## Accessibility

### ARIA、键盘和焦点

每一位使用独立原生输入框，数字模式设置 inputmode="numeric"。组件当前没有自动生成每一位的可访问名称；应在控件旁提供可见的验证码说明，避免仅依赖占位符或颜色表达错误。根元素上的 ARIA 属性不会自动给每个输入框命名。

左/右方向键切换相邻位；Backspace 清除并向左移动，Delete 清除并向右移动。粘贴文本按 format 过滤后填入；输入法组合输入完成后再处理。focus(index) / blur(index) 使用从 0 开始的索引。autoFocus 默认 true；同页多个示例应按业务需要关闭自动聚焦。

## 设计变量

::token-table{component="pincode"}
::

## FAQ

### change 和 complete 何时触发？

内容变化触发 change；填满 count 位后触发 complete。complete 只表示格式和位数满足组件条件，不能替代服务端验证码校验。

### 自定义 format 检查整串吗？

正则或函数按单个字符过滤，函数参数为 character；业务整串校验在 change 或 complete 中处理。

### 如何聚焦第三位？

模板 ref 获取 PinCodeExposed 后调用 focus(2)。不需要 React ref.current。

## React → Vue 迁移

| React                      | Vue                                                                        |
| -------------------------- | -------------------------------------------------------------------------- |
| `@douyinfe/semi-ui`        | `@aifuxi/semi-ui-vue/pin-code` + `@aifuxi/semi-theme-default/pin-code.css` |
| `useState` / `useMemo`     | `ref` / `shallowRef` / `computed`                                          |
| `value` + `onChange`       | `v-model` / `v-model:value` / `:value` + `@change`                         |
| `className`                | Vue `class`                                                                |
| `ref.current`              | 模板 ref 的公开实例                                                        |
| `onComplete`               | `@complete`                                                                |
| `ref.current.focus(index)` | `ref.value?.focus(index)`                                                  |
| `Math.random()` 演示值     | 固定种子的确定性序列，保留按钮和变化交互                                   |
