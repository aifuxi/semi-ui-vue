import type { TableColumnProps } from '@aifuxi/semi-ui-vue/table';

export interface TreeRow extends Record<string, unknown> {
  key?: string | number;
  children?: TreeRow[];
}

export const treeData: TreeRow[] = [
  {
    key: 1,
    dataKey: 'videos_info',
    name: 'Video Info',
    type: 'Object',
    description: 'Meta info of video',
    default: 'None',
    children: [
      {
        key: 11,
        dataKey: 'status',
        name: 'Video Status',
        type: 'Enum <Integer>',
        description: 'Viewable and recommended status of the video',
        default: '1',
      },
      {
        key: 12,
        dataKey: 'vid',
        name: 'Video ID',
        type: 'String',
        description: 'Unique ID that identifies the video',
        default: 'None',
        children: [
          {
            dataKey: 'video_url',
            name: 'Video url',
            type: 'String',
            description: 'Unique link to the video',
            default: 'None',
          },
        ],
      },
    ],
  },
  {
    key: 2,
    dataKey: 'text_info',
    name: 'Text Info',
    type: 'Object',
    description: 'Meta info of video',
    default: 'None',
    children: [
      {
        key: 21,
        dataKey: 'title',
        name: 'Video Title',
        type: 'String',
        description: 'Title of video',
        default: 'None',
      },
      {
        key: 22,
        dataKey: 'video_description',
        name: 'Video Description',
        type: 'String',
        description: 'Description of video',
        default: 'None',
      },
    ],
  },
];

export const selectionData: TreeRow[] = [
  {
    key: 1,
    dataKey: 'videos_info',
    name: 'Video Info',
    type: 'Object',
    description: 'Meta info of video',
    default: 'None',
    children: [
      {
        key: 11,
        dataKey: 'status',
        name: 'Video Status',
        type: 'Enum <Integer>',
        description: 'Viewable and recommended status of the video',
        default: '1',
      },
      {
        key: 12,
        dataKey: 'vid',
        name: 'Video ID',
        type: 'String',
        description: 'Unique ID that identifies the video',
        default: 'None',
        children: [
          {
            key: 121,
            dataKey: 'video_url',
            name: 'Video url',
            type: 'String',
            description: 'Unique link to the video',
            default: 'None',
          },
        ],
      },
    ],
  },
  {
    key: 2,
    dataKey: 'text_info',
    name: 'Text Info',
    type: 'Object',
    description: 'Meta info of video',
    default: 'None',
    children: [
      {
        key: 21,
        dataKey: 'title',
        name: 'Video Title',
        type: 'String',
        description: 'Title of video',
        default: 'None',
      },
      {
        key: 22,
        dataKey: 'video_description',
        name: 'Video Description',
        type: 'String',
        description: 'Description of video',
        default: 'None',
      },
    ],
  },
];

export const relationData: TreeRow[] = [
  {
    key: '1',
    dataKey: 'videos_info',
    name: 'Video Info',
    type: 'Object',
    description: 'Video metadata',
    children: [
      {
        key: '1-1',
        dataKey: 'status',
        name: 'Video Status',
        type: 'Enum',
        description: 'Video visibility status',
      },
      {
        key: '1-2',
        dataKey: 'vid',
        name: 'Video ID',
        type: 'String',
        description: 'Unique video ID',
        children: [
          {
            key: '1-2-1',
            dataKey: 'video_url',
            name: 'Video URL',
            type: 'String',
            description: 'Unique video link',
          },
        ],
      },
    ],
  },
  {
    key: '2',
    dataKey: 'text_info',
    name: 'Text Info',
    type: 'Object',
    description: 'Text metadata',
    children: [
      {
        key: '2-1',
        dataKey: 'title',
        name: 'Title',
        type: 'String',
        description: 'Text title',
      },
      {
        key: '2-2',
        dataKey: 'description',
        name: 'Description',
        type: 'String',
        description: 'Text description',
      },
    ],
  },
];

export function treeColumns(
  kind: 'tree' | 'reorder' | 'selection' | 'relation',
): TableColumnProps[] {
  return [
    { title: 'Key', dataIndex: 'dataKey', key: 'dataKey' },
    { title: 'Name', dataIndex: 'name', key: 'name', width: 200 },
    {
      title: kind === 'relation' ? 'Type' : 'Data Type',
      dataIndex: 'type',
      key: 'type',
      ...(kind === 'relation' ? { width: 200 } : kind === 'reorder' ? {} : { width: 400 }),
    },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    ...(kind === 'relation'
      ? []
      : [{ title: 'Default', dataIndex: 'default', key: 'default', width: 100 }]),
  ];
}
