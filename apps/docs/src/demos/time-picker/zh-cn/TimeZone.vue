<script setup lang="ts">
import { TimePicker } from '@aifuxi/semi-ui-vue/time-picker';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import { Select } from '@aifuxi/semi-ui-vue/select';
import { SelectOption } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/time-picker.css';
import '@aifuxi/semi-theme-default/config-provider.css';
import '@aifuxi/semi-theme-default/select.css';
import { shallowRef } from 'vue';
const timeZone = shallowRef('GMT+08:00');
const zones = Array.from({ length: 26 }, (_, i) => {
  const offset = i - 11;
  return `GMT${offset >= 0 ? '+' : '-'}${String(Math.abs(offset)).padStart(2, '0')}:00`;
});
function selectZone(value: string | number | undefined) {
  if (typeof value === 'string') timeZone.value = value;
}
function change(date: unknown, dateString: unknown) {
  console.log('DatePicker changed: ', date, dateString);
}
</script>
<template>
  <ConfigProvider :time-zone="timeZone"
    ><div style="width: 300px">
      <h5 style="margin: 10px">Select Time Zone:</h5>
      <Select
        placeholder="请选择时区"
        style="width: 300px"
        :value="timeZone"
        show-clear
        @select="selectZone"
        ><SelectOption v-for="zone in zones" :key="zone" :value="zone">{{
          zone
        }}</SelectOption></Select
      ><br /><br />
      <h5 style="margin: 10px">TimePicker:</h5>
      <TimePicker :default-value="1581599305265" @change="change" /></div
  ></ConfigProvider>
</template>
