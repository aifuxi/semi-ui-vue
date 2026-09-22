<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
import { shallowRef, onBeforeUnmount } from 'vue';
import type { SelectModelValue, SelectOptionProps } from '@aifuxi/semi-ui-vue/select';
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

const loading = shallowRef(false);
const list = shallowRef<SelectOptionProps[]>([
  { value: 'douyin', label: '抖音', type: 1 },
  { value: 'xingtu', label: '醒图', type: 2 },
  { value: 'jianying', label: '剪映', type: 3 },
  { value: 'toutiao', label: '今日头条', type: 4 },
]);
const value = shallowRef<SelectModelValue>('');
let pending: ReturnType<typeof setTimeout> | undefined;
let request = 0;
function handleSearch(input: string) {
  const token = ++request;
  if (pending) clearTimeout(pending);
  pending = later(() => {
    loading.value = true;
    if (!input) {
      loading.value = false;
      return;
    }
    const result = Array.from({ length: 20 }, (_, i) => ({
      value: input + i,
      label: `相近业务 ${input}${i}`,
      type: i + 1,
    }));
    later(() => {
      if (token !== request) return;
      loading.value = false;
      list.value = result;
    }, 1000);
  }, 1000);
}
</script>
<template>
  <div>
    <Select
      v-model="value"
      :style="{ width: '300px' }"
      filter
      remote
      on-change-with-object
      multiple
      :option-list="list"
      :loading="loading"
      :empty-content="null"
      @search="handleSearch"
    ></Select>
  </div>
</template>
