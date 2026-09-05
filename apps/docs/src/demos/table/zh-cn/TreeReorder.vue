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
    name: '视频信息',
    type: 'Object',
    description: '视频的元信息',
    default: '-',
    children: [
      {
        key: '11',
        dataKey: 'status',
        name: '视频状态',
        type: 'Enum',
        description: '视频的可见、推荐状态',
        default: '1',
      },
      {
        key: '12',
        dataKey: 'vid',
        name: '视频 ID',
        type: 'String',
        description: '标识视频的唯一 ID',
        default: '-',
        children: [
          {
            key: '121',
            dataKey: 'video_url',
            name: '视频地址',
            type: 'String',
            description: '视频的唯一链接',
            default: '-',
          },
        ],
      },
    ],
  },
  {
    key: '2',
    dataKey: 'text_info',
    name: '文本信息',
    type: 'Object',
    description: '文本的元信息',
    default: '-',
    children: [
      {
        key: '21',
        dataKey: 'title',
        name: '视频标题',
        type: 'String',
        description: '视频的标题',
        default: '-',
      },
      {
        key: '22',
        dataKey: 'video_description',
        name: '视频描述',
        type: 'String',
        description: '视频的描述',
        default: '-',
      },
    ],
  },
];
const columns: TableColumnProps[] = [
  { title: 'Key', dataIndex: 'dataKey' },
  { title: '名称', dataIndex: 'name', width: 200 },
  { title: '数据类型', dataIndex: 'type' },
  { title: '描述', dataIndex: 'description' },
  { title: '默认值', dataIndex: 'default', width: 100 },
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
        { disabled: index === 0, onClick: () => move(record.key, -1), 'aria-label': '上移' },
        () => '↑',
      ),
      h(
        Button,
        {
          disabled: index === rows.length - 1,
          onClick: () => move(record.key, 1),
          'aria-label': '下移',
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
