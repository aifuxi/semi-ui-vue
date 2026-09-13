<script setup lang="ts">
import { Table } from '@aifuxi/semi-ui-vue/table';
import '@aifuxi/semi-theme-default/table.css';

import { treeData, treeColumns } from './second-batch-tree-fixture';
const initial = treeData;
const columns = treeColumns('tree');

const data = initial;
</script>

<template>
  <Table
    :columns="columns"
    :data-source="data"
    default-expand-all-rows
    row-key="key"
    children-record-name="children"
  ></Table>
</template>
