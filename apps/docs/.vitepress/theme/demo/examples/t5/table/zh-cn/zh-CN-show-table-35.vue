<script setup lang="ts">
import { h } from 'vue';
import { Table } from '@aifuxi/semi-ui-vue/table';
import { columnsFor, generatedData } from './second-batch-style-fixture';
const columns = columnsFor(30);
const data = generatedData(30);
const renderGroupSection = (groupKey?: string | number) =>
  h('strong', ['根据文件大小分组 ', groupKey, ' KB']);
const onGroupedRow = (group?: Record<string, unknown>, index?: number) => ({
  onClick: () => console.log('Grouped row clicked: ', group, index),
});
</script>

<template>
  <div style="padding: 20px 0px">
    <Table
      :columns="columns"
      :data-source="data"
      :row-key="
        (record) => `${String(record?.owner).toLowerCase()}-${String(record?.name).toLowerCase()}`
      "
      group-by="size"
      :render-group-section="renderGroupSection"
      :on-grouped-row="onGroupedRow"
      click-grouped-row-to-expand
      :scroll="{ y: 480 }"
    ></Table>
  </div>
</template>
