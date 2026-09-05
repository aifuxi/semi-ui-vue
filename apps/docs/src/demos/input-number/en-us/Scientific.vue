<script setup lang="ts">
import { InputNumber } from '@aifuxi/semi-ui-vue/input-number';
import '@aifuxi/semi-theme-default/input-number.css';
</script>

<template>
  <div :style="{ width: '280px' }">
    <label>Enable scientific notation (default threshold: 15 digits)</label>
    <InputNumber scientific-notation :default-value="123456789012345"></InputNumber>
    <br /><br />

    <label>Custom threshold (10 digits)</label>
    <InputNumber :scientific-notation="{ threshold: 10 }" :default-value="1234567890"></InputNumber>
    <br /><br />

    <label>Very large number</label>
    <InputNumber scientific-notation :default-value="9999999999999999"></InputNumber>
    <br /><br />

    <label>Decimal scenario</label>
    <InputNumber
      scientific-notation
      :precision="10"
      :default-value="0.000000123456789"
    ></InputNumber>
    <br /><br />
  </div>
</template>
