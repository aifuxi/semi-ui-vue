---
title: '树形控件'
description: '树型结构列表。'
locale: 'zh-CN'
slug: 'tree'
category: 'navigation'
order: 61
englishTitle: 'Tree'
icon: 'doc-tree'
upstream: 'navigation/tree'
---

Tree 用层级列表展示可展开、选择、搜索和拖拽的数据。本实现以 Semi Design v2.102.0 为固定基线，保留 `.semi-tree-*` DOM/class、主题 Token、单选/多选关系、异步加载、虚拟滚动、键盘、ARIA 与 RTL 契约。

## 基本用法

::demo-block{demo="tree/zh-CN/Example1" title="基本用法"}
::

## 多选、搜索与自定义节点

```vue
<Tree v-model="value" filter-tree-node multiple show-filtered-only :tree-data="treeData">
  <template #label="{ label, node, searchWord }">
    <strong :data-key="node.key">{{ label }}{{ searchWord ? ` · ${searchWord}` : '' }}</strong>
  </template>
  <template #empty>没有匹配节点</template>
</Tree>
```

`multiple` 默认使用 `checkRelation="related"`，父子 checked/halfChecked 联动；`unRelated` 让每个节点独立。`leafOnly` 只返回叶节点，`autoMergeValue` 会在父节点已选时省略后代值。

## 受控展开、异步加载与虚拟滚动

```vue
<Tree
  v-model:expanded-keys="expandedKeys"
  :load-data="loadChildren"
  :tree-data="treeData"
  :virtualize="{ height: 240, width: 360, itemSize: 32 }"
  @load="onLoad"
/>
```

组件实例公开 `search(value)`、`scrollTo({ key, align })` 与 `focus()`。`scrollTo` 的 `align` 支持 `center/start/end/smart/auto`。

## Props

| 属性                                    | 类型                      | 默认值                      | 说明                                               |
| --------------------------------------- | ------------------------- | --------------------------- | -------------------------------------------------- |
| `treeData` / `treeDataSimpleJson`       | `TreeNodeData[]` / object | `[]` / -                    | 标准树数据或简单 JSON                              |
| `keyMaps`                               | `TreeKeyMaps`             | 标准字段                    | 映射 key/label/value/children/disabled/isLeaf/icon |
| `value` / `modelValue` / `defaultValue` | `TreeValue`               | -                           | 受控、v-model 与非受控初值                         |
| `multiple`                              | boolean                   | `false`                     | 多选 Checkbox 树                                   |
| `checkRelation`                         | `related \| unRelated`    | `related`                   | 父子选中关系                                       |
| `expandedKeys` / `defaultExpandedKeys`  | `string[]`                | - / `[]`                    | 受控/非受控展开键                                  |
| `defaultExpandAll` / `expandAll`        | boolean                   | `false`                     | 初次/数据更新时展开全部                            |
| `autoExpandParent`                      | boolean                   | `false`                     | 受控键自动补全祖先                                 |
| `filterTreeNode`                        | boolean / function        | `false`                     | 开启搜索或自定义过滤                               |
| `showClear` / `showFilteredOnly`        | boolean                   | `true` / `false`            | 搜索清除与只显示命中链                             |
| `searchRender`                          | function / `false`        | 默认输入框                  | 自定义或隐藏搜索框                                 |
| `blockNode` / `showLine` / `directory`  | boolean                   | `true` / `false` / `false`  | 整行、连接线和目录模式                             |
| `icon` / `expandIcon`                   | VNode / function          | -                           | 全局节点图标与展开图标                             |
| `renderLabel` / `renderFullLabel`       | function                  | -                           | 自定义 label 或整行                                |
| `loadData` / `loadedKeys`               | function / `string[]`     | -                           | 异步加载与受控已加载键                             |
| `draggable`                             | boolean                   | `false`                     | 开启节点拖拽                                       |
| `virtualize`                            | `TreeVirtualize`          | -                           | 大数据视窗，包含 itemSize/height/width             |
| `disabled` / `disableStrictly`          | boolean                   | `false`                     | 全局禁用及严格禁用关系                             |
| `motion` / `labelEllipsis`              | boolean                   | `true` / virtualize 时 true | 节点动效与文本省略                                 |

事件：`change`、`select`、`expand`、`search`、`load`、`contextMenu`、`doubleClick`、`dragStart`、`dragEnter`、`dragOver`、`dragLeave`、`drop`、`dragEnd`，以及 `update:value`、`update:modelValue`、`update:expandedKeys`。

插槽：`search`、`empty`、`icon`、`expandIcon`、`label`、`fullLabel`。完整源码证据、事件顺序、默认 Boolean 三态、SSR、视觉与 deviation 见 [对齐矩阵](https://github.com/aifuxi/semi-ui-vue/blob/master/docs/components/tree/alignment.md)。

## React → Vue

| Semi React v2.102.0                          | Vue                                                        |
| -------------------------------------------- | ---------------------------------------------------------- |
| `<Tree value={value} onChange={setValue} />` | `<Tree v-model="value" />`                                 |
| `expandedKeys` + `onExpand`                  | `v-model:expanded-keys` + `@expand`                        |
| `onSelect(key, selected, node)`              | `@select="(key, selected, node) => ..."`                   |
| `onSearch(input, keys)`                      | `@search="(input, keys) => ..."`                           |
| `renderLabel(label, node, word)`             | 同名 prop，或 `#label="{ label, node, searchWord }"`       |
| `renderFullLabel(props)`                     | 同名 prop，或 `#fullLabel="props"`                         |
| `searchRender(props)`                        | 同名 prop，或 `#search="props"`；显式 `false` 仍隐藏搜索框 |
| `icon` / `expandIcon` ReactNode/function     | 同名 VNode/function，或 `#icon` / `#expandIcon`            |
| `emptyContent` ReactNode                     | 同名 VNode prop，或 `#empty`                               |
| `ref.current.search(value)`                  | `treeRef.search(value)`                                    |
| `ref.current.scrollTo(data)`                 | `treeRef.scrollTo(data)`                                   |

Vue 不发布 ReactNode、render props、SyntheticEvent 或 React ref 类型。事件采用原生 `MouseEvent`、`KeyboardEvent`、`DragEvent`；数据、顺序与可见行为保持固定基线。默认 true 的 `showClear`、`blockNode`、`motion`、`autoExpandWhenDragEnter` 与 `autoMergeValue` 保留“缺省 / 显式 false / 显式 true”三态，不要用普通 truthiness 代替 prop 存在性。
