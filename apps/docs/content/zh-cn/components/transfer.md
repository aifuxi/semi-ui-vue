---
title: '穿梭框'
description: '一个更直观高效的多选选择器，可以露出更多选项的信息，支持搜索功能，缺点是占据更多空间'
locale: 'zh-CN'
slug: 'transfer'
category: 'input'
order: 51
englishTitle: 'Transfer'
icon: 'doc-transfer'
upstream: 'input/transfer'
---

Transfer 用于在候选集合与已选集合之间移动条目。本实现以本地 Semi Design v2.102.0 为唯一对齐基线。

## 代码演示

### 如何引入

```ts
import { Transfer } from '@aifuxi/semi-ui-vue/transfer';
import '@aifuxi/semi-theme-default/transfer.css';
```

英文示例各自通过 ConfigProvider 设置 `locale="{ code: 'en-US' }"`，使内置搜索、计数、清空和分页文案在页面与独立编辑器内都保持英文；中文示例使用默认中文。

### 基本使用

每项提供 `value`、`label`、`key`。点击左侧候选项添加到右侧，再点击右侧删除图标移除；选择结果输出到浏览器控制台。

::demo-block{demo="transfer/zh-CN/Basic" title="基本使用"}
::

### 分组

设置 `type="groupList"`，一级数据使用 `{ title, children }`，不支持多层分组。默认已选 B-3 为禁用项，不能通过取消选择或清空移除。

::demo-block{demo="transfer/zh-CN/Grouped" title="分组"}
::

### 自定义筛选逻辑，自定义选项数据渲染

`filter` 返回匹配结果；示例同时搜索姓名和邮箱，并用 Highlight 高亮输入内容。`#sourceItem` 和 `#selectedItem` 接收条目数据及操作回调。

::demo-block{demo="transfer/zh-CN/CustomFilter" title="自定义筛选与选项"}
::

### 禁用

设置 `disabled` 禁用整个穿梭框，默认已选条目仍然展示。

::demo-block{demo="transfer/zh-CN/Disabled" title="禁用"}
::

### 拖拽排序

设置 `draggable` 后，拖动右侧已选项的把手调整顺序，`change` 返回排序后的值和条目。

::demo-block{demo="transfer/zh-CN/Draggable" title="拖拽排序"}
::

### 左侧分页

`pagination` 仅作用于 `list/groupList` 左面板；示例每页显示 10 条，支持跨页选择和搜索。

::demo-block{demo="transfer/zh-CN/Pagination" title="左侧分页"}
::

### 左侧分页 + 受控页码

通过 `pagination.currentPage` 控制页码，`onPageChange` 更新状态；点击外部按钮可跳转到第 1、2、5、10 页。

::demo-block{demo="transfer/zh-CN/ControlledPagination" title="受控页码"}
::

### 拖拽 + 自定义已选项渲染

自定义条目包含头像、姓名和邮箱。将 `#selectedItem` 的 `dragHandleProps` 绑定到拖拽节点，替代 React 的 `sortableHandle` 包装。

::demo-block{demo="transfer/zh-CN/CustomDraggable" title="自定义已选项拖拽"}
::

### 自定义渲染面板头部信息

通过 `#sourceHeader`、`#selectedHeader` 定义标题，调用 `onAllClick` 和 `onClear` 保留全选、取消全选与清空行为。

::demo-block{demo="transfer/zh-CN/CustomHeaders" title="自定义面板头部"}
::

### 完全自定义渲染

`#sourcePanel` 和 `#selectedPanel` 接管整个面板结构；通过插槽提供的数据与回调实现搜索、添加、删除、全选和清空，不另建一份选中状态。

::demo-block{demo="transfer/zh-CN/CustomPanels" title="完全自定义面板"}
::

### 完全自定义渲染、拖拽排序

完整接管面板后，排序交互也由示例负责。以下保留上游两个独立演示的结构；React 专用的 react-sortable-hoc 与 dnd-kit 适配为 Vue 模板和原生 HTML5 拖放，通过 `onSortEnd({ oldIndex, newIndex })` 提交顺序。不需要额外安装 React 拖拽库。

::demo-block{demo="transfer/zh-CN/CustomPanelSortable" title="自定义面板拖拽：Sortable 适配"}
::

::demo-block{demo="transfer/zh-CN/CustomPanelDnd" title="自定义面板拖拽：Dnd 适配"}
::

### 树穿梭框

`type="treeList"` 使用 Tree 展示候选数据，`treeProps` 可覆盖默认树配置。此处保留上游双语示例相同的英文地名，默认选择 Shanghai；Mexico 禁用。树的默认设置包括 `multiple`、`disableStrictly`、`leafOnly`、`filterTreeNode` 为 true，以及 `searchRender` 为 false。树自定义搜索需要通过 `treeProps.filterTreeNode` 配置。

::demo-block{demo="transfer/zh-CN/Tree" title="树穿梭框"}
::

### 树穿梭框自定义头部显示叶子节点数量

`#sourceHeader` 在树模式下提供 `leafOnlyNum`。示例同时展示 7 个文件与 10 个总节点，文件夹不计入文件数。

::demo-block{demo="transfer/zh-CN/TreeLeafCount" title="叶子节点数量"}
::

以上 14 项按固定上游顺序逐项关联；双语顺序一致，无语言独有示例。本批属于示例补齐，严格 React/Vue 视觉与行为验收另行执行。

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

## React → Vue

| React v2.102.0                                   | Vue                                                | 说明                                          |
| ------------------------------------------------ | -------------------------------------------------- | --------------------------------------------- |
| `<Transfer value={value} onChange={setValue} />` | `<Transfer v-model="value" />`                     | 仍可单独使用 `value` 与 `@change`             |
| `dataSource` / `defaultValue` / `type`           | 同名 kebab-case props                              | 数据结构与枚举不变                            |
| `renderSourceItem={fn}`                          | `#sourceItem="scope"`                              | 同名函数 prop 仍保留                          |
| `renderSelectedItem={fn}`                        | `#selectedItem="scope"`                            | `onRemove` 保留；拖拽时提供 `dragHandleProps` |
| `renderSourcePanel` / `renderSelectedPanel`      | `#sourcePanel` / `#selectedPanel`                  | actions 与数据均在 slot scope 中              |
| `emptyContent`                                   | 同名 prop 或 `#emptyLeft/#emptyRight/#emptySearch` | slot 优先                                     |
| `ref.current.search(value)`                      | `transferRef.search(value)`                        | 不触发 search 事件                            |
| ReactNode                                        | `VNodeChild` / slot                                | Vue 原生节点映射                              |

React 的 `sortableHandle(render)` 在函数 prop 中仍可用；模板 slot 推荐把 `dragHandleProps` 绑定到自定义拖拽节点。HTML5 拖拽和 Vue 固定行高 windowing 分别替代 dnd-kit 与 react-window，不把 React 专属类型暴露到公开声明。
