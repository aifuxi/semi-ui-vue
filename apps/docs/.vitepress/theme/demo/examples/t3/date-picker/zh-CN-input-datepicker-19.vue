<script setup lang="ts">
import { DatePicker } from '@aifuxi/semi-ui-vue/date-picker';
import '@aifuxi/semi-theme-default/date-picker.css';
import type { DatePickerProps } from '@aifuxi/semi-ui-vue/date-picker';
function today() {
  return new Date(2024, 7, 15, 10, 24, 30);
}
function nextValidMonth() {
  const date = today();
  date.setMonth(date.getMonth() + 1);
  return date;
}
const disabledTime: NonNullable<DatePickerProps['disabledTime']> = (date) => {
  const current = Array.isArray(date) ? date[0] : date;
  if (!current || current.toDateString() !== today().toDateString()) return {};
  return {
    disabledHours: () => [17, 18],
    disabledMinutes: (hour) => (hour === 19 ? Array.from({ length: 10 }, (_, i) => i) : []),
    disabledSeconds: (hour, minute) =>
      hour === 20 && minute === 20 ? Array.from({ length: 20 }, (_, i) => i) : [],
  };
};
const disabledTime2: NonNullable<DatePickerProps['disabledTime']> = (_date, panel) => ({
  disabledHours: () => (panel === 'left' ? [17, 18] : [12, 13, 14, 15, 16, 17, 18]),
});
function disabledDate(date?: Date) {
  const threshold = today();
  threshold.setDate(28);
  threshold.setMonth(threshold.getMonth() + 1);
  return Boolean(date && date.getTime() < threshold.getTime());
}
</script>
<template>
  <div>
    <div>
      <div>
        <h4>禁用时间：禁用今天下午5-6点</h4>
        <DatePicker
          :default-picker-value="new Date(2024, 7, 15, 10, 24, 30)"
          type="dateTime"
          :hide-disabled-options="false"
          :disabled-time="disabledTime"
        ></DatePicker>
      </div>
      <div>
        <h4>禁用时间：两个面板禁用不同时间</h4>
        <DatePicker
          :default-picker-value="new Date(2024, 7, 15, 10, 24, 30)"
          type="dateTimeRange"
          :hide-disabled-options="false"
          :disabled-time="disabledTime2"
          :style="{ width: '400px' }"
        ></DatePicker>
      </div>
      <div>
        <h4>禁用日期：禁用下个月28号之前的所有日期</h4>
        <DatePicker
          type="dateTimeRange"
          :disabled-date="disabledDate"
          :default-picker-value="nextValidMonth()"
          :style="{ width: '400px' }"
        ></DatePicker>
      </div>
    </div>
  </div>
</template>
