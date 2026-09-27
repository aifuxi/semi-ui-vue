---
title: 'Markdown 渲染器'
description: '在网页中即时渲染 Markdown 和 MDX'
type: 'plus'
order: 30
icon: 'doc-markdown'
---

## 使用场景

Markdown 是一种文档标记语言，可以通过简单的标记实现例如标题，图片，表格，链接，加粗等基本常用富文本功能。
MDX 在 Markdown 基础上允许使用组件标签，实现更复杂的文档撰写与展示需求。

Semi 提供的 MarkdownRender 组件支持渲染 Markdown 和 MDX，无需特别配置，传入纯文本即可渲染出符合 Semi 样式规范的富文本内容。

通常用于下列场景：

- 文档站编写与渲染
- 服务端动态生成富文本内容时，前端渲染
- 偏内容展示的轻交互网站

**注意：Safari 16.3 之前的版本不支持正则环视断言，会导致上游依赖 mdxjs [报错](https://github.com/syntax-tree/mdast-util-gfm-autolink-literal/issues/10)，可以传入 remarkGfm 为 false 关闭 gfm 语法解析（会导致table 等markdown 特性无法解析），并且在项目编译时使用 null-loader 或 alias 其他方式忽略掉 remark-gfm 这个包。**

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/markdown-render` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

MarkdownRender 从 v2.62.0 开始支持
MarkdownRender 内置面向 Vue 的 MDX runtime 适配，无需额外配置运行时。

<DemoBlock id="zh-CN-plus-markdownrender-1" title="如何引入" kind="code" />

### 基本用法

导入 MarkdownRender 后，直接传入 Markdown 或 MDX 纯文本即可。

注意 `<`、`{` 等符号在 MDX 中具有语法含义；作为普通文本时需要使用 `\` 转义。只渲染纯 Markdown 时可参考下方“仅纯 Markdown”。

<DemoBlock id="zh-CN-plus-markdownrender-2" title="基本用法" kind="live" />

### 修改元素样式

你可以任意替换 Markdown 或 MDX 文档中的文档元素的显示效果，只需通过 `components` prop 传入 Vue 组件覆盖即可。

比如，现在需要将所有1号标题的颜色设置成主色

<DemoBlock id="zh-CN-plus-markdownrender-3" title="修改元素样式" kind="live" />

可以覆盖的基本元素 tag 支持 `a blockquote br code em h1 h2 h3 h4 h5 hr img li ol p pre strong ul table`

### 仅纯 Markdown

当内容是纯 Markdown、不包含组件标签或 MDX 表达式时，可传入 `format="md"` 开启仅 Markdown 模式，此时无需转义特殊字符。

<DemoBlock id="zh-CN-plus-markdownrender-4" title="仅纯 Markdown" kind="live" />

<DemoBlock id="zh-CN-plus-markdownrender-5" title="仅纯 Markdown" kind="code" />

### 添加自定义组件

通过 `components` prop 传入 Vue 组件，即可在 MDX 中使用组件标签，并保留 Vue 事件监听。
默认的 Markdown 组件可从 `MarkdownRender.defaultComponents` 中获取，可以用于二次封装。

<DemoBlock id="zh-CN-plus-markdownrender-6" title="添加自定义组件" kind="live" />

### 添加插件

通过 `remarkPlugins` `rehypePlugins` 支持 MDXJS 的所有 RemarkPlugin 和 RehypePlugins 插件，详情请参考 [MDXJS](https://mdxjs.com/docs/extending-mdx/)

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/markdown-render/types.ts`、`packages/ui/src/markdown-render/index.ts` 的公开类型为准。

#### Vue 用法

- `components` 的值为 Vue `Component` 或原生标签名，并与内置元素映射浅合并。
- 内置映射可从 `MarkdownRender.defaultComponents` 或具名导出 `markdownRenderDefaultComponents` 读取。
- SSR 只输出空根容器，Markdown/MDX 在客户端挂载后异步求值。

| 属性          | 说明                                                           | 类型                     | 默认值 |
| ------------- | -------------------------------------------------------------- | ------------------------ | ------ |
| raw           | Markdown 或 MDX 的纯文本                                       | string（必填）           | -      |
| class         | Vue 原生类名                                                   | HTMLAttributes['class']  | —      |
| className     | 类名                                                           | string                   | -      |
| components    | 用于覆盖 Markdown 元素，也可添加自定义组件                     | MarkdownRenderComponents | -      |
| format        | 传入的 raw 类型，是否是纯 Markdown                             | MarkdownRenderFormat     | `mdx`  |
| rehypePlugins | 自定义 Rehype Plugin                                           | MarkdownRenderPluginList | `[]`   |
| remarkGfm     | 是否开启 Github GFM 语法，safari 16.3 之前不支持环视断言会报错 | boolean                  | true   |
| remarkPlugins | 自定义 Remark Plugin                                           | MarkdownRenderPluginList | `[]`   |
| style         | 样式                                                           | StyleValue               | -      |
