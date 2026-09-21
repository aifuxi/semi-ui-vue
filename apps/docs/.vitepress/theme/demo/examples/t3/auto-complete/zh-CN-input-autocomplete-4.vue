<script setup lang="ts">
import { AutoComplete } from '@aifuxi/semi-ui-vue/auto-complete';
import '@aifuxi/semi-theme-default/auto-complete.css';
import { IconSearch } from '@aifuxi/semi-icons-vue';
import { IconSelect, IconInput, IconForm, IconButton, IconTable } from '@aifuxi/semi-icons-lab-vue';
import { shallowRef, onBeforeUnmount } from 'vue';
import type { Component } from 'vue';
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
const icons: Record<string, Component> = {
  select: IconSelect,
  input: IconInput,
  form: IconForm,
  button: IconButton,
  table: IconTable,
};
const initial: AutoCompleteDataItem[] = [
  { value: 'select', label: '选择器' },
  { value: 'input', label: '输入框' },
  { value: 'form', label: '表单' },
  { value: 'button', label: '按钮' },
  { value: 'table', label: '表格' },
];
const list = shallowRef(initial);
const loading = shallowRef(false);
let pending: ReturnType<typeof setTimeout> | undefined;
let token = 0;
function search(input: string) {
  const current = ++token;
  if (pending) clearTimeout(pending);
  pending = later(() => {
    loading.value = true;
    const next = input ? initial.filter((item) => String(item.value).includes(input)) : initial;
    later(() => {
      if (current !== token) return;
      list.value = next;
      loading.value = false;
    }, 1000);
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
    :render-selected-item="selected"
    @search="search"
    @select="console.log"
    ><template #prefix><IconSearch /></template
    ><template #option="{ option }"
      ><div style="display: flex; align-items: center">
        <div style="font-size: 32px"><component :is="icons[String(option.value)]" /></div>
        <div style="margin-left: 12px">
          <p>{{ option.value }}</p>
          <p>{{ option.label }}</p>
        </div>
      </div></template
    ></AutoComplete
  >
</template>
