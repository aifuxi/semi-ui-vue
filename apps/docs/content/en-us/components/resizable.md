---
title: 'Resizable'
description: "The component size is adjusted based on the user's mouse drag, supporting both resizing of a single component and combined resizing."
locale: 'en-US'
slug: 'resizable'
category: 'basic'
order: 21
englishTitle: 'Resizable'
icon: 'doc-steps'
upstream: 'basic/resizable'
---

## Demos

### How to import

Resizable supported from 2.69.0

```vue
<script setup lang="ts">
import { Resizable, ResizeGroup, ResizeItem, ResizeHandler } from '@aifuxi/semi-ui-vue/resizable';
import '@aifuxi/semi-theme-default/resizable.css';
</script>
```

### Single Component

Basic Usage and Callbacks
You can set the initial size using defaultSize, and set drag callbacks with `@resize-start`, `onResize`, and `@resize-end`.

```ts
interface Size {
  width?: string | number;
  height?: string | number;
}
```

::demo-block{demo="resizable/en-us/Basic" title="Single Component"}
::

### Controlling Resize Directions

You can enable or disable specific resizing directions by setting the value of enable. All directions are enabled by default.

```ts
interface Enable {
  left?: boolean;
  right?: boolean;
  top?: boolean;
  bottom?: boolean;
  topLeft?: boolean;
  topRight?: boolean;
  bottomLeft?: boolean;
  bottomRight?: boolean;
}
```

::demo-block{demo="resizable/en-us/Direction" title="Controlling Resize Directions"}
::

### Setting Resizing Ratio

You can set the drag and resize ratio using ratio.

::demo-block{demo="resizable/en-us/Ratio" title="Setting Resizing Ratio"}
::

### Locking Aspect Ratio

You can lock the aspect ratio by setting lockAspectRatio. It can be a boolean or a number. If true, it locks to the initial aspect ratio; if a number, it locks to the given ratio.

::demo-block{demo="resizable/en-us/AspectRatio" title="Locking Aspect Ratio"}
::

### Setting Maximum and Minimum Width/Height

You can set the maximum and minimum width and height using maxHeight, maxWidth, minHeight, and minWidth.

::demo-block{demo="resizable/en-us/Limits" title="Setting Maximum and Minimum Width/Height"}
::

### Control Width/Height

You can control the size of the element through the size prop.

::demo-block{demo="resizable/en-us/Controlled" title="Control Width/Height"}
::

### Setting Scale

You can scale the entire element by setting the scale prop.

::demo-block{demo="resizable/en-us/Scale" title="Setting Scale"}
::

### Restricting Width/Height by an Element

You can restrict the width and height by setting the boundElement, which supports string values like 'parent' or 'window'.

::demo-block{demo="resizable/en-us/Bounds" title="Restricting Width/Height by an Element"}
::

### Customizing Corner Handler Styles

You can customize the drag handles for each direction using handleNode, and apply different styles using handleStyle and handleClass.

```ts
import type { CSSProperties, VNodeChild } from 'vue';
type HandleNode = {
  left?: VNodeChild;
  right?: VNodeChild;
  top?: VNodeChild;
  bottom?: VNodeChild;
  topLeft?: VNodeChild;
  topRight?: VNodeChild;
  bottomLeft?: VNodeChild;
  bottomRight?: VNodeChild;
};

type HandleStyle = {
  left?: CSSProperties;
  right?: CSSProperties;
  top?: CSSProperties;
  bottom?: CSSProperties;
  topLeft?: CSSProperties;
  topRight?: CSSProperties;
  bottomLeft?: CSSProperties;
  bottomRight?: CSSProperties;
};

type HandleClass = {
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  topLeft?: string;
  topRight?: string;
  bottomLeft?: string;
  bottomRight?: string;
};
```

::demo-block{demo="resizable/en-us/Handle" title="Customizing Corner Handler Styles"}
::

### Allowing Incremental Width and Height Adjustment

You can allow gradual adjustments in width and height using the grid and snap properties. The grid property specifies the increments to which resizing should snap. The default value is [1, 1]. The snap property specifies the absolute pixel values to which resizing should snap. Both x and y are optional, allowing you to define only the desired axis. These two parameters can be combined with the snapGap property, which specifies the minimum gap required to move to the next target. The default is 0, meaning the target defined by grid/snap is always used.

```ts
interface Snap {
  x?: number[];
  y?: number[];
}
```

::demo-block{demo="resizable/en-us/Grid" title="Allowing Incremental Width and Height Adjustment"}
::

### Group Component

> **notice**
>
> The parent element of `ResizeGroup` needs to have a size in the main axis direction.
>
> It's best not to set padding for ResizeItem, as it may cause the minimum size to not match the expected value. You can set padding for child elements instead.

Use the direction prop to set the resizing direction. Options are `horizontal` and `vertical`. Supports `@resize-start`, `onResize`, and `@resize-end` callbacks, as well as setting `min` and `max` to control the maximum and minimum width/height.

::demo-block{demo="resizable/en-us/Group" title="Group Component "}
::

### Nested

Set the resizing direction using the direction prop. Options are horizontal and vertical.

::demo-block{demo="resizable/en-us/Nested" title="Nested"}
::

::demo-block{demo="resizable/en-us/ComplexNested" title="Nested"}
::

### Dynamic Direction

::demo-block{demo="resizable/en-us/DynamicDirection" title="Dynamic Direction"}
::

## API Reference

### Resizable

| Property                     | Description                                                                                                                            | Type                                  | Default  |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | -------- |
| `size`                       | Controls the size of the resizable box, supports both numeric and string (px/vw/vh/%) formats                                          | `ResizeSize`                          | `—`      |
| `defaultSize`                | Sets the initial width and height, supports both numeric and string (px/vw/vh/%) formats                                               | `ResizeSize`                          | `—`      |
| `minWidth`                   | Specifies the minimum width of the resizable box                                                                                       | `string \| number`                    | `—`      |
| `minHeight`                  | Specifies the minimum height of the resizable box                                                                                      | `string \| number`                    | `—`      |
| `maxWidth`                   | Specifies the maximum width of the resizable box                                                                                       | `string \| number`                    | `—`      |
| `maxHeight`                  | Specifies the maximum height of the resizable box                                                                                      | `string \| number`                    | `—`      |
| `grid`                       | Specifies the increment to align to when resizing                                                                                      | `number \| readonly [number, number]` | `[1, 1]` |
| `snap`                       | Specifies the pixel values to snap to during resizing. Both x and y are optional, allowing the definition of specific axes only        | `{ x?: readonly number[]`             | `—`      |
| `snapGap`                    | Specifies the minimum gap required to snap to the next target                                                                          | `number`                              | `0`      |
| `boundElement`               | Restricts the size of the resizable element within a specific element. Pass "parent" to set the parent element as the bounding element | `'parent' \| 'window' \| HTMLElement` | `—`      |
| `boundsByDirection`          | Apply bounds according to resize direction                                                                                             | `boolean`                             | `false`  |
| `lockAspectRatio`            | Locks the aspect ratio of the resizable box when true, using the initial width and height as the ratio                                 | `boolean \| number`                   | `false`  |
| `lockAspectRatioExtraWidth`  | Extra width outside the locked ratio                                                                                                   | `number`                              | `0`      |
| `lockAspectRatioExtraHeight` | Extra height outside the locked ratio                                                                                                  | `number`                              | `0`      |
| `enable`                     | Specifies the directions in which the resizable box can be resized. If not set, all directions are enabled by default                  | `ResizeEnable \| false`               | `{}`     |
| `handleStyle`                | Styles for the drag handles in each direction                                                                                          | `ResizeHandleStyle`                   | `—`      |
| `handleClass`                | Class names for the drag handles in each direction                                                                                     | `ResizeHandleClass`                   | `—`      |
| `handleWrapperStyle`         | Resize-handle wrapper style                                                                                                            | `CSSProperties`                       | `—`      |
| `handleWrapperClass`         | Resize-handle wrapper class                                                                                                            | `string`                              | `—`      |
| `handleNode`                 | Custom nodes for the drag handles in each direction                                                                                    | `ResizeHandleNode`                    | `—`      |
| `scale`                      | The scale ratio of the resizable element                                                                                               | `number`                              | `1`      |
| `ratio`                      | Ratio of pointer motion to size change; an array sets each axis                                                                        | `number \| readonly [number, number]` | `1`      |
| `beforeResizeStart`          | Start guard; return false to cancel resizing                                                                                           | `ResizeStartGuard`                    | `—`      |

### ResizeSize

| Property | Description                   | Type               | Default |
| -------- | ----------------------------- | ------------------ | ------- |
| `width`  | Width in pixels or CSS units  | `string \| number` | `—`     |
| `height` | Height in pixels or CSS units | `string \| number` | `—`     |

### ResizeGroup

| Property    | Description                                     | Type                   | Default      |
| ----------- | ----------------------------------------------- | ---------------------- | ------------ |
| `direction` | Specifies the resize direction within the group | `ResizeGroupDirection` | `horizontal` |

### ResizeHandler

Use class and style attributes and the default slot to customize the divider.

### ResizeItem

| Property      | Description                                                                              | Type               | Default |
| ------------- | ---------------------------------------------------------------------------------------- | ------------------ | ------- |
| `min`         | Specifies the minimum size of the resizable box (as percentage or pixel)                 | `string`           | `—`     |
| `max`         | Specifies the maximum size of the resizable box (as percentage or pixel)                 | `string`           | `—`     |
| `defaultSize` | Sets the initial width and height, supports both numeric and string (px/vw/vh/%) formats | `string \| number` | `—`     |

Resizable supports `v-model:size` and the default slot. Its directional slots are `#handle-top`, `#handle-right`, `#handle-bottom`, `#handle-left`, `#handle-topRight`, `#handle-bottomRight`, `#handle-bottomLeft`, and `#handle-topLeft`. handleNode functions are not required: pass Vue nodes or slots.

Resizable and ResizeItem emit `@resize-start(event, direction)`, `@change(size, event, direction)`, and `@resize-end(size, event, direction)`. Events carry MouseEvent or touch input as defined by ResizeStartGuard; beforeResizeStart is the cancellable function prop. ResizeItem does not expose a controlled size or v-model.

ResizeGroup, ResizeItem, and ResizeHandler receive content through their default slots. Use class/style attributes for root styling. ResizeItem percentages and px are fixed sizes; a number or numeric string is a weight for sharing remaining space. Missing enable directions remain enabled, while enable=false disables all handles.

## Design Tokens

::token-table{component="resizable"}
::

## Accessibility

Resize handles retain the upstream pointer interaction. Do not assume arbitrary handles provide keyboard resizing. Add labeled size controls in applications where keyboard users need the same operation, and keep resized content readable.

## Content Guidelines

Describe what can be resized and explain relevant limits in plain language.

## FAQ

**Why do unlisted directions still resize?** Only explicitly false enable fields are disabled.

**Why do weighted group items change together?** Numeric defaultSize values distribute the remaining space proportionally.

**How do I cancel starting a resize?** Return false from beforeResizeStart.

## React → Vue

| React                         | Vue                                     |
| ----------------------------- | --------------------------------------- |
| `size + onChange`             | `v-model:size`                          |
| `onResizeStart / onResizeEnd` | `@resize-start / @resize-end`           |
| `onResizeStart return false`  | `beforeResizeStart function prop`       |
| `handleNode ReactNode`        | `VNodeChild / directional handle slots` |
| `children`                    | `default slot`                          |
| `className`                   | `class native attribute`                |
