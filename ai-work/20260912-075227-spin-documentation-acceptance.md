# AI 工作记录：Spin 文档严格验收

- 日期：2026-09-12
- 状态：完成

## 目标

接续 Skeleton 批次，完成 Spin 5 项固定上游中文示例（英文另含索引 6 Controlled）的双语、明暗与 LTR/RTL 严格验收。起始提交 1330fda，已有 21 批证据有效、149 项 accepted；未跟踪的 `.omp/` 属于既有工作区内容，未操作。

## 验收标准

- 完整矩阵一次通过，无重试、跳过或失败；逐节点文本、ARIA、SVG、class 与关键计算样式一致，几何各轴 ≤0.5px，整体及逐 `.semi-spin` 局部像素 threshold=0.1、maxDiffPixelRatio=0.001。
- Delay 保留真实 1000ms 延迟与真实时钟；Controlled 覆盖无延迟受控切换；双语 light/LTR 执行源码、重置、实际在线编辑与退出恢复。
- 固定 vendor 不变；不改旧证据指纹，按实际依赖核对历史证据有效性。

## 风险与假设

- 默认指示符的线性渐变 id 为实例唯一值，直接比较 `stroke` 会假失败；必须按 SVG 内定义顺序解析 paint server，且未解析引用仍要失败。
- Delay 是真实计时窗口，不能用固定 sleep 断言中间帧；以可观察出现为终态并断言实际经过时间下界。
- Spin 不消费 locale/Provider 默认值，参考侧无需 Provider 包装。

## 修改范围

- 新增本批 React 参考适配器、40 项矩阵、批次配置、映射审阅与验收记录。
- 中文示例恢复固定上游文案：Basic `A basic spin.`、Tip `I am loading...` / `Here are some texts.` / `And more texts on the way.`、Indicator `A spin with customized indicator.`、Delay 按钮 `延迟显示的spin`。
- 双语「如何引入」统一为公开 Vue 子路径与独立 CSS（英文原为 `@douyinfe/semi-ui`），中文代码块语言与其它组件页一致（`ts`）。
- 映射补充机器可校验的 `review`（指纹 + chapters/api/migration），并记录英文独有 Controlled 的覆盖方式。
- 公开运行时、主题与共享验收设施未修改。

## 关键决策与权衡

- 审阅发现中文示例把固定上游的英文 copy 译成了中文，与已验收组件（Banner、Notification 等保留上游 copy、只做品牌替换）的做法不一致。按「固定上游示例」口径恢复原文，而不是在参考适配器里把英文改写成中文；这样参考侧保持固定站原样渲染，适配器只需 ESM 导出适配。
- 英文独有 Controlled（英文索引 6）沿用 Toast 的既有做法，在 Delay 示例的 en-us 用例内覆盖：导航参考到 example=6、重载 Vue 页并重新对齐后比较，不新增中文不存在的示例条目（中文上游把受控切换合并在 Delay 内）。
- 渐变 id 归一化沿用 Icon 批次的实现思路（解析为 `url(#definition-N)`），比字符串替换更严格：定义缺失或顺序变化都会失败。
- Delay 交互在全部语言、主题与方向执行，保留真实时钟；关闭动效采样只冻结 CSS 动画，不冻结业务计时器。

## 验证证据

- 起始 `pnpm --filter @workspace/docs accept:nuxt:batch --affected --plan`：21 批有效。
- 用例集合核对：`expectedCaseTitles` 40 项与 `playwright --list` 实际发现 40 项完全一致。
- 代表诊断 `diagnose:nuxt:batch spin` 16/16 一次通过（无返工），ESLint 无错误。
- 冻结后 `pnpm --filter @workspace/docs accept:nuxt:batch spin --affected`：40/40 expected、unexpected=0、flaky=0、skipped=0，3 workers，浏览器 28.4s，整轮 44.3s（墙钟约 53s）；resources/site/checks 按内容缓存复用。正式证据：`docs/documentation/evidence/spin.json`、`spin.report.json.gz`（reportSha256 `a7746ba0…`，指纹 `4eb0fed8…`）。
- `node apps/docs/scripts/prepare-coverage.mjs --batch=spin` 退出码 0；账本 154/859，Spin `accepted`、全部章节 `reviewed`；只读核验 22/22 批证据有效，历史 21 批未失效。
- 批次输入 947 条解析成功、无保守扩展、无失效显式路径；Prettier、ESLint、`git diff --check`、`pnpm check:changesets` 通过（空 Changeset）。

## 未验证事项与剩余风险

- 剩余 705 项已映射示例待严格验收，下一批为展示类首个静态组件 Avatar 15 项；未执行未受影响的全仓 `pnpm check`/`check:full`、组件矩阵或发布包回归。
- 未改变公开运行时，不以本批文档 ClientOnly 检查声称重新完成 SSR、真实 tarball 或全仓组件验收。
- 展示类中动态浮层、图片、轮播与 Table 组件仍按队列要求排在静态展示组件之后。
