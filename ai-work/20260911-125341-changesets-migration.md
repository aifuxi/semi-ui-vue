# AI 工作记录：Changesets 发布迁移

- 日期：2026-09-11
- 状态：本地迁移完成，外部发布待验证

## 目标与范围

执行 `docs/changesets-migration-plan.md`，用官方 Changesets 接管五包版本、预发布、CHANGELOG、版本 PR、pack/publish 和包级标签，保留项目完整产物、SSR、主题、Chromium 门禁。工作区开始时干净，代码基线为 `6edc5d0`。未修改组件实现、vendor 或远端配置，未发布 npm。

## 关键决策与实测修订

- CLI 锁定 3.0.2，GitHub CHANGELOG 插件锁定 1.0.1，Action v2.1.2 的 annotated tag 指向 `ae32849d5ba541f9ae29e40e22a623bc13562f51`。维护环境收敛到既有 mise 的 Node 24.18.0 / pnpm 12.3.4。
- CLI 从 alpha.8 直接进入 next 会生成 `1.0.0-next.9`。核对官方 `getPreVersion` 后，改用原生 patch version 清除 alpha 计数，生成未发布的 `0.1.0` 基线，再进入 next 并保留 major changeset。当前真实 status 输出五包下一版本均为 `1.0.0-next.0`。五包 CHANGELOG 均声明中间基线未发布，没有伪造 npm 历史。
- 删除旧 bump、preflight、publish 实现及 bump spec；包身份常量迁入 `public-packages.mjs`，不保留升版或渠道算法。源码保持 `workspace:*`，pack 验证精确内部依赖。
- 官方 pack 的原始 tarball 交给 `verify-pack`，正常发布直接传递官方 artifact ID。证据包含候选 SHA、原计划 SHA-512、五包 SHA-512 和内部依赖；同时核对官方计划中的渠道、access、版本、路径和 SHA-256。发布前拒绝过时候选、未保护的 master、渠道回拨或已有版本 integrity 不同。
- Verdaccio 6.10.3 的实际 409 错误不能被 CLI 3.0.2 的重复发布文本匹配识别，原 artifact 直接重跑会在已发布包处中断。恢复使用官方新 `publish-plan` 并绑定原 tarball；适配只读取固定 v1 传输字段，不计算版本、依赖顺序或发布选择。这是对原方案“不读取计划格式”的必要修订，原始失败与恢复成功均保留在集成测试中。
- 手动恢复必须给原始 run ID 和精确 SHA，校验原质量/浏览器/pack 检查与未过期 artifact。缺失 artifact 或已过时 SHA 拒绝自动恢复；不把重新构建的文件冒充原产物。
- 发布 job 使用统一 lockfile 的 ignore-scripts 安装，官方发布时也禁用生命周期脚本；根开发依赖会安装，避免另建一份工具锁文件。没有将 App token 传入 npm job。
- postcheck 根据完整五包证据核对 registry、依赖、渠道、integrity、provenance 的来源/候选/摘要，并执行官方 registry 安装、npm 签名审计和 SSR import；失败写出部分证据并保持失败状态。

## 已执行验证

- 固定版本 registry 查询、Action tag clone/peeled commit 和源代码接口检查通过。
- `pnpm install --frozen-lockfile` 通过。lockfile 新增 224 个包版本；旧 package version 无删除，旧 resolution 无变化。新增依赖满足了已有 optional peer（例如 uglify-js），因此部分 peer snapshot 标识随之变化，没有升级原有包版本。
- `pnpm test:changesets`：4 项检查通过；真实 CLI/registry 演练涵盖 PR 意图和机器人例外、alpha 接入、next 连续升版/退出、patch/minor/major 五包同版、私有包不升版/不打标签、真实 GitHub CHANGELOG 插件及 lockfile 无重复漂移、workspace 转换、部分发布失败/恢复/重复执行、渠道计划误配拒绝、Git 签名故障与五包本地标签补建。另以受控 API 数据验证缺失 Release、错误候选与草稿 Release 均失败。
- 固定 Action 的 `dist/select-mode.js` 在当前工作区运行，实际输出 `mode=version`，没有选择迁移基线发布。
- `pnpm check` 的静态、格式、lint、源码类型阶段通过。首次单测因 Rstest 误发现 Node `.test.mjs` 集成文件失败；文件改名为 `.integration.mjs` 后单独重新运行 `pnpm test:unit`：177 个文件、1,206 项全部通过，无 skip / todo / snapshot 更新。
- `pnpm test:tooling`：73 + 6 项通过；`pnpm audit:prod`：无已知生产依赖漏洞。
- `pnpm build` 通过，包含 Nuxt 类型、198 页静态站与两个对照工作台。`verify:theme-dist`（86 个入口）、`verify:ssr-dist`（780 个公开 JS 入口及 Chat Markdown）和 `release:verify` 通过。
- 官方 `pnpm changeset pack --out-dir /tmp/semi-changesets-original-pack` 在当前未发布基线上生成五包 tarball；`PACK_DIR=... pnpm verify:pack-isolated` 通过真实安装、exports、类型、CSS、SSR、tree-shaking 和 JsonViewer Worker。只执行 pack，没有执行这些产物的 publish；新版本 PR 候选仍需 CI 重新验证。
- `pnpm test:browser`：442 项通过，2.0 分钟，无重试、跳过或快照更新。
- `pnpm --filter @workspace/docs test:nuxt`：477 项通过，13.6 分钟，无重试或跳过。最终 README/CHANGELOG 说明补齐后，重新执行官方 pack 与隔离消费验证通过，产物目录为 `/tmp/semi-changesets-final-pack`。
- actionlint 1.7.12 对两份工作流通过；WebStorm 对发布工作流和证据脚本未报错误。
- 后验的 registry 路径以历史 `0.1.0-alpha.4` 五包及已核实候选 `8bff7a1...` 做只读探针：五包 provenance/候选/摘要、隔离安装、36 个 registry 签名、23 个 attestations 和 SSR import 通过。此探针运行于增加包级 GitHub 元数据核验之前，不包含新标签/Release；新元数据核验只有受控 API 测试，不能称为外部验收。
- Git 签名故障注入发现 CLI 3.0.2 忽略 `git.tag` 返回的 false，输出成功但没有创建标签。测试保留该事实并验证修复签名配置后的恢复；工作流增加实际 GitHub refs 和 Release 后验，避免仅依据成功消息闭环。

## 外部核对与剩余事项

- 五包当前 npm 均为 `next=0.1.0-alpha.4`、`latest=0.1.0-alpha.0`，完整 refs 与版本快照见 `20260911-changesets-registry.json`。
- npm Environment 存在 required reviewer `aifuxi`；master API 返回 `protected=false`，仓库 Actions variables/secrets 为空。需配置 GitHub App、`RELEASE_APP_ID`、`RELEASE_BOT_LOGIN`、`RELEASE_APP_PRIVATE_KEY`，保护 master，并验证机器人创建/更新 PR 能触发 CI。
- `npm trust list @aifuxi/semi-ui-vue` 返回 E401（当前 npm 身份不能读取）；五包 Trusted Publisher 尚未核实，不能从历史 provenance 推断现行配置正确。
- GitHub Release 的远端补建、首个版本 PR、OIDC 发布和新候选后验均未执行；稳定版切换须等待产品验收。
- IDE 文件读取存在中段截断，长终端调用超时不返回退出码；已用 CLI 补充读取和跟踪长任务退出码。

## 回退

首次外部发布前可回退本提交，保证仅一套触发器。任何新版本发布后保留历史，以新 changeset 修复，不覆盖 npm 版本或 Git 标签。
