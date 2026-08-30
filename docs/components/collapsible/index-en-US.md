# Collapsible

`Collapsible` is a non-interactive behavior container that expands or collapses content. The caller owns the control; the component owns height measurement, transitions, and DOM retention.

## Basic usage

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { Collapsible } from '@aifuxi/semi-ui-vue/collapsible';
import '@aifuxi/semi-theme-default/collapsible.css';

const open = shallowRef(false);
</script>

<template>
  <button aria-controls="details" @click="open = !open">
    {{ open ? 'Hide' : 'Show' }}
  </button>
  <Collapsible id="details" :is-open="open">
    <p>This content follows isOpen.</p>
  </Collapsible>
</template>
```

## Retention and lazy rendering

`keepDOM` retains content after closing. Add `lazyRender` to defer the first render until the component is opened while retaining it afterward.

```vue
<Collapsible :is-open="open" keep-d-o-m lazy-render>
  <ExpensivePanel />
</Collapsible>
```

## Custom collapsed height

`collapseHeight` keeps part of the content visible. `collapseHeightAdaptive` limits it to the measured content height. Change `reCalcKey` to remeasure dynamic content.

```vue
<Collapsible
  :is-open="open"
  :collapse-height="64"
  collapse-height-adaptive
  :re-calc-key="items.length"
>
  <ItemList :items="items" />
</Collapsible>
```

## API

| Property                 | Description                                         | Type               | Default |
| ------------------------ | --------------------------------------------------- | ------------------ | ------- |
| `isOpen`                 | Whether content is expanded                         | `boolean`          | `false` |
| `duration`               | Transition duration in milliseconds                 | `number`           | `250`   |
| `motion`                 | Enables height and opacity transitions              | `boolean`          | `true`  |
| `keepDOM`                | Retains slot DOM after closing                      | `boolean`          | `false` |
| `lazyRender`             | With `keepDOM`, defers content until first open     | `boolean`          | `false` |
| `collapseHeight`         | Height while collapsed                              | `number`           | `0`     |
| `collapseHeightAdaptive` | Caps collapsed height at measured content height    | `boolean`          | `false` |
| `fade`                   | Fades when closed at zero height                    | `boolean`          | `false` |
| `reCalcKey`              | Remeasures content when this value changes          | `number \| string` | -       |
| `id`                     | Inner content id for a controller's `aria-controls` | `string`           | -       |
| `className` / `style`    | Outer wrapper class and style                       | Vue class/style    | -       |

| Event        | Description                                                           | Arguments |
| ------------ | --------------------------------------------------------------------- | --------- |
| `motion-end` | The wrapper transition ended; close visibility state has been updated | none      |

The default slot contains the collapsible content. The component does not create a focusable controller or keyboard behavior.
