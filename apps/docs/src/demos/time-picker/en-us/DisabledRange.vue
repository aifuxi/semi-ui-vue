<script setup lang="ts">
import { TimePicker } from '@aifuxi/semi-ui-vue/time-picker';
import '@aifuxi/semi-theme-default/time-picker.css';
import type { TimePickerProps } from '@aifuxi/semi-ui-vue/time-picker';
const disabledTime: NonNullable<TimePickerProps['disabledTime']> = (value, panel) => {
  const start = value[0];
  if (panel !== 'right' || !(start instanceof Date)) return {};
  const h = start.getHours(),
    m = start.getMinutes();
  return {
    disabledHours: () => Array.from({ length: h }, (_, i) => i),
    disabledMinutes: (hour) => (hour === h ? Array.from({ length: m }, (_, i) => i) : []),
  };
};
</script>
<template>
  <TimePicker type="timeRange" :disabled-time="disabledTime" />
</template>
