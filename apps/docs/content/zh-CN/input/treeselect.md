---
title: 'TreeSelect 树选择器'
description: '树选择器用于多层级树形数据的结构化展示 & 选取，例如显示文件夹与文件的列表、显示组织架构成员列表等等。'
type: 'input'
order: 52
icon: 'doc-treeselect'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/tree-select` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-input-treeselect-1" title="如何引入" kind="import" />

### 基本用法

最简单的用法，默认为单选模式，每一级菜单项均可选择。

<DemoBlock id="zh-CN-input-treeselect-2" title="基本用法" kind="live" />

### 多选

设置 `multiple`，可以进行多选。多选情况下所有子项都被选择时，自动勾选显示其父项。
通过 `leafOnly` 属性，可以设置只展示叶子节点，同时 `change` 事件参数也会只有叶子节点的值。

<DemoBlock id="zh-CN-input-treeselect-3" title="多选" kind="live" />

### 限制标签展示数量

在多选的场景中，利用 `maxTagCount` 可以限制展示的标签数量，超出部分将以 +N 的方式展示。
使用 `showRestTagsPopover` (>= v2.22.0) 可以设置在超出 `maxTagCount` 后，hover +N 是否显示 Popover，默认为 `false`。并且，还可以在 `restTagsPopoverProps` 属性中配置 Popover。

<DemoBlock id="zh-CN-input-treeselect-4" title="限制标签展示数量" kind="live" />

### 可搜索的

通过设置 `filterTreeNode` 属性可支持搜索功能。默认对 `label` 值进行搜索，可通过 `treeNodeFilterProp` 更改。

如果只希望展示过滤后的结果，可以设置 `showFilteredOnly`。

如果想要获取搜索结果的具体信息，可使用 `search` 事件，函数具体参数见 API 列表。

<DemoBlock id="zh-CN-input-treeselect-5" title="可搜索的" kind="live" />

### 远程搜索

通过设置 `remote` 属性可启用远程搜索。开启后，输入时不会执行本地过滤，而是仅触发 `search` 事件，用户可自行处理远程数据获取并更新 `treeData`。

<DemoBlock id="zh-CN-input-treeselect-6" title="远程搜索" kind="live" />

### 搜索框位置

可以使用 `searchPosition` 来设置搜索框的位置，可选: `dropdown`(默认)、`trigger`。

当输入框位于 trigger 时:

1. 搜索框占位符由 `placeholder` 控制；
2. `showClear=true` 时，点击输入框的清空按钮，将同时清空 inputValue 和 value。

<DemoBlock id="zh-CN-input-treeselect-7" title="搜索框位置" kind="live" />

### Trigger 内多行换行（triggerTagWrap）

当你在 **多选 + 搜索框位于 trigger** 的场景下，选择了较多项或输入较长文本时，默认 trigger 可能会更倾向于保持单行展示。

通过设置 `triggerTagWrap={true}`，可以让 trigger 内的已选标签支持自动换行（多行展示）。

<DemoBlock id="zh-CN-input-treeselect-8" title="Trigger 内多行换行（triggerTagWrap）" kind="live" />

### 尺寸大小

可以通过 `size` 设置尺寸大小，可选: 'small'、'default'、'large'

<DemoBlock id="zh-CN-input-treeselect-9" title="尺寸大小" kind="live" />

### 默认展开

`defaultExpandAll` 和 `expandAll` 均可以设置 `TreeSelect` 的默认展开/收起状态。二者的区别是，`defaultExpandAll` 只在初始化时生效，而 `expandAll` 不仅会在初始化时生效，当数据(`treeData`)发生动态更新时，`expandAll` 也仍然生效。

在下面的 demo 中，`TreeData` 更新后，`defaultExpandAll` 失效，`expandAll` 仍然生效。

<DemoBlock id="zh-CN-input-treeselect-10" title="默认展开" kind="live" />

### 禁用

<DemoBlock id="zh-CN-input-treeselect-11" title="禁用" kind="live" />

### 严格禁用

可以使用 `disableStrictly` 来开启严格禁用。开启严格禁用后，当节点是 disabled 的时候，则不能通过子级或者父级的关系改变选中状态。

以下面的 demo 为例，节点"中国"开启了严格禁用，因此，当我们改变其父节点"亚洲"的选中状态时，也不会影响到节点"中国"的选中状态。

<DemoBlock id="zh-CN-input-treeselect-12" title="严格禁用" kind="live" />

### 受控

使用 `v-model` 管理受控值，或通过 `value` 与 `change` 事件配合管理。

<DemoBlock id="zh-CN-input-treeselect-13" title="受控" kind="live" />

### 节点选中关系

版本：>= 2.5.0

多选时，可以使用 `checkRelation` 来设置节点之间选中关系的类型，可选：'related'（默认）、'unRelated'。当选中关系为 'unRelated' 时，意味着节点之间的选中互不影响。

<DemoBlock id="zh-CN-input-treeselect-14" title="节点选中关系" kind="live" />

### 开启搜索的展开受控

传入 `expandedKeys` 时即为展开受控组件，可以使用 `v-model:expandedKeys` 或监听 `expand` 事件。当展开受控时，如果开启 `filterTreeNode` 并进行搜索是不会再自动展开节点的，此时，节点的展开完全由 `expandedKeys` 来控制。
你可以利用 `search` 事件的参数 `filteredExpandedKeys`（version: >= 2.6.0） 来实现展开受控时的搜索展开效果。

<DemoBlock id="zh-CN-input-treeselect-15" title="开启搜索的展开受控" kind="live" />

### 虚拟化

列表虚拟化，用于大量树节点的情况。开启后，动画效果将被关闭。

`virtualize` 是一个包含下列值的对象：

- height: 高度值，如果为 string 必须有计算高度才能被渲染出来，即其父节点有 offsetHeight。建议传入数组。
- width: 宽度值，默认 100%
- itemSize: 每行的treeNode的高度，必传

如果带搜索框，建议开启 `showFilteredOnly` 减少多余节点的渲染。

<DemoBlock id="zh-CN-input-treeselect-16" title="虚拟化" kind="live" />

### 动态更新数据

<DemoBlock id="zh-CN-input-treeselect-17" title="动态更新数据" kind="live" />

### 异步加载数据

通过设置 `loadData` 可以动态加载数据，此时需要在数据中传入 `isLeaf` 标明叶子节点。

<DemoBlock id="zh-CN-input-treeselect-18" title="异步加载数据" kind="live" />

### 自定义 Trigger

如果默认的触发器样式满足不了你的需求，可以用 `triggerRender` 自定义选择框的展示。

triggerRender 入参如下:

<DemoBlock id="zh-CN-input-treeselect-19" title="自定义 Trigger" kind="code" />

<DemoBlock id="zh-CN-input-treeselect-20" title="自定义 Trigger" kind="live" />

### 自定义渲染已选项

你可以通过 renderSelectedItem 自定义选择框中已选项标签的渲染结构。

- 单选时 `renderSelectedItem(treeNode: TreeNodeData) => content:VNodeChild`
- 多选时 `renderSelectedItem(treeNode: TreeNodeData, { index:number, onClose:function }) => { isRenderInTag:bool, content:VNodeChild }`
- isRenderInTag 为 true 时，会自动将 content 包裹在 Tag 中渲染（带有背景色以及关闭按钮）
- isRenderInTag 为 false 时，将直接渲染返回的 content

<DemoBlock id="zh-CN-input-treeselect-21" title="自定义渲染已选项" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/tree-select/types.ts`、`packages/ui/src/tree-select/index.ts`、`packages/ui/src/tree/types.ts` 的公开类型为准。

- `v-model` 对应 `modelValue`，同时支持 `v-model:value`。
- `v-model:expandedKeys` 对应受控展开节点。

#### Vue 实例方法

**TreeSelect ref**

| 方法     | 签名                       | 说明         |
| -------- | -------------------------- | ------------ |
| `close`  | () =&gt; void              | 关闭弹出层   |
| `search` | (value: string) =&gt; void | 手动触发搜索 |

#### Vue 事件

**TreeSelect**

| 事件          | 参数                                                                           | 说明               |
| ------------- | ------------------------------------------------------------------------------ | ------------------ |
| blur          | [event: unknown]                                                               | 选择框失去焦点     |
| change        | [valueOrNode: unknown, nodeOrEvent?: unknown, event?: unknown]                 | 选中值变化         |
| clear         | [event: MouseEvent \| KeyboardEvent]                                           | 点击清除按钮       |
| expand        | [expandedKeys: string[], detail: TreeExpandDetail]                             | 展开状态变化       |
| focus         | [event: unknown]                                                               | 选择框获得焦点     |
| load          | [loadedKeys: Set&lt;string&gt;, node?: TreeNodeData]                           | 异步节点加载完成   |
| search        | [input: string, filteredExpandedKeys: string[], filteredNodes: TreeNodeData[]] | 搜索值变化         |
| select        | [key: string, selected: boolean, node: TreeNodeData]                           | 节点选中状态变化   |
| visibleChange | [visible: boolean]                                                             | 弹出层展示状态变化 |

#### Vue 插槽

**TreeSelect**

| 插槽         | 作用域参数                                                      | 说明           |
| ------------ | --------------------------------------------------------------- | -------------- |
| arrowIcon    | {}                                                              | 下拉箭头图标   |
| clearIcon    | {}                                                              | 清除图标       |
| empty        | {}                                                              | 搜索无结果内容 |
| expandIcon   | TreeExpandIconSlotProps                                         | 展开图标       |
| fullLabel    | TreeFullLabelSlotProps                                          | 完整节点行     |
| label        | { label?: VNodeChild; node: TreeNodeData; searchWord?: string } | 节点标签       |
| outerBottom  | {}                                                              | 弹出层底部内容 |
| outerTop     | {}                                                              | 弹出层顶部内容 |
| prefix       | {}                                                              | 选择框前缀     |
| search       | TreeSelectSearchRenderProps                                     | 搜索框         |
| selectedItem | TreeSelectSelectedItemProps                                     | 已选项         |
| suffix       | {}                                                              | 选择框后缀     |
| trigger      | TreeSelectTriggerRenderProps                                    | 自定义触发器   |

### TreeSelect

| 属性                     | 说明                                                                                                                                                                                                                 | 类型                                                                                                                                                                            | 默认值              |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| ariaDescribedby          | —                                                                                                                                                                                                                    | string                                                                                                                                                                          | —                   |
| ariaErrormessage         | —                                                                                                                                                                                                                    | string                                                                                                                                                                          | —                   |
| ariaInvalid              | —                                                                                                                                                                                                                    | boolean                                                                                                                                                                         | —                   |
| ariaLabel                | —                                                                                                                                                                                                                    | string                                                                                                                                                                          | —                   |
| ariaLabelledby           | —                                                                                                                                                                                                                    | string                                                                                                                                                                          | —                   |
| ariaRequired             | —                                                                                                                                                                                                                    | boolean                                                                                                                                                                         | —                   |
| arrowIcon                | 自定义右侧下拉箭头Icon，当showClear开关打开且当前有选中值时，hover会优先显示clear icon                                                                                                                               | VNodeChild                                                                                                                                                                      | —                   |
| autoAdjustOverflow       | 浮层被遮挡时是否自动调整方向（暂时仅支持竖直方向，且插入的父级为 body）                                                                                                                                              | boolean                                                                                                                                                                         | true                |
| autoExpandParent         | 是否自动展开父节点                                                                                                                                                                                                   | boolean                                                                                                                                                                         | false               |
| autoMergeValue           | 设置自动合并 value。具体而言是，开启后，当某个父节点被选中时，value 将不包括该节点的子孙节点。（在leafOnly为false的情况下生效）。v2.61.0 后提供                                                                      | boolean                                                                                                                                                                         | true                |
| borderless               | 无边框模式，v2.33.0后提供                                                                                                                                                                                            | boolean                                                                                                                                                                         | false               |
| checkRelation            | 多选时，节点之间选中状态的关系，可选：'related'、'unRelated'。v2.5.0后提供                                                                                                                                           | TreeCheckRelation                                                                                                                                                               | 'related'           |
| class                    | —                                                                                                                                                                                                                    | HTMLAttributes['class']                                                                                                                                                         | —                   |
| className                | 选择框的 `className` 属性                                                                                                                                                                                            | HTMLAttributes['class']                                                                                                                                                         | -                   |
| clearIcon                | 可用于自定义清除按钮, showClear为true时有效。v2.25.0后提供                                                                                                                                                           | VNodeChild                                                                                                                                                                      | -                   |
| clickToHide              | 选择后是否自动关闭下拉弹层，仅单选模式有效                                                                                                                                                                           | boolean                                                                                                                                                                         | true                |
| clickTriggerToHide       | 面板打开状态下，点击 Trigger 后是否关闭面板。v2.32.0后提供                                                                                                                                                           | boolean                                                                                                                                                                         | true                |
| defaultExpandAll         | 设置在初始化时是否展开所有节点。而如果后续数据(`treeData`)发生改变，这个 api 是无法影响节点的展开情况的，如果有这个需要可以使用 `expandAll`                                                                          | boolean                                                                                                                                                                         | false               |
| defaultExpandedKeys      | 默认展开的节点，显示其直接子级                                                                                                                                                                                       | string[]                                                                                                                                                                        | -                   |
| defaultOpen              | 默认展开下拉菜单                                                                                                                                                                                                     | boolean                                                                                                                                                                         | false               |
| defaultValue             | —                                                                                                                                                                                                                    | TreeValue                                                                                                                                                                       | —                   |
| disabled                 | 是否禁用                                                                                                                                                                                                             | boolean                                                                                                                                                                         | false               |
| disableStrictly          | 是否严格禁用                                                                                                                                                                                                         | boolean                                                                                                                                                                         | false               |
| dropdownClassName        | 下拉菜单的 `className` 属性                                                                                                                                                                                          | HTMLAttributes['class']                                                                                                                                                         | -                   |
| dropdownMargin           | 下拉菜单计算溢出时的增加的冗余值，详见[issue#549](https://github.com/aifuxi/semi-ui-vue/issues/549)，作用同 Tooltip margin。v2.25.0后提供                                                                            | PopoverMargin                                                                                                                                                                   | —                   |
| dropdownMatchSelectWidth | 下拉菜单最小宽度是否等于Select                                                                                                                                                                                       | boolean                                                                                                                                                                         | true                |
| dropdownStyle            | 下拉菜单的样式                                                                                                                                                                                                       | StyleValue                                                                                                                                                                      | -                   |
| emptyContent             | 当搜索无结果时展示的内容                                                                                                                                                                                             | VNodeChild                                                                                                                                                                      | `暂无数据`          |
| expandAction             | 展开逻辑，可选 false, 'click', 'doubleClick'。默认值为 false，即仅当点击展开按钮时才会展开                                                                                                                           | TreeExpandAction                                                                                                                                                                | false               |
| expandAll                | 设置是否默认展开所有节点，若后续数据(`treeData`)发生改变，默认的展开情况也是会受到这个 api 影响的                                                                                                                    | boolean                                                                                                                                                                         | false               |
| expandedKeys             | （受控）展开的节点，默认展开节点显示其直接子级                                                                                                                                                                       | string[]                                                                                                                                                                        | -                   |
| expandIcon               | 自定义展开图标，使用[示例](/zh-CN/navigation/tree#%E8%87%AA%E5%AE%9A%E4%B9%89%E5%B1%95%E5%BC%80%20Icon)                                                                                                              | VNodeChild \| ((props: TreeExpandIconSlotProps) =&gt; VNodeChild)                                                                                                               | -                   |
| filterTreeNode           | —                                                                                                                                                                                                                    | boolean \| ((inputValue: string, treeNodeString: string, data?: TreeNodeData) =&gt; boolean)                                                                                    | —                   |
| getPopupContainer        | 指定父级 DOM，弹层将会渲染至该 DOM 中，自定义需要设置 `position: relative` 这会改变浮层 DOM 树位置，但不会改变视图渲染位置。                                                                                         | () =&gt; HTMLElement                                                                                                                                                            | -                   |
| insetLabel               | —                                                                                                                                                                                                                    | VNodeChild                                                                                                                                                                      | —                   |
| insetLabelId             | —                                                                                                                                                                                                                    | string                                                                                                                                                                          | —                   |
| keyMaps                  | 自定义节点中 key、label、value 的字段。v2.47.0后提供。如果 keyMaps 中设置 label 的自定义名称并且开启了搜索，为保证搜索正确，需要将 treeNodeFilterProp 设置为 treeData 的键之一或者通过 filterTreeNode 自定义搜索函数 | TreeKeyMaps                                                                                                                                                                     | -                   |
| labelEllipsis            | 是否开启label的超出省略，默认虚拟化状态下开启                                                                                                                                                                        | boolean                                                                                                                                                                         | false\|true(虚拟化) |
| leafOnly                 | 多选模式下是否仅通过 change 事件参数及展示标签返回叶子节点                                                                                                                                                           | boolean                                                                                                                                                                         | false               |
| loadData                 | 异步加载数据，需要返回一个Promise                                                                                                                                                                                    | (node?: TreeNodeData) =&gt; Promise&lt;void&gt;                                                                                                                                 | -                   |
| loadedKeys               | （受控）已经加载的节点，配合 loadData 使用                                                                                                                                                                           | string[]                                                                                                                                                                        | -                   |
| maxTagCount              | 最多显示多少个 tag                                                                                                                                                                                                   | number                                                                                                                                                                          | -                   |
| modelValue               | —                                                                                                                                                                                                                    | TreeValue                                                                                                                                                                       | —                   |
| motion                   | —                                                                                                                                                                                                                    | boolean                                                                                                                                                                         | —                   |
| motionExpand             | 是否开启选项树节点动画                                                                                                                                                                                               | boolean                                                                                                                                                                         | true                |
| mouseEnterDelay          | —                                                                                                                                                                                                                    | number                                                                                                                                                                          | —                   |
| mouseLeaveDelay          | —                                                                                                                                                                                                                    | number                                                                                                                                                                          | —                   |
| multiple                 | 是否支持多选                                                                                                                                                                                                         | boolean                                                                                                                                                                         | false               |
| onChangeWithObject       | 是否将选中项 option 的其他属性作为回调。设为 true 时，`change` 事件的参数类型为 Function(node\|node[], e) 此时如果是受控，也需要把 value 设置成 object，且必须含有 value 的键值；defaultValue同理。                  | boolean                                                                                                                                                                         | false               |
| optionListStyle          | optionList的样式                                                                                                                                                                                                     | CSSProperties                                                                                                                                                                   | -                   |
| outerBottomSlot          | 渲染在弹出层底部，与 optionList 平级的自定义 slot                                                                                                                                                                    | VNodeChild                                                                                                                                                                      | -                   |
| outerTopSlot             | 渲染在弹出层顶部，与 optionList 平级的自定义 slot，注意如果开启了 filterTreeNode 会取代搜索框，可以通过 search 方法来自行处理                                                                                        | VNodeChild                                                                                                                                                                      | -                   |
| placeholder              | 选择框默认文字                                                                                                                                                                                                       | string                                                                                                                                                                          | -                   |
| position                 | 下拉菜单位置，可选值参考 Tooltip position。v2.25.0后提供                                                                                                                                                             | PopoverPosition                                                                                                                                                                 | bottomLeft          |
| prefix                   | 前缀标签                                                                                                                                                                                                             | VNodeChild                                                                                                                                                                      | -                   |
| preventScroll            | 指示浏览器是否应滚动文档以显示新聚焦的元素，作用于组件内的 focus 方法                                                                                                                                                | boolean                                                                                                                                                                         | -                   |
| remote                   | 是否启用远程搜索。开启后，输入时跳过本地过滤，仅触发 `search` 事件，用户可自行处理远程数据获取并更新 `treeData`                                                                                                      | boolean                                                                                                                                                                         | false               |
| renderFullLabel          | 完全自定义label的渲染函数，[入参及用法详见](/zh-CN/navigation/tree#高级定制)                                                                                                                                         | (props: TreeFullLabelSlotProps) =&gt; VNodeChild                                                                                                                                | -                   |
| renderLabel              | —                                                                                                                                                                                                                    | (label?: VNodeChild, data?: TreeNodeData, searchWord?: string) =&gt; VNodeChild                                                                                                 | —                   |
| renderSelectedItem       | 自定义渲染已选项                                                                                                                                                                                                     | ( node: TreeNodeData, other?: { index: number; onClose(content?: VNodeChild, event?: MouseEvent): void }, ) =&gt; VNodeChild \| { content: VNodeChild; isRenderInTag: boolean } | -                   |
| restTagsPopoverProps     | Popover 的配置属性，可以控制 position、zIndex、trigger 等，具体参考[Popover](/zh-CN/show/popover#API%20%E5%8F%82%E8%80%83)。v2.22.0后提供                                                                            | PopoverProps                                                                                                                                                                    | {}                  |
| searchAutoFocus          | 搜索框自动聚焦                                                                                                                                                                                                       | boolean                                                                                                                                                                         | false               |
| searchPlaceholder        | 搜索框默认文字                                                                                                                                                                                                       | string                                                                                                                                                                          | -                   |
| searchPosition           | 设置搜索框的位置，可选: `dropdown`、`trigger`                                                                                                                                                                        | TreeSelectSearchPosition                                                                                                                                                        | `dropdown`          |
| searchRender             | —                                                                                                                                                                                                                    | ((props: TreeSelectSearchRenderProps) =&gt; VNodeChild) \| boolean                                                                                                              | —                   |
| showClear                | 当值不为空时，trigger 是否展示清除按钮                                                                                                                                                                               | boolean                                                                                                                                                                         | false               |
| showFilteredOnly         | 搜索状态下是否只展示过滤后的结果                                                                                                                                                                                     | boolean                                                                                                                                                                         | false               |
| showLine                 | 选项面板中选项显示连接线。v2.50.0后提供                                                                                                                                                                              | boolean                                                                                                                                                                         | false               |
| showRestTagsPopover      | 当超过 maxTagCount，hover 到 +N 时，是否通过 Popover 显示剩余内容。v2.22.0后提供                                                                                                                                     | boolean                                                                                                                                                                         | false               |
| showSearchClear          | 是否显示搜索框的清除按钮                                                                                                                                                                                             | boolean                                                                                                                                                                         | true                |
| size                     | 选择框大小，可选 `large`，`small`，`default`                                                                                                                                                                         | TreeSelectSize                                                                                                                                                                  | `default`           |
| stopPropagation          | —                                                                                                                                                                                                                    | boolean \| string                                                                                                                                                               | —                   |
| style                    | 选择框的样式                                                                                                                                                                                                         | StyleValue                                                                                                                                                                      | -                   |
| suffix                   | 后缀标签                                                                                                                                                                                                             | VNodeChild                                                                                                                                                                      | -                   |
| treeData                 | `treeNodes` 数据，如果设置则不需要手动构造 `TreeNode` 节点（`key` 值在整个树范围内唯一）                                                                                                                             | TreeNodeData[]                                                                                                                                                                  | []                  |
| treeNodeFilterProp       | 搜索时输入项过滤对应的 `TreeNodeData` 属性                                                                                                                                                                           | string                                                                                                                                                                          | `label`             |
| treeNodeLabelProp        | 作为显示的 `prop` 设置                                                                                                                                                                                               | string                                                                                                                                                                          | `label`             |
| triggerRender            | 自定义触发器渲染方法                                                                                                                                                                                                 | (props: TreeSelectTriggerRenderProps) =&gt; VNodeChild                                                                                                                          | -                   |
| triggerTagWrap           | 是否允许在 trigger 内将多选标签换行展示。仅在 `multiple` 且 `filterTreeNode` 开启、并且 `searchPosition="trigger"` 时生效                                                                                            | boolean                                                                                                                                                                         | false               |
| validateStatus           | 校验结果，可选 `warning`、`error`、 `default`（只影响样式背景色）                                                                                                                                                    | TreeSelectValidateStatus                                                                                                                                                        | -                   |
| value                    | —                                                                                                                                                                                                                    | TreeValue                                                                                                                                                                       | —                   |
| virtualize               | 列表虚拟化，用于大量树节点的情况，由 height, width, itemSize 组成，参考 Tree - Virtualize Object。开启后将关闭动画效果。                                                                                             | TreeVirtualize                                                                                                                                                                  | -                   |
| zIndex                   | treeSelect下拉菜单的zIndex                                                                                                                                                                                           | number                                                                                                                                                                          | 1030                |

### TreeNodeData

> **不同 `TreeNodeData` 的 key 值要求必填且唯一。**`label` 允许重复。value 值非必填。此时 `change` 事件、value、defaultValue 及 onChangeWithObject 中的 value 将改为 key 值。
> 为了保证行为的符合预期，treeData 中的 value 值或者全部不填写，或者全部填写且唯一，不建议混写。

| 属性     | 说明                     | 类型           | 默认值 |
| -------- | ------------------------ | -------------- | ------ |
| key      | required且要求唯一       | string         | -      |
| value    | 属性值                   | TreePrimitive  | -      |
| label    | 展示的文本               | VNodeChild     | -      |
| icon     | 自定义图标               | VNodeChild     | -      |
| disabled | 是否禁用，多选状态下支持 | boolean        | false  |
| isLeaf   | 是否为叶子节点           | boolean        | -      |
| children | —                        | TreeNodeData[] | —      |

### Methods

绑定在组件实例上的方法，可以通过 ref 调用实现某些特殊交互

| Name                     | Description                                                                        |
| ------------------------ | ---------------------------------------------------------------------------------- |
| search(sugInput: string) | 如果需要在外部自定义搜索框，可以在自定义搜索框值变更时主动调用该方法，改变筛选结果 |

## Accessibility

### ARIA

- TreeSelect 会自动设置 `aria-label` 为 'TreeSelect'，也支持用户自行设置 `aria-label` 来表示该 TreeSelect 作用;
- TreeSelect 允许用户设置 `aria-describedby`、`aria-errormessage`、`aria-invalid`、`aria-labelledby`、`aria-required`，另外，Form 会为 Form.TreeSelect 自动设置这些属性;
- TreeSelect 会自动为每个子节点分别设置 `aria-disabled`、`aria-checked`、`aria-selected`、`aria-level` 来表明节点状态及层级;

示例:

<DemoBlock id="zh-CN-input-treeselect-22" title="ARIA" kind="code" />
