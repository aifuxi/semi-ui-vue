# AI 工作记录：Badge 文档严格验收

- 日期：2026-09-12
- 状态：完成

## 目标

接续 Avatar 批次，完成展示类第二个静态组件 Badge 6 项固定上游示例的双语、明暗与 LTR/RTL 严格验收（共 48 项）。起始提交 9eb2deb，已有 23 批证据有效、169 项 accepted；未跟踪的 `.omp/` 属于既有工作区内容，未操作。

## 验收标准

- 完整矩阵一次通过，无重试、跳过或失败；逐节点文本、class、内联 `style`、图标 SVG 与关键计算样式一致，几何各轴 ≤0.5px，整体及逐 `.semi-badge` 局部像素 threshold=0.1、maxDiffPixelRatio=0.001。
- 交互覆盖示例中真实存在的路径：双语 light/LTR 的源码展开与收起、重置、实际在线编辑与退出恢复。
- 固定 vendor 不变；按真实依赖核对历史证据有效性，不改旧指纹。

## 风险与假设

- Badge 示例依赖 Avatar（已是 accepted 组件），矩阵的节点序列同时覆盖 Avatar 子树；两侧必须逐节点等长。
- 独立使用示例的状态标签是 `.semi-badge` 的兄弟节点，只测 `.semi-badge` 会漏掉标签文本，故测量选择器额外包含 `span`（选择器去重，不会重复计入徽标）。
- dot 徽标仅 8×8，逐徽标裁剪比例分母极小；先按严格裁剪运行，出现抗锯齿差异时再按证据记录限定比较单位。

## 修改范围

- 新增本批参考适配器、48 项矩阵、批次配置、映射审阅与验收记录。
- 恢复固定上游文案：中文独立使用示例的状态标签改回上游双语标签，英文示例改回上游小写字面。
- 未修改组件、主题或共享构建设施。

## 关键决策与权衡

- **恢复固定上游文案而非改写参考**：迁移版本把中文标签改成单语（`进行中`）、英文标签改成首字母大写（`Processing`），与固定站逐字对照不符。仓库既有做法是示例逐字沿用上游（Spin 恢复上游文案、Typography 恢复英文措辞与大小写、FloatButton 保留上游反向语言描述），参考适配器只用于修正陈旧/错误契约，因此本批按上游恢复文案，未在适配器里做文本改写。
- **适配器最小化**：固定六例都是匿名箭头片段，适配器只把首个 `() =>` 命名为默认导出；不注入导入、不替换任何 prop（上游片段自带 React/Badge/Avatar/IconLock 导入）。
- **无动效处理**：Badge 无 Foundation 动效与 CSS transition，矩阵不调用 `freezeAnimations`，与 Divider 一致。
- **逐徽标裁剪保留**：dot 徽标的极小裁剪在本批未出现超限差异（Icon 批次已是同类先例），因此没有像 Avatar 的 Overlap/More 那样改用整体截图，门槛未放宽。

## 验证证据

- 基线计划 `accept:nuxt:batch --affected --plan`：23 批有效，仅 badge 待验收（952 个源码输入）。
- 用例集合核对：`expectedCaseTitles` 48 项与 `playwright --list` 实际发现 48 项完全一致。
- 代表诊断 `diagnose:nuxt:batch badge` 19/19 一次通过（首次运行即通过，无组件或定位问题）。
- 组件侧：`rstest run packages/ui/src/badge` 无失败（本批未改组件）。
- 冻结后 `accept:nuxt:batch badge --affected`：1 批 48/48 一次通过，unexpected=0、flaky=0、skipped=0，3 workers，浏览器 24.5s，整轮 55.9s（resources/site 按内容缓存复用，checks 重建）。
- `prepare-coverage --batch=badge` 退出码 0；账本 175/859，Badge `accepted`、章节全部 `reviewed`；验收后只读核验 24/24 批证据有效。
- Prettier、ESLint、`git diff --check` 通过。

## 未验证事项与剩余风险

- 剩余 684 项已映射示例待严格验收，下一批为同分类的 Calendar 9 项。
- 本批未触碰公开运行时，未执行全仓 `pnpm check:full`、发布包（tarball/主题）回归与跨浏览器矩阵；发布前按发布入口补齐。
- 展示类中动态浮层、图片、轮播与 Table 组件仍按队列要求排在静态展示组件之后。
