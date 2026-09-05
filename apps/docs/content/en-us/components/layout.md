---
title: 'Layout'
description: 'Used to quickly divide the overall layout of the page'
locale: 'en-US'
slug: 'layout'
category: 'basic'
order: 19
englishTitle: 'Layout'
icon: 'doc-layout'
upstream: 'basic/layout'
---

## Overview

- `Layout`: Layout containers. You can nest `Header` `Sider` `Content` `Footer` or `Layout` itself inside.
- `Header`: Head component, can only be used inside `Layout`.
- `Sider`: Sidebar, can only be used inside `Layout`.
- `Content`: Content component, can only be used inside `Layout`.
- `Footer`: Footer component, can only be used inside `Layout`.

1、Layout components are implemented with Flex layout. Browser compatibility may need to be considered. <br/>
2、The Layout component will only help you implement the layout, but will not include styles such as background color, text color, width and height. You can pass in style according to your actual needs or write a separate css implementation given a specific className

## Demos

### How to import

```ts
import {
  Layout,
  LayoutHeader,
  LayoutFooter,
  LayoutContent,
  LayoutSider,
} from '@aifuxi/semi-ui-vue/layout';
import '@aifuxi/semi-theme-default/layout.css';
```

### Three-section Layout

::demo-block{demo="layout/en-us/ThreeSections" title="Three-section Layout"}
::

### Left-sidebar Layout

::demo-block{demo="layout/en-us/LeftSidebar" title="Left-sidebar Layout"}
::

### Right-sidebar Layout

::demo-block{demo="layout/en-us/RightSidebar" title="Right-sidebar Layout"}
::

### Sidebar Layout

::demo-block{demo="layout/en-us/Sidebar" title="Sidebar Layout"}
::

### Responsive Layout

Six response sizes are preset in the sidebar: `xs`,`sm`,`md`,`lg`,`xl`,`xxl`. You can use `breakpoint` to set breakpoints, and use `onBreakpoint` to call callback functions.

::demo-block{demo="layout/en-us/Responsive" title="Responsive Layout"}
::

## Layout Examples

### Top-nav Layout

::demo-block{demo="layout/en-us/TopNavigation" title="Top-nav Layout"}
::

### Top-Nav SideBar Layout

::demo-block{demo="layout/en-us/TopSidebar" title="Top-Nav SideBar Layout"}
::

### SideBar Navigation

::demo-block{demo="layout/en-us/SideNavigation" title="SideBar Navigation"}
::

## API Reference

### Layout

> `Layout.Header`, `Layout.Footer` and `Layout.Content` share styling and semantic attributes; `hasSider` belongs only to Layout.

| Properties | Instructions                                                                                                                                                                                                 | type          | Default |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- | ------- |
| class      | Class name                                                                                                                                                                                                   | string        | -       |
| hasSider   | Indicates that there is a Sider in the child element, which is generally not specified. It can be used to avoid style flashing during SSR.                                                                   | boolean       | -       |
| style      | Style                                                                                                                                                                                                        | CSSProperties | -       |
| aria-label | [aria-label](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute) attribute, used to label the current element Description, improve accessibility | string        |         | 2.2.0 |
| role       | [role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles) attribute to improve accessibility                                                                                             | string        |         | 2.2.0 |

### Layout.Sider

| Properties  | Instructions                                                                                                                                                                                                 | type                                   | Default |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- | ------- |
| breakpoint  | Breakpoints that trigger responsive layout, one of 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'                                                                                                                       | String[]                               | -       |
| class       | Class name                                                                                                                                                                                                   | string                                 | -       |
| style       | Style                                                                                                                                                                                                        | CSSProperties                          | -       |
| @breakpoint | Callback function when triggering a responsive layout breakpoint                                                                                                                                             | (screen: string, broken: bool) => void | -       |
| aria-label  | [aria-label](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute) attribute, used to label the current element Description, improve accessibility | string                                 |         | 2.2.0 |

### responsive map

```text
{
  xs: '(max-width: 575px)',
  sm: '(min-width: 576px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
  xl: '(min-width: 1200px)',
  xxl: '(min-width: 1600px)',
}
```

## Accessibility

### ARIA

- Sider can pass in aria-label props to describe the function of this Sider.
- Header Content Main Footer can pass in role aria-label to describe the function of the corresponding element.

## Design Tokens

Layout defines no component-specific design variables. Examples use global theme tokens; provide dimensions and backgrounds through application styles.

## React → Vue Migration

| React                                | Vue                                                                                           |
| ------------------------------------ | --------------------------------------------------------------------------------------------- |
| `Layout.Header/Footer/Content/Sider` | Compound members or `LayoutHeader` / `LayoutFooter` / `LayoutContent` / `LayoutSider` imports |
| `children`                           | Default slot                                                                                  |
| `className` / `style`                | Native `class` / `style`                                                                      |
| `onBreakpoint(screen, matches)`      | `@breakpoint="onBreakpoint"`                                                                  |
| React ref                            | Vue template ref                                                                              |

Layout, Header, Footer and Content expose `tagName` (section, header, footer and main respectively) and `prefixCls` (`semi-layout`). Only Layout exposes `hasSider`. Sider renders aside and supports `class`, `style`, `data-*` and `aria-label`; the fixed Adapter does not forward `role`, so the erroneous upstream table entry has been removed.

Breakpoint callbacks report whether the media query matches; they do not collapse the sidebar automatically. Apply your own layout changes in the callback. Set `hasSider` explicitly for SSR when needed to avoid an initial layout shift.

Semi/ByteDance logos in composite examples are replaced by a generic icon and independent branding, preserving navigation and layout behavior. The upstream Related Material section links to an external platform that this documentation does not integrate.
