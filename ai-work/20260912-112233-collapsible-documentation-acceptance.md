# AI 工作记录：Collapsible 文档严格验收

- 日期：2026-09-12
- 状态：完成

## 目标

接续 Collapse 批次，完成展示类第六个组件 Collapsible 4 项固定上游示例的双语、明暗与 LTR/RTL 严格验收（共 32 项）。起始提交 78d7974，已有 27 批证据有效、204 项 accepted。本批未修改组件，只把示例与参考适配器对齐固定上游。

## 验收标准

- 完整矩阵一次通过，无重试、跳过或失败；逐节点比较 class、属性、文本、`input` 值、关键计算样式与几何（各轴 ≤0.5px）；整体截图 threshold=0.1、maxDiffPixelRatio=0.001，面板可见时另做局部裁剪。
- 交互覆盖示例中真实存在的路径：展开/收起、修改动画时长、父子嵌套展开、collapseHeight 折叠与 `+ Show More` 展开，以及双语 light/LTR 的源码/重置/在线编辑。
- 固定 vendor 不变；按真实依赖核对历史证据有效性，不改旧指纹。

## 风险与假设

- 迁移版本在 live 示例上额外附加了 `aria-expanded`/`aria-controls` 与 Collapsible `id`，并把「+ Show More」改成原生按钮、动画时间标签改成 `span`、CollapseHeight 增加了上游没有的 `<br />`。
- 固定「嵌套使用」片段使用 `useState` 却只 `import React from 'react'`。
- 嵌套子面板只在父面板展开后挂载，初始只有 1 个 `.semi-collapsible-wrapper`。

## 修改范围

- 示例：`apps/docs/src/demos/collapsible/{zh-cn,en-us}/{Basic,Duration,Nested,CollapseHeight}.vue` 按固定上游恢复（去掉额外 aria 关联与 id、label/全角冒号、中文文案空格、内联样式锚点与 br）。
- 新增 `apps/reference-react/docs-adapters/collapsible.mjs`、`docs/documentation/batches/collapsible.json`、`apps/docs/tests/nuxt/collapsible-matrix.spec.ts` 与 `docs/documentation/collapsible-acceptance.md`；映射补 `review` 审阅块。
- 计划更新：`docs/documentation/batch-plan.md` 进度、剩余范围与下一批。
- 未修改 `packages/ui`、主题与文档正文。

## 关键决策与权衡

- **示例向固定基线收敛**：可访问性关联虽然是改进，但固定 live 示例并未使用它，`id` + `aria-controls` 的模式仍由 Accessibility/ARIA 章节的独立示例完整记录；按「验收契约以固定基线为准」的原则把这些差异从 live 示例中移除，而不是让参考适配器改写上游片段。
- **折叠高度示例回到内联样式锚点**：迁移版本用 scoped 样式的原生按钮替代锚点，需要参考侧注入样式并承担按钮 UA 样式风险；改为与固定上游逐字一致的内联样式锚点后，两侧 DOM、样式与几何可直接比较。
- **局部裁剪按可见性取舍**：完全收起的面板没有可截取区域，此时只做整例截图比较，不扩大裁剪或放宽容差。
- **限定等价项沿用先例**：内嵌 InputNumber 显式输出 `aria-disabled/invalid/required="false"`，按 ARIA 1.2 默认值等价处理，留给其自身批次审阅。

## 验证证据

- 代表诊断（13 项）在修复后一次通过；`playwright --list` 实际发现 32 项与 `expectedCaseTitles` 一致。
- 迭代定位四类问题：示例对齐导致的 typecheck 失败（`CSSProperties` 注解）、InputNumber 的 `aria-*="false"`、嵌套子面板挂载时机导致的面板计数、收起态面板无法裁剪。
- 冻结后 `accept:nuxt:batch collapsible --affected`：32/32 一次通过，unexpected=0、flaky=0、skipped=0、retry=0，3 workers，浏览器 36.9s，整轮 58.8s；resources/site/checks 命中内容缓存。
- `prepare-coverage --batch=collapsible` 退出码 0；账本 208/859，Collapsible `accepted`、4/4 示例、章节全部 `reviewed`；随后 `--affected --plan` 显示 28/28 批证据有效。
- Prettier、ESLint、Changesets 与 `git diff --check` 通过。

## 未验证事项与剩余风险

- 剩余 651 项已映射示例待严格验收，下一批为同分类的 Descriptions 8 项（展示类按计划延后轮播、图片、浮层与 Table）。
- 本批未触碰公开运行时，未运行全仓 `pnpm check:full`、发布包回归与其他浏览器，发布前按发布入口补齐。
- InputNumber 的显式 `aria-*="false"` 仍是其自身批次的待审阅项。
