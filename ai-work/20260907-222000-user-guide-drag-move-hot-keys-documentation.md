# AI 工作记录：UserGuide 双语示例补齐

- 日期：2026-09-07
- 状态：补齐线完成；严格视觉验收未执行

按用户要求将上一轮三个独立组件拆分提交；当前提交累计纳入 UserGuide 8项。映射为 773/859，严格有效验收仍为43/859。

验证在上一轮完整三项工作区中集中执行，未为拆分提交重复构建：`pnpm --filter @workspace/docs check`、本批 ESLint/Prettier、双语开发站及最终静态逐项操作、源码/重置和编辑运行均通过。当前组件不依赖另外两项新增示例；无组件实现、主题、共享运行时或vendor修改。

运行材料保存在 `apps/docs/.data/documentation-smoke/guide-drag-hotkeys/`：`representatives-passed/summary.json`、`full-dev-ready/summary.json`、`full-static-verified/summary.json` 和 `static-extra/summary.json`。完整工作区最终静态双语各41阶段、附加各5阶段通过；本提交仅引用对应组件阶段，不将未纳入提交的映射计入本次进度。

UserGuide：NoMask/Modal双语代表通过后扩展其余6项；useId和延迟getter隔离目标，完整locale提供双语按钮；本地既有封面替换上游品牌截图，保留三步Image尺寸、文本与强调。受控步骤、前后退、完成/跳过重开、高亮10/15px和实际编辑修改均通过。完整React/Vue明暗、位置与动效严格矩阵待后续验收。
