<script setup lang="ts">
import { InputNumber } from '@aifuxi/semi-ui-vue/input-number';
import '@aifuxi/semi-theme-default/input-number.css';
</script>

<template>
  <div :style="{ width: '280px' }">
    <label>简单数字输入框</label>
    <InputNumber></InputNumber>
    <br /><br />

    <label>设置了步长 step=2 </label>
    <InputNumber :step="2"></InputNumber>
    <br /><br />

    <label>设置 shiftStep=100， 按住 shift 同时点击按钮，可以一次增加/减少100 </label>
    <InputNumber :shift-step="100"></InputNumber>
    <br /><br />

    <label>设置了上下界 min=1,max=10</label>
    <InputNumber :min="1" :max="10" :default-value="1"></InputNumber>
    <br /><br />
  </div>
</template>
