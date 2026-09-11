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

## 2026-09-11 后续阶段

以上第一轮内容保留为历史证据，其中版本号、未提交状态和旧标签阻断项不描述当前候选。Changesets 已在 `6302448` 接管发布，旧 `release:bump` 已删除，发布不再要求预先存在精确版本标签。迁移的本地验证见 [工作记录](../ai-work/20260911-125341-changesets-migration.md)，现行操作以 [发布手册](releasing.md) 为准。

当前五包 `0.1.0` 是未发布迁移基线；待处理 major changeset 与 next 状态使首个机器人版本 PR 目标为 `1.0.0-next.0`。该基线不得直接发布，也不能因 85/85 组件 ready 或本地迁移门禁通过，就视为稳定版产品验收完成。

### 候选发布前下一步

1. 按 [文档双线计划](documentation/batch-plan.md) 推进严格验收；859 项已映射不等于完成视觉和行为验收。有效数量以当前源码的覆盖账本为准，历史证据失效时必须完整重验对应批次。
2. 完成文档章节/API/迁移审阅、站点壳与搜索/链接/编辑器回归，以及 Nuxt/REPL 依赖许可审计。
3. 完成 GitHub App 和仓库变量/secret、master 保护、五包 Trusted Publisher 配置核对，并实证机器人 PR 创建/更新能触发 CI。迁移记录中这些外部项尚未完成；本次本地工作不能证明它们已就绪。
4. 由机器人维护 next 版本 PR，在合并后的准确候选上完成质量、Chromium、原始 pack artifact 隔离消费门禁，再经 npm Environment 审核发布；复核 provenance、五包版本/精确依赖、包级标签与 Release、registry 安装及渠道。
5. 产品验收闭环后通过官方 `changeset pre exit` 退出预发布，由机器人生成稳定版本 PR。稳定候选同样通过完整门禁后才能发布到 latest，不手改版本或手工触发旧标签发布。

本轮未执行远端配置、推送、npm 发布或稳定版切换。
