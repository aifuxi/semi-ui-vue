# InputNumber

InputNumber targets Semi Design v2.102.0. It reuses Input DOM and behavior while preserving the `.semi-input-number*` stepper, precision, formatting, currency, scientific notation, keyboard, ARIA, dark-theme, and RTL contracts.

## Basic usage

```vue
<script setup lang="ts">
import { InputNumber } from '@aifuxi/semi-ui-vue';
</script>

<template>
  <InputNumber :default-value="1" :min="1" :max="10" :step="2" />
</template>
```

Use `v-model` for controlled input. `value` wins when both `value` and `modelValue` are present.

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { InputNumber } from '@aifuxi/semi-ui-vue';

const value = shallowRef<number | string>(12);
</script>

<template>
  <InputNumber v-model="value" :precision="2" @number-change="console.log" />
</template>
```

## Formatting, currency, and scientific notation

Use `formatter` and `parser` as a pair. Numeric controlled values are formatted on the first render.

```vue
<InputNumber
  :default-value="1000"
  :formatter="(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
  :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
/>

<InputNumber currency="USD" locale-code="en-US" :default-value="123456.78" />
<InputNumber scientific-notation :default-value="123456789012345" />
```

Currency mode can consume ConfigProvider `locale.code` and `locale.currency`, with component props taking precedence. Scientific notation only changes the blurred display, keeps full callback values, and is disabled in currency mode.

## Steppers and slots

```vue
<InputNumber inner-buttons suffix="hours" />
<InputNumber hide-buttons />
<InputNumber show-clear>
  <template #prefix>$</template>
  <template #suffix>USD</template>
</InputNumber>
```

The default stepper is outside Input. `innerButtons` replaces the suffix while hovered or focused; `hideButtons` removes the external stepper. ArrowUp/ArrowDown use `step`; Shift plus an arrow or button uses `shiftStep`.

## API

| Prop                                                   | Type                                | Default                |
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

Events: `change(value, event?)`, `numberChange(number, event?)`, `upClick(value, event)`, `downClick(value, event)`, `focus`, `blur`, `keydown`, and `update:value/update:modelValue`. The instance exposes `input`, `focus()`, `blur()`, and `select()`.

Named slots: `prefix`, `suffix`, `insetLabel`, `addonBefore`, `addonAfter`, and `clearIcon`. See the [alignment matrix](./alignment.md) for complete DOM, event-order, SSR, and visual evidence.

## React → Vue

| React                      | Vue                                                   |
| -------------------------- | ----------------------------------------------------- |
| `value` + `onChange`       | `v-model`; `value` + `@change` also remains available |
| `onNumberChange/onUpClick` | `@numberChange/@upClick`                              |
| ReactNode affix            | Same-name prop or named slot                          |
| `ref.current.focus()`      | Vue component ref `focus()`                           |
