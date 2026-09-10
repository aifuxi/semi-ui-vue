<script setup lang="ts">
import { ref } from 'vue';
import { TreeSelect } from '@aifuxi/semi-ui-vue/tree-select';
import { type TreeNodeData } from '@aifuxi/semi-ui-vue/tree';

const value = ref('shanghai');
const treeData: TreeNodeData[] = [
  {
    label: 'Asia',
    value: 'asia',
    key: 'asia',
    children: [
      {
        label: 'China',
        value: 'china',
        key: 'china',
        children: [
          { label: 'Beijing', value: 'beijing', key: 'beijing' },
          { label: 'Shanghai', value: 'shanghai', key: 'shanghai' },
        ],
      },
    ],
  },
];
import '@aifuxi/semi-theme-default/tree-select.css';
import '@aifuxi/semi-theme-default/tree.css';
</script>

<template>
  <TreeSelect
    v-model="value"
    :tree-data="treeData"
    filter-tree-node
    placeholder="Select a city"
    :style="{ width: '300px' }"
  />
</template>
