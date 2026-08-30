# TagInput 标签输入框

TagInput 将输入内容转换为可删除、可排序的标签，并与 Semi Design v2.102.0 的 DOM、状态、主题和键盘行为对齐。

## 基本用法

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { TagInput } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/tag-input.css';

const tags = ref(['Semi', 'Vue']);
</script>

<template>
  <TagInput v-model="tags" placeholder="输入后按回车" />
</template>
```

## 批量输入与限制

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

## 自定义标签

```vue
<TagInput v-model="tags" draggable>
  <template #tag="{ value, close }">
    <button class="business-tag" type="button" @click="close">{{ value }}</button>
  </template>
</TagInput>
```

## API 摘要

| 属性                                    | 类型                                | 默认值      | 说明                                   |
| --------------------------------------- | ----------------------------------- | ----------- | -------------------------------------- |
| `modelValue` / `value` / `defaultValue` | `string[]`                          | `[]`        | 标签受控值、兼容受控值与非受控初值     |
| `inputValue`                            | `string`                            | —           | 输入框受控值，配合 `update:inputValue` |
| `separator`                             | `string \| string[] \| null`        | `','`       | Enter 时的批量切分符                   |
| `allowDuplicates`                       | `boolean`                           | `true`      | 是否允许重复标签                       |
| `max` / `maxLength` / `maxTagCount`     | `number`                            | —           | 标签数、单项长度和可见标签数限制       |
| `showRestTagsPopover`                   | `boolean`                           | `true`      | hover `+N` 是否显示剩余标签 Portal     |
| `expandRestTagsOnClick`                 | `boolean`                           | `true`      | 激活输入框时是否展开折叠标签           |
| `showContentTooltip`                    | `boolean \| { type, opts }`         | `true`      | 内容溢出时的 Tooltip/Popover 提示      |
| `addOnBlur` / `draggable` / `showClear` | `boolean`                           | `false`     | 失焦添加、排序、清空能力               |
| `size`                                  | `'small' \| 'default' \| 'large'`   | `'default'` | 尺寸                                   |
| `validateStatus`                        | `'default' \| 'warning' \| 'error'` | `'default'` | 校验视觉状态                           |

事件包括 `change`、`add`、`remove`、`inputChange`、`exceed`、`inputExceed`、`focus`、`blur` 和 `keyDown`。公开实例提供 `focus()`、`blur()`。

## React → Vue 迁移

| React                                | Vue                                                      |
| ------------------------------------ | -------------------------------------------------------- |
| `value` + `onChange`                 | `v-model` 或 `:value` + `@change`                        |
| `inputValue` + `onInputChange`       | `:input-value` + `@update:input-value` / `@input-change` |
| `renderTagItem(value,index,onClose)` | `#tag="{ value, index, close }"`                         |
| `prefix` / `suffix` ReactNode        | `#prefix` / `#suffix`，同名 prop 仍可用                  |
| `ref.current.focus()`                | 模板 ref 的 `focus()`                                    |

React `showContentTooltip.renderTooltip` 请在 `#tag` 中组合公开 `Tooltip`；`type` 与 `opts` 可继续通过 `showContentTooltip` 配置。

完整证据和 deviation 见 [alignment.md](./alignment.md)。
