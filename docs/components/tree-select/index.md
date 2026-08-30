# TreeSelect 树选择器

TreeSelect 用于从多层级树数据中选择一个或多个节点。本实现以本地 Semi Design v2.102.0 为唯一对齐基线。

## 基本用法

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { TreeSelect, type TreeNodeData } from '@workspace/ui';

const value = ref('shanghai');
const treeData: TreeNodeData[] = [
  {
    label: '亚洲',
    value: 'asia',
    key: 'asia',
    children: [
      {
        label: '中国',
        value: 'china',
        key: 'china',
        children: [
          { label: '北京', value: 'beijing', key: 'beijing' },
          { label: '上海', value: 'shanghai', key: 'shanghai' },
        ],
      },
    ],
  },
];
</script>

<template>
  <TreeSelect
    v-model="value"
    :tree-data="treeData"
    filter-tree-node
    placeholder="请选择城市"
    :style="{ width: '300px' }"
  />
</template>
```

## 多选与搜索

设置 `multiple` 后节点以 Checkbox 选择。`checkRelation="related"` 会联动父子节点；`leafOnly` 只回填叶子节点；`autoMergeValue` 控制是否合并完整子树。`filterTreeNode` 可设为 `true` 或自定义匹配函数，`searchPosition="trigger"` 会把输入框放到触发器中。

## 自定义渲染

推荐使用 `#label`、`#fullLabel`、`#selectedItem`、`#search`、`#trigger`、`#outerTop` 与 `#outerBottom` scoped slots。对应的 `renderLabel`、`renderFullLabel`、`renderSelectedItem`、`searchRender` 与 `triggerRender` 函数 props 也保留。

```vue
<TreeSelect :tree-data="treeData" multiple>
  <template #selectedItem="{ node, onClose }">
    <span>{{ node.label }} <button type="button" @click="onClose()">移除</button></span>
  </template>
</TreeSelect>
```

## API

| 属性                                   | 类型                                | 默认值           | 说明                     |
| -------------------------------------- | ----------------------------------- | ---------------- | ------------------------ |
| `treeData`                             | `TreeNodeData[]`                    | `[]`             | 树数据                   |
| `defaultValue`                         | `TreeValue`                         | -                | 非受控初值               |
| `value` / `modelValue`                 | `TreeValue`                         | -                | 受控值；支持 `v-model`   |
| `multiple`                             | `boolean`                           | `false`          | 多选模式                 |
| `checkRelation`                        | `'related' \| 'unRelated'`          | `'related'`      | 多选父子联动方式         |
| `leafOnly` / `autoMergeValue`          | `boolean`                           | `false` / `true` | 叶子节点回填与值合并     |
| `filterTreeNode`                       | `boolean \| function`               | `false`          | 开启搜索或提供匹配函数   |
| `searchPosition`                       | `'dropdown' \| 'trigger'`           | `'dropdown'`     | 搜索框位置               |
| `expandedKeys` / `defaultExpandedKeys` | `string[]`                          | -                | 受控/非受控展开节点      |
| `defaultExpandAll` / `expandAll`       | `boolean`                           | `false`          | 初始或持续展开全部节点   |
| `defaultOpen`                          | `boolean`                           | `false`          | 初始打开浮层             |
| `showClear`                            | `boolean`                           | `false`          | 显示清除按钮             |
| `dropdownMatchSelectWidth`             | `boolean`                           | `true`           | 浮层最小宽度匹配触发器   |
| `getPopupContainer`                    | `() => HTMLElement`                 | `document.body`  | 浮层容器                 |
| `size`                                 | `'small' \| 'default' \| 'large'`   | `'default'`      | 尺寸                     |
| `validateStatus`                       | `'default' \| 'warning' \| 'error'` | `'default'`      | 校验状态                 |
| `loadData` / `loadedKeys`              | function / `string[]`               | -                | 异步加载与受控已加载节点 |

事件：`change`、`select`、`search`、`expand`、`load`、`clear`、`focus`、`blur`、`visibleChange`、`update:value`、`update:modelValue`、`update:expandedKeys`。组件 ref 暴露 `close()` 与 `search(value)`。

## 无障碍、主题与 SSR

触发器使用 `role=combobox`，树列表和节点复用 Tree 的 `role=tree/treeitem`、键盘与焦点行为。light/dark、RTL 及搜索/空态文案来自主题和 ConfigProvider Locale。根入口与 `@workspace/ui/tree-select` 子路径均支持 SSR-safe import。
