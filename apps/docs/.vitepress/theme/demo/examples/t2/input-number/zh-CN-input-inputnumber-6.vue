<script setup lang="ts">
import { InputNumber } from '@aifuxi/semi-ui-vue/input-number';
import '@aifuxi/semi-theme-default/input-number.css';
</script>

<template>
  <div :style="{ width: '180px' }">
    <label>默认尺寸 size=default</label>
    <InputNumber></InputNumber>
    <br /><br />

    <label>大尺寸 size=large</label>
    <InputNumber size="large"></InputNumber>
    <br /><br />

    <label>小尺寸 size=small</label>
    <InputNumber size="small"></InputNumber>
    <br />
  </div>
</template>
