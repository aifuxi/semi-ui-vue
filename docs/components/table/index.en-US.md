# Table

Table renders structured data from column definitions and supports sorting, filtering, selection, tree expansion, grouping, fixed columns, pagination, resizing, and virtualization. The local Semi Design v2.102.0 source is the only parity baseline.

## Basic usage

```vue
<script setup lang="ts">
import { Table, type TableColumnProps } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/table.css';

const columns: TableColumnProps[] = [
  { title: 'Service', dataIndex: 'name', key: 'name' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
];
const data = [
  { key: 'api', name: 'API service', status: 'Healthy' },
  { key: 'worker', name: 'Worker', status: 'Maintenance' },
];
</script>

<template>
  <Table :columns="columns" :data-source="data" :pagination="false" bordered />
</template>
```

`Table.Column` is also available as a declaration-only component and produces no DOM of its own.

## Vue slots and controlled state

- `#cell` and `#headerCell` map column render content to templates. Column `render`, `onCell`, and `onHeaderCell` functions remain available.
- `#title`, `#footer`, `#empty`, `#expandedRow`, and `#groupSection` map the matching React content or render props.
- `rowSelection.selectedRowKeys`, `expandedRowKeys`, column `sortOrder/filteredValue`, and pagination `currentPage/pageSize` remain controlled inputs; callbacks and typed emits report changes.
- `showHeader` and `hideExpandedColumn` default to `true`; an explicit `false` is preserved.

## API summary

| Capability       | Main API                                                                              |
| ---------------- | ------------------------------------------------------------------------------------- |
| Data and columns | `dataSource`, `columns`, `Table.Column`, `rowKey`, `childrenRecordName`               |
| Sort and filter  | `sorter`, nested `filters`, immediate/confirm filtering, `onFilter`, `change`         |
| Selection        | `rowSelection`, tree `checkRelation`, `selectChange`, `select`, `selectAll`           |
| Expand and group | `expandedRowRender`, `expandedRowKeys`, `groupBy`, `renderGroupSection`               |
| Pagination       | `pagination`, `renderPagination`, `#pagination`, `pageChange`                         |
| Layout           | `scroll`, `fixed`, `sticky`, `resizable`, `virtualized`, `rowSpanHover`, `components` |

The public instance exposes `getCurrentPageData()`. `getVirtualizedListRef` exposes `scrollTo()` and `scrollToItem()`. See `alignment.md` for the full contract and `react-to-vue.md` for migration mappings.
