<script setup lang="ts">
import { DatePicker } from '@aifuxi/semi-ui-vue/date-picker';
import '@aifuxi/semi-theme-default/date-picker.css';
</script>
<template>
  <div>
    <div>
      <DatePicker
        :default-picker-value="new Date(2024, 7, 15, 10, 24, 30)"
        type="dateTime"
        density="compact"
      ></DatePicker
      ><br /><br />
      <DatePicker
        :default-picker-value="new Date(2024, 7, 15, 10, 24, 30)"
        type="dateRange"
        density="compact"
        :style="{ width: '260px' }"
      ></DatePicker>
    </div>
  </div>
</template>
