---
title: 'Popover'
description: 'Click / mouse to move into the element and pop up the bubble card floating layer.'
locale: 'en-US'
slug: 'popover'
category: 'show'
order: 78
englishTitle: 'Popover'
icon: 'doc-popover'
upstream: 'show/popover'
---

## When to Use

When the target element has further description and related operations, it can be included in the card and displayed according to the user's operational behavior.

The difference with Tooltip is that users can operate on elements on the floating layer, so it can carry more complex content, such as links or buttons.

## Demos

### How to import

```ts
import { Popover } from '@aifuxi/semi-ui-vue/popover';
import '@aifuxi/semi-theme-default/popover.css';
```

### Cautions

Popover associates events, ARIA attributes and focus with the trigger DOM element. Use a native element or a Vue component with one native root. Forward attributes and events through native attribute inheritance or useAttrs with v-bind. Wrap multi-root components in a span. React forwardRef and class components are not required.

::demo-block{demo="popover/en-us/TriggerChildren" title="Cautions"}
::

### Basic Usage

::demo-block{demo="popover/en-us/Basic" title="Basic Usage"}
::

### Pop-up Position

Support twelve directions.

::demo-block{demo="popover/en-us/Position" title="Pop-up Position"}
::

### Controlled Display

In this scenario, Popover's display is completely at the control of parameter `visible`.

::demo-block{demo="popover/en-us/Controlled" title="Controlled Display"}
::

### Conditional trigger (condition)

When `:condition="false"`, Popover will not respond to hover/click/focus triggers (does not affect `trigger='custom'`).

::demo-block{demo="popover/en-us/Condition" title="Conditional trigger (condition)"}
::

### Show Small Triangle

Popover also supports the display of a small triangle.

> The floating layer in this mode has a default style that you can overwrite by passing the style parameters.

::demo-block{demo="popover/en-us/Arrow" title="Show Small Triangle"}
::

### Arrow Point at Center

Under the condition of **showArrow=true**, you can pass in `arrowPointAtCenter=true` so that the small triangle always points to the center of the element.

::demo-block{demo="popover/en-us/ArrowCenter" title="Arrow Point at Center"}
::

### Set Floating Layer Background Color

If you need to customize the background color or border color of the floating layer, please **Be sure to set `backgroundColor` and `borderColor` properties in `style` separately.** This enables the "small triangle" to apply the same background color and border color.

::demo-block{demo="popover/en-us/Color" title="Set Floating Layer Background Color" overflow="visible"}
::

### Initialize the Focus Position of Popup Layer

The `content` scoped slot provides `initialFocusRef`. Bind it with `:ref="initialFocusRef"` to a focusable DOM element or component to choose the initial focus when the panel opens.

::demo-block{demo="popover/en-us/InitialFocus" title="Initialize the Focus Position of Popup Layer"}
::

### Use with Tooltip or Popconfirm

Please refer to [Use with Tooltip/Popconfirm](/en-us/components/tooltip/#%E6%90%AD%E9%85%8D%20Popover%20%E6%88%96%20Popconfirm%20%E4%BD%BF%E7%94%A8)

## API Reference

| Properties           | Instructions                                                                                                                                                                                                                                  | Type                                | Default                                           | Version    |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------- | ---------- |
| autoAdjustOverflow   | Whether to automatically adjust the expansion direction of the floating layer for automatic adjustment of the expansion direction during edge occlusion                                                                                       | boolean                             | true                                              |
| arrowPointAtCenter   | Whether the "small triangle" points to the center of the element, you need to pass in "showArrow = true" at the same time                                                                                                                     | boolean                             | true                                              | -          |
| class                | Pop-up layer classname                                                                                                                                                                                                                        | string                              |                                                   |            |
| closeOnEsc           | Whether to close the panel by pressing the Esc key in the trigger or popup layer. It does not take effect when visible is under controlled                                                                                                    | boolean                             | true                                              | **2.8.0**  |
| condition            | Whether to allow Popover to be triggered. Only when explicitly set to false, hover/click/focus triggers will not take effect (does not affect trigger='custom')                                                                               | boolean                             | true                                              |            |
| content              | Content displayed                                                                                                                                                                                                                             | VNodeChild                          | -                                                 | -          |
| clickToHide          | Whether to automatically close the elastic layer when clicking on the floating layer and any element inside                                                                                                                                   | boolean                             | false                                             | -          |
| disableFocusListener | When trigger is `hover`, does not respond to the keyboard focus popup event, see details at [issue#977](https://github.com/DouyinFE/semi-design/issues/977)                                                                                   | boolean                             | true                                              | **2.17.0** |
| getPopupContainer    | Specifies the parent DOM, and the bullet layer will be rendered to the DOM, you need to set 'position: relative` This will change the DOM tree position, but not the view's rendering position.                                               | () => HTMLElement                   | () => document.body                               |
| guardFocus           | When the focus is in the popup layer, toggle whether the Tab makes the focus loop in the popup layer                                                                                                                                          | boolean                             | true                                              | **2.8.0**  |
| keepDOM              | Whether to keep internal components from being destroyed when closing                                                                                                                                                                         | boolean                             | false                                             | **2.31.0** |
| margin               | Popup layer calculates the size of the safe area when the current direction overflows, used in scenes covered by fixed elements, more detail refer to [issue#549](https://github.com/DouyinFE/semi-design/issues/549), same as Tooltip margin | object\|number                      |                                                   | 2.25.0     |
| mouseEnterDelay      | After the mouse is moved in, the display delay time, in milliseconds (only effective when the trigger is hover/focus)                                                                                                                         | number                              | 50                                                |            |
| mouseLeaveDelay      | The time for the delay to disappear after the mouse is moved out, in milliseconds (only effective when the trigger is hover/focus)                                                                                                            | number                              | 50                                                |            |
| rePosKey             | You can update the value of this item to manually trigger the repositioning of the pop-up layer                                                                                                                                               | string\|number                      |                                                   |            |
| returnFocusOnClose   | After pressing the Esc key, whether the focus returns to the trigger, it only takes effect when the trigger is set to hover, focus, click, etc                                                                                                | boolean                             | true                                              | **2.8.0**  |
| visible              | Display popup or not                                                                                                                                                                                                                          | boolean                             |                                                   |
| position             | Directions, optional values: `top`, `topLeft`, `topRight`, `left`, `leftTop`, `leftBottom`, `right`, `rightTop`, `rightBottom`, `bottom`, `bottomLeft`, `bottomRight`                                                                         | string                              | "bottom"                                          |
| spacing              | The distance between the out layer and the default-slot trigger element, in px. object type props supported after v2.45                                                                                                                       | number｜ `{ x: number; y: number }` | 4(while showArrow=false) 10(while showArrow=true) |            |
| showArrow            | Display little arrow or not                                                                                                                                                                                                                   | boolean                             | false                                             | -          |
| trigger              | Trigger mode, optional value: `hover`, `focus`, `click`, `custom`                                                                                                                                                                             | string                              | 'hover'                                           |
| stopPropagation      | Whether to prevent click events on the bomb layer from bubbling                                                                                                                                                                               | boolean                             | false                                             | -          |
| style                | Pop-up layer inline style                                                                                                                                                                                                                     | object                              |                                                   |            |
| zIndex               | Floating layer z-index value                                                                                                                                                                                                                  | number                              | 1030                                              |
| @click-outside       | Callback when the pop-up layer is in the display state and the non-Children, non-floating layer inner area is clicked (only valid when trigger is custom, click)                                                                              | (e:event) => void                   |                                                   | **2.1.0**  |
| @esc-keydown         | Called when Esc key is pressed in trigger or popup layer                                                                                                                                                                                      | function(e:event)                   |                                                   | **2.8.0**  |
| @visible-change      | A callback triggered when the pop-up layer is displayed / hidden                                                                                                                                                                              | (isVisible: boolean) => void        |                                                   |

## Accessibility

### ARIA

- About role
  - If the trigger is set to `click`、`custom`, the PopoverContent element has role set to `dialog`.
  - If the trigger is set to hover, it has role set to `tooltip`.
- Popover's content
  - The content wrapper will be automatically added with the id attribute
- Popover's default-slot trigger
  - Will be automatically added [aria-expanded](https://www.w3.org/TR/wai-aria-1.1/#aria-expanded) attribute, when Popover is visible, the attribute value is `true`, when invisible Is `false`
  - Will be automatically added [aria-haspopup](https://www.w3.org/TR/wai-aria-1.1/#aria-haspopup) attribute, which is `dialog`
  - Will be automatically added [aria-controls](https://www.w3.org/TR/wai-aria-1.1/#aria-controls) attribute, which is the id of the content wrapper

### Keyboard and Focus

- When the Popover trigger method is set to `hover`: Open the Popover on hover; set disableFocusListener=false to also open on focus
- When the Popover trigger method is set to `click`: Click the trigger or focus and use the Enter key to open the Popover
- After the Popover is activated, press the `arrow key` ⬇️ to move the focus to the Popover. At this time, the focus is on the first interactive element in the Popover by default, and the user can also customize the focus position (if there is no interactive element in the Popover, it will appear as No response)
- Use the `Tab` key when the focus is in the Popover, the focus will cycle in the Popover, and use `Shift + Tab` to move the focus in the opposite direction
- Keyboard users can close the Popover by pressing `Esc`, after closing the focus returns to the trigger (when the trigger is click)

## Design Tokens

::token-table{component="popover"}
::

## FAQ

- **Why the position of the popover overlay card and the relative position of the overlay trigger are not as expected?**  
  Ensure the trigger covers the whole intended positioning rectangle and forwards attributes and events to its DOM root. Wrap prefixed or suffixed Input in a div to include the complete control.

- **Why does the popover layer card lose its width and wrap unexpectedly when the width is not enough near the screen border?**

  After Chromium 104, the wrapping rendering strategy when the width of the screen border text is not enough has changed. For details, see [issue #1022](https://github.com/DouyinFE/semi-design/issues/1022), the semi-side has been This problem was fixed in v2.17.0.

## React → Vue Migration

| React                                      | Vue                                                                        |
| ------------------------------------------ | -------------------------------------------------------------------------- |
| children                                   | Trigger in the default slot                                                |
| content ReactNode / render function        | VNodeChild prop or `#content="{ initialFocusRef }"`                        |
| initialFocusRef                            | Bind with `:ref="initialFocusRef"` to a focusable DOM element or component |
| visible / onVisibleChange                  | v-model:visible or visible + @visible-change                               |
| onClickOutSide / onEscKeyDown / afterClose | @click-outside / @esc-keydown / @after-close                               |
| className                                  | class; Popover also supports className                                     |
| ref.focusTrigger()                         | focusTrigger() on a template ref                                           |

Use a scoped slot instead of a React-style content function prop. Popover inherits Tooltip positioning, Portal and focus options, and adds arrowStyle, arrowBounding and contentClassName. showArrow defaults to false. disableFocusListener defaults to true for hover; explicitly set it to false for focus activation. condition=false disables built-in triggers while custom visibility remains controlled by visible.

Overlays render into document.body through Teleport by default. Use an instance template ref for getPopupContainer, set position: relative on the container, and use overflow: hidden when the overlay should stay within it. Do not query document or invoke static dialogs at setup top level. Components clean up their own listeners, focus and positioning resources; application timers and imperative handles must also be cleaned up on unmount.
