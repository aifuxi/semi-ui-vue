<script setup lang="ts">
import { Cascader } from '@aifuxi/semi-ui-vue/cascader';
import '@aifuxi/semi-theme-default/cascader.css';
import { shallowRef, onBeforeUnmount } from 'vue';
import type { CascaderData } from '@aifuxi/semi-ui-vue/cascader';
const timers = new Set<ReturnType<typeof setTimeout>>();
function later(callback: () => void, delay: number) {
  const timer = setTimeout(() => {
    timers.delete(timer);
    callback();
  }, delay);
  timers.add(timer);
  return timer;
}
onBeforeUnmount(() => timers.forEach(clearTimeout));

const data = shallowRef<CascaderData[]>([
  { label: 'Node1', value: '0-0' },
  { label: 'Node2', value: '0-1' },
  { label: 'Node3', value: '0-2', isLeaf: true },
]);
function updateTreeData(
  list: CascaderData[],
  value: CascaderData['value'],
  children: CascaderData[],
): CascaderData[] {
  return list.map((node) =>
    node.value === value
      ? { ...node, children }
      : node.children
        ? { ...node, children: updateTreeData(node.children, value, children) }
        : node,
  );
}
function onLoadData(selected: CascaderData[]): Promise<void> {
  const target = selected.at(-1);
  if (!target || target.children) return Promise.resolve();
  return new Promise<void>((resolve) => {
    later(() => {
      data.value = updateTreeData(
        data.value,
        target.value,
        [1, 2].map((i) => ({
          label: `${String(target.label)} - ${i}`,
          value: `${String(target.label)}-${i}`,
          isLeaf: selected.length > 1,
        })),
      );
      resolve();
    }, 1000);
  });
}
</script>
<template>
  <div>
    <Cascader
      :style="{ width: '300px' }"
      :tree-data="data"
      :load-data="onLoadData"
      placeholder="Please select"
    ></Cascader>
  </div>
</template>
