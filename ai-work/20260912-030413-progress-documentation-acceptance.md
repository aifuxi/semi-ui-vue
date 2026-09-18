# AI 工作记录：Progress 文档严格验收

- 日期：2026-09-12
- 状态：完成

## 目标

接续 Popconfirm 批次，完成 Progress 12 项固定上游示例的双语、明暗和 LTR/RTL 严格验收。起始提交 e5429e5，已有 19 批证据有效；未跟踪的 `.omp/` 属于既有工作区内容，未操作。

## 验收标准

- 96 项正式矩阵一次通过，无重试、跳过或失败；逐节点文本、ARIA、class、SVG 与关键计算样式一致，几何各轴 ≤0.5px，整体及逐进度条局部像素 threshold=0.1、maxDiffPixelRatio=0.001。
- 动态增减、0/100 禁用、键盘、颜色断点及自动渐变循环有行为证据；双语 light/LTR 执行全部示例源码、重置、实际在线编辑及退出恢复。
- 固定 vendor 不变；不改旧证据指纹，按实际依赖核对历史证据有效性。

## 风险与假设

- 进度数值有 RAF 动画，条形 aria-valuenow 先变、文本后变；不能将中间帧文字作为最终期望。
- 自动示例持续递归计时，React/Vue 须同步采样；编辑器须在真实时钟页面运行。
- 中英文固定源码在 Basic 可访问名称、CircleWidth 颜色与动态示例导入上存在差异。

## 修改范围

- 新增本批 React Markdown 适配器、96 项矩阵、批次配置和章节/API/迁移审阅记录。
- 双语 DynamicLine 移除额外容器；Gradient 恢复上游 Space 子容器及条形外层 margin；中文 Format 恢复 Days/Done。
- 英文 Basic、CircleWidth 分别恢复 Disk usage 和固定 #f93920；英文引入改为公开 Vue 子路径/CSS；双语迁移表用代码标记保护 `:percent`。
- 公开运行时、主题与共享验收设施未修改。

## 关键决策与权衡

- 参考适配器直接读取固定 Markdown，仅做 ESM、缺失 hook 导入及可访问名称适配。保留现有双语名称和图标按钮可访问名称；英文动态条形参考同样补齐名称，不以删除可访问性来追求表面一致。
- 自动渐变使用隔离页面时钟推进，保留真实递归计时、RAF 数值动画与 CSS 采样；在线编辑另开真实时钟页。未关闭 motion 或提高像素容差。
- 每条进度条独立裁剪比较，避免小圆环差异被大画布稀释。
- 输入审计发现批次模板替换误伤 `pnpm-workspace.yaml`，立即中断第一轮正式浏览器运行。修正路径并删除模板中两个已不存在的历史占位路径；其现用来源 `scripts/parity-build-provenance.mjs`、主题和虚拟样式插件原已完整追踪。71 条最终输入路径/模式全部实际匹配；重新执行完整正式矩阵，不追认中断结果。
- 首次完整 96 项正式矩阵通过后，收尾检查发现遗漏了 mapping.review 的机器可校验审阅状态。补齐已完成审阅的当前文档指纹后，该轮浏览器证据按规则失效；旧结果保存在 ignored 的 `before-review-metadata`，再次完整重验，以最终新指纹报告为交付依据。此为前期漏审造成的返工，不修改旧 evidence 指纹来保留计数。

## 验证证据

- 起始 `pnpm --filter @workspace/docs accept:nuxt:batch --affected --plan`：19 批有效。
- 本批 Prettier、ESLint、Nuxt 类型、内容及静态产物检查通过；文档生产站已实际观察，动态条形增加、在线编辑打开和退出可运行。
- 环形定点诊断 3/3、动态条形/颜色断点/自动渐变定点诊断 3/3 通过；这些结果不是正式 accepted。
- 英文受影响路径定点 4/4、最终完整代表集 37/37 通过（浏览器约 2.1 分钟）。`playwright --list` 实际发现 96 项，未放宽断言或配置重试。
- `pnpm --filter @workspace/docs check:nuxt:evidence`：73/73 工具测试通过。最终批次输入另经逐条文件/模式匹配审计，71 条均有效。
- 实际文档页面的迁移表显示完整 `shallowRef + :percent`；复核暗色 RTL 渐变截图，数值、进度色、按钮和方向均可见。最终截图以正式压缩报告为准。
- 首轮错误定位器、动画中间值采样及英文可访问名称失败已保留在 `apps/docs/.data/documentation-smoke/progress/` 对应目录；各轮日志位于 `/tmp/semi-progress-*.log`。
- IDE 对新矩阵未报告错误；Gradient.vue 诊断超时，不作为完整静态检查证据。

- 最终 `pnpm --filter @workspace/docs accept:nuxt:batch progress --affected`：96/96 通过，expected=96、unexpected=0、flaky=0、skipped=0；浏览器 313.2 秒，整轮 329.4 秒，resources/site/checks 均按内容缓存复用。正式证据为 `docs/documentation/evidence/progress.json` 与 `progress.report.json.gz`。
- 最终 `prepare-coverage.mjs --batch=progress`：退出码 0，Progress 状态 accepted，全部章节 reviewed；账本 141/859，20 批证据均有效。正式入口随后只读核验证据并以退出码 0 返回，没有重复构建或浏览器运行。
- `pnpm check:changesets`：退出码 0。本轮使用空 Changeset，未变更公开版本。

## 未验证事项与剩余风险

- 剩余 718 项已映射示例待严格验收，下一批 Skeleton 8 项；未执行未受影响的全仓 pnpm check/check:full、组件矩阵或发布包回归。
- 未改变公开运行时，不以本批文档 ClientOnly 检查声称重新完成 SSR、真实 tarball 或全仓组件验收。
- 上一批记录的全量 JSON 报告体积上限、button/float-button 文件正则冲突不属于本批修改范围。
