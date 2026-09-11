# Changesets 完整迁移计划

状态：本地迁移完成，外部发布待验证。更新日期：2026-09-11。现行操作见新版 [发布手册](./releasing.md)，原始设计与验收要求保留在本文；实测修订见文末。

## 目标与完成定义

由 Changesets 接管变更意图、SemVer 计算、包间版本传播、CHANGELOG、版本 PR、打包发布和包级 Git 标签。删除现有自研升版及逐包发布实现，避免两套入口并存。项目自己的类型、SSR、主题、许可、真实包消费和 Chromium 验证继续保留。

完成必须同时满足：

- 开发者提交 changeset，机器人生成版本 PR；合并版本 PR 后，新候选经过完整验证并通过 OIDC 发布。
- 五个公开包版本一致；主包的稳定图标依赖在 tarball 和 npm manifest 中均为同版本精确值。
- 发布使用已经验证的 tarball，能够追溯到候选 SHA、发布计划和产物摘要。
- 部分包发布成功、元数据创建失败和重复执行都有实测恢复路径。
- 旧脚本、旧标签触发器和旧手册入口全部退出使用。

组件及文档功能缺陷另行处理。迁移成功不代表 1.0 产品验收完成。

## 当前事实与迁移边界

本次调查的代码基线为 `e8f60d9`。五包 manifest 为 `0.1.0-alpha.8`；npm 主包查询结果为 `next=0.1.0-alpha.4`、`latest=0.1.0-alpha.0`。远端存在历史失败发布标签。上述远端状态仅是调查时快照，切换前必须重新查询全部五包，不能只依据主包推断。

现有 `release-bump.mjs` 只修改版本，不同步 `publishConfig.tag`，稳定版会与发布验证冲突；现有预检拒绝任一已存在版本，使部分发布后的直接重跑受阻。现有工作流由 `v*` 标签触发，标签先于完整发布验证创建。

原方案提交仅落地文档，本轮已完成本地配置、测试、工作流和手册变更。GitHub App、Environment、npm Trusted Publisher 的外部配置及真实发布分别记录完成证据，不把本地测试当作外部成功。

## 版本与包配置

### 工具基线

- `@changesets/cli` 固定为调查时官方 registry 的 `3.0.2`。
- 官方 Action 使用 `v2.1.2` 对应的 `ae32849d5ba541f9ae29e40e22a623bc13562f51`，子 Action 使用相同 SHA。实施时再次核验发布来源与兼容声明，不引用开发分支代码。
- 根维护环境使用既有 Node `24.18.0`、pnpm `12.3.4`。CLI 3.0.2 要求 Node `^22.11 || ^24 || >=26`，因此同步收敛根仓库的维护环境声明；不据此更改公开包消费者的 Node/Vue 兼容承诺。
- GitHub CHANGELOG 插件单独核对与 CLI 3 的兼容性后锁定版本。

### `.changeset/config.json`

以下为核心配置，实际以锁定 CLI 的 schema 验证为准：

```json
{
  "$schema": "https://unpkg.com/@changesets/config/schema.json",
  "changelog": ["@changesets/changelog-github", { "repo": "aifuxi/semi-ui-vue" }],
  "commit": false,
  "fixed": [
    [
      "@aifuxi/semi-theme-default",
      "@aifuxi/semi-icons-vue",
      "@aifuxi/semi-icons-lab-vue",
      "@aifuxi/semi-illustrations-vue",
      "@aifuxi/semi-ui-vue"
    ]
  ],
  "linked": [],
  "access": "public",
  "baseBranch": "master",
  "updateInternalDependencies": "patch",
  "ignore": [],
  "privatePackages": { "version": false, "tag": false }
}
```

使用固定分组明确五包同步，不采用仅关联升版的 linked 模式。私有应用、Foundation 和 test-infra 继续声明 `private: true`；演练确认它们既不发布也不生成版本标签。保留 `workspace:*`，通过真实打包结果验证精确依赖转换。

五包删除硬编码的 `publishConfig.tag`，保留官方 registry 与 public access；各包 CHANGELOG 随发布包分发，README 不再手写易过期的完整预览版本号。

### 预发布与首次接入

选定 `1.0.0-next.N` / npm `next`，稳定版为 `1.0.0` / npm `latest`。采用 `changeset pre enter next` 与 `changeset pre exit` 原生命令，不再自行推断所有带连字符版本都应发布到 next。

首次接入按以下顺序进行：

1. 保存五包 npm 已发布版本、dist-tags、远端分支和标签清单；核对当前分支包含哪些尚未发布的功能。
2. 在隔离临时仓库复制五包 manifest、workspace 和 Changesets 配置。先进入 next 预发布，再添加表达首个 1.0 意图的 major changeset，执行版本计算。
3. 验证五包候选恰为 `1.0.0-next.0`，高于已发布版本，依赖与预发布状态正确；若旧 alpha 状态影响计算，先定位锁定 CLI 行为，再修订接入步骤。禁止直接篡改最终版本或 pre.json 来掩盖不符合预期的结果。
4. 为此次尚未发布的用户可见变化编写首份 changeset；历史版本只记录已经核实的发布事实，不伪造历史 CHANGELOG。
5. 配置合并时必须带有待处理 changeset 和正确预发布状态，防止自动流程把遗留 alpha.8 当成待发布候选。
6. 首个版本 PR 明确列出五包版本与 next 渠道，完成审阅、质量门禁后才发布。

历史 `v*` 标签保留但不再触发发布。新标签和 GitHub Release 使用 Changesets 原生的 `@aifuxi/包名@版本` 形式；接受一次同版发布产生五个包级 Release，不额外维护统一标签和汇总 Release 生成器。

## 日常协作契约

- 新功能、公开行为修复、破坏性变化分别声明 minor、patch、major；摘要说明使用者可观察结果，破坏性变化说明迁移方法。
- Foundation、主题、生成资产、编译配置或运行时依赖变化，只要改变公开产物，就为受影响公开包添加 changeset。
- 纯文档、测试和内部工具修改可使用空 changeset 表达无需发布；CI 区分空 changeset 与完全遗漏发布意图。版本 PR 使用专门规则，不要求再次为升版本身新增 changeset。
- CI 校验 changeset 格式、包名与版本计划；SemVer 判断和摘要质量由 PR 审阅负责，不能仅通过文件路径推断变更级别。
- 开发者使用 `pnpm changeset` 添加记录。版本由机器人维护，不在功能 PR 手改五包版本、不手工打标签。
- `release:version` 仅组合 Changesets version 与必要的 pnpm lockfile 更新；不自研版本算法，不在本地命令中自动提交。
- `release:check` 保留为完整只读验证入口；删除旧 `release:bump` 和自研 `release:publish` 入口。发布由官方 Action/CLI 完成。

## GitHub Actions 设计

### 触发、权限与候选身份

保留 `publish.yml` 文件名以及 `npm` Environment。由 `master` push 触发 Changesets 选择 version/publish 模式；增加用于恢复的手动入口。移除 `v*` push 触发器。

所有 job checkout 同一候选 SHA。恢复默认重跑原工作流；手动恢复必须明确指定已验证候选，确认它属于受保护发布分支，并关联原发布计划及产物。不能在旧产物与最新 master 之间混用代码。

工作流使用固定发布线 concurrency，`cancel-in-progress: false`。排队运行不代表可以补发所有旧候选：执行前检查候选是否过时、渠道是否已有更新版本；过时候选不得把 next/latest 回拨。

版本 PR 使用仅安装于本仓库的 GitHub App，赋予 Contents 和 Pull requests 的必要写权限，使用短期 installation token。机器人生成及更新的 PR 必须实际触发现有 CI。该 App token 不进入 npm 发布 job；仓库内不保存私钥或本机连接配置。

### Job 与交接内容

| Job         | 责任                                                          | 写权限 / 交接                                                           |
| ----------- | ------------------------------------------------------------- | ----------------------------------------------------------------------- |
| select-mode | 使用官方子 Action 判定维护版本 PR 或准备发布                  | 输出模式及发布计划 artifact ID                                          |
| version     | 使用官方 version 子 Action 维护版本 PR、CHANGELOG 和 lockfile | GitHub App 的代码/PR 写权限；无 npm OIDC                                |
| quality     | 审计、源码检查、构建、发布身份和隔离消费验证                  | 只读仓库；产物及验证证据                                                |
| browser     | 当前候选的组件和文档 Chromium 矩阵                            | 沿用当前平台策略与全部断言                                              |
| pack-verify | 使用官方 pack 子 Action 打包，验证所输出的实际 tarball        | 接收 publish-plan-artifact-id；输出 pack-dir-artifact-id                |
| publish     | 所有门禁通过后发布已验证 artifact                             | npm Environment；id-token: write；创建标签/Release 所需 contents: write |
| postcheck   | 查询五包版本、依赖、渠道、provenance 并从 registry 安装验证   | 不持有 npm 写入身份；输出最终发布证据                                   |

官方 pack 的输出 `pack-dir-artifact-id` 直接传给 publish 的同名输入。对 artifact 下载后的准确文件执行消费校验，记录 SHA-512、包名、版本、候选 SHA 与计划身份。publish job 不重新构建业务产物、不更换 tarball。

实施前需核对 pack 产物布局及 CLI 发布计划格式；按官方 API 连接，不自建一套发布计划解释器。扩展现有 `verify-pack.mjs`，使其可验证指定 tarball 集合，保留原有日常本地生成并验证模式。

若为了验证而执行安装/脚本，应在无 OIDC 写权限的验证 job 完成。发布 job 只安装官方 Action 所需的锁定工具依赖，防止 workspace 生命周期脚本隐式重建产物。

### PR 检查与发布检查的关系

版本 PR 必须正常通过 PR 检查。发布时验证合并后的候选 SHA；发布用的完整门禁覆盖当前 `release:check` 契约，可分 job 执行，不用一条总命令重复所有已通过阶段。

源码、主题、SSR、真实 tarball、浏览器和依赖审计全部通过后，发布 job 才进入 npm Environment。审核页面应能查看版本 PR、五包计划、候选 SHA、检查结果和 tarball 摘要。

## 失败恢复与发布后核验

恢复必须通过真实 CLI 加本地测试 registry 验证，不假设官方工具自动覆盖全部边界。多包发布不具备原子性；不得为了恢复而覆盖既有 npm 版本。

| 情况                              | 恢复目标                                                                            |
| --------------------------------- | ----------------------------------------------------------------------------------- |
| 尚未发布任何包即失败              | 修复环境后重跑同一候选和产物                                                        |
| 一部分包已发布                    | 核对已发布包的版本和 integrity 后，让 Changesets 继续剩余包；不重新升版             |
| 五包发布完成，标签或 Release 失败 | 独立恢复包级元数据；验证官方工具的补建行为，必要时采用明确的一次性维护操作          |
| 发布后渠道或消费验证失败          | 标记该发布未闭环，保留证据；区分渠道配置故障与产品缺陷，后者走新 changeset 和新版本 |
| 发布全部成功后重复执行            | 不产生新版本、不重复发布；仍能得到五包完整状态                                      |
| 原 artifact 过期或丢失            | 停止自动恢复；重新建立可验证的产物一致性，不能静默重建后冒充原 artifact             |

后验检查读取完整五包预期清单，不只依赖 Action 当次 `published-packages`，因为重跑时输出可能仅含本次补发部分。核对 next/latest 时需识别预发布模式和退出模式；正常发布不自动改写另一条渠道。

registry 查询可对传播延迟做有限重试并记录等待原因；不得把浏览器/功能测试失败归类为传播延迟。发布后失败不能回写成成功，即使 npm publish 本身已成功。

## 文件级实施清单

| 文件或目录                                               | 改动                                                                  |
| -------------------------------------------------------- | --------------------------------------------------------------------- |
| `.changeset/`                                            | 新增配置、贡献说明、首份 changeset、官方命令生成的预发布状态          |
| `package.json`、`pnpm-lock.yaml`                         | 锁定 CLI/CHANGELOG 插件；替换 scripts；同步维护环境声明               |
| 五个公开包的 `package.json`                              | 删除固定 tag；确保 CHANGELOG 随包分发；版本由 Changesets 生成         |
| 五包 `CHANGELOG.md` / README                             | 生成发布记录；移除过期版本描述，更新安装渠道说明                      |
| `.github/workflows/publish.yml`                          | 改为官方 select-mode/version/pack/publish 编排，绑定产物与候选 SHA    |
| `.github/workflows/ci.yml`                               | changeset 意图检查；版本 PR 的例外处理；保留既有质量门禁              |
| `scripts/release-bump.mjs`、对应 spec                    | 删除，以真实 Changesets 集成演练替代                                  |
| `scripts/publish-packages.mjs`、`release-preflight.mjs`  | 删除，不保留兼容别名继续触发旧逻辑                                    |
| `scripts/release-packages.mjs`                           | 删除升版/发布策略；仅必要的包身份断言转入验证模块                     |
| `scripts/verify-release.mjs`                             | 保留公开身份、产物、私有依赖检查；移除固定 next/latest 和预先标签假设 |
| `scripts/verify-pack.mjs`                                | 支持校验官方 pack 输出的 tarball，不另行打包替换待发布文件            |
| 发布后核验脚本                                           | 新增只读核验，禁止包含升版或 npm publish 分支                         |
| `docs/releasing.md`                                      | 重写日常贡献、版本 PR、预发布/稳定版、恢复与后验手册                  |
| `docs/testing/validation.md`、根及包 README、`AGENTS.md` | 同步命令和变更意图契约，移除旧操作指引                                |
| 本计划及迁移工作记录                                     | 更新阶段证据、实际取舍及尚未完成的外部配置                            |

修改前使用限定路径搜索追踪旧脚本的全部引用；历史审计保留事实，不把历史命令批量改成新命令。用简短状态说明区分旧记录与现行手册。

## 实施阶段与验收

### 阶段 A：锁定版本与本地契约演练

交付配置、依赖、版本策略探针。临时仓库不调用官方 npm publish；使用独立端口和临时 store 的测试 registry，依赖仅作为开发测试工具锁定。

必须证明：patch/minor/major 汇总使五包保持同版；私有包不发布；workspace 协议被转换；next 进入/连续发布/退出行为正确；现有 alpha 基线生成预期首个 1.0 候选；CHANGELOG 和 lockfile 可重复生成且无无关漂移。

### 阶段 B：替换脚本、CI 与手册

删除旧发布实现，接通官方子 Action 和真实 tarball 验证。检查权限、模式条件、needs、artifact ID 传递、候选 SHA、串行策略和失败恢复。以阶段 A 的产物运行相关验证，不以 YAML 能解析代替行为验证。

本地运行 frozen-lockfile 安装、相关 Rstest/工具测试、格式/lint/源码类型检查。公开打包链路变更执行隔离安装、主题、SSR 与消费验证；最终候选执行完整发布门禁。已通过且输入未变的检查不为提交重复执行。

### 阶段 C：外部配置与首个 next 发布

核对 GitHub App 安装范围、版本 PR 检查触发、受保护 master、npm Environment 审批，以及五包 Trusted Publisher 指向 `aifuxi/semi-ui-vue` / `publish.yml` / `npm`。文件名相同不代表设置已经正确，需保留核对结果。

先证明机器人能生成并更新版本 PR，且不会发布遗留 alpha。首个候选为目标 `1.0.0-next.0`，在环境审批后真实发布，完成五包 registry/provenance/安装消费与包级标签核验。本地阶段结束但未执行真实发布时，状态应为“本地迁移完成，外部发布待验证”。

### 阶段 D：稳定版切换

产品验收闭环后退出 next 模式。版本 PR 应生成五包 `1.0.0`，经相同门禁发布到 latest。不能因流程迁移完成就提前标记稳定版 ready。

## 回退边界

首次外部发布前可回退配置提交并恢复旧流程，但须保证任何时刻只有一套自动发布触发器。新版本已经发布后不可回滚 npm 历史；保留版本与标签，通过后续 changeset 修复。暂时停用自动发布时保留完整版本记录和待发布 changeset，不恢复旧升版脚本继续推进版本。

## 官方依据

以下资料于 2026-09-11 核对；实施以锁定版本的 schema、源码与实测为准。

- [Changesets 固定分组](https://changesets.dev/guide/fixed-packages)：组内同版与共同发布。
- [Changesets 预发布](https://changesets.dev/guide/prereleases)：pre 状态、渠道及稳定版退出。
- [Changesets 版本与发布](https://changesets.dev/guide/versioning-and-publishing)：版本命令、包级标签与发布职责。
- [Action v2.1.2 version](https://github.com/changesets/action/blob/v2.1.2/version/README.md)：版本 PR、权限与脚本输入。
- [Action v2.1.2 pack](https://github.com/changesets/action/blob/v2.1.2/pack/README.md)：发布计划输入与打包 artifact 输出。
- [Action v2.1.2 publish](https://github.com/changesets/action/blob/v2.1.2/publish/README.md)：发布 artifact、OIDC、标签与 Release。

## 原文档交付证据

本次仅新增迁移计划并在发布手册增加入口；核对了现有脚本、CI 和官方固定版本 Action 接口。格式及 diff 检查结果以本次提交交付为准。未安装 Changesets、未执行上述演练、未修改外部配置、未发布 npm 包。

## 2026-09-11 实施修订

- 已核实 CLI 3.0.2、CHANGELOG 插件 1.0.1 和 Action v2.1.2 peeled commit；固定分组及预发布由官方命令维护。
- 真实演练证明，从 alpha.8 直接进入 next 会得到 next.9。接入改为官方 patch version 生成未发布的 0.1.0 迁移基线，再进入 next 并保留 major changeset，首个版本 PR 才生成 1.0.0-next.0。没有手改最终版本或 pre.json；CHANGELOG 明确标注中间基线未发布。
- CLI 3.0.2 无待处理 changeset 时，version 返回退出码 1，文件保持不变；不把它误判为成功的空升版。
- 原 pack 计划重跑时，CLI 无法识别 Verdaccio / pnpm 返回的重复版本 409。恢复使用官方重新生成的 publish-plan，增加仅绑定原 tarball 的适配；不自研版本、依赖顺序、发布包选择或 npm publish 实现。这个必要适配修订了原方案“不读取计划格式”的假设，输入 schema 固定为 v1，并校验原版本、渠道与 access。
- 原始失败、补发、重复执行、五包精确 workspace 依赖和本地标签补建均由真实 CLI 加独立 registry 演练。GitHub Release 补建、OIDC、版本 PR 触发 CI 仍属于外部待验事项。
- Git 签名失败注入证明 CLI 3.0.2 的 git-tag 命令可能成功退出但没有创建标签；后验增加对实际 GitHub refs、候选 SHA 和 Release 的检查，不依赖 CLI 成功消息。
- 仓库安装保留统一 lockfile；发布 job 使用 frozen-lockfile 与 ignore-scripts 安装锁定工具环境。它会安装根开发依赖，不另造一份会漂移的工具锁文件，也不运行 workspace 生命周期或重新构建。
- 最新五包 registry 与远端 refs 已保存到 [快照](../ai-work/20260911-changesets-registry.json)。master 未受保护，仓库 Actions variables/secrets 为空；npm Environment 已有 required reviewer。未修改外部配置或发布包。
- 完整本地分阶段门禁已通过：1,206 项单测、442 项组件 Chromium、477 项文档 Chromium，以及审计、构建、主题、SSR、官方 tarball 隔离消费。详细命令、故障与取舍见 [实施记录](../ai-work/20260911-125341-changesets-migration.md)。
