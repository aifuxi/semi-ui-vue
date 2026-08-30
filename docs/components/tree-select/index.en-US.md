# TreeSelect

TreeSelect selects one or more nodes from hierarchical data. The pinned local Semi Design v2.102.0 source is the sole parity baseline.

## Basic usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { TreeSelect, type TreeNodeData } from '@aifuxi/semi-ui-vue';

const value = ref('shanghai');
const treeData: TreeNodeData[] = [
  {
    label: 'Asia',
    value: 'asia',
    key: 'asia',
    children: [
      {
        label: 'China',
        value: 'china',
        key: 'china',
        children: [
          { label: 'Beijing', value: 'beijing', key: 'beijing' },
          { label: 'Shanghai', value: 'shanghai', key: 'shanghai' },
        ],
      },
    ],
  },
];
</script>

<template>
  <TreeSelect
    v-model="value"
    :tree-data="treeData"
    filter-tree-node
    placeholder="Select a city"
    :style="{ width: '300px' }"
  />
</template>
```

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
