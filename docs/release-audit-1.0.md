# 1.0 发布准备

本页维护稳定版剩余工作，发布操作以[发布手册](releasing.md)为准。历史检查只证明当时输入；新候选需重新核对证据有效性与外部状态。

## 剩余工作

1. 将已退出预发布模式的流程提交合并到 `master`，由机器人生成五包 `1.0.0` 稳定版本 PR；审核该候选并复核相同门禁后发布到 latest。

外部接入与 next 发布已在 2026-09-18 完成：GitHub App、仓库变量/secret、master 保护、npm Environment 和五包 Trusted Publisher 都在真实发布中生效，机器人版本 PR 的创建与更新都实测触发了 CI；next 候选的质量、Chromium、隔离消费门禁、provenance、五包版本与精确依赖、包级标签/Release 和 registry 安装均已核对，见下方历史证据。

Nuxt 文档站及旧逐示例验收已[退役](documentation/README.md)；现行 VitePress 站点作为文档入口维护，但不属于公开包发布门禁。

五包当前源码与 registry `next` 均为 `1.0.0-next.1`；`latest` 仍指向历史 `0.1.0-alpha.0`，只有稳定版发布才会改写它。外部接入状态需在准备发布时重新读取，不能从本地测试推断。

## 组件契约复核（2026-09-22）

- 按固定 Semi `v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21` 复核 130 个根导出、85 个模块组和 85 份对齐矩阵；82 个公开组件页均有 API 契约，另外 3 个技术入口为 `_base`、`_utils`、`iconButton`。所有矩阵均包含固定基线与验收证据，85 个组件浏览器规格无 `skip` / `fixme`。
- 对缺少统一状态措辞的 Calendar、ConfigProvider、DatePicker、Form、Typography、VideoPlayer 做定向复核：18 个单元/SSR/hydration 文件、104 项测试，以及 7 个生产态 Playwright 规格、38 项测试全部通过，确认没有实现缺口。
- 全量候选检查发现并修复 Pagination small 模式文本节点合并回归，同时保留 SSR hydration 无警告；修复后的单元/SSR 12 项和生产态 Chromium 5 项通过。其余公开能力、已记录 deviation、ARIA、Portal、主题、RTL、Locale、SSR 与发布入口未发现新的未解释差异。
- 当前工作树的 `pnpm check:full` 通过：232 个 Vitest 文件、1,314 项测试，444 项生产态 Chromium，以及构建、主题、SSR、tarball 和真实 tarball consumer 门禁全部通过。
- 本项完成不替代后续候选的 `release:check`、许可/SBOM 核对或产品验收；稳定版发布前仍需以最终候选重新执行门禁。

## 文档与发布合规复核（2026-09-22）

- 盘点 82 个组件 API 页面和 61 份 React 到 Vue 迁移说明，核对包名、Vue 公开 API 与固定基线方向；通过既有上游正文重写链修正简介、主题、暗色模式和无障碍指南中残留的 React Adapter、旧插件与上游规划措辞，未增加第二套展示机制。
- 复核五个公开包的真实 tarball：项目 MIT License、Semi Design v2.102.0 原始许可、第三方声明与 SPDX 2.3 SBOM 均随包生成；`release:verify` 和隔离安装的 `verify:pack-isolated` 均通过，覆盖 exports、ESM、类型、样式、无 DOM 导入与 tree-shaking。
- 生产依赖审计发现 VitePress 1.6.4 默认 Vite 5 链路包含已知漏洞，现按官方兼容范围仅将 `vitepress>vite` 覆盖到 6.4.3；`pnpm audit:prod` 已无已知漏洞，文档构建、类型检查及通用指南生产态 Playwright 回归通过。
- `DOCS_EXAMPLE_TIER=t1` 至 `t5` 的生产态全量巡检共 113 项通过：82 个组件页的 1,033 个 live 示例均存在预览与源码且无客户端错误，22 个通用指南代码块均为 code-only，并覆盖 Select、拖拽、缩放、视频、上传、Form、Table、Chat 与 AI 组件等 11 项实际交互。
- 文档站产品验收覆盖 1280×900 桌面端与 390×844 移动端的简介、快速开始、组件总览、组件页、导航、搜索及亮暗主题。验收发现并修正 82 个组件页仍显示“示例代码仍在逐项迁移”的失真提示；生成结果现为 82 条完成提示、0 条迁移中提示，并由逐页面生产态断言防回归。
- 产品验收负责人已于 2026-09-22 确认通过；本地已执行官方 `changeset pre exit`，并在退出状态下通过 `pnpm release:check`：14 项 Changesets 集成测试、1,314 项 Vitest、444 项组件 Chromium、真实 tarball consumer、源码与产物门禁全部通过，生产依赖审计无已知漏洞。当前五包仍为 `1.0.0-next.1`；稳定版 `1.0.0` 版本 PR 尚待本次流程提交合并后由机器人生成，未执行实际发布。

## 历史证据

- **2026-09-01**：基于 `8144bf4` 完成当时的依赖审计、1,116 项单测、589 项 Chromium、构建/主题/SSR/tarball 门禁；五包为 `0.1.0-alpha.4`。旧精确标签和手工升版阻断项已由 Changesets 流程取代。
- **2026-09-11**：Changesets 在 `6302448` 接管发布，旧 `release:bump` 已删除，发布不再要求预先存在精确标签。本地迁移验证与当时的外部核对结论见[迁移记录](../ai-work/20260911-125341-changesets-migration.md)。
- **2026-09-18**：完成五包 `1.0.0-next.0` 发布。候选 `076dc123` 与版本 PR head `98d519ff` 的 tree 一致（`0dfd0bf6`），因此版本 PR 上的本地证据适用于合并后的候选：`release:check` 覆盖 1,295 项单测、444 项 Chromium、`PACK_ISOLATED=1` 真实 tarball consumer 与 `release:verify`。CI 的 `Quality`、`Pack and verify original tarballs`、`Publish with npm OIDC` 与 `postcheck` 全绿（postcheck 在 registry 元数据传播完成后重跑通过）。registry 复核：五包 `next=1.0.0-next.0`、`latest` 未改写、内部依赖为同版本精确值；五个包级标签与 Release 指向该候选；provenance 校验了仓库、workflow、候选 SHA 与产物摘要。同批修掉发布门禁自身的四个问题：PR 检查按不可变 base SHA 解析、产物门禁因缺少 `rg` 而静默跳过、可信版本 PR 被发布意图检查误拦、postcheck 元数据传播预算过短（改为五包并行共享的有界退避，默认 10 分钟）。

当时记录的 Lottie 第三方 direct-eval/大 chunk 提示与固定 React InputNumber DOM 属性告警属于已知观察项，不自动视为产品缺陷或永久豁免；实际候选检查出现相关变化时按证据判断。2026-09-18 另记两条观察项：`tests/browser/components/color-picker.spec.ts` 的 desktop/light `color-picker-data` 像素对比在整套运行中偶发超阈（diff=34、ratio=0.67%、maxChannelDelta=0.216，阈值 0.1%；单独重跑与同条件整矩阵重跑均通过，且该候选未改任何源码或样式，判定为截图抖动，不据此放宽阈值），以及 npm 元数据传播最慢达 188 秒（ui），超出旧 15 秒预算，现由 postcheck 的传播预算覆盖。
