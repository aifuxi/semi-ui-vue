# AI 工作记录：Rstack 工具链迁移

- 日期：2026-09-10
- 状态：第九阶段评估完成；保留 ESLint 与 Playwright Test
- 分支：`codex/rstack-migration`
- 基线：`e6a5f0d`

## 目标

在独立 worktree 依次迁移资产包、对照应用、UI 包、单测、Nuxt builder、REPL 构建，最后评估 Rslint 和浏览器 runner；保留固定上游、公开 Vue API 和现有验收契约。

## 验收标准

- 构建入口从 Vite Library 改为 Rslib，保持 ESM、声明、exports、Vue external、SSR 与组件身份。
- 原 629 个资产公开入口不减少，623 个组件的 SSR SVG 内容不变（归一化随机 SVG ID 后比较）。
- 真正 tarball 安装、类型、SSR 和消费验证通过；不以构建成功替代产物验收。
- 保持严格 peer 校验与 pnpm 统一 lockfile。

## 第一阶段范围与决策

- `icons`、`icons-lab`、`illustrations` 使用 Rslib 1.0.0；保留显式多入口，移除相应 Vite 配置。
- 曾验证 bundleless 模式，但它会多输出 `icons/index.js` / `illustrations/index.js`，落入既有 wildcard exports。最终使用显式多入口 bundle 模式。
- Rslib 为共享组件在子路径额外生成同名具名导出（共 623 个），原有 default 导出与根/子路径组件对象身份不变。额外名字不新增类型层 API；不手工重写构建产物。
- 资产都是 `.ts` 源码，无 Vue SFC，因此使用 Rslib dts。独立构建 tsconfig 排除单测，开发类型检查仍覆盖单测。同步文档资源缓存的测试输入规则。
- 安装新依赖时揭示原依赖图的 peer 冲突：给公开包补本地 Vue devDependency；给 unctx 3.0.1 显式补兼容的可选 parser/unplugin 依赖；文档/参考应用固定 SCSS 改用 `sass-legacy` 别名保留 1.54.9，而 Vite Sass peer 使用 1.104.0。
- `@parcel/watcher` 是新 Sass 引入的原生可选依赖。检查其安装脚本仅在显式 build-from-source 时调用 node-gyp 后，通过 pnpm 批准其构建。
- WebStorm 未打开新 worktree，已用只读调用确认，后续在新 worktree 使用 CLI。

## 验证证据

- `mise exec -- pnpm install --frozen-lockfile`：通过，严格 peer 检查开启。
- 三个资产包旧 Vite 构建：通过，捕获公开入口、导出和 SSR 基线。
- 三个资产包新 Rslib 构建：通过，所有原导出仍存在；629 个入口和 623 个组件身份检查通过。
- SSR SVG 对照：623 个组件通过，随机生成的 SVG ID 及引用按一一映射归一化。
- 三个资产包 `typecheck`：通过。
- 资产单测：3 文件、16 测试通过。
- `pnpm test:tooling`：通过。
- `pnpm check:boundaries`：通过。
- 修改的 JS/TS 配置与工具脚本 ESLint：通过。
- UI 原构建与主题构建：通过，用于验证新资产包兼容现有消费者。
- `pnpm verify:ssr-dist`：通过，含资产 629 和 UI 151 个入口。
- `pnpm verify:theme-dist`：通过。
- `pnpm verify:pack-dist`：通过，真实 tarball 安装、exports、ESM、类型、样式、SSR 与 JsonViewer Worker 搜索替换。
- 新 worktree 首次 `pnpm check`：submodule 缺 tag 元信息；从 origin 获取真实 v2.102.0 tag 后继续。
- 后续 `pnpm check`：格式检查发现资源准备期间 `apps/docs/src/data/tokens.json` 暂时不存在；等待资源准备完成后重新运行。
- `pnpm --filter @workspace/docs check`：最终串行稳定输入版本通过；198 页、1761 个注册 Demo、Nuxt 类型检查、本地 REPL 和静态产物门禁通过。此前一次执行因检查期间编辑了缓存输入规则而被 freshness 守卫拒绝，未复用该次失败记录。
- `pnpm check` 中格式、全量 ESLint、源码类型检查通过；Vitest 178 文件、1218 项单测全部通过。末尾工具测试曾与资源重建并行，因 tokens.json 暂时删除而失败；构建完成后单独 `pnpm test:tooling` 重跑通过（68 + 6 项），没有弱化断言或增加重试。未将失败的聚合命令记为成功。
- Tree-shaking 消费探针：esbuild 从根入口只导入 IconHome，实际产物仅保留 IconHome 与共享 Icon 实现，2080 字节。
- `docs/documentation/coverage.json` 根据当前构建输入重新生成，旧 43 个 accepted Demo 变为等待重新验收；历史 evidence 文件和指纹未改写。

## 后续阶段

1. Rsbuild：Vue/React 对照应用及其虚拟样式、源码适配、来源证明。
2. Rslib：UI 多入口、私有 Foundation 内联与 Worker。
3. Rstest：单测、mocks、覆盖率、测试发现清单。
4. Nuxt Rspack builder：Content、REPL、预渲染与静态验收。
5. REPL 打包 API 与 Rslint 分范围迁移；Vue 模板 ESLint 暂留。
6. 单独评估 Playwright runner 等价性，保留 Chromium 和视觉契约。

## 未验证事项与剩余风险

- 尚未完成后续各阶段，不能称整个项目已脱离 Vite。
- 不重写历史 accepted 指纹；构建输入变化造成旧证据失效由账本反映。
- 未执行全组件/全文档 Chromium 矩阵；不宣称性能提升。

## 第二阶段：两个对照应用迁移到 Rsbuild

- 基线提交：`b149f16`；仅在 `/Users/chen/fc-studio/semi-ui-vue-rstack` 工作。
- `reference-react` 与 `parity-vue` 使用 Rsbuild 2.2.5；React/Vue 插件分别固定 2.1.0 / 2.0.1。原端口、查询参数、类型检查和动态场景注册保持。
- React 显式提供 `index.html`、`docs.html` 两个入口，采用 classic JSX，保留 React 16 原有子节点语义。初次 automatic JSX 回归产生 Cascader key 警告；明确编译模式后定点和完整矩阵均通过，没有屏蔽运行时警告。
- `scripts/parity-rsbuild.ts` 通过 unplugin 3.3.0 复用既有固定样式和 JsonViewer 解析钩子，保留 UI/Nuxt/Vitest 仍需使用的 Vite 集成。Rspack Worker 子编译单独裁剪主线程管理器，保留消息入口的 sideEffects，防止递归生成内联 Worker。
- 文档示例不再调用 Vite SSR 求值或 esbuild 转换。TypeScript 编译 JSX；jiti 2.6.1 的独立同步求值实例避免 Node ESM 缓存，递归文件依赖与适配器目录直接接入 Rspack watch。真实 watch 测试覆盖两跳 helper、adapter 修改和批次增删。
- 开发与预构建模式均从实际 Rspack chunk/module graph 生成来源证明，包含静态转导出入口，排除未请求的动态块。浏览器开发态每次获取最新映射；缺失或损坏映射仍失败。
- 预构建脚本与加载实验已改用 Rsbuild API，独立临时目录和严格端口；正式预构建保持 development 诊断，benchmark build 保持原有 production 语义。
- 保留严格 peer 校验；pnpm 为精确选择的 `@rsbuild/core@2.2.5` 记录单版本发布时间例外，没有关闭全局依赖校验。

### 第二阶段验证

- 迁移前：两个 Vite 生产构建通过；Playwright 清单为 442 项 / 87 文件，迁移后保持相同范围。
- `pnpm check` 通过：静态约束、格式、lint、源码类型、1,218 项单测 / 178 文件、74 项工具测试（包含真实 Rspack watch 测试）。最后的类型声明调整另经 `pnpm typecheck:source` 验证。
- `pnpm check:docs` 通过，生成并验证 198 页、1,761 个注册 Demo 与静态资源；历史验收仍为 stale，未伪造 accepted。
- 六批文档当前输入清单已指向 Rsbuild/Rslib 配置，并纳入新增共享编译插件；现有工具测试验证这些输入影响全部六批。
- 两个应用最终生产构建通过；源码来源与运行时插件的 5 项定点测试通过，测试使用真实 Rsbuild 编译而非模拟钩子。
- 最终开发态 Playwright：442/442，约 2.0 分钟，退出 0；预构建完整矩阵：442/442，约 2.1 分钟，退出 0。均使用锁定 Chromium，未启用重试，未更新基线或降低阈值。
- 文档代表场景最终 16/16，退出 0：Button Types、Navigation Basic、Icon Basic 的双语言/主题，以及四组页头对照。使用 worktree 的独立 4331 预览，原工作区的 4321 预览未停止或修改。
- 初次中文深色页头 focus 裁剪底部有 4 个 Tooltip 箭头像素差异。两端样式/几何相同，实际像素定位证明截图跨越延迟 Portal 出现时刻。测试改为等待两端 Tooltip 可见及入场动效结束；保持完整焦点轮廓裁剪和原像素门槛。
- 加载实验 `benchmark:parity build` 与 `benchmark:parity warm` 均退出 0，六场景双应用采样无运行时错误；未把缺少同环境迁移前数据的单次实验当作性能提升结论。

### 第二阶段边界

本阶段不迁移 UI 包、Vitest、Nuxt builder 或 REPL。历史文档 accepted 证据不因本次回归恢复；没有执行全部文档批次验收，也没有修改历史指纹。后续阶段按原顺序继续。

## 第三阶段：UI 包迁移到 Rslib

- UI 的 151 个显式入口改用 Rslib 1.0.0 / Vue 插件构建；保留 Vue、图标和插画包 external，固定 Foundation 与原有第三方运行时继续内联。未修改组件源码、vendor、公开 exports 或依赖版本。
- Vue SFC 声明遵循 [Rslib Vue 指南](https://rslib.rs/guide/solution/vue)，单独运行 `vue-tsc`。从公开 exports 追踪声明引用图并裁掉不可达私有声明；真实安装的 `skipLibCheck: false` 类型消费验证通过。
- 共享 ESM 模块独立拆分，CommonJS 工厂和 Prism 插件注册放在 `dist/_runtime/`，只对该目录声明副作用。输出共 2765 个 JS 文件；碎片数增加用于保持跨入口身份和消费端 tree-shaking，不直接作为浏览器请求布局。
- Prism 的 JSX、TSX 和行号扩展显式依赖核心初始化。产物矩阵发现行号扩展先于 CommonJS 核心执行，影响 CodeHighlight 和 Sidebar；修复后定点与整轮组件对照均通过。
- JsonViewer Worker 协议测试改用实际 Rsbuild 编译，保留初始化、格式化、折叠和校验断言；tarball 检查通过静态引用图查找 Worker，不再依赖 Vite 的 chunk 文件名。
- 文档资源缓存和六批输入清单纳入 Rslib 配置、声明配置及共享编译辅助文件。REPL 将 `_base`、`_utils`、ConfigProvider、Locale 的公共 facade 指向同一基础设施实现组，保留组件和语言源入口；根 UI 静态请求数为 200，未放宽原有 200 门槛。
- Nuxt 文档站的 workspace 链接在 Vite SSR 阶段保持 UI 包 external，避免 Nitro 二次打包抹掉模块注册副作用。浏览器仍正常打包消费；Nuxt builder 和 REPL 构建器的整体迁移留待后续阶段。

### 第三阶段验证

- 与 `74120d0` 的新鲜 Vite UI 产物对比：151 个入口导出名称和类型未增减，335 项根入口/子路径身份关系一致。
- Rslib UI 构建、151 个 UI 入口及全部资产入口的 SSR import、产物私有依赖扫描通过。
- 隔离 store 的真实 tarball 安装、exports、ESM、类型、主题与浏览器消费通过；新增 Button 点击、Input 受控回写、Select Portal 选择、CodeHighlight 行号/关键字验证，保留 JsonViewer Worker 搜索替换验证。
- 按需消费以 Vue external、Vite 生产构建计量 UTF-8 字节：Button 根/子路径 9010/9010，Input 68389/68401，Select 151728/151747；保持 20/125/200 KB 门槛，根入口没有额外拉入无关组件。
- `pnpm check` 的静态检查、格式、lint、源码类型及 1218 项单测通过。首次工具阶段遇到文档资源同时准备时 `tokens.json` 暂缺；准备完成后串行运行工具测试，69 + 6 项通过。最终受影响配置的 lint、UI typecheck 与 Worker 协议测试也通过。
- 直接消费 Rslib UI 产物的 Chromium 组件矩阵：433/433 通过，无重试，包含 React/Vue 行为、样式、几何、局部像素及明暗色/RTL。使用临时 Rsbuild 配置在原插件之前将 UI 请求解析到 `packages/ui/dist`；实际请求的 provenance 确认 Divider 来自 dist 且无 UI src。只执行 `tests/browser/components`，未将默认工作台的源码路径断言伪称为产物验收。临时配置与服务已移除。
- 最终 `pnpm check:docs` 通过：SSR 预渲染 399 路由，静态兼容入口 203 个；内容/类型/静态门禁通过。文档 Chromium 22/22 通过：Button、Icon、Navigation、页头的双语明暗色代表矩阵，加上导航加载、无 JS 阅读、交互与本地多文件编辑/错误恢复/实例隔离。
- 一次误启动的全量文档矩阵因参考页固定依赖的 4321 字体服务已停止而出现网络错误，已中断；确认端口空闲后使用工作区临时服务完成上述 22 项目标检查。未将该中断运行计为全量文档验收通过。
- 最终全仓 `pnpm format:check`、`pnpm lint` 与 `git diff --check` 通过；Rslib 配置、共享运行时、声明裁剪及 Nuxt/REPL 配置的 WebStorm 错误诊断为空。

### 第三阶段边界

本阶段未替换 Vitest、Nuxt builder 或 REPL 构建器；Vite 还用于这些既有环节和真实消费者兼容验证。没有恢复历史文档 accepted 指纹，也没有降低像素、请求数或 flaky 门槛。

## 第四阶段：单测迁移到 Rstest

- 基线提交 `c1893fe`，仍在独立 worktree 工作。使用 Rstest / V8 coverage 0.11.12，复用 Rsbuild Vue 插件、固定源码解析与 Prism/Worker 适配。移除 Vitest 4.1.11、旧配置、旧 V8 provider，以及仅旧测试配置使用的 Vite React 插件。
- 178 个测试文件改用 `@rstest/core` 与 `rs`，保留五组发现规则、原 exclude、jsdom 默认环境与 15 个 Node 注解。Vue Node 测试使用 SSR 模板编译，开发环境检查继续启用。未改组件运行时代码、vendor、断言、场景、测试名称或快照；原来没有快照和跳过项。
- JsonViewer 的 Worker 替身补齐 `addEventListener`：Rsbuild 内联 Worker 注册 error 监听器后才返回，旧替身缺少该接口会进入备用创建路径。Upload 的清理钩子改为显式 void 返回以满足 Rstest 类型；另补齐 ConfigProvider 的 mock 类型引用迁移。实例数量、重建、销毁断言全部保留。
- Node 与 jsdom 均打包运行时依赖，以保留固定别名、Prism 初始化和 CommonJS 具名导出。单独将 Node Vue 编译器解析到 `vue/compiler-sfc`，避免打包其未安装的可选模板引擎；临时编译诊断确认 errors 清单为空。Rstest 本身会在编译结束时过滤模块找不到的错误，因此未仅凭退出 0 忽略最初的 `build failed` 日志。
- `@rstest/coverage-v8@0.11.12` 使用版本锁定的 pnpm 补丁：同一 Vue 源文件的 script/template 或 client/SSR 编译模块有不同分支索引，原实现复用首个模块的索引会崩溃。改为先各自统计，再由 Istanbul 按源码位置合并；不替换 V8 provider、不增排除项或忽略标记、不降低门槛。将来上游修复后，需在移除补丁的状态下重跑默认和全量覆盖率再升级。
- `test:unit:watch` 显式使用 `rstest watch`。更新源码类型入口与仓库 Vue 测试技能的配置链接。`gen-vitest-aliases` 工具和少数历史测试标题保留原名称，以保持命令兼容和测试清单；该别名工具不依赖 Vitest。

### 第四阶段验证

- 迁移前 Vitest 实跑 178 文件 / 1218 项全部通过；迁移后文件与完整测试名称逐项比较完全一致，新增、删除、跳过均为 0。另将 178 个文件的 runner/API 改写反向归一化，与基线源码比较，确认只有上述替身接口和钩子返回类型适配。
- `pnpm check` 退出 0：静态约束、格式、lint、源码类型、1218 项单测，以及 69 + 6 项工具测试通过。最终 Vue 编译器 external 调整后，重新执行配置 lint、根类型检查与全量单测，仍为 178 / 1218 全部通过。
- 最终 `pnpm test:coverage`、`pnpm test:coverage:all` 均退出 0，均执行原 1218 项测试；默认相对 `origin/master` 的 changed 范围和全量 include 保持。全量报告包含 1265 个包内源码文件，其中 239 个 Vue 文件；无 vendor/dist 文件，计数为非负有限值。报告用于定位缺口，不将不同编译器的百分比强行视为等价。
- `pnpm install --frozen-lockfile` 通过，严格 peer 与版本锁定补丁可复现。WebStorm 对 Rstest 配置、JsonViewer/Upload 测试的错误诊断为空，源码类型检查单独通过。
- watch 冒烟：Button 的 10 项测试通过后进程保持等待文件变化，随后向本次启动的进程发送 SIGINT 并完成清理。
- 同 Node 24.18、3 个 worker、178 文件 / 1218 项、无覆盖率的单次对照：Vitest 51.67 秒，最终 Rstest 35.1 秒（此前测得 34.7 秒）。Vitest 使用基线提交的临时副本、相同依赖，并只适配临时 vendor 符号链接的真实路径；最初未适配时的 8 项失败不计入性能对照。该观察不作为跨机器性能承诺。
- 临时诊断配置与 watch 进程已移除；无重试、无断言放宽、无历史 accepted 指纹更新。

### 第四阶段边界

本阶段仅迁移单测及覆盖率，Playwright 继续作为 Chromium runner；没有重跑组件或全文档浏览器矩阵。下一阶段是 Nuxt Rspack builder，随后处理 REPL 和剩余工具链。Vite 仍用于这些尚未迁移的环节和消费兼容验证。

## 第五阶段：Nuxt 文档站迁移到 Rspack

- 基线提交 `5380d85`，继续在独立 worktree 工作。Nuxt 保持 4.5.2，使用同版本官方 `@nuxt/rspack-builder`，移除文档站 Vite 专用配置。严格 peer 要求额外声明 webpack 5.110.3 与 pug 3.0.4；webpack 用于官方 builder 的兼容 loader 依赖，实际编译器为 Rspack。builder 私有依赖解析到 Rsbuild 2.1.13 / Rspack 2.1.10，未强制覆盖为根版本。
- 将原始 Demo 源码、Nuxt 虚拟 TypeScript 模板与 REPL 隔离改写移入三个定向 loader。虚拟模板的相对导入恢复原目录，MDC 生成的依赖按所属包解析；Monaco Worker 保持本地 URL。保留 iframe 不透明 origin、运行重建与主题消息机制。
- SSR 保持 Vue 和公开包根/子路径 external，避免 Vue 实例分裂与 Rslib 模块注册被二次打包破坏。显式通过 `import.meta.client` 排除只在客户端运行的 Demo 与编辑器，SSR JS 从最初错误打包时的约 1.24 GB 降至约 8 MB，未提高 Node 堆上限。Content SQLite WASM 仍由资源 loader 处理。
- Nuxt Content 3.16 的数据库更新已有文件监听，但浏览器通知仅实现 Vite 通道。新增仅开发态启用的 SSE 模块：数据库模板更新后重建 Nitro，待新 worker 就绪再刷新页面；关闭连接与应用时清理资源。Vue 模板 HMR 保留状态，Markdown 正文修改采用页面刷新。
- 两项生产构建兼容处理均来自实际浏览器失败：`@nuxt/rspack-builder@4.5.2` 的 SSR 样式改写丢失 `url(...)`，用版本锁定的两处 pnpm 补丁保留括号与引号；Rspack inner-graph 分析将 Monaco 仍被读取的 `undefined` 初始化改为 `null`，客户端关闭该细粒度变量分析，保留 export tree-shaking 和压缩。后者也由独立 Monaco 构建复现。上游修复后，分别移除补丁/配置并重跑字体、背景资源与在线编辑矩阵，再升级。
- 资源缓存与六批输入清单纳入 loader、开发模块和 Nuxt 补丁；保留旧 accepted 证据为 stale，没有重写历史指纹。

### 第五阶段验证

- 迁移前 `pnpm check:docs` 通过；迁移后全站构建、Nuxt 类型、内容和静态门禁通过：198 页、1761 个注册 Demo、399 个预渲染路由、203 个兼容入口。
- `pnpm check` 退出 0：静态约束、格式、lint、源码类型、178 文件 / 1218 项单测、70 + 6 项工具测试通过。新增工具测试使用真实 Rsbuild 构建验证原始 Vue 源码、虚拟 TS 模板相对导入与 MDC 所属依赖。
- 新增开发态 Chromium 测试通过：Counter 模板修改和恢复均保留点击状态；Markdown 正文修改和恢复均自动显示，无控制台或页面错误。测试最后恢复源文件，使用独立端口且没有重试。
- 完整浏览器矩阵初次因 SSR 字体 URL 失败；修复后下一次在在线编辑挂载阶段暴露 Monaco 初始化错误，均以首个失败停止，未计为全量通过。对应问题修复后继续验证。
- 最终文档集成范围共 252 项，分两次完成：先通过编辑器、Form、页头、导航加载和站点功能的 22 项，再执行剩余 230 项，220 通过、10 失败。合计 242 通过、10 失败；后者是双语 Chat 2 项与 TreeSelect 8 项，原因如下。Button 矩阵另有前 10 项通过，Links 的 REPL 预览失败后停止；未完成全部 476 项，不声称全量文档验收通过。
- 最终全仓格式、lint、76 项工具测试及 frozen-lockfile 安装通过；所有浏览器检查均未启用重试或降低断言。

### 本次发现的既有问题

以下问题保留原有实现和失败证据，未混入 Nuxt builder 迁移提交。后续应先修复这些问题，再继续 REPL 迁移及全量验收：

- **Chat / Markdown 的公开 UI 产物**：`packages/ui/dist/_shared/a6bd74ca1e0c.js` 的 namespace getter 引用了未声明的 `parseLinkDestination` 等绑定。直接在 Node 中导入该文件并读取 getter 即可复现，不经过 Nuxt。UI 源码与 Rslib 配置未在本阶段修改；仅 SSR import 的检查无法发现延迟 getter 的错误。
- **Typography 的 REPL 产物**：`/repl/modules/ui/typography.js` 在 CommonJS 工厂注册完成前执行了依赖，报 `Cannot read properties of undefined (reading 'call')`。在不加载 Nuxt 的空白 HTML 中，仅设置本地 import map 并导入 Typography，即可复现。REPL 打包脚本与基线 `5380d85` 字节一致；完整 REPL 构建器迁移仍未实施。
- **TreeSelect 示例路径大小写**：Git 跟踪目录为 `tree-select/zh-CN` 与 `tree-select/en-US`，基线注册表、正文和 glob 查找使用小写 `zh-cn/en-us`。macOS 文件存在性检查容忍大小写差异，但 glob 对象键严格区分大小写，导致预览为空、源码为空。当前与基线使用相同的注册表和查找逻辑，需统一真实目录与注册路径，并增加大小写一致性检查。

### 第五阶段边界

本阶段迁移 Nuxt builder 及必要的运行时集成；REPL 资源打包、虚拟 TS loader 的 esbuild 转换和剩余工具链留待下一阶段。没有迁移 Playwright、修改组件公开契约或 vendor，没有恢复历史文档批次 accepted。

## 第六阶段：先修复三项已知问题

### Chat 的 Markdown 产物

- 用三个 ESM 文件独立复现 Rslib 1.0 的 namespace re-export 跨 chunk 绑定丢失。关闭 innerGraph、模块拼接或 usedExports 均不能解决；将同包 namespace 模块合并后可正常读取和调用。
- 仅将 markdown-it、mdurl、uc.micro 各自的内部模块按包分组，保留其余 UI chunk 与 CommonJS 工厂策略。没有修改组件源码、vendor 或公开 API。
- 扩展产物 SSR 检查，实际渲染 Chat 的带标题链接、粗体和自动链接，覆盖只导入模块无法触发的延迟 getter。
- UI 构建、所有公开入口 SSR import、Chat SSR 渲染、双语 Chat Chromium 用例通过。真实 tarball 安装、exports、类型、CSS、SSR、JsonViewer Worker 验证通过；Button 根/子路径 9010/9010 bytes，Input 68389/68401，Select 151728/151747，tree-shaking 门禁通过。
- 全站 check:docs 通过（198 页、1761 Demo、399 预渲染路由、203 兼容入口）。静态、lint、源码类型检查通过；初次测试期间系统 17:59 合盖、18:00–18:17 休眠 1025 秒，造成单测和浏览器超时，已用 macOS powerd 日志确认。唤醒后原参数、零重试重新执行，178 文件 / 1218 单测和 71 + 6 工具测试全部通过。完整 476 项浏览器矩阵仍在执行，尚不计为通过。

### 示例路径大小写

- 将 TreeSelect 与扫描发现的同类 14 个组件的双语目录统一为注册表和 URL 已使用的小写 locale。共 295 个文件仅重命名，内容完全不变，保留原有公开 Demo ID。
- 提取已有逐级目录名称校验，并在内容生成访问每个 Demo 前执行，让 macOS 也能发现 Linux/glob 会拒绝的大小写差异。补充正确路径及错误大小写的工具回归。
- 全部 1761 Demo 的内容生成和全站检查通过；TreeSelect 八项真实 Chromium 交互通过，覆盖受控键盘、明暗主题、异步与自定义内容。完整单测和工具验证见本阶段记录。

### REPL 的工厂注册顺序

- 在不加载 Nuxt 的 Node 独立导入中复现完整 REPL Typography 的 `undefined.call`。原因是二次拆包形成共享 chunk 循环，消费者在 CommonJS 工厂注册前执行。
- 在 REPL 打包边界将 UI `_runtime` 的注册包装为幂等、可提前调用的函数，消费者显式先完成依赖注册。使用提升的 var/function 避免循环中 TDZ 或重复重置；保留原有 CommonJS 延迟执行和缓存。
- 新增循环工厂与多入口对象身份回归，REPL 四项工具测试全部通过；完整资源生成和 Typography 独立导入通过。780 个 JS 公开入口全部保持 exports，最大静态请求仍为 200（Typography 39），未放宽预算。输入缓存与六批清单同步纳入新转换器。
- 双语 Button Links、编辑器多文件运行/错误恢复/重置隔离的 Chromium 验证通过；与 Chat、TreeSelect 合计 13 项定点浏览器测试通过。完整浏览器矩阵仍在运行，资源构建仍保留既有第三方 direct-eval 与 bare-import 警告。

### 三项修复的完整回归

唤醒后的完整 476 项 Chromium 文档测试一次通过，耗时 14.0 分钟，未增加超时、启用重试或改变断言。覆盖 Button/ConfigProvider/Locale/Icon/Dark Mode/Navigation 对照、全部页面加载、编辑器、Tree/TreeSelect、表单和页头。三项修复分别提交为 `9a5e21e`、`5487986`、`b0ca4e6`。

## 第七阶段：REPL 资源打包迁移到 Rslib

- 将 REPL 的 esbuild 多入口打包替换为 Rslib 1.0 浏览器 ESM 构建。保留资产每组 32 个入口、UI 基础设施分组、公开 facade、Vue/跨包资产 external 与现有 import map。工厂注册转换改为 Rspack loader，不改变原有幂等注册和 CommonJS 缓存语义。
- 在独立临时目录生成聚合入口与产物，从实际输出解析导出和静态/动态依赖；全部导出和 200 请求预算通过后才替换现有资源。失败清理临时目录并保留旧产物；保留 Rslib 输出的 LICENSE 附属文件和其它资产。
- Rslib 在 splitChunks 前创建匿名共享 chunk，因此按输入图中的入口使用关系分组，并遵循公开 UI 的 sideEffects 声明，忽略本应被删除的纯 ESM 空导入。初次未区分它们时 Typography 错误加载约 3 MB，已定位并修复，新增真实打包回归防止小入口重新携带全库。
- 将无依赖、无副作用且不超过 1 KiB 的小模块每 32 个合并，限定每组源文本至多 32 KiB，减少数十字节模块的额外请求。最终独立完整探针覆盖 780 个 JS 入口，最大静态请求 193，未放宽 200 门槛。与修复后的 esbuild 产物比较：UI 根入口 200 → 193 请求、3,902,759 → 3,807,837 字节；Button 5 → 6 请求、10,067 → 15,166 字节；Typography 39 → 40 请求、470,241 → 487,158 字节。字节统计为传递静态 JS 总量、不含 Vue、未压缩传输；少量小工具共享造成的按需增量是当前取舍，没有引入全库 chunk。
- 新增动态导入可运行且预算失败不覆盖旧产物的工具测试，以及基于实际站点 import map 的 Chromium 根/子入口对象身份和 Chat Markdown 渲染回归。独立 Chromium 探针已通过，最终生产站点检查与浏览器矩阵待下文记录。
- 文档包显式声明已有的 Rslib 版本，lockfile 仅增加对应 importer。esbuild 仍用于 Nuxt 虚拟 TypeScript loader，本阶段只迁移 REPL 资源构建，不声称剩余工具链全部迁移完成。

### 第七阶段验证与对照状态修正

- 最终 `pnpm check:docs` 退出 0，公开资源、Nuxt 生成/类型和内容/静态门禁通过。lint、格式及 73 + 6 项工具测试通过；生产站点三项定点 Chromium（多文件编辑与错误恢复、上传本地模拟、公开模块身份/Chat 渲染）通过。
- 首轮完整矩阵在 183 项通过后停止于 Locale Components 英文亮色 RTL 的语言菜单。trace 显示重新打开菜单前 React 的 `aria-activedescendant` 已指向第 5 项越南语，Vue 指向第 4 项阿拉伯语；两侧对应的选项几何相同，该用例没有 REPL 模块请求。两端固定 Foundation 都在鼠标进入时保留选项焦点，测试却直接比较上次菜单交互留下的不同状态。
- 仅修改 Locale 对照测试：菜单打开并稳定动效后，用真实鼠标悬停当前选中项，先断言焦点类，再保留原有全部类名、样式和几何比较。没有修改 Select 源码、屏蔽焦点样式、增加超时或启用重试。原失败用例定点通过。再次 `check:docs` 确认 resources/site 输入及全部产物内容一致，仅重跑 checks。
- 保留输入未变的前 170 项通过结果，重新执行受影响的全部 Locale 用例及后续未运行的 307 项矩阵，307 项一次通过（5.4 分钟）。最终 477 个用例都有对应当前输入的通过结果，分两组取得，不声称单次 477 全过；首轮已失效的 13 项 Locale 结果未重复计入。历史 accepted 指纹没有重写。
- 额外在真实 Chromium 中直接使用生产 REPL import map 加载 JsonViewer，确认启动一个真实 Worker，完成搜索、替换且无页面错误；生产资源的两个 LICENSE 引用均存在对应文件。`pnpm install --frozen-lockfile` 退出 0，最终 diff 与格式检查通过。三项修复阶段的 1218 项单测及真实包验证所覆盖的组件/公开包输入没有再修改，未为提交重复执行。

## 第八阶段：虚拟模板转用 SWC，清理旧构建依赖

- Nuxt 虚拟模板保留定向 post-loader 和原有相对路径、MDC/Shiki 所属依赖解析，将 TypeScript 转换改由 `builtin:swc-loader` 执行，目标保持 ES2022。共享 `nuxtTemplateLoaders` 工厂用于 Nuxt 配置和真实构建测试，确保先解析导入再移除类型。
- 扩展现有 Rspack 构建测试，验证泛型、`satisfies`、类型导入不执行、静态再导出、动态相对导入、原始 Vue 源码和 MDC 包依赖均保持；该测试通过。
- 移除文档包直接 esbuild 依赖，以及已无调用方的根 `@vitejs/plugin-vue`、`vite-plugin-dts`。pnpm 同时清理旧声明插件的依赖，并为现有插件补齐可选的 Rspack 2.2.3 peer 绑定；未升级编译器版本。Vite 消费兼容验证及 Vite 类型适配边界仍保留，传递依赖中的 Vite/esbuild 不属于本阶段的移除目标。
- 完整 `check:docs` 通过：198 页、1761 Demo、399 预渲染路由、203 兼容入口、Nuxt 类型和静态产物检查正常。完整 `pnpm check` 通过：178 个文件 / 1218 项单测、73 + 6 项工具测试，以及格式、lint、源码类型检查。
- 生产 Chromium 的全页加载、编辑器、页头、导航和 REPL 模块共 215 项通过。真实 tarball 安装、exports、类型、SSR、JsonViewer Worker 搜索替换通过；Button 根/子路径 9010/9010 bytes，Input 68389/68401，Select 151728/151747，tree-shaking 门禁通过。
- 开发 HMR 首轮在立即还原模板时失败：首次热更新保留了计数 1，随后 30 秒内未收到还原结果；trace 只有首次 hot-update 请求。为定位而开启 `DEBUG=pw:webserver` 后，同一零重试用例完整通过（1.6 分钟），覆盖模板更新/还原保留计数，以及 Markdown 正文更新/还原。没有修改测试断言、超时或产品逻辑；第二次更新缺失的根因尚未确认，因此不能声称 HMR 偶发问题已修复。保留首轮失败和诊断通过的事实。
- 本阶段没有改动组件运行时，没有重复完整组件对照矩阵或更新历史 accepted 指纹。后续阶段仍需评估 Rslint 与浏览器 runner。

- 最终 `pnpm install --frozen-lockfile`、本次文件格式检查和 `git diff --check` 均通过。

## 第九阶段：浏览器 runner 兼容性评估

### 范围与版本

- 用户明确跳过 Rslint 调整，继续下一阶段。Rslint 试装已全部撤回；继续使用原 ESLint 配置和依赖。
- 浏览器测试分为根组件对照、文档静态站矩阵、独立开发 HMR 三组。选取最小独立组 `apps/docs/tests/nuxt-dev/hmr.spec.ts` 作为候选，不修改用例正文、超时、浏览器版本或生产源码。
- 原命令为文档包内 `pnpm exec playwright test -c playwright.dev.config.ts`。Node 24.18.0、Playwright Test / Chromium 运行库 1.62.1，单 worker、零重试、180 秒用例超时；迁移前 JSON 清单为 1 文件 / 1 用例 / 0 跳过 / 0 快照。原用例本轮通过（测试 51.7 秒，总计 1.6 分钟），覆盖 Vue 模板更新及还原保留计数，以及 Markdown 自动更新及还原。
- 临时安装与已有核心相同版本的 `@rstest/playwright` / `@rstest/core` 0.11.12，沿用 `playwright` 1.62.1；registry 查询确认当时 `@rstest/playwright` 最新版本也为 0.11.12。核对已安装声明和实现，不将在线文档中的能力视为本地可用。

### 最小真实 Chromium 探针

- 页面创建、Locator 自动等待断言与失败 trace 可用；故意失败时生成 `trace.zip` 与摘要，两份 trace 的 ZIP 完整性检查通过。
- 访问 `expect(page).toHaveScreenshot` 抛出 `Invalid Chai property: toHaveScreenshot`。现有组件/文档测试中 85 个文件使用截图或快照断言；另有 6 个测试或共享文件使用 `TestInfo` / `testInfo`，依赖附件和输出路径。不能用普通截图取代基线断言，也不能移除证据归档。
- 将截图能力检查从独立 `.only` 探针中移开后，在 `CI=1` 下实际得到 1 passed / 1 skipped、退出 0。已安装配置没有 `forbidOnly` 对应选项；默认 CI 行为不会阻止误提交的聚焦用例。
- 独立设置 `CI=1`、`retry: 1`，令同一用例首次故意失败、第二次成功，实际得到 1 passed / retry x1、退出 0。已安装配置没有 `failOnFlakyTests` 对应选项，不能保留当前“CI 重试用于诊断但 flaky 必须失败”的门禁。这是故意构造的能力探针，不是给项目测试增加重试。
- `@rstest/playwright` 的 `serve` 仅提供静态文件服务；原 HMR 使用的 Nuxt 子进程启动、就绪检测、端口占用拒绝、退出清理仍需额外实现。单个 HMR 用例虽然不依赖截图基线，也仍需要服务生命周期和 `.only` 保护，不能按等价迁移处理。

### 决策与清理

保留三组现有 Playwright Test 配置、命令和验收契约。本阶段完成兼容性评估，**没有迁移浏览器 runner**；不为替换工具名额外维护截图匹配器、测试信息适配及 CI 门禁。后续仅在发布版本补齐上述能力，或另行明确实施这些兼容能力时重新评估。

试装依赖、锁文件变更、临时 Rstest 配置和探针源码全部撤回。已完成的 Rslib、Rsbuild、Rstest 单测、Nuxt Rspack、REPL 和 SWC 迁移保留；ESLint 按用户要求保留，Playwright Test 因当前验收能力缺口保留。不将本次诊断结果计入生产测试通过数量，也不更新任何历史 accepted 指纹。
