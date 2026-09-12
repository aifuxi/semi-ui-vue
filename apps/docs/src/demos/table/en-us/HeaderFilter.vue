<script setup lang="ts">
import { Table } from '@aifuxi/semi-ui-vue/table';
import { fileColumns, generatedRows, type FileRow } from './first-batch-fixture';
import { h, shallowRef, computed } from 'vue';
import { Input } from '@aifuxi/semi-ui-vue/input';
import { Space } from '@aifuxi/semi-ui-vue/space';
import '@aifuxi/semi-theme-default/input.css';
import '@aifuxi/semi-theme-default/space.css';

const columns = fileColumns('en-us', 10);
const data: FileRow[] = generatedRows('en-us', 10);
const filteredValue = shallowRef<string[]>([]);
let composing = false;
const filter = (value: string) => {
  filteredValue.value = value ? [value] : [];
};
columns[0]!.title = h(Space, null, () => [
  h('span', 'Title'),
  h(Input, {
    placeholder: 'Input filter value',
    style: { width: '200px' },
    showClear: true,
    onCompositionstart: () => {
      composing = true;
    },
    onCompositionend: (event: CompositionEvent) => {
      composing = false;
      filter((event.target as HTMLInputElement).value);
    },
    onChange: (value: string) => {
      if (!composing) filter(value);
    },
  }),
]);
columns[0]!.onFilter = (value, record) => Boolean(String(record?.name).includes(String(value)));
const filteredColumns = computed(() =>
  columns.map((column, i) =>
    i === 0 ? { ...column, filteredValue: filteredValue.value } : column,
  ),
);
</script>

<template>
  <Table :columns="filteredColumns" :data-source="data"></Table>
</template>
