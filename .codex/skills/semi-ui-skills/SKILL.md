---
name: semi-design-guide
description: 查询消费项目指定版本的 Semi React API 与业务用法；不用于本仓库的 Vue 组件对齐或 vendor 升级。
---

# Semi Design 使用指南

通过消费项目对应版本的 Semi MCP 文档，解决上游 Semi React 组件的 API 和业务集成问题。

## 适用边界

- 本仓库的 Vue 组件复刻、Foundation 集成、主题对齐、React/Vue 对照和完整切片，使用 [semi-ui-vue-vertical-slice](../../../.agents/skills/semi-ui-vue-vertical-slice/SKILL.md)。
- Vue 复刻的唯一基线是固定的只读 `vendor/semi-design` v2.102.0；不得用 Semi MCP 或在线最新资料替换。
- 查询前确定用户指定或消费项目实际安装的精确版本，文档、示例、源码和函数调用都显式传入同一 `version`。工具默认版本不同，不能依赖默认值。
- 普通查询不授权修改外部配置、升级依赖或操作其他系统；后续修改仍以用户任务范围为准。

## 按需阅读

- 查询组件 API、示例或解释实现行为时，读 [WORKFLOWS.md](WORKFLOWS.md)，按问题逐步获取证据。
- 处理引入、主题、React 兼容或组件扩展时，读 [BEST_PRACTICES.md](BEST_PRACTICES.md)。

本仓库的 MCP 配置见 [.codex/config.toml](../../config.toml)。先检查当前可用工具；工具不可用时说明限制，配置变更按用户任务处理。
