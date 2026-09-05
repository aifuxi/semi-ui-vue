<script setup lang="ts">
import { InputNumber } from '@aifuxi/semi-ui-vue/input-number';
import '@aifuxi/semi-theme-default/input-number.css';
import type { InputNumberValue } from '@aifuxi/semi-ui-vue/input-number';
function log(value: InputNumberValue) {
  console.log(`Changed to: [${typeof value}] ${value}`);
}
function formatCurrency(value: InputNumberValue) {
  return `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
function parseCurrency(value: string) {
  return value.replace(/￥\s?|(,*)/g, '');
}
function formatDashes(value: InputNumberValue) {
  return String(value).split('').join('-');
}
function parseDashes(value: string) {
  return value.replace(/-/g, '');
}
</script>

<template>
  <div style="width: 180px">
    <label>RMB</label
    ><InputNumber
      :default-value="1000"
      :min="0"
      :formatter="formatCurrency"
      :parser="parseCurrency"
      @change="log"
    /><br /><br /><label>Custom string</label
    ><InputNumber
      :default-value="1111"
      :formatter="formatDashes"
      :parser="parseDashes"
      @change="log"
    /><br />
  </div>
</template>
