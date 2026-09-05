<script setup lang="ts">
import { Cascader } from '@aifuxi/semi-ui-vue/cascader';
import { Text } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/cascader.css';
import '@aifuxi/semi-theme-default/typography.css';
const slotStyle = {
  height: '36px',
  display: 'flex',
  padding: '0 32px',
  alignItems: 'center',
  cursor: 'pointer',
  borderTop: '1px solid var(--semi-color-border)',
};
const treeData = [
  {
    label: 'Impressionism',
    value: 'impressionism',
    children: [
      {
        label: 'Visual Arts',
        value: 'visualArts',
        children: [
          { label: 'Claude Monet', value: 'Monet' },
          { label: 'Pierre-Auguste Renoir', value: 'Renoir' },
          { label: 'Édouard Manet', value: 'Manet' },
        ],
      },
      {
        label: 'Music',
        value: 'music',
        children: [
          { label: 'Claude Debussy', value: 'Debussy' },
          { label: 'Maurice Ravel', value: 'Ravel' },
        ],
      },
    ],
  },
];
</script>
<template>
  <div>
    <Cascader :style="{ width: '300px' }" :tree-data="treeData" placeholder="Please select"
      ><template #bottom
        ><div :style="slotStyle">
          <Text>{{ `Can't find a relevant option?` }}</Text>
          <Text link>Go to create</Text>
        </div></template
      ></Cascader
    >
  </div>
</template>
