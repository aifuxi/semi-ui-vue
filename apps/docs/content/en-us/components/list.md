---
title: 'List'
description: 'Lists display a set of related contents'
locale: 'en-US'
slug: 'list'
category: 'show'
order: 75
englishTitle: 'List'
icon: 'doc-list'
upstream: 'show/list'
---

## Demos

### How to import

```ts
import { List, ListItem } from '@aifuxi/semi-ui-vue/list';
import '@aifuxi/semi-theme-default/list.css';
```

### Basic Usage

You can use `size` to size list. Supported values include `large`, `default`, `small`. Header and Footer customized.

::demo-block{demo="list/en-us/Basic" title="Basic Usage"}
::

### Template

List.Item has a built-in template consisting of: `header`, `main`, and `extra`. The alignment of `header` and `main` set by `align` properties using one of `flex-start`(default), `flex-end`, `center`, `baseline`, and `stretch` .

::demo-block{demo="list/en-us/Template" title="Template"}
::

### Layout

Use `layout` property to set list layout, one of `vertical`(default) or `horizontal`.

::demo-block{demo="list/en-us/Layout" title="Layout"}
::

### Grid

Use `grid` property to set grid layout. Use `span` to set the number of occupying spaces for each item and `gutter` for spacing between items.

::demo-block{demo="list/en-us/Grid" title="Grid"}
::

### Responsive List

Refer to [Grid](/en-us/components/grid/) for responsive dimensions.

::demo-block{demo="list/en-us/Responsive" title="Responsive List"}
::

### Load More

You can use `loadMore` to achieve loading state for more incoming contents.

::demo-block{demo="list/en-us/LoadMore" title="Load More"}
::

### Scroll to Load

Use native scroll events with Vue state for infinite scrolling. A Load More button appears after three automatic loads.

::demo-block{demo="list/en-us/ScrollLoad" title="Scroll to Load"}
::

### Scroll to Load Infinite Lists

Combine visible-window calculations and absolute positioning with asynchronous loading. Only visible and overscan rows render, improving long-list performance.

::demo-block{demo="list/en-us/Virtualized" title="Scroll to Load Infinite Lists"}
::

### Drag Sort

Use Pointer Events for vertical dragging, drop sorting and automatic scrolling near page edges.

::demo-block{demo="list/en-us/DragSort" title="Drag Sort"}
::

### With Pagination

You can use Pagination in combination to achieve a paged List

::demo-block{demo="list/en-us/Pagination" title="With Pagination"}
::

### With filter

You can use it by assembling Input to filter the List

::demo-block{demo="list/en-us/Filter" title="With filter"}
::

### Add delete item

::demo-block{demo="list/en-us/AddRemove" title="Add delete item"}
::

### Single or multiple selection

You can enhance the List into a list selector by combining Radio or Checkbox

::demo-block{demo="list/en-us/Selection" title="Single or multiple selection"}
::

### Keyboard events

You can monitor the keyboard events of the corresponding keys by yourself to realize the selection of different items. As in the following example, you can use the up and down arrow keys to select different items

::demo-block{demo="list/en-us/Keyboard" title="Keyboard events"}
::

The custom styles involved in the Demo of the above book list example are as follows

```scss
.component-list-demo-booklist {
  .list-item {
    &:hover {
      background-color: var(--semi-color-fill-0);
    }
    &:active {
      background-color: var(--semi-color-fill-1);
    }
  }
}

body > .component-list-demo-drag-item {
  font-size: 14px;
}

.component-list-demo-booklist-active-item {
  background-color: var(--semi-color-fill-0);
}
```

## API reference

### List

| Properties   | Instructions                                                       | type                                          | Default    |
| ------------ | ------------------------------------------------------------------ | --------------------------------------------- | ---------- |
| bordered     | Toggle whether to display border                                   | boolean                                       | `false`    |
| class        | Class name                                                         | string                                        | -          |
| dataSource   | List data source                                                   | any[]                                         | -          |
| emptyContent | Displayed content when empty                                       | VNodeChild                                    | -          |
| footer       | Footer of list                                                     | VNodeChild                                    | -          |
| grid         | Grid configuration                                                 | [Grid](/en-us/components/grid/#API-reference) | -          |
| header       | Header of list                                                     | VNodeChild                                    | -          |
| layout       | Layout, one of `vertical`, `horizontal`                            | string                                        | `vertical` |
| loadMore     | Loadmore button                                                    | VNodeChild                                    | -          |
| loading      | Toggle whether to display `Spin` when loading                      | boolean                                       | `false`    |
| renderItem   | When using dataSource, you can customize rendering with renderItem | (item, ind) => VNodeChild                     | -          |
| size         | Size, one of `small`, `default`, `large`                           | string                                        | `default`  |
| split        | Toggle whether to display split line                               | boolean                                       | `true`     |
| style        | Inline style                                                       | CSSProperties                                 | -          |
| @click       | Callback function when click an item                               | function                                      | -          |
| @right-click | Callback function when right click an item                         | function                                      | -          |

### Listgrid props

Other grid properties are also supported. Refer to [Grid](/en-us/components/grid/).

| Properties | Instructions                                                                  | type           | Default |
| ---------- | ----------------------------------------------------------------------------- | -------------- | ------- |
| span       | Number of grid spaces                                                         | number         | -       |
| gutter     | Grid spacing                                                                  | number         | 0       |
| xs         | `< 576px` responsive grid, a number or an object containing other attributes  | number\|object | -       |
| sm         | `≥ 576px` responsive grid, a number or an object containing other properties  | number\|object | -       |
| md         | `≥ 768px` responsive grid, a number or an object containing other properties  | number\|object | -       |
| lg         | `≥ 992px` responsive grid, a number or an object containing other properties  | number\|object | -       |
| xl         | `≥ 1200px` responsive grid, a number or an object containing other properties | number\|object | -       |
| xxl        | `≥ 1600px` responsive grid, a number or an object containing other properties | number\|object | -       |

### List.Item

| Properties   | Instructions                                                                                            | type          | Default      |
| ------------ | ------------------------------------------------------------------------------------------------------- | ------------- | ------------ |
| align        | Vertical alignment of header and main, one of `flex-start`, `flex-end`, `center`, `baseline`, `stretch` | string        | `flex-start` |
| class        | Class name                                                                                              | string        | -            |
| extra        | Additional content                                                                                      | VNodeChild    | -            |
| header       | List item header content                                                                                | VNodeChild    | -            |
| main         | List item body content                                                                                  | VNodeChild    | -            |
| @click       | Callback function when click an item                                                                    | function      | -            |
| @right-click | Callback function when right click an item                                                              | function      | -            |
| style        | Inline style                                                                                            | CSSProperties | -            |

## Content Guidelines

- Capitalize the first letter
- do not follow punctuation at the end
- Grammatical parallelism: mixed use of active and passive, declarative and imperative sentences

## Design Tokens

::token-table{component="list"}
::

## Accessibility

List does not add keyboard selection state. Use Checkbox/Radio for selection and native buttons or links for interactive rows. Focus the keyboard example to move its highlight with arrow keys.

## FAQ

**How do I update list data?**

Update dataSource or the default slot. List does not maintain paginated, filtered or sorted data.

## React → Vue Migration

| React                                     | Vue                                                          |
| ----------------------------------------- | ------------------------------------------------------------ |
| children                                  | Default slot containing ListItem                             |
| renderItem(item, index)                   | `#item="{ item, index }"` or renderItem returning VNodeChild |
| header / footer / loadMore / emptyContent | Named slots or VNodeChild props                              |
| List.Item                                 | ListItem or the compound member                              |
| ListItem header / main / extra            | Named slots or VNodeChild props                              |
| onClick / onRightClick                    | @click / @right-click with MouseEvent                        |
| ListItem onMouseEnter / onMouseLeave      | @mouse-enter / @mouse-leave with MouseEvent                  |
| className                                 | class; className is also supported                           |

List does not manage pagination, filtering, selection, drag sorting or virtualization. The examples compose public components with Vue state. Infinite scrolling uses native scroll events, virtualization renders visible and overscan rows with asynchronous records, and Pointer Events implement vertical dragging, drop sorting and scrolling near the viewport edges. React-specific integration packages are not required. Timers and animation frames are cleaned up on unmount.

Filtering handles both IME and plain text input. Checkbox defaults contain a full book title, and adding books avoids duplicates. Keyboard navigation is scoped to the focusable example, preserving keyboard input elsewhere on the page.
