# AI 工作记录：拆分并迁入 AI 协作治理流程

- 日期：2026-09-05 15:38
- 状态：完成

## 目标

把原本混合在单一 `AGENTS.md` 中的常驻约束、代码变更流程和人工治理制度分层迁入 `semi-ui-vue` 仓库，并保持现有 Semi 对齐规则不变。

## 验收标准

- `AGENTS.md` 保留项目硬约束并提供工作流入口。
- 项目本地 Skill 能被识别，且不会替代 Semi/Vue 专项 Skill。
- 人工治理制度和工作记录模板有独立、可维护的文件。
- Skill 结构和 YAML 可解析，最终 diff 只包含本次相关内容。

## 风险与假设

- 通用工作流可能与现有垂直切片流程重叠，因此明确以专项 Skill 的门禁为准。
- 治理要求若全部常驻会增加上下文和仪式成本，因此仅保留跨任务硬约束。

## 修改范围

- `AGENTS.md`：增加通用协作约束、工作流入口和 Git 提交约束。
- `.agents/skills/ai-change-workflow/`：新增按代码变更任务触发的流程。
- `docs/ai-governance.md`：承载需要人执行的治理制度。
- `ai-work/`：提供按风险使用的记录模板和本次决策记录。

## 关键决策与权衡

### 使用分层结构而非 Plugin

- 选择：采用 `AGENTS.md`、项目本地 Skill、治理文档和模板四层结构。
- 理由：当前需求不需要 MCP、外部服务或 UI，Plugin 会增加不必要的打包和分发成本。
- 备选：把全部规则继续保留在 `AGENTS.md`，或立即封装 Plugin。
- 代价：维护者需要理解不同载体的职责边界。
- 回退：可删除新增 Skill 和文档，并还原 `AGENTS.md` 新增段落。

## 验证证据

- `ruby` 解析 Skill YAML/frontmatter：通过，名称和描述字段完整。
- `pnpm exec prettier --check AGENTS.md .agents/skills/ai-change-workflow/SKILL.md .agents/skills/ai-change-workflow/agents/openai.yaml docs/ai-governance.md ai-work/TEMPLATE.md ai-work/20260905-153833-ai-governance-workflow.md`：通过。
- `git diff --check`：通过；提交前再次核对暂存范围。

## 未验证事项与剩余风险

- 需要通过后续真实任务观察 Skill 的自动触发是否过宽或过窄。
