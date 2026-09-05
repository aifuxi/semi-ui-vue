---
title: 'Tree'
description: 'Hierarchical tree lists.'
locale: 'en-US'
slug: 'tree'
category: 'navigation'
order: 61
englishTitle: 'Tree'
icon: 'doc-tree'
upstream: 'navigation/tree'
---

The following Vue 3.5 examples follow the fixed Semi Design v2.102.0 source. Selection, expansion, filtering, async loading and drag/drop use the public Tree API. Async data is generated locally; no server is contacted.

## Demos

### How to import

```ts
import { Tree } from '@aifuxi/semi-ui-vue/tree';
import '@aifuxi/semi-theme-default/tree.css';
```

### Basic Usage

By default, tree is in single select mode and each item is selectable.

::demo-block{demo="tree/en-US/Basic" title="Basic"}
::

### Multi-choice

You could use `multiple` to set mode to multi-choice. When all child items are selected, the parent item will be selected.

::demo-block{demo="tree/en-US/Multiple" title="Multiple"}
::

### Searchable

Use `filterTreeNode` to support search input. By default it searches the `label` property of the data. You can use `treeNodeFilterProp` to set another property to search or pass in a function to `filterTreeNode` to customize search behavior.

You could also use `showFilteredOnly` if you prefer to display filtered results only.

::demo-block{demo="tree/en-US/Search" title="Search"}
::

After setting the `filterTreeNode` property to enable search, you can customize the rendering method of the search box by setting `searchRender`. When set to `false`, the search box can be hidden.
::demo-block{demo="tree/en-US/CustomSearch" title="Custom Search"}
::

### Trigger search manually

Use ref to get tree instance，you can call `search` method of tree to trigger search manually. Note that you need to set `filterTreeNode` to enable search at the same time.If the search box is outside the tree, you can hide the search box inside the tree by setting `searchRender=false`.
::demo-block{demo="tree/en-US/ManualSearch" title="Manual Search"}
::

### JSON TreeData

You could use `treeDataSimpleJson` to pass in `treeNodes` data in JSON format. In this case, key will be used as `key` and `label`, and value will be used as `value` correspondingly. Return value includes JSON data in selected nodes.

::demo-block{demo="tree/en-US/SimpleJson" title="Simple Json"}
::

### BlockNode

You could use `blockNode` to set node to display as a row. In this case, styles for hovering and selected state take effects on the entire row. By default, it is set to `true`. When it is set to `false`, only label will be highlighted.

::demo-block{demo="tree/en-US/BlockNode" title="Block Node"}
::

### Custom TreeNode Label

You could pass in VNodeChild for `label` in `TreeNodeData` to customize label. Pay attention that by default `filterTreeNode` searches data by label. When label is a VNodeChild, it is advised to pass in customized search function for a searchable tree.

::demo-block{demo="tree/en-US/LabelActions" title="Label Actions"}
::

### Long labels with actions

Use the label slot with Typography ellipsis and a separate action button. Stop propagation on that button so it does not select the node. This example translates Chinese upstream example 9, which is absent from the English source.

::demo-block{demo="tree/en-US/LabelEllipsis" title="Long labels with actions"}
::

### Custom Icon

You could use `icon` to add customized icon.

::demo-block{demo="tree/en-US/Icons" title="Icons"}
::

### Directory

You could use `directory` to display tree as a directory with default icons. Also, the icon could be overwritten by custom Icon.

::demo-block{demo="tree/en-US/Directory" title="Directory"}
::

### Disabled

You can use `disableStrictly` to set whether to enable strict disabling. After enabling strict disabling, when the node is disabled, the selected state cannot be changed through the relationship between the child or the parent.

::demo-block{demo="tree/en-US/Disabled" title="Disabled"}
::

### Checked RelationShip

Version: >= 2.5.0

When multiple selections are made, `checkRelation` can be used to set the type of node selection relationship, optional: 'related' (default), 'unRelated'. When the selection relationship is 'unRelated', it means that selections between nodes do not affect each other.

::demo-block{demo="tree/en-US/CheckRelation" title="Check Relation"}
::

### Default Expand All

Both `defaultExpandAll` and `expandAll` can set the default expanded/collapsed state of `Tree`. The difference between the two is that `defaultExpandAll` only takes effect at initialization, while `expandAll` will not only take effect at initialization, but also when the data (`treeData`/`treeDataSimpleJson`) is dynamically updated, `expandAll` will still take effect.

Among them, `expandAll` is supported starting from 1.30.0.

In the demo below, after clicking the button to update `TreeData`, `defaultExpandAll` becomes invalid, and `expandAll` still takes effect.

::demo-block{demo="tree/en-US/ExpandAll" title="Expand All"}
::

### Controlled Expansion with Search

When `expandedKeys` is passed in, it is the expanded controlled component, which can be used with `onExpand`. When the expansion is controlled, if you enable `filterTreeNode` and search, the node will not be automatically expanded. At this time, the expansion of the node is completely controlled by `expandedKeys`. You can use the input parameter `filteredExpandedKeys` (version: >= 2.38.0) of `onSearch` to realize the search expansion effect when the expansion is controlled.

::demo-block{demo="tree/en-US/ControlledSearch" title="Controlled Search"}
::

### Controlled Component

You can use `value` along with `onChange` property if you want to use Tree as a controlled component.

::demo-block{demo="tree/en-US/Controlled" title="Controlled"}
::

### Auto Expand Parent

In the case of controlled expansion, when `autoExpandParent` is turned on, if you want to collapse the parent element, you need to collapse all its child elements. By default, `autoExpandParent` is false, that is, the collapse of the parent element is not affected by the child element.

::demo-block{demo="tree/en-US/AutoExpandParent" title="Auto Expand Parent"}
::

### Custom expansion icon

The expansion Icon can be customized through `expandIcon`. Supports passing in VNodeChild or functions. `expandIcon` is supported since 2.75.0.

```ts
interface TreeExpandIconSlotProps {
  className: string;
  expanded: boolean;
  onClick(event: MouseEvent | KeyboardEvent): void;
}
```

Examples are as follows:

::demo-block{demo="tree/en-US/ExpandIcon" title="Expand Icon"}
::

### Tree with line

Set the line between nodes through `showLine`, the default is false, supported starting from 2.50.0

::demo-block{demo="tree/en-US/Lines" title="Lines"}
::

### Virtualized Tree

If you need to render large sets of tree structured data, you could use virtualized tree. In virtualized mode, animation / motion is disabled for better performance.

The property `virtualize` is an object consisting of the following values:

- height: Height of the tree, If passed in as a string, computed height should not be zero for render purpose, in other words, parent node should have offsetHeight
- width: Width of the tree.
- itemSize: Height for each line of treeNode, required

If tree is searchable, you could also set `showFilteredOnly={true}` to reduce time of rendering for results.

::demo-block{demo="tree/en-US/Virtualized" title="Virtualized"}
::

### Dynamic Update of Data

::demo-block{demo="tree/en-US/DynamicData" title="Dynamic Data"}
::

### Load Data Asynchronously

You could use `loadData` to load treeData asynchronously on node expansion. Notice `isLeaf` is required to mark node as leaf in treeData.
::demo-block{demo="tree/en-US/AsyncData" title="Async Data"}
::

### Draggable Tree

You could use `draggable` along with `onDrop` to achieve a draggable Tree.

> Drag and drop is available since v 1.8.0. Simultaneous use with virtualization is currently not supported

The callback input parameters of the drag event are as follows:

```
- onDragEnd: function({ event, node: DragTreeNode })
- onDragEnter:function({ event, node: DragTreeNode, expandedKeys: string[] })
- onDragLeave:function({ event, node: DragTreeNode })
- onDragOver:function({ event, node: DragTreeNode })
- onDragStart: function({ event, node: DragTreeNode })
- onDrop:function({ event, node: DragTreeNode, dragNode: DragTreeNode, dragNodesKeys: string[], dropPosition: number, dropToGap: Boolean })
```

The data type DragTreeNode, in addition to all the attributes of TreeNodeData, also includes expanded and pos attributes,

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

- `pos` refers to the positional relationship of the current node in the entire treeData, such as the 0th node of the 2nd node of the 1st node of the 0th layer: '0-1-2-0'
- `dropPosition` refers to the position where the dragged node is dropped in the current hierarchy. If it is inserted before the 0th node of the same level, it will be -1, and after the 0th node, it will be 1, and it will fall on it. is 0, and so on. With dropToGap, a more complete judgment can be obtained.
- `dropToGap` refers to whether the dragged node is dropped between nodes, if false, it is dropped above a node

::demo-block{demo="tree/en-US/Draggable" title="Draggable"}
::

### Advanced FullRender

**v>=1.7.0**

You could use `renderFullLabel` for advanced rendering to render the entire option on you own.

The parameter types of renderFullLabel are as follows:

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

> If virtualized is set to true, be sure to apply `style` to targeted VNodeChild to correctly render virtualized list.

Here are some demos.

First is to render Parent node as separator and only allow leaf nodes to be selected.

renderFullLabel only takes care of the UI rendering and won't affect inside data logic. But you could choose info to your needs and use it with controlled mode for advanced usage.

::demo-block{demo="tree/en-US/FullLabelCheckbox" title="Full Label Checkbox"}
::

The second is for the scenario of "I hope that only leaf nodes can be single-selected, and the parent node only plays a role in grouping".

- You only need to click on the parent node without triggering the selection, click on the leaf node to trigger.

::demo-block{demo="tree/en-US/FullLabelSingle" title="Full Label Single"}
::

Third is for the scenario when selecting Parent node also highlighting child node.

::demo-block{demo="tree/en-US/FullLabelHighlight" title="Full Label Highlight"}
::

### Advanced FullRender with Draggable

Starting from version 1.27.0, we support the simultaneous use of draggable (`draggable`) and advanced customization (`renderFullLabel`). Before this version, the simultaneous use of both was not supported.

::demo-block{demo="tree/en-US/FullLabelDraggable" title="Full Label Draggable"}
::

## API Reference

### Tree

| Properties              | Instructions                                                                                                                                                                                                                                                                     | Type                                                                                        | Default                  | Version |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------ | ------- |
| autoExpandParent        | Toggle whether to expand parent node automatically                                                                                                                                                                                                                               | `boolean`                                                                                   | false                    | 0.34.0  |
| autoExpandWhenDragEnter | Toggle whether allow autoExpand when drag enter node                                                                                                                                                                                                                             | `boolean`                                                                                   | true                     | 1.8.0   |
| autoMergeValue          | Sets the automerge value. Specifically, when enabled, when a parent node is selected, the value will not include the descendants of the node. (Works if leafOnly is false)                                                                                                       | `boolean`                                                                                   | true                     | 2.61.0  |
| blockNode               | Toggle whether to display node as row                                                                                                                                                                                                                                            | `boolean`                                                                                   | true                     | -       |
| checkRelation           | In multiple, the relationship between the checked states of the nodes, optional: 'related'、'unRelated'                                                                                                                                                                          | `TreeCheckRelation`                                                                         | 'related'                | 2.5.0   |
| className               | Class name                                                                                                                                                                                                                                                                       | `HTMLAttributes['class']`                                                                   | -                        | -       |
| defaultExpandAll        | Set whether to expand all nodes during initialization. And if the subsequent data (`treeData`/`treeDataSimpleJson`) changes, this api cannot affect the default expansion of the node. If you need this, you can use `expandAll`                                                 | `boolean`                                                                                   | false                    | -       |
| defaultExpandedKeys     | Keys of default expanded nodes. Direct child nodes will be displayed.                                                                                                                                                                                                            | `string[]`                                                                                  | -                        | -       |
| defaultValue            | Default value                                                                                                                                                                                                                                                                    | `TreeValue`                                                                                 | -                        | -       |
| directory               | Toggle whether to display tree in directory mode                                                                                                                                                                                                                                 | `boolean`                                                                                   | false                    | -       |
| disableStrictly         | When a node is disabled, its status could not be changed by its parent or child nodes                                                                                                                                                                                            | `boolean`                                                                                   | false                    | 1.4.0   |
| disabled                | Toggle whether to disable the entire tree to be unselectable                                                                                                                                                                                                                     | `boolean`                                                                                   | false                    | 0.32.0  |
| draggable               | Toggle whether allow draggable                                                                                                                                                                                                                                                   | `boolean`                                                                                   | false                    | 1.8.0   |
| emptyContent            | Empty content when no data                                                                                                                                                                                                                                                       | `VNodeChild`                                                                                | `no result`              | 0.32.0  |
| expandAction            | Expand logic, one of false, 'click', 'doubleClick'. Default is set to false, which means item will not be expanded on clicking except on expand icon                                                                                                                             | `TreeExpandAction`                                                                          | false                    | 0.35.0  |
| expandAll               | Set whether to expand all nodes by default. If the subsequent data (`treeData`/`treeDataSimpleJson`) changes, the default expansion will also be affected by this api                                                                                                            | `boolean`                                                                                   | false                    | 1.30.0  |
| expandedKeys            | （Controlled）Keys of expanded nodes. Direct child nodes will be displayed.                                                                                                                                                                                                      | `string[]`                                                                                  | -                        | -       |
| expandIcon              | Custom expand icon                                                                                                                                                                                                                                                               | `VNodeChild \| ((props: TreeExpandIconSlotProps) => VNodeChild)`                            | -                        | 2.75.0  |
| keyMaps                 | Customize the key, label, and value fields in the node. If you set a custom name for the label in keyMaps and enable search, to ensure correct search, you need to set treeNodeFilterProp to one of the keys of treeData or use a custom search function through filterTreeNode. | `TreeKeyMaps`                                                                               | -                        | 2.47.0  |
| filterTreeNode          | Toggle whether searchable or pass in a function to customize search behavior, data parameter provided since v2.28.0                                                                                                                                                              | `boolean \| ((inputValue: string, treeNodeString: string, data?: TreeNodeData) => boolean)` | false                    | -       |
| hideDraggingNode        | Toggle whether to hide dragImg of dragging node                                                                                                                                                                                                                                  | `boolean`                                                                                   | false                    | 1.8.0   |
| icon                    | Icon                                                                                                                                                                                                                                                                             | `VNodeChild \| ((props: Record<string, unknown>) => VNodeChild)`                            | -                        | -       |
| labelEllipsis           | Toggle whether to ellipsis label when overflow. Set to false iff there are other requirements                                                                                                                                                                                    | `boolean`                                                                                   | false\|true(virtualized) | 1.8.0   |
| leafOnly                | Toggle whether to display tags for leaf nodes only and for onChange callback params in multiple mode                                                                                                                                                                             | `boolean`                                                                                   | false                    | 1.18.0  |
| loadData                | Load data asynchronously and the return value should be a promise                                                                                                                                                                                                                | `(node?: TreeNodeData) => Promise<void>`                                                    | -                        | 1.0.0   |
| loadedKeys              | （Controlled）Mark node as loaded, working with `loadData`                                                                                                                                                                                                                       | `string[]`                                                                                  | -                        | 1.0.0   |
| motion                  | Toggle whether to turn on animation                                                                                                                                                                                                                                              | `boolean`                                                                                   | true                     | -       |
| multiple                | Toggle whether in multi-choice mode                                                                                                                                                                                                                                              | `boolean`                                                                                   | false                    | -       |
| preventScroll           | Indicates whether the browser should scroll the document to display the newly focused element, acting on the focus method inside the component, excluding the component passed in by the user                                                                                    | `boolean`                                                                                   |                          |         |
| renderDraggingNode      | Custom render function to render html element of dragImg for dragging node                                                                                                                                                                                                       | `(node: HTMLElement, data: TreeNodeData) => HTMLElement`                                    | -                        | 1.8.0   |
| renderFullLabel         | Custom option render function                                                                                                                                                                                                                                                    | `(props: TreeFullLabelSlotProps) => VNodeChild`                                             | -                        | 1.7.0   |
| renderLabel             | Custom label render function. The searchWord parameter is supported since 2.65.0                                                                                                                                                                                                 | `(label?: VNodeChild, data?: TreeNodeData, searchWord?: string) => VNodeChild`              | -                        | 1.6.0   |
| searchClassName         | Classname property for search box                                                                                                                                                                                                                                                | `HTMLAttributes['class']`                                                                   | -                        | -       |
| searchPlaceholder       | Placeholder for search box                                                                                                                                                                                                                                                       | `string`                                                                                    | -                        | -       |
| searchRender            | Custom method to render search input; hide search box if set to false(**V>=1.0.0**)                                                                                                                                                                                              | `((props: TreeSearchSlotProps) => VNodeChild) \| false`                                     | -                        | 0.35.0  |
| searchStyle             | Style for for search box                                                                                                                                                                                                                                                         | `CSSProperties`                                                                             | -                        | -       |
| showClear               | Toggle whether to support clear input box                                                                                                                                                                                                                                        | `boolean`                                                                                   | true                     | 0.35.0  |
| showFilteredOnly        | Toggle whether to displayed filtered result only in search mode                                                                                                                                                                                                                  | `boolean`                                                                                   | false                    | 0.32.0  |
| showLine                | show line between tree nodes                                                                                                                                                                                                                                                     | `boolean`                                                                                   | false                    | 2.50.0  |
| style                   | Inline style                                                                                                                                                                                                                                                                     | `CSSProperties`                                                                             | -                        | -       |
| treeData                | Data for treeNodes                                                                                                                                                                                                                                                               | `TreeNodeData[]`                                                                            | \[]                      | -       |
| treeDataSimpleJson      | Data for treeNodes in JSON format, return value in JSON format as well                                                                                                                                                                                                           | `Record<string, unknown>`                                                                   | \{}                      | -       |
| treeNodeFilterProp      | Property in a `treeNode` used to search                                                                                                                                                                                                                                          | `string`                                                                                    | `label`                  | -       |
| value                   | Current value, used when tree is a controlled component                                                                                                                                                                                                                          | `TreeValue`                                                                                 | -                        | -       |
| virtualize              | Efficiently rendering large lists, refer to VirtualizeObj. Motion is disabled when tree is rendered as virtualized list.                                                                                                                                                         | `TreeVirtualize`                                                                            | -                        | 0.32.0  |
| @change                 | Callback function when the tree node is selected, return the value property of data                                                                                                                                                                                              | `[value?: TreeValue]`                                                                       | -                        | -       |
| onChangeWithObject      | Toggle whether to return all properties in an option as a return value. When set to true, return value looks like: { value, label, ...rest }. For controlled mode, you need to pass an object with { value: value } to value correspondingly. DefaultValue similarly.            | `boolean`                                                                                   | false                    | -       |
| @double-click           | (e: MouseEvent, node: TreeNodeData) => void                                                                                                                                                                                                                                      | `[event: MouseEvent, node: TreeNodeData]`                                                   | 0.35.0                   |
| @drag-end               | Callback function for onDragEnd                                                                                                                                                                                                                                                  | `[props: TreeDragProps]`                                                                    | -                        | 1.8.0   |
| @drag-enter             | Callback function for onDragEnter                                                                                                                                                                                                                                                | `[props: TreeDragEnterProps]`                                                               | -                        | 1.8.0   |
| @drag-leave             | Callback function for onDragLeave                                                                                                                                                                                                                                                | `[props: TreeDragProps]`                                                                    | -                        | 1.8.0   |
| @drag-over              | Callback function for onDragOver                                                                                                                                                                                                                                                 | `[props: TreeDragProps]`                                                                    | -                        | 1.8.0   |
| @drag-start             | Callback function for onDragStart                                                                                                                                                                                                                                                | `[props: TreeDragProps]`                                                                    | -                        | 1.8.0   |
| @drop                   | Callback function for onDrop                                                                                                                                                                                                                                                     | `[props: TreeDropProps]`                                                                    | -                        | 1.8.0   |
| @expand                 | Callback function when expand or collapse a node                                                                                                                                                                                                                                 | `[expandedKeys: string[], detail: TreeExpandDetail]`                                        | -                        | -       |
| @load                   | Callback function when a node is loaded                                                                                                                                                                                                                                          | `[loadedKeys: Set<string>, node?: TreeNodeData]`                                            | -                        | 1.0.0   |
| @context-menu           | Callback function when right click on an item                                                                                                                                                                                                                                    | `[event: MouseEvent, node: TreeNodeData]`                                                   | -                        | 0.35.0  |
| @search                 | Callback function when search value changes. `filteredExpandedKeys` represents the key of the node expanded due to search or value/defaultValue, which can be used when expandedKeys is controlled<br/> **filteredExpandedKeys is supported in 2.38.0**                          | `[input: string, filteredExpandedKeys: string[]]`                                           |
| @select                 | Callback function when selected, return the key property of data                                                                                                                                                                                                                 | `[key: string, selected: boolean, node: TreeNodeData]`                                      | -                        | -       |

### TreeNodeData

> **Key for `TreeNodeData` is required and must be unique**, `label` can be duplicated. Before **v>=1.7.0** value is also required and must be unique.
> After **v>=1.7.0**, value is not required. In this case, the value property in `onChange`, `value`, `defaultValue` and `onChangeWithObject` will point to key property.
> To ensure everything behave as expected, keep a consistency of whether to have value or not to have value.

| Properties | Instructions                                                                                        | Type            | Default |
| ---------- | --------------------------------------------------------------------------------------------------- | --------------- | ------- |
| value      | Value                                                                                               | `TreePrimitive` | -       |
| label      | Displayed label                                                                                     | `VNodeChild`    | -       |
| icon       | Icon                                                                                                | `VNodeChild`    | -       |
| disabled   | Disabled                                                                                            | `boolean`       | false   |
| key        | Required and must be unique                                                                         | `string`        | -       |
| isLeaf     | Toggle whether node is leaf node, only takes effect in async load data with `loadData` **v>=1.0.0** | `boolean`       | -       |

### Virtualize Object

> `itemSize` is required to render virtualized tree。

| Properties | Instructions                                                                                                                            | Type               | Default |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ------- |
| height     | Height. If passed as a string, computed height should not be 0 for render purpose, in other words, parent node should have offsetHeight | `number \| string` | '100%'  |
| itemSize   | Height for each line of treeNode, required                                                                                              | `number`           | -       |
| width      | Width                                                                                                                                   | `number \| string` | '100%'  |

## Methods

Some internal methods provided by Tree can be accessed through ref:

| Name     | Description                                                                                          | Type                                                                                 | Version |
| -------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------- |
| search   | Trigger search manually                                                                              | (value: string) => void                                                              | -       |
| scrollTo | In a virtualized Tree, make the specified node(Which is an expanded node in the tree) scroll to view | （{key: string; align?: 'center' \| 'start' \| 'end' \| 'smart' \| 'auto';}) => void | 2.18.0  |

## Accessibility

### ARIA

- Tree supports passing in `aria-label` to indicate the role of the Tree;
- Tree will set `aria-disabled`, `aria-checked`, `aria-selected`, and `aria-level` for each child node to indicate the node status and level;
- Tree will set `role` to `tree` and `treeitem` for corresponding parts.

Demo:

```vue
<Tree :tree-data="treeData" aria-label="example tree" />
```

## Content Guidelines

- Try to use phrases, capitalize the first letter
- Keep the same form of terminology between levels, such as all place names or country names

## Design Tokens

Tree uses `--semi-color-text-0`, `--semi-color-text-2`, `--semi-color-fill-0`, `--semi-color-fill-1` and `--semi-color-primary-light-default`. The default theme retains `.semi-tree-*` classes, 20 CSS px indentation and light/dark/RTL styles.

## Vue contracts and React → Vue

Use `v-model` or `v-model:value` for controlled selection; use `v-model:expanded-keys` for controlled expansion. When handling `@search(input, keys)`, return the filtered keys to the controlled expansion state. Do not bind value and modelValue simultaneously.

| React v2.102.0                       | Vue 3.5                                                            |
| ------------------------------------ | ------------------------------------------------------------------ |
| value + onChange                     | v-model, or :value + @change                                       |
| expandedKeys + onExpand              | v-model:expanded-keys + @expand                                    |
| renderLabel(label, node, searchWord) | #label="{ label, node, searchWord }" or the existing function prop |
| renderFullLabel(props)               | #fullLabel="row" or the existing function prop                     |
| searchRender(props)                  | #search="search"; :search-render="false" hides the built-in field  |
| icon / expandIcon ReactNode          | VNode props or #icon / #expandIcon slots                           |
| emptyContent                         | #empty or a VNode prop                                             |
| ref.current.search / scrollTo        | useTemplateRef<TreeExposed>() then .value?.search / scrollTo       |
| MouseEvent for drag callbacks        | Native DragEvent in TreeDragProps / TreeDropProps                  |

The current public props also include `modelValue` and `ariaLabel`. The instance additionally exposes `focus()`. Default-true props `blockNode`, `showClear`, `motion`, `autoMergeValue` and `autoExpandWhenDragEnter` must receive an explicit bound false to disable them.

Events retain their original argument order. `change` also emits `update:modelValue` and `update:value`; `expand` also emits `update:expandedKeys`. API event types above are Vue emits argument tuples. Version labels refer to the fixed upstream React release history.

### Custom rows and drag/drop

A fullLabel slot owns the entire row. Return one native li, preserve className and virtualization style, and connect the supplied onClick, onExpand, onCheck, onContextMenu and onDoubleClick callbacks as required. The supplied expandIcon is already a VNode: these examples use a small VNodeContent renderer without adding a wrapper. Tree attaches native drag events to the root of a custom draggable row.

Use the public drop payload to update treeData. Moving onto a node adds a child; moving to a gap inserts a sibling, while the bottom gap of an expanded parent inserts its first child. The examples replace arrays after a move and reject moves into the dragged subtree. The full-row checkbox example stops propagation so one click produces one checked-state update.

### Data and lifecycle

Keep keys unique throughout the tree. Use either unique values for every node or omit all values and use keys. File-system-like or custom VNode data should stay in shallowRef when replacing treeData. The dynamic example uses a deterministic sequence instead of random values. The async example resolves after 1 second and clears pending timers when unmounted.

Virtualization generates 1,705 nodes with the upstream 5/4/3 parameters, a 300 CSS px viewport and 28 CSS px rows. Browser scrolling, focus and drag/drop need Chromium verification; SFC compilation alone does not prove them. This migration has no visual acceptance conclusion.
