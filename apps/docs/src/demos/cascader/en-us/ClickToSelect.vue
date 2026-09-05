<script setup lang="ts">
import { Cascader } from '@aifuxi/semi-ui-vue/cascader';
import '@aifuxi/semi-theme-default/cascader.css';
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
        ],
      },
      { label: 'Music', value: 'music', children: [{ label: 'Claude Debussy', value: 'Debussy' }] },
    ],
  },
];
</script>
<template>
  <div>
    <Cascader
      :style="{ width: '300px' }"
      :tree-data="treeData"
      multiple
      placeholder="Please select"
      show-next="hover"
      click-to-select
    ></Cascader>
  </div>
</template>
