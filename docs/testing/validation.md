# 验证入口

选择能证明本次目标和影响的检查。通过且输入未变的证据直接复用；修复新失败后重跑受影响范围。组件单测、浏览器对照与真实安装包浏览器消费均在本地执行。发布候选才要求完整发布门禁。

| 变更或目标                       | 检查                                                                                                  |
| -------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 规则、普通文案、IDE 配置         | 受影响文件格式、链接、diff；配置需实际识别或启动                                                      |
| 局部组件修复                     | 对应类型与行为测试；视觉、焦点、Portal、拖拽、动效变化加对应 Chromium spec                            |
| 静态源码检查                     | `pnpm check:source`：工具链、固定基线、生成漂移、边界、格式、lint 与冷启动源码类型检查                |
| 发布源码检查                     | `pnpm check:publish-source`：仅检查公开包、发布工具与公开生成资产，不运行文档站                       |
| 日常本地源码集成                 | `pnpm check`：静态源码检查与 Vitest 单测                                                              |
| 静态组件文档                     | 格式、链接与公开契约核对；示例代码变化按实际行为选择类型或组件测试                                    |
| 文档示例梯次                     | 先定向 hydration 单测，再以 `DOCS_EXAMPLE_TIER=tN pnpm test:docs` 做一次生产构建与全部页面聚合巡检    |
| 公开 API、样式、依赖、构建链变化 | `pnpm check:artifacts`：构建、主题、SSR 与 Node tarball 消费；浏览器消费风险另跑 `pnpm test:consumer` |
| 共享行为全量回归或全仓审计       | `pnpm check:full`：check、artifacts、组件 Chromium 与真实安装包浏览器消费                             |
| 发布候选                         | `pnpm release:check`：Changesets、公开包源码、单测、产物、浏览器消费与发布元数据                      |

## 定向检查

- 单测使用 Vitest 与 Vue Test Utils，通过 `pnpm test:unit <受影响测试文件>` 定向运行；`pnpm test:unit:watch` 用于开发。
- `pnpm test:unit --project dom` 运行 jsdom 组件测试。`*.hydration.test.ts` 覆盖服务端 HTML 的客户端接管，`*.client.test.ts` 覆盖普通客户端挂载；两者均属于 dom project。
- `pnpm test:unit --project node` 运行 `*.ssr.test.ts`、纯工具与私有集成测试。SSR setup 明确拒绝 browser globals，不能用 DOM shim 代替无 DOM 导入和渲染验证。工具可按路径单独运行，例如 `pnpm test:unit scripts/theme-contracts.spec.mjs`。
- 组件浏览器规格在 `tests/browser/components/`，定向运行例如 `pnpm exec playwright test tests/browser/components/button.spec.ts`，全套使用 `pnpm test:browser`。默认由 Playwright `webServer` 构建固定 React 参考应用和 Storybook，再启动 preview；React 构建保留开发语义。默认完整 Chromium 新 headless、3 workers、0 retries。`pnpm test:browser:dev` 用于开发服务诊断，`--headed` 可观察窗口。来源与截图规则见[对照基础设施](react-vue-parity.md)。
- `pnpm test:consumer` 使用独立的 `playwright.consumer.config.ts` 验证真实 tarball 在浏览器中的消费行为，不依赖 Storybook 场景。
- 本地页面探索与调试使用项目 Playwright CLI skill 和 `pnpm playwright:cli`；CLI 操作记录不计作自动验收通过。
- 文档示例巡检使用 `DOCS_EXAMPLE_TIER=t1` 至 `t5` 选择梯次；默认 T3。每个路由是独立 Playwright 用例，失败在整轮结束后汇总，不使用 fail-fast。临时交互脚本先用 snapshot 或 `locator.count()` 确认目标，再执行 hover/click/wait；单个 locator 等待上限 5 秒，避免错误定位耗尽默认 30 秒。
- 覆盖率用 `pnpm test:coverage`（相对 origin/master 的变更）或 `pnpm test:coverage:all` 排查缺口。V8 报告映射自有 Vue/TypeScript 源码，不扫描 vendor，不统一强求 100%。

## 构建与证据复用

`typecheck` 检查当前 workspace；文档站会先通过 `prepare:packages` 重建五个公开包，再按真实 exports 检查类型。`typecheck:source`、`check:source` 与 `check` 均复用 `typecheck:clean`，先清理旧产物，避免本地残留的 `dist` 掩盖冷启动错误。

`build` 构建公开 JavaScript 包与主题；`pnpm dev` 启动 Storybook，`pnpm build:storybook` 单独构建场景站。浏览器测试自行管理所需参考服务，避免在同一验证链中重复准备产物。按需运行入口，不依次重复执行 check、artifacts、full、release。

文档梯次开发使用“定向 hydration 单测 → 一次生产构建与浏览器巡检”的顺序。首次准备或资源包变化运行 `pnpm docs:prepare`；仅 UI/主题变化运行 `pnpm docs:prepare:ui`，随后 `test:docs` 只构建文档应用，不重复构建所有公开包。生产环境只输出笼统 hydration 警告时，给同一次巡检增加 `DOCS_HYDRATION_DIAGNOSTICS=1`，构建会启用 Vue 的详细 mismatch 信息。

Nuxt 文档站、旧 Vue 工作台、逐示例批次、覆盖账本与正式文档证据协议已[退役](../documentation/README.md)。历史通过 Git 追溯，不恢复旧 accepted 数量；删除旧机制不能计作组件或示例通过。Rstest 配置、覆盖率补丁、旧 App 外壳测试及其专用 stubs、测试别名生成器均已移除。

主题与安装包断言共用 `scripts/theme-contracts.json`；SCSS 导入顺序由主题检查验证。产物 SSR 按 exports 枚举公开 JavaScript 入口，缺失产物不能跳过。

## 隔离安装与 CI

日常 tarball 检查复用已安装外部依赖以支持离线运行。`pnpm verify:pack-isolated` 或 `PACK_ISOLATED=1 pnpm check:artifacts` 使用临时 store、官方 registry 与严格 peer 校验，不链接 workspace 运行时依赖；它验证消费，不发布包。离线通过不能称为隔离安装通过。

PR CI 保留全仓 `check:source`、Changesets 意图检查与按影响执行的 Node 产物验证；发布流水线使用 `check:publish-source`，文档站不会阻塞 npm 发布。CI 不自动运行组件单测、Storybook 交互、组件浏览器或 consumer 浏览器测试。发布时验证准确的 pack artifact 后交给 publish，详见[发布手册](../releasing.md)。CI 通过不能代替所需本地组件结果。

新测试体系已实施并完成本次迁移验证。单测、覆盖率、浏览器、consumer 与故障注入证据及其适用边界见[迁移方案](vue-testing-strategy-proposal.md#当前验证状态)；后续变更应按实际影响重新选择检查范围，未运行的检查不得计为通过。
