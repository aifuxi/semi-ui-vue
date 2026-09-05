---
title: 'AutoComplete'
description: 'The input box is automatically filled.'
locale: 'en-US'
slug: 'auto-complete'
category: 'input'
order: 35
englishTitle: 'AutoComplete'
icon: 'doc-autocomplete'
upstream: 'input/autocomplete'
---

## When to use

Used to provide input suggestions to the input box and perform automatic completion operations

The difference with the searchable Select component:

- AutoComplete is essentially an enhanced Input component that provides input suggestions, while Select is a selector
- When you click to expand, Select will clear all the values in the input box, and AutoComplete will keep the last selected value
- Select's selected item rendering (renderSelectedItem) can be more customized and can be any type of VNodeChild, while AutoComplete only allows strings

## Demos

### How to import

```ts
import { AutoComplete } from '@aifuxi/semi-ui-vue/auto-complete';
import '@aifuxi/semi-theme-default/auto-complete.css';
```

### Basic usage

Monitor user input through @search, pass input suggestions through data, and maintain control through @change. OnChange is triggered when the input box changes/selects an input item

::demo-block{demo="auto-complete/en-us/Basic" title="Basic usage"}
::

### Custom option rendering

When you need to customize the rendering of candidates, data can be passed in an array of objects (each Object must contain two keys, label and value, value is the value selected by the candidate, and label is the content displayed by the candidate)
The rendering of candidates can be customized through renderItem

::demo-block{demo="auto-complete/en-us/CustomOption" title="Custom option rendering"}
::

### Remote search

Get user input value from @search, update data value dynamically, update loading

::demo-block{demo="auto-complete/en-us/Remote" title="Remote search"}
::

### Size

The size of the input box can be set by setting size, optional `small`, `default` (default), `large`

::demo-block{demo="auto-complete/en-us/Size" title="Size"}
::

### The position of the drop-down menu

The position of the drop-down menu can be set by setting position, and the optional values refer to Tooltip position

::demo-block{demo="auto-complete/en-us/Position" title="The position of the drop-down menu"}
::

### Disabled

::demo-block{demo="auto-complete/en-us/Disabled" title="Disabled"}
::

### Validate status

Different verification states can be set to show different styles

::demo-block{demo="auto-complete/en-us/Validation" title="Validate status"}
::

### Custom empty content

Can set up custom display empty content

::demo-block{demo="auto-complete/en-us/Empty" title="Custom empty content"}
::

## API Reference

### AutoCompleteProps

| Property                   | Type                                                      | Default        | Description                                                                                                                                                                                                                            |
| -------------------------- | --------------------------------------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ariaDescribedby`          | `string`                                                  | `—`            | Description element ids.                                                                                                                                                                                                               |
| `ariaErrormessage`         | `string`                                                  | `—`            | Error message element id.                                                                                                                                                                                                              |
| `ariaInvalid`              | `boolean \| 'false' \| 'true' \| 'grammar' \| 'spelling'` | `—`            | ARIA invalid state.                                                                                                                                                                                                                    |
| `ariaLabel`                | `string`                                                  | `—`            | Accessible name; use aria-label in templates.                                                                                                                                                                                          |
| `ariaLabelledby`           | `string`                                                  | `—`            | Label element ids; use aria-labelledby in templates.                                                                                                                                                                                   |
| `ariaRequired`             | `boolean`                                                 | `—`            | ARIA required state.                                                                                                                                                                                                                   |
| `autoAdjustOverflow`       | `boolean`                                                 | `true`         | Whether to automatically adjust the direction when the floating layer is blocked                                                                                                                                                       |
| `autoFocus`                | `boolean`                                                 | `false`        | Whether to auto focus                                                                                                                                                                                                                  |
| `clearIcon`                | `VNodeChild`                                              | `—`            | Can be used to customize the clear button, valid when showClear is true                                                                                                                                                                |
| `data`                     | `AutoCompleteItem[]`                                      | `[]`           | The data source of the candidates, which can be a string array or an object array                                                                                                                                                      |
| `defaultActiveFirstOption` | `boolean`                                                 | `false`        | Whether to highlight the first option by default (press enter to select directly)                                                                                                                                                      |
| `defaultOpen`              | `boolean`                                                 | `false`        | Whether to expand the drop-down menu by default                                                                                                                                                                                        |
| `defaultValue`             | `AutoCompletePrimitive`                                   | `—`            | Defaults                                                                                                                                                                                                                               |
| `disabled`                 | `boolean`                                                 | `false`        | Whether to disable                                                                                                                                                                                                                     |
| `dropdownClassName`        | `HTMLAttributes['class']`                                 | `—`            | Css class name of the drop-down list                                                                                                                                                                                                   |
| `dropdownMatchSelectWidth` | `boolean`                                                 | `true`         | Match the dropdown minimum width to the control.                                                                                                                                                                                       |
| `dropdownStyle`            | `StyleValue`                                              | `—`            | Inline style of the drop-down list                                                                                                                                                                                                     |
| `emptyContent`             | `VNodeChild \| null`                                      | `null`         | Customize the drop-down content when data is empty                                                                                                                                                                                     |
| `getPopupContainer`        | `() => HTMLElement`                                       | `—`            | Specify the parent DOM, the floating layer of the drop-down list will be rendered into the DOM, and the customization needs to set `position: relative` This will change the DOM tree position, but not the view's rendering position. |
| `id`                       | `string`                                                  | `—`            | Component element id.                                                                                                                                                                                                                  |
| `insetLabel`               | `VNodeChild`                                              | `—`            | Inset label, also available as the insetLabel slot.                                                                                                                                                                                    |
| `insetLabelId`             | `string`                                                  | `—`            | Inset label element id.                                                                                                                                                                                                                |
| `loading`                  | `boolean`                                                 | `false`        | Whether the drop-down list shows loading animation                                                                                                                                                                                     |
| `maxHeight`                | `string \| number`                                        | `300`          | The maximum height of the drop-down list                                                                                                                                                                                               |
| `modelValue`               | `AutoCompleteModelValue`                                  | `—`            | Controlled value for v-model.                                                                                                                                                                                                          |
| `motion`                   | `boolean`                                                 | `true`         | Is there an animation when the drop-down list appears/hidden                                                                                                                                                                           |
| `mouseEnterDelay`          | `number`                                                  | `—`            | Show delay after pointer entry.                                                                                                                                                                                                        |
| `mouseLeaveDelay`          | `number`                                                  | `—`            | Hide delay after pointer exit.                                                                                                                                                                                                         |
| `onChangeWithObject`       | `boolean`                                                 | `—`            | Include complete option objects in callbacks. AutoComplete change remains text; configure select with onSelectWithObject.                                                                                                              |
| `onSelectWithObject`       | `boolean`                                                 | `false`        | When clicking on the candidate, whether to add other attributes of the selected item option as callback parameters. When set to true, the input parameter type of @select will change from `string` to object: {value, label, ...rest} |
| `placeholder`              | `string`                                                  | `—`            | Input box prompt                                                                                                                                                                                                                       |
| `position`                 | `TooltipPosition`                                         | `'bottomLeft'` | The display position of the drop-down menu, the optional values are the same as the tooltip component                                                                                                                                  |
| `prefix`                   | `VNodeChild`                                              | `—`            | The prefix tag of the select box                                                                                                                                                                                                       |
| `renderItem`               | `(item: AutoCompleteItem) => VNodeChild`                  | `—`            | Custom option content; prefer the option scoped slot.                                                                                                                                                                                  |
| `renderSelectedItem`       | `(option: AutoCompleteOptionRuntime) => string`           | `—`            | Customize the drop-down list through renderSelectedItem after the candidate is clicked and selected, the content rendered in the select box ** only supports the return value of String type **                                        |
| `showClear`                | `boolean`                                                 | `false`        | Whether to show the clear button                                                                                                                                                                                                       |
| `size`                     | `AutoCompleteSize`                                        | `'default'`    | Size, optional `small`, `default`, `large`                                                                                                                                                                                             |
| `style`                    | `StyleValue`                                              | `—`            | style                                                                                                                                                                                                                                  |
| `stopPropagation`          | `boolean \| string`                                       | `true`         | Control event propagation from the popup.                                                                                                                                                                                              |
| `suffix`                   | `VNodeChild`                                              | `—`            | The prefix tag of the select box                                                                                                                                                                                                       |
| `validateStatus`           | `AutoCompleteValidateStatus`                              | `'default'`    | Validation status, optional values are `default`, `error`, `warning`, and the default is default. Only affect the display style                                                                                                        |
| `value`                    | `AutoCompleteModelValue`                                  | `—`            | The current value                                                                                                                                                                                                                      |
| `zIndex`                   | `number`                                                  | `1030`         | ZIndex of the drop-down menu                                                                                                                                                                                                           |

### AutoCompleteDataItem

| Property    | Type                      | Default | Description              |
| ----------- | ------------------------- | ------- | ------------------------ |
| `value`     | `AutoCompletePrimitive`   | `—`     | The current value        |
| `label`     | `VNodeChild`              | `—`     | Displayed text or VNode. |
| `disabled`  | `boolean`                 | `—`     | Whether to disable       |
| `class`     | `HTMLAttributes['class']` | `—`     | Vue class binding.       |
| `className` | `string`                  | `—`     | Style class name         |
| `style`     | `StyleValue`              | `—`     | style                    |

### AutoCompleteOptionProps

| Property       | Type                      | Default | Description                                        |
| -------------- | ------------------------- | ------- | -------------------------------------------------- |
| `value`        | `AutoCompletePrimitive`   | `—`     | The current value                                  |
| `label`        | `VNodeChild`              | `—`     | Displayed text or VNode.                           |
| `disabled`     | `boolean`                 | `—`     | Whether to disable                                 |
| `class`        | `HTMLAttributes['class']` | `—`     | Vue class binding.                                 |
| `className`    | `string`                  | `—`     | Style class name                                   |
| `style`        | `StyleValue`              | `—`     | style                                              |
| `empty`        | `boolean`                 | `—`     | Empty state.                                       |
| `emptyContent` | `VNodeChild \| null`      | `—`     | Customize the drop-down content when data is empty |
| `focused`      | `boolean`                 | `—`     | Current keyboard focus state.                      |
| `inputValue`   | `string`                  | `—`     | Current search text.                               |
| `selected`     | `boolean`                 | `—`     | Selection state.                                   |
| `showTick`     | `boolean`                 | `true`  | Show the selection icon; enabled by default.       |

### Events

| Event                   | Payload                                                  |
| ----------------------- | -------------------------------------------------------- |
| `blur`                  | `[event: FocusEvent]`                                    |
| `change`                | `[value: AutoCompletePrimitive]`                         |
| `clear`                 | `[]`                                                     |
| `dropdownVisibleChange` | `[visible: boolean]`                                     |
| `focus`                 | `[event: FocusEvent]`                                    |
| `keydown`               | `[event: KeyboardEvent]`                                 |
| `search`                | `[value: string]`                                        |
| `select`                | `[value: AutoCompletePrimitive \| AutoCompleteDataItem]` |
| `update:modelValue`     | `[value: AutoCompletePrimitive]`                         |
| `update:value`          | `[value: AutoCompletePrimitive]`                         |

Use @dropdown-visible-change for AutoComplete/Select and @visible-change for Cascader. Convert other camelCase events to kebab-case. onChangeWithObject is a Boolean prop, not an event.

### Slots

| Slot            | Signature                                             |
| --------------- | ----------------------------------------------------- |
| `#clearIcon`    | `() => VNodeChild`                                    |
| `#emptyContent` | `() => VNodeChild`                                    |
| `#insetLabel`   | `() => VNodeChild`                                    |
| `#option`       | `(props: AutoCompleteOptionSlotProps) => VNodeChild`  |
| `#prefix`       | `() => VNodeChild`                                    |
| `#suffix`       | `() => VNodeChild`                                    |
| `#trigger`      | `(props: AutoCompleteTriggerSlotProps) => VNodeChild` |

### Related types

```ts
export type AutoCompletePrimitive = string | number;
export type AutoCompleteItem = AutoCompleteDataItem | AutoCompletePrimitive;
export type AutoCompleteModelValue = AutoCompletePrimitive | undefined;
export interface AutoCompleteOptionRuntime extends AutoCompleteDataItem {
  _key?: PropertyKey;
  _renderedLabel?: VNodeChild;
  show?: boolean;
  value?: AutoCompletePrimitive;
}
export interface AutoCompleteOptionSlotProps {
  focused: boolean;
  inputValue: AutoCompletePrimitive;
  item: AutoCompleteItem;
  onClick: (event: MouseEvent) => void;
  onMouseenter: (event: MouseEvent) => void;
  option: AutoCompleteOptionRuntime;
}
export interface AutoCompleteTriggerSlotProps {
  componentProps: AutoCompleteProps;
  inputValue: AutoCompletePrimitive;
  onClear: (event: MouseEvent) => void;
  onSearch: (value: string) => void;
  value: AutoCompleteOptionRuntime[];
}
export type AutoCompleteSize = 'small' | 'default' | 'large';
export type AutoCompleteValidateStatus = 'default' | 'warning' | 'error';
```

## Methods

Use a template ref to call these public instance methods.

```ts
export interface AutoCompleteExposed {
  close(): void;
  focus(): void;
  open(): void;
  search(value: string): void;
}
```

## Accessibility

### ARIA

The wrapper has role combobox and options use listbox. aria-expanded, aria-controls and aria-activedescendant describe expansion and active focus. Name the native input through aria-label or aria-labelledby.

### Keyboard and Focus

- AutoComplete's input box can be focused, and once focused, keyboard users can use `Up Arrow` or `Down Arrow` to open the options panel (if there is a panel)
- AutoComplete also supports opening and closing panels via `Enter` key
- If the user sets the defaultActiveFirstOption property to true, the first option is highlighted by default when the options panel is opened
- If the drop-down menu is open:
  - Use `Esc` to close the menu
  - Use `Up Arrow` or `Down Arrow` to toggle options
  - The focused option can be selected with the `Enter` key and the panel will be collapsed

## Content Guidelines

- Content needs to be presented clearly so that users can clearly perceive the options available
- Limit the number of options displayed at one time

## Design Token

::token-table{component="autoComplete"}
::

## React → Vue migration

| React                                  | Vue                                                                                  |
| -------------------------------------- | ------------------------------------------------------------------------------------ |
| `@douyinfe/semi-ui`                    | `@aifuxi/semi-ui-vue/auto-complete` + `@aifuxi/semi-theme-default/auto-complete.css` |
| `useState` / `useMemo` / `useCallback` | `shallowRef` / `computed` / local functions                                          |
| `value` + `onChange`                   | `v-model` / `v-model:value` / `:value` + `@change`                                   |
| `className` / `ReactNode`              | Vue `class` / `VNodeChild` and slots                                                 |
| `ref.current`                          | public methods on a template ref                                                     |
| `renderItem(item)`                     | `#option="{ item, option, focused, inputValue }"`                                    |
| `renderSelectedItem`                   | Function returning string                                                            |
| `triggerRender`                        | `#trigger="{ value, inputValue, componentProps, onSearch, onClear }"`                |
| `onSelectWithObject`                   | `on-select-with-object` + `@select`                                                  |

Async and dynamic demos use fixed sequences, fixed delays and request ids, with timer cleanup on unmount. They do not make network requests.

## FAQ

### How do input text and option values differ?

Typing emits search before change. Selection fills the input with the string returned by renderSelectedItem; VNodes are not supported.

### How can I receive the complete option?

Enable on-select-with-object for an object select payload. change remains string or number; do not treat it like Select object-mode change.

### How can stale search responses be avoided?

Increment a request id when a search starts and accept only its latest result. Cancel timers on unmount. Demos use deterministic values instead of randomness.
