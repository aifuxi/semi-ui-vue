# Cascader

Cascader selects a path from hierarchical data. The pinned local Semi Design v2.102.0 source is the sole parity baseline.

## Basic usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Cascader, type CascaderData, type CascaderValue } from '@aifuxi/semi-ui-vue';

const value = ref<CascaderValue>(['asia', 'china', 'shanghai']);
const treeData: CascaderData[] = [
  {
    label: 'Asia',
    value: 'asia',
    children: [
      {
        label: 'China',
        value: 'china',
        children: [{ label: 'Shanghai', value: 'shanghai' }],
      },
    ],
  },
];
</script>

<template>
  <Cascader v-model="value" :tree-data="treeData" filter-tree-node show-clear />
</template>
```

## Multiple selection, search, and async data

`multiple` selects paths with Checkbox. `checkRelation="related"`, `leafOnly`, and `autoMergeValue` define parent-child value merging; `max` limits selections. `filterTreeNode` enables local matching, `remote` leaves filtering to the caller, and `virtualizeInSearch` renders large result sets with a fixed row height. Use `loadData` and `loadedKeys` for async children.

## Vue slots

Use `#trigger`, `#display`, `#filter`, `#prefix`, `#suffix`, `#arrowIcon`, `#clearIcon`, `#expandIcon`, `#top`, `#bottom`, and `#empty`. Compatible function and node props remain available for migration.

## API

| Property                                    | Type                                | Default               | Description                                     |
| ------------------------------------------- | ----------------------------------- | --------------------- | ----------------------------------------------- |
| `treeData`                                  | `CascaderData[]`                    | `[]`                  | Hierarchical data                               |
| `defaultValue`                              | `CascaderValue`                     | -                     | Uncontrolled initial value                      |
| `value` / `modelValue`                      | `CascaderValue`                     | -                     | Controlled value; supports `v-model`            |
| `multiple` / `changeOnSelect`               | `boolean`                           | `false`               | Multiple mode and non-leaf selection            |
| `checkRelation`                             | `'related' \| 'unRelated'`          | `'related'`           | Parent-child selection relation                 |
| `leafOnly` / `autoMergeValue`               | `boolean`                           | `false` / `true`      | Leaf-only output and subtree merging            |
| `disableStrictly`                           | `boolean`                           | `false`               | Strict disabled propagation                     |
| `filterTreeNode`                            | `boolean \| function`               | `false`               | Enable search or supply a predicate             |
| `filterLeafOnly` / `filterSorter`           | `boolean` / function                | `true` / -            | Filter leaves and sort results                  |
| `searchPosition` / `remote`                 | `'trigger' \| 'custom'` / `boolean` | `'trigger'` / `false` | Search location and remote mode                 |
| `virtualizeInSearch`                        | `CascaderVirtualize`                | -                     | Virtualized search results                      |
| `loadData` / `loadedKeys`                   | function / `string[]`               | -                     | Async loading and loaded keys                   |
| `keyMaps`                                   | `CascaderKeyMaps`                   | `{}`                  | Map value/label/children/disabled/isLeaf fields |
| `displayProp` / `treeNodeFilterProp`        | `string`                            | `'label'`             | Display and filter fields                       |
| `separator` / `showNext`                    | `string` / `'click' \| 'hover'`     | `' / '` / `'click'`   | Path separator and expansion gesture            |
| `showClear` / `borderless` / `disabled`     | `boolean`                           | `false`               | Clear, borderless, and disabled states          |
| `size` / `validateStatus`                   | enum                                | `'default'`           | Size and validation state                       |
| `defaultOpen` / `motion`                    | `boolean`                           | `false` / `true`      | Initial popup and motion                        |
| `getPopupContainer` / `position` / `zIndex` | function / enum / number            | body / auto / `1030`  | Portal and positioning                          |
| `max` / `maxTagCount`                       | `number`                            | -                     | Selection and visible-tag limits                |
| `onChangeWithObject`                        | `boolean`                           | `false`               | Return data objects instead of values           |

Events: `change`, `select`, `search`, `load`, `listScroll`, `exceed`, `clear`, `focus`, `blur`, `visibleChange`, `update:value`, and `update:modelValue`. The component ref exposes `open()`, `close()`, `focus()`, `blur()`, and `search(value)`.

## Accessibility, theme, and SSR

The trigger uses `role=combobox`, the popup uses `role=listbox`, and columns/options preserve the upstream menu/menuitem and ARIA relationships. Light/dark, mobile, RTL, and zh-CN/en-US scenarios are covered by fixed-Chromium comparisons. Root and `@aifuxi/semi-ui-vue/cascader` imports are SSR-safe.
