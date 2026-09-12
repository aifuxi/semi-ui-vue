<script setup lang="ts">
import { Table } from '@aifuxi/semi-ui-vue/table';
import { fileColumns, type FileRow } from './first-batch-fixture';
import { rows } from './first-batch-data';

const columns = fileColumns('en-us', 2);
const data: FileRow[] = rows[2]!;
</script>

<template>
  <Table :data-source="data" :pagination="false"
    ><Table.Column v-for="column in columns" :key="column.dataIndex" v-bind="column"
  /></Table>
</template>
