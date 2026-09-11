# AI 工作记录：Notification 文档严格验收

- 日期：2026-09-11 23:02
- 状态：完成
- 执行模型：deepseek-flash

## 目标

完成固定 Semi Design v2.102.0 基线中 Notification 八项 live 示例的双语、明暗与适用 RTL 严格视觉和行为验收，修复验收中发现的组件与示例对齐缺陷，并保持受影响的 ConfigProvider 历史证据有效。

## 验收标准

- 八项示例（Basic、Position、Icons、Colored、Links、Delay、ManualClose、Update）在 zh-cn/en-us × light/dark × LTR/RTL 下共 64 项正式矩阵一次通过，无重试、跳过或失败。
- 关键 computed style 精确相等、各轴几何 ≤0.5 CSS px、截图 threshold ≤0.1 且差异比例 ≤0.001；六种位置有真实贴边/居中证据。
- 进出动效、自动关闭与同 id 更新计时、`duration: 0`、manual close 队列顺序、真实编辑器运行均有 Chromium 证据。
- 因 Notification 组件内部对齐修复而失效的 ConfigProvider 批次重验通过；覆盖账本与进度文档同步。

## 风险与假设

- Notification 命令式 wrapper 追加到 body 且固定定位，两个宿主的滚动位置和页面内容不同，不能以 wrapper 为几何原点，也不能直接用整页截图对比。
- Update 示例在 1 秒后用同 id 重新 open；若在 1 秒内关闭，固定实现会重新创建通知，编辑器断言必须以更新完成为前置条件。
- 自建探针运行在旧构建产物上，因此探针数据只用于定位差异，最终结论以正式验收为准。

## 修改范围

- `packages/ui/src/notification/NotificationNotice.vue`、`NotificationNodeRenderer.ts`、`Notification.test.ts`：`-icon-show` class 判定与自定义 Semi 图标尺寸克隆对齐固定实现，并补回归断言。
- `apps/docs/src/demos/notification/zh-CN/*.vue`、`en-US/Links.vue`：中文示例按钮/正文回退固定源码英文原文；Links 改回 fragment（数组 VNode）结构。
- `apps/reference-react/docs-adapters/notification.mjs`：修正英文前两例 `with`/`Position` 误写、补 ManualClose 的 `useState` import、独立品牌替换、纯图标按钮双语 `aria-label`。
- `apps/docs/tests/nuxt/notification-matrix.spec.ts`、`docs/documentation/batches/notification.json`、`mappings/notification.json`、`notification-acceptance.md`：新增本批正式矩阵与审阅材料。
- `docs/documentation/batch-plan.md`、`docs/documentation/README.md`、`docs/components/notification/alignment.md`、changeset：进度、对齐记录与发布记录。

## 关键决策与权衡

### 对照根使用真实浮层而不是 wrapper

- 选择：以 `.semi-notification-list[placement=...]` 作为样式/几何/截图对照根，截图时只隐藏宿主页面并统一 body 背景。
- 理由：wrapper 是固定定位但无偏移的 body 子节点，其静态位置随宿主滚动位置变化，探针实测相对 wrapper 的 y 差值可达 8700px；浮层本身是视口锚定的。
- 备选：以整个 viewport 截图对比；被文档页面内容干扰，无法定位差异。
- 代价：需要额外断言位置贴边/居中。
- 回退：无。

### 中文示例文案回退固定源码

- 选择：中文示例的按钮与正文改回固定源码的英文原文，只保留 Bytedance→AIFUXI 与 Toutiao/Vigo→Bell/Star 的独立品牌替换；参考适配器不再做中英文本地化替换。
- 理由：严格验收以固定 React 基线为准，映射材料未声明这些文案属于允许偏差；仓库既有批量（如 Banner）同样保留上游各语言原文。
- 备选：在参考适配器中把参考文案本地化成 Vue 中文；会引入未声明的参考改写，弱化基线可信度。
- 代价：中文文档页按钮显示英文，与官方固定文档一致。
- 回退：删除示例改动并恢复适配器替换。

### Update 编辑器断言等待同 id 更新

- 选择：编辑器内点击关闭前，先等待内容变为 `updated`。
- 理由：固定示例在 1 秒后以同 id 重新 open；提前关闭会按固定实现重新创建通知，属于示例时序而非组件缺陷。
- 备选：放宽 `toHaveCount(0)` 超时；掩盖真实行为。
- 代价：编辑器用例增加约 1 秒。
- 回退：无。

## 验证证据

- 探针 `apps/docs/tests/nuxt/notification-probe.spec.ts`（已删除，摘要保留在 `apps/docs/.data/documentation-smoke/notification/2026-09-11T14-43-31-695Z/probe.json`）：定位到 3 处真实差异——`default` 缺 `-icon-show`、自定义图标未按 `large` 克隆、Links 多包一层 `div`；其余 8 项示例的浮层 DOM、class、computed style 与几何在修复前已一致（除结论中列出的对照根噪声）。
- `pnpm rstest run packages/ui/src/notification`：2 个文件、12 项通过。
- `pnpm exec prettier --check`（改动文件）与 `pnpm exec eslint`（改动文件，`--max-warnings=0`）：通过，无输出。
- `pnpm --filter @workspace/docs diagnose:nuxt:batch notification`：25/25 代表用例一次通过（8 示例双语 light、暗色代表与 RTL 代表）。
- `pnpm --filter @workspace/docs accept:nuxt:batch notification config-provider`：80/80 正式矩阵通过（Notification 64、ConfigProvider 16），`unexpected=0`、`flaky=0`、`skipped=0`，共享一次构建，墙钟 321s，浏览器阶段 208s（3 workers）；证据 `docs/documentation/evidence/notification.json` 与 `notification.report.json.gz`。
- `prepare-coverage.mjs`：覆盖账本刷新为 859/859 已映射、116 个有效验收。
- `pnpm check`：见下节结论（本条在交付前执行）。

## 未验证事项与剩余风险

- 其余 743 项待严格验收，下一批为 Toast 9 项（含英文独有堆叠示例）。
- `docs/documentation/README.md` 中 Space、Typography、Accessibility、Banner、Feedback 等批次此前未单独追加日期条目，本次只同步总数与本批条目，属于既有文档漂移。
- 本轮未重跑全量组件 Chromium 回归（Notification 以外的组件运行时未改动；影响范围由依赖追踪判定为 ConfigProvider，已重验）。
