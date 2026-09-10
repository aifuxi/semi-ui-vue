<script setup lang="ts">
import { TreeSelect } from '@aifuxi/semi-ui-vue/tree-select';
import '@aifuxi/semi-theme-default/tree-select.css';
import { shallowRef } from 'vue';
const expandedKeys = shallowRef<string[]>([]);
function onSearch(_input: string, filtered: string[]) {
  expandedKeys.value = [...new Set([...expandedKeys.value, ...filtered])];
}
import { createTreeData } from '../data';
const treeData = createTreeData('en-us', 'strict');
treeData[0]!.children![0]!.disabled = false;
</script>
<template>
  <TreeSelect
    v-model:expanded-keys="expandedKeys"
    :style="{ width: '300px' }"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    :tree-data="treeData"
    filter-tree-node
    @search="onSearch"
  />
</template>
