# Input

Input, InputGroup, and TextArea target Semi Design v2.102.0. They preserve the `.semi-input*` DOM/classes, states, theme tokens, keyboard and ARIA behavior, IME handling, and TextArea resize/line-number contracts.

## Basic usage

The first visible example from the pinned English documentation becomes:

```vue
<script setup lang="ts">
import { Input } from '@aifuxi/semi-ui-vue';
</script>

<template>
  <Input default-value="hi" />
</template>
```

Use `v-model` for controlled input. If `value` and `modelValue` are both present, `value` wins.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Input } from '@aifuxi/semi-ui-vue';

const value = ref('semi.design');
</script>

<template>
  <Input v-model="value" prefix="https://" suffix=".com" show-clear />
</template>
```

## Password, addons, and slots

```vue
<Input mode="password" default-value="123456" />
<Input addon-before="http://" addon-after=".com" default-value="semi" />
<Input show-clear>
  <template #prefix>Prefix</template>
  <template #suffix>Suffix</template>
  <template #clearIcon>Clear</template>
</Input>
```

`addonBefore`, `addonAfter`, `prefix`, `suffix`, `insetLabel`, and `clearIcon` accept either a same-name prop or a named slot. The slot wins.

## InputGroup

```vue
<InputGroup :label="{ text: 'Website', name: 'website', required: true }">
  <Input default-value="https://" />
  <Input default-value="semi.design" />
</InputGroup>
```

Group `size` and `disabled` values are fallbacks for direct children. An explicit child `false` still wins. The group emits `focus`/`blur` and preserves `role="group"`.

## TextArea

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { TextArea } from '@aifuxi/semi-ui-vue';

const value = ref('First line\nSecond line');
</script>

<template>
  <TextArea
    v-model="value"
    :autosize="{ minRows: 2, maxRows: 6 }"
    show-counter
    show-line-number
    :max-count="200"
    @resize="({ height, width }) => console.log(height, width)"
  />
</template>
```

`autosize` follows content height. An explicit `resize` enables native browser resizing and emits width/height. When both are present, autosize wins and disables native resizing.

## API

### Input

| Prop                                    | Type                                     | Default     |
| --------------------------------------- | ---------------------------------------- | ----------- |
| `value` / `modelValue` / `defaultValue` | `string \| number`                       | -           |
| `addonBefore` / `addonAfter`            | `VNodeChild`                             | `''`        |
| `prefix` / `suffix` / `insetLabel`      | `VNodeChild`                             | `''`        |
| `insetLabelId`                          | `string`                                 | -           |
| `mode`                                  | `'password'`                             | -           |
| `type`                                  | `string`                                 | `'text'`    |
| `size`                                  | `'small' \| 'default' \| 'large'`        | `'default'` |
| `showClear` / `hideSuffix`              | `boolean`                                | `false`     |
| `clearIcon`                             | `VNodeChild`                             | IconClear   |
| `disabled` / `readonly` / `borderless`  | `boolean`                                | `false`     |
| `validateStatus`                        | `default \| warning \| error \| success` | `default`   |
| `maxLength` / `minLength`               | `number`                                 | -           |
| `getValueLength`                        | `(value: string) => number`              | -           |
| `composition`                           | `boolean`                                | `false`     |
| `autoFocus` / `preventScroll`           | `boolean`                                | `false`     |
| `inputStyle`                            | `StyleValue`                             | -           |

Events: `change(value, event)`, `input`, `focus`, `blur`, `clear`, `enterPress`, `keydown/keypress/keyup`, `compositionStart/End/Update`, and `update:value/update:modelValue`. The instance exposes `input`, `focus()`, `blur()`, and `select()`.

### TextArea

| Prop                                                         | Type                                                        | Default    |
| ------------------------------------------------------------ | ----------------------------------------------------------- | ---------- |
| `value` / `modelValue` / `defaultValue`                      | `string`                                                    | -          |
| `rows` / `cols`                                              | `number`                                                    | `4` / `20` |
| `autosize`                                                   | `boolean \| { minRows?, maxRows? }`                         | `false`    |
| `resize`                                                     | `none \| both \| horizontal \| vertical \| block \| inline` | -          |
| `showCounter` / `showClear` / `showLineNumber`               | `boolean`                                                   | `false`    |
| `maxCount`                                                   | `number`                                                    | -          |
| `lineNumberStart`                                            | `number`                                                    | `1`        |
| `lineNumberClassName` / `lineNumberStyle`                    | class / style                                               | -          |
| `textareaStyle`                                              | `StyleValue`                                                | -          |
| `disabledEnterStartNewLine`                                  | `boolean`                                                   | `false`    |
| `getValueLength` / `maxLength` / `minLength` / `composition` | Same as Input                                               | -          |

Events keep the Input names where applicable and add `resize({ height, width? })`. The instance exposes `textarea`, `focus()`, `blur()`, and `select()`.

### InputGroup

`size`, `disabled`, `label`, `labelPosition`, `className`, `style`, plus `focus/blur` events. See the [alignment matrix](./alignment.md) for the complete DOM, event order, ARIA, SSR, visual, and deviation evidence.

## React → Vue

| React                            | Vue                                                             |
| -------------------------------- | --------------------------------------------------------------- |
| `value` + `onChange`             | `v-model`; `value` + `@change` also remains available           |
| `onClear` / `onEnterPress`       | `@clear` / `@enterPress`                                        |
| `prefix/suffix/addon*` ReactNode | Same-name prop or named slot                                    |
| `clearIcon`                      | `#clearIcon` or same-name prop                                  |
| InputGroup child cloning         | Default slot; group values only fill missing direct-child props |
| `Input.TextArea` concept         | Named `TextArea`; the script object also keeps `Input.TextArea` |
| React forwardRef                 | Vue component ref `input/textarea/focus/blur/select`            |
