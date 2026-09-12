<script setup lang="ts">
import { Table } from '@aifuxi/semi-ui-vue/table';
import { fileColumns, generatedRows, type FileRow } from './first-batch-fixture';

const columns = fileColumns('en-us', 12);
const data: FileRow[] = generatedRows('en-us', 12);
columns[0]!.filterMultiple = true;
columns[0]!.filterConfirmMode = 'confirm';
columns[2]!.filters = ['Jiang Pengzhi', 'Hao Xuan'].map((value) => ({ text: value, value }));
columns[2]!.onFilter = (value, record) => Boolean(String(record?.owner).includes(String(value)));
columns[2]!.filterMultiple = true;
columns[2]!.filterConfirmMode = 'confirm';
</script>

<template>
  <Table :columns="columns" :data-source="data"></Table>
</template>
