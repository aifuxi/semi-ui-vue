# AI 工作记录：List 文档严格验收

- 日期：2026-09-12
- 状态：完成

## 目标

接续被中断的 List 批次，完成展示类静态组件 List 的双语、明暗与 LTR/RTL 严格验收：先收敛交互步骤，再跑完整正式矩阵、刷新账本并收尾。起始提交 afec0aa，历史 31 批证据有效、225 项 accepted。本批不修改组件，只把示例、参考侧与页面文案对齐固定上游。

## 验收标准

- 完整矩阵一次通过，无重试、跳过或失败；逐节点比较 class、属性、文本、`input` 值、关键计算样式与几何（各轴 ≤0.5px）；整体截图 threshold=0.1、maxDiffPixelRatio=0.001。
- 交互覆盖示例中真实存在的路径：加载更多、分页翻页、输入筛选、删除与新增、多选勾选、方向键高亮，以及双语 light/LTR 的源码/重置/在线编辑。
- 固定 vendor 不变；按真实依赖核对历史证据有效性，不改旧指纹、不为通过验收新增依赖。

## 风险与假设

- 固定片段中 ScrollLoad（7）、Virtualized（8）、DragSort（9）依赖 `react-infinite-scroller`、`react-virtualized`、`dnd-kit`；参考壳未内置，且 `pnpm-lock.yaml` 是所有批次输入，新增依赖会让已验收批次全部失效。
- 迁移版示例在「添加删除项」用 `find` 规避重复、在「响应键盘事件」用可聚焦容器限定监听范围，两者都与固定片段渲染/行为不同。

## 修改范围

- 示例：`apps/docs/src/demos/list/{zh-cn,en-us}` 下 17 个文件按固定上游收敛（英文数据与文案、书单容器边框、Basic 结构与边距、Grid/Responsive 条目名、AddRemove 追加规则与底部新增容器、Keyboard 的 window 监听与高亮类名）。
- 新增 `apps/reference-react/docs-adapters/list.mjs`、`docs/documentation/batches/list.json`、`apps/docs/tests/nuxt/list-matrix.spec.ts`、`docs/documentation/list-acceptance.md`；映射补 `review` 审阅块与指纹。
- 页面正文：`apps/docs/content/{zh-cn,en-us}/components/list.md` 的 Accessibility 与迁移段落同步描述键盘监听范围、多选初值与新增规则。
- 计划更新：`docs/documentation/batch-plan.md` 进度、剩余范围与下一批。
- 未修改 `packages/ui`、主题与共享参考壳。

## 关键决策与权衡

- **交互选择器按真实结构定位**：固定 AddRemove 片段用自定义 `.list-item`（不是 List.Item），两侧都没有 `.semi-list-item`，行定位改用 `ul.semi-list-items > *`；`items()` 仍用于使用 ListItem 的示例。
- **示例向固定基线收敛而不是记录行为偏差**：添加删除项改回上游 `data.slice(list.length, list.length + 1)`（删除后再新增会出现重复书名），响应键盘事件改回上游的 window 监听并去掉额外可聚焦容器。迁移版的两处改进会与固定片段渲染/行为不同，若保留就必须收窄交互断言或写偏差；按「验收契约以固定基线为准」的既有先例收敛示例，并把行为写进页面正文，业务接入的监听范围提示保留在 Accessibility 段落。
- **排除三项动态示例而不是新增依赖**：三项依赖第三方 React 库，参考壳无法等价渲染，且加依赖会改写 lockfile 使 31 批证据失效；按 `excludedExamples` 记录原因并保留在队列中，不计入 `accepted`，List 文档保持 `in-progress`。
- **限定等价项沿用先例**：`role="listitem"`（cloneElement 透传）、`aria-*="false"`（ARIA 1.2 默认值）、React/Vue 生成 id 按定义位置归一（含 `url(#…)` 引用）、Vue scoped `data-v-*` 属性；筛选示例按 `compositionstart`→填值→`compositionend` 驱动固定片段真实路径。

## 验证证据

- 定点诊断：AddRemove/Keyboard 双语 light 4 项在修复后一次通过（7.9s）；默认代表诊断 34/34 通过（26.3s，含 11 例双语 light、首例 dark、11 例 dark RTL）。
- 冻结后 `accept:nuxt:batch list --affected`：88/88 一次通过，unexpected=0、flaky=0、skipped=0，浏览器 52.2s，整轮 133.9s；resources/site/checks 按内容缓存校验。
- 账本 236/859，List `accepted` 示例 11/14、章节全部 `reviewed`，三个排除项保持待验收；`prepare-coverage --batch=list` 退出码 0；`--affected --plan` 显示 32/32 批证据有效。
- Prettier、ESLint、`git diff --check` 通过；本批未新增依赖，`pnpm-lock.yaml` 未变。

## 未验证事项与剩余风险

- List 仍有 ScrollLoad、Virtualized、DragSort 三项待验收，需要先解决参考壳的第三方依赖策略（或在参考侧提供可对照实现），下一批为同分类的 OverflowList 4 项（按记录先修复 collapse/scroll 计数更新问题）。
- 本批未触碰公开运行时，未运行全仓 `pnpm check:full`、发布包回归与其他浏览器，发布前按发布入口补齐。
- 排除项的参考侧 shim 只保证构建可用，不作为这些示例的验收依据。
