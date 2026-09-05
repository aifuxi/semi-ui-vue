---
title: 'Checkbox'
description: 'Checkboxes allow the user to select one or more items from a set.'
locale: 'en-US'
slug: 'checkbox'
category: 'input'
order: 37
englishTitle: 'Checkbox'
icon: 'doc-checkbox'
upstream: 'input/checkbox'
---

## When to use

- When making multiple choices in a set of options;
- Use independently to select from different states, similar to the Switch component. The difference is that switching the Switch triggers a state change directly, while Checkbox is generally used for tagging status and works with the submission.

## Demos

### How to import

```ts
import { Checkbox, CheckboxGroup } from '@aifuxi/semi-ui-vue/checkbox';
import '@aifuxi/semi-theme-default/checkbox.css';
```

### Basic Usage

When the Checkbox is used individually, you can control whether to check it through the `defaultChecked` and `checked` attributes.
When `checked` is passed in, it is controlled component.

::demo-block{demo="checkbox/en-us/Basic" title="Basic Usage"}
::

::demo-block{demo="checkbox/en-us/DefaultChecked" title="Basic Usage"}
::

You can use `extra` to add extra information. The extra information usually is longer and even has line changes.

::demo-block{demo="checkbox/en-us/Extra" title="Basic Usage"}
::

### Disabled

::demo-block{demo="checkbox/en-us/Disabled" title="Disabled"}
::

### Checkbox Group in templates

By placing the Checkbox element inside the CheckboxGroup, you can declare the Checkbox group
Using the Checkbox group, you can more conveniently control the selection of a group of Checkboxes through the `defaultValue` and `value` properties of the CheckboxGroup
At this time, Checkbox does not need to declare `defaultChecked` and `checked` attributes

::demo-block{demo="checkbox/en-us/Group" title="Checkbox Group in templates"}
::

### Checkbox Group in options

You can pass an array using `options` to `CheckboxGroup` directly to generate a set of checkboxs.

::demo-block{demo="checkbox/en-us/Options" title="Checkbox Group in options"}
::

### Layout Direction

By setting `direction` to `horizontal` or `vertical`, You can adjust the layout within the Checkbox Group.

::demo-block{demo="checkbox/en-us/Direction" title="Layout Direction"}
::

### Controlled Component

Used as a controlled component.

::demo-block{demo="checkbox/en-us/Controlled" title="Controlled Component"}
::

### Checkbox State

You may use the `indeterminate` property to set the state to indeterminate.

::demo-block{demo="checkbox/en-us/CheckAll" title="Checkbox State"}
::

### Card Style

You can set `type='card'` to CheckboxGroup to realize card style with background.

::demo-block{demo="checkbox/en-us/Card" title="Card Style"}
::

### Pure Card Style

You can set `type='pureCard'` to CheckboxGroup to realize a pure card style with background and no checkbox.

::demo-block{demo="checkbox/en-us/PureCard" title="Pure Card Style"}
::

### Using with Grid

Use `Checkbox.Group` with `Grid` to achieve flexible layouts.

::demo-block{demo="checkbox/en-us/Grid" title="Using with Grid"}
::

## API Reference

### Checkbox

| Property           | Type                                                      | Default     | Description                                                                    |
| ------------------ | --------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------ |
| `ariaDescribedby`  | `string`                                                  | `—`         | Description element ids; use aria-describedby in templates.                    |
| `ariaErrormessage` | `string`                                                  | `—`         | Error message element id.                                                      |
| `ariaInvalid`      | `boolean \| 'false' \| 'true' \| 'grammar' \| 'spelling'` | `—`         | ARIA invalid state.                                                            |
| `ariaLabel`        | `string`                                                  | `—`         | Accessible label; use aria-label in templates.                                 |
| `ariaLabelledby`   | `string`                                                  | `—`         | Label element ids; use aria-labelledby in templates.                           |
| `ariaRequired`     | `boolean \| 'false' \| 'true'`                            | `—`         | ARIA required state.                                                           |
| `addonId`          | `string`                                                  | `—`         | Label wrapper id, generated when omitted.                                      |
| `autoFocus`        | `boolean`                                                 | `false`     | Focus after mounting.                                                          |
| `checked`          | `boolean \| undefined`                                    | `—`         | Controlled checked state; the group value decides selection inside a Group.    |
| `modelValue`       | `boolean \| undefined`                                    | `—`         | Controlled value for default v-model; explicit checked/value takes precedence. |
| `defaultChecked`   | `boolean`                                                 | `false`     | Initial uncontrolled checked state.                                            |
| `disabled`         | `boolean`                                                 | `false`     | Disable interaction and focus; a Group disables every item.                    |
| `extra`            | `VNodeChild`                                              | `—`         | Supporting text, VNodeChild or #extra slot.                                    |
| `extraId`          | `string`                                                  | `—`         | Supporting text wrapper id, generated when omitted.                            |
| `id`               | `string`                                                  | `—`         | Component element id.                                                          |
| `indeterminate`    | `boolean`                                                 | `false`     | Show a partial selection; does not calculate group values.                     |
| `prefixCls`        | `string`                                                  | `—`         | CSS class prefix; custom prefixes require matching styles.                     |
| `preventScroll`    | `boolean`                                                 | `—`         | Prevent scrolling when focusing.                                               |
| `role`             | `string`                                                  | `—`         | Role of the outer Checkbox wrapper.                                            |
| `tabIndex`         | `number`                                                  | `—`         | Container tab order; disabled controls are not keyboard focus targets.         |
| `type`             | `'default' \| 'card' \| 'pureCard'`                       | `'default'` | Visual variant; see the type union.                                            |
| `value`            | `unknown`                                                 | `—`         | Controlled value or option identity; see the state contract below.             |
| `className`        | `string`                                                  | `—`         | Compatibility className; prefer class in Vue templates.                        |

### CheckboxGroup

| Property           | Type                                                      | Default      | Description                                                                    |
| ------------------ | --------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------ |
| `ariaDescribedby`  | `string`                                                  | `—`          | Description element ids; use aria-describedby in templates.                    |
| `ariaErrormessage` | `string`                                                  | `—`          | Error message element id.                                                      |
| `ariaInvalid`      | `boolean \| 'false' \| 'true' \| 'grammar' \| 'spelling'` | `—`          | ARIA invalid state.                                                            |
| `ariaLabel`        | `string`                                                  | `—`          | Accessible label; use aria-label in templates.                                 |
| `ariaLabelledby`   | `string`                                                  | `—`          | Label element ids; use aria-labelledby in templates.                           |
| `ariaRequired`     | `boolean \| 'false' \| 'true'`                            | `—`          | ARIA required state.                                                           |
| `defaultValue`     | `unknown[]`                                               | `[]`         | Initial uncontrolled value.                                                    |
| `direction`        | `'horizontal' \| 'vertical'`                              | `'vertical'` | Group layout; button Radio ignores vertical layout.                            |
| `disabled`         | `boolean`                                                 | `false`      | Disable interaction and focus; a Group disables every item.                    |
| `id`               | `string`                                                  | `—`          | Component element id.                                                          |
| `modelValue`       | `unknown[] \| undefined`                                  | `—`          | Controlled value for default v-model; explicit checked/value takes precedence. |
| `name`             | `string`                                                  | `'default'`  | Native input name; give independent groups different names.                    |
| `options`          | `Array<string \| CheckboxOption>`                         | `—`          | Strings or option objects; takes precedence over the default slot.             |
| `prefixCls`        | `string`                                                  | `—`          | CSS class prefix; custom prefixes require matching styles.                     |
| `type`             | `'default' \| 'card' \| 'pureCard'`                       | `'default'`  | Visual variant; see the type union.                                            |
| `value`            | `unknown[] \| undefined`                                  | `—`          | Controlled value or option identity; see the state contract below.             |

### CheckboxOption

| Property    | Type                                   | Default | Description                                                        |
| ----------- | -------------------------------------- | ------- | ------------------------------------------------------------------ |
| `label`     | `VNodeChild`                           | `—`     | Displayed option content.                                          |
| `value`     | `unknown`                              | `—`     | Controlled value or option identity; see the state contract below. |
| `disabled`  | `boolean`                              | `—`     | Disable interaction and focus; a Group disables every item.        |
| `extra`     | `VNodeChild`                           | `—`     | Supporting text, VNodeChild or #extra slot.                        |
| `className` | `string`                               | `—`     | Compatibility className; prefer class in Vue templates.            |
| `style`     | `CSSProperties`                        | `—`     | Vue inline style.                                                  |
| `@change`   | `(event: CheckboxChangeEvent) => void` | `—`     | Option change callback.                                            |

### Events and slots

`Checkbox`: `change(event: CheckboxChangeEvent)`, `update:checked(checked: boolean)`, `update:modelValue(checked: boolean)`.

`CheckboxGroup`: `change(value: unknown[])`, `update:value(value)`, `update:modelValue(value)`.

The default slot supplies a label or group items; #extra supplies supporting content.

The event exposes the next target.checked and option target.value, plus stopPropagation() and preventDefault(). Checkbox additionally provides nativeEvent.stopImmediatePropagation().

The Group controls item selection, so do not also set item checked. Checkbox joins a Group only when value is explicitly supplied. Clearing advanced Radio emits an undefined group value.

Use native Vue class and style. ARIA props use camelCase in types and aria-label, aria-labelledby, aria-describedby, etc. in templates.

Like upstream, CheckboxGroup forwards label, labelledby and describedby; invalid, errormessage and required are declared but are not rendered on the group root.

## Methods

Call focus() and blur() through a template ref. Checkbox / Radio additionally expose a readonly input reference.

Event order: a change emits `change`, followed by `update:checked` (`update:value` for a Group), then `update:modelValue`.

Checkbox item notifications precede Group notifications.

## Accessibility

### ARIA

- The role of Checkbox is `checkbox`, the role of CheckboxGroup is `list`, and its direct child element is `listitem`
- `aria-label`: When using the Checkbox alone, if default slot have no text, it is recommended to pass in the `aria-label` prop to describe the function of the Checkbox in one sentence, which will make the screen reader read out the content of this label. If you are using Form.Checkbox, you can use the label provided by Form without passing in `aria-label`
- `aria-labelledby` points to the `addon` node, used to explain the role of the current Checkbox
- `aria-describedby` points to the `extra` node, which is used to supplement the explanation of the current Checkbox
- `aria-disabled` indicates the current disabled state, which is consistent with the value of the `disabled` prop
- `aria-checked` indicates the current checked state

### Keyboard and focus

- Checkbox can be focused, keyboard users can use Tab and Shift + Tab to switch focus.
- The Checkbox that gets the focus can switch the selected and unselected states through Space.
- The click area of ​​Checkbox is larger than the box itself and contains the text behind the box; for checkboxes with auxiliary text, the auxiliary text is also included in the click area.
- Disabled Checkbox is not focusable.

## Content Guidelines

::demo-block{demo="checkbox/en-us/ContentGuidelines" title="Checkbox Content Demo"}
::

- Capitalize the first letter
- No punctuation

## Design Tokens

::token-table{component="checkbox"}
::

## Related Material

For related form compositions, see [Radio](/en-us/components/radio/), [Switch](/en-us/components/switch/) and [Form](/en-us/components/form/).

## React → Vue migration

| React                                                         | Vue                                                                        |
| ------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `import { Checkbox, CheckboxGroup } from '@douyinfe/semi-ui'` | `@aifuxi/semi-ui-vue/checkbox` + `@aifuxi/semi-theme-default/checkbox.css` |
| `useState` / `setState`                                       | `shallowRef` / `computed`                                                  |
| `className` / `style={{ ... }}`                               | `class` / `:style="{ ... }"`                                               |
| `checked` + `onChange`                                        | `v-model` / `v-model:checked` / `:checked` + `@change`                     |
| `defaultChecked`                                              | `default-checked`                                                          |
| `Checkbox.Group`                                              | `CheckboxGroup`                                                            |
| Group `value` + `onChange`                                    | `v-model` / `v-model:value` / `:value` + `@change`                         |
| `children` / `extra={<Node />}`                               | default slot / `#extra` slot                                               |
| `ref.current.focus()` / `.blur()`                             | `focus()` / `blur()` on a template ref                                     |

## FAQ

### Why does a check-all control need indeterminate?

It only presents a partial selection and does not modify group values. Derive all and partial selection from checkedList with computed to keep one source of truth.

### Why does a bound checked/value not change on click?

Controlled components request a change and require the parent to write the next value back. Prefer v-model. With @change, Checkbox/Radio emit event objects while Switch/Rating emit direct values. Defaults apply only at initialization.
