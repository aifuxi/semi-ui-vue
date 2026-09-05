---
title: 'Cascader'
description: 'Used to select an option under a multi-level classification.'
locale: 'en-US'
slug: 'cascader'
category: 'input'
order: 36
englishTitle: 'Cascader'
icon: 'doc-cascader'
upstream: 'input/cascader'
---

## Usage scenarios

Differences from TreeSelect component:

- TreeSelect: The core value lies in **target node**. The structure is to facilitate users to quickly filter out target options. The final node is what the user wants. It is commonly used in file/folder selection, organizational structure, permission allocation and other scenarios.
- Cascader: The core selection value lies in the **path**. What the user selects is not an isolated point, but a complete path from root to leaf, which is often used in scenarios such as geographical location and product classification.

## Demos

### How to import

```ts
import { Cascader } from '@aifuxi/semi-ui-vue/cascader';
import '@aifuxi/semi-theme-default/cascader.css';
```

### Basic Usage

Basic usage, only leaf nodes can be selected by default.

::demo-block{demo="cascader/en-us/Basic" title="Basic Usage"}
::

### Multiple

Set `multiple` to make multiple selections.

::demo-block{demo="cascader/en-us/Multiple" title="Multiple"}
::

### Searchable

Use `filterTreeNode` to support search input.

By default, the `label` value is searched (using the includes method of the string for matching, case-insensitive). You can specify other attribute values ​​​​through `treeNodeFilterProp` to search. For example, If `label` is VNodeChild, you can use other fields in treeData to store plain text, and specify the field for search through `treeNodeFilterProp`.

The default search results will only display the paths of leaf nodes. If you want to display more results, you can set `filterLeafOnly` to `false`.

::demo-block{demo="cascader/en-us/Search" title="Searchable"}
::

### Searchable Multiple Selection

When multiple selection and search are supported at the same time, in this scenario, you can delete the corresponding selected item by pressing the BackSpace key.

::demo-block{demo="cascader/en-us/SearchMultiple" title="Searchable Multiple Selection"}
::

Filtered data can be sorted using `filterSorter`, `filterSorter` is available since v2.28.0.

::demo-block{demo="cascader/en-us/SearchSort" title="Searchable Multiple Selection"}
::

If you want to customize the rendering options after the search, you can use `filterRender` to achieve custom rendering of the entire line. The `filterRender` is available since v2.28.0, parameters are as follows:

```ts
export interface CascaderFilterRenderProps {
  className: string;
  inputValue: string;
  disabled: boolean;
  data: CascaderData[];
  checkStatus: { checked: boolean; halfChecked: boolean };
  selected: boolean;
  onClick(event: MouseEvent | KeyboardEvent): void;
  onCheck(event: MouseEvent | KeyboardEvent): void;
  style?: CSSProperties;
}
```

The example is as follows

::demo-block{demo="cascader/en-us/SearchRender" title="Searchable Multiple Selection"}
::

If there are a lot of options in the search results, you can optimize performance by setting virtualizeInSearch to enable the virtualization of the search result panel. virtualizeInSearch has been available since v2.44.0. virtualizeInSearch is an object containing the following values:

- height: Option list height value
- width: Option list width value
- itemSize: The height of each row of Option

::demo-block{demo="cascader/en-us/VirtualSearch" title="Searchable Multiple Selection"}
::

### Limit Tags Displayed

When multiple selections, you can use `maxTagCount` to limit the number of tags displayed, and the excess will be displayed as +N.

You can use `showRestTagsPopover` to set whether hover +N displays Popover after maxTagCount is exceeded, the default is false. And, you can also configure Popover in the `restTagsPopoverProps` property.

::demo-block{demo="cascader/en-us/MaxTagCount" title="Limit Tags Displayed"}
::

### Limit Tags Number

In a multi-selection scene, use max to limit the number of multi-selection selections. After max is exceeded, the @exceed callback will be triggered.

::demo-block{demo="cascader/en-us/Max" title="Limit Tags Number"}
::

### Change on Select

In the case of single selection, you can also set `changeOnSelect` to allow the parent option to be selected.

::demo-block{demo="cascader/en-us/ChangeOnSelect" title="Change on Select"}
::

### Custom Display Property

Set `displayProp` to select which property in the data you would like to display. By default, `label` is displayed.

::demo-block{demo="cascader/en-us/DisplayProp" title="Custom Display Property"}
::

The return format can be set by setting `displayRender`.

When single selection (`multiple=false`), `#display="{ selected }"`, where labelPath is a path array composed of labels.

When multiple selection (`multiple=true`), `#display="{ selected, index }"`, where item is the relevant data of the node.

```ts
export interface CascaderEntity extends Record<string, unknown> {
  _notExist?: boolean;
  children?: CascaderEntity[];
  data: CascaderData;
  ind: number;
  key: string;
  level: number;
  parent?: CascaderEntity;
  parentKey?: string | null;
  path: string[];
  pos: string;
  valuePath: Array<string | number>;
}
```

::demo-block{demo="cascader/en-us/DisplayRender" title="Custom Display Property"}
::

### Custom Separator

Version: >=2.2.0

You can use `separator` to set the separator, including: the separator of the content displayed in the dropdown during search and displayed in the Trigger during single selection.

::demo-block{demo="cascader/en-us/Separator" title="Custom Separator"}
::

### Disabled

::demo-block{demo="cascader/en-us/Disabled" title="Disabled"}
::

### Disable Strictly

You can use disableStrictly to enable strict disabling. After enabling strict disabling, when the node is disabled, the selected state cannot be changed through the relationship between the child or the parent.

Take the following demo as an example, the node "Music" is strictly disabled. Therefore, when we change the selected state of its parent node "Impressionism", it will not affect the selected state of the node "Music".

::demo-block{demo="cascader/en-us/DisableStrictly" title="Disable Strictly"}
::

### the Way of Expand Menu

You can use `showNext` to set the time to expand the Dropdown submenu, optional: `click` (default), `hover`.

::demo-block{demo="cascader/en-us/Hover" title="the Way of Expand Menu"}
::

### Click to Select

In multiple mode, clicking on non-leaf nodes does not trigger selection by default. You can use `clickToSelect` to enable selecting any node on click.

This API is especially useful when combined with `showNext="hover"`: hovering expands the submenu, while clicking selects the current node.

::demo-block{demo="cascader/en-us/ClickToSelect" title="Click to Select"}
::

### Additional items

We have reserved slots at the top and bottom of the cascade selector. You can set them through bottomSlot or topSlot.

::demo-block{demo="cascader/en-us/BottomSlot" title="Additional items"}
::

### Controlled Component

You can use `value` along with `@change` property if you want to use Cascader as a controlled component.

::demo-block{demo="cascader/en-us/Controlled" title="Controlled Component"}
::

### Auto Merge Value

In the multi-selection (multiple=true) scenario, when we select the ancestor node, if we want the value not to include its corresponding descendant nodes, we can set it by `autoMergeValue`, and the default is true. When `autoMergeValue` and `leafOnly` are turned on at the same time, the latter has a higher priority.

::demo-block{demo="cascader/en-us/AutoMerge" title="Auto Merge Value"}
::

### Leaf Only

version: >=2.2.0

In multiple selection, you can set the value to include only leaf nodes by turning on leafOnly, that is, the displayed Tag and @change parameter values only include value.

::demo-block{demo="cascader/en-us/LeafOnly" title="Leaf Only"}
::

### Checked RelationShip

Version: >= 2.71.0

In multiple, `checkRelation` can be used to set the type of node selection relationship, optional: 'related' (default), 'unRelated'. When the selection relationship is 'unRelated', it means that selections between nodes do not affect each other.

::demo-block{demo="cascader/en-us/CheckRelation" title="Checked RelationShip"}
::

### Dynamic Update of Data

::demo-block{demo="cascader/en-us/DynamicData" title="Dynamic Update of Data"}
::

````

### Deep & long list

When your data structure level is particularly deep, the Cascader drop-down menu may be at the top of the screen. At this time, we recommend setting overflow -x: auto and a suitable width for the drop-down menu (it is recommended to use a width of N+0.5 columns, the most Expand to display half a column to give users a visual cue that they can scroll in the horizontal direction)

::demo-block{demo="cascader/en-us/LongList" title="Deep & long list"}
::

```css
.components-cascader-demo {
    .semi-cascader-option-lists {
        max-width: 510px;
        overflow-x: auto;
    }
}
````

### Load Async Data

You could use `loadData` to load data asynchronously.

**Could not be used together with searching**

::demo-block{demo="cascader/en-us/LoadData" title="Load Async Data"}
::

### Remote Search

**v>=2.97.0** Cascader supports remote search. With `remote` enabled, search input no longer goes through local filtering — only the `onSearch` callback is fired, and you are responsible for fetching `treeData` asynchronously based on the input. This mirrors Select's `remote` behavior.

> You should typically handle the following yourself when using remote search:
>
> - **Debounce**: avoid firing a request on every keystroke; wrapping the search handler with `lodash.debounce` (e.g. 200~300ms) is the common approach.
> - **Race-condition protection**: use an incrementing token or an `AbortController` to drop stale responses, otherwise an out-of-order earlier response may overwrite the latest one.
> - **Loading hint**: show a loading state via an outer `Spin` or other indicator while the request is in flight, otherwise users may misread an in-flight state as "no data".
> - **Empty / cleared input**: when the input is cleared, restore `treeData` to the initial state instead of querying with an empty keyword.

::demo-block{demo="cascader/en-us/Remote" title="Remote Search"}
::

### Custom Trigger

If the default trigger style cannot meet your needs, you can use `triggerRender` to customize the display of the select box

The parameters of triggerRender are as follows

```ts
export interface CascaderTriggerRenderProps {
  componentProps: CascaderProps;
  disabled: boolean;
  value?: string | Set<string>;
  inputValue: string;
  placeholder?: string;
  @search(inputValue: string): void;
  /** @deprecated Use @search. */
  @change(inputValue: string): void;
  onClear(event?: MouseEvent | KeyboardEvent): void;
  onRemove(position: string): void;
}
```

::demo-block{demo="cascader/en-us/Trigger" title="Custom Trigger"}
::

## API Reference

### CascaderProps

| Property               | Type                                                                                        | Default      | Description                                                                                                                                                                                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ariaDescribedby`      | `string`                                                                                    | `—`          | Description element ids.                                                                                                                                                                                                                                         |
| `ariaErrormessage`     | `string`                                                                                    | `—`          | Error message element id.                                                                                                                                                                                                                                        |
| `ariaInvalid`          | `boolean \| 'false' \| 'true' \| 'grammar' \| 'spelling'`                                   | `—`          | ARIA invalid state.                                                                                                                                                                                                                                              |
| `ariaLabel`            | `string`                                                                                    | `'Cascader'` | Accessible name; use aria-label in templates.                                                                                                                                                                                                                    |
| `ariaLabelledby`       | `string`                                                                                    | `—`          | Label element ids; use aria-labelledby in templates.                                                                                                                                                                                                             |
| `ariaRequired`         | `boolean \| 'false' \| 'true'`                                                              | `—`          | ARIA required state.                                                                                                                                                                                                                                             |
| `arrowIcon`            | `VNodeChild`                                                                                | `—`          | Customize the right drop-down arrow Icon, when the showClear switch is turned on and there is currently a selected value, hover will give priority to the clear icon                                                                                             |
| `autoAdjustOverflow`   | `boolean`                                                                                   | `true`       | Whether to automatically adjust the expansion direction of the dropdown for automatic adjustment of the expansion direction during edge occlusion                                                                                                                |
| `autoClearSearchValue` | `boolean`                                                                                   | `true`       | Clear search text after selection.                                                                                                                                                                                                                               |
| `autoMergeValue`       | `boolean`                                                                                   | `true`       | Auto merge value. Specifically, after opening, when a parent node is selected, the value will not include the descendants of the node. Does not support dynamic switching                                                                                        |
| `borderless`           | `boolean`                                                                                   | `false`      | borderless mode >=2.33.0                                                                                                                                                                                                                                         |
| `bottomSlot`           | `VNodeChild`                                                                                | `—`          | bottom slot                                                                                                                                                                                                                                                      |
| `changeOnSelect`       | `boolean`                                                                                   | `false`      | Toggle whether non-leaf nodes are selectable                                                                                                                                                                                                                     |
| `checkRelation`        | `CascaderCheckRelation`                                                                     | `'related'`  | In multiple, the relationship between the checked states of the nodes, optional: 'related'、'unRelated'.                                                                                                                                                         |
| `class`                | `HTMLAttributes['class']`                                                                   | `—`          | Vue class binding.                                                                                                                                                                                                                                               |
| `className`            | `HTMLAttributes['class']`                                                                   | `—`          | ClassName                                                                                                                                                                                                                                                        |
| `clearIcon`            | `VNodeChild`                                                                                | `—`          | Can be used to customize the clear button, valid when showClear is true                                                                                                                                                                                          |
| `clickToSelect`        | `boolean`                                                                                   | `false`      | Multiple mode, clicking any node triggers selection. Useful with showNext="hover": hover expands submenu, click selects current node                                                                                                                             |
| `defaultOpen`          | `boolean`                                                                                   | `false`      | Set whether to open the dropDown by default                                                                                                                                                                                                                      |
| `defaultValue`         | `CascaderValue`                                                                             | `—`          | Default selected value                                                                                                                                                                                                                                           |
| `disabled`             | `boolean`                                                                                   | `false`      | Disabled status                                                                                                                                                                                                                                                  |
| `disableStrictly`      | `boolean`                                                                                   | `false`      | Set whether to enable strict prohibition. After opening, when the node is disabled, the selected state cannot be changed through the relationship between the child or the parent                                                                                |
| `displayProp`          | `string`                                                                                    | `'label'`    | Set the attribute value displayed by the backfill option displayed                                                                                                                                                                                               |
| `displayRender`        | `(selected: VNodeChild[] \| CascaderEntity, index?: number) => VNodeChild`                  | `—`          | Customize selected content; single mode receives display values and multiple mode a CascaderEntity. Also available as the display slot.                                                                                                                          |
| `dropdownClassName`    | `HTMLAttributes['class']`                                                                   | `—`          | ClassName property for the drop-down menu                                                                                                                                                                                                                        |
| `dropdownMargin`       | `PopoverMargin`                                                                             | `—`          | Popup layer calculates the size of the safe area when the current direction overflows, used in scenes covered by fixed elements, more detail refer to [issue#549](https://github.com/DouyinFE/semi-design/issues/549), same as Tooltip margin                    |
| `dropdownStyle`        | `StyleValue`                                                                                | `—`          | Inline style of drop-down menu                                                                                                                                                                                                                                   |
| `emptyContent`         | `VNodeChild`                                                                                | `—`          | Content displayed when the search has no result                                                                                                                                                                                                                  |
| `enableLeafClick`      | `boolean`                                                                                   | `false`      | Multiple mode, click the leaf option enable trigger check                                                                                                                                                                                                        |
| `expandIcon`           | `VNodeChild`                                                                                | `—`          | customize expand icon                                                                                                                                                                                                                                            |
| `filterLeafOnly`       | `boolean`                                                                                   | `true`       | Whether the search results only show the path of leaf nodes                                                                                                                                                                                                      |
| `filterRender`         | `(props: CascaderFilterRenderProps) => VNodeChild`                                          | `—`          | Customize search results; the filter slot is convenient for templates.                                                                                                                                                                                           |
| `filterSorter`         | `(first: CascaderData[], second: CascaderData[], inputValue: string) => number`             | `—`          | Sort matching paths; receives two CascaderData[] paths and the search text.                                                                                                                                                                                      |
| `filterTreeNode`       | `boolean \| ((inputValue: string, treeNodeString: string, data?: CascaderData) => boolean)` | `false`      | Set filter, the value of treeNodeFilterProp is used for searching, data parameter provided since v2.28.0                                                                                                                                                         |
| `getPopupContainer`    | `() => HTMLElement`                                                                         | `—`          | Specify the parent DOM, the drop-down box will be rendered into the DOM, the customization needs to set position: relative This will change the DOM tree position, but not the view's rendering position.                                                        |
| `id`                   | `string`                                                                                    | `—`          | Component element id.                                                                                                                                                                                                                                            |
| `insetLabel`           | `VNodeChild`                                                                                | `—`          | Inset label, also available as the insetLabel slot.                                                                                                                                                                                                              |
| `insetLabelId`         | `string`                                                                                    | `—`          | Inset label element id.                                                                                                                                                                                                                                          |
| `keyMaps`              | `CascaderKeyMaps`                                                                           | `({})`       | Customize the fields of value, label, children, disabled, isLeaf in the node                                                                                                                                                                                     |
| `leafOnly`             | `boolean`                                                                                   | `false`      | When multiple selections, the set value only includes leaf nodes, that is, the displayed Tag and onChange value parameters only include leaf nodes. Does not support dynamic switching                                                                           |
| `loadData`             | `(selectOptions: CascaderData[]) => Promise<void>`                                          | `—`          | Load data asynchronously and the return value should be a promise                                                                                                                                                                                                |
| `loadedKeys`           | `string[]`                                                                                  | `—`          | Keys of nodes whose asynchronous loading has completed.                                                                                                                                                                                                          |
| `max`                  | `number`                                                                                    | `—`          | In the case of multiple selections, the number of multiple selections is limited, and the onExceed callback will be triggered when max is exceeded                                                                                                               |
| `maxTagCount`          | `number`                                                                                    | `—`          | When multiple selections, the maximum number of labels to be displayed will be displayed in the form of +N after exceeding                                                                                                                                       |
| `modelValue`           | `CascaderValue`                                                                             | `—`          | Controlled value for v-model.                                                                                                                                                                                                                                    |
| `motion`               | `boolean`                                                                                   | `true`       | Set the pop-up animation of the dropdown box                                                                                                                                                                                                                     |
| `mouseEnterDelay`      | `number`                                                                                    | `—`          | After the mouse is moved in, the time to delay the display of the dropdown box, in milliseconds                                                                                                                                                                  |
| `mouseLeaveDelay`      | `number`                                                                                    | `—`          | After the mouse is moved out, the time to hide the display of the dropdown box, in milliseconds                                                                                                                                                                  |
| `multiple`             | `boolean`                                                                                   | `false`      | Set multiple                                                                                                                                                                                                                                                     |
| `onChangeWithObject`   | `boolean`                                                                                   | `false`      | Toggle whether to return all properties in an option as a return value. When set to true, return value looks like CascaderData. For controlled mode, you need to pass CascaderData to value correspondingly. DefaultValue similarly.                             |
| `placeholder`          | `string`                                                                                    | `—`          | Placeholder                                                                                                                                                                                                                                                      |
| `position`             | `PopoverPosition`                                                                           | `—`          | Popup position.                                                                                                                                                                                                                                                  |
| `prefix`               | `VNodeChild`                                                                                | `—`          | Prefix label                                                                                                                                                                                                                                                     |
| `preventScroll`        | `boolean`                                                                                   | `—`          | Indicates whether the browser should scroll the document to display the newly focused element, acting on the focus method inside the component, excluding the component passed in by the user                                                                    |
| `remote`               | `boolean`                                                                                   | `false`      | Whether to enable remote search. When enabled, local filtering is skipped on input change; only the `onSearch` callback is fired so that the consumer can update `treeData` asynchronously to render remote search results, mirroring Select's `remote` behavior |
| `restTagsPopoverProps` | `PopoverProps`                                                                              | `({})`       | Remaining-tag popup configuration; follow the current public type. Select uses Partial.                                                                                                                                                                          |
| `searchPlaceholder`    | `string`                                                                                    | `—`          | Placeholder for search input                                                                                                                                                                                                                                     |
| `searchPosition`       | `CascaderSearchPosition`                                                                    | `'trigger'`  | Set the position of the search box, `trigger` or `custom`                                                                                                                                                                                                        |
| `separator`            | `string`                                                                                    | `' / '`      | Custom separator, including: the separator of the content displayed in the dropdown during search and displayed in the Trigger during single selection                                                                                                           |
| `showClear`            | `boolean`                                                                                   | `false`      | Toggle whether to show clear button                                                                                                                                                                                                                              |
| `showNext`             | `CascaderShowNext`                                                                          | `'click'`    | Set the way to expand the Dropdown submenu, one of: `click`、`hover`                                                                                                                                                                                             |
| `showRestTagsPopover`  | `boolean`                                                                                   | `false`      | When the number of tags exceeds maxTagCount and hover reaches +N, whether to display the remaining content through Popover                                                                                                                                       |
| `size`                 | `CascaderSize`                                                                              | `'default'`  | Selectbox size, one of `large`, `small`, `default`                                                                                                                                                                                                               |
| `stopPropagation`      | `boolean \| string`                                                                         | `true`       | Whether to prevent the click event on the dropdown box from bubbling                                                                                                                                                                                             |
| `style`                | `StyleValue`                                                                                | `—`          | Inline style                                                                                                                                                                                                                                                     |
| `suffix`               | `VNodeChild`                                                                                | `—`          | Suffix label                                                                                                                                                                                                                                                     |
| `topSlot`              | `VNodeChild`                                                                                | `—`          | top slot                                                                                                                                                                                                                                                         |
| `treeData`             | `CascaderData[]`                                                                            | `[]`         | Render data. Refer to [CascaderData](#CascaderData) for detailed formatting.                                                                                                                                                                                     |
| `treeNodeFilterProp`   | `string`                                                                                    | `'label'`    | When searching, the input item filters the corresponding CascaderData property.                                                                                                                                                                                  |
| `triggerRender`        | `(props: CascaderTriggerRenderProps) => VNodeChild`                                         | `—`          | Custom trigger; prefer the trigger scoped slot.                                                                                                                                                                                                                  |
| `validateStatus`       | `CascaderValidateStatus`                                                                    | `'default'`  | The validation status of the trigger only affects the display style. Optional: default、error、warning                                                                                                                                                           |
| `value`                | `CascaderValue`                                                                             | `—`          | Value property (required)                                                                                                                                                                                                                                        |
| `virtualizeInSearch`   | `CascaderVirtualize`                                                                        | `—`          | Search result list virtualization, used when there are a large number of tree nodes, composed of height, width,itemSize                                                                                                                                          |
| `zIndex`               | `number`                                                                                    | `1030`       | zIndex for dropdown menu                                                                                                                                                                                                                                         |

### CascaderData

| Property   | Type               | Default | Description                     |
| ---------- | ------------------ | ------- | ------------------------------- |
| `value`    | `string \| number` | `—`     | Value property (required)       |
| `label`    | `VNodeChild`       | `—`     | Text to be displayed (required) |
| `disabled` | `boolean`          | `—`     | Disabled status                 |
| `isLeaf`   | `boolean`          | `—`     | leaf node                       |
| `loading`  | `boolean`          | `—`     | loading                         |
| `children` | `CascaderData[]`   | `—`     | children node                   |

### CascaderKeyMaps

| Property   | Type     | Default | Description                     |
| ---------- | -------- | ------- | ------------------------------- |
| `value`    | `string` | `—`     | Value property (required)       |
| `label`    | `string` | `—`     | Text to be displayed (required) |
| `disabled` | `string` | `—`     | Disabled status                 |
| `children` | `string` | `—`     | children node                   |
| `isLeaf`   | `string` | `—`     | leaf node                       |

### CascaderVirtualize

| Property   | Type               | Default | Description                  |
| ---------- | ------------------ | ------- | ---------------------------- |
| `itemSize` | `number`           | `—`     | Fixed item height in pixels. |
| `height`   | `number \| string` | `—`     | Virtual list height.         |
| `width`    | `number \| string` | `—`     | Virtual list width.          |

### Events

| Event               | Payload                                                |
| ------------------- | ------------------------------------------------------ |
| `blur`              | `[event: unknown]`                                     |
| `change`            | `[value: CascaderValue]`                               |
| `clear`             | `[]`                                                   |
| `exceed`            | `[checkedItems: CascaderEntity[]]`                     |
| `focus`             | `[event: unknown]`                                     |
| `listScroll`        | `[event: Event, panel: CascaderScrollPanelProps]`      |
| `load`              | `[loadedKeys: Set<string>, data: CascaderData]`        |
| `search`            | `[value: string]`                                      |
| `select`            | `[value: string \| number \| Array<string \| number>]` |
| `visibleChange`     | `[visible: boolean]`                                   |
| `update:modelValue` | `[value: CascaderValue]`                               |
| `update:value`      | `[value: CascaderValue]`                               |

Use @dropdown-visible-change for AutoComplete/Select and @visible-change for Cascader. Convert other camelCase events to kebab-case. onChangeWithObject is a Boolean prop, not an event.

### Slots

| Slot          | Signature                                                                             |
| ------------- | ------------------------------------------------------------------------------------- |
| `#arrowIcon`  | `() => VNodeChild`                                                                    |
| `#bottom`     | `() => VNodeChild`                                                                    |
| `#clearIcon`  | `() => VNodeChild`                                                                    |
| `#display`    | `(props: { selected: VNodeChild[] \| CascaderEntity; index?: number }) => VNodeChild` |
| `#empty`      | `() => VNodeChild`                                                                    |
| `#expandIcon` | `() => VNodeChild`                                                                    |
| `#filter`     | `(props: CascaderFilterRenderProps) => VNodeChild`                                    |
| `#prefix`     | `() => VNodeChild`                                                                    |
| `#suffix`     | `() => VNodeChild`                                                                    |
| `#top`        | `() => VNodeChild`                                                                    |
| `#trigger`    | `(props: CascaderTriggerRenderProps) => VNodeChild`                                   |

### Related types

```ts
export type CascaderSimpleValue = string | number | CascaderData;
export type CascaderValue = CascaderSimpleValue | CascaderSimpleValue[] | CascaderSimpleValue[][];
export interface CascaderEntity extends Record<string, unknown> {
  _notExist?: boolean;
  children?: CascaderEntity[];
  data: CascaderData;
  ind: number;
  key: string;
  level: number;
  parent?: CascaderEntity;
  parentKey?: string | null;
  path: string[];
  pos: string;
  valuePath: Array<string | number>;
}
export interface CascaderFilterRenderProps {
  className: string;
  inputValue: string;
  disabled: boolean;
  data: CascaderData[];
  checkStatus: { checked: boolean; halfChecked: boolean };
  selected: boolean;
  onClick(event: MouseEvent | KeyboardEvent): void;
  onCheck(event: MouseEvent | KeyboardEvent): void;
  style?: CSSProperties;
}
export interface CascaderTriggerRenderProps {
  componentProps: CascaderProps;
  disabled: boolean;
  value?: string | Set<string>;
  inputValue: string;
  placeholder?: string;
  @search(inputValue: string): void;
  /** @deprecated Use @search. */
  @change(inputValue: string): void;
  onClear(event?: MouseEvent | KeyboardEvent): void;
  onRemove(position: string): void;
}
export interface CascaderScrollPanelProps {
  panelIndex: number;
  activeNode: CascaderData | null;
}
export type CascaderSize = 'small' | 'default' | 'large';
export type CascaderValidateStatus = 'success' | 'default' | 'error' | 'warning';
export type CascaderShowNext = 'click' | 'hover';
export type CascaderSearchPosition = 'trigger' | 'custom';
export type CascaderCheckRelation = 'related' | 'unRelated';
```

## Methods

Use a template ref to call these public instance methods.

```ts
export interface CascaderExposed {
  open(): void;
  close(): void;
  focus(): void;
  blur(): void;
  search(value: string): void;
}
```

## Accessibility

### ARIA

- Cascader supports importing `aria-label`, `aria-describedby`, `aria-errormessage`, `aria-invalid`, `aria-labelledby`, `aria-required` to indicate the relevant information of the Cascader;
- Cascader supports selecting options, clearing options, and expanding drop-down box by pressing the Enter key

### Keyboard and focus

Use Tab / Shift + Tab to move focus, Enter to open, select or clear, and Escape to close. Custom filter/trigger slots must retain the supplied action callbacks and accessible names.

## Design Tokens

::token-table{component="cascader"}
::

## React → Vue migration

| React                                              | Vue                                                                        |
| -------------------------------------------------- | -------------------------------------------------------------------------- |
| `@douyinfe/semi-ui`                                | `@aifuxi/semi-ui-vue/cascader` + `@aifuxi/semi-theme-default/cascader.css` |
| `useState` / `useMemo` / `useCallback`             | `shallowRef` / `computed` / local functions                                |
| `value` + `onChange`                               | `v-model` / `v-model:value` / `:value` + `@change`                         |
| `className` / `ReactNode`                          | Vue `class` / `VNodeChild` and slots                                       |
| `ref.current`                                      | public methods on a template ref                                           |
| `filterRender` / `displayRender` / `triggerRender` | `#filter` / `#display` / `#trigger` or public VNode-returning functions    |
| `bottomSlot` / `topSlot`                           | `#bottom` / `#top`                                                         |
| `onDropdownVisibleChange`                          | `@visible-change`                                                          |
| `loadData`                                         | `(selected: CascaderData[]) => Promise<void>`                              |

Async and dynamic demos use fixed sequences, fixed delays and request ids, with timer cleanup on unmount. They do not make network requests.

## FAQ

### Which array shape should value use?

Use a flat array for one selected path and a nested array for multiple paths. onChangeWithObject returns node objects. autoMergeValue, leafOnly and checkRelation determine which nodes remain in multiple selection.

### How do loadData and remote search differ?

loadData returns Promise<void> and fills children when a node expands; mark leaves with isLeaf. Remote search replaces treeData in response to search without local tree filtering.

### Is value in a custom trigger the business value?

The trigger slot receives node position strings or a Set of positions; onRemove accepts a position. Business values still use CascaderValue through v-model.
