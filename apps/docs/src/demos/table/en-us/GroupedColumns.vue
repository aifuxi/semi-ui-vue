<script setup lang="ts">
import { h } from 'vue';
import { Table, type TableColumnProps } from '@aifuxi/semi-ui-vue/table';
import { IconMore } from '@aifuxi/semi-icons-vue';
import {
  filterName,
  logChange,
  makeData,
  nameFilters,
  renderDate,
  renderName,
  renderOwner,
  sortSize,
  sortUpdate,
} from './third-batch-render-fixture';

const data = makeData(46);
const columns: TableColumnProps[] = [
  {
    title: 'Basic Info',
    fixed: 'left',
    children: [
      {
        title: 'Title',
        dataIndex: 'name',
        width: 300,
        fixed: true,
        render: (text) => renderName(text, 'span'),
        filters: nameFilters,
        onFilter: filterName,
      },
      {
        title: 'Size',
        dataIndex: 'size',
        width: 100,
        fixed: true,
        sorter: sortSize,
        render: (text) => `${text} KB`,
      },
    ],
  },
  {
    title: 'Others Info',
    children: [
      { title: 'Owner', dataIndex: 'owner', render: renderOwner },
      { title: 'Update', dataIndex: 'updateTime', sorter: sortUpdate, render: renderDate },
    ],
  },
  {
    title: 'More',
    dataIndex: 'operate',
    fixed: 'right',
    width: 100,
    align: 'center',
    render: () => h(IconMore),
  },
];
</script>

<template>
  <Table
    :columns="columns"
    :data-source="data"
    :row-selection="{ fixed: true }"
    :scroll="{ y: 400 }"
    @change="logChange"
  >
    <template #expandedRow="{ record }">
      <article>{{ record.name }}</article>
    </template>
  </Table>
</template>
