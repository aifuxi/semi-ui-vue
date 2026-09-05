<script setup lang="ts">
import { DatePicker } from '@aifuxi/semi-ui-vue/date-picker';
import '@aifuxi/semi-theme-default/date-picker.css';
function confirm(...args: unknown[]) {
  console.log('Confirmed: ', ...args);
}
function cancel(...args: unknown[]) {
  console.log('Canceled: ', ...args);
}
function change(...args: unknown[]) {
  console.log('Changed: ', ...args);
}
</script>
<template>
  <div>
    <DatePicker
      :default-picker-value="new Date(2024, 7, 15, 10, 24, 30)"
      type="dateTime"
      :need-confirm="true"
      @confirm="confirm"
      @cancel="cancel"
      @change="change"
    ></DatePicker>
  </div>
</template>
