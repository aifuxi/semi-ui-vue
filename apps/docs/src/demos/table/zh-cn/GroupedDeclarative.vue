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
const nameFilters = [
  { text: 'Semi Design 设计稿', value: 'Semi Design' },
  { text: 'Semi D2C 设计稿', value: 'Semi D2C' },
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
    title: '基本信息',
    fixed: 'left',
    children: queryColumns
      .slice(0, 2)
      .map((column, index) => ({ ...column, fixed: true, width: index === 0 ? 300 : 100 })),
  },
  { title: '其他信息', children: queryColumns.slice(2) },
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
  <div>
    <Table :data-source="data" :row-selection="{ fixed: true }" :scroll="{ y: 400 }"
      ><Table.Column
        v-for="column in columns"
        :key="String(column.title)"
        :title="column.title"
        :fixed="column.fixed"
        :width="column.width"
        :data-index="column.dataIndex"
        :align="column.align"
        :render="column.render"
        ><Table.Column
          v-for="child in column.children"
          :key="child.dataIndex"
          v-bind="child" /></Table.Column
      ><template #expandedRow="{ record }"
        ><article>{{ record.name }}</article></template
      ></Table
    >
  </div>
</template>
