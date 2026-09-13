<script setup lang="ts">
import { Table, type TableColumnProps } from '@aifuxi/semi-ui-vue/table';
import { fileColumns, generatedRows } from './first-batch-fixture';
const columns = fileColumns('zh-cn', 5).filter((column) => column.dataIndex !== 'status');
const data = generatedRows('zh-cn', 5);
const onRow = (record?: Record<string, unknown>, index?: number) => ({
  className: 'my-tr-class',
  ...(index === 2 ? { onClick: () => console.log('mouse click: ', record, index) } : {}),
});
const onHeaderRow = (columns?: TableColumnProps[], index?: number) => ({
  onMouseenter: () => console.log('mouse enter: ', columns, index),
  onMouseleave: () => console.log('mouse leave: ', columns, index),
});
</script>
<template>
  <Table :columns="columns" :data-source="data" :on-row="onRow" :on-header-row="onHeaderRow" />
</template>
