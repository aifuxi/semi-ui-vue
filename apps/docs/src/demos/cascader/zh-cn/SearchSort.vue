<script setup lang="ts">
import { Cascader } from '@aifuxi/semi-ui-vue/cascader';
import '@aifuxi/semi-theme-default/cascader.css';
import type { CascaderData } from '@aifuxi/semi-ui-vue/cascader';
const treeData = [
  {
    label: 'Product',
    value: 'Product',
    children: [
      { label: 'Semi-Material', value: 'Semi-Material' },
      { label: 'Semi-DSM', value: 'Semi-DSM' },
      { label: 'Semi', value: 'Semi' },
      { label: 'Semi-C2D', value: 'Semi-C2D' },
      { label: 'Semi-D2C', value: 'Semi-D2C' },
    ],
  },
];
function filterSorter(first: CascaderData[], second: CascaderData[], input: string) {
  const a = String(first.at(-1)?.label ?? '');
  const b = String(second.at(-1)?.label ?? '');
  return a === input ? -1 : b === input ? 1 : a < b ? -1 : 1;
}
</script>
<template>
  <div>
    <div>
      <Cascader
        :style="{ width: '300px' }"
        :tree-data="treeData"
        placeholder="输入 s 查看排序效果"
        filter-tree-node
        :filter-sorter="filterSorter"
      ></Cascader>
    </div>
  </div>
</template>
