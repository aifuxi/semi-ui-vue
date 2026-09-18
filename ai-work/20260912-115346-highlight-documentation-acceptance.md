# AI 工作记录：Highlight 文档严格验收

- 日期：2026-09-12
- 状态：完成

## 目标

接续 Empty 批次，完成展示类第九个组件 Highlight 4 项固定上游示例的双语、明暗与 LTR/RTL 严格验收（共 32 项）。起始提交 998ea56，已有 30 批证据有效、221 项 accepted。本批未修改组件，只新增批次材料并处理参考侧的上游告警。

## 验收标准

- 完整矩阵一次通过，无重试、跳过或失败；逐节点比较 class、属性、文本、关键计算样式与几何（各轴 ≤0.5px）；整体截图 threshold=0.1、maxDiffPixelRatio=0.001，并对每个高亮片段单独比较像素。
- 示例为纯展示型，交互覆盖为源码/重置/在线编辑生命周期。
- 固定 vendor 不变；按真实依赖核对历史证据有效性，不改旧指纹。

## 风险与假设

- 固定 Adapter 的 `searchWords` propTypes 仍声明为字符串数组，而 v2.71.0 起支持对象数组，参考侧渲染「不同文本使用差异化样式」会打印 propTypes 告警（console error）。
- 中英文 Style 片段结构不同（中文两段 Highlight、英文一段），高亮片段数量与语言相关。
- 同一个小数像素矩形在不同宿主上取整不同，元素截图会出现 1px 尺寸差。

## 修改范围

- 新增 `apps/reference-react/docs-adapters/highlight.mjs`、`docs/documentation/batches/highlight.json`、`apps/docs/tests/nuxt/highlight-matrix.spec.ts` 与 `docs/documentation/highlight-acceptance.md`；映射补 `review` 审阅块。
- 计划更新：`docs/documentation/batch-plan.md` 进度、剩余范围与下一批。
- 示例、组件、主题与文档正文未修改（示例与固定片段逐字一致）。

## 关键决策与权衡

- **精确豁免一条上游告警**：只忽略匹配 `Invalid prop \`searchWords[N]\` of type \`object\` ... expected \`string\`` 的这一条固定 Adapter propTypes 误报，其它 console error 仍使用例失败；Vue 侧按公开类型支持两种写法，无需放宽。
- **逐片段裁剪锚定参考元素**：按参考元素的包围盒计算固定 clip 并对两侧使用同一区域，避免同一小数像素矩形取整不一致导致的 1px 尺寸差；裁剪范围只多出 2px，不影响门槛。
- **数量以参考页为准**：英文 Style 片段只有一段 Highlight，矩阵不再写死语言相关的片段数，而是读取参考页实际数量后要求 Vue 侧一致，并断言至少渲染一个片段。

## 验证证据

- 代表诊断（13 项）在两次修正后一次通过；`playwright --list` 实际发现 32 项与 `expectedCaseTitles` 一致。
- 迭代定位三类问题：Keywords 的上游 propTypes 告警、Tag 逐片段截图 26px vs 25px 的取整差、Style 英文片段数量与中文不同。
- 冻结后 `accept:nuxt:batch highlight --affected`：32/32 一次通过，unexpected=0、flaky=0、skipped=0、retry=0，浏览器 15.6s，整轮 36.1s；resources/site/checks 命中内容缓存。
- `prepare-coverage --batch=highlight` 退出码 0；账本 225/859，Highlight `accepted`、4/4 示例、章节全部 `reviewed`；随后 `--affected --plan` 显示 31/31 批证据有效。
- Prettier、ESLint、Changesets 与 `git diff --check` 通过。

## 未验证事项与剩余风险

- 剩余 634 项已映射示例待严格验收，下一批为同分类的 List 14 项（展示类按计划延后轮播、图片、浮层与 Table）。
- 本批未触碰公开运行时，未运行全仓 `pnpm check:full`、发布包回归与其他浏览器，发布前按发布入口补齐。
- 固定 Adapter 的 searchWords propTypes 与实际类型不一致属于上游问题，本批只做验收侧精确豁免，未修改 vendor 或 Vue 实现。
