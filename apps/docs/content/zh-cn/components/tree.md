---
title: '树形控件'
description: '树型结构列表。'
locale: 'zh-CN'
slug: 'tree'
category: 'navigation'
order: 61
englishTitle: 'Tree'
icon: 'doc-tree'
upstream: 'navigation/tree'
---

以下 Vue 3.5 示例基于固定 Semi Design v2.102.0 源码，使用公开 Tree API 展示选择、展开、过滤、异步加载和拖拽。异步数据由浏览器本地生成，不请求服务器。

## 代码演示

### 如何引入

```ts
import { Tree } from '@aifuxi/semi-ui-vue/tree';
import '@aifuxi/semi-theme-default/tree.css';
```

### 基本用法

最简单的用法，默认为单选模式，每一级菜单项均可选择。

::demo-block{demo="tree/zh-CN/Basic" title="基本用法"}
::

### 多选

设置 `multiple`，可以进行多选。多选情况下所有子项都被选择时，自动勾选显示其父项。

::demo-block{demo="tree/zh-CN/Multiple" title="多选"}
::

### 可搜索的

通过设置 `filterTreeNode` 属性可支持搜索功能。默认对 `label` 值进行搜索，可通过 `treeNodeFilterProp` 更改。
如果只希望展示过滤后的结果，可以设置 `showFilteredOnly` 。
::demo-block{demo="tree/zh-CN/Search" title="搜索过滤"}
::

设置 `filterTreeNode` 属性开启搜索后，可以通过设置 `searchRender` 自定义搜索框的渲染方法，设置为`false`时可以隐藏搜索框。
::demo-block{demo="tree/zh-CN/CustomSearch" title="自定义搜索框"}
::

### 手动触发搜索

可以通过ref的方式获取tree的实例，调用tree的`search`方法进行搜索。注意需要同时设置`filterTreeNode`开启搜索，如果搜索框在tree外部，可以通过设置`searchRender=false`隐藏tree内部的搜索框。
::demo-block{demo="tree/zh-CN/ManualSearch" title="手动搜索"}
::

### 简单 JSON 格式的数据

可以通过 `treeDataSimpleJson` 传入 JSON 形式的 `treeNodes` 数据。此时 key-value 键值对中的 key 值将作为 `TreeNodeData` 的 `key` 和 `label`，`value` 值将作为 `TreeNodeData` 的 `value`。返回值为包含选中节点的 JSON 数据。

::demo-block{demo="tree/zh-CN/SimpleJson" title="简单 JSON"}
::

### 行显示节点

可以通过设置 `blockNode` 使节点显示为整行，此时悬浮选中高亮状态都会显示整行。默认打开。
关闭时只高亮节点 label。

::demo-block{demo="tree/zh-CN/BlockNode" title="行显示节点"}
::

### 自定义节点内容

`TreeNodeData` 的 label 属性支持传入 VNodeChild 来自定义显示的节点内容。注意如果设置 `filterTreeNode` 开启搜索，默认是对 label 的值进行搜索，当 label 为节点时，需要自定义 `filterTreeNode` 的函数来满足搜索需求。

在**v>=1.6.0**的版本中，你也可以使用 `renderLabel` 来传入自定义的渲染方法，此时搜索值仍为treeData中的相应的label属性。
::demo-block{demo="tree/zh-CN/LabelActions" title="标签操作"}
::

过长省略。在**v>=1.6.0**的版本中，可以使用 `renderLabel` 来实现文本过长省略的效果。
::demo-block{demo="tree/zh-CN/LabelEllipsis" title="长标签省略及操作"}
::

### 自定义图标

通过设置 `icon` 属性可添加自定义图标。

::demo-block{demo="tree/zh-CN/Icons" title="自定义图标"}
::

### 目录树模式

通过设置 `directory` 属性可显示为目录树模式。目录树模式下自带目录图标，可以通过自定义图标覆盖。

::demo-block{demo="tree/zh-CN/Directory" title="目录树"}
::

### 禁用

可以使用 `disableStrictly` 来开启严格禁用。开启严格禁用后，当节点是 disabled 的时候，则不能通过子级或者父级的关系改变选中状态。

::demo-block{demo="tree/zh-CN/Disabled" title="禁用节点"}
::

### 节点选中关系

版本：>= 2.5.0

多选时，可以使用 `checkRelation` 来设置节点选中关系的类型，可选：'related'（默认）、'unRelated'。当选中关系为 'unRelated'，意味着节点之间的选中互不影响。

::demo-block{demo="tree/zh-CN/CheckRelation" title="独立选中关系"}
::

### 默认展开

`defaultExpandAll` 和 `expandAll` 均可以设置 `Tree` 的默认展开/收起状态。二者的区别是，`defaultExpandAll` 只在初始化时生效，而 `expandAll` 不仅会在初始化时生效，当数据(`treeData`/`treeDataSimpleJson`)发生动态更新时，`expandAll` 也仍然生效。

其中，`expandAll` 是从 1.30.0 开始支持的。

在下面的 demo 中，点击按钮更新 `TreeData` 后，`defaultExpandAll` 失效，`expandAll` 仍然生效。

::demo-block{demo="tree/zh-CN/ExpandAll" title="默认与持续展开"}
::

### 开启搜索的展开受控

传入 `expandedKeys` 时即为展开受控组件，可以配合 `onExpand` 使用。当展开受控时，如果开启 `filterTreeNode` 并进行搜索是不会再自动展开节点的，此时，节点的展开完全由 `expandedKeys` 来控制。你可以利用 `onSearch` 的入参 `filteredExpandedKeys`（version: >= 2.38.0） 来实现展开受控时的搜索展开效果。

::demo-block{demo="tree/zh-CN/ControlledSearch" title="搜索受控展开"}
::

### 受控

传入 `value` 时即为受控组件，可以配合 `onChange` 使用。
::demo-block{demo="tree/zh-CN/Controlled" title="受控选择"}
::

### 自动展开父节点

在展开受控的情况下，当开启了 `autoExpandParent` ，如果想要收起父元素，则需要把它的所有子元素均收起后才可以。默认情况下，`autoExpandParent` 为 false，即：父元素收起不受到子元素的影响。

::demo-block{demo="tree/zh-CN/AutoExpandParent" title="自动展开父节点"}
::

### 自定义展开 Icon

可以通过 `expandIcon` 自定义展开 Icon。 支持传入 VNodeChild 或者函数。`expandIcon` 自 2.75.0 开始支持。

```ts
interface TreeExpandIconSlotProps {
  className: string;
  expanded: boolean;
  onClick(event: MouseEvent | KeyboardEvent): void;
}
```

示例如下：

::demo-block{demo="tree/zh-CN/ExpandIcon" title="自定义展开图标"}
::

### 连接线

通过 `showLine` 设置节点之间的连接线，默认为 false，从 2.50.0 开始支持

::demo-block{demo="tree/zh-CN/Lines" title="连接线"}
::

### 虚拟化

列表虚拟化，用于大量树节点的情况。开启后，动画效果将被关闭。

`virtualize` 是一个包含下列值的对象：

- height: 高度值，如果为 string 必须有计算高度才能被渲染出来，即其父节点有 offsetHeight
- width: 宽度值，默认 100%
- itemSize: 每行的treeNode的高度，必传

如果带搜索框，建议开启 `showFilteredOnly` 减少多余节点的渲染。

::demo-block{demo="tree/zh-CN/Virtualized" title="虚拟化"}
::

### 动态更新数据

::demo-block{demo="tree/zh-CN/DynamicData" title="动态数据"}
::

### 异步加载数据

通过设置 loadData 可以动态加载数据，此时需要在数据中传入 isLeaf 标明叶子节点。

::demo-block{demo="tree/zh-CN/AsyncData" title="异步加载"}
::

### 可拖拽的Tree

通过设置 draggable 配合 onDrop 可以实现 Tree 节点的拖拽。

> 拖拽功能于 v 1.8.0 后开始提供。目前不支持与虚拟化同时使用

拖拽事件的回调入参如下：

```
- onDragEnd: function({ event, node: DragTreeNode })
- onDragEnter:function({ event, node: DragTreeNode, expandedKeys: string[] })
- onDragLeave:function({ event, node: DragTreeNode })
- onDragOver:function({ event, node: DragTreeNode })
- onDragStart: function({ event, node: DragTreeNode })
- onDrop:function({ event, node: DragTreeNode, dragNode: DragTreeNode, dragNodesKeys: string[], dropPosition: number, dropToGap: Boolean })
```

数据类型 DragTreeNode，除了包含 TreeNodeData 所有属性外，还包含 expanded 和 pos 属性，

```
DragTreeNode {
    expanded: Boolean,
    pos: string
    value?: string | number;
    label?: VNodeChild;
    disabled?: boolean;
    isLeaf?: boolean;
    [key: string]: any;
}
```

- `pos` 指的是当前节点在整个 treeData 中的位置关系，如第0层第1个节点的第2个节点的第0个节点：'0-1-2-0'
- `dropPosition` 指的是被拖拽节点在当前层级中被 drop 的位置，如插入在同级的第0个节点前则为 -1，在第0个节点后则为 1，落在其上则为 0，以此类推。配合 dropToGap 可以得到更完整的判断。
- `dropToGap` 指的是被拖拽节点是否被 drop 在节点之间的位置，如果为 false 则是 drop 在某个节点上方

::demo-block{demo="tree/zh-CN/Draggable" title="拖拽重排"}
::

### 高级定制

**版本 v>=1.7.0**

Tree 组件的 api 支持了大部分的渲染需求，但是如果有非常特殊的定制要求的话，可以使用 `renderFullLabel` 来接管整行 option 的渲染效果。

renderFullLabel 参数类型如下：

```ts
interface TreeFullLabelSlotProps {
  className: string;
  data: TreeNodeData;
  level: number;
  style?: CSSProperties;
  expandIcon: VNodeChild;
  checkStatus: { checked: boolean; halfChecked: boolean };
  expandStatus: { expanded: boolean; loading: boolean };
  filtered?: boolean;
  searchWord?: string;
  onClick(event: MouseEvent | KeyboardEvent): void;
  onContextMenu(event: MouseEvent): void;
  onDoubleClick(event: MouseEvent): void;
  onExpand(event: MouseEvent | KeyboardEvent): void;
  onCheck(event: MouseEvent | KeyboardEvent): void;
}
```

> 如果开启了虚拟化，需要将 style （虚拟化相关样式）赋予给渲染的 DOM 节点

这里给几个常见的高级用法的 demo。

第一个是针对 “希望只有叶子节点可以选中，父节点只起到分组作用” 的场景。

- 你只需要渲染叶子节点前的 Checkbox，并且点击父节点时不触发选中，点击叶子节点触发。
- 同时开启 leafOnly 可以使 onChange 的回调入参都是叶子节点。

⚠️：renderFullLabel 只接管了渲染效果，并不影响内部的数据逻辑。但是你可以选取需要的逻辑进行渲染，或者配合受控来实现更复杂的需求。
::demo-block{demo="tree/zh-CN/FullLabelCheckbox" title="完整行叶节点多选"}
::

第二个是针对 “希望只有叶子节点可以单选，父节点只起到分组作用” 的场景。

- 你只需要点击父节点时不触发选中，点击叶子节点触发。

::demo-block{demo="tree/zh-CN/FullLabelSingle" title="完整行叶节点单选"}
::

第三个是针对 “单选选中父节点同时也高亮子节点” 的场景。
::demo-block{demo="tree/zh-CN/FullLabelHighlight" title="父节点选择高亮"}
::

### 可拖拽的高级定制

我们从 1.27.0 版本开始支持可拖拽（`draggable`）和高级定制（`renderFullLabel`）同时使用，在该版本之前，并不支持二者同时使用。

::demo-block{demo="tree/zh-CN/FullLabelDraggable" title="完整行拖拽重排"}
::

## API参考

### Tree

| 属性                    | 说明                                                                                                                                                                                                                   | 类型                                                                                        | 默认值                   | 版本   |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------ | ------ |
| autoExpandParent        | 是否自动展开父节点，默认为 false，当组件初次挂载时为 true                                                                                                                                                              | `boolean`                                                                                   | false                    | 0.34.0 |
| autoExpandWhenDragEnter | 是否允许拖拽到节点上时自动展开改节点                                                                                                                                                                                   | `boolean`                                                                                   | true                     | 1.8.0  |
| autoMergeValue          | 设置自动合并 value。具体而言是，开启后，当某个父节点被选中时，value 将不包括该节点的子孙节点。（在leafOnly为false的情况下生效）                                                                                        | `boolean`                                                                                   | true                     | 2.61.0 |
| blockNode               | 行显示节点                                                                                                                                                                                                             | `boolean`                                                                                   | true                     | -      |
| checkRelation           | 多选时，节点之间选中状态的关系，可选：'related'、'unRelated'                                                                                                                                                           | `TreeCheckRelation`                                                                         | 'related'                | 2.5.0  |
| className               | 类名                                                                                                                                                                                                                   | `HTMLAttributes['class']`                                                                   | -                        | -      |
| defaultExpandAll        | 设置在初始化时是否展开所有节点。而如果后续数据(`treeData`/`treeDataSimpleJson`)发生改变，这个 api 是无法影响节点的默认展开情况的，如果有这个需要可以使用 `expandAll`                                                   | `boolean`                                                                                   | false                    | -      |
| defaultExpandedKeys     | 默认展开的节点，显示其直接子级                                                                                                                                                                                         | `string[]`                                                                                  | -                        | -      |
| defaultValue            | 指定默认选中的条目                                                                                                                                                                                                     | `TreeValue`                                                                                 | -                        | -      |
| directory               | 目录树模式                                                                                                                                                                                                             | `boolean`                                                                                   | false                    | -      |
| disableStrictly         | 当节点的disabled状态确定时，不可通过子级或者父级的关系选中                                                                                                                                                             | `boolean`                                                                                   | false                    | 1.4.0  |
| disabled                | 禁用整个树，不可选择                                                                                                                                                                                                   | `boolean`                                                                                   | false                    | 0.32.0 |
| draggable               | 是否允许拖拽                                                                                                                                                                                                           | `boolean`                                                                                   | false                    | 1.8.0  |
| emptyContent            | 当搜索无结果时展示的内容                                                                                                                                                                                               | `VNodeChild`                                                                                | `暂无数据`               | 0.32.0 |
| expandAction            | 展开逻辑，可选 false, 'click', 'doubleClick'。默认值为 false，即仅当点击展开按钮时才会展开                                                                                                                             | `TreeExpandAction`                                                                          | false                    | 0.35.0 |
| expandAll               | 设置是否默认展开所有节点，若后续数据(`treeData`/`treeDataSimpleJson`)发生改变，默认展开情况也是会受到这个 api 影响的                                                                                                   | `boolean`                                                                                   | false                    | 1.30.0 |
| expandedKeys            | （受控）展开的节点，默认展开节点显示其直接子级                                                                                                                                                                         | `string[]`                                                                                  | -                        | -      |
| expandIcon              | 自定义展开图标                                                                                                                                                                                                         | `VNodeChild \| ((props: TreeExpandIconSlotProps) => VNodeChild)`                            | -                        | 2.75.0 |
| keyMaps                 | 自定义节点中 key、label、value 的字段。如果 keyMaps 中设置 label 的自定义名称并且开启了搜索，为保证搜索正确，需要将 treeNodeFilterProp 设置为 treeData 的键之一或者通过 filterTreeNode 自定义搜索函数                  | `TreeKeyMaps`                                                                               | -                        | 2.47.0 |
| filterTreeNode          | 是否根据输入项进行筛选，默认用 `treeNodeFilterProp` 的值作为要筛选的 `TreeNodeData` 的属性值, data 参数自 v2.28.0 开始提供                                                                                             | `boolean \| ((inputValue: string, treeNodeString: string, data?: TreeNodeData) => boolean)` | false                    | -      |
| hideDraggingNode        | 是否隐藏正在拖拽的节点的 dragImg                                                                                                                                                                                       | `boolean`                                                                                   | false                    | 1.8.0  |
| icon                    | 自定义图标                                                                                                                                                                                                             | `VNodeChild \| ((props: Record<string, unknown>) => VNodeChild)`                            | -                        | -      |
| labelEllipsis           | 是否开启label的超出省略，默认虚拟化状态开启，如果有其他省略需求可以设置关闭                                                                                                                                            | `boolean`                                                                                   | false\|true(virtualized) | 1.8.0  |
| leafOnly                | 多选模式下是否开启 onChange 回调入参及展示标签只有叶子节点                                                                                                                                                             | `boolean`                                                                                   | false                    | 1.18.0 |
| loadData                | 异步加载数据，需要返回一个Promise                                                                                                                                                                                      | `(node?: TreeNodeData) => Promise<void>`                                                    | -                        | 1.0.0  |
| loadedKeys              | （受控）已经加载的节点，配合 loadData 使用                                                                                                                                                                             | `string[]`                                                                                  | -                        | 1.0.0  |
| motion                  | 是否开启动画                                                                                                                                                                                                           | `boolean`                                                                                   | true                     | -      |
| multiple                | 是否支持多选                                                                                                                                                                                                           | `boolean`                                                                                   | false                    | -      |
| preventScroll           | 指示浏览器是否应滚动文档以显示新聚焦的元素，作用于组件内的 focus 方法                                                                                                                                                  | `boolean`                                                                                   |                          |        |
| renderDraggingNode      | 自定义正在拖拽节点的 dragImg 的 Html 元素                                                                                                                                                                              | `(node: HTMLElement, data: TreeNodeData) => HTMLElement`                                    | -                        | 1.8.0  |
| renderFullLabel         | 完全自定义label的渲染函数                                                                                                                                                                                              | `(props: TreeFullLabelSlotProps) => VNodeChild`                                             | -                        | 1.7.0  |
| renderLabel             | 自定义label的渲染函数, searchWord 参数自 2.65.0 开始支持                                                                                                                                                               | `(label?: VNodeChild, data?: TreeNodeData, searchWord?: string) => VNodeChild`              | -                        | 1.6.0  |
| searchClassName         | 搜索框的 `className` 属性                                                                                                                                                                                              | `HTMLAttributes['class']`                                                                   | -                        | -      |
| searchPlaceholder       | 搜索框默认文字                                                                                                                                                                                                         | `string`                                                                                    | -                        | -      |
| searchRender            | 自定义搜索框的渲染方法，为 false 时可以隐藏组件的搜索框(**V>=1.0.0**)                                                                                                                                                  | `((props: TreeSearchSlotProps) => VNodeChild) \| false`                                     | -                        | 0.35.0 |
| searchStyle             | 搜索框的样式                                                                                                                                                                                                           | `CSSProperties`                                                                             | -                        | -      |
| showClear               | 支持清除搜索框                                                                                                                                                                                                         | `boolean`                                                                                   | true                     | 0.35.0 |
| showFilteredOnly        | 搜索状态下是否只展示过滤后的结果                                                                                                                                                                                       | `boolean`                                                                                   | false                    | 0.32.0 |
| showLine                | 显示连接线                                                                                                                                                                                                             | `boolean`                                                                                   | false                    | 2.50.0 |
| style                   | 样式                                                                                                                                                                                                                   | `CSSProperties`                                                                             | -                        | -      |
| treeData                | treeNodes 数据，如果设置则不需要手动构造 TreeNode 节点（key值在整个树范围内唯一）                                                                                                                                      | `TreeNodeData[]`                                                                            | \[]                      | -      |
| treeDataSimpleJson      | 简单 JSON 形式的 `TreeNodeData` 数据，如果设置则不需要手动构造 TreeNode 节点，返回值为包含选中节点的Json数据                                                                                                           | `Record<string, unknown>`                                                                   | \{}                      | -      |
| treeNodeFilterProp      | 搜索时输入项过滤对应的 `TreeNodeData` 属性                                                                                                                                                                             | `string`                                                                                    | `label`                  | -      |
| value                   | 当前选中的节点的value值，传入该值时将作为受控组件                                                                                                                                                                      | `TreeValue`                                                                                 | -                        | -      |
| virtualize              | 列表虚拟化，用于大量树节点的情况，由 height, width, itemSize 组成，参考 Virtualize Object。开启后将关闭动画效果。                                                                                                      | `TreeVirtualize`                                                                            | -                        | 0.32.0 |
| @change                 | 选中树节点时调用此函数，默认返回值为当前所有选中项的value值                                                                                                                                                            | `[value?: TreeValue]`                                                                       | -                        | -      |
| onChangeWithObject      | 是否将选中项 option 的其他属性作为回调。设为 true 时，onChange 的入参类型会从 string 变为 object: { value, label, ...rest }。此时如果是受控，也需要把 value 设置成 object，且必须含有 value 的键值；defaultValue同理。 | `boolean`                                                                                   | false                    | -      |
| @double-click           | 双击事件的回调                                                                                                                                                                                                         | `[event: MouseEvent, node: TreeNodeData]`                                                   | -                        | 0.35.0 |
| @drag-end               | onDragEnd 事件回调                                                                                                                                                                                                     | `[props: TreeDragProps]`                                                                    | -                        | 1.8.0  |
| @drag-enter             | onDragEnter 事件回调                                                                                                                                                                                                   | `[props: TreeDragEnterProps]`                                                               | -                        | 1.8.0  |
| @drag-leave             | onDragLeave 事件回调                                                                                                                                                                                                   | `[props: TreeDragProps]`                                                                    | -                        | 1.8.0  |
| @drag-over              | onDragOver 事件回调                                                                                                                                                                                                    | `[props: TreeDragProps]`                                                                    | -                        | 1.8.0  |
| @drag-start             | onDragStart 事件回调                                                                                                                                                                                                   | `[props: TreeDragProps]`                                                                    | -                        | 1.8.0  |
| @drop                   | onDrop 事件回调                                                                                                                                                                                                        | `[props: TreeDropProps]`                                                                    | -                        | 1.8.0  |
| @expand                 | 展示节点时调用                                                                                                                                                                                                         | `[expandedKeys: string[], detail: TreeExpandDetail]`                                        | -                        | -      |
| @load                   | 节点加载完毕时触发的回调                                                                                                                                                                                               | `[loadedKeys: Set<string>, node?: TreeNodeData]`                                            | -                        | 1.0.0  |
| @context-menu           | 右键点击的回调                                                                                                                                                                                                         | `[event: MouseEvent, node: TreeNodeData]`                                                   | -                        | 0.35.0 |
| @search                 | 文本框值变化时回调, 入参 filteredExpandedKeys 表示因为搜索或 value / defaultValue 而展开的节点的 key, <br/>可以配合 expandedKeys 受控时使用。filteredExpandedKeys 在 2.38.0 中新增                                     | `[input: string, filteredExpandedKeys: string[]]`                                           | -                        | -      |
| @select                 | 被选中时调用，返回值为当前事件选项的key值                                                                                                                                                                              | `[key: string, selected: boolean, node: TreeNodeData]`                                      | -                        | -      |

### TreeNodeData

> **不同 `TreeNodeData` 的 key 值要求必填且唯一。**`label` 允许重复。**v>=1.7.0** 之前 value 值要求必须必填且唯一。
> **v>=1.7.0** 之后 value 值非必填。此时 onChange, value, defaultValue 及 onChangeWithObject 中所取的 value 属性值将改为 key 值。
> 为了保证行为的符合预期，treeData 中的 value 值或者全部不填写，或者全部填写且唯一，不建议混写。

| 属性     | 说明                                                                        | 类型            | 默认值 |
| -------- | --------------------------------------------------------------------------- | --------------- | ------ |
| value    | 属性值                                                                      | `TreePrimitive` | -      |
| label    | 展示的文本                                                                  | `VNodeChild`    | -      |
| icon     | 自定义图标                                                                  | `VNodeChild`    | -      |
| disabled | 是否禁用                                                                    | `boolean`       | false  |
| key      | required且要求唯一                                                          | `string`        | -      |
| isLeaf   | 设置节点为叶子节点，在异步加载数据的情况即传入 loadData 时有效 **v>=1.0.0** | `boolean`       | -      |

### Virtualize Object

> `itemSize` 必传。

| 属性     | 说明                                                                | 类型               | 默认值 |
| -------- | ------------------------------------------------------------------- | ------------------ | ------ |
| height   | 高度值，如果为 string 必须保证有计算高度，即其父节点有 offsetHeight | `number \| string` | '100%' |
| itemSize | 每行的treeNode的高度，必传                                          | `number`           | -      |
| width    | 宽度值                                                              | `number \| string` | '100%' |

## Methods

绑定在组件实例上的方法，可以通过 ref 调用实现某些特殊交互

| 名称     | 描述                                                                   | 类型                                                                                 | 版本   |
| -------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------ |
| search   | 手动触发搜索                                                           | (value: string) => void                                                              | -      |
| scrollTo | 在虚拟化 Tree 中，使得指定节点（该节点为当前树的已展开节点）滚动到视图 | （{key: string; align?: 'center' \| 'start' \| 'end' \| 'smart' \| 'auto';}) => void | 2.18.0 |

## Accessibility

### ARIA

- Tree 支持传入 `aria-label` 来表示该 Tree 作用;
- Tree 会自动为每个子节点分别设置 `aria-disabled`、`aria-checked`、`aria-selected`、`aria-level` 来表明节点状态及层级;
- Tree 会自动为对应部分分别设置 `role` 为 `tree`、`treeitem`。

示例:

```vue
<Tree :tree-data="treeData" aria-label="example tree" />
```

## 文案规范

- 尽量使用短语，首字母大写
- 平级之间保持用语形式一致，例如全是地名或者是国家名

## 设计变量

Tree 使用 `--semi-color-text-0`、`--semi-color-text-2`、`--semi-color-fill-0`、`--semi-color-fill-1` 与 `--semi-color-primary-light-default`。默认主题保留 `.semi-tree-*` class、20 CSS px 层级缩进和 light/dark/RTL 样式。

## Vue 公开契约与 React → Vue

受控选择使用 `v-model` 或 `v-model:value`，受控展开使用 `v-model:expanded-keys`。处理 `@search(input, keys)` 时，需要把过滤展开 keys 回传给受控状态。不要同时绑定 value 与 modelValue。

| React v2.102.0                       | Vue 3.5                                                        |
| ------------------------------------ | -------------------------------------------------------------- |
| value + onChange                     | v-model，或 :value + @change                                   |
| expandedKeys + onExpand              | v-model:expanded-keys + @expand                                |
| renderLabel(label, node, searchWord) | #label="{ label, node, searchWord }" 或现有函数 prop           |
| renderFullLabel(props)               | #fullLabel="row" 或现有函数 prop                               |
| searchRender(props)                  | #search="search"；:search-render="false" 隐藏内置输入框        |
| icon / expandIcon ReactNode          | VNode prop 或 #icon / #expandIcon 插槽                         |
| emptyContent                         | #empty 或 VNode prop                                           |
| ref.current.search / scrollTo        | useTemplateRef<TreeExposed>() 后调用 .value?.search / scrollTo |
| 拖拽回调的 MouseEvent                | TreeDragProps / TreeDropProps 中的原生 DragEvent               |

当前公开 prop 另包含 `modelValue` 和 `ariaLabel`，实例另暴露 `focus()`。`blockNode`、`showClear`、`motion`、`autoMergeValue`、`autoExpandWhenDragEnter` 默认 true，需要显式绑定 false 才能关闭。

事件保持原参数顺序；`change` 同时发出 `update:modelValue`、`update:value`，`expand` 同时发出 `update:expandedKeys`。API 表中的事件类型采用 Vue emits 参数元组，版本列表示固定上游 React 版本历史。

### 完整行与拖拽

fullLabel 插槽拥有整行 DOM，应返回一个原生 li，保留 className 与虚拟化 style，并按实际行为接入 onClick、onExpand、onCheck、onContextMenu、onDoubleClick 回调。expandIcon 已经是 VNode；示例通过不增加包装 DOM 的 VNodeContent 渲染。自定义可拖拽行的原生拖拽事件由 Tree 绑定到该根节点。

使用公开 drop payload 更新 treeData：放到节点上成为子节点；放到间隙成为前后同级节点；放到已展开父节点的下边缘成为第一个子节点。示例采用数组替换，并拒绝把节点移动到其后代中。完整行多选示例会阻止勾选事件冒泡，避免一次点击切换两次。

### 数据与生命周期

key 在全树必须唯一。value 要么全部唯一填写，要么全部省略并使用 key。替换 treeData 时使用 shallowRef 保存包含 VNode 的数据。动态更新示例把随机数据改为确定性轮换；异步示例延迟 1 秒更新，卸载会清理计时器并结束待定 Promise。

虚拟化保留上游 5/4/3 参数，生成 1,705 个节点，视窗高 300 CSS px、行高 28 CSS px。滚动、焦点和拖拽需 Chromium 运行证据，SFC 编译不能替代浏览器验证。本轮不作视觉验收结论。
