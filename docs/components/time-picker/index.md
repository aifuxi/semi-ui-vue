# TimePicker 时间选择器

TimePicker 用于输入或从滚动面板选择单个时间、时间范围，并与 Semi Design v2.102.0 的格式、状态、Portal、主题和键盘契约对齐。

## 基本用法

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { TimePicker } from '@workspace/ui';
import '@workspace/theme-default/time-picker.css';

const value = ref<Date>();
</script>

<template>
  <TimePicker v-model="value" placeholder="请选择时间" />
</template>
```

## 范围、步长与禁用时间

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

## 自定义面板与触发器

```vue
<TimePicker v-model="value">
  <template #panelHeader>营业时间</template>
  <template #trigger="{ inputValue, openPanel, clear }">
    <button type="button" @click="openPanel">
      {{ inputValue || '选择时间' }}
    </button>
    <button type="button" @click.stop="clear">清空</button>
  </template>
</TimePicker>
```

## API 摘要

| 属性                                        | 类型                                | 默认值                 | 说明                                          |
| ------------------------------------------- | ----------------------------------- | ---------------------- | --------------------------------------------- |
| `modelValue` / `value` / `defaultValue`     | `string \| number \| Date \| Array` | —                      | Vue model、兼容受控值与非受控初值             |
| `open` / `defaultOpen`                      | `boolean`                           | `false`                | 面板受控值与非受控初值，可用 `v-model:open`   |
| `type`                                      | `'time' \| 'timeRange'`             | `'time'`               | 单值或范围模式                                |
| `format`                                    | `string`                            | `HH:mm:ss`             | date-fns v2 格式；12 小时制缺省为 `a h:mm:ss` |
| `use12Hours`                                | `boolean`                           | `false`                | 显示 AM/PM 列                                 |
| `hourStep` / `minuteStep` / `secondStep`    | `number`                            | `1`                    | 各列的正整数步长                              |
| `disabledHours/Minutes/Seconds`             | `function`                          | 空数组                 | 禁用单值模式中的时、分、秒                    |
| `disabledTime`                              | `(value, panelType) => rules`       | —                      | 为 range 左右面板分别返回禁用规则             |
| `hideDisabledOptions`                       | `boolean`                           | `false`                | 从列中隐藏而不是保留禁用选项                  |
| `showClear` / `inputReadOnly`               | `boolean`                           | `true` / `false`       | 清空按钮与输入只读状态                        |
| `getPopupContainer` / `position` / `zIndex` | —                                   | body / 自适应 / `1030` | Portal 容器、placement 与层级                 |
| `timeZone`                                  | `string \| number`                  | ConfigProvider         | IANA/GMT 字符串或小时偏移                     |

事件包括 `change`、`openChange`、`focus`、`blur`、`update:modelValue`、`update:value` 与 `update:open`。公开实例提供 `focus()`、`blur()`、`open()`、`close()`。

## React → Vue 迁移

| React                                   | Vue                                               |
| --------------------------------------- | ------------------------------------------------- |
| `value` + `onChange`                    | `v-model` 或 `:value` + `@change`                 |
| `open` + `onOpenChange`                 | `v-model:open` 或 `:open` + `@open-change`        |
| `panelHeader` / `panelFooter` ReactNode | `#panelHeader` / `#panelFooter`；同名 prop 仍可用 |
| `triggerRender(props)`                  | `#trigger="props"`；函数 prop 作为迁移桥接保留    |
| `clearIcon` / `insetLabel` ReactNode    | `#clearIcon` / `#insetLabel`；同名 prop 仍可用    |
| `ref.current.focus()`                   | 模板 ref 的 `focus()`                             |

`change` 默认仍先返回 Date（或 Date 数组），第二参数为格式化字符串；将 `onChangeWithDateFirst` 设为 `false` 可交换二者顺序。

完整证据和 deviation 见 [alignment.md](./alignment.md)。
