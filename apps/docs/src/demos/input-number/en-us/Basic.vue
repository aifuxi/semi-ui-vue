<script setup lang="ts">
import { InputNumber } from '@aifuxi/semi-ui-vue/input-number';
import '@aifuxi/semi-theme-default/input-number.css';
</script>

<template>
  <div :style="{ width: '280px' }">
    <label>Simple</label>
    <InputNumber></InputNumber>
    <br /><br />

    <label>Set step to 2 </label>
    <InputNumber :step="2"></InputNumber>
    <br /><br />

    <label>Press shift key and click the button to increase/decrease the step size </label>
    <InputNumber :shift-step="100"></InputNumber>
    <br /><br />

    <label>Set min to 1, max to 10</label>
    <InputNumber :min="1" :max="10" :default-value="1"></InputNumber>
    <br /><br />
  </div>
</template>
