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

MarkdownRender 可以将 Markdown 和 MDX 渲染为符合 Semi 样式的富文本。渲染普通 Markdown 时显式设置 `format="md"`。

> 默认格式为 `mdx`。MDX 支持 JavaScript 表达式，组件会在浏览器中编译并执行内容。只将可信作者提供的内容作为 MDX 输入。评论、用户输入和模型生成文本应采用经过安全评估的 Markdown 渲染流程。

通常用于下列场景：

- 文档站编写与渲染
- 服务端动态生成富文本内容时，前端渲染
- 偏内容展示的轻交互网站

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/markdown-render` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

MarkdownRender 内置面向 Vue 的 MDX runtime 适配，无需额外配置运行时。

<DemoBlock id="zh-CN-plus-markdownrender-1" title="如何引入" kind="code" />

### 基本用法

下面以普通 Markdown 为例，将内容传给 `raw`，并设置 `format="md"`。使用可信 MDX 时，`<`、`{` 等符号具有语法含义，作为普通字符使用时需要转义。

<DemoBlock id="zh-CN-plus-markdownrender-2" title="基本用法" kind="live" />

### 修改元素样式

你可以任意替换 Markdown 或 MDX 文档中的文档元素的显示效果，只需通过 `components` prop 传入 Vue 组件覆盖即可。

比如，现在需要将所有1号标题的颜色设置成主色

<DemoBlock id="zh-CN-plus-markdownrender-3" title="修改元素样式" kind="live" />

可以覆盖的基本元素 tag 支持 `a blockquote br code em h1 h2 h3 h4 h5 hr img li ol p pre strong ul table`

### 仅纯 Markdown

使用 `format="md"` 关闭 MDX 表达式和组件语法，内容仍遵循 Markdown 的标记和转义规则。

<DemoBlock id="zh-CN-plus-markdownrender-4" title="仅纯 Markdown" kind="live" />

下例通过 `rehype-raw` 渲染受信任内容中的 HTML 标签。用户输入应遵循应用的 HTML 清理策略。

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

| 属性          | 说明                                                  | 类型                     | 默认值 |
| ------------- | ----------------------------------------------------- | ------------------------ | ------ |
| raw           | Markdown 或 MDX 的纯文本                              | string（必填）           | -      |
| class         | Vue 原生类名                                          | HTMLAttributes['class']  | —      |
| className     | 类名                                                  | string                   | -      |
| components    | 用于覆盖 Markdown 元素，也可添加自定义组件            | MarkdownRenderComponents | -      |
| format        | 传入的 raw 类型，是否是纯 Markdown                    | MarkdownRenderFormat     | `mdx`  |
| rehypePlugins | 自定义 Rehype Plugin                                  | MarkdownRenderPluginList | `[]`   |
| remarkGfm     | 是否开启 GitHub Flavored Markdown，例如表格和任务列表 | boolean                  | true   |
| remarkPlugins | 自定义 Remark Plugin                                  | MarkdownRenderPluginList | `[]`   |
| style         | 样式                                                  | StyleValue               | -      |
