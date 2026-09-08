---
name: vue-router-best-practices
description: 实现或排查 Vue Router 导航守卫、路由参数和组件复用生命周期；先核对实际依赖与 Nuxt 集成，再按症状选用参考，不用于无路由需求的普通组件开发。
version: 1.0.0
license: MIT
author: github.com/vuejs-ai
---

按路由症状读取相关参考，不默认重构路由或加载全部条目。

## 版本与集成边界

- 先检查任务所属应用的 package.json、[pnpm lockfile](../../../pnpm-lock.yaml) 和实际安装包。当前 [文档站](../../../apps/docs/package.json) 使用 Nuxt `4.5.2`，由 Nuxt 解析到 `vue-router 5.3.1`，不是独立的 Router 4 SPA。
- 参考中的 Router 4 示例仅作为对应 API 的线索；使用前核对当前依赖的类型、实现与 [官方迁移说明](https://router.vuejs.org/guide/migration/v4-to-v5.html)。不能仅修改版本标签就声称所有示例兼容，也不因加载技能而升级依赖或新增路由插件。
- Nuxt 文档站沿用其文件路由、middleware 和 `#imports` 集成，特别是 Nuxt 自有的 `useRoute` 更新语义。先读 [Nuxt 配置](../../../apps/docs/nuxt.config.ts) 与相邻页面，不直接照搬独立 SPA 的 `createRouter`、`app.use(router)` 或替换 `useRoute` 来源。
- 当前 Router `5.3.1` 将 `next` 标记为 deprecated 并在开发环境给出诊断，但仍支持执行。新增或修复普通守卫优先 return 形式，已有正确守卫不要求批量改写；`beforeRouteEnter` 实例回调等语义需单独核对，见下方守卫参考。
- 路由修复应验证受影响的首次进入、参数变化、复用、取消/重定向和清理行为；Nuxt 的 SSR/hydration 问题保留服务端与客户端边界，内存路由测试不能代替浏览器证据。

### Navigation Guards

- Navigating between same route with different params → See [router-beforeenter-no-param-trigger](reference/router-beforeenter-no-param-trigger.md)
- Accessing component instance in beforeRouteEnter guard → See [router-beforerouteenter-no-this](reference/router-beforerouteenter-no-this.md)
- Navigation guard making API calls without awaiting → See [router-guard-async-await-pattern](reference/router-guard-async-await-pattern.md)
- Users trapped in infinite redirect loops → See [router-navigation-guard-infinite-loop](reference/router-navigation-guard-infinite-loop.md)
- 守卫漏调/重复调用 next、导航挂起或需要局部迁移 → See [router-navigation-guard-next-deprecated](reference/router-navigation-guard-next-deprecated.md)

### Route Lifecycle

- Stale data when navigating between same route → See [router-param-change-no-lifecycle](reference/router-param-change-no-lifecycle.md)
- Event listeners persisting after component unmounts → See [router-simple-routing-cleanup](reference/router-simple-routing-cleanup.md)

### Setup

- 任务确需在独立 Vue 应用配置 Router，且没有 Nuxt 等既有集成 → See [router-use-vue-router-for-production](reference/router-use-vue-router-for-production.md)
