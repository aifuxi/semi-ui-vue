<script setup lang="ts">
import { Table } from '@aifuxi/semi-ui-vue/table';
import { columnsFor, styleData } from './second-batch-style-fixture';
const columns = columnsFor(23);
const data = styleData;
</script>

<template>
  <Table :columns="columns" :data-source="data" :pagination="false"></Table>
</template>
