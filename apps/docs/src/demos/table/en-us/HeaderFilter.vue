<script setup lang="ts">
import { h, shallowRef, computed } from 'vue';
import { Table, type TableColumnProps } from '@aifuxi/semi-ui-vue/table';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/table.css';
import '@aifuxi/semi-theme-default/avatar.css';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import { IconTickCircle, IconClear, IconComment } from '@aifuxi/semi-icons-vue';
import '@aifuxi/semi-theme-default/tag.css';
import { Input } from '@aifuxi/semi-ui-vue/input';
import '@aifuxi/semi-theme-default/input.css';

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
const statusColumn: TableColumnProps = {
  title: 'Delivery status',
  dataIndex: 'status',
  render: (text) => {
    const key = String(text);
    const color = key === 'success' ? 'green' : key === 'pending' ? 'pink' : 'cyan';
    const icon = key === 'success' ? IconTickCircle : key === 'pending' ? IconClear : IconComment;
    const label =
      key === 'success' ? 'Delivered' : key === 'pending' ? 'Delayed' : 'Pending review';
    return h(
      Tag,
      { shape: 'circle', color, prefixIcon: h(icon), style: { userSelect: 'text' } },
      () => label,
    );
  },
};

for (const column of queryColumns) delete column.filters;
const data = makeData(46);
const query = shallowRef('');
let composing = false;
const columns = computed<TableColumnProps[]>(() =>
  [...queryColumns.slice(0, 2), statusColumn, ...queryColumns.slice(2)].map((column) =>
    column.dataIndex === 'name'
      ? {
          ...column,

          filteredValue: query.value ? [query.value] : [],
          title: () =>
            h('span', { style: { display: 'flex', gap: '12px' } }, [
              String(column.title),
              h(Input, {
                style: { width: '200px' },
                showClear: true,
                onCompositionstart: () => {
                  composing = true;
                },
                onCompositionend: (event: CompositionEvent) => {
                  composing = false;
                  query.value = (event.target as HTMLInputElement).value;
                },
                onChange: (value: string) => {
                  if (!composing) query.value = value;
                },
              }),
            ]),
        }
      : column,
  ),
);
</script>

<template>
  <div>
    <Table :columns="columns" :data-source="data"></Table>
  </div>
</template>
