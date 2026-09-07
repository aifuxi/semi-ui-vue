---
title: 'DragMove'
description: 'Set elements to change their position by dragging'
locale: 'en-US'
slug: 'drag-move'
category: 'plus'
order: 31
englishTitle: 'DragMove'
icon: 'doc-dragmove'
upstream: 'plus/dragMove'
---

`DragMove` lets its single child change position with mouse or touch input. It supports bounded
movement, a dedicated drag handle, native-input protection, relative positioning, and custom
position writes.

```ts
import { DragMove } from '@aifuxi/semi-ui-vue/drag-move';
import '@aifuxi/semi-theme-default/drag-move.css';
```

## Demos

### Basic usage

The single child uses absolute positioning. The outer demo container reserves space without constraining movement.

::demo-block{demo="drag-move/en-US/Basic" title="Basic usage"}
::

### Limit drag range

constrainer returns a relatively positioned container; the blue block stays within its bounds.

::demo-block{demo="drag-move/en-US/Constrainer" title="Limit drag range"}
::

### Custom drag handle

Only the central icon starts dragging; other areas do not.

::demo-block{demo="drag-move/en-US/Handler" title="Custom drag handle"}
::

### Custom position handling

customMove writes top/left/right. Right anchoring keeps the block in bounds when clicking to resize. The small width is 50px in English and 60px in Chinese; both expand to 100px, preserving the upstream difference.

::demo-block{demo="drag-move/en-US/CustomMove" title="Custom position handling"}
::

## Basic usage

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

## React → Vue

| React v2.102.0                    | Vue                              | Notes                                      |
| --------------------------------- | -------------------------------- | ------------------------------------------ |
| `<DragMove>{child}</DragMove>`    | `<DragMove><Child /></DragMove>` | `children` becomes the single default slot |
| `constrainer={() => ref.current}` | `:constrainer="() => container"` | Return an element or pass `'parent'`       |
| `handler={() => ref.current}`     | `:handler="() => handle"`        | Vue template ref                           |
| `positionStrategy="relative"`     | `position-strategy="relative"`   | Same enum values                           |
| `allowInputDrag`                  | `allow-input-drag`               | Bare Boolean prop                          |
| `allowMove={fn}`                  | `:allow-move="fn"`               | Same signature                             |
| `customMove={fn}`                 | `:custom-move="fn"`              | Arguments remain element, top, left        |
| `onMouseDown={fn}`                | `@mouse-down="fn"`               | Vue emit                                   |
| `onMouseMove={fn}`                | `@mouse-move="fn"`               | Vue emit                                   |
| `onMouseUp={fn}`                  | `@mouse-up="fn"`                 | Vue emit                                   |
| `onTouchStart/Move/End/Cancel`    | `@touch-start/move/end/cancel`   | Vue emits                                  |

React merges the child ref through `cloneElement`; Vue uses a limited `cloneVNode(..., true)` boundary without adding a wrapper. React class component / `forwardRef` DOM forwarding maps to a single-root Vue component whose root is an `HTMLElement`.

## Additional Vue examples

These examples supplement Vue API usage and are not counted as upstream demo mappings.

::demo-block{demo="drag-move/en-US/Example1" title="Example1"}
::
