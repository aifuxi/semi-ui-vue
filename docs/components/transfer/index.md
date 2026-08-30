# Transfer 穿梭框

Transfer 用于在候选集合与已选集合之间移动条目。本实现以本地 Semi Design v2.102.0 为唯一对齐基线。

## 基本用法

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { Transfer } from '@aifuxi/semi-ui-vue';

const selected = shallowRef<Array<string | number>>(['design']);
const data = [
  { key: 1, label: '设计', value: 'design' },
  { key: 2, label: '研发', value: 'engineering' },
  { key: 3, label: '财务', value: 'finance', disabled: true },
];
</script>

<template>
  <Transfer v-model="selected" :data-source="data" />
</template>
```

## 分组、树与分页

- `type="groupList"` 时，`dataSource` 使用 `{ title, children }[]`。
- `type="treeList"` 时复用 Tree；`showPath` 可让右侧显示完整路径，`treeProps` 可配置搜索与树展示。
- `pagination` 仅作用于 `list/groupList` 左面板，支持 `pageSize`、`defaultCurrentPage`、`currentPage` 与 `onPageChange`。

## 自定义渲染

推荐使用 `#sourceItem`、`#selectedItem`、`#sourceHeader`、`#selectedHeader`、`#sourcePanel` 与 `#selectedPanel` scoped slots。函数形式的 `renderSourceItem` 等兼容 prop 也保留。

```vue
<Transfer :data-source="data">
  <template #sourceItem="{ label, checked, onChange }">
    <button type="button" @click="onChange">{{ checked ? '✓' : '' }} {{ label }}</button>
  </template>
  <template #selectedItem="{ label, onRemove }">
    <span>{{ label }} <button type="button" @click="onRemove">移除</button></span>
  </template>
</Transfer>
```

## API

| 属性                       | 类型                                  | 默认值   | 说明                   |
| -------------------------- | ------------------------------------- | -------- | ---------------------- |
| `dataSource`               | `TransferDataSource`                  | `[]`     | 候选数据               |
| `defaultValue`             | `(string \| number)[]`                | `[]`     | 非受控初值             |
| `value` / `modelValue`     | `(string \| number)[]`                | -        | 受控值；支持 `v-model` |
| `type`                     | `'list' \| 'groupList' \| 'treeList'` | `'list'` | 数据展示模式           |
| `filter`                   | `boolean \| (input, item) => boolean` | `true`   | 搜索框与匹配逻辑       |
| `disabled`                 | `boolean`                             | `false`  | 禁用全部操作           |
| `loading`                  | `boolean`                             | `false`  | 左面板加载态           |
| `draggable`                | `boolean`                             | `false`  | 右侧拖拽排序           |
| `showPath`                 | `boolean`                             | `false`  | treeList 右侧显示路径  |
| `inputProps` / `treeProps` | 对应组件 props                        | -        | 内部 Input/Tree 配置   |
| `emptyContent`             | `{ left, right, search }`             | locale   | 三种空态内容           |
| `pagination`               | `TransferPaginationProps`             | -        | 左面板分页             |
| `virtualize`               | `{ height?, width?, itemSize }`       | -        | 右侧固定行高虚拟列表   |

事件：`change(values, items)`、`select(item)`、`deselect(item)`、`search(input)`、`update:value`、`update:modelValue`。组件 ref 暴露 `search(value)`；该方法更新搜索但不触发 `search` 事件。

## 无障碍、主题与 SSR

搜索容器使用 `role=search`；左右列表使用 `role=list`，条目使用 `role=listitem`。默认候选项复用 Checkbox 的键盘与焦点行为。light/dark、RTL 与文案来自主题和 ConfigProvider；根入口与子路径均支持 SSR-safe import。
