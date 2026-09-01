# MarkdownRender

`MarkdownRender` uses the pinned MDX 3 and GFM pipeline to render trusted Markdown or MDX as Semi-styled headings, paragraphs, links, images, tables, and code.

## Basic usage

```vue
<script setup lang="ts">
import { MarkdownRender } from '@aifuxi/semi-ui-vue/markdown-render';
import '@aifuxi/semi-theme-default/markdown-render.css';

const raw = `## Release notes

Use **bold**, [links](https://semi.design), \`inline code\`, and GFM tables.

| Feature | Status |
| - | - |
| Markdown | Ready |`;
</script>

<template>
  <MarkdownRender :raw="raw" />
</template>
```

## Markdown-only input

Use `format="md"` when the content has no MDX JSX. Braces and angle brackets no longer need JSX escaping, and raw HTML is not executed by default.

```vue
<MarkdownRender format="md" raw="Literal symbols: {}<>" />
```

## Override elements and register MDX components

`components` maps element or component names to Vue components. It overrides the built-in mapping and can register custom components for trusted MDX.

```vue
<script setup lang="ts">
import { h } from 'vue';
import { MarkdownRender } from '@aifuxi/semi-ui-vue/markdown-render';

const components = {
  h2: (_props, { slots }) => h('h2', { class: 'brand-heading' }, slots.default?.()),
  Notice: (_props, { slots }) => h('aside', { class: 'notice' }, slots.default?.()),
};
</script>

<template>
  <MarkdownRender
    raw="## Custom heading\n\n<Notice>Render trusted MDX only</Notice>"
    :components="components"
  />
</template>
```

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
