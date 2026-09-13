# 工作区架构

## 目录与依赖

| 目录                                           | 职责与边界                                           |
| ---------------------------------------------- | ---------------------------------------------------- |
| `packages/ui`                                  | Vue 组件；通过私有 Foundation 集成层使用固定上游逻辑 |
| `packages/foundation-integration`              | 唯一 Foundation/特殊运行时编译边界，永不发布         |
| `packages/theme-default`                       | 从固定 SCSS 编译根与逐组件 CSS                       |
| `packages/icons`、`icons-lab`、`illustrations` | 从固定 TSX AST 生成 Vue 资产，生成检查防止漂移       |
| `packages/test-infra`                          | 场景、环境、阈值和对照 helper，永不发布              |
| `apps/docs`                                    | Nuxt Rspack + Nuxt Content 双语门户，消费公开 Vue 包 |
| `apps/reference-react`                         | 从固定 vendor 运行真实 React 参考场景                |
| `apps/parity-vue`                              | 从公开组件子路径导入 Vue 场景                        |
| `tests/browser`                                | 锁定 Chromium 的跨应用验收                           |
| `vendor/semi-design`                           | 唯一只读上游；版本见根 AGENTS.md                     |

`@workspace/*` 为私有身份，五个 `@aifuxi/*` 公开包由 Changesets 同步版本。公开包不能留下 vendor、私有 workspace 的运行时引用或声明路径；消费者无需 submodule。源码类型检查通过 tsconfig 映射，不依赖已有 dist。

## 构建与产物

UI 与资产包使用 Rslib 多入口 ESM；Vue 保持 external，稳定图标/插画以公开包身份依赖。UI 内联所需 Foundation，公开声明使用自包含 facade。共享 ESM 模块可拆分，Prism 注册等副作用由精确 sideEffects 元数据保护。

主题包发布编译 CSS，`src/index.scss` 仅供仓库构建。固定上游 SCSS 使用 Sass 1.54.9，应用中通过 `sass-legacy` 别名隔离；Vite 的新版可选 Sass peer 用途不同。

JsonViewer 的固定 core 与 jsonc-parser 经私有构建插件编入内联 Worker；公开包不泄漏外置 vendor 路径。其他特殊第三方运行时同样在集成边界处理 SSR 延迟加载、类型和归属，不复制 vendor 后独立维护。

每个公开包携带 MIT、第三方声明和 SPDX SBOM。可复现构建使用 `SOURCE_DATE_EPOCH`；它也参与文档构建指纹。版本、依赖和构建入口以各 package.json、lockfile 与 mise.toml 为准，组件进度与实现细节见[组件目录](../components/)。

## 文档与对照应用

文档构建适配器集中读取固定站点 SCSS、字体和图标，运行时仅消费生成资源和公开包。REPL 的编译器、Worker、模块与类型从本站加载，详见[文档站](../documentation/README.md)。

两个对照应用使用 Rsbuild 和共享 harness CSS。React 参考使用 React 16 classic JSX；模块来源证明核对实际请求代码来自 vendor。Vue 场景保持 pending，直到契约可对照；场景从组件子路径导入，避免根入口加载全库。

源码测试与实现共置于各包 `src` 下，`.test.ts` / `.spec.ts` 纳入类型检查；React 应用也允许 TSX。组件验收见[组件契约](../testing/component-contract.md)，测试和构建命令见[验证入口](../testing/validation.md)，环境与 IDE 见[工具链](toolchain.md)。
