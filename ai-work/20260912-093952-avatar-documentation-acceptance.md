# AI 工作记录：Avatar 文档严格验收

- 日期：2026-09-12
- 状态：完成

## 目标

接续 Spin 批次，完成展示类首个静态组件 Avatar 15 项固定上游示例的双语、明暗与 LTR/RTL 严格验收（共 120 项），并按其真实依赖重验受影响的 8 个批次。起始提交 cd0129e，已有 22 批证据有效、154 项 accepted；未跟踪的 `.omp/` 属于既有工作区内容，未操作。

## 验收标准

- 完整矩阵一次通过，无重试、跳过或失败；逐节点文本、ARIA、`alt`/`src`、SVG 与关键计算样式一致，几何各轴 ≤0.5px，整体及逐元素局部像素 threshold=0.1、maxDiffPixelRatio=0.001。
- 交互覆盖 hoverMask 进入/退出与 renderMore 的 Popover portal；双语 light/LTR 执行源码、重置、实际在线编辑与退出恢复。
- 固定 vendor 不变；不改旧证据指纹，按真实依赖核对历史证据有效性。

## 风险与假设

- Avatar 的 topSlot/bottomSlot 是 `.semi-avatar` 的兄弟节点；选择器只覆盖 `.semi-avatar` 会漏掉 slot 子树（本批先用像素比较发现，随后补入 `.semi-avatar-wrapper`）。
- Adaptive 的 `scale` 由挂载时的文字宽度决定且不重算，参考工作台与文档站的字体加载时机不同会直接改变结果。
- 重叠圆弧与极小头像的抗锯齿像素在 dark RTL 下会超过逐元素裁剪的比例门槛。

## 修改范围

- 新增本批 React 参考适配器、120 项矩阵、批次配置、映射审阅与验收记录。
- 修复组件缺陷：`AvatarNodeRenderer` 渲染前 `cloneVNode`（同 `RatingNodeRenderer` 做法），共享 slot 配置可在每个实例重复渲染；`docs/components/avatar/alignment.md` 记录该契约。
- 中文示例恢复固定上游 alt 文案（beautiful cat / cute cat），双语引入统一为公开 Vue 子路径与独立 CSS。
- 重验受影响批次：accessibility、config-provider、dark-mode、layout、locale、navigation、skeleton、space。

## 关键决策与权衡

- **组件缺陷而非示例规避**：固定示例把同一份 slot 配置对象交给 6 个头像。Vue vnode 属于挂载它的树，原实现原样返回节点，导致第一个实例之后的头像静默丢失 slot 内容（Chromium 实测参考 45 节点 vs Vue 39 节点）。按仓库既有 `RatingNodeRenderer` 约定克隆节点后，同一配置在每个实例上继续渲染，与 React element 语义一致；未改用「每个头像各建一份 vnode」来绕开问题。
- **回归证据的选择**：先用 jsdom 单元测试复现失败，但 jsdom 容忍该复用（改前改后均通过），说明该测试无法证明任何行为，遂删除；改以 avatar-matrix 的 BottomSlot 用例作为回归证据，并用「临时回退组件修复 → 用例失败（45 vs 39）→ 恢复后通过」证明因果。
- **Adaptive 字体时序**：实测请求时间线显示示例模块在 98ms 加载、而标签使用的 `Inter-SemiBold.ttf` 到 130ms 才请求，参考侧因此把回退字体度量冻结进 `scale`。参考工作台由 JavaScript 注入字体，而固定站从 CSS 加载，因此适配器在挂载示例前请求该字重以复现固定站顺序；未采用放宽断言或改写 Vue 行为。中途尝试的路由拦截方案会在页面等待被拦截模块时因 `page.evaluate` 死锁，已放弃并记录。
- **限定差异的记录**：Overlap 的逐头像裁剪在 dark RTL 有 3 个抗锯齿边界像素差（ratio 0.00128），More 的 Popover 里 24×24 克隆头像有 1 个（ratio 0.0017）；两者逐节点 DOM/class/文本/样式/几何完全相等（rect 差 < 1e-9）且稳定复现，故这两处以整体/Popover 截图作为比较单位，其余 14 项仍逐元素裁剪，数值门槛未放宽。
- 适配器逐项核对 15 对双语片段，仅英文 Bottom Slot 的 `content` 与英文动画的 `borderMotion` 两处陈旧 prop 偏离当前契约（`borderMotion` 在固定实现中已不存在），按真实契约纠正。

## 验证证据

- 起始 `accept:nuxt:batch --affected --plan`：22 批有效。
- 用例集合核对：`expectedCaseTitles` 120 项与 `playwright --list` 实际发现 120 项完全一致。
- 代表诊断 `diagnose:nuxt:batch avatar` 46/46 通过（修复后）；期间定位并修复 5 项问题：Adaptive 字体时序、TopSlot/BottomSlot 参考渲染失败（`()=>{` 无空格写法）、BottomSlot 组件节点复用、Animation 英文陈旧 prop、Overlap 抗锯齿裁剪。
- 组件门禁：`pnpm test:unit` 全量通过；`playwright test tests/browser/components/avatar.spec.ts` 5/5 通过（含 desktop light/dark 截图与 RTL 重叠场景）。
- 冻结后 `accept:nuxt:batch avatar --affected`：9 批 384/384 一次通过，unexpected=0、flaky=0、skipped=0，3 workers，浏览器 348.8s，整轮 371.5s（resources/site/checks 按内容缓存复用）。正式证据：9 个批次的 evidence 与 report 全部刷新。
- `prepare-coverage --batch=avatar` 退出码 0；账本 169/859，Avatar `accepted`、章节全部 `reviewed`；只读核验 23/23 批证据有效。
- 批次输入 969 条解析成功、无保守扩展、无失效显式路径；Prettier、ESLint、`git diff --check` 通过。

## 未验证事项与剩余风险

- 剩余 690 项已映射示例待严格验收，下一批为同分类的 Badge 6 项。
- 组件修复触及公开运行时，本批执行了单元、组件 Chromium 与文档矩阵；未执行全仓 `pnpm check:full`、发布包（tarball/主题）回归，发布前按发布入口补齐。
- 展示类中动态浮层、图片、轮播与 Table 组件仍按队列要求排在静态展示组件之后。
