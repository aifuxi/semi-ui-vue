<script setup lang="ts">
import { Table } from '@aifuxi/semi-ui-vue/table';
import { columnsFor, tooltipData } from './second-batch-style-fixture';
const columns = columnsFor(26);
const data = tooltipData;
</script>

<template>
  <Table :columns="columns" :data-source="data" :pagination="false" :scroll="{ x: 1200 }"></Table>
</template>
