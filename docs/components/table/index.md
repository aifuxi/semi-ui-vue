# Table 表格

Table 对齐 Semi Design v2.102.0，保留 `.semi-table*` DOM/class、选择、排序过滤、分页、展开、树形/分组、固定列、虚拟化、滚动与 ARIA 契约。公开入口为 `@aifuxi/semi-ui-vue` 根导出与 `@aifuxi/semi-ui-vue/table` 子路径，默认导出与命名 `Table` 一致，并附带复合静态成员 `Table.Column` 与 `DEFAULT_KEY_COLUMN_SELECTION`/`DEFAULT_KEY_COLUMN_EXPAND`。

## 基础使用

```vue
<script setup lang="ts">
import { Table } from '@aifuxi/semi-ui-vue';

const columns = [
  { title: '名称', dataIndex: 'name' },
  { title: '分数', dataIndex: 'score', sorter: (a, b) => a.score - b.score },
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

`rowKey` 缺省读取记录的 `key` 字段，也可传字段名或 `(record) => key`。`empty` 提供空态内容；`loading` 在表格上叠加载入态。

## 选择

`rowSelection` 传 `true` 或配置对象：

| 字段                                                                           | 说明                                            |
| ------------------------------------------------------------------------------ | ----------------------------------------------- |
| `type`                                                                         | `'checkbox'`（缺省）或 `'radio'`                |
| `selectedRowKeys` / `defaultSelectedRowKeys`                                   | 受控 / 非受控选中键                             |
| `onChange` / `onSelect` / `onSelectAll`                                        | 与 `select`/`selectAll`/`selectChange` 事件同源 |
| `getCheckboxProps`                                                             | 返回 Checkbox props（`disabled` 等）            |
| `fixed` / `width` / `hidden` / `clickRow` / `disabled`                         | 固定、宽度、隐藏、点击整行选择、整体禁用        |
| `checkRelation`                                                                | 树形选择 `'related'` / `'unRelated'`            |
| `renderCell`                                                                   | 完全自定义选择单元格                            |
| `title` / `className` / `key` / `onCell` / `onHeaderCell` / `shouldCellUpdate` | 与普通列同义的单元格/表头属性                   |

## 排序、过滤与分页

- 列上配置 `sorter`、`sortOrder`/`defaultSortOrder` 打开排序；`showSortTip`、`sortIcon` 控制提示与图标。
- `filters`、`filteredValue`/`defaultFilteredValue`、`filterMultiple`、`onFilter` 打开筛选，`filterDropdown`/`filterDropdownProps`/`filterDropdownVisible`/`renderFilterDropdown`/`renderFilterDropdownItem` 自定义筛选 UI，`filterConfirmMode` 选择即时或确认式。
- 排序/过滤/分页变化统一发出 `change(changeInfo)`，其中 `changeInfo` 携带 `pagination`、`filters`、`sorter` 与 `extra.changeType`；分页单独发出 `pageChange(currentPage, pageSize)`。
- `pagination` 传 `false` 关闭，或传 Pagination 配置（含 `position: 'bottom'|'top'|'both'` 与 `formatPageText`）；`renderPagination` 或 `#pagination` slot 可替换分页区域。

## 展开、树形与分组

- `expandedRowRender(record, index, expanded)` 返回 `VNodeChild` 或对象；对象形式把 `children` 之外的 ColumnProps（`className`/`onCell`/`render`/`colSpan` 等）应用到展开单元格，`fixed` 仅作元数据；返回 `null` 表示该行不可展开。
- `expandedRowKeys` 受控、`defaultExpandedRowKeys` 初始化、`defaultExpandAllRows`/`expandAllRows` 全展开；`expandRowByClick` 点击行展开，`expandIcon` 自定义图标，`expandCellFixed`/`hideExpandedColumn` 控制展开列固定与内嵌。
- 树形数据由 `childrenRecordName` 指定子节点字段；`groupBy` + `renderGroupSection`（或 `#groupSection`）表达分组标题，`defaultExpandAllGroupRows`/`expandAllGroupRows` 与 `clickGroupedRowToExpand` 控制分组展开。

## 固定列、滚动、尺寸与虚拟化

- `scroll.x`/`scroll.y` 开启横向/纵向滚动（含固定表头），`scrollToFirstRowOnChange` 控制翻页回顶；列的 `fixed`/`ellipsis` 与 `rowSpanHover` 保留固定列与省略态。
- `sticky` 让表头吸顶；`resizable` 传 `true` 或 `{ handlerClassName, onResize, onResizeStart, onResizeStop }` 调整列宽。
- `size` 取 `'small' | 'default' | 'middle'`；`bordered`、`showHeader`、`headerStyle`、`indentSize` 控制外观。
- `virtualized` 传 `true` 或 `{ estimatedItemSize, overscanCount, itemSize, onScroll }` 开启虚拟滚动；`getVirtualizedListRef` 暴露 `{ scrollTo, scrollToItem, resetAfterIndex }`。

## 自定义渲染

- 列内 `render(text, record, index, options)` 渲染单元格；`useFullRender` 时额外提供 `selection` 与 `indentText`。
- `#cell="{ column, record, rowIndex, text }"`、`#headerCell="{ column }"` 提供表格级兜底；列级 `render` 优先。
- `title`/`footer` 支持 `VNodeChild` 或 `(pageData) => VNodeChild`，并有 `#title`/`#footer` slot；`components` 可替换 table/header/body/footer 的 row/cell 等承载元素。
- `onRow`、`onHeaderRow`、`onGroupedRow` 返回行属性（`class`/`style`/事件），与固定 Adapter 的合并顺序一致。

## API

### Table Props

| Prop                                               | 类型                                               | 默认值             |
| -------------------------------------------------- | -------------------------------------------------- | ------------------ |
| `columns` / `dataSource`                           | `TableColumn[]` / `RecordType[]`                   | -                  |
| `rowKey`                                           | `string \| number \| (record) => TableRowKey`      | `'key'`            |
| `bordered` / `showHeader`                          | `boolean`                                          | `false` / `true`   |
| `size`                                             | `'small' \| 'default' \| 'middle'`                 | `'default'`        |
| `loading` / `keepDOM`                              | `boolean`                                          | `false`            |
| `empty` / `title` / `footer`                       | `VNodeChild` 或渲染函数                            | -                  |
| `pagination`                                       | `boolean \| TablePaginationConfig`                 | `true`             |
| `scroll`                                           | `{ x?, y?, scrollToFirstRowOnChange? }`            | -                  |
| `sticky`                                           | `boolean \| { top?: number }`                      | -                  |
| `resizable`                                        | `boolean \| TableResizable`                        | -                  |
| `virtualized`                                      | `boolean \| TableVirtualizedProps`                 | -                  |
| `getVirtualizedListRef`                            | `(ref) => void`                                    | -                  |
| `rowSelection`                                     | `boolean \| TableRowSelection`                     | -                  |
| `rowExpandable`                                    | `(record) => boolean`                              | -                  |
| `expandedRowKeys` / `defaultExpandedRowKeys`       | `TableRowKey[]`                                    | -                  |
| `expandedRowRender`                                | `(record, index, expanded) => VNodeChild \| 对象`  | -                  |
| `defaultExpandAllRows` / `expandAllRows`           | `boolean`                                          | `false`            |
| `expandRowByClick`                                 | `boolean`                                          | `false`            |
| `expandIcon` / `expandCellFixed`                   | `boolean \| VNodeChild \| 渲染函数` / `TableFixed` | -                  |
| `hideExpandedColumn`                               | `boolean`                                          | `false`            |
| `groupBy`                                          | `string \| (record) => string \| number`           | -                  |
| `renderGroupSection`                               | `(groupKey, group) => VNodeChild \| 对象`          | -                  |
| `defaultExpandAllGroupRows` / `expandAllGroupRows` | `boolean`                                          | `false`            |
| `clickGroupedRowToExpand`                          | `boolean`                                          | `false`            |
| `childrenRecordName`                               | `string`                                           | `'children'`       |
| `indentSize`                                       | `number`                                           | `20`               |
| `rowSpanHover`                                     | `boolean`                                          | `true`             |
| `headerStyle`                                      | `StyleValue`                                       | -                  |
| `renderPagination`                                 | `(paginationProps) => VNodeChild`                  | -                  |
| `components`                                       | `TableComponents`                                  | -                  |
| `onRow` / `onHeaderRow` / `onGroupedRow`           | 返回行属性的函数                                   | -                  |
| `onChange` / `onExpand` / `onExpandedRowsChange`   | 回调                                               | -                  |
| `direction`                                        | `'ltr' \| 'rtl'`                                   | ConfigProvider     |
| `prefixCls` / `id`                                 | `string`                                           | `'semi-table'` / - |
| `class` / `className` / `style`                    | Vue 原生 class/style 与兼容 prop                   | -                  |

### Table.Column

| Prop                                                                                                                                                                                            | 类型                                                          | 说明                        |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | --------------------------- |
| `title` / `dataIndex` / `key`                                                                                                                                                                   | `VNodeChild \| 函数` / `string` / `TableRowKey`               | 表头、取值路径与稳定键      |
| `align` / `fixed` / `width`                                                                                                                                                                     | `'left'\|'right'\|'center'` / `TableFixed` / `string\|number` | 对齐、固定与宽度            |
| `ellipsis`                                                                                                                                                                                      | `boolean \| { showTitle?: boolean }`                          | 省略与 title 提示           |
| `render` / `useFullRender`                                                                                                                                                                      | 渲染函数 / `boolean`                                          | 单元格渲染与完整渲染参数    |
| `sorter` / `sortOrder` / `defaultSortOrder` / `sortIcon` / `showSortTip`                                                                                                                        | 排序配置                                                      | 排序状态与图标              |
| `filters` / `filteredValue` / `defaultFilteredValue` / `filterMultiple` / `onFilter` / `filterChildrenRecord`                                                                                   | 过滤配置                                                      | 过滤数据与匹配              |
| `filterDropdown` / `filterDropdownProps` / `filterDropdownVisible` / `filterConfirmMode` / `filterIcon` / `renderFilterDropdown` / `renderFilterDropdownItem` / `onFilterDropdownVisibleChange` | 筛选 UI                                                       | 自定义筛选入口与图标        |
| `onCell` / `onHeaderCell` / `shouldCellUpdate`                                                                                                                                                  | 单元格属性与更新控制                                          | 与固定 Adapter 合并顺序一致 |
| `colSpan` / `children` / `resize` / `sortChildrenRecord`                                                                                                                                        | 列跨度、嵌套表头、列宽调整与子记录排序                        | 分组表头与树形排序          |

### Slots

`default`（默认 slot，等价写法 `#default`）、`cell`、`empty`、`expandedRow`、`footer`、`groupSection`、`headerCell`、`pagination`、`title`。

### Events

`change(changeInfo)`、`expand(expanded, record, event?)`、`expandedRowsChange(expandedRows)`、`pageChange(currentPage, pageSize)`、`select(record, selected, selectedRows, event?)`、`selectAll(selected, selectedRows, changedRows)`、`selectChange(selectedRowKeys, selectedRows)`。

### Exposed

通过组件 ref 调用 `getCurrentPageData()` 获取当前页数据。

## 可访问性、键盘与 ARIA

- 普通表格输出 `grid` 语义、逐单元格 `aria-colindex` 与行 `aria-rowindex`；含展开/分组/子数据时使用 `treegrid`，可展开父行输出 `aria-level` 与 `aria-expanded`。
- 选择列使用真实 Checkbox/Radio，表头三态通过 `aria-checked="mixed"` 表达；排序/筛选按钮为可聚焦 button。
- 键盘与焦点沿用原生控件与 Pagination/Checkbox 契约，组件不新增自定义键盘状态机。

## 主题、RTL、SSR 与发布

- class 与 Token 沿用固定 `.semi-table*`；逐组件样式入口为 `@aifuxi/semi-theme-default/table.css`，根主题同时包含同一份样式。
- RTL 由 ConfigProvider 的 `.semi-rtl` 驱动固定列偏移、排序图标与分页方向。
- import 与 SSR render 不访问 DOM；ResizeObserver、滚动测量与虚拟列表只在客户端创建并随卸载清理。
- `pnpm check:artifacts` 覆盖构建、主题入口、SSR dist 枚举与真实 tarball 的 default/named 导出、`Table.Column`、`DEFAULT_KEY_COLUMN_*`、类型、`table.css`、tree-shaking、许可与 SBOM。

## React → Vue

见 [React → Vue 迁移表](./react-to-vue.md)。完整公开行为、列查询语义与视觉证据见[对齐矩阵](./alignment.md)。
