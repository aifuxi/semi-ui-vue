# 文档站退役说明

Nuxt 文档站与旧逐示例验收体系于 2026-09-13 移除。组件开发、类型检查、构建、浏览器对照和包发布不再依赖站点；本次不创建替代站点，也不切换测试 runner。

移除范围包括站点应用、REPL、站点资源与构建准备、文档浏览器矩阵、映射和批次数据、覆盖账本、压缩证据、专用工具及并行验收技能。旧 `accepted`、待恢复数量和示例映射不再用于判断当前工作完成度。删除旧机制不增加组件或示例的验收数量。

保留只读 `vendor/semi-design` 固定基线、[静态组件契约](../components/)、[组件验收要求](../testing/component-contract.md)、[现有验证入口](../testing/validation.md)和[发布手册](../releasing.md)。组件缺口仍需按公开契约修复并验证。Vitest、Storybook 与测试组织方式的后续迁移见[替代方案](../testing/vue-testing-strategy-proposal.md)，该方案尚未实施。

旧站点内容、映射、验收报告与站点决策可通过 Git 历史查阅，例如 `git log -- apps/docs docs/documentation`。保留的组件记录或研究材料可能引用这些历史路径和当时结果；它们不要求恢复旧工具，也不替代当前候选的有效证据。
