<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
const list = [
  { value: 'douyin', label: 'Douyin' },
  { value: 'capcut', label: 'Capcut' },
  { value: 'coze', label: 'Coze' },
  { value: 'toutiao', label: 'TooBuzz' },
];
</script>
<template>
  <div>
    <Select placeholder="Business line" :style="{ width: '180px' }" :option-list="list"></Select>
  </div>
</template>
