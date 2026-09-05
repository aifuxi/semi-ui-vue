---
title: 'Collapsible'
description: 'The collapsible component is a container component used to put long sections of information under a block that can be expanded or collapsed.'
locale: 'en-US'
slug: 'collapsible'
category: 'show'
order: 68
englishTitle: 'Collapsible'
icon: 'doc-collapsible'
upstream: 'show/collapsible'
---

## When to use

- `Collapsible`is a behavior component with animation effect by default. It is used in various components in Semi Components, including: `Navigation`, `Collapse`, `Tree`, `TreeSelect`, and `Typography`.
- When the above components do not meet requirements or customized collapsed behavior, you can use `Collapsible` to put in contents that need to be expanded or folded.

## Demos

### How to import

```ts
import { Collapsible } from '@aifuxi/semi-ui-vue/collapsible';
import '@aifuxi/semi-theme-default/collapsible.css';
```

### Basic Usage

Use `isOpen` to control the expansion or folding of the content.

::demo-block{demo="collapsible/en-us/Basic" title="Basic Usage"}
::

### Custom Animation Duration

You can use `duration` to set animation duration or turn off animation by setting `:motion="false"`.

::demo-block{demo="collapsible/en-us/Duration" title="Custom Animation Duration"}
::

### Nested use

::demo-block{demo="collapsible/en-us/Nested" title="Nested use"}
::

### Custom CollapseHeight

You could use `collapseHeight` to customize collapsed height.

::demo-block{demo="collapsible/en-us/CollapseHeight" title="Custom CollapseHeight"}
::

## API reference

| Properties             | Instructions                                                                                                                                                    | type             | Default | version |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ------- | ------- |
| class                  | Class name                                                                                                                                                      | string           | -       | 0.34.0  |
| collapseHeight         | Collapse height                                                                                                                                                 | number           | 0       | 1.0.0   |
| collapseHeightAdaptive | Whether to adapt to content height when content height is less than collapseHeight. When true, the collapsed height is Math.min(content height, collapseHeight) | boolean          | false   | 2.77.0  |
| duration               | Time of animation execution                                                                                                                                     | number           | 250     | -       |
| isOpen                 | Toggle whether to expand the content area                                                                                                                       | boolean          | `false` | -       |
| keepDOM                | Whether to keep the hidden panel in DOM tree, destroyed by default                                                                                              | boolean          | `false` | 0.25.0  |
| lazyRender             | Used with keepDOM, when true, the component will not be rendered when mounting                                                                                  | boolean          | `false` | 2.54    |
| motion                 | Toggle whether to turn on animation                                                                                                                             | Motion           | `true`  | -       |
| @motion-end            | Animation end callback                                                                                                                                          | () => void       | -       | -       |
| reCalcKey              | When reCalcKey changes, the height of children will be reset. Used for optimize dynamic content rendering.                                                      | number \| string | -       | 1.5.0   |
| style                  | Style object                                                                                                                                                    | CSSProperties    | -       | 0.34.0  |
| id                     | Wrapper ID; pair with aria-controls on the trigger                                                                                                              | string           | -       | 2.3.0   |

## Accessibility

### ARIA

- Collapsible has `id` props, the value passed in will be set as the id of the wrapper element, which can be used with other components' `aria-controls` to indicate the control relationship, see the usage example below.

```vue
<script setup lang="ts">
import { shallowRef, useId } from 'vue';
import { Collapsible } from '@aifuxi/semi-ui-vue/collapsible';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/collapsible.css';
import '@aifuxi/semi-theme-default/button.css';
const visible = shallowRef(false);
const collapseId = useId();
</script>
<template>
  <Button :aria-controls="collapseId" :aria-expanded="visible" @click="visible = !visible">{{
    visible ? 'hide' : 'show'
  }}</Button>
  <Collapsible :id="collapseId" :is-open="visible"><div>hide content</div></Collapsible>
</template>
```

## FAQ

- Why Collapsible does not expand as expected?  
  Check if the display of parent item of `Collapsible` once was set to `none`. In this case, `Collapsible` could not get height of node properly. After making the parent visible, change reCalcKey to trigger a new measurement.

## Design Tokens

Collapsible defines no component-specific design variables. Use duration for timing and style the slot content as needed.

## React → Vue Migration

| React            | Vue                                                    |
| ---------------- | ------------------------------------------------------ |
| children         | Default slot                                           |
| isOpen / setOpen | `:is-open="isOpen"` with caller-owned shallowRef state |
| onMotionEnd      | @motion-end, without arguments                         |
| className        | class; className is also supported                     |
| React ref        | Vue template ref; there is no public toggle method     |

Collapsible does not provide v-model or a built-in trigger. keepDOM retains hidden content; lazyRender with keepDOM postpones its first mount. Changing reCalcKey remeasures dynamic content. The examples use useId to keep aria-controls unique across instances. Animation and height measurement run on the client.
