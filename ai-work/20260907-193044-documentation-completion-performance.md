# AI 工作记录：文档补齐流程提速

- 日期：2026-09-07 19:30
- 状态：完成

## 目标

避免文档示例补齐在代表阶段重复执行完整站点生成、全量检查和串行双语 smoke，并让失败能直接定位到语言与交互阶段。

## 验收标准

- 开发入口仅校验或重建 `resources`，不运行 `site`、`checks` 或正式浏览器矩阵。
- 双语 smoke 默认并发，统一记录具名阶段耗时、浏览器错误与动效关闭结果。
- 代表浏览器路径通过前，流程明确禁止铺开其余示例。
- 既有正式验收证据不因本次流程工具变更失效。

## 风险与假设

- resources 的复用必须沿用正式准备入口的完整上下文和内容哈希，不能退回时间戳或未校验的跳过构建。
- 开发站 Monaco worker 限制只能精确分类，不能吞掉其它 console、page 或请求错误；最终静态站不启用开发 fallback。

## 修改范围

- `.agents/skills/ai-change-workflow/scripts/`：新增缓存感知的开发入口、共享 smoke runner 及单元测试。
- `.agents/skills/ai-change-workflow/SKILL.md`、`docs/documentation/workflow.md`：将代表先行、并发 smoke、失败定点重跑和新命令写成硬约束。

## 关键决策与权衡

### 工具放在项目 Skill 内

- 选择：复用 `apps/docs/scripts` 的正式缓存实现，但把补齐线辅助工具放在项目 Skill 中。
- 理由：共享同一份 resources 新鲜度证明，同时避免仅为开发辅助工具修改正式验收指纹覆盖的脚本目录，导致所有历史批次无意义重验。
- 备选：直接改 `apps/docs/package.json` 和 `apps/docs/scripts`；会使现有六批证据失效并触发约 6 分钟的正式重验。
- 代价：开发者需要使用工作流文档中的新命令，而不是旧的 docs `dev` script。
- 回退：删除新增脚本并恢复工作流中的原开发命令。

## 验证证据

- `node --test .agents/skills/ai-change-workflow/scripts/documentation-tools.test.mjs`：6 个测试通过，覆盖缓存复用、阶段选择、精确错误分类、动效关闭和双语并发。
- `node .agents/skills/ai-change-workflow/scripts/documentation-dev.mjs --prepare-only`：resources 内容校验命中耗时 0.2 秒，总准备 6.7 秒；只执行内容注册与覆盖生成，没有 site/checks。
- 临时静态站 smoke：第一次在 3.5 秒内把双语同名按钮歧义定位到 `load` 阶段；只修 locator 后再次运行，zh-CN/en-US 并发通过，总墙钟 4.1 秒，两个语言均完成 `load` 与 `basic-open-close`，无错误或 known issue。
- `pnpm --filter @workspace/docs accept:nuxt:batch --affected --plan`：button、config-provider、dark-mode、icon、locale、navigation 六批证据全部有效，跳过构建和浏览器验收。
- `git diff --check`：通过。

## 未验证事项与剩余风险

- 未执行完整 `pnpm --filter @workspace/docs check`：本次没有修改 docs 应用、组件、构建输入或发布产物；以真实缓存准备、实际 Chromium smoke、辅助工具单测和 affected 计划作为范围内验证。
- 单批总耗时仍取决于示例数量、编辑器路径和最终一次联合静态检查；本次消除的是代表阶段的重复重准备、重复 runner 调试和双语串行等待。
