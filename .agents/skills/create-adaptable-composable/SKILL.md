---
name: create-adaptable-composable
description: 为需要同时接收普通值、ref 或 getter 的 Vue composable 设计响应式输入与回写契约；不因普通 composable 可复用就自动泛化输入。
license: MIT
metadata:
  author: github.com/vuejs-ai
  version: '17.0.0'
compatibility: Requires Vue 3.3+ for toValue and toRef normalization; this repository uses Vue >=3.5
---

# 可适配响应式输入的 Composable

先明确每个参数是否需要跟随外部变化、是否允许回写，再决定是否接受 value/ref/getter；普通参数无需统一包装成响应式输入。

## 输入与更新语义

- 只读且允许派生输入：从 `vue` 导入 `MaybeRefOrGetter<T>`，在 `computed`、`watchEffect` 或 `watch(() => toValue(input), ...)` 内读取，才能收集 ref/getter 的依赖。初始化时调用一次 `toValue` 只得到当时的值。
- 需要回写：用 `MaybeRef<T>` 表达值或 ref 输入，并明确只接受可写 ref，不向 readonly ref、只读 computed 或 props 回写。`toRef(input)` 会保留已有 ref；普通值会成为新的内部 ref，调用方原变量不会随 `.value` 更新。getter 归一化得到的是只读 ref，不能当回写通道。
- 函数本身是 callback、predicate 或 comparator 时，不要用 `MaybeRefOrGetter` / `toValue` 把它误当 getter 执行；按 API 使用函数参数或 `MaybeRef<Fn>` 配合 `unref`。
- `toRef` 适合保留 ref 形态或作为 watcher source，`toValue` 适合读取当前值；两者不是“响应式值用前者、普通值用后者”的二分规则。
- 涉及 DOM、Observer 或事件监听时，在客户端生命周期中创建并清理；纯计算示例不需要浏览器环境。对象参数还需明确嵌套修改的所有权，不能仅凭 `MaybeRef` 推断可随意修改外部对象。

## 只读派生输入

```ts
import { computed, toValue } from 'vue';
import type { MaybeRefOrGetter } from 'vue';

export function useNormalizedLabel(label: MaybeRefOrGetter<string>) {
  const normalized = computed(() => toValue(label).trim());
  return { normalized };
}
```

普通字符串提供固定输入；ref 或 getter 被 `computed` 读取时保留依赖追踪。这个 composable 不访问 `document`，可用于 SSR。

## 可写输入

```ts
import { toRef } from 'vue';
import type { MaybeRef } from 'vue';

export function useCounter(count: MaybeRef<number> = 0) {
  const countRef = toRef(count);
  function add() {
    countRef.value++;
  }
  return { count: countRef, add };
}
```

`useCounter(0)` 创建内部状态；`useCounter(existingWritableRef)` 与调用方共享 ref 并回写。传入 `existingWritableRef.value` 只传递当前初始值。

按实际支持的输入形态验证普通值、ref、getter 的更新行为；允许回写时再验证共享状态与内部状态的区别。

参考：[Vue 响应式工具 API](https://vuejs.org/api/reactivity-utilities.html)。
