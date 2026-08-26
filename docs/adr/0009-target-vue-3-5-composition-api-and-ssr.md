---
status: accepted
---

# 以 Vue 3.5、Composition API 和 SSR 安全为运行时基线

主组件包将 `vue >= 3.5` 声明为 peer dependency。项目源码统一使用 TypeScript、Composition API 和 `<script setup lang="ts">`，默认不使用 Options API 或 JSX。

所有公开包必须 SSR-safe import；对于可在服务端渲染的组件，还必须验证 SSR render 与 Chromium 客户端 hydration。

## Consequences

- 公开组件边界使用类型化 props/emits/slots、`v-model`、`defineExpose` 与 `InjectionKey`，保持 props-down/events-up 和 provider 实例隔离。
- 只有当 Vue template 无法精确表达参考 DOM/VNode 契约时才使用 render function，并将其限制在单一可审查边界内。
- 禁止在模块顶层访问 `window`、`document` 或创建 DOM；Portal、Observer、测量、全局事件和 timer 必须在客户端生命周期内创建与清理。
- Foundation 实例、DOM、Observer、Map/Set 等身份敏感对象使用浅层响应或 `markRaw`，避免 Vue 深层代理破坏身份与性能。
- 组件仍可被使用 Options API 的消费应用正常导入和使用；该决策限制的是组件库内部实现风格。
