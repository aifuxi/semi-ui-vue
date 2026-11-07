# Dropdown 默认防溢出修复（BUG-000074）

## 问题现象

从用户指定的现有 Chrome 工作项读取问题：2.0.3 的右上角“导出”菜单在缺省 `autoAdjustOverflow` 时越出视口，撑大根页面滚动区，产生外层横/纵滚动条。独立 Button + Dropdown、body margin=0、默认主题即可复现；显式 true 能消除溢出。来源为工作项 377422916628779008；本次仅修改组件库，不改离线数据助手。

复现输入使用 click trigger、默认 position、默认 body Portal、顶部 12px/右侧 16px 留白和两项导出菜单，覆盖 1100×728、760×528 和 1440×900。

## 已确认根因

`defineProps<DropdownProps>()` 将缺省 Boolean 转成 false；原 `resolveOptional()` 在未传且无全局覆盖时回落到这个转换值。`tooltipBindings` 只排除 undefined，因此把 false 传给 Tooltip，覆盖其默认 true。固定 vendor v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21 的 Dropdown 原样转发可选参数，Tooltip 自行应用默认值。

新增 8 项参数回归在原源码上出现 3 项失败：缺省防溢出、undefined 采用全局覆盖、其他可选 Boolean 缺省。动态回归另确认 Vue 的“未传 → false”解析值不变，单纯依赖 props 值不能保证 computed 重新计算。

## 修复方案

- `resolveOptional()` 仅接受原始参数中非 undefined 的显式值，否则读取 Dropdown 全局覆盖；仍缺省则返回 undefined，让 Tooltip 使用其全局覆盖和默认值。
- 沿用项目 SideSheet 的原始参数版本追踪模式，在组件更新前使可选参数绑定重新检查参数存在性。没有扩展到其他组件或修改 vendor。
- `autoAdjustOverflow` 公开类型显式允许 undefined；其优先级为显式非 undefined → Dropdown 全局覆盖 → Tooltip 全局覆盖 → Tooltip 默认 true。
- 同一解析器的其他可选 Boolean 不再被合成 false，配套检查下层键的缺省语义。
- 复用真实 tarball 消费 fixture，新增独立 query 场景；没有使用业务 CSS、overflow:hidden、指定 bottomRight 或消费者参数绕过。

## 验证结果

- Dropdown 单测、SSR 与 hydration：4 文件、32 项通过；参数回归先红后绿。
- 最终包含 Tooltip/Portal 的受影响单元回归：7 文件、60 项通过。
- `pnpm check:artifacts`：构建、主题、公开声明、无 DOM import、tarball exports/ESM/CSS/SSR/tree-shaking 通过。
- `pnpm test:consumer`：3 workers、0 retries，11 项通过；其中新增 Dropdown 8 项。覆盖缺省、undefined、true、false、Dropdown 与 Tooltip 全局覆盖及显式参数优先级，检查真实菜单/每项边界与根 client/scroll 尺寸、无页面位移。较宽菜单、反复开关、resize、四角、鼠标/键盘、Escape/外部关闭与回焦均通过。
- 占位模式移除 Playwright 默认隐藏滚动条参数，并用原生滚动容器确认 15px 占位；默认 headless 对照确认 0px 占位。没有改变系统偏好。0px 对照只证明零占位几何，不证明原生浮动滚动条的视觉行为。
- `pnpm exec playwright test tests/browser/components/dropdown.spec.ts`：固定本地 React 基线专项 5 项通过，light/dark/RTL 截图未改。
- 最终 `pnpm check:artifacts` 再次通过；`pnpm typecheck:root`、UI `vue-tsc --noEmit`、本次源码与测试 ESLint、格式及 `git diff --check` 通过。IDE build 返回诊断能力有限，未把它替代命令行类型检查；最终差异仅包含本次 8 个文件。

一次浏览器启动错误地用 `pnpm test:browser <file>`，脚本自带 `tests/browser` 导致扩展为全目录匹配，已中断且服务自动清理；不作为全量通过证据。中途观察到 Popconfirm 等非目标场景失败，未归因或修改；上述 Dropdown 定向结果独立执行。早期 consumer 调用缺少 pnpm script 环境、滚动条参数配置与退出后布局即时采样的问题均已定位修正，保留日志，不按重试算通过。

## 验证边界

本机 macOS、项目 Vue 3.5.42、完整 Chromium 新 headless；未修改或升级原应用。原应用少量数据与 57 列宽表、Electron 45.2.3、系统原生浮动滚动条以及 Windows/Linux 实机尚未复测，不据此关闭完整应用验收。修复后默认消费者无需添加 autoAdjustOverflow=true；发布和消费方升级未执行。

日志和截图保存在已忽略的 `test-results/`、`playwright-report/`，不提交生成附件。
