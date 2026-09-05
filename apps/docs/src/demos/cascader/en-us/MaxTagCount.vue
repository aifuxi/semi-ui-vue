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
    <Cascader
      :style="{ width: '300px' }"
      :tree-data="treeData"
      placeholder="Please selection"
      multiple
      :max-tag-count="1"
      :show-rest-tags-popover="true"
      :rest-tags-popover-props="{ position: 'top' }"
      :default-value="[
        ['impressionism', 'visualArts', 'Monet'],
        ['impressionism', 'visualArts', 'Renoir'],
      ]"
    ></Cascader>
  </div>
</template>
