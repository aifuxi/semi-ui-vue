# AI 工作记录：OverflowList 文档严格验收

- 日期：2026-09-12
- 状态：完成

## 目标

推进展示类下一个组件 OverflowList：先按双线计划记录的前置条件定位并修复 collapse/scroll 计数更新问题，再完成 4 项双语示例的严格视觉与行为验收（32 项矩阵），刷新账本并收尾。起始提交 2564b86，已有 32 批证据有效、236 项 accepted。

## 验收标准

- 完整矩阵一次通过，无重试、跳过或失败；逐节点比较 class、属性、文本、计算样式与几何（各轴 ≤0.5px）；整体截图 threshold=0.1、maxDiffPixelRatio=0.001。
- 每个示例都要覆盖文档描述的宽度变化：折叠模式收窄后 `+N` 与实际隐藏数量一致，滚动模式两端计数随 IntersectionObserver 更新。
- 固定 vendor 不变；组件修复只改 OverflowList 自身，按真实依赖核对历史证据有效性。

## 风险与假设

- 迁移记录（`ai-work/20260907-103119-...`）已记录折叠模式 `+N` 与实际可见数量不符，且未定位根因。
- 固定片段依赖 Slider 拖动交互；React 与 Vue 的 Slider 在 RTL 下方向键映射不同。
- ScrollLoad/Virtualized/DragSort 属于 List 批次，与本批无关。

## 修改范围

- 组件：`packages/ui/src/overflow-list/OverflowList.vue` 改为在渲染期调用 overflow 渲染器；新增 `OverflowListOverflow.ts` 承载折叠包装节点与滚动边缘片段（按隐藏项键重建）；`OverflowList.test.ts` 增加三项回归用例。
- 示例：`apps/docs/src/demos/overflow-list/{zh-CN,en-US}` 去掉迁移时额外添加的 Slider `aria-label`（固定片段没有该属性）。
- 批次材料：新增 `apps/reference-react/docs-adapters/overflow-list.mjs`、`docs/documentation/batches/overflow-list.json`、`apps/docs/tests/nuxt/overflow-list-matrix.spec.ts`、`docs/documentation/overflow-list-acceptance.md`；映射补 `review` 审阅块与指纹，并更新两条与行为相关的示例说明。
- 计划更新：`docs/documentation/batch-plan.md` 进度、剩余范围与下一批。
- 未修改 Foundation、主题与共享参考壳。

## 关键决策与权衡

- **组件修复而不是示例绕过**：折叠模式的 `+N` 与可见项数长期不一致，根因是 overflow 渲染器在 computed 中被调用（VNode 创建于渲染之外），滚动模式则被 Vue 的 stable 槽更新跳过；这两处都属于组件契约（固定实现每次渲染都调用渲染器），因此在组件层修复并在渲染期调用渲染器，而不是在示例里硬编码计数或强制重建。
- **以隐藏项键重建槽内容**：Vue 会跳过 props 未变化子组件的槽更新，即使槽内容依赖的隐藏项已变化。折叠模式给包装节点、滚动模式给边缘片段加隐藏项键，隐藏集合变化时重建子树，得到与固定 React「每次渲染调用渲染器」相同的可观察结果；隐藏集合不变时不重建。
- **示例向固定基线收敛**：Slider 的 `aria-label` 是迁移时新增的（固定片段没有），按验收契约以固定基线为准删除，避免为一处装饰性属性扩大比较例外。
- **文本节点分段差异写进参考适配器**：固定片段的 `>+{n}<` 在 React 下是两个子节点，会让 Tag 走 `center` 分支、不推导 `Tag: +N` 且字形宽度差约 0.016px，Vue 模板只能合并成一个文本节点。适配器把该表达式规范为等价的模板字符串，使两侧渲染同一文本节点后再严格比较；示例与可见文案不变。这样比在矩阵里放宽文本、类名与长度样式三处门槛更小。

## 验证证据

- 组件单测 11 项通过（含三项新回归：计数随宽度重渲染、组件封装计数同样更新、空槽不渲染包装节点）；`tests/browser/components/overflow-list.spec.ts` 5 项参考场景对照通过。
- 定点诊断逐项推进：Collapse zh-cn light 通过后，13 项代表诊断一次通过（15.6s）。
- 冻结后 `accept:nuxt:batch overflow-list --affected`：32/32 一次通过，unexpected=0、flaky=0、skipped=0，浏览器 29.5s，整轮 51.2s。
- 账本 236 → 240/859，OverflowList `accepted`、4/4 示例、章节全部 `reviewed`；`--affected --plan` 显示 33/33 批证据有效（组件修复未使任何历史批次失效）；`prepare-coverage --batch=overflow-list` 退出码 0。
- Prettier、ESLint、`git diff --check` 通过；未新增依赖，`pnpm-lock.yaml` 未变。

## 未验证事项与剩余风险

- 剩余 619 项待验收，下一批为同分类的 ScrollList 1 项（按记录先统一双侧分钟禁用数据）。
- 本批修改了公开运行时（OverflowList 更新语义），未运行全仓 `pnpm check:full`、发布包回归与其他浏览器；发布前按发布入口补齐。
- List 的 ScrollLoad、Virtualized、DragSort 三项仍因参考壳缺少第三方依赖留在队列中。
