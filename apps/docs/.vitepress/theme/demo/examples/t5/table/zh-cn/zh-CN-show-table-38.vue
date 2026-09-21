<script setup lang="ts">
import { computed, h, onBeforeUnmount, onMounted, reactive, shallowRef } from 'vue';
import {
  Table,
  type TableChangeInfo,
  type TableColumnProps,
  type TablePaginationConfig,
  type TableRowKey,
  type TableRowSelection,
  type TableScroll,
} from '@aifuxi/semi-ui-vue/table';
import { Button, ButtonGroup } from '@aifuxi/semi-ui-vue/button';
import { Switch } from '@aifuxi/semi-ui-vue/switch';

import { fileColumns, generatedRows, type FileRow } from './third-batch-virtual-fixture';
import '@aifuxi/semi-theme-default/button.css';
import '@aifuxi/semi-theme-default/switch.css';

type Row = Record<string, unknown>;
type ChangeInfo = TableChangeInfo<Row>;
type Sorter = NonNullable<ChangeInfo['sorter']>;
type Filters = NonNullable<ChangeInfo['filters']>;
const allData = generatedRows(46);
const columns = shallowRef<TableColumnProps[]>(fileColumns(true));
const dataSource = shallowRef<FileRow[]>([]);
const scroll = shallowRef<TableScroll>({});
const rowSelection = shallowRef<false | TableRowSelection<Row>>(false);
const expandedRowKeys = shallowRef<TableRowKey[]>([]);
const state = reactive({
  loading: false,
  showHeader: true,
  showTitle: false,
  showFooter: false,
  expandable: false,
  expandCellFixed: false,
  bordered: false,
  resizable: false,
});
function defaultPagination(): TablePaginationConfig {
  return {
    currentPage: 1,
    pageSize: 8,
    total: allData.length,
    onChange: (page) => setPage(page),
  };
}
const pagination = shallowRef<false | TablePaginationConfig>(defaultPagination());
const timers = new Set<ReturnType<typeof setTimeout>>();

function mergeColumns(update: TableColumnProps) {
  columns.value = columns.value.map((column) =>
    column.dataIndex === update.dataIndex ? { ...column, ...update } : column,
  );
}
function setPage(currentPage?: number, requestedSorter?: Sorter, requestedFilters?: Filters) {
  if (state.loading) return;
  const page =
    typeof currentPage === 'number'
      ? currentPage
      : (pagination.value && pagination.value.currentPage) || 1;
  const sorter = requestedSorter ?? columns.value.find((column) => Boolean(column.sorter)) ?? {};
  const filters =
    requestedFilters ??
    columns.value.filter(
      (column) => Array.isArray(column.filteredValue) && column.filteredValue.length,
    );
  const nextPagination: TablePaginationConfig = { ...pagination.value, currentPage: page };
  state.loading = true;
  const timer = setTimeout(() => {
    timers.delete(timer);
    try {
      let data = [...allData];
      let compare = sorter.sorter;
      const dataIndex = sorter.dataIndex;
      if (compare && sorter.sortOrder && typeof compare !== 'function' && dataIndex) {
        compare = (a, b) =>
          (a[dataIndex] as string | number) > (b[dataIndex] as string | number) ? 1 : -1;
      }
      if (typeof compare === 'function') {
        data.sort(compare);
        if (sorter.sortOrder === 'descend') data.reverse();
      }
      for (const filter of filters) {
        const { filteredValue, dataIndex: filterIndex } = filter;
        if (Array.isArray(filteredValue) && filteredValue.length && filterIndex) {
          data = data.filter((row) =>
            filteredValue.some((value) => String(row[filterIndex]).includes(String(value))),
          );
        }
      }
      const pageSize = Number(nextPagination.pageSize);
      dataSource.value = data.slice((page - 1) * pageSize, page * pageSize);
      nextPagination.total = data.length;
      pagination.value = nextPagination;
      mergeColumns(sorter);
      for (const filter of filters) mergeColumns(filter);
      state.loading = false;
    } catch (error) {
      console.error(error);
      state.loading = false;
    }
  }, 1500);
  timers.add(timer);
}

function toggleFixHeader(checked: boolean) {
  const next = { ...scroll.value };
  if (checked) next.y = 300;
  else delete next.y;
  scroll.value = next;
}
function toggleFixColumns(checked: boolean) {
  columns.value = columns.value.map((column, index, all) => ({
    ...column,
    fixed: checked ? (index === 0 ? true : index === all.length - 1 ? 'right' : false) : false,
  }));
  const next = { ...scroll.value };
  if (checked) next.x = '150%';
  else delete next.x;
  scroll.value = next;
  state.expandCellFixed = checked;
  if (rowSelection.value) rowSelection.value = { ...rowSelection.value, fixed: checked };
}
function toggleRowSelection(checked: boolean) {
  rowSelection.value = checked
    ? {
        width: 48,
        fixed: true,
        onChange: (selectedRowKeys, selectedRows) =>
          console.log(
            'Selection changed, selectedRowKeys: ',
            selectedRowKeys,
            'selectedRows: ',
            selectedRows,
          ),
      }
    : false;
}
function toggleShowSorter(checked: boolean) {
  // The fixed snippet enables the absent "age" column and clears every sorter
  // when disabled. Retain that observable behavior when toggling it again.
  columns.value = columns.value.map((column) => {
    if (checked) return column.dataIndex === 'age' ? { ...column, sorter: true } : column;
    const next = { ...column };
    delete next.sorter;
    return next;
  });
}
function toggleShowFilter(checked: boolean) {
  columns.value = columns.value.map((column) => {
    if (checked) {
      return column.dataIndex === 'name'
        ? {
            ...column,
            filters: ['1', '2', '3'].map((value) => ({
              text: `姓名中包含 ${value}`,
              value,
            })),
            filteredValue: [],
          }
        : column;
    }
    const next = { ...column };
    delete next.filters;
    next.filteredValue = [];
    return next;
  });
  if (!checked) setPage(undefined, undefined, []);
}
function toggleExpandedRowKeys(checked: boolean) {
  expandedRowKeys.value = checked
    ? dataSource.value.filter((row) => row.key).map((row) => row.key)
    : [];
  if (checked) state.expandable = true;
}
function toggleResizable(checked: boolean) {
  state.resizable = checked;
  state.bordered = checked;
}
function toggleDataSource(checked: boolean) {
  if (checked) dataSource.value = [];
  else setPage();
}
function switchPagination(position: false | 'bottom' | 'top' | 'both') {
  pagination.value =
    position === false ? false : { ...defaultPagination(), ...pagination.value, position };
}
function onChange(change: ChangeInfo) {
  console.log('Table changed: ', change);
  setPage(change.pagination?.currentPage, change.sorter, change.filters);
}
function onExpandedRowsChange(rows?: Row[]) {
  console.log('Expanded rows changed to: ', rows);
  expandedRowKeys.value = (rows ?? []).map((row) => row.key as TableRowKey);
}
const expandedRowRender = computed(() =>
  state.expandable
    ? (record?: Row) => ({
        children: h('p', String(record?.description ?? '')),
        fixed: 'left' as const,
      })
    : undefined,
);
const footer = computed(() =>
  state.showFooter ? () => h('p', { style: { margin: 0 } }, 'This is footer.') : undefined,
);
const optionalTableProps = computed(() => ({
  ...(state.showTitle ? { title: 'This is title.' } : {}),
  ...(footer.value ? { footer: footer.value } : {}),
  ...(expandedRowRender.value ? { expandedRowRender: expandedRowRender.value } : {}),
}));
onMounted(() => setPage(1));
onBeforeUnmount(() => timers.forEach(clearTimeout));
</script>

<template>
  <div>
    <div
      :style="{
        marginBottom: '15px',
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
      }"
    >
      <span :style="{ display: 'inline-flex', alignItems: 'center', margin: '5px' }">
        <span>固定表头：</span>
        <Switch
          size="small"
          :checked="scroll.y == null ? undefined : Boolean(scroll.y)"
          @change="toggleFixHeader"
        />
      </span>
      <span :style="{ display: 'inline-flex', alignItems: 'center', margin: '5px' }">
        <span>隐藏表头：</span>
        <Switch size="small" @change="(checked: boolean) => (state.showHeader = !checked)" />
      </span>
      <span :style="{ display: 'inline-flex', alignItems: 'center', margin: '5px' }">
        <span>显示标题：</span>
        <Switch size="small" @change="(checked: boolean) => (state.showTitle = checked)" />
      </span>
      <span :style="{ display: 'inline-flex', alignItems: 'center', margin: '5px' }">
        <span>显示底部：</span>
        <Switch size="small" @change="(checked: boolean) => (state.showFooter = checked)" />
      </span>
      <span :style="{ display: 'inline-flex', alignItems: 'center', margin: '5px' }">
        <span>固定列：</span>
        <Switch size="small" @change="toggleFixColumns" />
      </span>
      <span :style="{ display: 'inline-flex', alignItems: 'center', margin: '5px' }">
        <span>显示选择列：</span>
        <Switch size="small" @change="toggleRowSelection" />
      </span>
      <span :style="{ display: 'inline-flex', alignItems: 'center', margin: '5px' }">
        <span>显示加载状态：</span>
        <Switch
          size="small"
          :checked="state.loading"
          @change="(checked: boolean) => (state.loading = checked)"
        />
      </span>
      <span :style="{ display: 'inline-flex', alignItems: 'center', margin: '5px' }">
        <span>无数据：</span>
        <Switch size="small" :checked="!dataSource.length" @change="toggleDataSource" />
      </span>
      <span :style="{ display: 'inline-flex', alignItems: 'center', margin: '5px' }">
        <span>开启排序功能：</span>
        <Switch size="small" @change="toggleShowSorter" />
      </span>
      <span :style="{ display: 'inline-flex', alignItems: 'center', margin: '5px' }">
        <span>开启过滤功能：</span>
        <Switch size="small" @change="toggleShowFilter" />
      </span>
      <span :style="{ display: 'inline-flex', alignItems: 'center', margin: '5px' }">
        <span>开启行展开功能：</span>
        <Switch
          size="small"
          :checked="state.expandable"
          @change="(checked: boolean) => (state.expandable = checked)"
        />
      </span>
      <span :style="{ display: 'inline-flex', alignItems: 'center', margin: '5px' }">
        <span>展开当前所有行：</span>
        <Switch size="small" @change="toggleExpandedRowKeys" />
      </span>
      <span :style="{ display: 'inline-flex', alignItems: 'center', margin: '5px' }">
        <span>显示边框：</span>
        <Switch
          size="small"
          :checked="state.bordered"
          @change="(checked: boolean) => (state.bordered = checked)"
        />
      </span>
      <span :style="{ display: 'inline-flex', alignItems: 'center', margin: '5px' }">
        <span>开启列伸缩功能：</span>
        <Switch size="small" @change="toggleResizable" />
      </span>
      <span :style="{ display: 'inline-flex', alignItems: 'center', margin: '5px' }">
        <span>分页控件：</span>
        <ButtonGroup>
          <Button @click="switchPagination('bottom')">Bottom</Button>
          <Button @click="switchPagination('top')">Top</Button>
          <Button @click="switchPagination('both')">Both</Button>
          <Button @click="switchPagination(false)">None</Button>
        </ButtonGroup>
      </span>
    </div>
    <Table
      v-bind="optionalTableProps"
      :default-expanded-row-keys="[]"
      :show-header="state.showHeader"
      :bordered="state.bordered"
      :expand-cell-fixed="state.expandCellFixed"
      :expanded-row-keys="expandedRowKeys"
      :row-selection="rowSelection"
      :scroll="scroll"
      :columns="columns"
      :data-source="dataSource"
      :pagination="pagination"
      :loading="state.loading"
      :resizable="state.resizable"
      @change="onChange"
      @expanded-rows-change="onExpandedRowsChange"
    />
  </div>
</template>
