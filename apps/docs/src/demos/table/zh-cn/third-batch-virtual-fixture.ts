import { h } from 'vue';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import type { TableColumnProps } from '@aifuxi/semi-ui-vue/table';
import '@aifuxi/semi-theme-default/table.css';
import '@aifuxi/semi-theme-default/avatar.css';

export interface FileRow extends Record<string, unknown> {
  key: string;
  name: string;
  owner: string;
  size: number;
  updateTime: number;
  avatarBg: 'grey' | 'red';
}
const zh = true;
const t = (cn: string, en: string) => (zh ? cn : en);

// Keep the pinned snippets' relative dates and real timers. The paired browser
// fixture sets Date's current time equally for React and Vue.
export function generatedRows(total: number, startIndex = 0): FileRow[] {
  return Array.from({ length: total }, (_, offset) => {
    const i = startIndex + offset;
    const even = i % 2 === 0;
    const size = (i * 1000) % 199;
    return {
      key: String(i),
      name: `${even ? t('Semi Design 设计稿', 'Semi Design design draft') : t('Semi D2C 设计稿', 'Semi D2C design draft')}${i}.fig`,
      owner: even ? t('姜鹏志', 'Jiang Pengzhi') : t('郝宣', 'Hao Xuan'),
      size,
      updateTime: new Date().valueOf() + size * 86400000,
      avatarBg: even ? 'grey' : 'red',
    };
  });
}

export function fileColumns(dynamic = false): TableColumnProps[] {
  return [
    {
      title: t('标题', 'Title'),
      dataIndex: 'name',
      width: dynamic ? 400 : 200,
      ...(dynamic ? {} : { fixed: true }),
      render: (text) =>
        dynamic
          ? h('span', [
              h(Avatar, {
                size: 'small',
                shape: 'square',
                src: '/demos/table/figma-icon.png',
                style: { marginRight: '12px' },
              }),
              String(text),
            ])
          : h('div', String(text)),
      filters: ['Semi Design', 'Semi D2C'].map((prefix) => {
        const value = `${prefix} ${t('设计稿', 'design draft')}`;
        return { text: value, value };
      }),
      onFilter: (value, record) => String(record?.name).includes(String(value)),
    },
    {
      title: t('大小', 'Size'),
      dataIndex: 'size',
      ...(dynamic ? {} : { width: 150 }),
      sorter: (a, b) => (Number(a.size) - Number(b.size) > 0 ? 1 : -1),
      render: (text) => `${text} KB`,
    },
    {
      title: t('所有者', 'Owner'),
      dataIndex: 'owner',
      render: (text, record) =>
        h('div', [
          h(
            Avatar,
            {
              size: 'small',
              color: record.avatarBg as FileRow['avatarBg'],
              style: { marginRight: '4px' },
            },
            () => (typeof text === 'string' ? text.slice(0, 1) : ''),
          ),
          String(text),
        ]),
    },
    {
      title: t('更新日期', 'Update'),
      dataIndex: 'updateTime',
      ...(dynamic ? {} : { fixed: 'right' as const, width: 150 }),
      sorter: (a, b) => (Number(a.updateTime) - Number(b.updateTime) > 0 ? 1 : -1),
      render: (value) => {
        const date = new Date(Number(value));
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      },
    },
  ];
}
