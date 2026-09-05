<script setup lang="ts">
import { DatePicker } from '@aifuxi/semi-ui-vue/date-picker';
import '@aifuxi/semi-theme-default/date-picker.css';
import type { DatePickerProps } from '@aifuxi/semi-ui-vue/date-picker';
const today = new Date(2024, 7, 15, 10, 24, 30);
const disabledDate: NonNullable<DatePickerProps['disabledDate']> = (date, options) => {
  if (!date) return false;
  const count =
    options?.rangeInputFocus === 'rangeStart' ? 2 : options?.rangeInputFocus === 'rangeEnd' ? 3 : 0;
  if (!count) return false;
  const start = new Date(2024, 7, 15 - count),
    end = new Date(2024, 7, 15 + count);
  return start <= date && date <= end;
};
</script>
<template>
  <div>
    <div>
      <h4>
        {{
          `Start date disables 2 days before and 2 days after today, end date disables 3 days before and 3 days after today`
        }}
      </h4>
      <DatePicker
        :motion="false"
        type="dateRange"
        :disabled-date="disabledDate"
        :default-picker-value="today"
      ></DatePicker>
    </div>
  </div>
</template>
