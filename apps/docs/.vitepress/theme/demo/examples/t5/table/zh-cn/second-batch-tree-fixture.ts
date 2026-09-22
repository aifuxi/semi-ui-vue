import type { TableColumnProps } from '@aifuxi/semi-ui-vue/table';

export interface TreeRow extends Record<string, unknown> {
  key?: string | number;
  children?: TreeRow[];
}

export const treeData: TreeRow[] = [
  {
    key: 1,
    dataKey: 'videos_info',
    name: '视频信息',
    type: 'Object 对象',
    description: '视频的元信息',
    default: '无',
    children: [
      {
        key: 11,
        dataKey: 'status',
        name: '视频状态',
        type: 'Enum <Integer> 枚举',
        description: '视频的可见、推荐状态',
        default: '1',
      },
      {
        key: 12,
        dataKey: 'vid',
        name: '视频 ID',
        type: 'String 字符串',
        description: '标识视频的唯一 ID',
        default: '无',
        children: [
          {
            dataKey: 'video_url',
            name: '视频地址',
            type: 'String 字符串',
            description: '视频的唯一链接',
            default: '无',
          },
        ],
      },
    ],
  },
  {
    key: 2,
    dataKey: 'text_info',
    name: '文本信息',
    type: 'Object 对象',
    description: '视频的元信息',
    default: '无',
    children: [
      {
        key: 21,
        dataKey: 'title',
        name: '视频标题',
        type: 'String 字符串',
        description: '视频的标题',
        default: '无',
      },
      {
        key: 22,
        dataKey: 'video_description',
        name: '视频描述',
        type: 'String 字符串',
        description: '视频的描述',
        default: '无',
      },
    ],
  },
];

export const selectionData: TreeRow[] = [
  {
    key: 1,
    dataKey: 'videos_info',
    name: '视频信息',
    type: 'Object 对象',
    description: '视频的元信息',
    default: '无',
    children: [
      {
        key: 11,
        dataKey: 'status',
        name: '视频状态',
        type: 'Enum <Integer> 枚举',
        description: '视频的可见、推荐状态',
        default: '1',
      },
      {
        key: 12,
        dataKey: 'vid',
        name: '视频 ID',
        type: 'String 字符串',
        description: '标识视频的唯一 ID',
        default: '无',
        children: [
          {
            key: 121,
            dataKey: 'video_url',
            name: '视频地址',
            type: 'String 字符串',
            description: '视频的唯一链接',
            default: '无',
          },
        ],
      },
    ],
  },
  {
    key: 2,
    dataKey: 'text_info',
    name: '文本信息',
    type: 'Object 对象',
    description: '视频的元信息',
    default: '无',
    children: [
      {
        key: 21,
        dataKey: 'title',
        name: '视频标题',
        type: 'String 字符串',
        description: '视频的标题',
        default: '无',
      },
      {
        key: 22,
        dataKey: 'video_description',
        name: '视频描述',
        type: 'String 字符串',
        description: '视频的描述',
        default: '无',
      },
    ],
  },
];

export const relationData: TreeRow[] = [
  {
    key: '1',
    dataKey: 'videos_info',
    name: '视频信息',
    type: 'Object',
    description: '视频的元信息',
    children: [
      {
        key: '1-1',
        dataKey: 'status',
        name: '视频状态',
        type: 'Enum',
        description: '视频的可见状态',
      },
      {
        key: '1-2',
        dataKey: 'vid',
        name: '视频 ID',
        type: 'String',
        description: '标识视频的唯一 ID',
        children: [
          {
            key: '1-2-1',
            dataKey: 'video_url',
            name: '视频地址',
            type: 'String',
            description: '视频的唯一链接',
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
    children: [
      {
        key: '2-1',
        dataKey: 'title',
        name: '标题',
        type: 'String',
        description: '文本标题',
      },
      {
        key: '2-2',
        dataKey: 'description',
        name: '描述',
        type: 'String',
        description: '文本描述',
      },
    ],
  },
];

export function treeColumns(
  kind: 'tree' | 'reorder' | 'selection' | 'relation',
): TableColumnProps[] {
  return [
    { title: 'Key', dataIndex: 'dataKey', key: 'dataKey' },
    { title: '名称', dataIndex: 'name', key: 'name', width: 200 },
    {
      title: '数据类型',
      dataIndex: 'type',
      key: 'type',
      ...(kind === 'relation' ? { width: 200 } : kind === 'reorder' ? {} : { width: 400 }),
    },
    { title: '描述', dataIndex: 'description', key: 'description' },
    ...(kind === 'relation'
      ? []
      : [{ title: '默认值', dataIndex: 'default', key: 'default', width: 100 }]),
  ];
}
