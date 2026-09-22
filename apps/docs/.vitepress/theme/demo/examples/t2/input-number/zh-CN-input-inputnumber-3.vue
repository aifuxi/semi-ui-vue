<script setup lang="ts">
import { InputNumber } from '@aifuxi/semi-ui-vue/input-number';
import '@aifuxi/semi-theme-default/input-number.css';
</script>

<template>
  <div :style="{ width: '280px' }">
    <label>设置了默认值 defaultValue=1 </label>
    <InputNumber :default-value="1"></InputNumber>
    <br /><br />

    <label>禁用 disabled=true</label>
    <InputNumber :default-value="2" disabled></InputNumber>
    <br /><br />

    <label>设置了小数位数 precision=2 </label>
    <InputNumber :precision="2" :default-value="1.234"></InputNumber>
    <br /><br />

    <label>设置了 innerButtons=true </label>
    <InputNumber
      :inner-buttons="true"
      suffix="小时"
      :default-value="1"
      :style="{ width: '190px' }"
    ></InputNumber>
    <br />
  </div>
</template>
