# OverflowList 折叠列表

OverflowList 是纯布局行为组件：它根据真实可用宽度保留尽可能多的项目，并把其余项目交给 `overflow` 作用域插槽。

## 引入

```ts
import { OverflowList } from '@workspace/ui';
import '@workspace/theme-default/overflow-list.css';
```

## 折叠模式

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

`collapseFrom="start"` 从数组开头折叠，`minVisibleItems` 设置即使空间不足也必须保留的最少项目数。

## 滚动模式

```vue
<OverflowList :items="items" render-mode="scroll">
  <template #visibleItem="{ item }"><span>{{ item.label }}</span></template>
  <template #overflow="{ items: hidden, position }">
    <button v-if="hidden.length">{{ position }}: {{ hidden.length }}</button>
  </template>
</OverflowList>
```

scroll 模式要求每项具有稳定 `key`，也可用 `itemKey` 指定字段名或 getter。最终可观察元素带有 `data-scrollkey`。

## API

| 属性                                | 类型                                | 默认值       | 说明                     |
| ----------------------------------- | ----------------------------------- | ------------ | ------------------------ |
| `items`                             | `OverflowItem[]`                    | `[]`         | 项目数据                 |
| `collapseFrom`                      | `'start' \| 'end'`                  | `'end'`      | collapse 折叠方向        |
| `minVisibleItems`                   | `number`                            | `0`          | 最少可见项数             |
| `renderMode`                        | `'collapse' \| 'scroll'`            | `'collapse'` | 渲染模式                 |
| `threshold`                         | `number`                            | `0.75`       | scroll 相交阈值          |
| `itemKey`                           | `string \| number \| (item) => key` | `'key'`      | 稳定键策略               |
| `wrapperClassName` / `wrapperStyle` | `string` / `StyleValue`             | -            | scroll wrapper 属性      |
| `overflowRenderDirection`           | `'both' \| 'start' \| 'end'`        | `'both'`     | scroll overflow 控件位置 |

## 插槽与事件

- `#visibleItem="{ item, index }"`：渲染可见项目。
- `#overflow="{ items, position }"`：渲染折叠项目；scroll 模式分别收到 start/end 数组。
- `@overflow(items)`：collapse 的 overflow pivot 改变时触发。
- `@visibleStateChange(map)`、`@intersect(entries)`：scroll 相交批次更新后依次触发。
