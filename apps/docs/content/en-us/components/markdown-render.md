---
title: 'Markdown Render'
description: 'Instantly render Markdown and MDX in web pages'
locale: 'en-US'
slug: 'markdown-render'
category: 'plus'
order: 30
englishTitle: 'Markdown Render'
icon: 'doc-markdown'
upstream: 'plus/markdownrender'
---

`MarkdownRender` uses the pinned MDX 3 and GFM pipeline to render trusted Markdown or MDX as Semi-styled headings, paragraphs, links, images, tables, and code.

## Basic usage

::demo-block{demo="markdown-render/en-US/Example1" title="Basic usage"}
::

## Markdown-only input

Use `format="md"` when the content has no MDX JSX. Braces and angle brackets no longer need JSX escaping, and raw HTML is not executed by default.

```vue
<MarkdownRender format="md" raw="Literal symbols: {}<>" />
```

## Override elements and register MDX components

`components` maps element or component names to Vue components. It overrides the built-in mapping and can register custom components for trusted MDX.

::demo-block{demo="markdown-render/en-US/Example2" title="Override elements and register MDX components"}
::

> MDX expressions can execute JavaScript. In line with the upstream contract, the component does not sanitize trusted input. Do not evaluate unreviewed user input as `mdx`; use `format="md"` and enforce URL/content security at the application boundary.

## Plugins

`remarkPlugins` and `rehypePlugins` are forwarded to pinned `@mdx-js/mdx@3.0.1`. `remarkGfm` is enabled by default; set it explicitly to `false` to disable tables, strikethrough, and other GFM extensions.

## API

| Prop                  | Type                       | Default      | Description                                   |
| --------------------- | -------------------------- | ------------ | --------------------------------------------- |
| `raw`                 | `string`                   | required     | Markdown or MDX source                        |
| `format`              | `'md' \| 'mdx'`            | `'mdx'`      | Input format                                  |
| `components`          | `MarkdownRenderComponents` | built-in map | Override HTML tags or register MDX components |
| `remarkGfm`           | `boolean`                  | `true`       | Enable GFM                                    |
| `remarkPlugins`       | `MarkdownRenderPluginList` | `[]`         | Remark plugins                                |
| `rehypePlugins`       | `MarkdownRenderPluginList` | `[]`         | Rehype plugins                                |
| `class` / `className` | Vue class / `string`       | -            | Root classes                                  |
| `style`               | `StyleValue`               | -            | Root style                                    |

The default map is available as `MarkdownRender.defaultComponents` and `markdownRenderDefaultComponents`.

## SSR

Imports are SSR-safe. To preserve the v2.102.0 post-mount asynchronous evaluation contract, SSR emits only the empty `.semi-markdownRender` root; hydration fills the content on the client.

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
