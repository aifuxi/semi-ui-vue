# 工作区架构

## 目录与依赖

| 目录                                           | 职责与边界                                           |
| ---------------------------------------------- | ---------------------------------------------------- |
| `packages/ui`                                  | Vue 组件；通过私有 Foundation 集成层使用固定上游逻辑 |
| `packages/foundation-integration`              | 唯一 Foundation/特殊运行时编译边界，永不发布         |
| `packages/theme-default`                       | 从固定 SCSS 编译全量主题及去重的模块化 CSS           |
| `packages/theme-modern`                        | 可选现代主题，仅覆盖四档圆角变量                     |
| `packages/icons`、`icons-lab`、`illustrations` | 从固定 TSX AST 生成 Vue 资产，生成检查防止漂移       |
| `packages/test-infra`                          | 场景、环境、阈值和对照 helper，永不发布              |
| `apps/reference-react`                         | 从固定 vendor 运行真实 React 参考场景                |
| `apps/storybook-vue`                           | Storybook Vue 3/Vite 场景站，从公开组件子路径导入    |
| `apps/docs`                                    | VitePress 文档站，维护本地正文、Vue 示例与静态资源   |
| `apps/theme-studio`                            | 独立主题工作台，只消费公开 Vue 组件、图标与主题包    |
| `tests/browser`                                | 锁定 Chromium 的组件对照验收                         |
| `tests/consumer`                               | 真实 tarball 的独立 Chromium 消费测试                |
| `docs/components`                              | 静态组件契约、API 说明与已知差异                     |
| `vendor/semi-design`                           | 唯一只读上游；版本见根 AGENTS.md                     |

`@workspace/*` 为私有身份，六个 `@aifuxi/*` 公开包由 Changesets 同步版本。公开包不能留下 vendor、私有 workspace 的运行时引用或声明路径；消费者无需 submodule。源码类型检查通过 tsconfig 映射，不依赖已有 dist。

## 构建与产物

UI 与资产包使用 Rslib 多入口 ESM；Vue 保持 external，稳定图标/插画以公开包身份依赖。UI 内联所需 Foundation，公开声明使用自包含 facade。共享 ESM 模块可拆分，Prism 注册等副作用由精确 sideEffects 元数据保护。

主题包发布编译 CSS：`index.css` 是全量主题；模块化入口由 `base.css`、复用的 Foundation CSS 和逐组件 CSS 组成，依赖与导入顺序见包内 `style-dependencies.json`。固定上游 SCSS 使用 Sass 1.54.9，应用中通过 `sass-legacy` 别名隔离；Vite 的新版可选 Sass peer 用途不同。`semi-theme-modern` 作为可选覆盖包，需在默认主题之后导入，仅覆盖四档圆角变量，其他样式沿用默认主题。

R-000072 的公开排版主题通过 CSS 自定义属性消费，业务自定义主题不依赖 Sass 或构建插件。内部主题适配器只读解析固定 vendor 的变量引用和声明语义，在内存中注入 CSS fallback；构建产物与开发虚拟样式共用编译入口，不复制维护上游样式。默认值保留固定基线，颜色生成器独立于本项。变量、局部作用域和弹层继承契约见[主题包说明](../../packages/theme-default/README.md#css-排版主题)。

JsonViewer 的固定 core 与 jsonc-parser 经私有构建插件编入内联 Worker；公开包不泄漏外置 vendor 路径。其他特殊第三方运行时同样在集成边界处理 SSR 延迟加载、类型和归属，不复制 vendor 后独立维护。

每个公开包携带 MIT、第三方声明和 SPDX SBOM。可复现构建使用 `SOURCE_DATE_EPOCH`。版本、依赖和构建入口以各 package.json、lockfile 与 mise.toml 为准，组件进度与实现细节见[组件目录](../components/)。

## Storybook、参考应用、文档站与测试

`apps/theme-studio` 是与 docs 平级的私有 Vue/Vite 应用，具有独立入口、hash 路由、状态、开发端口与构建产物；不依赖 docs 的布局或示例基础设施。文档仅保留 API、代码和可配置的工作台入口。工作台通过公开颜色 API、编译 CSS 与排版变量实时预览默认和局部主题，不要求用户使用 Sass 或专用主题插件；入口、首期范围及验证见[应用说明](../../apps/theme-studio/README.md)。

Nuxt 文档应用及其构建、REPL、站点资源和逐示例验收已移除，退役范围见[说明](../documentation/README.md)。
`apps/docs` 是不参与公开包发布的私有 VitePress 应用。仓库维护 `content/**/*.md` 正文、
`.vitepress/theme/demo/examples/` 中的可运行 Vue 示例、`data/code-sources.json` 中的展示源码和本地静态资源。
`scripts/prepare-index.mjs` 只读取这些本地内容，校验页面、分类与示例引用，并生成已忽略的导航和检索索引；构建不从 vendor 生成正文。
站点保留已编译的上游站点排版素材及归属说明，控件与主题消费公开包 `@aifuxi/semi-ui-vue`、
`@aifuxi/semi-theme-default` 和 `@aifuxi/semi-theme-modern`。类型与文档生产态 Playwright 测试按影响运行，
入口和编辑方式见 [apps/docs/README.md](../../apps/docs/README.md)。

Vue 场景由 Storybook Vue 3/Vite 承载，React 参考继续使用 Rsbuild、React 16 classic JSX；两端共享 harness CSS。React 的 Rspack 模块图与 Storybook 的 Vite 模块图分别生成来源证明，核对页面实际请求的代码。Vue 场景保持 pending，直到契约可对照；场景从组件子路径导入，避免根入口加载全库。Storybook 仅承载场景和调试，交互、布局和像素断言统一由 Playwright Test 执行。

源码测试与实现共置于各包 `src` 下，`.test.ts` / `.spec.ts` 纳入类型检查。Vitest dom project 使用 Vue Test Utils/jsdom，Node project 验证无 DOM SSR、纯工具和私有集成；hydration 与普通客户端 mount 分开命名。SFC 使用 Vue/Vite 编译，Prism 与 JSON Worker 通过私有集成插件适配。旧 Rstest 配置及覆盖率补丁、App 外壳测试与专用 stubs、测试 alias 生成器已移除。

组件与 consumer 浏览器测试仅本地执行。组件 Playwright 配置通过标准 webServer 构建 React/Storybook 并 preview；consumer 配置独立验证真实 tarball，不加载 Storybook。CI 保留静态源码、Node 产物与发布职责。工具切换不代表全部组件验收完成；组件契约见[组件契约](../testing/component-contract.md)，执行范围见[验证入口](../testing/validation.md)，环境与 IDE 见[工具链](toolchain.md)。

### 可选颜色生成入口

`@aifuxi/semi-theme-default/colors` 提供独立、零依赖的纯 ESM 颜色生成器和类型。HSV 算法以固定 DSM 参考结果验收，默认 CSS 仍来自固定 Semi v2.102.0；品牌生成算法不参与默认主题构建。构建时只读编译 vendor 的全局颜色语义，生成包内静态数据，消费者不依赖 Sass、vendor 或构建插件。

公开入口包含单色阶、完整色盘、双模式主题及 CSS 序列化。完整主题同时声明基础色和语义引用，私有双模式载体支持嵌套 always-light/dark；默认 Portal 桥接颜色、排版与模式，显式容器优先。输入、输出及使用方式见[颜色主题契约](../../packages/theme-default/README.md#品牌颜色生成器)。
