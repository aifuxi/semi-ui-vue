---
status: accepted
---

# 使用 Astro、Starlight、Vue 3 与 TypeScript 构建组件文档门户

组件文档门户采用 Astro 与 Starlight 构建内容、导航和站点基础能力，交互示例使用 Vue 3 与 TypeScript。该组合既能承载首期完整组件文档迁移，也能在不替换内容架构的前提下扩展为包含首页、设计资源与生态内容的完整官网门户。

## Considered Options

- VitePress：与 Vue 结合直接，但门户未来不只包含 Vue Markdown 文档。
- 迁移上游 Gatsby 官网：视觉和内容结构可参考，但会继承 React 与旧 Gatsby 内容管线，不适合作为 Vue 门户的长期基础。
- 自研 Astro 站点：扩展自由，但会重复实现 Starlight 已提供的文档导航、内容组织和可访问性基础。

## Consequences

- Starlight 负责文档信息架构和默认可访问体验，Semi 官网视觉通过独立主题层复刻。
- Vue 组件只承担需要交互的文档示例与站点功能，不把整个页面变成单体客户端应用。
- 正式文档内容由本项目维护；固定上游仅作为内容覆盖率、语义和视觉参考。
