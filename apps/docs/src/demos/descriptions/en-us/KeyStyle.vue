<script setup lang="ts">
import { Descriptions } from '@aifuxi/semi-ui-vue/descriptions';
import '@aifuxi/semi-theme-default/descriptions.css';
const keyStyle = { width: '100px', textAlign: 'right' as const };
const data = [
  { key: 'Username', value: 'John', keyStyle },
  { key: 'Email', value: 'john@example.com', keyStyle },
  { key: 'Phone', value: '138-0000-0000', keyStyle },
  { key: 'Address', value: 'Beijing', keyStyle },
];
</script>

<template>
  <Descriptions :data="data" align="center" />
</template>
