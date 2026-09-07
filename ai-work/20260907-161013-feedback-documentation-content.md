# AI 工作记录：Feedback 双语示例补齐与运行修复

- 日期：2026-09-07
- 状态：补齐线完成；Feedback 七项文档严格验收未执行

## 目标与验收标准

按补齐队列完成 Feedback 七项固定上游示例的双语实现、章节和映射；逐项验证实际页面、主要操作、源码与在线编辑器。修复阻断演示的运行问题，按真实依赖重验历史证据，不把基础运行或组件默认场景追认为七项文档的严格验收。

## 风险与基线

- 开始时工作区干净；只读 vendor 实际核验为 `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21` / `v2.102.0`，未修改 vendor。
- 按本地 React Adapter、Feedback Foundation/SCSS、默认主题、双语文档及成功插画核对；中英文 live 示例均为七项，顺序一致，无语言独有示例或额外源文件依赖。
- 新示例暴露了既有 SSR Portal 重开及动态 footer 缺陷；仅修改 Feedback、Modal、SideSheet 的必要渲染边界，没有改变公开类型、DOM/class、主题、默认动效或引入依赖。
- LSP 返回没有配置语言服务；以限定源码搜索、直接消费者回归、文档依赖计划与实际运行补足影响证据。

## 修改范围与示例映射

`apps/docs/src/demos/feedback/{zh-CN,en-US}/` 新增十四个独立 SFC，删除原有两个简化 Example1；更新双语正文、React→Vue 说明、映射和生成注册表。

| 上游索引 | SFC        | 主要契约                                                     |
| -------- | ---------- | ------------------------------------------------------------ |
| 1        | Basic      | 初始关闭、popup/emoji、评分与坏评原因、value-change 日志     |
| 2        | Text       | 文本输入、maxCount=200、空值禁用提交                         |
| 3        | Radio      | 三身份纵向单选，双语标签与值                                 |
| 4        | Checkbox   | 三产品多选、清空后禁用提交；保留英文 Huoshan 前导空格        |
| 5        | Custom     | 默认 slot、自定义 TextArea 与 okButtonProps.disabled         |
| 6        | Modal      | modal/emoji；双语标题均保留上游英文                          |
| 7        | Completion | 独立 Popup/Modal、明暗成功插画、1500ms 关闭与 200ms 提示复原 |

每个 SFC 只负责一项演示；Completion 在同一示例比较两个容器，用各自的浅层状态保存可见性、文本、提示及定时器，卸载时清理。无需新增共享组件或 composable。

## 关键决策与修复

### 保留上游语义，修正不可运行的示例

- 自定义示例将上游 `useState(value)` 的自引用初始化修正为空字符串。中文输入保留非受控 change，英文输入用 `v-model`，避免上游 renderContent 闭包遗漏 value 依赖的问题。
- Completion 保留上游共同英文按钮/标题，正文与感谢信息按语言区分。成功时覆盖空格 title、null footer；父级文本状态按上游保留，不另加重置策略。
- 英文 Provider 必须传入完整 `locale/source/en_US`。实际运行证实只传 code 时 Feedback 仍显示中文按钮；没有更改共享 ConfigProvider 的契约或硬编码按钮文本。

### SSR 动画关闭后重开丢失正文和按钮

- 真实 Nuxt 页面可复现：选择→提交→退出动画结束→重开后，正文为空、footer 仅剩容器，并报 hydration mismatch。
- 无动效的源码、发布产物及 SSR 初版探针不能复现。保留动效并用公开 `animationend` 事件完成退出后，SSR 回归在 popup/modal 两路均出现内容缺失。
- 原 Feedback 生成的内容/按钮与容器 slots 使用 computed 缓存 VNode；退出态渲染后卸载，再次挂载复用了带有旧 DOM 状态的节点。改为在渲染期生成 VNode、调用 slots，避免跨 Portal 生命周期缓存。
- 修复位于 `Feedback.vue`、`Modal.vue`、`SideSheet.vue`。没有在 Demo 加 key、强制重挂载、关闭动效或压制 hydration 错误。
- `Feedback.ssr.test.ts` 现在验证真实 createSSRApp hydration、首次提交关闭、animationend、重开后可再次选择提交，并在测试结束时清理 app、Portal 和 console spy。

### Modal 动态 null footer 未隐藏

- Completion 的 Modal 成功状态仍显示按钮；新增回归在修复前明确失败，尽管正文已切换为感谢信息。
- 原 footerProvided computed 只读取非响应式 raw VNode props 存在性，未随条件 prop 的添加/移除更新。每次 footer 渲染直接判断是否提供该 prop，保留缺省、显式 null、移除覆盖的区别。
- `Feedback.test.ts` 验证点击提交后隐藏 footer，撤销完成状态后恢复正文和可用提交按钮；未更改其它默认值或 API。

### 范围与回退

共享容器修复影响 ConfigProvider、Locale 的文档证据；其它四批仍有效。若回退，需同时恢复相关渲染实现、回归和本批示例，重新构建并按真实依赖刷新证据，不能只恢复旧 evidence 文件保留计数。

## 验证证据

- 定点 Prettier/ESLint 通过；修正了模板事件表达式返回 boolean 不满足 FeedbackActionHandler 的问题，使用返回 void 的关闭函数。
- `pnpm exec vitest run packages/ui/src/feedback packages/ui/src/modal packages/ui/src/side-sheet`：最终六个文件、30 项通过；SSR 两路及动态 footer 均有失败前/修复后证据。
- `pnpm exec vitest run packages/ui/src/upload packages/ui/src/user-guide packages/ui/src/ai-chat-dialogue packages/ui/src/config-provider/PendingConsumers.test.ts`：最终七个文件、39 项通过。
- `pnpm --filter @workspace/docs check`：最终通过，约 109 秒；包括 63 项准备/证据基础设施检查、Nuxt 类型、内容、静态产物与许可散列门禁。196 页、1542 个注册 Demo、395 条预渲染路由；13 个直接包、5741 个产物文件。仅英文 Demo/正文变化的最后一轮复用 resources。
- `pnpm exec playwright test tests/browser/components/feedback.spec.ts tests/browser/components/side-sheet.spec.ts tests/browser/components/modal.spec.ts`：最终 15 项全部通过，包含 React/Vue 行为、computed style、几何、桌面 light/dark 与 RTL 截图；没有更新基线、扩大 mask 或容差。
- `pnpm verify:pack-dist && pnpm verify:ssr-dist`：最终真实 tarball 安装、exports、ESM、类型、样式入口及公开包/子路径 SSR import 通过。

### 实际文档与在线编辑器

- 启动静态文档站，浏览器工具打开锁定 Chromium 并实际截图观察；完整交互使用同一锁定构建的独立 Playwright smoke，避免 Bun matcher 与 CDP 默认 context 的工具兼容问题。
- 最终完整 smoke：14/14 通过，37.6 秒；Chromium 1234 / Chrome 151.0.7922.34，1440×900、DPR 1、light、browser locale=en-US，分别访问 zh-cn/en-us 页面。
- 全部示例验证主要选择/输入、提交/取消、关闭重开、重置、源码展开/收起、Monaco 真实键盘修改标题、运行后 iframe 显示 Smoke 标题、退出编辑恢复原示例。
- emoji 验证坏评原因与切换正向评分后输入框隐藏；radio 验证互斥；checkbox 实际点击可见文本并检查选中、清空和禁用；text/custom 验证输入、清空及提交状态；Completion 的 Popup/Modal 均验证感谢内容、成功插画、隐藏 footer、自动关闭和重开。
- 独立、未加载 Monaco 的四项 Completion 时序烟测通过：双语两种容器在 1499ms 仍显示感谢内容，1700ms 时已关闭并复原，再次打开显示输入和按钮。成功态局部截图已观察。
- 完整编辑烟测使用真实时钟。曾在同一页面混用模拟时钟和 Monaco，引发性能测量 duration 异常；改为把受控时序检查隔离到不加载编辑器的页面，没有修改或压制应用错误。
- 无页面运行异常、hydration mismatch 或阻断操作的错误。REPL 中两条 Chromium 跨域 iframe 自动聚焦限制作为非阻断 console error 明确保留；手动打开、编辑及取消操作通过。Emmet/Pug 不支持 Web 的 warning 同样记录，未修改共享编辑器或组件 autofocus。
- 运行时在 ignored 的 `apps/docs/test-results/feedback-content/` 生成了 smoke/时序 JSON 和 20 张局部 PNG，并实际观察成功态截图；后续历史代表用例使用 Playwright 默认输出目录，清除了该临时目录。逐项结果、时序、环境和错误分类保留在本记录及会话工具输出中；正式历史证据持久保存于 `docs/documentation/evidence/`。临时 smoke/时序脚本及探索性探针已删除，预览服务与浏览器已关闭；保留有真实失败证据的永久回归。

### 历史证据

- `accept:nuxt:batch --affected --plan` 确认仅 ConfigProvider、Locale 失效，有效数量暂从 43 降至 37。
- 默认 `diagnose:nuxt:batch config-provider locale` 完成准备复用，但其完整标题前缀锚定导致 No tests found。没有修改共享诊断脚本；使用相同 16 项标题的后缀匹配直接运行 Playwright，retries=0、max-failures=1，16 项全部通过。这些诊断不计入 accepted。
- `pnpm --filter @workspace/docs accept:nuxt:batch config-provider locale --affected`：正式 32 项双语/明暗/适用 RTL 矩阵全部通过，无重试或跳过；约 110 秒。resources/site/checks 均按内容哈希复用，运行前后重新核验输入，刷新两批 evidence 后覆盖数恢复为 748/859 映射、43 项有效严格验收。

## 未验证事项与剩余风险

- Feedback 七项仍未执行完整严格文档 React/Vue 双语明暗/RTL/交互矩阵及全量章节/API/迁移审阅，不新增 accepted；三组件默认场景的 15 项对照不能替代七项文档严格验收。
- REPL 的浏览器跨域自动聚焦限制、Emmet/Pug Web 提示保留记录；没有扩大到共享编辑器权限或浏览器行为修改。
- 默认诊断入口的标题前缀锚定问题未在本批修改，后续严格验收需留意；本次代表用例与正式矩阵均已实际执行，不以零用例结果计为通过。
- 没有执行全仓 `check:full`；没有提交或推送。没有新增第三方依赖或资产，静态产物归属与散列由既有流程刷新。

下一补齐批次：Notification 8 项，随后 Toast 9 项。严格验收下一批仍为 Divider 2 项。已映射待验收 705 项，待映射 111 项。

## 后续：将执行经验固化到项目流程

上文保留 Feedback 批次交付时的状态；其代码已提交为 `f1f0acb`。本次根据用户复盘要求调整流程与诊断工具，不继续补齐下一组件，也不修改组件实现。

- `AGENTS.md` 与项目 `ai-change-workflow` 技能明确要求：补齐线先做最简单和最高风险示例的双语预检，保留 SSR、退出动画、重开和受控 prop 增删条件；昂贵验证在修复稳定后集中执行，再跑已通过检查须先说明失效原因。
- `docs/documentation/workflow.md` 增加代表选择、分阶段验证表和烟测定位约束。先观察 DOM/ARIA/可点击区域及两层 iframe 视口，批量断言使用 Node + 锁定 Playwright，Monaco 与受控时钟分开运行；零用例不能当作通过。
- 烟测输出改约定到 `.data/documentation-smoke/<批次>/<运行标识>/`，直接 Playwright 运行显式使用独立输出目录。删除脚本、运行 clean 前分别检查证据保存和归档，避免再次丢失临时目录中的截图。
- 已修复上文提到的诊断标题锚定问题：匹配 Playwright 项目/文件/分组前缀之后的完整用例标题，保留正则转义、标题前的空白边界和结尾约束。新的回归在修复前失败，修复后诊断单测 4 项全部通过；真实 Playwright `--list` 发现的 16 项与逻辑选择集合精确一致，原诊断入口的单项 Chromium 用例也通过。
- 当前 `apps/docs/scripts` 整体参与六批证据指纹；本次没有修改输入集合、指纹算法或复用失效报告，而是将该影响写进流程并集中刷新受影响证据。
- 验证命令：`node --test apps/docs/scripts/documentation-diagnostics.test.mjs`；`pnpm --filter @workspace/docs diagnose:nuxt:batch config-provider --grep 'TimeZone zh-cn light$'`。首次准备因脚本输入变化自动重建，类型、内容、静态产物检查及诊断用例均通过。真实发现集合保存在 ignored 的 `apps/docs/.data/documentation-smoke/workflow-diagnostics/20260907-title-prefix/selection.json`。
- 最后一次执行 `pnpm --filter @workspace/docs accept:nuxt:batch --affected`：六批 224 项全部一次通过，无重试/跳过；正式阶段完整复用 resources/site/checks，未再构建站点，约 375 秒。六批 evidence 已按当前输入刷新，计数仍为 748/859 映射、43/859 有效严格验收；未新增 accepted，也未执行无关组件或全仓发布门禁。本次流程改进尚未提交。
