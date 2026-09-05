---
title: 'Tooltip'
description: 'Tooltip is used to identify an element or attach a small amount of auxiliary information. The most typical scenario is to explain the meaning of the icon to the user, display the truncated text, display the description of the picture, and so on.'
locale: 'en-US'
slug: 'tooltip'
category: 'show'
order: 84
englishTitle: 'Tooltip'
icon: 'doc-tooltip'
upstream: 'show/tooltip'
---

## Demos

### How to import

```ts
import { Tooltip } from '@aifuxi/semi-ui-vue/tooltip';
import '@aifuxi/semi-theme-default/tooltip.css';
```

### Cautions

Tooltip associates events, ARIA attributes and focus with the trigger DOM element. Use a native element or a Vue component with one native root. Forward attributes and events through native attribute inheritance or useAttrs with v-bind. Wrap multi-root components in a span. React forwardRef and class components are not required.

::demo-block{demo="tooltip/en-us/TriggerChildren" title="Cautions"}
::

### Position

The direction and alignment position of the popup layer can be configured through `position`. For detailed optional values of position, please refer to the API document below

When configured as `topLeft`, it pops up, and the popup layer is left-aligned with the default-slot trigger (when arrowPointAtCenter=false) .
When configured as `topRight`, it pops up, and the popup layer is right-aligned with the default-slot trigger (when arrowPointAtCenter=false) .
Same for other directions

::demo-block{demo="tooltip/en-us/Position" title="Position"}
::

### Arrow Point at Center

By default `arrowPointAtCenter=true`, the small triangle always points to the center of the default-slot trigger element.  
You can set it to false and the little triangle will no longer keep pointing to the center of the element. The popover is aligned to the edges of the default-slot trigger

::demo-block{demo="tooltip/en-us/ArrowCenter" title="Arrow Point at Center"}
::

### Trigger Timing

- Configure the timing of the trigger display, the default is `hover`, optional `hover` / `focus` / `click` / `custom` .
- When set to `custom`, it needs to be used in conjunction with the `visible`attribute, at which point the display is completely controlled

::demo-block{demo="tooltip/en-us/Trigger" title="Trigger Timing"}
::

### Conditional trigger (condition)

When `:condition="false"`, Tooltip will not respond to hover/click/focus triggers (does not affect `trigger='custom'`).

::demo-block{demo="tooltip/en-us/Condition" title="Conditional trigger (condition)"}
::

### Override Style

Configure specific styles for the pop-up layer through the `class` and `style` API, such as overriding the default maxWidth (240px)

::demo-block{demo="tooltip/en-us/Style" title="Override Style"}
::

### Render to Specified DOM

With `getPopupContainer` the bullet layer will be rendered to the DOM returned by the function.

**It should be noted that:** The returned container, if not `document.body`,**`position` Will be set by default `"relative"`**.

::demo-block{demo="tooltip/en-us/Container" title="Render to Specified DOM"}
::

### Use with Popver or Popconfirm

Tooltip, Popconfirm, and Popover all need to hijack related events of default-slot trigger (onMouseEnter / onMouseLeave / onClick ....) to configure `trigger`. If used directly, it will invalidate the outer trigger.  
Need to add a layer of elements (div or span) in the middle to prevent trigger event hijack failure.

::demo-block{demo="tooltip/en-us/Popconfirm" title="Use with Popver or Popconfirm"}
::

### Show only when text overflows

Use [Typography](/en-us/components/typography/#ellipsis) to display a tooltip only when text is truncated.

::demo-block{demo="tooltip/en-us/Overflow" title="Show only when text overflows"}
::

## API Reference

---

| Properties           | Instructions                                                                                                                                                                                                                | Type                                                                                           | Default             | Version    |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------- | ---------- |
| autoAdjustOverflow   | Whether the floating layer automatically adjusts its direction when it is blocked                                                                                                                                           | boolean                                                                                        | true                |            |
| arrowPointAtCenter   | Whether the "small triangle" points to the center of the element, you need to pass in "showArrow = true" at the same time                                                                                                   | boolean                                                                                        | true                | -          |
| condition            | Whether to allow Tooltip to be triggered. Only when explicitly set to false, hover/click/focus triggers will not take effect (does not affect trigger='custom')                                                             | boolean                                                                                        | true                |            |
| class                | Pop-up layer classname                                                                                                                                                                                                      | string                                                                                         |                     |            |
| content              | Pop-up layer content                                                                                                                                                                                                        | VNodeChild                                                                                     | -                   | -          |
| clickToHide          | Whether to automatically close the elastic layer when clicking on the floating layer and any element inside                                                                                                                 | boolean                                                                                        | false               | -          |
| disableFocusListener | When trigger is `hover`, does not respond to the keyboard focus popup event, see details at [issue#977](https://github.com/DouyinFE/semi-design/issues/977)                                                                 | boolean                                                                                        | false               | **2.17.0** |
| getPopupContainer    | Specifies the parent DOM, and the bullet layer will be rendered to the DOM This will change the DOM tree position, but not the view's rendering position.                                                                   | () => HTMLElement                                                                              | () => document.body |
| keepDOM              | Whether to keep internal components from being destroyed when closing                                                                                                                                                       | boolean                                                                                        | false               | **2.31.0** |
| margin               | Calculate the added redundancy value when overflowing, see [issue#549](https://github.com/DouyinFE/semi-design/issues/549)                                                                                                  | number ｜ { marginLeft: number; marginTop: number; marginRight: number; marginBottom: number } | 0                   | **2.23.0** |
| mouseEnterDelay      | After the mouse is moved in, the display delay time, in milliseconds (only effective when the trigger is hover/focus)                                                                                                       | number                                                                                         | 50                  |            |
| mouseLeaveDelay      | The time for the delay to disappear after the mouse is moved out, in milliseconds (only effective when the trigger is hover/focus), and is not less than mouseEnterDelay                                                    | number                                                                                         | 50                  |            |
| motion               | Whether to show the pop-up motion                                                                                                                                                                                           | boolean                                                                                        | true                |            |
| position             | Pop-up layer display position, optional value: `top`, `topLeft`, `topRight`, `left`, `leftTop`, `leftBottom`, `right`, `rightTop`, `rightBottom`, `bottom`, `bottomLeft`, `bottomRight`                                     | string                                                                                         | 'top'               |            |
| prefixCls            | The `class` prefix of the pop-up layer wrapper div. When this item is set, the pop-up layer will no longer have the style of Tooltip.                                                                                       | string                                                                                         | 'semi-tooltip '     |            |
| preventScroll        | Indicates whether the browser should scroll the document to display the newly focused element, acting on the focus method inside the component, excluding the component passed in by the user                               | boolean                                                                                        |                     |            |
| rePosKey             | This value can be updated to manually trigger the repositioning of the pop-up layer.                                                                                                                                        | string                                                                                         | number              |            |
| style                | Pop-up layer inline style                                                                                                                                                                                                   | object                                                                                         |                     |            |
| spacing              | The distance between the pop-up layer and the `default-slot trigger`. object type props supported after v2.45 element                                                                                                       | number ｜ `{ x: number; y: number }`                                                           |                     |            |
| showArrow            | Does it show an arrow triangle?                                                                                                                                                                                             | boolean                                                                                        | true                |            |
| stopPropagation      | Whether to prevent click events on the bomb layer from bubbling                                                                                                                                                             | boolean                                                                                        | false               | -          |
| transformFromCenter  | Whether to transform from the horizontal or vertical center of the element of the package, this parameter affects only the `tansform-origin 'of the dynamic effect transformation and generally does not need to be changed | boolean                                                                                        | true                |
| trigger              | Timing of triggering display, optional value: `hover`/`focus`/`click`/`custom`                                                                                                                                              | string                                                                                         | 'hover'             |            |
| visible              | Whether to show the pop-up layer, need to be used with trigger='custom'                                                                                                                                                     | boolean                                                                                        |                     |            |
| wrapperClassName     | When default-slot trigger are disabled or default-slot trigger are multiple elements, the outer layer will wrap a layer of span elements, and the api is used to set the style class name of this span                      | string                                                                                         |                     | -          |
| wrapperId            | The id of the wrapper node of the popup layer. The aria attribute of the trigger points to this id.                                                                                                                         | string                                                                                         |                     | 2.11.0     |
| zIndex               | Bullet levels.                                                                                                                                                                                                              | number                                                                                         | 1060                |            |
| @visible-change      | A callback triggered when the pop-up layer is displayed/hidden                                                                                                                                                              | (isVisible: boolean) => void                                                                   |                     |            |
| @click-outside       | Callback when the pop-up layer is in the display state and the non-Children, non-floating layer inner area is clicked (only valid when trigger is custom, click)                                                            | (e:event) => void                                                                              |                     | **2.1.0**  |

## Accessibility

### ARIA

- Tooltip has a tooltip role, following the definition of Tooltip in the [WAI-ARIA](https://www.w3.org/TR/wai-aria-practices/#tooltip) specification
- Tooltip's content and default-slot trigger
  - about content
    - The wrapper of content will be automatically added with id attribute to match the `aria-describedby` of default-slot trigger and associate content with default-slot trigger
  - about default-slot trigger
    - There should be an explicit connection between the content of the Tooltip and its default-slot trigger. Tooltip will automatically add the `aria-describedby` attribute to the default-slot trigger element, the value is the id of the content wraper.
    - If the default-slot trigger of your Tooltip are Icon and do not contain visible text, we recommend that you add the `aria-label` attribute to the default-slot trigger to describe accordingly

```vue
<Tooltip>
  <template #content><p>Edit your setting</p></template>
  <IconSetting aria-label="Settings" />
</Tooltip>
```

## Content Guidelines

- Only display information description and guidance, do not display error information
- Only extra links and buttons not in tooltip
- Try to simplify the description to one sentence without showing punctuation marks

## Design Tokens

::token-table{component="tooltip"}
::

## FAQ

- **Why do some forms of content not wrap when the content in Tooltip and Typography is very long?**  
  Before the v2.36.0 version, considering that different language content (e.g. English, Chinese, combination of English and Chinese) have inconsistent requirements for line breaks, so Semi does not use a default setting. After receiving a lot of usage feedback, since the v2.36.0 version, Tooltip has internally set <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-wrap" target= "_blank" rel="noopener noreferrer">word-wrap</a> handles text wrapping for break-word. For any version, if the default settings are not as expected, the user can adjust the line break related CSS properties through the style/class API.

## React → Vue Migration

| React                                      | Vue                                                                                 |
| ------------------------------------------ | ----------------------------------------------------------------------------------- |
| children                                   | Trigger in the default slot; custom components forward native attributes and events |
| content ReactNode / function               | VNodeChild prop or `#content="{ initialFocusRef }"`                                 |
| showArrow ReactNode                        | arrow slot; the boolean prop controls visibility                                    |
| visible / onVisibleChange                  | v-model:visible or visible + @visible-change                                        |
| onClickOutSide / onEscKeyDown / afterClose | @click-outside / @esc-keydown / @after-close                                        |
| className                                  | Native class                                                                        |
| React ref                                  | Template ref exposing focusTrigger(), getPopupId(), rePosition()                    |

Other supported props include closeOnEsc=false, guardFocus=false, returnFocusOnClose=false, disableArrowKeyDown=false, wrapWhenSpecial=true and clickTriggerToHide. Use a callback ref for initial content focus. position also includes leftTopOver, rightTopOver, leftBottomOver and rightBottomOver. spacing accepts a number or { x, y }; margin accepts a number or a four-side object.

condition=false does not override explicit custom visibility. The missing English overflow chapter is translated from the Chinese counterpart. Tooltip itself does not measure text overflow; Typography ellipsis supplies that behavior.

Overlays render into document.body through Teleport by default. Use an instance template ref for getPopupContainer, set position: relative on the container, and use overflow: hidden when the overlay should stay within it. Do not query document or invoke static dialogs at setup top level. Components clean up their own listeners, focus and positioning resources; application timers and imperative handles must also be cleaned up on unmount.
