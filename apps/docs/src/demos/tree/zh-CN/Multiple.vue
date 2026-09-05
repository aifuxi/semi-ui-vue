<script setup lang="ts">
import { Tree, type TreeNodeData } from '@aifuxi/semi-ui-vue/tree';
import '@aifuxi/semi-theme-default/tree.css';
const treeData: TreeNodeData[] = [
  {
    label: 'Asia',
    value: 'Asia',
    key: '0',
    children: [
      {
        label: 'China',
        value: 'China',
        key: '0-0',
        children: [
          {
            label: 'Beijing',
            value: 'Beijing',
            key: '0-0-0',
          },
          {
            label: 'Shanghai',
            value: 'Shanghai',
            key: '0-0-1',
          },
          {
            label: 'Chengdu',
            value: 'Chengdu',
            key: '0-0-2',
          },
        ],
      },
      {
        label: 'Japan',
        value: 'Japan',
        key: '0-1',
        children: [
          {
            label: 'Osaka',
            value: 'Osaka',
            key: '0-1-0',
          },
        ],
      },
    ],
  },
  {
    label: 'North America',
    value: 'North America',
    key: '1',
    children: [
      {
        label: 'United States',
        value: 'United States',
        key: '1-0',
      },
      {
        label: 'Canada',
        value: 'Canada',
        key: '1-1',
      },
    ],
  },
];
const treeStyle = { width: '260px', height: '420px', border: '1px solid var(--semi-color-border)' };
</script>

<template>
  <Tree :tree-data="treeData" :style="treeStyle" multiple default-expand-all />
</template>
