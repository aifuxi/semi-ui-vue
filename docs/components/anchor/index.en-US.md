# Anchor

Anchor provides section navigation for long pages and tracks the current section while scrolling. The local Semi Design v2.102.0 source is the sole baseline.

## Basic usage

```vue
<script setup lang="ts">
import { Anchor, AnchorLink } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/anchor.css';
</script>

<template>
  <Anchor aria-label="Article contents">
    <AnchorLink href="#overview" title="Overview" />
    <AnchorLink href="#usage" title="Usage">
      <AnchorLink href="#api" title="API" />
    </AnchorLink>
  </Anchor>
</template>
```

The compound form is also available: `<Anchor.Link href="#overview" title="Overview" />`.

## Scroll container, collapse, and tooltip

```vue
<script setup lang="ts">
const getContainer = () => document.querySelector<HTMLElement>('.article')!;
</script>

<template>
  <Anchor
    auto-collapse
    scroll-motion
    show-tooltip
    position="right"
    rail-theme="tertiary"
    :get-container="getContainer"
    :offset-top="80"
    :target-offset="80"
    :max-width="180"
    @change="(current, previous) => console.log(current, previous)"
    @click="(event, current) => console.log(event, current)"
  >
    <AnchorLink href="#one" title="Chapter one">
      <AnchorLink href="#one-detail" title="Chapter one details" />
    </AnchorLink>
    <AnchorLink disabled href="#disabled" title="Unavailable" />
  </Anchor>
</template>
```

`getContainer` must return the Element or Window that actually scrolls. `offsetTop` affects active-section detection; `targetOffset` affects click navigation.

## API

### Anchor

| Prop                | Description                                              | Type                                 | Default     |
| ------------------- | -------------------------------------------------------- | ------------------------------------ | ----------- |
| `autoCollapse`      | Expands only the nested chain containing the active link | `boolean`                            | `false`     |
| `className`         | Semi-compatible class; Vue `class` is also supported     | `string`                             | `''`        |
| `defaultAnchor`     | Initial active anchor after client mount                 | `string`                             | `''`        |
| `getContainer`      | Returns the scroll container                             | `() => HTMLElement \| Window`        | `window`    |
| `maxHeight`         | Maximum root height; numbers are px                      | `string \| number`                   | `'750px'`   |
| `maxWidth`          | Maximum root width; numbers are px                       | `string \| number`                   | `'200px'`   |
| `offsetTop`         | Top offset used by scroll activation                     | `number`                             | `0`         |
| `position`          | Tooltip placement                                        | `AnchorPosition`                     | -           |
| `railTheme`         | Rail theme                                               | `'primary' \| 'tertiary' \| 'muted'` | `'primary'` |
| `scrollMotion`      | Uses smooth scrolling after a click                      | `boolean`                            | `false`     |
| `showTooltip`       | Tooltip toggle or configuration for truncated titles     | `boolean \| TypographyShowTooltip`   | `false`     |
| `size`              | Anchor size                                              | `'small' \| 'default'`               | `'default'` |
| `style`             | Root style                                               | `CSSProperties`                      | -           |
| `targetOffset`      | Top offset used by click navigation                      | `number`                             | `0`         |
| `aria-*` / `data-*` | Forwarded to the `role=navigation` root                  | matching HTML attributes             | -           |

| Event    | Payload                       | Description                                               |
| -------- | ----------------------------- | --------------------------------------------------------- |
| `change` | `(currentLink, previousLink)` | Active link changed; repeated clicks do not emit it again |
| `click`  | `(event, currentLink)`        | An enabled link was clicked or received a keypress        |

### AnchorLink / Anchor.Link

| Prop        | Description                                      | Type            | Default |
| ----------- | ------------------------------------------------ | --------------- | ------- |
| `href`      | Target CSS selector, normally `#id`              | `string`        | `'#'`   |
| `title`     | Title; prefer the matching Vue slot in templates | `VNodeChild`    | `''`    |
| `disabled`  | Prevents activation and scrolling                | `boolean`       | `false` |
| `className` | Item class; Vue `class` is also supported        | `string`        | `''`    |
| `style`     | Item style                                       | `CSSProperties` | -       |

| Slot                 | Description                |
| -------------------- | -------------------------- |
| `Anchor.default`     | Top-level AnchorLink nodes |
| `AnchorLink.default` | Nested AnchorLink nodes    |
| `AnchorLink.title`   | Custom title content       |

## React → Vue migration

| React v2.102.0                     | Vue                                                           |
| ---------------------------------- | ------------------------------------------------------------- |
| `<Anchor><Anchor.Link /></Anchor>` | Supported as-is; `AnchorLink` can also be imported explicitly |
| `children`                         | Default slot                                                  |
| `title={<Custom />}`               | `#title` slot or a `VNodeChild` prop                          |
| `onChange` / `onClick`             | `@change` / `@click`                                          |
| `className` / `style`              | Compatibility props remain; Vue `class` / `style` also work   |

See the [alignment matrix](./alignment.md) for source evidence, event ordering, scrolling, RTL, SSR, and deviations.
