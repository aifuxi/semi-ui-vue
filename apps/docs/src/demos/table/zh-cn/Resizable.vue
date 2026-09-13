<script setup lang="ts">
import { Table } from '@aifuxi/semi-ui-vue/table';
import { columnsFor, generatedData } from './second-batch-style-fixture';
const columns = columnsFor(27);
const data = generatedData(27);
</script>

<template>
  <Table :columns="columns" :data-source="data" resizable bordered></Table>
</template>
