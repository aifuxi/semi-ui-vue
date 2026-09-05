<script setup lang="ts">
import { h, shallowRef, computed } from 'vue';
import { Table, type TableColumnProps } from '@aifuxi/semi-ui-vue/table';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/table.css';
import '@aifuxi/semi-theme-default/avatar.css';
import type { TableChangeInfo, TableSortOrder } from '@aifuxi/semi-ui-vue/table';

const figmaIcon = '/demos/one.svg';
type Row = Record<string, unknown>;
function makeData(total: number): Row[] {
  return Array.from({ length: total }, (_, index) => ({
    key: String(index),
    name: `${index % 2 ? 'Semi D2C' : 'Semi Design'} 设计稿${index}.fig`,
    nameIconSrc: figmaIcon,
    size: (index * 1000) % 199,
    owner: index % 2 ? '郝宣' : '姜鹏志',
    status: index % 3 === 0 ? 'success' : index % 3 === 1 ? 'pending' : 'wait',
    updateTime: new Date(Date.UTC(2020, 1, 2) + ((index * 1000) % 199) * 86400000)
      .toISOString()
      .slice(0, 10),
    avatarBg: index % 2 ? 'red' : 'grey',
  }));
}
const baseColumns: TableColumnProps[] = [
  {
    title: '标题',
    dataIndex: 'name',
    width: 400,
    render: (text, record) =>
      h('span', { style: { display: 'inline-flex', alignItems: 'center' } }, [
        h(Avatar, {
          size: 'small',
          shape: 'square',
          src: String(record.nameIconSrc),
          style: { marginRight: '12px' },
        }),
        String(text),
      ]),
  },
  { title: '大小', dataIndex: 'size', width: 150, render: (text) => `${text} KB` },
  {
    title: '所有者',
    dataIndex: 'owner',
    width: 200,
    render: (text, record) =>
      h('span', [
        h(
          Avatar,
          {
            size: 'small',
            color: record.avatarBg as 'red' | 'grey',
            style: { marginRight: '4px' },
          },
          () => String(text).slice(0, 1),
        ),
        String(text),
      ]),
  },
  { title: '更新日期', dataIndex: 'updateTime', width: 200 },
];

const original = makeData(5).map((row, index) => ({
  ...row,
  size: index === 1 || index === 3 ? undefined : row.size,
}));
const order = shallowRef<TableSortOrder>(false);
const data = computed(() =>
  [...original].sort((a, b) => {
    if (!order.value) return 0;
    if (a.size === undefined) return b.size === undefined ? 0 : 1;
    if (b.size === undefined) return -1;
    return (Number(a.size) - Number(b.size)) * (order.value === 'ascend' ? 1 : -1);
  }),
);
const columns = computed<TableColumnProps[]>(() =>
  baseColumns.map((column) =>
    column.dataIndex === 'size'
      ? {
          ...column,
          sorter: true,
          showSortTip: true,
          render: (value) => (value === undefined ? '未知' : `${value} KB`),
        }
      : column,
  ),
);
function change(info: TableChangeInfo<Row>) {
  order.value = info.sorter?.sortOrder ?? false;
}
</script>

<template>
  <div>
    <Table :columns="columns" :data-source="data" @change="change"></Table>
  </div>
</template>
