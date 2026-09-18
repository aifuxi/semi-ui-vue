# AI 工作记录：Nuxt 文档重建

- 日期：2026-09-05
- 状态：进行中

## 目标

实施用户确认的 Nuxt 文档迁移计划，覆盖全部组件双语内容、官网文档样式、静态生成及可编辑运行的 Vue 示例。

## 验收标准

- 全量内容、示例、API、主题及静态入口完整。
- Nuxt 类型、构建、内容与浏览器门禁通过。
- 固定 Chromium 下验证交互、SSR/hydration、light/dark、中英文及 React/Vue 视觉对照。
- 不修改 vendor，不改变公共组件 API；新依赖、资产记录许可和归属。

## 风险与假设

- 85 个公开根模块、102 组双语上游文档、855 个中文 live Demo 是迁移核对基线，不是已完成数量。
- 上游外部平台内容不作为本站能力；React 用法改为真实 Vue 契约。
- 按用户授权使用 Nuxt Content + 静态生成、现有 components 路径、Vue REPL + Monaco。

## 修改范围

文档应用、文档覆盖记录、相关工程门禁与架构说明。

## 关键决策与权衡

见 ADR 0015。默认入口切换需全量验收；可整体回退迁移相关源码、配置和 lockfile。

## 验证证据

- 初始 `git status --short`：工作区干净。
- `git submodule status vendor/semi-design`：固定 cdfba6e520fc83ad871b30f51f36d8af3aaa5a21 / v2.102.0。

## 未验证事项与剩余风险

实施及验收进行中，尚未宣称完成。
