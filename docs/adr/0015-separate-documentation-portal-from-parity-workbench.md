---
status: accepted
---

# 分离组件文档门户与 Vue 对照工作台

公开组件文档门户与内部 Vue 对照工作台使用两个独立应用：`apps/docs` 承载 Astro、Starlight、Vue 3 与 TypeScript 文档站，现有 `apps/docs-vue` 重命名为 `apps/parity-vue` 并继续承载固定场景和浏览器对照证据。两者都消费公开 Vue 包，但不共享页面壳、路由或运行时状态，以免文档体验受固定测试 URL、端口和捕获环境约束。

## Consequences

- 根命令 `dev:docs` 指向公开文档门户；对照工作台使用独立命令和固定测试端口。
- 组件文档示例可以复用经过验证的场景意图，但不能直接依赖对照工作台的页面壳或 query 协议。
- 文档门户可逐步扩展为完整官网门户，而无需改变对照测试应用的职责。
