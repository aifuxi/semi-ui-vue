<script setup lang="ts">
import { Table } from '@aifuxi/semi-ui-vue/table';
import { columnsFor, generatedData } from './second-batch-style-fixture';
const columns = columnsFor(28);
const data = generatedData(28);
const resizable = {
  onResizeStart: (column: { className?: string }) => ({
    className: [column.className, 'my-resizing'].filter(Boolean).join(' '),
  }),
  onResizeStop: (column: { className?: string }) => ({
    className: (column.className ?? '')
      .split(/\s+/)
      .filter((value) => value !== 'my-resizing')
      .join(' '),
  }),
};
</script>

<template>
  <div id="components-table-demo-resizable-column">
    <Table
      :columns="columns"
      :data-source="data"
      :resizable="resizable"
      :pagination="{ pageSize: 5 }"
      bordered
    ></Table>
  </div>
</template>

<style scoped>
:deep(.my-resizing) {
  border-right: 2px solid red;
}
:deep(.react-resizable-handle:hover) {
  background-color: red;
}
:deep(.my-resizing:hover .react-resizable-handle) {
  background-color: inherit;
}
</style>
