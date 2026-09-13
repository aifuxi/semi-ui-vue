# 项目协作

目标：交付可发布、可维护的 Vue 组件库，完整对齐固定 Semi 基线。使用中文，在授权范围内完成实现、验证和提交。

## 项目契约

- 唯一基线是只读 `vendor/semi-design`：`v2.102.0` / `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。仅基线缺少信息或用户要求时查在线上游，并标明版本差异。
- 保留公开行为、可访问性、主题和 `.semi-*` / `--semi-*` 兼容；公开 API 使用 Vue props/emits/slots/v-model，源码使用 TypeScript、Composition API 和 `<script setup lang="ts">`。
- Foundation 经私有集成边界编译，vendor 不修改、不复制后独立维护，也不进入自有代码扫描。公开包提供 ESM、类型、明确 exports 与编译 CSS，支持无 DOM 导入，消费者无需 submodule。
- 保持 pnpm workspace 与统一 lockfile。使用独立品牌，保留 MIT、第三方归属与 SBOM。

## 工具与执行

- 代码定位与依赖分析优先 CodeGraph；配置、文档或索引遗漏用定向搜索/读取补足。
- 编辑和运行优先 WebStorm MCP，`projectPath` 使用实际仓库或 worktree 的绝对路径。会话中确认一次项目和可用运行配置，复用 [.run](.run/)；临时参数用 IDE 终端。MCP 不可用时说明后用 CLI/补丁继续，权限拒绝不绕过。环境设置见[工具链](docs/architecture/toolchain.md)。
- 本地实现、依赖准备、可丢弃测试、修复和提交已获授权，无需逐步确认。保护已有修改；共享服务和产物由一个执行者管理。超时先确认进程和日志，避免重复启动。
- 验证以本次目标和影响为准，复用仍有效的证据；纯文案不跑整库构建或浏览器矩阵。不要用重试、固定延时、放宽断言或改旧指纹制造通过。
- 不默认创建工作报告、审批表或固定数量的子 agent。重要取舍和剩余问题写入现有契约、提交或交付说明即可。

## 按需入口

| 任务                      | 入口                                                                      |
| ------------------------- | ------------------------------------------------------------------------- |
| 组件实现、对齐修复        | [组件技能](.agents/skills/semi-ui-vue-vertical-slice/SKILL.md)            |
| 文档示例维护              | [文档流程](docs/documentation/workflow.md)                                |
| 批量或并行文档严格验收    | [并行验收技能](.agents/skills/parallel-documentation-acceptance/SKILL.md) |
| 选择检查范围              | [验证入口](docs/testing/validation.md)                                    |
| 包依赖、exports、构建边界 | [工作区架构](docs/architecture/workspace.md)                              |
| 发布准备与上线            | [发布手册](docs/releasing.md)                                             |

完成条件是目标已实现、受影响检查通过、剩余问题如实说明。完成后仅暂存本次文件并创建独立 commit；公开产物用 Changesets，纯文档/测试/内部工具用 `pnpm changeset --empty`。版本由机器人维护。组件 ready、文档映射、有效验收和稳定发布分别记录；动态进度只维护[文档计划](docs/documentation/batch-plan.md)与覆盖账本。
