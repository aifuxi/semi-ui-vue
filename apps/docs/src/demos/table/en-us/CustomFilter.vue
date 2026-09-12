<script setup lang="ts">
import { Table } from '@aifuxi/semi-ui-vue/table';
import { fileColumns, generatedRows, type FileRow } from './first-batch-fixture';
import { h, shallowRef, nextTick } from 'vue';
import { Input, type InputExposed } from '@aifuxi/semi-ui-vue/input';
import { Space } from '@aifuxi/semi-ui-vue/space';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/input.css';
import '@aifuxi/semi-theme-default/space.css';
import '@aifuxi/semi-theme-default/button.css';

const columns = fileColumns('en-us', 11);
const data: FileRow[] = generatedRows('en-us', 11);
const inputRef = shallowRef<InputExposed | null>(null);
interface FilterPanel {
  tempFilteredValue?: unknown[];
  setTempFilteredValue: (values: unknown[]) => void;
  confirm: (options: { closeDropdown: boolean }) => void;
  clear: (options: { closeDropdown: boolean }) => void;
  close: () => void;
}
function panel(raw: Record<string, unknown> | undefined, closeDropdown: boolean) {
  const props = raw as unknown as FilterPanel;
  return h(Space, { vertical: true, align: 'start', style: { padding: '8px' } }, () => [
    h(Input, {
      ...(closeDropdown ? { ref: inputRef } : {}),
      value: props.tempFilteredValue?.[0] as string | undefined,
      onChange: (value: string) => props.setTempFilteredValue(value ? [value] : []),
    }),
    h(Space, null, () => [
      h(Button, { onClick: () => props.confirm({ closeDropdown }) }, () => 'Filter+Close'),
      h(Button, { onClick: () => props.clear({ closeDropdown }) }, () => 'Clear+Close'),
      h(Button, { onClick: props.close }, () => 'Close'),
    ]),
  ]);
}
columns[0]!.onFilter = (value, record) => Boolean(String(record?.name).includes(String(value)));
columns[0]!.renderFilterDropdown = (props) => panel(props, true);
columns[0]!.onFilterDropdownVisibleChange = (visible) => {
  if (visible) void nextTick(() => inputRef.value?.focus());
};
columns[2]!.onFilter = (value, record) => Boolean(String(record?.owner).includes(String(value)));
columns[2]!.defaultFilteredValue = ['Jiang Pengzhi'];
columns[2]!.renderFilterDropdown = (props) => panel(props, false);
</script>

<template>
  <Table :columns="columns" :data-source="data"></Table>
</template>
