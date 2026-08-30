# List

List displays a sequence of related data. This implementation uses the pinned local Semi Design v2.102.0 source as its only parity baseline and preserves the fixed `.semi-list*` DOM/classes, Grid, loading, locale, dark theme, and RTL contracts.

## Basic usage

```vue
<script setup lang="ts">
import { List, ListItem } from '@aifuxi/semi-ui-vue';

const users = ['Alice', 'Bob'];
</script>

<template>
  <List :data-source="users" bordered>
    <template #item="{ item, index }">
      <ListItem :header="`${index + 1}.`" :main="item" />
    </template>
  </List>
</template>
```

Declarative items can be supplied through the default slot:

```vue
<List size="small">
  <ListItem>First</ListItem>
  <ListItem>Second</ListItem>
</List>
```

## Regions, Grid, and loading

```vue
<List :data-source="users" :grid="{ gutter: 12, span: 12 }" loading>
  <template #header>Members</template>
  <template #item="{ item }"><ListItem>{{ item }}</ListItem></template>
  <template #footer>{{ users.length }} items</template>
  <template #loadMore><button>Load more</button></template>
</List>
```

## List API

| Property              | Type                          | Default       | Description                                                   |
| --------------------- | ----------------------------- | ------------- | ------------------------------------------------------------- |
| `bordered`            | `boolean`                     | `false`       | Shows the outer border                                        |
| `dataSource`          | `readonly T[]`                | -             | Calls the item slot/renderItem for every non-empty data entry |
| `emptyContent`        | `VNodeChild`                  | Locale text   | Custom empty state; `#emptyContent` is also supported         |
| `footer` / `header`   | `VNodeChild`                  | -             | Header/footer props or named slots                            |
| `grid`                | `ListGrid`                    | -             | Row/Col grid configuration                                    |
| `layout`              | `'vertical'                   | 'horizontal'` | `'vertical'`                                                  | List direction |
| `loading`             | `boolean`                     | `false`       | Shows the large Spin and dims children                        |
| `loadMore`            | `VNodeChild`                  | -             | Content after the footer; `#loadMore` is also supported       |
| `renderItem`          | `(item, index) => VNodeChild` | -             | Function form; templates should prefer `#item`                |
| `size`                | `'small'                      | 'default'     | 'large'`                                                      | `'default'`    | Size |
| `split`               | `boolean`                     | `true`        | Shows item separators                                         |
| `className` / `style` | Vue class / style             | -             | Compatibility class and inline styles                         |

Events: `click(event)` and `rightClick(event)`. They receive item events when that ListItem has no local listener.

Slots: `default`, `item({ item, index })`, `header`, `footer`, `loadMore`, and `emptyContent`.

## ListItem API

| Property                    | Type              | Default    | Description                 |
| --------------------------- | ----------------- | ---------- | --------------------------- |
| `align`                     | `'flex-start'     | 'flex-end' | 'center'                    | 'baseline' | 'stretch'` | `'flex-start'` | Header/main cross-axis alignment |
| `header` / `main` / `extra` | `VNodeChild`      | -          | Region props or named slots |
| `className` / `style`       | Vue class / style | -          | Item styling                |

Events: `click`, `rightClick`, `mouseEnter`, and `mouseLeave`. The default slot is rendered after the body and before extra.

## Accessibility and SSR

The normal layout keeps `ul/li` semantics and does not invent listbox roles, tab stops, or a keyboard state machine. The loading SVG is `aria-hidden`. Imports, SSR rendering, and hydration do not access browser globals.

See the [alignment matrix](./alignment.md) for pinned source evidence, Boolean/slot gates, visual coverage, and deviations.
