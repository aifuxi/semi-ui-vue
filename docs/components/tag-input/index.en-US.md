# TagInput

TagInput turns typed content into removable and sortable tags while preserving the Semi Design v2.102.0 DOM, state, theme, and keyboard contracts.

## Basic usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { TagInput } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/tag-input.css';

const tags = ref(['Semi', 'Vue']);
</script>

<template>
  <TagInput v-model="tags" placeholder="Type and press Enter" />
</template>
```

## Batch input and limits

```vue
<TagInput
  v-model="tags"
  :separator="[',', '|']"
  :max="6"
  :max-length="12"
  :allow-duplicates="false"
  show-clear
  @exceed="handleExceed"
  @input-exceed="handleInputExceed"
/>
```

## Custom tags

```vue
<TagInput v-model="tags" draggable>
  <template #tag="{ value, close }">
    <button class="business-tag" type="button" @click="close">{{ value }}</button>
  </template>
</TagInput>
```

## API summary

| Prop                                    | Type                                | Default     | Description                                                  |
| --------------------------------------- | ----------------------------------- | ----------- | ------------------------------------------------------------ |
| `modelValue` / `value` / `defaultValue` | `string[]`                          | `[]`        | Native model, compatible controlled value, and initial value |
| `inputValue`                            | `string`                            | —           | Controlled input text with `update:inputValue`               |
| `separator`                             | `string \| string[] \| null`        | `','`       | Batch separators applied on Enter                            |
| `allowDuplicates`                       | `boolean`                           | `true`      | Allow duplicate tags                                         |
| `max` / `maxLength` / `maxTagCount`     | `number`                            | —           | Tag count, item length, and visible tag limits               |
| `showRestTagsPopover`                   | `boolean`                           | `true`      | Show remaining tags in a Portal on `+N` hover                |
| `expandRestTagsOnClick`                 | `boolean`                           | `true`      | Expand collapsed tags while active                           |
| `showContentTooltip`                    | `boolean \| { type, opts }`         | `true`      | Tooltip/Popover shown for overflowing content                |
| `addOnBlur` / `draggable` / `showClear` | `boolean`                           | `false`     | Add on blur, reorder, and clear capabilities                 |
| `size`                                  | `'small' \| 'default' \| 'large'`   | `'default'` | Control size                                                 |
| `validateStatus`                        | `'default' \| 'warning' \| 'error'` | `'default'` | Validation appearance                                        |

Events include `change`, `add`, `remove`, `inputChange`, `exceed`, `inputExceed`, `focus`, `blur`, and `keyDown`. The exposed instance provides `focus()` and `blur()`.

## React → Vue migration

| React                                | Vue                                                      |
| ------------------------------------ | -------------------------------------------------------- |
| `value` + `onChange`                 | `v-model` or `:value` + `@change`                        |
| `inputValue` + `onInputChange`       | `:input-value` + `@update:input-value` / `@input-change` |
| `renderTagItem(value,index,onClose)` | `#tag="{ value, index, close }"`                         |
| `prefix` / `suffix` ReactNode        | `#prefix` / `#suffix`; same-name props remain available  |
| `ref.current.focus()`                | Call `focus()` on the Vue template ref                   |

Compose the public `Tooltip` inside `#tag` when migrating React `showContentTooltip.renderTooltip`; `type` and `opts` remain available through `showContentTooltip`.

See [alignment.md](./alignment.md) for the full evidence matrix and deviations.
