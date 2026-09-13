# 发布手册

日常变更只需添加 Changeset；准备发布时核对当前候选、外部接入和对应门禁；只有发布失败恢复时才读取恢复步骤。产品剩余工作见[发布审计](release-audit-1.0.md)。

Changesets 负责版本计算、五包联动、CHANGELOG、版本 PR、打包及发布。五包使用 fixed 分组：主题、稳定图标、实验图标、插画和主组件包始终同版。`workspace:*` 保留在源码中，真实 tarball 的内部依赖必须转换为同版本精确值。

当前处于迁移接入期：本地 `0.1.0` 是官方命令清除旧 alpha 计数产生的未发布基线，必须与待处理 major changeset 及 next 状态一起合并。首个版本 PR 的目标是五包 `1.0.0-next.0`。不能直接发布迁移基线，也不能把流程迁移视为 1.0 产品验收完成。

## 开发者提交变更

在功能 PR 执行 `pnpm changeset`：公开修复用 patch，新增功能用 minor，破坏性变化用 major 并写明迁移方法。主题、Foundation、生成资产和构建链路只要改变公开产物，同样需要记录。纯文档、测试、内部工具变更使用 `pnpm changeset --empty`。

CI 使用官方 CLI 校验格式、包名和版本计划，并要求新增一份记录；空记录代表无需发布，不能直接遗漏。不要手改公开包版本、手工打标签。版本 PR 的例外同时核对本仓库、`changeset-release/master` 分支和配置的机器人账号，不能仅凭分支名豁免。

维护环境由 `mise.toml` 固定 Node 24.18.0 和 pnpm 12.3.4。CLI 为 3.0.2，GitHub CHANGELOG 插件为 1.0.1，官方子 Action 固定 v2.1.2 的提交 `ae32849d5ba541f9ae29e40e22a623bc13562f51`。

## 版本 PR 与发布

`master` push 触发 `publish.yml`。官方 select-mode 遇到待处理发布记录时维护版本 PR；空 changeset 不触发发布。`release:version` 只执行官方 version 和 lockfile 更新，不自动提交。机器人由官方 version Action 提交和更新 PR。

版本 PR 合并后的候选必须通过源码、审计、构建、主题、SSR、真实包和完整组件 Chromium 门禁。quality 传递构建产物，官方 pack 创建 artifact；pack-verify 下载该 artifact 的准确文件，执行隔离消费检查并记录候选 SHA、原计划摘要和五包 SHA-512。publish 只接收已通过验证的 artifact ID，不重建、不执行 workspace 生命周期脚本。

Nuxt 文档站、站点部署和旧逐示例验收不再属于包发布门禁。静态 API 与迁移说明仍需准确，实际公开包继续保留独立品牌、MIT、第三方归属和 SBOM。

`release:check` 是完整只读验证入口；可按工作流拆分执行已覆盖的门禁，无须重复运行总命令。`PACK_DIR=/绝对路径 pnpm verify:pack-isolated` 验证官方 pack 输出，未指定 `PACK_DIR` 时保留日常本地打包模式。`release:verify` 检查包身份、许可、私有依赖与产物泄漏，不要求预先存在 Git 标签。

所有发布使用固定 concurrency，npm Environment 审批前可查看 `release-evidence` artifact 和 job summary。候选必须仍是 master 当前提交，发布前再次核对；渠道存在更新版本时拒绝回拨。旧 `v*` 标签保留为历史，不再触发发布。新标签和 GitHub Release 使用 `@aifuxi/包名@版本`，每次五包同版产生五个 Release。

## next 与稳定版

当前 next 状态已经建立。日常提交 changeset 即可推进 `1.0.0-next.N`，不要重复进入 pre 模式。未来新预发布周期使用 `pnpm changeset pre enter next`。

产品验收闭环后执行 `pnpm changeset pre exit`，并用 `pnpm changeset --empty` 记录本次流程变更意图，然后一起提交。机器人将生成稳定版本 PR；当前周期预期为五包 `1.0.0`，审核后经相同门禁发布到 latest。预发布不会自动改写 latest，稳定发布也不会自动改写 next。对退出模式的归档 changeset 应按官方提示审阅。

## 失败恢复

多包发布不是原子操作。任何 npm 成功都不能回滚；先保留原 run ID、候选 SHA、`changeset-publish-plan-*`、`changeset-pack-*` 和 `release-evidence`，不能为恢复重新升版。

CLI 3.0.2 对原计划重跑仍会尝试已发布包，且仅识别特定重复发布错误文字。Verdaccio 6.10.3 / pnpm 12.3.4 的真实恢复演练确认，直接重跑会因 409 中断。因此失败发生在 publish 之后时，使用 `workflow_dispatch`，填写原始成功通过 quality、browser、pack-verify 的 run ID 和精确候选 SHA。不要仅重跑 publish job。

恢复入口核对原运行来源、检查结果、候选和未过期 artifact，重新验证原 tarball。`prepare-release-recovery.mjs` 调用官方 `publish-plan`，仅把剩余官方计划重新绑定原 tarball；它不计算版本、不自行选择待发布包、不打包、不发布。计划的版本、访问策略与渠道必须与原计划一致。衍生计划与原五包 tarball 另存 `recovery-pack`，由官方 publish 子 Action 执行。已发布包必须先通过 integrity 核对。

| 故障                               | 处理                                                                      |
| ---------------------------------- | ------------------------------------------------------------------------- |
| 发布前失败                         | 修复后重跑原门禁；没有验证成功的 artifact 不能跳到发布                    |
| 部分包成功                         | 使用上述手动恢复，保持候选和原五包 tarball 不变                           |
| 全部包成功但标签/Release 缺失      | 官方新计划可补建缺失标签；已有标签但缺 Release 时按下述一次性维护步骤补齐 |
| 全部成功后再次执行                 | 官方新计划为空，不再发布；后验仍检查完整五包清单                          |
| 原 artifact 过期、缺失或候选已过时 | 自动恢复拒绝执行；先调查并建立新的可验证一致性方案，不能静默重建          |
| 后验失败                           | 发布未闭环；渠道故障单独修复，产品缺陷通过新 changeset 和新版本处理       |

独立补建元数据时，先在原候选 checkout 下载并核对原证据及五包 registry integrity。官方 `pnpm changeset git-tag` 可补建本地五包标签（本地演练已验证不包含私有包）。CLI 3.0.2 在 Git 签名失败时也可能成功退出，因此必须用实际 Git refs 核对结果。逐一确认标签指向原候选后再推送缺失标签；对已存在且指向正确候选的标签，用 `gh release create '@aifuxi/包名@版本' --verify-tag --notes-file <该包该版本的发布记录文件>` 补建缺失 Release，预发布加 `--prerelease`。不得覆盖已有标签或 Release。GitHub Release 的远端补建尚需外部演练，本地标签测试不能代替它。

`pnpm release:postcheck <release-evidence.json>` 按完整五包清单查询版本、精确内部依赖、渠道和 SHA-512，核对 provenance 的仓库、workflow、候选 SHA 与产物摘要，检查实际包级 GitHub 标签和 Release，再从官方 registry 隔离安装，运行签名审计和 SSR import。只有 npm 元数据传播缺失允许最多三次等待；功能失败不重试。

## 外部配置与当前状态

版本机器人需要仅安装于本仓库的 GitHub App，Contents / Pull requests 写权限；配置仓库变量 `RELEASE_APP_ID`、`RELEASE_BOT_LOGIN` 与 secret `RELEASE_APP_PRIVATE_KEY`。App token 只进入 version job，不进入 npm 发布 job。必须实证 App 创建和更新的 PR 能触发 CI。

发布前应保护 master，并核对 npm Environment 审核。五包的 npm Trusted Publisher 均应指向 `aifuxi/semi-ui-vue` / `publish.yml` / `npm`。OIDC 配置和真实首发属于外部验收，不由本地测试证明。

2026-09-11 历史快照：npm Environment 已有 required reviewer `aifuxi`；master 的 `protected=false`；仓库级 Actions variables/secrets 列表为空；五包 registry 均为 `next=0.1.0-alpha.4`、`latest=0.1.0-alpha.0`，见[迁移记录](../ai-work/20260911-changesets-registry.json)。当时未创建 App、修改远端配置或发布 npm。准备新候选时重新核对这些外部状态，不把此快照当作当前检查结果。

迁移方案及原验收定义见 [迁移计划](changesets-migration-plan.md)。历史审计中的旧命令仅为当时证据，不是现行发布入口。
