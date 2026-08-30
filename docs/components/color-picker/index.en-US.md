# ColorPicker

ColorPicker matches Semi Design v2.102.0 for the saturation/value area, hue and alpha sliders, formatted input, EyeDropper, and Popover mode. It exposes native Vue `v-model`, events, and slots while retaining the reusable upstream names and color types.

## Basic usage

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { ColorPicker, colorStringToValue, type ColorValue } from '@workspace/ui';
import '@workspace/theme-default/color-picker.css';

const color = shallowRef<ColorValue>(colorStringToValue('#39c5bb'));
</script>

<template>
  <ColorPicker v-model="color" alpha />
</template>
```

## Popover and slots

```vue
<ColorPicker v-model="color" use-popover :popover-props="{ trigger: 'click', position: 'bottom' }">
  <button>Choose color</button>
  <template #top><strong>Brand color</strong></template>
  <template #bottom><small>{{ color.hex }}</small></template>
</ColorPicker>
```

Provide an existing stable Portal container with `popoverProps.getPopupContainer`. Close, Escape, outside-click, capture-scroll, and unmount cleanup follow the public Popover contract.

## Values and formats

`ColorValue` contains `hsva`, `rgba`, and `hex` together. `modelValue`/`value` are controlled inputs and `defaultValue` is the uncontrolled initial value. `defaultFormat` only selects the initial manual-input format.

```ts
const value = ColorPicker.colorStringToValue('rgba(57, 197, 187, 0.5)');
```

The helper accepts `#rrggbb[aa]`, `rgb(a)`, and `hsv(a)` strings. Invalid input throws an error prefixed with `Semi ColorPicker`.

## API

| Prop                     | Type                        | Default   | Description                                                         |
| ------------------------ | --------------------------- | --------- | ------------------------------------------------------------------- |
| `modelValue` / `value`   | `ColorValue`                | -         | Controlled color and matching update events                         |
| `defaultValue`           | `ColorValue`                | `#39c5bb` | Uncontrolled initial color                                          |
| `alpha`                  | `boolean`                   | `true`    | Shows the alpha slider and percentage input                         |
| `eyeDropper`             | `boolean`                   | `true`    | Shows EyeDropper; requires a secure context and supporting Chromium |
| `defaultFormat`          | `'hex' \| 'rgba' \| 'hsva'` | `'hex'`   | Initial manual-input format                                         |
| `width` / `height`       | `number`                    | `280`     | Color-area size; sliders and data row share width                   |
| `usePopover`             | `boolean`                   | `false`   | Renders the picker through Popover                                  |
| `popoverProps`           | `PopoverProps`              | `{}`      | Popover props; classes are merged with the fixed picker class       |
| `className` / `class`    | Vue class                   | -         | Picker root class                                                   |
| `style`                  | `StyleValue`                | -         | Picker root style                                                   |
| `topSlot` / `bottomSlot` | `VNodeChild`                | -         | ReactNode-compatible props; prefer the matching Vue slots           |

Events are `change(value)`, `update:modelValue(value)`, and `update:value(value)` in the pinned Adapter notification order. The default slot is the Popover trigger; `top` and `bottom` wrap the picker content.

## Accessibility and SSR

- The color area retains `aria-label="Color"` and saturation/brightness `aria-valuetext`.
- The alpha slider retains `aria-label="Alpha"` and percentage `aria-valuetext`.
- Package import is SSR-safe. Inline mode renders on the server; Popover mode renders only its trigger.
- The pinned version has no ColorPicker-specific RTL math, so hue and alpha still progress left to right.

See [alignment.md](./alignment.md) for source evidence, DOM/classes, Portal behavior, visual coverage, and deviations. See [react-to-vue.md](./react-to-vue.md) for migration.
