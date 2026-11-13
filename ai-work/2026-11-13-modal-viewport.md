# BUG-000204：Modal 自动尺寸超出窄视口

## 问题与复现

来源为组件库研发空间的工作项 379472101779705856。2.1.5 默认 Modal 在 390×844 视口按 448px 渲染，关闭按钮完全不可见、确认按钮被裁切。历史账号中心现场及独立复现图片保留在工作项，不能把业务仍使用旧包的状态当作本次已升级。

本轮新增真实 tarball 回归，只使用 Vue、公开 Modal 和默认主题；无业务 CSS、接口或宽度覆盖。原生入场动画结束后，修改前用例失败，实际右边界 448px > 390px，保存同一场景截图。

## 根因与修复

只读 Semi v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21 的 modal.scss 对 small/medium/large 使用固定宽度，未限制 max-width。ModalInnerContent 原先直接采用该尺寸，未传 width 时在窄容器中仍溢出。

在 ModalInnerContent 的自动尺寸样式中增加 max-width:100%。只适用于 width 缺省且非全屏的布局，以父容器为准，因此也支持 getPopupContainer。将自动上限放在公开 style 前，允许显式 maxWidth 覆盖；显式 width 不受该上限约束。桌面 small=448px、全屏、间距、关闭、焦点和动效继续保留。无 DOM 测量、窗口事件或新增依赖。

此修正是相对固定 React 的明确窄容器行为差异，已同步中英文 API 和迁移/对齐说明，不修改 vendor。采用不增加边距的 100% 上限，避免改变既有内边距及 full-width 语义。

## 本轮验证

- 受影响 Dropdown、Modal、SideSheet、排版主题及 Portal 工具：15 文件、102 项单测通过；修复后的 Modal 6 文件、34 项再次通过。
- 新增真实 tarball 窄屏回归：8 项通过，原始缺陷先红后绿。覆盖 390/320px、light/dark、关闭/取消/确认入口、Esc 回焦、恢复桌面 448px、medium/large/full-width、显式 280/640px、全屏、自定义 280px 容器、长标题与长正文纵向滚动。
- 既有真实包回归：31 项通过，覆盖 BUG-000074/137/139 与 R-000072。该轮在修改前产物上执行，验证既有实现；不把它当作新修复后的整包全量回归。
- Modal、Dropdown、SideSheet 和 Typography 级联正式 Chromium：17 项通过，最大 3 workers、0 retries，固定基线来源、桌面 light/dark、几何/像素及 RTL；未更新旧快照或阈值。
- 修改前 check:artifacts 通过；修复后重建 UI 并运行 verify:artifacts，通过主题、SSR、真实 tarball exports/类型/样式/tree-shaking 检查。使用已有外部依赖，不代表隔离联网安装。

- 新增默认 wrap 横向滚动差值为 0 的断言后，8 项真实包专项再次通过。
- 定向 Prettier、ESLint、根工具 TypeScript、UI 声明构建、IDE 两个受影响文件错误诊断及 git diff --check 通过；人工检查修复前后 390px 对照图，关闭与主要操作完整可见。

## 边界

本机 macOS、Vue 3.5.42、项目锁定 Playwright 1.62.1 完整 Chromium 新 headless。账号中心原业务仍使用旧 npm 包，未升级、发布或执行真实账号启停，业务错误反馈验收不在本库修复结论内。显式 width 大于容器仍可溢出，这是保留调用方控制的兼容契约；本次不扩展为全面移动端适配。

截图、日志和 CLI operation 输入/持久回执保存在本机已忽略的 test-results/dielu-20261113/，图片另关联到原工作项平台资源。
