---
title: 'Switch'
description: 'Switch is an interactive form used to switch two mutually exclusive states.'
locale: 'en-US'
slug: 'switch'
category: 'input'
order: 48
englishTitle: 'Switch'
icon: 'doc-switch'
upstream: 'input/switch'
---

## Demos

### How to import

```ts
import { Switch } from '@aifuxi/semi-ui-vue/switch';
import '@aifuxi/semi-theme-default/switch.css';
```

### Basic Usage

You can monitor state changes through `@change`, and set the selected state through `defaultChecked` or controlled `checked`.  
Use `aria-label` to describe the specific function of the Switch

::demo-block{demo="switch/en-us/Basic" title="Basic Usage"}
::

### Size

::demo-block{demo="switch/en-us/Size" title="Size"}
::

### Disabled

::demo-block{demo="switch/en-us/Disabled" title="Disabled"}
::

### With text

Can pass `checkedText` with `uncheckedText` Text when setting the switch  
The long text is recommended to be placed directly on the outside.  
Note: This does not work with the smallest switch (size = 'small')

::demo-block{demo="switch/en-us/Text" title="With text"}
::

Compared to setting the embedded text through checkedText and uncheckedText, we recommend placing the text description outside the Switch

::demo-block{demo="switch/en-us/ExternalText" title="With text"}
::

### Controlled component

Whether the component is selected depends entirely on the incoming checked value, used with `@change`

::demo-block{demo="switch/en-us/Controlled" title="Controlled component"}
::

### loading

You can turn on the loading state by setting `:loading="true"`.

::demo-block{demo="switch/en-us/Loading" title="loading"}
::

## API Reference

### Switch

| Property           | Type                                                                   | Default     | Description                                                                    |
| ------------------ | ---------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------ |
| `ariaLabel`        | `string`                                                               | `—`         | Accessible label; use aria-label in templates.                                 |
| `ariaDescribedby`  | `string`                                                               | `—`         | Description element ids; use aria-describedby in templates.                    |
| `ariaErrormessage` | `string`                                                               | `—`         | Error message element id.                                                      |
| `ariaInvalid`      | `boolean \| 'false' \| 'true' \| 'grammar' \| 'spelling' \| undefined` | `—`         | ARIA invalid state.                                                            |
| `ariaLabelledby`   | `string`                                                               | `—`         | Label element ids; use aria-labelledby in templates.                           |
| `checked`          | `boolean \| undefined`                                                 | `—`         | Controlled checked state; the group value decides selection inside a Group.    |
| `modelValue`       | `boolean \| undefined`                                                 | `—`         | Controlled value for default v-model; explicit checked/value takes precedence. |
| `defaultChecked`   | `boolean \| undefined`                                                 | `false`     | Initial uncontrolled checked state.                                            |
| `disabled`         | `boolean`                                                              | `false`     | Disable interaction and focus; a Group disables every item.                    |
| `loading`          | `boolean`                                                              | `false`     | Show a spinner and disable native input interaction.                           |
| `size`             | `'large' \| 'default' \| 'small'`                                      | `'default'` | Preset size, or a custom numeric size for Rating.                              |
| `checkedText`      | `VNodeChild`                                                           | `—`         | Content shown when on, hidden for small; supports #checkedText.                |
| `uncheckedText`    | `VNodeChild`                                                           | `—`         | Content shown when off, hidden for small; supports #uncheckedText.             |
| `id`               | `string`                                                               | `—`         | Component element id.                                                          |

### Events and slots

`change(checked: boolean, event: Event)`, `update:checked(checked: boolean)`, `update:modelValue(checked: boolean)`.

Slots: #checkedText and #uncheckedText; both are hidden for small. Use @mouseenter / @mouseleave on the wrapper.

Use native Vue class and style. ARIA props use camelCase in types and aria-label, aria-labelledby, aria-describedby, etc. in templates.

Event order: a change emits `change`, followed by `update:checked`, then `update:modelValue`.

## Accessibility

### ARIA

- Switch has a `switch` role, when checked is true, `aria-checked` will be automatically set to true, and vice versa.
- As a form field, it should have a Label, which will be automatically brought on when you use Form.Switch.
- If you use Switch alone, it is recommended to use `aria-label` to describe the current label function.

### Keyboard and Focus

- Keyboard users can use `Tab` and `Shift + Tab` to switch focus.
- When focusing, you can switch on or off by pressing the `Space` key.

## Content Guidelines

- Switch description
  - First letter is capitalized, no punctuation is required
  - Indirectly and explicitly state whether the setting is on or off
  - If needed, explain to the user what the on and off states represent

## Design Tokens

::token-table{component="switch"}
::

## React → Vue migration

| React                                        | Vue                                                                    |
| -------------------------------------------- | ---------------------------------------------------------------------- |
| `import { Switch } from '@douyinfe/semi-ui'` | `@aifuxi/semi-ui-vue/switch` + `@aifuxi/semi-theme-default/switch.css` |
| `useState` / `setState`                      | `shallowRef` / `computed`                                              |
| `className` / `style={{ ... }}`              | `class` / `:style="{ ... }"`                                           |
| `checked` + `onChange`                       | `v-model` / `v-model:checked` / `:checked` + `@change`                 |
| `defaultChecked`                             | `default-checked`                                                      |
| `checkedText` / `uncheckedText` React nodes  | `#checkedText` / `#uncheckedText` slots                                |

## FAQ

### Why is text hidden on small switches?

The pinned source displays checkedText / uncheckedText only at default and large sizes. Put longer text outside and associate it through aria-labelledby or aria-label.

### Why does a bound checked/value not change on click?

Controlled components request a change and require the parent to write the next value back. Prefer v-model. With @change, Checkbox/Radio emit event objects while Switch/Rating emit direct values. Defaults apply only at initialization.
