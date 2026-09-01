# MarkdownRender：React → Vue

| React v2.102.0                     | Vue 3                                                    | 说明                                 |
| ---------------------------------- | -------------------------------------------------------- | ------------------------------------ |
| `<MarkdownRender raw={raw} />`     | `<MarkdownRender :raw="raw" />`                          | 同名必填 prop                        |
| `format="md"`                      | `format="md"`                                            | 相同                                 |
| `components={{ h2: Heading }}`     | `:components="{ h2: Heading }"`                          | 值改为 Vue Component                 |
| `onClick={() => ...}`（MDX JSX）   | `onClick={() => ...}`（MDX 源）                          | runtime 映射为 Vue `onXxx` 事件 prop |
| `className` / `style`              | `class` 或 `className` / `style`                         | Vue class/style 合并                 |
| `MarkdownRender.defaultComponents` | 同名静态字段；也可导入 `markdownRenderDefaultComponents` | 默认元素映射                         |

## 迁移示例

```tsx
// React
<MarkdownRender raw={raw} components={{ Notice }} remarkGfm />
```

```vue
<!-- Vue -->
<MarkdownRender :raw="raw" :components="{ Notice }" remark-gfm />
```

Vue 组件会在 `raw`、`format`、插件或 `remarkGfm` 变化时重新求值；固定 React Adapter 只监听 `raw`。SSR 仍保持上游的空根容器语义。MDX 能执行 JavaScript，只应对可信内容启用 `format="mdx"`。
