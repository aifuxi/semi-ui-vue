<script setup lang="ts">
import { InputNumber } from '@aifuxi/semi-ui-vue/input-number';
import '@aifuxi/semi-theme-default/input-number.css';
const defaultValue = 123456.78;
</script>

<template>
  <div>
    <div>🇨🇳 CNY</div>
    <InputNumber locale-code="zh-CN" currency="CNY" :default-value="defaultValue"></InputNumber>
    <br />
    <br />
    <div>🇪🇺 EUR</div>
    <InputNumber locale-code="de-DE" currency="EUR" :default-value="defaultValue"></InputNumber>
    <br />
    <br />
    <div>🇯🇵 JPY</div>
    <InputNumber locale-code="ja-JP" currency="JPY" :default-value="defaultValue"></InputNumber>
    <br />
    <br />
    <div>🇻🇳 VND</div>
    <InputNumber locale-code="vi-VN" currency="VND" :default-value="defaultValue"></InputNumber>
    <br />
    <br />
  </div>
</template>
