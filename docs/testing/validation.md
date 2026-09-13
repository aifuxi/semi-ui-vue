# 验证入口

选择能证明本次目标和影响的检查。通过且输入未变的证据直接复用；修复新失败后重跑受影响范围。组件单测、浏览器对照与真实安装包浏览器消费均在本地执行。发布候选才要求完整发布门禁。

| 变更或目标                       | 检查                                                                                                  |
| -------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 规则、普通文案、IDE 配置         | 受影响文件格式、链接、diff；配置需实际识别或启动                                                      |
| 局部组件修复                     | 对应类型与行为测试；视觉、焦点、Portal、拖拽、动效变化加对应 Chromium spec                            |
| 静态源码检查                     | `pnpm check:source`：工具链、固定基线、生成漂移、边界、格式、lint 与源码类型                          |
| 日常本地源码集成                 | `pnpm check`：静态源码检查与 Vitest 单测                                                              |
| 静态组件文档                     | 格式、链接与公开契约核对；示例代码变化按实际行为选择类型或组件测试                                    |
| 公开 API、样式、依赖、构建链变化 | `pnpm check:artifacts`：构建、主题、SSR 与 Node tarball 消费；浏览器消费风险另跑 `pnpm test:consumer` |
| 共享行为全量回归或全仓审计       | `pnpm check:full`：check、artifacts、组件 Chromium 与真实安装包浏览器消费                             |
| 发布候选                         | `pnpm release:check`：Changesets 集成、生产依赖审计、完整本地回归、隔离安装与发布元数据               |

## 定向检查

- 单测使用 Vitest 与 Vue Test Utils，通过 `pnpm test:unit <受影响测试文件>` 定向运行；`pnpm test:unit:watch` 用于开发。
- `pnpm test:unit --project dom` 运行 jsdom 组件测试。`*.hydration.test.ts` 覆盖服务端 HTML 的客户端接管，`*.client.test.ts` 覆盖普通客户端挂载；两者均属于 dom project。
- `pnpm test:unit --project node` 运行 `*.ssr.test.ts`、纯工具与私有集成测试。SSR setup 明确拒绝 browser globals，不能用 DOM shim 代替无 DOM 导入和渲染验证。工具可按路径单独运行，例如 `pnpm test:unit scripts/theme-contracts.spec.mjs`。
- 组件浏览器规格在 `tests/browser/components/`，定向运行例如 `pnpm exec playwright test tests/browser/components/button.spec.ts`，全套使用 `pnpm test:browser`。默认由 Playwright `webServer` 构建固定 React 参考应用和 Storybook，再启动 preview；React 构建保留开发语义。默认完整 Chromium 新 headless、3 workers、0 retries。`pnpm test:browser:dev` 用于开发服务诊断，`--headed` 可观察窗口。来源与截图规则见[对照基础设施](react-vue-parity.md)。
- `pnpm test:consumer` 使用独立的 `playwright.consumer.config.ts` 验证真实 tarball 在浏览器中的消费行为，不依赖 Storybook 场景。
- 本地页面探索与调试使用项目 Playwright CLI skill 和 `pnpm playwright:cli`；CLI 操作记录不计作自动验收通过。
- 覆盖率用 `pnpm test:coverage`（相对 origin/master 的变更）或 `pnpm test:coverage:all` 排查缺口。V8 报告映射自有 Vue/TypeScript 源码，不扫描 vendor，不统一强求 100%。

## 构建与证据复用

`check:source` 与 `check` 均不含生产构建。`typecheck` 与 `typecheck:source` 检查当前 workspace 源码；仅缓存故障或干净构建验证使用 `typecheck:clean`。

`build` 构建公开 JavaScript 包与主题；`pnpm dev` 启动 Storybook，`pnpm build:storybook` 单独构建场景站。浏览器测试自行管理所需参考服务，避免在同一验证链中重复准备产物。按需运行入口，不依次重复执行 check、artifacts、full、release。

Nuxt 文档站、旧 Vue 工作台、逐示例批次、覆盖账本与正式文档证据协议已[退役](../documentation/README.md)。历史通过 Git 追溯，不恢复旧 accepted 数量；删除旧机制不能计作组件或示例通过。Rstest 配置、覆盖率补丁、旧 App 外壳测试及其专用 stubs、测试别名生成器均已移除。

主题与安装包断言共用 `scripts/theme-contracts.json`；SCSS 导入顺序由主题检查验证。产物 SSR 按 exports 枚举公开 JavaScript 入口，缺失产物不能跳过。

## 隔离安装与 CI

日常 tarball 检查复用已安装外部依赖以支持离线运行。`pnpm verify:pack-isolated` 或 `PACK_ISOLATED=1 pnpm check:artifacts` 使用临时 store、官方 registry 与严格 peer 校验，不链接 workspace 运行时依赖；它验证消费，不发布包。离线通过不能称为隔离安装通过。

CI 保留 `check:source`、Changesets 意图检查、按影响执行的 Node 产物验证与发布职责，不自动运行组件单测、Storybook 交互、组件浏览器或 consumer 浏览器测试。发布时验证准确的 pack artifact 后交给 publish，详见[发布手册](../releasing.md)。CI 通过不能代替所需本地组件结果。

新测试体系已实施并完成本次迁移验证。单测、覆盖率、浏览器、consumer 与故障注入证据及其适用边界见[迁移方案](vue-testing-strategy-proposal.md#当前验证状态)；后续变更应按实际影响重新选择检查范围，未运行的检查不得计为通过。
