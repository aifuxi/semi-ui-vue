---
status: accepted
---

# 六个参考组件通过后再批量迁移文档

首批完整迁移 Button、Select、Modal、Table、Icon 和 JsonViewer，分别覆盖基础与组合 API、v-model/Slots/Emits/Portal、命令式浮层、超长复杂 API、独立资源包以及 Worker 与 SSR 激活边界。这六个页面需要共同闭合站点壳、双语路由、文件示例、API 生成、搜索、覆盖清单、视觉与可访问性回归和通用静态产物。

## Consequences

- 参考批次通过前不冻结页面模板，也不机械生成其余组件页面。
- 参考批次完成后，对内容模型、Demo 容器或 API 元数据格式的破坏性修改需要先评估全部已迁移页面的返工成本。
- 其余组件按固定上游分类分批迁移，并使用参考批次形成的模板与门禁，而不是各自设计页面结构。
