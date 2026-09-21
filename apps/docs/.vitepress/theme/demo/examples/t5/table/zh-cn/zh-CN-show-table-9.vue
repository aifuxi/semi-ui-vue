<script setup lang="ts">
import { Table } from '@aifuxi/semi-ui-vue/table';
import { fileColumns, selection, generatedRows, type FileRow } from './first-batch-fixture';

const columns = fileColumns('zh-cn', 7);
const data: FileRow[] = generatedRows('zh-cn', 7);
const rowSelection = selection('zh-cn', 7);
</script>

<template>
  <Table
    :sticky="{ top: 60 }"
    :columns="columns"
    :data-source="data"
    :row-selection="rowSelection"
    :scroll="{ y: 300, x: 1200 }"
  ></Table>
</template>
