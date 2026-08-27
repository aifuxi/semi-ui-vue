# Checkbox

Checkbox selects between two opposite states; CheckboxGroup manages a set of multiple selections. The Vue port matches the pinned Semi Design v2.102.0 DOM, state, keyboard, ARIA, card styles, and event order.

## Basic usage

```vue
<script setup lang="ts">
import { Checkbox, type CheckboxChangeEvent } from '@workspace/ui';

function changed(event: CheckboxChangeEvent) {
  console.log(event.target.checked);
}
</script>

<template>
  <Checkbox aria-label="Checkbox example" @change="changed">Semi Design</Checkbox>
</template>
```

`defaultChecked` creates uncontrolled state. `v-model`, `modelValue`, or `checked` creates controlled state; the compatibility `checked` prop has the highest priority.

```vue
<Checkbox default-checked>Checked by default</Checkbox>
<Checkbox v-model="accepted">Accept terms</Checkbox>
<Checkbox disabled>Disabled</Checkbox>
<Checkbox indeterminate>Partially selected</Checkbox>
```

## Extra text and cards

```vue
<Checkbox extra="Supporting description">Title</Checkbox>

<CheckboxGroup type="card" :default-value="['design']">
  <Checkbox value="design" extra="Design system">Semi Design</Checkbox>
  <Checkbox value="vue" extra="Vue component port">Semi UI Vue</Checkbox>
</CheckboxGroup>
```

`pureCard` hides the visible box while keeping the native input, keyboard focus, and accessibility semantics.

## CheckboxGroup

```vue
<CheckboxGroup
  v-model="selected"
  :options="['Semi UI', 'Semi DSM', 'Semi D2C']"
  direction="horizontal"
  aria-label="Product selection"
/>
```

Checkbox items can also be declared in the default slot. Only a Checkbox with an explicitly supplied `value` joins the nearest Group. `0`, `false`, and the empty string are valid values.

## React → Vue

| React v2.102.0                     | Vue                                                              |
| ---------------------------------- | ---------------------------------------------------------------- |
| `checked` / `onChange`             | `v-model`, or `:checked` + `@change`                             |
| `defaultChecked`                   | `default-checked`                                                |
| `children`                         | default slot                                                     |
| `extra`                            | `extra` prop or `#extra` slot                                    |
| `<Checkbox.Group>`                 | `<CheckboxGroup>`; `Checkbox.Group` remains available in scripts |
| Group `value` / `onChange`         | `v-model`, or `:value` + `@change`                               |
| option ReactNode `label` / `extra` | VNodeChild; prefer default/extra slots for complex content       |
| `className` / `style`              | native Vue `class` / `style`                                     |
| `ref.current.focus()`              | component-ref `focus()`; `blur()` and `input` are also exposed   |

## Public types

Checkbox provides `checked/modelValue/defaultChecked/disabled/indeterminate/value/type/extra/addonId/extraId/preventScroll` and ARIA props, and emits `change`, `update:checked`, and `update:modelValue`. CheckboxGroup provides `value/modelValue/defaultValue/options/disabled/name/direction/type`, and emits `change`, `update:value`, and `update:modelValue`.

See the [alignment matrix](./alignment.md) for source evidence, event ordering, VNode gates, SSR, and the visual matrix.
