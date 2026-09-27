---
title: 'Table 表格'
description: '表格用于呈现结构化的数据内容，通常会伴随提供对数据进行操作（排序、搜索、分页……）的能力。'
type: 'show'
order: 81
icon: 'doc-table'
---

## 如何使用

往 Table 传入表头 `columns` 和数据 `dataSource` 进行渲染。

<DemoBlock id="zh-CN-show-table-1" title="如何使用" kind="import" />

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/table` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 基本表格

对于表格，最基本的两个参数为 `dataSource` 和 `columns`，前者为数据项，后者为每列的配置，二者皆为数组类型。

<DemoBlock id="zh-CN-show-table-2" title="基本表格" kind="live" />

### 声明式列写法

你也可以通过 `Table.Column` 子组件声明列；不要再用其他组件包裹 `Table.Column`，也不要与 `columns` 配置同时使用。

2.  使用 `Table.Column` 时，请不要与 `columns` 配置同时使用；如果同时使用，仅配置写法生效。

<DemoBlock id="zh-CN-show-table-3" title="声明式列写法" kind="live" />

### 行选择操作

往 Table 传入 [rowSelection](#rowSelection) 即可打开此功能。

- 点击表头的选择框，会选择 `dataSource` 里所有不是 `disabled` 状态的行。选择所有行回调函数为 `onSelectAll`；
- 点击行的选择框会选中当前行。它的回调函数为 `onSelect`；

<DemoBlock id="zh-CN-show-table-4" title="行选择操作" kind="live" />

### 自定义渲染

用户可以使用 `Column.render` 来自定义某一列单元格的渲染，该功能适用于需要渲染较为复杂的单元格内容时。

`render` 函数的第四个参数 `options` 是一个对象，包含以下属性：

- `expandIcon`: 展开图标（当使用树形数据或可展开行时）
- `selection`: 选择框（当开启行选择时）
- `indentText`: 缩进内容（当使用树形数据时）
- `isHovering`: 当前行是否处于悬停状态（v2.98.0 支持）

通过 `isHovering` 参数，可以实现鼠标悬停时显示操作按钮等交互效果。

<DemoBlock id="zh-CN-show-table-5" title="自定义渲染" kind="live" />

### 带分页组件的表格

表格分页目前支持两种模式：受控和非受控模式。

- 受控模式下，分页的状态完全由外部传入，依据为是否往 Table 传入了 `pagination.currentPage` 这个字段。一般情况下，受控模式适用于远程拉取数据并渲染。
- 非受控模式下，Table 默认会将传入的 `dataSource` 长度作为 `total` 传给 Pagination 组件，当然你也可以传入一个 `total` 字段来覆盖 Table 组件的取值，不过我们并不推荐用户在非受控分页模式下传入这个字段。

<DemoBlock id="zh-CN-show-table-6" title="带分页组件的表格" kind="live" />

### 拉取远程数据

正常情况下，数据往往不是一次性获取的，我们会在点击页码、过滤器或者排序按钮时从接口重新获取数据，这种情况下请使用**受控模式**来处理分页。用户需往 Table 传入 `pagination.currentPage` 这个字段，此时分页组件的渲染完全依赖于传入的 `pagination` 对象。

2.  受控模式下，Table 不会对 dataSource 分页，请给 dataSource 传入当前页数据

<DemoBlock id="zh-CN-show-table-7" title="拉取远程数据" kind="live" />

### 固定列或表头

可以通过设置 column 的 `fixed` 属性以及 `scroll.x` 来进行列固定，通过设置 `scroll.y` 来进行表头固定。

如果是固定值，设置为 >=所有固定列宽之和 + 所有表格列宽之和 的数值。

> - 建议指定 `scroll.x` 为大于表格宽度的**固定值**或百分比。如果是固定值，设置为 `>=所有固定列宽之和+所有表格列宽之和` 的数值。
> - 若列头与内容不对齐或出现列重复或者固定列失效的情况，请指定固定列的宽度 `width`，若指定宽度后仍不生效，请尝试建议留一列不设宽度以适应弹性布局，或者检查是否有超长连续字段破坏布局。
> - 请确保表格内部的所有元素在渲染后不会对单元格的高度造成影响（例如含有未加载完成的图片等），这种情况下请给定子元素一个确定的高度，以此确保左右固定列单元格不会错乱。

<DemoBlock id="zh-CN-show-table-8" title="固定列或表头" kind="live" />

通过 `sticky` 属性可以将表头固定在页面顶部。v2.21 版本支持。传入 `top` 时可以控制距离滚动容器的距离。

开启 sticky 后，Table 会自动打开 fixed 布局，列宽将由 `column.width` 决定。没有给定 width 的列宽由浏览器自动分配。

<DemoBlock id="zh-CN-show-table-9" title="固定列或表头" kind="live" />

### 带排序和过滤功能的表头

表格内部集成了过滤器和排序控件，用户可以通过在 Column 中传入 `filters` 以及 `onFilter` 开启表头的过滤器控件展示，传入 `sorter` 开启表头的排序控件的展示。

<DemoBlock id="zh-CN-show-table-10" title="带排序和过滤功能的表头" kind="live" />

sorter 为函数类型时，可以通过函数的第三个参数获取 sortOrder 状态。函数类型为 `(a?: RecordType, b?: RecordType, sortOrder?: 'ascend' | 'descend') => number`。v2.47 版本支持。

可通过 `showSortTip` 属性控制是否展示排序提示，自 v2.65 版本支持，默认为 `false`。当开启提示后，当仅有排序功能时候，鼠标移动至表头时，会展示排序提示；其他情况下，仅鼠标移动至排序图标时，会展示排序提示。

**注**：在使用 `sortOrder` 属性受控排序时，由于无法预测下一个排序顺序，因此 `showSortTip` 不生效，不会展示提示。

<DemoBlock id="zh-CN-show-table-11" title="带排序和过滤功能的表头" kind="live" />

### 自定义表头筛选

如果你需要将筛选器输入框展示在表头，可在 `title` 传入 VNodeChild，配合 `filteredValue` 使用。

<DemoBlock id="zh-CN-show-table-12" title="自定义表头筛选" kind="live" />

### 自定义筛选器

使用 `renderFilterDropdown` 自定义渲染筛选器面板。v2.52 支持。

你可以在用户输入筛选值的时候调用 `setTempFilteredValue` 存储筛选值，在筛选值输入完毕后调用 `confirm` 触发真正的筛选。也可以通过 `confirm({ filteredValue })` 直接筛选。

设置 `tempFilteredValue` 的原因是在需要存储临时筛选值的场景，不需要自己声明一个 state 保存这个临时筛选值。

<DemoBlock id="zh-CN-show-table-13" title="自定义筛选器" kind="code" />

<DemoBlock id="zh-CN-show-table-14" title="自定义筛选器" kind="live" />

### 筛选确认模式

通过设置 `filterConfirmMode='confirm'`，可以让筛选下拉面板支持确认模式。在该模式下：

- 点击筛选项不会立即生效，而是先暂存到临时状态
- 下拉面板底部会显示"确定"和"重置"按钮
- 点击"确定"按钮后才会应用筛选条件并关闭下拉面板
- 点击"重置"按钮会恢复到打开下拉面板时的初始状态（不会关闭面板）

这个功能适用于需要多选筛选条件后再一次性应用的场景，避免每次点击都触发筛选。

<DemoBlock id="zh-CN-show-table-15" title="筛选确认模式" kind="live" />

### 自定义筛选项渲染

支持往 column 中传入 `renderFilterDropdownItem` 自定义每个筛选项的渲染方式。

- `text: VNodeChild` 当前筛选项的文案；
- `value: any` 当前筛选项的值；
- `checked: boolean` 当前筛选项是否已经选中；
- `filteredValue: any[]` 当前所有的筛选值；
- `level: number` 当前筛选项所处层级，如果是嵌套的筛选项，该值会 >= 1；
- `filterMultiple: boolean` 当前筛选项是否为多选。

<DemoBlock id="zh-CN-show-table-16" title="自定义筛选项渲染" kind="live" />

### 可以展开的表格

2.  请务必为每行数据提供一个与其他行值不同的 key，或者使用 rowKey 参数指定一个作为主键的属性名。

#### 一般可展开行

如果需要渲染可以展开的表格，除了需要在 Table 传 `expandedRowRender` 这个方法外，还必须要指定 `rowKey`（默认为 `key`），Table 会根据 `rowKey` 取得行唯一标识符。

- 如果 `rowKey` 为 `Function`，则会把 `rowKey(record)` 的结果作为行唯一 ID
- 如果 `rowKey` 为 `string` 类型，则会把 `record[rowKey]` 作为行唯一 ID

<DemoBlock id="zh-CN-show-table-17" title="一般可展开行" kind="live" />

#### 展开按钮渲染为单独列

默认情况，展开按钮会与第一列文案渲染在同一个单元格内，你可以通过传入 `hideExpandedColumn={false}` 来渲染为单独一列：

<DemoBlock id="zh-CN-show-table-18" title="展开按钮渲染为单独列" kind="live" />

#### 关闭某一行的可展开按钮渲染

可传入 `rowExpandable` 方法，入参为 `record`，判断返回值是否为 `false` 来关闭某一行的可展开按钮的渲染。

<DemoBlock id="zh-CN-show-table-19" title="关闭某一行的可展开按钮渲染" kind="live" />

### 树形数据展示

表格支持树形数据的展示，当数据中有 `children` 字段时会自动展示为树形表格，如果不需要或使用其他字段可以用 `childrenRecordName` 进行配置。另外可以通过设置 `indentSize` 以控制每一层的缩进宽度。

> **注意：**请务必为每行数据提供一个与其他行值不同的 `key`，或者使用 `rowKey` 参数指定一个作为主键的属性名。

#### 树形数据简单示例

<DemoBlock id="zh-CN-show-table-20" title="树形数据简单示例" kind="live" />

#### 行可交换的树形数据

你可以通过改变 `dataSource` 元素的顺序来实现行交换操作。

<DemoBlock id="zh-CN-show-table-21" title="行可交换的树形数据" kind="live" />

#### 树形选择

默认情况下，表格的行选中是各自独立的，你可以通过定义 `selectedRowKeys` 来模拟一个树形选中。

<DemoBlock id="zh-CN-show-table-22" title="树形选择" kind="live" />

#### 树形选择关联（checkRelation）

通过设置 `rowSelection.checkRelation` 为 `'related'`，可以实现父子节点选择关联。选中父节点会自动选中所有子节点，选中子节点会影响父节点的状态（全选/半选/未选）。

<DemoBlock id="zh-CN-show-table-23" title="树形选择关联（checkRelation）" kind="live" />

### 自定义行或单元格事件以及属性

- 传入 `onRow`/`onHeaderRow` 可以定义表格或表头行的原生事件或属性。
- 传入 `column.onCell`/`column.onHeaderCell` 可以定义表格或表头单元格原生事件或属性。

原则上 tr/td/th 上支持的属性或事件都能够被定义。例如下面这个例子：

- 表头的 `tr` 绑定了 `mouseenter` / `mouseleave` 监听器
- 表格的 tr 定义了 `className`
- 表格的第三行定义了 `onClick`

<DemoBlock id="zh-CN-show-table-24" title="自定义行或单元格事件以及属性" kind="live" />

### 实现斑马纹样式

使用 `onRow` 给每行设置一个背景色，实现有斑马纹效果的表格。如果设置了固定列，可以通过 `onCell` 给每列设置一个背景色实现相同效果。

<DemoBlock id="zh-CN-show-table-25" title="实现斑马纹样式" kind="live" />

### 实现表头样式定制

可以通过 Column.onHeaderCell 返回特定 style 或 className，定制表头的样式
如下例子，通过传入 backgroundColor 改变了表头背景色

<DemoBlock id="zh-CN-show-table-26" title="实现表头样式定制" kind="live" />

### 实现单元格 Hover 样式定制

Table 默认为整行配置 Hover 样式，如果你需要修改相关样式可以通过 CSS 覆盖的方式自行实现。
如下例子，通过 CSS 覆盖，将可 Hover 的背景色或者由行高亮改为 Cell 单元格高亮

<DemoBlock id="zh-CN-show-table-27" title="实现单元格 Hover 样式定制" kind="code" />

<DemoBlock id="zh-CN-show-table-28" title="实现单元格 Hover 样式定制" kind="live" />

### 单元格缩略

使用 `ellipsis` 可以让单元格自动实现缩略效果。v2.34.0 支持。

<DemoBlock id="zh-CN-show-table-29" title="单元格缩略" kind="live" />

设置 `ellipsis.showTitle` 为 false 可以隐藏默认原生的 HTML title。配合 `column.render` 可以自定义内容提示。

<DemoBlock id="zh-CN-show-table-30" title="单元格缩略" kind="live" />

### 可伸缩列

#### 基本伸缩列

对于一些内容比较多的列，可以选择打开伸缩列功能，在表头进行拉拽实现列宽的实时变化。

不过你需要注意一些参数：

- `resizable` 设定为 `true` 或者一个 `object`
- `columns` 里需要伸缩功能的列都要指定 `width` 这个字段（如果不传，该列不具备伸缩功能，且其列宽度会被浏览器自动调整）
- `column.resize` 可以在 resizable 开启后生效，设置为 false 后，列不再支持伸缩。v2.42 支持

> 与固定列同时使用时，需指定某一列不设置宽度

> 不推荐与 `scroll.x` 同时使用，scroll.x 指定表格是有宽度范围的，而伸缩列会拓展列宽，这可能会导致表格对不齐

<DemoBlock id="zh-CN-show-table-31" title="基本伸缩列" kind="live" />

#### 进阶的伸缩列

`resizable` 还能为一个 `Object`，包括三个事件方法：

- `onResize`
- `onResizeStart`
- `onResizeStop`

分别触发于`列宽改变中`、`开始改变`和`结束改变`三个时机。开发者可以选择在这个时机修改 column，例如在拉拽时增加一个拖动时的竖线效果等，如下例。

<DemoBlock id="zh-CN-show-table-32" title="进阶的伸缩列" kind="live" />

本例中使用的 CSS 样式定义：

<DemoBlock id="zh-CN-show-table-33" title="进阶的伸缩列" kind="code" />

### 拖拽排序

使用 [dnd-kit](https://github.com/clauderic/dnd-kit/tree/master) 搭配 [`components`](https://github.com/aifuxi/semi-ui-vue/blob/340c93e4e1612a879be869c43ad7a9a85ab5a302/packages/semi-ui/table/interface.ts#L200) API 可轻松实现拖拽排序。v2.58 版本支持。

<DemoBlock id="zh-CN-show-table-34" title="拖拽排序" kind="live" />

### 表格分组

对于一些数据需要分组展示的表格，可以传入 `groupBy` 定义分组规则，使用 `renderGroupSection` 来定义分组表头的渲染。

> **注意：**请务必为每行数据提供一个与其他行值不同的 `key`，或者使用 `rowKey` 参数指定一个作为主键的属性名。

<DemoBlock id="zh-CN-show-table-35" title="表格分组" kind="live" />

### 虚拟化表格

虚拟化可用于需要渲染大规模数据的场景，通过配置 `virtualized` 参数来开启这个功能。需要注意的是：

- 必须传递 `scroll.y`（number）与 `style.width`（number）；
- 需要传递每行的高度 `virtualized.itemSize`（不传时普通行高默认为 `56`，组头行高默认为 `56`），可以为如下类型：
- `number`
- `(index, { sectionRow?: boolean, expandedRow?: boolean }) => number`
- 表格分组虚拟化已支持
- Table 的虚拟化模式支持通过 `virtualized` 对象补充配置，例如 `overscanCount`。
- 如果需要使用 `VariableSizeList` 的 API，可以传入`getVirtualizedListRef` 获取对应 ref，需要版本 >= `1.20`

以下为渲染 1000 条数据的示例。

<DemoBlock id="zh-CN-show-table-36" title="虚拟化表格" kind="live" />

### 无限滚动

基于虚拟化特性，通过传入 `virtualized.onScroll` 我们可以实现无限滚动加载数据。

<DemoBlock id="zh-CN-show-table-37" title="无限滚动" kind="live" />

### 受控的动态表格

<DemoBlock id="zh-CN-show-table-38" title="受控的动态表格" kind="live" />

### 完全自定义渲染

一般情况下，使用 `Column.render` 即可，但是你也可以通过传递 `Column.useFullRender=true` 来开启完全自定义渲染模式，此时复选框按钮、展开按钮、缩进等组件将会透传至 `Column.title` 与 `Column.render` 方法中，你可以进一步来定义表头和单元格的内容渲染方式。

其中 `Column.title` 接受的入参为：

<DemoBlock id="zh-CN-show-table-39" title="完全自定义渲染" kind="code" />

`Column.render` 第四个入参为一个 object，结构如下：

<DemoBlock id="zh-CN-show-table-40" title="完全自定义渲染" kind="code" />

> 下方的例子则是将复选框与内容渲染至同一单元格和表头中。

<DemoBlock id="zh-CN-show-table-41" title="完全自定义渲染" kind="live" />

### 表头合并

用户可以通过表头合并功能进行表头的分组，表头合并支持与固定列、虚拟化、数据分组、列伸缩等功能复合使用，也同时支持 `Table.Column` 或配置式写法。

#### 合并表头配置式写法

<DemoBlock id="zh-CN-show-table-42" title="合并表头配置式写法" kind="live" />

#### 合并表头 声明式列写法

<DemoBlock id="zh-CN-show-table-43" title="合并表头 声明式列写法" kind="live" />

### 行列合并

- 表头除了通过嵌套列配置进行合并外，可通过设置 `column.colSpan` 进行表头的列合并。
- 表格支持行/列合并，使用 `render` 里的单元格属性 `colSpan` 或者 `rowSpan` 设值为 0 时，设置的表格不会渲染。

<DemoBlock id="zh-CN-show-table-44" title="行列合并" kind="code" />

<DemoBlock id="zh-CN-show-table-45" title="行列合并" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/table/types.ts` 的公开类型为准。

#### Vue 事件

**Table**

| 事件               | 参数                                            | 说明                 |
| ------------------ | ----------------------------------------------- | -------------------- |
| change             | [changeInfo: TableChangeInfo&lt;RecordType&gt;] | 分页、排序或筛选变化 |
| expand             | [expanded, record, event?: MouseEvent]          | 展开状态变化         |
| expandedRowsChange | [expandedRows: RecordType[]]                    | 展开行集合变化       |
| pageChange         | [currentPage: number, pageSize: number]         | 分页变化             |
| select             | [record, selected, selectedRows, event?]        | 选择单行             |
| selectAll          | [selected, selectedRows, changedRows]           | 全选状态变化         |
| selectChange       | [selectedRowKeys, selectedRows]                 | 选择集合变化         |

#### Vue 插槽

**Table**

| 插槽           | 作用域参数                         | 说明                |
| -------------- | ---------------------------------- | ------------------- |
| default        | {}                                 | 声明式 Table.Column |
| cell           | { column, record, rowIndex, text } | 单元格内容          |
| headerCell     | { column }                         | 表头单元格          |
| expandedRow    | { expanded, index, record }        | 展开行              |
| title / footer | { pageData }                       | 表格标题或尾部      |
| pagination     | { pagination }                     | 分页器              |
| groupSection   | { group, groupKey }                | 分组表头            |
| empty          | {}                                 | 空状态内容          |

## Table

| 属性                      | 说明                                                                                                            | 类型                                                                                                                         | 默认值             | 版本       |
| ------------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------ | ---------- |
| bordered                  | 是否展示外边框和列边框                                                                                          | boolean                                                                                                                      | false              |            |
| childrenRecordName        | 树形表格 dataSource 中每行元素中表示子级数据的字段，默认为 children                                             | string                                                                                                                       | 'children'         |            |
| class                     | —                                                                                                               | HTMLAttributes['class']                                                                                                      | —                  |            |
| className                 | 最外层样式名                                                                                                    | HTMLAttributes['class']                                                                                                      | —                  |            |
| clickGroupedRowToExpand   | 点击分组表头行时分组内容展开或收起                                                                              | boolean                                                                                                                      | —                  | -          |
| columns                   | 表格列的配置描述，详见[Column](#Column)                                                                         | TableColumn&lt;RecordType&gt;[]                                                                                              | []                 |            |
| components                | 覆盖 Table 的组成元素，如 table, body，row，td，th 等                                                           | TableComponents                                                                                                              | —                  |            |
| dataSource                | 数据。**请为每一条数据分配一个独立的 key，或使用 rowKey 指定一个作为主键的属性名**                              | RecordType[]                                                                                                                 | []                 |            |
| defaultExpandAllGroupRows | 默认是否展开分组行，动态加载数据时不生效                                                                        | boolean                                                                                                                      | false              | -          |
| defaultExpandAllRows      | 默认是否展开所有行，动态加载数据时不生效                                                                        | boolean                                                                                                                      | false              |            |
| defaultExpandedRowKeys    | 默认展开的行 key 数组，，动态加载数据时不生效                                                                   | TableRowKey[]                                                                                                                | []                 |            |
| direction                 | RTL、LTR 方向，默认值等于 ConfigProvider direction，可在此单独配置 Table 的 direction                           | TableDirection                                                                                                               | —                  | **2.31.0** |
| empty                     | 无数据时展示的内容                                                                                              | VNodeChild                                                                                                                   | '暂无数据'         |            |
| expandAllGroupRows        | 是否展开分组行                                                                                                  | boolean                                                                                                                      | false              | -          |
| expandAllRows             | 是否展开所有行                                                                                                  | boolean                                                                                                                      | false              | -          |
| expandCellFixed           | 展开图标所在列是否固定，与 Column 中的 fixed 取值相同                                                           | TableFixed                                                                                                                   | false              |            |
| expandIcon                | 自定义展开按钮，传 `false` 关闭默认的渲染                                                                       | boolean \| VNodeChild \| ((expanded?: boolean) =&gt; VNodeChild)                                                             | —                  |            |
| expandedRowKeys           | 展开的行，传入此参数时行展开功能将受控                                                                          | TableRowKey[]                                                                                                                | —                  |            |
| expandedRowRender         | 额外的展开行。**请为每一条数据分配一个独立的 key，或使用 rowKey 指定一个作为主键的属性名**                      | ( record?: RecordType, index?: number, expanded?: boolean, ) =&gt; TableExpandedRowRenderResult                              | —                  |            |
| expandRowByClick          | 点击行时是否展开可展开行                                                                                        | boolean                                                                                                                      | false              | -          |
| footer                    | 表格尾部                                                                                                        | VNodeChild \| ((pageData?: RecordType[]) =&gt; VNodeChild)                                                                   | —                  |            |
| getVirtualizedListRef     | 返回虚拟化表格所用 VariableSizeList 的 ref，仅在配置 virtualized 时有效                                         | (ref: { current: TableVirtualizedListRef \| null }) =&gt; void                                                               | null }) =&gt; void |            |
| groupBy                   | 分组依据，一般为 dataSource 元素中某个键名或者返回值为字符串、数字的一个方法                                    | string \| ((record: RecordType) =&gt; string \| number)                                                                      | —                  | -          |
| headerStyle               | 表头单元格的内联样式（会应用到所有表头 th，包括 fixed 表头）                                                    | StyleValue                                                                                                                   | -                  | **2.97.0** |
| hideExpandedColumn        | 当表格可展开时，展开按钮默认会与第一列文案渲染在同一个单元格内，设为 false 时默认将展开按钮单独作为一列渲染     | boolean                                                                                                                      | true               |            |
| id                        | —                                                                                                               | string                                                                                                                       | —                  |            |
| indentSize                | 树形结构 TableCell 的缩进大小                                                                                   | number                                                                                                                       | 20                 |            |
| keepDOM                   | 折叠行时是否不销毁被折叠的 DOM                                                                                  | boolean                                                                                                                      | false              |            |
| loading                   | 页面是否加载中                                                                                                  | boolean                                                                                                                      | false              |            |
| onGroupedRow              | 类似于 onRow，不过这个参数单独用于定义分组表头的行属性                                                          | (record?: RecordType, index?: number) =&gt; TableRowAttributes                                                               | —                  | -          |
| onHeaderRow               | 设置头部行属性，返回的对象会被合并传给表头行                                                                    | (columns?: TableColumn&lt;RecordType&gt;[], index?: number) =&gt; TableRowAttributes                                         | —                  |            |
| onRow                     | 设置行属性，返回的对象会被合并传给表格行                                                                        | ( record?: RecordType, index?: number, rowStatus?: { disabled?: boolean; selected?: boolean }, ) =&gt; TableRowAttributes    | —                  | -          |
| pagination                | 分页组件配置                                                                                                    | boolean \| TablePaginationConfig                                                                                             | true               |            |
| prefixCls                 | 样式名前缀                                                                                                      | string                                                                                                                       | —                  |            |
| renderGroupSection        | 表头渲染方法                                                                                                    | ( groupKey?: string \| number, group?: TableRowKey[], ) =&gt; VNodeChild \| { children: VNodeChild; [key: string]: unknown } | —                  | -          |
| renderPagination          | 自定义分页器渲染方法                                                                                            | (paginationProps: TablePaginationConfig) =&gt; VNodeChild                                                                    | —                  | -          |
| resizable                 | 是否开启伸缩列功能，需要进行伸缩的列必须要提供 width 的值                                                       | boolean \| TableResizable&lt;RecordType&gt;                                                                                  | false              |            |
| rowExpandable             | 传入该参数时，Table 作行渲染时会调用该函数，返回值用于判断该行是否可展开，返回值为 false 时关闭可展开按钮的渲染 | (record?: RecordType) =&gt; boolean                                                                                          | —                  | -          |
| rowKey                    | 表格行 key 的取值，可以是字符串或一个函数                                                                       | string \| number \| ((record?: RecordType) =&gt; TableRowKey)                                                                | 'key'              |            |
| rowSelection              | 表格行是否可选择，详见 [rowSelection](#rowSelection)                                                            | boolean \| TableRowSelection&lt;RecordType&gt;                                                                               | -                  |            |
| rowSpanHover              | —                                                                                                               | boolean                                                                                                                      | —                  |            |
| scroll                    | 表格是否可滚动，配置滚动区域的宽或高，详见 [scroll](#scroll)                                                    | TableScroll                                                                                                                  | -                  |            |
| showHeader                | 是否显示表头                                                                                                    | boolean                                                                                                                      | true               |            |
| size                      | 表格尺寸，影响表格行 `padding`                                                                                  | TableSize                                                                                                                    | "default"          | -          |
| sticky                    | 固定表头                                                                                                        | boolean \| TableSticky                                                                                                       | false              | **2.21.0** |
| style                     | —                                                                                                               | StyleValue                                                                                                                   | —                  |            |
| title                     | 表格标题                                                                                                        | VNodeChild \| ((pageData?: RecordType[]) =&gt; VNodeChild)                                                                   | —                  |            |
| virtualized               | 虚拟化配置                                                                                                      | TableVirtualized                                                                                                             | false              | -          |

### headerStyle 示例

`headerStyle` 会应用到所有表头 `` 元素，包括 fixed 表头。

<DemoBlock id="zh-CN-show-table-46" title="headerStyle 示例" kind="code" />

一些上面用到的类型定义：

<DemoBlock id="zh-CN-show-table-47" title="headerStyle 示例" kind="code" />

RecordType 为 Table 和 Column 的泛型参数，默认为 object 类型。你可以这样使用 RecordType：

<DemoBlock id="zh-CN-show-table-48" title="headerStyle 示例" kind="code" />

## onHeaderRow / onRow 用法

`onHeaderRow` 中可以返回 th 支持的属性或者事件 `onRow` 中可以返回 tr 支持的属性或者事件

`onRow` 的第三个参数 `rowStatus` 可以获取当前行的状态信息，包括 `disabled` 和 `selected` 属性（v2.61.0 支持）。这在需要根据行的选中或禁用状态执行不同逻辑时非常有用，例如点击行时判断是否允许选中。

<DemoBlock id="zh-CN-show-table-49" title="onHeaderRow / onRow 用法" kind="code" />

## Column

| 属性                          | 说明                                                                                                                                                                                       | 类型                                                                                                           | 默认值      | 版本       |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- | ----------- | ---------- |
| align                         | 设置列的对齐方式，在 RTL 时会自动切换                                                                                                                                                      | TableAlign                                                                                                     | 'left'      |            |
| children                      | 表头合并时用于子列的设置                                                                                                                                                                   | TableColumn&lt;RecordType&gt;[] \| undefined                                                                   | —           |            |
| className                     | 列样式名                                                                                                                                                                                   | string                                                                                                         | —           |            |
| colSpan                       | 表头列合并，设置为 0 时，不渲染                                                                                                                                                            | number                                                                                                         | —           |            |
| dataIndex                     | 列数据在数据项中对应的 key，使用排序或筛选时必传，且需要保持不重复                                                                                                                         | string                                                                                                         | —           |            |
| defaultFilteredValue          | 筛选的默认值，值为已筛选的 value 数组                                                                                                                                                      | unknown[]                                                                                                      | —           | **2.5.0**  |
| defaultSortOrder              | 排序的默认值，可设置为 'ascend'\|'descend'\|false                                                                                                                                          | TableSortOrder                                                                                                 | false       | -          |
| ellipsis                      | 文本缩略，开启后 table-layout 会自动切换为 fixed                                                                                                                                           | boolean \| { showTitle?: boolean }                                                                             | false       | **2.34.0** |
| filterChildrenRecord          | 是否需要对子级数据进行本地过滤，开启该功能后如果子级符合过滤标准，父级即使不符合仍然会保留                                                                                                 | boolean                                                                                                        | —           | -          |
| filterConfirmMode             | 筛选确认模式。`immediate` 为点击筛选项立即生效；`confirm` 为点击筛选项后需点击确定按钮才生效，此时下拉面板底部会显示确定和重置按钮                                                         | TableFilterConfirmMode                                                                                         | 'immediate' |            |
| filterDropdown                | 可以自定义筛选菜单，此函数只负责渲染图层，需要自行编写各种交互                                                                                                                             | VNodeChild                                                                                                     | —           |            |
| filterDropdownProps           | 透传给 Dropdown 的属性，详情点击[Dropdown API](/zh-CN/show/dropdown#Dropdown)                                                                                                              | Record&lt;string, unknown&gt;                                                                                  | —           |            |
| filterDropdownVisible         | 控制 Dropdown 的 visible，详情点击[Dropdown API](/zh-CN/show/dropdown#Dropdown)                                                                                                            | boolean                                                                                                        | —           |            |
| filterIcon                    | 自定义 filter 图标                                                                                                                                                                         | boolean \| VNodeChild \| ((filtered: boolean) =&gt; VNodeChild)                                                | —           |            |
| filterMultiple                | 是否多选                                                                                                                                                                                   | boolean                                                                                                        | true        |            |
| filteredValue                 | 筛选的受控属性，外界可用此控制列的筛选状态，值为已筛选的 value 数组                                                                                                                        | unknown[] \| undefined                                                                                         | —           |            |
| filters                       | 表头的筛选菜单项。                                                                                                                                                                         | TableFilter[]                                                                                                  | —           |            |
| fixed                         | 列是否固定，可选 true(等效于 left) 'left' 'right'，在 RTL 时会自动切换                                                                                                                     | TableFixed                                                                                                     | false       |            |
| key                           | 列的稳定 key；如果已经设置唯一的 dataIndex，可以忽略该属性                                                                                                                                 | TableRowKey                                                                                                    | —           |            |
| onCell                        | 设置单元格属性                                                                                                                                                                             | (record?: RecordType, rowIndex?: number) =&gt; TableCellAttributes                                             | —           |            |
| onFilter                      | 本地模式下，确定筛选的运行函数。**必须给筛选列设置一个独立的 dataIndex，必须为 dataSource 里面的每条数据项设置独立的 key**                                                                 | (filteredValue?: unknown, record?: RecordType) =&gt; boolean                                                   | —           |            |
| onFilterDropdownVisibleChange | 自定义筛选菜单可见变化时回调                                                                                                                                                               | (visible?: boolean) =&gt; void                                                                                 | —           |            |
| onHeaderCell                  | 设置头部单元格属性                                                                                                                                                                         | ( column?: TableColumn&lt;RecordType&gt;, columnIndex?: number, rowIndex?: number, ) =&gt; TableCellAttributes | —           |            |
| render                        | 生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引，@return 里面可以设置表格行/列合并                                                                                        | TableColumnRender&lt;RecordType&gt;                                                                            | —           |            |
| renderFilterDropdown          | 自定义筛选器 dropdown 面板，用法详见[自定义筛选器](#自定义筛选器)                                                                                                                          | (props?: Record&lt;string, unknown&gt;) =&gt; VNodeChild                                                       | -           | **2.52.0** |
| renderFilterDropdownItem      | 自定义每个筛选项渲染方式，用法详见[自定义筛选项渲染](#自定义筛选项渲染)                                                                                                                    | (props?: Record&lt;string, unknown&gt;) =&gt; VNodeChild                                                       | -           | -          |
| resize                        | 是否开启 resize 模式，只有 Table resizable 开启后此属性才会生效                                                                                                                            | boolean                                                                                                        | —           | **2.42.0** |
| shouldCellUpdate              | 自定义控制单元格是否渲染。默认 cell 会深对比 props 和 nextProps 是否变化，来决定是否渲染单元格。如果你的 props 中的 record 比较复杂，建议使用 `shouldCellUpdate` 接管单元格的渲染。        | (next: Record&lt;string, unknown&gt;, previous: Record&lt;string, unknown&gt;) =&gt; boolean                   | —           | **2.71.0** |
| showSortTip                   | 是否展示排序提示，如果设置了 sortOrder，排序受控，则该参数不会生效                                                                                                                         | boolean                                                                                                        | false       | **2.65.0** |
| sortChildrenRecord            | 是否对子级数据进行本地排序                                                                                                                                                                 | boolean                                                                                                        | —           | -          |
| sorter                        | 排序函数，本地排序使用一个函数 (参考 Array.sort 的 compareFunction)，需要服务端排序可设为 true。**必须给排序列设置一个独立的 dataIndex，必须为 dataSource 里面的每条数据项设置独立的 key** | boolean \| ((a: RecordType, b: RecordType, sortOrder?: 'ascend' \| 'descend') =&gt; number)                    | true        |            |
| sortIcon                      | 自定义 sort 图标，返回的节点控制了整个排序按钮，包含升序和降序。需根据 sortOrder 控制高亮行为                                                                                              | (props: { sortOrder: TableSortOrder }) =&gt; VNodeChild                                                        | —           | **2.50.0** |
| sortOrder                     | 排序的受控属性，外界可用此控制列的排序，可设置为 'ascend'\|'descend'\|false                                                                                                                | TableSortOrder                                                                                                 | false       |            |
| title                         | 列头显示文字。传入 function 时，title 将使用函数的返回值；传入其他类型，将会和 sorter、filter 进行聚合。需要搭配 useFullRender 获取函数类型中的 filter 等参数                              | VNodeChild \| ((props?: TableColumnTitleProps) =&gt; VNodeChild)                                               | —           | -          |
| useFullRender                 | 是否完全自定义渲染，用法详见[完全自定义渲染](#完全自定义渲染)，开启此功能会造成一定的性能损耗                                                                                              | boolean                                                                                                        | false       | -          |
| width                         | 列宽度                                                                                                                                                                                     | string \| number                                                                                               | —           |            |

一些上面用到的类型定义：

<DemoBlock id="zh-CN-show-table-50" title="Column" kind="code" />

## Column.onCell / onHeaderCell 用法

与 `onRow`、`onHeaderRow类似`，在 `column.onCell` `column.onHeaderCell` 中也能返回 td/th 支持的属性或事件

## rowSelection

| 属性                   | 说明                                                                                                                                                                                | 类型                                                                                                                      | 默认值      | 版本       |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------- |
| checkRelation          | 父子节点选择关联模式。设置为 `'related'` 时，选中父节点会自动选中所有子节点，选中子节点会影响父节点的状态（全选/半选/未选）；默认为 `'unRelated'` 即父子节点选择互不影响            | TableCheckRelation                                                                                                        | 'unRelated' |            |
| className              | 所处列样式名                                                                                                                                                                        | string                                                                                                                    | —           |            |
| clickRow               | 是否启用点击行选择功能。开启后，点击行任意位置（包括固定列）都会触发行选择/取消选择。被禁用的行（通过 getCheckboxProps 设置）无法通过点击选中。                                     | boolean                                                                                                                   | false       | **2.94.0** |
| defaultSelectedRowKeys | —                                                                                                                                                                                   | TableRowKey[]                                                                                                             | —           |            |
| disabled               | 表头的 `Checkbox` 是否禁用                                                                                                                                                          | boolean                                                                                                                   | false       | -          |
| fixed                  | 把选择框列固定在左边                                                                                                                                                                | TableFixed                                                                                                                | false       |            |
| getCheckboxProps       | 选择框的默认属性配置                                                                                                                                                                | ( record: RecordType, ) =&gt; Omit&lt;CheckboxProps, 'checked' \| 'defaultChecked' \| 'indeterminate' \| 'modelValue'&gt; | —           |            |
| hidden                 | 是否隐藏选择列                                                                                                                                                                      | boolean                                                                                                                   | false       | -          |
| key                    | —                                                                                                                                                                                   | TableRowKey                                                                                                               | —           |            |
| onCell                 | —                                                                                                                                                                                   | TableColumn&lt;RecordType&gt;['onCell']                                                                                   | —           |            |
| onChange               | 选中项发生变化时的回调。第一个参数会保存上次选中的 row keys，即使你做了分页受控或更新了 dataSource [FAQ](#faq)                                                                      | (selectedRowKeys?: TableRowKey[], selectedRows?: RecordType[]) =&gt; void                                                 | —           |            |
| onHeaderCell           | 设置头部单元格属性                                                                                                                                                                  | TableColumn&lt;RecordType&gt;['onHeaderCell']                                                                             | —           |            |
| onSelect               | 用户手动点击某行选择框的回调                                                                                                                                                        | ( record?: RecordType, selected?: boolean, selectedRows?: RecordType[], nativeEvent?: MouseEvent, ) =&gt; void            | —           |            |
| onSelectAll            | 用户手动点击表头选择框的回调，会选中/取消选中 dataSource 里的所有可选行                                                                                                             | ( selected?: boolean, selectedRows?: RecordType[], changedRows?: RecordType[], ) =&gt; void                               | —           |            |
| renderCell             | 自定义渲染勾选框                                                                                                                                                                    | (args: TableRowSelectionRenderCellArgs&lt;RecordType&gt;) =&gt; VNodeChild                                                | —           | **2.52.0** |
| selectedRowKeys        | 指定选中项的 key 数组，需要和 onChange 进行配合                                                                                                                                     | TableRowKey[]                                                                                                             | —           |            |
| shouldCellUpdate       | 自定义控制单元格是否渲染。默认 cell 会深对比 props 和 nextProps 是否变化，来决定是否渲染单元格。如果你的 props 中的 record 比较复杂，建议使用 `shouldCellUpdate` 接管单元格的渲染。 | TableColumn&lt;RecordType&gt;['shouldCellUpdate']                                                                         | —           | **2.71.0** |
| title                  | —                                                                                                                                                                                   | VNodeChild                                                                                                                | —           |            |
| type                   | —                                                                                                                                                                                   | 'checkbox' \| 'radio'                                                                                                     | —           |            |
| width                  | 自定义列表选择框宽度                                                                                                                                                                | string \| number                                                                                                          | —           |            |

## scroll

| 属性                     | 说明                                                                                                                                                   | 类型             | 默认值 | 版本 |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- | ------ | ---- |
| x                        | 设置横向滚动区域的宽，可以为像素值、百分比或 'max-content'                                                                                             | string \| number | —      |      |
| y                        | 设置纵向滚动区域的高，可以为像素值                                                                                                                     | string \| number | —      |      |
| scrollToFirstRowOnChange | 当分页、排序、筛选变化后是否自动滚动到表格顶部。当设置了 `scroll.y` 时，会重置表格内部滚动位置到顶部；当未设置 `scroll.y` 时，会滚动页面到表格头部位置 | boolean          | false  | -    |

## pagination

翻页组件配置。`pagination` 建议不要使用字面量写法。

注意：pagination.onChange 设置后，Table onChange 不再响应分页器变化。

| 属性                              | 说明                                                                                                                                                            | 类型                                                                                           | 默认值   | 版本 |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | -------- | ---- |
| currentPage                       | 当前页码                                                                                                                                                        | number                                                                                         | -        |      |
| defaultCurrentPage                | 默认的当前页码                                                                                                                                                  | number                                                                                         | 1        | -    |
| formatPageText                    | 翻页区域文案自定义格式化，传 false 关闭文案显示；该项影响表格翻页区域左侧文案显示，不同于 `Pagination` 组件的 `showTotal` 参数，请注意甄别。                    | boolean \| ({ currentStart: number, currentEnd: number, total: number }) => string\|VNodeChild | true     | -    |
| pageSize                          | 每页条数                                                                                                                                                        | number                                                                                         | 10       |      |
| position                          | 位置                                                                                                                                                            | 'bottom'\|'top'\|'both'                                                                        | 'bottom' |      |
| total                             | 数据总数                                                                                                                                                        | number                                                                                         | 0        | -    |
| preventPageChangeOnPageSizeChange | 切换 pageSize 时是否阻止自动调整 currentPage。默认情况下，切换 pageSize 时组件会自动计算新的 currentPage 以保持当前数据位置，设为 true 后由用户自行控制页码变化 | boolean                                                                                        | false    | -    |

其他配置详见[Pagination](/zh-CN/navigation/pagination#API参考)

## Resizable

`resizable` 对象型的参数，主要包括一些表格列伸缩时的事件方法。这些事件方法都可以返回一个对象，该对象会和最终的 column 合并。

| 属性             | 说明                     | 类型                                                                                               | 默认值 |
| ---------------- | ------------------------ | -------------------------------------------------------------------------------------------------- | ------ |
| handlerClassName | —                        | string                                                                                             | —      |
| onResize         | 表格列改变宽度时触发     | (column: TableColumn&lt;RecordType&gt;) =&gt; Partial&lt;TableColumn&lt;RecordType&gt;&gt; \| void | —      |
| onResizeStart    | 表格列开始改变宽度时触发 | (column: TableColumn&lt;RecordType&gt;) =&gt; Partial&lt;TableColumn&lt;RecordType&gt;&gt; \| void | —      |
| onResizeStop     | 表格列停止改变宽度时触发 | (column: TableColumn&lt;RecordType&gt;) =&gt; Partial&lt;TableColumn&lt;RecordType&gt;&gt; \| void | —      |

## 方法

通过 ref 可以访问到 Table 提供的一些内部方法：

<DemoBlock id="zh-CN-show-table-51" title="方法" kind="code" />

| 名称                 | 描述                                                                                                 | 版本 |
| -------------------- | ---------------------------------------------------------------------------------------------------- | ---- |
| getCurrentPageData() | 返回当前页的数据对象：{ dataSource: RecordType[], groups: Map<{groupKey: string, recordKeys: Set}> } | -    |

## Accessibility

### ARIA

- 表格的 role 为 grid，树形表格的 role 为 treegrid
- 行的 role 为 row，单元格的 role 为 gridcell
- 表格新增了 aria-rowcount 和 aria-colcount 属性表示行和列的数量
- 行新增了 aria-rowindex 表示当前属于第几行，第一行为 1
- 树形表格的行具有 aria-level 表示当前行的树形层级，第一层为 1
- 可展开表格行具有 aria-expanded 属性，表示当前行是否展开
- 单元格的新增了 aria-colindex 表示当前格子属于第几列，第一列为 1
- 列的筛选和排序按钮添加了 aria-label，行的选择按钮添加了 aria-label 属性

## RTL/LTR

- Table 的 RTL 默认值为 [ConfigProvider](/zh-CN/other/configprovider) direction，可以通过 Table direction 覆盖
- Table 列的 align 与 fixed 属性会在 RTL 时会自动切换，left <-> right，固定列的 RTL 功能于 v2.31 版本支持
- Table 的树形数据暂不支持 RTL；Chrome、Safari 与 Firefox 的表现存在差异。

## 文案规范

- 表格标题
- 表格标题应清晰的让用户感知到表格的目的；
- 为复杂表格添加描述，为用户提供更多关于表格的上下文信息；
- 使用句子大小写；
- 列标题
- 保持列标题简洁，建议使用 1-2 个词作为列标题；
- 当列标题较长时，建议 2 行显示，剩余文字缩略并在 Tooltip 中显示完全；
- 采用 Sentence case 的大小写规则；
- 列标题使用句子大小写；
- 表格操作
- 可以遵循 [Button 的文案规范](/zh-CN/basic/button#%E6%96%87%E6%A1%88%E8%A7%84%E8%8C%83)

## FAQ

- **点击第二页的行选择按钮，会跳转到第一页？**

Table 的 dataSource 更新后，会将页码重置到初始态。请检查数据源是否在组件渲染时发生了变化。

```typescript
function App() {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    // ✅ 正确
    const getData = () => {
      // fetch data
      const newData = fetch(/**/);
      // set data
      setDataSource(dataSource);
    };

    getData();
  }, []);

  // ❌ 错误
  const data = [];

  return;
}
```

- **筛选后的数据条数不对？**

请检查你的筛选列和数据源是否配置正确。

筛选列需设置独立的 dataIndex，同时 dataSource 需要设置独立的 key，请参考 dataSource API。否则筛选功能无法正常工作。

- **表格数据为何没有更新？**

Table 组件目前所有参数都为浅层对比，也就是说如果该参数值类型为一个 Array 或者 Object，你需要手动改变其引用才能触发更新。同理，如果你不想触发额外更新，尽量不要直接在传参的时候使用字面量或是在 render 过程中定义引用型参数值：

```text
// ...render() {
```
