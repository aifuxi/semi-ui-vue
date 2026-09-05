<script setup lang="ts">
import { InputNumber } from '@aifuxi/semi-ui-vue/input-number';
import '@aifuxi/semi-theme-default/input-number.css';
const defaultValue = 123456.78;
</script>

<template>
  <div>
    <div>🇨🇳 CNY ➕ code</div>
    <InputNumber
      :style="{ width: '200px' }"
      currency="CNY"
      prefix="CNY"
      :show-currency-symbol="false"
      :default-value="defaultValue"
    ></InputNumber>
    <br />
    <br />
    <div>🇨🇳 CNY ➕ symbol</div>
    <InputNumber
      :style="{ width: '200px' }"
      currency="CNY"
      prefix="￥"
      :show-currency-symbol="false"
      :default-value="defaultValue"
    ></InputNumber>
    <br />
    <br />
    <div>🇨🇳 CNY ➕ name</div>
    <InputNumber
      :style="{ width: '200px' }"
      currency="CNY"
      suffix="人民币"
      :show-currency-symbol="false"
      :default-value="defaultValue"
    ></InputNumber>
    <br />
    <br />
  </div>
</template>
