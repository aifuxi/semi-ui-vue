# JsonViewer JSON 编辑器

JsonViewer 对齐 Semi Design v2.102.0 的 JSON 查看、编辑、搜索、替换、格式化、折叠与自定义 token 渲染能力。解析、校验和折叠计算运行在内联 Worker 中；SSR 导入和服务端渲染不会创建 Worker。

```ts
import { JsonViewer } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/json-viewer.css';
```

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { JsonViewer } from '@aifuxi/semi-ui-vue';

const value = ref('{"name":"Semi UI Vue","ready":true}');
</script>

<template>
  <JsonViewer v-model:value="value" :width="640" :height="320" />
</template>
```

## API

| 属性                      | 说明                                                 | 类型                              | 默认值                                |
| ------------------------- | ---------------------------------------------------- | --------------------------------- | ------------------------------------- |
| `value`                   | JSON 文本                                            | `string`                          | `''`                                  |
| `width` / `height`        | 编辑器尺寸                                           | `number \| string`                | `400`                                 |
| `showSearch`              | 是否显示搜索入口                                     | `boolean`                         | `true`                                |
| `options`                 | 只读、自动换行、格式化、补全、自定义渲染等 core 选项 | `JsonViewerOptions`               | `{ readOnly: false, autoWrap: true }` |
| `limitSearchButtonBounds` | 将可拖动搜索入口限制在容器内                         | `boolean`                         | `false`                               |
| `renderSearchButton`      | 自定义搜索入口，接收默认 VNode 与搜索控制器          | `(node, controls) => VNodeChild`  | -                                     |
| `renderTooltip`           | 与 v2.102.0 保留的兼容属性；该基线未连接 hover 事件  | `(value, element) => HTMLElement` | -                                     |

事件 `change` 与 `update:value` 在编辑内容变化时返回完整 JSON 字符串。组件实例公开 `getValue`、`format`、`search`、`getSearchResults`、`prevSearch`、`nextSearch`、`replace`、`replaceAll`。

## 无障碍与服务端渲染

搜索选项支持点击、Enter 和 Space，具有 `aria-pressed`；搜索、替换、上一项、下一项和关闭按钮均提供可访问名称。SSR 只输出稳定容器，core、ResizeObserver 和 Worker 在客户端挂载后创建并在卸载时清理。

React 到 Vue 的逐项映射见 [迁移指南](./react-to-vue.md)，固定源码与验收证据见 [对齐矩阵](./alignment.md)。
