---
title: 'InputNumber'
description: 'Through the mouse or keyboard, input the value in the range. Unlike Input, it has a stepper operation area for digital scenes, and it can display more complex content formats when used with Parser.'
locale: 'en-US'
slug: 'input-number'
category: 'input'
order: 42
englishTitle: 'InputNumber'
icon: 'doc-inputnumber'
upstream: 'input/inputnumber'
---

## When to Use

When you need to get a standard value.

## Demos

### How to import

```ts
import { InputNumber } from '@aifuxi/semi-ui-vue/input-number';
import '@aifuxi/semi-theme-default/input-number.css';
```

### Basic Input Box

::demo-block{demo="input-number/en-us/Basic" title="Basic Input Box"}
::

::demo-block{demo="input-number/en-us/Defaults" title="Basic Input Box"}
::

### Inner Buttons

With `innerButtons`, you can hide the buttons on the right into the interior, which will only be displayed when hover occurs

::demo-block{demo="input-number/en-us/InnerButtons" title="Inner Buttons"}
::

Set `hidebuttons` to `true` to hide the buttons completely

::demo-block{demo="input-number/en-us/HideButtons" title="Inner Buttons"}
::

### Size

::demo-block{demo="input-number/en-us/Size" title="Size"}
::

### Custom Display Format and Resolution

> A pair of methods for `formatter` and `parser`, which generally need to be set at the same time, otherwise the value cannot be resolved correctly.

> **Behavior change in 2.95.0**
>
> - **2.94.0 and earlier**: In **controlled** mode (passing `value`), when `value` is a **number**, the initial render might not apply `formatter` to the displayed text. `formatter/parser` could be applied after mount (or on subsequent updates), causing the first paint to differ from later renders.
> - **2.95.0 and later**: In controlled mode, when `value` is a **number**, `formatter` is applied on the initial render (and paired with `parser` to derive the internal numeric value), keeping the first paint consistent with later renders. For example, in a percentage formatter/parser setup where `value=1` should display `100`, the first paint will display `100`.

::demo-block{demo="input-number/en-us/Formatter" title="Custom Display Format and Resolution"}
::

### Can Only Enter Numbers

With formatter and @number-change(**>=v1.9.0**), a pure digital input box can be implemented.

::demo-block{demo="input-number/en-us/Digits" title="Can Only Enter Numbers"}
::

### Currency Display

Version 2.77.0 supports currency display. In internationalization mode, enable currency={true} and the component will automatically display the corresponding currency type according to localeCode. (Note that the component key value needs to be updated after switching the language type)

::demo-block{demo="input-number/en-us/CurrencyLocale" title="Currency Display"}
::
You can also specify the currency to be displayed by manually passing localeCode and currency.

::demo-block{demo="input-number/en-us/Currency" title="Currency Display"}
::
Supports three display modes: symbol, code, and name. It is controlled by the currencyDisplay property. The currency symbol is displayed by default. Set showCurrencySymbol to false to hide the display of currency symbol/code/name

::demo-block{demo="input-number/en-us/CurrencyDisplay" title="Currency Display"}
::

Hide the display of currency symbols/codes/names, and display the currency symbol through the prefix/suffix
::demo-block{demo="input-number/en-us/CurrencyAffixes" title="Currency Display"}
::

### Scientific Notation Display

When the number is long, you can enable scientific notation display via the `scientificNotation` property. It displays in scientific notation when out of focus, and displays the full number when in focus.

::demo-block{demo="input-number/en-us/Scientific" title="Scientific Notation Display"}
::

> Scientific notation only affects the display format. The values in `@change` and `@number-change` callbacks are still full numbers. This feature is not supported in currency mode (`currency`).

## API Reference

### InputNumber

| Property                  | Type                                                      | Default     | Description                                                                                                                                                                                                                                                                                                                      |
| ------------------------- | --------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ariaDescribedby`         | `string`                                                  | `—`         | Description element ids.                                                                                                                                                                                                                                                                                                         |
| `ariaErrormessage`        | `string`                                                  | `—`         | Error message element id.                                                                                                                                                                                                                                                                                                        |
| `ariaInvalid`             | `boolean \| 'false' \| 'true' \| 'grammar' \| 'spelling'` | `—`         | ARIA invalid state.                                                                                                                                                                                                                                                                                                              |
| `ariaLabel`               | `string`                                                  | `—`         | Accessible name; use aria-label in templates.                                                                                                                                                                                                                                                                                    |
| `ariaLabelledby`          | `string`                                                  | `—`         | Label element ids; use aria-labelledby in templates.                                                                                                                                                                                                                                                                             |
| `ariaRequired`            | `boolean \| 'false' \| 'true'`                            | `—`         | ARIA required state.                                                                                                                                                                                                                                                                                                             |
| `addonAfter`              | `VNodeChild`                                              | `—`         | Addon after input box                                                                                                                                                                                                                                                                                                            |
| `addonBefore`             | `VNodeChild`                                              | `—`         | Addon before input box                                                                                                                                                                                                                                                                                                           |
| `autoFocus`               | `boolean`                                                 | `false`     | Focus after mounting.                                                                                                                                                                                                                                                                                                            |
| `borderless`              | `boolean`                                                 | `false`     | borderless mode                                                                                                                                                                                                                                                                                                                  |
| `className`               | `HTMLAttributes['class']`                                 | `—`         | class name of InputNumber                                                                                                                                                                                                                                                                                                        |
| `clearIcon`               | `VNodeChild`                                              | `—`         | Can be used to customize the clear button, valid when showClear is true                                                                                                                                                                                                                                                          |
| `composition`             | `boolean`                                                 | `false`     | Whether to enable IME composition input mode. When enabled, `@change` will not be triggered during IME composition (e.g., Chinese pinyin input), and will only be triggered once after composition ends                                                                                                                          |
| `defaultValue`            | `InputNumberValue`                                        | `—`         | Default                                                                                                                                                                                                                                                                                                                          |
| `disabled`                | `boolean`                                                 | `false`     | Disabled status                                                                                                                                                                                                                                                                                                                  |
| `getValueLength`          | `(value: string) => number`                               | `—`         | Custom calculated character string length                                                                                                                                                                                                                                                                                        |
| `hideSuffix`              | `boolean`                                                 | `false`     | Toggle whether to hide suffix if clear icon is shown，by default the two icon are side by side                                                                                                                                                                                                                                   |
| `id`                      | `string`                                                  | `—`         | Component element id.                                                                                                                                                                                                                                                                                                            |
| `inputStyle`              | `StyleValue`                                              | `—`         | Style of the native input element.                                                                                                                                                                                                                                                                                               |
| `insetLabel`              | `VNodeChild`                                              | `—`         | Inset label, also available as the insetLabel slot.                                                                                                                                                                                                                                                                              |
| `insetLabelId`            | `string`                                                  | `—`         | Inset label element id.                                                                                                                                                                                                                                                                                                          |
| `maxLength`               | `number`                                                  | `—`         | Maximum input length; getValueLength can customize the calculation.                                                                                                                                                                                                                                                              |
| `minLength`               | `number`                                                  | `—`         | Minimum input length; getValueLength can customize the calculation.                                                                                                                                                                                                                                                              |
| `mode`                    | `InputMode`                                               | `—`         | mode of input，optional: `password`                                                                                                                                                                                                                                                                                              |
| `modelValue`              | `InputNumberValue \| undefined`                           | `—`         | Controlled value for v-model.                                                                                                                                                                                                                                                                                                    |
| `onlyBorder`              | `number`                                                  | `—`         | Internal compatibility border style parameter.                                                                                                                                                                                                                                                                                   |
| `placeholder`             | `InputValue`                                              | `—`         | Content to be appear by default                                                                                                                                                                                                                                                                                                  |
| `prefix`                  | `VNodeChild`                                              | `—`         | Prefix content                                                                                                                                                                                                                                                                                                                   |
| `preventScroll`           | `boolean`                                                 | `—`         | Indicates whether the browser should scroll the document to display the newly focused element, acting on the focus method inside the component, excluding the component passed in by the user                                                                                                                                    |
| `readonly`                | `boolean`                                                 | `false`     | Read-only, not editable                                                                                                                                                                                                                                                                                                          |
| `showClear`               | `boolean`                                                 | `false`     | Do you show the clear button?                                                                                                                                                                                                                                                                                                    |
| `showClearIgnoreDisabled` | `boolean`                                                 | `—`         | Internal compatibility option for showing clear while disabled.                                                                                                                                                                                                                                                                  |
| `size`                    | `InputSize`                                               | `'default'` | Enter box size, optional value: "default"\                                                                                                                                                                                                                                                                                       |
| `suffix`                  | `VNodeChild`                                              | `—`         | Custom suffix                                                                                                                                                                                                                                                                                                                    |
| `type`                    | `string`                                                  | `'text'`    | Input type attribute, same with html ` `                                                                                                                                                                                                                                                                                         |
| `validateStatus`          | `InputValidateStatus`                                     | `'default'` | Validate status for styling only, one of `default`, `error`, `warning`                                                                                                                                                                                                                                                           |
| `value`                   | `InputNumberValue \| undefined`                           | `—`         | Current value                                                                                                                                                                                                                                                                                                                    |
| `autofocus`               | `boolean`                                                 | `false`     | Automatic access to focus                                                                                                                                                                                                                                                                                                        |
| `currency`                | `string \| boolean`                                       | `false`     | Currency type. In international mode, currency={true} is enabled. The component will automatically display the corresponding currency type according to the locale. You can also manually pass in localeCode and currency to specify the currency type to display. The optional values ​​of currency are `CNY`,`EUR`,`USD`, etc. |
| `currencyDisplay`         | `InputNumberCurrencyDisplay`                              | `'symbol'`  | Currency display method. Optional values: symbol, code, name                                                                                                                                                                                                                                                                     |
| `defaultCurrency`         | `string`                                                  | `—`         | Default currency when no explicit currency is supplied.                                                                                                                                                                                                                                                                          |
| `formatter`               | `(value: InputNumberValue) => string`                     | `—`         | Specifies the format of the input box to display the value                                                                                                                                                                                                                                                                       |
| `hideButtons`             | `boolean`                                                 | `false`     | Hide the "up/down" button when passing `true`                                                                                                                                                                                                                                                                                    |
| `innerButtons`            | `boolean`                                                 | `false`     | Show the "up/down" button in input box when passing `true`                                                                                                                                                                                                                                                                       |
| `keepFocus`               | `boolean`                                                 | `false`     | Keep the input box focused when you click the button                                                                                                                                                                                                                                                                             |
| `localeCode`              | `string`                                                  | `—`         | Used to specify the country code in currency mode. Optional values ​​include `zh-CN`, `en-US`, `en-GB`, `ja-JP`, `ko-KR`, `ar`, `vi-VN`, `ru-RU`, `id-ID`, `ms-MY`, `th-TH`, `tr-TR`, `pt-BR`, `zh-TW`, `es`, `de`, `it`, `fr`, `ro`, `sv-SE`, `pl-PL`, `nl-NL`, etc.                                                            |
| `max`                     | `number`                                                  | `Infinity`  | Limit maximum value                                                                                                                                                                                                                                                                                                              |
| `maximumFractionDigits`   | `number`                                                  | `—`         | Maximum fraction digits for currency formatting.                                                                                                                                                                                                                                                                                 |
| `min`                     | `number`                                                  | `-Infinity` | Limit minimum value                                                                                                                                                                                                                                                                                                              |
| `minimumFractionDigits`   | `number`                                                  | `—`         | Minimum fraction digits for currency formatting.                                                                                                                                                                                                                                                                                 |
| `parser`                  | `(value: string) => string \| number`                     | `—`         | Specifies how to convert back number string from formatter and use them in conjunction with formatter                                                                                                                                                                                                                            |
| `precision`               | `number`                                                  | `—`         | Numerical precision                                                                                                                                                                                                                                                                                                              |
| `pressInterval`           | `number`                                                  | `250`       | How often will the click event be triggered when the button is long pressed, in milliseconds                                                                                                                                                                                                                                     |
| `pressTimeout`            | `number`                                                  | `250`       | When the button is long pressed, how long will the click event be triggered after the delay, in milliseconds                                                                                                                                                                                                                     |
| `scientificNotation`      | `boolean \| ScientificNotationConfig`                     | `false`     | Enable scientific notation display. Displays in scientific notation when out of focus, and displays the full number when in focus. You can pass an object to configure the `threshold`, which defaults to 15 significant digits. Not supported in currency mode                                                                  |
| `shiftStep`               | `number`                                                  | `10`        | Step size for pressing the shift key, it can be a decimal. The default value was adjusted from 1 to 10 in v2.13                                                                                                                                                                                                                  |
| `showCurrencySymbol`      | `boolean`                                                 | `true`      | Whether to display the currency symbol/code/name, only valid in currency mode                                                                                                                                                                                                                                                    |
| `step`                    | `number`                                                  | `1`         | Each time you change the number of steps, it can be a decimal.                                                                                                                                                                                                                                                                   |

### ScientificNotationConfig

| Property    | Type     | Default | Description                                                      |
| ----------- | -------- | ------- | ---------------------------------------------------------------- |
| `threshold` | `number` | `—`     | Significant-digit threshold for scientific notation; default 15. |

### Events

#### InputNumber

| Event               | Payload                                          |
| ------------------- | ------------------------------------------------ |
| `blur`              | `event: FocusEvent`                              |
| `change`            | `value: InputNumberValue, event?: Event \| null` |
| `downClick`         | `value: string, event: MouseEvent`               |
| `focus`             | `event: FocusEvent`                              |
| `keydown`           | `event: KeyboardEvent`                           |
| `numberChange`      | `value: number, event?: Event \| null`           |
| `upClick`           | `value: string, event: MouseEvent`               |
| `update:modelValue` | `value: InputNumberValue`                        |
| `update:value`      | `value: InputNumberValue`                        |

### Slots and types

Input / InputNumber provide #addonBefore, #addonAfter, #clearIcon, #insetLabel, #prefix and #suffix. Prefer slots for complex VNode content. InputGroup accepts input components in its default slot.
InputNumber inherits InputProps and redeclares value/defaultValue/modelValue/suffix/className. Values are string | number and clearing may yield an empty string. currencyDisplay is code | symbol | name.

Use kebab-case for camelCase events in templates, such as @enter-press, @number-change, @after-change and @input-change. keydown, keypress and keyup remain lowercase. Use native Vue class and style.

## Methods

Some internal methods provided by InputNumber can be accessed through ref:

| Name    | Description     |
| ------- | --------------- |
| blur()  | Move the focus. |
| focus() | Get the focus.  |

## Accessibility

Guideline: https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/

### ARIA

- InputNumber has `spinbutton` role
- spinbutton uses `aria-valuenow` for current value, `aria-valuemax` for acceptable maximum value, and `aria-valuemin` for acceptable minimum value
- When InputNumber is used in Form, the value of the input box's `aria-labeledby` reference is Field label

### Keyboard and Focus

- InputNumber can get focus, keyboard users can use `Tab` and `Shift + Tab` to switch focus (Increase and decrease buttons are not focusable)
- Keyboard users can press up key ⬆️ or down key ⬇️ and the input value will increase or decrease by `step` (default is 1)
- Hold down Shift + Up ⬆️ or Down ⬇️ , the input value will increase or decrease by `shiftStep` (default is 10)

## Design Tokens

::token-table{component="inputNumber"}
::

## React → Vue migration

| React                                     | Vue                                                                                |
| ----------------------------------------- | ---------------------------------------------------------------------------------- |
| `@douyinfe/semi-ui`                       | `@aifuxi/semi-ui-vue/input-number` + `@aifuxi/semi-theme-default/input-number.css` |
| `value` + `onChange`                      | `v-model` / `v-model:value` / `:value` + `@change`                                 |
| `defaultValue`                            | `default-value`                                                                    |
| `useState` / `useMemo`                    | `shallowRef` / `computed`                                                          |
| `className` / `style={{ ... }}`           | `class` / `:style="{ ... }"`                                                       |
| `ref.current.focus()` / `.blur()`         | `focus()` / `blur()` on a template ref                                             |
| `prefix={<Icon />}` / `suffix={<Node />}` | `#prefix` / `#suffix` slots                                                        |
| `forwardRef` / `forwardedRef`             | readonly input on a template ref (textarea for TextArea), plus select()            |

## FAQ

### Why are formatter and parser usually paired?

formatter converts a value to display text; parser converts display text back to a numeric string. Controlled numeric values are formatted on the first render in v2.102.0.

### Why does changing currency locale need a key?

The demo follows upstream by changing key with the locale so formatting state initializes under the new LocaleProvider. Scientific notation does not support currency mode or extend JavaScript Number precision.
