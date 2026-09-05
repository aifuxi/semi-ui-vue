---
title: 'BackTop'
description: 'BackTop reveals a scroll-to-top entry after the page or a custom scroll container crosses a threshold. The local Semi Design v2.102.0 source is the sole baseline.'
locale: 'en-US'
slug: 'back-top'
category: 'navigation'
order: 55
englishTitle: 'BackTop'
icon: 'doc-backtop'
upstream: 'navigation/backtop'
---

## Demos

### How to import

```ts
import { BackTop } from '@aifuxi/semi-ui-vue/back-top';
import '@aifuxi/semi-theme-default/back-top.css';
```

### Basic Usage

BackTop can be used directly with the default styles.

::demo-block{demo="back-top/en-us/Basic" title="Basic Usage"}
::

### Customized Style

The default styles for BackTop component could be overwritten.

::demo-block{demo="back-top/en-us/Custom" title="Customized Style"}
::

## API Reference

| Properties       | Instructions                                                                    | type                                             | Default      |
| ---------------- | ------------------------------------------------------------------------------- | ------------------------------------------------ | ------------ |
| class            | Class name                                                                      | string                                           | -            |
| duration         | Time used to scroll to the top.                                                 | number                                           | 450          |
| style            | Style                                                                           | CSSProperties                                    | -            |
| target           | A function that returns the DOM element to add listener to its scrolling event. | () => Window \| HTMLElement \| null \| undefined | () => window |
| visibilityHeight | The scrolling heights to be reached in order to show up BackTop.                | number                                           | 400          |
| @click           | The callback to onClick event.                                                  | (e: MouseEvent) => void                          | -            |

## Design Tokens

::token-table{component="backtop"}
::

## Accessibility

The default control uses Button. Custom icon content should retain a native button and an accessible name so Enter/Space can activate it.

## FAQ

**Why is the button hidden?**

Ensure target returns the actual scrolling element and its scrollTop exceeds visibilityHeight. The default target is window, not an arbitrary nested scroll area.

## React → Vue Migration

| React                  | Vue                                             |
| ---------------------- | ----------------------------------------------- |
| children               | Default slot for a custom back-to-top control   |
| target={() => element} | `:target="() => element"`, using a template ref |
| onClick                | @click with MouseEvent                          |
| className              | class; className is also supported              |

The default target is window; importing on the server does not access window. Scroll listeners and throttled callbacks are cleaned up on unmount. duration is in milliseconds. There is no v-model. Scroll the document window past visibilityHeight to reveal the examples' buttons.
