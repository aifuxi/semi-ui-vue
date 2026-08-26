---
status: accepted
---

# 使用 Vue 原生公开 API 表达 Semi 对齐契约

Vue 移植版在视觉、行为、状态、可访问性和主题上对齐 Semi Design v2.102.0，但不字面复制 React 的组件语法。公开 API 使用 Vue 原生 `props`、`emits`、`slots` 和 `v-model`，同时尽量保留 Semi 的组件名、枚举值和可自然保留的 prop 名。

## Consequences

- 每个 React callback、render prop、children 结构、Context 和 ref API 都必须在对齐矩阵中记录 Vue 映射。
- 受控与非受控状态必须保留语义、默认值、事件载荷和调用顺序，`v-model` 是 Vue 表达方式，不是改写行为的理由。
- 不为了保留 `ReactNode`、render props 或 React ref 而设计不自然的 Vue API。
- 公布组件时必须同时提供 React 到 Vue 的逐项迁移表，并明示任何无法等价的差异。
