<script setup lang="ts">
import { DatePicker } from '@aifuxi/semi-ui-vue/date-picker';
import '@aifuxi/semi-theme-default/date-picker.css';
</script>
<template>
  <div>
    <DatePicker
      :default-picker-value="new Date(2024, 7, 15, 10, 24, 30)"
      format="yyyy年MM月dd日 HH:mm"
      type="dateTime"
      :default-value="new Date(2024, 7, 15, 10, 24, 30)"
    ></DatePicker>
  </div>
</template>
