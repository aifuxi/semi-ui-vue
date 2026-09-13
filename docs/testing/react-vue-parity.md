# React / Vue 对照基础设施

组件对照使用锁定的完整 Chromium 新 headless 模式（`channel: 'chromium'`、`headless: true`），在同一个 BrowserContext 中运行真实 React 参考页和 Vue 页面。两端共享场景 ID、数据、主题、方向、Locale、viewport、DPR、目标和计算样式字段。矩阵与数值门槛统一见[组件契约](component-contract.md)。

## 场景与来源

- 注册表：`packages/test-infra/src/index.ts` 的 `PARITY_SCENARIOS`。
- React 场景：`apps/reference-react/src/scenarios/`，只读解析固定 vendor，使用 React 16 classic JSX。
- Vue 场景：`apps/parity-vue/src/`，从 `@aifuxi/semi-ui-vue/<component>` 公开子路径导入。
- 浏览器规格：`tests/browser/components/*.spec.ts`；行为、键盘、焦点、ARIA 等由各 spec 断言。
- 快照：`tests/browser/snapshots/`，React/Vue 使用独立名称，按宿主平台维护。

新增场景在注册表中列出源码依据、目标、样式字段，未实现时保持 pending。`assertScenarioComparable()` 阻止未完成场景进入对照；`expectComparableTarget()` 比较样式、几何和像素。不能用镜像 DOM 或旧截图冒充实现。

两端接受 `scenario`、`theme`、`direction`、`locale` 查询参数，默认端口为 React 4173、Vue 4174。例如：

```text
http://127.0.0.1:4173/?scenario=button-types&theme=dark&direction=ltr&locale=zh-CN
http://127.0.0.1:4174/?scenario=button-types&theme=dark&direction=ltr&locale=zh-CN
```

来源验证使用 Rspack 实际模块图和 `parity-provenance.json`，只认可页面实际请求的模块；映射缺失即失败。参考版本文字不能替代来源证明。Vue 子路径加载由 Divider 的 200 请求预算及根入口排除断言保护。

## 运行入口

```bash
pnpm exec playwright test tests/browser/components/button.spec.ts
pnpm test:browser
pnpm test:browser:built
```

默认使用开发服务；`PARITY_SERVER_MODE=build`（CI 默认）会准备独立预构建工作台，仍保留 development 语义和 React 诊断，不代替生产包消费验证。runner 管理服务生命周期，正式对照不复用已有服务。共享 4173/4174 端口的命令不能同时启动。

组件内部串行，组件之间默认 3 个 worker，`PARITY_WORKERS` 可按资源覆盖；服务模式和并发数不能改变阈值或 flaky 门禁。`pnpm benchmark:parity dev|warm|build` 仅用于性能诊断。

React 参考关闭按需编译，避免加载新场景时的热更新清除其它页面状态。`reference-stability.spec.ts` 保留此回归。不要用重试或单例通过替代跨页面稳定性。

## 截图与跨平台

React/Vue 对应截图解码为像素后直接比较。组件、Portal 和动效需要独立的行为、稳定布局与局部像素证据，不能只依赖快照断言。

发布 CI 的 `PARITY_IGNORE_HOST_BASELINES=1` 会跳过 `toHaveScreenshot()`；因此不能依赖它等待动画或证明两端一致。该模式仍须独立截取两端局部图片，显式使用 `animations: 'disabled'` 并比较像素。

平台快照独立保留，不以 Linux 覆盖 macOS。更新基线前核对固定来源、公开行为、样式和实际图片；只更新受影响场景。历史移动端或 PNG 字节比较记录不改变当前兼容性承诺。

2026-09-13 切换新 headless 时，以 Playwright 1.62.1 / Chrome for Testing 151.0.7922.34、macOS arm64、DPR 1 校准了 Breadcrumb Popover light、ColorPicker inline light / popup dark、Illustrations light / dark 的 10 张 React/Vue 宿主快照。相同 13 项用例在旧 shell 下通过；新模式先独立验证了固定来源、行为、样式、几何及实时 React/Vue 像素对照，再核对历史图中的边缘和渐变栅格化差异。新图尺寸保持不变，5 组 React/Vue 图片逐像素一致。仅迁移这些受影响快照，保留原有门槛及历史 Git 记录。新模式使用浏览器默认渲染后端；没有为匹配旧图添加 SwiftShader 参数。后续变更浏览器或宿主环境仍需重新核对，不能将校准命令的成功当作正式回归通过。

构建、SSR、tarball 与发布检查见[验证入口](validation.md)。对照工作台独立运行，不依赖文档站。
