import { h } from 'vue';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import { IconMore, IconTickCircle, IconClear, IconComment } from '@aifuxi/semi-icons-vue';
import type { TableColumnProps, TableRowSelection } from '@aifuxi/semi-ui-vue/table';
import '@aifuxi/semi-theme-default/table.css';
import '@aifuxi/semi-theme-default/avatar.css';
import '@aifuxi/semi-theme-default/tag.css';

export interface FileRow extends Record<string, unknown> {
  key: string;
  name: string;
  nameIconSrc?: string;
  size?: string | number;
  owner: string;
  status?: string;
  updateTime: string | number;
  avatarBg: 'grey' | 'red' | 'light-blue' | 'green';
}
export type Locale = 'zh-cn' | 'en-us';
export const figmaIcon = '/demos/table-figma-icon.png';
export const localized = (locale: Locale, zh: string, en: string) => (locale === 'zh-cn' ? zh : en);

// Match the pinned examples' relative dates while retaining their real clock in the demo.
// The strict browser context sets only Date's current time on both sides, leaving timers running.
export function generatedRows(locale: Locale, index: number): FileRow[] {
  const zh = locale === 'zh-cn';
  const start =
    index === 12 || (index === 10 && zh) ? new Date('2024-01-25').valueOf() : new Date().valueOf();
  return Array.from({ length: index === 12 ? 20 : 46 }, (_, i) => {
    const even = i % 2 === 0;
    const offset = (i * 1000) % 199;
    const first = localized(locale, 'Semi Design 设计稿', 'Semi Design design draft');
    const second =
      index === 12
        ? localized(locale, 'Semi Pro 首页', 'Semi Pro homepage')
        : index === 10 && zh
          ? 'Semi D2C 首页'
          : localized(locale, 'Semi D2C 设计稿', 'Semi D2C design draft');
    return {
      key: String(i),
      name: `${even ? first : second}${i}.fig`,
      owner: even
        ? localized(locale, '姜鹏志', 'Jiang Pengzhi')
        : localized(locale, '郝宣', 'Hao Xuan'),
      size: offset,
      status: even ? 'success' : 'wait',
      updateTime: start + offset * 86400000,
      avatarBg: even ? 'grey' : 'red',
    };
  });
}

export function fileColumns(locale: Locale, index: number): TableColumnProps[] {
  const t = (zh: string, en: string) => localized(locale, zh, en);
  const dynamic = index >= 5 && index <= 13;
  const columns: TableColumnProps[] = [
    {
      title: t('标题', 'Title'),
      dataIndex: 'name',
      ...(index >= 3
        ? { width: index === 7 ? 250 : index === 12 ? 300 : index >= 14 ? 500 : 400 }
        : {}),
      render: (text, record) =>
        h(index >= 14 ? 'span' : 'div', [
          h(Avatar, {
            size: 'small',
            shape: 'square',
            src: dynamic ? figmaIcon : String(record.nameIconSrc),
            style: { marginRight: '12px' },
          }),
          String(text),
        ]),
    },
    { title: t('大小', 'Size'), dataIndex: 'size' },
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
      title: t(index === 2 ? '更新时间' : '更新日期', index === 12 ? 'Update Date' : 'Update'),
      dataIndex: 'updateTime',
    },
  ];
  if (dynamic) {
    columns[1]!.render = (text) => (index === 9 && !text ? t('未知', 'Unknown') : `${text} KB`);
    columns[3]!.render = (value) => {
      const date = new Date(value as string | number);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };
    if (index !== 9) {
      columns[1]!.sorter = (a, b) => (Number(a.size) - Number(b.size) > 0 ? 1 : -1);
      columns[3]!.sorter = (a, b) => (Number(a.updateTime) - Number(b.updateTime) > 0 ? 1 : -1);
    }
    if (![9, 10, 11].includes(index)) {
      columns[0]!.filters =
        index === 12
          ? [
              { text: t('Semi Design 设计稿', 'Semi Design'), value: 'Semi Design' },
              { text: t('Semi Pro 设计稿', 'Semi Pro'), value: 'Semi Pro' },
            ]
          : ['Semi Design', 'Semi D2C'].map((prefix) => ({
              text: `${prefix} ${t('设计稿', 'design draft')}`,
              value: `${prefix} ${t('设计稿', 'design draft')}`,
            }));
      columns[0]!.onFilter = (value, record) =>
        Boolean(String(record?.name).includes(String(value)));
    }
    if ([8, 13].includes(index))
      columns[0]!.sorter = (a, b) => (String(a.name).length - String(b.name).length > 0 ? 1 : -1);
  }
  if (index === 4) {
    columns[1]!.width = 150;
    columns[2]!.width = 300;
    columns[3]!.width = 200;
  }
  if (index === 7) {
    columns[0]!.fixed = true;
    for (const column of columns.slice(1)) column.width = 200;
  }
  if (locale === 'zh-cn' && [1, 3, 4, 5, 6, 8, 10].includes(index))
    columns.splice(2, 0, {
      title: '交付状态',
      dataIndex: 'status',
      render: (text) => {
        const key = String(text);
        const color = key === 'success' ? 'green' : key === 'pending' ? 'pink' : 'cyan';
        const icon =
          key === 'success' ? IconTickCircle : key === 'pending' ? IconClear : IconComment;
        const label = key === 'success' ? '已交付' : key === 'pending' ? '已延期' : '待评审';
        // The pinned snippet spreads tagProps, including its native text attribute.
        return h(
          Tag,
          {
            shape: 'circle',
            color,
            prefixIcon: h(icon),
            text: label,
            style: { userSelect: 'text' },
          },
          () => label,
        );
      },
    });
  if ([1, 2, 3, 7, 14, 15].includes(index))
    columns.push({
      title: '',
      dataIndex: 'operate',
      ...(index === 7 ? { fixed: 'right', align: 'center', width: 100 } : {}),
      render: () => h(IconMore),
    });
  return columns;
}
export function selection(
  locale: Locale,
  index: number,
): TableRowSelection<Record<string, unknown>> {
  return {
    getCheckboxProps: (record) => ({
      disabled:
        record.name ===
        ([3, 14, 15].includes(index)
          ? localized(locale, '设计文档', 'Design docs')
          : 'Michael James'),
      name: String(record.name),
    }),
    ...(index === 7 ? { fixed: true } : {}),
    onSelect: (record, selected) => console.log(`select row: ${selected}`, record),
    onSelectAll: (selected, selectedRows) =>
      console.log(`select all rows: ${selected}`, selectedRows),
    onChange: (selectedRowKeys, selectedRows) =>
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows),
  };
}
