---
name: vue-testing-best-practices
version: 1.0.0
license: MIT
author: github.com/vuejs-ai
description: 编写或排查 Vue 测试时使用，按公开行为选择 Rstest、Vue Test Utils 与真实浏览器证据；在本仓库复用已有 pnpm 和 Playwright Chromium 配置。
---

依据待验证的公开行为选择测试层级，按症状读取相关参考，不默认加载全部文件。

## 本仓库的测试边界

- 先读已有 [Rstest 配置](../../../rstest.config.ts)、[Playwright 配置](../../../playwright.config.ts) 和 [pnpm 脚本](../../../package.json)。复用锁定依赖、fixture 与命令；参考中的安装示例不是新增依赖或替换 runner 的指令。通用参考中的 Vitest 示例需使用本仓库的 `@rstest/core` 与 `rs` API。
- 黑盒单测验证 props、emits、slots、v-model 与可观察输出；公开 DOM/class 兼容契约也应直接验证。私有 state/method、Foundation spy 和结构快照不能替代公开行为证据。
- 样式、布局、真实焦点、拖拽、ResizeObserver、Portal 与动效复用 Playwright Chromium。Vitest Browser Mode 不是额外前置条件，不因参考示例新增第二套浏览器 runner。
- Composable 依赖生命周期或 inject 时，用宿主组件建立上下文，在 mount 前设置 provider，并在结束时 unmount。Teleport stub 只适合隔离不涉及 Portal 的单测，不能证明容器、焦点或卸载行为。
- SSR-safe import、SSR render 与浏览器 hydration 是不同证据；按组件契约分别验证。不能以 jsdom 或客户端挂载结果代替 SSR，也不能以服务端渲染结果代替浏览器清理与重开验证。
- 文档示例或严格视觉验收先读 [文档工作流](../../../docs/documentation/workflow.md)；组件对齐的完整门禁由 [AGENTS.md](../../../AGENTS.md) 和 [垂直切片技能](../semi-ui-vue-vertical-slice/SKILL.md) 定义。

### Testing

- 已确认项目缺少测试基础设施，需要设计 Vitest 配置 → See [testing-vitest-recommended-for-vue](reference/testing-vitest-recommended-for-vue.md)
- Tests keep breaking when refactoring component internals → See [testing-component-blackbox-approach](reference/testing-component-blackbox-approach.md)
- Tests fail intermittently with race conditions → See [testing-async-await-flushpromises](reference/testing-async-await-flushpromises.md)
- Composables using lifecycle hooks or inject fail to test → See [testing-composables-helper-wrapper](reference/testing-composables-helper-wrapper.md)
- Getting "injection Symbol(pinia) not found" errors in tests → See [testing-pinia-store-setup](reference/testing-pinia-store-setup.md)
- Components with async setup won't render in tests → See [testing-suspense-async-components](reference/testing-suspense-async-components.md)
- Snapshot tests keep passing despite broken functionality → See [testing-no-snapshot-only](reference/testing-no-snapshot-only.md)
- 扩展已有 E2E、组件行为或视觉对照 → See [testing-e2e-playwright-recommended](reference/testing-e2e-playwright-recommended.md)
- Tests need to verify computed styles or real DOM events → See [testing-browser-vs-node-runners](reference/testing-browser-vs-node-runners.md)
- Testing components created with defineAsyncComponent fails → See [async-component-testing](reference/async-component-testing.md)
- Teleported modal content can't be found in wrapper queries → See [teleport-testing-complexity](reference/teleport-testing-complexity.md)

## Reference

- [Vue.js Testing Guide](https://vuejs.org/guide/scaling-up/testing)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
