# Select

Select chooses one or more values from an option collection. This implementation targets Semi Design v2.102.0 and preserves the `.semi-select*` state classes, Portal shape, and `--semi-*` tokens.

## Basic usage

```vue
<script setup lang="ts">
import { Select, SelectOption } from '@workspace/ui';
</script>

<template>
  <Select default-value="douyin" style="width: 120px">
    <SelectOption value="douyin">Douyin</SelectOption>
    <SelectOption value="ulikecam">Ulike</SelectOption>
    <SelectOption value="jianying" disabled>CapCut</SelectOption>
    <SelectOption value="xigua">Xigua Video</SelectOption>
  </Select>
</template>
```

## v-model, multiple selection, and filtering

```vue
<Select v-model="value" multiple filter :max-tag-count="2" :max="4">
  <SelectOptionGroup label="Asia">
    <SelectOption value="china">China</SelectOption>
    <SelectOption value="korea">Korea</SelectOption>
  </SelectOptionGroup>
</Select>
```

Use `optionList` for `{ value, label, disabled }[]`. See the [alignment matrix](./alignment.md) for the full props, defaults, event order, virtualization, Portal, and accessibility evidence.

## Vue slots

`prefix`, `insetLabel`, `suffix`, `arrowIcon`, `clearIcon`, `emptyContent`, `outerTop`, `innerTop`, `innerBottom`, and `outerBottom` are named slots. `option`, `selectedItem`, `createItem`, and `trigger` are scoped slots. Use `insetLabelId` when the inset label needs a stable id.

## React → Vue

| React                                    | Vue                                                                  |
| ---------------------------------------- | -------------------------------------------------------------------- |
| `value` + `onChange`                     | `v-model`                                                            |
| `Select.Option`                          | `SelectOption` (`Select.Option` remains on the script export)        |
| `Select.OptGroup`                        | `SelectOptionGroup` (`Select.OptGroup` remains on the script export) |
| `renderOptionItem`                       | `#option`                                                            |
| `renderSelectedItem`                     | `#selectedItem`                                                      |
| `triggerRender`                          | `#trigger`                                                           |
| `insetLabel`                             | `#insetLabel` + `insetLabelId`                                       |
| `renderCreateItem`                       | `#createItem`                                                        |
| `outerTopSlot` and other ReactNode props | Matching named slots                                                 |

The component ref exposes `open`, `close`, `focus`, `clearInput`, `deselectAll`, `selectAll`, `search`, and `rePosition`.
