---
title: 'Pagination'
description: 'The Pager helps users navigate between multiple pages'
locale: 'en-US'
slug: 'pagination'
category: 'navigation'
order: 58
englishTitle: 'Pagination'
icon: 'doc-pagination'
upstream: 'navigation/pagination'
---

## Demos

### How to import

```ts
import { Pagination } from '@aifuxi/semi-ui-vue/pagination';
import '@aifuxi/semi-theme-default/pagination.css';
```

### Basic Usage

Set the total number via `Total`, Set capacity per page via `pageSize`.

::demo-block{demo="pagination/en-us/Basic" title="Basic Usage"}
::

### disabled

Disabled via the `disabled` setting

::demo-block{demo="pagination/en-us/Disabled" title="disabled"}
::

### Show total page number

Use the showTotal property to control whether the total number of pages is shown.

::demo-block{demo="pagination/en-us/Total" title="Show total page number"}
::

### Specify current page number

You can specify the currently active page number via `defaultCurrentPage`.

::demo-block{demo="pagination/en-us/DefaultPage" title="Specify current page number"}
::

### Capacity switching per page

By setting `showSizeChanger` for `true`, allowing quick switching of capacity per page via the Select component

::demo-block{demo="pagination/en-us/SizeChanger" title="Capacity switching per page"}
::

### Jump to a page quickly

By setting `showQuickJumper` to `true`, you can enter the page number through the Input control to quickly jump  
When Input loses focus, if there is a valid number in Input, it will jump directly. You can also enter the page number you want to jump to when the Input is focused, and then hit enter to jump directly  
If you enter a page number greater than the total page number of the pager, we will automatically jump to the last page for you  
showQuickJumper is available after v1.31

::demo-block{demo="pagination/en-us/QuickJumper" title="Jump to a page quickly"}
::

### Page number controlled

After the currentPage is passed in, the pager is a controlled component and is generally used in conjunction with `onPageChange`. The current active page number depends entirely on the value of the `currentPage` passed in.

::demo-block{demo="pagination/en-us/Controlled" title="Page number controlled"}
::

### Preset capacity per page

Specify an optional value for switching the capacity per page by using the `pageSizeOpts` array

::demo-block{demo="pagination/en-us/PageSizeOptions" title="Preset capacity per page"}
::

### Mini version

Show mini pagination via size properties.

::demo-block{demo="pagination/en-us/Mini" title="Mini version"}
::

Turn on hoverShowPageSelect to quickly switch hover page numbers (provided after v1.27.0)

::demo-block{demo="pagination/en-us/MiniSelect" title="Mini version"}
::

## API reference

| Properties                        | Instructions                                                                                                                                                                                               | type                                            | Default             | Version |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ------------------- | ------- |
| class                             | The CSS class name of the wrapper element                                                                                                                                                                  | string                                          |                     |         |
| currentPage                       | Current page number                                                                                                                                                                                        | number                                          |                     |         |
| defaultCurrentPage                | Default current page number                                                                                                                                                                                | number                                          |                     |         |
| hideOnSinglePage                  | Whether to hide the page divider automatically when the total number of pages is less than 2. When showSizeChanger is true, this switch no longer takes effect                                             | boolean                                         | false               |         |
| disabled                          | disabled                                                                                                                                                                                                   | boolean                                         | false               | 2.37.0  |
| hoverShowPageSelect               | Whether to show the page select when hover page (only work when size='small')                                                                                                                              | boolean                                         | false               | 1.27.0  |
| nextText                          | Text displayed by the next Page button                                                                                                                                                                     | string\| VNodeChild                             |                     |         |
| pageSize                          | Number of entries per page                                                                                                                                                                                 | number                                          | 10                  |         |
| pageSizeOpts                      | Specify how many items are displayed per page                                                                                                                                                              | array                                           | \[10, 20, 40, 100\] |         |
| popoverPosition                   | Floating layer direction, visible [Popover·API reference·position](/en-us/components/popover/#api)                                                                                                         | string                                          | "bottomLeft"        |         |
| popoverZIndex                     | Floating layer z-index value                                                                                                                                                                               | number                                          | 1030                |         |
| preventPageChangeOnPageSizeChange | Whether to prevent automatic adjustment of currentPage when pageSize changes. When true, changing pageSize will not trigger onPageChange, allowing you to handle page changes in onPageSizeChange callback | boolean                                         | false               |         |
| prevText                          | Text displayed by the previous Page button                                                                                                                                                                 | string\| VNodeChild                             |                     |         |
| size                              | Size, optional `small`, `default`                                                                                                                                                                          | string                                          | 'default'           |         |
| style                             | Inline style                                                                                                                                                                                               | object                                          |                     |         |
| showSizeChanger                   | Whether to show a selector to switch the capacity of each page                                                                                                                                             | boolean                                         | false               |         |
| showQuickJumper                   | Whether to show a input to type the page number, supported after v1.31                                                                                                                                     | boolean                                         | false               | 1.31.0  |
| showTotal                         | Whether to show total page number                                                                                                                                                                          | boolean                                         | 3                   |         |
| total                             | Total number                                                                                                                                                                                               | number                                          | 1                   |         |
| @change                           | The callback function when page number or capacity per page changes                                                                                                                                        | function(currentPage: number, pageSize: number) |                     |         |
| @page-change                      | A callback function for page number changes                                                                                                                                                                | function(currentPage: number)                   |                     |         |
| onPageSize Change                 | Callback function when capacity changes per page                                                                                                                                                           | function(pageSize: number)                      |                     |         |

## Accessibility

### ARIA

- `aria-label`: Labels the element such as previous, next, pages in the pagination.
- `aria-current`: Indicates the current page.

## Design Tokens

::token-table{component="pagination"}
::

## FAQ

- **Why is the page drop-down selector only `1,000,000` at most？**  
  Because when creating lists, the browser has [restrictions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Invalid_array_length) on the size of Array.from () to create arrays; At the same time, in order to take into account the overhead of Array.from(), we set the threshold of `1,000,000`.

## React → Vue Migration

| React                             | Vue                                                                            |
| --------------------------------- | ------------------------------------------------------------------------------ |
| `currentPage` / `onPageChange`    | `v-model:current-page`, or `:current-page` + `@page-change`                    |
| Current page state                | `v-model` (modelValue) is also supported and takes precedence over currentPage |
| `pageSize` / `onPageSizeChange`   | `v-model:page-size`, or `:page-size` + `@page-size-change`                     |
| `onChange(page, size)`            | `@change`                                                                      |
| `prevText` / `nextText` ReactNode | `prev` / `next` slots or corresponding VNodeChild props                        |
| `className`                       | Native `class`; className remains supported                                    |

Without a current-page prop the component manages page state, with defaultCurrentPage=1. Providing currentPage or modelValue makes it controlled. Normal page navigation emits pageChange followed by change. Setting preventPageChangeOnPageSizeChange disables automatic page recalculation when page size changes; update the page in pageSizeChange when needed.

Initial page size comes from pageSize, then the first pageSizeOpts entry, then 10. The default size is `default` and showTotal is false. English examples use ConfigProvider with locale.code=en-US. API version numbers refer to the fixed upstream feature versions.
