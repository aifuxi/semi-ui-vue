<script setup lang="ts">
import { h, shallowRef } from 'vue';
import { Table } from '@aifuxi/semi-ui-vue/table';
import '@aifuxi/semi-theme-default/table.css';
import { IconArrowUp, IconArrowDown } from '@aifuxi/semi-icons-vue';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';

import { treeData, treeColumns, type TreeRow as Row } from './second-batch-tree-fixture';
const initial = treeData;
const columns = treeColumns('reorder');

const data = shallowRef(initial);
const expanded = shallowRef<Array<string | number>>([1, 2]);
function siblings(key: unknown, rows: Row[] = data.value): Row[] {
  if (rows.some((row) => row.key === key)) return rows;
  for (const row of rows) {
    const found = siblings(key, (row.children as Row[] | undefined) ?? []);
    if (found.length) return found;
  }
  return [];
}
function move(key: unknown, offset: number) {
  const next = structuredClone(data.value);
  const rows = siblings(key, next);
  const index = rows.findIndex((row) => row.key === key);
  const target = index + offset;
  if (index < 0 || target < 0 || target >= rows.length) return;
  [rows[index], rows[target]] = [rows[target]!, rows[index]!];
  data.value = next;
}
columns.push({
  key: 'operation',
  render: (_text, record) => {
    const rows = siblings(record.key);
    const index = rows.findIndex((row) => row.key === record.key);
    return [
      h(
        Button,
        {
          disabled: index <= 0,
          onClick: () => move(record.key, -1),
        },
        { icon: () => h(IconArrowUp) },
      ),
      h(
        Button,
        {
          disabled: index >= rows.length - 1,
          onClick: () => move(record.key, 1),
        },
        { icon: () => h(IconArrowDown) },
      ),
    ];
  },
});
</script>

<template>
  <Table
    :columns="columns"
    :data-source="data"
    row-key="key"
    children-record-name="children"
    :expanded-row-keys="expanded"
    @expanded-rows-change="(rows?: Row[]) => (expanded = (rows ?? []).map((row) => row.key!))"
  ></Table>
</template>
