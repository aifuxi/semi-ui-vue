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

## How to use

Import Table from its public component entry. Provide stable row keys and keep data and configuration references stable; replace arrays when updating shallow state. Examples follow the 37 live demonstrations in the pinned v2.102.0 Chinese source, with the two missing English sections translated. Each example is a standalone Vue SFC.

```typescript
import { Table, type TableColumnProps, type TableRowSelection } from '@aifuxi/semi-ui-vue/table';
import '@aifuxi/semi-theme-default/table.css';
```

## Examples

Examples 1–28 and 30 use byte-identical local copies of the pinned Figma/Docs icons under `/demos/table/`, preserving their 64×64 intrinsic size. Drag sorting and examples 31–37 retain the existing local illustration and are outside this acceptance slice.

### Basic table

`dataSource` contains records and `columns` defines their fields, headings and rendering. Give every record a unique `key`, or specify a primary key with `rowKey`; selection, expansion and updates depend on it. The example includes file icons, owner avatars and an action column.

::demo-block{demo="table/en-us/Basic" title="Basic table"}
::

### Declarative columns (JSX migration)

Declare columns with `Table.Column` template nodes; these nodes do not create DOM elements. Do not wrap columns in custom components. Choose either `columns` or declarative columns instead of relying on their combination. React JSX render callbacks become functions returning Vue VNodes.

::demo-block{demo="table/en-us/DeclarativeColumns" title="Declarative columns (JSX migration)"}
::

### Row selection

Enable selection with `rowSelection`. `getCheckboxProps` disables a record and select-all skips disabled items. `onSelect` and `onSelectAll` describe the operation; `onChange` returns selected keys and records. This example uses three rows per page and logs the selection callbacks.

::demo-block{demo="table/en-us/Selection" title="Row selection"}
::

### Custom rendering

Use `Column.render(text, record, index, options)` for complex cells, or use `#cell="{ text, record, rowIndex, column }"`. The fourth argument provides `expandIcon`, `selection`, `indentText` and `isHovering`. Delete every record to see the custom Empty illustration; Reset restores the data. Long titles use Typography tooltips.

::demo-block{demo="table/en-us/CustomRendering" title="Custom rendering"}
::

### Table with pagination

Without `pagination.currentPage`, Table manages the page and slices the full dataset locally. A controlled currentPage renders the supplied current-page data directly. This local example has 46 records, filtering, sorting, selection and a 300px scrolling body.

::demo-block{demo="table/en-us/Pagination" title="Table with pagination"}
::

### Load remote data

This example retains the pinned 300ms local asynchronous request, with five records per page and 46 total records. `loading` indicates progress, and the timer is cleared on unmount. It uses the current date plus fixed offsets and calls no business endpoint.

The pagination configuration uses `currentPage`, `pageSize`, `total` and Vue’s public `onChange` callback (the React snippet names it `onPageChange`). Supply only the returned page records with a controlled page; they are not sliced again.

::demo-block{demo="table/en-us/RemoteData" title="Load remote data"}
::

### Fixed columns and header

Set `fixed` and `width` on fixed columns and configure `scroll.x`; `scroll.y` limits the body height and fixes its header. The horizontal width must accommodate all columns. Check column widths, long text and image dimensions if cells are misaligned; leaving one column flexible can accommodate remaining space.

Use `sticky` or `:sticky="{ top: 0 }"` to keep the header at the top of the page scroll container. Column widths still follow `column.width` and browser layout.

::demo-block{demo="table/en-us/Fixed" title="Fixed columns and header"}
::

### Sorting and filtering

Set `filters` and `onFilter` to enable column filtering, and `sorter` to enable sorting. Query columns require distinct `dataIndex` values and records require unique keys. Write back `filteredValue` and `sortOrder` for controlled state, or initialize with `defaultFilteredValue` and `defaultSortOrder`.

::demo-block{demo="table/en-us/SortFilter" title="Sorting and filtering"}
::

### Undefined values and sort tips

The third argument of `sorter(a, b, sortOrder)` supplies the sort direction so unknown sizes remain last in either direction. This example preserves the six pinned records and two undefined sizes. `showSortTip` defaults to false and remains disabled in this English example.

::demo-block{demo="table/en-us/UndefinedSort" title="Undefined values and sort tips"}
::

### Custom header filtering

Place an Input in `Column.title` and control `filteredValue` to filter directly from the heading. Defer filtering during IME composition and apply the completed input on `compositionend`. Clearing the input produces an empty filter array.

::demo-block{demo="table/en-us/HeaderFilter" title="Custom header filtering"}
::

### Custom filter dropdown

`renderFilterDropdown` receives temporary filter state and `setTempFilteredValue`, `confirm`, `clear` and `close`. Input changes only the temporary value until confirmation. The title panel closes after confirming or clearing. The owner panel starts with a default filter and stays open after either operation. `close()` does not apply changes.

::demo-block{demo="table/en-us/CustomFilter" title="Custom filter dropdown"}
::

### Filter confirmation mode

With `filterConfirmMode: 'confirm'`, clicks update temporary state; Confirm applies filters and closes the panel, while Reset restores the values from when the panel opened and stays open. The default `immediate` mode applies every selection immediately.

::demo-block{demo="table/en-us/FilterConfirm" title="Filter confirmation mode"}
::

### Custom filter items

`renderFilterDropdownItem` exposes `text`, `value`, `checked`, `filteredValue`, `level` and `filterMultiple`. Forward its `onChange` to preserve filtering. This example uses Dropdown.Item and `showTick` to present the selection.

::demo-block{demo="table/en-us/FilterItem" title="Custom filter items"}
::

### Expandable rows

Render extra details with `#expandedRow="{ record, index, expanded }"` or `expandedRowRender`. Row identity defaults to `key`; `rowKey` also accepts a field name or function. Expansion and selection can be combined.

::demo-block{demo="table/en-us/Expanded" title="Expandable rows"}
::

### Separate expansion column

`hideExpandedColumn` defaults to true and places the control next to the first column content. Bind `:hide-expanded-column="false"` to create a separate expansion column.

::demo-block{demo="table/en-us/SeparateExpand" title="Separate expansion column"}
::

### Disable expansion for a record

Return false from `rowExpandable(record)` to hide the expansion control for that record. The third record, Design docs, cannot expand or be selected; the other records retain their details.

::demo-block{demo="table/en-us/RowExpandable" title="Disable expansion for a record"}
::

### Tree data

Records with `children` are displayed as a tree. Override that field with `childrenRecordName`; `indentSize` controls indentation and defaults to 20. Every record at every level requires a stable key.

::demo-block{demo="table/en-us/Tree" title="Tree data"}
::

### Reorder sibling tree rows

Replace the `dataSource` reference and reorder its sibling arrays. Move-up and move-down controls are disabled at array boundaries. Controlled `expandedRowKeys` preserves expansion identity when records move.

::demo-block{demo="table/en-us/TreeReorder" title="Reorder sibling tree rows"}
::

### Custom tree selection

Row selection is independent by default. This example controls `selectedRowKeys`, recursively selecting or deselecting a record and its descendants in `onSelect`, and collecting all selectable keys in `onSelectAll`. These explicit rules are distinct from automatic parent-child association.

::demo-block{demo="table/en-us/TreeSelection" title="Custom tree selection"}
::

### Tree selection association (checkRelation)

Set `rowSelection.checkRelation: 'related'` to associate parents and children. Selecting a parent selects descendants; child changes update the parent checked, mixed or unchecked state. Write the keys back in `onChange`.

::demo-block{demo="table/en-us/TreeRelation" title="Tree selection association (checkRelation)"}
::

### Row and cell events and attributes

`onRow` / `onHeaderRow` return attributes and events for real row nodes, while `column.onCell` / `column.onHeaderCell` target cells. Use Vue DOM event names such as `onClick`, `onDblclick` and `onMouseenter`. Click the third row to log its record; entering and leaving the heading row logs the corresponding events.

::demo-block{demo="table/en-us/RowEvents" title="Row and cell events and attributes"}
::

### Zebra stripes

Use `onRow` to return an inline background style for even row indexes, using a theme token. Use `onCell` when fixed columns need background styles on individual cells.

::demo-block{demo="table/en-us/Zebra" title="Zebra stripes"}
::

### Custom header styles

Return style or class from `Column.onHeaderCell` to customize headings. The example uses `--semi-color-fill-0`. Use `headerStyle` for a style shared by all heading cells. This section is translated from the Chinese baseline because the pinned English source omits it.

::demo-block{demo="table/en-us/HeaderStyle" title="Custom header styles"}
::

### Custom cell hover

Override the row hover background, then highlight only the cell under the pointer. Scoped styles use `:deep()` to reach the component DOM. This section is translated from the Chinese baseline because the pinned English source omits it.

::demo-block{demo="table/en-us/CellHover" title="Custom cell hover"}
::

### Column ellipsis

Set `ellipsis: true` to truncate overflowing cell text and retain a native HTML title. This example combines ellipsis with fixed columns, filters and sorting.

::demo-block{demo="table/en-us/Ellipsis" title="Column ellipsis"}
::

### Custom ellipsis tooltip

Disable the native title with `ellipsis: { showTitle: false }`, then render Typography.Text with `ellipsis: { showTooltip: true }` for a custom tooltip.

::demo-block{demo="table/en-us/EllipsisTooltip" title="Custom ellipsis tooltip"}
::

### Resizable columns

Enable `resizable` and give resizable columns a `width`. Columns without a width remain flexible; `column.resize: false` disables resizing for one column. Leave one flexible column when combining resizing with fixed columns, and avoid constraining total width with a fixed `scroll.x`.

::demo-block{demo="table/en-us/Resizable" title="Resizable columns"}
::

### Custom resize feedback

A `resizable` object supports `onResizeStart`, `onResize` and `onResizeStop`. Return column configuration to customize drag feedback. This example adds a class at the start and removes it at the end, styling the vertical guide and resize handle. Callbacks may return partial column properties or nothing; `handlerClassName` adds a class to the handle.

::demo-block{demo="table/en-us/ResizableStyle" title="Custom resize feedback"}
::

### Drag sorting

Upstream integrates React-specific dnd-kit through `components.body.row`. This example adds no framework dependency and uses public `onRow` DOM events for native drag/drop, preserving ten rows per page and page-local reordering, with Alt + ↑/↓ keyboard movement. Its animation, sensors and auto-scrolling are not equivalent to dnd-kit and have not been accepted as visual parity.

::demo-block{demo="table/en-us/DragSort" title="Drag sorting"}
::

### Grouped rows

Set `groupBy` to a field name or a function returning a string or number. Render headings with `#groupSection="{ groupKey, group }"` or `renderGroupSection`; `clickGroupedRowToExpand` allows the whole heading row to toggle expansion. The second argument of `renderGroupSection(groupKey, group)` contains row keys from the current page; the Vue `groupSection` slot provides member records in `group`. Records are arranged in global group order before pagination.

::demo-block{demo="table/en-us/Grouping" title="Grouped rows"}
::

### Virtualized table

Use `virtualized` for large datasets with a numeric `scroll.y` and an explicit width. Virtual rows in the default size have a height of 53; `virtualized.itemSize` also accepts `(index, { sectionRow, expandedRow }) => number`. This example has 1,000 records and uses `getVirtualizedListRef` for the public `scrollTo` / `scrollToItem` methods. React react-window private instance methods are outside the Vue contract.

::demo-block{demo="table/en-us/Virtualized" title="Virtualized table"}
::

### Infinite scrolling

`virtualized.onScroll` provides direction, offset and whether scrolling was requested programmatically. Append 20 records only when natural forward scrolling approaches the end. Every new record retains a unique key.

::demo-block{demo="table/en-us/InfiniteScroll" title="Infinite scrolling"}
::

### Controlled dynamic table

Toggle fixed or hidden headers, title, footer, fixed columns, selection, loading, empty data, sorting, filtering, expansion, expand-all, borders, resizing and pagination position. The example controls pagination, sorting, filters and expanded keys, returning eight current-page records after 1,500ms. None only hides pagination and retains current-page data. The pinned sorting switch targets an absent age column, so turning it on after turning sorting off does not restore sorting; the initial sorting and filter columns are also independent of the initial switch state. The pinned Show Header label controls the title above the table.

The pinned example merges `change.sorter` before the complete column objects in `change.filters`. The first sort returns `filteredValue: []`, making that column a controlled filter. After a later descending request, the old filter object restores its ascending state. Current-page records can therefore change while the arrow remains ascending, and both columns can display ascending arrows. When adapting this example, define the update precedence of sorting and filtering fields for your application.

Enabling or disabling `resizable` reinitializes the table's internal state, matching the pinned mode switch. Use controlled properties for selection, sorting, filters, expansion and pagination that must survive the switch. Updating resize options while resizing remains enabled does not reinitialize the table.

::demo-block{demo="table/en-us/Dynamic" title="Controlled dynamic table"}
::

### Full rendering control

`useFullRender: true` delegates selection, expansion and indentation to the column renderer. `title` receives `{ sorter, filter, selection }`; the fourth render argument receives `{ expandIcon, selection, indentText, isHovering }`. Hide the separate selection column with `rowSelection.hidden` and insert the supplied VNodes into the custom layout to preserve interaction.

The pinned example retains the Name heading, filters, sorting, selection, expansion and twelve records per page. `expandedRowRender` also accepts a `{ children, fixed }` result object with Vue VNode content.

::demo-block{demo="table/en-us/FullRender" title="Full rendering control"}
::

### Grouped column configuration

Nest `columns[].children` to build grouped headings. The example groups title and size as basic information, and owner and date as other information, retaining fixed columns, selection, expansion, filtering and sorting.

::demo-block{demo="table/en-us/GroupedColumns" title="Grouped column configuration"}
::

### Declarative grouped columns (JSX migration)

Nest child `Table.Column` nodes inside parent columns to express the same hierarchy. Use actual column nodes with v-for rather than ordinary wrapper components.

::demo-block{demo="table/en-us/GroupedDeclarative" title="Declarative grouped columns (JSX migration)"}
::

### colSpan and rowSpan

Set `colSpan` for column headings. A cell renderer can return `{ children, props: { colSpan, rowSpan } }`. A zero span suppresses that position, so covered neighboring cells must also receive zero spans. The first row spans four columns and selected cells in the next two rows span two rows.

::demo-block{demo="table/en-us/Span" title="colSpan and rowSpan"}
::

## API reference

The tables below preserve the pinned upstream API, adapting React content types to Vue. The exported Vue types are authoritative for call signatures. Event props may also be consumed as Vue listeners; do not bind both for the same side effect.

### Table

| Properties                | Instructions                                                                                                                                 | Type                                                                                                                                                  | Default    | Version         |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------- |
| bordered                  | Whether to display outer and column borders                                                                                                  | boolean                                                                                                                                               | false      |
| className                 | Outermost style name                                                                                                                         | string                                                                                                                                                |            |
| clickGroupedRowToExpand   | Group content expands or collapses when the group header row is clicked                                                                      | boolean                                                                                                                                               |            | -               |
| columns                   | For a configuration description of the table column, see Column                                                                              | Column []                                                                                                                                             | []         |
| components                | Override the elements of Table, such as table, body, row, td, th, etc.                                                                       | TableComponents                                                                                                                                       |            |
| dataSource                | Data. **An independent key of each data record is need, or use rowKey to specify an attribute name as the primary key**                      | RecordType[]                                                                                                                                          | []         |
| defaultExpandAllRows      | All rows are expanded by default                                                                                                             | boolean                                                                                                                                               | false      |
| defaultExpandAllGroupRows | All grouped rows are expanded by default                                                                                                     | boolean                                                                                                                                               | false      | -               |
| defaultExpandedRowKeys    | Default expansion of row key array                                                                                                           | Array <\*>                                                                                                                                            | []         |
| empty                     | Content displayed when there is no data                                                                                                      | VNodeChild                                                                                                                                            | VNodeChild | 'No data yet. ' |
| expandCellFixed           | Whether the column of the expansion icon is fixed or not, the same value as the fixed value in Column                                        | boolean\|string                                                                                                                                       | false      |
| expandIcon                | Custom expansion icon, hidden when it is `false`                                                                                             | boolean <br/>\|VNodeChild <br/>\| (expanded: boolean) => VNodeChild                                                                                   |            |
| expandedRowKeys           | Expanded rows, the row expansion function will be controlled when this parameter is introduced.                                              | (string \| number)[]                                                                                                                                  |            |
| expandedRowRender         | Extra unfolding lines. **An independent key of each data record is need**                                                                    | (record: object, index: number, expanded: boolean) => TableExpandedRowRenderResult                                                                    |            |
| expandAllRows             | All rows are expanded                                                                                                                        | boolean                                                                                                                                               | false      | -               |
| expandAllGroupRows        | All grouped rows are expanded                                                                                                                | boolean                                                                                                                                               | false      | -               |
| expandRowByClick          | Expand row when click row                                                                                                                    | boolean                                                                                                                                               | false      | -               |
| footer                    | End of form                                                                                                                                  | string<br/>\|VNodeChild<br/>\|(pageData: object) => string\|VNodeChild                                                                                |            |
| getVirtualizedListRef     | Receives the public virtual-list scrolling handle.                                                                                           | (ref: { current: TableVirtualizedListRef \| null }) => void                                                                                           | —          |
| groupBy                   | Field name or grouping function.                                                                                                             | string \| ((record: RecordType) => string \| number)                                                                                                  | —          |
| headerStyle               | Style for header cells (applies to all header `<th>`, including fixed columns)                                                               | StyleValue                                                                                                                                            | -          | **2.97.0**      |
| hideExpandedColumn        | Whether to hide the expansion button column and turn off the rendering of the expansion button when it is turned on                          | boolean                                                                                                                                               | true       |
| indentSize                | indent size of TableCell                                                                                                                     | number                                                                                                                                                | 20         |
| keepDOM                   | Whether to not destroy the collapsed DOM when folding a row                                                                                  | boolean                                                                                                                                               | false      |
| loading                   | Table is loading or not                                                                                                                      | boolean                                                                                                                                               | false      |
| pagination                | Paging component configuration                                                                                                               | boolean\|TablePaginationConfig                                                                                                                        | true       |
| prefixCls                 | Style name prefix                                                                                                                            | string                                                                                                                                                |            |
| renderGroupSection        | Header rendering method                                                                                                                      | (groupKey?: string \| number, group?: string[] \| number[]) => VNodeChild                                                                             |            | -               |
| renderPagination          | Customize the rendering method of pagination.                                                                                                | (paginationProps?: TablePaginationConfig) => VNodeChild                                                                                               |            | -               |
| resizable                 | Whether to turn on the telescopic column function, the column that needs to be telescopic must provide the value of width                    | boolean\|Resizable                                                                                                                                    | false      |
| rowExpandable             | Determines whether a row can expand; false hides its expansion control. When omitted, rows with children or expanded-row content can expand. | (record?: RecordType) => boolean                                                                                                                      | Automatic  | -               |
| rowKey                    | The value of the table row key, which can be a string or a function.                                                                         | string \| (record: RecordType) => string                                                                                                              | 'key'      |
| rowSelection              | See rowSelection                                                                                                                             | object                                                                                                                                                | null       |
| scroll                    | Whether the table is scrollable, configure the width or height of the scroll area, see scroll                                                | object                                                                                                                                                | -          |
| showHeader                | Does it show the header?                                                                                                                     | boolean                                                                                                                                               | true       |
| size                      | Table size, will effect the `padding` of the rows                                                                                            | "default"\|"middle"\|"small"                                                                                                                          | "default"  | -               |
| sticky                    | fixed header                                                                                                                                 | boolean \| { top: number }                                                                                                                            | false      | **2.21.0**      |
| title                     | Table Title                                                                                                                                  | string<br/>\|VNodeChild<br/>\|(pageData: RecordType[]) => string\|VNodeChild                                                                          |            |
| virtualized               | Virtualization settings                                                                                                                      | Virtualized                                                                                                                                           | false      | -               |
| virtualized.itemSize      | Row height                                                                                                                                   | number\|(index: number, row: TableVirtualizedItemRow) => number                                                                                       | 53         | -               |
| virtualized.onScroll      | Virtualized scroll callback.                                                                                                                 | (args: { scrollDirection?: "forward" \| "backward"; scrollOffset?: number; scrollUpdateWasRequested?: boolean }) => void                              | —          |
| onChange                  | Trigger when paging, sorting, filtering changes. extra.changeType is supported in v2.72                                                      | ({ pagination: TablePaginationConfig, <br/>filters: Array<\*>, sorter: object, extra: { changeType: 'sorter' \| 'filter' \| 'pagination' } }) => void |            |
| onExpand                  | Trigger when clicking on the row expansion icon                                                                                              | (expanded: boolean, record: RecordType, DOMEvent: MouseEvent) => void                                                                                 |            | -               |
| onExpandedRowsChange      | Triggers when unfolding row changes                                                                                                          | (rows: RecordType[]) => void                                                                                                                          |            |
| onGroupedRow              | Similar to onRow, but this parameter is used to define the row attribute of the grouping header alone                                        | (record: RecordType, index: number) => object                                                                                                         |            | -               |
| onHeaderRow               | Set the header row property, and the returned object is merged to the header line                                                            | (columns: Column[], index: number) => object                                                                                                          |            |
| onRow                     | Set the row property, and the returned object is merged to the table row                                                                     | (record: RecordType, index: number, rowStatus?: { disabled?: boolean; selected?: boolean }) => object                                                 |            | -               |

### Column

| Parameters                    | Instructions                                                                                                                                                                                                                                                                                | Type                                                                                                                                                                                        | Default     | Version    |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------- |
| align                         | Setting the alignment of columns                                                                                                                                                                                                                                                            | 'left '\| 'right '\| 'center'                                                                                                                                                               | 'left'      |
| children                      | Settings for sub-columns when the header is merged                                                                                                                                                                                                                                          | Column[]                                                                                                                                                                                    |             |
| className                     | Column style name                                                                                                                                                                                                                                                                           | string                                                                                                                                                                                      |             |
| colSpan                       | When header columns merge, set to 0, do not render                                                                                                                                                                                                                                          | number                                                                                                                                                                                      |             |
| dataIndex                     | The key corresponding to the column data in the data item. It is required when using sorter or filter.                                                                                                                                                                                      | string                                                                                                                                                                                      |             |
| defaultFilteredValue          | Default value of the filter, the filter state of the external control column with a value of the screened value array                                                                                                                                                                       | any[]                                                                                                                                                                                       |             | **2.5.0**  |
| defaultSortOrder              | The default value of sortOrder, one of 'ascend'\|'descend'\|false                                                                                                                                                                                                                           | boolean\| string                                                                                                                                                                            | false       | -          |
| direction                     | RTL, LTR direction, the default value is equal to ConfigProvider direction, you can configure the direction of the Table separately here                                                                                                                                                    | 'ltr' \| 'rtl'                                                                                                                                                                              |             | **2.31.0** |
| ellipsis                      | Ellipsis Text, table-layout will automatically switch to fixed after it is turned on                                                                                                                                                                                                        | boolean\| { showTitle: boolean }                                                                                                                                                            | false       | **2.34.0** |
| filterChildrenRecord          | Whether the child data needs to be filtered locally. If this function is enabled, if the child meets the filtering criteria, the parent will retain it even if it does not meet the criteria.                                                                                               | boolean                                                                                                                                                                                     |             | -          |
| filterDropdown                | You can customize the filter menu. This function is only responsible for rendering the layer and needs to write a variety of interactions.                                                                                                                                                  | VNodeChild                                                                                                                                                                                  |             |
| filterDropdownProps           | Props passing to Dropdown, see more in [Dropdown API](/en-us/components/dropdown/)                                                                                                                                                                                                          | object                                                                                                                                                                                      |             |
| filterDropdownVisible         | Visible of Dropdown, see more in [Dropdown API](/en-us/components/dropdown/)                                                                                                                                                                                                                | boolean                                                                                                                                                                                     |             |
| filterIcon                    | Custom filter icon                                                                                                                                                                                                                                                                          | boolean\|VNodeChild\|(filtered: boolean) => VNodeChild                                                                                                                                      |             |
| filterMultiple                | Whether to choose more                                                                                                                                                                                                                                                                      | boolean                                                                                                                                                                                     | true        |
| filterConfirmMode             | Filter confirm mode. `immediate` means filter immediately when clicking option; `confirm` means filter after clicking confirm button, and the dropdown panel will show confirm and reset buttons at the bottom                                                                              | 'immediate' \| 'confirm'                                                                                                                                                                    | 'immediate' |
| filteredValue                 | Controlled property of the filter, the filter state of the external control column with a value of the screened value array                                                                                                                                                                 | any[]                                                                                                                                                                                       |             |
| filters                       | Filter menu items for the header                                                                                                                                                                                                                                                            | Filter[]                                                                                                                                                                                    |             |
| fixed                         | Whether the column is fixed, optional true (equivalent to left) 'left' 'right'                                                                                                                                                                                                              | boolean\|string                                                                                                                                                                             | false       |
| key                           | Stable column key; may be omitted when dataIndex is unique.                                                                                                                                                                                                                                 | string \| number                                                                                                                                                                            | —           |
| render                        | A rendering function that generates complex data, the parameters are the value of the current row, the current row data, the row index, and the table row / column merge can be set in return object                                                                                        | (text: any, record: RecordType, index: number, { expandIcon?: VNodeChild, selection?: VNodeChild, indentText?: VNodeChild, isHovering?: boolean }) => VNodeChild \| TableRenderReturnObject |             |
| renderFilterDropdown          | Custom filter dropdown panel, for usage details, see Custom Filter Rendering                                                                                                                                                                                                                | (props?: RenderFilterDropdownProps) => VNodeChild;                                                                                                                                          | -           | **2.52.0** |
| renderFilterDropdownItem      | Customize the rendering method of each filter item. For usage details, see Custom Filter Item Rendering                                                                                                                                                                                     | ({ value: any, text: any, onChange: Function, level: number, ...otherProps }) => VNodeChild                                                                                                 | -           | -          |
| resize                        | Whether to enable resize mode, this property will take effect only after Table resizable is enabled                                                                                                                                                                                         | boolean                                                                                                                                                                                     |             | **2.42.0** |
| showSortTip                   | Whether to display sorting tips, If sortOrder is set and sorting is controlled, this parameter will not take effect                                                                                                                                                                         | boolean                                                                                                                                                                                     | false       | **2.65.0** |
| sortChildrenRecord            | Whether to sort child data locally                                                                                                                                                                                                                                                          | boolean                                                                                                                                                                                     |             | -          |
| sortOrder                     | The controlled property of the sorting, the sorting of this control column can be set to 'ascend'\|'descended '\|false                                                                                                                                                                      | boolean                                                                                                                                                                                     | false       |
| sorter                        | Enable local comparison or pass true for external sorting; use a unique dataIndex.                                                                                                                                                                                                          | boolean \| ((a: RecordType, b: RecordType, sortOrder?: 'ascend' \| 'descend') => number)                                                                                                    | —           |
| sortIcon                      | Customize the sort icon. The returned node controls the entire sort button, including ascending and descending buttons. Need to control highlighting behavior based on sortOrder                                                                                                            | (props: { sortOrder }) => VNodeChild                                                                                                                                                        |             | **2.50.0** |
| shouldCellUpdate              | Self control whether cell should be updated                                                                                                                                                                                                                                                 | (props: TableCellProps, prevProps: TableCellProps) => boolean                                                                                                                               |             | **2.71.0** |
| title                         | Column header displays text. When a function is passed in, title will use the return value of the function; when other types are passed in, they will be aggregated with sorter and filter. It needs to be used with useFullRender to obtain parameters such as filter in the function type | string \| VNodeChild\|({ filter: VNodeChild, sorter: VNodeChild, selection: VNodeChild }) => VNodeChild.                                                                                    |             | -          |
| useFullRender                 | Whether to completely customize the rendering, see Full Custom Rendering for usage details, enabling this feature will cause a certain performance loss                                                                                                                                     | boolean                                                                                                                                                                                     | false       | -          |
| width                         | Column width                                                                                                                                                                                                                                                                                | string \| number                                                                                                                                                                            |             |
| onCell                        | Set cell properties                                                                                                                                                                                                                                                                         | (record: RecordType, rowIndex: number) => object                                                                                                                                            |             |
| onFilter                      | Determine the running function of the filter in local mode. **An independent dataIndex must be set for the filter column, and an independent key must be set for each data item in the dataSource**                                                                                         | (filteredValue: any, record: RecordType) => boolean                                                                                                                                         |             |
| onFilterDropdownVisibleChange | A callback when a custom filter menu is visible                                                                                                                                                                                                                                             | (visible: boolean) => void                                                                                                                                                                  |             |
| onHeaderCell                  | Set the head cell property                                                                                                                                                                                                                                                                  | (column: RecordType, columnIndex: number) => object                                                                                                                                         |             |

### rowSelection

| Parameters       | Instructions                                                                                                                                                                                                                                                                                                           | Type                                                                                                                                                                                                                                                                  | Default     | Version    |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------- |
| className        | Style name listed                                                                                                                                                                                                                                                                                                      | string                                                                                                                                                                                                                                                                |             |
| checkRelation    | Parent-child node selection association mode. When set to `'related'`, selecting a parent node automatically selects all child nodes, and selecting a child node affects the parent node's state (checked/half-checked/unchecked). Default is `'unRelated'`, meaning parent and child node selections are independent. | 'related' \| 'unRelated'                                                                                                                                                                                                                                              | 'unRelated' |            |
| clickRow         | Whether to enable click row to select. When enabled, clicking anywhere on the row will trigger selection/deselection, including fixed columns. Disabled rows (via getCheckboxProps) cannot be selected by clicking.                                                                                                    | boolean                                                                                                                                                                                                                                                               | false       | **2.94.0** |
| disabled         | Disabled `Checkbox` in `Table` header or not.                                                                                                                                                                                                                                                                          | boolean                                                                                                                                                                                                                                                               | false       | **0.32.0** |
| fixed            | Secure the selection box column to the left.                                                                                                                                                                                                                                                                           | boolean                                                                                                                                                                                                                                                               | false       |
| getCheckboxProps | Default property configuration for the selection box                                                                                                                                                                                                                                                                   | (record: RecordType) => object                                                                                                                                                                                                                                        |             |            |
| hidden           | Hide selection column or not                                                                                                                                                                                                                                                                                           | boolean                                                                                                                                                                                                                                                               | false       | -          |
| selectedRowKeys  | Specifies the key array of the selected item, which needs to work with onChange                                                                                                                                                                                                                                        | string []                                                                                                                                                                                                                                                             |             |            |
| shouldCellUpdate | Self control whether cell should be updated                                                                                                                                                                                                                                                                            | (props: TableCellProps, prevProps: TableCellProps) => boolean                                                                                                                                                                                                         |             | **2.71.0** |
| renderCell       | Custom rendering checkbox                                                                                                                                                                                                                                                                                              | ({ selected: boolean, record: RecordType, originNode: VNodeChild, inHeader: boolean, disabled: boolean, indeterminate: boolean, index?: number, selectRow?: (selected: boolean, e: Event) => void, selectAll?: (selected: boolean, e: Event) => void }) => VNodeChild |             | **2.52.0** |
| width            | Custom list selection box width                                                                                                                                                                                                                                                                                        | string                                                                                                                                                                                                                                                                | number      |            |
| onChange         | A callback in the event of a change in the selected item. The first parameter will save the row keys selected last time, even if you do paging control or update the dataSource FAQ                                                                                                                                    | (selectedRowKeys: number[]\|string[], selectedRows: RecordType[]) => void                                                                                                                                                                                             |             |            |
| onHeaderCell     | Set the head cell property                                                                                                                                                                                                                                                                                             | (column: RecordType, columnIndex: number) => object                                                                                                                                                                                                                   |             |
| onSelect         | Callback when the user manually clicks the selection box of a row                                                                                                                                                                                                                                                      | (record: RecordType, selected: boolean, selectedRows: RecordType[], nativeEvent: MouseEvent) => void                                                                                                                                                                  |             |            |
| onSelectAll      | The user manually clicks the callback of the header selection box, and all optional rows in the dataSource will be selected/unselected                                                                                                                                                                                 | (selected: boolean, selectedRows: RecordType[], changedRows: RecordType[]) => void                                                                                                                                                                                    |             |            |

### scroll

| Parameters               | Instructions                                                                                                                                                                                                                                     | Type           | Default | Version |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- | ------- | ------- |
| scrollToFirstRowOnChange | Whether to automatically scroll to the top of the table after paging, sorting, and filtering changes. When `scroll.y` is set, it scrolls the table body to the top; when `scroll.y` is not set, it scrolls the page to the table header position | boolean        | false   | -       |
| x                        | Set the width of the horizontal scroll area, which can be pixel value, percentage, or 'max-content'                                                                                                                                              | string\|number |         |         |
| y                        | Set the height of the vertical scroll area, which can be a pixel value                                                                                                                                                                           | number         |         |         |

### pagination

| Parameters                        | Instructions                                                                                                                                                                                                                                                           | Type                                                                                          | Default  | Version |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | -------- | ------- |
| currentPage                       | Current page number                                                                                                                                                                                                                                                    | number                                                                                        | -        |         |
| defaultCurrentPage                | Default current page number                                                                                                                                                                                                                                            | number                                                                                        | 1        | -       |
| formatPageText                    | Page-turning area copywriting custom formatting, pass false to close copywriting display; This item affects the copy display on the left of the page turning area of the form. It is different from the `showTotal` parameter of the`Pagination` component.            | boolean\| ({ currentStart: number, currentEnd: number, total: number }) => string\|VNodeChild | true     | -       |
| pageSize                          | Number of entries per page                                                                                                                                                                                                                                             | number                                                                                        | 10       |         |
| position                          | Location                                                                                                                                                                                                                                                               | 'bottom '\|'top '\|'both'                                                                     | 'bottom' |
| total                             | Total number of entries                                                                                                                                                                                                                                                | number                                                                                        | 0        | -       |
| preventPageChangeOnPageSizeChange | Whether to prevent automatic adjustment of currentPage when pageSize changes. By default, when pageSize changes, the component automatically calculates the new currentPage to maintain the current data position. When set to true, the user controls the page change | boolean                                                                                       | false    | -       |

### Resizable

| Parameters    | Instructions                                               | Type                                        | Default |
| ------------- | ---------------------------------------------------------- | ------------------------------------------- | ------- |
| onResize      | Triggers when the table column changes its width           | (column: Column) => Partial<Column> \| void |         |
| onResizeStart | Triggers when the table column starts to change the width. | (column: Column) => Partial<Column> \| void |         |
| onResizeStop  | Triggers when the table column stops changing the width    | (column: Column) => Partial<Column> \| void |         |

### Methods

| Parameters           | Instructions                                      | Version |
| -------------------- | ------------------------------------------------- | ------- |
| getCurrentPageData() | Returns the current page records as RecordType[]. | —       |

### Vue-specific signatures and state

- `TableColumnProps<RecordType>` describes typed column callbacks; its `sorter` is a boolean or `(a, b, sortOrder) => number`, with the current direction in the third argument.
- `rowSelection.type` supports `checkbox` and `radio`; `defaultSelectedRowKeys` initializes selection and `selectedRowKeys` controls it.
- `getCurrentPageData(): RecordType[]` returns the current page records. The Vue instance does not expose Foundation or react-window internals.
- `showHeader` and `hideExpandedColumn` default to true: omitted, explicit false and explicit true have distinct meanings.
- `rowKey` accepts a string, number or record callback; keys are string or number. `groupBy` accepts a field string or a record callback.

### Vue events

| Event              | Payload                                                |
| ------------------ | ------------------------------------------------------ |
| change             | { pagination, filters, sorter, extra: { changeType } } |
| pageChange         | currentPage, pageSize                                  |
| selectChange       | selectedRowKeys, selectedRows                          |
| select             | record, selected, selectedRows, event                  |
| selectAll          | selected, selectedRows, changedRows                    |
| expand             | expanded, record, event                                |
| expandedRowsChange | expandedRows                                           |

## React → Vue

| React                        | Vue                                                                |
| ---------------------------- | ------------------------------------------------------------------ |
| columns[].render             | Return a VNode or use `#cell="{ text, record, rowIndex, column }"` |
| Column.title / header render | `#headerCell="{ column }"` or a VNode callback                     |
| Table.Column JSX children    | Nested Table.Column template nodes                                 |
| title / footer               | `#title="{ pageData }"` / `#footer="{ pageData }"`                 |
| empty                        | `#empty`                                                           |
| expandedRowRender            | `#expandedRow="{ record, index, expanded }"`                       |
| renderGroupSection           | `#groupSection="{ groupKey, group }"`                              |
| renderPagination             | `#pagination="{ pagination }"`                                     |
| useState / useMemo           | `ref` / `shallowRef` / `computed`                                  |
| ref                          | `shallowRef<TableExposed \| null>` + `getCurrentPageData()`        |
| className / ReactNode        | `class` or `className` / `VNodeChild`                              |

## Accessibility

Keep heading and cell semantics when customizing components. The current Vue implementation uses a native table container with `role="grid"` / `role="treegrid"`, column headers, row/gridcell roles, sort order in sort-button labels, expansion state and accessible names for filter, sort and selection controls. The pinned React documentation describes grid/treegrid and additional row/column count metadata; do not assume those claims are guaranteed by these Vue demos. Keyboard and screen-reader parity require separate browser verification.

## RTL/LTR

Table inherits direction from [ConfigProvider](/en-us/components/config-provider/); set `direction="rtl"` on an individual table to override it. Fixed columns and alignment are direction-sensitive. Keep tree indentation and fixed offsets in the Chromium acceptance matrix.

## Content guidelines

Use a clear table title and add context for complex data. Keep column headings short, use sentence case, and provide a tooltip if a heading must be truncated. Follow [Button](/en-us/components/button/) wording for row actions.

## Design tokens

The default theme provides the upstream `.semi-*` classes and `--semi-*` tokens. Import `table.css`; use `--semi-color-fill-0` and related tokens instead of hard-coding theme backgrounds.

::token-table{component="table"}
::

## FAQ

**Why does selection or a data update reset my page?** Keep data/configuration references stable. With shallow state, replace the array only when data changes; control `pagination.currentPage` when the application owns the page.

**Why are filter results incorrect?** Every filter column needs a distinct `dataIndex`, every record needs a unique key, and `onFilter` must return the matching result.

**Why did the data not update?** With `shallowRef`, assign a new array. Avoid mutating props or rebuilding configuration in an unrelated render.

**Why can a row not be selected or expanded?** Check its key and the `getCheckboxProps` / `rowExpandable` rules.

**How can sorting be delegated to a service?** Set `sorter: true`, consume `change.sorter` and update the controlled sort state and current-page records.

**How can I style a row or cell?** Use `onRow` / `onHeaderRow` for row attributes and `onCell` / `onHeaderCell` for cells.

**Why does selection remember keys from another page?** The first `rowSelection.onChange` argument retains selected keys across controlled pages. Filter them against current data if page-local keys are needed; the second argument contains available selected records.

**Is single selection supported?** Yes, the current public Vue contract exposes `rowSelection.type: 'radio'`. This corrects the outdated single-selection answer in the pinned upstream prose.
