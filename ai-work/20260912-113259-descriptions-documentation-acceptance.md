# AI 工作记录：Descriptions 文档严格验收

- 日期：2026-09-12
- 状态：完成

## 目标

接续 Collapsible 批次，完成展示类第七个组件 Descriptions 8 项固定上游示例的双语、明暗与 LTR/RTL 严格验收（共 64 项）。起始提交 7c6d0cd，已有 28 批证据有效、208 项 accepted。本批未修改组件，主要工作是按固定上游重写英文示例数据，并处理英文页独有的纵向布局示例。

## 验收标准

- 完整矩阵一次通过，无重试、跳过或失败；逐节点比较 class、属性、文本、关键计算样式与几何（各轴 ≤0.5px）；整体截图 threshold=0.1、maxDiffPixelRatio=0.001，并对每个 Descriptions 实例单独裁剪。
- 覆盖每个实例的加载、源码、重置与在线编辑路径；示例本身为纯展示型，没有文档化交互状态。
- 固定 vendor 不变；按真实依赖核对历史证据有效性，不改旧指纹。

## 风险与假设

- 固定中文页有 8 个 live 片段，固定英文页只有 7 个（没有纵向布局片段），且两页片段顺序不同。
- 迁移版本的英文示例是按中文文案翻译的，与固定英文页的数据（Actual Users、7-day Rentention、Security Level/III、Authorized State 等）不一致。
- 英文页额外补充了中文页才有的纵向布局示例；固定英文页没有对应 live 片段。

## 修改范围

- 示例：`apps/docs/src/demos/descriptions/{zh-cn,en-us}` 按固定上游对齐——英文 Basic/Alignment/Items/DoubleRow/Horizontal/KeyStyle/ItemKeyStyle 数据逐字重写，中英 DoubleRow 去掉迁移时多加的 `maxWidth`，英文 Vertical 改为复用英文 Horizontal 的同一份数据只切换 layout。
- 文档：`apps/docs/content/en-us/components/descriptions.md` 的纵向示例说明同步改写。
- 新增 `apps/reference-react/docs-adapters/descriptions.mjs`、`apps/reference-react/docs-adapters/descriptions-vertical.mjs`、`docs/documentation/batches/descriptions.json`、`apps/docs/tests/nuxt/descriptions-matrix.spec.ts` 与 `docs/documentation/descriptions-acceptance.md`；映射补 `review` 审阅块并更新语言差异说明。
- 计划更新：`docs/documentation/batch-plan.md` 进度、剩余范围与下一批。
- 未修改 `packages/ui` 与主题。

## 关键决策与权衡

- **英文示例以固定英文页为准**：中文页与英文页的示例数据本就不同，英文示例按固定英文片段逐字恢复，而不是继续沿用中文翻译，否则文本、键名与列数都对不上。
- **英文纵向示例复用横向数据**：固定英文页没有纵向 live 片段，若继续使用翻译自中文的数据，参考侧只能凭空构造第二份数据；改为一数据两布局后，参考适配器只需把同一片段 `layout` 改为 vertical，示例也更直观地展示布局差异。
- **另开 descriptions-vertical 参考适配器**：参考页的示例序号与固定片段一一对应，英文纵向示例没有独立序号，因此用独立适配器复用英文横向片段并改写 layout，而不是让主适配器按 locale 猜分支。
- **矩阵按语言分别取片段序号**：中文与固定英文页的片段顺序不同（Items/DoubleRow/Horizontal/Vertical 位置不同），矩阵为每个示例记录 zh/en 两个序号，避免张冠李戴地对照。

## 验证证据

- 对齐阶段先用临时探针逐条比对固定片段与示例的文案/属性，列出并修复全部英文差异（含 KeyStyle 的 `john@example.com`）后，探针无残留。
- 代表诊断（25 项）一次通过；`playwright --list` 实际发现 64 项与 `expectedCaseTitles` 一致。
- 冻结后 `accept:nuxt:batch descriptions --affected`：64/64 一次通过，unexpected=0、flaky=0、skipped=0、retry=0，浏览器 31.6s，整轮 52.0s；resources/site/checks 命中内容缓存。
- `prepare-coverage --batch=descriptions` 退出码 0；账本 216/859，Descriptions `accepted`、8/8 示例、章节全部 `reviewed`；随后 `--affected --plan` 显示 29/29 批证据有效。
- Prettier、ESLint、Changesets 与 `git diff --check` 通过。

## 未验证事项与剩余风险

- 剩余 643 项已映射示例待严格验收，下一批为同分类的 Empty 5 项（展示类按计划延后轮播、图片、浮层与 Table）。
- 本批未触碰公开运行时，未运行全仓 `pnpm check:full`、发布包回归与其他浏览器，发布前按发布入口补齐。
- 英文页新增的纵向示例仍以「同一固定片段的 layout 改写」为对照，属于文档增强项的等价处理，已记入验收记录。
