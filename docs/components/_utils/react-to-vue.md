# `_utils` React → Vue 迁移

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
