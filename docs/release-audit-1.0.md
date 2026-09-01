# 1.0 发布审计

本文记录首个稳定版本的发布审计。它是可持续更新的审计台账，不替代 `docs/releasing.md` 的发布操作手册，也不授权提交、打标签、推送或 npm 发布。

## 2026-09-01 第一轮

审计起始基线为 `8144bf422b7ca64ff99c1c1a7dddbc8ae81457f1`，固定 Semi Design 参考仍为 `v2.102.0` / `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。README 与 Inventory 均为 85/85；`_base` 与 `_utils` 没有独立 DOM 场景，因此全仓按 84 个组件浏览器规格验收。

### 已完成

- 将生产依赖 `lodash` 从 4.17.21 升级至 4.18.1、`prismjs` 从 1.29.0 升级至 1.30.0，并同步公开边界、许可和架构记录。
- 新增固定官方 npm registry 的 production dependency audit；moderate、high、critical 漏洞阻断本地 `release:check` 与发布工作流。
- `release:check` 全量通过：production audit 无已知漏洞，163 个 Vitest 文件共 1116 项通过，构建、86 个主题入口、SSR 与真实 tarball 消费通过，Chromium 589/589 通过，五个公开包统一为 `0.1.0-alpha.4` 且 dist-tag 为 `next`。
- 浏览器回归覆盖桌面/移动、light/dark、适用时 RTL 与 Locale；没有更新截图基线，没有新增 accepted deviation。

### 当前阻断项

- 当前工作树包含本轮审计修复，尚未形成干净的候选提交。
- HEAD 没有精确版本标签；现有 `v0.1.0-alpha.4` 指向更早提交，不是当前候选。
- 五个公开包仍为 `0.1.0-alpha.4`，尚未做首个稳定版本的统一升版决策。
- 当前 HEAD 尚未推送，因此没有对应的 GitHub hosted CI / OIDC 发布证据。
- npm 当前 `next` 指向 `0.1.0-alpha.4`，`latest` 仍停留在首次引导的 `0.1.0-alpha.0`；首个稳定版本发布后必须复核五包 dist-tag。

### 非阻断观察

- Lottie 构建仍会报告第三方 `lottie-web` direct-eval 警告，应用构建还会报告大 chunk 提示；真实 tarball、公开子路径、tree-shaking 边界和 SSR 门禁均通过，当前记录为后续体积与供应链观察项。
- React v2.102.0 参考场景会把 `InputNumber.scientificNotation` 透传到 DOM 并产生开发警告；对应 React/Vue 行为、样式、几何和像素门禁通过，属于固定上游参考噪声。

## 候选发布前下一步

1. 评审并提交本轮审计修复，保持工作树干净。
2. 明确首个稳定版本号；仅在显式授权后运行会自动提交和打标签的 `release:bump`。
3. 在精确标签提交上再次运行 `pnpm release:check`，分别推送提交与标签。
4. 等待 GitHub 发布工作流完成，核对 provenance、五包版本与依赖关系。
5. 从空目录安装稳定版本，验证类型、样式、SSR、浏览器消费与 `latest` dist-tag。
