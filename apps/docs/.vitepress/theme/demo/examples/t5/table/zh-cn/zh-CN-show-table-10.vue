<script setup lang="ts">
import { Table } from '@aifuxi/semi-ui-vue/table';
import { fileColumns, selection, generatedRows, type FileRow } from './first-batch-fixture';

const columns = fileColumns('zh-cn', 8);
const data: FileRow[] = generatedRows('zh-cn', 8);
const rowSelection = selection('zh-cn', 8);
</script>

<template>
  <Table
    :columns="columns"
    :data-source="data"
    :row-selection="rowSelection"
    :scroll="{ y: 300 }"
  ></Table>
</template>
