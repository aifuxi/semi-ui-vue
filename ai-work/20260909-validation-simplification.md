# 验证与协作规则精简

- 日期：2026-09-09
- 状态：完成；隔离安装检出既有发布阻塞

## 目标与范围

用户批准只读审计后的精简建议。减少重复构建、覆盖率指标和重复断言的维护成本，保留组件公开行为、视觉阈值及发布包保障。不修改组件运行时，不发布包。

## 决策

- 日常 check 不再 clean、生成文档或安装 tarball；check:artifacts 和 release:check 保留完整产物门禁。文档缓存作为公开资源准备的唯一入口，check:full 不重复构建文档。
- 覆盖率保留为报告，移除四项每文件 100% 阻断及整个豁免机制。关键行为继续由现有单测和浏览器测试验证。
- 使用一次性 AST 提取核对原主题和安装包的 892 次 CSS 包含断言，合并成 84 个文件的 543 项共享契约；SCSS 来源与顺序检查保留。缺失 CSS 或选择器有负向测试。
- SSR 由 exports 枚举，包含通配入口。依赖版本留在 manifest/lockfile，边界检查保留私有层、React 和内部依赖方向限制。
- 文档批次显式追踪产物与正式验收依赖，排除诊断工具与工具测试。旧 evidence 不改写；本任务不恢复历史 accepted，刷新账本如实显示失效。
- 发布隔离安装不使用 workspace runtime 链接，保留默认离线模式支持日常验证。外部操作仅下载依赖，不发布。
- AGENTS 保留日常核心规则，组件完整验收细节按需读取；移除确定次数的返工记账要求和“单独通过必为 spec 缺陷”的归因。
- 历史视觉快照及矩阵不在本轮删除；需要实际耗时、失败记录后再决定。

## 验证

- `pnpm check`：最终退出码 0，包含格式、lint、源码类型、178 个 Vitest 文件的 1218 项测试，以及 68+6 项 Node 工具测试。首次 IDE 调用未回传退出码，最终从 CLI 取得完整退出结果。
- 新增 CSS 缺失、公开入口空匹配、依赖方向与 vendor 越界负向测试通过；新批次输入测试确认诊断脚本与测试被排除，实际准备/验收脚本仍参与指纹。
- `PACK_ISOLATED=1 pnpm check:artifacts`：公开包/主题、文档、两个工作台构建及文档类型/内容/产物检查通过；主题 86 个根入口通过，SSR 枚举 icons 525、icons-lab 86、illustrations 18、UI 151 个公开入口。最后在隔离安装阶段退出 1，原因见下节。
- `pnpm verify:pack-dist`：退出码 0，真实 tarball 离线安装、exports、类型、CSS、SSR 与 Chromium 中的 JsonViewer Worker 搜索替换均通过。
- 再次执行 `pnpm check:docs`：退出码 0，resources/site/checks 全部命中缓存，新鲜度校验约 0.3/0.3/0.2 秒，没有重复构建；198 页、859 个 Demo 映射，当前有效严格验收为 0。未改写旧 evidence。
- `DOCS_PORT=4322 DOCS_ACCEPTANCE=1 pnpm --filter @workspace/docs test:nuxt portal.spec.ts --grep-invert '页面与示例可加载' --reporter=line --output=test-results/validation-simplification`：6/6 通过，6.5 秒，覆盖导航/搜索/主题、SSR 正文、编辑运行、历史地址、加载预算与焦点。保留用户原有 4321 预览服务，测试服务正常退出。
- 两个 GitHub workflow 的 YAML 解析通过；未在 GitHub 上触发 CI 或发布。
- IDE 对 verify-pack 的未修改内嵌 TypeScript 模板给出 4 项诊断；真实消费者 TypeScript 编译通过。后续 IDE 无响应时改用 CLI，不把 IDE 诊断宣称为全绿。
- 未执行全量 Chromium 矩阵、依赖安全审计或发布；没有组件运行时与视觉算法修改。

## 已发现的范围外问题

对修改前已有静态站运行 verify-static.mjs，发现多个历史锚点缺失。将其接为 check:links 诊断入口，未将既有问题伪装为通过，也未扩大到无关文档修复。

严格隔离安装从官方 registry 下载依赖后报告 `ERR_PNPM_PEER_DEP_ISSUES`：UI 固定的 `@tiptap/core`、`@tiptap/pm`、`@tiptap/extensions` 为 3.10.7，但部分传递扩展（例如 extension-list、extension-bubble-menu）解析到 3.31.3 并要求对应 3.31.3 peer。旧离线链接路径无法发现此问题。新 `release:check` 和发布 job 保留严格检查，会阻止该状态下的发布；本次没有通过关闭 peer 校验或添加消费者 overrides 掩盖它，也没有扩展到组件依赖升级。后续需单独修复发布包的依赖解析，再运行隔离安装。

## 回退

本次变更独立提交，可整体 revert；旧证据文件未修改，回退指纹输入后由正常新鲜度规则判断其有效性。
