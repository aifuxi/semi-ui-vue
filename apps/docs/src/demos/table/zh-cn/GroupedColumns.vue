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
    title: '基本信息',
    fixed: 'left',
    children: [
      {
        title: '标题',
        dataIndex: 'name',
        width: 300,
        fixed: true,
        render: (text) => renderName(text, 'span'),
        filters: nameFilters,
        onFilter: filterName,
      },
      {
        title: '大小',
        dataIndex: 'size',
        width: 100,
        fixed: true,
        sorter: sortSize,
        render: (text) => `${text} KB`,
      },
    ],
  },
  {
    title: '其他信息',
    children: [
      { title: '所有者', dataIndex: 'owner', render: renderOwner },
      { title: '更新日期', dataIndex: 'updateTime', sorter: sortUpdate, render: renderDate },
    ],
  },
  {
    title: '更多',
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
