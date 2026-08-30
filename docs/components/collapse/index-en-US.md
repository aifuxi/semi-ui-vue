# Collapse

`Collapse` groups related content into expandable panels. It supports multiple open panels, accordion mode, controlled state, disabled items, left/right icons, and lazy rendering.

## Basic usage

```vue
<script setup lang="ts">
import { Collapse, CollapsePanel } from '@workspace/ui/collapse';
import '@workspace/theme-default/collapse.css';
</script>

<template>
  <Collapse default-active-key="overview">
    <CollapsePanel item-key="overview" header="Overview"> Overview content </CollapsePanel>
    <CollapsePanel item-key="quality" header="Quality gates"> Quality gate content </CollapsePanel>
  </Collapse>
</template>
```

The compound API `<Collapse.Panel />` is also available. The named `CollapsePanel` export usually provides more direct SFC template type checking.

## Accordion and controlled state

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Collapse, CollapsePanel } from '@workspace/ui/collapse';

const activeKeys = ref<string[]>(['one']);
</script>

<template>
  <Collapse v-model:active-key="activeKeys" accordion>
    <CollapsePanel item-key="one" header="First">First content</CollapsePanel>
    <CollapsePanel item-key="two" header="Second">Second content</CollapsePanel>
  </Collapse>
</template>
```

An interaction emits `change` before `update:activeKey`. Matching the pinned React baseline, the emitted value is always an array of keys, including in accordion mode.

## Custom header and icons

```vue
<Collapse expand-icon-position="left" :click-header-to-expand="false">
  <template #expandIcon>+</template>
  <template #collapseIcon>−</template>

  <CollapsePanel item-key="details">
    <template #header><strong>Details</strong></template>
    <p>Only the icon hot zone toggles this panel.</p>
  </CollapsePanel>
</Collapse>
```

A string `header` creates the standard right-side area and renders `extra`. With a `#header` slot or VNode header, the caller owns the complete header node; pinned v2.102.0 does not insert `extra` automatically.

## Collapse API

| Property                      | Description                                         | Type                 | Default       |
| ----------------------------- | --------------------------------------------------- | -------------------- | ------------- |
| `activeKey`                   | Open items; supports `v-model:active-key`           | `string \| string[]` | -             |
| `defaultActiveKey`            | Initially open items in uncontrolled mode           | `string \| string[]` | `''`          |
| `accordion`                   | Allows at most one open item                        | `boolean`            | `false`       |
| `clickHeaderToExpand`         | Toggles when the whole header is clicked            | `boolean`            | `true`        |
| `expandIcon` / `collapseIcon` | Open/close icons; matching slots are also available | `VNodeChild`         | Chevron icons |
| `expandIconPosition`          | Icon position                                       | `'left' \| 'right'`  | `'right'`     |
| `keepDOM`                     | Keeps content DOM after closing                     | `boolean`            | `false`       |
| `motion`                      | Enables the height transition                       | `boolean`            | `true`        |
| `lazyRender`                  | With `keepDOM`, defers rendering until first open   | `boolean`            | `false`       |
| `className` / `style`         | Root class and style                                | Vue class/style      | -             |

| Event              | Description                                  | Arguments                                  |
| ------------------ | -------------------------------------------- | ------------------------------------------ |
| `change`           | The open-key set changed through interaction | `(activeKey: string[], event: MouseEvent)` |
| `update:activeKey` | `v-model:active-key` update                  | `(activeKey: string[])`                    |

The default slot contains `CollapsePanel` components.

## CollapsePanel API

| Property              | Description                                                   | Type               | Default  |
| --------------------- | ------------------------------------------------------------- | ------------------ | -------- |
| `itemKey`             | Unique panel key                                              | `string`           | required |
| `header`              | Header content; `#header` is also available                   | `VNodeChild`       | -        |
| `extra`               | Extra content for a string header; `#extra` is also available | `VNodeChild`       | -        |
| `showArrow`           | Displays the arrow                                            | `boolean`          | `true`   |
| `disabled`            | Disables toggling                                             | `boolean`          | `false`  |
| `reCalcKey`           | Re-measures content height when changed                       | `number \| string` | -        |
| `className` / `style` | Panel root class and style                                    | Vue class/style    | -        |

`motion-end` fires after the content height transition. The default slot is panel content. The component preserves the pinned baseline's `role="button"`, `tabindex="0"`, and ARIA attributes. Semi v2.102.0 itself has no Enter/Space toggle handler, so the Vue adapter does not add one.
