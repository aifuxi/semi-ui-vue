# AI 工作记录：Collapse 文档严格验收

- 日期：2026-09-12
- 状态：完成

## 目标

接续 Card 批次，完成展示类第五个组件 Collapse 6 项固定上游示例的双语、明暗与 LTR/RTL 严格验收（共 48 项）。起始提交 c9035b0，已有 26 批证据有效、198 项 accepted。本批同时修复 CollapsePanel 的 `aria-owns` 渲染传播，并对齐参考适配器的两处上游偏差。

## 验收标准

- 完整矩阵一次通过，无重试、跳过或失败；逐节点比较 class、属性、文本、关键计算样式与几何（各轴 ≤0.5px）；整体截图 threshold=0.1、maxDiffPixelRatio=0.001，并对每个面板单独裁剪。
- 交互覆盖示例中真实存在的路径：展开、手风琴单开、禁用面板点击无效、无箭头时标题仍可展开、自定义图标切换、extra 三种形式，以及双语 light/LTR 的源码/重置/在线编辑。
- 固定 vendor 不变；按真实依赖核对历史证据有效性，不改旧指纹。

## 风险与假设

- 固定 Adapter 在 `componentDidMount` 赋值面板 id 且不触发渲染，因此首屏所有面板 `aria-owns=""`；React 在展开集变化时重渲染全部 context 消费者，所有面板从那次渲染起才输出 id。
- 固定英文「基本用法」示例把 `itemKey` 误写为 `ItemKey`，该面板拿不到 key。
- 固定 extra 示例的 Tag 文案由三段 child 组成，React 侧是数组子节点，Vue 模板插值只能产生单个文本节点。

## 修改范围

- 组件：`packages/ui/src/collapse/CollapsePanel.vue` 的 `aria-owns` 改由读取共享展开集的计算值给出，复现固定 Adapter 的渲染传播时机；契约同步写入 `docs/components/collapse/alignment.md`。
- 新增 `docs/documentation/batches/collapse.json`、`apps/docs/tests/nuxt/collapse-matrix.spec.ts`、`apps/reference-react/docs-adapters/collapse.mjs` 与 `docs/documentation/collapse-acceptance.md`；映射补 `review` 审阅块。
- 计划更新：`docs/documentation/batch-plan.md` 进度、剩余范围与下一批。
- 示例、文档正文与主题未修改。

## 关键决策与权衡

- **修组件而不是放宽断言**：Vue 侧此前只有自身重渲染过的面板才拿到 id（点开一个面板后另外两个仍为空），同一逻辑状态随交互历史产生不同 DOM。按固定 Adapter 的传播时机对齐后，默认态仍为空、任意状态变化后全部面板输出各自 id，矩阵无需为 `aria-owns` 增加特例。
- **引用型生成 id 归一**：折叠面板引用的内容节点此时未挂载，矩阵把 `aria-owns`/`aria-controls`/`aria-labelledby`/`aria-describedby`/`for` 的引用也登记进 id 序列，缺项、重复或改序仍会失败。
- **extra 子节点按 Vue 等价形式对齐**（沿用 Calendar `String(date.getDate())` 先例）：React 三段 child 与 Vue 单文本节点会产生不同的 Tag `aria-label`，适配器改用等价的单字符串子节点，两侧文本与可访问名一致。
- **禁用面板用真实事件而非 `force` 点击**：Playwright 拒绝点击 `aria-disabled` 控件，改用 `dispatchEvent('click')` 触发真实事件，证明组件忽略点击而不是绕过无障碍语义。

## 验证证据

- 代表诊断（19 项）在修复后一次通过；`playwright --list` 实际发现 48 项与 `expectedCaseTitles` 一致。
- 迭代定位三类差异：面板 `aria-owns` 传播时机、Extra 示例 Tag 的 `aria-label`、Disabled 交互的点击方式。
- 组件门禁：`rstest run packages/ui/src/collapse` 14 项通过（单元 + SSR）；`playwright test tests/browser/components/collapse.spec.ts` 5/5 通过（含 desktop light/dark 与 RTL）。
- 冻结后 `accept:nuxt:batch collapse --affected`：48/48 一次通过，unexpected=0、flaky=0、skipped=0、retry=0，3 workers，浏览器 38.6s，整轮 73.9s；resources/site/checks 命中内容缓存。
- `prepare-coverage --batch=collapse` 退出码 0；账本 204/859，Collapse `accepted`、6/6 示例、章节全部 `reviewed`；随后 `--affected --plan` 显示 27/27 批证据有效。
- 工具测试 73/73 与 6/6 通过；Prettier、ESLint、Changesets 与 `git diff --check` 通过。

## 未验证事项与剩余风险

- 剩余 655 项已映射示例待严格验收，下一批为同分类的 Collapsible 4 项（展示类按计划延后轮播、图片、浮层与 Table）。
- 组件变更只执行了 Collapse 单元/SSR、组件级 Chromium 与文档矩阵；未运行全仓 `pnpm check:full`、发布包回归与其他浏览器，发布前按发布入口补齐。
- 本批未触及其他已验收批次，27 批证据在验收后仍全部有效。
