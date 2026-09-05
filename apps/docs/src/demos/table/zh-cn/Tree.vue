<script setup lang="ts">
import { Table, type TableColumnProps } from '@aifuxi/semi-ui-vue/table';
import '@aifuxi/semi-theme-default/table.css';

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

const data = initial;
</script>

<template>
  <div>
    <Table
      :columns="columns"
      :data-source="data"
      :pagination="false"
      row-key="key"
      children-record-name="children"
    ></Table>
  </div>
</template>
