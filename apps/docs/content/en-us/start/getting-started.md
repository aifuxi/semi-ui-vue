---
title: 'Getting Started'
englishTitle: 'Getting Started'
description: 'Install components, styles and icons in a Vue or Nuxt application.'
slug: 'getting-started'
locale: 'en-US'
category: 'start'
order: 1
upstream: 'start/getting-started'
---

## Installation

```bash
pnpm add @aifuxi/semi-ui-vue @aifuxi/semi-theme-default @aifuxi/semi-icons-vue
```

Use Vue 3.5 or newer and matching versions of the public packages.

## Import a component

Import the component and its stylesheet explicitly:

::demo-block{demo="guides/en-us/GettingStarted1" title="Import a component"}
::

Root component imports are also supported. Use individual stylesheets to limit CSS size, or `@aifuxi/semi-theme-default/index.css` for the complete theme.

## Nuxt

Import public components in a page or component's script setup. Declare global styles in Nuxt's `css` configuration. Preserve server rendering for ordinary components and mount browser-dependent editors or media examples on the client. Do not access window or document at module scope.

## Events and state

Use Vue events and v-model. Some components expose named models such as `v-model:visible` or `v-model:value`; consult the component API.

::demo-block{demo="guides/en-us/state/Counter" title="Events and state"}
::

## Icons

Use named icon exports with component slots:

::demo-block{demo="guides/en-us/GettingStarted2" title="Use icons"}
::

## Migrating from React

Map children to default slots, render props to named or scoped slots, and callbacks to Vue events as documented. Do not copy ReactNode, JSX or React ref usage directly. Each component documents its Vue mapping.
