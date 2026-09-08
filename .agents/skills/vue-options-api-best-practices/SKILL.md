---
name: vue-options-api-best-practices
disable-model-invocation: true
description: 维护已有 Vue Options API 或项目明确要求该风格时，处理 this、生命周期和 TypeScript；不用于迁移本库的 Composition API 组件。
version: 2.0.0
license: MIT
author: github.com/vuejs-ai
---

仅在已有或明确要求的 Options API 代码中使用。按当前问题读取参考，保留项目其余部分的 Composition API 基线。

### TypeScript

- Need to enable TypeScript type inference for component properties → See [ts-options-api-use-definecomponent](reference/ts-options-api-use-definecomponent.md)
- Enabling type safety for Options API this context → See [ts-strict-mode-options-api](reference/ts-strict-mode-options-api.md)
- Using old TypeScript versions with prop validators → See [ts-options-api-arrow-functions-validators](reference/ts-options-api-arrow-functions-validators.md)
- Event handler parameters need proper type safety → See [ts-options-api-type-event-handlers](reference/ts-options-api-type-event-handlers.md)
- Need to type object or array props with interfaces → See [ts-options-api-proptype-complex-types](reference/ts-options-api-proptype-complex-types.md)
- Injected properties missing TypeScript types completely → See [ts-options-api-provide-inject-limitations](reference/ts-options-api-provide-inject-limitations.md)
- Complex computed properties lack clear type documentation → See [ts-options-api-computed-return-types](reference/ts-options-api-computed-return-types.md)

### Methods & Lifecycle

- Methods aren't binding to component instance context → See [no-arrow-functions-in-methods](reference/no-arrow-functions-in-methods.md)
- Lifecycle hooks losing access to component data → See [no-arrow-functions-in-lifecycle-hooks](reference/no-arrow-functions-in-lifecycle-hooks.md)
- Debounced functions sharing state across component instances → See [stateful-methods-lifecycle](reference/stateful-methods-lifecycle.md)
