# Slider

Slider matches Semi Design v2.102.0 for single/range values, marks, Tooltip, controlled state, mouse/touch dragging, keyboard access, vertical layout, RTL, ARIA, and theme styles.

## Install and basic usage

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { Slider } from '@workspace/ui/slider';
import '@workspace/theme-default/slider.css';

const value = shallowRef(30);
</script>

<template>
  <Slider v-model="value" aria-label="Volume" />
</template>
```

## Range and marks

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { Slider } from '@workspace/ui/slider';

const range = shallowRef<number[]>([20, 60]);
const marks = { 0: '0', 20: '20°C', 50: '50°C', 100: '100°C' };
</script>

<template>
  <Slider v-model="range" range :step="10" :marks="marks" tooltip-on-mark />
</template>
```

## API

| Prop                                | Type                                                      | Default          | Description                                    |
| ----------------------------------- | --------------------------------------------------------- | ---------------- | ---------------------------------------------- |
| `modelValue` / `value`              | `number \| number[]`                                      | -                | Controlled value; prefer Vue `v-model`         |
| `defaultValue`                      | `number \| number[]`                                      | `0`              | Uncontrolled initial value                     |
| `min` / `max` / `step`              | `number`                                                  | `0 / 100 / 1`    | Range and increment                            |
| `range`                             | `boolean`                                                 | `false`          | Two-handle range mode                          |
| `disabled`                          | `boolean`                                                 | `false`          | Disable mouse, touch, and keyboard interaction |
| `marks`                             | `Record<number, string>`                                  | -                | Marks and labels inside the closed interval    |
| `included`                          | `boolean`                                                 | `true`           | Show the selected track                        |
| `showMarkLabel`                     | `boolean`                                                 | `true`           | Show mark labels                               |
| `tipFormatter`                      | `(value) => VNodeChild \| null`                           | `value => value` | Tooltip content; use `null` to disable         |
| `tooltipVisible` / `tooltipOnMark`  | `boolean`                                                 | - / `false`      | Always-visible handle Tooltip / mark Tooltip   |
| `showArrow`                         | `boolean`                                                 | `true`           | Single-handle Tooltip arrow                    |
| `showBoundary`                      | `boolean`                                                 | `false`          | Show min/max while hovering                    |
| `vertical` / `verticalReverse`      | `boolean`                                                 | `false`          | Vertical and reversed vertical modes           |
| `handleDot`                         | `SliderHandleDot \| [SliderHandleDot?, SliderHandleDot?]` | -                | Inner handle dot style                         |
| `railStyle` / `style` / `className` | Vue style/class types                                     | -                | Rail and root wrapper customization            |
| `getAriaValueText`                  | `(value, index?) => string`                               | -                | Human-readable value for assistive technology  |

Events: `change`, `afterChange`, `mouseUp`, `update:modelValue`, and `update:value`. Range event values are sorted ascending.

## React → Vue migration

| React v2.102.0                                 | Vue                                          |
| ---------------------------------------------- | -------------------------------------------- |
| `<Slider value={value} onChange={setValue} />` | `<Slider v-model="value" />`                 |
| `<Slider range defaultValue={[20, 60]} />`     | `<Slider range :default-value="[20, 60]" />` |
| `onAfterChange={handler}`                      | `@after-change="handler"`                    |
| `onMouseUp={handler}`                          | `@mouse-up="handler"`                        |
| `getAriaValueText={formatter}`                 | `:get-aria-value-text="formatter"`           |

Horizontal position, dragging, and arrow-key behavior reverse under ConfigProvider `direction="rtl"`; vertical mode is unaffected. Arrow keys use `step`, PageUp/PageDown use ten steps, and Home/End move to the allowed boundaries.
