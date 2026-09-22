<script setup lang="ts">
import { DatePicker } from '@aifuxi/semi-ui-vue/date-picker';
import '@aifuxi/semi-theme-default/date-picker.css';
</script>
<template>
  <div>
    <h4>默认日期与时间选择</h4>
    <DatePicker
      :default-picker-value="new Date(2024, 7, 15, 10, 24, 30)"
      type="dateTime"
    ></DatePicker>
    <br />
    <br />
    <h4>开启时间列表无限循环</h4>
    <DatePicker
      :default-picker-value="new Date(2024, 7, 15, 10, 24, 30)"
      type="dateTime"
      :time-picker-opts="{ scrollItemProps: { mode: 'wheel', cycled: true } }"
    ></DatePicker>
  </div>
</template>
