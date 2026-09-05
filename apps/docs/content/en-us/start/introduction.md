---
title: 'Introduction'
englishTitle: 'Introduction'
description: 'Semi UI Vue is an independent Vue 3 component library aligned with Semi Design v2.102.0.'
slug: 'introduction'
locale: 'en-US'
category: 'start'
order: 0
upstream: 'start/introduction'
---

## What is Semi UI Vue?

Semi UI Vue provides components, themes, icons and illustrations for desktop enterprise applications. It uses Vue 3.5, TypeScript and Composition API, with native Vue props, emits, slots and v-model.

## Design and implementation

### A consistent visual foundation

Components preserve Semi's layout, interaction states, `.semi-*` classes and `--semi-*` CSS tokens. The default theme is a separate package with individual component styles.

### Cross-framework architecture

Foundation handles calculations and state transitions from the pinned upstream source. The Vue Adapter owns rendering, reactive state and lifecycle integration. Published packages inline their required logic; consumers do not need a Git submodule.

### Dark mode

Set `theme-mode="dark"` on the body or a local container. The theme button in this documentation switches both the website and its examples.

### Internationalization

LocaleProvider supplies component language context with all 57 locale sources. This website provides Chinese and English documentation, preserving the current page when switching languages.

## Get started

Read [Getting Started](../getting-started/) to install the packages, or browse the [component overview](../../components/).

## Compatibility

The component package requires `vue >= 3.5`. Packages ship ESM and TypeScript declarations with SSR-safe imports. Browser acceptance covers the pinned Playwright Chromium build at 1440×900, DPR 1. Mobile, Firefox and WebKit compatibility are not promised.

## Project and license

Semi UI Vue is an independent project and is not officially affiliated with Semi Design. Source and published artifacts retain MIT and applicable third-party notices. See [License](../../project/license/).
