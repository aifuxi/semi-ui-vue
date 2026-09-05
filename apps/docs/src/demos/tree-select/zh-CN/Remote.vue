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
      label: input + ' - 结果' + i,
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
      placeholder="请输入关键字进行远程搜索"
      @search="onSearch"
      ><template #empty>{{ loading ? '加载中…' : '暂无数据' }}</template></TreeSelect
    >
  </div>
</template>
