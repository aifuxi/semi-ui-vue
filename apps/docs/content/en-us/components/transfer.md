---
title: 'Transfer'
description: 'A more intuitive and efficient multiple-selection selector, which can reveal more information about options, and supports search functions. The disadvantage is that it takes up more space'
locale: 'en-US'
slug: 'transfer'
category: 'input'
order: 51
englishTitle: 'Transfer'
icon: 'doc-transfer'
upstream: 'input/transfer'
---

Transfer moves items between a source collection and a selected collection. The pinned local Semi Design v2.102.0 source is the sole parity baseline.

## Demos

### How to import

```ts
import { Transfer } from '@aifuxi/semi-ui-vue/transfer';
import '@aifuxi/semi-theme-default/transfer.css';
```

Each English example includes `ConfigProvider` with `locale="{ code: 'en-US' }"` so built-in search, counts, clear actions, and pagination remain English in both the page and the standalone editor.

### Basic usage

Each item provides `value`, `label`, and `key`. Select a source item to add it, then use its remove icon in the selected panel to remove it. Changes are logged to the browser console.

::demo-block{demo="transfer/en-US/Basic" title="Basic usage"}
::

### Grouped

Set `type="groupList"` and provide top-level `{ title, children }` objects. Nested groups are not supported. The initially selected B-3 item is disabled and cannot be deselected or cleared.

::demo-block{demo="transfer/en-US/Grouped" title="Grouped"}
::

### Custom filtering logic, custom option data rendering

The `filter` function determines matches. This example searches both names and email addresses and highlights the search text with Highlight. The `#sourceItem` and `#selectedItem` slots receive item data and actions.

::demo-block{demo="transfer/en-US/CustomFilter" title="Custom filtering and items"}
::

### Disabled

Set `disabled` to disable the entire Transfer while preserving its initially selected items.

::demo-block{demo="transfer/en-US/Disabled" title="Disabled"}
::

### Drag and drop sort

Set `draggable` and drag a selected item's handle to reorder the list. The `change` event reports the reordered values and items.

::demo-block{demo="transfer/en-US/Draggable" title="Drag and drop sort"}
::

### Left panel pagination

`pagination` applies only to the `list/groupList` source panel. This example shows 10 items per page and supports cross-page selection and searching.

::demo-block{demo="transfer/en-US/Pagination" title="Left panel pagination"}
::

### Left panel pagination + controlled page

Control the page with `pagination.currentPage` and update state through `onPageChange`. The external buttons navigate to pages 1, 2, 5, and 10.

::demo-block{demo="transfer/en-US/ControlledPagination" title="Controlled page"}
::

### Drag and drop + custom selected rendering

Custom items show an avatar, name, and email. Bind the selected slot's `dragHandleProps` to the drag handle instead of wrapping a React node with `sortableHandle`.

::demo-block{demo="transfer/en-US/CustomDraggable" title="Custom selected-item dragging"}
::

### Custom rendering header information in panel

Use `#sourceHeader` and `#selectedHeader` to customize titles. Their `onAllClick` and `onClear` callbacks retain select-all, unselect-all, and clear behavior.

::demo-block{demo="transfer/en-US/CustomHeaders" title="Custom panel headers"}
::

### Fully custom rendering

The `#sourcePanel` and `#selectedPanel` slots replace entire panels. Use the supplied data and actions for searching, adding, removing, selecting all, and clearing, without maintaining a second selection store.

::demo-block{demo="transfer/en-US/CustomPanels" title="Fully custom panels"}
::

### Fully custom rendering, drag and drop sorting

When replacing the panels, the demo also owns drag handling. These remain two separate upstream examples: React-specific react-sortable-hoc and dnd-kit are adapted to Vue templates and native HTML5 drag-and-drop, committing the order through `onSortEnd({ oldIndex, newIndex })`. No React drag library is required.

::demo-block{demo="transfer/en-US/CustomPanelSortable" title="Custom panel dragging: Sortable adaptation"}
::

::demo-block{demo="transfer/en-US/CustomPanelDnd" title="Custom panel dragging: Dnd adaptation"}
::

### Tree Transfer

Set `type="treeList"` to display source data with Tree and use `treeProps` to override its defaults. Both upstream languages use these English place names: Shanghai is initially selected and Mexico is disabled. Tree defaults include `multiple`, `disableStrictly`, `leafOnly`, and `filterTreeNode` set to true, with `searchRender` set to false. Configure custom tree filtering with `treeProps.filterTreeNode`.

::demo-block{demo="transfer/en-US/Tree" title="Tree Transfer"}
::

### Tree Transfer with custom header showing leaf node count

The source header slot provides `leafOnlyNum` for trees. This example displays 7 files and 10 total nodes, excluding folders from the file count.

::demo-block{demo="transfer/en-US/TreeLeafCount" title="Leaf node count"}
::

All 14 examples follow the fixed upstream order, which is identical in both languages with no language-exclusive demos. This is the content-completion batch; strict React/Vue visual and behavioral acceptance is separate.

## API

| Property                             | Type                                  | Default  | Description                               |
| ------------------------------------ | ------------------------------------- | -------- | ----------------------------------------- |
| `dataSource`                         | `TransferDataSource`                  | `[]`     | Source data                               |
| `defaultValue`                       | `(string \| number)[]`                | `[]`     | Uncontrolled initial values               |
| `value` / `modelValue`               | `(string \| number)[]`                | -        | Controlled values; supports `v-model`     |
| `type`                               | `'list' \| 'groupList' \| 'treeList'` | `'list'` | Data presentation mode                    |
| `filter`                             | `boolean \| (input, item) => boolean` | `true`   | Search field and matching logic           |
| `disabled` / `loading` / `draggable` | `boolean`                             | `false`  | Disabled, loading, and sorting states     |
| `showPath`                           | `boolean`                             | `false`  | Show full tree paths on the selected side |
| `inputProps` / `treeProps`           | component props                       | -        | Inner Input/Tree configuration            |
| `emptyContent`                       | `{ left, right, search }`             | locale   | Empty-state content                       |
| `pagination`                         | `TransferPaginationProps`             | -        | Source-panel pagination                   |
| `virtualize`                         | `{ height?, width?, itemSize }`       | -        | Fixed-row selected-list virtualization    |

Events: `change(values, items)`, `select(item)`, `deselect(item)`, `search(input)`, `update:value`, and `update:modelValue`. The component ref exposes `search(value)`, which updates the search state without emitting `search`.

## Accessibility, theme, and SSR

The filter uses `role=search`; both panels use `role=list`, and entries use `role=listitem`. Default source items inherit Checkbox keyboard and focus behavior. Light/dark, RTL, and messages follow the theme and ConfigProvider. Root and subpath imports are SSR-safe.

## React → Vue

| React v2.102.0                                   | Vue                                                | Notes                                                      |
| ------------------------------------------------ | -------------------------------------------------- | ---------------------------------------------------------- |
| `<Transfer value={value} onChange={setValue} />` | `<Transfer v-model="value" />`                     | Separate `value` and `@change` are also supported          |
| `dataSource` / `defaultValue` / `type`           | Same props in kebab-case                           | Data structures and enum values are preserved              |
| `renderSourceItem={fn}`                          | `#sourceItem="scope"`                              | The corresponding function prop is also available          |
| `renderSelectedItem={fn}`                        | `#selectedItem="scope"`                            | Includes `onRemove` and, when draggable, `dragHandleProps` |
| `renderSourcePanel` / `renderSelectedPanel`      | `#sourcePanel` / `#selectedPanel`                  | Slot scope supplies panel data and actions                 |
| `emptyContent`                                   | Same prop or `#emptyLeft/#emptyRight/#emptySearch` | Slots take precedence                                      |
| `ref.current.search(value)`                      | `transferRef.search(value)`                        | Does not emit the search event                             |
| ReactNode                                        | `VNodeChild` / slot                                | Native Vue content                                         |

The function-prop form still supports `sortableHandle(render)`. Templates should bind `dragHandleProps` to their custom handle. Native HTML5 drag events and Vue fixed-row windowing replace dnd-kit and react-window without exposing React-specific types in the public API.
