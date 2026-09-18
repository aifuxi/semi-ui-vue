# Table

Table aligns with Semi Design v2.102.0 and keeps the `.semi-table*` DOM/classes, selection, sorting/filtering, pagination, expansion, tree/grouping, fixed columns, virtualization, scrolling and ARIA contracts. The public entry is the `@aifuxi/semi-ui-vue` root export and the `@aifuxi/semi-ui-vue/table` subpath; the default and named `Table` exports are the same object and carry `Table.Column` plus `DEFAULT_KEY_COLUMN_SELECTION`/`DEFAULT_KEY_COLUMN_EXPAND`.

## Basic usage

```vue
<script setup lang="ts">
import { Table } from '@aifuxi/semi-ui-vue';

const columns = [
  { title: 'Name', dataIndex: 'name' },
  { title: 'Score', dataIndex: 'score', sorter: (a, b) => a.score - b.score },
];
const dataSource = [
  { key: 'a', name: 'Alpha', score: 90 },
  { key: 'b', name: 'Beta', score: 75 },
];
</script>

<template>
  <Table :columns="columns" :data-source="dataSource" :pagination="false" />
</template>
```

`rowKey` defaults to the record `key` field and also accepts a field name or `(record) => key`. `empty` supplies the empty state and `loading` overlays the loading state.

## Selection

`rowSelection` accepts `true` or a config object:

| Field                                                                          | Description                                         |
| ------------------------------------------------------------------------------ | --------------------------------------------------- |
| `type`                                                                         | `'checkbox'` (default) or `'radio'`                 |
| `selectedRowKeys` / `defaultSelectedRowKeys`                                   | Controlled / uncontrolled keys                      |
| `onChange` / `onSelect` / `onSelectAll`                                        | Backed by `select`/`selectAll`/`selectChange`       |
| `getCheckboxProps`                                                             | Returns Checkbox props (e.g. `disabled`)            |
| `fixed` / `width` / `hidden` / `clickRow` / `disabled`                         | Fixed, width, hidden, row-click selection, disabled |
| `checkRelation`                                                                | Tree selection `'related'` / `'unRelated'`          |
| `renderCell`                                                                   | Fully custom selection cell                         |
| `title` / `className` / `key` / `onCell` / `onHeaderCell` / `shouldCellUpdate` | Same cell/header attributes as a normal column      |

## Sorting, filtering and pagination

- Column `sorter`, `sortOrder`/`defaultSortOrder` enable sorting; `showSortTip` and `sortIcon` control the tooltip and icon.
- `filters`, `filteredValue`/`defaultFilteredValue`, `filterMultiple` and `onFilter` enable filtering, while `filterDropdown`/`filterDropdownProps`/`filterDropdownVisible`/`renderFilterDropdown`/`renderFilterDropdownItem` customize the UI and `filterConfirmMode` switches between immediate and confirmed modes.
- Sort/filter/pagination changes emit a single `change(changeInfo)` carrying `pagination`, `filters`, `sorter` and `extra.changeType`; pagination also emits `pageChange(currentPage, pageSize)`.
- `pagination` accepts `false` or a Pagination config (including `position: 'bottom'|'top'|'both'` and `formatPageText`); `renderPagination` or the `#pagination` slot replaces the pagination area.

## Expansion, tree and grouping

- `expandedRowRender(record, index, expanded)` returns a `VNodeChild` or an object; the object form applies every ColumnProp except `children` (`className`/`onCell`/`render`/`colSpan`, …) to the expanded cell while `fixed` stays metadata, and `null` marks the row as not expandable.
- `expandedRowKeys` is controlled, `defaultExpandedRowKeys` seeds it, and `defaultExpandAllRows`/`expandAllRows` expand everything; `expandRowByClick`, `expandIcon`, `expandCellFixed` and `hideExpandedColumn` tune the trigger and column.
- Tree data uses `childrenRecordName` for child fields; `groupBy` plus `renderGroupSection` (or the `#groupSection` slot) render group sections, with `defaultExpandAllGroupRows`/`expandAllGroupRows` and `clickGroupedRowToExpand` controlling expansion.

## Fixed columns, scrolling, size and virtualization

- `scroll.x`/`scroll.y` enable horizontal/vertical scrolling (including a fixed header) and `scrollToFirstRowOnChange` returns to the top after pagination; column `fixed`/`ellipsis` plus `rowSpanHover` keep the pinned fixed/ellipsis behavior.
- `sticky` sticks the header, and `resizable` accepts `true` or `{ handlerClassName, onResize, onResizeStart, onResizeStop }`.
- `size` accepts `'small' | 'default' | 'middle'`; `bordered`, `showHeader`, `headerStyle` and `indentSize` control appearance.
- `virtualized` accepts `true` or `{ estimatedItemSize, overscanCount, itemSize, onScroll }`; `getVirtualizedListRef` exposes `{ scrollTo, scrollToItem, resetAfterIndex }`.

## Custom rendering

- A column `render(text, record, index, options)` renders its cell; with `useFullRender` the options also include `selection` and `indentText`.
- `#cell="{ column, record, rowIndex, text }"` and `#headerCell="{ column }"` provide table-level fallbacks, with column render taking precedence.
- `title`/`footer` accept `VNodeChild` or `(pageData) => VNodeChild` and have matching slots; `components` replaces table/header/body/footer row and cell hosts.
- `onRow`, `onHeaderRow` and `onGroupedRow` return row attributes (`class`/`style`/events) merged exactly like the pinned adapter.

## API

### Table Props

| Prop                                               | Type                                                | Default            |
| -------------------------------------------------- | --------------------------------------------------- | ------------------ |
| `columns` / `dataSource`                           | `TableColumn[]` / `RecordType[]`                    | -                  |
| `rowKey`                                           | `string \| number \| (record) => TableRowKey`       | `'key'`            |
| `bordered` / `showHeader`                          | `boolean`                                           | `false` / `true`   |
| `size`                                             | `'small' \| 'default' \| 'middle'`                  | `'default'`        |
| `loading` / `keepDOM`                              | `boolean`                                           | `false`            |
| `empty` / `title` / `footer`                       | `VNodeChild` or render function                     | -                  |
| `pagination`                                       | `boolean \| TablePaginationConfig`                  | `true`             |
| `scroll`                                           | `{ x?, y?, scrollToFirstRowOnChange? }`             | -                  |
| `sticky`                                           | `boolean \| { top?: number }`                       | -                  |
| `resizable`                                        | `boolean \| TableResizable`                         | -                  |
| `virtualized`                                      | `boolean \| TableVirtualizedProps`                  | -                  |
| `getVirtualizedListRef`                            | `(ref) => void`                                     | -                  |
| `rowSelection`                                     | `boolean \| TableRowSelection`                      | -                  |
| `rowExpandable`                                    | `(record) => boolean`                               | -                  |
| `expandedRowKeys` / `defaultExpandedRowKeys`       | `TableRowKey[]`                                     | -                  |
| `expandedRowRender`                                | `(record, index, expanded) => VNodeChild \| object` | -                  |
| `defaultExpandAllRows` / `expandAllRows`           | `boolean`                                           | `false`            |
| `expandRowByClick`                                 | `boolean`                                           | `false`            |
| `expandIcon` / `expandCellFixed`                   | `boolean \| VNodeChild \| render` / `TableFixed`    | -                  |
| `hideExpandedColumn`                               | `boolean`                                           | `false`            |
| `groupBy`                                          | `string \| (record) => string \| number`            | -                  |
| `renderGroupSection`                               | `(groupKey, group) => VNodeChild \| object`         | -                  |
| `defaultExpandAllGroupRows` / `expandAllGroupRows` | `boolean`                                           | `false`            |
| `clickGroupedRowToExpand`                          | `boolean`                                           | `false`            |
| `childrenRecordName`                               | `string`                                            | `'children'`       |
| `indentSize`                                       | `number`                                            | `20`               |
| `rowSpanHover`                                     | `boolean`                                           | `true`             |
| `headerStyle`                                      | `StyleValue`                                        | -                  |
| `renderPagination`                                 | `(paginationProps) => VNodeChild`                   | -                  |
| `components`                                       | `TableComponents`                                   | -                  |
| `onRow` / `onHeaderRow` / `onGroupedRow`           | functions returning row attributes                  | -                  |
| `onChange` / `onExpand` / `onExpandedRowsChange`   | callbacks                                           | -                  |
| `direction`                                        | `'ltr' \| 'rtl'`                                    | ConfigProvider     |
| `prefixCls` / `id`                                 | `string`                                            | `'semi-table'` / - |
| `class` / `className` / `style`                    | Vue native class/style and compatible props         | -                  |

### Table.Column

| Prop                                                                                                                                                                                            | Type                                                          | Notes                                  |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | -------------------------------------- |
| `title` / `dataIndex` / `key`                                                                                                                                                                   | `VNodeChild \| function` / `string` / `TableRowKey`           | Header, value path and stable key      |
| `align` / `fixed` / `width`                                                                                                                                                                     | `'left'\|'right'\|'center'` / `TableFixed` / `string\|number` | Alignment, fixing and width            |
| `ellipsis`                                                                                                                                                                                      | `boolean \| { showTitle?: boolean }`                          | Ellipsis and title tooltip             |
| `render` / `useFullRender`                                                                                                                                                                      | render function / `boolean`                                   | Cell rendering and full render options |
| `sorter` / `sortOrder` / `defaultSortOrder` / `sortIcon` / `showSortTip`                                                                                                                        | sorting config                                                | Sort state and icon                    |
| `filters` / `filteredValue` / `defaultFilteredValue` / `filterMultiple` / `onFilter` / `filterChildrenRecord`                                                                                   | filtering config                                              | Filter data and matching               |
| `filterDropdown` / `filterDropdownProps` / `filterDropdownVisible` / `filterConfirmMode` / `filterIcon` / `renderFilterDropdown` / `renderFilterDropdownItem` / `onFilterDropdownVisibleChange` | filter UI                                                     | Custom filter entry and icon           |
| `onCell` / `onHeaderCell` / `shouldCellUpdate`                                                                                                                                                  | cell attributes and update control                            | Merged like the pinned adapter         |
| `colSpan` / `children` / `resize` / `sortChildrenRecord`                                                                                                                                        | span, nested headers, resize, child sorting                   | Grouped headers and tree sorting       |

### Slots

`default` (the default slot, also written `#default`), `cell`, `empty`, `expandedRow`, `footer`, `groupSection`, `headerCell`, `pagination`, `title`.

### Events

`change(changeInfo)`, `expand(expanded, record, event?)`, `expandedRowsChange(expandedRows)`, `pageChange(currentPage, pageSize)`, `select(record, selected, selectedRows, event?)`, `selectAll(selected, selectedRows, changedRows)`, `selectChange(selectedRowKeys, selectedRows)`.

### Exposed

Through the component ref: `getCurrentPageData()`.

## Accessibility, keyboard and ARIA

- Plain tables use `grid` semantics with per-cell `aria-colindex` and row `aria-rowindex`; tables with expansion/grouping/child data use `treegrid`, and expandable parents expose `aria-level` plus `aria-expanded`.
- The selection column uses real Checkbox/Radio controls and expresses the header tri-state with `aria-checked="mixed"`; sort/filter controls are focusable buttons.
- Keyboard and focus behavior follows the native controls and the Pagination/Checkbox contracts; the component adds no custom keyboard state machine.

## Theme, RTL, SSR and release

- Classes and tokens follow the pinned `.semi-table*` surface; the per-component style entry is `@aifuxi/semi-theme-default/table.css`, also part of the root theme.
- RTL is driven by ConfigProvider `.semi-rtl` for fixed-column offsets, sort icons and pagination direction.
- Import and SSR render never touch the DOM; ResizeObserver, scroll measurement and the virtual list are created on the client and cleaned up on unmount.
- `pnpm check:artifacts` covers the build, theme entries, SSR dist enumeration and the real tarball's default/named exports, `Table.Column`, `DEFAULT_KEY_COLUMN_*`, types, `table.css`, tree-shaking, licenses and SBOM.

## React → Vue

See the [React → Vue mapping](./react-to-vue.md). Full public behavior, column query semantics and visual evidence live in the [alignment matrix](./alignment.md).
