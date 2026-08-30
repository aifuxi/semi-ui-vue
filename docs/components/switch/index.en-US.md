# Switch

Switch toggles between two mutually exclusive states. This implementation uses the local Semi Design v2.102.0 source as its sole baseline and preserves the native checkbox, keyboard, and ARIA behavior.

## Basic usage

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { Switch } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/switch.css';

const enabled = shallowRef(false);
</script>

<template>
  <Switch v-model="enabled" aria-label="Enable notifications" />
</template>
```

The controlled Semi-style contract is also available:

```vue
<Switch :checked="enabled" @change="(checked) => (enabled = checked)" />
```

## Sizes, text, and states

```vue
<template>
  <Switch size="small" aria-label="Small switch" />
  <Switch default-checked checked-text="ON" unchecked-text="OFF" />
  <Switch size="large" default-checked>
    <template #checkedText>ON</template>
    <template #uncheckedText>OFF</template>
  </Switch>
  <Switch disabled aria-label="Read only" />
  <Switch loading default-checked aria-label="Saving" />
</template>
```

Inline text is not rendered at the `small` size. Put longer descriptions outside the Switch.

## API

| Prop             | Description                                                          | Type                              | Default     |
| ---------------- | -------------------------------------------------------------------- | --------------------------------- | ----------- |
| `modelValue`     | State used by default `v-model`                                      | `boolean`                         | -           |
| `checked`        | Semi-compatible controlled state; takes precedence over `modelValue` | `boolean`                         | -           |
| `defaultChecked` | Initial uncontrolled state                                           | `boolean`                         | `false`     |
| `disabled`       | Disables the switch                                                  | `boolean`                         | `false`     |
| `loading`        | Shows loading and disables the native input                          | `boolean`                         | `false`     |
| `size`           | Switch size                                                          | `'large' \| 'default' \| 'small'` | `'default'` |
| `checkedText`    | Content shown when checked; prefer the matching Vue slot             | `VNodeChild`                      | -           |
| `uncheckedText`  | Content shown when unchecked; prefer the matching Vue slot           | `VNodeChild`                      | -           |
| `id`             | Native input id                                                      | `string`                          | -           |
| `aria-*`         | label, labelledby, describedby, invalid, and errormessage            | matching ARIA type                | -           |

| Event               | Payload                            | Description               |
| ------------------- | ---------------------------------- | ------------------------- |
| `change`            | `(checked: boolean, event: Event)` | Requests a state change   |
| `update:checked`    | `(checked: boolean)`               | Updates `v-model:checked` |
| `update:modelValue` | `(checked: boolean)`               | Updates default `v-model` |

| Slot            | Description                         |
| --------------- | ----------------------------------- |
| `checkedText`   | Inline content shown when checked   |
| `uncheckedText` | Inline content shown when unchecked |

See the [alignment matrix](./alignment.md) for source evidence, DOM, event order, RTL, SSR, and React-to-Vue migration details.
