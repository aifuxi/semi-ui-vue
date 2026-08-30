# OverflowList

OverflowList is a layout behavior component. It keeps as many items as the measured width allows and delegates the remaining items to the scoped `overflow` slot.

## Import

```ts
import { OverflowList } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/overflow-list.css';
```

## Collapse mode

```vue
<OverflowList :items="items">
  <template #visibleItem="{ item }">
    <span class="token">{{ item.label }}</span>
  </template>
  <template #overflow="{ items: hidden }">
    <button v-if="hidden.length">+{{ hidden.length }}</button>
  </template>
</OverflowList>
```

Set `collapseFrom="start"` to collect items from the beginning. `minVisibleItems` keeps a minimum number of items even when space is insufficient.

## Scroll mode

```vue
<OverflowList :items="items" render-mode="scroll">
  <template #visibleItem="{ item }"><span>{{ item.label }}</span></template>
  <template #overflow="{ items: hidden, position }">
    <button v-if="hidden.length">{{ position }}: {{ hidden.length }}</button>
  </template>
</OverflowList>
```

Scroll mode requires stable item keys. Use `itemKey` for a different key field or getter. The observed element receives `data-scrollkey`.

## API

| Property                            | Type                                | Default      | Description                   |
| ----------------------------------- | ----------------------------------- | ------------ | ----------------------------- |
| `items`                             | `OverflowItem[]`                    | `[]`         | Item data                     |
| `collapseFrom`                      | `'start' \| 'end'`                  | `'end'`      | Collapse boundary             |
| `minVisibleItems`                   | `number`                            | `0`          | Minimum visible count         |
| `renderMode`                        | `'collapse' \| 'scroll'`            | `'collapse'` | Render mode                   |
| `threshold`                         | `number`                            | `0.75`       | Scroll intersection threshold |
| `itemKey`                           | `string \| number \| (item) => key` | `'key'`      | Stable key strategy           |
| `wrapperClassName` / `wrapperStyle` | `string` / `StyleValue`             | -            | Scroll wrapper attributes     |
| `overflowRenderDirection`           | `'both' \| 'start' \| 'end'`        | `'both'`     | Scroll control placement      |

## Slots and events

- `#visibleItem="{ item, index }"` renders an item.
- `#overflow="{ items, position }"` renders collected items; scroll mode supplies start and end arrays separately.
- `@overflow(items)` fires when the collapse pivot changes.
- `@visibleStateChange(map)` then `@intersect(entries)` fire for a scroll intersection batch.
