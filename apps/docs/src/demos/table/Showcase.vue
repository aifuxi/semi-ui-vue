<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import {
  Table,
  type TableColumnProps,
  type TableRowKey,
  type TableRowSelection,
} from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/table.css';

const columns: TableColumnProps[] = [
  { title: 'Service', dataIndex: 'name', key: 'name' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
  {
    title: 'Requests',
    dataIndex: 'requests',
    key: 'requests',
    sorter: (a, b) => Number(a.requests) - Number(b.requests),
  },
];

const data: Array<Record<string, unknown>> = [
  { key: 'api', name: 'API Gateway', status: 'Healthy', requests: 12840 },
  { key: 'worker', name: 'Worker', status: 'Maintenance', requests: 5720 },
  { key: 'search', name: 'Search', status: 'Healthy', requests: 9130 },
];

const selectedRowKeys = shallowRef<TableRowKey[]>(['api']);
const rowSelection = computed<TableRowSelection<Record<string, unknown>>>(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange(keys) {
    selectedRowKeys.value = keys ?? [];
  },
}));
</script>

<template>
  <Table
    :columns="columns"
    :data-source="data"
    :pagination="false"
    :row-selection="rowSelection"
    :scroll="{ x: 620 }"
    bordered
  >
    <template #cell="{ column, text }">
      <strong v-if="column.dataIndex === 'status'">{{ text }}</strong>
      <template v-else>{{ text }}</template>
    </template>
  </Table>
</template>
