<script setup lang="ts">
import { Descriptions } from '@aifuxi/semi-ui-vue/descriptions';
import '@aifuxi/semi-theme-default/descriptions.css';
const keyStyle = { width: '100px', textAlign: 'right' as const };
const data = [
  { key: 'Username', value: 'Alex Zhang', keyStyle },
  { key: 'Email', value: 'zhangsan@example.com', keyStyle },
  { key: 'Phone', value: '138-0000-0000', keyStyle },
  { key: 'Address', value: 'Chaoyang District, Beijing', keyStyle },
];
</script>

<template>
  <Descriptions :data="data" align="center" />
</template>
