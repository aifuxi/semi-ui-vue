<script setup lang="ts">
import { Table } from '@aifuxi/semi-ui-vue/table';
import { fileColumns, selection, type FileRow } from './first-batch-fixture';
import { rows } from './first-batch-data';
import { h } from 'vue';
import { Descriptions } from '@aifuxi/semi-ui-vue/descriptions';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/descriptions.css';

const columns = fileColumns('zh-cn', 14);
const data: FileRow[] = rows[14]!;
const rowSelection = selection('zh-cn', 14);
const expandData = [
  ['1,480,000', '98%', '3 级', '设计', '未认证'],
  ['2,480,000', '90%', '1 级', '模板', '已认证'],
  ['2,920,000', '98%', '2 级', '文档', '已认证'],
].map((values) =>
  ['实际用户数量', '7 天留存', '安全等级', '垂类标签', '认证状态'].map((key, i) => ({
    key,
    value: i === 3 ? h(Tag, { style: { margin: '0px' } }, () => values[i]) : values[i],
  })),
);
</script>

<template>
  <Table
    :columns="columns"
    :data-source="data"
    :pagination="false"
    :row-selection="rowSelection"
    row-key="name"
    :hide-expanded-column="false"
    :row-expandable="(record) => record?.name !== '设计文档'"
    ><template #expandedRow="{ index: rowIndex }"
      ><Descriptions align="justify" :data="expandData[rowIndex] ?? []" /></template
  ></Table>
</template>
