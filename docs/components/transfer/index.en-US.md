# Transfer

Transfer moves items between a source collection and a selected collection. The pinned local Semi Design v2.102.0 source is the sole parity baseline.

## Basic usage

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { Transfer } from '@aifuxi/semi-ui-vue';

const selected = shallowRef<Array<string | number>>(['design']);
const data = [
  { key: 1, label: 'Design', value: 'design' },
  { key: 2, label: 'Engineering', value: 'engineering' },
  { key: 3, label: 'Finance', value: 'finance', disabled: true },
];
</script>

<template><Transfer v-model="selected" :data-source="data" /></template>
```

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
