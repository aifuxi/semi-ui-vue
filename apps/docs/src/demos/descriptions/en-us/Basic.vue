<script setup lang="ts">
import { h } from 'vue';
import { Descriptions } from '@aifuxi/semi-ui-vue/descriptions';
import '@aifuxi/semi-theme-default/descriptions.css';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
const data = [
  { key: 'Actual users', value: '1,480,000' },
  { key: '7-day retention', value: '98%' },
  { key: 'Security level', value: 'Level 3' },
  { key: 'Category tags', value: () => h(Tag, { style: { margin: 0 } }, () => 'E-commerce') },
  { key: 'Verification', value: 'Not verified' },
];
</script>

<template>
  <Descriptions :data="data" />
</template>
