# 工作区架构

## 目录与依赖

| 目录                                           | 职责与边界                                           |
| ---------------------------------------------- | ---------------------------------------------------- |
| `packages/ui`                                  | Vue 组件；通过私有 Foundation 集成层使用固定上游逻辑 |
| `packages/foundation-integration`              | 唯一 Foundation/特殊运行时编译边界，永不发布         |
| `packages/theme-default`                       | 从固定 SCSS 编译根与逐组件 CSS                       |
| `packages/icons`、`icons-lab`、`illustrations` | 从固定 TSX AST 生成 Vue 资产，生成检查防止漂移       |
| `packages/test-infra`                          | 场景、环境、阈值和对照 helper，永不发布              |
| `apps/reference-react`                         | 从固定 vendor 运行真实 React 参考场景                |
| `apps/storybook-vue`                           | Storybook Vue 3/Vite 场景站，从公开组件子路径导入    |
| `apps/docs`                                    | VitePress 组件库文档站，正文从固定基线构建期生成     |
| `tests/browser`                                | 锁定 Chromium 的组件对照验收                         |
| `tests/consumer`                               | 真实 tarball 的独立 Chromium 消费测试                |
| `docs/components`                              | 静态组件契约、API 说明与已知差异                     |
| `vendor/semi-design`                           | 唯一只读上游；版本见根 AGENTS.md                     |

`@workspace/*` 为私有身份，五个 `@aifuxi/*` 公开包由 Changesets 同步版本。公开包不能留下 vendor、私有 workspace 的运行时引用或声明路径；消费者无需 submodule。源码类型检查通过 tsconfig 映射，不依赖已有 dist。

## 构建与产物

UI 与资产包使用 Rslib 多入口 ESM；Vue 保持 external，稳定图标/插画以公开包身份依赖。UI 内联所需 Foundation，公开声明使用自包含 facade。共享 ESM 模块可拆分，Prism 注册等副作用由精确 sideEffects 元数据保护。

主题包发布编译 CSS，`src/index.scss` 仅供仓库构建。固定上游 SCSS 使用 Sass 1.54.9，应用中通过 `sass-legacy` 别名隔离；Vite 的新版可选 Sass peer 用途不同。

JsonViewer 的固定 core 与 jsonc-parser 经私有构建插件编入内联 Worker；公开包不泄漏外置 vendor 路径。其他特殊第三方运行时同样在集成边界处理 SSR 延迟加载、类型和归属，不复制 vendor 后独立维护。

每个公开包携带 MIT、第三方声明和 SPDX SBOM。可复现构建使用 `SOURCE_DATE_EPOCH`。版本、依赖和构建入口以各 package.json、lockfile 与 mise.toml 为准，组件进度与实现细节见[组件目录](../components/)。

## Storybook、参考应用、文档站与测试

Nuxt 文档应用及其构建、REPL、站点资源和逐示例验收已移除，退役范围见[说明](../documentation/README.md)。
`apps/docs` 是不参与发布的私有 VitePress 应用：站点外壳使用基线站点 SCSS 与 `@douyinfe/semi-site-doc-style`
的构建期编译产物，正文、导航、检索索引和来源清单由 `apps/docs/scripts/*.mjs` 从只读基线生成到已忽略目录，
仓库不保存派生正文；站点控件与样式来自公开包 `@aifuxi/semi-ui-vue`、`@aifuxi/semi-theme-default`。
首版只交付组件使用说明与示例占位，不含示例代码、REPL 与自动化测试，验收由人工 UI 走查完成，
入口见 [apps/docs/README.md](../../apps/docs/README.md)。

Vue 场景由 Storybook Vue 3/Vite 承载，React 参考继续使用 Rsbuild、React 16 classic JSX；两端共享 harness CSS。React 的 Rspack 模块图与 Storybook 的 Vite 模块图分别生成来源证明，核对页面实际请求的代码。Vue 场景保持 pending，直到契约可对照；场景从组件子路径导入，避免根入口加载全库。Storybook 仅承载场景和调试，交互、布局和像素断言统一由 Playwright Test 执行。

源码测试与实现共置于各包 `src` 下，`.test.ts` / `.spec.ts` 纳入类型检查。Vitest dom project 使用 Vue Test Utils/jsdom，Node project 验证无 DOM SSR、纯工具和私有集成；hydration 与普通客户端 mount 分开命名。SFC 使用 Vue/Vite 编译，Prism 与 JSON Worker 通过私有集成插件适配。旧 Rstest 配置及覆盖率补丁、App 外壳测试与专用 stubs、测试 alias 生成器已移除。

组件与 consumer 浏览器测试仅本地执行。组件 Playwright 配置通过标准 webServer 构建 React/Storybook 并 preview；consumer 配置独立验证真实 tarball，不加载 Storybook。CI 保留静态源码、Node 产物与发布职责。工具切换不代表全部组件验收完成；组件契约见[组件契约](../testing/component-contract.md)，执行范围见[验证入口](../testing/validation.md)，环境与 IDE 见[工具链](toolchain.md)。
