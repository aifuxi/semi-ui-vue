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
const aligns = ['center', 'justify', 'left', 'plain'] as const;
const panelStyle = {
  boxShadow: 'var(--semi-shadow-elevated)',
  backgroundColor: 'var(--semi-color-bg-2)',
  borderRadius: '4px',
  padding: '10px',
  margin: '10px',
  width: '240px',
};
</script>

<template>
  <div style="display: flex; flex-wrap: wrap">
    <Descriptions
      v-for="align in aligns"
      :key="align"
      :align="align"
      :data="data"
      :style="panelStyle"
    />
  </div>
</template>
