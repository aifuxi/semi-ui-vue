<script setup lang="ts">
import { Table } from '@aifuxi/semi-ui-vue/table';
import { fileColumns, type FileRow } from './first-batch-fixture';
import { rows } from './first-batch-data';
import { h, shallowRef } from 'vue';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import { Typography } from '@aifuxi/semi-ui-vue/typography';
import { Empty } from '@aifuxi/semi-ui-vue/empty';
import { IllustrationNoResult, IllustrationNoResultDark } from '@aifuxi/semi-illustrations-vue';
import { IconDelete } from '@aifuxi/semi-icons-vue';
import '@aifuxi/semi-theme-default/button.css';
import '@aifuxi/semi-theme-default/typography.css';
import '@aifuxi/semi-theme-default/empty.css';

const columns = fileColumns('zh-cn', 4);
const data: FileRow[] = rows[4]!;
const dataSource = shallowRef([...data]);
columns[0]!.render = (text, record) =>
  h('span', { style: { display: 'flex', alignItems: 'center' } }, [
    h(Avatar, {
      size: 'small',
      shape: 'square',
      src: String(record.nameIconSrc),
      style: { marginRight: '12px' },
    }),
    h(
      Typography.Text,
      { ellipsis: { showTooltip: true }, style: { width: 'calc(400px - 76px)' } },
      () => String(text),
    ),
  ]);
columns.push({
  title: '',
  dataIndex: 'operate',
  render: (_text, record) =>
    h(
      Button,
      {
        theme: 'borderless',
        onClick: () => {
          dataSource.value = dataSource.value.filter((row) => row.key !== record.key);
        },
      },
      { icon: () => h(IconDelete) },
    ),
});
const empty = h(Empty, {
  image: h(IllustrationNoResult),
  darkModeImage: h(IllustrationNoResultDark),
  description: '搜索无结果',
});
</script>

<template>
  <Button style="margin-bottom: 10px" @click="dataSource = [...data]">重置</Button>
  <Table
    :columns="columns"
    :data-source="dataSource"
    :pagination="false"
    :empty="empty"
    style="min-height: 350px"
  ></Table>
</template>
