<script setup lang="ts">
import { TreeSelect } from '@aifuxi/semi-ui-vue/tree-select';
import '@aifuxi/semi-theme-default/tree-select.css';
import { onBeforeUnmount, shallowRef } from 'vue';
import { replaceChildren } from '../data';
const treeData = shallowRef<TreeNodeData[]>([
  { label: 'Expand to load', key: '0', value: '0' },
  { label: 'Expand to load', key: '1', value: '1' },
  { label: 'Leaf Node', key: '2', value: '2', isLeaf: true },
]);
const pending = new Map<ReturnType<typeof setTimeout>, () => void>();
function loadData(node?: TreeNodeData): Promise<void> {
  if (!node || !node.key || node.children || node.isLeaf) return Promise.resolve();
  const key = node.key;
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      pending.delete(timer);
      treeData.value = replaceChildren(
        treeData.value,
        key,
        [0, 1].map((i) => ({
          label: 'Child Node',
          key: key + '-' + i,
          value: key + '-' + i,
        })),
      );
      resolve();
    }, 1000);
    pending.set(timer, resolve);
  });
}
onBeforeUnmount(() => {
  for (const [timer, resolve] of pending) {
    clearTimeout(timer);
    resolve();
  }
  pending.clear();
});
import type { TreeNodeData } from '@aifuxi/semi-ui-vue/tree-select';
</script>
<template>
  <TreeSelect
    :style="{ width: '300px' }"
    :tree-data="treeData"
    :load-data="loadData"
    placeholder="Please select"
  />
</template>
