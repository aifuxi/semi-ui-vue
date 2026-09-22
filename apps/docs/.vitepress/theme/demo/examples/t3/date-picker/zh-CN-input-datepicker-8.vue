<script setup lang="ts">
import { DatePicker } from '@aifuxi/semi-ui-vue/date-picker';
import '@aifuxi/semi-theme-default/date-picker.css';
</script>
<template>
  <div>
    <div>
      <DatePicker
        :default-picker-value="new Date(2024, 7, 15, 10, 24, 30)"
        type="date"
        inset-input
      ></DatePicker>
      <br />
      <br />
      <DatePicker
        :default-picker-value="new Date(2024, 7, 15, 10, 24, 30)"
        type="dateTime"
        inset-input
      ></DatePicker>
      <br />
      <br />
      <DatePicker
        :default-picker-value="new Date(2024, 7, 15, 10, 24, 30)"
        type="dateRange"
        inset-input
        :style="{ width: '260px' }"
      ></DatePicker>
      <br />
      <br />
      <DatePicker
        :default-picker-value="new Date(2024, 7, 15, 10, 24, 30)"
        type="dateTimeRange"
        inset-input
        :style="{ width: '400px' }"
      ></DatePicker>
      <br />
      <br />
      <DatePicker
        :default-picker-value="new Date(2024, 7, 15, 10, 24, 30)"
        type="month"
        placeholder="请选择年月"
        inset-input
        :style="{ width: '140px' }"
      ></DatePicker>
      <br />
      <br />
      <DatePicker
        :default-picker-value="new Date(2024, 7, 15, 10, 24, 30)"
        type="monthRange"
        placeholder="请选择年月范围"
        inset-input
        :style="{ width: '200px' }"
      ></DatePicker>
      <br />
      <br />
      <DatePicker
        :default-picker-value="new Date(2024, 7, 15, 10, 24, 30)"
        type="date"
        position="bottomLeft"
        inset-input
      ></DatePicker>
      <br />
      <br />
      <DatePicker
        :default-picker-value="new Date(2024, 7, 15, 10, 24, 30)"
        type="dateTime"
        format="yyyy-MM-dd HH:mm"
        inset-input
      ></DatePicker>
    </div>
  </div>
</template>
