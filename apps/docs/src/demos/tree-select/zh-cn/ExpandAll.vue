<script setup lang="ts">
import { TreeSelect } from '@aifuxi/semi-ui-vue/tree-select';
import '@aifuxi/semi-theme-default/tree-select.css';
import { onMounted, onBeforeUnmount, shallowRef } from 'vue';
const treeData = shallowRef<TreeNodeData[]>([]);
let timer: ReturnType<typeof setTimeout> | undefined;
onMounted(() => {
  timer = setTimeout(() => {
    treeData.value = createTreeData('zh-cn');
  }, 500);
});
onBeforeUnmount(() => clearTimeout(timer));
import { createTreeData } from '../data';
import type { TreeNodeData } from '@aifuxi/semi-ui-vue/tree-select';
</script>
<template>
  <div>
    <TreeSelect
      :style="{ width: '300px', marginBottom: '20px' }"
      expand-all
      :tree-data="treeData"
      placeholder="expandAll"
    /><TreeSelect
      :style="{ width: '300px' }"
      default-expand-all
      :tree-data="treeData"
      placeholder="defaultExpandAll"
    />
  </div>
</template>
