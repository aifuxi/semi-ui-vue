---
name: vue-best-practices
description: 实现或修复 Vue 组件、composable 与相关运行时代码时，提供响应式、SFC 和数据流指导；纯文案、普通配置或仅出现 Vue 关键词的任务不触发。
license: MIT
metadata:
  author: github.com/vuejs-ai
  version: '18.0.0'
---

# Vue 实现与修复

先遵循项目的 Vue 版本、公开契约和构建方式，再按当前问题读取下方参考。无需预读全部基础材料，也无需让已用参考常驻上下文。

## 实施边界

- 本仓库使用 TypeScript、Composition API 与 `<script setup lang="ts">`。保持主题包、公开 DOM/class/Token 及 Foundation 集成边界；应用层示例不能覆盖这些契约。
- `ref` 是正常的状态默认选择；对身份敏感的外部对象，按更新语义选 `shallowRef` / `shallowReactive` / `markRaw`。派生值用 `computed`，副作用按实际生命周期建立并清理，保持 SSR 安全。
- props/emits/slots 与共享 context 使用明确类型。受控状态需要区分 prop 缺省和显式传入，`defineModel` 与显式 props/emits 按默认值、更新和事件顺序契约选择。
- 仅在职责、复用或复杂度确实形成边界时拆组件或提取 composable；UI 区块数量、文件长度、位于根组件本身都不是强制拆分条件。拆分要保留必需的 DOM、作用域、焦点和事件行为。

## 按问题读取

只读取与当前实现或故障相关的条目；简单改动可直接按项目既有实现完成。

| 当前问题                                       | 参考                                                                   |
| ---------------------------------------------- | ---------------------------------------------------------------------- |
| ref/reactive、代理身份、computed/watch         | [响应式](references/reactivity.md)                                     |
| SFC 结构、样式作用域、模板指令、DOM ref        | [SFC](references/sfc.md)                                               |
| props/emits、v-model、provide/inject、公开类型 | [组件数据流](references/component-data-flow.md)                        |
| 提取状态逻辑、生命周期与 composable 返回值     | [Composables](references/composables.md)                               |
| value/ref/getter 输入及回写语义                | [create-adaptable-composable](../create-adaptable-composable/SKILL.md) |
| 自定义内容、插槽转发                           | [Slots](references/component-slots.md)                                 |
| 包装组件透传 attrs 与监听器                    | [Fallthrough attrs](references/component-fallthrough-attrs.md)         |
| 视图缓存                                       | [KeepAlive](references/component-keep-alive.md)                        |
| Portal、浮层与容器                             | [Teleport](references/component-teleport.md)                           |
| async setup 与回退边界                         | [Suspense](references/component-suspense.md)                           |
| 重型或低频 UI 的延迟加载                       | [Async components](references/component-async.md)                      |
| 模板无法表达必需的 VNode 行为                  | [Render functions](references/render-functions.md)                     |
| DOM 专属行为不适合组件/composable              | [Directives](references/directives.md)                                 |
| 应用级安装与注入                               | [Plugins](references/plugins.md)                                       |
| 跨功能共享状态                                 | [State management](references/state-management.md)                     |

## 动效与性能专项

需求涉及动效时选择相应机制；性能参考用于已有测量或可复现的瓶颈，不作为每次功能修改的附加流程。

- 进入/退出：[Transition](references/component-transition.md)；列表变化：[TransitionGroup](references/component-transition-group.md)。
- 非进入/退出的效果：[Class-based animation](references/animation-class-based-technique.md)；输入驱动动画：[State-driven animation](references/animation-state-driven-technique.md)。
- 大列表渲染：[Virtualize lists](references/perf-virtualize-large-lists.md)；静态子树更新：[v-once/v-memo](references/perf-v-once-v-memo-directives.md)。
- 列表抽象开销：[Component abstraction](references/perf-avoid-component-abstraction-in-lists.md)；昂贵更新钩子：[Updated hook](references/updated-hook-performance.md)。

## 相邻专项入口

- 运行时报错、警告或 hydration 故障：[vue-debug-guides](../vue-debug-guides/SKILL.md)，按症状选读。
- 编写或修复 Vue 测试：[vue-testing-best-practices](../vue-testing-best-practices/SKILL.md)，复用项目测试设施。
- 实际修改导航、路由参数或守卫：[vue-router-best-practices](../vue-router-best-practices/SKILL.md)。
- 已有或明确需要 Pinia store：[vue-pinia-best-practices](../vue-pinia-best-practices/SKILL.md)。
- 维护已有 JSX，或任务明确需要 JSX：[vue-jsx-best-practices](../vue-jsx-best-practices/SKILL.md)。本库默认仍使用 SFC 模板。
- 维护已有 Options API，或项目明确要求它：[vue-options-api-best-practices](../vue-options-api-best-practices/SKILL.md)。不因此迁移当前 Composition API 实现。
