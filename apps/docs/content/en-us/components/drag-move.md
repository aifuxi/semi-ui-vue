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

## Basic usage

::demo-block{demo="drag-move/en-US/Example1" title="Basic usage"}
::

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

| React v2.102.0                    | Vue                              | 说明                            |
| --------------------------------- | -------------------------------- | ------------------------------- |
| `<DragMove>{child}</DragMove>`    | `<DragMove><Child /></DragMove>` | `children` 改为唯一默认 slot    |
| `constrainer={() => ref.current}` | `:constrainer="() => container"` | 可返回元素，也可传 `'parent'`   |
| `handler={() => ref.current}`     | `:handler="() => handle"`        | Vue 使用 template ref           |
| `positionStrategy="relative"`     | `position-strategy="relative"`   | 枚举和值保持一致                |
| `allowInputDrag`                  | `allow-input-drag`               | 裸 Boolean prop                 |
| `allowMove={fn}`                  | `:allow-move="fn"`               | 签名保持一致                    |
| `customMove={fn}`                 | `:custom-move="fn"`              | 参数顺序仍为 element、top、left |
| `onMouseDown={fn}`                | `@mouse-down="fn"`               | Vue emit                        |
| `onMouseMove={fn}`                | `@mouse-move="fn"`               | Vue emit                        |
| `onMouseUp={fn}`                  | `@mouse-up="fn"`                 | Vue emit                        |
| `onTouchStart/Move/End/Cancel`    | `@touch-start/move/end/cancel`   | Vue emits                       |

React 通过 `cloneElement` 合并 child ref；Vue 通过范围受限的 `cloneVNode(..., true)`
合并 ref，同样不增加 wrapper。React class component / `forwardRef` 的 DOM 透传，对应 Vue
中根节点为 `HTMLElement` 的单根组件。
