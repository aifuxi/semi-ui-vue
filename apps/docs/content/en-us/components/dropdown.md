---
title: 'Dropdown'
description: 'A menu that pops down.'
locale: 'en-US'
slug: 'dropdown'
category: 'show'
order: 70
englishTitle: 'Dropdown'
icon: 'doc-dropdown'
upstream: 'show/dropdown'
---

## Demos

### How to import

```ts
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTitle,
  DropdownDivider,
} from '@aifuxi/semi-ui-vue/dropdown';
import '@aifuxi/semi-theme-default/dropdown.css';
```

### Basic Usage

- For the Trigger of the Dropdown in its default slot: By default, it is displayed on hover. You can modify it to values like `click`, `custom`, `contextMenu`, etc. through the `props.trigger` to specify different triggering methods.
- Use the `content` slot to specify the specific content of the dropdown box: Use `Dropdown.Menu` as the parent container, and use `Dropdown.Item`, `Dropdown.Divider`, and `Dropdown.Title` in combination. Of course, in simple scenarios, you can also just combine `Dropdown.Menu` with `Dropdown.Item`, and the other elements are not mandatory.
- `Dropdown.Item` can disable a certain option by setting `disabled`. By configuring `type`, text in different colors can be displayed. By setting `icon`, icons can be quickly configured. For more complex custom structures, you can pass in `VNodeChild` through the default slot for custom rendering.

::demo-block{demo="dropdown/en-us/Basic" title="Basic Usage"}
::

### Nested Usage

Users can nested `Dropdown`, which is suitable for situations with multiple sublevel options.

::demo-block{demo="dropdown/en-us/Nested" title="Nested Usage"}
::

### Popup Position

The position of support is the same. [Tooltip](/en-us/components/tooltip/#Position), commonly used are: "bottom", "bottomLeft", "bottomRight".

::demo-block{demo="dropdown/en-us/Position" title="Popup Position"}
::

### Trigger Mode

The default is the move-in Trigger, which can be expanded by getting focus, clicking, or customizing the event trigger menu.

::demo-block{demo="dropdown/en-us/Trigger" title="Trigger Mode"}
::

### Trigger Event

Click on the menu item to trigger different mouse events, support `@click`, `@mouseenter`, `@mouseleave` and `@contextmenu`.

::demo-block{demo="dropdown/en-us/Events" title="Trigger Event"}
::

### Json Usage

Can use the menu attribute to configure the Dropdown content menu

::demo-block{demo="dropdown/en-us/Menu" title="Json Usage"}
::

## API Reference

### Dropdown

| Properties           | Instructions                                                                                                                                                                                                                                  | Type                     | Default             | Version    |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ------------------- | ---------- |
| autoAdjustOverflow   | Whether the pop-up layer automatically adjusts its direction when it is blocked                                                                                                                                                               | boolean                  | true                |            |
| class                | classname of the outer style of the pop-up layer                                                                                                                                                                                              | string                   |                     |            |
| closeOnEsc           | Whether to close the panel by pressing the Esc key in the trigger or popup layer. It does not take effect when visible is under controlled                                                                                                    | boolean                  | true                | **2.13.0** |
| default slot         | Child elements wrapped by the drop layer                                                                                                                                                                                                      | VNodeChild               |                     |            |
| clickToHide          | Whether to close the drop-down layer automatically when clicking on the drop-down layer                                                                                                                                                       | boolean                  |                     | -          |
| contentClassName     | Drop-down menu root element class name                                                                                                                                                                                                        | string                   |                     |            |
| disableFocusListener | When trigger is `hover`, does not respond to the keyboard focus popup event, see details at [issue#977](https://github.com/DouyinFE/semi-design/issues/977)                                                                                   | boolean                  | false               | **2.17.0** |
| keepDOM              | Whether to keep the internal component DOM from being destroyed when closing                                                                                                                                                                  | boolean                  | false               | **2.31.0** |
| getPopupContainer    | Specifies the parent DOM, and the bullet layer will be rendered to the DOM, you need to set 'position: relative` This will change the DOM tree position, but not the view's rendering position.                                               | function():HTMLElement   | () => document.body |
| margin               | Popup layer calculates the size of the safe area when the current direction overflows, used in scenes covered by fixed elements, more detail refer to [issue#549](https://github.com/DouyinFE/semi-design/issues/549), same as Tooltip margin | object\|number           |                     | 2.25.0     |
| mouseEnterDelay      | After the mouse is moved into the Trigger, the display time is delayed, in milliseconds (only effective when the trigger is hover/focus)                                                                                                      | number                   | 50                  |            |
| mouseLeaveDelay      | The time for the delay to disappear after the mouse moves out of the pop-up layer, in milliseconds (only effective when the trigger is hover/focus)                                                                                           | number                   | 100                 |            |
| menu                 | Menu content config                                                                                                                                                                                                                           | Array<DropdownMenuItem\> | []                  | -          |
| position             | The position of the pop-up menu, commonly used: 'bottom', 'bottomLeft', 'bottomRight', for more details, see [Tooltip Position](/en-us/components/tooltip/#Position)                                                                          | string                   | 'bottom'            |            |
| render               | Content of pop-up layer，include `Dropdown.Menu` `Dropdown.Item`、`Dropdown.Title`                                                                                                                                                            | VNodeChild               |                     |            |
| rePosKey             | You can update the value of this item to manually trigger the repositioning of the pop-up layer                                                                                                                                               | string \| number         |                     |            |
| spacing              | The distance between the pop-up layer and the `children` element, in px                                                                                                                                                                       | number                   | 4                   |            |
| style                | Pop-up layer inline style                                                                                                                                                                                                                     | object                   |                     |            |
| showTick             | Whether to automatically display the checked tick on the left of the active Dropdown.Item item                                                                                                                                                | boolean                  | false               | -          |
| stopPropagation      | Whether to prevent the click event on the pop-up layer from bubbling                                                                                                                                                                          | boolean                  | false               | -          |
| trigger              | The act of triggering a drop-down, optional 'hover', 'focus', 'click', 'custom', 'contextMenu'                                                                                                                                                | string                   | 'hover'             |            |
| visible              | Display the menu or not, need to be used with trigger custom                                                                                                                                                                                  | boolean                  |                     |            |
| zIndex               | Pop-up layer z-index value                                                                                                                                                                                                                    | number                   | 1060                |            |
| @click-outside       | Callback when the pop-up layer is in the display state and the non-Children, non-floating layer inner area is clicked (only valid when trigger is custom, click)                                                                              | (e:event) => void        |                     | **2.1.0**  |
| @esc-keydown         | Called when Esc key is pressed in trigger or popup layer                                                                                                                                                                                      | function(e:event)        |                     | **2.13.0** |
| @visible-change      | Callback when the pop-up layer display state changes                                                                                                                                                                                          | function                 |                     |            |

### Dropdown.Menu

| Properties   | Instructions                                                                                  | Type       | Default | Version |
| ------------ | --------------------------------------------------------------------------------------------- | ---------- | ------- | ------- |
| style        | Drop-down menu style                                                                          | object     |         | -       |
| class        | Drop-down menu style class name                                                               | string     |         | -       |
| default slot | The child elements wrapped by the drop-down menu, usually `Dropdown.Item` or `Dropdown.Title` | VNodeChild |         |         |

### Dropdown.Item

| Properties   | Instructions                                                                                                                                                                                                                                             | Type       | Default | Version |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------- | ------- |
| active       | Whether the current item is in the active state, there is a tick on the left when the active state is activated, the font is bold, and the color is deepened. When the `showTick` is false, even if the `active` is true, the tick will not be displayed | boolean    | false   |         |
| class        | Style class name                                                                                                                                                                                                                                         | string     |         |         |
| disabled     | Do you disable the menu?                                                                                                                                                                                                                                 | boolean    | false   |         |
| icon         | Icon of DropdownItem, will be displayed on the left                                                                                                                                                                                                      | VNodeChild |         | -       |
| style        | Inline style                                                                                                                                                                                                                                             | object     |         |         |
| type         | Type, optional values: "primary","secondary", "tertiary", "warning", "danger"                                                                                                                                                                            | string     | -       |         |
| @click       | Click the trigger callback event                                                                                                                                                                                                                         | function   |         |         |
| @contextmenu | The callback event triggered by right click                                                                                                                                                                                                              | function   |         | -       |
| @mouseenter  | A callback event triggered by MouseEnter                                                                                                                                                                                                                 | function   |         |         |
| @mouseleave  | The callback event triggered by Mouse Leave                                                                                                                                                                                                              | function   |         |         |

### Dropdown.Title

| Properties | Instructions     | Type   | Default |
| ---------- | ---------------- | ------ | ------- |
| class      | Style class name | string | ""      |
| style      | Inline style     | object | {}      |

### DropdownMenuItem

| Properties                                     | Instructions                        | Type   |
| ---------------------------------------------- | ----------------------------------- | ------ |
| node                                           | menu type: `title`,`item`,`divider` | string |
| name                                           | menu content                        | string |
| Other Properties refer to Title、Item、Divider |                                     |        |

## Accessibility

### ARIA

- Dropdown.Menu `role` is set to `menu`, `aria-orientation` is set to `vertical`
- Dropdown.Item `role` is set to `menuitem`

### Keyboard and Focus

- Dropdown triggers can be focused, currently supports 3 triggering methods:
  - When the trigger method is set to hover or focus: the Dropdown is opened when the mouse is hovering or focused. After the Dropdown is opened, the user can use the `Down Arrow` to move the focus to the Dropdown
  - When the trigger method is set to click: Use the `Enter` or `Space` key to open the Dropdown when clicking the trigger or focusing, and the focus will automatically focus on the first non-disabled item in the Dropdown
- When the focus is on the menu item inside the Dropdown:
  - Keyboard users can use the keyboard `Up Arrow` or `Down Arrow` to switch between interactable elements
  - Use the `Enter` key or the `Space` key to activate the focused menu item, if the menu item is bound to onClick, the event will be fired
- Keyboard users can close the Dropdown by pressing `Esc`, after which the focus returns to the trigger
- Keyboard interaction does not yet fully support nested scenes

## Content Guidelines

- The content of the options in the drop-down box needs to be expressed accurately and contain information to make it easier for users to choose among the options when browsing
- Use statement-like capitalization and write options concisely and clearly
- In the case of an action option, use a verb or verb phrase to describe the action that will occur when the user selects the option. For example, "Move", "Log time", or "Hide labels"
- do not use prepositions

| ✅ Recommended usage                        | ❌ Deprecated usage                                 |
| ------------------------------------------- | --------------------------------------------------- |
| Add text / Add link / Add image / Add video | Add a text / Add a link / Add a image / Add a video |

## Design Tokens

::token-table{component="dropdown"}
::

## FAQ

- **Why does the Dropdown layer accidentally wrap when the width is not enough near the screen border?**

  After Chromium 104, the wrapping rendering strategy when the width of the screen border text is not enough has changed. For details, see [issue #1022](https://github.com/DouyinFE/semi-design/issues/1022), the semi-side has been This problem was fixed in v2.17.0.

## React → Vue Migration

| React                                                          | Vue                                                                         |
| -------------------------------------------------------------- | --------------------------------------------------------------------------- |
| children                                                       | Default trigger slot                                                        |
| render ReactNode                                               | content slot, or render prop as VNodeChild/function                         |
| Dropdown.Menu/Item/Title/Divider                               | DropdownMenu/DropdownItem/DropdownTitle/DropdownDivider or compound members |
| menu JSON                                                      | readonly DropdownMenuItem[] discriminated by item/title/divider             |
| visible / onVisibleChange                                      | v-model:visible or visible + @visible-change                                |
| onClickOutSide / onEscKeyDown / afterClose                     | @click-outside / @esc-keydown / @after-close                                |
| Item onClick/onMouseEnter/onMouseLeave/onContextMenu/onKeyDown | @click/@mouseenter/@mouseleave/@contextmenu/@keydown                        |
| Item icon                                                      | icon slot, VNodeChild, or a function returning VNodeChild                   |
| className                                                      | Native class                                                                |

Runtime defaults are mouseLeaveDelay=100ms and zIndex=1060, correcting the upstream table's 50/1050. DropdownItem type has no default and uses the default text color when omitted. Ref methods are focusTrigger(), getPopupId(), rePosition(). DropdownItem also supports hover, showTick and forwardRef receiving an li or null.

Menu name accepts VNodeChild or a function returning VNodeChild. Data event fields use Vue names: onClick/onContextmenu/onKeydown/onMouseenter/onMouseleave. DropdownMenu/Title/Divider share class/style; menus and titles receive content through default slots.

Overlays render into document.body through Teleport by default. Use an instance template ref for getPopupContainer, set position: relative on the container, and use overflow: hidden when the overlay should stay within it. Do not query document or invoke static dialogs at setup top level. Components clean up their own listeners, focus and positioning resources; application timers and imperative handles must also be cleaned up on unmount.
