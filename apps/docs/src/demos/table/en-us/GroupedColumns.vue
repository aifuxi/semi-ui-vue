<script setup lang="ts">
import { h } from 'vue';
import { Table, type TableColumnProps } from '@aifuxi/semi-ui-vue/table';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import { IconMore } from '@aifuxi/semi-icons-vue';
import '@aifuxi/semi-theme-default/table.css';
import '@aifuxi/semi-theme-default/avatar.css';

const figmaIcon = '/demos/one.svg';
type Row = Record<string, unknown>;
function makeData(total: number): Row[] {
  return Array.from({ length: total }, (_, index) => ({
    key: String(index),
    name: `${index % 2 ? 'Semi D2C' : 'Semi Design'} design${index}.fig`,
    nameIconSrc: figmaIcon,
    size: (index * 1000) % 199,
    owner: index % 2 ? 'Hao Xuan' : 'Jiang Pengzhi',
    status: index % 3 === 0 ? 'success' : index % 3 === 1 ? 'pending' : 'wait',
    updateTime: new Date(Date.UTC(2020, 1, 2) + ((index * 1000) % 199) * 86400000)
      .toISOString()
      .slice(0, 10),
    avatarBg: index % 2 ? 'red' : 'grey',
  }));
}
const baseColumns: TableColumnProps[] = [
  {
    title: 'Title',
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
  { title: 'Size', dataIndex: 'size', width: 150, render: (text) => `${text} KB` },
  {
    title: 'Owner',
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
  { title: 'Updated', dataIndex: 'updateTime', width: 200 },
];
const nameFilters = [
  { text: 'Semi Design design', value: 'Semi Design' },
  { text: 'Semi D2C design', value: 'Semi D2C' },
];
const filterName: NonNullable<TableColumnProps['onFilter']> = (value, record) =>
  String(record?.name).includes(String(value));
const queryColumns: TableColumnProps[] = baseColumns.map((column) =>
  column.dataIndex === 'name'
    ? { ...column, filters: nameFilters, onFilter: filterName }
    : column.dataIndex === 'size'
      ? { ...column, sorter: (a, b) => Number(a.size) - Number(b.size) }
      : column.dataIndex === 'updateTime'
        ? { ...column, sorter: (a, b) => String(a.updateTime).localeCompare(String(b.updateTime)) }
        : column,
);

const data = makeData(46);
const columns: TableColumnProps[] = [
  {
    title: 'Basic information',
    fixed: 'left',
    children: queryColumns
      .slice(0, 2)
      .map((column, index) => ({ ...column, fixed: true, width: index === 0 ? 300 : 100 })),
  },
  { title: 'Other information', children: queryColumns.slice(2) },
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
  <div>
    <Table
      :columns="columns"
      :data-source="data"
      :row-selection="{ fixed: true }"
      :scroll="{ y: 400 }"
      ><template #expandedRow="{ record }"
        ><article>{{ record.name }}</article></template
      ></Table
    >
  </div>
</template>
