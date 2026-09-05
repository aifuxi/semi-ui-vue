<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { Tree, type TreeNodeData, type TreeExposed } from '@aifuxi/semi-ui-vue/tree';
import '@aifuxi/semi-theme-default/tree.css';
import { Input } from '@aifuxi/semi-ui-vue/input';
import '@aifuxi/semi-theme-default/input.css';
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
const treeRef = useTemplateRef<TreeExposed>('tree');
</script>

<template>
  <Input aria-label="filter tree" prefix="Search" show-clear @change="treeRef?.search($event)" />
  <div style="margin-top: 20px">Search results:</div>
  <Tree
    ref="tree"
    :tree-data="treeData"
    filter-tree-node
    :search-render="false"
    :block-node="false"
  />
</template>
