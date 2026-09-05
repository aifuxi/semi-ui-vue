<script setup lang="ts">
import { h, shallowRef, computed } from 'vue';
import { Table, type TableColumnProps } from '@aifuxi/semi-ui-vue/table';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
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

const data = shallowRef(makeData(46));
const columns = baseColumns;
const currentPage = shallowRef(1);
const pageSize = 10;
const pagination = computed(() => ({
  currentPage: currentPage.value,
  pageSize,
  total: data.value.length,
}));
const pageData = computed(() =>
  data.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize),
);
let draggedKey: unknown;
function moveTo(sourceKey: unknown, targetKey: unknown) {
  const next = [...data.value];
  const source = next.findIndex((row) => row.key === sourceKey);
  const target = next.findIndex((row) => row.key === targetKey);
  if (source < 0 || target < 0 || source === target) return;
  const [row] = next.splice(source, 1);
  if (row) next.splice(target, 0, row);
  data.value = next;
}
function onRow(record?: Row) {
  return {
    draggable: true,
    tabindex: 0,
    style: { cursor: 'grab' },
    onDragstart: (event: DragEvent) => {
      draggedKey = record?.key;
      event.dataTransfer?.setData('text/plain', String(record?.key));
    },
    onDragover: (event: DragEvent) => event.preventDefault(),
    onDrop: (event: DragEvent) => {
      event.preventDefault();
      moveTo(draggedKey, record?.key);
      draggedKey = undefined;
    },
    onDragend: () => {
      draggedKey = undefined;
    },
    onKeydown: (event: KeyboardEvent) => {
      if (!event.altKey || !['ArrowUp', 'ArrowDown'].includes(event.key)) return;
      event.preventDefault();
      const index = data.value.findIndex((row) => row.key === record?.key);
      const target = index + (event.key === 'ArrowUp' ? -1 : 1);
      const start = (currentPage.value - 1) * pageSize;
      if (target >= start && target < Math.min(start + pageSize, data.value.length))
        moveTo(record?.key, data.value[target]?.key);
    },
  };
}
</script>

<template>
  <div>
    <p>Drag a row to reorder, or focus it and press Alt + ↑/↓.</p>
    <Table
      :columns="columns"
      :data-source="pageData"
      :pagination="pagination"
      :on-row="onRow"
      @page-change="(page: number) => (currentPage = page)"
    ></Table>
  </div>
</template>
