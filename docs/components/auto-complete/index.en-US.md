# AutoComplete

AutoComplete adds candidate suggestions to an input while still allowing free-form text. This implementation targets Semi Design v2.102.0 and preserves the `.semi-autocomplete*` classes, Input/Popover DOM, state classes, and `--semi-*` tokens.

## Basic usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { AutoComplete } from '@workspace/ui';

const value = ref('');
const data = ref<string[]>([]);
function search(input: string) {
  data.value = input
    ? ['gmail.com', '163.com', 'qq.com'].map((domain) => `${input}@${domain}`)
    : [];
}
</script>

<template>
  <AutoComplete
    v-model="value"
    :data="data"
    show-clear
    placeholder="Search..."
    style="width: 220px"
    @search="search"
  />
</template>
```

## Object data and custom options

```vue
<AutoComplete
  :data="people"
  :render-selected-item="(option) => String(option.email)"
  on-select-with-object
>
  <template #option="{ option, focused }">
    <span :class="{ focused }">{{ option.name }} · {{ option.email }}</span>
  </template>
</AutoComplete>
```

`data` accepts strings, numbers, or objects with a `value`. See the [alignment matrix](./alignment.md) for all props, defaults, controlled timing, keyboard, Portal, and SSR evidence.

## Vue slots

`prefix`, `insetLabel`, `suffix`, `clearIcon`, and `emptyContent` are named slots. `option` and `trigger` are scoped slots. `option` receives `item`, `option`, `focused`, `inputValue`, and interaction handlers; `trigger` receives the input value, selection, search, and clear functions.

## React → Vue

| React                 | Vue                                                                      |
| --------------------- | ------------------------------------------------------------------------ |
| `value` + `onChange`  | `v-model`                                                                |
| `onSearch`            | `@search`                                                                |
| `renderItem`          | `#option` (the function prop remains available)                          |
| `renderSelectedItem`  | Same function prop; it must return a string                              |
| `triggerRender`       | `#trigger`                                                               |
| `prefix` / `suffix`   | `#prefix` / `#suffix`                                                    |
| `insetLabel`          | `#insetLabel` + `insetLabelId`                                           |
| `clearIcon`           | `#clearIcon`                                                             |
| `emptyContent`        | `#emptyContent`                                                          |
| `AutoComplete.Option` | `AutoCompleteOption`; the script export also keeps `AutoComplete.Option` |
| React component ref   | Vue ref exposes `open`, `close`, `focus`, and `search`                   |
