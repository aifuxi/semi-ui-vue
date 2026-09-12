<script setup lang="ts">
import { Table } from '@aifuxi/semi-ui-vue/table';
import { fileColumns, selection, type FileRow } from './first-batch-fixture';
import { rows } from './first-batch-data';

const columns = fileColumns('zh-cn', 3);
const data: FileRow[] = rows[3]!;
const rowSelection = selection('zh-cn', 3);
</script>

<template>
  <Table
    :columns="columns"
    :data-source="data"
    :row-selection="rowSelection"
    :pagination="{ pageSize: 3 }"
  ></Table>
</template>
