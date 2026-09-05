<script setup lang="ts">
import { TreeSelect } from '@aifuxi/semi-ui-vue/tree-select';
import '@aifuxi/semi-theme-default/tree-select.css';
import { onBeforeUnmount, shallowRef } from 'vue';
const value = shallowRef<TreeValue>([]);
const treeData = shallowRef<TreeNodeData[]>([]);
const loading = shallowRef(false);
let timer: ReturnType<typeof setTimeout> | undefined;
function onSearch(input: string) {
  clearTimeout(timer);
  loading.value = Boolean(input);
  treeData.value = [];
  if (!input) return;
  timer = setTimeout(() => {
    treeData.value = [1, 2, 3].map((i) => ({
      label: input + ' - Result ' + i,
      value: input + '-' + i,
      key: input + '-' + i,
    }));
    loading.value = false;
  }, 500);
}
onBeforeUnmount(() => clearTimeout(timer));
import type { TreeValue, TreeNodeData } from '@aifuxi/semi-ui-vue/tree-select';
</script>
<template>
  <div>
    <TreeSelect
      v-model="value"
      :style="{ width: '300px' }"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      :tree-data="treeData"
      filter-tree-node
      remote
      placeholder="Type to search remote data"
      @search="onSearch"
      ><template #empty>{{ loading ? 'Loading…' : 'No data' }}</template></TreeSelect
    >
  </div>
</template>
