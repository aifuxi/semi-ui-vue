# PinCode

PinCode provides segmented input for verification and invitation codes. This Vue implementation targets the local Semi Design `v2.102.0` source, reuses the Vue Input, and preserves the `.semi-pincode-*` and `.semi-input-*` style contract.

## Basic usage

```vue
<script setup lang="ts">
import { PinCode } from '@workspace/ui/pin-code';
</script>

<template>
  <PinCode
    size="small"
    default-value="123456"
    @change="(value) => console.log(value)"
    @complete="(value) => console.log('pincode:', value)"
  />
  <PinCode size="default" default-value="123456" />
  <PinCode size="large" default-value="123456" />
</template>
```

## Controlled state and v-model

```vue
<script setup lang="ts">
import { PinCode } from '@workspace/ui/pin-code';
import { shallowRef } from 'vue';

const code = shallowRef('69af41');
</script>

<template>
  <PinCode v-model="code" format="mixed" />
</template>
```

Both `value` and `modelValue` establish a controlled contract; `value` wins when both are present. Input emits `change`, `update:value`, and `update:modelValue` before waiting for the parent to write the controlled value back.

## Count, format, and imperative focus

```vue
<script setup lang="ts">
import { PinCode, type PinCodeExposed } from '@workspace/ui/pin-code';
import { useTemplateRef } from 'vue';

const pinCode = useTemplateRef<PinCodeExposed>('pinCode');
</script>

<template>
  <button type="button" @click="pinCode?.focus(2)">Focus the third input</button>
  <PinCode ref="pinCode" :count="4" :format="/[A-Z]/" default-value="ABCD" />
</template>
```

`format="number"` accepts digits and `mixed` accepts ASCII digits and letters. A RegExp or per-character validation function is also supported. Paste fills from the active cell and stops at the first invalid character.

## API

| Property               | Type                                                   | Default     | Description                             |
| ---------------------- | ------------------------------------------------------ | ----------- | --------------------------------------- |
| `autoFocus`            | `boolean`                                              | `true`      | Focus the first cell after client mount |
| `count`                | `number`                                               | `6`         | Number of input cells                   |
| `defaultValue`         | `string`                                               | -           | Uncontrolled initial value              |
| `disabled`             | `boolean`                                              | `false`     | Disable every input cell                |
| `format`               | `'number' \| 'mixed' \| RegExp \| ((char) => boolean)` | `'number'`  | Per-character validation                |
| `modelValue` / `value` | `string`                                               | -           | Vue/named controlled value              |
| `size`                 | `'small' \| 'default' \| 'large'`                      | `'default'` | Input size                              |
| `className` / `style`  | Vue class/style                                        | -           | Root styling                            |

Events: `change(value)`, `complete(value)`, `update:value(value)`, and `update:modelValue(value)`. Exposed methods: `focus(index)` and `blur(index)`.

## React → Vue migration

| React                                           | Vue                                       |
| ----------------------------------------------- | ----------------------------------------- |
| `<PinCode value={value} onChange={setValue} />` | `<PinCode v-model="value" />`             |
| `onComplete={handler}`                          | `@complete="handler"`                     |
| `className="custom"`                            | `class="custom"` or `class-name="custom"` |
| `ref.current.focus(2)`                          | `pinCodeRef?.focus(2)`                    |

See the [alignment matrix](./alignment.md) for state, event order, keyboard, SSR, visual, and package evidence.
