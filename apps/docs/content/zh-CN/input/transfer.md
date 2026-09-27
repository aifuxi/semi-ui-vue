---
title: 'Transfer 穿梭框'
description: '一个更直观高效的多选选择器，可以露出更多选项的信息，支持搜索功能，缺点是占据更多空间'
type: 'input'
order: 51
icon: 'doc-transfer'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/transfer` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-input-transfer-1" title="如何引入" kind="import" />

### 基本使用

数据项需传入 value、label、key

<DemoBlock id="zh-CN-input-transfer-2" title="基本使用" kind="live" />

### 分组

将 type 设为 `groupList`

分组的 dataSource，一级子元素必须拥有 title 以及 children 属性，结构参考

暂不支持多层嵌套

<DemoBlock id="zh-CN-input-transfer-3" title="分组" kind="live" />

### 自定义筛选逻辑，自定义选项数据渲染

使用`filter`自定义搜索逻辑，返回 true 时表示当前项符合筛选规则，保留当前项在列表中的显示，返回 false 则表示不符合，当前项会被隐藏。
当 type 为 `treeList`时，如需要自定义搜索逻辑，需设置 `filter` 为 true，并通过 `treeProps` 的 `filterTreeNode` 设置自定义的搜索函数。
使用`renderSourceItem`，你可以自定义左侧每一条源数据的渲染结构。例如结合 Highlight 组件高亮搜索匹配文本
使用`renderSelectedItem` 你可以自定义右侧每一条已选项的渲染结构。

<DemoBlock id="zh-CN-input-transfer-4" title="自定义筛选逻辑，自定义选项数据渲染" kind="live" />

<DemoBlock id="zh-CN-input-transfer-5" title="自定义筛选逻辑，自定义选项数据渲染" kind="code" />

### 禁用

<DemoBlock id="zh-CN-input-transfer-6" title="禁用" kind="live" />

### 拖拽排序

将 `draggable`设为 true，开启拖拽排序功能。v1.11.0 后支持

<DemoBlock id="zh-CN-input-transfer-7" title="拖拽排序" kind="live" />

### 左侧分页

当左侧选项较多时，可以通过 `pagination` 属性开启分页功能。v2.68.0 后支持。

`pagination` 接收一个对象，包含以下属性：

- `pageSize`: 每页显示的条数，默认为 10
- `currentPage`: 当前页码（受控模式）
- `defaultCurrentPage`: 默认当前页码（非受控模式）
- `onPageChange`: 页码变化时的回调

<DemoBlock id="zh-CN-input-transfer-8" title="左侧分页" kind="live" />

### 左侧分页 + 受控页码

通过 `pagination.currentPage` 可以受控地设置当前页码。

<DemoBlock id="zh-CN-input-transfer-9" title="左侧分页 + 受控页码" kind="live" />

### 拖拽 + 自定义已选项渲染

将 `draggable`设为 true，开启拖拽排序功能;使用 `renderSelectedItem` 自定义右侧已选项渲染；
你可以将触发器定义为任意你想要的VNodeChild，并且添加样式。将拖拽触发器，使用 `sortableHandle` 进行包裹即可,

<DemoBlock id="zh-CN-input-transfer-10" title="拖拽 + 自定义已选项渲染" kind="live" />

### 自定义渲染面板头部信息

Semi 自 2.29.0 版本提供 `renderSourceHeader`, `renderSelectedHeader` 参数允许用户自定义渲染左右两个面板的头部信息。
`renderSourceHeader: (props: SourceHeaderProps) => VNodeChild`
`renderSelectedHeader: (props: SelectedHeaderProps) => VNodeChild`
参数类型如下：

<DemoBlock id="zh-CN-input-transfer-11" title="自定义渲染面板头部信息" kind="code" />

使用示例如下

<DemoBlock id="zh-CN-input-transfer-12" title="自定义渲染面板头部信息" kind="live" />

### 完全自定义渲染

Semi 提供了 `renderSourcePanel`、`renderSelectedPanel` 入参，允许你完全自定义左右侧两个面板的渲染结构
通过该功能，你可以直接复用 Transfer 内部的逻辑能力，实现高度自定义样式结构的`Transfer`组件 `renderSourcePanel: (sourcePanelProps: SourcePanelProps) => VNodeChild`
`SourcePanelProps`包含以下参数，你可以从中获取数据来渲染出你的 Panel 结构

<DemoBlock id="zh-CN-input-transfer-13" title="完全自定义渲染" kind="code" />

`renderSelectedPanel: (selectedPanelProps: SelectedPanelProps) => VNodeChild`
`SelectedPanelProps`包含以下参数

<DemoBlock id="zh-CN-input-transfer-14" title="完全自定义渲染" kind="code" />

<DemoBlock id="zh-CN-input-transfer-15" title="完全自定义渲染" kind="live" />

<DemoBlock id="zh-CN-input-transfer-16" title="完全自定义渲染" kind="code" />

### 完全自定义渲染 、 拖拽排序

在完全自定义渲染的场景下，由于拖拽区的渲染也已由你完全接管，因此你不声明 draggable 亦可。
但你需要自行实现拖拽逻辑；Vue 自定义面板可使用浏览器原生 HTML5 drag events 或 Vue 拖拽库。

拖拽排序结束后，将 `oldIndex`、`newIndex` 传给自定义面板作用域中的 `onSortEnd`。

自定义面板需自行完成拖拽交互。

<DemoBlock id="zh-CN-input-transfer-17" title="完全自定义渲染 、 拖拽排序" kind="live" />

自定义拖拽实现应在排序结束后回传最终索引。

<DemoBlock id="zh-CN-input-transfer-18" title="完全自定义渲染 、 拖拽排序" kind="code" />

<DemoBlock id="zh-CN-input-transfer-19" title="完全自定义渲染 、 拖拽排序" kind="live" />

### 树穿梭框

传入 type 为`treeList`，使用[`Tree`](/zh-CN/navigation/tree)组件作为自定义渲染列表。**v1.20.0 提供**

可通过treeProps([TreeProps](/zh-CN/navigation/tree#Tree))来覆盖默认树的属性，左侧树默认属性为

<DemoBlock id="zh-CN-input-transfer-20" title="树穿梭框" kind="code" />

<DemoBlock id="zh-CN-input-transfer-21" title="树穿梭框" kind="live" />

### 树穿梭框自定义头部显示叶子节点数量

当 type 为 `treeList` 时，`renderSourceHeader` 的 `SourceHeaderProps` 参数中会额外提供 `leafOnlyNum` 字段，表示叶子节点的数量。这在文件选择等场景中非常有用，可以在头部只显示文件数量而不是包含文件夹的总数。

<DemoBlock id="zh-CN-input-transfer-22" title="树穿梭框自定义头部显示叶子节点数量" kind="live" />

## Accessibility

### ARIA

- 搜索框添加 `role` `search`
- 右侧选中列表添加 `role` `list`，选中项添加 `role` `listitem`

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/transfer/types.ts` 的公开类型为准。

- `v-model` 对应 `modelValue` 与 `update:modelValue`；兼容入口 `value` 可通过 `v-model:value` 绑定，两个值同时存在时 `modelValue` 优先。

#### Vue 用法

- `filter` 函数、`pagination.onPageChange` 与六个 `renderXxx` 是保留的 callback props，不是组件事件。
- 六个渲染 callback 都有同名 scoped slot；emptyLeft、emptyRight、emptySearch 插槽分别覆盖三种空状态。

#### Vue 实例方法

**TransferExposed**

| 方法     | 签名                       | 说明                           |
| -------- | -------------------------- | ------------------------------ |
| `search` | (value: string) =&gt; void | 更新搜索值且不触发 search 事件 |

#### Vue 事件

**Transfer**

| 事件              | 参数                                                     | 说明                |
| ----------------- | -------------------------------------------------------- | ------------------- |
| change            | [values: TransferPrimitive[], items: TransferDataItem[]] | 已选值变化          |
| select            | [item: TransferDataItem]                                 | 勾选条目            |
| deselect          | [item: TransferDataItem]                                 | 取消勾选条目        |
| search            | [input: string]                                          | 搜索输入变化        |
| update:modelValue | [values: TransferPrimitive[]]                            | 更新默认 v-model    |
| update:value      | [values: TransferPrimitive[]]                            | 更新兼容 value 绑定 |

#### Vue 插槽

**Transfer**

| 插槽           | 作用域参数                  | 说明           |
| -------------- | --------------------------- | -------------- |
| sourceItem     | TransferSourceItemProps     | 左侧候选条目   |
| selectedItem   | TransferSelectedItemProps   | 右侧已选条目   |
| sourcePanel    | TransferSourcePanelProps    | 完整左侧面板   |
| selectedPanel  | TransferSelectedPanelProps  | 完整右侧面板   |
| sourceHeader   | TransferSourceHeaderProps   | 左侧面板头部   |
| selectedHeader | TransferSelectedHeaderProps | 右侧面板头部   |
| emptyLeft      | {}                          | 左侧无数据内容 |
| emptyRight     | {}                          | 右侧无数据内容 |
| emptySearch    | {}                          | 无搜索结果内容 |

### Transfer Props

| 属性                 | 说明                                                                     | 类型                                                               | 默认值 | 版本   |
| -------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------ | ------ | ------ |
| className            | 样式类名                                                                 | HTMLAttributes['class']                                            | —      |        |
| style                | 内联样式                                                                 | StyleValue                                                         | —      |        |
| disabled             | 是否禁用                                                                 | boolean                                                            | false  |        |
| dataSource           | 数据源                                                                   | TransferDataSource                                                 | []     |        |
| filter               | 是否显示搜索框，或自定义筛选 callback prop                               | boolean \| ((input: string, item: TransferDataItem) =&gt; boolean) | true   |        |
| defaultValue         | 默认已选中值                                                             | TransferPrimitive[]                                                | []     |        |
| value                | 兼容受控已选值                                                           | TransferPrimitive[] \| undefined                                   | —      |        |
| modelValue           | 默认 v-model 已选值                                                      | TransferPrimitive[] \| undefined                                   | —      |        |
| inputProps           | 搜索框 Input 配置；内部接管 value 与 change 绑定                         | InputProps                                                         | —      |        |
| type                 | Transfer 类型，可选`list`，`groupList`，`treeList`                       | TransferType                                                       | `list` | -      |
| emptyContent         | 左右面板与搜索空状态内容；同名插槽优先                                   | TransferEmptyContent                                               | {}     |        |
| draggable            | 是否开启拖拽排序                                                         | boolean                                                            | false  |        |
| treeProps            | 当 type 为`treeList`时，可作为 TreeProps 传入左侧的 Tree 组件            | Omit&lt;TreeProps, 'value' \| 'modelValue'&gt;                     | —      | -      |
| showPath             | 当 type 为`treeList`时，控制右侧选中项是否显示选择路径                   | boolean                                                            | false  | -      |
| loading              | 是否正在加载左侧选项                                                     | boolean                                                            | false  |        |
| virtualize           | 右侧已选列表虚拟化，仅在默认右侧面板渲染且 `draggable` 为 `false` 时生效 | TransferVirtualizeProps                                            | —      | 2.97.0 |
| pagination           | 左侧面板分页配置，仅对 `list` 和 `groupList` 类型生效                    | TransferPaginationProps                                            | —      | 2.68.0 |
| renderSourceItem     | 左侧条目渲染 callback prop；sourceItem 插槽优先                          | (item: TransferSourceItemProps) =&gt; VNodeChild                   | —      |        |
| renderSelectedItem   | 右侧条目渲染 callback prop；selectedItem 插槽优先                        | (item: TransferSelectedItemProps) =&gt; VNodeChild                 | —      |        |
| renderSourcePanel    | 左侧面板渲染 callback prop；sourcePanel 插槽优先                         | (props: TransferSourcePanelProps) =&gt; VNodeChild                 | —      | -      |
| renderSelectedPanel  | 右侧面板渲染 callback prop；selectedPanel 插槽优先                       | (props: TransferSelectedPanelProps) =&gt; VNodeChild               | —      | -      |
| renderSourceHeader   | 左侧头部渲染 callback prop；sourceHeader 插槽优先                        | (props: TransferSourceHeaderProps) =&gt; VNodeChild                | —      | 2.29.0 |
| renderSelectedHeader | 右侧头部渲染 callback prop；selectedHeader 插槽优先                      | (props: TransferSelectedHeaderProps) =&gt; VNodeChild              | —      | 2.29.0 |

### Item Interface

| 属性      | 说明                                                                                          | 类型                      | 默认值 |
| --------- | --------------------------------------------------------------------------------------------- | ------------------------- | ------ |
| key       | 必填，每个选项的唯一标识，不允许重复                                                          | TransferPrimitive（必填） | —      |
| label     | 选项展示内容                                                                                  | VNodeChild                | —      |
| value     | 选项代表的值                                                                                  | TransferPrimitive         | —      |
| disabled  | 是否禁用                                                                                      | boolean                   | false  |
| className | 样式类名                                                                                      | string                    | —      |
| style     | 内联样式                                                                                      | CSSProperties             | —      |
| fullPath  | 当 `type="treeList"` 且 `showPath` 为 `true` 时，返回当前节点从根节点到自身的完整路径节点数组 | TransferFullPathItem[]    | —      |

### GroupItem Interface

GroupItem 是分组容器，不继承 Item 属性。

| 属性     | 说明         | 类型               | 默认值 |
| -------- | ------------ | ------------------ | ------ |
| title    | 分组名称     | string             | —      |
| children | 该分组的元素 | TransferDataItem[] | —      |

### TreeItem Interface

TreeItem 继承 Item 的所有属性

| 属性     | 说明   | 类型               | 默认值 |
| -------- | ------ | ------------------ | ------ |
| children | 子元素 | TransferTreeItem[] | —      |

### VirtualizeProps Interface

| 属性     | 说明                                                                                   | 类型             | 默认值 |
| -------- | -------------------------------------------------------------------------------------- | ---------------- | ------ |
| height   | 虚拟列表高度，传入 `number` 则直接生效，传入 `string`（如 `100%`）则根据剩余高度自适应 | number \| string | —      |
| width    | 虚拟列表宽度                                                                           | number \| string | —      |
| itemSize | 每行高度（固定）                                                                       | number（必填）   | —      |

### PaginationProps Interface

| 属性               | 说明                                       | 类型                             | 默认值 |
| ------------------ | ------------------------------------------ | -------------------------------- | ------ |
| currentPage        | 当前页码（受控模式）                       | number                           | —      |
| defaultCurrentPage | 默认当前页码（非受控模式）                 | number                           | 1      |
| pageSize           | 每页显示条数                               | number                           | 10     |
| onPageChange       | 页码变化 callback prop，不是 Transfer 事件 | (currentPage: number) =&gt; void | —      |

## Methods

可通过模板 ref 调用公开实例方法。

| Name                  | Description                                             |
| --------------------- | ------------------------------------------------------- |
| search(value: string) | 可通过 ref 调用该方法进行搜索，该搜索值会被置给 Input。 |
