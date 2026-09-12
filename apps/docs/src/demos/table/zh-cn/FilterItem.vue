<script setup lang="ts">
import { Table } from '@aifuxi/semi-ui-vue/table';
import { fileColumns, selection, generatedRows, type FileRow } from './first-batch-fixture';
import { h } from 'vue';
import { Dropdown } from '@aifuxi/semi-ui-vue/dropdown';
import '@aifuxi/semi-theme-default/dropdown.css';

const columns = fileColumns('zh-cn', 13);
const data: FileRow[] = generatedRows('zh-cn', 13);
const rowSelection = selection('zh-cn', 13);
columns[0]!.renderFilterDropdownItem = (props) =>
  h(
    Dropdown.Item,
    { onClick: props?.onChange as () => void, active: Boolean(props?.checked) },
    () => String(props?.text ?? ''),
  );
columns[0]!.filterDropdownProps = { showTick: true };
</script>

<template>
  <Table
    :columns="columns"
    :data-source="data"
    :row-selection="rowSelection"
    :scroll="{ y: 300 }"
  ></Table>
</template>
