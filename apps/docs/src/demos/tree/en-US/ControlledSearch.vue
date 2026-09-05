<script setup lang="ts">
import { shallowRef } from 'vue';
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
        ],
      },
      {
        label: 'Japan',
        value: 'Japan',
        key: '0-1',
      },
    ],
  },
  {
    label: 'North America',
    value: 'North America',
    key: '1',
  },
];
const expanded = shallowRef<string[]>([]);
function search(_input: string, keys: string[]) {
  expanded.value = [...keys];
}
</script>

<template>
  <Tree
    v-model:expanded-keys="expanded"
    :tree-data="treeData"
    filter-tree-node
    style="width: 300px"
    @search="search"
  />
</template>
