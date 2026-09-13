# 1.0 发布准备

本页维护稳定版剩余工作，发布操作以[发布手册](releasing.md)为准。历史检查只证明当时输入；新候选需重新核对证据有效性与外部状态。

## 剩余工作

1. 按[组件契约](testing/component-contract.md)核对公开能力、已知差异和必要验证，完成稳定版所需的组件缺口；既有 ready 状态不替代候选上的有效证据。
2. 核对保留的 API、使用与迁移说明，以及实际公开包的许可、归属和 SBOM。后续测试工具迁移按[方案](testing/vue-testing-strategy-proposal.md)另行实施。
3. 核对 GitHub App、仓库变量/secret、master 保护、npm Environment 和五包 Trusted Publisher；实证机器人版本 PR 的创建/更新能触发 CI。
4. 在准确候选上通过质量、Chromium 与原 pack artifact 的隔离消费门禁，按发布流程完成 next 发布；复核 provenance、五包版本/精确依赖、标签/Release、registry 安装和渠道。
5. 产品验收闭环后使用官方 `changeset pre exit`，由机器人生成稳定版本 PR，经相同候选门禁发布到 latest。

Nuxt 文档站及旧逐示例验收已[退役](documentation/README.md)，不再要求恢复历史批次或交付站点。移除文档站不表示产品验收完成，也不自动创建替代站点。

当前仓库的五包 `0.1.0` 是未发布迁移基线，待处理 major Changeset 与 next 状态使首个机器人版本 PR 目标为 `1.0.0-next.0`；不能直接发布迁移基线。外部接入状态需在准备发布时读取，不能从本地测试推断。

## 历史证据

- **2026-09-01**：基于 `8144bf4` 完成当时的依赖审计、1,116 项单测、589 项 Chromium、构建/主题/SSR/tarball 门禁；五包为 `0.1.0-alpha.4`。旧精确标签和手工升版阻断项已由 Changesets 流程取代。
- **2026-09-11**：Changesets 在 `6302448` 接管发布，旧 `release:bump` 已删除，发布不再要求预先存在精确标签。本地迁移验证与当时的外部核对结论见[迁移记录](../ai-work/20260911-125341-changesets-migration.md)。

当时记录的 Lottie 第三方 direct-eval/大 chunk 提示与固定 React InputNumber DOM 属性告警属于已知观察项，不自动视为产品缺陷或永久豁免；实际候选检查出现相关变化时按证据判断。
