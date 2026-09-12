<script setup lang="ts">
import { Table } from '@aifuxi/semi-ui-vue/table';
import { fileColumns, selection, generatedRows, type FileRow } from './first-batch-fixture';

const columns = fileColumns('en-us', 5);
const data: FileRow[] = generatedRows('en-us', 5);
const rowSelection = selection('en-us', 5);
</script>

<template>
  <Table
    :columns="columns"
    :data-source="data"
    :row-selection="rowSelection"
    :scroll="{ y: 300 }"
  ></Table>
</template>
