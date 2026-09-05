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

TreeSelect selects one or more nodes from hierarchical data. The pinned local Semi Design v2.102.0 source is the sole parity baseline.

## Basic usage

::demo-block{demo="tree-select/en-US/Example1" title="Basic usage"}
::

## Multiple selection and search

With `multiple`, nodes are selected through Checkbox. `checkRelation="related"` links parents and children, `leafOnly` returns only leaf nodes, and `autoMergeValue` controls complete-subtree merging. `filterTreeNode` accepts `true` or a custom predicate. Set `searchPosition="trigger"` to move the input into the trigger.

## Custom rendering

Prefer the `#label`, `#fullLabel`, `#selectedItem`, `#search`, `#trigger`, `#outerTop`, and `#outerBottom` scoped slots. Compatible function props such as `renderLabel`, `renderSelectedItem`, `searchRender`, and `triggerRender` remain available.

## API

| Property                               | Type                                | Default          | Description                                |
| -------------------------------------- | ----------------------------------- | ---------------- | ------------------------------------------ |
| `treeData`                             | `TreeNodeData[]`                    | `[]`             | Tree data                                  |
| `defaultValue`                         | `TreeValue`                         | -                | Uncontrolled initial value                 |
| `value` / `modelValue`                 | `TreeValue`                         | -                | Controlled value; supports `v-model`       |
| `multiple`                             | `boolean`                           | `false`          | Multiple selection                         |
| `checkRelation`                        | `'related' \| 'unRelated'`          | `'related'`      | Parent-child selection relation            |
| `leafOnly` / `autoMergeValue`          | `boolean`                           | `false` / `true` | Leaf-only values and subtree merging       |
| `filterTreeNode`                       | `boolean \| function`               | `false`          | Enable search or provide a predicate       |
| `searchPosition`                       | `'dropdown' \| 'trigger'`           | `'dropdown'`     | Search field position                      |
| `expandedKeys` / `defaultExpandedKeys` | `string[]`                          | -                | Controlled/uncontrolled expanded nodes     |
| `defaultExpandAll` / `expandAll`       | `boolean`                           | `false`          | Initially or continuously expand all nodes |
| `defaultOpen`                          | `boolean`                           | `false`          | Initially open the popup                   |
| `showClear`                            | `boolean`                           | `false`          | Show the clear control                     |
| `dropdownMatchSelectWidth`             | `boolean`                           | `true`           | Match the trigger's minimum width          |
| `getPopupContainer`                    | `() => HTMLElement`                 | `document.body`  | Popup container                            |
| `size`                                 | `'small' \| 'default' \| 'large'`   | `'default'`      | Size                                       |
| `validateStatus`                       | `'default' \| 'warning' \| 'error'` | `'default'`      | Validation state                           |
| `loadData` / `loadedKeys`              | function / `string[]`               | -                | Async loading and controlled loaded nodes  |

Events: `change`, `select`, `search`, `expand`, `load`, `clear`, `focus`, `blur`, `visibleChange`, `update:value`, `update:modelValue`, and `update:expandedKeys`. The component ref exposes `close()` and `search(value)`.

## Accessibility, theme, and SSR

The trigger uses `role=combobox`; the list and nodes reuse Tree's `role=tree/treeitem`, keyboard, and focus behavior. Light/dark, RTL, and search/empty messages follow the theme and ConfigProvider locale. Root and `@aifuxi/semi-ui-vue/tree-select` imports are SSR-safe.

## React → Vue

| React v2.102.0                                     | Vue                                                   | 说明                              |
| -------------------------------------------------- | ----------------------------------------------------- | --------------------------------- |
| `<TreeSelect value={value} onChange={setValue} />` | `<TreeSelect v-model="value" />`                      | 仍可单独使用 `value` 与 `@change` |
| `treeData` / `multiple` / `leafOnly`               | 同名 kebab-case props                                 | 数据结构与枚举保持不变            |
| `expandedKeys` / `onExpand`                        | `:expanded-keys` / `@expand` / `v-model:expandedKeys` | Vue 增加原生双向绑定              |
| `renderLabel={fn}`                                 | `#label="scope"`                                      | 同名函数 prop 仍保留              |
| `renderFullLabel={fn}`                             | `#fullLabel="scope"`                                  | scope 与 Tree 一致                |
| `renderSelectedItem={fn}`                          | `#selectedItem="{ node, index, onClose }"`            | 多选可自定义标签或内容            |
| `searchRender={fn}`                                | `#search="inputProps"`                                | 显式 `false` 隐藏搜索框           |
| `triggerRender={fn}`                               | `#trigger="scope"`                                    | scope 保留 value 与操作函数       |
| `prefix` / `suffix` / `insetLabel`                 | 同名 prop 或 slot                                     | slot 优先                         |
| `outerTopSlot` / `outerBottomSlot`                 | `#outerTop` / `#outerBottom`                          | 同名 VNode prop 仍保留            |
| `onVisibleChange`                                  | `@visibleChange`                                      | 布尔参数不变                      |
| `ref.current.close()` / `search(value)`            | `treeSelectRef.close()` / `search(value)`             | 通过 `defineExpose` 提供          |
| ReactNode                                          | `VNodeChild` / slot                                   | Vue 原生节点映射                  |

React 的受控 `value` 可迁移为 `modelValue`/`v-model`；为减少迁移成本，本实现仍支持 `value` 并同时发出 `update:value`。回调顺序、节点对象和值语义与固定 Adapter/Foundation 保持一致，不向公开 `.d.ts` 暴露 React 或私有 Foundation 类型。
