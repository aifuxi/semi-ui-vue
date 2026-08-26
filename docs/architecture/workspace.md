# pnpm workspace 工程边界

## 目标

本骨架把“参考运行时、Vue 实现、可发布资产和验收证据”分开管理。目录建立本身不代表任何 Semi 组件已经完成复刻。

## 目录职责

```text
apps/
  reference-react/       承载固定 v2.102.0 React 参考场景的工作台
  docs-vue/              Vue 文档、演示与对照场景
packages/
  ui/                    Vue 主组件包（拟公开发布）
  foundation-integration/唯一的 Foundation 运行时集成边界（私有）
  theme-default/         上游 SCSS 编译边界与根 CSS 入口（拟公开发布）
  icons/                 稳定图标（拟公开发布）
  icons-lab/             实验图标（拟公开发布）
  illustrations/         插画（拟公开发布）
  test-infra/            对照矩阵、阈值和共享测试工具（私有）
tests/browser/           只运行 Playwright 固定 Chromium 的跨应用测试
vendor/semi-design/      唯一、只读的 v2.102.0 参考源码
```

`@workspace/*` 是内部占位名称，全部包暂时标记为 `private`，不构成最终品牌或 npm scope 承诺。

## 依赖方向

- `apps/reference-react` 是唯一允许为参考运行读取本地固定上游的应用，后续负责提供真实 React 参考场景。
- `apps/docs-vue` 消费 Vue 侧包并承载文档和可复现演示。
- `packages/ui` 只通过 `packages/foundation-integration` 适配 Foundation 逻辑；不能在组件目录中散落导入 Foundation 源码。
- `packages/theme-default` 直接从只读上游 SCSS 编译样式；`packages/icons*` 与 `packages/illustrations` 后续各自拥有资产生成脚本。
- `packages/theme-default/src/index.scss` 只作为仓库内构建入口；发布文件只包含编译后的 CSS，消费者不依赖 submodule。
- 两个对照应用共用 `packages/test-infra/src/harness.css`，避免参考壳层的字体和布局环境发生漂移。
- `packages/foundation-integration` 和 `packages/test-infra` 永不发布；公开包构建后不能留下对它们或 `vendor/` 的运行时引用。
- `vendor/**` 必须始终排除在格式化、lint、类型检查、单测和项目构建扫描之外。

`apps/reference-react` 已建立只读源码解析/构建适配器，并以 Button 公开入口作为首个真实运行场景。Vite 直接编译固定 submodule 的 TSX；Sass 1.54.9 通过应用内构建插件生成虚拟 CSS，避免由 Vite 8 改用新版 Sass。浏览器测试还会核对真实模块请求来自 `vendor/semi-design`，不能只依赖页面中的版本文字。

React/Vue 两端通过 `packages/test-infra` 的共享场景契约接收相同 URL 参数、数据与目标定义。未完成的 Vue 场景保持 `pending`，`assertScenarioComparable` 会阻止其进入样式、几何和截图对照。详细扩展流程见 `docs/testing/react-vue-parity.md`。

Button 是首个进入 `ready` 的 Vue 垂直切片：`packages/ui/src/button/` 提供 Button、ButtonGroup、SplitButtonGroup 根/子路径 ESM 与声明，`packages/theme-default/button.css` 提供逐组件样式。Button 没有运行时 Foundation 状态机；ButtonGroup 的子 VNode 合并和 SplitButtonGroup 的客户端 Observer 分别隔离在组件边界内。对齐矩阵与 React→Vue 迁移见 `docs/components/button/`。

Divider 是第二个进入 `ready` 的垂直切片：`packages/ui/src/divider/` 提供根/`divider` 子路径 ESM 与声明，`packages/theme-default/divider.css` 提供逐组件样式。它没有运行时 Foundation 状态机；纯文本与自定义 VNode 的 slot DOM 分支隔离在内容 renderer 中。完整矩阵见 `docs/components/divider/`。

Icon 是第三个进入 `ready` 的横向基础设施切片：`packages/icons` 提供 Icon 基座、`convertIcon` 与稳定版 523 个图标，`packages/icons-lab` 独立提供 Lab 84 个图标，`packages/ui/src/icon/` 只转发稳定版基座。两套图标均从固定 submodule 的 TSX AST 生成 Vue `h()` 源码并由 `check:icons` 阻止漂移；`packages/theme-default/icon.css` 提供逐组件样式。完整矩阵与 React→Vue 迁移见 `docs/components/icon/`。

Space 是第四个进入 `ready` 的 Vue 垂直切片：`packages/ui/src/space/` 提供根/`space` 子路径 ESM 与声明，`packages/theme-default/space.css` 提供逐组件样式。组件保持固定 Adapter 的 flex DOM、预设/数字/数组 gap、vertical、wrap 和 RTL 契约，不需要 Foundation 运行时实例。完整矩阵见 `docs/components/space/`。

FloatButton 是第五个进入 `ready` 的 Vue 垂直切片：`packages/ui/src/float-button/` 同时提供 FloatButton 与 FloatButtonGroup，并在内部复现其公开 `badge` 配置所需 DOM；`packages/theme-default/float-button.css` 独立包含 FloatButton、Badge 与 Icon 样式。完整矩阵见 `docs/components/float-button/`。

Foundation 集成包当前也只建立了边界，还没有组件入口。后续必须逐组件处理 `semi-animation`、`semi-json-viewer-core` Worker、第三方依赖与 SSR 延迟加载；公开类型若引用 Foundation 符号，应由 `ui` 提供自包含 facade，发布声明不得泄漏私有包路径。

单元测试与源码共置在各 workspace 的 `src/` 下；Vue 包使用 `.test.ts` / `.spec.ts`，React 参考应用额外允许 `.test.tsx` / `.spec.tsx`。该约定保证 Vitest 能发现的测试同时纳入对应 workspace 的 TypeScript 检查。

## 固定运行环境

- Node.js 开发版本：`24.18.0`；支持范围：`^20.19.0 || ^22.13.0 || ^24.0.0`。
- pnpm：`11.19.0`，统一 lockfile，依赖精确锁定。
- Vue：`3.5.41`，主包 peer 范围 `>=3.5.0`。
- React 参考运行时：`16.14.0`，与上游固定版本保持一致。
- Sass：主题包独占 `1.54.9`，避免新版 Sass 改变上游旧 SCSS 的编译行为。
- 浏览器：Playwright `1.62.1` 自带的 Chromium；不建立 Firefox/WebKit 项目。
- 首份 CSS 校准截图以 macOS（Darwin）为平台基线。Playwright 保留平台后缀；Linux CI 必须审核并并存自己的基线，不能跨平台盲目更新。

## 新增组件的最小流程

1. 先从 `docs/inventory/semi-v2.102.0.json` 定位公开导出、子路径、Adapter、Foundation、主题、文档、依赖与测试资产，再回到固定上游核对原始源码。
2. 在组件文档目录建立完整对齐矩阵和 React→Vue API 映射。
3. 在两个应用中建立同数据、同字体、同 viewport、同动画时刻的参考场景。
4. 实现 Vue 源码、类型、样式入口、中英文文档和迁移说明。
5. 增加公开行为单测、Chromium 行为/无障碍/视觉测试，以及适用时的 SSR 与 hydration 测试。
6. 构建真实包并检查安装、导入、类型、样式、SSR、许可证与 SBOM，全部证据齐全后才标记完成。

## 当前质量入口

- `pnpm check:vendor`：确认 submodule 的 tag 和 SHA。
- `pnpm check:inventory`：重建并逐字核对固定上游的组件、API、文档、依赖与资产 inventory，防止生成物漂移。
- `pnpm check:boundaries`：阻止 Vue 运行时源码通过静态、动态、require 或样式导入绕过上游边界。
- React 参考应用的依赖清单同样被精确锁定；真实场景接通后还必须断言模块解析结果来自本地 `vendor/semi-design`，不能安装线上 `@douyinfe/semi-ui` 替代。
- `pnpm format:check`：检查仓库自有文件格式，跳过 `vendor/**`。
- `pnpm lint`：检查自有 JavaScript、TypeScript、TSX 和 Vue 文件。
- `pnpm typecheck`：逐 workspace 执行 TypeScript/Vue 类型检查。
- `pnpm test:unit`：Vitest + jsdom 的公开行为单测入口。
- `pnpm build`：构建两个应用、ESM/声明包和默认主题 CSS。
- `pnpm test:theme`：从只读上游重建完整根 CSS，并核对 v2.102.0 的组件导入顺序与代表性选择器。
- `pnpm test:ssr`：先重建拟公开 JavaScript 包，再在无 DOM 的 Node 环境导入并扫描私有边界泄漏。
- `pnpm test:pack`：构建真实 tarball，在临时消费者中离线安装并验证 exports、ESM、类型、样式和 SSR import。
- 每个拟发布包的构建都会写入 Semi Design 完整许可证、第三方声明和 SPDX 2.3 SBOM；项目自身许可证冻结前保持 `private`。
- SBOM 默认记录实际构建时间；可复现发布必须传入标准的 `SOURCE_DATE_EPOCH`，该值也参与文档命名空间指纹。
- `pnpm test:browser`：单一 Chromium worker 启动 React/Vue 两个服务，在同一 BrowserContext 中执行来源、行为、计算样式、几何与视觉对照。
- `pnpm check:full`：执行以上完整本地门禁。
