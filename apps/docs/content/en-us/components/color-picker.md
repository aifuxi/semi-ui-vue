---
title: 'ColorPicker'
description: 'Quickly and easily select colors, and provide a dropper tool to pick colors'
locale: 'en-US'
slug: 'color-picker'
category: 'input'
order: 38
englishTitle: 'ColorPicker'
icon: 'doc-colorPlatteNew'
upstream: 'input/colorpicker'
---

## Demos

### How to import

ColorPicker component supported from v2.64.0

```ts
import { ColorPicker } from '@aifuxi/semi-ui-vue/color-picker';
import '@aifuxi/semi-theme-default/color-picker.css';
```

### Basic Use

#### In portal

::demo-block{demo="color-picker/en-us/Popover" title="In portal"}
::

#### Normal display

::demo-block{demo="color-picker/en-us/Basic" title="Normal display"}
::

### Eyedropper Color Picker

Use `:eye-dropper="true"` to enable the eyedropper function, which supports picking colors from the browser or external software screen.

> **Notes**
>
> To enable this function, the current web page must be deployed in a secure context such as HTTPS or localhost domain name, otherwise it will have no effect. The user's browser version must be Chromium > 95

::demo-block{demo="color-picker/en-us/EyeDropper" title="Eyedropper Color Picker"}
::

### Default Value

When converting between various color representation formats, there are theoretical errors between some formats, so the value returned to you by @change is an object containing color values ​​in three formats: hsva, hex, and rgba.

The defaultValue (uncontrolled) and value (controlled) you pass in should also be objects containing the same three formats.

We provide a static tool function `colorStringToValue` on the component class to convert common color strings to this object, supporting direct passing of strings such as rgb(57,197,187) #39c5bb and hsv(176,71,77).

::demo-block{demo="color-picker/en-us/DefaultValue" title="Default Value"}
::

### Controlled

Controlled use by passing in value

::demo-block{demo="color-picker/en-us/Controlled" title="Controlled"}
::

### Rendering additional elements at the top and bottom

Use `topSlot` and `bottomSlot` to render additional elements at the top and bottom

::demo-block{demo="color-picker/en-us/Slots" title="Rendering additional elements at the top and bottom"}
::

## API Reference

### ColorPickerProps

| Property        | Type                      | Default                | Description                                                           |
| --------------- | ------------------------- | ---------------------- | --------------------------------------------------------------------- |
| `alpha`         | `boolean`                 | `true`                 | Whether to enable transparency selection                              |
| `bottomSlot`    | `VNodeChild`              | `—`                    | Extra bottom content, also available through the bottom slot.         |
| `class`         | `HTMLAttributes['class']` | `—`                    | Vue class binding.                                                    |
| `className`     | `HTMLAttributes['class']` | `—`                    | Class name                                                            |
| `defaultFormat` | `ColorPickerFormat`       | `'hex'`                | Default format for manual input                                       |
| `defaultValue`  | `ColorValue`              | `#39c5bb (ColorValue)` | Initial uncontrolled value; use v-model for subsequent changes.       |
| `eyeDropper`    | `boolean`                 | `true`                 | Whether to enable the eyedropper color picker                         |
| `height`        | `number`                  | `280`                  | Color panel height in pixels.                                         |
| `modelValue`    | `ColorValue`              | `—`                    | Two-way binding via v-model; do not also supply value.                |
| `popoverProps`  | `PopoverProps`            | `{}`                   | Popover configuration when usePopover is true.                        |
| `style`         | `StyleValue`              | `—`                    | Vue style object or array.                                            |
| `topSlot`       | `VNodeChild`              | `—`                    | Extra top content, also available through the top slot.               |
| `usePopover`    | `boolean`                 | `false`                | Whether to put in Popover rendering                                   |
| `value`         | `ColorValue`              | `—`                    | Controlled value; v-model:value synchronizes it through update:value. |
| `width`         | `number`                  | `280`                  | Color panel width in pixels.                                          |

`—` means no independent default. Standard class / style support Vue bindings; Boolean defaults follow the current implementation.

### Events

| Event               | Payload               | Description                                   |
| ------------------- | --------------------- | --------------------------------------------- |
| `change`            | `[value: ColorValue]` | The value changed through selection or input. |
| `update:modelValue` | `[value: ColorValue]` | Synchronize v-model.                          |
| `update:value`      | `[value: ColorValue]` | Synchronize v-model:value.                    |

Listen with @change; use v-model or v-model:value for two-way value binding.

### Slots

| Slot       | Signature          | Description                              |
| ---------- | ------------------ | ---------------------------------------- |
| `#bottom`  | `() => VNodeChild` | Panel bottom content.                    |
| `#default` | `() => VNodeChild` | Trigger content when usePopover is true. |
| `#top`     | `() => VNodeChild` | Panel top content.                       |

## Methods

Color conversion is a public module function and a static method. The component has no public instance methods.

```ts
import { ColorPicker, colorStringToValue } from '@aifuxi/semi-ui-vue/color-picker';
const value = colorStringToValue('#39c5bb');
const sameValue = ColorPicker.colorStringToValue('#39c5bb');
```

## Type definitions

```ts
export interface HsvColor {
  h: number;
  s: number;
  v: number;
}

export interface HsvaColor extends HsvColor {
  a: number;
}

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface RgbaColor extends RgbColor {
  a: number;
}

export interface HslColor {
  h: number;
  s: number;
  l: number;
}

export interface HslaColor extends HslColor {
  a: number;
}

export type ObjectColor = RgbColor | HslColor | HsvColor | RgbaColor | HslaColor | HsvaColor;

export type AnyColor = string | ObjectColor;

export interface ColorModel<T extends AnyColor> {
  defaultColor: T;
  toHsva(defaultColor: T): HsvaColor;
  fromHsva(hsva: HsvaColor): T;
  equal(first: T, second: T): boolean;
}

export interface ColorValue {
  hsva: HsvaColor;
  rgba: RgbaColor;
  hex: string;
}

export type ColorPickerFormat = 'hex' | 'rgba' | 'hsva';
```

## Accessibility

### ARIA, keyboard and focus

Color and alpha areas provide aria-label and aria-valuetext. Hue, color and alpha drag areas currently have neither a slider role nor an arrow-key adjustment contract. The format Select and numeric inputs are reachable with Tab; provide a clearly labeled color text input and validation when complete keyboard entry is required.

The eye dropper requires browser EyeDropper support and user activation. Cancellation is not a color change. Use a named button for a custom Popover trigger.

## Design Tokens

::token-table{component="colorPicker"}
::

## FAQ

### How can a color string initialize the value?

Use the public colorStringToValue(raw), or ColorPicker.colorStringToValue(raw), to produce a ColorValue containing hsva, rgba and hex.

### Does hiding alpha change the value shape?

alpha=false hides the alpha control. change still returns a complete ColorValue, not a string.

### Why is the eye dropper unavailable?

eyeDropper is a feature switch; actual availability depends on the browser EyeDropper API, user activation and runtime environment. Static compilation cannot verify sampling.

## React → Vue migration

| React                                 | Vue                                                                                |
| ------------------------------------- | ---------------------------------------------------------------------------------- |
| `@douyinfe/semi-ui`                   | `@aifuxi/semi-ui-vue/color-picker` + `@aifuxi/semi-theme-default/color-picker.css` |
| `useState` / `useMemo`                | `ref` / `shallowRef` / `computed`                                                  |
| `value` + `onChange`                  | `v-model` / `v-model:value` / `:value` + `@change`                                 |
| `className` / `ReactNode`             | Vue `class` / `VNodeChild` and slots                                               |
| `children`                            | Default slot as the Popover trigger                                                |
| `topSlot` / `bottomSlot`              | `#top` / `#bottom`                                                                 |
| `ColorPicker.colorStringToValue(raw)` | Static method retained; colorStringToValue can also be imported directly           |
