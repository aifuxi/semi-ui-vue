---
name: semi-design-guide
description: 查询或使用上游 Semi Design React 组件的 MCP 指南，包括 API、常见模式和业务集成最佳实践。仅用于普通 Semi 使用问题；不用于本仓库基于只读 vendor v2.102.0 的 Vue 组件复刻、垂直切片或对齐验收。
---

# Semi Design 使用指南

此 Skill 帮助你高效使用 Semi Design 组件库完成常见开发任务。

## 适用边界

- 用于查询或消费上游 Semi React 组件、了解 API，以及解决普通业务集成问题。
- 如果任务涉及本仓库的 `packages/ui`、Foundation 集成、主题、React/Vue 对照、组件完整切片，或用户说“开始/继续下一个组件”，应改用项目级 `semi-ui-vue-vertical-slice`。
- 在 Vue 复刻任务中不得把 Semi MCP 或在线最新资料作为对齐基线；唯一基线是仓库固定的只读 `vendor/semi-design` v2.102.0。

## 文件说明

本 Skill 由以下文件组成，每个文件专注于特定方面的指导：

### WORKFLOWS.md

**内容**：使用 Semi MCP 工具的完整工作流程。

**包含**：
- MCP 工具概览：介绍 `get_semi_document`、`get_component_file_list`、`get_file_code`、`get_function_code` 四个工具的功能和使用场景
- 基础查询流程：查找组件 → 查询详情 → 查看源码 → 查看函数实现的四步走流程
- 完整任务示例：包含 Table 筛选、表单验证、级联选择器、拖拽排序等常见场景的详细步骤
- 常用查询技巧：指定版本查询、获取完整代码、错误排查流程等

**何时使用**：当你需要查询组件文档、了解组件 API、实现某个具体功能但不确定如何下手时。

### BEST_PRACTICES.md

**内容**：使用 Semi Design 组件的最佳实践和注意事项。

**包含**：
- 组件引入方式：推荐直接 import 导入组件、图标、样式的方式
- 主题定制指南：引导 AI 查阅官方定制文档
- React 19 兼容性：说明如何获取 React 19 相关的组件使用说明
- 组件扩展方法：当 props 无法满足需求时，如何通过继承扩展 Semi 组件 和 修改组件内部UI

**何时使用**：当你需要确保代码符合最佳实践、解决组件使用中的疑难问题时。

## 快速导航

| 需求 | 查看 |
|------|------|
| 如何使用 MCP 工具查询组件 | [WORKFLOWS.md](WORKFLOWS.md) |
| 组件使用的最佳实践 | [BEST_PRACTICES.md](BEST_PRACTICES.md) |

## 概述

Semi Design 是字节跳动推出的企业级 UI 组件库。此 Skill 配合 [Semi MCP](/start/ai-mcp) 工具使用，提供：

- **工作流**：使用 MCP 工具查询组件、生成代码的完整流程
- **实践**：避免常见陷阱的最佳实践

## 前置条件

使用此技能前，请确保已配置 Semi MCP：

```json
{
  "mcpServers": {
    "semi-mcp": {
      "command": "npx",
      "args": ["-y", "@douyinfe/semi-mcp"]
    }
  }
}
```
