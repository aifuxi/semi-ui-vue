# Tooltip / Popover 退场中快速重开

## 问题与根因

默认动效下，点击打开 Tooltip / Popover，再次点击关闭，退场尚未结束时立即点击重开，新展示请求被忽略。Popover 的真实安装包 Chromium 复现中，第三次点击后仍为 `aria-expanded=false`，菜单最终消失；受控 `visible=true` 的定向单测也复现。

固定 v2.102.0 的 Tooltip Foundation `show` 在 `getAnimatingState()` 为真时直接返回。上一轮 Select 修复仅为 `custom` 且显式 `visible=true` 的退场重开绕开门禁，`click` 及其他触发方式仍有相同限制。问题位于共享 Tooltip 适配层，Popover 自身无需维护第二套状态。

修复前证据保存在已忽略的 `test-results/model-animation-audit/`；本轮正式真实包回归在旧产物上也失败，记录位于 `test-results/overlay-reopen-fix/browser-before/`。最初新增的两个 Popover 单测因未等待首次挂载完成而没有找到 Portal，补齐已有 `flushPopover` 初始化步骤后才用于行为验证，不将该测试准备失败认定为组件缺陷。

## 修复与兼容边界

- Adapter 在 `leave` 阶段允许新的 `show` 打断退场；入场中的重复 `show` 继续受原门禁保护。
- 保留真实入场/退场动画、事件载荷与定位。取消的退场不发 `afterClose`；下一次正常关闭继续按照 `keepDOM` 保留或销毁 Portal。
- 不修改 vendor、不复制状态机。允许退场中重开相对固定 React 基线的差异，已同步至 Tooltip / Popover 契约，并修正 Select 契约中的旧范围说明。
- 添加公开 UI 包 patch Changeset，版本仍由发布机器人维护。

## 验证

环境为项目 mise Node 24.18.0、pnpm 12.3.4，Playwright 1.62.1 完整 Chromium 新 headless；正式浏览器配置为 3 workers、0 retries。

- `pnpm test:unit packages/ui/src/tooltip packages/ui/src/popover packages/ui/src/popconfirm packages/ui/src/dropdown packages/ui/src/select`：117 项通过，含五种 trigger 的受控重开、Popover 非受控点击、两种 `keepDOM`、`afterClose` 次数、Select 原修复及 SSR/hydration。
- `pnpm test:consumer tests/consumer/overlay-reopen.spec.ts tests/consumer/popover-repeat.spec.ts tests/consumer/select-model.spec.ts`：26 项通过。新增 8 项覆盖 Tooltip / Popover × 受控/非受控 × light/dark；保留真实 CSS，只在专项中延长退场到 2 秒来稳定重开窗口，不添加固定等待或重试。其余回归仍使用原默认时长。
- `pnpm exec playwright test tests/browser/components/tooltip.spec.ts tests/browser/components/popover.spec.ts tests/browser/components/dropdown.spec.ts tests/browser/components/select.spec.ts`：22 项通过，含 light/dark、RTL、几何与现有截图基线，未更新指纹。
- 公开 UI 包构建、`pnpm verify:artifacts`、根与 UI 类型、受影响文件 ESLint、格式、固定 vendor、源码边界及 Changesets 检查通过。真实 tarball 检查复用已安装外部依赖，不宣称执行了全新隔离安装。

日志、安装包来源、截图及轨迹保存在本地已忽略的 `test-results/overlay-reopen-fix/`、`test-results/consumer/` 和 `playwright-report/`，不提交原始附件。

## 交付范围

完成组件库本地修复、回归及独立提交。未发布 npm、未部署或升级业务依赖；没有重跑未受影响的全库组件矩阵，也不将先前原业务页面的待验收流程计作本轮通过。
