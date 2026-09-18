# AI 工作记录：Skeleton 文档严格验收

- 日期：2026-09-12
- 状态：完成

## 目标

接续 Progress 批次，完成 Skeleton 8 项固定上游示例的双语、明暗与适用 LTR/RTL 严格验收。起始提交 a363c82，已有 20 批证据有效、141 项 accepted；未跟踪的 `.omp/` 属于既有工作区内容，未操作。

## 验收标准

- 完整矩阵一次通过，无重试、跳过或失败；逐节点文本、ARIA、class、背景/动效与关键计算样式一致，几何各轴 ≤0.5px，整体及逐占位根局部像素 threshold=0.1、maxDiffPixelRatio=0.001。
- Basic 覆盖占位/内容切换，Animation 覆盖高亮动画推进；双语 light/LTR 执行全部示例源码、重置、实际在线编辑与退出恢复。
- 固定 vendor 不变；不改旧证据指纹，按实际依赖核对历史证据有效性。

## 风险与假设

- Skeleton 无 Foundation 运行时；风险集中在占位 DOM 结构、`loading` 三态、`#placeholder` 优先级与 1400ms 高亮动画采样。
- Table 示例首次在文档矩阵中渲染真实 Table，参考环境（Provider、direction）与 Vue 公开缺省值的差异需要单独定位。
- 上游示例图片是远程 CDN，两侧必须使用同一本地素材才能比较几何与像素。

## 修改范围

- 新增本批 React 参考适配器、60 项矩阵、批次配置、映射审阅与验收记录。
- 双语「如何引入」统一为公开 Vue 子路径与独立 CSS（英文原为 `@douyinfe/semi-ui`），中文代码块语言与其它组件页一致（`ts`）；英文概述改用 `SkeletonAvatar` 等 Vue 名称。
- 中文 `chapters` 顺序与 8 项示例顺序未改；映射新增机器可校验的 `review`（指纹 + chapters/api/migration）。
- 公开运行时、主题与共享验收设施未修改；`apps/docs/tests/nuxt/visual-context.ts`、`demo-parity.ts`、`documentation-*` 均未改。

## 关键决策与权衡

- 参考适配器直接读取固定 Markdown，做三处批次内适配：远程图片替换为本地 `/demos/photo.svg`（沿用 Accessibility 约定）、包裹固定站实际使用的 `LocaleProvider`、把英文 Table 片段的数字 `dataIndex` 对齐为字符串（只消除 React propTypes 警告，不改变渲染结果）。
- Table 示例限定差异：固定站只有 `LocaleProvider`（locale），没有 ConfigProvider，因此 React Table 的 `direction` 为 `undefined`，输出 `semi-table-wrapper-undefined`；Vue Table 按公开契约把缺省 direction 归一为 `ltr`，输出 `semi-table-wrapper-ltr`。固定 `table/table.scss` 只为 `-wrapper-ltr` 写 `direction: ltr`，在文档站实际渲染的 LTR 页面两侧计算样式、几何与像素一致，矩阵只把这两个「无显式方向」输出映射为同一 class。
- 同一原因下该示例不设合成 RTL 用例：RTL 容器里 React 会继承 `direction: rtl` 而 Vue 保持 `ltr`，这是「未设 Provider」与「公开缺省值」两种配置的差异；固定站与本站文档都不渲染这种组合，Table 的 `-wrapper-rtl` 路径也没有示例设置 `direction`，属于 Table 文档批次范围。未改 Vue 公开行为，未扩大截图裁剪或像素容差。
- 其余 7 项全部纳入 RTL：`.semi-rtl .semi-skeleton { direction: rtl }` 会改变占位内部文本方向与 flex 行顺序，不只是形式覆盖。
- Animation 用隔离相位采样（300ms / 1000ms，动画时长 1400ms），断言高亮真实推进且两侧同步，不靠固定延时、也不关闭被验收的动效。

## 验证证据

- 起始 `pnpm --filter @workspace/docs accept:nuxt:batch --affected --plan`：20 批有效。
- 代表诊断经三轮定点修复后 24/24 通过（8 项双语 light、Basic zh-cn dark、7 项 en-us dark RTL）。失败与定位过程：
  1. `Table zh-cn light` class 差异（`-undefined` vs `-ltr`）→ 定位到固定站无 ConfigProvider；
  2. `Table en-us light` console 警告（英文片段 `dataIndex = key` 为数字）→ 适配器对齐字符串；
  3. `Animation zh-cn light` 采样断言误把 `default` 条目一起比较 → 只比较 `animated`；
  4. `Table en-us dark rtl` 计算 `direction` 差异 → 确认 `table.scss` 的 `-wrapper-ltr` 规则，改为记录限定差异并取消该示例的合成 RTL。
- 用例集合核对：`expectedCaseTitles` 60 项与 `playwright --list` 实际发现 60 项完全一致，无缺项或多余用例。
- 冻结后 `pnpm --filter @workspace/docs accept:nuxt:batch skeleton --affected`：60/60 expected、unexpected=0、flaky=0、skipped=0，3 workers，浏览器 29.6s，整轮 59.6s（墙钟 67.7s）；resources/site 按内容缓存复用，checks 重跑（nuxt typecheck 12.4s、check:nuxt:content、check:dist）。正式证据：`docs/documentation/evidence/skeleton.json`、`skeleton.report.json.gz`（reportSha256 `ded23a4d…`，指纹 `5fb4dc8c…`）。
- `node apps/docs/scripts/prepare-coverage.mjs --batch=skeleton` 退出码 0；账本 149/859，Skeleton `accepted`、全部章节 `reviewed`；只读核验 21/21 批证据有效，历史 20 批未失效。
- `pnpm check:changesets`：退出码 0，本轮使用空 Changeset。

## 未验证事项与剩余风险

- 剩余 710 项已映射示例待严格验收，下一批 Spin 5 项；未执行未受影响的全仓 `pnpm check`/`check:full`、组件矩阵或发布包回归。
- 未改变公开运行时，不以本批文档 ClientOnly 检查声称重新完成 SSR、真实 tarball 或全仓组件验收。
- Table 的 `direction` 缺省写法差异仍存在于固定 React 组件与 Vue 组件之间；本批只记录限定差异，是否在 Table 文档批次统一说明由该批次决定。
