<script setup lang="ts">
import { DatePicker } from '@aifuxi/semi-ui-vue/date-picker';
import '@aifuxi/semi-theme-default/date-picker.css';
function shift(date: Date | undefined, days: number) {
  const result = new Date(date ?? new Date(2024, 7, 15, 10, 24, 30));
  result.setDate(result.getDate() + days);
  return result;
}
function weekStart(date?: Date) {
  const result = shift(date, 0);
  result.setDate(result.getDate() - ((result.getDay() + 6) % 7));
  result.setHours(0, 0, 0, 0);
  return result;
}
function weekEnd(date?: Date) {
  const result = shift(weekStart(date), 6);
  result.setHours(23, 59, 59, 999);
  return result;
}
function twoWeekEnd(date?: Date) {
  return shift(weekEnd(date), 7);
}
function sixDays(date?: Date) {
  return shift(date, 6);
}
function handleChange(date: unknown) {
  console.log('date changed', date);
}
</script>
<template>
  <div>
    <div>
      <h4>Choose a week</h4>
      <DatePicker
        :default-picker-value="new Date(2024, 7, 15, 10, 24, 30)"
        :style="{ width: '260px' }"
        type="dateRange"
        :week-starts-on="1"
        :start-date-offset="weekStart"
        :end-date-offset="weekEnd"
        @change="handleChange"
      ></DatePicker>
      <br />
      <br />
      <h4>Choose two weeks</h4>
      <DatePicker
        :default-picker-value="new Date(2024, 7, 15, 10, 24, 30)"
        :style="{ width: '260px' }"
        type="dateRange"
        :week-starts-on="1"
        :start-date-offset="weekStart"
        :end-date-offset="twoWeekEnd"
        @change="handleChange"
      ></DatePicker>
      <br />
      <br />
      <h4>Select the current day and the next 6 days</h4>
      <DatePicker
        :default-picker-value="new Date(2024, 7, 15, 10, 24, 30)"
        :style="{ width: '260px' }"
        type="dateRange"
        :week-starts-on="1"
        :end-date-offset="sixDays"
        @change="handleChange"
      ></DatePicker>
      <br />
      <br />
    </div>
  </div>
</template>
