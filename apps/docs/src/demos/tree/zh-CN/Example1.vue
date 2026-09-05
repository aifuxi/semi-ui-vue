<script setup lang="ts">
import { shallowRef } from 'vue';
import { Tree, type TreeNodeData, type TreeValue } from '@aifuxi/semi-ui-vue/tree';
import '@aifuxi/semi-theme-default/tree.css';

const value = shallowRef<TreeValue>('shanghai');
const treeData: TreeNodeData[] = [
  {
    key: 'asia',
    label: '亚洲',
    value: 'asia',
    children: [
      { key: 'beijing', label: '北京', value: 'beijing' },
      { key: 'shanghai', label: '上海', value: 'shanghai' },
    ],
  },
];
</script>

<template>
  <Tree v-model="value" default-expand-all :tree-data="treeData" />
</template>
