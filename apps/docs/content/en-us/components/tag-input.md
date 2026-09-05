---
title: 'TagInput'
description: 'Taginput is a input component that can add content as a tag.'
locale: 'en-US'
slug: 'tag-input'
category: 'input'
order: 49
englishTitle: 'TagInput'
icon: 'doc-tagInput'
upstream: 'input/taginput'
---

## Demos

### How to import

```ts
import { TagInput } from '@aifuxi/semi-ui-vue/tag-input';
import '@aifuxi/semi-theme-default/tag-input.css';
```

### Basic Usage

After pressing the Enter key, the input will add value as a tag. If the tag content is an empty string or pure space, it will be filtered.

::demo-block{demo="tag-input/en-us/Basic" title="Basic Usage"}
::

### Batch Add

You can use `separator` to set the separator to achieve batch input, and its default value is a comma. Multiple separators are supported in string[] format.

::demo-block{demo="tag-input/en-us/BatchAdd" title="Batch Add"}
::

### Batch Remove

You can also use `showClear` to set whether to support one-click deletion of all tags and input.

::demo-block{demo="tag-input/en-us/Clear" title="Batch Remove"}
::

### Disabled

::demo-block{demo="tag-input/en-us/Disabled" title="Disabled"}
::

### Size

Use `size` to set the size of the TagInput, optional: `small`, `default`, `large`.

::demo-block{demo="tag-input/en-us/Size" title="Size"}
::

### Different validate status

validateStatus: `default`, `warning`, `error`.

::demo-block{demo="tag-input/en-us/Validation" title="Different validate status"}
::

### Prefix / Suffix

You can pass the input box prefix through `prefix`, the input box suffix through `suffix`, for text or React Node.  
The left and right padding is automatically brought when the content passed in by prefix and reactix is text or Icon. If it is a custom VNodeChild, the left and right padding is 0.If necessary, you can set it in the VNodeChild you passed in.

::demo-block{demo="tag-input/en-us/Affixes" title="Prefix / Suffix"}
::

### Allow Duplicates

You can use `allowDuplicates` to set whether to allow the creation of the same tag.

::demo-block{demo="tag-input/en-us/Unique" title="Allow Duplicates"}
::

### Autocomplete

You can use `addOnBlur` to set whether the current input value is automatically created as a tag when the blur event is triggered.

::demo-block{demo="tag-input/en-us/AddOnBlur" title="Autocomplete"}
::

### Limits

You can use `max` to limit the number of tags. The `@exceed()` callback will be invoked when the limit is exceeded.

You can use `maxLength` to limit the maximum length of a single tag, and the `@input-exceed()` callback will be invoked when this value is exceeded.

::demo-block{demo="tag-input/en-us/Limits" title="Limits"}
::

### Limit the number of tags displayed

You can use `maxTagCount` to limit the number of tags displayed, and the excess will be displayed as +N. You can use `showRestTagsPopover` to set whether hover +N displays Popover after `maxTagCount` is exceeded, and you can configure Popover in the `restTagsPopoverProps` property.

::demo-block{demo="tag-input/en-us/MaxTagCount" title="Limit the number of tags displayed"}
::

### Controlled Tag

You can use `value` to set tags, and use `@change` to achieve control of the tags.

::demo-block{demo="tag-input/en-us/Controlled" title="Controlled Tag"}
::

### Controlled Input

You can use `inputValue` to set input box, and use `@input-change` to control the input content.

::demo-block{demo="tag-input/en-us/ControlledInput" title="Controlled Input"}
::

### Callback

::demo-block{demo="tag-input/en-us/Callbacks" title="Callback"}
::

### Focus Management

You can use the `blur()` and `focus()` methods to manage the focus.

::demo-block{demo="tag-input/en-us/Focus" title="Focus Management"}
::

### Custom TagInput rendering

You can use `renderTagItem` to customize tag rendering. `renderTagItem(value: string, index: number, onClose: function ) => VNodeChild` The third parameter `onClose` is available since version 2.23.0.

::demo-block{demo="tag-input/en-us/Custom" title="Custom TagInput rendering"}
::

### Drag to sort

Set `draggable` to true to enable drag and drop sorting. Supported since v2.17.0. Adding the same Tag is not allowed under drag and drop sorting,
so you need to set `allowDuplicates` to false. After the drag function is enabled, click TagInput, and the Tag can be dragged. Click anywhere
outside the TagInput, the Tag cannot be dragged.

::demo-block{demo="tag-input/en-us/Draggable" title="Drag to sort"}
::

## API Reference

### TagInput

| Property                | Type                                                                | Default     | Description                                                                                                                                                                                   |
| ----------------------- | ------------------------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ariaLabel`             | `string`                                                            | `—`         | Accessible name; use aria-label in templates.                                                                                                                                                 |
| `addOnBlur`             | `boolean`                                                           | `false`     | Whether to automatically create the current input value into a tag when the blur event is triggered                                                                                           |
| `allowDuplicates`       | `boolean`                                                           | `true`      | Allows adding the same tag multiple times                                                                                                                                                     |
| `autoFocus`             | `boolean`                                                           | `false`     | Set whether to automatically focus during initial rendering                                                                                                                                   |
| `className`             | `HTMLAttributes['class']`                                           | `—`         | Class name                                                                                                                                                                                    |
| `clearIcon`             | `VNodeChild`                                                        | `—`         | Custom clear button content, shown when showClear is enabled.                                                                                                                                 |
| `defaultValue`          | `string[]`                                                          | `—`         | Default tag value                                                                                                                                                                             |
| `disabled`              | `boolean`                                                           | `false`     | Read-only, disable interaction                                                                                                                                                                |
| `draggable`             | `boolean`                                                           | `false`     | Set whether to drag and drop                                                                                                                                                                  |
| `expandRestTagsOnClick` | `boolean`                                                           | `true`      | Without dragging，whether to expand redundant tags after TagInput is clicked                                                                                                                  |
| `inputValue`            | `string`                                                            | `—`         | Controlled input value                                                                                                                                                                        |
| `insetLabel`            | `VNodeChild`                                                        | `—`         | Inset label, also available as the insetLabel slot.                                                                                                                                           |
| `insetLabelId`          | `string`                                                            | `—`         | Inset label element id.                                                                                                                                                                       |
| `max`                   | `number`                                                            | `—`         | Maximum number of tags allowed                                                                                                                                                                |
| `maxLength`             | `number`                                                            | `—`         | Maximum length of a tag                                                                                                                                                                       |
| `maxTagCount`           | `number`                                                            | `—`         | The maximum number of tags to be displayed, if exceeded, they will be displayed in the form of +N                                                                                             |
| `modelValue`            | `string[] \| undefined`                                             | `—`         | Controlled value for v-model.                                                                                                                                                                 |
| `placeholder`           | `string`                                                            | `—`         | Content to be appear by default                                                                                                                                                               |
| `prefix`                | `VNodeChild`                                                        | `—`         | Prefix                                                                                                                                                                                        |
| `preventScroll`         | `boolean`                                                           | `—`         | Indicates whether the browser should scroll the document to display the newly focused element, acting on the focus method inside the component, excluding the component passed in by the user |
| `renderTagItem`         | `(value: string, index: number, close: () => void) => VNodeChild`   | `—`         | Customize the rendering of items, The parameter onClose is available in version 2.23.0                                                                                                        |
| `restTagsPopoverProps`  | `TagInputRestPopoverProps`                                          | `—`         | Rest-tag popover settings; see TagInputRestPopover on this page.                                                                                                                              |
| `separator`             | `TagInputSeparator`                                                 | `','`       | Customize the separator                                                                                                                                                                       |
| `showClear`             | `boolean`                                                           | `false`     | Whether to show the clear button                                                                                                                                                              |
| `showContentTooltip`    | `boolean \| TagInputTooltipOptions`                                 | `true`      | Show full text for truncated tags; use opts to configure Tooltip or Popover.                                                                                                                  |
| `showRestTagsPopover`   | `boolean`                                                           | `true`      | When maxTagCount is exceeded and hover reaches +N, whether to display the remaining content through Popover                                                                                   |
| `size`                  | `TagInputSize`                                                      | `'default'` | Size, one of `small`、`large`、`default`                                                                                                                                                      |
| `split`                 | `(originString: string, separators: TagInputSeparator) => string[]` | `—`         | Customize the separator processing function                                                                                                                                                   |
| `style`                 | `StyleValue`                                                        | `—`         | Inline style                                                                                                                                                                                  |
| `suffix`                | `VNodeChild`                                                        | `—`         | Suffix                                                                                                                                                                                        |
| `validateStatus`        | `TagInputValidateStatus`                                            | `'default'` | Validate status for styling only, one of `default`、`warning`、`error`                                                                                                                        |
| `value`                 | `string[] \| undefined`                                             | `—`         | Controlled tag value                                                                                                                                                                          |

### TagInputRestPopover

| Property             | Type                      | Default | Description                                                |
| -------------------- | ------------------------- | ------- | ---------------------------------------------------------- |
| `autoAdjustOverflow` | `boolean`                 | `—`     | Adjust popup position on overflow.                         |
| `className`          | `HTMLAttributes['class']` | `—`     | Class name                                                 |
| `getPopupContainer`  | `() => HTMLElement`       | `—`     | Return the popup mounting container.                       |
| `mouseEnterDelay`    | `number`                  | `—`     | Delay before showing after pointer entry, in milliseconds. |
| `mouseLeaveDelay`    | `number`                  | `—`     | Delay before hiding after pointer exit, in milliseconds.   |
| `position`           | `TooltipPosition`         | `—`     | Popover position.                                          |
| `style`              | `StyleValue`              | `—`     | Inline style                                               |
| `zIndex`             | `number`                  | `—`     | Popover z-index.                                           |

### Events

#### TagInput

| Event               | Payload                               |
| ------------------- | ------------------------------------- |
| `add`               | `addedValue: string[]`                |
| `blur`              | `event: FocusEvent`                   |
| `change`            | `value: string[]`                     |
| `exceed`            | `value: string[]`                     |
| `focus`             | `event: FocusEvent`                   |
| `inputChange`       | `value: string, event: Event`         |
| `inputExceed`       | `value: string`                       |
| `keyDown`           | `event: KeyboardEvent`                |
| `remove`            | `removedValue: string, index: number` |
| `update:inputValue` | `value: string`                       |
| `update:modelValue` | `value: string[]`                     |
| `update:value`      | `value: string[]`                     |

### Slots and types

Slots: #clearIcon, #insetLabel, #prefix, #suffix and #tag="{ value, index, close }". The tag slot replaces React renderTagItem; a VNodeChild-returning renderTagItem function is also supported. TagInputSeparator = string | string[] | null, size is small/default/large and validation is default/error/warning.
showContentTooltip accepts a boolean or { type?: string, opts?: Omit<TooltipProps, "condition" | "content"> & { className? } }. See TagInputRestPopover for the supported popover configuration.

Use kebab-case for camelCase events in templates, such as @enter-press, @number-change, @after-change and @input-change. TagInput emits keyDown; bind it as @key-down. Use native Vue class and style.

## Methods

Some internal methods provided by TagInput can be accessed through ref:

| Name    | Description  | Version |
| ------- | ------------ | ------- |
| blur()  | Remove focus | -       |
| focus() | Get focus    | -       |

## Accessibility

### ARIA

- TagInput supports the input of `aria-label` to indicate the function of the TagInput;
- TagInput will set `aria-disabled` and `aria-invalid` according to disabled and validateStatus props;
- Both the input box and the clear button of TagInput have `aria-label` to indicate the function of the element.

### Keyboard and focus

Use Tab / Shift + Tab to move focus. Enter creates a tag from the input; blank values are filtered. Backspace on an empty input removes the last tag. Disabled controls do not accept input.

## Design Tokens

::token-table{component="tagInput"}
::

## React → Vue migration

| React                                  | Vue                                                                          |
| -------------------------------------- | ---------------------------------------------------------------------------- |
| `@douyinfe/semi-ui`                    | `@aifuxi/semi-ui-vue/tag-input` + `@aifuxi/semi-theme-default/tag-input.css` |
| `value` + `onChange`                   | `v-model` / `v-model:value` / `:value` + `@change`                           |
| `defaultValue`                         | `default-value`                                                              |
| `useState` / `useMemo`                 | `shallowRef` / `computed`                                                    |
| `className` / `style={{ ... }}`        | `class` / `:style="{ ... }"`                                                 |
| `ref.current.focus()` / `.blur()`      | `focus()` / `blur()` on a template ref                                       |
| `inputValue` + `onInputChange`         | `v-model:input-value`                                                        |
| `renderTagItem(value, index, onClose)` | `#tag="{ value, index, close }"`                                             |

Custom tags use this project’s local illustrations instead of remote avatars with unavailable or unclear licensing. Labels, close actions and each language’s layout are preserved. Original references are recorded in the migration mapping; this replacement is not a claim of visual acceptance.

## FAQ

### How are tags and input text controlled independently?

Use v-model for tags and v-model:input-value for the editing text. TagInput prioritizes modelValue when modelValue and value are both supplied; prefer one control entry.

### Why must duplicate values be disabled before dragging?

Tag values identify items during sorting. Use draggable with :allow-duplicates="false"; click the control to enable dragging and click outside to leave that state.
