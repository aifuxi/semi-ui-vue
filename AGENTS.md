# 项目协作约束

## 协作与工具

- 使用中文；保护已有修改，只处理授权目标及必要依赖。信息足够时直接实现、验证；仅目标不明、超出授权或涉及未授权不可逆操作时询问。
- 优先使用 WebStorm MCP，先只读确认项目，`projectPath` 传实际仓库或 worktree 的绝对路径。运行前查找 Run Configuration，无合适配置用 IDE 终端；能力不可用或失败时说明原因后用 CLI/补丁继续，权限拒绝不得绕过。
- 搜索限定范围，空索引或截断结果须补查。运行核对退出码；超时后先确认进程、端口和日志再重跑。复用匹配的服务，避免共享输入、端口和产物争用；个人连接配置不入库。

## 实现契约

- Semi 唯一基线：只读 `vendor/semi-design`，`v2.102.0` / `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。仅基线缺少信息或用户要求时查上游在线资料，并标明版本差异。
- 不修改、格式化或复制 vendor 源码后独立维护；自有代码扫描排除 `vendor/**`，基线核验与生成工具按需读取。Foundation 经私有集成边界编译，公开包内联所需逻辑，消费者无需 submodule。
- 覆盖固定基线全部公开组件与资产，保持视觉、行为、可访问性、主题及 `.semi-*` / `--semi-*` 兼容。
- 使用 TypeScript、Composition API、`<script setup lang="ts">` 和 Vue props/emits/slots/v-model；默认不用 Options API/JSX，局部 DOM/VNode 适配可用 render function。
- 公开 JavaScript 入口支持无 DOM 导入；provider 实例隔离，DOM/Observer/事件在客户端创建并清理，身份敏感对象避免深层代理。
- 保持 pnpm workspace、统一 lockfile 和[依赖方向](docs/architecture/workspace.md)。JavaScript 包提供 ESM、类型和明确 exports，主题包提供根及逐组件 CSS；保留 tree-shaking，不新增 CJS/UMD。
- 使用独立品牌，保留 MIT、第三方声明与 SBOM；新增资产同步归属。文档页头 IconSemiLogo 的限定例外见[页头记录](docs/documentation/site-header.md)。

## 任务入口与验证

按任务读取下列流程；无技能加载器时直接读 `SKILL.md`，不重复抄写专项步骤：

- 代码或规则变更：[ai-change-workflow](.agents/skills/ai-change-workflow/SKILL.md)；低风险修改不强制建报告，团队制度见[治理文档](docs/ai-governance.md)。
- 组件实现与对齐修复：[垂直切片技能](.agents/skills/semi-ui-vue-vertical-slice/SKILL.md)和[组件契约](docs/testing/component-contract.md)；维护从受影响契约开始。
- 文档示例：[文档流程](docs/documentation/workflow.md)；批量或并行严格验收使用[并行验收技能](.agents/skills/parallel-documentation-acceptance/SKILL.md)，子 agent 准备，主 agent 统一构建与正式验收。
- 检查范围：[验证入口](docs/testing/validation.md)。`pnpm check` 用于日常检查，`check:artifacts` 验证产物，`check:full` 做全量回归，`release:check` 用于发布前；纯规则/文案只做格式、链接与差异检查。
- 浏览器验收使用锁定 Playwright Chromium 的 React/Vue 对照，保留样式、几何和像素门槛；真实焦点、Portal、拖拽和动效须有浏览器证据，手工截图不替代正式矩阵。
- 测试断言公开行为和可观察终态，不用固定延时、增加重试或降低门槛掩盖失败，不强求逐文件 100% 覆盖率。
- 昂贵验收前完成 diff 自审、静态检查及要求的 review/指纹，冻结输入；变更后按影响重验，复用工具核验仍有效的证据。历史证据失效须如实保留，仅任务要求恢复 accepted 时跑完整矩阵，不改旧指纹。
- 组件完成度、文档映射与有效验收分开记录；动态批次进度维护在[文档计划](docs/documentation/batch-plan.md)与覆盖账本，README 保留概览和入口。

## 交付与提交

- 公开产物变更添加 Changesets；纯文档、测试或内部工具用 `pnpm changeset --empty`。版本由机器人维护，不手改版本或手工触发旧标签发布，见[发布手册](docs/releasing.md)。
- 每项完成且通过对应验收的任务自动创建独立 commit；提交前审阅最终 diff，仅暂存本次文件。
- 交付和提交说明包含结果、实际验证及剩余问题；未执行的检查、未成功的提交不得声称完成。
