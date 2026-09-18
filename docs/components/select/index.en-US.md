# Select

Select aligns with Semi Design v2.102.0 and keeps the `.semi-select*` DOM/classes, Portal positioning, multiple tags, virtualization, keyboard and ARIA contracts. The public entry is the `@aifuxi/semi-ui-vue` root export and the `@aifuxi/semi-ui-vue/select` subpath; the default and named `Select` exports are the same object and carry the `Select.Option` / `Select.OptGroup` statics.

## Basic usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Select, SelectOption } from '@aifuxi/semi-ui-vue';

const value = ref('douyin');
</script>

<template>
  <Select v-model="value" placeholder="Choose">
    <SelectOption value="douyin" label="Douyin" />
    <SelectOption value="lark" label="Lark" />
  </Select>
</template>
```

`v-model` binds `modelValue`. A selection notifies in the order `select → change → update:modelValue → update:value`; when both `value` and `modelValue` are present, `value` wins, and the Vue update events do not change the Semi `change` payload.

## Array options, multiple and groups

Pass `option-list` with `{ value, label }` items; the default slot carries declarative children through `Select.Option`, and `Select.OptGroup` groups them.

```vue
<template>
  <Select multiple :max-tag-count="2" show-rest-tags-popover :option-list="options" />
  <Select>
    <Select.OptGroup label="Frontend">
      <Select.Option value="vue" label="Vue" />
    </Select.OptGroup>
  </Select>
</template>
```

Multiple values are arrays; selections beyond `maxTagCount` collapse into `+N`, `showRestTagsPopover` shows the rest in a popover, `expandRestTagsOnClick` expands them while the panel is open, and exceeding `max` emits `exceed`.

## Search, remote data and created items

- `filter` accepts `true` (label matching) or `(inputValue, option) => boolean`; `searchPosition="dropdown"` places the search box at the top of the panel.
- `remote` disables local filtering and emits `search(value, event)` so callers can update `option-list`.
- `allowCreate` with `filter` enables created items: `create(option)` is emitted before the selection chain, and `#createItem` customizes the row.
- `autoClearSearchValue` defaults to `true` and clears the query after selecting; set it to `false` in multiple mode to keep the query.

## Custom rendering and attach slots

React render props map to Vue scoped slots; the same-named function props stay available:

| React                              | Vue                                                                              |
| ---------------------------------- | -------------------------------------------------------------------------------- |
| `triggerRender`                    | `#trigger="{ value, inputValue, disabled, onSearch, onClear, onRemove }"`        |
| `renderOptionItem`                 | `#option="{ option, focused, selected, inputValue, onClick, onMouseenter }"`     |
| `renderSelectedItem`               | `#selectedItem="{ option, index }"`                                              |
| `renderCreateItem`                 | `#createItem="{ inputValue, focused, style }"`                                   |
| `arrowIcon` / `clearIcon`          | `#arrowIcon` / `#clearIcon`                                                      |
| `prefix` / `suffix`                | `#prefix` / `#suffix`, or the same-named VNode props                             |
| `insetLabel`                       | `#insetLabel` or the same-named VNode prop                                       |
| `outerTopSlot` / `outerBottomSlot` | `#outerTop` / `#outerBottom` (siblings of the list)                              |
| `innerTopSlot` / `innerBottomSlot` | `#innerTop` / `#innerBottom` (inside the list)                                   |
| `emptyContent`                     | `#emptyContent` or the same-named prop; an explicit `null` hides the empty state |

## Virtualization, Portal and positioning

`virtualize="{ height, width, itemSize }"` enables the virtual list (default height 270px; keep `maxHeight` in sync to avoid double scrollbars). `getPopupContainer` selects the Portal target and defaults to `document.body`. `position` defaults to `bottomLeft` (LTR) or `bottomRight` (RTL), `spacing` defaults to 4, `rePosKey` triggers repositioning, `dropdownMatchSelectWidth` limits the minimum dropdown width to the trigger, and `dropdownClassName` / `dropdownStyle` apply to the popup root.

## Controlled and uncontrolled

- Uncontrolled: `defaultValue` / `defaultOpen` seed the internal selection, input and open state.
- Controlled: when `value` or `modelValue` is present, rendering follows props and the component never commits a selection by itself; write back from `change` / `update:modelValue`.
- `onChangeWithObject` controls whether `change` receives the full option object; `defaultActiveFirstOption` defaults to `true`, so `Enter` selects the highlighted option.

## API

### Select Props

| Prop                                                                                       | Type                                                   | Default                                                     |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------ | ----------------------------------------------------------- |
| `value` / `modelValue`                                                                     | `SelectPrimitive \| Record<string, unknown> \| array`  | -                                                           |
| `defaultValue`                                                                             | same as above                                          | -                                                           |
| `optionList`                                                                               | `{ value, label, disabled?, showTick? }[]`             | -                                                           |
| `multiple`                                                                                 | `boolean`                                              | `false`                                                     |
| `max` / `maxTagCount`                                                                      | `number`                                               | -                                                           |
| `showRestTagsPopover`                                                                      | `boolean`                                              | `false`                                                     |
| `restTagsPopoverProps`                                                                     | `TooltipProps` subset                                  | -                                                           |
| `expandRestTagsOnClick`                                                                    | `boolean`                                              | `false`                                                     |
| `ellipsisTrigger`                                                                          | `boolean`                                              | `false`                                                     |
| `filter`                                                                                   | `boolean \| (inputValue, option) => boolean`           | `false`                                                     |
| `remote`                                                                                   | `boolean`                                              | `false`                                                     |
| `searchPosition`                                                                           | `'trigger' \| 'dropdown'`                              | `'trigger'`                                                 |
| `searchPlaceholder`                                                                        | `string`                                               | -                                                           |
| `autoClearSearchValue`                                                                     | `boolean`                                              | `true`                                                      |
| `allowCreate`                                                                              | `boolean`                                              | `false`                                                     |
| `defaultActiveFirstOption`                                                                 | `boolean`                                              | `true`                                                      |
| `onChangeWithObject`                                                                       | `boolean`                                              | `false`                                                     |
| `defaultOpen`                                                                              | `boolean`                                              | `false`                                                     |
| `clickToHide`                                                                              | `boolean`                                              | `false` (declared by the pinned adapter, no extra behavior) |
| `disabled` / `borderless`                                                                  | `boolean`                                              | `false`                                                     |
| `loading`                                                                                  | `boolean`                                              | `false`                                                     |
| `size`                                                                                     | `'small' \| 'default' \| 'large'`                      | `'default'`                                                 |
| `validateStatus`                                                                           | `'default' \| 'warning' \| 'error'`                    | `'default'`                                                 |
| `placeholder` / `emptyContent`                                                             | `VNodeChild` (`emptyContent` may be `null`)            | `''` / -                                                    |
| `showArrow` / `showClear`                                                                  | `boolean`                                              | `true` / `false`                                            |
| `insetLabelId` / `id`                                                                      | `string`                                               | -                                                           |
| `autoFocus`                                                                                | `boolean`                                              | `false` (declared by the pinned adapter, no extra behavior) |
| `preventScroll`                                                                            | `boolean`                                              | `false`; applied to the public `focus()`                    |
| `inputProps`                                                                               | `InputHTMLAttributes` subset                           | -                                                           |
| `position`                                                                                 | `TooltipPosition`                                      | `'bottomLeft'` (`'bottomRight'` in RTL)                     |
| `spacing` / `dropdownMargin`                                                               | `number \| TooltipSpacing` / `number \| TooltipMargin` | `4` / -                                                     |
| `getPopupContainer`                                                                        | `() => HTMLElement`                                    | `() => document.body`                                       |
| `dropdownMatchSelectWidth`                                                                 | `boolean`                                              | `true`                                                      |
| `dropdownClassName` / `dropdownStyle`                                                      | class / style                                          | -                                                           |
| `maxHeight` / `virtualize`                                                                 | `string \| number` / `{ height?, width?, itemSize? }`  | `270` / -                                                   |
| `motion` / `stopPropagation`                                                               | `boolean`                                              | `true` / `true`                                             |
| `autoAdjustOverflow`                                                                       | `boolean`                                              | `true`                                                      |
| `mouseEnterDelay` / `mouseLeaveDelay`                                                      | `number`                                               | -                                                           |
| `rePosKey`                                                                                 | `string \| number`                                     | -                                                           |
| `zIndex`                                                                                   | `number`                                               | `1030`                                                      |
| `ariaLabelledby` / `ariaDescribedby` / `ariaErrormessage` / `ariaInvalid` / `ariaRequired` | native ARIA attributes                                 | -                                                           |

### Select.Option

| Prop              | Type                   | Default |
| ----------------- | ---------------------- | ------- |
| `value`           | `string \| number`     | -       |
| `label`           | `VNodeChild`           | -       |
| `disabled`        | `boolean`              | `false` |
| `showTick`        | `boolean`              | -       |
| `class` / `style` | Vue native class/style | -       |

### Select.OptGroup

| Prop              | Type                   | Default |
| ----------------- | ---------------------- | ------- |
| `label`           | `VNodeChild`           | -       |
| `class` / `style` | Vue native class/style | -       |

### Events

`change(value)`, `select(value, option)`, `deselect(value, option)`, `clear()`, `create(option)`, `exceed(option)`, `search(value, event?)`, `listScroll(event)`, `dropdownVisibleChange(visible)`, `focus(event)`, `blur(event)`, `update:modelValue(value)`, `update:value(value)`.

### Methods

Through the component ref: `open()`, `close()`, `focus()`, `search(value, event?)`, `clearInput()`, `selectAll()`, `deselectAll()`, `rePosition()`.

### Slots

`default` (declarative `Select.Option` / `Select.OptGroup`), `arrowIcon`, `clearIcon`, `createItem`, `emptyContent`, `innerBottom`, `innerTop`, `insetLabel`, `option`, `outerBottom`, `outerTop`, `prefix`, `selectedItem`, `suffix`, `trigger`. Scoped fields are listed in the table above; `#option` also receives the pinned `SelectOptionRuntime` fields (`value`, `label`, `disabled`, `_selected`, …).

## Accessibility and keyboard

- The trigger uses `role="combobox"`, `aria-expanded`, `aria-controls` and `aria-activedescendant`; the list is `role="listbox"`, options are `role="option"` with `aria-selected` / `aria-disabled`.
- `ArrowDown` / `ArrowUp` move the highlight, `Enter` selects, `Escape` closes and keeps focus on the trigger, `Tab` leaves; in multiple mode `Backspace` removes the last tag.
- Closing the panel does not move focus: this follows the pinned post-v2.17.0 behavior, so selecting a single option does not emit `blur`.

## Theme, RTL and SSR

- Classes and theme tokens follow the pinned `.semi-select*` surface; the per-component style entry is `@aifuxi/semi-theme-default/select.css`.
- RTL is driven by ConfigProvider `.semi-rtl` and the direction context: the default popup position, tag layout and arrow direction flip with the direction.
- The public entry is SSR-safe: it can be imported and rendered with `renderToString` without a DOM; Portal, observers and input measurement are created after client mount.

## React → Vue

See the [React → Vue mapping](./react-to-vue.md). Full public behavior, visual and release evidence lives in the [alignment matrix](./alignment.md).
