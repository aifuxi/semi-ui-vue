---
title: 'FAQ'
englishTitle: 'FAQ'
description: 'Resolve common installation, styling, SSR and migration issues.'
slug: 'faq'
locale: 'en-US'
category: 'ecosystem'
order: 0
upstream: 'ecosystem/faq'
---

## Why are component styles missing?

Components and themes are separate packages. Import the component CSS or the complete `@aifuxi/semi-theme-default/index.css` and use matching package versions.

## Why does an overlay ignore my local theme?

Overlays usually teleport to body. Specify a local popup container or synchronize theme variables on the portal container.

## Can I copy Semi React examples directly?

ReactNode, JSX, children, render props and React refs require Vue adaptations. This site's examples use real Vue components; each migration section explains the differences.

## How should I access the DOM with SSR?

Public packages support SSR-safe imports. Access document, window and observers in onMounted or user events and clean up on unmount. Browser-only editors load on the client.

## Does the editor save my code?

Edits run locally in the current page's sandbox and are not uploaded or written to the repository. Reset restores the original example; edits are discarded on navigation.
