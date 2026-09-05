---
title: 'Input'
description: 'Input is a basic component for users to enter and edit text.'
locale: 'en-US'
slug: 'input'
category: 'input'
order: 41
englishTitle: 'Input'
icon: 'doc-input'
upstream: 'input/input'
---

## Demos

### How to import

```ts
import { Input } from '@aifuxi/semi-ui-vue/input';
import '@aifuxi/semi-theme-default/input.css';
```

### Basic Usage

::demo-block{demo="input/en-us/Basic" title="Basic Usage"}
::

### Size

Support three sizes: `large`, `default`, and `small`.

::demo-block{demo="input/en-us/Size" title="Size"}
::

### Disabled

::demo-block{demo="input/en-us/Disabled" title="Disabled"}
::

### Prefix/Suffix

When the content of `prefix` and `suffix` is text or Semi Icon, the left and right margin will be automatically added. If it is a custom VNodeChild, the left and right margin will be 0

::demo-block{demo="input/en-us/Affixes" title="Prefix/Suffix"}
::

### Addon

When the content of `addonBefore` and `addonAfter` is text or Semi Icon, the left and right margin will be automatically added. If it is a custom VNodeChild, the left and right margin will be 0.

::demo-block{demo="input/en-us/Addons" title="Addon"}
::

### Clear Icon

Use `showClear` to allow clear current value when clicking on clear icon.

::demo-block{demo="input/en-us/Clear" title="Clear Icon"}
::

### Password Mode

Hide the content of input

::demo-block{demo="input/en-us/Password" title="Password Mode"}
::

### Validation

You can set different `validateStatus` to provide style feedback to the user.

::demo-block{demo="input/en-us/Validation" title="Validation"}
::

### Controlled Component

You can use `value` along with `@change` property if you want to use Input as a controlled component.

::demo-block{demo="input/en-us/Controlled" title="Controlled Component"}
::

### InputGroup

You could put multiple text field input into `<InputGroup>` and set `size`, `disabled` to the entire group. Supported fields include: `Input`， `InputNumber`， `Select`， `AutoComplete`、`TreeSelect`、`Cascader`、`DatePicker`

> **Notice**
>
> InputGroup does not recommend inserting non-supported elements. Form.InputGroup will perform error aggregation on supported elements without customizing the elements for processing.

::demo-block{demo="input/en-us/Group" title="InputGroup"}
::

::demo-block{demo="input/en-us/GroupTree" title="InputGroup"}
::

### TextArea

Used for multi-line text. You can set `maxCount` to restrict text entering and display text count. `showClear` is supported.

::demo-block{demo="input/en-us/TextArea" title="TextArea"}
::

### Setting TextArea Height

You can set the style of the internal textarea element through `textareaStyle`, such as height, background color, etc.

::demo-block{demo="input/en-us/TextAreaHeight" title="Setting TextArea Height"}
::

### Line Numbers

Set `showLineNumber` to display line numbers. You can use `lineNumberStart` to set the starting line number, and customize the line number area via `lineNumberStyle`/`lineNumberClassName`.

::demo-block{demo="input/en-us/LineNumbers" title="Line Numbers"}
::

### Line break by Shift + Enter

By default, in a TextArea, both `Enter` and `Shift` + `Enter` can achieve line breaks.
Through appropriate event listening and disabling the default behavior, you can achieve disabling line breaks with Enter and only allowing line breaks with Shift + Enter.

::demo-block{demo="input/en-us/ShiftEnter" title="Line break by Shift + Enter"}
::

### Autosize TextArea

You can set `autosize` to allow TextArea resizing height with content.

::demo-block{demo="input/en-us/Autosize" title="Autosize TextArea"}
::

### Custom calculated character string length

By setting the getValueLength property, you can customize the length of the character string. With maxLength and minLength, you can support emoji length to calculate according to the visible length.

What is done inside Semi when getValueLength is passed in:

- maxLength: maxLength is not passed directly to the native input. If the input length exceeds the maximum limit, the legal length character entered last time is used.
- minLength: dynamically switch the length of minLength, emoji is calculated according to a length.
- maxCount: compare the values obtained using getValueLength with maxCount

::demo-block{demo="input/en-us/ValueLength" title="Custom calculated character string length"}
::

Answers to some questions:

> Why not just import the `grapheme-splitter` package? The uncompressed size of this package is 200+ kB, which is a bit too large for users who do not need to calculate emoji according to the visible length. Therefore, Semi chose to use the length calculation function as an argument for users to pass in

> Why not modify maxLength dynamically? Modify maxLength dynamically after the input operation is completed, calculate the remaining character length that can be entered. If the maxLength is set to 1, you want to enter a '💖' with a length of 2, but due to the limitation of input maxLength, you can't enter it at all here, and you can't update maxLength.

### IME Input Mode

By setting the `composition` property to `true`, you can enable IME input mode. In this mode, when using an IME (e.g., Chinese pinyin input), `@change` will not be triggered during IME confirmation (e.g., while pinyin is being typed), and will only be triggered once after the IME confirms the input. This is useful for real-time search scenarios to avoid unnecessary requests during pinyin input.

Both Input and TextArea support this property.

::demo-block{demo="input/en-us/Composition" title="IME Input Mode"}
::

## API Reference

### Input

| Property                  | Type                                                      | Default     | Description                                                                                                                                                                                             |
| ------------------------- | --------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ariaDescribedby`         | `string`                                                  | `—`         | Description element ids.                                                                                                                                                                                |
| `ariaErrormessage`        | `string`                                                  | `—`         | Error message element id.                                                                                                                                                                               |
| `ariaInvalid`             | `boolean \| 'false' \| 'true' \| 'grammar' \| 'spelling'` | `—`         | ARIA invalid state.                                                                                                                                                                                     |
| `ariaLabel`               | `string`                                                  | `—`         | Accessible name; use aria-label in templates.                                                                                                                                                           |
| `ariaLabelledby`          | `string`                                                  | `—`         | Label element ids; use aria-labelledby in templates.                                                                                                                                                    |
| `ariaRequired`            | `boolean \| 'false' \| 'true'`                            | `—`         | ARIA required state.                                                                                                                                                                                    |
| `addonAfter`              | `VNodeChild`                                              | `—`         | Addon after input box                                                                                                                                                                                   |
| `addonBefore`             | `VNodeChild`                                              | `—`         | Addon before input box                                                                                                                                                                                  |
| `autoFocus`               | `boolean`                                                 | `false`     | Focus after mounting.                                                                                                                                                                                   |
| `borderless`              | `boolean`                                                 | `false`     | borderless mode                                                                                                                                                                                         |
| `className`               | `HTMLAttributes['class']`                                 | `—`         | class name of the group                                                                                                                                                                                 |
| `clearIcon`               | `VNodeChild`                                              | `—`         | Can be used to customize the clear button, valid when showClear is true                                                                                                                                 |
| `composition`             | `boolean`                                                 | `false`     | Whether to enable IME composition input mode. When enabled, `@change` will not be triggered during IME composition (e.g., Chinese pinyin input), and will only be triggered once after composition ends |
| `defaultValue`            | `InputValue`                                              | `—`         | Default value                                                                                                                                                                                           |
| `disabled`                | `boolean`                                                 | `false`     | disabled                                                                                                                                                                                                |
| `getValueLength`          | `(value: string) => number`                               | `—`         | Custom calculated character string length                                                                                                                                                               |
| `hideSuffix`              | `boolean`                                                 | `false`     | Toggle whether to hide suffix if clear icon is shown，by default the two icon are side by side                                                                                                          |
| `id`                      | `string`                                                  | `—`         | Component element id.                                                                                                                                                                                   |
| `inputStyle`              | `StyleValue`                                              | `—`         | Style of the native input element.                                                                                                                                                                      |
| `insetLabel`              | `VNodeChild`                                              | `—`         | Inset label, also available as the insetLabel slot.                                                                                                                                                     |
| `insetLabelId`            | `string`                                                  | `—`         | Inset label element id.                                                                                                                                                                                 |
| `maxLength`               | `number`                                                  | `—`         | Maximum input length; getValueLength can customize the calculation.                                                                                                                                     |
| `minLength`               | `number`                                                  | `—`         | Minimum input length; getValueLength can customize the calculation.                                                                                                                                     |
| `mode`                    | `InputMode`                                               | `—`         | mode of input，optional: `password`                                                                                                                                                                     |
| `modelValue`              | `InputValue \| undefined`                                 | `—`         | Controlled value for v-model.                                                                                                                                                                           |
| `onlyBorder`              | `number`                                                  | `—`         | Internal compatibility border style parameter.                                                                                                                                                          |
| `placeholder`             | `InputValue`                                              | `—`         | Content to be appear by default                                                                                                                                                                         |
| `prefix`                  | `VNodeChild`                                              | `—`         | Prefix                                                                                                                                                                                                  |
| `preventScroll`           | `boolean`                                                 | `—`         | Indicates whether the browser should scroll the document to display the newly focused element, acting on the focus method inside the component, excluding the component passed in by the user           |
| `readonly`                | `boolean`                                                 | `false`     | Read-only, not editable                                                                                                                                                                                 |
| `showClear`               | `boolean`                                                 | `false`     | Display the clear button when the input box has content and hover or focus                                                                                                                              |
| `showClearIgnoreDisabled` | `boolean`                                                 | `—`         | Internal compatibility option for showing clear while disabled.                                                                                                                                         |
| `size`                    | `InputSize`                                               | `'default'` | input box size, large, default, small                                                                                                                                                                   |
| `suffix`                  | `VNodeChild`                                              | `—`         | Suffix                                                                                                                                                                                                  |
| `type`                    | `string`                                                  | `'text'`    | Input type attribute, same with html ` `                                                                                                                                                                |
| `validateStatus`          | `InputValidateStatus`                                     | `'default'` | Validate status for styling only, one of `default`, `error`, `warning`                                                                                                                                  |
| `value`                   | `InputValue \| undefined`                                 | `—`         | Current value of input box                                                                                                                                                                              |

### TextArea

| Property                    | Type                                                      | Default     | Description                                                                                                                                                                                             |
| --------------------------- | --------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ariaDescribedby`           | `string`                                                  | `—`         | Description element ids.                                                                                                                                                                                |
| `ariaErrormessage`          | `string`                                                  | `—`         | Error message element id.                                                                                                                                                                               |
| `ariaInvalid`               | `boolean \| 'false' \| 'true' \| 'grammar' \| 'spelling'` | `—`         | ARIA invalid state.                                                                                                                                                                                     |
| `ariaLabel`                 | `string`                                                  | `—`         | Accessible name; use aria-label in templates.                                                                                                                                                           |
| `ariaLabelledby`            | `string`                                                  | `—`         | Label element ids; use aria-labelledby in templates.                                                                                                                                                    |
| `ariaRequired`              | `boolean \| 'false' \| 'true'`                            | `—`         | ARIA required state.                                                                                                                                                                                    |
| `autoFocus`                 | `boolean`                                                 | `false`     | Focus after mounting.                                                                                                                                                                                   |
| `autosize`                  | `boolean \| AutosizeRows`                                 | `false`     | Toggle whether to allow autosize when content height changes, can config max and min rows by object value`{minRows?: number, maxRows?: number}`                                                         |
| `borderless`                | `boolean`                                                 | `false`     | borderless mode                                                                                                                                                                                         |
| `className`                 | `HTMLAttributes['class']`                                 | `—`         | class name of the group                                                                                                                                                                                 |
| `cols`                      | `number`                                                  | `20`        | The visible width of the text control, in average character widths. If it is specified, it must be a positive integer.                                                                                  |
| `composition`               | `boolean`                                                 | `false`     | Whether to enable IME composition input mode. When enabled, `@change` will not be triggered during IME composition (e.g., Chinese pinyin input), and will only be triggered once after composition ends |
| `defaultValue`              | `string`                                                  | `—`         | Default value                                                                                                                                                                                           |
| `disabled`                  | `boolean`                                                 | `false`     | disabled                                                                                                                                                                                                |
| `disabledEnterStartNewLine` | `boolean`                                                 | `false`     | Prevent Enter from adding a line while preserving Shift + Enter.                                                                                                                                        |
| `getValueLength`            | `(value: string) => number`                               | `—`         | Custom calculated character string length                                                                                                                                                               |
| `id`                        | `string`                                                  | `—`         | Component element id.                                                                                                                                                                                   |
| `lineNumberClassName`       | `HTMLAttributes['class']`                                 | `—`         | ClassName for line number area                                                                                                                                                                          |
| `lineNumberStart`           | `number`                                                  | `1`         | Starting line number                                                                                                                                                                                    |
| `lineNumberStyle`           | `StyleValue`                                              | `—`         | Style for line number area                                                                                                                                                                              |
| `maxCount`                  | `number`                                                  | `—`         | The maximum number of characters and display count                                                                                                                                                      |
| `maxLength`                 | `number`                                                  | `—`         | Maximum input length; getValueLength can customize the calculation.                                                                                                                                     |
| `minLength`                 | `number`                                                  | `—`         | Minimum input length; getValueLength can customize the calculation.                                                                                                                                     |
| `modelValue`                | `string \| undefined`                                     | `—`         | Controlled value for v-model.                                                                                                                                                                           |
| `placeholder`               | `string`                                                  | `—`         | Content to be appear by default                                                                                                                                                                         |
| `preventScroll`             | `boolean`                                                 | `—`         | Indicates whether the browser should scroll the document to display the newly focused element, acting on the focus method inside the component, excluding the component passed in by the user           |
| `readonly`                  | `boolean`                                                 | `false`     | Read-only, not editable                                                                                                                                                                                 |
| `resize`                    | `TextAreaResize`                                          | `—`         | Whether to allow user to resize the textarea and in which direction. Options: `none` \                                                                                                                  |
| `rows`                      | `number`                                                  | `4`         | The number of visible text lines for the control.                                                                                                                                                       |
| `showClear`                 | `boolean`                                                 | `false`     | Display the clear button when the input box has content and hover or focus                                                                                                                              |
| `showCounter`               | `boolean`                                                 | `false`     | Show the TextArea character counter.                                                                                                                                                                    |
| `showLineNumber`            | `boolean`                                                 | `false`     | Whether to display line numbers                                                                                                                                                                         |
| `textareaStyle`             | `StyleValue`                                              | `—`         | Style for the textarea element, can be used to set height, background color, etc.                                                                                                                       |
| `validateStatus`            | `InputValidateStatus`                                     | `'default'` | Validate status for styling only, one of `default`, `error`, `warning`                                                                                                                                  |
| `value`                     | `string \| undefined`                                     | `—`         | Current value of input box                                                                                                                                                                              |

### InputGroup

| Property        | Type                        | Default     | Description                           |
| --------------- | --------------------------- | ----------- | ------------------------------------- |
| `className`     | `HTMLAttributes['class']`   | `—`         | class name of the group               |
| `disabled`      | `boolean`                   | `—`         | disabled                              |
| `label`         | `InputGroupLabelProps`      | `—`         | Label property of InputGroup          |
| `labelPosition` | `'top' \| 'left' \| string` | `—`         | label position, optional top or left  |
| `size`          | `InputSize`                 | `'default'` | input box size, large, default, small |
| `style`         | `StyleValue`                | `—`         | styles for the group                  |

### InputGroupLabel

| Property    | Type                          | Default | Description                   |
| ----------- | ----------------------------- | ------- | ----------------------------- |
| `align`     | `'left' \| 'right' \| string` | `—`     | Label alignment.              |
| `className` | `HTMLAttributes['class']`     | `—`     | class name of the group       |
| `disabled`  | `boolean`                     | `—`     | disabled                      |
| `extra`     | `VNodeChild`                  | `—`     | Additional label description. |
| `id`        | `string`                      | `—`     | Component element id.         |
| `name`      | `string`                      | `—`     | Associated control name.      |
| `optional`  | `boolean`                     | `—`     | Show optional-field text.     |
| `required`  | `boolean`                     | `—`     | Show a required marker.       |
| `style`     | `CSSProperties`               | `—`     | styles for the group          |
| `text`      | `VNodeChild`                  | `—`     | Displayed label content.      |
| `width`     | `number \| string`            | `—`     | Label width.                  |

### AutosizeRows

| Property  | Type     | Default | Description            |
| --------- | -------- | ------- | ---------------------- |
| `minRows` | `number` | `—`     | Minimum autosize rows. |
| `maxRows` | `number` | `—`     | Maximum autosize rows. |

### Events

#### Input

| Event               | Payload                       |
| ------------------- | ----------------------------- |
| `blur`              | `event: FocusEvent`           |
| `change`            | `value: string, event: Event` |
| `clear`             | `event: Event`                |
| `compositionEnd`    | `event: CompositionEvent`     |
| `compositionStart`  | `event: CompositionEvent`     |
| `compositionUpdate` | `event: CompositionEvent`     |
| `enterPress`        | `event: KeyboardEvent`        |
| `focus`             | `event: FocusEvent`           |
| `input`             | `event: Event`                |
| `keydown`           | `event: KeyboardEvent`        |
| `keypress`          | `event: KeyboardEvent`        |
| `keyup`             | `event: KeyboardEvent`        |
| `update:modelValue` | `value: string`               |
| `update:value`      | `value: string`               |

#### TextArea

| Event               | Payload                       |
| ------------------- | ----------------------------- |
| `blur`              | `event: FocusEvent`           |
| `change`            | `value: string, event: Event` |
| `clear`             | `event: Event`                |
| `compositionEnd`    | `event: CompositionEvent`     |
| `compositionStart`  | `event: CompositionEvent`     |
| `compositionUpdate` | `event: CompositionEvent`     |
| `enterPress`        | `event: KeyboardEvent`        |
| `focus`             | `event: FocusEvent`           |
| `input`             | `event: Event`                |
| `keydown`           | `event: KeyboardEvent`        |
| `keypress`          | `event: KeyboardEvent`        |
| `keyup`             | `event: KeyboardEvent`        |
| `resize`            | `data: TextAreaResizeData`    |
| `update:modelValue` | `value: string`               |
| `update:value`      | `value: string`               |

#### InputGroup

| Event   | Payload             |
| ------- | ------------------- |
| `blur`  | `event: FocusEvent` |
| `focus` | `event: FocusEvent` |

### Slots and types

Input / InputNumber provide #addonBefore, #addonAfter, #clearIcon, #insetLabel, #prefix and #suffix. Prefer slots for complex VNode content. InputGroup accepts input components in its default slot.
InputValue = string | number; InputSize = small | default | large; InputValidateStatus = default | error | warning | success (success is a compatibility value). TextArea resize supports none, both, horizontal, vertical, block and inline.

Use kebab-case for camelCase events in templates, such as @enter-press, @number-change, @after-change and @input-change. keydown, keypress and keyup remain lowercase. Use native Vue class and style.

## Methods

Some internal methods provided by Input can be accessed through ref:

| Name    | Description  |
| ------- | ------------ |
| blur()  | Remove focus |
| focus() | Get focus    |

## Accessibility

### ARIA

- When validateStatus is error, the aria-invalid of the input box is true
- When used in Form, field label is Input's aria-label

### Keyboard and focus

- Input can be focused, keyboard users can use Tab and Shift + Tab to switch focus
- The password button can be focused and activated with Enter or Space key after focusing

## Design Tokens

::token-table{component="input"}
::

## Related Material

See [Form](/en-us/components/form/) for related compositions.

## React → Vue migration

| React                                     | Vue                                                                     |
| ----------------------------------------- | ----------------------------------------------------------------------- |
| `@douyinfe/semi-ui`                       | `@aifuxi/semi-ui-vue/input` + `@aifuxi/semi-theme-default/input.css`    |
| `value` + `onChange`                      | `v-model` / `v-model:value` / `:value` + `@change`                      |
| `defaultValue`                            | `default-value`                                                         |
| `useState` / `useMemo`                    | `shallowRef` / `computed`                                               |
| `className` / `style={{ ... }}`           | `class` / `:style="{ ... }"`                                            |
| `ref.current.focus()` / `.blur()`         | `focus()` / `blur()` on a template ref                                  |
| `prefix={<Icon />}` / `suffix={<Node />}` | `#prefix` / `#suffix` slots                                             |
| `forwardRef` / `forwardedRef`             | readonly input on a template ref (textarea for TextArea), plus select() |
| `Input.TextArea` / `Input.Group`          | `TextArea` / `InputGroup` named exports                                 |
| `Form.Input` / `Select.Option`            | `FormInput` / `SelectOption`                                            |
| `grapheme-splitter`                       | `Intl.Segmenter` counts graphemes without an additional demo dependency |

The custom-length demo uses Chromium Intl.Segmenter for grapheme counts; both sample emoji count as one. The English autosize demo keeps its two upstream fields; Chinese also includes the minRows/maxRows scene.

## FAQ

### Why does typing pinyin trigger changes?

composition defaults to false. Enable it to emit a change after IME composition commits, which is useful for search suggestions.

### How do textareaStyle and style differ?

style targets the wrapper; textareaStyle targets the native textarea. autosize manages content height and takes precedence over resize.
