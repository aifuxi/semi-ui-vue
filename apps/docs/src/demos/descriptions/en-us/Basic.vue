<script setup lang="ts">
import { h } from 'vue';
import { Descriptions } from '@aifuxi/semi-ui-vue/descriptions';
import '@aifuxi/semi-theme-default/descriptions.css';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
const data = [
  { key: 'Actual Users', value: '1,480,000' },
  { key: '7-day Rentention', value: '98%' },
  { key: 'Security Level', value: 'III' },
  { key: 'Category Tag', value: () => h(Tag, { style: { margin: 0 } }, () => 'E-commerce') },
  { key: 'Authorized State', value: 'Unauthorized' },
];
</script>

<template>
  <Descriptions :data="data" />
</template>
