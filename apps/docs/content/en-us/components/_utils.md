---
title: '`_utils` public utilities'
description: '`_utils` is the Vue mapping of the public infrastructure helpers from Semi v2.102.0. Utilities'
locale: 'en-US'
slug: '_utils'
category: 'other'
order: 100
englishTitle: '`_utils` public utilities'
---

`_utils` is the Vue mapping of the public infrastructure helpers from Semi v2.102.0. Utilities
are available through tree-shakable subpaths, while the package root continues to expose the same
`semiGlobal` singleton.

```ts
import {
  cloneDeep,
  getDefaultPropsFromGlobalConfig,
  getFocusableElements,
  registerMediaQuery,
  stopPropagation,
} from '@aifuxi/semi-ui-vue/_utils';
```

Key behavior:

- `cloneDeep` clones ordinary data while preserving functions, Vue VNodes, and Error instances.
- `registerMediaQuery` supports initial match/unmatch callbacks and cleanup; SSR returns a no-op.
- Focus helpers retain the pinned selector list and do not add visibility filtering.
- `getDefaultPropsFromGlobalConfig` returns a dynamic Proxy, so later `semiGlobal.config` updates
  are immediately visible.
- `runAfterTicks` delays by the requested number of macrotasks and runs immediately for non-positive
  values.

## Subpaths

- `/_utils/use-prev-focus`: readonly shallow ref plus setter, with blur on replacement/unmount.
- `/_utils/vue-render`: Vue imperative `render/unmount`, `resolveDOM`, and `getRef`.
- `/_utils/semi-global`: the exact singleton exported by ConfigProvider and the package root.

The utilities own no visual styles, and every DOM API is guarded at call time for SSR.

## React → Vue

## 导入映射

| React v2.102.0         | Vue                          | 说明                                         |
| ---------------------- | ---------------------------- | -------------------------------------------- |
| `lib/es/_utils`        | `@aifuxi/semi-ui-vue/_utils` | 纯工具入口                                   |
| `hooks/usePrevFocus`   | `/_utils/use-prev-focus`     | React state tuple 改为 readonly ref + setter |
| `reactRender`          | `/_utils/vue-render`         | ReactDOM 改为 Vue renderer                   |
| `semi-global`          | `/_utils/semi-global`        | singleton identity 保持一致                  |
| `React.isValidElement` | Vue `isVNode`                | `cloneDeep` 与图标判定使用 Vue VNode         |

## 命令式渲染

```ts
import { h } from 'vue';
import { render, unmount } from '@aifuxi/semi-ui-vue/_utils/vue-render';

render(h(Notice, { content: 'Saved' }), container);
unmount(container);
```

`resolveDOM` 接受原生 Element 或 Vue 组件公开实例并读取 `$el`；`getRef` 返回 VNode 的
规范化 ref。React 18/19 的 `createRoot` 注入、Fiber 遍历和 `findDOMNode` 没有 Vue 对应物，
因此不会进入 Vue API。

事件、媒体查询、焦点选择器、滚动条测量和全局默认值优先级保持固定基线行为；DOM
访问增加 SSR 守卫。
