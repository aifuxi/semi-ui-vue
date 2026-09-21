<script setup lang="ts">
import { shallowRef, onBeforeUnmount } from 'vue';
import { Tree, type TreeNodeData } from '@aifuxi/semi-ui-vue/tree';
import '@aifuxi/semi-theme-default/tree.css';
import { replaceChildren } from '../treeOperations';
const treeData = shallowRef<TreeNodeData[]>([
  {
    label: 'Expand to load',
    value: '0',
    key: '0',
  },
  {
    label: 'Expand to load',
    value: '1',
    key: '1',
  },
  {
    label: 'Leaf Node',
    value: '2',
    key: '2',
    isLeaf: true,
  },
]);
const pending = new Map<ReturnType<typeof setTimeout>, () => void>();
onBeforeUnmount(() => {
  for (const [timer, done] of pending) {
    clearTimeout(timer);
    done();
  }
  pending.clear();
});
function loadData(node?: TreeNodeData): Promise<void> {
  if (!node?.key || node.children) return Promise.resolve();
  const key = node.key;
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      treeData.value = replaceChildren(treeData.value, key, [
        { label: 'Child Node', key: `${key}-0` },
        { label: 'Child Node', key: `${key}-1` },
      ]);
      pending.delete(timer);
      resolve();
    }, 1000);
    pending.set(timer, resolve);
  });
}
</script>

<template>
  <Tree :tree-data="treeData" :load-data="loadData" />
</template>
