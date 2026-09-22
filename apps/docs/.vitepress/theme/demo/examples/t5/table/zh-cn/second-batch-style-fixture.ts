import { h } from 'vue';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import { Typography } from '@aifuxi/semi-ui-vue/typography';
import { IconMore } from '@aifuxi/semi-icons-vue';
import type { TableColumnProps } from '@aifuxi/semi-ui-vue/table';
import '@aifuxi/semi-theme-default/table.css';
import '@aifuxi/semi-theme-default/avatar.css';
import '@aifuxi/semi-theme-default/typography.css';

type Row = Record<string, unknown>;
const zh = true;
const t = (cn: string, en: string) => (zh ? cn : en);
export const styleData: Row[] = [
  {
    key: '1',
    name: 'Semi Design 设计稿.fig',
    nameIconSrc: '/demos/table-figma-icon.png',
    size: '2M',
    owner: '姜鹏志',
    updateTime: '2020-02-02 05:13',
    avatarBg: 'grey',
  },
  {
    key: '2',
    name: 'Semi Design 分享演示文稿',
    nameIconSrc: '/demos/table-docs-icon.png',
    size: '2M',
    owner: '郝宣',
    updateTime: '2020-01-17 05:31',
    avatarBg: 'red',
  },
  {
    key: '3',
    name: '设计文档',
    nameIconSrc: '/demos/table-docs-icon.png',
    size: '34KB',
    owner: 'Zoey Edwards',
    updateTime: '2020-01-26 11:01',
    avatarBg: 'light-blue',
  },
];
export const ellipsisData: Row[] = [
  {
    key: '1',
    name: 'Semi is designed based on FA architecture, and the main logic is extracted as Foundation package, which is easy to migrate to other frameworks',
    nameIconSrc: '/demos/table-figma-icon.png',
    size: '2M',
    owner: 'Pengzhi Jiang Pengzhi Jiang Pengzhi Jiang Pengzhi Jiang',
    updateTime: '2020-02-02 05:13',
    avatarBg: 'grey',
  },
  {
    key: '2',
    name: '由抖音前端与 UED 团队维护，易于定制的现代化设计系统，帮助设计师与开发者打造高质量产品。由抖音前端与 UED 团队维护，易于定制的现代化设计系统，帮助设计师与开发者打造高质量产品。',
    nameIconSrc: '/demos/table-docs-icon.png',
    size: '2M',
    owner: '郝宣郝宣郝宣郝宣郝宣郝宣郝宣郝宣郝宣郝宣郝宣郝宣郝宣郝宣郝宣郝宣',
    updateTime: '2020-02-02 05:13',
    avatarBg: 'red',
  },
  {
    key: '3',
    nameIconSrc: '/demos/table-docs-icon.png',
    name: 'Semi is designed based on FA architecture, and the main logic is extracted as Foundation package, which is easy to migrate to other frameworks',
    size: '34KB',
    owner: 'Pengzhi Jiang Pengzhi Jiang Pengzhi Jiang Pengzhi Jiang',
    updateTime: '2020-02-02 05:13',
    avatarBg: 'light-blue',
  },
  {
    key: '4',
    name: '由抖音前端与 UED 团队维护，易于定制的现代化设计系统，帮助设计师与开发者打造高质量产品。由抖音前端与 UED 团队维护，易于定制的现代化设计系统，帮助设计师与开发者打造高质量产品。',
    nameIconSrc: '/demos/table-docs-icon.png',
    size: '34KB',
    owner: '郝宣郝宣郝宣郝宣郝宣郝宣郝宣郝宣郝宣郝宣郝宣郝宣郝宣郝宣郝宣郝宣',
    updateTime: '2020-02-02 05:13',
    avatarBg: 'light-blue',
  },
];
export const tooltipData: Row[] = [
  {
    key: '1',
    name: 'Semi is designed based on FA architecture, and the main logic is extracted as Foundation package, which is easy to migrate to other frameworks',
    nameIconSrc: '/demos/table-figma-icon.png',
    size: '2M',
    owner: 'Pengzhi Jiang Pengzhi Jiang Pengzhi Jiang Pengzhi Jiang',
    updateTime: '2020-02-02 05:13',
    avatarBg: 'grey',
  },
  {
    key: '2',
    name: '由抖音前端与 UED 团队维护，易于定制的现代化设计系统，帮助设计师与开发者打造高质量产品。由抖音前端与 UED 团队维护，易于定制的现代化设计系统，帮助设计师与开发者打造高质量产品。',
    nameIconSrc: '/demos/table-docs-icon.png',
    size: '2M',
    owner: '郝宣郝宣郝宣郝宣郝宣郝宣郝宣郝宣郝宣郝宣郝宣郝宣郝宣郝宣郝宣郝宣',
    updateTime: '2020-02-02 05:13',
    avatarBg: 'red',
  },
  {
    key: '3',
    nameIconSrc: '/demos/table-docs-icon.png',
    name: 'Semi is designed based on FA architecture, and the main logic is extracted as Foundation package, which is easy to migrate to other frameworks',
    size: '34KB',
    owner: 'Pengzhi Jiang',
    updateTime: '2020-02-02 05:13',
    avatarBg: 'light-blue',
  },
  {
    key: '4',
    name: '由抖音前端与 UED 团队维护，易于定制的现代化设计系统，帮助设计师与开发者打造高质量产品。由抖音前端与 UED 团队维护，易于定制的现代化设计系统，帮助设计师与开发者打造高质量产品。',
    nameIconSrc: '/demos/table-docs-icon.png',
    size: '34KB',
    owner: '郝宣',
    updateTime: '2020-02-02 05:13',
    avatarBg: 'light-blue',
  },
];

export function columnsFor(index: number): TableColumnProps[] {
  const ellipsis = index === 25 || index === 26;
  const filters = [
    t('Semi Design 设计稿', ellipsis ? 'Semi Design' : 'Semi Design design draft'),
    t('Semi D2C 设计稿', ellipsis ? 'Semi D2C' : 'Semi D2C design draft'),
  ].map((value) => ({ text: value, value }));
  const query = {
    filters,
    onFilter: (value: unknown, record?: Row) => String(record?.name).includes(String(value)),
  };
  const byName = (a: Row, b: Row) => (String(a.name).length - String(b.name).length > 0 ? 1 : -1);
  const avatarName: TableColumnProps['render'] = (text, record) =>
    h('div', [
      h(Avatar, {
        size: 'small',
        shape: 'square',
        src: index <= 24 ? String(record.nameIconSrc) : '/demos/table-figma-icon.png',
        style: { marginRight: '12px' },
      }),
      String(text),
    ]);
  const avatarOwner: TableColumnProps['render'] = (text, record) =>
    h('div', [
      h(
        Avatar,
        {
          size: 'small',
          color: record.avatarBg as 'grey' | 'red' | 'light-blue',
          style: { marginRight: '4px' },
        },
        () => (typeof text === 'string' ? text.slice(0, 1) : ''),
      ),
      String(text),
    ]);
  if (ellipsis) {
    const shortened = {
      ellipsis: index === 26 ? { showTitle: false } : true,
      ...(index === 26
        ? {
            render: (text: unknown) =>
              h(Typography.Text, { ellipsis: { showTooltip: true } }, () => String(text)),
          }
        : {}),
    };
    return [
      {
        title: t('标题', 'Title'),
        dataIndex: 'name',
        fixed: true,
        width: 250,
        ...query,
        sorter: byName,
        ...shortened,
      },
      {
        title: t('所有者', 'Owner'),
        dataIndex: 'owner',
        width: 200,
        ...query,
        sorter: byName,
        ...shortened,
      },
      { title: t('大小', 'Size'), dataIndex: 'size', sorter: byName, ellipsis: true },
      { title: t('更新日期', 'Update time'), dataIndex: 'updateTime', width: 200, ellipsis: true },
      {
        title: '',
        dataIndex: 'operate',
        fixed: 'right',
        align: 'center',
        width: 100,
        render: () => h(IconMore),
      },
    ];
  }
  const columns: TableColumnProps[] = [
    {
      title: t('标题', 'Title'),
      dataIndex: 'name',
      ...(index === 24 ? {} : { width: index === 23 ? 280 : index === 27 ? 300 : 400 }),
      render: avatarName,
      ...(index >= 27 ? query : {}),
      ...(index === 27 ? { resize: false } : {}),
    },
    {
      title: t('大小', 'Size'),
      dataIndex: 'size',
      ...(index <= 24 ? { width: 100 } : index <= 28 ? { width: 200 } : {}),
      ...(index >= 27
        ? {
            sorter: (a: Row, b: Row) => (Number(a.size) - Number(b.size) > 0 ? 1 : -1),
            render: (text: unknown) => `${text} KB`,
          }
        : {}),
    },
    {
      title: t('所有者', 'Owner'),
      dataIndex: 'owner',
      ...(index <= 28 ? { width: 200 } : {}),
      render: avatarOwner,
    },
    {
      title: t('更新日期', 'Update'),
      dataIndex: 'updateTime',
      ...(index <= 24
        ? { width: 300 }
        : {
            sorter: (a: Row, b: Row) => (Number(a.updateTime) - Number(b.updateTime) > 0 ? 1 : -1),
            render: (value: unknown) => {
              const date = new Date(Number(value));
              return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            },
          }),
    },
  ];
  if (index <= 24 || index === 27)
    columns.push({
      title: index === 27 ? t('操作列', 'Operate') : '',
      dataIndex: 'operate',
      ...(index === 27 ? { fixed: 'right', width: 100, resize: false } : {}),
      render: () => h(IconMore),
    });
  if (index === 23)
    for (const column of columns)
      column.onHeaderCell = () => ({ style: { backgroundColor: 'var(--semi-color-fill-0)' } });
  return columns;
}
export function generatedData(index: number): Row[] {
  const start = new Date().valueOf();
  return Array.from({ length: 46 }, (_, i) => {
    const even = i % 2 === 0;
    const size = index === 30 ? ((i * 1000) % 19) + 100 : (i * 1000) % 199;
    return {
      key: String(i),
      name: `${even ? t('Semi Design 设计稿', 'Semi Design design draft') : t('Semi D2C 设计稿', 'Semi D2C design draft')}${i}.fig`,
      owner: even ? t('姜鹏志', 'Jiang Pengzhi') : t('郝宣', 'Hao Xuan'),
      size,
      updateTime: start + size * 86400000,
      avatarBg: even ? 'grey' : 'red',
    };
  });
}
