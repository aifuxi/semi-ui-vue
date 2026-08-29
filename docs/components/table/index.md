# Table 表格

Table 用列描述渲染结构化数据，支持排序、筛选、选择、树形展开、分组、固定列、分页、列宽调整与虚拟滚动。本实现只以本地 Semi Design v2.102.0 为对齐基线。

## 基本使用

```vue
<script setup lang="ts">
import { Table, type TableColumnProps } from '@workspace/ui';
import '@workspace/theme-default/table.css';

const columns: TableColumnProps[] = [
  { title: '名称', dataIndex: 'name', key: 'name' },
  { title: '状态', dataIndex: 'status', key: 'status' },
];
const data = [
  { key: 'api', name: 'API 服务', status: '运行中' },
  { key: 'worker', name: '任务节点', status: '维护中' },
];
</script>

<template>
  <Table :columns="columns" :data-source="data" :pagination="false" bordered />
</template>
```

也可以使用无 DOM 的声明式列：

```vue
<Table :data-source="data" :pagination="false">
  <Table.Column title="名称" data-index="name" />
  <Table.Column title="状态" data-index="status" />
</Table>
```

## Vue 插槽与状态

- `#cell`、`#headerCell` 映射 React 的列 render 能力；列上的 `render/onCell/onHeaderCell` 仍可直接使用。
- `#title`、`#footer`、`#empty`、`#expandedRow`、`#groupSection` 分别映射同名内容或 render prop。
- `rowSelection.selectedRowKeys`、`expandedRowKeys`、列 `sortOrder/filteredValue` 和分页 `currentPage/pageSize` 都遵循受控输入；变化通过回调及类型化 emits 上报。
- `showHeader`、`hideExpandedColumn` 的默认值为 `true`，显式传入 `false` 不会被全局默认值覆盖。

## API 摘要

| 能力       | 主要 API                                                                              |
| ---------- | ------------------------------------------------------------------------------------- |
| 数据与列   | `dataSource`、`columns`、`Table.Column`、`rowKey`、`childrenRecordName`               |
| 排序与筛选 | `sorter`、`sortOrder`、嵌套 `filters`、即时/确认筛选、`onFilter`、`@change`           |
| 选择       | `rowSelection`、树级联 `checkRelation`、`@select-change/@select/@select-all`          |
| 展开与分组 | `expandedRowRender`、`expandedRowKeys`、`groupBy`、`renderGroupSection`               |
| 分页       | `pagination`、`renderPagination`、`#pagination`、`@page-change`                       |
| 布局       | `scroll`、`fixed`、`sticky`、`resizable`、`virtualized`、`rowSpanHover`、`components` |
| 内容       | `title`、`footer`、`empty` 及同名插槽                                                 |

公开实例提供 `getCurrentPageData()`；`getVirtualizedListRef` 提供 `scrollTo()` 和 `scrollToItem()`。完整默认值、事件顺序、DOM、SSR、视觉和发布结论见 `alignment.md`，React 迁移见 `react-to-vue.md`。
