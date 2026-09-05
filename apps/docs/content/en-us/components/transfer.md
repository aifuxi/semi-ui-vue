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

## Basic usage

::demo-block{demo="transfer/en-US/Example1" title="Basic usage"}
::

## Groups, trees, and pagination

- `type="groupList"` accepts `{ title, children }[]`.
- `type="treeList"` reuses Tree. Use `showPath` for full selected paths and `treeProps` for tree search and presentation.
- `pagination` applies to the `list/groupList` source panel and supports controlled or uncontrolled pages.

## Custom rendering

Prefer the `#sourceItem`, `#selectedItem`, `#sourceHeader`, `#selectedHeader`, `#sourcePanel`, and `#selectedPanel` scoped slots. Compatible function props such as `renderSourceItem` remain available.

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

| React v2.102.0                                   | Vue                                                | 说明                                          |
| ------------------------------------------------ | -------------------------------------------------- | --------------------------------------------- |
| `<Transfer value={value} onChange={setValue} />` | `<Transfer v-model="value" />`                     | 仍可单独使用 `value` 与 `@change`             |
| `dataSource` / `defaultValue` / `type`           | 同名 kebab-case props                              | 数据结构与枚举不变                            |
| `renderSourceItem={fn}`                          | `#sourceItem="scope"`                              | 同名函数 prop 仍保留                          |
| `renderSelectedItem={fn}`                        | `#selectedItem="scope"`                            | `onRemove` 保留；拖拽时提供 `dragHandleProps` |
| `renderSourcePanel` / `renderSelectedPanel`      | `#sourcePanel` / `#selectedPanel`                  | actions 与数据均在 slot scope 中              |
| `emptyContent`                                   | 同名 prop 或 `#emptyLeft/#emptyRight/#emptySearch` | slot 优先                                     |
| `ref.current.search(value)`                      | `transferRef.search(value)`                        | 不触发 search 事件                            |
| ReactNode                                        | `VNodeChild` / slot                                | Vue 原生节点映射                              |

React 的 `sortableHandle(render)` 在函数 prop 中仍可用；模板 slot 推荐把 `dragHandleProps` 绑定到自定义拖拽节点。HTML5 拖拽和 Vue 固定行高 windowing 分别替代 dnd-kit 与 react-window，不把 React 专属类型暴露到公开声明。
