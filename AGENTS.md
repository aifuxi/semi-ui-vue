# 项目协作

目标：交付可发布、可维护的 Vue 组件库，完整对齐固定 Semi 基线。使用中文，在授权范围内完成实现、验证和提交。

## 项目契约

- 唯一基线是只读 `vendor/semi-design`：`v2.102.0` / `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。仅基线缺少信息或用户要求时查在线上游，并标明版本差异。
- 保留公开行为、可访问性、主题和 `.semi-*` / `--semi-*` 兼容；公开 API 使用 Vue props/emits/slots/v-model，源码使用 TypeScript、Composition API 和 `<script setup lang="ts">`。
- Foundation 经私有集成边界编译，vendor 不修改、不复制后独立维护，也不进入自有代码扫描。公开包提供 ESM、类型、明确 exports 与编译 CSS，支持无 DOM 导入，消费者无需 submodule。
- 保持 pnpm workspace 与统一 lockfile。使用独立品牌，保留 MIT、第三方归属与 SBOM。

## 工具与执行

## MCP 使用顺序

- 代码定位、依赖分析、调用链调查：优先调用 `mcp__codegraph__codegraph_explore`。
- 文件读取、项目诊断、运行配置和 IDE 执行：优先调用 `mcp__webstorm__*`，并始终传入当前仓库的绝对 `projectPath`。
- 只有对应 MCP 工具未出现在当前会话工具注册表，或实际调用失败时，才声明 MCP 不可用并回退 CLI。
- 不要把 `vendor/semi-design` 中的 Semi MCP 文档或组件 API 当成当前会话已连接的 MCP server。

- 会话中确认一次项目和可用运行配置，复用 [.run](.run/)；临时参数用 IDE 终端。权限拒绝不绕过。环境设置见[工具链](docs/architecture/toolchain.md)。
- 本地浏览器探索与调试使用项目 [Playwright CLI skill](.agents/skills/playwright-cli/SKILL.md) 和 `pnpm playwright:cli`；默认完整 Chromium 的新 headless 模式。正式回归仍运行 Playwright Test，3 个并行 worker，CLI 操作记录不计作验收通过。
- 本地实现、依赖准备、可丢弃测试、修复和提交已获授权，无需逐步确认。保护已有修改；共享服务和产物由一个执行者管理。超时先确认进程和日志，避免重复启动。
- 验证以本次目标和影响为准，复用仍有效的证据；纯文案不跑整库构建或浏览器矩阵。不要用重试、固定延时、放宽断言或改旧指纹制造通过。
- 不默认创建工作报告、审批表或固定数量的子 agent。重要取舍和剩余问题写入现有契约、提交或交付说明即可。
- 日志、运行报告、诊断截图和压缩附件放入本地已忽略目录或 CI artifacts，不提交 Git；现行测试使用的快照基线继续跟踪。

## 按需入口

| 任务                      | 入口                                                           |
| ------------------------- | -------------------------------------------------------------- |
| 组件实现、对齐修复        | [组件技能](.agents/skills/semi-ui-vue-vertical-slice/SKILL.md) |
| 组件契约与静态文档        | [组件契约](docs/testing/component-contract.md)                 |
| 测试体系替代设计          | [测试方案](docs/testing/vue-testing-strategy-proposal.md)      |
| 选择检查范围              | [验证入口](docs/testing/validation.md)                         |
| 包依赖、exports、构建边界 | [工作区架构](docs/architecture/workspace.md)                   |
| 发布准备与上线            | [发布手册](docs/releasing.md)                                  |
| 组件库文档站              | [文档站说明](apps/docs/README.md)                              |

完成条件是目标已实现、受影响检查通过、剩余问题如实说明。完成后仅暂存本次文件并创建独立 commit；公开产物用 Changesets，纯文档/测试/内部工具用 `pnpm changeset --empty`。版本由机器人维护。组件状态及缺口写入对应组件契约，稳定发布剩余工作写入[发布审计](docs/release-audit-1.0.md)。

Nuxt 文档站及旧逐示例验收体系已退役，不再作为开发、测试或发布前置条件。本次删除不代表组件验收通过；保留的源码和文字记录通过 Git 追溯，已清理的原始附件不再保留，退役与清理范围见[说明](docs/documentation/README.md)。新测试工具或站点仅在对应任务中实施。
