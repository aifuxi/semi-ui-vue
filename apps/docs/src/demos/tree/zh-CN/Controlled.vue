<script setup lang="ts">
import { shallowRef } from 'vue';
import { Tree, type TreeNodeData, type TreeValue } from '@aifuxi/semi-ui-vue/tree';
import '@aifuxi/semi-theme-default/tree.css';
const treeData: TreeNodeData[] = [
  {
    label: '亚洲',
    value: 'Asia',
    key: '0',
    children: [
      {
        label: '中国',
        value: 'China',
        key: '0-0',
        children: [
          {
            label: '北京',
            value: 'Beijing',
            key: '0-0-0',
          },
          {
            label: '上海',
            value: 'Shanghai',
            key: '0-0-1',
          },
        ],
      },
    ],
  },
  {
    label: '北美洲',
    value: 'North America',
    key: '1',
  },
];
const treeStyle = { width: '260px', height: '420px', border: '1px solid var(--semi-color-border)' };
const value = shallowRef<TreeValue>('Shanghai');
</script>

<template>
  <Tree v-model="value" :tree-data="treeData" :style="treeStyle" />
</template>
