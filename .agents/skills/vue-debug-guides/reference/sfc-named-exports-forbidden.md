---
title: Distinguish Normal Script Exports from Script Setup Exports
impact: HIGH
impactDescription: Normal script supports auxiliary named exports; script setup generates the component export and rejects runtime value exports
type: gotcha
tags: [vue3, sfc, export, script-block, composition-api]
---

# 区分普通 script 与 script setup 的导出

普通 `<script>` 使用 ES module 语义，可以在组件的 default export 之外提供辅助 named exports。`<script setup>` 由编译器生成组件导出，不允许直接写运行时 `export const`、`export function` 或 `export default`。不能把后者的限制扩大为“所有 SFC 禁止 named exports”。

## 定位与修复

- 先看报错所属的是普通 `<script>` 还是 `<script setup>`，以及导出是运行时值还是纯 TypeScript 类型。
- 需要从同一个 SFC 导出辅助常量或函数时，可用普通 `<script>`；跨组件共享逻辑通常放独立 `.ts` 文件更易复用，但这是组织建议，不是编译限制。
- 纯类型导出与运行时值导出不同；以本项目锁定的 Vue 编译器和 TypeScript 工具链验证，不按“出现 export 关键字”直接判错。
- 普通 `<script>` 在模块作用域执行，不能借辅助导出暴露某个 `<script setup>` 实例的局部状态；公开实例能力使用 `defineExpose`。

以下组合合法，组件 default export 由 `<script setup>` 生成：

```vue
<script lang="ts">
export const DEFAULT_COUNT = 0;
export interface CounterOptions {
  initial: number;
}
</script>

<script setup lang="ts">
import { ref } from 'vue';

const count = ref(DEFAULT_COUNT);
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

以下运行时值导出会被 `<script setup>` 编译器拒绝：

```vue
<script setup lang="ts">
export const DEFAULT_COUNT = 0;
</script>
```

## 参考

- [Vue：与普通 script 一起使用](https://vuejs.org/api/sfc-script-setup.html#usage-alongside-normal-script)
- [Vue：SFC script 规范](https://vuejs.org/api/sfc-spec.html#script)
