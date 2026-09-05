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

TreeSelect 用于多层级数据的结构化展示与选择，例如组织架构、文件目录与地区。示例使用公开 Vue 组件，并以固定 Semi Design v2.102.0 为参考。

## 如何引入

```vue
<script setup lang="ts">
import { TreeSelect } from '@aifuxi/semi-ui-vue/tree-select';
import '@aifuxi/semi-theme-default/tree-select.css';
</script>
```

## 基本用法

通过 `treeData` 描述层级。`key` 必须在整个树中唯一；`value` 应全部提供且唯一，或全部省略并使用 `key` 作为值。示例限制浮层最大高度，超出后滚动。

::demo-block{demo="tree-select/zh-cn/Basic" title="基本用法"}
::

## 多选

`multiple` 启用多选。默认父子节点联动，选中整个子树时可合并为父节点；`leafOnly` 只回填叶子节点。下面分别展示默认回填和叶子回填。

::demo-block{demo="tree-select/zh-cn/Multiple" title="多选"}
::

## 限制标签展示数量

`maxTagCount` 只限制展示数量，不限制选择数量。`showRestTagsPopover` 在悬停 +N 时显示剩余标签，`restTagsPopoverProps` 可以调整浮层位置。

::demo-block{demo="tree-select/zh-cn/MaxTagCount" title="限制标签展示数量"}
::

## 可搜索的

`filterTreeNode` 开启搜索，也可传入 (input, text, node) 匹配函数。默认搜索 label，`treeNodeFilterProp` 可切换字段。`showFilteredOnly` 控制是否仅展示命中路径；`searchAutoFocus` 控制菜单搜索框是否自动聚焦。search 事件提供输入、展开键和命中节点。

::demo-block{demo="tree-select/zh-cn/Search" title="可搜索的"}
::

## 远程搜索

`remote` 跳过本地过滤，由 search 处理器提供结果。此例在浏览器内延迟 500ms 生成三条结果，不发送网络请求；新搜索会取消上一轮，清空输入会清空结果。加载文案通过 empty 插槽显示，TreeSelect 没有公开的 loading prop。

::demo-block{demo="tree-select/zh-cn/Remote" title="远程搜索"}
::

## 搜索框位置

`searchPosition` 默认为 dropdown，可设为 `trigger` 将搜索输入放在选择框内。此时仍需开启 `filterTreeNode`。分别展示单选与多选。

::demo-block{demo="tree-select/zh-cn/SearchPosition" title="搜索框位置"}
::

## Trigger 内多行换行（triggerTagWrap）

`triggerTagWrap` 在 `multiple`、`filterTreeNode` 和 `searchPosition`="`trigger`" 同时启用时生效。给触发器固定宽度后，多选标签与长输入按宽度换行；不设置 `maxTagCount` 以展示全部标签。

::demo-block{demo="tree-select/zh-cn/TriggerTagWrap" title="Trigger 内多行换行（triggerTagWrap）"}
::

## 尺寸大小

`size` 支持 small、default、large。每个选择器独立保存其非受控选择状态。

::demo-block{demo="tree-select/zh-cn/Sizes" title="尺寸大小"}
::

## 默认展开

`defaultExpandAll` 仅在初始化时展开已存在的数据；`expandAll` 也影响后续替换的数据。下面两个选择器初始为空，挂载 500ms 后加载同一份树数据，可比较展开行为。

::demo-block{demo="tree-select/zh-cn/ExpandAll" title="默认展开"}
::

## 禁用

`disabled` 禁用整个选择器，已选值仍然可见。节点本身的 `disabled` 标记用于多选节点限制；需要连同后代禁用时使用下一节的 `disableStrictly`。

::demo-block{demo="tree-select/zh-cn/Disabled" title="禁用"}
::

## 严格禁用

`disableStrictly` 会让 `disabled` 节点及其后代不可交互，并在多选关系计算中纳入禁用关系。此例禁用中国节点并保留上海初值，用于观察已选禁用项。

::demo-block{demo="tree-select/zh-cn/DisableStrictly" title="严格禁用"}
::

## 受控

通过 v-model 控制当前值，也可使用 `value` + change 或 v-model:`value`。`defaultValue` 仅用于非受控初值。启用 `onChangeWithObject` 后，受控值与事件都使用节点对象。

::demo-block{demo="tree-select/zh-cn/Controlled" title="受控"}
::

## 节点选中关系

`checkRelation`="related" 为默认父子关联模式；unRelated 下每个节点独立选择，选中亚洲不会自动选中中国和城市。

::demo-block{demo="tree-select/zh-cn/CheckRelation" title="节点选中关系"}
::

## 开启搜索的展开受控

展开受控时，组件等待父级回传 `expandedKeys`。将 search 事件给出的 `filteredExpandedKeys` 合并到已有展开键，避免搜索命中节点后仍被折叠祖先遮挡。

::demo-block{demo="tree-select/zh-cn/SearchExpansion" title="开启搜索的展开受控"}
::

## 虚拟化

`virtualize` 指定 `itemSize` 和可视高度，减少大树的 DOM 节点。按钮生成固定的 1705 个节点，使用 28px 行高、236px 可视区；搜索后只展示命中路径。开启虚拟化后节点展开动画关闭。

::demo-block{demo="tree-select/zh-cn/Virtualized" title="虚拟化"}
::

## 动态更新数据

替换 `treeData` 可动态改变节点。示例使用确定性轮次生成不同数量的父子节点，便于重复观察；生产数据更新时应保持存续节点的 `key`/`value` 稳定。

::demo-block{demo="tree-select/zh-cn/DynamicData" title="动态更新数据"}
::

## 异步加载数据

`loadData` 返回 Promise，在展开未加载节点时补齐 `children`。`isLeaf` 节点不会触发加载。此例延迟 1 秒生成本地子节点，并保持所有节点 `value` 填写一致。组件卸载时取消未完成计时器。`loadedKeys` prop 接收数组，load 事件返回 Set，受控时需显式转换。

::demo-block{demo="tree-select/zh-cn/AsyncData" title="异步加载数据"}
::

## 自定义 Trigger

使用 `trigger` scoped slot 替代 React triggerRender。TagInput 根据当前节点 `key` 回填标签，`inputValue`/`onSearch` 同步查询，`onRemove` 按 `key` 删除选择。自定义触发器仍需保留键盘可聚焦的输入。

::demo-block{demo="tree-select/zh-cn/CustomTrigger" title="自定义 Trigger"}
::

## 自定义渲染已选项

单选可以用 `selectedItem` 插槽直接展示标签。多选 `renderSelectedItem` 返回 { content, isRenderInTag: true } 时由组件包装 Tag；使用 `selectedItem` 插槽时由插槽提供完整内容并按需调用 `onClose`。中文示例保留可关闭白色标签；英文基线的白色标签没有关闭按钮。

::demo-block{demo="tree-select/zh-cn/SelectedItem" title="自定义渲染已选项"}
::

## API 参考

::api-table{slug="tree-select"}
::

### TreeNodeData 与值

| 字段     | 类型             | 说明                                     |
| -------- | ---------------- | ---------------------------------------- |
| key      | string           | 必填，在整个树中唯一。                   |
| value    | string 或 number | 全部填写且唯一，或全部省略并回退为 key。 |
| label    | VNodeChild       | 展示标签，允许重复。                     |
| children | TreeNodeData[]   | 子节点。                                 |
| icon     | VNodeChild       | 节点图标。                               |
| disabled | boolean          | 多选时禁止选择该节点。                   |
| isLeaf   | boolean          | 异步加载时标记叶节点。                   |

TreeValue 为字符串、数字、节点对象或它们的数组。TreeVirtualize 包含 itemSize、height 与可选 width。TreeKeyMaps 可以映射 key、value、label、children、icon、disabled 与 isLeaf 字段。

### 渲染参数

- TreeSelectSelectedItemProps：node、index、onClose(content?, event?)。
- TreeSelectTriggerRenderProps：已选节点数组 value、inputValue、placeholder、disabled、componentProps，以及 onSearch/onRemove/onClear。
- TreeSelectSearchRenderProps：Input 属性，加 className、value 与 onChange(value)。
- TreeFullLabelSlotProps / TreeExpandIconSlotProps 与 [Tree](/zh-cn/components/tree/) 一致。完全替换节点行时应透传事件、class 与 style。

## 无障碍

触发器可通过键盘聚焦，默认无障碍名称为 TreeSelect；使用 aria-label 或 aria-labelledby 描述实际用途。树节点提供 aria-level、aria-selected、aria-checked 与 aria-disabled 状态。自定义节点或触发器时应保留键盘焦点、展开和选中语义。Escape 关闭弹层，方向键用于移动和展开节点，Enter 选择当前节点。

通过 aria-describedby、aria-errormessage、aria-invalid 和 aria-required 关联帮助、错误和必填信息；校验背景色不能替代可访问的错误消息。

## 主题与 SSR

通过 ConfigProvider 设置语言与方向，主题 CSS 支持明暗模式，公开入口可安全用于 SSR import。自定义浮层容器需先挂载。计时器和请求在客户端生命周期或用户事件中创建，离开页面时清理；不要在模块顶层读取浏览器 DOM。

## React → Vue

| React                           | Vue                                                                |
| ------------------------------- | ------------------------------------------------------------------ |
| value + onChange                | v-model、v-model:value，或 value + @change                         |
| expandedKeys + onExpand         | v-model:expanded-keys 与 @expand                                   |
| onSearch/onLoad/onVisibleChange | @search/@load/@visible-change                                      |
| renderLabel/renderFullLabel     | #label/#fullLabel，或同名函数 prop                                 |
| renderSelectedItem              | 完全自定义用 #selectedItem；需要 isRenderInTag 行为时保留函数 prop |
| triggerRender/searchRender      | #trigger/#search，或同名函数 prop                                  |
| outerTopSlot/outerBottomSlot    | #outerTop/#outerBottom                                             |
| ReactNode                       | VNodeChild 或 Vue 插槽                                             |
| ref.current.search()/close()    | useTemplateRef<TreeSelectExposed>() 配合公开 search()/close()      |

默认 true 的布尔属性必须用 :prop="false" 显式关闭，包括 showSearchClear、autoMergeValue、dropdownMatchSelectWidth、clickToHide、clickTriggerToHide、motion 和 motionExpand。回调参数保留 node/key 语义，监听方式改为 Vue emits。

## 设计变量

::token-table{component="treeSelect"}
::
