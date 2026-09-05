---
title: 'Table'
description: 'Tables are used to present structured data content, usually accompanied by the ability to manipulate the data (sort, search, paginate...).'
locale: 'en-US'
slug: 'table'
category: 'show'
order: 81
englishTitle: 'Table'
icon: 'doc-table'
upstream: 'show/table'
---

## Demos

### How to import

```typescript
import {
  Table,
  type TableColumnProps,
  type TableRowKey,
  type TableRowSelection,
} from '@aifuxi/semi-ui-vue/table';
import '@aifuxi/semi-theme-default/table.css';
```

## Data, selection, and scrolling

::demo-block{demo="table/Showcase" title="Table"}
::

The DOM-free declarative form is also available: `<Table.Column title="Name" data-index="name" />`. `rowSelection.selectedRowKeys`, `expandedRowKeys`, column `sortOrder` / `filteredValue`, and pagination `currentPage` / `pageSize` are controlled inputs. Callbacks and typed emits report changes.

## Vue slots

- `#cell` and `#headerCell` map column rendering; column `render`, `onCell`, and `onHeaderCell` functions remain available.
- `#title`, `#footer`, `#empty`, `#expandedRow`, `#groupSection`, and `#pagination` receive scoped props.
- `showHeader` and `hideExpandedColumn` default to `true`; an explicit `false` is preserved.

## React to Vue

React `columns[].render` can remain a VNode-returning function or move to `#cell`. Prefer matching named slots for ReactNode content props. The component ref exposes only `getCurrentPageData()` and does not reveal Foundation private state.

## API

::api-table{slug="table"}
::
