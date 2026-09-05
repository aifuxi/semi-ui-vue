<script setup lang="ts">
import { h } from 'vue';
import { Descriptions } from '@aifuxi/semi-ui-vue/descriptions';
import '@aifuxi/semi-theme-default/descriptions.css';
import IconArrowUp from '@aifuxi/semi-icons-vue/icons/IconArrowUp';
const data = [
  { key: 'Actual users', value: '1,480,000' },
  {
    key: '7-day retention',
    value: () =>
      h('span', [
        '98%',
        h(IconArrowUp, { size: 'small', style: { color: 'red', marginLeft: '4px' } }),
      ]),
  },
  { key: 'Security level', value: 'Level 3' },
];
const panelStyle = {
  boxShadow: 'var(--semi-shadow-elevated)',
  backgroundColor: 'var(--semi-color-bg-2)',
  borderRadius: '4px',
  padding: '10px',
  marginRight: '20px',
  width: '600px',
  maxWidth: '100%',
};
</script>

<template>
  <div>
    <Descriptions :data="data" row size="small" :style="panelStyle" /><br />
    <Descriptions :data="data" row :style="panelStyle" /><br />
    <Descriptions :data="data" row size="large" :style="panelStyle" />
  </div>
</template>
