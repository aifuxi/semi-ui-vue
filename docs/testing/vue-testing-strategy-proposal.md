# Vue 测试体系迁移方案

状态：Vitest、Storybook 与本地 Playwright 测试体系已实施并通过本次迁移验证，2026-09-13。组件库尚未正式发布；旧内部工具、命令、配置和测试组织已按目标职责替换或删除。工具切换不代表全部组件已完成与固定 Semi 的对齐验收。

## 选型与依据

当前测试栈为 **Vitest + Vue Test Utils + jsdom / Node，Storybook Vue 3 + Vite，Playwright Test**。Vue props、emits、slots、v-model 与生命周期使用框架原生工具验证；固定 Semi 的公开行为决定测试输入和预期，React 的 Jest/Enzyme 调用方式不作为 Vue 实现要求。

Vue 官方推荐 Vitest 和 Vue Test Utils；Element Plus、Naive UI 也采用这一组合。这是生态集成依据，不代表这些组件库的行为可以替代 Semi 基线。[Vue 测试指南](https://vuejs.org/guide/scaling-up/testing.html)、[Element Plus 配置](https://github.com/element-plus/element-plus/blob/dev/vitest.config.mts)、[Naive UI 配置](https://github.com/tusen-ai/naive-ui/blob/main/vite.config.mts)。

本次锁定 Vitest 与 coverage-v8 5.0.0、Vite 8.2.2、Vue 插件 6.0.8、Storybook Vue 3/Vite 10.6.0，继续使用 Vue 3.5.41、Vue Test Utils 2.4.11 与 Playwright 1.62.1。版本和 peer 关系由 workspace manifests 与统一 lockfile 管理。

Storybook 负责场景组织和调试，浏览器断言统一使用 Playwright Test；未引入 Storybook test-runner、addon-vitest、Cypress 或额外组件挂载运行时。[Storybook Vue 集成](https://storybook.js.org/docs/get-started/frameworks/vue3-vite)。

选择 Vitest 的理由是生态集成、配置与维护成本。历史同环境单次记录为 Vitest 51.67 秒、Rstest 35.1 秒，不能据 runner 替换承诺提速；旧记录与本次拆分后的测试范围也不能直接比较。[历史迁移记录](../../ai-work/20260910-103000-rstack-migration.md#第四阶段单测迁移到-rstest)。

## 已实施的分层

| 层次           | 工具与载体                                                              | 核心职责                                                             |
| -------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------- |
| 源码与类型     | TypeScript、vue-tsc、ESLint；`check:source`                             | 公开类型、exports、源码质量、生成漂移与私有集成边界                  |
| DOM 组件       | Vitest dom project、Vue Test Utils、jsdom                               | props、emits、slots、v-model、受控更新、事件顺序、异步完成与卸载清理 |
| SSR 与纯工具   | Vitest node project                                                     | 无 DOM 源码导入与渲染、工具逻辑、私有集成协议                        |
| 组件浏览器对照 | Storybook Vue 场景、固定 React 参考应用、Playwright Test                | 真实焦点、Portal、几何、主题、RTL、语言、拖拽、滚动、动效与关键像素  |
| 静态组件文档   | 仓库 Markdown 与公开类型                                                | API、使用与迁移说明的准确性                                          |
| 发布消费       | Node SSR、主题、tarball 与隔离安装检查；独立 Playwright consumer config | 实际 exports/CSS、无 DOM 导入、真实安装包浏览器行为与发布包完整性    |

`vitest.config.ts` 使用 dom/node projects。原先混合的 SSR 与客户端用例已拆分：`*.ssr.test.ts` 在真实 Node 环境执行，setup 拒绝 `window` 或 `document`；`*.hydration.test.ts` 在 jsdom 中接管服务端 HTML；只做普通 mount 的用例使用 `*.client.test.ts` 或普通组件测试文件，不把它们称为 hydration 验证。DOM setup 统一启用 Vue Test Utils 自动卸载。独立纯 SSR 用例也已从普通组件、图标与插画测试移入 Node。

Rstest runner/API、配置与 Vue 覆盖率补丁已移除。旧 React/Vue App 外壳专用测试、React 专用 stubs 和测试 alias 生成器已删除；必要源码 aliases 直接声明在 Vitest 配置中。Foundation 继续经私有集成边界访问只读 vendor；SFC 使用 Vue/Vite 编译，Prism 加载顺序和 JSON Worker 适配复用私有集成模块。测试环境替身仅用于相应单测，不能作为浏览器运行真实参考组件的证据。

旧 Vue 对照工作台由 `apps/storybook-vue` 替代，有价值的组件场景继续按公开契约组织。固定 React 参考应用保留运行真实 vendor 的能力。React/Vue 共享场景数据与结果语义，分别使用框架原生渲染和事件适配。来源核验需确认 React 运行固定源码、Vue 运行公开组件，不能以版本文字、镜像 DOM 或历史图片代替。

Playwright 使用标准 projects、fixtures、webServer 和 reporter；项目保留必要来源核验及差异比较。Nuxt 文档站、旧逐示例验收、分片认证报告与自建调度入口已经退役，不再建立兼容包装或替代站点。

普通逻辑在单测层系统覆盖，真实浏览器独有风险在浏览器验证。一个交互链有明确的主要测试位置，只有不同入口带来独立故障面时才重复深测。jsdom 通过不能证明布局正确，场景页面能加载也不能证明交互正确。

## 本地执行与 CI 职责

组件测试全部在本地执行，浏览器默认完整 Chromium 新 headless（`channel: 'chromium'`、`headless: true`）、3 workers、0 retries。需要观察页面时临时使用 `--headed`；探索与调试使用项目 Playwright CLI skill 和 `pnpm playwright:cli`，CLI 操作记录不计为自动验收结果。

| 入口                                | 职责                                                                          |
| ----------------------------------- | ----------------------------------------------------------------------------- |
| `pnpm dev` / `pnpm build:storybook` | 启动或构建 Storybook Vue 场景站                                               |
| `pnpm test:unit [文件]`             | 运行 Vitest，可用 `--project dom` 或 `--project node` 筛选环境                |
| `pnpm test:browser`                 | 标准 webServer 构建 React 与 Storybook 后启动 preview；React 构建保留开发语义 |
| `pnpm exec playwright test <spec>`  | 按明确文件路径定向运行组件浏览器测试                                          |
| `pnpm test:browser:dev`             | 使用开发服务进行浏览器诊断                                                    |
| `pnpm test:consumer`                | 独立 `playwright.consumer.config.ts` 验证真实 tarball 浏览器消费              |
| `pnpm check:source`                 | 静态源码与类型检查                                                            |
| `pnpm check`                        | check:source 与源码单测                                                       |
| `pnpm check:artifacts`              | 公开产物构建、主题、Node SSR 与 Node tarball 消费检查                         |
| `pnpm check:full`                   | check、artifacts、组件浏览器与 consumer 浏览器检查                            |

CI 已移除组件单测、Storybook 交互、组件 Playwright 与 consumer 浏览器测试的自动调用，保留静态 `check:source`、Changesets 意图检查、Node 产物验证及发布职责。本地完整发布检查仍包含组件与 consumer 回归，CI 通过不能替代这些本地结果。范围选择与隔离安装方式见[验证入口](validation.md)。

按明确路径、公共入口和既有依赖关系选择受影响范围，通过 runner 的文件筛选与 projects 执行；不新增选测平台，也不能仅凭 Git 文件名或静态导入排除动态依赖。主题、公共配置、构建配置与 lockfile 变化影响不明确时，保守运行完整相关套件。共享服务和产物由一个执行者准备，避免重复启动与构建。

## 固定基线与质量边界

唯一行为基线仍为只读 `vendor/semi-design`：`v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。Vue 生态资料仅用于工具选择。上游测试、Adapter、Foundation、样式和文档共同定义契约，上游没有测试的公开行为不能因此豁免。

以公开契约判断测试价值，不要求旧用例名称、数量或矩阵逐项保留；必要状态、主题、方向、语言与运行环境的有效覆盖仍需说明并验证。语言会影响布局和可访问名称，dark/RTL 会影响样式，不能机械裁剪。Modal/Select 的容器、Portal 与焦点契约不能因旧承载页面删除而豁免。普通 List 与虚拟滚动 List 按实际能力分别验证；工具迁移不消除既有虚拟化、拖拽等功能缺口，也不改变未通过组件的状态。

视觉门槛需用稳定环境中的正常波动与已知回归验证，不能通过扩大容差、重试或改旧指纹消除失败。历史宿主快照与实时 React/Vue 对照各有用途，不能互相替代。[组件契约](component-contract.md#浏览器验收门槛)、[Playwright 视觉比较](https://playwright.dev/docs/test-snapshots)。

测试结果记录实际源码状态、固定 vendor revision、环境与执行范围，标准日志和诊断附件保存在本地已忽略目录或 CI artifacts，现行快照基线继续跟踪。输入未变且仍有效的证据可以复用；输入变化后重跑受影响范围。未运行、失败、跳过或 flaky 不计通过。旧 accepted 协议及原始附件不恢复，删除旧机制不会增加验收数量。

## 当前验证状态

完整 `pnpm test:coverage:all` 已通过：224 个测试文件、1187 个测试，退出码 0。该结果覆盖当前源码单测、Node SSR 与工具契约，不代表全部 Semi 公开能力验收完成。

全量 V8 覆盖率为语句 82.73%、分支 73.34%、函数 75.17%、行 84.22%。报告映射 1273 个自有源码文件，其中 245 个 Vue 文件，无 vendor、虚拟模块或包外路径。

组件浏览器的 444 项均已有有效通过证据：全量运行通过 440 项，另外 4 项确认是旧宿主变化后，精确校准 8 张图片；受影响三个组件的 17 项测试随后在正常快照模式下全部通过。阈值、行为与实时两端对照均保留，校准依据见[截图说明](react-vue-parity.md#截图与跨平台)。开发模式的 Switch 与工作区 8 项测试也通过，CLI 已实际打开 Storybook 并完成开关交互。

静态检查、全工作区类型检查、公开包构建、主题、无 DOM SSR、隔离 tarball 的 Node 消费与 tree-shaking 通过；真实隔离 tarball 的 consumer 浏览器正例 1 项通过，Changesets 集成 7 项及发布身份检查通过。浏览器使用 Playwright 1.62.1 / Chrome for Testing 151.0.7922.34、macOS arm64、新 headless，未启用重试。此次未执行发布、远端 CI 或其它操作系统的浏览器矩阵。

通过本地可丢弃 Vite 插件，仅在测试进程中把 Button 的 `aria-disabled` 强制改为 `false`，原禁用态测试准确失败并定位到 ARIA 断言。共享浏览器断言已验证能拒绝外框不变的内部 1px 位移及几何不变的颜色变化；来源插件包含错误来源负例。真实 tarball 的临时 Worker 启动失败注入被现有错误收集链捕获；临时探针已删除，真实组件源码未修改。这些证据仅证明对应检查能发现所注入的回归。

日志、覆盖率和失败诊断保存在本地已忽略目录；只提交正式测试继续使用的快照。既有组件缺口与发布剩余工作保持原契约记录，工具迁移本身不改变组件 ready 状态。

## 完成条件与成本验证

交付必须满足：目标所需能力完整、必要契约和环境有有效覆盖、相关入口实际可运行，剩余缺口如实记录。发布候选另按发布手册执行完整本地回归与产物门禁。使用标准报告，不增加验收数量账本或新的认证协议。

本次尚无同环境、同覆盖范围的迁移前后效率对照。冷/热运行耗时、构建次数、报告体积、失败定位及修复成本需要后续实测；不能把用例拆分后的数量、单次运行时长或覆盖率百分比当作提速结论，不承诺节省比例、完成时长或 token 数。
