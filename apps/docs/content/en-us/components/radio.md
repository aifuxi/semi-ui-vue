---
title: 'Radio'
description: 'Radio component allows the user to select one option from a relative small set.'
locale: 'en-US'
slug: 'radio'
category: 'input'
order: 44
englishTitle: 'Radio'
icon: 'doc-radio'
upstream: 'input/radio'
---

## When to use

- Used to select a single state among multiple options.
- The difference from Select is that all available options in Radio are visible by default, making it easier for users to choose in comparison, so there should not be too many options.

## Demos

### How to import

```ts
import { Radio, RadioGroup } from '@aifuxi/semi-ui-vue/radio';
import '@aifuxi/semi-theme-default/radio.css';
```

### Basic Usage

::demo-block{demo="radio/en-us/Basic" title="Basic Usage"}
::

### Extra Info

You can use `extra` to add extra information, which can be any type of VNodeChild.

::demo-block{demo="radio/en-us/Extra" title="Extra Info"}
::

### Disabled

::demo-block{demo="radio/en-us/Disabled" title="Disabled"}
::

### Advanced Mode

You can set `mode='advanced'` to allow options be able to unchecked when clicked again.

::demo-block{demo="radio/en-us/Advanced" title="Advanced Mode"}
::

### Mutually Exclusive Set

You can use `RadioGroup` to create a set of mutually exclusive options.

::demo-block{demo="radio/en-us/Group" title="Mutually Exclusive Set"}
::

### vertical arrangement

The radio elements in the group can be arranged horizontally or vertically by setting the `direction` property to the RadioGroup

::demo-block{demo="radio/en-us/Vertical" title="vertical arrangement"}
::

### Button Style

You can use `type='button'` to set the button style type radio, and the button type radio supports three sizes.

It should be noted that the button type radio selector does not support auxiliary text (`extra`) and vertical arrangement (`direction='vertical'`).

::demo-block{demo="radio/en-us/Button" title="Button Style"}
::

### Card Style

You can set `type='card'` to `RadioGroup` to achieve card style with background.

::demo-block{demo="radio/en-us/Card" title="Card Style"}
::

### Pure Card Style

You can set `type='pureCard'` to `RadioGroup` to achieve a pure card style with background and no radio.

::demo-block{demo="radio/en-us/PureCard" title="Pure Card Style"}
::

### Options Configuration

You can pass an array of options to `RadioGroup` using `options` property to create a set.

::demo-block{demo="radio/en-us/Options" title="Options Configuration"}
::

## API Reference

### Radio

| Property         | Type                                            | Default     | Description                                                                    |
| ---------------- | ----------------------------------------------- | ----------- | ------------------------------------------------------------------------------ |
| `addonClassName` | `string`                                        | `—`         | Label content wrapper class.                                                   |
| `addonId`        | `string`                                        | `—`         | Label wrapper id, generated when omitted.                                      |
| `addonStyle`     | `CSSProperties`                                 | `—`         | Label content wrapper inline style.                                            |
| `ariaLabel`      | `string`                                        | `—`         | Accessible label; use aria-label in templates.                                 |
| `autoFocus`      | `boolean`                                       | `false`     | Focus after mounting.                                                          |
| `checked`        | `boolean \| undefined`                          | `—`         | Controlled checked state; the group value decides selection inside a Group.    |
| `className`      | `string`                                        | `—`         | Compatibility className; prefer class in Vue templates.                        |
| `defaultChecked` | `boolean`                                       | `false`     | Initial uncontrolled checked state.                                            |
| `disabled`       | `boolean`                                       | `false`     | Disable interaction and focus; a Group disables every item.                    |
| `displayMode`    | `'' \| 'vertical'`                              | `—`         | Content layout of a standalone Radio.                                          |
| `extra`          | `VNodeChild`                                    | `—`         | Supporting text, VNodeChild or #extra slot; hidden for button Radio.           |
| `extraId`        | `string`                                        | `—`         | Supporting text wrapper id, generated when omitted.                            |
| `mode`           | `'' \| 'advanced'`                              | `''`        | advanced allows a selected option to be cleared by clicking again.             |
| `modelValue`     | `boolean \| undefined`                          | `—`         | Controlled value for default v-model; explicit checked/value takes precedence. |
| `name`           | `string`                                        | `—`         | Native input name; give independent groups different names.                    |
| `prefixCls`      | `string`                                        | `—`         | CSS class prefix; custom prefixes require matching styles.                     |
| `preventScroll`  | `boolean`                                       | `—`         | Prevent scrolling when focusing.                                               |
| `style`          | `CSSProperties`                                 | `—`         | Vue inline style.                                                              |
| `type`           | `'default' \| 'button' \| 'card' \| 'pureCard'` | `'default'` | Visual variant; see the type union.                                            |
| `value`          | `string \| number \| boolean`                   | `—`         | Controlled value or option identity; see the state contract below.             |

### RadioGroup

| Property           | Type                                                      | Default        | Description                                                                    |
| ------------------ | --------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------ |
| `ariaDescribedby`  | `string`                                                  | `—`            | Description element ids; use aria-describedby in templates.                    |
| `ariaErrormessage` | `string`                                                  | `—`            | Error message element id.                                                      |
| `ariaInvalid`      | `boolean \| 'false' \| 'true' \| 'grammar' \| 'spelling'` | `—`            | ARIA invalid state.                                                            |
| `ariaLabel`        | `string`                                                  | `—`            | Accessible label; use aria-label in templates.                                 |
| `ariaLabelledby`   | `string`                                                  | `—`            | Label element ids; use aria-labelledby in templates.                           |
| `ariaRequired`     | `boolean \| 'false' \| 'true'`                            | `—`            | ARIA required state.                                                           |
| `buttonSize`       | `'small' \| 'middle' \| 'large'`                          | `'middle'`     | Size of button Radio items.                                                    |
| `className`        | `string`                                                  | `—`            | Compatibility className; prefer class in Vue templates.                        |
| `defaultValue`     | `string \| number \| boolean`                             | `—`            | Initial uncontrolled value.                                                    |
| `direction`        | `'horizontal' \| 'vertical'`                              | `'horizontal'` | Group layout; button Radio ignores vertical layout.                            |
| `disabled`         | `boolean`                                                 | `false`        | Disable interaction and focus; a Group disables every item.                    |
| `id`               | `string`                                                  | `—`            | Component element id.                                                          |
| `mode`             | `'' \| 'advanced'`                                        | `''`           | advanced allows a selected option to be cleared by clicking again.             |
| `modelValue`       | `string \| number \| boolean \| undefined`                | `—`            | Controlled value for default v-model; explicit checked/value takes precedence. |
| `name`             | `string`                                                  | `'default'`    | Native input name; give independent groups different names.                    |
| `options`          | `Array<string \| RadioOption>`                            | `—`            | Strings or option objects; takes precedence over the default slot.             |
| `prefixCls`        | `string`                                                  | `—`            | CSS class prefix; custom prefixes require matching styles.                     |
| `style`            | `CSSProperties`                                           | `—`            | Vue inline style.                                                              |
| `type`             | `'default' \| 'button' \| 'card' \| 'pureCard'`           | `'default'`    | Visual variant; see the type union.                                            |
| `value`            | `string \| number \| boolean \| undefined`                | `—`            | Controlled value or option identity; see the state contract below.             |

### RadioOption

| Property         | Type                          | Default | Description                                                          |
| ---------------- | ----------------------------- | ------- | -------------------------------------------------------------------- |
| `label`          | `VNodeChild`                  | `—`     | Displayed option content.                                            |
| `value`          | `string \| number \| boolean` | `—`     | Controlled value or option identity; see the state contract below.   |
| `disabled`       | `boolean`                     | `—`     | Disable interaction and focus; a Group disables every item.          |
| `extra`          | `VNodeChild`                  | `—`     | Supporting text, VNodeChild or #extra slot; hidden for button Radio. |
| `style`          | `CSSProperties`               | `—`     | Vue inline style.                                                    |
| `className`      | `string`                      | `—`     | Compatibility className; prefer class in Vue templates.              |
| `addonId`        | `string`                      | `—`     | Label wrapper id, generated when omitted.                            |
| `addonStyle`     | `CSSProperties`               | `—`     | Label content wrapper inline style.                                  |
| `addonClassName` | `string`                      | `—`     | Label content wrapper class.                                         |
| `extraId`        | `string`                      | `—`     | Supporting text wrapper id, generated when omitted.                  |

### Events and slots

`Radio`: `change(event: RadioChangeEvent)`, `update:checked(checked: boolean)`, `update:modelValue(checked: boolean)`.

`RadioGroup`: `change(event: RadioChangeEvent)`, `update:value(value)`, `update:modelValue(value)`.

The default slot supplies a label or group items; #extra supplies supporting content.

`Radio`: `mouseenter(event: MouseEvent)`, `mouseleave(event: MouseEvent)`.

The event exposes the next target.checked and option target.value, plus stopPropagation() and preventDefault(). Checkbox additionally provides nativeEvent.stopImmediatePropagation().

The Group controls item selection, so do not also set item checked. Checkbox joins a Group only when value is explicitly supplied. Clearing advanced Radio emits an undefined group value.

Use native Vue class and style. ARIA props use camelCase in types and aria-label, aria-labelledby, aria-describedby, etc. in templates.

## Methods

Call focus() and blur() through a template ref. Checkbox / Radio additionally expose a readonly input reference.

Event order: a change emits `change`, followed by `update:checked` (`update:value` for a Group), then `update:modelValue`.

Group notifications precede the Radio item notifications.

## Accessibility

### ARIA

- `aria-label`: used to explain the role of Radio or RadioGroup
- `aria-labelledby` points to the addon node, used to explain the content of Radio
- `aria-describedby` points to the extra node, which is used to explain the content of Radio

### Keyboard and focus

WAI-ARIA: https://www.w3.org/WAI/ARIA/apg/patterns/radiobutton/

- RadioGroup can be focused, the initial focus acquisition rules are as follows：
  - When there is no selected item in the RadioGroup, the initial focus is on the first Radio item;
  - When there are selected items in the RadioGroup, the initial focus is on the selected Radio item.
- For radios belonging to the same radiogroup:
  - You can use `Right arrow` or `Down arrow` to move the focus to the next Radio item, uncheck the previously focused Radio item, and select the currently focused Radio item;
  - You can Use `Left Arrow` or `Up Arrow` to move the focus to the previous Radio item, at the same time uncheck the previously focused Radio item, and select the currently focused Radio item.
- If there is no item selected in the RadioGroup, you can use the `Space` key to select the initial focus.

## Related Material

For related form compositions, see [Radio](/en-us/components/radio/), [Switch](/en-us/components/switch/) and [Form](/en-us/components/form/).

## Content Guidelines

- Capitalize the first letter
- No punctuation

## Design Tokens

::token-table{component="radio"}
::

## React → Vue migration

| React                                                   | Vue                                                                  |
| ------------------------------------------------------- | -------------------------------------------------------------------- |
| `import { Radio, RadioGroup } from '@douyinfe/semi-ui'` | `@aifuxi/semi-ui-vue/radio` + `@aifuxi/semi-theme-default/radio.css` |
| `useState` / `setState`                                 | `shallowRef` / `computed`                                            |
| `className` / `style={{ ... }}`                         | `class` / `:style="{ ... }"`                                         |
| `checked` + `onChange`                                  | `v-model` / `v-model:checked` / `:checked` + `@change`               |
| `defaultChecked`                                        | `default-checked`                                                    |
| `Radio.Group`                                           | `RadioGroup`                                                         |
| Group `value` + `onChange`                              | `v-model` / `v-model:value` / `:value` + `@change`                   |
| `children` / `extra={<Node />}`                         | default slot / `#extra` slot                                         |
| `ref.current.focus()` / `.blur()`                       | `focus()` / `blur()` on a template ref                               |

## FAQ

### Why does clicking again not clear selection?

Normal Radio uses mutually exclusive native radio inputs. Set mode="advanced" to permit clearing; a cleared group emits undefined. Give independent groups different names to avoid native input interference.

### Why does a bound checked/value not change on click?

Controlled components request a change and require the parent to write the next value back. Prefer v-model. With @change, Checkbox/Radio emit event objects while Switch/Rating emit direct values. Defaults apply only at initialization.
