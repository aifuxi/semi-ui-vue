# React / Vue 对照基础设施

组件对照在本地使用锁定的完整 Chromium 新 headless 模式（`channel: 'chromium'`、`headless: true`），在同一个 BrowserContext 中运行真实 React 参考页和 Storybook Vue 场景 iframe。两端共享场景 ID、数据、主题、方向、Locale、viewport、DPR、目标和计算样式字段。矩阵与数值门槛统一见[组件契约](component-contract.md)。

## 场景与来源

- 注册表：`packages/test-infra/src/index.ts` 的 `PARITY_SCENARIOS`。
- React 场景：`apps/reference-react/src/scenarios/`，只读解析固定 vendor，使用 React 16 classic JSX。
- Vue 场景：`apps/storybook-vue/src/scenarios/`，从 `@aifuxi/semi-ui-vue/<component>` 公开子路径导入；`src/stories/*.stories.ts` 使用 CSF 注册场景。
- 浏览器规格：`tests/browser/components/*.spec.ts`；行为、键盘、焦点、ARIA 等由各 spec 断言。
- 快照：`tests/browser/snapshots/`，React/Vue 使用独立名称，按宿主平台维护。

新增场景在注册表中列出源码依据、目标、样式字段，未实现时保持 pending。`assertScenarioComparable()` 阻止未完成场景进入对照；`expectComparableTarget()` 比较样式、几何和像素。不能用镜像 DOM 或旧截图冒充实现。

默认端口为 React 4173、Storybook 4174。React 使用 `scenario`、`theme`、`direction`、`locale` 查询参数；Storybook 使用固定 story ID `parity-<scenario>--scenario`，通过 globals 设置主题、方向和语言。Playwright helper 负责映射同一场景，直达页面例如：

```text
http://127.0.0.1:4173/?scenario=button-types&theme=dark&direction=ltr&locale=zh-CN
http://127.0.0.1:4174/iframe.html?id=parity-button-types--scenario&viewMode=story&globals=theme:dark;direction:ltr;locale:zh-CN
```

React 来源验证使用 Rspack 实际模块图，Storybook 使用 Vite 开发模块图或构建 chunk 模块图，两端均输出 `parity-provenance.json`。只认可页面实际请求的资源所包含的模块；动态 story 未被请求时不能计作来源，映射缺失即失败。参考版本文字不能替代来源证明。Vue 子路径加载由 Divider 的 200 请求预算及根入口排除断言保护。旧 App 外壳单测及其专用 stubs 已移除，真实来源与页面加载由浏览器规格验证。

## 运行入口

```bash
pnpm exec playwright test tests/browser/components/button.spec.ts
pnpm test:browser
pnpm test:browser:dev
pnpm test:consumer
```

`pnpm test:browser` 默认由 Playwright 标准 webServer 构建 React 与 Storybook，再启动各自 preview。React 构建保留 development 语义和诊断；Storybook 场景来自公开源码，不代替生产包消费验证。`pnpm test:browser:dev` 使用开发服务诊断。runner 管理服务生命周期，正式对照不复用已有服务；共享 4173/4174 端口的命令不能同时启动。

组件内部串行，组件之间默认 3 workers、0 retries；`PARITY_WORKERS` 可按资源覆盖。服务模式和并发数不能改变阈值，失败、跳过或 flaky 不计通过。运行产物放入 `test-results/components`，标准 HTML 报告位于 `playwright-report/components`。

`pnpm test:consumer` 使用独立配置和真实 tarball 安装环境验证浏览器消费，报告分别位于 `test-results/consumer`、`playwright-report/consumer`，不启动 Storybook/React 服务。组件与 consumer 浏览器测试仅本地执行；CI 保留静态源码、Node 产物验证与发布职责，不以 CI 通过代替本地组件结果。

React 参考关闭按需编译，避免加载新场景时的热更新清除其它页面状态；HMR 仅在开发服务启用，静态 development 构建不注入 refresh 代码。

## 截图与跨平台

React/Vue 对应截图解码为像素后直接比较。组件、Portal 和动效需要独立的行为、稳定布局与局部像素证据，不能只依赖快照断言。

正式本地测试保留宿主 `toHaveScreenshot()` 断言，截图默认禁用动画。实时 React/Vue 对照仍需独立截取两端局部图片，显式使用 `animations: 'disabled'` 并比较像素；宿主基线不能替代两端比较，快照通过也不能替代行为和布局断言。

平台快照独立保留，不以 Linux 覆盖 macOS。更新基线前核对固定来源、公开行为、样式和实际图片；只更新受影响场景。历史移动端或 PNG 字节比较记录不改变当前兼容性承诺。

2026-09-13 切换新 headless 时，以 Playwright 1.62.1 / Chrome for Testing 151.0.7922.34、macOS arm64、DPR 1 校准了 Breadcrumb Popover light、ColorPicker inline light / popup dark、Illustrations light / dark 的 10 张 React/Vue 宿主快照。相同 13 项用例在旧 shell 下通过；新模式先独立验证了固定来源、行为、样式、几何及实时 React/Vue 像素对照，再核对历史图中的边缘和渐变栅格化差异。新图尺寸保持不变，5 组 React/Vue 图片逐像素一致。仅迁移这些受影响快照，保留原有门槛及历史 Git 记录。新模式使用浏览器默认渲染后端；没有为匹配旧图添加 SwiftShader 参数。后续变更浏览器或宿主环境仍需重新核对，不能将校准命令的成功当作正式回归通过。

同日迁移 Storybook 后，移除旧工作台标题与运行信息，仅校准另外 8 张宿主快照：Image 完整预览遮罩透出的旧文字（2 张）、Tree dark 裁剪底部的宿主背景行（2 张），以及 UserGuide narrow light/dark 在标题移除后可见区域由 316×327 增至 316×523（4 张）。已分别核对新旧图片及实时 React/Vue 对照；完整遮罩、几何、交互与像素断言全部保留，未加 mask 或放宽阈值。校准后这三个组件的 17 项测试在正常快照模式下全部通过。

构建、Vitest dom/node、SSR、tarball 与发布检查见[验证入口](validation.md)。Storybook 与固定参考应用独立运行，不依赖文档站。本次综合验证状态见[迁移方案](vue-testing-strategy-proposal.md#当前验证状态)。
