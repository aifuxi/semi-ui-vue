<script setup lang="ts">
import { Table } from '@aifuxi/semi-ui-vue/table';
import { fileColumns, type FileRow } from './first-batch-fixture';
import { rows } from './first-batch-data';

const columns = fileColumns('en-us', 9);
const data: FileRow[] = rows[9]!;
columns[1]!.sorter = (r1, r2, order) => {
  const a = r1.size,
    b = r2.size;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (typeof a === 'undefined') return order === 'ascend' ? 1 : -1;
  if (typeof b === 'undefined') return order === 'ascend' ? -1 : 1;
  return 0;
};
</script>

<template>
  <Table :columns="columns" :data-source="data"></Table>
</template>
