# @aifuxi/semi-ui-vue

## 2.1.3

### Patch Changes

- [#39](https://github.com/aifuxi/semi-ui-vue/pull/39) [`ebca03f`](https://github.com/aifuxi/semi-ui-vue/commit/ebca03f26434aaa7ac7233f16ef7c5fff3077028) Thanks [@aifuxi](https://github.com/aifuxi)! - 修复公开组件及静态子组件在 TSX 中遗漏事件属性的问题，保留原组件的事件、插槽和实例方法类型，并补齐 Form 字段监听器及 change 追加表单值的类型。
- Updated dependencies []:
  - @aifuxi/semi-icons-vue@2.1.3
  - @aifuxi/semi-icons-lab-vue@2.1.3
  - @aifuxi/semi-illustrations-vue@2.1.3
  - @aifuxi/semi-theme-default@2.1.3

## 2.1.2

### Patch Changes

- [#36](https://github.com/aifuxi/semi-ui-vue/pull/36) [`2042af0`](https://github.com/aifuxi/semi-ui-vue/commit/2042af0570c51d3264e0af27ecfadeb1de44799b) Thanks [@aifuxi](https://github.com/aifuxi)! - 修复 Popover 未透传 clickTriggerToHide 的问题，并修正 Tooltip 在同一次操作中先关闭后重开的事件顺序，确保再次点击或键盘激活触发器时可靠关闭。

- [#36](https://github.com/aifuxi/semi-ui-vue/pull/36) [`9000212`](https://github.com/aifuxi/semi-ui-vue/commit/90002120b34caf4dc0e1d41bc06087e6642eadac) Thanks [@aifuxi](https://github.com/aifuxi)! - 修复 SideSheet 的公开 aria-label 在 Vue 属性名规范化后读取失败的问题，确保自定义标题插槽、动态名称和重开时 dialog 保留正确的可访问名称。
- Updated dependencies []:
  - @aifuxi/semi-icons-vue@2.1.2
  - @aifuxi/semi-icons-lab-vue@2.1.2
  - @aifuxi/semi-illustrations-vue@2.1.2
  - @aifuxi/semi-theme-default@2.1.2

## 2.1.1

### Patch Changes

- [#34](https://github.com/aifuxi/semi-ui-vue/pull/34) [`f35756b`](https://github.com/aifuxi/semi-ui-vue/commit/f35756b2cc75a72d87bf459f0bef85e23cde38e4) Thanks [@aifuxi](https://github.com/aifuxi)! - 修复 Table 使用 CSS 字符串列宽时正文固定列偏移归零、与表头错位的问题；主题变量或容器尺寸变化后重新测量字符串列宽，保持左右固定列对齐。

- [#34](https://github.com/aifuxi/semi-ui-vue/pull/34) [`d793c0f`](https://github.com/aifuxi/semi-ui-vue/commit/d793c0fbb09c415124b03a0ca82bad0f3b0d29e1) Thanks [@aifuxi](https://github.com/aifuxi)! - 修复 Modal 自定义 header 丢失 title 可访问名称的问题；嵌套或多个 Modal 的 Esc 仅作用于顶层，关闭后恢复有效入口或外层焦点，并保留顶层关闭保护及退出动效。
- Updated dependencies []:
  - @aifuxi/semi-icons-vue@2.1.1
  - @aifuxi/semi-icons-lab-vue@2.1.1
  - @aifuxi/semi-illustrations-vue@2.1.1
  - @aifuxi/semi-theme-default@2.1.1

## 2.1.0

### Minor Changes

- [#32](https://github.com/aifuxi/semi-ui-vue/pull/32) [`da74d73`](https://github.com/aifuxi/semi-ui-vue/commit/da74d73f689c02f9eaf4126b0c5178771ed44b2a) Thanks [@aifuxi](https://github.com/aifuxi)! - 增加独立的颜色生成器公开入口，提供与固定 Semi DSM 算法结果一致的单色阶和全色盘生成、双模式语义主题及普通 CSS 输出。支持局部主题、强制深浅模式和弹层颜色继承，消费者无需 Sass 或专用构建插件；默认主题继续保持固定 Semi v2.102.0 基线。

- [#32](https://github.com/aifuxi/semi-ui-vue/pull/32) [`c5575dd`](https://github.com/aifuxi/semi-ui-vue/commit/c5575ddd2866ee556099478c06a5c49245afe310) Thanks [@aifuxi](https://github.com/aifuxi)! - 提供字体、字号、字重及行高的公开 CSS 主题变量，默认排版保持 Semi v2.102.0 基线。支持局部主题、默认弹层的排版继承，以及主题和字体变化后的 Typography 省略重算；用户定制主题无需 Sass 或专用构建插件。

### Patch Changes

- [#32](https://github.com/aifuxi/semi-ui-vue/pull/32) [`c828384`](https://github.com/aifuxi/semi-ui-vue/commit/c8283848ca186305c1ab1b521e471725f5ba4f25) Thanks [@aifuxi](https://github.com/aifuxi)! - 修复 Dropdown 未提供可选 Boolean 参数时将 false 透传给 Tooltip、关闭默认防溢出的问题。未传或显式 undefined 的 autoAdjustOverflow 继续使用全局覆盖与下层默认值，保留显式 false，并支持运行时参数切换。

- [#32](https://github.com/aifuxi/semi-ui-vue/pull/32) [`69ed5de`](https://github.com/aifuxi/semi-ui-vue/commit/69ed5de357f94188fc47f4fc47cbff2a8d7fbf13) Thanks [@aifuxi](https://github.com/aifuxi)! - 修复 Form.ErrorMessage 将空字符串错误转换为 true、在无错误时显示红色图标的问题；对齐 React Semi v2.102.0 的空值、帮助文案及布尔错误显示契约，并保持错误清除和再次显示同步。

- [#32](https://github.com/aifuxi/semi-ui-vue/pull/32) [`11a6791`](https://github.com/aifuxi/semi-ui-vue/commit/11a67915f6f35f72a349ed59902372106a1f70a1) Thanks [@aifuxi](https://github.com/aifuxi)! - 修复多实例和嵌套 Modal 共用标题、正文 ID 导致可访问名称与描述错误关联的问题。每个弹窗引用自身节点，命令式弹窗使用独立 app ID 前缀，SSR/hydration 保持关联稳定；无标题或自定义 header 时不再输出悬空的标准标题引用。

- [#32](https://github.com/aifuxi/semi-ui-vue/pull/32) [`27f9fd5`](https://github.com/aifuxi/semi-ui-vue/commit/27f9fd55ca4a17fefe861b0f14f31c689010f9f6) Thanks [@aifuxi](https://github.com/aifuxi)! - 对齐 React Semi v2.102.0 的 TimePicker 专用弹层前缀，移除明暗主题下额外套用的 Popover 阴影、背景和圆角，保留原版时间范围列表的固定阴影。

  选中时间居中时仅纵向滚动当前时间列，避免范围面板被连带横向滚动而产生 1px 内容偏移。

- [#32](https://github.com/aifuxi/semi-ui-vue/pull/32) [`5d5daed`](https://github.com/aifuxi/semi-ui-vue/commit/5d5daed74283bd66661e337701b6a2667661989e) Thanks [@aifuxi](https://github.com/aifuxi)! - 修复普通 Typography 字重覆盖 Upload 文件名强调的级联回归。

  通过固定 Semi 基线的实际深浅模式与尺寸、状态对照，修复日期选择器面板、Select 加载指示、Cascader 初始展开、Tree 加载与虚拟布局、Table 选择禁用、虚拟列宽及分组标题、AI 输入菜单宽度与模板图标、AI 对话删除菜单、Sidebar 链接状态、Chat 默认 Markdown 排版及样式依赖、JSON 搜索焦点与音视频音量轨道尺寸差异。

- Updated dependencies [[`da74d73`](https://github.com/aifuxi/semi-ui-vue/commit/da74d73f689c02f9eaf4126b0c5178771ed44b2a), [`c5575dd`](https://github.com/aifuxi/semi-ui-vue/commit/c5575ddd2866ee556099478c06a5c49245afe310), [`5d5daed`](https://github.com/aifuxi/semi-ui-vue/commit/5d5daed74283bd66661e337701b6a2667661989e)]:
  - @aifuxi/semi-theme-default@2.1.0
  - @aifuxi/semi-icons-vue@2.1.0
  - @aifuxi/semi-icons-lab-vue@2.1.0
  - @aifuxi/semi-illustrations-vue@2.1.0

## 2.0.3

### Patch Changes

- [#30](https://github.com/aifuxi/semi-ui-vue/pull/30) [`0d25ed9`](https://github.com/aifuxi/semi-ui-vue/commit/0d25ed96091875a61c04ad9748bc59a2910a0681) Thanks [@aifuxi](https://github.com/aifuxi)! - 修复下拉浮层收起动画期间仍拦截鼠标和焦点，导致相邻字段选择未生效的问题；关闭内容立即停止交互，保留动画和关闭事件时序。
- Updated dependencies []:
  - @aifuxi/semi-icons-vue@2.0.3
  - @aifuxi/semi-icons-lab-vue@2.0.3
  - @aifuxi/semi-illustrations-vue@2.0.3
  - @aifuxi/semi-theme-default@2.0.3

## 2.0.2

### Patch Changes

- [#28](https://github.com/aifuxi/semi-ui-vue/pull/28) [`08ecb56`](https://github.com/aifuxi/semi-ui-vue/commit/08ecb56c71333463145c0c6abd415eda0fe340d5) Thanks [@aifuxi](https://github.com/aifuxi)! - 将 Markdown 渲染依赖 markdown-it 更新至 14.3.3，修复特殊输入导致的同步渲染阻塞；同步更新开发与文档环境的 Vue、Vite 和 source-map-js 安全补丁。
- Updated dependencies []:
  - @aifuxi/semi-icons-vue@2.0.2
  - @aifuxi/semi-icons-lab-vue@2.0.2
  - @aifuxi/semi-illustrations-vue@2.0.2
  - @aifuxi/semi-theme-default@2.0.2

## 2.0.1

### Patch Changes

- Updated dependencies []:
  - @aifuxi/semi-icons-vue@2.0.1
  - @aifuxi/semi-icons-lab-vue@2.0.1
  - @aifuxi/semi-illustrations-vue@2.0.1
  - @aifuxi/semi-theme-default@2.0.1

## 2.0.0

### Patch Changes

- Updated dependencies [[`1754b97`](https://github.com/aifuxi/semi-ui-vue/commit/1754b979690628dd66e0b4179afb93655f2e5c6f)]:
  - @aifuxi/semi-theme-default@2.0.0
  - @aifuxi/semi-icons-vue@2.0.0
  - @aifuxi/semi-icons-lab-vue@2.0.0
  - @aifuxi/semi-illustrations-vue@2.0.0

## 1.2.0

### Patch Changes

- Updated dependencies []:
  - @aifuxi/semi-icons-vue@1.2.0
  - @aifuxi/semi-icons-lab-vue@1.2.0
  - @aifuxi/semi-illustrations-vue@1.2.0
  - @aifuxi/semi-theme-default@1.2.0

## 1.1.2

### Patch Changes

- Updated dependencies [[`49e565c`](https://github.com/aifuxi/semi-ui-vue/commit/49e565ce59a4d01b7c18f32ff946f96932dc969f)]:
  - @aifuxi/semi-theme-default@1.1.2
  - @aifuxi/semi-icons-vue@1.1.2
  - @aifuxi/semi-icons-lab-vue@1.1.2
  - @aifuxi/semi-illustrations-vue@1.1.2

## 1.1.1

### Patch Changes

- [#18](https://github.com/aifuxi/semi-ui-vue/pull/18) [`06c8387`](https://github.com/aifuxi/semi-ui-vue/commit/06c838708dd7280f1b90c48196580405b9998045) Thanks [@aifuxi](https://github.com/aifuxi)! - 解耦 npm 发布检查与文档站验证，发布流水线仅执行公开包相关门禁。
- Updated dependencies []:
  - @aifuxi/semi-icons-vue@1.1.1
  - @aifuxi/semi-icons-lab-vue@1.1.1
  - @aifuxi/semi-illustrations-vue@1.1.1
  - @aifuxi/semi-theme-default@1.1.1

## 1.1.0

### Minor Changes

- [#16](https://github.com/aifuxi/semi-ui-vue/pull/16) [`8b163d9`](https://github.com/aifuxi/semi-ui-vue/commit/8b163d910a4f58bc1f120393faa24f63a10ecd9a) Thanks [@aifuxi](https://github.com/aifuxi)! - 浏览器构建自动按需加载默认主题，并将默认主题、稳定图标、Lab 图标与插画作为同版本依赖安装。

### Patch Changes

- Updated dependencies []:
  - @aifuxi/semi-icons-vue@1.1.0
  - @aifuxi/semi-icons-lab-vue@1.1.0
  - @aifuxi/semi-illustrations-vue@1.1.0
  - @aifuxi/semi-theme-default@1.1.0

## 1.0.0

### Major Changes

- [#2](https://github.com/aifuxi/semi-ui-vue/pull/2) [`2364e0e`](https://github.com/aifuxi/semi-ui-vue/commit/2364e0edc54af8542d115b1bda12f4c4700ba7d3) Thanks [@aifuxi](https://github.com/aifuxi)! - 进入 1.0 预发布验证阶段：提供固定 Semi 2.102.0 基线的 Vue 组件、主题、图标与插画，以及近期修复的 Markdown 跨 chunk 绑定和文档 REPL 循环依赖加载。五个公开包统一使用 next 渠道；从旧 alpha 升级时应一起更新五包并按组件文档核对 Vue props、emits、slots 与 v-model。此候选不代表稳定版产品验收完成。

### Patch Changes

- [#14](https://github.com/aifuxi/semi-ui-vue/pull/14) [`ed52848`](https://github.com/aifuxi/semi-ui-vue/commit/ed52848720919481083c9a180b3905c5137b3f51) Thanks [@aifuxi](https://github.com/aifuxi)! - 修复 Select 声明式选项和 Pagination 小尺寸模式的 SSR hydration 差异

- [#14](https://github.com/aifuxi/semi-ui-vue/pull/14) [`aed4289`](https://github.com/aifuxi/semi-ui-vue/commit/aed4289a884c05a936d877eada568889995ef398) Thanks [@aifuxi](https://github.com/aifuxi)! - 修复 Calendar、Cascader、Modal、Radio、Select 与 Tooltip 在 SSR hydration 时的首屏差异。

- [#14](https://github.com/aifuxi/semi-ui-vue/pull/14) [`b7d048e`](https://github.com/aifuxi/semi-ui-vue/commit/b7d048ebb24f58bf159dee37f4f036880783dc86) Thanks [@aifuxi](https://github.com/aifuxi)! - 修复 InputNumber 未向内部 Input 转发部分继承输入属性的问题

- [#14](https://github.com/aifuxi/semi-ui-vue/pull/14) [`88aec57`](https://github.com/aifuxi/semi-ui-vue/commit/88aec5700d7c8fdb5217c40627d22096d12e47be) Thanks [@aifuxi](https://github.com/aifuxi)! - 修复 Rating 根节点未透传 aria-errormessage、aria-invalid 和 aria-required 的问题

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

- [#7](https://github.com/aifuxi/semi-ui-vue/pull/7) [`e3a4995`](https://github.com/aifuxi/semi-ui-vue/commit/e3a49950a74b8e62d9ff0fa7fde691cfd4dc96bb) Thanks [@aifuxi](https://github.com/aifuxi)! - 修复父级重渲染后插件插槽内容不刷新的问题：读取插槽的派生值改为每次渲染重新求值，覆盖 Tag、Typography、Table 等全部读取插槽的组件；同时修复 Table 同 `dataIndex` 多列的表头标题互相覆盖，并补充 Switch、Space、Grid 与固定基线一致的已知限制文档。

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
  - @aifuxi/semi-icons-vue@1.0.0
  - @aifuxi/semi-illustrations-vue@1.0.0

## 1.0.0-next.1

### Patch Changes

- [#7](https://github.com/aifuxi/semi-ui-vue/pull/7) [`e3a4995`](https://github.com/aifuxi/semi-ui-vue/commit/e3a49950a74b8e62d9ff0fa7fde691cfd4dc96bb) Thanks [@aifuxi](https://github.com/aifuxi)! - 修复父级重渲染后插件插槽内容不刷新的问题：读取插槽的派生值改为每次渲染重新求值，覆盖 Tag、Typography、Table 等全部读取插槽的组件；同时修复 Table 同 `dataIndex` 多列的表头标题互相覆盖，并补充 Switch、Space、Grid 与固定基线一致的已知限制文档。
- Updated dependencies []:
  - @aifuxi/semi-icons-vue@1.0.0-next.1
  - @aifuxi/semi-illustrations-vue@1.0.0-next.1

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
