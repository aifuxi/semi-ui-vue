<script setup lang="ts">
import { h } from 'vue';
import { Descriptions } from '@aifuxi/semi-ui-vue/descriptions';
import '@aifuxi/semi-theme-default/descriptions.css';
import IconArrowUp from '@aifuxi/semi-icons-vue/icons/IconArrowUp';
const data = [
  { key: 'Actual Users', value: '1,480,000' },
  {
    key: '7-day Rentention',
    value: () =>
      h('span', [
        '98%',
        h(IconArrowUp, { size: 'small', style: { color: 'red', marginLeft: '4px' } }),
      ]),
  },
  { key: 'Security Level', value: 'III' },
];
const panelStyle = {
  boxShadow: 'var(--semi-shadow-elevated)',
  backgroundColor: 'var(--semi-color-bg-2)',
  borderRadius: '4px',
  padding: '10px',
  marginRight: '20px',
  width: '600px',
};
</script>

<template>
  <div>
    <Descriptions :data="data" row size="small" :style="panelStyle" /><br />
    <Descriptions :data="data" row :style="panelStyle" /><br />
    <Descriptions :data="data" row size="large" :style="panelStyle" />
  </div>
</template>
