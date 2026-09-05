<script setup lang="ts">
import { shallowRef } from 'vue';
import { Tree, type TreeNodeData, type TreeValue } from '@aifuxi/semi-ui-vue/tree';
import '@aifuxi/semi-theme-default/tree.css';

const value = shallowRef<TreeValue>('docs');
const treeData: TreeNodeData[] = [
  {
    key: 'guide',
    label: 'Guide',
    value: 'guide',
    children: [
      { key: 'docs', label: 'Docs', value: 'docs' },
      { key: 'api', label: 'API', value: 'api' },
    ],
  },
];
</script>

<template>
  <Tree v-model="value" default-expand-all :tree-data="treeData" />
</template>
