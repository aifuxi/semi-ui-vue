---
title: '表格'
description: '表格用于呈现结构化的数据内容，通常会伴随提供对数据进行操作（排序、搜索、分页……）的能力。'
locale: 'zh-CN'
slug: 'table'
category: 'show'
order: 81
englishTitle: 'Table'
icon: 'doc-table'
upstream: 'show/table'
---

## 代码演示

### 如何引入

```typescript
import {
  Table,
  type TableColumnProps,
  type TableRowKey,
  type TableRowSelection,
} from '@aifuxi/semi-ui-vue/table';
import '@aifuxi/semi-theme-default/table.css';
```

## 数据、选择与滚动

::demo-block{demo="table/Showcase" title="Table"}
::

也可以使用无 DOM 的声明式列：`<Table.Column title="名称" data-index="name" />`。`rowSelection.selectedRowKeys`、`expandedRowKeys`、列 `sortOrder` / `filteredValue` 与分页 `currentPage` / `pageSize` 都是受控输入，变化通过回调和类型化 emits 上报。

## Vue 插槽

- `#cell`、`#headerCell` 映射列渲染；列上的 `render`、`onCell`、`onHeaderCell` 仍可直接使用。
- `#title`、`#footer`、`#empty`、`#expandedRow`、`#groupSection` 与 `#pagination` 接收对应的 scoped props。
- `showHeader` 与 `hideExpandedColumn` 默认值为 `true`，显式 `false` 不会被全局默认值覆盖。

## React → Vue

React 的 `columns[].render` 可保留为返回 VNode 的函数，也可迁移为 `#cell`；ReactNode 内容 prop 优先迁移为同名 slot。实例 ref 只公开 `getCurrentPageData()`，不暴露 Foundation 私有状态。

## API

::api-table{slug="table"}
::
