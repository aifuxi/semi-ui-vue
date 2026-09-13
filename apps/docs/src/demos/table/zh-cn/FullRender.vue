<script setup lang="ts">
import { h, onMounted, shallowRef } from 'vue';
import { Table, type TableColumnProps } from '@aifuxi/semi-ui-vue/table';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import {
  figmaIcon,
  filterName,
  logChange,
  makeData,
  nameFilters,
  renderDate,
  renderOwner,
  sortSize,
  sortUpdate,
  type Row,
} from './third-batch-render-fixture';

const data = shallowRef<Row[]>([]);
onMounted(() => {
  data.value = makeData(46);
});
const pagination = { pageSize: 12 };
const rowSelection = { hidden: true, fixed: 'left' as const };
const columns: TableColumnProps[] = [
  {
    title: (options) =>
      h('span', { style: { display: 'inline-flex', alignItems: 'center', paddingLeft: '20px' } }, [
        options?.selection,
        h('span', { style: { marginLeft: '8px' } }, 'Name'),
        options?.sorter,
        options?.filter,
      ]),
    dataIndex: 'name',
    width: 400,
    filters: nameFilters,
    onFilter: filterName,
    useFullRender: true,
    render: (text, _record, _index, options) =>
      h(
        'span',
        { style: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center' } },
        [
          options?.indentText,
          options?.expandIcon,
          options?.selection,
          h('span', { style: { marginLeft: '8px' } }, [
            h(Avatar, {
              size: 'small',
              shape: 'square',
              src: figmaIcon,
              style: { marginRight: '12px' },
            }),
            String(text),
          ]),
        ],
      ),
  },
  { title: '大小', dataIndex: 'size', sorter: sortSize, render: (text) => `${text} KB` },
  { title: '所有者', dataIndex: 'owner', render: renderOwner },
  { title: '更新日期', dataIndex: 'updateTime', sorter: sortUpdate, render: renderDate },
];
</script>

<template>
  <Table
    :columns="columns"
    :data-source="data"
    :pagination="pagination"
    :row-selection="rowSelection"
    @change="logChange"
  >
    <template #expandedRow="{ record }">
      <article>{{ record.name }}</article>
    </template>
  </Table>
</template>
