---
title: 'Steps'
description: 'Decompose complex tasks or tasks with prior relationships, use step components to guide users to operate according to the prescribed process, and let them know their current progress'
locale: 'en-US'
slug: 'steps'
category: 'navigation'
order: 59
englishTitle: 'Steps'
icon: 'doc-steps'
upstream: 'navigation/steps'
---

## Demos

### How to import

```ts
import { Steps, Step } from '@aifuxi/semi-ui-vue/steps';
import '@aifuxi/semi-theme-default/steps.css';
```

### Default step bar(Deprecated)

It is recommended to use the simple version of steps, which will be gradually deprecated later

::demo-block{demo="steps/en-us/Fill" title="Default step bar(Deprecated)"}
::

### Basic Steps(Recommended)

Set type=`"basic"` to display a simple style step bar

::demo-block{demo="steps/en-us/Basic" title="Basic Steps(Recommended)"}
::

### Nav Steps

You can use type="nav" to set the navigation style step bar. The navigation style step bar has the following characteristics:

1. Navigation steps support click and Enter activation and notify callers through change.

2. It is suitable when the steps are not related to each other, the content does not affect each other, and the visual elements of the page need to be highlighted.

3. The width of the step bar is opened according to the content.

4. Navigation styling displays title and omits description and icon; styling, ARIA and events remain supported.

::demo-block{demo="steps/en-us/Navigation" title="Nav Steps"}
::

### Mini size step bar

Display the mini size step bar by setting size=`"small"`

::demo-block{demo="steps/en-us/Small" title="Mini size step bar"}
::

::demo-block{demo="steps/en-us/SmallNavigation" title="Mini size step bar"}
::

### Processing progress

Use with content and buttons to represent the processing progress of a process

::demo-block{demo="steps/en-us/Progress" title="Processing progress"}
::

### Steps bar in vertical direction

Show steps in vertical direction by setting direction

::demo-block{demo="steps/en-us/VerticalFill" title="Steps bar in vertical direction"}
::

::demo-block{demo="steps/en-us/VerticalBasic" title="Steps bar in vertical direction"}
::

### Specify step status

Using Steps `status` Property to specify the state of the current step.

::demo-block{demo="steps/en-us/Status" title="Specify step status"}
::

### Custom icons

By setting Steps.Step's `icon` Properties, you can use custom icons.

::demo-block{demo="steps/en-us/Icons" title="Custom icons"}
::

### onChange CallBack

Since version 1.29.0, onChange is supported, which can be used to realize the processing progress. onChange receives a parameter of type number, which is equal to initial + current.

::demo-block{demo="steps/en-us/Controlled" title="onChange CallBack"}
::

## API reference

### Steps

| Parameters | Instructions                                                                                                               | type                   | Default    | Version |
| ---------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ---------- | ------- |
| class      | Class name                                                                                                                 | string                 |            |         |
| current    | Specifies the current step, counting from 0. In the subStep element, the state can be overridden by the `status` attribute | number                 | 0          |         |
| direction  | Horizontal or vertical steps                                                                                               | horizontal \| vertical | horizontal |         |
| hasLine    | When the step bar type is basic, you can control whether to display the connecting line                                    | boolean                | true       | 1.18.0  |
| initial    | Start serial number, count from 0.                                                                                         | number                 | 0          |         |
| size       | For simple step bar and navigation step bar, the size is optional, the value is `small`, `default`                         | string                 | `default`  | 1.18.0  |
| status     | Specify the status of the current step, optional `wait`,`process`,`finish`,`error`,`warning`                               | string                 | process    |         |
| style      | Style                                                                                                                      | CSSProperties          |            |         |
| type       | Steps type, optional `fill` `basic`、`nav`                                                                                 | string                 | fill       | 1.18.0  |
| @change    | onChange callback                                                                                                          | (index: number)=>void  | -          | 1.29.0  |

### Steps.Step

Step in the step bar.

| Parameters  | Instructions                                                                                                                                                                     | type                   | Default | Version |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ------- | ------- |
| aria-label  | Container aria-label                                                                                                                                                             | string                 |         |         |
| description | Detailed description of steps, optional                                                                                                                                          | VNodeChild             |         | -       |     |
| icon        | Type of step icon, optional                                                                                                                                                      | VNodeChild             |         | -       |     |
| role        | Container role                                                                                                                                                                   | HTMLAttributes["role"] | -       |         |
| status      | Specify the state. When this property is not configured, the `current`of Steps is used to automatically specify the state. Optional: `wait`,`process`,`finish`,`error`,`warning` | string                 | wait    |         |
| style       | CSS Style                                                                                                                                                                        | CSSProperties          |         |         |
| title       | Title                                                                                                                                                                            | VNodeChild             |         | -       |     |
| @click      | Callback of click                                                                                                                                                                | function               | -       |         |
| @key-down   | Callback ok keyDown                                                                                                                                                              | function               | -       |         |

## Accessibility

### ARIA

- Steps and Step components support passing in the `aria-label` attribute to represent the description of Steps and Steps
- Step component has an `aria-current` `step` attribute, indicating that this is a step in the step bar

## Content Guidelines

- Step title
  - title should be kept concise, avoiding truncation and line breaks
  - use sentence capitalization
  - do not include punctuation
- Step description
  - supplementary contextual information for the title
  - don't end with punctuation

## Design Tokens

::token-table{component="steps"}
::

## React → Vue Migration

| React                                | Vue                                               |
| ------------------------------------ | ------------------------------------------------- |
| `Steps.Step`                         | `Step` or compound member                         |
| `children`                           | Steps default slot                                |
| title / description / icon ReactNode | Named slots or VNodeChild props                   |
| `onChange(index)`                    | `@change="onChange"`; update `current` explicitly |
| `onClick` / `onKeyDown`              | Step `@click` / `@key-down`                       |
| `aria-label`                         | `aria-label` or ariaLabel prop                    |
| `className`                          | Native `class`; className remains supported       |

Steps does not expose v-model: use current and change for controlled state. change receives the activated child's index plus initial. prefixCls defaults to semi-steps. When an item has no explicit status, it is inferred from current, initial and the overall status.

The fixed v2.102.0 navStep implements click and Enter handling, so navigation steps also emit change. The outdated upstream statement that they do not support interaction is corrected here. Navigation styling omits description and icon but supports title, styling, ARIA and events. key-down emits only for Enter. Each step retains aria-current=step; communicate progress through current and clear titles.
