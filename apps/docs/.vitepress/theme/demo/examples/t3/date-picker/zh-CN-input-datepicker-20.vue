<script setup lang="ts">
import { DatePicker } from '@aifuxi/semi-ui-vue/date-picker';
import '@aifuxi/semi-theme-default/date-picker.css';
import type { DatePickerProps } from '@aifuxi/semi-ui-vue/date-picker';
const disabledDate: NonNullable<DatePickerProps['disabledDate']> = (date, options) => {
  if (!date || !options?.rangeStart) return false;
  const start = new Date(options.rangeStart);
  return date.getTime() < start.getTime();
};
</script>
<template>
  <div>
    <div>
      <h4>动态禁用日期：禁止选择之前的日期</h4>
      <DatePicker
        :default-picker-value="new Date(2024, 7, 15, 10, 24, 30)"
        type="dateRange"
        :disabled-date="disabledDate"
        :style="{ width: '260px' }"
      ></DatePicker>
    </div>
  </div>
</template>
