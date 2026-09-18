# JsonViewer JSON 查看器

JsonViewer 对齐 Semi Design v2.102.0（`plus/jsonviewer`），保留固定 JSON core 的 DOM/class、可编辑 contentEditable 语义、搜索/替换、折叠、补全、主题 Token 与 RTL 契约。实现通过私有集成边界把固定 `semi-json-viewer-core` 与内联 Worker 一起编译进公开产物。公开入口为 `@aifuxi/semi-ui-vue` 根导出与 `@aifuxi/semi-ui-vue/json-viewer` 子路径。

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { JsonViewer } from '@aifuxi/semi-ui-vue';

const value = ref('{"name":"Semi","tags":["vue","design"]}');
</script>

<template>
  <JsonViewer v-model="value" :height="320" :width="600" />
</template>
```

`v-model` 绑定 `value`；编辑后按 `change → update:value` 通知，载荷为当前文本。`width`/`height` 缺省 `400`，可传数字（px）或 CSS 尺寸字符串。

## 行高、换行、只读与格式化

`options` 是自包含的 Vue 类型对象，深变化后组件会重建 core 与 Worker：

| 选项                                  | 说明                                                         | 默认值             |
| ------------------------------------- | ------------------------------------------------------------ | ------------------ |
| `lineHeight`                          | 行高（px）                                                   | core 缺省          |
| `autoWrap`                            | 超长行自动换行                                               | `true`             |
| `readOnly`                            | 只读；只读时替换按钮 disabled 且 `replace` 无操作            | `false`            |
| `formatOptions`                       | `{ tabSize, insertSpaces, eol }`                             | core 缺省          |
| `completionOptions.staticCompletions` | 静态补全项 `{ label, insertText?, detail?, documentation? }` | -                  |
| `customRenderRule`                    | `{ match, render }[]` 自定义 token 渲染                      | -                  |
| `prefixCls`                           | 自定义 class 前缀                                            | `semi-json-viewer` |

## 自定义渲染规则

```ts
const options = {
  customRenderRule: [
    {
      match: (_value, pathChain) => pathChain === 'root.name',
      render: (text: string) => h('span', { class: 'json-name' }, text.toUpperCase()),
    },
  ],
};
```

`match` 支持字符串、正则或 `(value, pathChain, tokenType) => boolean`；`render` 返回 VNode 或 HTMLElement，替换对应 key/value token 的渲染。

## 搜索与替换

- `showSearch` 缺省 `true`，搜索栏触发器位于组件右上角；`limitSearchButtonBounds` 控制搜索按钮是否限制在组件边界内。
- 搜索支持大小写敏感、全词匹配与正则三个选项，选项按钮为可聚焦 button 并以 `aria-pressed` 表达激活状态。
- `#searchButton` scoped slot 可替换默认搜索按钮，入参包含 `defaultSearchButton` 与完整 `controls`（`onToggleSearchBar`/`onSearch`/`onPrevSearch`/`onNextSearch`/`onReplace`/`onReplaceAll`）。
- 文案使用 LocaleProvider 的 `JsonViewer.search/replace/replaceAll`，缺省中文、`en-US` 切换为英文。

## API

### Props

| Prop                            | 类型                                            | 默认值                                |
| ------------------------------- | ----------------------------------------------- | ------------------------------------- |
| `value`                         | `string`                                        | `''`                                  |
| `width` / `height`              | `number \| string`                              | `400` / `400`                         |
| `showSearch`                    | `boolean`                                       | `true`                                |
| `options`                       | `JsonViewerOptions`                             | `{ readOnly: false, autoWrap: true }` |
| `limitSearchButtonBounds`       | `boolean`                                       | `false`                               |
| `renderSearchButton`            | `(defaultSearchButton, controls) => VNodeChild` | -                                     |
| `renderTooltip`                 | `(value, element) => HTMLElement`               | -（固定基线同样不触发）               |
| `class` / `className` / `style` | Vue 原生 class/style 与兼容 prop                | -                                     |

### Events

`change(value)`、`update:value(value)`。

### Slots

`searchButton="{ defaultSearchButton, controls }"`。

### Methods

通过组件 ref 调用：`getValue()`、`format()`、`search(text, caseSensitive?, wholeWord?, regex?)`、`getSearchResults()`、`prevSearch(step?)`、`nextSearch(step?)`、`replace(text)`、`replaceAll(text)`。

## 可访问性、键盘与 SSR

- 可编辑区域沿用 core 的 `contentEditable`、选区、Enter/Backspace、方向键、撤销/重做与补全键盘逻辑；组件不覆盖编辑器按键语义。
- 搜索/替换按钮是真实 button，图标按钮补充与本地化文案一致的 `aria-label`；搜索输入框处理 IME composition。
- 模块导入不访问 `window`/`document`/`Worker`，Worker 与 core 只在客户端 `onMounted` 创建，因此 import 与 SSR render 安全；卸载与 props 重建都会 terminate Worker 并清理回调。

## 主题、RTL 与发布边界

- class 与 Token 沿用固定 `.semi-json-viewer*`、`.json-viewer-container`、`.lines-content` 等；逐组件样式入口为 `@aifuxi/semi-theme-default/json-viewer.css`。
- RTL 由 ConfigProvider 的 `.semi-rtl` 驱动搜索栏与内容方向。
- Worker 通过 Vite `?worker&inline` 内联，真实 tarball 消费不产生额外 vendor/worker 文件请求；`pnpm check:artifacts` 覆盖 exports、类型、SSR import、`json-viewer.css`、许可与 SBOM。

## React → Vue

见 [React → Vue 迁移表](./react-to-vue.md)。完整公开行为、视觉与发布证据见[对齐矩阵](./alignment.md)。
