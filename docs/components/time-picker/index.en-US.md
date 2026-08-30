# TimePicker

TimePicker accepts typed values or scroll-panel selections for a single time or a range while preserving the Semi Design v2.102.0 format, state, Portal, theme, and keyboard contracts.

## Basic usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { TimePicker } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/time-picker.css';

const value = ref<Date>();
</script>

<template>
  <TimePicker v-model="value" placeholder="Select time" />
</template>
```

## Range, steps, and disabled time

```vue
<TimePicker
  v-model="range"
  type="timeRange"
  :minute-step="15"
  hide-disabled-options
  :disabled-time="
    (_value, panelType) => ({
      disabledHours: () => (panelType === 'left' ? [0, 1] : [22, 23]),
    })
  "
/>
```

## Custom panel and trigger

```vue
<TimePicker v-model="value">
  <template #panelHeader>Business hours</template>
  <template #trigger="{ inputValue, openPanel, clear }">
    <button type="button" @click="openPanel">
      {{ inputValue || 'Select time' }}
    </button>
    <button type="button" @click.stop="clear">Clear</button>
  </template>
</TimePicker>
```

## API summary

| Prop                                        | Type                                | Default                  | Description                                                  |
| ------------------------------------------- | ----------------------------------- | ------------------------ | ------------------------------------------------------------ |
| `modelValue` / `value` / `defaultValue`     | `string \| number \| Date \| Array` | —                        | Native model, compatible controlled value, and initial value |
| `open` / `defaultOpen`                      | `boolean`                           | `false`                  | Controlled state and initial state; supports `v-model:open`  |
| `type`                                      | `'time' \| 'timeRange'`             | `'time'`                 | Single or range mode                                         |
| `format`                                    | `string`                            | `HH:mm:ss`               | date-fns v2 format; `a h:mm:ss` in 12-hour mode              |
| `use12Hours`                                | `boolean`                           | `false`                  | Display the AM/PM column                                     |
| `hourStep` / `minuteStep` / `secondStep`    | `number`                            | `1`                      | Positive integer steps for each column                       |
| `disabledHours/Minutes/Seconds`             | `function`                          | empty arrays             | Disable hours, minutes, and seconds in single mode           |
| `disabledTime`                              | `(value, panelType) => rules`       | —                        | Return distinct rules for the left and right range panels    |
| `hideDisabledOptions`                       | `boolean`                           | `false`                  | Hide disabled options instead of keeping them visible        |
| `showClear` / `inputReadOnly`               | `boolean`                           | `true` / `false`         | Clear control and read-only input state                      |
| `getPopupContainer` / `position` / `zIndex` | —                                   | body / adaptive / `1030` | Portal container, placement, and stacking level              |
| `timeZone`                                  | `string \| number`                  | ConfigProvider           | IANA/GMT string or hour offset                               |

Events include `change`, `openChange`, `focus`, `blur`, `update:modelValue`, `update:value`, and `update:open`. The exposed instance provides `focus()`, `blur()`, `open()`, and `close()`.

## React → Vue migration

| React                                   | Vue                                                                 |
| --------------------------------------- | ------------------------------------------------------------------- |
| `value` + `onChange`                    | `v-model` or `:value` + `@change`                                   |
| `open` + `onOpenChange`                 | `v-model:open` or `:open` + `@open-change`                          |
| `panelHeader` / `panelFooter` ReactNode | `#panelHeader` / `#panelFooter`; same-name props remain available   |
| `triggerRender(props)`                  | `#trigger="props"`; the function prop remains as a migration bridge |
| `clearIcon` / `insetLabel` ReactNode    | `#clearIcon` / `#insetLabel`; same-name props remain available      |
| `ref.current.focus()`                   | Call `focus()` on the Vue template ref                              |

By default, `change` still provides Date (or Date array) first and the formatted string second. Set `onChangeWithDateFirst` to `false` to swap the argument order.

See [alignment.md](./alignment.md) for the full evidence matrix and deviations.
