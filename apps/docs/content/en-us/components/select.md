---
title: 'Select'
description: 'The user can select one or more options from a set of options through the Select selector and present the final selection result'
locale: 'en-US'
slug: 'select'
category: 'input'
order: 46
englishTitle: 'Select'
icon: 'doc-select'
upstream: 'input/select'
---

## Demos

### How to import

```ts
import { Select } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
```

### Basic Usage

Each Option tag must declare the `value` attribute, and the Option `children` content will be rendered to the drop-down list

::demo-block{demo="select/en-us/Basic" title="Basic Usage"}
::

### Pass Option as an array

You can pass an array of objects directly through `optionList`. Each object must contain the value / label attribute.

::demo-block{demo="select/en-us/Options" title="Pass Option as an array"}
::

### Multi-choice

Since v2.28, the selector will have its own maxHeight 270, and the content can be viewed by scrolling vertically after it exceeds.

Configuration `multiple` properties that can support multi-selection

Configuration `maxTagCount`. You can limit the number of options displayed, and the excess will be displayed in the form of + N

Configure `ellipsisTrigger` (>= v2.28.0) to do adaptive processing on the overflow part of the tag. When the width is insufficient, the last tag content will be truncated. After enabling this function, there will be a certain performance loss, and it is not recommended to use it in large form scenarios

Configure `expandRestTagsOnClick` (>= v2.28.0) to display all remaining tags by clicking when `maxTagCount` is set

Use `showRestTagsPopover` (>= v2.22.0) to set whether hover +N displays Popover after exceeding `maxTagCount`, the default is `false`. Also, popovers can be configured in the `restTagsPopoverProps` property

Configuration `max` Properties can limit the maximum number of options and cannot be selected beyond the maximum limit, while triggering`On Exceed`callback

::demo-block{demo="select/en-us/Multiple" title="Multi-choice"}
::

### With Group

Grouping Option with `OptGroup`(Only supports the declaration of children through jsx, and does not support pass in through optionList)

::demo-block{demo="select/en-us/Groups" title="With Group"}
::

::demo-block{demo="select/en-us/GroupData" title="With Group"}
::

### Different sizes

Size: small / default / large

::demo-block{demo="select/en-us/Size" title="Different sizes"}
::

### Different validate status

validateStatus: default / warning / error

::demo-block{demo="select/en-us/Validation" title="Different validate status"}
::

### Configure Prefix, Suffix, Clear Button

- You can pass the selection box prefix through `#prefix`, the selection box suffix through `#suffix`, using the #prefix and #suffix slots  
  The left and right padding is automatically brought when the content passed in by prefix and reactix is text or Icon. If it is a custom VNodeChild, the left and right padding is 0.
- Whether to show the clear button is displayed by `showClear`
- Whether to show the right drop-down arrow is displayed by `showArrow`

::demo-block{demo="select/en-us/Affixes" title="Configure Prefix, Suffix, Clear Button"}
::

### Additional items

We have reserved two slots at the bottom of the pop-up layer, which you can use when you need to add a custom node to the pop-up layer.  
Use`#innerTop` or `#outerTop` to pass the custom node, which will be rendered at the top of the pop-up layer. Use`#innerBottom` or `#outerBottom` instead at the bottom.

- `#innerTop` and `#innerBottom` will be rendered inside the Option List

- `#outerTop` and `#outerBottom` will be rendered to level with the option List

::demo-block{demo="select/en-us/BottomSlots" title="Additional items"}
::

Using #outerTop to insert content

::demo-block{demo="select/en-us/TopTabs" title="Additional items"}
::

### Controlled component

When `value` is passed, Select is a controlled component, and the value selected is entirely determined by `value`.

::demo-block{demo="select/en-us/Controlled" title="Controlled component"}
::

### Linkage Select

If it is a complex linkage with a hierarchical relationship, it is recommended to use Cascader components directly

::demo-block{demo="select/en-us/Linkage" title="Linkage Select"}
::

### Search

You can turn on the search capability by setting `filter` to true.  
The default search strategy will include comparison of the input value with the label value of option

By default, the search keywords will be cleared automatically after multiple selection is selected. If you want to keep it, you can turn off the default behavior by setting `autoClearSearchValue` to false (provided after v2.3)

::demo-block{demo="select/en-us/Search" title="Search"}
::

### Search position

The default search input is displayed on the Select Trigger. You can specify different positions through `searchPosition`, and you can choose `dropdown` or `trigger`. Available after `v2.61.0`  
If you want to customize the placeholder of the Input search box in the dropdown, you can control it through `searchPlaceholder`  
If the `searchPosition` is `trigger`, when `showClear=true`, clicking the clear button of the input will clear the selected items and the search text in the input at the same time  
If the `searchPosition` is `dropdown`, when `showClear=true`, clicking the clear button of the trigger will clear the selected items, clicking the clear button in the dropdown input will clear search text

::demo-block{demo="select/en-us/SearchPosition" title="Search position"}
::

### Remote search

A multi-select example with remote search, request debounce, loading status.

- Use `filter` turn on the search capability.
- Use `remote` to disabled local filter
- Dynamic Update `optionList` after `@search` callback
- Update `loading` when fetching data / finish
- Use controlled value attribute

::demo-block{demo="select/en-us/Remote" title="Remote search"}
::

### Custom search strategy

By default, the user's search input will be compared with the option's label value as a string include.  
You can set `filter` as a custom function to customize your filter strategy.

::demo-block{demo="select/en-us/CustomFilter" title="Custom search strategy"}
::

### Custom selection rendering

The default selection displays the option label or default-slot content. Use #selectedItem="{ option, index }" to customize it: single selection shows the slot directly, while multiple selection places it inside the built-in Tag and retains its close button. React isRenderInTag:false wrapper replacement is unavailable. The three controls show an avatar with email, circular avatar tags and square avatar tags.

::demo-block{demo="select/en-us/SelectedItem" title="Custom selection rendering"}
::

### Custom pop-up layer style

You can control the style of the pop-up layer through `dropdownClassName`, `dropdownStyle`  
For example, when you customize the width of the pop-up layer, you can pass the width through `drowndownStyle`

::demo-block{demo="select/en-us/DropdownStyle" title="Custom pop-up layer style"}
::

### Dynamic Modification Options

If you need to update Options dynamically, you should use controlled value

::demo-block{demo="select/en-us/DynamicOptions" title="Dynamic Modification Options"}
::

### Get all attribute of selected option

By default, through `@change` uou can only get value attribute of selected option.  
If you need to take other attributes of the selected option, you can use `onChangeWithObject` Properties  
At this time, the argument of `@change` will be object, containing various attributes of selected option, eg: `@change({ value, label, ...rest })`  
Note that when @change With Object is set to true,`defaultValue`/`Value`it should also be object and must have `value` key

::demo-block{demo="select/en-us/ObjectValue" title="Get all attribute of selected option"}
::

### Create entries

You can create and select entries that do not exist in the options by setting `allowCreate=true` You can customize the content display when creating the label through #createItem (by returning VNodeChild, note that you need to customize the style) In addition, can be used with the `defaultActiveFirstOption` property to automatically select the first item. When you enter directly and press Enter, you can immediately create an Option

> When allowCreate is enabled, it will no longer respond to updates to Children or optionList

::demo-block{demo="select/en-us/Create" title="Create entries"}
::

### Virtualize

Turn on list virtualization when passing in `virtualize` to optimize performance when there are a large number of Option nodes virtualize is an object containing the following values:

- height: Option list height value, default 270 （before v2.20.8 was 300）
- width: Option list width value, default 100%
- itemSize: The height of each line of Option, must be passed

> When virtualize.height is greater than the default value of 270px, to avoid the double scrollbar issue, you need to set the maxHeight property to the same value as virtualize.height.
> For example: when setting virtualize.height to 400px, you should also set maxHeight={400}.

::demo-block{demo="select/en-us/Virtual" title="Virtualize"}
::

### Custom Trigger

If the default layout style of the selection box does not meet your needs, you can use `#trigger` to customize the display of the selection box

The parameters of #trigger are as follows

```ts
export interface SelectTriggerSlotProps {
  value: SelectOptionRuntime[];
  inputValue: string;
  disabled: boolean;
  placeholder: VNodeChild;
  onSearch: (value: string, event?: Event) => void;
  onClear: (event: MouseEvent) => void;
  onRemove: (option: SelectOptionRuntime) => void;
}
```

::demo-block{demo="select/en-us/Trigger" title="Custom Trigger"}
::

The following is a more complex example: Reusing the drag-and-sort capability of TagInput and adding sorting to Select through #trigger.

::demo-block{demo="select/en-us/DraggableTrigger" title="Custom Trigger"}
::

### Custom Option Render

For simple customization, put content in the SelectOption default slot and retain the built-in option styles. For full control use #option="option": bind option.style, option.class and @mouseenter="option.onMouseenter" to the wrapper, call option.onClick when clicked, and reflect selected, focused and disabled in styles and ARIA. Preserve the supplied style for virtualization and the mouseenter callback for keyboard focus.

::demo-block{demo="select/en-us/CustomOption" title="Custom Option Render"}
::

```scss
.components-select-demo-renderOptionItem {
  .custom-option-render {
    display: flex;
    font-size: 14px;
    line-height: 20px;
    word-break: break-all;
    padding-left: 12px;
    padding-right: 12px;
    padding-top: 8px;
    padding-bottom: 8px;
    color: var(--semi-color-text-0);
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
    box-sizing: border-box;
    .option-right {
      margin-left: 8px;
      display: inline-flex;
      align-items: center;
    }
    &:active {
      background-color: var(--semi-color-fill-1);
    }
    &-focused {
      background-color: var(--semi-color-fill-0);
    }
    &-selected {
      //font-weight: 700;
    }
    &-disabled {
      color: var(--semi-color-disabled-text);
      cursor: not-allowed;
    }
    &:first-of-type {
      margin-top: 4px;
    }
    &:last-of-type {
      margin-bottom: 4px;
    }
  }
}
```

## API Reference

### SelectProps

| Property                   | Type                                                                      | Default     | Description                                                                                                                                                                                                                                                                                                                                                    |
| -------------------------- | ------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ariaDescribedby`          | `string`                                                                  | `—`         | Description element ids.                                                                                                                                                                                                                                                                                                                                       |
| `ariaErrormessage`         | `string`                                                                  | `—`         | Error message element id.                                                                                                                                                                                                                                                                                                                                      |
| `ariaInvalid`              | `boolean \| 'false' \| 'true' \| 'grammar' \| 'spelling'`                 | `—`         | ARIA invalid state.                                                                                                                                                                                                                                                                                                                                            |
| `ariaLabelledby`           | `string`                                                                  | `—`         | Label element ids; use aria-labelledby in templates.                                                                                                                                                                                                                                                                                                           |
| `ariaRequired`             | `boolean`                                                                 | `—`         | ARIA required state.                                                                                                                                                                                                                                                                                                                                           |
| `id`                       | `string`                                                                  | `—`         | Component element id.                                                                                                                                                                                                                                                                                                                                          |
| `autoFocus`                | `boolean`                                                                 | `—`         | Whether automatically focus when component mount                                                                                                                                                                                                                                                                                                               |
| `autoClearSearchValue`     | `boolean`                                                                 | `true`      | After selecting the option, whether to automatically clear the search keywords, it will take effect when mutilple and filter are both enabled                                                                                                                                                                                                                  |
| `autoAdjustOverflow`       | `boolean`                                                                 | `true`      | Whether the pop-up layer automatically adjusts the direction when it is obscured (only vertical direction is supported for the time being, and the inserted parent is body)                                                                                                                                                                                    |
| `allowCreate`              | `boolean`                                                                 | `false`     | Whether to allow the user to create new entries. Needs to be used with `filter`. When allowCreate is enabled, it will no longer respond to updates to children or optionList                                                                                                                                                                                   |
| `borderless`               | `boolean`                                                                 | `false`     | borderless mode >=2.33.0                                                                                                                                                                                                                                                                                                                                       |
| `clickToHide`              | `boolean`                                                                 | `—`         | When expanded, click on the selection box to automatically put away the drop-down list                                                                                                                                                                                                                                                                         |
| `defaultActiveFirstOption` | `boolean`                                                                 | `true`      | Whether to highlight the first option by default (press Enter to select directly)                                                                                                                                                                                                                                                                              |
| `defaultOpen`              | `boolean`                                                                 | `false`     | Whether show dropdown when component mounted                                                                                                                                                                                                                                                                                                                   |
| `defaultValue`             | `SelectModelValue`                                                        | `—`         | Originally selected value when component mount                                                                                                                                                                                                                                                                                                                 |
| `disabled`                 | `boolean`                                                                 | `false`     | Disabled                                                                                                                                                                                                                                                                                                                                                       |
| `dropdownClassName`        | `HTMLAttributes['class']`                                                 | `—`         | ClassName of the pop-up layer                                                                                                                                                                                                                                                                                                                                  |
| `dropdownMargin`           | `number \| TooltipMargin`                                                 | `—`         | Popup layer calculates the size of the safe area when the current direction overflows, used in scenes covered by fixed elements, more detail refer to [issue#549](https://github.com/DouyinFE/semi-design/issues/549), same as Tooltip margin                                                                                                                  |
| `dropdownMatchSelectWidth` | `boolean`                                                                 | `true`      | Is the minimum width of the drop-down menu equal to Select                                                                                                                                                                                                                                                                                                     |
| `dropdownStyle`            | `StyleValue`                                                              | `—`         | The inline style of the pop-up layer                                                                                                                                                                                                                                                                                                                           |
| `ellipsisTrigger`          | `boolean`                                                                 | `—`         | When maxTagCount exists and is multi-select, whether to perform adaptive processing on the overflow part of the tag(When the width is insufficient, the last tag content is truncated). After enabling this function, there will be a certain performance loss, and it is not recommended to use it in large form scenarios                                    |
| `emptyContent`             | `VNodeChild \| null`                                                      | `—`         | Content displayed when there is no result. When set to null, the drop-down list will not be displayed                                                                                                                                                                                                                                                          |
| `expandRestTagsOnClick`    | `boolean`                                                                 | `—`         | When maxTagCount exists and is multi-selected, select whether to expand redundant Tags when the panel is open                                                                                                                                                                                                                                                  |
| `filter`                   | `boolean \| ((inputValue: string, option: SelectOptionProps) => boolean)` | `false`     | Whether searchable or not, the default is false. When `true` is passed, it means turn on search ability, default filtering policy is whether the label matches search input When the input type is function, the function arguments are searchInput, option. It should return true when the option meets the filtering conditions, otherwise it returns false. |
| `getPopupContainer`        | `() => HTMLElement`                                                       | `—`         | Specifies the parent DOM, and the popup layer will be rendered to the DOM, you need to set 'position: relative` This will change the DOM tree position, but not the view's rendering position.                                                                                                                                                                 |
| `inputProps`               | `SelectInputProps`                                                        | `—`         | Additional native input attributes; the type excludes value and onInput.                                                                                                                                                                                                                                                                                       |
| `insetLabelId`             | `string`                                                                  | `—`         | Inset label element id.                                                                                                                                                                                                                                                                                                                                        |
| `loading`                  | `boolean`                                                                 | `—`         | Does the drop-down list show the loading animation                                                                                                                                                                                                                                                                                                             |
| `max`                      | `number`                                                                  | `—`         | Maximum number of choices, effective only in multi-selection mode                                                                                                                                                                                                                                                                                              |
| `maxHeight`                | `string \| number`                                                        | `270`       | Maximum height of `optionList` in the pop-up layer. **Note: When using virtualization with virtualize.height greater than the default 270px, you need to set maxHeight to the same value as virtualize.height to avoid the double scrollbar issue**                                                                                                            |
| `maxTagCount`              | `number`                                                                  | `—`         | In multi-selection mode, when the option is beyond maxTag Count, the subsequent option is rendered in the form of + N                                                                                                                                                                                                                                          |
| `modelValue`               | `SelectModelValue`                                                        | `—`         | Controlled value for v-model.                                                                                                                                                                                                                                                                                                                                  |
| `motion`                   | `boolean`                                                                 | `true`      | Enable popup enter and exit motion.                                                                                                                                                                                                                                                                                                                            |
| `mouseEnterDelay`          | `number`                                                                  | `—`         | Show delay after pointer entry.                                                                                                                                                                                                                                                                                                                                |
| `mouseLeaveDelay`          | `number`                                                                  | `—`         | Hide delay after pointer exit.                                                                                                                                                                                                                                                                                                                                 |
| `multiple`                 | `boolean`                                                                 | `false`     | Whether allow multiple selection                                                                                                                                                                                                                                                                                                                               |
| `onChangeWithObject`       | `boolean`                                                                 | `false`     | Whether to use the other properties of the selected option as a callback. When set to true, the entry type of onchange changes from string to object: {value, label,...rest}                                                                                                                                                                                   |
| `optionList`               | `SelectOptionProps[]`                                                     | `—`         | You can pass Option through this property, make sure that each element in the array has `label`, `value` properties                                                                                                                                                                                                                                            |
| `placeholder`              | `VNodeChild`                                                              | `''`        | placeholder                                                                                                                                                                                                                                                                                                                                                    |
| `position`                 | `TooltipPosition`                                                         | `—`         | Pop-up layer position, refer to [Popover·API reference·position](/en-us/components/popover/)                                                                                                                                                                                                                                                                   |
| `preventScroll`            | `boolean`                                                                 | `—`         | Indicates whether the browser should scroll the document to display the newly focused element, acting on the focus method inside the component, excluding the component passed in by the user                                                                                                                                                                  |
| `rePosKey`                 | `string \| number`                                                        | `—`         | You can update the value of this item to manually trigger the repositioning of the pop-up layer                                                                                                                                                                                                                                                                |
| `restTagsPopoverProps`     | `Partial<TooltipProps>`                                                   | `—`         | Remaining-tag popup configuration; follow the current public type. Select uses Partial.                                                                                                                                                                                                                                                                        |
| `remote`                   | `boolean`                                                                 | `false`     | Whether to turn on remote search, when remote is true, the input content will not be locally filtered and matched                                                                                                                                                                                                                                              |
| `searchPlaceholder`        | `string`                                                                  | `—`         | Search input placeholder.                                                                                                                                                                                                                                                                                                                                      |
| `searchPosition`           | `SelectSearchPosition`                                                    | `'trigger'` | When the filter is turned on, the search box is in the trigger by default. You can set it to 'dropdown' to put the search box at the top of the popup list.                                                                                                                                                                                                    |
| `showArrow`                | `boolean`                                                                 | `true`      | Whether to show arrow icon                                                                                                                                                                                                                                                                                                                                     |
| `showClear`                | `boolean`                                                                 | `false`     | Whether to show the clear button                                                                                                                                                                                                                                                                                                                               |
| `showRestTagsPopover`      | `boolean`                                                                 | `false`     | When the number of tags exceeds maxTagCount and hover reaches +N, whether to display the remaining content through Popover                                                                                                                                                                                                                                     |
| `size`                     | `SelectSize`                                                              | `'default'` | Control size: small, default or large.                                                                                                                                                                                                                                                                                                                         |
| `spacing`                  | `number \| TooltipSpacing`                                                | `—`         | Spacing between popup layer and trigger                                                                                                                                                                                                                                                                                                                        |
| `stopPropagation`          | `boolean`                                                                 | `true`      | Whether to prevent click events on the popup layer from bubbling                                                                                                                                                                                                                                                                                               |
| `validateStatus`           | `SelectValidateStatus`                                                    | `'default'` | Verification result, optional `warning`, `error`, `default` (only affect the style background color)                                                                                                                                                                                                                                                           |
| `value`                    | `SelectModelValue`                                                        | `—`         | Property value                                                                                                                                                                                                                                                                                                                                                 |
| `virtualize`               | `SelectVirtualizeProps`                                                   | `—`         | List virtualization, used to optimize performance in the case of a large number of nodes, composed of height, width, and itemSize. **Note: When height is greater than the default 270px, you need to set maxHeight to the same value**                                                                                                                        |
| `zIndex`                   | `number`                                                                  | `1030`      | Popup layer z-index                                                                                                                                                                                                                                                                                                                                            |

### SelectOptionProps

| Property   | Type                      | Default | Description                                           |
| ---------- | ------------------------- | ------- | ----------------------------------------------------- |
| `value`    | `SelectPrimitive`         | `—`     | Property value                                        |
| `label`    | `VNodeChild`              | `—`     | Text displayed.                                       |
| `disabled` | `boolean`                 | `—`     | Disabled                                              |
| `showTick` | `boolean`                 | `true`  | Whether to show the Icon of tick when option selected |
| `class`    | `HTMLAttributes['class']` | `—`     | Vue class binding.                                    |
| `style`    | `StyleValue`              | `—`     | Inline Style                                          |

### SelectOptionGroupProps

| Property | Type                      | Default | Description        |
| -------- | ------------------------- | ------- | ------------------ |
| `label`  | `VNodeChild`              | `—`     | Text displayed.    |
| `class`  | `HTMLAttributes['class']` | `—`     | Vue class binding. |
| `style`  | `StyleValue`              | `—`     | Inline Style       |

### SelectVirtualizeProps

| Property   | Type               | Default | Description                  |
| ---------- | ------------------ | ------- | ---------------------------- |
| `itemSize` | `number`           | `—`     | Fixed item height in pixels. |
| `height`   | `number`           | `—`     | Virtual list height.         |
| `width`    | `string \| number` | `—`     | Virtual list width.          |

### Events

| Event                   | Payload                                                            |
| ----------------------- | ------------------------------------------------------------------ |
| `blur`                  | `[event: FocusEvent]`                                              |
| `change`                | `[value: SelectModelValue]`                                        |
| `clear`                 | `[]`                                                               |
| `create`                | `[option: SelectOptionProps]`                                      |
| `deselect`              | `[value: SelectPrimitive \| undefined, option: SelectOptionProps]` |
| `dropdownVisibleChange` | `[visible: boolean]`                                               |
| `exceed`                | `[option: SelectOptionProps]`                                      |
| `focus`                 | `[event: FocusEvent]`                                              |
| `listScroll`            | `[event: Event]`                                                   |
| `search`                | `[value: string, event?: Event]`                                   |
| `select`                | `[value: SelectPrimitive \| undefined, option: SelectOptionProps]` |
| `update:modelValue`     | `[value: SelectModelValue]`                                        |
| `update:value`          | `[value: SelectModelValue]`                                        |

Use @dropdown-visible-change for AutoComplete/Select and @visible-change for Cascader. Convert other camelCase events to kebab-case. onChangeWithObject is a Boolean prop, not an event.

### Slots

| Slot            | Signature                                                                                       |
| --------------- | ----------------------------------------------------------------------------------------------- |
| `#default`      | `() => VNodeChild`                                                                              |
| `#arrowIcon`    | `() => VNodeChild`                                                                              |
| `#clearIcon`    | `() => VNodeChild`                                                                              |
| `#createItem`   | `(props: { inputValue: SelectPrimitive; focused: boolean; style?: StyleValue; }) => VNodeChild` |
| `#emptyContent` | `() => VNodeChild`                                                                              |
| `#innerBottom`  | `() => VNodeChild`                                                                              |
| `#innerTop`     | `() => VNodeChild`                                                                              |
| `#insetLabel`   | `() => VNodeChild`                                                                              |
| `#option`       | `(props: SelectOptionRenderProps) => VNodeChild`                                                |
| `#outerBottom`  | `() => VNodeChild`                                                                              |
| `#outerTop`     | `() => VNodeChild`                                                                              |
| `#prefix`       | `() => VNodeChild`                                                                              |
| `#selectedItem` | `(props: { option: SelectOptionRuntime; index: number }) => VNodeChild`                         |
| `#suffix`       | `() => VNodeChild`                                                                              |
| `#trigger`      | `(props: SelectTriggerSlotProps) => VNodeChild`                                                 |

### Related types

```ts
export type SelectPrimitive = string | number;
export type SelectValue = SelectPrimitive | Record<string, unknown>;
export type SelectModelValue = SelectValue | SelectValue[] | undefined;
export type SelectSize = 'small' | 'default' | 'large';
export type SelectSearchPosition = 'trigger' | 'dropdown';
export type SelectValidateStatus = 'default' | 'warning' | 'error';
export interface SelectOptionRuntime extends SelectOptionProps {
  _key?: PropertyKey;
  _parentGroup?: SelectOptionGroupRuntime;
  _scrollIndex: number;
  _selected: boolean;
  _show: boolean;
  _inputCreateOnly?: boolean;
  children?: VNodeChild;
}
export interface SelectOptionGroupRuntime extends SelectOptionGroupProps {
  _key?: PropertyKey;
}
export interface SelectInputProps extends Omit<InputHTMLAttributes, 'value' | 'onInput'> {
  class?: HTMLAttributes['class'];
}
export interface SelectOptionRenderProps extends SelectOptionRuntime {
  focused: boolean;
  selected: boolean;
  inputValue: string;
  onClick: (event: MouseEvent) => void;
  onMouseenter: (event: MouseEvent) => void;
}
export interface SelectTriggerSlotProps {
  value: SelectOptionRuntime[];
  inputValue: string;
  disabled: boolean;
  placeholder: VNodeChild;
  onSearch: (value: string, event?: Event) => void;
  onClear: (event: MouseEvent) => void;
  onRemove: (option: SelectOptionRuntime) => void;
}
```

## Methods

Use a template ref to call these public instance methods.

```ts
export interface SelectExposed {
  clearInput(): void;
  close(): void;
  deselectAll(): void;
  focus(): void;
  open(): void;
  rePosition(): void;
  search(value: string, event?: Event): void;
  selectAll(): void;
}
```

## Accessibility

### ARIA

- The role of the Select trigger is combobox, the role of the popup layer is listbox, and the role of the option is option
- Select trigger has aria-haspopup, aria-expanded, and aria-controls properties, indicating the relationship between trigger and popup layer
- When multiple selections are made, listbox aria-multiselectable is true, indicating that multiple selections are currently available
- aria-selected is true when Option is selected; aria-disabled is true when Option is disabled
- The attribute aria-activedescendant ensures that the currently selected option is recognized when the narration is spoken(for more information, please refer to [Managing Focus in Composites Using aria-activedescendant](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_focus_activedescendant))

### Keyboard and Focus

**Select without Filter:**

- After Select is focused, keyboard users can open the dropdown menu with the `Up Arrow` or `Down Arrow` or `Enter` keys and automatically focus on the first option in the dropdown menu (`defaultActiveFirstOption` defaults to true)
- When the dropdown menu is open:
  - Use `Esc` key or `Tab` key to close the menu
  - Use `Up Arrow` or `Down Arrow` to toggle options
  - The focused option can be selected with the Enter key and the panel is collapsed
- When the focus is on the dropdown menu and the user uses an `#innerBottom` or `#outerBottom` attribute with a custom slot with an interactive element:
  - You can use the `Tab` key to switch to these interactive elements
  - When the focus is on the first interactive element of the custom slot, use `Shift` + `Tab` to return the focus to the Select box

**Select with Filter function:**

- When Select is focused, keyboard users can open dropdown menus with `Up Arrow` or `Down Arrow` or `Enter` keys. At this point, the focus is still on the Select box, the user can enter content, and can also use the `up arrow` or `down arrow` to switch options
- When the dropdown menu is open: the keyboard interaction is the same as Select without the Filter function
- When the focus is on the Select box, and the user uses an `#innerBottom` or `#outerBottom` property with a custom slot with an interactive element:
  - You can use the `Tab` key to switch to these interactive elements
  - When the focus is on the first interactive element of the custom slot, use `Shift` + `Tab` to return the focus to the Select box

## Content Guidelines

- Selector trigger
  - Describe in 1-3 words the input that the user needs to make
  - Use statement writing conventions (first letter uppercase, rest lowercase)
  - Avoid punctuation and prepositions ("the", "an", "a")
  - Labels need to be independent statements. Don't let the label be the first half of the statement and the option the second half of the statement.
  - Use descriptive sentences, not indicative ones. Help text is available under the select box if the option needs more explanation.
- Selector options
  - If there is no default option, use "Select" as placeholder copy
  - Options should be in alphabetical order or other logical order to make it easier for users to find options
  - Use statement writing conventions (first letter uppercase, rest lowercase), avoid commas and semicolons at the end of sentences
  - Clearly articulate the purpose of the choice indicated by the option

## Design Tokens

::token-table{component="select"}
::

## Related Material

See [Form](/en-us/components/form/) for related compositions.

## TypeScript types

The Vue Select component does not accept React `<Select<T>>` generic parameters. Declare state with SelectModelValue and narrow the change payload to your business type; check arrays when multiple is true.

```ts
import { shallowRef } from 'vue';
import type { SelectModelValue } from '@aifuxi/semi-ui-vue/select';
const selected = shallowRef<string[]>([]);
function change(value: SelectModelValue) {
  if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
    selected.value = value;
  }
}
```

## React → Vue migration

| React                                                                   | Vue                                                                                       |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `@douyinfe/semi-ui`                                                     | `@aifuxi/semi-ui-vue/select` + `@aifuxi/semi-theme-default/select.css`                    |
| `useState` / `useMemo` / `useCallback`                                  | `shallowRef` / `computed` / local functions                                               |
| `value` + `onChange`                                                    | `v-model` / `v-model:value` / `:value` + `@change`                                        |
| `className` / `ReactNode`                                               | Vue `class` / `VNodeChild` and slots                                                      |
| `ref.current`                                                           | public methods on a template ref                                                          |
| `Select.Option` / `Select.OptGroup`                                     | `SelectOption` / `SelectOptionGroup`                                                      |
| `renderOptionItem` / `renderCreateItem`                                 | `#option` / `#createItem`                                                                 |
| `renderSelectedItem`                                                    | `#selectedItem="{ option, index }"`                                                       |
| `triggerRender`                                                         | `#trigger="{ value, inputValue, disabled, placeholder, onSearch, onClear, onRemove }"`    |
| `innerTopSlot` / `outerTopSlot` / `innerBottomSlot` / `outerBottomSlot` | `#innerTop` / `#outerTop` / `#innerBottom` / `#outerBottom`                               |
| `isRenderInTag: false`                                                  | The slot retains the built-in Tag and close button; wrapper replacement is not equivalent |

Async and dynamic demos use fixed sequences, fixed delays and request ids, with timer cleanup on unmount. They do not make network requests.

Custom avatars use project-owned /demos/photo.svg, one.svg and two.svg. English demo order differs from Chinese and is mapped by intent. Avatar substitution and custom Tag wrapper differences have not passed visual acceptance.

## FAQ

### Why should labels be unique?

Foundation identifies options by label. Identical display text also makes choices ambiguous; applications may share a company value while using distinct labels. Labels must remain distinguishable after groups close. Use stable identities for VNode labels and clear user-facing text.

### Why does an empty result appear before a remote request completes?

Set remote to disable local matching against the current optionList. Use loading while waiting and accept only the latest request.

### How should option text update after switching locale?

Use a reactive optionList or update SelectOption label/text with an appropriate stable key. The Vue collector tracks simple labels, text and disabled. Use a locale-dependent key when complex slots or nested groups change.

### How can disabled options update dynamically?

Bind disabled to reactive state. For complex groups, update keys or use optionList; do not rely on React children update rules.

### How is dropdown width controlled?

By default the control supplies a minimum width rather than a fixed width. Set dropdownStyle.width for an explicit width.

### Why does allowCreate ignore external option updates?

allowCreate takes over local option creation and no longer follows external optionList/option-slot changes; use it for local entry creation.

### Why does selection or Escape not emit blur?

Closing the panel preserves trigger focus so Enter can reopen it; blur concerns leaving the control.

### Can a custom selected Tag replace its entire wrapper?

The selectedItem slot lives inside the built-in Select Tag and retains its close button. It does not provide React isRenderInTag:false wrapper replacement. Demos preserve avatar shapes, text and close actions; the outer DOM difference is not visually accepted.
