<script setup lang="ts">
import { InputNumber } from '@aifuxi/semi-ui-vue/input-number';
import '@aifuxi/semi-theme-default/input-number.css';
const defaultValue = 123456.78;
</script>

<template>
  <div>
    <div>🇨🇳 CNY ➕ code</div>
    <InputNumber currency="CNY" currency-display="code" :default-value="defaultValue"></InputNumber>
    <br />
    <br />
    <div>🇨🇳 CNY ➕ symbol</div>
    <InputNumber
      currency="CNY"
      currency-display="symbol"
      :default-value="defaultValue"
    ></InputNumber>
    <br />
    <br />
    <div>🇨🇳 CNY ➕ name</div>
    <InputNumber currency="CNY" currency-display="name" :default-value="defaultValue"></InputNumber>
    <br />
    <br />
  </div>
</template>
