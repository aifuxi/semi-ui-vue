<script setup lang="ts">
import { shallowRef, computed } from 'vue';
import { Table } from '@aifuxi/semi-ui-vue/table';
import '@aifuxi/semi-theme-default/table.css';

import { selectionData, treeColumns, type TreeRow as Row } from './second-batch-tree-fixture';
const initial = selectionData;
const columns = treeColumns('selection');

const data = initial;
const selected = shallowRef<Array<string | number>>([]);
function descendantKeys(rows: Row[]): Array<string | number> {
  return rows.flatMap((row) => [
    row.key!,
    ...descendantKeys((row.children as Row[] | undefined) ?? []),
  ]);
}
const rowSelection = computed(() => ({
  selectedRowKeys: selected.value,
  onSelect: (record?: Row, checked?: boolean) => {
    const keys = record ? descendantKeys([record]) : [];
    selected.value = checked
      ? [...new Set([...selected.value, ...keys])]
      : selected.value.filter((key) => !keys.includes(key));
  },
  onSelectAll: (checked?: boolean) => {
    selected.value = checked ? descendantKeys(data) : [];
  },
}));
</script>

<template>
  <Table
    :columns="columns"
    :data-source="data"
    :pagination="false"
    row-key="key"
    children-record-name="children"
    :row-selection="rowSelection"
  ></Table>
</template>
