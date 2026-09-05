<script setup lang="ts">
import { Cascader } from '@aifuxi/semi-ui-vue/cascader';
import { Spin } from '@aifuxi/semi-ui-vue/spin';
import '@aifuxi/semi-theme-default/cascader.css';
import '@aifuxi/semi-theme-default/spin.css';
import { shallowRef, onBeforeUnmount } from 'vue';
import type { CascaderData, CascaderValue } from '@aifuxi/semi-ui-vue/cascader';
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

const treeData = shallowRef<CascaderData[]>([]);
const loading = shallowRef(false);
let token = 0;
let pending: ReturnType<typeof setTimeout> | undefined;
function handleSearch(input: string) {
  const current = ++token;
  if (pending) clearTimeout(pending);
  if (!input) {
    treeData.value = [];
    loading.value = false;
    return;
  }
  pending = later(() => {
    loading.value = true;
    later(() => {
      if (current !== token) return;
      treeData.value = ['A', 'B', 'C'].map((letter) => ({
        label: `${input} - Option ${letter}`,
        value: `${input}-${letter.toLowerCase()}`,
      }));
      loading.value = false;
    }, 600);
  }, 300);
}
function selected(value: CascaderValue) {
  console.log('selected:', value);
}
</script>
<template>
  <div>
    <Spin :spinning="loading">
      <Cascader
        :style="{ width: '300px' }"
        placeholder="Type to search remotely"
        filter-tree-node
        remote
        :tree-data="treeData"
        @search="handleSearch"
        @change="selected"
      ></Cascader>
    </Spin>
  </div>
</template>
