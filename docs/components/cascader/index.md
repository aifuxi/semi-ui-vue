# Cascader 级联选择器

Cascader 用于从具有父子关系的数据中逐级选择路径。本实现只以本地 Semi Design v2.102.0 源码为对齐基线。

## 基本用法

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Cascader, type CascaderData, type CascaderValue } from '@aifuxi/semi-ui-vue';

const value = ref<CascaderValue>(['asia', 'china', 'shanghai']);
const treeData: CascaderData[] = [
  {
    label: '亚洲',
    value: 'asia',
    children: [
      {
        label: '中国',
        value: 'china',
        children: [{ label: '上海', value: 'shanghai' }],
      },
    ],
  },
];
</script>

<template>
  <Cascader
    v-model="value"
    :tree-data="treeData"
    filter-tree-node
    placeholder="请选择城市"
    show-clear
    :style="{ width: '300px' }"
  />
</template>
```

## 多选、搜索与异步加载

`multiple` 使用 Checkbox 选择路径。`checkRelation="related"` 联动父子节点，`leafOnly` 与 `autoMergeValue` 控制返回值归并；`max` 限制选择数量。`filterTreeNode` 可设为 `true` 或自定义匹配函数，`remote` 关闭本地过滤，`virtualizeInSearch` 为大量搜索结果启用固定行高虚拟列表。`loadData` 与 `loadedKeys` 支持异步子节点。

## Vue 插槽

`#trigger`、`#display`、`#filter`、`#prefix`、`#suffix`、`#arrowIcon`、`#clearIcon`、`#expandIcon`、`#top`、`#bottom` 和 `#empty` 是 React render prop/ReactNode 的 Vue 原生映射；对应函数或节点 prop 仍保留以便迁移。

## API

| 属性                                        | 类型                                | 默认值                | 说明                                           |
| ------------------------------------------- | ----------------------------------- | --------------------- | ---------------------------------------------- |
| `treeData`                                  | `CascaderData[]`                    | `[]`                  | 级联数据                                       |
| `defaultValue`                              | `CascaderValue`                     | -                     | 非受控初值                                     |
| `value` / `modelValue`                      | `CascaderValue`                     | -                     | 受控值；支持 `v-model`                         |
| `multiple`                                  | `boolean`                           | `false`               | 多选模式                                       |
| `changeOnSelect`                            | `boolean`                           | `false`               | 单选时允许选择非叶节点                         |
| `checkRelation`                             | `'related' \| 'unRelated'`          | `'related'`           | 多选父子联动方式                               |
| `leafOnly` / `autoMergeValue`               | `boolean`                           | `false` / `true`      | 只返回叶子与完整子树归并                       |
| `disableStrictly`                           | `boolean`                           | `false`               | 严格执行禁用关系                               |
| `filterTreeNode`                            | `boolean \| function`               | `false`               | 开启搜索或提供匹配函数                         |
| `filterLeafOnly` / `filterSorter`           | `boolean` / function                | `true` / -            | 过滤叶节点并排序结果                           |
| `searchPosition` / `remote`                 | `'trigger' \| 'custom'` / `boolean` | `'trigger'` / `false` | 搜索位置与远程模式                             |
| `virtualizeInSearch`                        | `CascaderVirtualize`                | -                     | 搜索结果虚拟滚动                               |
| `loadData` / `loadedKeys`                   | function / `string[]`               | -                     | 异步加载与已加载键                             |
| `keyMaps`                                   | `CascaderKeyMaps`                   | `{}`                  | 映射 value/label/children/disabled/isLeaf 字段 |
| `displayProp` / `treeNodeFilterProp`        | `string`                            | `'label'` / `'label'` | 展示与搜索字段                                 |
| `separator`                                 | `string`                            | `' / '`               | 路径分隔符；以源码默认值为准                   |
| `showNext`                                  | `'click' \| 'hover'`                | `'click'`             | 展开下一级的交互方式                           |
| `showClear` / `borderless` / `disabled`     | `boolean`                           | `false`               | 清除、无边框和禁用状态                         |
| `size` / `validateStatus`                   | enum                                | `'default'`           | 尺寸与校验状态                                 |
| `defaultOpen` / `motion`                    | `boolean`                           | `false` / `true`      | 初始浮层与动效                                 |
| `getPopupContainer` / `position` / `zIndex` | function / enum / number            | body / 自动 / `1030`  | Portal 与定位                                  |
| `max` / `maxTagCount`                       | `number`                            | -                     | 最大选择数与可见标签数                         |
| `onChangeWithObject`                        | `boolean`                           | `false`               | 返回数据对象而非值                             |

事件：`change`、`select`、`search`、`load`、`listScroll`、`exceed`、`clear`、`focus`、`blur`、`visibleChange`、`update:value` 和 `update:modelValue`。组件 ref 暴露 `open()`、`close()`、`focus()`、`blur()` 与 `search(value)`。

## 无障碍、主题与 SSR

触发器使用 `role=combobox`，弹层使用 `role=listbox`，列和选项保留上游 menu/menuitem、ARIA 关系与键盘语义。light/dark、移动端、RTL 与 zh-CN/en-US 场景均由固定 Chromium 对照验证；根入口及 `@aifuxi/semi-ui-vue/cascader` 子路径支持 SSR-safe import。
