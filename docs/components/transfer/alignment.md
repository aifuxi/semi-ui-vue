# Transfer v2.102.0 对齐矩阵

## 权威源码

- React Adapter、公开类型、DOM 与 class：`vendor/semi-design/packages/semi-ui/transfer/index.tsx`
- Foundation 与数据展开：`vendor/semi-design/packages/semi-foundation/transfer/foundation.ts`、`transferUtils.ts`、`constants.ts`
- 样式、动效与 RTL：`vendor/semi-design/packages/semi-foundation/transfer/transfer.scss`、`variables.scss`、`animation.scss`、`rtl.scss`
- 中英文文档与 API：`vendor/semi-design/content/input/transfer/index.md`、`index-en-US.md`
- 上游行为测试：`vendor/semi-design/packages/semi-ui/transfer/__test__/transfer.test.js`

## 组件边界

- `Transfer`：唯一公开组件，负责受控/非受控选中状态、搜索、分页、分组/树数据、两侧面板组合和公开 `search()` 方法。
- `TransferNodeRenderer`：只负责把 render prop 返回的 Vue `VNodeChild` 落到模板，不拥有状态。
- 右侧虚拟列表与 HTML5 拖拽保持为 `Transfer` 的局部展示能力；它们只消费已选数组，不建立第二份业务状态。

## API 与 Vue 映射

| React v2.102.0                            | 默认值 / 行为                                 | Vue 公开契约                                                                        |
| ----------------------------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------- |
| `dataSource`                              | `[]`                                          | 同名，支持 `DataItem[] / GroupItem[] / TreeItem[]`                                  |
| `defaultValue`                            | `[]`                                          | 非受控初值                                                                          |
| `value`                                   | 出现时受控                                    | 同名并补充 `modelValue` / `v-model`；必须按原始 VNode prop 判断是否出现             |
| `type`                                    | `list`                                        | `list / groupList / treeList`                                                       |
| `filter`                                  | 缺省时显示搜索；`false` 隐藏；函数自定义匹配  | 同名；树模式交给 `Tree.search` 与 `treeProps.filterTreeNode`                        |
| `disabled/loading/showPath/draggable`     | 均为 `false`                                  | Vue Boolean props；未涉及默认 true，不需要缺省/false/true 特殊合并                  |
| `inputProps/treeProps`                    | 合并到内部 Input/Tree，内部 value/change 优先 | 同名；去除会覆盖内部受控链的字段                                                    |
| `emptyContent`                            | locale 回退                                   | 同名，并补充 `emptyLeft/emptyRight/emptySearch` slots                               |
| `pagination`                              | 缺省关闭；pageSize 10；初页 1                 | 同名，支持受控 `currentPage` 和非受控 `defaultCurrentPage`                          |
| `virtualize`                              | 只作用于默认右侧、非 draggable 列表           | 同名，固定行高 windowing，容器保留 list 语义                                        |
| `renderSourceItem/renderSelectedItem`     | render props                                  | 同名函数 prop，并补充 `sourceItem/selectedItem` scoped slots                        |
| `renderSourcePanel/renderSelectedPanel`   | 完全替换左右面板                              | 同名函数 prop，并补充 scoped slots；两侧都自定义时根加 `semi-transfer-custom-panel` |
| `renderSourceHeader/renderSelectedHeader` | 替换对应 header                               | 同名函数 prop，并补充 scoped slots                                                  |
| `onChange`                                | values、items；拖拽排序也触发                 | `change(values, items)`、`update:value`、`update:modelValue`                        |
| `onSelect/onDeselect/onSearch`            | 单项选择、取消、输入搜索                      | `select`、`deselect`、`search` emits                                                |
| `search(value)`                           | 更新搜索框与结果，不触发 `onSearch`           | `defineExpose({ search })`，行为相同                                                |
| React `className/style`                   | 根节点                                        | `className`、Vue `class`/`style` 与 `data-*` 均保留                                 |

`renderSelectedItem` 的 React `sortableHandle(render)` 在 Vue 中保留为返回 `VNodeChild` 的函数；slot 额外提供 `dragHandleProps`，便于模板把 `draggable` 与 drag 事件绑定到任意节点。

## 状态、事件顺序与数据规则

1. `groupList` 按组顺序展平并保存 `_parent`；`treeList` 深度优先展平，保存 `path`，叶节点标记 `isLeaf`，不修改调用方数据。
2. 选中状态内部以 item `key` 为 Map key，对外始终发送 item `value` 数组；受控模式仍发事件但不提交内部结果。
3. 单项选择时先发 `select/deselect`，再发 `change` 与两个 Vue model 更新事件；禁用根或禁用 item 均不发事件。
4. 搜索先计算 `searchResult`，重置左侧页码为 1，再发 `search`；暴露的 `search()` 省略最后一步通知。
5. 全选/取消全选仅作用于当前筛选结果中的非禁用项；清空右侧保留已选禁用项。
6. 分页只切片左侧可见数据；`pagination.currentPage` 显式出现时由父级控制，搜索仍请求回到第 1 页。
7. 拖拽以最终顺序重建 Map，只发 `change`/model 更新，不额外发 select/deselect。

## DOM、class、样式与动效

- 根：`.semi-transfer`，禁用加 `.semi-transfer-disabled`，双自定义面板加 `.semi-transfer-custom-panel`。
- 左右：`section.semi-transfer-left/right`；搜索 `.semi-transfer-filter[role=search]`；header、list、empty、group-title 与固定源码同名。
- 默认候选项复用 `.semi-checkbox.semi-transfer-item[role=listitem]`；右侧 item 保留 `semi-transfer-item semi-transfer-right-item`、文本、关闭图标和可选拖拽 handle。
- 左侧列表 `role=list aria-label="Option list"`；右侧普通/虚拟列表 `role=list aria-label="Selected list"`。
- 固定主题高度 400px、最小宽 402px、两侧各 50%、item 最小高 36px；hover/active、disabled、dark token 与 RTL 直接编译固定 SCSS。
- item 背景 transition duration 为 token 的 none；拖拽不引入额外视觉动效。

## 键盘、焦点、ARIA、Portal、国际化、RTL 与 SSR

- 搜索框沿用 Input 键盘/焦点/clear 契约，容器固定 `role=search aria-label="Transfer filter"`。
- 候选项沿用 Checkbox 的 Space、focus-visible 和 disabled 契约；全选/清空沿用 Button 键盘语义；关闭图标保持上游非 Button SVG 行为，不额外虚构 Escape 或焦点管理。
- 组件不创建 Portal/Teleport，不注册 window scroll/resize；因此 Vue Adapter 的 Portal/capture-scroll 门禁不适用。
- locale 优先级：ConfigProvider `locale.Transfer` > locale code 对应 zh-CN/en-US 默认值；所有 57 locale 的完整性由既有 ConfigProvider/inventory 门禁承担，本切片验证 zh-CN/en-US 可渲染与切换。
- RTL 从 ConfigProvider direction 注入 `.semi-rtl` 包裹语义，并验证左右边框、padding 与 header 按钮 margin 翻转。
- 根入口与 `@workspace/ui/transfer` 子路径 import SSR-safe；SSR 可输出 list/group/tree/loading/disabled/locale/RTL 静态 DOM，不访问 browser global。虚拟列表服务端从首行开始渲染可见窗口。

## 编码前行为门禁

- defaultValue、受控 `value`、`modelValue`，以及受控点击只发事件不提交 UI。
- 单选/取消事件顺序、全选当前筛选项、清空保留 disabled、数据更新时重算搜索结果。
- filter=false、自定义 filter、暴露 `search()` 不通知、输入搜索通知并重置分页。
- group title 只渲染一次；treeList leafOnly、Tree search、showPath 的显示与回调 fullPath 均为克隆数据。
- custom item/header/panel 的函数 prop 与 slot 映射，custom panel class。
- pagination 默认/受控页、virtualize list 语义与滚动窗口、draggable 最终顺序。
- Checkbox/Button/Input 键盘与焦点、ARIA list/listitem/search、disabled/loading、zh-CN/en-US、dark、RTL、SSR。
- desktop `1440x900`、mobile `390x844`、light/dark/RTL 的 React/Vue computed style、geometry、裁剪截图；截图独立生成后直接比较 bytes/pixels。
- 根/子路径类型、逐组件 CSS、SSR import、真实 tarball 安装/导入/声明/tree-shaking/合规。

## Deviation

- React render props 映射为 Vue 函数 prop 与同名 scoped slot；ReactNode 映射为 `VNodeChild`。
- 默认拖拽使用浏览器 HTML5 drag events，而不是 React 的 dnd-kit；公开顺序、回调、禁用项和 handle 能力等价，不把 dnd-kit 的 React 组件身份带入 Vue API。
- 虚拟列表使用 Vue 本地固定行高 windowing，而不是 React Window；公开尺寸、滚动可达性、list/listitem 语义与最终视觉保持等价。
- 当前无 accepted visual/behavior deviation。

## 验收结论

- 状态：`ready`，固定基线 `v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- Vue API、Foundation 隔离桥、默认主题及 `transfer.css` 子入口、中英文文档、React→Vue 迁移表与 React/Vue 场景均已落地。
- Transfer 聚焦单元/SSR 为 12/12，通过连同场景注册测试在内的聚焦套件 153/153；完整 `pnpm check` 为 110 个测试文件、781 个测试全部通过，UI 与 React 参考应用类型检查、源码边界、dist SSR import、主题产物与真实 tarball 消费验证均通过。
- Chromium 固定构建完成 7 个关键节点的 computed style/geometry 对照；desktop/mobile 的 light/dark 与 RTL 共 5 组独立 React/Vue 截图均直接字节相等，未使用 mask，也没有 accepted visual/behavior deviation。
