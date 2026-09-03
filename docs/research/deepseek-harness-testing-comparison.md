# deepseek-harness 测试方案对比调研

调研日期：2026-09-04

对比对象：`deepseek-ai/deepseek-harness`（DeepSeek 官方 coding agent `dsh`，monorepo，约 50 个包）与本项目 `semi-ui-vue`（Semi Design v2.102.0 的 Vue 复刻）。

> deepseek-harness 分析基于当日浅克隆（`/tmp/deepseek-harness`，main 分支）；本项目分析基于工作区当前状态。两仓库解决的问题类别不同：前者是**非确定性 agent 产品**（LLM 在环、多进程、多平台），后者是**有固定参考实现的确定性 UI 库**。结论必须放在这个前提下读。

## 结论（先说判断）

1. **核心正确性策略上，本项目更强。** 本项目的 React/Vue 同上下文 parity 对照拥有外部固定 oracle（只读 vendor v2.102.0）加精确数值门槛（computed style 逐项相等、rect ≤ 0.5px、像素差 ≤ 0.1%），直接度量"等价性"这一目标属性。deepseek-harness 没有可对照的参考实现，只能靠录制会话快照（record/replay/refresh）合成 oracle——这是它面对非确定性的必要发明，不是更优的通用方案。
2. **工程过程成熟度上，deepseek-harness 明显更强。** 它有 per-file 100% 覆盖率门禁（带文档化豁免清单）、PR 级 9+ job 多平台 CI（含 failover、Node 兼容矩阵、Wine/Windows lane）、显式 flake 教条。本项目当前**没有 PR 级 CI、没有覆盖率门槛**，这是两个最实际的差距。
3. **总体判断：两者都不全面占优。** 抽象地比"测试体系完整度"，deepseek-harness 更好；比"针对各自问题类别的验证策略设计"，本项目的 parity harness 是更锋利的工具。对本项目最有价值的动作不是照搬它的快照机制，而是补上它代表的过程纪律：PR 级 CI + per-file 覆盖率门禁。

## deepseek-harness 测试选型与方案

### 项目背景

`@deepseek-ai/dsh-root` v0.1.2-rc.1，pnpm 11.7 workspace（`vendor/*`、`packages/*/*`、`native/landlock-run`、`apps/*`、`website`）。产品是 coding agent：CLI（`dsh`）、Web GUI、TypeScript/Python 双 SDK、ACP 协议。Node engines `^22.19 || >=24`，TypeScript ^6，vitest ^4.1.8。

### 测试分层（`docs/testing.md`）

| 层 | 命令 | 内容 |
| --- | --- | --- |
| Unit | `pnpm run test` | vitest 跑各包 `tests/**` + `scripts/**/*.spec.ts`；测试与被测代码同区存放 |
| Coverage gate | `pnpm run test:coverage` | **门禁运行**：`packages/*/*/src` per-file 100%（statements/branches/functions/lines） |
| Real-API e2e | `pnpm run test:e2e` | 带 key 打真实 provider API；无 key 自跳过，keyless CI 保持绿 |
| Expected output | `pnpm run test:expected` | keyless 的 CLI/进程期望输出（`*.expected.e2e.ts` + `tests/expected/`） |
| Session snapshot | `pnpm run test:snapshot` | 录制会话回放：record（调真实 API）/ replay（keyless，CI 默认）/ refresh（重写期望输出） |
| Web browser snapshot | `pnpm run test:web` | Chromium 对比会话驱动输出与 UI-only 输出；CI 强制 `DSH_SNAPSHOT=replay`，只读 |

另有 opt-in 的 `test:web:perf`、`test:web:stress`（600s 超时，纯本地性能 lane）。

### Runner 与配置选型

- **单一 runner：vitest**，7 个配置文件按 lane 切分（`vitest.config.ts` / `e2e` / `expected` / `snapshot` / `web` / `web.perf` / `web-stress`）+ 共享的 `vitest.shared.ts`（标准装饰器 pre-transform 插件、`--no-webstorage` execArgv）。
- **浏览器测试不用 `@playwright/test` runner**：web lane 在 vitest 内以库形式 `chromium.launch()`（`apps/web/tests/*.e2e.ts`），与快照系统深度集成，但放弃了 Playwright runner 的 webServer/retry/trace 等工程化能力。
- **pool: forks**（两个 project：`thread-safe` + `process-bound`）——注释明确是规避 Node 24 worker thread 在 CJS lexer 的 v8 abort。
- **Python SDK**：pytest（`python/sdk/tests`，7 个文件），CI 用 `uv run --group test pytest`。
- **规模**：1074 个 TS 测试文件（spec/e2e/snapshot），136 个 `snapshot.yml` 录制场景，7 个 Python 测试文件。

### 覆盖率门禁（其最强特征）

- v8 provider，`include: packages/*/*/src/**/*.{ts,tsx}`，阈值 `perFile: true` + 四项 100%。注释："100% or it doesn't merge"，per-file 防止大文件补贴裸文件。
- **豁免清单即债务台账**：GUI debt（client 组件）、worker thread 运行时、Windows-only 包、pwsh 依赖文件等，每条带 TODO 与理由；`v8 ignore` 注释必须携带原因。
- **CI 分区执行**：`DSH_COVERAGE_PARTITIONS=4` + 时长历史缓存（`.coverage-times.json` 走 GitHub cache，按实测时长加权分区）；豁免的重套件以未插桩方式并行跑（`COVERAGE_EXEMPT_ENV`，值非 `'1'` 直接抛错——"配置错误不是静默 no-op"）。
- 自定义 CJS reporter 打印每个未覆盖 statement/branch/function 的精确 `path:line:col`（内置阈值报错只给文件名）。

### 核心机制：session snapshot（`packages/test-support/session-snapshot`）

- 每个场景目录携带**封闭的 `snapshot.yml` manifest** + `session.jsonl`（含子会话日志）；manifest 声明 profile、composition/header class、录制来源、回放/平台/workspace 事实。
- **record / replay / refresh 三态**（`DSH_SNAPSHOT` env）：record 调真实 LLM 重写录制 fixture；replay keyless，用 `dsh-llm-replay` 回放录制的模型流；refresh keyless 重写期望输出。CI 只跑 replay，record/refresh 留在本地且 diff 必须人工 review。
- fixture 保留 header/payload，省略 seq/time 信封（回放时合成）；路径归一化 + request header 脱敏；typed token 保持父子身份关系。
- **验证世界而非自报**：e2e 断言外部重跑命令/重读文件，未触碰文件必须字节一致；"keyword probe on the agent's own output lets a cheating agent pass"。
- 配套 test-support 包：`llm-replay`、`llm-mock-server`、`loader-smoke`、`client-runtime`、`agent-loop-testkit`。

### 测试政策（docs/testing.md 要点）

- **with-key policy**："We are DeepSeek — do not ration real-API tests"。无 key 测试只证明管道，带 key 才证明 agent 对真实模型可用；最高价值是启动已发布 profile、发一个 prompt、检查世界的 smoke 测试（引用 postmortem：单测全绿但产品坏了）。
- **真实实现优先于 mock**：只 mock 昂贵或非确定性边界（LLM adapter、网络、时钟），下游全部真实。
- **测真实入口路径**：包 `bin` 必须跑构建产物 `lib/bin.js`（plain node），暴露 tsx 掩盖的 settle race/模块解析问题。
- **测试解析只走 source plane**：所有 vitest 配置用 vite-tsconfig-paths 指向 `tsconfig.base.json`，bare import 解析到 `src`，绝不经过 package exports 到构建产物（避免模块单例双拷贝）。
- **快照强制**：每个非平凡的 model/protocol/人可见变更必须在同一 PR 更新 keyless 录制会话场景。
- **flake 教条**："一个只在单独运行时通过的 spec 是 spec 的缺陷，不是 runner 不稳定"；配套 flake 诊断 workflow（`.agents/skills/dsh-ci-test-reliability`）。

### CI（GitHub Actions `ci.yml`，PR 触发）

9+ job：node-24 static / coverage（分区）/ consumers+snapshots+artifacts；node-compat 矩阵（22.19 / 24.9 / 26，独立 hosted job）；python-sdk（uv+pytest 3.10）；python-runtime（reusable workflow，4 个原生目标：linux-x64/arm64、macos-arm64、win-x64）；windows wine blocking（Linux 上跑 Wine，apt deb 缓存）；windows-native build / coverage / tests / observational（后者 `continue-on-error`）。

工程细节：企业 16-core runner + **repo variable failover**（`DSH_CI_FAILOVER_LINUX/WINDOWS` 切自托管池，重跑即切换）；`all-checks-passed` 聚合 job（`if: always()`，failure/cancelled/skipped 都算失败——"GitHub 把 skipped 的 required check 当通过"）；concurrency cancel-in-progress；pnpm store / Playwright cache restore（PR 只读，master 保存）；`DSH_GATE_FAIL_FAST=1` 让失败 gate 中止兄弟 gate。另有 `ci-master.yml`、独立 e2e/sandbox/release workflow，`.gitlab-ci.yml` 管 Python wheel 发布。

本地钩子（lefthook）：pre-commit 跑 staged lint（--fix）、翻译配对、第三方声明再生成；pre-push 只跑 typecheck——"本地检查点保持快，CI 拥有全量矩阵"。

其他：fast-check（property-based）、@testing-library/react + jsdom（client 组件单测）、jscpd 重复度检查、oxlint。

## 本项目（semi-ui-vue）测试选型与方案

### 项目背景

pnpm 11.19 workspace：`packages/ui`、`icons`、`icons-lab`、`illustrations`、`theme-default`（公开）+ `foundation-integration`、`test-infra`（私有）；`apps/docs`、`parity-vue`、`reference-react`；只读 submodule `vendor/semi-design` 固定 v2.102.0（`cdfba6e5`）。Node `^20.19 || ^22.13 || ^24`，vitest 4.1.11，Playwright 1.62.1。

### 单元测试层（vitest + jsdom）

- vitest 4.1.11 + jsdom 26 + @vue/test-utils 2.4；include 覆盖 `scripts/**`、`packages/*/src/**`、三个 app 的 src；exclude `vendor/**`、`dist`、`tests/browser/**`。
- **162 个测试文件，约 1097 个 test/it**；每个组件配 `*.test.ts`（行为黑盒：DOM/class/ARIA/受控非受控）+ `*.ssr.test.ts`（@vue/server-renderer 的 render/hydration）。
- vitest 配置含一张 327 行 alias 表：Vue 包名/子路径 → `packages/*/src`（source plane，与 deepseek-harness 的 tsconfig paths 同一思路）；vendor 依赖（semi-animation、bezier-easing、async-validator…）→ vendor 源码或本地适配；`@semi-v2.102.0/*` → `apps/reference-react/src/test/Semi*Stub.tsx`（参考应用的 jsdom 单测用 stub，真实 vendor 源码留给浏览器 lane）。
- **覆盖率：v8 provider 已配置但无任何 thresholds——不是门禁。**

### Parity 层（Playwright，本项目的核心创新）

- **单一 Chromium project**（ADR 0006：锁定 Chromium 为唯一浏览器承诺）；`testDir: tests/browser`，86 个组件 spec，**482 项测试**。
- **同一 BrowserContext 内双页对照**：`webServer` 同时拉起 `reference-react`（:4173，从只读 vendor v2.102.0 源码构建）与 `parity-vue`（:4174，只消费本项目 Vue 包）；共享查询参数 `scenario/theme/direction/locale`。
- **场景注册表**（`packages/test-infra/src/index.ts`，6110 行）：`PARITY_SCENARIOS` 逐场景声明源码证据、稳定目标（`data-parity-target`）、要比较的 computed-style 字段；`assertScenarioComparable()` 在 React/Vue 任一侧非 `ready` 时直接失败——未完成组件不能冒充已对齐。
- **数值门槛**（ADR 0012）：关键 computed style 逐项精确相等；bounding rect 各轴差 ≤ 0.5 CSS px；截图 `threshold <= 0.1`、`maxDiffPixelRatio <= 0.001`；`animations: 'disabled'`。
- **React/Vue 独立快照**：两端不得共用同一预期 PNG；发布 CI 设 `PARITY_IGNORE_HOST_BASELINES=1` 跳过 host 基线断言，React/Vue 一致性由测试内独立截图 + 像素比较证明（不依赖 `toHaveScreenshot`）。
- **来源断言**：监听真实模块请求，要求公开入口 URL 落在 vendor 路径（如 `vendor/semi-design/packages/semi-ui/button/index.tsx`），防止 stub 或旧构建冒充参考。
- **确定性 fixture**：lottie 动画数据、静音音频 data URI、视频 poster 全部内联生成，无外部资源。
- **runner 工程化**：组件内串行、组件间并发；workers=3（2026-08-30 在 M3 Max 上对 482 项全量基准：3 workers 287s，2/4/6/8 分别 +26%/+14%/+27%/+26%）；CI `retries: 2` + `failOnFlakyTests` + `forbidOnly`；快照集中存放于 `tests/browser/snapshots/`（与 spec 文件名解耦，拆分测试不失效基线）；失败保留 trace + 截图。
- docs app 另有独立 Playwright 配置（workers=1，preview server :4321）验证文档站。

### 发布验证层（脚本即测试）

`verify-pack.mjs`（125KB）、`verify-theme.mjs`（120KB）、`verify-ssr-import.mjs`：对真实 `npm pack` 产物执行安装、导入、类型、样式入口与 SSR import 验证；`pnpm check` 串联 vendor/inventory/icons/illustrations/locales/boundaries/docs/format/lint/typecheck:clean/test:unit/build/docs-dist/theme/ssr/pack 全部门禁，`check:full` 再加浏览器测试。

### CI（当前最大缺口）

仅两个 workflow：
- `publish.yml`（tag `v*` 触发）：quality job（ubuntu-latest，`pnpm check`）→ browser job（**macos-15**，Chromium parity + docs 浏览器测试，`PARITY_IGNORE_HOST_BASELINES=1`）→ publish（npm OIDC）。
- `visual-linux.yml`（手动 dispatch）：生成 Linux 基线截图作为 artifact 供 review。
- **没有 `pull_request` 触发的 CI**——回归只能在发布 tag 时被捕获。

### 测试政策（AGENTS.md + ADR）

- 每个组件完成 = 对齐矩阵 + Vue 源码/类型 + 中英文文档与迁移表 + 黑盒单测 + Chromium 行为/键盘/焦点/ARIA/Portal/动效测试 + SSR 证据 + React/Vue computed style 与截图对照 + npm pack 验证（ADR 0011）。
- 测试优先公开行为，不把私有 state/method 或 Foundation spy 当主证据；快照必须与行为断言配对。
- Teleport/真实焦点/拖拽/ResizeObserver/computed style/动画不能用 jsdom 结果代替 Chromium 证据。
- 桌面优先矩阵（ADR 0013）：默认 1440×900 DPR1 light/dark；仅上游契约明确依赖时才加 390×844 narrow/触摸专项。

## 逐维度对比

| 维度 | deepseek-harness | semi-ui-vue（本项目） | 判断 |
| --- | --- | --- | --- |
| 问题类别 | 非确定性 agent（LLM 在环、多进程、4+ 平台） | 确定性 UI 库，有固定参考实现 | 前提不同，不可直接比总分 |
| 正确性 oracle | 合成：录制会话 + 世界状态验证（无外部参照） | **外部固定 oracle**（vendor v2.102.0 同浏览器渲染）+ 精确数值门槛 | **本项目更强**：直接度量目标属性（等价性） |
| 非确定性处理 | record/replay/refresh 三态 + with-key e2e 自跳过 | 确定性场景 + 内联 fixture（基本无非确定性） | deepseek-harness 的机制是必要的；本项目用不上 |
| 覆盖率门禁 | **per-file 100% ×4**，豁免清单=债务台账，CI 分区 + 时长加权 | v8 已配置、**无 thresholds** | **deepseek-harness 明显更强**（本项目缺口） |
| PR 级 CI | **9+ job**：static/coverage/consumers/node 矩阵/python/wine/windows，企业 runner + failover | **无**（仅 tag 触发 publish + 手动 visual-linux） | **deepseek-harness 明显更强**（本项目最大缺口） |
| 浏览器测试形态 | Playwright 作库嵌在 vitest（快照集成紧，runner 工程化弱） | **Playwright 一等 runner**：webServer、retries、failOnFlakyTests、trace、worker 基准 | **本项目更强**（就 runner 工程化而言） |
| flake 政策 | 显式教条 + 诊断 workflow（"只单独通过 = spec 缺陷"） | `failOnFlakyTests` + retries=2 + worker 基准，教条未成文 | deepseek-harness 略强（机制两者都有） |
| mock 政策 | "只 mock 昂贵/非确定性边界，下游全真实"（成文） | "验证公开行为，不依赖私有 state/Foundation spy"（AGENTS.md） | 两者都合理；deepseek-harness 表述更精确 |
| 真实入口验证 | 构建产物 `lib/bin.js` plain node smoke + packed install | npm pack 安装/导入/类型/样式/SSR 验证脚本 | 平手，各自适配形态 |
| source plane 解析 | vite-tsconfig-paths → src（生成式 paths map + verify） | vitest alias 表（手写，含 ~80 个 stub 映射） | 思路相同；deepseek-harness 的生成式更抗维护腐化 |
| 规模/成本 | 1074 测试文件、9+ CI job、企业 runner——高维护成本 | ~250 测试文件、2 workflow——低成本 | deepseek-harness 的成本只有它能负担（自家模型 + 自有 runner） |

## 判断：哪一个更好

**不存在全面占优。** 两个体系各自针对自己的问题类别做了正确优化：

1. **验证策略设计（核心）——本项目更好。** 复刻项目的本质问题是"等价性证明"，而本项目拥有一个 deepseek-harness 永远得不到的资产：固定参考实现。同 BrowserContext、同字体/viewport/DPR/locale 下双框架渲染 + computed style 逐项相等 + 0.5px 几何门槛 + 0.1% 像素门槛，是对目标属性的直接度量。deepseek-harness 的快照机制再精巧，验证的也是"agent 能工作"而非"与某参照等价"——因为新产品的参照只能是自己录制的历史。
2. **过程纪律（门禁与 CI）——deepseek-harness 明显更好。** per-file 100% 覆盖率（豁免即债务台账）、PR 级多 lane CI、failover、Node 兼容矩阵、flake 教条，构成"绿 = 有意义"的完整闭环。本项目当前 CI 只在 tag 触发、覆盖率无门槛，意味着 PR 阶段没有任何强制质量信号。
3. **成本结构**：deepseek-harness 的方案（1074 文件、9+ job、企业 runner、with-key 真实 API）依赖两个本项目不具备的前提——推理便宜（自家模型）和自有 runner 池。照搬其成本结构不现实，但其**机制**（覆盖率门禁、PR CI、flake 教条）与成本无关，可以移植。

**一句话：deepseek-harness 的"测试体系"更成熟；本项目的"验证策略"更锋利。对本项目，前者是可移植的差距，后者是应保留的差异化资产。**

## 对本项目的建议（按优先级）

1. **P0 — 增加 PR 级 CI。** 新增 `pull_request` workflow：ubuntu-latest 跑 `pnpm check`（含单测/构建/pack 验证）+ Chromium parity lane。parity 在 Linux 上跑时沿用 `PARITY_IGNORE_HOST_BASELINES=1`（host 基线断言留在 macOS 发布 lane），React/Vue 独立像素比较在任意平台都有效。这是当前最大的信号缺口：回归目前只能在发布 tag 时暴露。
2. **P1 — per-file 覆盖率门禁。** vitest coverage 加 `thresholds: { perFile: true, statements/branches/functions/lines: 100 }`，include `packages/*/src/**`（排除 vendor/dist），仿 deepseek-harness 维护带理由的豁免清单（每条 TODO + 债务归属）。注意定位：对 UI 库，覆盖率是死代码探测器，**补充**而非替代 parity 证据——parity 才是本项目的正确性主门禁。
3. **P2 — flake 教条成文 + alias 表治理。** 把"只单独通过的 spec 是 spec 缺陷"写入 AGENTS.md（`failOnFlakyTests` 已就位）；vitest 的 327 行手写 alias 表（尤其 ~80 个 `@semi-v2.102.0/*` stub 映射）可仿 deepseek-harness 的 `gen-tsconfig-paths.ts --check` 模式改为生成 + 校验，降低维护腐化。
4. **不建议移植**：session snapshot record/replay 机制（本项目无非确定性可回放）、with-key 真实 API 政策（无 LLM 依赖）、Wine/Windows lane（Chromium-only + 桌面优先承诺下无对应面）。

## 两方案各自的风险

- **deepseek-harness**：1074 测试文件 + 9+ CI job 的维护成本极高；覆盖率豁免清单持续增长（GUI debt、worker runtime）说明 100% 门禁在产生"豁免压力"而非"补测压力"；with-key e2e 依赖自家模型便宜这一不可移植前提。
- **semi-ui-vue**：无 PR CI（回归暴露滞后到发布）；覆盖率无门槛（死代码可静默积累）；`test-infra/src/index.ts` 单文件 6110 行（场景注册表单体，可接受但需警惕继续膨胀）；macos-15 hosted runner 为 3 核 M1 / 7GB，parity lane 在该规格上偏慢（已用 worker 基准缓解）。

## 证据索引

- deepseek-harness：`docs/testing.md`（分层与政策）、`vitest.config.ts:150-364`（forks pool、per-file 100%、豁免清单）、`vitest.{e2e,expected,snapshot,web,web.perf,web-stress}.config.ts` + `vitest.shared.ts`（lane 切分）、`packages/test-support/session-snapshot/README.md`（record/replay/refresh、manifest 规则）、`.github/workflows/ci.yml`（9+ job、failover、all-checks-passed）、`lefthook.yml`、`pytest.ini`、`package.json:19-160`（命令面）。
- 本项目：`vitest.config.ts`（jsdom、alias 表、无 thresholds）、`playwright.config.ts`（Chromium-only、workers=3、retries/failOnFlakyTests）、`packages/test-infra/src/index.ts`（场景注册表、门槛常量、fixture）、`tests/browser/components/button.spec.ts`（parity 断言形态样本）、`.github/workflows/{publish,visual-linux}.yml`、`docs/testing/react-vue-parity.md`（worker 基准数据）、`docs/adr/0011|0012|0013`、`AGENTS.md`。
