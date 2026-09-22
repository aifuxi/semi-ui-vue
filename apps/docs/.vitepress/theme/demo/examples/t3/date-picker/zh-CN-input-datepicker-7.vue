<script setup lang="ts">
import { DatePicker } from '@aifuxi/semi-ui-vue/date-picker';
import '@aifuxi/semi-theme-default/date-picker.css';
</script>
<template>
  <div>
    <DatePicker
      :default-picker-value="new Date(2024, 7, 15, 10, 24, 30)"
      type="dateTimeRange"
      :style="{ width: '400px', marginBottom: '8px' }"
      @change="console.log"
    ></DatePicker>
    <DatePicker
      type="dateTimeRange"
      :style="{ width: '400px' }"
      :default-picker-value="[new Date('2022-08-08 00:00'), new Date('2022-08-09 12:00')]"
      @change="console.log"
    ></DatePicker>
  </div>
</template>
