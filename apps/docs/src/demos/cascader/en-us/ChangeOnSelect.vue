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
    <div>
      <Cascader
        :style="{ width: '400px' }"
        :tree-data="treeData"
        change-on-select
        placeholder="Change on select"
      ></Cascader>
      <br />
      <br />
      <Cascader
        :style="{ width: '400px' }"
        :tree-data="treeData"
        change-on-select
        placeholder="Searchable change on select"
        filter-tree-node
      ></Cascader>
    </div>
  </div>
</template>
