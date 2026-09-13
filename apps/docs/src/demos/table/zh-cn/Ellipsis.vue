<script setup lang="ts">
import { Table } from '@aifuxi/semi-ui-vue/table';
import { columnsFor, ellipsisData } from './second-batch-style-fixture';
const columns = columnsFor(25);
const data = ellipsisData;
</script>

<template>
  <Table :columns="columns" :data-source="data" :pagination="false" :scroll="{ x: 1200 }"></Table>
</template>
