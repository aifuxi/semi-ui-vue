<script setup lang="ts">
import { h, shallowRef } from 'vue';
import { Table, type TableColumnProps } from '@aifuxi/semi-ui-vue/table';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/table.css';
import '@aifuxi/semi-theme-default/avatar.css';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import { IconTickCircle, IconClear, IconComment } from '@aifuxi/semi-icons-vue';
import '@aifuxi/semi-theme-default/tag.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Typography } from '@aifuxi/semi-ui-vue/typography';
import { Empty } from '@aifuxi/semi-ui-vue/empty';
import { IllustrationNoResult, IllustrationNoResultDark } from '@aifuxi/semi-illustrations-vue';
import '@aifuxi/semi-theme-default/typography.css';
import '@aifuxi/semi-theme-default/empty.css';

const figmaIcon = '/demos/one.svg';
type Row = Record<string, unknown>;
function makeData(total: number): Row[] {
  return Array.from({ length: total }, (_, index) => ({
    key: String(index),
    name: `${index % 2 ? 'Semi D2C' : 'Semi Design'} 设计稿${index}.fig`,
    nameIconSrc: figmaIcon,
    size: (index * 1000) % 199,
    owner: index % 2 ? '郝宣' : '姜鹏志',
    status: index % 3 === 0 ? 'success' : index % 3 === 1 ? 'pending' : 'wait',
    updateTime: new Date(Date.UTC(2020, 1, 2) + ((index * 1000) % 199) * 86400000)
      .toISOString()
      .slice(0, 10),
    avatarBg: index % 2 ? 'red' : 'grey',
  }));
}
const baseColumns: TableColumnProps[] = [
  {
    title: '标题',
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
  { title: '大小', dataIndex: 'size', width: 150, render: (text) => `${text} KB` },
  {
    title: '所有者',
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
  { title: '更新日期', dataIndex: 'updateTime', width: 200 },
];
const statusColumn: TableColumnProps = {
  title: '交付状态',
  dataIndex: 'status',
  render: (text) => {
    const key = String(text);
    const color = key === 'success' ? 'green' : key === 'pending' ? 'pink' : 'cyan';
    const icon = key === 'success' ? IconTickCircle : key === 'pending' ? IconClear : IconComment;
    const label = key === 'success' ? '已交付' : key === 'pending' ? '已延期' : '待评审';
    return h(
      Tag,
      { shape: 'circle', color, prefixIcon: h(icon), style: { userSelect: 'text' } },
      () => label,
    );
  },
};

const initial: Row[] = makeData(4).map((record) => ({
  ...record,
  name: `${record.name} — 标题较长时显示提示`,
}));
const data = shallowRef(initial);
const columns: TableColumnProps[] = [
  ...baseColumns.slice(0, 2),
  statusColumn,
  ...baseColumns.slice(2),
  {
    dataIndex: 'operate',
    render: (_text, record) =>
      h(
        Button,
        {
          theme: 'borderless',
          'aria-label': '删除',
          onClick: () => {
            data.value = data.value.filter((row) => row.key !== record.key);
          },
        },
        () => '删除',
      ),
  },
];
columns[0] = {
  ...columns[0],
  render: (text) =>
    h(Typography.Text, { ellipsis: { showTooltip: true }, style: { width: '324px' } }, () =>
      String(text),
    ),
};
</script>

<template>
  <div>
    <Button @click="data = [...initial]">重置</Button>
    <Table :columns="columns" :data-source="data" :pagination="false"
      ><template #empty
        ><Empty
          :image="h(IllustrationNoResult)"
          :dark-mode-image="h(IllustrationNoResultDark)"
          description="搜索无结果" /></template
    ></Table>
  </div>
</template>
