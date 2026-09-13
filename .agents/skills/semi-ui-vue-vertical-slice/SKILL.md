---
name: semi-ui-vue-vertical-slice
description: 对齐固定 Semi 基线的 Vue 组件，修复契约差异或完成组件验收。
---

# Vue 组件对齐

以 `vendor/semi-design` 的固定源码为依据，完成用户指定的组件或行为。已有实现与旧快照用于定位，不能自行证明正确。

- 修复已有组件：从可复现差异和 `docs/components/<component>/alignment.md` 入手，只更新受影响契约、实现与证据。
- 新建或完整验收组件：按[组件契约](../../../docs/testing/component-contract.md)核对公开能力、Vue 映射和交付物；必要项未完成时保留缺口，不标记 ready。
- 静态组件文档：直接维护对应契约与迁移说明，按实际修改检查格式、链接及公开 API；发现组件缺陷时按第一项定点修复。

按问题读取对应 React Adapter、Foundation、样式或文档，避免通读无关组件。默认值、受控状态、VNode、Portal 和定位差异按组件契约中的 Vue 适配规则处理。

验证范围与命令见[验证入口](../../../docs/testing/validation.md)。先验证目标行为，再按改动影响验证共享边界与发布产物；复用输入未变且仍有效的结果。验收通过后更新对齐结论及必要的完成状态，按根 `AGENTS.md` 提交并说明剩余差异。

Nuxt 文档站与旧逐示例验收已退役，不启动站点或恢复历史批次。测试工具的后续替代按[设计方案](../../../docs/testing/vue-testing-strategy-proposal.md)另行实施；删除旧机制不增加验收数量。
