# Tree v2.102.0 对齐矩阵

## 路线与固定证据

- 当前路线：最近完成 Tabs；Tree 是固定 `vendor/semi-design/content/order.js` 中紧邻其后的公开组件。
- 固定基线：`vendor/semi-design` tag `v2.102.0`，提交 `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- Adapter/类型/DOM：`packages/semi-ui/tree/index.tsx`、`treeNode.tsx`、`nodeList.tsx`、`indent.tsx`、`interface.ts`。
- 状态机/工具/样式：`packages/semi-foundation/tree/foundation.ts`、`treeUtil.ts`、`constants.ts`、`tree.scss`、`animation.scss`、`rtl.scss`。
- 文档与公开 API：`content/navigation/tree/index.md`、`index-en-US.md` 及 `packages/semi-ui/tree/__test__/`。

## Vue 组件边界

| 文件           | 单一职责                                                               | 公开边界                                     |
| -------------- | ---------------------------------------------------------------------- | -------------------------------------------- |
| `Tree.vue`     | 数据归一化、Foundation Adapter、搜索/展开/选择/拖拽/虚拟滚动与列表组合 | props、emits、slots、`search/scrollTo/focus` |
| `TreeNode.vue` | 单节点 DOM/class、缩进、图标、Checkbox、ARIA、键盘与拖拽事件           | Tree 内部；`Tree.TreeNode` 兼容导出          |
| `types.ts`     | Vue 原生公开类型与 React→Vue 映射                                      | 不泄漏 React、vendor 或私有包类型            |

## API、默认值与 Vue 映射

| Semi React v2.102.0                                                                 | 默认值                                 | Vue 契约                                                                             | 对齐门禁                                                     |
| ----------------------------------------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| `treeData` / `treeDataSimpleJson` / `keyMaps`                                       | `[]` / `{}` / 标准字段                 | 同名 typed props；`TreeNodeData.label/icon` 接受 `VNodeChild`                        | 数据、简单 JSON、自定义字段与动态更新                        |
| `value` / `defaultValue`                                                            | `undefined`                            | 同名 props，加 `v-model`；受控时不提交内部选择                                       | 单选/多选、primitive/object、缺失 key                        |
| `multiple`                                                                          | `false`                                | 同名 Boolean；多选使用已完成 Checkbox                                                | related/unRelated、leafOnly、autoMergeValue、disableStrictly |
| `expandedKeys` / `defaultExpandedKeys`                                              | `undefined`                            | 同名 props，加 `v-model:expandedKeys`                                                | 受控/非受控、autoExpandParent、defaultExpandAll/expandAll    |
| `filterTreeNode` / `searchRender`                                                   | `false` / 默认输入框                   | `search` scoped slot 优先于兼容函数 prop；`false` 隐藏搜索框                         | 搜索、清除、自定义字段、showFilteredOnly、无结果             |
| `showClear` / `blockNode` / `motion` / `autoExpandWhenDragEnter` / `autoMergeValue` | `true`                                 | 保留 Vue Boolean prop；须区分缺省/显式 false/显式 true                               | 每项三态测试；缺省不由普通 truthiness 推断                   |
| `directory` / `showLine` / `labelEllipsis`                                          | `false` / `false` / virtualize 时 true | 同名 props                                                                           | 默认/自定义图标、连接线、RTL、省略                           |
| `icon` / `expandIcon` / `renderLabel` / `renderFullLabel`                           | `undefined`                            | 同名 VNode/函数 prop，并提供 `icon`、`expandIcon`、`label`、`fullLabel` scoped slots | VNode 与函数输入、事件/样式回传、DOM/class                   |
| `loadData` / `loadedKeys`                                                           | `undefined`                            | 同名 props；`load` emit；受控 loadedKeys 不写回                                      | loading、重复守卫、resolve 后事件顺序、卸载清理              |
| `draggable` 与拖拽回调                                                              | `false`                                | 同名 prop；原回调映射为 emits                                                        | start/enter/over/leave/drop/end、dropPosition、后代拒绝      |
| `virtualize`                                                                        | `undefined`                            | `{height,width,itemSize}`；保持 `.semi-tree-virtual-list` 和 `scrollTo`              | viewport 裁剪、对齐滚动、响应数据                            |
| `aria-label` / `preventScroll`                                                      | `undefined`                            | `ariaLabel` 与原生 attrs；公开 `focus({preventScroll})`                              | tree/treeitem/checkbox ARIA、键盘与焦点                      |

事件顺序：单选 `select → change → update:value → update:modelValue`；多选沿用同一顺序；展开 `expand → update:expandedKeys`，展开后再触发异步加载；搜索 `search` 先于状态公开回写。受控 props 只通过父级回写改变可见状态。

## DOM、行为与状态

- 根为 `.semi-tree-wrapper`；可搜索时先渲染 `.semi-tree-search-wrapper`，随后是 `.semi-tree-option-list[role=tree]`。无数据时列表 `role=none`。
- 节点为 `li.semi-tree-option[role=treeitem]`，顺序为 indent → expand/spin/empty icon → label → Checkbox（多选）→ item icon → label text；保留 level、collapsed、selected、active、disabled、ellipsis、draggable、drop 与 last-leaf class。
- Enter 等价节点点击；Checkbox Enter 只切换 checked；`expandAction=click/doubleClick` 保留选中、展开、双击通知顺序。disabled 节点不选择、不勾选且不拖拽。
- 搜索命中文字保留 `.semi-tree-option-highlight`；`showFilteredOnly` 只渲染命中、祖先与后代。
- Foundation、DOM 节点、Timer 和拖拽身份对象使用 `markRaw`/`shallowReactive`，卸载时销毁 Foundation 并清理拖拽延时/节流。

## 主题、视觉、RTL、国际化与动效

- `tree.css` 按 theme index → global → animation → Checkbox → Collapsible → Highlight → Input → Spin → Tree → Icon 依赖顺序编译；根 CSS 同步包含 Tree。
- 默认视觉矩阵覆盖桌面 `1440×900` 与移动 `390×844`、DPR 1、light/dark；方向敏感场景增加 RTL。
- computed style 精确对比根、列表、一级/二级节点、展开 icon、label、选中/禁用/Checkbox；对应 bounding rect 各轴差值不超过 `0.5 CSS px`。
- 截图 threshold 不高于 `0.1`、`maxDiffPixelRatio` 不高于 `0.001`；固定场景无 mask。
- 默认中文空状态/搜索占位从 ConfigProvider locale 读取，en-US 场景验证英文；其余 57 Locale 由既有 ConfigProvider 数据门禁覆盖。
- 展开/收起按上游 `NodeList` 将后代节点合并进 Collapsible 分组，保留固定 200ms 高度/透明度动效；虚拟化关闭节点动效。截图固定在稳定动画时刻。

## SSR、发布与验收

- SSR import 不读取 `window/document`；默认、expanded/multiple/search/directory/RTL 静态输出和 hydration 无警告。
- 根导出、`tree` 子路径、类型、`tree.css`、root CSS、tree-shaking、SSR-safe import 和真实 tarball 安装全部验证。
- React/Vue 参考场景使用相同数据、viewport、DPR、locale、主题、方向与 Chromium 进程。

## Deviation

无。React/Vue 固定场景在同一 Chromium 中的 5 组整场截图逐字节一致；公开契约、Foundation 状态、主题、SSR 与 tarball 门禁均已通过。
