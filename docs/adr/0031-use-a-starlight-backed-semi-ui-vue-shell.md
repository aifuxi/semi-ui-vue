---
status: accepted
---

# 组件文档站使用 Starlight 默认主题

组件文档门户直接使用 Starlight 的默认主题、默认壳层组件、内容集合、静态路由、双语关联、Pagefind 索引和页面元数据能力。站点不注册 `customCss`，不覆盖 Header、Sidebar 等 Starlight 组件，也不建立独立文档主题或复刻 Semi 官网布局。

## Consequences

- Starlight 升级只验证默认主题下的内容、路由、搜索、主题切换、移动端和可访问性，不维护 override 兼容层。
- Vue Demo 只引入实际演示组件所需的公开 `@aifuxi/semi-theme-default/*` 样式；这些样式不得用于改写文档站壳层。
- 组件本身的视觉对齐继续由 React/Vue parity 测试负责，文档站不维护自定义整页视觉基线。

## Boundary

- `apps/docs/src` 不保留 `theme/`、全局 CSS 或 Starlight component override。
- Demo 与 API 渲染组件只负责内容结构，不提供站点视觉样式。
- Header、SiteTitle、Sidebar、目录、搜索、主题/语言选择、PageTitle、Pagination 和 Footer 全部使用 Starlight 默认实现。
