---
title: 'Spin'
description: 'Spin is used to inform the user that the content is loading and may take an uncertain period of time.'
locale: 'en-US'
slug: 'spin'
category: 'feedback'
order: 93
englishTitle: 'Spin'
icon: 'doc-spin'
upstream: 'feedback/spin'
---

## Demos

### How to import

```jsx
import { Spin } from '@douyinfe/semi-ui';
```

### Basic usage

::demo-block{demo="spin/en-us/Basic" title="Basic usage"}
::

### Size

Supports three sizes: `large`, `middle` (default), and `small`.

::demo-block{demo="spin/en-us/Size" title="Size"}
::

### With Description

Use `tip` to set the description texts when Spin is used as a wrapping element

::demo-block{demo="spin/en-us/Tip" title="With Description"}
::

### Customized Indicator

Use `indicator` property to customize Spin's indicator style.

::demo-block{demo="spin/en-us/Indicator" title="Customized Indicator"}
::

### Delay

Delayed to display Spin.

::demo-block{demo="spin/en-us/Delay" title="Delay"}
::

### Controlled

Use `spinning` to determine if the component is in loading status

::demo-block{demo="spin/en-us/Controlled" title="Controlled"}
::

## API Reference

| Property            | Description                                         | Type                      | Default  |
| ------------------- | --------------------------------------------------- | ------------------------- | -------- |
| `childStyle`        | Style for the child content wrapper                 | `StyleValue`              | `—`      |
| `delay`             | Delay before loading is shown, in milliseconds      | `number`                  | `0`      |
| `indicator`         | Custom indicator; also supports the indicator slot  | `VNodeChild`              | `—`      |
| `size`              | small, middle, large; use middle, not medium        | `SpinSize`                | `middle` |
| `spinning`          | Controlled loading state; true when omitted         | `boolean`                 | `true`   |
| `style`             | Wrapper style                                       | `StyleValue`              | `—`      |
| `tip`               | Loading message or node; also supports the tip slot | `VNodeChild`              | `—`      |
| `wrapperClassName`  | Wrapper class name                                  | `string`                  | `—`      |
| `class / className` | Vue class and compatibility alias                   | `HTMLAttributes["class"]` | `—`      |

Slots: `default` for wrapped content, `indicator` for the icon, and `tip` for the description. Named slots take precedence over their matching props. Control `spinning` from the parent; the component has no `v-model` or loading-change event.

## Design Tokens

::token-table{component="spin"}
::

## Content Guidelines

- Precisely state the loading status, using words such as "Loading", "Submitting", "Processing", etc.
- Use as few words as possible to describe the state

## FAQ

- **How to modify the color of the spin icon?**

  You can override the original color by adding the color property to the .semi-spin-wrapper class (it is recommended to override with a higher weight).

  ```
  .custom .semi-spin-wrapper {
    color: red;
  }
  ```

## Accessibility

Pair the spinner with a concise textual status. The pinned component does not automatically add a live region or aria-busy; the surrounding application should provide these semantics when loading changes need to be announced. Do not use the overlay as the only way to prevent an action.

## React → Vue

| React                          | Vue                                           |
| ------------------------------ | --------------------------------------------- |
| `children`                     | default slot                                  |
| `ReactNode in indicator / tip` | indicator / tip slots or VNodeChild props     |
| `useState + setLoading`        | shallowRef + :spinning                        |
| `className / CSSProperties`    | class (className alias retained) / StyleValue |

Examples target the public Vue component subpaths. Each preview and source editor reads the same SFC. The reference is the local Semi Design v2.102.0 submodule (`cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`).
