---
title: 'Customized Themes'
englishTitle: 'Customized Themes'
description: 'Customize application styles using CSS tokens.'
slug: 'customize-theme'
locale: 'en-US'
category: 'advanced'
order: 0
upstream: 'advanced/customize-theme'
---

## Default theme

Install `@aifuxi/semi-theme-default` and import individual component CSS or the complete `index.css`. Published styles are already compiled; applications do not need Sass or upstream sources.

## Override tokens

Declare overrides after the theme stylesheet. Root variables affect the application, while container variables affect descendants.

```css
:root {
  --semi-color-primary: #0064fa;
  --semi-color-primary-hover: #0052d6;
  --semi-border-radius-small: 3px;
}
```

## States and contrast

Check default, hover, active, disabled, focus-visible and dark states together. Changing only the primary color can leave insufficient text contrast.

## Portals

Overlays mounted to body do not inherit local container variables. Use the component's public getPopupContainer API or apply matching variables to the portal container.

## Token index

See [Design Tokens](../../components/tokens/) for pinned token names and defaults. Preserve the `.semi-*` styling contract.
