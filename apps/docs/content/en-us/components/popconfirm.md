---
title: 'Popconfirm'
description: 'Used when the operation of the target element requires further confirmation from the user. Compared with Popover, it has a built-in series of configurable action buttons. Compared with Modal, it does not force full-screen centering, and the interaction is lighter.'
locale: 'en-US'
slug: 'popconfirm'
category: 'feedback'
order: 90
englishTitle: 'Popconfirm'
icon: 'doc-popconfirm'
upstream: 'feedback/popconfirm'
---

## Demos

### How to import

```ts
import { Popconfirm } from '@aifuxi/semi-ui-vue/popconfirm';
import '@aifuxi/semi-theme-default/popconfirm.css';
```

### Basic Usage

`Popconfirm` is based on the `Tooltip` component. Children support the same type as `Tooltip`. For details, please refer to [Tooltip Cautions](/en-us/components/tooltip/#Cautions)

::demo-block{demo="popconfirm/en-us/Basic" title="Basic Usage"}
::

### Type collocation

Developers can use scenario-based `OK Type`/`Cancel Type`/`icon` Equal parameters are matched with different styles of bubble confirmation boxes.

::demo-block{demo="popconfirm/en-us/Types" title="Type collocation"}
::

### Delay hide

`@confirm` and `@cancel` can be closed after click through return Promise (supported after v2.19). When @cancel and @confirm are triggered, the corresponding Button will automatically switch to `loading: true`  
Promise resolve will close the bubble confirmation box, the bubble will remain when promise reject, and button loading will automatically switch to false

::demo-block{demo="popconfirm/en-us/Async" title="Delay hide"}
::

### Initialize the Focus Position of Popup Layer

`okButtonProps` and `cancelButtonProps` support passing in the `autoFocus` parameter, which will automatically focus at this position when the panel is opened. Version 2.30.0 supported.

The `content` scoped slot provides `initialFocusRef`. Bind it with `:ref="initialFocusRef"` to a focusable DOM element or component to choose the initial focus when the panel opens.

::demo-block{demo="popconfirm/en-us/InitialFocus" title="Initialize the Focus Position of Popup Layer"}
::

### Use with Tooltip or Popover

Please refer to [Use with Tooltip/Popover](/en-us/components/tooltip/#Use%20with%20Popver%20or%20Popconfirm)

## API Reference

| Properties         | Instructions                                                                                                                                                                                               | Type                       | Default                                    | Version   |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | ------------------------------------------ | --------- |
| arrowPointAtCenter | Whether the "small triangle" points to the center of the element, you need to pass in "showArrow = true" at the same time                                                                                  | boolean                    | true                                       | -         |
| cancelText         | Cancel button text                                                                                                                                                                                         | string                     | "Cancel"                                   |
| cancelButtonProps  | Properties for cancel button                                                                                                                                                                               | object                     |                                            | -         |
| cancelType         | Cancel button type                                                                                                                                                                                         | string                     | "tertiary"                                 |
| closeOnEsc         | Whether to close the panel by pressing the Esc key in the trigger or popup layer. It does not take effect when visible is under controlled                                                                 | boolean                    | true                                       | **2.8.0** |
| content            | Content displayed; use the content scoped slot for rich content                                                                                                                                            | VNodeChild                 | -                                          | -         |
| defaultVisible     | Initial uncontrolled visibility                                                                                                                                                                            | boolean                    | false                                      | -         |
| disabled           | Click on the Pop confirmation box to see if the bubbles pop up.                                                                                                                                            | boolean                    | false                                      |
| getPopupContainer  | Specify the parent DOM, and the pop-up layer will be rendered into the DOM. Customization needs to set `position: relative` This will change the DOM tree position, but not the view's rendering position. | Function():HTMLElement     | () => document.body                        |
| guardFocus         | When the focus is in the popup layer, toggle whether the Tab makes the focus loop in the popup layer                                                                                                       | boolean                    | true                                       | **2.8.0** |
| icon               | Custom pop bubble Icon icon                                                                                                                                                                                | VNodeChild                 | `<IconAlertTriangle size="extra-large" />` |
| motion             | Whether there is animation when the drop-down list appears/hidden. You can customize animation by passing in an object that conforms to the structure                                                      | boolean                    | true                                       |
| position           | Placement; defaults to bottomLeft in LTR and bottomRight in RTL                                                                                                                                            | TooltipPosition            | bottomLeft                                 | -         |
| okText             | Confirm button text                                                                                                                                                                                        | string                     | "Confirm"                                  |
| okType             | Confirm button type                                                                                                                                                                                        | string                     | "primary"                                  |
| okButtonProps      | Confirm button props                                                                                                                                                                                       | object                     |                                            | -         |
| showArrow          | Whether to show arrow triangle                                                                                                                                                                             | boolean                    | false                                      |           |
| stopPropagation    | Whether to prevent the click event on the bomb layer from bubbling                                                                                                                                         | boolean                    | true                                       | -         |
| returnFocusOnClose | After pressing the Esc key, whether the focus returns to the trigger, it only takes effect when the trigger is set to click                                                                                | boolean                    | true                                       | **2.8.0** |
| title              | Displayed title                                                                                                                                                                                            | string\|VNodeChild         |                                            |
| trigger            | Timing to trigger the display, optional value：hover / focus / click / custom                                                                                                                              | string                     | 'click'                                    |
| visible            | Whether the bubble box displays controlled attributes                                                                                                                                                      | boolean                    |                                            | -         |
| zIndex             | Floating layer z-index value                                                                                                                                                                               | number                     | 1030                                       |
| @confirm           | Click the confirmation button to call back. Promise support after v2.19                                                                                                                                    | (e) => void \| Promise     |                                            |
| @cancel            | Click the Cancel button to call back. Promise support after v2.19                                                                                                                                          | (e) => void \| Promise     |                                            |
| @visible-change    | Bubble box toggle shows hidden callbacks                                                                                                                                                                   | (visible: boolean) => void | () => {}                                   | -         |
| @esc-keydown       | Called when Esc key is pressed in trigger or popup layer                                                                                                                                                   | function(e:event)          |                                            | **2.8.0** |
| @click-outside     | Callback when the pop-up layer is in the display state and the non-Children, non-floating layer inner area is clicked                                                                                      | (e: event) => void         |                                            | **2.1.0** |

## Accessibility

### ARIA

For ARIA, please refer to [Popover](/en-us/components/popover/#ARIA)

### Keyboard and focus

- Popconfirm must have trigger, trigger can be focused, use `Enter` key to open Popconfirm
- After Popconfirm is activated, press the arrow key ⬇️ to move the focus to Popconfirm. The initial focus of Popconfirm should follow several principles:
  - If the Popconfirm contains the last step of an irreversible process, such as: deleting data, etc., then this initial focus is preferably on the least destructive interactable element, such as: the cancel button (by passing the `autoFocus` to the object `cancelButtonProps`)
  - If you only read text in Popconfirm, it is recommended to set the initial focus on the most likely interactive elements, such as: confirm button (implemented by passing `autoFocus` to the object `okButtonProps` )
- Keyboard users can dismiss Popconfirm by pressing `Esc` and focus should return to the trigger. After the user closes the Pop through the interactive element within the Popconfirm, the focus should also return to the trigger (only when trigger is `click`)
- When it is opened, after the user clicks `Esc` in the blank space in Popconfirm, the focus will also return to the trigger (only when trigger is `click`)

## Design Tokens

::token-table{component="popconfirm"}
::

## FAQ

- **Why does the Popconfirm floating layer lose its width and wrap unexpectedly when the width is not enough near the screen border?**

  After Chromium 104, the wrapping rendering strategy when the width of the screen border text is not enough has changed. For details, see [issue #1022](https://github.com/DouyinFE/semi-design/issues/1022), the semi-side has been This problem was fixed in v2.17.0.

## React → Vue Migration

| React                         | Vue                                                 |
| ----------------------------- | --------------------------------------------------- |
| children                      | Default trigger slot                                |
| title / icon                  | Named slots or VNodeChild props                     |
| content ReactNode / function  | VNodeChild prop or `#content="{ initialFocusRef }"` |
| initialFocusRef               | `:ref="initialFocusRef"` callback ref               |
| onConfirm / onCancel          | @confirm / @cancel; listeners may return a Promise  |
| visible / onVisibleChange     | v-model:visible or visible + @visible-change        |
| onClickOutSide / onEscKeyDown | @click-outside / @esc-keydown                       |
| className                     | class; className remains supported                  |

The component reads confirm/cancel listener return values. Pending promises put the corresponding button into loading; resolution closes the overlay and rejection keeps it open. The callback is confirm, correcting the upstream delay section's onOk typo. defaultVisible=false; providing visible makes it controlled. showCloseIcon=true and arrowPointAtCenter inherits Tooltip's true default. Default position is bottomLeft in LTR and bottomRight in RTL. Other Portal, overflow, delay and focus options are inherited from Popover.

Overlays render into document.body through Teleport by default. Use an instance template ref for getPopupContainer, set position: relative on the container, and use overflow: hidden when the overlay should stay within it. Do not query document or invoke static dialogs at setup top level. Components clean up their own listeners, focus and positioning resources; application timers and imperative handles must also be cleaned up on unmount.
