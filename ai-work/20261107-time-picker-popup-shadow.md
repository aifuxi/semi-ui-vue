# TimePicker 弹层阴影与范围面板对齐修复

## 问题现象

BUG-000071 原记录关注 `timeRange` 内层 `.semi-timepicker-lists` 固定阴影未响应 `--semi-shadow-elevated`。本次以只读固定 React Semi `v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`，对照当前 Vue `2.0.3` 源码的真实运行结果。

复现使用现有 React/Vue TimePicker 场景，`type=timeRange`、默认值 `09:00:00 ~ 18:00:00`、分钟步长 15、关闭动效。桌面 1440×900、DPR 1、zh-CN、LTR，分别切换 light/dark 并打开范围面板。使用项目锁定的 Playwright 1.62.1 / 完整 Chromium 新 headless，采集实际 DOM、祖先计算样式与包含 24px 外沿的截图。

实际现象：Vue 阴影比 React 更重，深色主题额外出现浅色边缘。内层固定阴影在两端一致，额外效果来自 Vue 的外层通用 Popover。移除额外阴影后，完整像素检查又发现左侧三列存在 1px 水平偏移。

## 已确认根因

1. React TimePicker 将包含尺寸的专用 `prefixCls` 传给 Popover/Tooltip，外层 wrapper 无背景、无阴影。Vue 原先使用 `semi-popover`，外层命中通用背景、圆角与 `--semi-shadow-elevated`，叠加在内层固定阴影上。
2. Vue 时间列调用原生 `scrollIntoView()`，不仅滚动当前列，也移动祖先。范围左侧 `.semi-scrolllist-body` 的可视宽度 193px、内容宽度 194px，选中项居中导致 `scrollLeft=1`；React ScrollItem 仅改变当前列的纵向滚动位置。
3. 旧浏览器测试主要覆盖关闭状态与内缩 2px 的单值内容区，未检验范围弹层的完整边缘，不能证明阴影与完整范围面板对齐。

原记录中的固定阴影本身来自上游 `semi-foundation/timePicker/variables.scss`，明暗主题均为 `0 4px 14px rgba(0,0,0,.1)`；本次保留该契约。

## 修复方案

- TimePicker 恢复包含尺寸的专用 wrapper/content 前缀，避免套用通用 Popover 样式，不修改共享 Tooltip、Popover 或 vendor 样式。
- 选中项居中仅修改当前列的 `scrollTop`，保留动效选择，避免祖先横向滚动或页面滚动。
- Chromium 增加 light/dark 专项，对比默认、小、大尺寸及范围模式的 wrapper/content、阴影/背景/圆角、几何、横向滚动与完整外沿实时像素。截图作为测试附件保存在忽略目录，不更新现有快照基线。
- 更新组件对齐契约与公开包 patch Changeset。

## 验证结果

- 修复前真实 CLI 对照：两端内层固定阴影一致，React wrapper 为 `none`，Vue wrapper 为对应主题的共享 elevated 阴影；截图确认额外阴影与深色边缘。
- 首轮仅修前缀的正式 Chromium：5 项通过、2 项失败；新增完整范围截图检出内容横向偏移，未放宽阈值或覆盖旧图。进一步读取实际 `scrollLeft` 和上游 ScrollItem 实现后修复滚动边界。
- TimePicker 单元与 SSR：11 项通过；定向 ESLint 通过。
- 最终 Chromium：`pnpm exec playwright test tests/browser/components/time-picker.spec.ts`，7 项通过，0 重试。明暗主题下默认、小、大尺寸及范围模式的完整外沿实时截图一致；报告中两端附件内容相同（8 组 PNG 各自去重为同一文件）。来源、输入/选择、Portal、RTL 与既有快照断言均通过，未改截图基线。
- 类型：`pnpm typecheck:root`、`pnpm --filter @aifuxi/semi-ui-vue typecheck` 通过。
- 产物：`pnpm check:artifacts` 退出码 0，公开包构建、83 个组件主题入口、SSR import，以及真实 tarball 的安装、exports、ESM、类型、样式与 tree-shaking 均通过。
- Changesets 意图检查、受影响文件格式与差异空白检查通过。
- 未执行整库组件浏览器矩阵和 consumer 浏览器套件；本次不涉及发布或业务工作项状态修改。

诊断原图、计算样式、日志与对比图位于本地已忽略的 `test-results/time-picker-shadow/`；正式浏览器附件位于 `test-results/components/`，均不提交 Git。未修改或回写业务工作项。
