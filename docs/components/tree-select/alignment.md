# TreeSelect v2.102.0 对齐矩阵

状态：`ready`。

## 权威证据

- React Adapter：`vendor/semi-design/packages/semi-ui/treeSelect/index.tsx`
- Foundation：`vendor/semi-design/packages/semi-foundation/treeSelect/foundation.ts`、`constants.ts`
- 主题：`vendor/semi-design/packages/semi-foundation/treeSelect/{treeSelect,variables,rtl}.scss`，以及 Tree、Popover、Input、Tag/TagInput 依赖样式
- 文档与 API：`vendor/semi-design/content/input/treeselect/index{,-en-US}.md`
- 行为：`vendor/semi-design/packages/semi-ui/treeSelect/__test__/*.js` 与 `vendor/semi-design/cypress/e2e/treeSelect.spec.js`

## 组件边界

- `TreeSelect.vue`：公开 Vue props/emits/slots、trigger、Popover 与 Tree 组合面。
- `TreeSelect.vue` 内的组合式状态层：受控/非受控状态、固定 Foundation adapter 生命周期和选中/搜索/展开事件顺序。
- `TreeSelectNodeRenderer.ts`：只负责把公开 `VNodeChild` 渲染到 Adapter 对应节点，不拥有状态。
- `packages/foundation-integration/src/tree-select.*`：唯一允许引用只读 vendor TreeSelect Foundation 的隔离入口；公开声明不得出现 vendor 或私有包路径。

## API、默认值与 Vue 映射

| React v2.102.0                                        | Vue 契约                                                                             | 默认值/说明                                                                                |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| `value` / `defaultValue`                              | `value`、`modelValue` / `defaultValue`，同时发出 `update:value`、`update:modelValue` | 单选 primitive/object；多选数组；显式 `value` 优先于 `modelValue` 以外仅 `modelValue` 优先 |
| `multiple`                                            | `multiple`                                                                           | `false`                                                                                    |
| `checkRelation` / `leafOnly` / `autoMergeValue`       | 同名 props                                                                           | `related` / `false` / `true`                                                               |
| `treeData` / `keyMaps`                                | 同名 props，节点内容使用 `VNodeChild`                                                | `[]` / `{}`                                                                                |
| `expandedKeys` / `defaultExpandedKeys`                | 同名 props，发出 `update:expandedKeys`                                               | 受控/非受控展开                                                                            |
| `defaultExpandAll` / `expandAll` / `autoExpandParent` | 同名 props                                                                           | `false` / `false` / `false`                                                                |
| `filterTreeNode` / `remote` / `showFilteredOnly`      | 同名 props                                                                           | `false` / `false` / `false`                                                                |
| `searchPosition`                                      | `'dropdown' \| 'trigger'`                                                            | `dropdown`                                                                                 |
| `searchRender`                                        | prop 函数或 `#search`                                                                | 显式 `false` 隐藏；不能用 truthiness 代替 prop 存在性                                      |
| `renderLabel` / `renderFullLabel`                     | prop 函数或 `#label` / `#fullLabel`                                                  | slot 优先                                                                                  |
| `renderSelectedItem`                                  | prop 函数或 `#selectedItem`                                                          | 单选返回内容；多选返回 `{ content, isRenderInTag }`                                        |
| `triggerRender`                                       | prop 函数或 `#trigger`                                                               | slot 参数保留 `value/onClear/onSearch/onRemove`                                            |
| `prefix` / `suffix` / `insetLabel` / icons            | 同名 props 与同名 slots                                                              | slot 优先；保留 `x-semi-prop` 与 `.semi-*` 包装层                                          |
| `outerTopSlot` / `outerBottomSlot`                    | props 与 `#outerTop` / `#outerBottom`                                                | top 存在时替代默认 dropdown 搜索框                                                         |
| `defaultOpen` / `clickToHide` / `clickTriggerToHide`  | 同名 props                                                                           | `false` / `true` / `true`                                                                  |
| `dropdownMatchSelectWidth`                            | 同名 prop                                                                            | `true`；打开时以 trigger 几何更新最小宽度                                                  |
| `getPopupContainer`                                   | 同名 prop                                                                            | 稳定自定义容器首次展示即为 Teleport 父节点                                                 |
| `showClear` / `showSearchClear`                       | 同名 props                                                                           | `false` / `true`                                                                           |
| `borderless` / `size` / `validateStatus`              | 同名 props                                                                           | `false` / `default` / `default`                                                            |
| `loadData` / `loadedKeys`                             | 同名 props，发出 `load`                                                              | 客户端异步资源完整清理                                                                     |
| React callbacks                                       | `change/select/search/expand/load/clear/focus/blur/visibleChange` emits              | `select` 先于 `change`；单选选中后再关闭/blur                                              |
| `close()` / `search(value)`                           | `defineExpose`                                                                       | 只暴露公开 imperative 方法                                                                 |

默认值为 `true` 且会受 Vue Boolean 归一化影响的 props：`autoAdjustOverflow`、`autoMergeValue`、`clickToHide`、`clickTriggerToHide`、`dropdownMatchSelectWidth`、`motion`、`motionExpand`、`showSearchClear`、`stopPropagation`。实现必须用原始 VNode prop-key 区分缺省、显式 `false`、显式 `true`；门禁至少覆盖 `dropdownMatchSelectWidth` 和 `clickTriggerToHide` 三态。

## 状态与事件顺序

- 单选：节点未选中时依次 `select(key, true, node)`、`change(value, node, event)`、`update:*`；`clickToHide` 命中时随后关闭并触发 `visibleChange(false)` 与 `blur`。
- 多选 related：由 Foundation 计算 checked/halfChecked，`autoMergeValue` 与 `leafOnly` 决定回填值；unRelated 只切换当前节点。
- 清除：先发出空值 change/update，再更新非受控状态，最后 `clear`；受控模式不擅自保留本地选择。
- 标签关闭：禁用节点不可移除；event 为空仍按固定 Foundation 发出 change/select。
- 搜索：本地模式返回匹配节点和祖先展开 key；remote 仅更新输入并发出空的本地结果。
- 展开：受控 `expandedKeys` 只发事件，不擅自提交状态；非受控更新 Tree 后发出 `expand` 与 `update:expandedKeys`。

## DOM、样式、可访问性与方向

- trigger 根为 `role="combobox"`；Adapter 源码声明的 `aria-haspopup="tree"` 在最终运行时由 Popover 语义增强为 `dialog`，并保留 `.semi-tree-select` 及 single/multiple/focus/disabled/size/status/borderless/with-prefix/with-suffix 状态类。
- popup 保留 `.semi-tree-select-popover > .semi-tree-wrapper > .semi-tree-option-list`；列表为 `role="tree"`，节点语义复用已对齐 Tree。
- trigger 设置 `aria-label="TreeSelect"` 默认值，并透传 `aria-describedby/errormessage/invalid/labelledby/required`。
- clear 为可聚焦 `role="button"`，Enter 与点击等价；trigger Enter 打开，Escape 关闭。
- light/dark 依赖 token；RTL 同时由 ConfigProvider direction、Popover placement 与上游 `rtl.scss` 驱动。
- computed style 精确比较 trigger/popup/tree option；几何各轴差值不超过 `0.5 CSS px`。

## Portal、定位、动效、国际化与 SSR

- Popover 只在客户端创建 Teleport；稳定自定义容器首次展示即命中，不用轮询/Observer 猜测迟到容器。
- Element/Document capture scroll 定位与清理由已完成 Popover/Tooltip 边界承担；TreeSelect 通过 `rePosKey` 在搜索、展开与标签变化后请求重定位。
- 比较动画完成后的终态；截图不接受不同中间帧。
- 默认搜索/空态文本取 ConfigProvider Locale；验证 zh-CN/en-US，并依赖已有 57 Locale 完整性门禁。
- 根包与子路径 SSR-safe import；SSR 不访问 document/window，不渲染 Teleport 内容，hydration 无警告。

## 浏览器与发布门禁

- Chromium：桌面 1440x900 light/dark、移动 390x844 light/dark、桌面 RTL；同 BrowserContext 对照 React/Vue。
- 行为：打开/关闭、单选、多选、搜索、清除、键盘、ARIA、自定义容器、滚动重定位和卸载清理。
- 截图：阈值不超过项目上限，并对 React/Vue 独立 PNG 做直接字节比较后才可声明完全一致。
- 发布：根导出、`@workspace/ui/tree-select`、`@workspace/theme-default/tree-select.css`、类型、SSR import、tree-shaking、许可/SBOM、真实 tarball consumer。

## Deviation

没有 accepted deviation。React/Vue 触发器与浮层的独立 PNG 在桌面/移动 light/dark 及桌面 RTL 场景均直接字节相等；单元/SSR、主题、根与子路径导入、真实 tarball consumer 门禁均已通过。
