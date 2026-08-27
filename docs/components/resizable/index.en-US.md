# Resizable

Resize a single region from its edges/corners, or resize adjacent panels through a divider. The implementation targets Semi Design v2.102.0 and preserves the `.semi-resizable-*` and `--semi-*` compatibility surface.

## Import

```ts
import { Resizable, ResizeGroup, ResizeHandler, ResizeItem } from '@workspace/ui';
// or import them from '@workspace/ui/resizable';
import '@workspace/theme-default/resizable.css';
```

## Single resizable region

```vue
<script setup lang="ts">
import { ref } from 'vue';
import type { ResizeSize } from '@workspace/ui';

const size = ref<ResizeSize>({ width: 320, height: 180 });
</script>

<template>
  <Resizable
    v-model:size="size"
    :min-width="180"
    max-width="80%"
    :grid="[8, 8]"
    @change="(nextSize, event, direction) => console.log(nextSize, event, direction)"
  >
    Drag any enabled edge or corner
  </Resizable>
</template>
```

`size` is controlled: listen to `update:size`, or use `v-model:size`, to update external state. Use `default-size` when only an initial value is required.

## Panel group

```vue
<template>
  <ResizeGroup direction="horizontal" style="width: 720px; height: 320px">
    <ResizeItem default-size="35%" min="180px">Navigation</ResizeItem>
    <ResizeHandler />
    <ResizeItem default-size="65%" min="30%">Details</ResizeItem>
  </ResizeGroup>
</template>
```

Percentage and pixel `defaultSize` values define fixed initial shares. A number or numeric string is a weight for distributing the remaining space. Place each Handler between two adjacent Items.

## Custom handles

```vue
<Resizable :default-size="{ width: 280, height: 160 }">
  Content
  <template #handle-right>
    <span class="my-handle" />
  </template>
</Resizable>
```

Named slots are `handle-top`, `handle-right`, `handle-bottom`, `handle-left`, `handle-topRight`, `handle-bottomRight`, `handle-bottomLeft`, and `handle-topLeft`. Script/render-function users may also pass `handleNode`.

## Cancel resize start

React can cancel through an `onResizeStart` return value. Vue listeners do not provide a return channel, so use the synchronous guard prop:

```vue
<Resizable :before-resize-start="() => !locked" @resize-start="handleStart" />
```

## API

### Resizable props

| Prop                               | Type                                    | Default        | Description                                |
| ---------------------------------- | --------------------------------------- | -------------- | ------------------------------------------ |
| `size`                             | `ResizeSize`                            | -              | Controlled size                            |
| `defaultSize`                      | `ResizeSize`                            | -              | Uncontrolled initial size                  |
| `minWidth/minHeight`               | `string \| number`                      | -              | Minimum dimensions                         |
| `maxWidth/maxHeight`               | `string \| number`                      | -              | Maximum dimensions                         |
| `grid`                             | `number \| [number, number]`            | `[1, 1]`       | Width/height increment snapping            |
| `snap`                             | `{ x?: number[]; y?: number[] }`        | -              | Absolute pixel snap targets                |
| `snapGap`                          | `number`                                | `0`            | Maximum distance for snapping              |
| `boundElement`                     | `parent \| window \| HTMLElement`       | -              | Resize boundary                            |
| `boundsByDirection`                | `boolean`                               | `false`        | Calculate bounds from the active direction |
| `lockAspectRatio`                  | `boolean \| number`                     | `false`        | Lock the initial or explicit aspect ratio  |
| `lockAspectRatioExtraWidth/Height` | `number`                                | `0`            | Dimensions outside the locked ratio        |
| `enable`                           | `ResizeEnable \| false`                 | all directions | Enabled handles                            |
| `handleStyle/handleClass`          | direction maps                          | -              | Per-handle style/class                     |
| `handleWrapperStyle/Class`         | `CSSProperties/string`                  | -              | Handle wrapper style/class                 |
| `handleNode`                       | `ResizeHandleNode`                      | -              | Per-direction script VNodes                |
| `scale`                            | `number`                                | `1`            | External element scale                     |
| `ratio`                            | `number \| [number, number]`            | `1`            | Pointer-to-dimension multipliers           |
| `beforeResizeStart`                | `(event, direction) => boolean \| void` | -              | Return false to cancel                     |

### Resizable emits

| Event         | Arguments                  |
| ------------- | -------------------------- |
| `resizeStart` | `(event, direction)`       |
| `change`      | `(size, event, direction)` |
| `resizeEnd`   | `(size, event, direction)` |
| `update:size` | `(size)`                   |

### ResizeGroup / ResizeItem

| Component prop           | Type                     | Default      | Description                      |
| ------------------------ | ------------------------ | ------------ | -------------------------------- |
| `ResizeGroup.direction`  | `horizontal \| vertical` | `horizontal` | Group resize axis                |
| `ResizeItem.defaultSize` | `string \| number`       | -            | `%`/`px` share or numeric weight |
| `ResizeItem.min/max`     | `string`                 | -            | Percentage or pixel constraints  |

ResizeItem emits `resizeStart`, `change`, and `resizeEnd` with the same argument shape as Resizable. ResizeHandler accepts a default slot, class, and style; without a slot it renders `IconHandle`.

## Accessibility and SSR

The pinned v2.102.0 handles are mouse/touch-only and do not expose a role, tabindex, ARIA contract, or keyboard behavior. If a product requires a keyboard-adjustable splitter, add the complete semantics and interaction at the product layer instead of adding only a tabindex. All public entries are safe to import and render during SSR.

## React → Vue migration

| React                                | Vue                                                   |
| ------------------------------------ | ----------------------------------------------------- |
| `children`                           | default slot                                          |
| `handleNode.right`                   | `#handle-right`, or keep the `handleNode` script prop |
| `size` + `onChange`                  | `v-model:size` + `@change`                            |
| `onResizeStart={() => false}`        | `:before-resize-start="() => false"`                  |
| `onResizeStart/onChange/onResizeEnd` | `@resize-start/@change/@resize-end`                   |
| `className`                          | `class`                                               |
