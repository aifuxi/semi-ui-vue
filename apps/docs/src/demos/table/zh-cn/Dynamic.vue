<script setup lang="ts">
import { h, reactive, shallowRef, computed } from 'vue';
import { Table, type TableColumnProps } from '@aifuxi/semi-ui-vue/table';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/table.css';
import '@aifuxi/semi-theme-default/avatar.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Switch } from '@aifuxi/semi-ui-vue/switch';
import type { TablePaginationConfig, TableRowKey } from '@aifuxi/semi-ui-vue/table';
import '@aifuxi/semi-theme-default/switch.css';

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
const nameFilters = [
  { text: 'Semi Design 设计稿', value: 'Semi Design' },
  { text: 'Semi D2C 设计稿', value: 'Semi D2C' },
];
const filterName: NonNullable<TableColumnProps['onFilter']> = (value, record) =>
  String(record?.name).includes(String(value));
const queryColumns: TableColumnProps[] = baseColumns.map((column) =>
  column.dataIndex === 'name'
    ? { ...column, filters: nameFilters, onFilter: filterName }
    : column.dataIndex === 'size'
      ? { ...column, sorter: (a, b) => Number(a.size) - Number(b.size) }
      : column.dataIndex === 'updateTime'
        ? { ...column, sorter: (a, b) => String(a.updateTime).localeCompare(String(b.updateTime)) }
        : column,
);

const allData = makeData(46);
const state = reactive({
  fixedHeader: true,
  hideHeader: false,
  title: false,
  footer: false,
  fixedColumns: false,
  selection: false,
  loading: false,
  empty: false,
  sorting: false,
  filtering: false,
  expandable: false,
  allExpanded: false,
  bordered: false,
  resizable: false,
});
const controls: Array<{ key: keyof typeof state; label: string }> = [
  { key: 'fixedHeader', label: '固定表头' },
  { key: 'hideHeader', label: '隐藏表头' },
  { key: 'title', label: '显示标题' },
  { key: 'footer', label: '显示底部' },
  { key: 'fixedColumns', label: '固定列' },
  { key: 'selection', label: '显示选择列' },
  { key: 'loading', label: '加载状态' },
  { key: 'empty', label: '无数据' },
  { key: 'sorting', label: '排序' },
  { key: 'filtering', label: '过滤' },
  { key: 'expandable', label: '行展开' },
  { key: 'allExpanded', label: '展开全部行' },
  { key: 'bordered', label: '边框' },
  { key: 'resizable', label: '列伸缩' },
];
const currentPage = shallowRef(1);
const position = shallowRef<false | 'top' | 'bottom' | 'both'>('bottom');
const positions = ['bottom', 'top', 'both', false] as const;
const selected = shallowRef<TableRowKey[]>([]);
const expanded = shallowRef<TableRowKey[]>([]);
const data = computed(() => (state.empty ? [] : allData));
const columns = computed<TableColumnProps[]>(() =>
  queryColumns.map((column, index) => {
    const result = { ...column, fixed: state.fixedColumns && index === 0 };
    if (!state.sorting) delete result.sorter;
    if (!state.filtering) delete result.filters;
    return result;
  }),
);
const pagination = computed<false | TablePaginationConfig>(() =>
  position.value === false
    ? false
    : {
        currentPage: currentPage.value,
        pageSize: 5,
        total: data.value.length,
        position: position.value,
      },
);
const pageData = computed(() =>
  position.value === false
    ? data.value
    : data.value.slice((currentPage.value - 1) * 5, currentPage.value * 5),
);
const scroll = computed(() => ({
  ...(state.fixedColumns ? { x: 1200 } : {}),
  ...(state.fixedHeader ? { y: 300 } : {}),
}));
const rowSelection = computed(() =>
  state.selection
    ? {
        selectedRowKeys: selected.value,
        onChange: (keys?: TableRowKey[]) => {
          selected.value = keys ?? [];
        },
        fixed: state.fixedColumns,
      }
    : false,
);
const expandedKeys = computed(() =>
  state.allExpanded ? data.value.map((row) => String(row.key)) : expanded.value,
);
const expandedProps = computed(() =>
  state.expandable
    ? { expandedRowRender: (record?: Row) => h('article', String(record?.name)) }
    : {},
);
</script>

<template>
  <div>
    <div class="table-demo-controls">
      <label v-for="control in controls" :key="control.key"
        >{{ control.label }} <Switch v-model="state[control.key]" size="small" /></label
      ><Button v-for="value in positions" :key="String(value)" @click="position = value">{{
        value || 'None'
      }}</Button>
    </div>
    <Table
      :columns="columns"
      :data-source="pageData"
      :pagination="pagination"
      :row-selection="rowSelection"
      :loading="state.loading"
      :show-header="!state.hideHeader"
      :bordered="state.bordered"
      :resizable="state.resizable"
      :scroll="scroll"
      :title="state.title ? '文件列表' : undefined"
      :footer="state.footer ? '表格尾部' : undefined"
      v-bind="expandedProps"
      :expanded-row-keys="expandedKeys"
      @page-change="(page: number) => (currentPage = page)"
      @expanded-rows-change="
        (rows?: Row[]) => (expanded = (rows ?? []).map((row) => String(row.key)))
      "
    ></Table>
  </div>
</template>

<style scoped>
.table-demo-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}
.table-demo-controls label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
</style>
