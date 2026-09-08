---
name: vue-pinia-best-practices
disable-model-invocation: true
description: 实现或修复已有、或需求明确需要的 Pinia store、注入和响应式行为；不因组件需要局部状态就引入 Pinia。
version: 1.0.0
license: MIT
author: github.com/vuejs-ai
---

按实际 Pinia store 问题读取下列参考。先复用项目状态边界，不把普通组件状态升级为应用级 store。

### Store Setup

- Getting "getActivePinia was called" error at startup → See [pinia-no-active-pinia-error](reference/pinia-no-active-pinia-error.md)
- Setup stores missing state in DevTools or SSR → See [pinia-setup-store-return-all-state](reference/pinia-setup-store-return-all-state.md)

### Reactivity

- Store destructuring stops updating UI reactively → See [pinia-store-destructuring-breaks-reactivity](reference/pinia-store-destructuring-breaks-reactivity.md)
- Store methods lose context in template calls → See [store-method-binding-parentheses](reference/store-method-binding-parentheses.md)

### State Patterns

- Filters reset on refresh or can't be shared → See [state-url-for-ephemeral-filters](reference/state-url-for-ephemeral-filters.md)
- Building production app without DevTools or conventions → See [state-use-pinia-for-large-apps](reference/state-use-pinia-for-large-apps.md)
