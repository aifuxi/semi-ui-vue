<script setup lang="ts">
import { InputNumber } from '@aifuxi/semi-ui-vue/input-number';
import '@aifuxi/semi-theme-default/input-number.css';
const defaultValue = 123456.78;
</script>

<template>
  <div>
    <div>🇨🇳 人民币</div>
    <InputNumber locale-code="zh-CN" currency="CNY" :default-value="defaultValue"></InputNumber>
    <br />
    <br />
    <div>🇪🇺 欧元</div>
    <InputNumber locale-code="de-DE" currency="EUR" :default-value="defaultValue"></InputNumber>
    <br />
    <br />
    <div>🇯🇵 日元</div>
    <InputNumber locale-code="ja-JP" currency="JPY" :default-value="defaultValue"></InputNumber>
    <br />
    <br />
    <div>🇻🇳 越南盾</div>
    <InputNumber locale-code="vi-VN" currency="VND" :default-value="defaultValue"></InputNumber>
    <br />
    <br />
  </div>
</template>
