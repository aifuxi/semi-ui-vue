---
title: 'Dark Mode'
englishTitle: 'Dark Mode'
description: 'Switch dark mode globally or within a local container.'
slug: 'dark-mode'
locale: 'en-US'
category: 'advanced'
order: 1
upstream: 'advanced/dark-mode'
---

## Global switching

```ts
document.body.setAttribute('theme-mode', 'dark');
document.body.removeAttribute('theme-mode');
```

Perform DOM operations in client lifecycle hooks or user events, never at SSR module scope.

## Local dark mode

```html
<div theme-mode="dark">
  <!-- Semi components -->
</div>
```

Account for portal containers: an overlay mounted to body does not inherit a local theme.

## System preference and initial rendering

Read prefers-color-scheme until the user makes an explicit choice. Initialize the theme before the first paint while preserving the SSR DOM structure for hydration.

## Verification

The documentation theme control updates the page, examples and editor preview. Check text, borders, shadows, disabled states and keyboard focus after customization.
