# AI 工作记录：Toast 文档严格验收

- 日期：2026-09-11 23:46
- 状态：完成
- 执行模型：deepseek-flash

## 目标

完成固定 Semi Design v2.102.0 基线中 Toast 九项 live 示例（含英文独有 Stacking）的双语、明暗与适用 RTL 严格视觉和行为验收，修复验收中发现的组件与示例对齐缺陷，并重验受影响的 ConfigProvider、Resizable、Typography 历史证据。

## 验收标准

- 九项示例在 zh-cn/en-us × light/dark × LTR/RTL 下共 72 项正式矩阵一次通过；英文独有 Stacking 纳入 Basic 的 en-us 用例。
- Toast 根节点的文本、语义、计算样式与几何（各轴 ≤0.5 CSS px）一致；`.semi-toast-content` 像素 threshold ≤0.1、差异比例 ≤0.001。
- 自动关闭边界、同 id 更新重启、leading-only 节流、堆叠 hover 展开、`duration: 0`、自定义容器、真实进出动效与编辑器运行均有 Chromium 证据。
- 因 Toast 组件修复失效的 ConfigProvider、Resizable、Typography 三批重验通过；覆盖账本与进度文档同步。

## 风险与假设

- 固定 hook holder 渲染的是 `HookToast`（裸 `Toast`），与命令式 host 结构不同；复用 host 会让 hook 弹层多一层 `fit-content` 祖先并常驻空 innerWrapper。
- Vue 文档页所有示例共享同一个命令式 Toast 实例；参考页每次导航都是新实例，对照时必须对齐实例状态。
- `theme="light"` 的提示填充是半透明的，Vue 文档页顶部搜索框会透过提示显示，参考页没有对应 chrome。
- 堆叠折叠态依赖 `.semi-toast-zero-height-wrapper` 的 `perspective: 280px`，hover 会 `perspective: unset`，鼠标位置会改变几何。

## 修改范围

- `packages/ui/src/toast/use-toast.ts`、新增 `ToastContextList.vue`、`ToastNotice.vue`、`Toast.test.ts`、`Toast.ssr.test.ts`：hook holder 就地渲染裸 Toast，空 holder 不渲染节点；`positionInList` 可选，缺省位移 0。
- `apps/reference-react/docs-adapters/toast.mjs`：补齐固定示例依赖的 `lodash-es` throttle、隐式 React、`render(Demo)` 移除，并把 `Toast`/`ToastFactory` 改走 `@semi-v2.102.0/toast` 别名。
- `apps/docs/tests/nuxt/toast-matrix.spec.ts`、`docs/documentation/batches/toast.json`、`mappings/toast.json`、`toast-acceptance.md`：新增本批正式矩阵与审阅材料。
- `docs/documentation/batch-plan.md`、`docs/documentation/README.md`、`docs/components/toast/alignment.md`、`apps/docs/content/**/components/toast.md`、changeset：进度、对齐与发布记录。

## 关键决策与权衡

### hook holder 改为裸 Toast

- 选择：`useToast` 返回的 holder 渲染内部 `ToastContextList`，逐条就地渲染 `ToastNotice`，空列表返回 `null`；命令式路径继续使用 `ToastHost`。
- 理由：固定 `HookToast` 渲染裸 `Toast`，其宽度等于宿主内容宽度；复用 host 会多一层 `width/height: fit-content` 祖先，实测 Toast 宽度 878px vs 1440px（未对齐前），空 holder 也多一个常驻节点。
- 备选：在对照中忽略该祖先差异；会掩盖真实结构差异。
- 代价：内部多一个 SFC，hook 与命令式共用 `ToastStore` 但不再共用 host。
- 回退：恢复 `useToast` 渲染 `ToastHost`。

### 参考适配器内补齐固定源码的 live scope 依赖

- 选择：批次适配器替换 `lodash-es` import 为等价 leading-only shim、为 Stacking 注入 `import React`、移除 `render(Demo)`，并把组合导出的 `Toast`/`ToastFactory` 指向已公开的 `@semi-v2.102.0/toast`。
- 理由：共享参考导入映射只识别单独 `default as X`，修改它会波及全部历史批次；批次适配器改动只影响本批指纹。
- 备选：扩展共享 `publicImport` 正则或别名 `lodash-es`；会失效并需重验全部 17 个历史批次。
- 代价：适配器承担少量固定源码修正，已在验收文档记录。
- 回退：无。

### 对照方法学修正

- 选择：Stacking 对照前重载 Vue 文档页对齐实例状态；折叠采样前先进入再离开堆叠组复位 `mouseInSide`；提示截图只保留祖先链并把 `html/body` 背景统一为 `--semi-color-bg-0`。
- 理由：三个差异分别来自共享实例状态、固定实现 `mouseleave` 的高度守卫、以及半透明 light 填充暴露宿主 chrome，均非组件缺陷。
- 代价：Stacking 用例多一次 Vue 页面加载；截图期间注入样式。
- 回退：无。

## 验证证据

- `pnpm rstest run packages/ui/src/toast`：2 个文件、11 项通过（含新增的裸 holder 与 `translate3d(0,0,0px)` 断言）。
- `pnpm exec prettier --check .`、`pnpm exec eslint`（改动文件，`--max-warnings=0`）：通过。
- `pnpm --filter @workspace/docs diagnose:nuxt:batch toast`：28/28 代表用例一次通过。
- `pnpm --filter @workspace/docs accept:nuxt:batch toast --affected`：280/280 正式矩阵通过（Toast 72、ConfigProvider 16、Resizable 112、Typography 80），`unexpected=0`、`flaky=0`、`skipped=0`，共享一次构建，墙钟 523s，浏览器阶段 443s（3 workers）；证据 `docs/documentation/evidence/toast.json` 与 `toast.report.json.gz`。
- `prepare-coverage.mjs`：覆盖账本刷新为 859/859 已映射、125 个有效验收。
- `pnpm check`：工具链、vendor、inventory、图标、插画、Locale、源码边界、别名、格式、lint、源码类型、单测与工具测试全部通过。

## 未验证事项与剩余风险

- 其余 734 项待严格验收，下一批为 Popconfirm 4 项。
- 本轮未重跑与 Toast 无关的全量组件 Chromium 回归；影响范围由依赖追踪判定为 ConfigProvider、Resizable、Typography，已一并重验。
- `docs/documentation/README.md` 中 Space、Typography、Accessibility、Banner、Feedback 等批次此前没有单独日期条目，本次仍只同步总数与本批条目，属于既有文档漂移。
