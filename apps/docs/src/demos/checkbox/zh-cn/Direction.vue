<script setup lang="ts">
import { CheckboxGroup } from '@aifuxi/semi-ui-vue/checkbox';
import '@aifuxi/semi-theme-default/checkbox.css';
const options = [
  { label: '抖音', value: 'abc' },
  { label: '今日头条', value: 'toutiao' },
];
</script>

<template>
  <CheckboxGroup :options="options" direction="horizontal" aria-label="CheckboxGroup demo" />
</template>
