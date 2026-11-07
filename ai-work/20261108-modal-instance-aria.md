# BUG-000077：Modal 多实例标题及正文关联修复

## 问题现象

工单记录组件库 2.0.3 / Vue 3.5.44：迭鹿详情浮层中打开状态流转确认框，视觉标题为内层操作名，但可访问名称读取外层详情标题。独立两个标准 Modal 同时可见也能复现；不依赖业务自定义 header、CSS 或数据操作。

本次在组件库工作区使用固定 Vue 3.5.42 与只读 Semi React v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。新增回归修复前 5 项全部失败，嵌套实例通过 document.getElementById 解析标题时得到外层标题，符合工单现象。

预期：每个 dialog 引用自己的标题和正文，多实例、重开及 SSR 接管后均不串读；保持原关闭、焦点、动效行为。

## 已确认根因

- `ModalInnerContent.vue` 将标准标题和正文 ID 分别固定为 `semi-modal-title`、`semi-modal-body`，dialog 也引用这些固定值，文档级解析指向第一个实例。
- 无标题或自定义 header 时仍引用不存在的标准标题 ID；无标题分支的正文缺少 ID。
- `ModalDialog.vue` 已通过 useId 生成 SSR 稳定的 dialog ID，可直接派生子节点 ID；但命令式方法每次 createApp，Vue 默认 useId 只保证 app 内唯一，需要区分这些独立 app。
- 固定 React 基线 `ModalContent.tsx` 的 renderHeader/renderBody/getDialogElement 同样使用固定 ID。本次明确接受可访问性差异，保留其余公开契约，不修改 vendor。

## 修复方案与影响

- 从现有 dialogId 派生标准标题与正文 ID，dialog 引用同一实例的节点；无标题/自定义 header 不产生悬空的标准标题引用，正文两种布局都有对应 ID。
- 为命令式 app 设置独立 idPrefix，避免静态确认框与普通实例及其他命令式实例碰撞。SSR 不使用全局递增 ID；声明式实例保留 Vue useId 的 hydration 稳定性。
- 不修改 `.semi-*` class、布局、主题、公开 props/emits/slots、Foundation、关闭保护、焦点或动画实现；不改变业务规则，不升级业务依赖。
- 新增单元回归与真实 tarball 浏览器场景，更新中英文文档和组件契约，添加 UI patch Changeset。生成的具体 ID 不是供消费者固定选择器使用的契约。

## 实际验证

- `pnpm test:unit packages/ui/src/modal packages/ui/src/side-sheet packages/ui/src/user-guide`：10 个文件、48 项通过，包含新增 5 项；覆盖嵌套/同级、keepDOM 两路径、标题更新、标准与多个静态实例、无标题/自定义 header、SSR/hydration ID 稳定。
- `pnpm exec playwright test tests/browser/components/modal.spec.ts`：完整 Chromium 新 headless，5 项通过，0 重试；原 DOM/交互/焦点、明暗主题与 RTL 几何及像素回归通过，未更新快照。
- `pnpm test:consumer tests/consumer/modal-a11y.spec.ts`：3 项通过，0 重试；真实安装的新生产 tarball，在明暗主题按浏览器可访问名称与描述定位嵌套弹窗，验证 Esc、遮罩关闭保护、关闭重开及焦点恢复；普通与多个命令式实例并存时全局 IDREF 均指向自身节点。fixture 拒绝混入 workspace/vendor 源码。
- `pnpm check:artifacts`：退出码 0，公开包及主题构建、主题入口、无 DOM SSR import、真实 tarball 安装/exports/ESM/类型/样式/tree-shaking 检查通过。复用用户 pnpm store 的标准消费检查，不声称隔离下载验证。
- 受影响源码、单测与 consumer 的 ESLint、根类型检查、UI 类型检查通过；最终 Prettier、Git 差异空白与 Changesets 检查均通过。
- 初次 Changesets 检查发生在新增记录尚未被 Git 跟踪时，CLI 报未发现新记录；暂存当前任务后复验，不改变门禁规则。

## 交付边界

本次修复组件库并验证本地生产 tarball，尚未发布、推送或升级迭鹿业务依赖；原业务现场需消费修复版本后按原路径复验。浏览器可访问性计算通过，不等于已执行实体屏幕阅读器人工测试。

组件技能入口指向的 semi-ui-vue-vertical-slice 文件已不存在，本次按现行组件契约、固定源码与验证入口执行。工作区没有 CodeGraph 索引，完整工具目录没有 WebStorm MCP，使用项目 mise/CLI；不初始化索引或改动 IDE 配置。

诊断输出、浏览器报告与构建日志保留在本地临时路径及已忽略的 test-results/playwright-report 中，不随 Git 提交。
