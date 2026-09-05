---
title: 'Tree'
description: 'A tree view component presents a hierarchical list.'
locale: 'en-US'
slug: 'tree'
category: 'navigation'
order: 61
englishTitle: 'Tree'
icon: 'doc-tree'
upstream: 'navigation/tree'
---

Tree presents hierarchical, expandable and selectable data. This Vue slice is pinned to Semi Design v2.102.0 and preserves the `.semi-tree-*` DOM/classes, theme tokens, selection relations, search, async loading, drag-and-drop, virtual scrolling, keyboard, ARIA and RTL contracts.

## Basic usage

::demo-block{demo="tree/en-US/Example1" title="Basic usage"}
::

Use `multiple` with `checkRelation="related"` for parent/child checked and half-checked state, or `unRelated` for independent nodes. Search is enabled by `filterTreeNode`; `showFilteredOnly` limits output to matches, their ancestors and descendants.

## Controlled and imperative APIs

`v-model:expandedKeys` controls expansion. `loadData` returns a Promise and works with controlled `loadedKeys`. A component ref exposes `search(value)`, `scrollTo({ key, align })`, and `focus()`; virtual scrolling accepts `itemSize`, `height`, and `width`.

## Public surface

The main props are `treeData`, `treeDataSimpleJson`, `keyMaps`, `value/modelValue/defaultValue`, `multiple`, `checkRelation`, `expandedKeys/defaultExpandedKeys`, `defaultExpandAll`, `expandAll`, `filterTreeNode`, `searchRender`, `blockNode`, `showLine`, `directory`, `icon`, `expandIcon`, `renderLabel`, `renderFullLabel`, `loadData`, `loadedKeys`, `draggable`, `virtualize`, `disabled`, `motion`, and `labelEllipsis`.

Events are `change`, `select`, `expand`, `search`, `load`, `contextMenu`, `doubleClick`, all drag events, and Vue update events for value and expanded keys. Scoped slots are `search`, `empty`, `icon`, `expandIcon`, `label`, and `fullLabel`.

See [the alignment matrix](https://github.com/aifuxi/semi-ui-vue/blob/master/docs/components/tree/alignment.md) for pinned source evidence, event order, Boolean-presence gates, SSR, visual evidence and deviations.

## React → Vue

| Semi React v2.102.0                          | Vue                                                        |
| -------------------------------------------- | ---------------------------------------------------------- |
| `<Tree value={value} onChange={setValue} />` | `<Tree v-model="value" />`                                 |
| `expandedKeys` + `onExpand`                  | `v-model:expanded-keys` + `@expand`                        |
| `onSelect(key, selected, node)`              | `@select="(key, selected, node) => ..."`                   |
| `onSearch(input, keys)`                      | `@search="(input, keys) => ..."`                           |
| `renderLabel(label, node, word)`             | 同名 prop，或 `#label="{ label, node, searchWord }"`       |
| `renderFullLabel(props)`                     | 同名 prop，或 `#fullLabel="props"`                         |
| `searchRender(props)`                        | 同名 prop，或 `#search="props"`；显式 `false` 仍隐藏搜索框 |
| `icon` / `expandIcon` ReactNode/function     | 同名 VNode/function，或 `#icon` / `#expandIcon`            |
| `emptyContent` ReactNode                     | 同名 VNode prop，或 `#empty`                               |
| `ref.current.search(value)`                  | `treeRef.search(value)`                                    |
| `ref.current.scrollTo(data)`                 | `treeRef.scrollTo(data)`                                   |

Vue 不发布 ReactNode、render props、SyntheticEvent 或 React ref 类型。事件采用原生 `MouseEvent`、`KeyboardEvent`、`DragEvent`；数据、顺序与可见行为保持固定基线。默认 true 的 `showClear`、`blockNode`、`motion`、`autoExpandWhenDragEnter` 与 `autoMergeValue` 保留“缺省 / 显式 false / 显式 true”三态，不要用普通 truthiness 代替 prop 存在性。
