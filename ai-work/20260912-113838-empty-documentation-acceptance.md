# AI 工作记录：Empty 文档严格验收

- 日期：2026-09-12
- 状态：完成

## 目标

接续 Descriptions 批次，完成展示类第八个组件 Empty 5 项固定上游示例的双语、明暗与 LTR/RTL 严格验收（共 40 项）。起始提交 c94a930，已有 29 批证据有效、216 项 accepted。本批未修改组件，只补齐批次材料并对齐参考侧插画入口。

## 验收标准

- 完整矩阵一次通过，无重试、跳过或失败；逐节点比较 class、属性、文本、关键计算样式与几何（各轴 ≤0.5px）；整体截图 threshold=0.1、maxDiffPixelRatio=0.001，并对每个 Empty 实例单独裁剪（Illustrations 逐张裁剪八张插画）。
- 主题轴覆盖 light/dark，暗色下由 `darkModeImage` 提供对应插画；示例为纯展示型，交互覆盖为源码/重置/在线编辑生命周期。
- 固定 vendor 不变；按真实依赖核对历史证据有效性，不改旧指纹。

## 风险与假设

- 参考侧（reference-react）只别名了固定 vendor 的插画入口，固定片段里的 `@douyinfe/semi-illustrations` 无法解析。
- Empty 的内联插画是 svg（不是 img），视觉资产准备与比较需要把 svg 根与 path 纳入选择器。

## 修改范围

- 新增 `apps/reference-react/docs-adapters/empty.mjs`、`docs/documentation/batches/empty.json`、`apps/docs/tests/nuxt/empty-matrix.spec.ts` 与 `docs/documentation/empty-acceptance.md`；映射补 `review` 审阅块。
- 计划更新：`docs/documentation/batch-plan.md` 进度、剩余范围与下一批。
- 示例、组件、主题与文档正文未修改（示例与固定片段逐字一致）。

## 关键决策与权衡

- **插画入口指向固定 vendor**：适配器把 `@douyinfe/semi-illustrations` 映射到固定插画入口（Feedback 批次的既有做法），避免为插画新增别名或复制上游实现。
- **svgs 纳入比较范围**：选择器包含 `svg` 与 `svg path`，因此插画的 viewBox、尺寸、path data、填充与几何都在门禁内，而不是只比较外层容器。
- **不改示例**：先用临时探针核对固定片段与示例的文案，确认两端一致后不再改动示例，减少无谓的指纹变化。

## 验证证据

- 代表诊断（16 项）在修复插画别名后一次通过；`playwright --list` 实际发现 40 项与 `expectedCaseTitles` 一致。
- 首次诊断暴露参考页构建失败（`Module not found: '@douyinfe/semi-illustrations'`），按既有做法在适配器内改写为固定插画入口后通过。
- 冻结后 `accept:nuxt:batch empty --affected`：40/40 一次通过，unexpected=0、flaky=0、skipped=0、retry=0，浏览器 22.1s，整轮 42.7s；resources/site/checks 命中内容缓存。
- `prepare-coverage --batch=empty` 退出码 0；账本 221/859，Empty `accepted`、5/5 示例、章节全部 `reviewed`；随后 `--affected --plan` 显示 30/30 批证据有效。
- Prettier、ESLint、Changesets 与 `git diff --check` 通过。

## 未验证事项与剩余风险

- 剩余 638 项已映射示例待严格验收，下一批为同分类的 Highlight 4 项（展示类按计划延后轮播、图片、浮层与 Table）。
- 本批未触碰公开运行时，未运行全仓 `pnpm check:full`、发布包回归与其他浏览器，发布前按发布入口补齐。
