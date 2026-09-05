<script setup lang="ts">
import { CheckboxGroup } from '@aifuxi/semi-ui-vue/checkbox';
import '@aifuxi/semi-theme-default/checkbox.css';
const options = [
  { label: 'semi', value: 'semi' },
  { label: 'hotsoon', value: 'hotsoon' },
  { label: 'pipixia', value: 'pipixia' },
  { label: 'toutiao', value: 'toutiao' },
];
</script>

<template>
  <CheckboxGroup :options="options" direction="horizontal" aria-label="CheckboxGroup demo" />
</template>
