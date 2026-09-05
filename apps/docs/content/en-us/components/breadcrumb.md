---
title: 'Breadcrumb'
description: 'Breadcrumbs allow users to make selections from a range of values and provide an auxiliary navigation that can return to previous page.'
locale: 'en-US'
slug: 'breadcrumb'
category: 'navigation'
order: 56
englishTitle: 'Breadcrumb'
icon: 'doc-breadcrumb'
upstream: 'navigation/breadcrumb'
---

## Demos

### How to import

```ts
import { Breadcrumb, BreadcrumbItem } from '@aifuxi/semi-ui-vue/breadcrumb';
import '@aifuxi/semi-theme-default/breadcrumb.css';
```

### Basic Usage

::demo-block{demo="breadcrumb/en-us/Basic" title="Basic Usage"}
::

### With Icons

::demo-block{demo="breadcrumb/en-us/Icons" title="With Icons"}
::

### Size

You can set the `compact` property to `false` to increase the size of icons and texts.

::demo-block{demo="breadcrumb/en-us/Size" title="Size"}
::

### Custom Separator

Default separator is `/`.

::demo-block{demo="breadcrumb/en-us/Separator" title="Custom Separator"}
::

### Truncated Logic

After **v0.34.0**, the truncation happens if the text is overflowed. Default max-width is set to 150px. You could use `showTooltip` to customize ellipsis behavior.

::demo-block{demo="breadcrumb/en-us/Truncation" title="Truncated Logic"}
::

When the path exceeds 4 levels, the second level to the penultimate one will be replaced by ellipsis. You can click the ellipsis to reveal all levels.
For **v>=1.9.0** , you could use `maxItemCount` to set the number exceeded to trigger auto collapse.

::demo-block{demo="breadcrumb/en-us/Collapse" title="Truncated Logic"}
::

### Custom Ellipsis

There are two ellipsis area rendering types provided inside the component. You can set and select the desired rendering type through `moreType`. The optional values of `moreType` are `default` and `popover`.

::demo-block{demo="breadcrumb/en-us/Popover" title="Custom Ellipsis"}
::

If you want to customize other forms of rendering for the ellipsis area, you can use the `renderMore()` method.

::demo-block{demo="breadcrumb/en-us/CustomMore" title="Custom Ellipsis"}
::

### Route Object

Breadcrumb supports passing in an array of strings or route objects consisting of `{ name, path, href, icon }`. You can also use `renderItem` to render VNodeChild. Breadcrumbs created in this way will also be truncated.

- `name`: Name displayed, default with an empty string. When route passed in is a string only, it is set to name property.
- `path`: Routing path.
- `href`: Link destination and is mounted on the `<a>` tag.
- `icon`: Icon displayed.

::demo-block{demo="breadcrumb/en-us/Routes" title="Route Object"}
::

## API reference

### Breadcrumb

| Properties   | Instructions                                                                                                                                                                       | type                                      | Default                                                                                      | version |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------- | ------- |
| activeIndex  | Controlled active item index                                                                                                                                                       | number                                    | -                                                                                            | 2.61.0  |
| autoCollapse | Toggle whether to auto collapse when exceed maxItemCount                                                                                                                           | boolean                                   | true                                                                                         | 1.9.0   |
| class        | Class name                                                                                                                                                                         | string                                    | -                                                                                            |         |
| compact      | Compact sizing                                                                                                                                                                     | boolean                                   | true                                                                                         |         |
| maxItemCount | Set the number of item when reached to collapse                                                                                                                                    | number                                    | 4                                                                                            | 1.9.0   |
| moreType     | ...area rendering type，one of 'default'、'popover'                                                                                                                                | string                                    | 'default'                                                                                    | 1.27.0  |
| renderItem   | Custom function, used with routes                                                                                                                                                  | (Route: [Route](#route)) => VNodeChild    | -                                                                                            | 0.27.0  |
| renderMore   | Custom ... area rendering                                                                                                                                                          | (restItem: VNodeChild[]) => VNodeChild    | -                                                                                            | 1.27.0  |
| routes       | Routing information, an array of route objects or strings, format reference: [Route](#route)                                                                                       | Array<Route \| string>                    | -                                                                                            |         |
| separator    | Custom separator                                                                                                                                                                   | VNodeChild                                | '/'                                                                                          |         |
| showTooltip  | Toggle whether to show tooltip if text overflowed. If passed in as an object: width, overflowed width; ellipsisPos, ways of truncation; opts, passed directly to Tooltip component | boolean \| showToolTipProps               | {width: 150, ellipsisPos: 'end', opts: { autoAdjustOverflow: true, position: "bottomLeft" }} | 0.34.0  |
| style        | Inline style                                                                                                                                                                       | CSSProperties                             | -                                                                                            |         |
| @click       | Click event                                                                                                                                                                        | (item: [Route](#route), e: Event) => void | -                                                                                            | 0.27.0  |

### Breadcrumb.Item

| Properties | Instructions                                 | type                             | Default | version |
| ---------- | -------------------------------------------- | -------------------------------- | ------- | ------- |
| href       | Destinations for links                       | string                           | -       |         |
| icon       | Displayed icon                               | VNodeChild                       | -       |         |
| @click     | Click event                                  | function (item: Route, e: Event) | -       | 0.27.0  |
| separator  | Separator, used to override parent separator | VNodeChild                       | -       | 1.16.0  |
| noLink     | To remove hover and active effect on an item | boolean                          | false   | 1.16.0  |

### Route

| Properties | Instructions      | type       | Default | version |
| ---------- | ----------------- | ---------- | ------- | ------- |
| href       | Link destinations | string     | -       | 0.27.0  |
| icon       | Displayed icon    | VNodeChild |         | -       |
| name       | Routing name      | string     | -       |         |
| path       | Routing path      | string     | -       |         |

After **v>=1.16.0**, other props in Breadcrumb.Item are also supported correspondingly.

## Accessibility

- Breadcrumb supports the `aria-label` props to indicate the function of the Breadcrumb
- Breadcrumb will set `aria-current='page'` for the current item

## Content Guidelines

- Each page link should be short and clearly reflect the location or entity it links to
- Write in sentence case

## Design Tokens

::token-table{component="breadcrumb"}
::

## React → Vue Migration

| React                          | Vue                                                            |
| ------------------------------ | -------------------------------------------------------------- |
| `Breadcrumb.Item`              | `BreadcrumbItem` or compound member                            |
| `children`                     | Default slot containing BreadcrumbItem children                |
| `icon` / `separator` ReactNode | Named slots or VNodeChild props                                |
| `renderItem(route)`            | `#item="{ route, index }"` or renderItem returning VNodeChild  |
| `renderMore(restItems)`        | `#more="{ items, expand }"` or renderMore returning VNodeChild |
| `onClick(item, event)`         | `@click`, for mouse or Enter activation                        |
| `className`                    | Native `class`; className remains supported                    |

Route name and icon accept VNodeChild. `href` defines navigation while `path` is data for application callbacks. Custom more areas receive the actual hidden nodes; preserve their event handlers. Call `expand()` to reveal all levels.

BreadcrumbItem also exposes `active`, `route`, and `shouldRenderSeparator`; Breadcrumb manages these when used together. `autoCollapse` and `compact` default to true and respect explicit false values. The upstream separator example's `size` is not a public prop; the default compact sizing is retained. Internal example links point to local pages with trailing slashes.
