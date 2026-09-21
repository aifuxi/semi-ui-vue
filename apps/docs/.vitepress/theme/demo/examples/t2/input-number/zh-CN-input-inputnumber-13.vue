<script setup lang="ts">
import { InputNumber } from '@aifuxi/semi-ui-vue/input-number';
import '@aifuxi/semi-theme-default/input-number.css';
</script>

<template>
  <div :style="{ width: '280px' }">
    <label>启用科学计数法（默认阈值 15 位）</label>
    <InputNumber scientific-notation :default-value="123456789012345"></InputNumber>
    <br /><br />

    <label>自定义阈值（10 位）</label>
    <InputNumber :scientific-notation="{ threshold: 10 }" :default-value="1234567890"></InputNumber>
    <br /><br />

    <label>超大数字</label>
    <InputNumber scientific-notation :default-value="9999999999999999"></InputNumber>
    <br /><br />

    <label>小数场景</label>
    <InputNumber
      scientific-notation
      :precision="10"
      :default-value="0.000000123456789"
    ></InputNumber>
    <br /><br />
  </div>
</template>
