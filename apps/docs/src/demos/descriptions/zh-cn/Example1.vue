<script setup lang="ts">
import { Descriptions } from '@aifuxi/semi-ui-vue/descriptions';

const data = [
  { key: '用户名', value: 'Semi' },
  { key: '角色', value: '设计师' },
];
import '@aifuxi/semi-theme-default/descriptions.css';
</script>

<template>
  <Descriptions :data="data" />
</template>
