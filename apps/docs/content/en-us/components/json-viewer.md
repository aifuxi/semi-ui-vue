---
title: 'JsonViewer'
description: 'Used for displaying and editing JSON data'
locale: 'en-US'
slug: 'json-viewer'
category: 'plus'
order: 32
englishTitle: 'JsonViewer'
icon: 'doc-jsonviewer'
upstream: 'plus/jsonviewer'
---

## Demos

### How to import

```typescript
import { JsonViewer } from '@aifuxi/semi-ui-vue/json-viewer';
import '@aifuxi/semi-theme-default/json-viewer.css';
```

## Editing and search

::demo-block{demo="json-viewer/Showcase" title="JsonViewer"}
::

The `change` and `update:value` events emit the complete JSON source. `options` configures read-only mode, wrapping, formatting, static completion, and custom token rendering. The Worker is inlined into the published bundle; consumers do not copy a worker file or initialize the vendor submodule.

## React to Vue

| React                                         | Vue                                          |
| --------------------------------------------- | -------------------------------------------- |
| `value` + `onChange`                          | `v-model:value`                              |
| `renderSearchButton(node, controls)`          | `renderSearchButton` prop or `#searchButton` |
| `customRenderRule[].render` returns ReactNode | Return Vue VNodeChild or HTMLElement         |
| `ref.current.foundation...`                   | Public component-ref methods                 |

## Accessibility and SSR

Search options support pointer, Enter, and Space activation and expose `aria-pressed`. SSR emits stable containers only. The core, ResizeObserver, and Worker are created after client mount and disposed on unmount.

## API

::api-table{slug="json-viewer"}
::
