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

## 如何使用

从公开组件子路径引入 Table。提供稳定行主键，保持数据与配置引用稳定；使用 shallowRef 时通过替换数组更新。以下按固定 v2.102.0 中文上游 37 个 live Demo 顺序组织，英文缺少的两节已翻译补齐，每例都是独立 Vue SFC。

```typescript
import { Table, type TableColumnProps, type TableRowSelection } from '@aifuxi/semi-ui-vue/table';
import '@aifuxi/semi-theme-default/table.css';
```

## 代码演示

首批 1–15 项使用固定上游的原始 Figma/Docs 图标本地副本 `/demos/table/`，保留原图像素与 64×64 固有尺寸，不请求第三方服务。其余示例仍使用原有本地示意图，尚未纳入本批严格验收。

### 基本表格

`dataSource` 保存记录，`columns` 定义标题、字段和渲染方式。每条记录必须有独立的 `key`，或通过 `rowKey` 指定主键；选择、展开和更新均依赖这个标识。例子展示文件图标、状态 Tag、所有者头像和操作列。

::demo-block{demo="table/zh-cn/Basic" title="基本表格"}
::

### 声明式列（对应 JSX 写法）

使用 `Table.Column` 的模板节点声明列；列节点本身不产生 DOM。不要把列包在自定义组件中。配置式 `columns` 与声明式列选择一种使用，避免依赖两种输入的合并。React JSX 的 `render` 转为返回 VNode 的函数。

::demo-block{demo="table/zh-cn/DeclarativeColumns" title="声明式列（对应 JSX 写法）"}
::

### 行选择操作

通过 `rowSelection` 开启选择。`getCheckboxProps` 禁用指定记录，表头全选跳过禁用项；`onSelect` 与 `onSelectAll` 表示具体操作，`onChange` 返回选中 keys 和记录。本例每页 3 行，选择操作通过回调输出到控制台。

::demo-block{demo="table/zh-cn/Selection" title="行选择操作"}
::

### 自定义渲染

`Column.render(text, record, index, options)` 自定义复杂单元格；也可使用 `#cell="{ text, record, rowIndex, column }"`。第四参数提供 `expandIcon`、`selection`、`indentText` 和 `isHovering`。本例保留标题 Tooltip、删除行、重置和带明暗插画的 Empty；删除全部记录即可查看空态。

::demo-block{demo="table/zh-cn/CustomRendering" title="自定义渲染"}
::

### 带分页组件的表格

不传 `pagination.currentPage` 时，Table 管理页码并根据数据长度计算总数。传入该字段后页码受控，直接呈现传入的当前页数据；本地完整数据分页使用非受控页码。本例有 46 条记录，支持筛选、排序、选择及 300px 表体滚动。

::demo-block{demo="table/zh-cn/Pagination" title="带分页组件的表格"}
::

### 拉取远程数据

实际服务通常在分页、排序或筛选后重新请求数据。本例保留固定上游的 300ms 本地异步分页，每页 5 条、总数 46；通过 `loading` 显示等待状态，卸载时清理计时器。演示不请求业务接口，日期使用当前日期加固定偏移。

分页配置使用 `currentPage`、`pageSize`、`total` 和公开 Vue `onChange` 回调；固定 React 示例的 `onPageChange` 在 Vue 中迁移为 `onChange`。页码受控时传入请求返回的当前页记录，不再做二次本地切片。

::demo-block{demo="table/zh-cn/RemoteData" title="拉取远程数据"}
::

### 固定列或表头

为固定列指定 `fixed` 和 `width`，并配置 `scroll.x`；`scroll.y` 固定表体高度与表头。横向总宽应容纳固定列及其余列；若表头错位，检查列宽、长文本和图片尺寸，并可留一列不指定宽度以适应剩余空间。

需要表头跟随页面滚动时使用 `sticky` 或 `:sticky="{ top: 0 }"`，列宽仍由 `column.width` 和浏览器剩余空间分配决定。

::demo-block{demo="table/zh-cn/Fixed" title="固定列或表头"}
::

### 带排序和过滤功能的表头

列设置 `filters` 与 `onFilter` 后显示筛选器，`sorter` 开启排序。参与查询的列必须有独立 `dataIndex`，记录必须有独立主键。受控时回写 `filteredValue`、`sortOrder`；非受控初始化使用 `defaultFilteredValue`、`defaultSortOrder`。

::demo-block{demo="table/zh-cn/SortFilter" title="带排序和过滤功能的表头"}
::

### 排序中的空值与提示

`sorter(a, b, sortOrder)` 的第三参数提供当前排序方向，让未知大小在升序和降序中始终位于末尾。本例保留固定片段的 6 条记录与两个 undefined 大小，不在示例外部重排数据。`showSortTip` 默认 false，本例显式开启。

::demo-block{demo="table/zh-cn/UndefinedSort" title="排序中的空值与提示"}
::

### 自定义表头筛选

在 `Column.title` 中放置 Input 并绑定 `filteredValue`，可以直接从表头过滤。输入法组合期间暂不提交筛选，`compositionend` 后同步完整输入；清除输入对应空筛选数组。

::demo-block{demo="table/zh-cn/HeaderFilter" title="自定义表头筛选"}
::

### 自定义筛选器

`renderFilterDropdown` 接收临时筛选状态和 `setTempFilteredValue`、`confirm`、`clear`、`close`。输入仅修改临时值；确认才应用。标题列演示确认或清除后关闭；所有者列默认筛选一位所有者，确认或清除后保持面板打开。`close()` 不提交修改。

::demo-block{demo="table/zh-cn/CustomFilter" title="自定义筛选器"}
::

### 筛选确认模式

设置 `filterConfirmMode: 'confirm'` 后，多次点击只修改临时状态；“确定”应用筛选并关闭面板，“重置”恢复打开面板时的值并保持打开。默认 `immediate` 则每次选择立即生效。

::demo-block{demo="table/zh-cn/FilterConfirm" title="筛选确认模式"}
::

### 自定义筛选项渲染

`renderFilterDropdownItem` 可读取 `text`、`value`、`checked`、`filteredValue`、`level` 和 `filterMultiple`。保留回调提供的 `onChange` 才能继续驱动筛选；本例使用 Dropdown.Item 和 `showTick` 呈现当前选择。

::demo-block{demo="table/zh-cn/FilterItem" title="自定义筛选项渲染"}
::

### 一般可展开行

通过 `#expandedRow="{ record, index, expanded }"` 渲染额外详情，或传入 `expandedRowRender`。行主键默认来自 `key`；`rowKey` 也接受字段名或函数。展开与选择可以同时使用。

::demo-block{demo="table/zh-cn/Expanded" title="一般可展开行"}
::

### 展开按钮渲染为单独列

`hideExpandedColumn` 默认 true，将按钮放在第一列内容旁。显式绑定 `:hide-expanded-column="false"` 后单独渲染展开列。

::demo-block{demo="table/zh-cn/SeparateExpand" title="展开按钮渲染为单独列"}
::

### 关闭某一行的可展开按钮渲染

`rowExpandable(record)` 返回 false 时隐藏该行的展开按钮。本例第一条记录不可展开，其余记录保留详情。

::demo-block{demo="table/zh-cn/RowExpandable" title="关闭某一行的可展开按钮渲染"}
::

### 树形数据简单示例

数据中存在 `children` 时自动展示树形结构；`childrenRecordName` 可替换该字段，`indentSize` 控制每层缩进，默认 20。每一级记录都要有稳定主键，包括最深层子节点。

::demo-block{demo="table/zh-cn/Tree" title="树形数据简单示例"}
::

### 行可交换的树形数据

通过替换 `dataSource` 的引用并调整同级数组顺序实现交换；上移、下移按钮在边界禁用。`expandedRowKeys` 单独受控，交换记录后保留其展开身份。

::demo-block{demo="table/zh-cn/TreeReorder" title="行可交换的树形数据"}
::

### 树形选择

默认行选择相互独立。此例保持受控 `selectedRowKeys`，在 `onSelect` 中递归选中或取消当前节点及后代，在 `onSelectAll` 中收集所有可选主键；它演示显式维护规则，不把该规则等同于自动父子关联。

::demo-block{demo="table/zh-cn/TreeSelection" title="树形选择"}
::

### 树形选择关联（checkRelation）

设置 `rowSelection.checkRelation: 'related'` 启用父子关联：选中父节点包含后代，子节点变化更新父节点的全选、半选或未选状态。通过 `onChange` 回写选中主键。

::demo-block{demo="table/zh-cn/TreeRelation" title="树形选择关联（checkRelation）"}
::

### 自定义行或单元格事件以及属性

`onRow` / `onHeaderRow` 返回真实行节点的属性和事件；`column.onCell` / `column.onHeaderCell` 作用于单元格。Vue 原生事件使用 `onClick`、`onDblclick`、`onMouseenter` 等名称。点击单元格或表头、双击行即可查看本例反馈。

::demo-block{demo="table/zh-cn/RowEvents" title="自定义行或单元格事件以及属性"}
::

### 实现斑马纹样式

用 `onRow` 根据行号添加 class，并使用主题 Token 绘制交替背景。固定列需要定制背景时，也可通过 `onCell` 为每个单元格返回样式。

::demo-block{demo="table/zh-cn/Zebra" title="实现斑马纹样式"}
::

### 实现表头样式定制

通过 `Column.onHeaderCell` 返回 style 或 class 定制表头。示例将背景设置为 `--semi-color-fill-0`。全表头统一样式也可以使用 `headerStyle`。英文固定上游缺少本节，这里依据中文示例补齐。

::demo-block{demo="table/zh-cn/HeaderStyle" title="实现表头样式定制"}
::

### 实现单元格 Hover 样式定制

先覆盖整行 hover 背景，再为当前单元格设置背景，使高亮范围限定为一个 cell。局部 scoped 样式通过 `:deep()` 命中组件节点。英文固定上游缺本节，根据中文补齐。

::demo-block{demo="table/zh-cn/CellHover" title="实现单元格 Hover 样式定制"}
::

### 单元格缩略

列设置 `ellipsis: true` 后缩略溢出文本，并保留原生 HTML title。示例结合固定列、筛选和排序，检查长标题与所有者文本。

::demo-block{demo="table/zh-cn/Ellipsis" title="单元格缩略"}
::

### 自定义缩略提示

设置 `ellipsis: { showTitle: false }` 关闭原生 title，再通过 `render` 返回 Typography.Text 的 `ellipsis: { showTooltip: true }` 提示。

::demo-block{demo="table/zh-cn/EllipsisTooltip" title="自定义缩略提示"}
::

### 基本伸缩列

开启 `resizable`，为需要伸缩的列指定 `width`。没有 width 的列保留浏览器自动布局；`column.resize: false` 可以单独关闭某列的伸缩。与固定列结合时留一列不设宽度，不推荐同时用固定 `scroll.x` 限制总宽。

::demo-block{demo="table/zh-cn/Resizable" title="基本伸缩列"}
::

### 进阶的伸缩列

`resizable` 对象支持 `onResizeStart`、`onResize`、`onResizeStop`；返回列配置可定制拖动状态。本例开始时添加 class，结束时清除，显示临时竖线和拖动手柄样式。

::demo-block{demo="table/zh-cn/ResizableStyle" title="进阶的伸缩列"}
::

### 拖拽排序

上游使用 React 专用 dnd-kit 与 `components.body.row`。本例不新增框架外依赖，通过公开 `onRow` 接入原生 drag/drop，保持每页 10 条记录与页内排序，并提供 Alt + ↑/↓ 键盘移动。拖动动画、传感器和自动滚动不等同于 dnd-kit，属于明确的集成适配，尚未作为视觉等价差异验收。

::demo-block{demo="table/zh-cn/DragSort" title="拖拽排序"}
::

### 表格分组

通过 `groupBy` 指定字段或返回字符串/数字的函数。使用 `#groupSection="{ groupKey, group }"` 或 `renderGroupSection` 渲染分组标题；`clickGroupedRowToExpand` 支持点击整行分组标题展开。

::demo-block{demo="table/zh-cn/Grouping" title="表格分组"}
::

### 虚拟化表格

`virtualized` 适合大数据量，需要数值 `scroll.y` 和明确表宽。普通行默认高度 56，也可通过 `virtualized.itemSize` 提供数值或 `(index, { sectionRow, expandedRow }) => number`。本例有 1000 条记录，通过 `getVirtualizedListRef` 获得公开 `scrollTo` / `scrollToItem` 接口。React 的 react-window 私有实例方法不属于 Vue 契约。

::demo-block{demo="table/zh-cn/Virtualized" title="虚拟化表格"}
::

### 无限滚动

`virtualized.onScroll` 提供方向、偏移和是否程序化滚动。仅在向前自然滚动接近末尾时追加 20 条数据，排除程序化跳转引发的加载。每条新增记录仍有独立主键。

::demo-block{demo="table/zh-cn/InfiniteScroll" title="无限滚动"}
::

### 受控的动态表格

分别切换固定表头、隐藏表头、标题、底部、固定列、选择、加载、空数据、排序、过滤、行展开、全部展开、边框、列伸缩和分页位置。配置通过 reactive / computed 派生，页码、选择和展开主键分别受控，不修改组件内部状态。

::demo-block{demo="table/zh-cn/Dynamic" title="受控的动态表格"}
::

### 完全自定义渲染

`useFullRender: true` 将选择框、展开图标与缩进交给列渲染。`title` 收到 `{ sorter, filter, selection }`，`render` 第四参数收到 `{ expandIcon, selection, indentText, isHovering }`。使用 `rowSelection.hidden` 隐藏单独选择列，再把 origin VNode 插回自定义布局，保留原有交互。

::demo-block{demo="table/zh-cn/FullRender" title="完全自定义渲染"}
::

### 合并表头配置式写法

嵌套 `columns[].children` 创建多层表头。例子将标题和大小归为基本信息，所有者和日期归为其他信息，并保留固定列、选择、展开、筛选和排序。

::demo-block{demo="table/zh-cn/GroupedColumns" title="合并表头配置式写法"}
::

### 合并表头声明式写法（对应 JSX）

在 `Table.Column` 中嵌套子 `Table.Column` 表达同一列层次。使用真实列节点配合 v-for，不通过普通包装组件替代列。

::demo-block{demo="table/zh-cn/GroupedDeclarative" title="合并表头声明式写法（对应 JSX）"}
::

### 行列合并

列标题可以设置 `colSpan`；单元格 `render` 返回 `{ children, props: { colSpan, rowSpan } }`。跨度为 0 时不渲染该位置，必须对被覆盖的相邻单元格同时设置。本例首行跨 4 列，后两行的部分单元格跨 2 行。

::demo-block{demo="table/zh-cn/Span" title="行列合并"}
::

## API 参考

下表保留固定上游公开 API，并将 React 内容类型适配为 Vue。函数签名以导出的 Vue 类型为准。事件 prop 也可以使用 Vue 监听器；同一副作用不要同时绑定两种形式。

### Table

| 属性                      | 说明                                                                                                            | 类型                                                                                                                                                  | 默认值     | 版本       |
| ------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------- |
| bordered                  | 是否展示外边框和列边框                                                                                          | boolean                                                                                                                                               | false      |
| childrenRecordName        | 树形表格 dataSource 中每行元素中表示子级数据的字段，默认为 children                                             | string                                                                                                                                                | 'children' |
| className                 | 最外层样式名                                                                                                    | string                                                                                                                                                |            |
| clickGroupedRowToExpand   | 点击分组表头行时分组内容展开或收起                                                                              | boolean                                                                                                                                               |            | -          |
| columns                   | 表格列的配置描述，详见Column                                                                                    | Column[]                                                                                                                                              | []         |
| components                | 覆盖 Table 的组成元素，如 table, body，row，td，th 等                                                           | TableComponents                                                                                                                                       |            |
| dataSource                | 数据。**请为每一条数据分配一个独立的 key，或使用 rowKey 指定一个作为主键的属性名**                              | RecordType[]                                                                                                                                          | []         |
| defaultExpandAllRows      | 默认是否展开所有行，动态加载数据时不生效                                                                        | boolean                                                                                                                                               | false      |
| defaultExpandAllGroupRows | 默认是否展开分组行，动态加载数据时不生效                                                                        | boolean                                                                                                                                               | false      | -          |
| defaultExpandedRowKeys    | 默认展开的行 key 数组，，动态加载数据时不生效                                                                   | Array<\*>                                                                                                                                             | []         |
| direction                 | RTL、LTR 方向，默认值等于 ConfigProvider direction，可在此单独配置 Table 的 direction                           | 'ltr' \| 'rtl'                                                                                                                                        |            | **2.31.0** |
| empty                     | 无数据时展示的内容                                                                                              | VNodeChild                                                                                                                                            | '暂无数据' |
| expandCellFixed           | 展开图标所在列是否固定，与 Column 中的 fixed 取值相同                                                           | boolean\|string                                                                                                                                       | false      |
| expandIcon                | 自定义展开按钮，传 `false` 关闭默认的渲染                                                                       | boolean \| VNodeChild<br/> \| (expanded: boolean) => VNodeChild                                                                                       |            |
| expandedRowKeys           | 展开的行，传入此参数时行展开功能将受控                                                                          | (string \| number)[]                                                                                                                                  |            |
| expandedRowRender         | 额外的展开行。**请为每一条数据分配一个独立的 key，或使用 rowKey 指定一个作为主键的属性名**                      | (record: object, index: number, expanded: boolean) => VNodeChild                                                                                      |            |
| expandAllRows             | 是否展开所有行                                                                                                  | boolean                                                                                                                                               | false      | -          |
| expandAllGroupRows        | 是否展开分组行                                                                                                  | boolean                                                                                                                                               | false      | -          |
| expandRowByClick          | 点击行时是否展开可展开行                                                                                        | boolean                                                                                                                                               | false      | -          |
| footer                    | 表格尾部                                                                                                        | VNodeChild<br/>\|(pageData: object) => VNodeChild                                                                                                     |            |
| getVirtualizedListRef     | 接收公开虚拟列表滚动句柄。                                                                                      | (ref: { current: TableVirtualizedListRef \| null }) => void                                                                                           | —          |
| groupBy                   | 分组字段名或分组函数。                                                                                          | string \| ((record: RecordType) => string \| number)                                                                                                  | —          |
| headerStyle               | 表头单元格的内联样式（会应用到所有表头 th，包括 fixed 表头）                                                    | StyleValue                                                                                                                                            | -          | **2.97.0** |
| hideExpandedColumn        | 当表格可展开时，展开按钮默认会与第一列文案渲染在同一个单元格内，设为 false 时默认将展开按钮单独作为一列渲染     | boolean                                                                                                                                               | true       |
| indentSize                | 树形结构 TableCell 的缩进大小                                                                                   | number                                                                                                                                                | 20         |
| keepDOM                   | 折叠行时是否不销毁被折叠的 DOM                                                                                  | boolean                                                                                                                                               | false      |
| loading                   | 页面是否加载中                                                                                                  | boolean                                                                                                                                               | false      |
| pagination                | 分页组件配置                                                                                                    | boolean\|TablePaginationConfig                                                                                                                        | true       |
| prefixCls                 | 样式名前缀                                                                                                      | string                                                                                                                                                |            |
| renderGroupSection        | 表头渲染方法                                                                                                    | (groupKey?: string \| number, group?: string[] \| number[]) => VNodeChild                                                                             |            | -          |
| renderPagination          | 自定义分页器渲染方法                                                                                            | (paginationProps?: TablePaginationConfig) => VNodeChild                                                                                               |            | -          |
| resizable                 | 是否开启伸缩列功能，需要进行伸缩的列必须要提供 width 的值                                                       | boolean\|Resizable                                                                                                                                    | false      |
| rowExpandable             | 传入该参数时，Table 作行渲染时会调用该函数，返回值用于判断该行是否可展开，返回值为 false 时关闭可展开按钮的渲染 | (record: object) => boolean                                                                                                                           |            | -          |
| rowKey                    | 表格行 key 的取值，可以是字符串或一个函数                                                                       | string<br/>\|(record: RecordType) => string                                                                                                           | 'key'      |
| rowSelection              | 表格行是否可选择，详见 rowSelection                                                                             | object                                                                                                                                                | -          |
| scroll                    | 表格是否可滚动，配置滚动区域的宽或高，详见 scroll                                                               | object                                                                                                                                                | -          |
| showHeader                | 是否显示表头                                                                                                    | boolean                                                                                                                                               | true       |
| size                      | 表格尺寸，影响表格行 `padding`                                                                                  | "default"\|"middle"\|"small"                                                                                                                          | "default"  | -          |
| sticky                    | 固定表头                                                                                                        | boolean \| { top: number }                                                                                                                            | false      | **2.21.0** |
| title                     | 表格标题                                                                                                        | VNodeChild<br/>\|(pageData: RecordType[]) => VNodeChild                                                                                               |            |
| virtualized               | 虚拟化配置                                                                                                      | Virtualized                                                                                                                                           | false      | -          |
| virtualized.itemSize      | 每行的高度                                                                                                      | number\|(index: number) => number                                                                                                                     | 56         | -          |
| virtualized.onScroll      | 虚拟列表滚动回调。                                                                                              | (args: { scrollDirection?: "forward" \| "backward"; scrollOffset?: number; scrollUpdateWasRequested?: boolean }) => void                              | —          |
| onChange                  | 分页、排序、筛选变化时触发。extra.changeType 自 v2.72 支持。                                                    | ({ pagination: TablePaginationConfig, <br/>filters: Array<\*>, sorter: object, extra: { changeType: 'sorter' \| 'filter' \| 'pagination' } }) => void |            |
| onExpand                  | 点击行展开图标时进行触发                                                                                        | (expanded: boolean, record: RecordType, DOMEvent: MouseEvent) => void                                                                                 |            | -          |
| onExpandedRowsChange      | 展开的行变化时触发                                                                                              | (rows: RecordType[]) => void                                                                                                                          |            |
| onGroupedRow              | 类似于 onRow，不过这个参数单独用于定义分组表头的行属性                                                          | (record: RecordType, index: number) => object                                                                                                         |            | -          |
| onHeaderRow               | 设置头部行属性，返回的对象会被合并传给表头行                                                                    | (columns: Column[], index: number) => object                                                                                                          |            |
| onRow                     | 设置行属性，返回的对象会被合并传给表格行                                                                        | (record: RecordType, index: number, rowStatus?: { disabled?: boolean; selected?: boolean }) => object                                                 |            | -          |

### Column

| 属性                          | 说明                                                                                                                                                                                | 类型                                                                                                                                                                     | 默认值      | 版本       |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- | ---------- |
| align                         | 设置列的对齐方式，在 RTL 时会自动切换                                                                                                                                               | 'left' \| 'right' \| 'center'                                                                                                                                            | 'left'      |
| className                     | 列样式名                                                                                                                                                                            | string                                                                                                                                                                   |             |
| children                      | 表头合并时用于子列的设置                                                                                                                                                            | Column[]                                                                                                                                                                 |             |
| colSpan                       | 表头列合并，设置为 0 时，不渲染                                                                                                                                                     | number                                                                                                                                                                   |             |
| dataIndex                     | 列数据在数据项中对应的 key，使用排序或筛选时必传，且需要保持不重复                                                                                                                  | string                                                                                                                                                                   |             |
| defaultFilteredValue          | 筛选的默认值，值为已筛选的 value 数组                                                                                                                                               | any[]                                                                                                                                                                    |             | **2.5.0**  |
| defaultSortOrder              | 排序的默认值，可设置为 'ascend'\|'descend'\|false                                                                                                                                   | boolean\| string                                                                                                                                                         | false       | -          |
| ellipsis                      | 文本缩略，开启后 table-layout 会自动切换为 fixed                                                                                                                                    | boolean\| { showTitle: boolean }                                                                                                                                         | false       | **2.34.0** |
| filterChildrenRecord          | 是否需要对子级数据进行本地过滤，开启该功能后如果子级符合过滤标准，父级即使不符合仍然会保留                                                                                          | boolean                                                                                                                                                                  |             | -          |
| filterDropdown                | 可以自定义筛选菜单，此函数只负责渲染图层，需要自行编写各种交互                                                                                                                      | VNodeChild                                                                                                                                                               |             |
| filterDropdownProps           | 透传给 Dropdown 的属性，详情点击[Dropdown API](/zh-cn/components/dropdown/)                                                                                                         | object                                                                                                                                                                   |             |
| filterDropdownVisible         | 控制 Dropdown 的 visible，详情点击[Dropdown API](/zh-cn/components/dropdown/)                                                                                                       | boolean                                                                                                                                                                  |             |
| filterIcon                    | 自定义 filter 图标                                                                                                                                                                  | boolean\|VNodeChild\|(filtered: boolean) => VNodeChild                                                                                                                   |             |
| filterMultiple                | 是否多选                                                                                                                                                                            | boolean                                                                                                                                                                  | true        |
| filterConfirmMode             | 筛选确认模式。`immediate` 为点击筛选项立即生效；`confirm` 为点击筛选项后需点击确定按钮才生效，此时下拉面板底部会显示确定和重置按钮                                                  | 'immediate' \| 'confirm'                                                                                                                                                 | 'immediate' |
| filteredValue                 | 筛选的受控属性，外界可用此控制列的筛选状态，值为已筛选的 value 数组                                                                                                                 | any[]                                                                                                                                                                    |             |
| filters                       | 表头的筛选菜单项。                                                                                                                                                                  | Filter[]                                                                                                                                                                 |             |
| fixed                         | 列是否固定，可选 true(等效于 left) 'left' 'right'，在 RTL 时会自动切换                                                                                                              | boolean\|string                                                                                                                                                          | false       |
| key                           | 稳定列标识；dataIndex 独立时可省略。                                                                                                                                                | string \| number                                                                                                                                                         | —           |
| render                        | 生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引，@return 里面可以设置表格行/列合并                                                                                 | (text: any, record: RecordType, index: number, { expandIcon?: VNodeChild, selection?: VNodeChild, indentText?: VNodeChild, isHovering?: boolean }) => object\|VNodeChild |             |
| renderFilterDropdown          | 自定义筛选器 dropdown 面板，用法详见自定义筛选器                                                                                                                                    | (props?: RenderFilterDropdownProps) => VNodeChild;                                                                                                                       | -           | **2.52.0** |
| renderFilterDropdownItem      | 自定义每个筛选项渲染方式，用法详见自定义筛选项渲染                                                                                                                                  | ({ value: any, text: any, onChange: Function, level: number, ...otherProps }) => VNodeChild                                                                              | -           | -          |
| resize                        | 是否开启 resize 模式，只有 Table resizable 开启后此属性才会生效                                                                                                                     | boolean                                                                                                                                                                  |             | **2.42.0** |
| showSortTip                   | 是否展示排序提示，如果设置了 sortOrder，排序受控，则该参数不会生效                                                                                                                  | boolean                                                                                                                                                                  | false       | **2.65.0** |
| sortChildrenRecord            | 是否对子级数据进行本地排序                                                                                                                                                          | boolean                                                                                                                                                                  |             | -          |
| sortOrder                     | 排序的受控属性，外界可用此控制列的排序，可设置为 'ascend'\|'descend'\|false                                                                                                         | boolean\| string                                                                                                                                                         | false       |
| sorter                        | 本地比较函数，或设 true 在外部排序；必须指定独立 dataIndex。                                                                                                                        | boolean \| ((a: RecordType, b: RecordType, sortOrder?: 'ascend' \| 'descend') => number)                                                                                 | —           |
| sortIcon                      | 自定义 sort 图标，返回的节点控制了整个排序按钮，包含升序和降序。需根据 sortOrder 控制高亮行为                                                                                       | (props: { sortOrder }) => VNodeChild                                                                                                                                     |             | **2.50.0** |
| shouldCellUpdate              | 自定义控制单元格是否渲染。默认 cell 会深对比 props 和 nextProps 是否变化，来决定是否渲染单元格。如果你的 props 中的 record 比较复杂，建议使用 `shouldCellUpdate` 接管单元格的渲染。 | (props: TableCellProps, prevProps: TableCellProps) => boolean                                                                                                            |             | **2.71.0** |
| title                         | 列头显示文字。传入 function 时，title 将使用函数的返回值；传入其他类型，将会和 sorter、filter 进行聚合。需要搭配 useFullRender 获取函数类型中的 filter 等参数                       | VNodeChild\|({ filter: VNodeChild, sorter: VNodeChild, selection: VNodeChild }) => VNodeChild                                                                            |             | -          |
| useFullRender                 | 是否完全自定义渲染，用法详见完全自定义渲染，开启此功能会造成一定的性能损耗                                                                                                          | boolean                                                                                                                                                                  | false       | -          |
| width                         | 列宽度                                                                                                                                                                              | string \| number                                                                                                                                                         |             |
| onCell                        | 设置单元格属性                                                                                                                                                                      | (record: RecordType, rowIndex: number) => object                                                                                                                         |             |
| onFilter                      | 本地模式下，确定筛选的运行函数。**必须给筛选列设置一个独立的 dataIndex，必须为 dataSource 里面的每条数据项设置独立的 key**                                                          | (filteredValue: any, record: RecordType) => boolean                                                                                                                      |             |
| onFilterDropdownVisibleChange | 自定义筛选菜单可见变化时回调                                                                                                                                                        | (visible: boolean) => void                                                                                                                                               |             |
| onHeaderCell                  | 设置头部单元格属性                                                                                                                                                                  | (column: RecordType, columnIndex: number) => object                                                                                                                      |             |

### rowSelection

| 属性             | 说明                                                                                                                                                                                | 类型                                                                                                                                                                                                                                                                  | 默认值      | 版本       |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------- |
| className        | 所处列样式名                                                                                                                                                                        | string                                                                                                                                                                                                                                                                |             |            |
| checkRelation    | 父子节点选择关联模式。设置为 `'related'` 时，选中父节点会自动选中所有子节点，选中子节点会影响父节点的状态（全选/半选/未选）；默认为 `'unRelated'` 即父子节点选择互不影响            | 'related' \| 'unRelated'                                                                                                                                                                                                                                              | 'unRelated' |            |
| clickRow         | 是否启用点击行选择功能。开启后，点击行任意位置（包括固定列）都会触发行选择/取消选择。被禁用的行（通过 getCheckboxProps 设置）无法通过点击选中。                                     | boolean                                                                                                                                                                                                                                                               | false       | **2.94.0** |
| disabled         | 表头的 `Checkbox` 是否禁用                                                                                                                                                          | boolean                                                                                                                                                                                                                                                               | false       | -          |
| fixed            | 把选择框列固定在左边                                                                                                                                                                | boolean                                                                                                                                                                                                                                                               | false       |            |
| getCheckboxProps | 选择框的默认属性配置                                                                                                                                                                | (record: RecordType) => object                                                                                                                                                                                                                                        |             |            |
| hidden           | 是否隐藏选择列                                                                                                                                                                      | boolean                                                                                                                                                                                                                                                               | false       | -          |
| renderCell       | 自定义渲染勾选框                                                                                                                                                                    | ({ selected: boolean, record: RecordType, originNode: VNodeChild, inHeader: boolean, disabled: boolean, indeterminate: boolean, index?: number, selectRow?: (selected: boolean, e: Event) => void, selectAll?: (selected: boolean, e: Event) => void }) => VNodeChild |             | **2.52.0** |
| selectedRowKeys  | 指定选中项的 key 数组，需要和 onChange 进行配合                                                                                                                                     | string[]                                                                                                                                                                                                                                                              |             |            |
| shouldCellUpdate | 自定义控制单元格是否渲染。默认 cell 会深对比 props 和 nextProps 是否变化，来决定是否渲染单元格。如果你的 props 中的 record 比较复杂，建议使用 `shouldCellUpdate` 接管单元格的渲染。 | (props: TableCellProps, prevProps: TableCellProps) => boolean                                                                                                                                                                                                         |             | **2.71.0** |
| width            | 自定义列表选择框宽度                                                                                                                                                                | string\|number                                                                                                                                                                                                                                                        |             |            |
| onChange         | 选中项发生变化时的回调。第一个参数会保存上次选中的 row keys，即使你做了分页受控或更新了 dataSource FAQ                                                                              | (selectedRowKeys: number[]\|string[], selectedRows: RecordType[]) => void                                                                                                                                                                                             |             |            |
| onHeaderCell     | 设置头部单元格属性                                                                                                                                                                  | (column: RecordType, columnIndex: number) => object                                                                                                                                                                                                                   |             |
| onSelect         | 用户手动点击某行选择框的回调                                                                                                                                                        | (record: RecordType, selected: boolean, selectedRows: RecordType[], nativeEvent: MouseEvent) => void                                                                                                                                                                  |             |            |
| onSelectAll      | 用户手动点击表头选择框的回调，会选中/取消选中 dataSource 里的所有可选行                                                                                                             | (selected: boolean, selectedRows: RecordType[], changedRows: RecordType[]) => void                                                                                                                                                                                    |             |            |

### scroll

| 属性                     | 说明                                                                                                                                                   | 类型           | 默认值 | 版本 |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- | ------ | ---- |
| scrollToFirstRowOnChange | 当分页、排序、筛选变化后是否自动滚动到表格顶部。当设置了 `scroll.y` 时，会重置表格内部滚动位置到顶部；当未设置 `scroll.y` 时，会滚动页面到表格头部位置 | boolean        | false  | -    |
| x                        | 设置横向滚动区域的宽，可以为像素值、百分比或 'max-content'                                                                                             | string\|number |        |      |
| y                        | 设置纵向滚动区域的高，可以为像素值                                                                                                                     | number         |        |      |

### pagination

| 属性                              | 说明                                                                                                                                                            | 类型                                                                                           | 默认值   | 版本 |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | -------- | ---- |
| currentPage                       | 当前页码                                                                                                                                                        | number                                                                                         | -        |      |
| defaultCurrentPage                | 默认的当前页码                                                                                                                                                  | number                                                                                         | 1        | -    |
| formatPageText                    | 翻页区域文案自定义格式化，传 false 关闭文案显示；该项影响表格翻页区域左侧文案显示，不同于 `Pagination` 组件的 `showTotal` 参数，请注意甄别。                    | boolean \| ({ currentStart: number, currentEnd: number, total: number }) => string\|VNodeChild | true     | -    |
| pageSize                          | 每页条数                                                                                                                                                        | number                                                                                         | 10       |      |
| position                          | 位置                                                                                                                                                            | 'bottom'\|'top'\|'both'                                                                        | 'bottom' |      |
| total                             | 数据总数                                                                                                                                                        | number                                                                                         | 0        | -    |
| preventPageChangeOnPageSizeChange | 切换 pageSize 时是否阻止自动调整 currentPage。默认情况下，切换 pageSize 时组件会自动计算新的 currentPage 以保持当前数据位置，设为 true 后由用户自行控制页码变化 | boolean                                                                                        | false    | -    |

### Resizable

| 属性          | 说明                     | 类型                       | 默认值 |
| ------------- | ------------------------ | -------------------------- | ------ |
| onResize      | 表格列改变宽度时触发     | (column: Column) => Column |        |
| onResizeStart | 表格列开始改变宽度时触发 | (column: Column) => Column |        |
| onResizeStop  | 表格列停止改变宽度时触发 | (column: Column) => Column |        |

### 方法

| 名称                 | 描述                              | 版本 |
| -------------------- | --------------------------------- | ---- |
| getCurrentPageData() | 返回当前页记录数组 RecordType[]。 | —    |

### Vue 签名与受控状态

- `TableColumnProps<RecordType>` 描述列回调；`sorter` 为 Boolean 或 `(a, b, sortOrder) => number`，第三参数提供当前排序方向。
- `rowSelection.type` 支持 `checkbox` 和 `radio`；`defaultSelectedRowKeys` 初始化，`selectedRowKeys` 控制当前值。
- `getCurrentPageData(): RecordType[]` 返回当前页记录数组；Vue 实例不暴露 Foundation 或 react-window 内部实例。
- `showHeader`、`hideExpandedColumn` 默认 true，缺省、显式 false、显式 true 不能混用。
- `rowKey` 接受字符串、数字或记录回调，主键为 string / number；`groupBy` 接受字段字符串或记录回调。

### Vue 事件

| 事件               | 参数                                                   |
| ------------------ | ------------------------------------------------------ |
| change             | { pagination, filters, sorter, extra: { changeType } } |
| pageChange         | currentPage, pageSize                                  |
| selectChange       | selectedRowKeys, selectedRows                          |
| select             | record, selected, selectedRows, event                  |
| selectAll          | selected, selectedRows, changedRows                    |
| expand             | expanded, record, event                                |
| expandedRowsChange | expandedRows                                           |

## React → Vue

| React                        | Vue                                                            |
| ---------------------------- | -------------------------------------------------------------- |
| columns[].render             | 返回 VNode 或使用 `#cell="{ text, record, rowIndex, column }"` |
| Column.title / header render | `#headerCell="{ column }"` 或 VNode 回调                       |
| Table.Column JSX children    | 嵌套 Table.Column 模板节点                                     |
| title / footer               | `#title="{ pageData }"` / `#footer="{ pageData }"`             |
| empty                        | `#empty`                                                       |
| expandedRowRender            | `#expandedRow="{ record, index, expanded }"`                   |
| renderGroupSection           | `#groupSection="{ groupKey, group }"`                          |
| renderPagination             | `#pagination="{ pagination }"`                                 |
| useState / useMemo           | `ref` / `shallowRef` / `computed`                              |
| ref                          | `shallowRef<TableExposed \| null>` + `getCurrentPageData()`    |
| className / ReactNode        | `class` 或 `className` / `VNodeChild`                          |

## Accessibility

自定义 components 时保留表头与单元格语义。当前 Vue 实现使用原生 table 容器与 `role="grid"` / `role="treegrid"`、columnheader、row/gridcell、排序按钮名称中的排序方向、展开状态及筛选/排序/选择控件的可访问名称。固定 React 文档描述的 grid/treegrid 与额外行列数量属性不能直接当作这些 Vue 示例的保证；键盘与读屏等价仍需独立浏览器验证。

## RTL/LTR

Table 默认继承 [ConfigProvider](/zh-cn/components/config-provider/) 的 direction，也可以独立设置 `direction="rtl"`。列对齐和固定偏移具有方向性，树缩进和固定列需纳入 Chromium 验收。

## 文案规范

标题应清楚说明表格目的，复杂表格补充上下文。列标题保持简短，英文使用句子大小写；过长时缩略并提供 Tooltip。行操作遵循 [Button](/zh-cn/components/button/) 文案规范。

## 设计变量

默认主题保留上游 `.semi-*` class 和 `--semi-*` Token。引入 `table.css`；通过 `--semi-color-fill-0` 等 Token 自定义背景，避免写死明暗主题颜色。

::token-table{component="table"}
::

## FAQ

**为什么选择或更新数据后回到第一页？** 保持数据和配置引用稳定；shallowRef 仅在数据确实变化时替换数组。应用需要保留页码时控制 `pagination.currentPage`。

**筛选后的数量不对？** 筛选列要有独立 `dataIndex`，记录要有独立 key，并检查 `onFilter` 的返回结果。

**为什么数据没有更新？** shallowRef 需要赋予新数组；不要修改传入 props，也避免无关渲染时重建整份配置。

**为什么行不能选中或展开？** 检查主键、`getCheckboxProps` 禁用规则和 `rowExpandable` 返回值。

**如何交给服务端排序？** 使用 `sorter: true`，读取 `change.sorter`，然后更新受控排序状态和当前页数据。

**如何设置行或单元格样式？** 行使用 `onRow` / `onHeaderRow`，单元格使用 `onCell` / `onHeaderCell`。

**为什么选择回调保留其他页 keys？** `rowSelection.onChange` 第一个参数保留受控分页的选择。只需要本页时可按当前数据过滤 keys，第二参数提供当前可解析的选中记录。

**支持单行选择吗？** 当前公开 Vue 契约支持 `rowSelection.type: 'radio'`；固定上游正文中“不支持”的旧回答已按本地公开类型修正。
