<script setup lang="ts">
import { InputNumber } from '@aifuxi/semi-ui-vue/input-number';
import '@aifuxi/semi-theme-default/input-number.css';
</script>

<template>
  <div :style="{ width: '180px' }">
    <label>size=default</label>
    <InputNumber></InputNumber>
    <br /><br />

    <label>size=large</label>
    <InputNumber size="large"></InputNumber>
    <br /><br />

    <label>size=small</label>
    <InputNumber size="small"></InputNumber>
    <br />
  </div>
</template>
