<script setup lang="ts">
import { h, shallowRef, nextTick } from 'vue';
import { Table, type TableColumnProps } from '@aifuxi/semi-ui-vue/table';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/table.css';
import '@aifuxi/semi-theme-default/avatar.css';
import { Input, type InputExposed } from '@aifuxi/semi-ui-vue/input';
import '@aifuxi/semi-theme-default/input.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';

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
const input = shallowRef<InputExposed | null>(null);
interface FilterPanel {
  tempFilteredValue?: unknown[];
  setTempFilteredValue: (values: unknown[]) => void;
  confirm: (options: { closeDropdown: boolean }) => void;
  clear: (options: { closeDropdown: boolean }) => void;
  close: () => void;
}
function filterPanel(raw: Record<string, unknown> | undefined, closeDropdown: boolean) {
  const panel = raw as unknown as FilterPanel;
  return h('div', { style: { padding: '8px', display: 'grid', gap: '8px' } }, [
    h(Input, {
      ...(closeDropdown ? { ref: input } : {}),
      value: String(panel.tempFilteredValue?.[0] ?? ''),
      onChange: (value: string) => panel.setTempFilteredValue(value ? [value] : []),
    }),
    h(Button, { onClick: () => panel.confirm({ closeDropdown }) }, () =>
      closeDropdown ? '筛选并关闭' : '筛选后不关闭',
    ),
    h(Button, { onClick: () => panel.clear({ closeDropdown }) }, () =>
      closeDropdown ? '清除并关闭' : '清除后不关闭',
    ),
    h(Button, { onClick: () => panel.close() }, () => '直接关闭'),
  ]);
}
const columns: TableColumnProps[] = queryColumns.map((column) =>
  column.dataIndex === 'name'
    ? {
        ...column,
        filters: [],
        renderFilterDropdown: (props) => filterPanel(props, true),
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) void nextTick(() => input.value?.focus());
        },
      }
    : column.dataIndex === 'owner'
      ? {
          ...column,
          defaultFilteredValue: ['姜鹏志'],
          onFilter: (value, record) => String(record?.owner).includes(String(value)),
          renderFilterDropdown: (props) => filterPanel(props, false),
        }
      : column,
);
</script>

<template>
  <div>
    <Table :columns="columns" :data-source="data"></Table>
  </div>
</template>
