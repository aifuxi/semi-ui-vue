# Tree

Tree presents hierarchical, expandable and selectable data. This Vue slice is pinned to Semi Design v2.102.0 and preserves the `.semi-tree-*` DOM/classes, theme tokens, selection relations, search, async loading, drag-and-drop, virtual scrolling, keyboard, ARIA and RTL contracts.

## Basic usage

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { Tree, type TreeNodeData, type TreeValue } from '@workspace/ui';
import '@workspace/theme-default/tree.css';

const value = shallowRef<TreeValue>('docs');
const treeData: TreeNodeData[] = [
  {
    key: 'guide',
    label: 'Guide',
    value: 'guide',
    children: [
      { key: 'docs', label: 'Docs', value: 'docs' },
      { key: 'api', label: 'API', value: 'api' },
    ],
  },
];
</script>

<template>
  <Tree v-model="value" default-expand-all :tree-data="treeData" />
</template>
```

Use `multiple` with `checkRelation="related"` for parent/child checked and half-checked state, or `unRelated` for independent nodes. Search is enabled by `filterTreeNode`; `showFilteredOnly` limits output to matches, their ancestors and descendants.

## Controlled and imperative APIs

`v-model:expandedKeys` controls expansion. `loadData` returns a Promise and works with controlled `loadedKeys`. A component ref exposes `search(value)`, `scrollTo({ key, align })`, and `focus()`; virtual scrolling accepts `itemSize`, `height`, and `width`.

## Public surface

The main props are `treeData`, `treeDataSimpleJson`, `keyMaps`, `value/modelValue/defaultValue`, `multiple`, `checkRelation`, `expandedKeys/defaultExpandedKeys`, `defaultExpandAll`, `expandAll`, `filterTreeNode`, `searchRender`, `blockNode`, `showLine`, `directory`, `icon`, `expandIcon`, `renderLabel`, `renderFullLabel`, `loadData`, `loadedKeys`, `draggable`, `virtualize`, `disabled`, `motion`, and `labelEllipsis`.

Events are `change`, `select`, `expand`, `search`, `load`, `contextMenu`, `doubleClick`, all drag events, and Vue update events for value and expanded keys. Scoped slots are `search`, `empty`, `icon`, `expandIcon`, `label`, and `fullLabel`.

See [the alignment matrix](./alignment.md) for pinned source evidence, event order, Boolean-presence gates, SSR, visual evidence and deviations.
