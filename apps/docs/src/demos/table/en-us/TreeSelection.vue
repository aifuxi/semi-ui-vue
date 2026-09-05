<script setup lang="ts">
import { shallowRef, computed } from 'vue';
import { Table, type TableColumnProps } from '@aifuxi/semi-ui-vue/table';
import '@aifuxi/semi-theme-default/table.css';

type Row = Record<string, unknown>;
const initial: Row[] = [
  {
    key: '1',
    dataKey: 'videos_info',
    name: 'Video information',
    type: 'Object',
    description: 'Video metadata',
    default: '-',
    children: [
      {
        key: '11',
        dataKey: 'status',
        name: 'Video status',
        type: 'Enum',
        description: 'Visibility and recommendation status',
        default: '1',
      },
      {
        key: '12',
        dataKey: 'vid',
        name: 'Video ID',
        type: 'String',
        description: 'Unique video identifier',
        default: '-',
        children: [
          {
            key: '121',
            dataKey: 'video_url',
            name: 'Video URL',
            type: 'String',
            description: 'Unique video URL',
            default: '-',
          },
        ],
      },
    ],
  },
  {
    key: '2',
    dataKey: 'text_info',
    name: 'Text information',
    type: 'Object',
    description: 'Text metadata',
    default: '-',
    children: [
      {
        key: '21',
        dataKey: 'title',
        name: 'Video title',
        type: 'String',
        description: 'Video title',
        default: '-',
      },
      {
        key: '22',
        dataKey: 'video_description',
        name: 'Video description',
        type: 'String',
        description: 'Video description',
        default: '-',
      },
    ],
  },
];
const columns: TableColumnProps[] = [
  { title: 'Key', dataIndex: 'dataKey' },
  { title: 'Name', dataIndex: 'name', width: 200 },
  { title: 'Data type', dataIndex: 'type' },
  { title: 'Description', dataIndex: 'description' },
  { title: 'Default', dataIndex: 'default', width: 100 },
];

const data = initial;
const selected = shallowRef<Array<string | number>>([]);
function descendantKeys(rows: Row[]): Array<string | number> {
  return rows.flatMap((row) => [
    String(row.key),
    ...descendantKeys((row.children as Row[] | undefined) ?? []),
  ]);
}
const rowSelection = computed(() => ({
  selectedRowKeys: selected.value,
  onSelect: (record?: Row, checked?: boolean) => {
    const keys = record ? descendantKeys([record]) : [];
    selected.value = checked
      ? [...new Set([...selected.value, ...keys])]
      : selected.value.filter((key) => !keys.includes(key));
  },
  onSelectAll: (checked?: boolean) => {
    selected.value = checked ? descendantKeys(data) : [];
  },
}));
</script>

<template>
  <div>
    <Table
      :columns="columns"
      :data-source="data"
      :pagination="false"
      row-key="key"
      children-record-name="children"
      :row-selection="rowSelection"
    ></Table>
    <p aria-live="polite">{{ selected.join(', ') }}</p>
  </div>
</template>
