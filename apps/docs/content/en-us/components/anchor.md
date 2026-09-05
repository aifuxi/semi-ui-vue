---
title: 'Anchor'
description: 'The Anchor component is used to create a hyper Link navigation bar.'
locale: 'en-US'
slug: 'anchor'
category: 'navigation'
order: 54
englishTitle: 'Anchor'
icon: 'doc-anchor'
upstream: 'navigation/anchor'
---

## Demos

### How to import

```vue
<script setup lang="ts">
import { Anchor, AnchorLink } from '@aifuxi/semi-ui-vue/anchor';
import '@aifuxi/semi-theme-default/anchor.css';
</script>
```

### Basic Usage

Each live demo includes its own scrollable targets so links work independently of the documentation page. The labels, hierarchy, rail, and offsets follow the corresponding upstream example.

Use `AnchorLink` to create an anchor, click it to jump to the hash tag location.

::demo-block{demo="anchor/en-us/Basic" title="Basic Usage"}
::

### Integrated Usage

You can use `getContainer`, `targetOffset`, `offsetTop`, and `style` to create a out of the box anchor navigation bar.

- getContainer：you can set the container of scroll content with `getContainer` property. Its default value is `window`.

- targetOffset: you can set the distance between the anchor point and the top of the container by setting `targetOffset`. **v>=1.9**

- style：the default `position` of Anchor is `relative`. You can customize it with `style` object.

- offsetTop：`offsetTop` can trigger the current Link switch when the scrolling content reaches a specified offset from the top of the container.

```vue
<script setup lang="ts">
import { Anchor, AnchorLink } from '@aifuxi/semi-ui-vue/anchor';
import '@aifuxi/semi-theme-default/anchor.css';
const getContainer = () => window;
</script>
<template>
  <Anchor
    :get-container="getContainer"
    :offset-top="100"
    :target-offset="100"
    :style="{ position: 'fixed', right: '20px', top: '100px', width: '200px', zIndex: 3 }"
  >
    <AnchorLink href="#basic-usage" title="Fixed Anchor" />
    <AnchorLink href="#integrated-usage" title="Integrated Usage" />
    <AnchorLink href="#size" title="Size" />
    <AnchorLink href="#rail-theme" title="Rail Theme" />
    <AnchorLink href="#auto-collapse" title="Auto Collapse" />
    <AnchorLink href="#show-tooltip" title="Show Tooltip" />
    <AnchorLink href="#tooltip-position" title="Tooltip Position" />
    <AnchorLink href="#api-reference" title="API Reference">
      <AnchorLink href="#anchor" title="Anchor" />
      <AnchorLink href="#anchorlink" title="AnchorLink" />
    </AnchorLink>
  </Anchor>
</template>
```

### Size

You can change Anchor size with `size` property.

::demo-block{demo="anchor/en-us/DefaultSize" title="Size"}
::

::demo-block{demo="anchor/en-us/SmallSize" title="Size"}
::

### Rail Theme

You can change rail color with `railTheme` property. Three themes are supported and the default value is `primary`.

::demo-block{demo="anchor/en-us/PrimaryRail" title="Rail Theme"}
::

::demo-block{demo="anchor/en-us/TertiaryRail" title="Rail Theme"}
::

::demo-block{demo="anchor/en-us/MutedRail" title="Rail Theme"}
::

### Auto Collapse

Anchor can dynamically display child links with `autoCollapse` property. The default is `false`.

::demo-block{demo="anchor/en-us/AutoCollapse" title="Auto Collapse"}
::

::demo-block{demo="anchor/en-us/Expanded" title="Auto Collapse"}
::

### Show Tooltip

`showTooltip` can display the title of link when it exceeds the max-width. The default value is `false`.

::demo-block{demo="anchor/en-us/Tooltip" title="Show Tooltip"}
::

### Tooltip Position

You can change the Tooltip position with `position` property. It only works when `showTooltip` is `true`.

::demo-block{demo="anchor/en-us/TooltipPosition" title="Tooltip Position"}
::

## API Reference

### Anchor

| Property            | Description                                                   | Type                                            | Default   |
| ------------------- | ------------------------------------------------------------- | ----------------------------------------------- | --------- |
| `autoCollapse`      | Dynamically show descendants of the active link               | `boolean`                                       | `false`   |
| `class / className` | Vue class and compatibility class name                        | `string`                                        | `—`       |
| `style`             | Root style object                                             | `CSSProperties`                                 | `—`       |
| `defaultAnchor`     | Initially highlighted link, including #                       | `string`                                        | `—`       |
| `getContainer`      | Return the scrolling container of document content            | `() => HTMLElement / Window / null / undefined` | `window`  |
| `maxHeight`         | Maximum anchor height                                         | `string / number`                               | `750px`   |
| `maxWidth`          | Maximum anchor width                                          | `string / number`                               | `200px`   |
| `offsetTop`         | Top offset used when updating the active link on scroll       | `number`                                        | `0`       |
| `position`          | Tooltip placement using supported Tooltip positions           | `AnchorPosition`                                | `—`       |
| `railTheme`         | primary, tertiary, muted                                      | `AnchorRailTheme`                               | `primary` |
| `scrollMotion`      | Enable scrolling animation                                    | `boolean`                                       | `false`   |
| `showTooltip`       | Show truncated text; object configures type and opts          | `boolean / TypographyShowTooltip`               | `false`   |
| `size`              | small, default                                                | `AnchorSize`                                    | `default` |
| `targetOffset`      | Target offset from the scrolling-container top after clicking | `number`                                        | `0`       |

### AnchorLink

| Property            | Description                                | Type            | Default |
| ------------------- | ------------------------------------------ | --------------- | ------- |
| `class / className` | Vue class and compatibility class name     | `string`        | `—`     |
| `style`             | Root style object                          | `CSSProperties` | `—`     |
| `disabled`          | Disable the link                           | `boolean`       | `false` |
| `href`              | Target element fragment, such as #overview | `string`        | `—`     |
| `title`             | Link title                                 | `VNodeChild`    | `—`     |

Events: `@change(currentLink, previousLink)` and `@click(event: MouseEvent / KeyboardEvent, currentLink)`. Anchor uses the default slot for direct AnchorLink children; AnchorLink uses default for descendants and title for a custom label. `Anchor.Link` remains available; named AnchorLink is preferred in templates. showTooltip accepts `{ type: "tooltip" / "popover", opts }`. getContainer must return the content scroller, which can differ from the anchor wrapper. There is no active-link v-model.

## Content Guidelines

- Write in sentence case
- Keep it concise and avoid line breaks

## Design Tokens

::token-table{component="anchor"}
::

## FAQ

1. **Why didn't my link highlight and slide to follow?**  
   Check whether you can scroll to the specified position by clicking the anchor:
   - No, it means there is a problem with the id. check whether the id exists in the document;
   - Yes, it may be that the scrolling container is not set correctly to ensure that the content of the document is wrapped in the scrolling container. The default scrolling container is window. If your container is a div of .my-container, you should set the scrolling container to this div.

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { Anchor, AnchorLink } from '@aifuxi/semi-ui-vue/anchor';
import '@aifuxi/semi-theme-default/anchor.css';
const content = useTemplateRef<HTMLElement>('content');
const getContainer = () => content.value;
</script>
<template>
  <Anchor :get-container="getContainer"><AnchorLink href="#overview" title="Overview" /></Anchor>
  <div ref="content" class="my-container" style="height: 240px; overflow: auto">
    <section id="overview" style="min-height: 480px">Overview</section>
  </div>
</template>
```

## Accessibility

Anchor exposes a navigation landmark named Side navigation. Keep target IDs unique and ensure every href resolves. Use concise link titles; enable tooltips for truncated labels. Links participate in keyboard navigation and disabled links do not activate. Give custom scroll containers an accessible name and a focusable tabindex when users need keyboard scrolling.

## React → Vue

| React                              | Vue                                                |
| ---------------------------------- | -------------------------------------------------- |
| `Anchor.Link`                      | AnchorLink                                         |
| `children`                         | Nested AnchorLink default slots                    |
| `title ReactNode`                  | #title or VNodeChild                               |
| `onChange / onClick`               | @change / @click                                   |
| `document.querySelector('window')` | () => window (called on the client)                |
| `getContainer with document query` | useTemplateRef + a function returning the scroller |
| `className`                        | class (className alias retained)                   |
