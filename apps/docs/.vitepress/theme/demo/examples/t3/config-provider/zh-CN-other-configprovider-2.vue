<script setup lang="ts">
import { shallowRef } from 'vue';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import { Select, SelectOption } from '@aifuxi/semi-ui-vue/select';
import { DatePicker } from '@aifuxi/semi-ui-vue/date-picker';
import { TimePicker } from '@aifuxi/semi-ui-vue/time-picker';
import '@aifuxi/semi-theme-default/config-provider.css';
import '@aifuxi/semi-theme-default/select.css';
import '@aifuxi/semi-theme-default/date-picker.css';
import '@aifuxi/semi-theme-default/time-picker.css';
const timeZone = shallowRef('GMT+08:00');
const defaultTimestamp = 1581599305265;
const gmtList = Array.from({ length: 26 }, (_, index) => {
  const offset = index - 11;
  return 'GMT' + (offset >= 0 ? '+' : '-') + String(Math.abs(offset)).padStart(2, '0') + ':00';
});
</script>
<template>
  <ConfigProvider :time-zone="timeZone">
    <div :style="{ width: '300px' }">
      <h5 :style="{ margin: '10px' }">Select Time Zone:</h5>
      <Select
        placeholder="请选择时区"
        :style="{ width: '300px' }"
        :value="timeZone"
        :show-clear="true"
        @select="timeZone = String($event)"
      >
        <SelectOption v-for="gmt in gmtList" :key="gmt" :value="gmt">{{ gmt }}</SelectOption>
      </Select>
      <br /><br />
      <DatePicker
        type="dateTime"
        :default-value="defaultTimestamp"
        @change="
          (date: unknown, dateString: unknown) =>
            console.log('DatePicker changed: ', date, dateString)
        "
      />
      <br /><br />
      <TimePicker
        :default-value="defaultTimestamp"
        @change="
          (date: unknown, dateString: unknown) =>
            console.log('DatePicker changed: ', date, dateString)
        "
      />
    </div>
  </ConfigProvider>
</template>
