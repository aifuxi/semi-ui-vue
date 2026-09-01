---
status: accepted
---

# 使用 Starlight 数据基础与 Semi UI Vue 自定义站点壳

组件文档门户保留 Starlight 的内容集合、静态路由、双语关联、Pagefind 索引和页面元数据能力，但通过 Starlight override 重建 Header、Sidebar 等可见站点壳，并适度使用公开 `@aifuxi/*` 组件复刻固定 Semi 官网体验。该方案不迁移上游 Gatsby、React 运行时、`semi-site-header`、`semi-site-banner` 或内部服务集成。

## Consequences

- 自定义壳必须继续消费 Starlight 提供的路由、当前页面、Locale、搜索和目录数据，不能另建一套彼此漂移的导航模型。
- 使用 Semi UI Vue 的壳层组件必须保持 SSR-safe、移动端可用、键盘可达，并在组件自身故障时提供足以访问正文的静态语义。
- Starlight 升级需要验证 override 契约；站点视觉接近上游不代表复制 Semi Logo、官方 Banner 或内部网络能力。

## Override Boundary

- 自定义 `Header`、`SiteTitle`、`Sidebar`、`TableOfContents`、`MobileTableOfContents`、`ThemeSelect`、`LanguageSelect`、`PageTitle`、`Pagination` 和 `Footer`。
- `Search` 使用 Semi UI Vue 风格入口，但继续复用 Starlight 的 Pagefind 搜索逻辑。
- 首期保留 Starlight 的 `Head`、`ThemeProvider`、`SkipLink`、`PageFrame`、`TwoColumnContent`、Pagefind 结果逻辑和 Markdown/MDX 渲染基础，避免重写高复杂度布局与可访问性底座。
