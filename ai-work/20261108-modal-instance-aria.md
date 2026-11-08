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

## 2.1.0 复测剩余项修复（2026-11-08）

### 现象与复现

已读取 BUG-000077 后续复测：原标准标题 ID 冲突已修复；同时提供 `title` 与 `header` 插槽时外层 dialog 未命名；内外层都允许 Esc 时，一次 Escape 同时触发两层取消。内层取消后还观察到焦点退回 BODY。本次只修复组件库，不操作工单字段或提交业务状态。

在库工作区新增等价公开组件回归：自定义 header 与 title 同时提供；同时显示两个默认允许 Esc 的 Modal；较高 zIndex 先挂载、较低层后挂载；内层打开后移除入口并关闭。初轮新增/调整用例出现 5 项预期失败，分别暴露名称缺失、Esc 广播和无效焦点恢复。随后扩展 keepDOM 与保留入口组合。

### 已确认根因与原验证遗漏

- `ModalInnerContent.vue` 的 aria-labelledby 明确排除了 headerProvided，自定义头部覆盖可见布局的同时也丢弃了公开 title 的名称。
- `ModalDialog.vue` 为每个实例分别安装 document keydown；固定 Foundation 的 stopPropagation 不阻止同一 document 上的其他监听，所以所有允许 Esc 的实例均收到取消。
- 原焦点恢复直接调用保存元素的 focus，没有验证元素是否仍在文档，也没有剩余顶层的焦点归属检查。等价的入口移除路径可复现 BODY 焦点；未升级实际业务服务，不能据此断言业务现场唯一原因就是入口卸载。
- 旧 consumer 虽声称覆盖嵌套 Esc，但把外层设为 closeOnEsc=false，因而不能发现 Esc 同时取消两层；旧自定义 header 单测则直接接受缺少名称。这两项预期和场景已纠正。
- 只读固定 Semi v2.102.0 的 ModalContent.tsx 与 modalContentFoundation.ts 同样没有完整的自定义头部命名和顶层 Esc 判断。此次接受可访问性修正差异，不修改 vendor。

### 实际修改与取舍

- 自定义 header 时，使用独立隐藏 title 节点作为 dialog 的名称引用。可见 header 及布局不变，不依赖业务固定 semi-modal-title，不克隆、改写用户 header，也无需新增公开 API。缺省 title 时不凭空生成名称。
- 新增私有的按 Document 隔离的 Modal 注册表，每个文档一个 keydown 监听器。按公开 zIndex 与同层 DOM 绘制顺序选择单个 Foundation，保留其取消回调与 closeOnEsc 规则。顶层禁止 Esc、仍处于受控打开状态或正在退场时都不向下广播。隐藏 keepDOM 或卸载释放注册，最后一层退出后移除监听；模块导入不访问 DOM。
- 仅顶层关闭恢复焦点。保留原入口仍连接、且属于剩余顶层时恢复入口；否则优先聚焦外层现有可操作控件，保持其 Tab 循环，无控件时回到 tabindex=-1 的 dialog。卸载底层不会抢走仍打开顶层的焦点。
- 扩展真实 tarball 消费场景，外层恢复默认允许 Esc，覆盖标准/自定义 header 的明暗主题、重开、遮罩关闭保护、命令式多 app、入口移除、keepDOM、顶层 Esc 保护及外层 Shift+Tab。补充自定义 header 的 SSR/hydration ID 稳定断言。
- 同步组件契约、中英文公开文档及 UI patch Changeset。版本号继续由发布机器人维护。

### 实际验证

- `pnpm test:unit packages/ui/src/modal packages/ui/src/side-sheet packages/ui/src/user-guide`：最终 11 个文件、54 项通过；含名称关联、层级、关闭/卸载、入口保留/移除、keepDOM、SSR/hydration 及相邻消费方。
- `pnpm exec playwright test tests/browser/components/modal.spec.ts`：5 项通过；固定 React 来源、DOM/交互、明暗及 RTL 几何/像素对照通过，原快照未修改。
- `pnpm test:consumer tests/consumer/modal-a11y.spec.ts`：最终生产 tarball 的 6 项通过，保留真实动效，0 重试；包含外层默认允许 Esc 的标准/自定义 header 明暗四项、多个命令式实例命名及入口移除/关闭保护/keepDOM/Shift+Tab。随后对命令式用例补充 Esc 逐层关闭断言，并通过 `pnpm test:consumer tests/consumer/modal-a11y.spec.ts -g 多个命令式` 的 1 项定向复验。
- `pnpm check:artifacts`：公开包与主题构建、主题入口、SSR import、真实 tarball 安装/exports/ESM/类型/样式/tree-shaking 全部通过。随后细化焦点 fallback 后重新构建 UI、生成声明并执行 verify:ssr-dist，均通过，再以新产物通过上述 consumer 测试。复用本机 pnpm store，不声称隔离下载验证。
- UI 类型检查、根工具类型检查、受影响源码和测试的 ESLint、Prettier、Git diff 空白检查通过。本次文件暂存后执行 `pnpm check:changesets` 通过，按项目 fixed 版本组识别 patch 发布意图。

### 交付边界

修复只在组件库工作区和新生产 tarball 验证。原 localhost:48273 业务仍消费已发布的 2.1.0，尚未发布新版本、升级业务依赖或回到该业务服务验证草稿离开等路径；不把库侧回归通过称为原业务整体验收通过。未执行实体屏幕阅读器或逐帧动效人工验收。工单及业务仓库未修改，旧原始问题记录保留；所有日志、截图和构建输出留在已忽略目录或本机临时路径。
