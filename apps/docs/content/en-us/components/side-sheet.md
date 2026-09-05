---
title: 'SideSheet'
description: 'An overlay panel that slides out from the edge of the screen, typically used to host secondary action pages.'
locale: 'en-US'
slug: 'side-sheet'
category: 'show'
order: 80
englishTitle: 'SideSheet'
icon: 'doc-sidesheet'
upstream: 'show/sidesheet'
---

## Demos

### How to import

```ts
import { SideSheet } from '@aifuxi/semi-ui-vue/side-sheet';
import '@aifuxi/semi-theme-default/side-sheet.css';
```

### Basic Usage

By default, SideSheet slides from the right side of the screen and could be closed by clicking on the mask.

::demo-block{demo="side-sheet/en-us/Basic" title="Basic Usage"}
::

### Placement

You could use `placement` to set the position from which SideSheet comes in, supporting one of `top`, `bottom`, `left`, `right`。

::demo-block{demo="side-sheet/en-us/Placement" title="Placement"}
::

### Size

You could use `size` to set the size of SideSheet, supporting one of `small`(448px), `medium`(684px), and `large`(920px). Only takes effects when `placement` is set to `left` or `right`. If the default size does not meet your needs, you can also set the width by setting the `width` property, for example `:width="900"` / `width="800px"`

::demo-block{demo="side-sheet/en-us/Size" title="Size"}
::

### Non-blocking Workflow

You could set `:mask="false"` to continue working on the area outside SideSheet.

By default, if you are not setting `getPopupContainer`, SideSheet is rendered inside body. If you want body element to be able to scroll, you could set disableScroll to false and the component will not add `overflow: hidden` to it.

::demo-block{demo="side-sheet/en-us/Outside" title="Non-blocking Workflow"}
::

### Rendered Inside Container

You could use `getPopupContainer` to render SideSheet in targeted DOM.

The container must have `overflow: hidden` to avoid animated SideSheet overflows.

::demo-block{demo="side-sheet/en-us/Container" title="Rendered Inside Container"}
::

### Customized Content

Use `title`, `footer` and other Semi Components, you could create customized information display layers.

::demo-block{demo="side-sheet/en-us/Custom" title="Customized Content"}
::

## API Reference

| Properties            | Instructions                                                                                                                                                    | type                                     | Default         | Version |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | --------------- | ------- |
| @after-visible-change | Callback function when animation of SideSheet ends                                                                                                              | (isVisible: boolean) => void             | -               | -       |
| bodyStyle             | Content style                                                                                                                                                   | CSSProperties                            | -               | -       |
| class                 | Class name                                                                                                                                                      | string                                   | -               | -       |
| closable              | Toggle whether to show close button                                                                                                                             | boolean                                  | true            | -       |
| closeIcon             | Icon for close button                                                                                                                                           | VNodeChild                               | `<IconClose />` | -       |
| closeOnEsc            | oggle whether to allow close modal by keyboard event Esc                                                                                                        | boolean                                  | false           | -       |
| disableScroll         | Toggle whether to add `overflow: hidden` to document.body element. Only works when not setting `getPopupContainer`                                              | boolean                                  | true            | -       |
| footer                | Footer                                                                                                                                                          | VNodeChild                               | null            | -       |
| getPopupContainer     | Container where to render SideSheet inside, you need to set 'position: relative` This will change the DOM tree position, but not the view's rendering position. | () => HTMLElement                        | -               | -       |
| headerStyle           | Header style                                                                                                                                                    | CSSProperties                            | -               | -       |
| height                | Height, takes effect when `placement` is set to `top` or `bottom`                                                                                               | number \| string                         | 448             | -       |
| keepDOM               | Keep components inside when closing sideSheet                                                                                                                   | boolean                                  | false           |
| mask                  | Toggle whether to show mask. When `:mask="false"`, you could continue operations outside SideSheet                                                              | boolean                                  | true            | -       |
| maskClosable          | Toggle whether to allow closing when clicking mask                                                                                                              | boolean                                  | true            | -       |
| maskStyle             | Mask style                                                                                                                                                      | CSSProperties                            | -               | -       |
| motion                | Toggle whether to turn on animation                                                                                                                             | boolean                                  | true            | -       |
| placement             | Sliding position, one of `top`, `bottom`, `left`, `right`                                                                                                       | string                                   | `right`         | -       |
| size                  | Size, one of `small`(448px)， `medium`(684px), `large`(920px), only take effects when placement is set to `left` or `right`                                     | string                                   | `small`         | -       |
| style                 | Inline style                                                                                                                                                    | CSSProperties                            | -               | -       |
| title                 | Title                                                                                                                                                           | VNodeChild                               | -               | -       |
| visible               | Toggle visibility of the SideSheet                                                                                                                              | boolean                                  | false           | -       |
| width                 | Width, takes effect when `placement` is set to `left` or `right`                                                                                                | number \| string                         | 448             | -       |
| zIndex                | Z-index value for SideSheet                                                                                                                                     | number                                   | 1000            | -       |
| @cancel               | Callback function when clicking cancel button                                                                                                                   | (e: MouseEvent \| KeyboardEvent) => void | -               | -       |

## Accessibility

### ARIA

- SideSheet has a `dialog` role to indicate that it is a pop-up component, and the internal header has a `heading` role to indicate that it is a header.

## Design Tokens

::token-table{component="sideSheet"}
::

## React → Vue Migration

| React                      | Vue                                                                           |
| -------------------------- | ----------------------------------------------------------------------------- |
| children                   | Default slot                                                                  |
| title / footer / closeIcon | Named slots or VNodeChild props                                               |
| visible / onCancel         | v-model:visible or visible + @cancel                                          |
| afterVisibleChange         | @after-visible-change, or the callback prop                                   |
| onCancel                   | @cancel with MouseEvent or KeyboardEvent; the callback prop is also supported |
| className                  | class; className remains supported                                            |

There are no imperative open/close methods. The fixed Foundation height for top/bottom is 448px, correcting the upstream table's 400. canVerticalSetWidth enables width for vertical placement. closeOnEsc defaults to false; set true when Escape should close the panel. Closing destroys content by default; keepDOM retains form state. Custom containers need position: relative and overflow: hidden.

Overlays render into document.body through Teleport by default. Use an instance template ref for getPopupContainer, set position: relative on the container, and use overflow: hidden when the overlay should stay within it. Do not query document or invoke static dialogs at setup top level. Components clean up their own listeners, focus and positioning resources; application timers and imperative handles must also be cleaned up on unmount.
