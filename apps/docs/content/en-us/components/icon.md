---
title: 'Icon'
description: 'Semantic vector graphics.'
locale: 'en-US'
slug: 'icon'
category: 'basic'
order: 26
englishTitle: 'Icon'
icon: 'doc-icons'
upstream: 'basic/icon'
---

## Icon sets

The default package includes filled, stroked and AI icons. Monochrome icons use CSS color; AI bicolor and multicolor icons use fill. The independent `@aifuxi/semi-icons-lab-vue` package provides fixed-color Lab icons. AI icons correspond to upstream capabilities since v2.86.0; Lab icons since v2.48.

## Demos

### How to import

```typescript
import Icon, { IconHome } from '@aifuxi/semi-icons-vue';
import '@aifuxi/semi-theme-default/icon.css';
```

### Basic usage

Import the required icon from the independent icon package.

::demo-block{demo="icon/en-us/Basic" title="Basic usage"}
::

### Rotate and spin

small is 12px. rotate sets an angle; spin enables continuous rotation.

::demo-block{demo="icon/en-us/RotateSpin" title="Rotate and spin"}
::

### Size

Preset sizes are 8, 12, 16, 20 and 24px. size="inherit" inherits the surrounding font size; style.fontSize can also set a custom size.

::demo-block{demo="icon/en-us/Sizes" title="Size"}
::

### Color

Monochrome icons inherit the container CSS color. Set style to override an individual icon.

::demo-block{demo="icon/en-us/Colors" title="Color"}
::

### Bicolor icons

fill accepts a color string or an array of colors.

::demo-block{demo="icon/en-us/Bicolor" title="Bicolor icons"}
::

### Multicolor icons

Override the default four colors with fill. Short arrays are completed by the fixed icon palette logic.

::demo-block{demo="icon/en-us/Multicolor" title="Multicolor icons"}
::

### Custom icons

Pass custom SVG through the default slot. size, rotate and spin remain available.

::demo-block{demo="icon/en-us/Custom" title="Custom icons"}
::

### Import an SVG component

The upstream `@svgr/webpack` example generates React components. In Vue, put the SVG in a `.vue` component, as in CustomSvg.vue here, and use `<Icon><CustomSvg /></Icon>`. No extra loader is needed.

## Accessibility

### ARIA

Built-in icons have role="img" and an aria-label derived from their file name (such as home). Override it with a meaningful name. Their SVG is aria-hidden="true" to avoid duplicate announcements. Custom SVG accessibility belongs to the caller; mark purely decorative icons aria-hidden="true".

::demo-block{demo="icon/en-us/Accessibility" title="ARIA"}
::

## API

::api-table{slug="icon"}
::

## React → Vue

| React                                    | Vue                                                                                           |
| ---------------------------------------- | --------------------------------------------------------------------------------------------- |
| className / style                        | Native class / style                                                                          |
| onClick, onMouseDown/Enter/Leave/Move/Up | @click, @mousedown / @mouseenter / @mouseleave / @mousemove / @mouseup with native MouseEvent |
| svg={ReactNode}                          | Default slot; svg VNode is also available for programmatic use                                |
| React.cloneElement(icon, { size })       | component :is with :size and v-for                                                            |
| `ref<HTMLSpanElement>`                   | Component ref exposes element                                                                 |
