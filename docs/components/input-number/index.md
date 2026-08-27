# InputNumber 数字输入框

InputNumber 对齐 Semi Design v2.102.0，复用 Input 的 DOM 与交互，并保留 `.semi-input-number*` 步进器、精度、格式化、货币、科学计数法、键盘、ARIA、暗色与 RTL 契约。

## 基础使用

```vue
<script setup lang="ts">
import { InputNumber } from '@workspace/ui';
</script>

<template>
  <InputNumber :default-value="1" :min="1" :max="10" :step="2" />
</template>
```

`v-model` 是推荐受控写法；`value` 与 `modelValue` 同时存在时 `value` 优先。

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { InputNumber } from '@workspace/ui';

const value = shallowRef<number | string>(12);
</script>

<template>
  <InputNumber v-model="value" :precision="2" @number-change="console.log" />
</template>
```

## 格式化、货币与科学计数法

`formatter` 与 `parser` 通常成对使用。数字受控值在首次渲染也会格式化。

```vue
<InputNumber
  :default-value="1000"
  :formatter="(value) => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
  :parser="(value) => value.replace(/￥\s?|(,*)/g, '')"
/>

<InputNumber currency="CNY" locale-code="zh-CN" :default-value="123456.78" />
<InputNumber scientific-notation :default-value="123456789012345" />
```

货币模式可使用 ConfigProvider 的 `locale.code` 与 `locale.currency`，也可由组件 prop 覆盖。科学计数法只改变失焦显示，不改变 change/numberChange 的完整数值，且不作用于货币模式。

## 步进器和插槽

```vue
<InputNumber inner-buttons suffix="小时" />
<InputNumber hide-buttons />
<InputNumber show-clear>
  <template #prefix>￥</template>
  <template #suffix>元</template>
</InputNumber>
```

默认步进器位于 Input 外部；`innerButtons` 在 hover/focus 时用步进器替换 suffix；`hideButtons` 完全隐藏外部步进器。ArrowUp/ArrowDown 使用 `step`，Shift + 方向键或按钮使用 `shiftStep`。

## API

| Prop                                                   | 类型                                | 默认值                 |
| ------------------------------------------------------ | ----------------------------------- | ---------------------- |
| `value/modelValue/defaultValue`                        | `number \| string`                  | -                      |
| `min/max`                                              | `number`                            | `-Infinity / Infinity` |
| `step/shiftStep`                                       | `number`                            | `1 / 10`               |
| `precision`                                            | `number`                            | -                      |
| `formatter/parser`                                     | `(value) => string`                 | -                      |
| `hideButtons/innerButtons/keepFocus`                   | `boolean`                           | `false`                |
| `pressTimeout/pressInterval`                           | `number`                            | `250 / 250`            |
| `currency`                                             | `boolean \| string`                 | `false`                |
| `currencyDisplay`                                      | `symbol \| code \| name`            | `symbol`               |
| `localeCode/defaultCurrency`                           | `string`                            | ConfigProvider         |
| `minimumFractionDigits/maximumFractionDigits`          | `number`                            | -                      |
| `showCurrencySymbol`                                   | `boolean`                           | `true`                 |
| `scientificNotation`                                   | `boolean \| { threshold?: number }` | `false`                |
| `hideButtons/innerButtons/showClear/disabled/readonly` | `boolean`                           | `false`                |
| `size`                                                 | `small \| default \| large`         | `default`              |

事件：`change(value, event?)`、`numberChange(number, event?)`、`upClick(value, event)`、`downClick(value, event)`、`focus`、`blur`、`keydown` 与 `update:value/update:modelValue`。实例暴露 `input`、`focus()`、`blur()`、`select()`。

具名 slot：`prefix`、`suffix`、`insetLabel`、`addonBefore`、`addonAfter`、`clearIcon`。完整 DOM、事件顺序、SSR 与视觉证据见[对齐矩阵](./alignment.md)。

## React → Vue

| React                      | Vue                                   |
| -------------------------- | ------------------------------------- |
| `value` + `onChange`       | `v-model`；也保留 `value` + `@change` |
| `onNumberChange/onUpClick` | `@numberChange/@upClick`              |
| ReactNode affix            | 同名 prop 或具名 slot                 |
| `ref.current.focus()`      | Vue 组件 ref 的 `focus()`             |
