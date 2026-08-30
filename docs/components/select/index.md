# Select 选择器

Select 用于从候选项集合中选择一个或多个值。本实现对齐 Semi Design v2.102.0，并保留 `.semi-select*`、状态 class、Portal 结构和 `--semi-*` Token。

## 基础使用

```vue
<script setup lang="ts">
import { Select, SelectOption } from '@aifuxi/semi-ui-vue';
</script>

<template>
  <Select default-value="douyin" style="width: 120px">
    <SelectOption value="douyin">抖音</SelectOption>
    <SelectOption value="ulikecam">轻颜相机</SelectOption>
    <SelectOption value="jianying" disabled>剪映</SelectOption>
    <SelectOption value="xigua">西瓜视频</SelectOption>
  </Select>
</template>
```

## v-model、多选与搜索

```vue
<Select v-model="value" multiple filter :max-tag-count="2" :max="4">
  <SelectOptionGroup label="Asia">
    <SelectOption value="china">China</SelectOption>
    <SelectOption value="korea">Korea</SelectOption>
  </SelectOptionGroup>
</Select>
```

`optionList` 可直接传入 `{ value, label, disabled }[]`。完整 props、默认值、事件时序、虚拟列表、Portal 和可访问性证据见 [对齐矩阵](./alignment.md)。

## Vue 插槽

`prefix`、`insetLabel`、`suffix`、`arrowIcon`、`clearIcon`、`emptyContent`、`outerTop`、`innerTop`、`innerBottom`、`outerBottom` 是具名插槽；`option`、`selectedItem`、`createItem`、`trigger` 是 scoped slot。`insetLabelId` 可为内嵌标签提供稳定 id。

## React → Vue

| React                       | Vue                                                   |
| --------------------------- | ----------------------------------------------------- |
| `value` + `onChange`        | `v-model`                                             |
| `Select.Option`             | `SelectOption`（脚本中也保留 `Select.Option`）        |
| `Select.OptGroup`           | `SelectOptionGroup`（脚本中也保留 `Select.OptGroup`） |
| `renderOptionItem`          | `#option`                                             |
| `renderSelectedItem`        | `#selectedItem`                                       |
| `triggerRender`             | `#trigger`                                            |
| `insetLabel`                | `#insetLabel` + `insetLabelId`                        |
| `renderCreateItem`          | `#createItem`                                         |
| `outerTopSlot` 等 ReactNode | 对应具名 slot                                         |

实例 ref 暴露 `open`、`close`、`focus`、`clearInput`、`deselectAll`、`selectAll`、`search` 和 `rePosition`。
