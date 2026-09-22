<script setup lang="ts">
import { Table } from '@aifuxi/semi-ui-vue/table';
import { fileColumns, type FileRow } from './first-batch-fixture';
import { rows } from './first-batch-data';

const columns = fileColumns('zh-cn', 1);
const data: FileRow[] = rows[1]!;
</script>

<template>
  <Table :columns="columns" :data-source="data" :pagination="false"></Table>
</template>
