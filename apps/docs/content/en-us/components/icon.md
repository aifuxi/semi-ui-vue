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

## Demos

### How to import

```typescript
import '@aifuxi/semi-theme-default/icon.css';
```

## Size, rotation, and color

::demo-block{demo="icon/Showcase" title="Icon"}
::

Monochrome icons inherit CSS `color`. AI bicolor and multicolor icons accept one color or a color array through `fill`. Sizes are `extra-small`, `small`, `default`, `large`, `extra-large`, and `inherit` for the surrounding font size.

## Custom icons and migration

The default `Icon` export accepts custom SVG through its default slot. React `<Icon svg={<CustomIcon />} />` maps to Vue `<Icon><CustomIcon /></Icon>`; `className` becomes native `class`. Decorative icons should be hidden from assistive technology, while standalone icon buttons need a button-level accessible name.

## API

::api-table{slug="icon"}
::
