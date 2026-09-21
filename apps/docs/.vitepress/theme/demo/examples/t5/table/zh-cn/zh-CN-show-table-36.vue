<script setup lang="ts">
import { shallowRef } from 'vue';
import { Table, type TableVirtualizedListRef } from '@aifuxi/semi-ui-vue/table';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { fileColumns, generatedRows } from './third-batch-virtual-fixture';
import '@aifuxi/semi-theme-default/button.css';

const columns = fileColumns();
const data = generatedRows(1000);
const list = shallowRef<TableVirtualizedListRef | null>(null);
function getList(value: { current: TableVirtualizedListRef | null }) {
  list.value = value.current;
}
</script>

<template>
  <Button @click="list?.scrollToItem(100)">Scroll to 100</Button>
  <Table
    :pagination="false"
    :columns="columns"
    :data-source="data"
    :scroll="{ y: 400, x: 900 }"
    :style="{ width: '750px', margin: '0 auto' }"
    virtualized
    :get-virtualized-list-ref="getList"
  />
</template>
