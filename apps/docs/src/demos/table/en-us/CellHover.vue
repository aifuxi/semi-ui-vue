<script setup lang="ts">
import { Table } from '@aifuxi/semi-ui-vue/table';
import { columnsFor, styleData } from './second-batch-style-fixture';
const columns = columnsFor(24);
const data = styleData;
</script>

<template>
  <Table
    :columns="columns"
    :data-source="data"
    :pagination="false"
    class="component-table-demo-cell-hover-custom"
  ></Table>
</template>

<style scoped>
.component-table-demo-cell-hover-custom
  :deep(.semi-table-tbody .semi-table-row:hover .semi-table-row-cell) {
  background-color: transparent;
  background-image: none;
}
.component-table-demo-cell-hover-custom
  :deep(.semi-table-tbody .semi-table-row:hover .semi-table-cell-fixed-left::before) {
  background-color: transparent;
}
.component-table-demo-cell-hover-custom
  :deep(.semi-table-tbody .semi-table-row:hover .semi-table-row-cell:hover) {
  background-color: rgba(var(--semi-light-green-1), 1);
}
</style>
