# 1.0 发布准备

本页维护稳定版剩余工作，发布操作以[发布手册](releasing.md)为准。历史检查只证明当时输入；新候选需重新核对证据有效性与外部状态。

## 剩余工作

1. 按[组件契约](testing/component-contract.md)核对公开能力、已知差异和必要验证，完成稳定版所需的组件缺口；既有 ready 状态不替代候选上的有效证据。
2. 核对保留的 API、使用与迁移说明，以及实际公开包的许可、归属和 SBOM。后续测试工具迁移按[方案](testing/vue-testing-strategy-proposal.md)另行实施。
3. 产品验收闭环后使用官方 `changeset pre exit`，由机器人生成稳定版本 PR，经相同候选门禁发布到 latest。

外部接入与 next 发布已在 2026-09-18 完成：GitHub App、仓库变量/secret、master 保护、npm Environment 和五包 Trusted Publisher 都在真实发布中生效，机器人版本 PR 的创建与更新都实测触发了 CI；next 候选的质量、Chromium、隔离消费门禁、provenance、五包版本与精确依赖、包级标签/Release 和 registry 安装均已核对，见下方历史证据。

Nuxt 文档站及旧逐示例验收已[退役](documentation/README.md)，不再要求恢复历史批次或交付站点。移除文档站不表示产品验收完成，也不自动创建替代站点。

五包 `0.1.0` 是未发布迁移基线；`1.0.0-next.0` 已按预发布流程进入 next，`latest` 仍指向历史 `0.1.0-alpha.0`，只有稳定版发布才会改写它。外部接入状态需在准备发布时重新读取，不能从本地测试推断。

## 历史证据

- **2026-09-01**：基于 `8144bf4` 完成当时的依赖审计、1,116 项单测、589 项 Chromium、构建/主题/SSR/tarball 门禁；五包为 `0.1.0-alpha.4`。旧精确标签和手工升版阻断项已由 Changesets 流程取代。
- **2026-09-11**：Changesets 在 `6302448` 接管发布，旧 `release:bump` 已删除，发布不再要求预先存在精确标签。本地迁移验证与当时的外部核对结论见[迁移记录](../ai-work/20260911-125341-changesets-migration.md)。
- **2026-09-18**：完成五包 `1.0.0-next.0` 发布。候选 `076dc123` 与版本 PR head `98d519ff` 的 tree 一致（`0dfd0bf6`），因此版本 PR 上的本地证据适用于合并后的候选：`release:check` 覆盖 1,295 项单测、444 项 Chromium、`PACK_ISOLATED=1` 真实 tarball consumer 与 `release:verify`。CI 的 `Quality`、`Pack and verify original tarballs`、`Publish with npm OIDC` 与 `postcheck` 全绿（postcheck 在 registry 元数据传播完成后重跑通过）。registry 复核：五包 `next=1.0.0-next.0`、`latest` 未改写、内部依赖为同版本精确值；五个包级标签与 Release 指向该候选；provenance 校验了仓库、workflow、候选 SHA 与产物摘要。同批修掉发布门禁自身的四个问题：PR 检查按不可变 base SHA 解析、产物门禁因缺少 `rg` 而静默跳过、可信版本 PR 被发布意图检查误拦、postcheck 元数据传播预算过短（改为五包并行共享的有界退避，默认 10 分钟）。

当时记录的 Lottie 第三方 direct-eval/大 chunk 提示与固定 React InputNumber DOM 属性告警属于已知观察项，不自动视为产品缺陷或永久豁免；实际候选检查出现相关变化时按证据判断。2026-09-18 另记两条观察项：`tests/browser/components/color-picker.spec.ts` 的 desktop/light `color-picker-data` 像素对比在整套运行中偶发超阈（diff=34、ratio=0.67%、maxChannelDelta=0.216，阈值 0.1%；单独重跑与同条件整矩阵重跑均通过，且该候选未改任何源码或样式，判定为截图抖动，不据此放宽阈值），以及 npm 元数据传播最慢达 188 秒（ui），超出旧 15 秒预算，现由 postcheck 的传播预算覆盖。
