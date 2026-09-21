<script setup lang="ts">
import { h } from 'vue';
import { Table } from '@aifuxi/semi-ui-vue/table';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import { fileColumns } from './first-batch-fixture';
import { rows } from './first-batch-data';
const columns = fileColumns('zh-cn', 15);
columns[0] = {
  ...columns[0],
  width: 400,
  render: (text, record) =>
    h('div', [
      h(Avatar, {
        size: 'small',
        shape: 'square',
        src: String(record.nameIconSrc),
        style: { marginRight: '12px' },
      }),
      String(text),
    ]),
};
const data = rows[3]!;
const onRow = (_record?: Record<string, unknown>, index?: number) =>
  (index ?? 0) % 2 === 0 ? { style: { background: 'var(--semi-color-fill-0)' } } : {};
</script>
<template>
  <Table :columns="columns" :data-source="data" :on-row="onRow" :pagination="false" />
</template>
