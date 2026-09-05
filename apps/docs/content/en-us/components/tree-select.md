---
title: 'TreeSelect'
description: 'TreeSelector is used for structured display & selection of multi-level tree data, such as displaying a list of folders and files, displaying a list of organizational structure members, and so on.'
locale: 'en-US'
slug: 'tree-select'
category: 'input'
order: 52
englishTitle: 'TreeSelect'
icon: 'doc-treeselect'
upstream: 'input/treeselect'
---

TreeSelect presents hierarchical options for single or multiple selection. It consumes the public Vue component package and follows the fixed Semi Design v2.102.0 reference.

## Import

```vue
<script setup lang="ts">
import { TreeSelect } from '@aifuxi/semi-ui-vue/tree-select';
import '@aifuxi/semi-theme-default/tree-select.css';
</script>
```

## Basic Usage

Supply a hierarchy through `treeData`. Keys must be unique across the tree. Either supply unique values for every node or omit every `value` and use keys instead. The popup scrolls when its maximum height is reached.

::demo-block{demo="tree-select/en-us/Basic" title="Basic Usage"}
::

## Multi-choice

Enable `multiple` for checkbox selection. Parent and child selections are related by default, and a complete subtree can be represented by its parent. `leafOnly` returns leaf nodes instead. Both modes are shown below.

::demo-block{demo="tree-select/en-us/Multiple" title="Multi-choice"}
::

## Limit Tags Number

`maxTagCount` limits visible tags, not the number of selections. `showRestTagsPopover` reveals hidden tags when hovering +N; `restTagsPopoverProps` configures that popup.

::demo-block{demo="tree-select/en-us/MaxTagCount" title="Limit Tags Number"}
::

## Searchable

Enable `filterTreeNode` or provide a matching function (input, text, node). Search uses label unless `treeNodeFilterProp` selects another field. `showFilteredOnly` restricts the visible hierarchy to matching paths. `searchAutoFocus` focuses the popup search field. The search event supplies the input, expanded keys and matching nodes.

::demo-block{demo="tree-select/en-us/Search" title="Searchable"}
::

## Remote Search

`remote` skips local filtering; the search handler supplies results. This example generates three local results after 500 ms without a network request. A new search cancels the previous one, and clearing the input clears results. Loading text is rendered through the empty slot; TreeSelect has no public loading prop.

::demo-block{demo="tree-select/en-us/Remote" title="Remote Search"}
::

## Search Box Position

`searchPosition` defaults to dropdown. Set it to `trigger` to move the search input into the selection control, with `filterTreeNode` enabled. Both single and `multiple` selection are shown.

::demo-block{demo="tree-select/en-us/SearchPosition" title="Search Box Position"}
::

## Wrap tags in trigger (triggerTagWrap)

`triggerTagWrap` applies when `multiple`, `filterTreeNode` and `searchPosition`="`trigger`" are all enabled. With a fixed `trigger` width, selected tags and long input wrap to new lines. `maxTagCount` is omitted so every tag remains visible.

::demo-block{demo="tree-select/en-us/TriggerTagWrap" title="Wrap tags in trigger (triggerTagWrap)"}
::

## Size

`size` supports small, default and large. Each selector owns its uncontrolled selection independently.

::demo-block{demo="tree-select/en-us/Sizes" title="Size"}
::

## Default Expand All

`defaultExpandAll` only expands data present at initialization. `expandAll` also affects later data updates. Both controls start empty and receive the same tree data 500 ms after mounting, making the difference observable.

::demo-block{demo="tree-select/en-us/ExpandAll" title="Default Expand All"}
::

## Disabled

`disabled` disables the whole selector while retaining the selected display. A node-level `disabled` flag restricts that node in `multiple` mode. Use `disableStrictly` to include descendants, as shown next.

::demo-block{demo="tree-select/en-us/Disabled" title="Disabled"}
::

## Disable Strictly

`disableStrictly` prevents interaction with `disabled` nodes and their descendants and includes that relationship in selection calculations. China is `disabled` while Shanghai remains an initial selection.

::demo-block{demo="tree-select/en-us/DisableStrictly" title="Disable Strictly"}
::

## Controlled Component

Use v-model for controlled selection, or `value` with change / v-model:`value`. `defaultValue` only initializes uncontrolled state. With `onChangeWithObject` enabled, both controlled values and change events use node objects.

::demo-block{demo="tree-select/en-us/Controlled" title="Controlled Component"}
::

## Checked Relationship

`checkRelation`="related" links parents and descendants by default. With unRelated, each node is selected independently: selecting Asia does not automatically select China or its cities.

::demo-block{demo="tree-select/en-us/CheckRelation" title="Checked Relationship"}
::

## Controlled Expansion with Search

Controlled expansion waits for the parent to return `expandedKeys`. Merge `filteredExpandedKeys` from search into the existing keys so collapsed ancestors do not hide search matches.

::demo-block{demo="tree-select/en-us/SearchExpansion" title="Controlled Expansion with Search"}
::

## Virtualized TreeSelect

`virtualize` specifies the item `size` and viewport height to reduce the DOM `size`. The button generates a deterministic tree of 1,705 nodes with 28 px rows and a 236 px viewport. Search only shows matching paths. Virtualization disables node expansion motion.

::demo-block{demo="tree-select/en-us/Virtualized" title="Virtualized TreeSelect"}
::

## Dynamic Update of Data

Replace `treeData` to change the hierarchy. This demo cycles deterministically through different parent and child counts. Keep keys and values stable for surviving nodes when updating production data.

::demo-block{demo="tree-select/en-us/DynamicData" title="Dynamic Update of Data"}
::

## Load Data Asynchronously

`loadData` returns a Promise and supplies `children` when an unloaded node expands. Nodes marked `isLeaf` do not load. This demo adds local `children` after one second and supplies values consistently for every node. Pending timers are cancelled on unmount. `loadedKeys` accepts an array while load emits a Set; convert explicitly when controlling it.

::demo-block{demo="tree-select/en-us/AsyncData" title="Load Data Asynchronously"}
::

## Custom Trigger

Use the `trigger` scoped slot in place of React triggerRender. TagInput renders selected keys, `inputValue`/`onSearch` synchronizes the query, and `onRemove` removes a selection by `key`. Preserve a keyboard-focusable input in custom triggers.

::demo-block{demo="tree-select/en-us/CustomTrigger" title="Custom Trigger"}
::

## Custom Rendering Selected Item

In single mode, `selectedItem` can render the label directly. In `multiple` mode, `renderSelectedItem` with { content, isRenderInTag: true } lets the component wrap the content in a Tag. With the `selectedItem` slot, provide the full content and call `onClose` when needed. The Chinese baseline uses closable white tags; the English baseline does not.

::demo-block{demo="tree-select/en-us/SelectedItem" title="Custom Rendering Selected Item"}
::

## API Reference

::api-table{slug="tree-select"}
::

### TreeNodeData and values

| Field    | Type             | Meaning                                                              |
| -------- | ---------------- | -------------------------------------------------------------------- |
| key      | string           | Required; unique across the tree.                                    |
| value    | string or number | Use unique values everywhere or omit everywhere to fall back to key. |
| label    | VNodeChild       | Display label; labels may repeat.                                    |
| children | TreeNodeData[]   | Child nodes.                                                         |
| icon     | VNodeChild       | Node icon.                                                           |
| disabled | boolean          | Disables selection for this node in multiple mode.                   |
| isLeaf   | boolean          | Marks a leaf for asynchronous loading.                               |

TreeValue is a string, number, node object, or an array of these. TreeVirtualize contains itemSize, height and optional width. TreeKeyMaps maps the key, value, label, children, icon, disabled and isLeaf fields.

### Render scopes

- TreeSelectSelectedItemProps: node, index and onClose(content?, event?).
- TreeSelectTriggerRenderProps: selected nodes in value, inputValue, placeholder, disabled, componentProps and onSearch/onRemove/onClear.
- TreeSelectSearchRenderProps: Input props plus className, value and onChange(value).
- TreeFullLabelSlotProps / TreeExpandIconSlotProps follow [Tree](/en-us/components/tree/). Forward supplied event handlers, classes and styles when replacing an entire row.

## Accessibility

The trigger is keyboard focusable and defaults to the accessible name TreeSelect. Supply a purpose-specific aria-label or aria-labelledby. The popup tree exposes treeitem states including aria-level, aria-selected, aria-checked and aria-disabled. Preserve keyboard focus and expanded/selected state when providing custom nodes or a trigger. Escape closes the popup; arrow keys navigate or expand nodes and Enter selects the focused option.

aria-describedby, aria-errormessage, aria-invalid and aria-required can connect help, validation and required-field information. Validation styling alone does not replace an accessible error message.

## Theme and SSR

Use ConfigProvider to select locale and direction. Theme CSS supports light/dark, and imports are SSR-safe. Mount custom popup containers before opening them. Create timers or fetches in client lifecycle/event handlers and cancel outstanding work when leaving the page. Never put browser-only DOM reads in module scope.

## React → Vue

| React                           | Vue                                                                          |
| ------------------------------- | ---------------------------------------------------------------------------- |
| value + onChange                | v-model, v-model:value, or value + @change                                   |
| expandedKeys + onExpand         | v-model:expanded-keys and @expand                                            |
| onSearch/onLoad/onVisibleChange | @search/@load/@visible-change                                                |
| renderLabel/renderFullLabel     | #label/#fullLabel, or the corresponding function prop                        |
| renderSelectedItem              | #selectedItem for full content; function prop for isRenderInTag behavior     |
| triggerRender/searchRender      | #trigger/#search, or the corresponding function prop                         |
| outerTopSlot/outerBottomSlot    | #outerTop/#outerBottom                                                       |
| ReactNode                       | VNodeChild or a Vue slot                                                     |
| ref.current.search()/close()    | useTemplateRef<TreeSelectExposed>() and the exposed search()/close() methods |

Props that default to true must receive :prop="false" explicitly to disable them. In particular this applies to showSearchClear, autoMergeValue, dropdownMatchSelectWidth, clickToHide, clickTriggerToHide, motion and motionExpand. Callback parameters retain their node/key semantics; event listeners use Vue emits.

## Design Tokens

::token-table{component="treeSelect"}
::
