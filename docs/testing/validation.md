# 验证入口

选择能证明本次目标和影响的检查。通过且输入未变的证据直接复用；修复新失败后重跑受影响范围。发布候选才要求完整发布门禁。

| 变更或目标                       | 检查                                                                                |
| -------------------------------- | ----------------------------------------------------------------------------------- |
| 规则、普通文案、IDE 配置         | 受影响文件格式、链接、diff；配置需实际识别/启动                                     |
| 局部组件修复                     | 对应类型/行为测试；视觉、焦点、Portal、拖拽、动效变化加对应 Chromium spec           |
| 日常源码集成                     | `pnpm check`：工具链、固定基线、生成漂移、边界、格式/lint、源码类型、单测与工具测试 |
| 文档内容或构建输入               | `pnpm check:docs`：资源、静态站、Nuxt 类型、内容与产物                              |
| 文档示例验收                     | [文档流程](../documentation/workflow.md)中的选定批次；普通补齐不自动升级为严格验收  |
| 公开 API、样式、依赖、构建链变化 | `pnpm check:artifacts`：构建、主题、SSR、真实 tarball 消费                          |
| 共享行为全量回归或全仓审计       | `pnpm check:full`：check、artifacts、组件和文档 Chromium                            |
| 发布候选                         | `pnpm release:check`：Changesets 集成、生产依赖审计、全量回归、隔离安装、发布元数据 |

## 定向检查

- 单测使用 Rstest，通过 `pnpm test:unit <受影响测试文件>` 定向运行。
- 组件浏览器规格在 `tests/browser/components/`，例如 `pnpm exec playwright test tests/browser/components/button.spec.ts`。运行模式与截图规则见[对照基础设施](react-vue-parity.md)。
- 文档工具修改运行 `pnpm test:tooling` 和对应 spec；只改日志/计时/筛选时用工具测试或 `--list`，不因此重跑页面矩阵。改变断言、环境或构建内容时才重验相应行为。
- 文档开发更新链路用 `pnpm --filter @workspace/docs test:dev`；它会临时修改并恢复 Demo/正文，使用独立端口 4332，不替代静态站验收。
- 已构建站点链接审计用 `pnpm --filter @workspace/docs check:links`。当前验收进度用覆盖工具核验，不把旧报告的通过状态当作当前证据。
- 覆盖率用 `pnpm test:coverage`（相对 origin/master 的变更）或 `pnpm test:coverage:all` 排查缺口，不统一强求 100%。

## 构建与证据复用

`check` 不含 Nuxt 类型或生产构建。独立 `typecheck` 会准备整个 workspace；`typecheck:source` 排除文档。仅缓存故障或干净构建验证使用 `typecheck:clean`，它会清理临时证据。

`build` 复用文档资源、站点和检查阶段，再构建两个工作台。准备缓存核对输入和输出内容；`check:full` 复用已准备的文档站，独立 `test:browser:docs` 自行准备。按需运行对应入口，避免依次重复执行 check、artifacts、full、release。

文档历史证据随真实依赖失效；保持旧报告和指纹，如实报告失效范围。普通修复或新批次任务不隐式承担恢复全部历史 accepted；要求恢复或发布时再完成相应完整矩阵。

主题与安装包断言共用 `scripts/theme-contracts.json`；SCSS 导入顺序由主题检查验证。SSR 按 exports 枚举公开 JavaScript 入口，缺失产物不能跳过。

## 隔离安装与 CI

日常 tarball 检查复用已安装外部依赖以支持离线运行。`pnpm verify:pack-isolated` 或 `PACK_ISOLATED=1 pnpm check:artifacts` 使用临时 store、官方 registry 与严格 peer 校验，不链接 workspace 运行时依赖；它验证消费，不发布包。离线通过不能称为隔离安装通过。

PR CI 执行源码检查、Changesets 意图检查，并按影响执行产物检查。发布时验证准确的 pack artifact 后交给 publish，详见[发布手册](../releasing.md)。Rstest 仅承担源码单测，浏览器仍用 Playwright；迁移背景与能力缺口见 [Rstack 记录](../../ai-work/20260910-103000-rstack-migration.md)。
