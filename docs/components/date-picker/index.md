# DatePicker 日期选择器

DatePicker 对齐 Semi Design v2.102.0 的日期、日期时间、范围、月份和年份选择。Vue 版本保留固定 `.semi-datepicker-*` DOM/class、Foundation 解析与事件顺序，并提供原生 `v-model` 和插槽。

## 基本用法

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

范围值使用 `Date[]`；`type="dateTime"`、`dateTimeRange`、`month`、`monthRange` 或 `year` 可切换公开模式。`value`/`modelValue` 是受控输入，`defaultValue` 是非受控初值。

## 常用 API

| 参数                   | 类型                         | 默认值          | 说明                                    |
| ---------------------- | ---------------------------- | --------------- | --------------------------------------- |
| `type`                 | `DatePickerType`             | `'date'`        | 日期、范围、日期时间、月份或年份模式    |
| `modelValue` / `value` | `DatePickerValue`            | -               | 受控值；支持 Date、时间戳与可解析字符串 |
| `defaultValue`         | `DatePickerValue`            | -               | 非受控初值                              |
| `open` / `defaultOpen` | `boolean`                    | - / `false`     | 受控或非受控弹层状态                    |
| `format`               | `string`                     | 按类型推导      | 输入与事件字符串格式                    |
| `disabledDate`         | `(date, options) => boolean` | -               | 禁用日期                                |
| `multiple` / `max`     | `boolean` / `number`         | `false` / -     | 单日期模式多选及上限                    |
| `showClear`            | `boolean`                    | `true`          | 显示清除按钮                            |
| `motion`               | `boolean`                    | `true`          | 弹层动效                                |
| `getPopupContainer`    | `() => HTMLElement`          | `document.body` | 稳定 Portal 容器                        |

事件包括 `change`、`openChange`、`clear`、`focus`、`blur`、`confirm`、`cancel`、`panelChange`、`presetClick` 与 `maxSelect`。值变化后依次触发 `change`、`update:modelValue`、`update:value`。

插槽包括 `trigger`、`prefix`、`clearIcon`、`rangeSeparator`、`date`、`fullDate`、`top`、`bottom`、`left`、`right` 与 `insetLabel`。实例公开 `open()`、`close()`、`focus()`、`blur()` 和只读 `input`。

## 可访问性、Portal 与 SSR

- 触发器保留 `role="combobox"`、展开状态和 ARIA 透传；月份使用 grid/gridcell 语义。
- 自定义容器应在首次挂载前稳定存在；Popover 负责 capture scroll 重定位和卸载清理。
- 包支持 SSR-safe import；服务端预渲染格式化触发器，不创建 Portal 或浏览器监听器。
- dark、移动端、RTL 以及 zh-CN/en-US 对照均使用固定 Chromium 环境。

完整源码证据、默认值、DOM/class 与验收矩阵见 [alignment.md](./alignment.md)，React 迁移见 [react-to-vue.md](./react-to-vue.md)。
