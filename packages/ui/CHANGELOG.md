# @aifuxi/semi-ui-vue

## 1.0.0-next.0

### Major Changes

- [#2](https://github.com/aifuxi/semi-ui-vue/pull/2) [`2364e0e`](https://github.com/aifuxi/semi-ui-vue/commit/2364e0edc54af8542d115b1bda12f4c4700ba7d3) Thanks [@aifuxi](https://github.com/aifuxi)! - 进入 1.0 预发布验证阶段：提供固定 Semi 2.102.0 基线的 Vue 组件、主题、图标与插画，以及近期修复的 Markdown 跨 chunk 绑定和文档 REPL 循环依赖加载。五个公开包统一使用 next 渠道；从旧 alpha 升级时应一起更新五包并按组件文档核对 Vue props、emits、slots 与 v-model。此候选不代表稳定版产品验收完成。

### Patch Changes

- [#2](https://github.com/aifuxi/semi-ui-vue/pull/2) [`97ac1b6`](https://github.com/aifuxi/semi-ui-vue/commit/97ac1b60829027141779e39ddd78189973cdee47) Thanks [@aifuxi](https://github.com/aifuxi)! - Expose the pinned `getConfigureItem` factory so custom controls can join `AIChatInput.Configure`.

- [#2](https://github.com/aifuxi/semi-ui-vue/pull/2) [`4828654`](https://github.com/aifuxi/semi-ui-vue/commit/482865404c53e633d746faa9a5123556906fe7cd) Thanks [@aifuxi](https://github.com/aifuxi)! - 修复 Avatar 共享 slot 配置时的节点复用：`topSlot.text`/`bottomSlot.text`/`hoverMask` 传入的 VNode 在渲染前克隆，使同一份配置对象在每个头像实例上都继续渲染，不再静默丢失内容；同步记录 Avatar 双语文档严格验收。

- [#2](https://github.com/aifuxi/semi-ui-vue/pull/2) [`a789395`](https://github.com/aifuxi/semi-ui-vue/commit/a789395154f01c061ef0f56dcf6cb8b43df6b5cc) Thanks [@aifuxi](https://github.com/aifuxi)! - 修复 Calendar 月视图与固定 Adapter 的 DOM 差异：普通 gridcell 始终输出 `aria-current`（当天 `date`、其余 `false`），折叠单元格的 Popover 触发器 `<li>` 不再重复附加 `role="gridcell"`、`aria-label` 与 `aria-current`；同步完成 Calendar 双语文档严格验收。

- [#2](https://github.com/aifuxi/semi-ui-vue/pull/2) [`2280b6a`](https://github.com/aifuxi/semi-ui-vue/commit/2280b6abf91eb716b7986fa6d54a466d5d154152) Thanks [@aifuxi](https://github.com/aifuxi)! - Add the default export for the `code-highlight` public entry.

- [#2](https://github.com/aifuxi/semi-ui-vue/pull/2) [`a7f2192`](https://github.com/aifuxi/semi-ui-vue/commit/a7f21925f63a59a5a2f3425bda1284a3fed903b3) Thanks [@aifuxi](https://github.com/aifuxi)! - 修复 CollapsePanel 的 `aria-owns` 渲染传播：面板 id 在挂载后赋值且不触发渲染，固定 Adapter 会在展开集变化时重渲染全部面板，Vue 此前只有自身重渲染过的面板才输出 id；现按同一时机传播，默认态仍保持空值。同步完成 Collapse 双语文档严格验收。

- [#2](https://github.com/aifuxi/semi-ui-vue/pull/2) [`71ad9a1`](https://github.com/aifuxi/semi-ui-vue/commit/71ad9a1c53e769d5efb90109af435a0118a9e6f6) Thanks [@aifuxi](https://github.com/aifuxi)! - Add the DragMove subpath default export to match the fixed Semi public entry.

- [#2](https://github.com/aifuxi/semi-ui-vue/pull/2) [`306e1c5`](https://github.com/aifuxi/semi-ui-vue/commit/306e1c5a57c27b9e05bdc3a9e338f589fd932677) Thanks [@aifuxi](https://github.com/aifuxi)! - 修复 Dropdown 的组件触发器未转发 Tooltip ARIA 关联、Tag 触发器 tabIndex 丢失的问题，保留调用方显式焦点顺序，并按固定基线恢复嵌套 DropdownItem 的属性透传边界。将 Escape 回焦保留在隐藏前，移除关闭通知和动画结束后的额外聚焦，避免抢走用户已转移的焦点或改变重开后的焦点样式。

- [#2](https://github.com/aifuxi/semi-ui-vue/pull/2) [`54f78a2`](https://github.com/aifuxi/semi-ui-vue/commit/54f78a2d82b550ff3dd867f74d528f176afd11b8) Thanks [@aifuxi](https://github.com/aifuxi)! - 修复 SideSheet 进入动画结束后残留的状态 class，分别清理遮罩与内容动画状态，退出时等待真实动画结束，避免定时器提前卸载；补充 Feedback 双语文档严格验收。

- [#2](https://github.com/aifuxi/semi-ui-vue/pull/2) [`8500f8c`](https://github.com/aifuxi/semi-ui-vue/commit/8500f8c4409fcd039f3bdadfb16b5cc9b048fac1) Thanks [@aifuxi](https://github.com/aifuxi)! - 修复 Image 预览页码的文本节点渲染，使底栏宽度与固定 Semi 基线一致。
  为 ImagePreview 分组恢复稳定的实例 ID。

  修复 Modal 自定义渲染边界，使 modalRender 仅包装对话框内容，并正确保留外层布局与拖拽行为。
  恢复静态 Modal 自定义 Semi 图标的尺寸和状态样式。

  修复 Tooltip/Popover 初始焦点引用，优先调用组件公开的 focus 方法。

- [#2](https://github.com/aifuxi/semi-ui-vue/pull/2) [`a2fa89e`](https://github.com/aifuxi/semi-ui-vue/commit/a2fa89ea75e034f87248221ace7e8b6b1230396c) Thanks [@aifuxi](https://github.com/aifuxi)! - 修复 Modal 数字 `width` 与 `height` 没有显式转换为 CSS `px` 的问题；字符串尺寸继续原样保留。

- [#2](https://github.com/aifuxi/semi-ui-vue/pull/2) [`a0fd13b`](https://github.com/aifuxi/semi-ui-vue/commit/a0fd13bfc367c8b6d883a8450275d69fdb40d7fe) Thanks [@aifuxi](https://github.com/aifuxi)! - 对齐 Notification 固定基线：任意合法 type 都保留 `semi-notification-notice-icon-show` class，自定义 Semi 图标按显式尺寸或 `large` 克隆；完成八项双语文档示例的严格视觉与行为验收。

- [#2](https://github.com/aifuxi/semi-ui-vue/pull/2) [`82b6ce7`](https://github.com/aifuxi/semi-ui-vue/commit/82b6ce72d4298aa7fbef2aee5663ce2e39e8ba9e) Thanks [@aifuxi](https://github.com/aifuxi)! - 修复 OverflowList 隐藏项计数不更新：折叠模式的 `+N` 与滚动模式两端的边缘计数此前停留在首次渲染值（折叠模式的 overflow 渲染器在 computed 中调用，VNode 创建在渲染之外；滚动模式的槽位被 Vue 的 stable 槽更新跳过）。现改为在渲染期调用 overflow 渲染器，并在隐藏项变化时以隐藏项键重建折叠包装节点与滚动边缘片段；同步完成 OverflowList 双语文档严格验收。

- [#2](https://github.com/aifuxi/semi-ui-vue/pull/2) [`25e41b1`](https://github.com/aifuxi/semi-ui-vue/commit/25e41b1c4b525c8d165a7a635c5805f3609948da) Thanks [@aifuxi](https://github.com/aifuxi)! - 修复 TagGroup 折叠计数的内容布局和 ARIA、浮层关闭后再次打开内容为空，以及 Popover 箭头额外的 aria-hidden 属性，使其与固定 Semi 基线一致；修复 Tooltip 在 rePosKey 与触发器位置同时更新时读取旧 DOM、导致滑块提示偏移的问题；并行推进 ScrollList、Tag、Timeline 双语文档严格验收，补齐批次矩阵、参考适配与章节/API/迁移审阅。

- [#2](https://github.com/aifuxi/semi-ui-vue/pull/2) [`eb5c0b6`](https://github.com/aifuxi/semi-ui-vue/commit/eb5c0b6861b10f8680c98f3ddcb96e1fa008b02f) Thanks [@aifuxi](https://github.com/aifuxi)! - 修复 `RadioGroup` 丢弃 slot 顶层 `v-for` 生成的 `Fragment`：模板内直接 `v-for` 的 `Radio` 现在全部渲染并保持组选中语义（此前整段列表被过滤掉）。同时完成 Popconfirm 四项示例的双语、明暗与适用 RTL 严格验收。

- [#2](https://github.com/aifuxi/semi-ui-vue/pull/2) [`067a196`](https://github.com/aifuxi/semi-ui-vue/commit/067a1961c0f50765581585b8615e5340f912cfc4) Thanks [@aifuxi](https://github.com/aifuxi)! - Export TagInput size and validate-status constants from the public entry.

- [#2](https://github.com/aifuxi/semi-ui-vue/pull/2) [`32ff62b`](https://github.com/aifuxi/semi-ui-vue/commit/32ff62b9eb59f660fc3f996b61322106c706e468) Thanks [@aifuxi](https://github.com/aifuxi)! - Export Resizable direction constants and public helper types from the resizable entry.

- [#2](https://github.com/aifuxi/semi-ui-vue/pull/2) [`36c5e86`](https://github.com/aifuxi/semi-ui-vue/commit/36c5e86f635745f6f7eaeefd949bb8ef95108287) Thanks [@aifuxi](https://github.com/aifuxi)! - 修复 SideSheet 初始省略 `mask` 后动态显式设置 `mask=false` 时仍保留遮罩的问题。

- [#2](https://github.com/aifuxi/semi-ui-vue/pull/2) [`2a76510`](https://github.com/aifuxi/semi-ui-vue/commit/2a765109eb57a107d5c58a6b36605231046cbb77) Thanks [@aifuxi](https://github.com/aifuxi)! - Align Table virtual scrolling, measurement caches and end-of-list navigation, declarative and grouped headers, optional cell render props, dynamic fixed-column layout and expanded content, and complete sorting/filtering callback queries with the pinned Semi baseline. Reset internal Table state when entering or leaving resizable mode. Prevent duplicate pagination and expansion callbacks, preserve Switch state when controlled checked is removed, and correct the bilingual Table documentation examples.

- [#2](https://github.com/aifuxi/semi-ui-vue/pull/2) [`503f6e8`](https://github.com/aifuxi/semi-ui-vue/commit/503f6e81ac981958b4f35acbd1649f856a57cbcd) Thanks [@aifuxi](https://github.com/aifuxi)! - Apply the pinned ColumnProps of object `expandedRowRender` results to the expanded row cell and evaluate them once per rendered expanded row.

- [#2](https://github.com/aifuxi/semi-ui-vue/pull/2) [`df6cc51`](https://github.com/aifuxi/semi-ui-vue/commit/df6cc512c900029c5854d8b10c18631bea9655a7) Thanks [@aifuxi](https://github.com/aifuxi)! - Add the pinned `Tabs.TabPane` and `Tabs.TabItem` compound statics to the public entry.

- [#2](https://github.com/aifuxi/semi-ui-vue/pull/2) [`f6096e6`](https://github.com/aifuxi/semi-ui-vue/commit/f6096e62fd4dc674547640e4d78150532a4d8d81) Thanks [@aifuxi](https://github.com/aifuxi)! - 修复 Table 受控分页重复切片、受控排序通知、行列无障碍属性与 RTL 固定列，并向自定义 sorter 传递排序方向；补齐 Checkbox 独立名称透传、Table 选择状态名称与 Pagination 非当前页状态。修复 SideSheet 数字宽高及多实例容器切换时的 Portal 锚点错误，补充对应文档严格对照。

  补齐 Select 多选标签的默认方形样式与最大宽度，支持文档示例通过方向参数预览真实 RTL 上下文。

  修复 Input 与 Checkbox 缺省无障碍属性的输出，以及 Descriptions 复用 VNode 数据时展开行关闭重开后内容丢失的问题。

  修复 Dropdown 在弹层定位前提前触发可见性通知、导致回调聚焦使页面意外滚动的问题；保留受控可见状态的即时回写。

- [#2](https://github.com/aifuxi/semi-ui-vue/pull/2) [`84bcff5`](https://github.com/aifuxi/semi-ui-vue/commit/84bcff501a97c0718502cf7084e0a54634889347) Thanks [@aifuxi](https://github.com/aifuxi)! - 对齐 Toast 固定基线：`useToast` holder 改为就地渲染裸 Toast（不再包 `.semi-toast-innerWrapper`）、空 holder 不渲染节点且列表位移为 0；完成九项双语示例（含英文独有 Stacking）的严格视觉与行为验收。

- [#2](https://github.com/aifuxi/semi-ui-vue/pull/2) [`d0bee77`](https://github.com/aifuxi/semi-ui-vue/commit/d0bee772c354865bb231065cafc27428e2e4584c) Thanks [@aifuxi](https://github.com/aifuxi)! - 修复 Table 的分组分页顺序与分组行结构、树叶缩进和展开图标响应式更新，以及列宽回调结果、拖动样式与容器尺寸监听，使固定文档示例符合公开契约。
- Updated dependencies []:
  - @aifuxi/semi-icons-vue@1.0.0-next.0
  - @aifuxi/semi-illustrations-vue@1.0.0-next.0

> 0.1.0 是清除旧 alpha 计数时由 Changesets 生成的未发布迁移基线，不代表一次 npm 发布。首个外部候选由后续版本 PR 生成。

## 0.1.0

### Patch Changes

- Changesets 接入时清除旧 alpha 计数的本地迁移基线；0.1.0 未发布，不代表稳定版。此状态必须与待处理的 1.0 major changeset 和 next 预发布状态一起合并，首个外部候选为 1.0.0-next.0。
- Updated dependencies []:
  - @aifuxi/semi-icons-vue@0.1.0
  - @aifuxi/semi-illustrations-vue@0.1.0
