# 旧文档站退役说明

Nuxt 文档站与旧逐示例验收体系于 2026-09-13 移除。组件开发、类型检查、构建、浏览器对照和包发布不再依赖旧站点；现行 VitePress 文档站位于 `apps/docs`，维护与验收入口见其 [README](../../apps/docs/README.md)。

移除范围包括站点应用、REPL、站点资源与构建准备、文档浏览器矩阵、映射和批次数据、覆盖账本、压缩证据、专用工具及并行验收技能。旧 `accepted`、待恢复数量和示例映射不再用于判断当前工作完成度。删除旧机制不增加组件或示例的验收数量。

保留只读 `vendor/semi-design` 固定基线、[静态组件契约](../components/)、[组件验收要求](../testing/component-contract.md)、[现有验证入口](../testing/validation.md)和[发布手册](../releasing.md)。组件缺口仍需按公开契约修复并验证。现行 Vitest、Storybook 与 Playwright 分层见已实施的[测试方案](../testing/vue-testing-strategy-proposal.md)。

旧站点源码、映射与文字决策可通过 Git 历史查阅，例如 `git log -- apps/docs docs/documentation`。为缩减推送体积，`docs/documentation/evidence/`、`docs/documentation/coverage.json` 与 `ai-work/` 下的非 Markdown 附件已从当前树及未发布历史清理，原始报告、日志、诊断截图、补丁和外部快照不再保留。

保留的组件记录或研究材料可能引用已清理附件的历史路径和当时结果；这些路径仅说明历史背景，不再提供原始附件，也不替代当前候选的有效证据。后续运行附件放入本地已忽略目录或 CI artifacts，不提交 Git；`tests/browser/snapshots/` 中现行测试使用的基线继续保留。
