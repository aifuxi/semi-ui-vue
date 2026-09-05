---
title: 'Rating'
description: 'Ratings provide insight regarding others’ opinions and experiences with a product.'
locale: 'en-US'
slug: 'rating'
category: 'input'
order: 45
englishTitle: 'Rating'
icon: 'doc-rating'
upstream: 'input/rating'
---

## Demos

### How to import

```ts
import { Rating } from '@aifuxi/semi-ui-vue/rating';
import '@aifuxi/semi-theme-default/rating.css';
```

### Basic Usage

Support two sizes: `default`, `small`.

Supports customized size if pass in a number. Refer to [Customize](#customize)

::demo-block{demo="rating/en-us/Basic" title="Basic Usage"}
::

### Half Star

Use `allowHalf` to support selection of half stars. Support to **display** decimals ratings other than 0.5.

::demo-block{demo="rating/en-us/Half" title="Half Star"}
::

### Disabled

Use `disabled` to disabled interaction.

::demo-block{demo="rating/en-us/Disabled" title="Disabled"}
::

### Click to Clear

`allowClear` Property allows you to clear the value when you click on the component again. By default it is set to `true`.

::demo-block{demo="rating/en-us/Clear" title="Click to Clear"}
::

### Text Description

Use `tooltips` to add description to Rating. When importing styles individually, also import `@aifuxi/semi-theme-default/tooltip.css`.

::demo-block{demo="rating/en-us/Tooltips" title="Text Description"}
::

### Customize

You can customize characters, numbers of rating and size.

> Note that customized size could only work with customized characters.

::demo-block{demo="rating/en-us/Custom" title="Customize"}
::

## API Reference

### Rating

| Property           | Type                             | Default         | Description                                                                    |
| ------------------ | -------------------------------- | --------------- | ------------------------------------------------------------------------------ |
| `ariaDescribedby`  | `string`                         | `—`             | Description element ids; use aria-describedby in templates.                    |
| `ariaErrormessage` | `string`                         | `—`             | Error message element id.                                                      |
| `ariaInvalid`      | `boolean`                        | `—`             | ARIA invalid state.                                                            |
| `ariaLabel`        | `string`                         | `—`             | Accessible label; use aria-label in templates.                                 |
| `ariaLabelledby`   | `string`                         | `—`             | Label element ids; use aria-labelledby in templates.                           |
| `ariaRequired`     | `boolean`                        | `—`             | ARIA required state.                                                           |
| `allowClear`       | `boolean`                        | `true`          | Clear when the current value is selected again.                                |
| `allowHalf`        | `boolean`                        | `false`         | Interact in half-star steps and display arbitrary fractional fills.            |
| `autoFocus`        | `boolean`                        | `false`         | Focus after mounting.                                                          |
| `character`        | `VNodeChild`                     | `—`             | Custom character, defaulting to a star icon; supports #character.              |
| `className`        | `HTMLAttributes['class']`        | `—`             | Compatibility className; prefer class in Vue templates.                        |
| `count`            | `number`                         | `5`             | Total rating items.                                                            |
| `defaultValue`     | `number`                         | `0`             | Initial uncontrolled value.                                                    |
| `disabled`         | `boolean`                        | `false`         | Disable interaction and focus; a Group disables every item.                    |
| `id`               | `string`                         | `—`             | Component element id.                                                          |
| `modelValue`       | `number \| undefined`            | `—`             | Controlled value for default v-model; explicit checked/value takes precedence. |
| `prefixCls`        | `string`                         | `'semi-rating'` | CSS class prefix; custom prefixes require matching styles.                     |
| `preventScroll`    | `boolean`                        | `—`             | Prevent scrolling when focusing.                                               |
| `size`             | `'small' \| 'default' \| number` | `'default'`     | Preset size, or a custom numeric size for Rating.                              |
| `style`            | `StyleValue`                     | `—`             | Vue inline style.                                                              |
| `tabIndex`         | `number`                         | `-1`            | Container tab order; disabled controls are not keyboard focus targets.         |
| `tooltips`         | `string[]`                       | `—`             | Tooltip text for each rating item.                                             |
| `value`            | `number \| undefined`            | `—`             | Controlled value or option identity; see the state contract below.             |

### Events and slots

`change(value: number)`, `update:value(value: number)`, `update:modelValue(value: number)`, `hoverChange(value: number | undefined)`, `focus(event: FocusEvent)`, `blur(event: FocusEvent)`, `keyDown(event: KeyboardEvent)`.

Use @hover-change and @key-down in templates. hoverChange is undefined on pointer leave. The #character slot supplies a custom icon.

Use native Vue class and style. ARIA props use camelCase in types and aria-label, aria-labelledby, aria-describedby, etc. in templates.

Rating currently renders label, labelledby and describedby on its root; declared invalid, errormessage and required props are not rendered there.

## Methods

Call focus() and blur() through a template ref.

Although click is declared in RatingEmits, the current Vue and pinned upstream rating click paths do not dispatch that callback; use @change to observe value changes.

Event order: a change emits `change`, followed by `update:modelValue`, `update:value`.

## Accessibility

### ARIA

- Rating has `aria-checked` to indicate whether it is currently selected, `aria-posinset` to indicate the position in the list, and `aria-setsize` to indicate the length of the list.
- Semi supports custom Rating semantics
  - Users can use `aria-label` to customize the semantics of Rating;
  - If the type of `character` passed in by the user is string, this string will be used for the semantics of Rating;
  - `aria-label` has higher priority than string type `character`.

### Keyboard and Focus

- Initial focus settings for Rating:
  - If there is a selection item in Rating, the initial focus should be set to the last selection item (for example: if 3 🌟 are lit, the initial focus is set on the third lit 🌟);
  - If there is no option for Rating, the initial focus should be on the entire Rating.
- On a Rating group, you can use the `right arrow` or `up arrow` to select the next focus item of the current focus, and the `left arrow` or `down arrow` to select the previous focus item of the current focus;
  - The user sets the `allowHalf` property, and presses the arrow keys to select or deselect only half a star;
- A disabled Rating cannot get the focus.

In RTL the increment and decrement directions are reversed. Increasing past count wraps to 0; decreasing below 0 wraps to count. At zero, an invisible empty item holds the roving focus.

## Design Tokens

::token-table{component="rating"}
::

## React → Vue migration

| React                                        | Vue                                                                    |
| -------------------------------------------- | ---------------------------------------------------------------------- |
| `import { Rating } from '@douyinfe/semi-ui'` | `@aifuxi/semi-ui-vue/rating` + `@aifuxi/semi-theme-default/rating.css` |
| `useState` / `setState`                      | `shallowRef` / `computed`                                              |
| `className` / `style={{ ... }}`              | `class` / `:style="{ ... }"`                                           |
| `value` + `onChange`                         | `v-model` / `v-model:value` / `:value` + `@change`                     |
| `character={<IconLikeHeart />}`              | `#character` slot                                                      |
| `onHoverChange` / `onKeyDown`                | `@hover-change` / `@key-down`                                          |
| `ref.current.focus()` / `.blur()`            | `focus()` / `blur()` on a template ref                                 |

## FAQ

### Why does a numeric size not resize the default star as expected?

Use numeric size with a custom character and set its icon font-size. allowHalf uses 0.5 interaction steps while a disabled fractional value can still display a 3.65 fill.

### Why does a bound checked/value not change on click?

Controlled components request a change and require the parent to write the next value back. Prefer v-model. With @change, Checkbox/Radio emit event objects while Switch/Rating emit direct values. Defaults apply only at initialization.
