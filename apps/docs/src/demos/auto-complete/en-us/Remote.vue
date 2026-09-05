<script setup lang="ts">
import { AutoComplete } from '@aifuxi/semi-ui-vue/auto-complete';
import '@aifuxi/semi-theme-default/auto-complete.css';
import { IconSearch } from '@aifuxi/semi-icons-vue';
import { shallowRef, onBeforeUnmount } from 'vue';
import type {
  AutoCompleteDataItem,
  AutoCompleteOptionRuntime,
} from '@aifuxi/semi-ui-vue/auto-complete';
const timers = new Set<ReturnType<typeof setTimeout>>();
function later(callback: () => void, delay: number) {
  const id = setTimeout(() => {
    timers.delete(id);
    callback();
  }, delay);
  timers.add(id);
  return id;
}
onBeforeUnmount(() => timers.forEach(clearTimeout));
const initial: AutoCompleteDataItem[] = [
  { value: 'abc', label: 'douyin', email: '1@gmail.com', type: 2 },
  { value: 'hotsoon', label: 'huoshan', email: '2@gmail.com', type: 3 },
  { value: 'pipixia', label: 'pip', email: '3@gmail.com' },
];
const list = shallowRef(initial);
const loading = shallowRef(false);
let pending: ReturnType<typeof setTimeout> | undefined;
function search(input: string) {
  loading.value = true;
  if (pending) clearTimeout(pending);
  pending = later(() => {
    list.value = initial.map((item, i) => {
      const value = input + '-' + String(100 + i * 137);
      return { ...item, label: 'Name:' + value, value };
    });
    loading.value = false;
  }, 200);
}
function selected(item: AutoCompleteOptionRuntime) {
  return String(item.value ?? '');
}
</script>
<template>
  <AutoComplete
    :data="list"
    style="width: 250px"
    :loading="loading"
    on-change-with-object
    :render-selected-item="selected"
    @search="search"
    @select="console.log"
    ><template #prefix><IconSearch /></template
    ><template #option="{ option }"
      ><div>
        <div>{{ option.label }}</div>
        <div>email: {{ option.email }}</div>
        <div style="color: pink">value: {{ option.value }}</div>
      </div></template
    ></AutoComplete
  >
</template>
