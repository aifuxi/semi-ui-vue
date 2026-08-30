# Cascader v2.102.0 对齐矩阵

## 路线与固定证据

- 当前路线：Navigation 已完成后，既定路线与 `README.md` 都指向依赖已就绪的 Cascader；它依赖的 Input、Popover、Tag、TagInput、Spin、Checkbox、Locale 与 Tree 工具链均已进入 `ready`。
- 唯一基线：`vendor/semi-design` tag `v2.102.0`，提交 `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- React Adapter：`packages/semi-ui/cascader/{index,item,virtualRow}.tsx`。
- Foundation：`packages/semi-foundation/cascader/{foundation,util,constants}.ts`，多选关系计算复用固定 Tree 工具。
- 主题：`packages/semi-foundation/cascader/{cascader,variables,animation,rtl}.scss` 与默认主题全局 Token。
- 文档与行为证据：`content/input/cascader/{index,index-en-US}.md`、`packages/semi-ui/cascader/__test__/cascader.test.js` 及 `_story/`。

## Vue 组件边界

| 组件                   | 单一职责                                                                   | 公开通信                                                            |
| ---------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `Cascader`             | 归一化树数据，桥接固定 Foundation，管理受控/非受控选择、搜索、浮层与触发器 | props、`v-model`、emits、slots、公开 `open/close/focus/blur/search` |
| `CascaderPanel`        | 渲染级联列或扁平搜索结果，保持固定 option DOM/class/ARIA，并转发条目交互   | typed props/emits；不持有业务状态                                   |
| `CascaderNodeRenderer` | 将 VNode/function prop 与 scoped slot 统一为 Vue VNode                     | typed props；无状态                                                 |

## 公开 API 与 Vue 映射

| React v2.102.0                                     | 默认值                                       | Vue 契约                                                                                   |
| -------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `value` / `defaultValue`                           | -                                            | 保留，并提供 `modelValue` / `update:modelValue`；单选为 value path，多选为 value path 数组 |
| `treeData`                                         | `[]`                                         | 保留；输入对象不被修改，`keyMaps` 只在内部映射标准字段                                     |
| `multiple`                                         | `false`                                      | 保留；多选使用 Checkbox 与 TagInput，支持 related/unRelated                                |
| `autoMergeValue`                                   | `true`                                       | 保留缺省/显式 false/显式 true；和 `leafOnly` 共同决定输出与 Tag key                        |
| `filterLeafOnly`                                   | `true`                                       | 保留缺省/显式 false/显式 true；本地与 remote 搜索均适用                                    |
| `motion`                                           | `true`                                       | 保留缺省/显式 false/显式 true并透传 Popover                                                |
| `stopPropagation`                                  | `true`                                       | 保留缺省/显式 false/显式 true并透传 Popover                                                |
| `filterTreeNode` / `filterSorter` / `filterRender` | `false` / - / -                              | 保留；另提供 `#filter` scoped slot                                                         |
| `searchPosition`                                   | `trigger`                                    | `'trigger'                                                                                 | 'custom'`；`search()` 支持自定义搜索入口 |
| `showNext`                                         | `click`                                      | `'click'                                                                                   | 'hover'`；disabled 节点不展开            |
| `changeOnSelect`                                   | `false`                                      | 单选可选择非叶节点；叶节点按固定规则关闭浮层                                               |
| `enableLeafClick` / `clickToSelect`                | `false`                                      | 多选点击叶节点/任意节点触发勾选，Checkbox 仍独立可用                                       |
| `autoMergeValue` / `leafOnly` / `checkRelation`    | `true` / `false` / `related`                 | 复用固定 Foundation 与 Tree 关系算法                                                       |
| `disableStrictly`                                  | `false`                                      | disabled 后代不会由父子关系间接改写                                                        |
| `loadData` / `onLoad`                              | -                                            | Promise 异步加载；同一 key 加载中/已加载不重复请求                                         |
| `loadedKeys`                                       | React propType 声明但固定 Adapter 未受控读取 | 类型兼容保留；内部仍按固定 Foundation 生命周期维护，不发明受控语义                         |
| `keyMaps`                                          | -                                            | 支持 value/label/children/disabled/isLeaf 自定义字段                                       |
| `max` / `onExceed`                                 | -                                            | 超限时不增加选择，只发 `exceed`                                                            |
| `maxTagCount` / `showRestTagsPopover`              | - / `false`                                  | 保留 +N 与剩余 Tag Popover                                                                 |
| `displayProp` / `displayRender`                    | `label` / path join                          | function prop 与 `#display` slot；多选接收 Entity 与 index                                 |
| `triggerRender`                                    | -                                            | function prop 与 `#trigger` scoped slot，payload 使用 Vue 事件/回调                        |
| `prefix` / `suffix` / `topSlot` / `bottomSlot`     | -                                            | VNode prop 加 `#prefix/#suffix/#top/#bottom`                                               |
| `arrowIcon` / `clearIcon` / `expandIcon`           | 固定默认图标                                 | VNode prop 加同名 scoped slot                                                              |
| `getPopupContainer`                                | `document.body`                              | 显式 prop 优先，其次 ConfigProvider；稳定容器首次打开即作为 Teleport 父节点                |
| `onChange` / `onSelect` / `onSearch`               | noop                                         | `change` / `select` / `search`；同时发 `update:modelValue` 与 `update:value`               |
| `onDropdownVisibleChange`                          | noop                                         | `visibleChange`；每次真实 open/close 通知                                                  |
| `onClear` / `onExceed` / `onListScroll` / `onLoad` | noop                                         | `clear` / `exceed` / `listScroll` / `load`                                                 |
| ref methods                                        | `open/close/focus/blur/search`               | `defineExpose` 同名方法                                                                    |

## 状态、数据与事件顺序

- 单选非叶节点且 `changeOnSelect=false`：只更新 active path，必要时触发加载；不发 change/select。
- 单选可选择节点：先发 `select`，value 变化时再发 `change` 与 `update:*`；非受控更新视图，受控只等待父级回写；叶节点随后关闭并发 `visibleChange(false)`、`blur`。
- 多选 Checkbox：计算 related/unRelated、autoMerge/leafOnly/disableStrictly/max 后更新非受控状态并发 `change`；仅由未选到已选时发 `select`。
- 搜索：先更新 input/filtered 状态，再发 `search` 并请求浮层重定位；remote 模式不做本地匹配，把更新后的 `treeData` 当结果。
- 清除：阻止 trigger click 冒泡；清理搜索/选中状态，发必要的 `search('')`、`change([])`，最后发 `clear` 并重定位。
- `loadData` 完成时 `load` 先于内部 loaded/loading 状态提交；异步 data 更新后 active path 不回退。
- `treeData`、`keyMaps` 或受控 value 更新时重新建立 entity；不得修改调用方树节点、children 或 value。

## DOM、class 与视觉

- 默认触发器根 `.semi-cascader[role=combobox][tabindex=0]`，保留 borderless/focus/disabled/filterable/error/warning/size/prefix/suffix 状态 class。
- 触发器顺序保持 prefix → `.semi-cascader-selection` → suffix → clear → arrow；多选 Tag 与 +N 使用固定 `.semi-cascader-selection-*` 结构。
- 浮层根 `.semi-cascader-popover[role=listbox]`；面板为 `.semi-cascader-option-lists`，每级为 `ul.semi-cascader-option-list[role=menu]`。
- option 保留 `.semi-cascader-option`、active/select/disabled/flatten、label/icon/spin/highlight class 和固定 id/aria 关系。
- 空状态继续由 Cascader locale 的 `emptyText` 驱动；空列表宽度遵循显式非百分比 width，否则取 trigger 几何。
- 独立 Cascader CSS 同时包含 Popover/Portal、Input、Tag/TagInput、Checkbox、Spin 与 Icon 依赖样式。

## 键盘、焦点与 ARIA

- Enter 在 trigger 上等价打开/关闭规则；option Enter 等价点击；clear Enter 等价清除。
- Escape 在 trigger 或浮层关闭；关闭后清理 outside listener、搜索显隐与焦点状态。
- 根保留 `role=combobox`、tabindex 与 `aria-label/labelledby/describedby/errormessage/invalid/required`。
- 浮层 `role=listbox`，列 `role=menu`，条目 `role=menuitem`，并保留 `aria-expanded/haspopup/disabled/owns`。
- disabled 根、disabled option 以及 strict-disabled Tag 均不可触发状态或事件。

## Portal、动效、主题、RTL、国际化与 SSR

- 自定义容器在首次打开前稳定存在；首次 Teleport 父节点必须正确。不为固定源码未承诺的迟到容器增加 Observer/轮询。
- 复用 ready Popover 的 Element/Document capture-scroll 重定位与卸载清理；Cascader 自身 document mousedown listener 只在打开期间存在。
- `motion=false` 无过渡；`motion=true` 只比较终态，不比较不同动画帧。
- `ConfigProvider.direction=rtl` 驱动 trigger 与 Portal `.semi-rtl/.semi-portal-rtl`、列顺序、边框、icon 翻转；截图覆盖 RTL。
- locale 使用 `Cascader.emptyText`，显式 provider 优先；场景覆盖 zh-CN/en-US 空态。
- import 必须 SSR-safe；SSR 输出稳定 trigger，Portal、document listener、测量与 focus 仅在客户端生命周期发生并完整清理。

## 编码前适配门禁

- `autoMergeValue`、`filterLeafOnly`、`motion`、`stopPropagation`：缺省、显式 false、显式 true 三组，不用普通 truthiness 代替 prop 是否显式传入。
- `triggerRender`、`filterRender` 与 icon/content VNode 不被就地修改；function prop 与 scoped slot 都覆盖。
- 稳定自定义 Portal 容器首次打开即正确；Element/Document capture-scroll 后 geometry 更新；卸载后无 Portal、document listener、timer 或 RAF。
- 搜索、受控/非受控、multiple related/unRelated、async load、keyMaps、max、disabled/disableStrictly、clear、Enter/Escape、locale/RTL 均以公开 DOM 与 emits 断言。

## Deviation

- 当前无已接受视觉或行为 deviation。
- `loadedKeys` 虽出现在固定 React propTypes，但 v2.102.0 Adapter/Foundation 不把它作为受控输入；Vue 保留类型入口，不扩展行为。
- 文档 `separator` 表中写 `/`，固定源码默认值实际为 `' / '`；以源码为准。

## 完成门禁

- Vue 源码、Foundation facade、根/子路径导出、Cascader 独立 CSS。
- 中英文文档、React→Vue 迁移、React/Vue 同数据场景。
- 单元/SSR/类型、搜索、多选、键盘/ARIA、Portal/locale/RTL、桌面/移动 light/dark 浏览器对照。
- 关键 computed style 精确相等、几何误差不超过 `0.5 CSS px`；阈值截图通过后再直接比较成对 PNG。
- 真实 tarball 安装、根/子路径 ESM、声明、样式、tree-shaking、SSR import、许可与 SBOM 验证。
