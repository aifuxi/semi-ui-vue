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

## Dark mode

The default theme includes light and dark palettes and supports a fixed mode within a local container. Examples use independent branding; the upstream DSM platform screenshots are not embedded.

## Recommended settings

Set the body text and background colors so application content follows theme variables:

```css
body {
  color: var(--semi-color-text-0);
  background-color: var(--semi-color-bg-0);
}
```

## How to switch

Call `document.body.setAttribute('theme-mode', 'dark')` to enable dark mode; remove the attribute to restore light mode. This site also treats an explicit `light` value as light mode. Access the DOM in user events or client lifecycle hooks, never at SSR module scope.

::demo-block{demo="dark-mode/en-us/Global" title="Global switching"}
::

The optional `themeChange` event synchronizes the site's header, preference and editor. Standalone consumers do not need a listener.

## Keep Consistency with System Theme

Read and subscribe to `prefers-color-scheme`. This Vue example applies the initial preference and removes the listener on unmount. Stop following the system when the user makes an explicit choice.

```vue
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
let media: MediaQueryList | undefined;
function syncMode() {
  if (media?.matches) document.body.setAttribute('theme-mode', 'dark');
  else document.body.removeAttribute('theme-mode');
}
onMounted(() => {
  media = window.matchMedia('(prefers-color-scheme: dark)');
  syncMode();
  media.addEventListener('change', syncMode);
});
onUnmounted(() => media?.removeEventListener('change', syncMode));
</script>
```

Initialize the first-paint theme before rendering while preserving the SSR and hydration DOM structure.

## Partial Dark / Light Mode

Use `.semi-always-dark` / `.semi-always-light` to fix a local palette. Setting `theme-mode="dark"` on an ordinary div does not replace these classes.

```html
<div class="semi-always-dark">Local dark content</div>
<div class="semi-always-light">Local light content</div>
```

Overlays mounted to body do not inherit a local palette. Use `getPopupContainer` to place an overlay inside the themed container. Below, Group3 uses the content container; Popover, Tooltip and the pagination menu keep their default body container, demonstrating the difference.

::demo-block{demo="dark-mode/en-us/Local" title="Partial dark and light mode"}
::

## React → Vue migration

| Fixed upstream usage           | Vue equivalent                                                |
| ------------------------------ | ------------------------------------------------------------- |
| `useState` / `setMode`         | `ref` and an event handler                                    |
| `className`                    | `class` / `:class`, preserving `.semi-*` classes              |
| `onClick`                      | `@click`                                                      |
| `icon={<Icon />}`              | `#icon` slot; `h(Icon)` inside items                          |
| `getPopupContainer` DOM query  | Template ref read when opening the overlay                    |
| Site-specific `window.setMode` | Optional `themeChange` event with no required global function |

This guide has no independent component API. Theme attributes, local classes, CSS Tokens and popup containers follow fixed v2.102.0. Both desktop themes are tested; this example configures no responsive breakpoint or touch contract.
