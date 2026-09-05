---
title: 'Tabs'
description: 'When the content needs to be grouped and displayed in different modules or pages, you could use Tabs to switch between different groups or pages'
locale: 'en-US'
slug: 'tabs'
category: 'navigation'
order: 60
englishTitle: 'Tabs'
icon: 'doc-tabs'
upstream: 'navigation/tabs'
---

## Demos

### How to import

```vue
<script setup lang="ts">
import { Tabs, TabPane } from '@aifuxi/semi-ui-vue/tabs';
import '@aifuxi/semi-theme-default/tabs.css';
</script>
```

### Basic Usage

Tabs supports four types of styles: `line`, `button`, `card`, and `slash`. By default, the first tab is selected.

Tabs supports two declare ways, and the rendering process of the two is different:

- Pass the array of objects through `tabList`, when using `tabList`, only render the currently passed node each time
- Or use `<TabPane>` to explicitly pass in item by item. When using `<TabPane>`, all panels will be rendered by default. You can set `:keep-dom="false"` to only render the current panel, and there will be no animation effect at this time .

> **Notice**
>
> 1. When tabList and TabPane default-slot children are used at the same time, the data passed in through tabList will be rendered first. It is not recommended to configure both
> 2. When using TabPane default-slot children, TabPane must be a direct child element of Tabs, otherwise Tabs will not be able to correctly collect related attributes such as itemKey and other subcomponents

::demo-block{demo="tabs/en-us/Basic" title="Basic Usage"}
::

::demo-block{demo="tabs/en-us/Button" title="Basic Usage"}
::

::demo-block{demo="tabs/en-us/Card" title="Basic Usage"}
::

::demo-block{demo="tabs/en-us/Slash" title="Basic Usage"}
::

### With Icon

::demo-block{demo="tabs/en-us/Icons" title="With Icon"}
::

### More with Dropdown

Supports merging redundant tabs into a `more` drop-down menu. Just pass in a number for `more`. The number represents the number of tabs included in the drop-down menu. **（>=v2.59.0）**

::demo-block{demo="tabs/en-us/More" title="More with Dropdown"}
::

Advanced configuration is also supported, passing the object to `more`, and it can be passed in

- `count`: Represents the number of Tabs in the income drop-down menu
- `render`: Customize the rendering function of Trigger. The returned VNodeChild will be rendered as the Trigger of the drop-down menu.
- `dropdownProps`: Configure trigger, position, className, and style; see the public API below.

::demo-block{demo="tabs/en-us/CustomMore" title="More with Dropdown"}
::

### Vertical mode

When `type` is `line`, `card`, or `button`, horizontal and vertical modes are supported, `tabPosition='left|top'`，default is top. When `type` is `slash`, only horizontal mode is supported.

::demo-block{demo="tabs/en-us/Vertical" title="Vertical mode"}
::

### Scrollable Tabs

**v>= 1.1.0**  
You could use `collapsible` for a scrollable tabs with dropdown menu. Horizontal mode only.

::demo-block{demo="tabs/en-us/Collapsible" title="Scrollable Tabs"}
::

**Modify the scrolling rendering Arrow**

Use `#arrow="{ items, position, click, defaultNode }"` to customize arrows. The slot exposes hidden items, arrow position, click handler, and the default Vue node.

**Attention**: The first three parameters of the arrow slot are supported since 2.61.0，while defaultNode parameter is supported since 2.66.0.

::demo-block{demo="tabs/en-us/CustomArrow" title="Scrollable Tabs"}
::

**Modify Arrow rendering position**

Use `arrowPosition` to modify the overflow indicator position, optional start both end

::demo-block{demo="tabs/en-us/ArrowPosition" title="Scrollable Tabs"}
::

### Auto Overflow Detection

**v>= 2.97.0**

Set `collapsible="auto"` to enable automatic overflow detection. The component will automatically detect whether tabs overflow the container:

- When tabs exceed the container width or wrap to multiple lines, it automatically enables collapse mode (shows left/right arrows)
- When the container width increases or tab count decreases and all tabs can be fully displayed, it automatically exits collapse mode

This feature eliminates the need for developers to manually determine whether folding is needed, making it especially suitable for responsive layouts.

::demo-block{demo="tabs/en-us/AutoOverflow" title="Auto Overflow Detection"}
::

### Disable

Disable one tab.

::demo-block{demo="tabs/en-us/Disabled" title="Disable"}
::

### Extra Content

Use `tabBarExtraContent` to add extra content on the right side of tabBar.

::demo-block{demo="tabs/en-us/Extra" title="Extra Content"}
::

### Custom Render

Use `#tabBar="{ activeKey, list, onTabClick }"` with public `TabItem` to customize the tab bar.

::demo-block{demo="tabs/en-us/CustomBar" title="Custom Render"}
::

### Drag and Drop Reordering

Use the `#tabBar` scoped slot and public `TabItem` to implement drag reordering. This example uses Pointer Events and retains the upstream 5px activation distance, dragging opacity, and selected key.

> **Prerequisites**
>
> The upstream React demo requires dnd-kit:
>
> The Vue demo uses native Pointer Events and requires no drag-library dependency.

::demo-block{demo="tabs/en-us/Draggable" title="Drag and Drop Reordering"}
::

### Dynamic Update

You can add events to update tabBar dynamically.

::demo-block{demo="tabs/en-us/Dynamic" title="Dynamic Update"}
::

### Closeable

Close a tab in the tab bar. Only card style tabs support the close option. Use `closable` to turn it on.

::demo-block{demo="tabs/en-us/Closable" title="Closeable"}
::

## API Reference

### Tabs

| Property                 | Description                                                  | Type                       | Default              |
| ------------------------ | ------------------------------------------------------------ | -------------------------- | -------------------- |
| `activeKey / modelValue` | Controlled active key; supports v-model:activeKey or v-model | `string`                   | `—`                  |
| `arrowPosition`          | Arrow position in collapsible mode: start, end, both         | `TabArrowPosition`         | `both`               |
| `class / className`      | Vue class and compatibility class name                       | `string`                   | `—`                  |
| `style`                  | Root style object                                            | `CSSProperties`            | `—`                  |
| `collapsible`            | Enable horizontal collapsing; auto detects overflow          | `boolean / auto`           | `false`              |
| `contentStyle`           | Content wrapper style                                        | `CSSProperties`            | `—`                  |
| `defaultActiveKey`       | Initial active key; defaults to the first enabled item       | `string`                   | `first enabled item` |
| `dropdownProps`          | Dropdown options at both overflow ends; see below            | `TabsDropdownProps`        | `—`                  |
| `keepDOM`                | Keep inactive pane DOM                                       | `boolean`                  | `true`               |
| `lazyRender`             | Render a pane only after its first activation                | `boolean`                  | `false`              |
| `more`                   | Move the last N tabs into More, or configure options         | `number / TabsMoreOptions` | `—`                  |
| `preventScroll`          | Prevent document scrolling when focusing                     | `boolean`                  | `false`              |
| `showRestInDropdown`     | Show hidden tabs in the overflow dropdown                    | `boolean`                  | `true`               |
| `size`                   | Line-tab size: large, medium, small                          | `TabSize`                  | `large`              |
| `tabBarClassName`        | Tab bar class                                                | `string`                   | `—`                  |
| `tabBarExtraContent`     | Extra content to the right of the tab bar                    | `VNodeChild`               | `—`                  |
| `tabBarStyle`            | Tab bar style                                                | `CSSProperties`            | `—`                  |
| `tabList`                | Tab configurations; use either this or TabPane               | `PlainTab[]`               | `—`                  |
| `tabPaneMotion`          | Enable pane transitions                                      | `boolean`                  | `true`               |
| `tabPosition`            | top, left; slash supports top only                           | `TabPosition`              | `top`                |
| `type`                   | line, card, button, slash                                    | `TabType`                  | `line`               |
| `visibleTabsStyle`       | Scrolling-region style                                       | `CSSProperties`            | `—`                  |

### TabPane / PlainTab

| Property            | Description                            | Type            | Default    |
| ------------------- | -------------------------------------- | --------------- | ---------- |
| `closable`          | Allow closing in card mode             | `boolean`       | `false`    |
| `class / className` | Vue class and compatibility class name | `string`        | `—`        |
| `style`             | Root style object                      | `CSSProperties` | `—`        |
| `disabled`          | Disable the tab                        | `boolean`       | `false`    |
| `icon`              | Tab icon                               | `VNodeChild`    | `—`        |
| `itemKey`           | Unique key matching activeKey          | `string`        | `required` |
| `tab`               | Tab title                              | `VNodeChild`    | `—`        |
| `tabIndex`          | TabPane content tabindex               | `number`        | `0`        |

### TabsMoreOptions

| Property        | Description                                      | Type                  | Default    |
| --------------- | ------------------------------------------------ | --------------------- | ---------- |
| `count`         | Number of hidden tabs                            | `number`              | `required` |
| `render`        | Custom trigger; alternatively use the #more slot | `() => VNodeChild`    | `—`        |
| `dropdownProps` | More dropdown options                            | `TabsDropdownOptions` | `—`        |

### TabsDropdownProps / TabsDropdownOptions

| Property            | Description                                | Type                     | Default      |
| ------------------- | ------------------------------------------ | ------------------------ | ------------ |
| `start / end`       | Configure TabsDropdownOptions for each end | `TabsDropdownOptions`    | `—`          |
| `className / style` | Dropdown class and style                   | `string / CSSProperties` | `—`          |
| `trigger`           | Trigger: hover, click                      | `string`                 | `hover`      |
| `position`          | bottomLeft, bottomRight                    | `string`                 | `bottomLeft` |

### TabItem

| Property                                     | Description                             | Type                              | Default              |
| -------------------------------------------- | --------------------------------------- | --------------------------------- | -------------------- |
| `itemKey / tab / icon / disabled / closable` | Same as PlainTab                        | `PlainTab fields`                 | `—`                  |
| `selected`                                   | Whether this item is active             | `boolean`                         | `false`              |
| `size / type / tabPosition`                  | Same meaning as the matching Tabs props | `TabSize / TabType / TabPosition` | `large / line / top` |
| `class / className`                          | Vue class and compatibility class name  | `string`                          | `—`                  |
| `style`                                      | Root style object                       | `CSSProperties`                   | `—`                  |

Events: `@change(activeKey)`, `@tab-click(key, event: MouseEvent / KeyboardEvent)`, `@tab-close(key)`, `@visible-tabs-change(state: Map<string, boolean>)`, `update:activeKey`, and `update:modelValue`. On a selection change, change precedes tabClick. Closing emits a request; remove the item from the parent array.

Slots: `default` contains direct TabPane children or the current tabList content; `#tabBarExtraContent` extends the bar; `#tabBar="{ activeKey, list, onTabClick }"` replaces it; `#more="{ hiddenTabs }"` customizes the More trigger; `#arrow="{ items, position, click, defaultNode }"` customizes overflow arrows. `defaultNode` is a Vue node; use h/cloneVNode when composing it.

TabPane exposes default, tab, and icon slots. TabItem exposes tab and icon slots, and emits `@click(itemKey, event)`, `@key-down(event, itemKey, closable)`, `@close(itemKey, event)`. PlainTab is limited to disabled, icon, itemKey, tab, and closable; class/style/tabIndex are TabPane props. The Vue API does not expose React DefaultTabBar or arbitrary Dropdown render props.

## Accessibility

### ARIA

- About role
  - TabBar has a role of `tablist`
  - Tab in TabBar has a role of `tab`
  - TabPane has a role of `tabpanel`
- aria-orientation: Indicates TabBar's orientation, can be `vertical` or `horizontal`. When tabPosition is `left`,aria-orientation will be `vertical`, when tabPosition is `top`, aria-orientation will be `horizontal`.
- aria-disabled: When TabPane is disabled, the related Tab's aria-disabled will be set to true.
- aria-selected: Indicates whether the Tab is selected.
- aria-controls: Indicates the TabPane controlled by the Tab
- aria-labelledby: Indicates the element labels the TabPane

### Keyboard and Focus

WAI-ARIA: https://www.w3.org/WAI/ARIA/apg/patterns/tabpanel/

- Tabs can be given focus, except for disabled tabs
- Keyboard users can use the `Tab` key to move the focus to the tab panel of the selected tab element
- Use `left and right arrows` to toggle options when focus is on a tab element in a horizontal tab list
- Use `up and down arrows` to toggle options when focus is on a tab element in a vertical tab list
- When the focus is on an inactive tab element in the tab list, the `Space` or `Enter` keys can be used to activate the tab
- When keyboard users want to focus directly on the last tab element in the tab list:
  - Mac users: `fn` + `right arrow`
  - Windows users: `End`
- When keyboard users want to focus directly on the first tab element in the tab list:
  - Mac users: `fn` + `left arrow`
  - Windows users: `Home`
- When a tab is allowed to be deleted:
  - Users can use `Delete` keys to delete tab
  - After deletion, the focus is transferred to the next element of the deleted tab element; if the deleted element has no subsequent element, it is transferred to the previous element

## Content Guidelines

- Label copy needs to explain the label content accurately and clearly
- Use short, easily distinguishable labels
- try to stay within one word

## Design Token

::token-table{component="tabs"}
::

## FAQ

- **Why typography with ellipses in Tabs doesn't work?**

  Because when Tabs renders TabPane, the default is to render display: none. At this point these components cannot get the correct width or height values. It is recommended to enable lazyRender in or disable keepDOM.

- **Why are the height or width values ​​wrong when using components such as Collapse/Collapsible/Resizable Table in Tabs?**

  The reason is the same as above. In addition, if the collapse does not need animation, you can also turn off the animation effect by setting motion=false. There is no need to get the height of the component at this point。

## React → Vue

| React                                           | Vue                                                                      |
| ----------------------------------------------- | ------------------------------------------------------------------------ |
| `children / TabPane`                            | Direct TabPane children in the default slot                              |
| `activeKey + onChange`                          | v-model:activeKey / v-model                                              |
| `tabBarExtraContent ReactNode`                  | #tabBarExtraContent                                                      |
| `renderTabBar(tabBarProps, DefaultTabBar)`      | #tabBar="{ activeKey, list, onTabClick }" + TabItem                      |
| `renderArrow(items, pos, click, defaultNode)`   | #arrow="{ items, position, click, defaultNode }"                         |
| `more.render`                                   | #more or render returning VNodeChild                                     |
| `Tabs.TabItem`                                  | TabItem                                                                  |
| `onTabClick / onTabClose / onVisibleTabsChange` | @tab-click / @tab-close / @visible-tabs-change                           |
| `React dnd-kit`                                 | Pointer Events + Vue shallowRef (preserving the 5px activation distance) |
| `className`                                     | class (className alias retained)                                         |
