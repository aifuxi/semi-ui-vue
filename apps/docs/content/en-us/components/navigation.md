---
title: 'Navigation'
description: 'A menu list that provides navigation for pages and features.'
locale: 'en-US'
slug: 'navigation'
category: 'navigation'
order: 57
englishTitle: 'Navigation'
icon: 'doc-navigation'
upstream: 'navigation/navigation'
---

Navigation menus based on pinned Semi Design v2.102.0. The 10 Chinese and 12 English examples retain their respective source content. Reference and Vue use the same independent icon and branding replacements.

## Imports

```ts
import { Nav, NavItem, SubNav, NavHeader, NavFooter } from '@aifuxi/semi-ui-vue/navigation';
import '@aifuxi/semi-theme-default/navigation.css';
```

## Examples

### Basic usage

Pass stable items data to create a menu.

::demo-block{demo="navigation/en-US/Basic" title="Basic usage"}
::

### Plain text navigation

Omit icons for a text-only menu. This live example exists only in the pinned English chapter.

::demo-block{demo="navigation/en-US/Plain" title="Plain text navigation"}
::

### Header and footer

Configure header and footer independently. collapseButton is effective only in vertical mode. This additional English example is retained.

::demo-block{demo="navigation/en-US/HeaderFooter" title="Header and footer"}
::

### Scrollable body

Use style for the outer height and bodyStyle for the scrolling list; header and footer stay fixed.

::demo-block{demo="navigation/en-US/Scrollable" title="Scrollable body"}
::

### Template composition

Compose Nav.Header, Nav.Item, Nav.Sub and Nav.Footer with Vue templates and slots.

::demo-block{demo="navigation/en-US/Template" title="Template composition"}
::

### Vertical direction

The default mode is vertical. Selection, open keys and collapsed state are independent.

::demo-block{demo="navigation/en-US/Vertical" title="Vertical direction"}
::

### Horizontal direction

Horizontal submenus use Dropdown portals. The avatar opens the footer actions.

::demo-block{demo="navigation/en-US/Horizontal" title="Horizontal direction"}
::

### Horizontal plus vertical

Keep horizontal and vertical navigation in separate SFCs. The pinned English example differs from the Chinese Layout example.

::demo-block{demo="navigation/en-US/Combined" title="Horizontal plus vertical"}
::

### Toggle icon position

Set toggleIconPosition to left.

::demo-block{demo="navigation/en-US/TogglePosition" title="Toggle icon position"}
::

### Indentation limit

Set limitIndent=false for indentation at every level. items infer levels; explicitly pass level when composing Nav.Item.

::demo-block{demo="navigation/en-US/Indentation" title="Indentation limit"}
::

### Uncontrolled properties

The defaultSelectedKeys, defaultOpenKeys and defaultIsCollapsed props only initialize state.

::demo-block{demo="navigation/en-US/Uncontrolled" title="Uncontrolled properties"}
::

### Controlled properties

Bind selectedKeys, openKeys and isCollapsed with v-model. Keep items stable. select precedes click; openChange precedes the submenu click.

::demo-block{demo="navigation/en-US/Controlled" title="Controlled properties"}
::

## Router integration

Use `#item-wrapper="{ itemElement, props }"` or renderWrapper to wrap each item in RouterLink. Render the VNode using `<component :is="itemElement" />`; the application supplies route destinations.

## API

The tables retain upstream names for comparison. Callbacks such as onSelect, onOpenChange and onCollapseChange map to @select, @open-change and @collapse-change in templates. Include explicit units in dimensional style/bodyStyle values, for example `height: '320px'`.

Event payloads use the public types below. The native event field is `domEvent`; select also includes `selectedKeys` and `selectedItems`.

### Nav

| Properties          | Type                                                                                                                                                                                       | Description                                            | Default           |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ | ----------------- |
| bodyStyle           | Custom style for navigation item list                                                                                                                                                      | object                                                 |                   |
| className           | Style name of outermost element                                                                                                                                                            | boolean                                                |                   |
| defaultIsCollapsed  | Whether the default is put away, valid only when `mode = "vertical"`                                                                                                                       | boolean                                                | false             |
| defaultOpenKeys     | Initially open sub navigation `itemKey` array, valid only `mode = "vertical"`and the sidebar is in an expanded state                                                                       | string[]                                               | []                |
| defaultSelectedKeys | Originally selected navigation item `itemKey` array                                                                                                                                        | string[]                                               | []                |
| subDropdownProps    | Control the dropdown parameters in nav.sub under `horizontal` or `vertical && isCollapsed` (v >= 2.69)                                                                                     | DropdownProps                                          |                   |
| expandIcon          | Default Arrow Icon                                                                                                                                                                         | VNodeChild                                             |                   |
| footer              | The bottom area configure objects or elements, see [Nav.Footer](#navfooter)                                                                                                                | object\|VNodeChild                                     |                   |
| getPopupContainer   | Dropdown's getPopupContainer config of vertical collapsed Nav or horizontal Nav. >= v2.24                                                                                                  | Function                                               |                   |
| header              | Head area configuration objects or elements, see [Nav.Header](#navheader)                                                                                                                  | object\|VNodeChild                                     |                   |
| isCollapsed         | A controlled attribute of whether it is in a put-away state, valid only when `mode = "vertical"`                                                                                           | boolean                                                |                   |
| items               | Navigate the list of items, each item can continue with the items property. If it is a string array, each item is taken as text and itemKey                                                | object\|string[]\|[Item](#navitem)[]\|[Sub](#navsub)[] |                   |
| mode                | Navigation direction                                                                                                                                                                       | 'vertical' \| 'horizontal'                             | 'vertical'        |
| onClick             | Trigger when clicking on any navigation item                                                                                                                                               | (data: NavigationClickData) => void                    | () = > {}         |
| onCollapseChange    | The callback when the state changes.                                                                                                                                                       | (isCollapsed) => void                                  | () = > {}         |
| onOpenChange        | Triggers when switching the hidden state of a sub navigation project                                                                                                                       | (data: NavigationOpenChangeData) => void               | () = > {}         |
| onSelect            | Triggers the first time you select an optional navigation project, where the selected Items field version > = 0.17.0 is supported                                                          | (data: NavigationSelectData) => void                   | () = > {}         |
| openKeys            | Controlled open sub navigation `itemKey` array, expanded with `onOpenChange` callback control sub navigation items, valid only `mode = "vertical"`and the sidebar is in an unfolding state | string[]                                               |                   |
| renderWrapper       | Custom navigation item outer component >=2.24.0                                                                                                                                            | (data) => VNodeChild                                   |                   |
| prefixCls           | CSS class prefix                                                                                                                                                                           | string                                                 | `semi-navigation` |
| selectedKeys        | Controlled navigation item `itemKey` array, with `onSelect` callback control navigation item selection                                                                                     | string[]                                               |                   |
| style               | Custom styles for outermost elements                                                                                                                                                       | object                                                 |                   |
| subNavCloseDelay    | Submenu close delay in milliseconds, when collapsed or horizontal                                                                                                                          | number                                                 | 100               |
| subNavOpenDelay     | Submenu open delay in milliseconds, when collapsed or horizontal                                                                                                                           | number                                                 | 0                 |
| tooltipHideDelay    | Collapsed item tooltip hide delay in milliseconds                                                                                                                                          | number                                                 | 100               |
| tooltipShowDelay    | Collapsed item tooltip show delay in milliseconds                                                                                                                                          | number                                                 | 0                 |
| limitIndent         | To lift the indentation limit, you can use level to customize the indentation of navigation items. The horizontal mode can only be true >=1.27.0                                           | boolean                                                | true              |
| toggleIconPosition  | Parent navigation item arrow position with child navigation items >=1.27.0                                                                                                                 | 'left' \| 'right'                                      | 'right'           |
| subNavMotion        | Animate inline submenu expansion                                                                                                                                                           | boolean                                                | true              |

### Nav.Item

| Properties   | Description                                                                                                        | Type                                | Default  |
| ------------ | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------- | -------- |
| disabled     | Disabled state                                                                                                     | boolean                             | false    |
| icon         | Navigation project icon name or component                                                                          | VNodeChild                          |          |
| indent       | If the icon is empty, keep its space or not. Only effective for first level navigation                             | boolean                             | false    |
| itemKey      | Unique item identifier, no duplication allowed                                                                     | string                              | ""       |
| level        | The nesting level of the current item. When limitIndent is false, it is used to customize the indentation position | number                              |          |
| link         | Navigation item href link, when imported, the navigation item will be wrapped with an a tag                        | string                              | -        |
| linkOptions  | Parameters transparently passed to the a tag                                                                       | object                              | -        |
| text         | Navigation project copy or element                                                                                 | string \| VNodeChild                | ""       |
| onClick      | Callback of click                                                                                                  | (data: NavItemSelectedData) => void | () => {} |
| onMouseEnter | Callback of mouse enter event                                                                                      | function(e) => {}                   | () => {} |
| onMouseLeave | Callback of mouse leave event                                                                                      | function(e) => {}                   | () => {} |

### Nav.Sub

| Properties    | Description                                                                                                        | Type                 | Default  |
| ------------- | ------------------------------------------------------------------------------------------------------------------ | -------------------- | -------- |
| disabled      | Disabled state                                                                                                     | boolean              | false    |
| dropdownProps | Popup layer `dropdown` parameter configuration (v >= 2.69)                                                         | DropdownProps        |          |
| dropdownStyle | Style of dropdown layer                                                                                            | CSSProperties        |          |
| icon          | Navigation project icon name or component                                                                          | VNodeChild           |          |
| indent        | If the icon is empty, keep its space or not. Only effective for first level navigation                             | boolean              | false    |
| isCollapsed   | Whether it is a controlled attribute in the collapsed state, only `mode = "vertical"`                              | boolean              | false    |
| isOpen        | Control open state                                                                                                 | boolean              | false    |
| itemKey       | Navigation project only key                                                                                        | string               | ""       |
| level         | The nesting level of the current item. When limitIndent is false, it is used to customize the indentation position | number               |          |
| maxHeight     | max height                                                                                                         | number               | 999      |
| text          | Navigation project copy or component                                                                               | string \| VNodeChild | ""       |
| onMouseEnter  | Callback of mouse enter event                                                                                      | function(e) => {}    | () => {} |
| onMouseLeave  | Callback of mouse leave event                                                                                      | function(e) => {}    | () => {} |

### Nav.Header

| Properties   | Description                                                                                 | Type                 | Default |
| ------------ | ------------------------------------------------------------------------------------------- | -------------------- | ------- |
| default slot | Sub element                                                                                 | VNodeChild           |         |
| className    | Outermost style name                                                                        | string               |         |
| link         | Navigation item href link, when imported, the navigation item will be wrapped with an a tag | string               | -       |
| linkOptions  | Parameters transparently passed to the a tag                                                | object               | -       |
| logo         | Logo, can be a string or component                                                          | string \| VNodeChild |         |
| style        | Outermost style                                                                             | object               |         |
| text         | Logo copy, which can be a string or component                                               | string \| VNodeChild |         |

### Nav.Footer

| Properties     | Description                                                                                                                                             | Type                                      | Default |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ------- |
| default slot   | Sub element                                                                                                                                             | VNodeChild                                |         |
| className      | Outermost style name                                                                                                                                    | string                                    |         |
| collapseButton | Whether to display the bottom "collapse sidebar" button, only work when mode="vertical" and the default slot parameter of the Footer component is empty | boolean\|VNodeChild                       | false   |
| collapseText   | Title of the collapse button                                                                                                                            | (collapsed:boolean) => string\|VNodeChild |         |
| style          | Outermost style                                                                                                                                         | object                                    |         |
| onClick        | Click callback                                                                                                                                          | (event) => void                           |         |

## Keyboard, themes and SSR

Use Tab / Shift+Tab to move focus and Enter to activate. Hover triggers listen to focus by default. With the pointer over the trigger, ArrowDown enters the open menu and Escape returns focus. If focus opens the popup while the pointer is elsewhere, the pinned upstream closes it again after insertion. Nested keyboard navigation is limited by the pinned source. menu/menuitem roles, aria-disabled, aria-expanded and orientation are retained. Desktop light/dark and applicable RTL are covered; imports and rendering are SSR safe, with client-only portals.

## Content guidelines

Keep menu labels concise and use sentence case, for example `Appeal center` rather than `Appeal Center`.

## Related material

The upstream material-platform widget is not embedded in the Vue documentation. Use the combined layout examples on this page with [Layout](/en-us/components/layout/), [Breadcrumb](/en-us/components/breadcrumb/), and [Dropdown](/en-us/components/dropdown/).

## Design tokens

::token-table{component="navigation"}
::

## FAQ

Keep items stable to avoid reinitialization interrupting animations. The pinned version exposes SubNav.maxHeight (default 999), but does not forward it to Collapsible; do not rely on it to remove height limits. Keep menu labels concise.

## React → Vue

| React v2.102.0                               | Vue                                                                        |
| -------------------------------------------- | -------------------------------------------------------------------------- |
| `<Nav items={items} />`                      | `<Nav :items="items" />`                                                   |
| Nav.Item / Nav.Sub / Nav.Header / Nav.Footer | Same compound names, or NavItem / SubNav / NavHeader / NavFooter           |
| children                                     | Default slot                                                               |
| onSelect / onClick                           | @select / @click                                                           |
| onOpenChange / onCollapseChange              | @open-change / @collapse-change                                            |
| selectedKeys + onSelect                      | v-model:selected-keys                                                      |
| openKeys + onOpenChange                      | v-model:open-keys                                                          |
| isCollapsed + onCollapseChange               | v-model:is-collapsed                                                       |
| renderWrapper(info)                          | #item-wrapper="info" or renderWrapper                                      |
| ReactNode icon / text                        | VNode/function prop or #icon / #text                                       |
| React ref / forwardRef                       | Vue template ref; NavItem.forwardRef is a DOM callback compatibility entry |
| Numeric React styles                         | Explicit CSS units for lengths in Vue style objects                        |

Vue uses native props, emits, slots and refs. limitIndent and subNavMotion preserve the distinction between absence, explicit false and true. Provide a stable Portal container before first opening.

The fixed source declares multiple, onDeselect and SubNav.isOpen but does not connect them to independent behavior in its Adapter/Foundation. Do not rely on additional multiple-selection capabilities. Use nonempty string or nonzero numeric itemKey values: the pinned Foundation treats zero as absent.
