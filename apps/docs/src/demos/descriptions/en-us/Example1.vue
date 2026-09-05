<script setup lang="ts">
import { Descriptions } from '@aifuxi/semi-ui-vue/descriptions';

const data = [
  { key: 'User', value: 'Semi' },
  { key: 'Role', value: 'Designer' },
];
import '@aifuxi/semi-theme-default/descriptions.css';
</script>

<template>
  <Descriptions :data="data" />
</template>
