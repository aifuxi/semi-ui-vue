<script setup lang="ts">
import { Table } from '@aifuxi/semi-ui-vue/table';
import { fileColumns, selection, type FileRow } from './first-batch-fixture';
import { rows } from './first-batch-data';
import { h } from 'vue';
import { Descriptions } from '@aifuxi/semi-ui-vue/descriptions';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/descriptions.css';

const columns = fileColumns('en-us', 14);
const data: FileRow[] = rows[14]!;
const rowSelection = selection('en-us', 14);
const expandData = [
  ['1,480,000', '98%', '3 级', 'Designer', 'No Verified'],
  ['2,480,000', '90%', '1 级', 'Template', 'Verified'],
  ['2,920,000', '98%', '2 级', 'Docs', 'Verified'],
].map((values) =>
  ['DAU', 'Day7 Retention Ratio', 'Security Level', 'Vertical label', 'Certification'].map(
    (key, i) => ({
      key,
      value: i === 3 ? h(Tag, { style: { margin: '0px' } }, () => values[i]) : values[i],
    }),
  ),
);
</script>

<template>
  <Table
    :columns="columns"
    :data-source="data"
    :pagination="false"
    :row-selection="rowSelection"
    row-key="name"
    ><template #expandedRow="{ index: rowIndex }"
      ><Descriptions align="justify" :data="expandData[rowIndex]" /></template
  ></Table>
</template>
