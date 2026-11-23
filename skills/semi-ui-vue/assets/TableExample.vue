<script setup lang="ts">
import { ref } from 'vue';
import { Table, type TableChangeInfo, type TableColumnProps } from '@aifuxi/semi-ui-vue/table';

const columns: TableColumnProps[] = [
  { title: '名称', dataIndex: 'name' },
  {
    title: '分数',
    dataIndex: 'score',
    sorter: (left, right) => Number(left.score) - Number(right.score),
  },
];
const dataSource = [
  { key: 'a', name: 'Alpha', score: 90 },
  { key: 'b', name: 'Beta', score: 75 },
  { key: 'c', name: 'Gamma', score: 85 },
];
const lastChange = ref('');

function handleChange({ extra }: TableChangeInfo<Record<string, unknown>>) {
  lastChange.value = extra?.changeType ?? '';
}
</script>

<template>
  <Table
    :columns="columns"
    :data-source="dataSource"
    :pagination="{ pageSize: 2 }"
    @change="handleChange"
  />
  <p role="status">{{ lastChange }}</p>
</template>
