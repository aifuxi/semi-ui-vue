---
title: 'Slider'
description: 'Selector to quickly select a number or range of values using drag interaction, more intuitive than InputNumber'
locale: 'en-US'
slug: 'slider'
category: 'input'
order: 47
englishTitle: 'Slider'
icon: 'doc-slider'
upstream: 'input/slider'
---

## Demos

### How to import

```ts
import { Slider } from '@aifuxi/semi-ui-vue/slider';
import '@aifuxi/semi-theme-default/slider.css';
```

### Basic Usage

You can set `range={true}` to allow slider slide from both sides.

::demo-block{demo="slider/en-us/Basic" title="Basic Usage"}
::

### With Input

Synchronize slider with input value.

::demo-block{demo="slider/en-us/WithInput" title="With Input"}
::

### Tooltip

You can use `tipFormatter` to format Tooltip content or set `tipFormatter={null}`to hide Tooltip.

::demo-block{demo="slider/en-us/Tooltip" title="Tooltip"}
::

### With Tag

Use `marks` to label measures on sliders.

::demo-block{demo="slider/en-us/Marks" title="With Tag"}
::

### Segmented Background

To create a slider with segmented background, you could use CSS property `linear-gradient` for `railStyle` along with `@change` to change background dynamically。
::demo-block{demo="slider/en-us/Gradient" title="Segmented Background"}
::

### Controlled Component

You can use `value` along with `@change` property if you want to use Slider as a controlled component.

::demo-block{demo="slider/en-us/Controlled" title="Controlled Component"}
::

### Vertical

::demo-block{demo="slider/en-us/Vertical" title="Vertical"}
::

### Handle with dot

::demo-block{demo="slider/en-us/HandleDot" title="Handle with dot"}
::

## API Reference

### Slider

| Property           | Type                                                                   | Default | Description                                                                                                                                                                     |
| ------------------ | ---------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ariaLabel`        | `string`                                                               | `—`     | Accessible name; use aria-label in templates.                                                                                                                                   |
| `ariaLabelledby`   | `string`                                                               | `—`     | Label element ids; use aria-labelledby in templates.                                                                                                                            |
| `ariaValueText`    | `string`                                                               | `—`     | Human-readable value; use aria-value-text in templates.                                                                                                                         |
| `className`        | `HTMLAttributes['class']`                                              | `—`     | Compatibility class name; prefer class in Vue templates.                                                                                                                        |
| `defaultValue`     | `SliderValue`                                                          | `—`     | Default value                                                                                                                                                                   |
| `disabled`         | `boolean`                                                              | `false` | Disable slider                                                                                                                                                                  |
| `getAriaValueText` | `(value: number, index?: number) => string`                            | `—`     | Used to provide a user-friendly name for the current value of the slider, important for screen reader users, The parameters value and index are the current slider value, order |
| `handleDot`        | `SliderHandleDot \| [SliderHandleDot?, SliderHandleDot?]`              | `—`     | Whether to show the dot on the handle                                                                                                                                           |
| `included`         | `boolean`                                                              | `true`  | Takes effect when `marks` is not null, true means containment and false means coordination                                                                                      |
| `marks`            | `SliderMarks`                                                          | `—`     | Tick mark of Slider, type of key must be number, and must in closed interval [min, max]                                                                                         |
| `max`              | `number`                                                               | `100`   | Maximum value of the slider.                                                                                                                                                    |
| `min`              | `number`                                                               | `0`     | Minimum value of the slider.                                                                                                                                                    |
| `modelValue`       | `SliderValue \| undefined`                                             | `—`     | Controlled value for v-model.                                                                                                                                                   |
| `railStyle`        | `StyleValue`                                                           | `—`     | Style for slide rail                                                                                                                                                            |
| `range`            | `boolean`                                                              | `false` | Toggle whether it is allow to move slider from both sides                                                                                                                       |
| `showArrow`        | `boolean`                                                              | `true`  | whether the tooltip has an arrow                                                                                                                                                |
| `showBoundary`     | `boolean`                                                              | `false` | Toggle whether show max/min value when hover                                                                                                                                    |
| `showMarkLabel`    | `boolean`                                                              | `true`  | Whether to show the label                                                                                                                                                       |
| `step`             | `number`                                                               | `1`     | Increment between successive values                                                                                                                                             |
| `style`            | `StyleValue`                                                           | `—`     | Vue inline style.                                                                                                                                                               |
| `tipFormatter`     | `((value: string \| number \| boolean \| null) => VNodeChild) \| null` | `—`     | Format Tooltip content, by default display current value                                                                                                                        |
| `tooltipOnMark`    | `boolean`                                                              | `false` | Whether the mark on the slide rail has a tooltip                                                                                                                                |
| `tooltipVisible`   | `boolean \| undefined`                                                 | `—`     | Toggle whether to display tooltip all the time                                                                                                                                  |
| `value`            | `SliderValue \| undefined`                                             | `—`     | Set current value, used in controlled component                                                                                                                                 |
| `vertical`         | `boolean`                                                              | `false` | Toggle whether to display slider vertically                                                                                                                                     |
| `verticalReverse`  | `boolean`                                                              | `false` | Vertical but reverse direction                                                                                                                                                  |

### SliderHandleDot

| Property | Type     | Default | Description              |
| -------- | -------- | ------- | ------------------------ |
| `color`  | `string` | `—`     | Slider handle dot color. |
| `size`   | `string` | `—`     | Dot size, such as 4px.   |

### Events

#### Slider

| Event               | Payload              |
| ------------------- | -------------------- |
| `afterChange`       | `value: SliderValue` |
| `change`            | `value: SliderValue` |
| `mouseUp`           | `event: MouseEvent`  |
| `update:modelValue` | `value: SliderValue` |
| `update:value`      | `value: SliderValue` |

### Slots and types

SliderValue = number | number[]; SliderMarks = Record<number, string>. handleDot accepts one object or an array for the two handles. tipFormatter returns VNodeChild; null hides the tooltip.

Use kebab-case for camelCase events in templates, such as @enter-press, @number-change, @after-change and @input-change. keydown, keypress and keyup remain lowercase. Use native Vue class and style.

## RTL/LTR

- Slider supports RTL for horizontal direction. You can enable it by setting `direction="rtl"` via [ConfigProvider](/en-us/components/config-provider/).
- In RTL mode, the minimum value of the horizontal slider is on the right side and the maximum value is on the left side. The drag direction is reversed compared to LTR.
- Vertical direction (`vertical`) is not affected by RTL.
- In RTL mode, keyboard arrow keys behavior is mirrored: `Left Arrow`/`Down Arrow` increases the value, `Right Arrow`/`Up Arrow` decreases the value.

## Accessibility

### ARIA

- The element serving as the focusable slider control has `role` 'slider'.
- The slider element has the `aria-valuenow` property set to a decimal value representing the current value of the slider.
- The slider element has the `aria-valuemin` property set to a decimal value representing the minimum allowed value of the slider.
- The slider element has the `aria-valuemax` property set to a decimal value representing the maximum allowed value of the slider.
- If the slider is vertically oriented, it has `aria-orientation` set to vertical.
- If the value of `aria-valuenow` is not user-friendly, e.g., the day of the week is represented by a number, support setting API `aria-valuetext` property to a string that makes the slider value understandable, e.g., "Monday". And you can use API `getAriaValueText(value, index)` to specify `aria-valuetext`.
- Supporting API `aria-label` `aria-labelledby` to specify Slider label.

### Keyboard and Focus

- The slider of Slider can get the focus and display the prompt information of the current slider, and this information needs to be read by assistive technology.
- When the user uses the `range` API, you can use `Tab` and `Shift` + `Tab` to switch the focus of the left and right sliders.
- Keyboard users can use `Up Arrow` or `Right Arrow` to increase the slider value, `Down Arrow` or `Left Arrow` to decrease the slider value.
- If you want the slider to change more than the step size， Slider supports 10*step changes:
  - Windows users： `Page Up` for increasing, `Page Down` for decreasing;
  - Mac users：`Fn` + `Up Arrow` for increasing, `Fn` + `Down Arrow` for decreasing;
  - When the user uses the `range` property, the Page Up key of the previous slider is only supported until it meets the next slider, and then using the Page Up key on the previous slider will not respond. The same is true for the latter slider. After encountering, there is no response to the Page Down key.
- To move the slider to the minimum value of the slider:
  - Windows users: `Home`;
  - Mac users: `Fn` + `left arrow`;
  - When the user uses the `range` property, the `Home`(`Fn` + `left arrow`) button of the latter slider only supports until it meets the previous slider, and the `Home`(`Fn` + `left arrow`) button is unresponsive after the overlap.
- To move the slider to the maximum value of the slider:
  - Windows users: `End`;
  - Mac users: `Fn` + `right arrow`;
  - When the user uses the `range` property, the `End`(`Fn` + `right arrow`) key of the previous slider is only supported until it meets the next slider, and the `End`(`Fn` + `right arrow`) key is unresponsive after the overlap.

## Design Tokens

### Focus Style Variables

The Slider component has two focus-related design tokens, each corresponding to different interaction scenarios:

| Token Name                   | CSS Variable                        | Trigger Scenario                | Description                                                                        |
| ---------------------------- | ----------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------- |
| Handle outline - focus       | `--semi-color-primary-light-active` | Keyboard navigation (Tab focus) | Uses `:focus-visible` pseudo-class, displays outline only on keyboard focus        |
| Handle border color - active | `--semi-color-focus-border`         | Mouse click/drag                | Uses `.semi-slider-handle-clicked` class, displays border during mouse interaction |

If you want to modify the focus style of the handle in theme configuration, please note that these two variables correspond to different interaction scenarios.

::token-table{component="slider"}
::

## React → Vue migration

| React                           | Vue                                                                    |
| ------------------------------- | ---------------------------------------------------------------------- |
| `@douyinfe/semi-ui`             | `@aifuxi/semi-ui-vue/slider` + `@aifuxi/semi-theme-default/slider.css` |
| `value` + `onChange`            | `v-model` / `v-model:value` / `:value` + `@change`                     |
| `defaultValue`                  | `default-value`                                                        |
| `useState` / `useMemo`          | `shallowRef` / `computed`                                              |
| `className` / `style={{ ... }}` | `class` / `:style="{ ... }"`                                           |

## FAQ

### Why does the controlled demo return to its previous position?

The demo intentionally updates value only through its button and does not write drag changes back. Use v-model or write back from @change for interactive controlled sliders. When both modelValue and value are explicitly provided, modelValue takes precedence; use one controlled entry.

### How can tooltips be hidden?

Pass :tip-formatter="null". Use getAriaValueText for an accessible value description rather than relying on Tooltip text.
