# DatePicker

DatePicker aligns date, date-time, range, month, and year selection with Semi Design v2.102.0. The Vue adapter retains the pinned `.semi-datepicker-*` DOM/classes, Foundation parsing, and event order while exposing native `v-model` and slots.

## Basic usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DatePicker } from '@workspace/ui';
import '@workspace/theme-default/date-picker.css';

const date = ref<Date>();
</script>

<template>
  <DatePicker v-model="date" />
</template>
```

Ranges use `Date[]`. Select another public mode with `type="dateTime"`, `dateTimeRange`, `month`, `monthRange`, or `year`. `value`/`modelValue` are controlled and `defaultValue` is uncontrolled.

## Common API

| Prop                   | Type                         | Default         | Description                                     |
| ---------------------- | ---------------------------- | --------------- | ----------------------------------------------- |
| `type`                 | `DatePickerType`             | `'date'`        | Date, range, date-time, month, or year mode     |
| `modelValue` / `value` | `DatePickerValue`            | -               | Controlled Date, timestamp, or parseable string |
| `defaultValue`         | `DatePickerValue`            | -               | Uncontrolled initial value                      |
| `open` / `defaultOpen` | `boolean`                    | - / `false`     | Controlled or uncontrolled popup state          |
| `format`               | `string`                     | type-specific   | Input and event-string format                   |
| `disabledDate`         | `(date, options) => boolean` | -               | Disables dates                                  |
| `multiple` / `max`     | `boolean` / `number`         | `false` / -     | Multiple dates and its maximum                  |
| `showClear`            | `boolean`                    | `true`          | Shows the clear action                          |
| `motion`               | `boolean`                    | `true`          | Popup motion                                    |
| `getPopupContainer`    | `() => HTMLElement`          | `document.body` | Stable Portal container                         |

Events include `change`, `openChange`, `clear`, `focus`, `blur`, `confirm`, `cancel`, `panelChange`, `presetClick`, and `maxSelect`. Value changes emit `change`, `update:modelValue`, then `update:value`.

Slots include `trigger`, `prefix`, `clearIcon`, `rangeSeparator`, `date`, `fullDate`, `top`, `bottom`, `left`, `right`, and `insetLabel`. The instance exposes `open()`, `close()`, `focus()`, `blur()`, and readonly `input`.

## Accessibility, Portal, and SSR

- The trigger keeps combobox semantics, expanded state, and ARIA passthrough; months use grid/gridcell semantics.
- A custom container should exist before first mount. Popover owns capture-scroll repositioning and unmount cleanup.
- Imports are SSR-safe. Server rendering formats the trigger without creating a Portal or browser listeners.
- Dark, mobile, RTL, and zh-CN/en-US parity run in the pinned Chromium environment.

See [alignment.md](./alignment.md) for source evidence and the verification matrix, and [react-to-vue.md](./react-to-vue.md) for migration.
