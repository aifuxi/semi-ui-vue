# 项目协作约束

## 协作与任务范围

- 回复、报告和说明使用中文；直接说明结果、依据和必要取舍。保护用户已有修改，只处理已授权目标和必要依赖。
- 信息足够时直接推进实现、修复与验证；公共 API、依赖或架构变更本身不要求再次审批。仅在目标不明确、超出授权或存在未授权的不可逆操作时询问。
- 选择满足目标的最小实现，保持现有风格；注释解释意图、边界和非显然取舍。只报告实际执行的验证，区分事实、推断与未验证事项。
- 代码或规则变更使用 [ai-change-workflow](.agents/skills/ai-change-workflow/SKILL.md)。低风险修改、纯问答和只读调查不强制建报告；团队治理见 [ai-governance](docs/ai-governance.md)。

## 工具与工作区

- 优先使用 WebStorm MCP 对应能力，并用只读调用确认目标项目；支持 `projectPath` 时传实际仓库或 worktree 的绝对路径，不操作其他项目。
- 运行前查找现有 Run Configuration，无合适配置时用 IDE 终端执行仓库 pnpm 命令。IDE 不可用、能力不支持或失败时说明原因，使用 CLI/文件补丁继续；权限拒绝不得绕过。
- 搜索须限定范围；空结果、截断或索引未就绪不能证明没有引用。修改后按需获取 IDE 诊断，但它不能替代实际类型、测试或构建检查。
- 核对命令退出码与超时；启动服务前检查端口，避免干扰现有服务或并行重建浏览器正在消费的产物。不把个人连接配置写入仓库。

## 产品与源码契约

- 唯一 Semi 参考是只读 submodule `vendor/semi-design`，固定 `v2.102.0` / `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。仅固定源码缺少信息或用户要求检查上游时查在线资料，并标明版本差异。
- 不修改、格式化或复制 vendor 源码后独立维护；项目扫描与检查排除 `vendor/**`。Foundation 通过私有集成边界编译，发布包内联所需逻辑和编译样式，消费者无需 submodule。
- 目标覆盖固定版本全部公开组件与资产；视觉、行为、可访问性、主题和 `.semi-*` / `--semi-*` 兼容契约不因流程精简而缩减。
- 公开 API 使用 Vue 原生 props/emits/slots/v-model；源码使用 TypeScript、Composition API、`<script setup lang="ts">`，默认不用 Options API/JSX，必要的 DOM/VNode 适配允许局部 render function。
- 所有公开包 SSR-safe import；provider 实例隔离，DOM/Observer/事件在客户端创建并清理，身份敏感对象避免深层代理。具体 Adapter 边界按任务读取 [组件验收契约](docs/testing/component-contract.md)。
- 保持 pnpm workspace、统一 lockfile 和既有分包依赖方向，见 [架构](docs/architecture/workspace.md)。公开包提供 ESM、类型、根及逐组件 CSS、明确 exports、tree-shaking；不新增 CJS/UMD。
- 对外使用独立品牌；保留 Semi MIT 与适用第三方声明，新增资产时同步归属及 SBOM。文档页头保留现有 IconSemiLogo 的限定例外，见 [页头记录](docs/documentation/site-header.md)。

## 按影响验证

- 普通维护从当前缺陷和受影响契约开始，不重新套用组件从零建设流程。完整组件验收使用 [垂直切片 Skill](.agents/skills/semi-ui-vue-vertical-slice/SKILL.md) 和 [组件契约](docs/testing/component-contract.md)；文档示例使用 [文档流程](docs/documentation/workflow.md)。
- 日常 `pnpm check` 执行静态检查、源码类型、单测和工具测试，不清理工作区或构建全站。产物检查用 `pnpm check:artifacts`，全量回归用 `pnpm check:full`，发布用 `pnpm release:check`；选择规则见 [验证入口](docs/testing/validation.md)。
- 测试证明公开行为和关键不变量；覆盖率用于发现缺口，不统一要求每文件四项 100%，不为指标编写低价值测试或维护人工豁免表。
- 浏览器只承诺锁定的 Playwright Chromium；保持同环境 React/Vue 对照、关键样式/几何和局部像素门槛。真实焦点、Portal、拖拽、动效不能用 jsdom 代替。
- 先做定点验证，稳定后集中执行受影响的昂贵检查。已通过且输入未变的检查不因提交重跑；共享运行时、主题、测试基础设施或发布变更才按影响扩大范围。
- 本地定位默认不重试；CI 可保留两次重试用于诊断，并以 `failOnFlakyTests` 阻止 flaky 通过。单独运行才成功时先定位共享状态、资源或环境原因，不预先归咎 runner 或 spec，不靠增加重试掩盖失败。
- 新标记 ready 的切片同步 README；维护已完成组件无需重写进度。历史证据失效时如实标记，仅用户目标要求恢复 accepted 时运行相应完整矩阵，不修改旧指纹伪造有效性。

## 提交

- 改变公开产物时提交 Changesets 记录，纯文档/测试/内部工具使用空 changeset；版本由机器人维护。流程与恢复见 [发布手册](docs/releasing.md)，不手改公开版本或手工触发旧标签发布。

- 每项已完成并通过对应验收的任务自动创建独立 commit，无需再次询问。提交前检查最终 diff，仅暂存本次文件；未经验证的结果和无关修改不混入提交。
- 提交说明包含结果、实际验证及剩余问题；没有提交成功不得声称已提交。
