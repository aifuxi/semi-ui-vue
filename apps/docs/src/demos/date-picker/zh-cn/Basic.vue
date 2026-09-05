<script setup lang="ts">
import { DatePicker } from '@aifuxi/semi-ui-vue/date-picker';
import '@aifuxi/semi-theme-default/date-picker.css';
function change(_date: unknown, dateString: unknown) {
  console.log(dateString);
}
</script>
<template>
  <div>
    <DatePicker
      :default-picker-value="new Date(2024, 7, 15, 10, 24, 30)"
      @change="change"
    ></DatePicker>
  </div>
</template>
