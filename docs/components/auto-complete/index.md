# AutoComplete 自动完成

AutoComplete 为输入框提供候选建议，用户既可以继续输入，也可以选择候选项。本实现对齐 Semi Design v2.102.0，并保留 `.semi-autocomplete*`、Input/Popover DOM、状态 class 和 `--semi-*` Token。

## 基础使用

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { AutoComplete } from '@aifuxi/semi-ui-vue';

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
    placeholder="搜索..."
    style="width: 220px"
    @search="search"
  />
</template>
```

## 对象候选项与自定义渲染

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

`data` 接受 string/number 或含 `value` 的对象。完整 props、默认值、受控时序、键盘、Portal 与 SSR 证据见[对齐矩阵](./alignment.md)。

## Vue 插槽

`prefix`、`insetLabel`、`suffix`、`clearIcon`、`emptyContent` 是具名插槽；`option` 与 `trigger` 是 scoped slot。`option` 提供 `item`、`option`、`focused`、`inputValue` 和交互落点；`trigger` 提供输入值、选中项、搜索与清除函数。

## React → Vue

| React                 | Vue                                                        |
| --------------------- | ---------------------------------------------------------- |
| `value` + `onChange`  | `v-model`                                                  |
| `onSearch`            | `@search`                                                  |
| `renderItem`          | `#option`（也保留同名函数 prop）                           |
| `renderSelectedItem`  | 同名函数 prop，必须返回 string                             |
| `triggerRender`       | `#trigger`                                                 |
| `prefix` / `suffix`   | `#prefix` / `#suffix`                                      |
| `insetLabel`          | `#insetLabel` + `insetLabelId`                             |
| `clearIcon`           | `#clearIcon`                                               |
| `emptyContent`        | `#emptyContent`                                            |
| `AutoComplete.Option` | `AutoCompleteOption`，脚本导出也保留 `AutoComplete.Option` |
| React component ref   | Vue ref 暴露 `open`、`close`、`focus`、`search`            |
