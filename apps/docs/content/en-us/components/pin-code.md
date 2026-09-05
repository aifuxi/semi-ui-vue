---
title: 'PinCode'
description: 'For easy and intuitive verification code entry'
locale: 'en-US'
slug: 'pin-code'
category: 'input'
order: 43
englishTitle: 'PinCode'
icon: 'doc-pincode'
upstream: 'input/pincode'
---

## Code demonstration

### How to import

PinCode supported from 2.62.0

```ts
import { PinCode } from '@aifuxi/semi-ui-vue/pin-code';
import '@aifuxi/semi-theme-default/pin-code.css';
```

### Basic usage

::demo-block{demo="pin-code/en-us/Basic" title="Basic usage"}
::

### Controlled

Use value to pass in the verification code string and use it with @change for controlled use

::demo-block{demo="pin-code/en-us/Controlled" title="Controlled"}
::

### Limit verification code format

#### Set the number of digits

Set the number of digits through count, the default is 6 digits, the demo below is set to 4 digits

::demo-block{demo="pin-code/en-us/Count" title="Set the number of digits"}
::

#### Set character range

Use format to control the character range that can be entered

- Pass "number" to only allow numbers

- Pass "mixed" to allow numbers and letters
- Pass in a regular expression to only allow characters that can be judged by the regular expression
- Pass in a function, and the verification code will be passed in as parameters in units of characters for verification when entering. When the function returns true, the character is allowed to be entered into the PinCode

::demo-block{demo="pin-code/en-us/Format" title="Set character range"}
::

### Manual focus and blur

Use the focus and blur methods on Ref, and the input parameter is the serial number of the corresponding Input

::demo-block{demo="pin-code/en-us/Focus" title="Manual focus and blur"}
::

## API Reference

### PinCodeProps

| Property       | Type                      | Default     | Description                                                           |
| -------------- | ------------------------- | ----------- | --------------------------------------------------------------------- |
| `autoFocus`    | `boolean`                 | `true`      | Whether to automatically focus on the first element                   |
| `className`    | `HTMLAttributes['class']` | `—`         | Class name                                                            |
| `count`        | `number`                  | `6`         | Number of digits of verification code                                 |
| `defaultValue` | `string`                  | `—`         | Initial uncontrolled value; use v-model for subsequent changes.       |
| `disabled`     | `boolean`                 | `false`     | Disable                                                               |
| `format`       | `PinCodeFormat`           | `'number'`  | Limitation of single character format of verification code            |
| `modelValue`   | `string \| undefined`     | `—`         | Two-way binding via v-model; do not also supply value.                |
| `size`         | `InputSize`               | `'default'` | Input box size, large, default, small                                 |
| `style`        | `StyleValue`              | `—`         | Vue style object or array.                                            |
| `value`        | `string \| undefined`     | `—`         | Controlled value; v-model:value synchronizes it through update:value. |

`—` means no independent default. Standard class / style support Vue bindings; Boolean defaults follow the current implementation.

### Events

| Event               | Payload           | Description                                                      |
| ------------------- | ----------------- | ---------------------------------------------------------------- |
| `change`            | `[value: string]` | The value changed through selection or input.                    |
| `complete`          | `[value: string]` | All count positions are filled; this is not server verification. |
| `update:modelValue` | `[value: string]` | Synchronize v-model.                                             |
| `update:value`      | `[value: string]` | Synchronize v-model:value.                                       |

Listen with @change; use v-model or v-model:value for two-way value binding.

### Slots

PinCode has no public slots.

## Methods

Call public instance methods through a template ref.

```ts
export interface PinCodeExposed {
  blur(index: number): void;
  focus(index: number): void;
}
```

## Type definitions

```ts
export type PinCodeFormat = 'number' | 'mixed' | RegExp | ((character: string) => boolean);
```

## Accessibility

### ARIA, keyboard and focus

Each digit uses a separate native input; numeric mode sets inputmode="numeric". Per-digit accessible names are currently not generated. Provide visible verification-code instructions and avoid relying only on placeholders or color for errors. Root ARIA attributes do not automatically name each input.

Left/Right arrows move between adjacent inputs. Backspace clears and moves left; Delete clears and moves right. Pasted text is filtered by format before insertion, and IME text is processed after composition. focus(index) / blur(index) use zero-based indices. autoFocus defaults to true; disable it as appropriate when multiple controls share a page.

## Design Tokens

::token-table{component="pincode"}
::

## FAQ

### When do change and complete fire?

change fires when content changes; complete fires when all count positions are filled. Completion only satisfies component format/length conditions, not server-side verification.

### Does a custom format validate the entire code?

A RegExp or function filters one character at a time. Validate the complete business code in change or complete.

### How can the third input be focused?

Obtain PinCodeExposed through a template ref and call focus(2); React ref.current is unnecessary.

## React → Vue migration

| React                      | Vue                                                                        |
| -------------------------- | -------------------------------------------------------------------------- |
| `@douyinfe/semi-ui`        | `@aifuxi/semi-ui-vue/pin-code` + `@aifuxi/semi-theme-default/pin-code.css` |
| `useState` / `useMemo`     | `ref` / `shallowRef` / `computed`                                          |
| `value` + `onChange`       | `v-model` / `v-model:value` / `:value` + `@change`                         |
| `className`                | Vue `class`                                                                |
| `ref.current`              | public instance on a template ref                                          |
| `onComplete`               | `@complete`                                                                |
| `ref.current.focus(index)` | `ref.value?.focus(index)`                                                  |
| `Math.random()` demo value | Seeded deterministic sequence retaining the button and value changes       |
