# 项目审计与待审核项（2026-11-11）

## 范围与结论

本轮从 `7e63ccb7` 的干净工作区开始，保留原有本地提交。按自有组件、共享工具、私有 Foundation 集成、生成资产、构建与发布、测试基础设施、文档站、主题工作台和现行文档分区调查；固定 `vendor/semi-design v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21` 用于只读对照。

初始有 4,553 条 Git 跟踪路径。重点通读核心实现及调用链，并对整个自有运行时进行结构扫描和自动化检查；生成资产、快照、约千个文档示例及历史记录主要通过生成一致性、类型、产物和已有测试核对，未逐行人工审阅全部内容。以下将已复现缺陷、结构候选与需要选择的契约分别标明。

已确认且可安全限定范围的问题均已修复；未修改 vendor、公开包版本、依赖版本、旧快照、像素阈值或重试策略。没有推送、发布、部署或合并。

## 已修复与提交

| 范围             | 具体结果                                                                                                                   | 提交与证据                                                          |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 公开异步工具     | `runAfterTicks` 延迟回调抛错或异步拒绝时，返回 Promise 正确拒绝，避免永久 pending 和 unhandled rejection                   | `98915b64`；[报告](2026-11-11-run-after-ticks-rejection.md)         |
| 安装包与合规工具 | 通配 exports 按真实子目录、文件类型与文件名前后缀检查；第三方通知从许可证所属安装清单读取版本，修正 markdown-it 陈旧版本   | `9455f5d3`；[报告](2026-11-11-package-contract-checks.md)           |
| 动态参数         | Modal、Banner、Tag、Dropdown、HotKeys 首次省略参数后再动态传入能够生效；覆盖 Boolean 值相同而存在性改变的边界              | `4f245c39`；[报告](2026-11-11-vue-reactivity-audit.md)              |
| 插槽与裁切事件   | Upload 文件/标题插槽、TreeSelect 多选插槽随父 render 更新；两条裁切错误路径仅通知一次                                      | `4f245c39`；同上                                                    |
| 插槽门禁         | 修正辅助函数收集顺序与 AST 遍历早停，按实际调用检查轻量传递关系；Tabs 等价复用共享渲染刷新逻辑                             | `4f245c39`；18 个门禁 fixture，未把 Tabs 的等价迁移计作原有产品缺陷 |
| Theme Studio     | 补齐私有 CSS 引用依赖声明；拒绝会引入循环的单项复原；无单位字重拒绝 px；清空按钮排版字段保留有效值并支持 JSON 往返         | `2d215fba`；[报告](2026-11-11-theme-studio-audit.md)                |
| 文档与入口       | 移动首页导航可打开、关闭、重开和跳转；修正 TimePicker 浮层测试的样式层定位；更新失效技能链接、陈旧预发布状态和文档架构说明 | `f627be7b`；[报告](2026-11-11-docs-navigation-audit.md)             |
| Cascader         | 选择值不变时，可见与已打开折叠标签中的 `display` 插槽也会刷新；重建缓存 VNode，保留标签顺序与 Foundation 选择规则          | `cefe80a8`；[报告](2026-11-11-cascader-slot-update.md)              |
| 检查效率         | 本地 `check:full` 复用冷启动检查刚生成的六包产物；Inventory 对同一 Cypress 目录从 85 次扫描改为 1 次                       | 本报告同次提交；说明见下节                                          |

全量集成另发现本轮 Modal 参数刷新机制与原有动效 watcher 的交互回归，已在 `a99ed059` 修复：分别比较显隐和 motion 两个实际值，避免新数组身份重启已结束的动画。保留原断言和动态参数机制，定向 41 项与 Chromium 5 项通过，见[修复报告](2026-11-11-modal-animation-update.md)。

## 重复工作的调整依据

`check → check:source → typecheck:clean` 会清理旧产物，`apps/docs` 的类型检查再构建全部六个公开包。原 `check:full` 随后调用 `check:artifacts`，再次构建同一组公开包。本轮与现有 CI 一致，改为接着执行 `verify:artifacts`，保留主题、SSR 和真实 tarball 的全部断言。独立 `check:artifacts` 继续负责先构建再验证。

此复用仅适用于前段完整成功、两阶段之间未清理或更换产物的同一执行链；未来变更 docs 的准备链时须同步更新 `check:full`，已写入[验证入口](../docs/testing/validation.md)。不依赖任务开始前的残留 dist。最终完整执行日志确认六个公开包的 build 脚本各调用一次，全部主题、SSR、tarball 和浏览器检查仍执行并通过。

Inventory 的 Cypress 参考目录不随模块变化，且固定 vendor 已先通过校验；排序后的文件列表仅被 filter/map 读取。移到循环外后，`pnpm check:inventory` 对既有 JSON/Markdown 逐字检查通过，没有改动生成物。这里消除确定的重复 I/O，不宣称未经测量的耗时提升。

## 待审核：结构候选与契约选择

### R1：其他组件的原始 VNode 参数判断

全 UI 共有 61 个文件读取原始 `instance.vnode.props`。该对象不响应式，但是否构成可观察缺陷，还取决于调用时机、外层响应式依赖和是否支持运行期切换受控模式。本轮只对正式回归复现的问题实施修复，以下为尚未逐项复现的结构候选：

| 类型                         | 剩余候选                                                                                                                                                                                                                                                    | 审核重点                                                                                                                    |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 纯存在性 computed            | Checkbox / CheckboxGroup、Radio / RadioGroup、Input / TextArea / InputNumber、PinCode、Slider、Rating、TagInput、Pagination、ColorPicker、Cascader、Tree / TreeSelect、DatePicker / TimePicker、Tabs、Transfer、Upload、Navigation、UserGuide               | 确认运行期新增/移除 `value`、`modelValue`、`checked`、`open`、`expandedKeys` 等参数的受控切换契约，再逐组件做公开行为回归   |
| 解析函数有条件读取实例值     | Collapse、Collapsible、Descriptions、OverflowList、Chat、AudioPlayer / VideoPlayer、Navigation、UserGuide、TableCore、DatePicker / TimePicker、Lottie、MarkdownRender、CodeHighlight、DragMove、AIChatDialogue / AIChatInput、Cascader / TreeSelect、Upload | 检查首次缺省后添加配置，以及缺省 Boolean 与显式 false 是否同值；部分外层已有 props 展开或实时调用，不能据模式批量认定为错误 |
| 图标、监听器及校验参数存在性 | Avatar.clickable、Step.hasIcon、NavFooter.collapseEnabled、Popconfirm.usesDefaultIcon、FormField.stopAtFirstRule，以及已修组件中尚未覆盖的动态插槽存在性/仅事件监听器变更                                                                                   | 除缓存依赖外，还要考虑 Vue 是否为仅 emits 监听器变更调度子组件更新，单加版本号未必足够                                      |

代表性入口：[Input](../packages/ui/src/input/Input.vue)、[Tree](../packages/ui/src/tree/Tree.vue)、[TimePicker](../packages/ui/src/time-picker/TimePicker.vue)、[Avatar](../packages/ui/src/avatar/Avatar.vue)、[Step](../packages/ui/src/steps/Step.vue)、[NavFooter](../packages/ui/src/navigation/NavFooter.vue)、[Popconfirm](../packages/ui/src/popconfirm/Popconfirm.vue)、[FormField](../packages/ui/src/form/FormField.ts)。

建议先按真实消费者需求确认受控切换和动态参数范围，再以可复现行为为单位扩展修复，避免将源码匹配数量当作缺陷数量。

### R2：缓存 VNode 中延后执行的插槽

[插槽门禁](../scripts/verify-slot-render-usage.mjs) 主要识别缓存回调中直接或经同文件具名 helper 执行插槽。作为 renderer 值传递或延后到子组件执行的闭包会被排除，避免把普通函数引用误报为执行。

Cascader 的正式回归进一步证明：缓存 VNode 本身也可能令子树跳过更新，即使 computed 内没有立即执行插槽。该具体缺陷已修复；其他同类构造仍需行为验证。当前门禁不进行完整的别名、动态成员、回调时机或 VNode 生命周期分析，门禁通过不能替代组件回归。是否增加专门的 VNode 缓存规则，需要同时验证有效命中与误报边界。

### R3：Calendar 的调度与跨日行为

[CalendarDayColumn.vue](../packages/ui/src/calendar/CalendarDayColumn.vue) 每帧调度 requestAnimationFrame，但当前时间位置只每 30 秒更新一次；是否显示时间线仅在 mounted 时按日期和 `showCurrTime` 初始化。切换该参数、复用实例切换日期或运行跨日的行为值得单独确认。

固定 React Foundation 也采用该机制。改用低频定时器或支持运行中的日期/开关变化，需要明确记录基线行为差异；本轮未测量 CPU 消耗，也未自动更改时间线契约。

### R4：Theme Studio 批量操作与自定义引用的组合

本轮已验证用户单项编辑、单项复原和导出。`updateGlobalTheme`、品牌/排版/效果预设等批量操作仍会直接调整覆盖集合，没有逐一构造它们与已有手工引用之间的全部组合。

这些操作可能改变引用依赖，但目前只有单项复原形成循环的场景已实际复现并修复。建议确认批量预设遇到冲突时应保留用户覆盖、拒绝操作还是展示冲突，再增加对应数据与浏览器回归。入口为 [studio.ts](../apps/theme-studio/src/studio.ts)。

### R5：SBOM 的版本精度

[合规生成器](../scripts/write-compliance-artifacts.mjs) 的 SBOM `versionInfo` 继续保留源码依赖声明，例如 Tiptap 的 `^3.31.3`；第三方通知则标识附带许可证所属的已安装 `3.31.3`。现有消费断言也保留此范围契约，本轮没有改变它。

若要将 SBOM 改成精确构建材料清单，需要先区分外部运行时依赖与构建时内联材料，并同步生成器、消费者断言和发布契约。两者用途与精度应由维护者确认，本轮不把范围值直接判为错误。

### R6：WebStorm 本地 Node interpreter

首次从共享 IDE Run Configuration 执行 `pnpm check:full`，实际 Node 为 `24.21.0`，被项目 `24.18.0` 工具链校验正确阻止。随后使用 IDE 终端的 `mise exec --` 成功执行项目检查。

需要在本机 WebStorm 项目设置核对 Node interpreter/package manager，按 `mise which node` / `mise which pnpm` 选择项目工具链。本轮保留个人 IDE 配置，没有用修改仓库版本要求来掩盖差异。

### R7：非阻断告警

- Vitest 日志包含 Avatar 的“在 render 外调用 slot”告警，以及 `_utils` 命令式 ref 测试的 ref owner 告警。相关测试通过；需分别确认真实组件生命周期与测试 fixture 的影响，本轮没有抑制告警或认定它们都已解决。
- Vite 对当前 Vitest 配置无扩展名的本地导入提示未来 native config 兼容问题。当前工具链可执行，是否迁移原生加载应作为独立工具链任务验证。
- Lottie direct-eval/体积以及上游参考应用告警仍按现有证据处理，没有据告警文字进行无依据的运行时替换。

### R8：其他固定基线观察项

| 项目                    | 已有事实                                                                                                                                                     | 审核边界                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Feedback.className      | Vue 会把 truthy `className` 映射为字面 `.className`，固定 React 也如此；[现行契约](../docs/components/feedback/alignment.md) 已记录，并提供原生 `class` 映射 | 属于已记录基线行为；是否调整需要明确兼容取舍                                                               |
| Tree 展开按钮动作名称   | [TreeNode.vue](../packages/ui/src/tree/TreeNode.vue) 在 expanded 时标 `Expand`，否则标 `Collapse`；固定 React 使用相同条件与文案                             | 源码命名与动作方向相反，尚未补实际辅助技术回归，契约记录未核实；修改会偏离固定基线                         |
| InputNumber 的零值 ARIA | [InputNumber.vue](../packages/ui/src/input-number/InputNumber.vue) 使用 `if (state.number)` 决定是否输出 `aria-valuenow`，数值 0 会跳过该分支                | Vue 有源码候选；尚未核实固定 vendor 外围条件、替代 ARIA 属性和现行契约，不将其直接写成已证明的两端同等缺陷 |

## 实际验证与覆盖限制

最终 Modal 修复和公开包重建完成后，又使用这组准确产物补验 Theme Studio 全套 81 项与文档浮层 5 项，全部通过，组合命令退出码 0。对应日志为 `.local/project-audit-final-theme-studio.log`、`.local/project-audit-final-docs-overlays.log`，避免将较早 UI 构建上的应用结果当作最后修复的唯一证据。

- 第一轮完整检查通过 250 个 Vitest 文件、1,541 项测试，501 项组件 Chromium 与 67 项真实 tarball consumer；该轮用于建立基线，不能单独证明之后新增修复。
- 后续各缺陷按报告中的先红后绿单测和受影响 Chromium 验证；公开 UI/主题重建后的 `verify:artifacts` 通过，涵盖 780 个无 DOM JavaScript 入口、主题、真实 tarball 的类型/样式/SSR 与 tree-shaking。
- Theme Studio 生产构建与全套 Chromium：81 项通过，含 4 项新增真实输入、引用、复原和文件往返回归。
- 文档站默认 T3 首轮 41 项中 40 项通过；唯一 TimePicker 测试定位错误修正后，受影响浮层规格 5 项全部通过，其余 36 项复用有效证据。新增移动首页导航回归通过；未运行 T1/T2/T4/T5 的全部示例巡检。
- 现行文档相对链接复查：360 份 Markdown、340 处相对链接，失效目标为零；不包含外站可达性、anchor 精确匹配、根路由与历史附件。
- `pnpm test:changesets`：16 项集成测试通过；`pnpm audit:prod` 通过，官方 registry 当次未报告已知生产依赖漏洞。没有执行外部发布。
- 最终集成首轮在 1,577 项单测中发现 1 项 Modal 动画回归，其余 1,576 项通过；实现原因、修复及定向 41 项/浏览器 5 项通过见 `a99ed059` 的报告。原失败日志保留为 `.local/project-audit-full-before-modal-fix.log`，没有更改原测试断言或将失败解释为抖动。
- 修复后的最终 `pnpm check:full` 全部通过，退出码 0：253 个 Vitest 文件、1,578 项测试，501 项组件 Chromium、67 项真实 tarball consumer，以及静态源码、冷启动类型检查、六包构建、主题、780 个无 DOM JavaScript 入口和真实包消费断言。六个公开包均只构建一次。完整日志为 `.local/project-audit-final-full-fixed.log`；没有依靠重试或改旧断言制造通过。

本轮未执行最终发布候选的完整 `release:check` 或新的 registry 隔离安装，未重新核对 GitHub/npm 的外部状态。普通 tarball 检查复用已有外部依赖；其通过证据不等同于全新隔离安装通过。所有诊断日志、截图、trace 和可丢弃用例留在已忽略的 `.local/` 或测试产物目录。
