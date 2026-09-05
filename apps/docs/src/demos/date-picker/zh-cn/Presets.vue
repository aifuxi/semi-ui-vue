<script setup lang="ts">
import { DatePicker } from '@aifuxi/semi-ui-vue/date-picker';
import '@aifuxi/semi-theme-default/date-picker.css';
const presets = [
  {
    text: 'Today',
    start: new Date(2024, 7, 15, 10, 24, 30),
    end: new Date(2024, 7, 15, 10, 24, 30),
  },
  {
    text: 'Tomorrow',
    start: new Date(new Date(2024, 7, 15, 10, 24, 30).valueOf() + 1000 * 3600 * 24),
    end: new Date(new Date(2024, 7, 15, 10, 24, 30).valueOf() + 1000 * 3600 * 24),
  },
];
</script>
<template>
  <div>
    <DatePicker
      :default-picker-value="new Date(2024, 7, 15, 10, 24, 30)"
      type="dateTime"
      :presets="presets"
      preset-position="left"
    ></DatePicker>
  </div>
</template>
