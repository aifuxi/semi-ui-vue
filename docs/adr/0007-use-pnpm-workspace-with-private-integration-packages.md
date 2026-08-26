---
status: accepted
---

# 使用 pnpm workspace 管理发布包与私有集成包

项目使用 pnpm workspace 单仓库，将 Vue 组件、Foundation 集成层、默认主题、图标、插画和测试基础设施分包管理。React 参考应用与 Vue 文档应用放在 `apps/` 下，共享同一 lockfile 和工具链。

## Consequences

- 对外发布一个主组件包以及独立的默认主题、图标和插画包。
- Foundation 集成层与测试基础设施保持 `private`，不向用户暴露深层导入或独立版本契约。
- workspace 内部依赖使用明确的包边界，避免应用或公开包绕过 Foundation 集成层直接读取 vendor 深层路径。
- npm scope、最终包名与品牌名不由内部目录名推导，在发布前单独冻结。
