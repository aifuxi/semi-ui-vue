<script setup lang="ts">
import { h, shallowRef } from 'vue';
import { Table, type TableColumnProps } from '@aifuxi/semi-ui-vue/table';
import '@aifuxi/semi-theme-default/table.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';

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

const data = shallowRef(initial);
const expanded = shallowRef<Array<string | number>>(['1', '2']);
function siblings(key: unknown, rows: Row[] = data.value): Row[] {
  if (rows.some((row) => row.key === key)) return rows;
  for (const row of rows) {
    const found = siblings(key, (row.children as Row[] | undefined) ?? []);
    if (found.length) return found;
  }
  return [];
}
function move(key: unknown, offset: number) {
  const next = structuredClone(data.value);
  const rows = siblings(key, next);
  const index = rows.findIndex((row) => row.key === key);
  const target = index + offset;
  if (index < 0 || target < 0 || target >= rows.length) return;
  [rows[index], rows[target]] = [rows[target]!, rows[index]!];
  data.value = next;
}
columns.push({
  dataIndex: 'operation',
  render: (_text, record) => {
    const rows = siblings(record.key);
    const index = rows.findIndex((row) => row.key === record.key);
    return h('span', [
      h(
        Button,
        { disabled: index === 0, onClick: () => move(record.key, -1), 'aria-label': 'Move up' },
        () => '↑',
      ),
      h(
        Button,
        {
          disabled: index === rows.length - 1,
          onClick: () => move(record.key, 1),
          'aria-label': 'Move down',
        },
        () => '↓',
      ),
    ]);
  },
});
</script>

<template>
  <div>
    <Table
      :columns="columns"
      :data-source="data"
      :pagination="false"
      row-key="key"
      children-record-name="children"
      :expanded-row-keys="expanded"
      @expanded-rows-change="
        (rows?: Row[]) => (expanded = (rows ?? []).map((row) => String(row.key)))
      "
    ></Table>
  </div>
</template>
