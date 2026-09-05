---
title: '树选择器'
description: '树选择器用于多层级树形数据的结构化展示 & 选取，例如显示文件夹与文件的列表、显示组织架构成员列表等等。'
locale: 'zh-CN'
slug: 'tree-select'
category: 'input'
order: 52
englishTitle: 'TreeSelect'
icon: 'doc-treeselect'
upstream: 'input/treeselect'
---

TreeSelect 用于从多层级树数据中选择一个或多个节点。本实现以本地 Semi Design v2.102.0 为唯一对齐基线。

## 基本用法

::demo-block{demo="tree-select/zh-CN/Example1" title="基本用法"}
::

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

触发器使用 `role=combobox`，树列表和节点复用 Tree 的 `role=tree/treeitem`、键盘与焦点行为。light/dark、RTL 及搜索/空态文案来自主题和 ConfigProvider Locale。根入口与 `@aifuxi/semi-ui-vue/tree-select` 子路径均支持 SSR-safe import。

## React → Vue

| React v2.102.0                                     | Vue                                                   | 说明                              |
| -------------------------------------------------- | ----------------------------------------------------- | --------------------------------- |
| `<TreeSelect value={value} onChange={setValue} />` | `<TreeSelect v-model="value" />`                      | 仍可单独使用 `value` 与 `@change` |
| `treeData` / `multiple` / `leafOnly`               | 同名 kebab-case props                                 | 数据结构与枚举保持不变            |
| `expandedKeys` / `onExpand`                        | `:expanded-keys` / `@expand` / `v-model:expandedKeys` | Vue 增加原生双向绑定              |
| `renderLabel={fn}`                                 | `#label="scope"`                                      | 同名函数 prop 仍保留              |
| `renderFullLabel={fn}`                             | `#fullLabel="scope"`                                  | scope 与 Tree 一致                |
| `renderSelectedItem={fn}`                          | `#selectedItem="{ node, index, onClose }"`            | 多选可自定义标签或内容            |
| `searchRender={fn}`                                | `#search="inputProps"`                                | 显式 `false` 隐藏搜索框           |
| `triggerRender={fn}`                               | `#trigger="scope"`                                    | scope 保留 value 与操作函数       |
| `prefix` / `suffix` / `insetLabel`                 | 同名 prop 或 slot                                     | slot 优先                         |
| `outerTopSlot` / `outerBottomSlot`                 | `#outerTop` / `#outerBottom`                          | 同名 VNode prop 仍保留            |
| `onVisibleChange`                                  | `@visibleChange`                                      | 布尔参数不变                      |
| `ref.current.close()` / `search(value)`            | `treeSelectRef.close()` / `search(value)`             | 通过 `defineExpose` 提供          |
| ReactNode                                          | `VNodeChild` / slot                                   | Vue 原生节点映射                  |

React 的受控 `value` 可迁移为 `modelValue`/`v-model`；为减少迁移成本，本实现仍支持 `value` 并同时发出 `update:value`。回调顺序、节点对象和值语义与固定 Adapter/Foundation 保持一致，不向公开 `.d.ts` 暴露 React 或私有 Foundation 类型。
