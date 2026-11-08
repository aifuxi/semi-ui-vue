# 发布手册

日常变更只需添加 Changeset；准备发布时核对当前候选、外部接入和对应门禁；只有发布失败恢复时才读取恢复步骤。产品剩余工作见[发布审计](release-audit-1.0.md)。

Changesets 负责版本计算、六包联动、CHANGELOG、版本 PR、打包及发布。六个公开包使用 fixed 分组：默认主题、现代主题、稳定图标、实验图标、插画和主组件包始终同版。`workspace:*` 保留在源码中，真实 tarball 的内部依赖必须转换为同版本精确值。

当前处于迁移接入期：本地 `0.1.0` 是官方命令清除旧 alpha 计数产生的未发布基线，必须与待处理 major changeset 及 next 状态一起合并。首个版本 PR 的目标是六个公开包 `1.0.0-next.0`。不能直接发布迁移基线，也不能把流程迁移视为 1.0 产品验收完成。

## 开发者提交变更

在功能 PR 执行 `pnpm changeset`：公开修复用 patch，新增功能用 minor，破坏性变化用 major 并写明迁移方法。主题、Foundation、生成资产和构建链路只要改变公开产物，同样需要记录。纯文档、测试、内部工具变更使用 `pnpm changeset --empty`。

CI 使用官方 CLI 校验格式、包名和版本计划，并要求新增一份记录；空记录代表无需发布，不能直接遗漏。不要手改公开包版本、手工打标签。版本 PR 的例外同时核对本仓库、`changeset-release/master` 分支和配置的机器人账号，不能仅凭分支名豁免。

维护环境由 `mise.toml` 固定 Node 24.18.0 和 pnpm 12.3.4。CLI 为 3.0.2，GitHub CHANGELOG 插件为 1.0.1，官方子 Action 固定 v2.1.2 的提交 `ae32849d5ba541f9ae29e40e22a623bc13562f51`。

## 版本 PR 与发布

`master` push 触发 `publish.yml`。官方 select-mode 遇到待处理发布记录时维护版本 PR；空 changeset 不触发发布。`release:version` 只执行官方 version 和 lockfile 更新，不自动提交。机器人由官方 version Action 提交和更新 PR。

版本 PR 合并后的候选需要完成对应的本地组件与产物验证：Vitest dom/node、Storybook/React 组件 Chromium、真实 tarball consumer 浏览器与公开产物检查。普通 PR CI 运行全仓 `check:source`；可信的纯版本 PR 按下节复用成功证据。发布流水线继续运行不含文档站的 `check:publish-source`、Changesets、依赖审计、构建、主题、Node SSR、Node 原始 tarball 隔离验证及发布。CI 不运行组件单测或浏览器矩阵，不能代替候选所需本地组件结果。

quality 传递构建产物，官方 pack 创建 artifact；pack-verify 下载该 artifact 的准确文件，执行 Node 隔离消费检查并记录候选 SHA、原计划摘要和六包 SHA-512。publish 只接收已通过验证的 artifact ID，不重建、不执行 workspace 生命周期脚本。

文档站、站点部署和旧逐示例验收不属于包发布门禁。静态 API 与迁移说明仍需准确，实际公开包继续保留独立品牌、MIT、第三方归属和 SBOM。

### 构建与检查证据复用

- 普通 PR 的冷启动 `check:source` 会清理旧产物，文档消费者类型检查随后构建六包；CI 使用 `verify:artifacts` 继续验证这些准确产物，不再执行第二次 build。手动 `check:artifacts` 仍先构建再验证，不能把任意残留 dist 当作有效输入。
- 完整源码与产物检查成功后，CI 上传 `source-quality-evidence`，记录仓库、run、PR head、实际 checkout SHA 与整个 Git tree。只有完整路径生成证据，复用路径不生成新的全量通过记录。
- 纯版本 PR 必须同时满足同仓库机器人身份、固定版本分支、六包统一向前升版、清单除 version 外完全相同、CHANGELOG 仅前置新版本且保留历史、仅删除已消费 changeset。源码、依赖、exports、lockfile、工具或工作流的改动均执行完整检查。
- 复用还要求近期成功的本仓库 `ci.yml` 运行提供唯一且未过期的 receipt；run、PR head、受测提交 tree 均独立核对，且 tree 与版本 PR 的 base 完全相同。缺少匹配证据时执行完整检查。当前版本差异及原有 Changesets 意图校验始终执行，正式发布的候选、构建和 tarball 验证不因 PR 复用而省略。
- pnpm store 只缓存内容寻址依赖，仍执行 frozen-lockfile 安装和既有供应链策略；不缓存 node_modules 或构建产物。`tools/release` 是私有工具工作区，Changesets CLI、GitHub CHANGELOG 插件、semver 和 Prettier 四个依赖版本与根清单一致，保留官方升版的自动格式化。select-mode、version、publish、postcheck 以 `--filter @workspace/release-tools install --prod` 排除根开发依赖，再暴露官方 CLI 的根解析入口；quality 和 pack-verify 保留完整安装。
- 恢复历史候选时，发布与后验保留原完整安装路径，避免旧候选缺少新增工具；原候选、master 祖先、`packages/` 不变、原 tarball 和 integrity 等恢复约束继续生效。

轻量工具安装成功并核对版本后，仅在当前 Actions job 的后续命令中设置 `pnpm_config_verify_deps_before_run=false`。pnpm 12 默认会在 run/exec 前自动补装省略的开发依赖；这里禁止隐式补装，仍保留前一步 frozen-lockfile 安装及格式化。开发者环境与完整安装门禁不改变。版本基准同时断言官方升版前后安装规模不增长。

### 实际耗时对照

`release-benchmark.yml` 在修改该基准的 PR 上运行，也可手动触发。它在独立 runner 上对比同一 checkout 的普通 PR 检查、官方 CLI 生成的纯版本变更和轻量发布工具安装。两个源码方案使用相同验证器；版本快路径必须找到实际成功 CI 证据，否则基准失败。

后验对照读取指定成功发布 run 的 `release-evidence`，真实执行官方 registry 完整性、provenance、签名、隔离安装与 SSR 导入。默认 run `42470122055` 对应 2.1.2；证据过期或比较后续发布时显式提供新的成功 run ID。基准只有 contents/actions 读取权限，不推送演练提交、不创建版本 PR、不执行 npm publish。其数据只能代表测得的 CI 阶段，不能将已完成传播的后验耗时宣称为新版本传播耗时。

`release:check` 是完整本地只读发布验证入口，组合公开包源码、单测、产物、组件与 consumer 浏览器回归，不运行文档站检查；可按影响和执行阶段复用输入未变的有效结果，无须重复运行总命令。组件浏览器默认构建后 preview、完整 Chromium 新 headless、3 workers、0 retries。`PACK_DIR=/绝对路径 pnpm verify:pack-isolated` 验证官方 pack 输出，未指定 `PACK_DIR` 时保留日常本地打包模式。`release:verify` 检查包身份、许可、私有依赖与产物泄漏，不要求预先存在 Git 标签。

所有发布使用固定 concurrency，npm Environment 审批前可查看 `release-evidence` artifact 和 job summary。候选必须仍是 master 当前提交，发布前再次核对；渠道存在更新版本时拒绝回拨。旧 `v*` 标签保留为历史，不再触发发布。新标签和 GitHub Release 使用 `@aifuxi/包名@版本`，每次六包同版产生六个 Release。

## next 与稳定版

当前 next 状态已经建立。日常提交 changeset 即可推进 `1.0.0-next.N`，不要重复进入 pre 模式。未来新预发布周期使用 `pnpm changeset pre enter next`。

产品验收闭环后执行 `pnpm changeset pre exit`，并用 `pnpm changeset --empty` 记录本次流程变更意图，然后一起提交。机器人将生成稳定版本 PR；当前周期预期为六个公开包 `1.0.0`，审核后经相同门禁发布到 latest。预发布不会自动改写 latest，稳定发布也不会自动改写 next。对退出模式的归档 changeset 应按官方提示审阅。

## 失败恢复

多包发布不是原子操作。任何 npm 成功都不能回滚；先保留原 run ID、候选 SHA、发布计划（当前 changesets action 上传为 `publish-plan.json`，历史 run 为 `changeset-publish-plan-*`）、`changeset-pack-*` 和 `release-evidence`，不能为恢复重新升版。`scripts/resolve-release-recovery.mjs` 按上述三类产物名解析恢复输入（`scripts/release-recovery.spec.mjs` 覆盖），缺失或有多个未过期候选时恢复会显式失败，不会挑选任意产物。

恢复时候选 SHA 允许落后于当前 master（例如恢复前必须先合并发布工具修复），但要求候选是 master 祖先、且候选到 master 之间没有改动 `packages/`；`select-mode` 与 publish 前的复核步骤都会重新校验这条不变量，避免从与当前 master 不一致的代码补发包。

恢复解析（`select-mode`）检出当前 master 的发布工具运行，候选只用于身份与不变量校验；这样对恢复流程自身的修复能被下一次恢复直接使用，而不必回填到旧候选。

CLI 3.0.2 对原计划重跑仍会尝试已发布包，且仅识别特定重复发布错误文字。Verdaccio 6.10.3 / pnpm 12.3.4 的真实恢复演练确认，直接重跑会因 409 中断。因此失败发生在 publish 之后时，使用 `workflow_dispatch`，填写原始成功通过 quality、pack-verify 的 run ID 和精确候选 SHA。browser CI job 已移除；候选对应的本地组件结果仍按输入有效性复用。不要仅重跑 publish job。

恢复入口核对原运行来源、检查结果、候选和未过期 artifact，重新验证原 tarball。`prepare-release-recovery.mjs` 调用官方 `publish-plan`，仅把剩余官方计划重新绑定原 tarball；它不计算版本、不自行选择待发布包、不打包、不发布。计划的版本、访问策略与渠道必须与原计划一致。衍生计划与原六包 tarball 另存 `recovery-pack`，由官方 publish 子 Action 执行。已发布包必须先通过 integrity 核对。

| 故障                               | 处理                                                                      |
| ---------------------------------- | ------------------------------------------------------------------------- |
| 发布前失败                         | 修复后重跑原门禁；没有验证成功的 artifact 不能跳到发布                    |
| 部分包成功                         | 使用上述手动恢复，保持候选和原六包 tarball 不变                           |
| 全部包成功但标签/Release 缺失      | 官方新计划可补建缺失标签；已有标签但缺 Release 时按下述一次性维护步骤补齐 |
| 全部成功后再次执行                 | 官方新计划为空，不再发布；后验仍检查完整六包清单                          |
| 原 artifact 过期、缺失或候选已过时 | 自动恢复拒绝执行；先调查并建立新的可验证一致性方案，不能静默重建          |
| 后验失败                           | 发布未闭环；渠道故障单独修复，产品缺陷通过新 changeset 和新版本处理       |

独立补建元数据时，先在原候选 checkout 下载并核对原证据及六包 registry integrity。官方 `pnpm changeset git-tag` 可补建本地六包标签（本地演练已验证不包含私有包）。CLI 3.0.2 在 Git 签名失败时也可能成功退出，因此必须用实际 Git refs 核对结果。逐一确认标签指向原候选后再推送缺失标签；对已存在且指向正确候选的标签，用 `gh release create '@aifuxi/包名@版本' --verify-tag --notes-file <该包该版本的发布记录文件>` 补建缺失 Release，预发布加 `--prerelease`。不得覆盖已有标签或 Release。GitHub Release 的远端补建尚需外部演练，本地标签测试不能代替它。

`pnpm release:postcheck <release-evidence.json>` 按完整六包清单查询版本、精确内部依赖、渠道和 SHA-512，核对 provenance 的仓库、workflow、候选 SHA 与产物摘要，检查实际包级 GitHub 标签和 Release，再从官方 registry 隔离安装，运行签名审计和 SSR import。npm 在 publish 之后异步传播元数据，只有"版本、dist-tag 或 provenance 尚未可见"允许等待：六包并行轮询共享同一预算，退避从 2 秒递增到 30 秒上限，默认总预算 10 分钟，可用 `POSTCHECK_PROPAGATION_TIMEOUT_MS` 覆盖（2026-09-18 的 `1.0.0-next.0` 候选中，最慢的 ui 比发布报告晚 188 秒才可见，旧实现 15 秒预算因此必然失败）；其余功能失败（integrity、内部依赖、签名、SSR import）立即失败，不重试。

## 外部配置与当前状态

版本机器人需要仅安装于本仓库的 GitHub App，Contents / Pull requests 写权限；配置仓库变量 `RELEASE_APP_ID`、`RELEASE_BOT_LOGIN` 与 secret `RELEASE_APP_PRIVATE_KEY`。App token 只进入 version job，不进入 npm 发布 job。必须实证 App 创建和更新的 PR 能触发 CI。

发布前应保护 master，并核对 npm Environment 审核。六个公开包的 npm Trusted Publisher 均应指向 `aifuxi/semi-ui-vue` / `publish.yml` / `npm`。OIDC 配置和真实首发属于外部验收，不由本地检查证明。

2026-09-11 历史核对结论：npm Environment 已有 required reviewer `aifuxi`；master 的 `protected=false`；仓库级 Actions variables/secrets 列表为空；五包 registry 均为 `next=0.1.0-alpha.4`、`latest=0.1.0-alpha.0`，见[迁移记录](../ai-work/20260911-125341-changesets-migration.md)。当时未创建 App、修改远端配置或发布 npm。准备新候选时重新核对这些外部状态，不把历史结论当作当前检查结果。

迁移方案及原验收定义见 [迁移计划](changesets-migration-plan.md)。历史审计中的旧命令仅为当时证据，不是现行发布入口。
