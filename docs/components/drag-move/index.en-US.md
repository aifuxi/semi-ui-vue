# DragMove

`DragMove` lets its single child change position with mouse or touch input. It supports bounded
movement, a dedicated drag handle, native-input protection, relative positioning, and custom
position writes.

```ts
import { DragMove } from '@aifuxi/semi-ui-vue/drag-move';
import '@aifuxi/semi-theme-default/drag-move.css';
```

## Basic usage

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { DragMove } from '@aifuxi/semi-ui-vue/drag-move';
import '@aifuxi/semi-theme-default/drag-move.css';

const container = useTemplateRef<HTMLElement>('container');
</script>

<template>
  <div ref="container" style="position: relative; width: 300px; height: 240px">
    <DragMove :constrainer="() => container">
      <div style="top: 40px; left: 40px; width: 80px; height: 80px">Drag me</div>
    </DragMove>
  </div>
</template>
```

DragMove sets the child to `position: absolute` by default. A constrainer should establish a
positioning context, normally with `position: relative`. Use `position-strategy="relative"` when
the child must retain its original place in layout.

## Dedicated handle

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue';

const handle = useTemplateRef<HTMLElement>('handle');
</script>

<template>
  <DragMove :handler="() => handle">
    <section>
      <button ref="handle" type="button">Drag handle</button>
      <p>The body does not start dragging.</p>
    </section>
  </DragMove>
</template>
```

## Inputs and custom movement

Native `input` and `textarea` elements keep their editing behavior and do not start dragging by
default. Add `allow-input-drag` to opt in. When `customMove` is set, it receives the constrained
`top/left` and DragMove no longer writes the position itself.

```vue
<DragMove
  allow-input-drag
  :custom-move="
    (element, top, left) => {
      element.style.transform = `translate(${left}px, ${top}px)`;
    }
  "
>
  <label><input value="Drag from here too" /></label>
</DragMove>
```

## API

| Property           | Description                                         | Type                                      | Default       |
| ------------------ | --------------------------------------------------- | ----------------------------------------- | ------------- |
| `allowInputDrag`   | Allow a drag to start on a native input/textarea    | `boolean`                                 | `false`       |
| `allowMove`        | Decide whether the current start may begin dragging | `(event, element) => boolean`             | -             |
| `constrainer`      | Constraining element or the direct parent           | `'parent' \| (() => HTMLElement \| null)` | -             |
| `customMove`       | Customize the constrained position write            | `(element, top, left) => void`            | -             |
| `handler`          | Return the only drag-start element                  | `() => HTMLElement \| null`               | Child element |
| `positionStrategy` | Positioning strategy for the child                  | `'absolute' \| 'relative'`                | `'absolute'`  |

The default slot must contain one native element or one Vue component whose root resolves to an
`HTMLElement`. DragMove adds no DOM wrapper and preserves the child's existing ref.

## Events

| Event                                                       | Payload      |
| ----------------------------------------------------------- | ------------ |
| `mouse-down` / `mouse-move` / `mouse-up`                    | `MouseEvent` |
| `touch-start` / `touch-move` / `touch-end` / `touch-cancel` | `TouchEvent` |

The start callback always fires first. If the input guard or `allowMove` rejects the drag, no
move/end callback follows.
