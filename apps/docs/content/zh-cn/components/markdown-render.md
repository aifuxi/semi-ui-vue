---
title: '渲染器'
description: '在网页中即时渲染 Markdown 和 MDX'
locale: 'zh-CN'
slug: 'markdown-render'
category: 'plus'
order: 30
englishTitle: 'Markdown'
icon: 'doc-markdown'
upstream: 'plus/markdownrender'
---

`MarkdownRender` 使用固定基线的 MDX 3 与 GFM 管线，把可信的 Markdown / MDX 字符串渲染为 Semi 风格的标题、段落、链接、图片、表格和代码。

## 基本用法

::demo-block{demo="markdown-render/zh-CN/Example1" title="基本用法"}
::

## 纯 Markdown

当内容不包含 MDX JSX 时，使用 `format="md"`。这时 `{}`、`<>` 不需要按 JSX 语法转义；raw HTML 默认不会执行。

```vue
<MarkdownRender format="md" raw="无需转义的符号{}<>" />
```

## 覆盖元素和注册 MDX 组件

`components` 是 tag/组件名到 Vue Component 的映射。它会覆盖内置组件，也能为可信 MDX 注册自定义组件。

::demo-block{demo="markdown-render/zh-CN/Example2" title="覆盖元素和注册 MDX 组件"}
::

> MDX 表达式可以执行 JavaScript。和上游一致，组件不会净化可信输入；不要把未经审核的用户输入按 `mdx` 求值。对不可信内容使用 `format="md"`，并在业务边界实施 URL/内容安全策略。

## 插件

`remarkPlugins`、`rehypePlugins` 直接传给固定 `@mdx-js/mdx@3.0.1`。`remarkGfm` 默认开启；显式传入 `false` 可关闭表格、删除线等 GFM 扩展。

## API

| 属性                  | 类型                       | 默认值   | 说明                          |
| --------------------- | -------------------------- | -------- | ----------------------------- |
| `raw`                 | `string`                   | 必填     | Markdown / MDX 原文           |
| `format`              | `'md' \| 'mdx'`            | `'mdx'`  | 输入格式                      |
| `components`          | `MarkdownRenderComponents` | 内置映射 | 覆盖 HTML tag 或注册 MDX 组件 |
| `remarkGfm`           | `boolean`                  | `true`   | 是否启用 GFM                  |
| `remarkPlugins`       | `MarkdownRenderPluginList` | `[]`     | Remark 插件                   |
| `rehypePlugins`       | `MarkdownRenderPluginList` | `[]`     | Rehype 插件                   |
| `class` / `className` | Vue class / `string`       | -        | 根容器 class                  |
| `style`               | `StyleValue`               | -        | 根容器样式                    |

还可通过 `MarkdownRender.defaultComponents` 或 `markdownRenderDefaultComponents` 取得默认映射。

## SSR

组件导入是 SSR-safe 的。为对齐 v2.102.0 的挂载后异步求值语义，服务端只输出空的 `.semi-markdownRender` 根容器；客户端 hydration 后填充内容。

## React → Vue

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
