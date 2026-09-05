<script setup lang="ts">
import { DatePicker } from '@aifuxi/semi-ui-vue/date-picker';
import '@aifuxi/semi-theme-default/date-picker.css';
</script>
<template>
  <div>
    <DatePicker
      :default-picker-value="new Date(2024, 7, 15, 10, 24, 30)"
      type="dateTimeRange"
      :style="{ width: '400px' }"
      @change="console.log"
    ></DatePicker>
  </div>
</template>
