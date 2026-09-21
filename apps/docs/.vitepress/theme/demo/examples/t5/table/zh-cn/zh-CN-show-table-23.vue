<script setup lang="ts">
import { shallowRef, computed } from 'vue';
import { Table } from '@aifuxi/semi-ui-vue/table';
import '@aifuxi/semi-theme-default/table.css';

import { relationData, treeColumns } from './second-batch-tree-fixture';
const initial = relationData;
const columns = treeColumns('relation');

const data = initial;
const selected = shallowRef<Array<string | number>>([]);
const rowSelection = computed(() => ({
  selectedRowKeys: selected.value,
  checkRelation: 'related' as const,
  onChange: (keys?: Array<string | number>) => {
    selected.value = keys ?? [];
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
