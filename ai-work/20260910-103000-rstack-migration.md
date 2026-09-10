# AI 工作记录：Rstack 工具链迁移

- 日期：2026-09-10
- 状态：第二阶段完成；整体迁移进行中
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
