---
name: vue-debug-guides
description: 定位或修复 Vue 运行时报错、警告、响应式失效、异步与 SSR/hydration 故障；按具体症状读取参考，不用于普通实现或纯文案。
---

# Vue 故障定位

先保留触发条件、报错、实际 DOM 与生命周期证据，再选择匹配的参考。不要把普通实现扩成全面排查；版本敏感结论以项目锁定的 Vue 与相关工具链核验。

| 症状                                            | 常用参考与进一步索引                                                                                                                                                                                                                                                                                                                  |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 状态不更新、代理身份或依赖异常                  | [响应式追踪](reference/reactivity-debugging-hooks.md)、[解构丢失响应式](reference/reactive-destructuring.md)；[Reactivity/Computed 索引](reference/troubleshooting-index.md#reactivity)                                                                                                                                               |
| watcher 异步竞态、触发或清理时机                | [异步清理](reference/watch-async-cleanup.md)、[flush 时机](reference/watch-flush-timing.md)；[Watchers 索引](reference/troubleshooting-index.md#watchers)                                                                                                                                                                             |
| props、事件、v-model、attrs 或插槽异常          | [Props & Emits 索引](reference/troubleshooting-index.md#props--emits)、[Forms & v-model](reference/troubleshooting-index.md#forms--v-model)、[Slots](reference/troubleshooting-index.md#slots)、[Attrs](reference/troubleshooting-index.md#attrs)                                                                                     |
| 模板、SFC 编译或样式不匹配                      | [script 导出边界](reference/sfc-named-exports-forbidden.md)、[Templates 索引](reference/troubleshooting-index.md#templates)、[SFC 索引](reference/troubleshooting-index.md#sfc-single-file-components)                                                                                                                                |
| 挂载、卸载、DOM ref、组合式函数上下文           | [DOM 访问时机](reference/lifecycle-dom-access-timing.md)、[副作用清理](reference/cleanup-side-effects.md)；[Lifecycle](reference/troubleshooting-index.md#lifecycle)、[Composables](reference/troubleshooting-index.md#composables)                                                                                                   |
| Teleport、缓存或动效行为                        | [Teleport 样式与祖先关系](reference/teleport-scoped-styles-limitation.md)；[Teleport](reference/troubleshooting-index.md#teleport)、[KeepAlive](reference/troubleshooting-index.md#keepalive)、[Transitions](reference/troubleshooting-index.md#transitions)                                                                          |
| 异步组件失败、Suspense 或 hydration             | [Hydration mismatch](reference/ssr-hydration-mismatch-causes.md)；[Async Components](reference/troubleshooting-index.md#async-components)、[Suspense](reference/troubleshooting-index.md#suspense)、[SSR](reference/troubleshooting-index.md#ssr)                                                                                     |
| 类型、render function、插件、应用配置或性能故障 | [TypeScript](reference/troubleshooting-index.md#typescript)、[Render Functions](reference/troubleshooting-index.md#render-functions)、[Plugins](reference/troubleshooting-index.md#plugins)、[App Configuration](reference/troubleshooting-index.md#app-configuration)、[Performance](reference/troubleshooting-index.md#performance) |

其余症状可在[完整索引](reference/troubleshooting-index.md)按关键词查找。索引保留全部参考入口，只展开当前问题需要的条目。

实现基础见 [vue-best-practices](../vue-best-practices/SKILL.md)；需要复现或回归时见 [vue-testing-best-practices](../vue-testing-best-practices/SKILL.md)。Teleport、真实焦点、布局与动画采用项目 Chromium 证据；SSR 问题保留服务端渲染及 hydration 条件。
