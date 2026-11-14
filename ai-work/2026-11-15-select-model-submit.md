# BUG-000308：Select 选择后快速提交读取旧值

## 问题与定位

工单位于迭鹿研发空间 `377337357700960256`，工作项 `380094745227038720`（读取 revision 1）。业务使用 `@aifuxi/semi-ui-vue@2.2.1`，初始 READER，点击 EDITOR 后提交仍保存 READER。

在真实 tarball 的 Chromium 消费页面中，点击编辑后直接点击提交，修复前断言 `EDITOR` 失败，实际提交 `READER`；等待关闭完成再提交则成功。模型在截图时已经变为 EDITOR，但先前提交的快照仍是 READER，证明是通知时机问题。

固定 v2.102.0 Foundation 的受控 `_handleSingleSelect` 把 `_notifyChange` 放进 `closeCb`，`close` 等 `popoverClose` 才执行它；默认关闭动画为 100ms。因此快速提交可捕获旧值。工单原 jsdom 最小用例没有派发 `animationend`，只能证明尚未收到通知，不能单独证明浏览器永久丢失更新。

原业务申请缺少选择到提交之间的时序记录。本轮确认了能产生同样结果的快速提交路径，不认定其为原申请唯一原因。

## 修复

- 私有 Foundation 集成层继承固定实现，只在受控单选时同步结算选择通知；不复制状态机、不修改 vendor。
- 保留 `select → change → update:modelValue → update:value` 顺序、载荷、父级回写语义和默认视觉动效。通知时机相对固定 React 基线的差异已记录在 Select 契约和双语 API 中。
- 回归发现立即重开会被固定 Tooltip `show` 的动画门禁吞掉。Adapter 仅允许 `custom` 触发器的显式 `visible=true` 打断 `leave`，让菜单重新入场；其他触发方式和普通关闭不变。
- 新增默认动效下同步提交且不重复通知的单测，以及真实包鼠标/键盘立即提交、label/ARIA、连续选择回归。添加公开包 patch Changeset，版本交给发布机器人维护。

## 验证

环境为项目 mise Node 24.18.0、pnpm 12.3.4，Playwright 1.62.1 完整 Chromium 新 headless；正式浏览器配置为 3 workers、0 retries。

- `pnpm test:unit packages/ui/src/tooltip packages/ui/src/select packages/ui/src/pagination packages/ui/src/form`：78 项通过，包含 SSR/hydration、受控不回写、过滤、非受控、多选及直接消费方。
- `pnpm test:consumer tests/consumer/select-model.spec.ts tests/consumer/packed-components.spec.ts tests/consumer/popover-repeat.spec.ts`：19 项通过；真实 tarball 消费且校验包来源，非源码别名或 Select 替身。
- 公开包构建、主题、SSR dist、真实包 exports/类型/样式/tree-shaking 检查通过。首次复用产物发现主题 SBOM 仍为 2.2.0，标准 `pnpm check:artifacts` 重建六包后通过；最终 UI 重新构建后再次 `pnpm verify:artifacts` 通过。
- `pnpm exec playwright test tests/browser/components/select.spec.ts tests/browser/components/tooltip.spec.ts tests/browser/components/popover.spec.ts tests/browser/components/dropdown.spec.ts`：22 项通过，含 light/dark、RTL、几何与现有截图基线，未更新指纹。
- 受影响文件 ESLint、格式及根/公开 UI/私有集成类型检查通过；未运行未受影响的全库组件矩阵。

本地截图、失败轨迹、安装包来源及日志保存在已忽略的 `test-results/select-model-diagnosis/`、`test-results/consumer/` 和 `playwright-report/`，不提交原始附件。

## 交付边界

本轮修复组件库并创建本地提交，不发布 npm、不升级业务依赖、不部署。原业务账号、目录、两笔待审批申请及 UUID 均保留。原页面安装修复版后的复验、审批与 R216 整体验收仍未执行，工单不据此关闭。
