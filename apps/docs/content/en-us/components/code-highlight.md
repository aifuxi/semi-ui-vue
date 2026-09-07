---
title: 'CodeHighlight'
description: 'Highlight code blocks in the page according to syntax'
locale: 'en-US'
slug: 'code-highlight'
category: 'plus'
order: 29
englishTitle: 'CodeHighlight'
icon: 'doc-codehighlight'
upstream: 'plus/codehighlight'
---

`CodeHighlight` uses the Prism integration pinned by Semi Design v2.102.0 to highlight plain-text code and optionally render line numbers.

::demo-block{demo="code-highlight/en-US/Example1" title="CodeHighlight"}
::

## Additional languages

Prism core includes markup/HTML, CSS, C-like languages, and JavaScript. Import other language definitions explicitly in the consuming application:

```ts
import 'prismjs/components/prism-vala.js';
```

## Upstream examples

### Basic usage

::demo-block{demo="code-highlight/en-US/Basic" title="JavaScript basic usage"}
::

### CSS

::demo-block{demo="code-highlight/en-US/Css" title="CSS"}
::

### Other languages: Vala

::demo-block{demo="code-highlight/en-US/Vala" title="Vala"}
::

## API

| Prop                  | Description                      | Type            | Default  |
| --------------------- | -------------------------------- | --------------- | -------- |
| `code`                | Plain-text source to highlight   | `string`        | required |
| `language`            | Prism language name              | `string`        | required |
| `lineNumber`          | Shows line numbers               | `boolean`       | `true`   |
| `defaultTheme`        | Enables the built-in theme class | `boolean`       | `true`   |
| `className` / `class` | Root class value                 | Vue class value | -        |
| `style`               | Root style                       | `StyleValue`    | -        |

When `defaultTheme` is false, token markup is still generated and the application must provide its own Prism theme. Code is accepted as text; embedded HTML is never executed.

## React → Vue

| React v2.102.0                                        | Vue 3.5+                                               | 说明                    |
| ----------------------------------------------------- | ------------------------------------------------------ | ----------------------- |
| `<CodeHighlight code={code} language="javascript" />` | `<CodeHighlight :code="code" language="javascript" />` | props 名与枚举保持一致  |
| `lineNumber={false}`                                  | `:line-number="false"`                                 | Vue 模板使用 kebab-case |
| `defaultTheme={false}`                                | `:default-theme="false"`                               | 关闭内置主题 class      |
| `className="demo"`                                    | `class="demo"` 或 `class-name="demo"`                  | Vue 原生 class 优先     |
| `style={{ width: 320 }}`                              | `:style="{ width: '320px' }"`                          | Vue 数值/字符串样式语义 |

组件没有 children/render prop、事件或命令式 ref API。请继续把代码作为纯文本传入，不要把预先生成的 HTML 当作 slot 内容。

Prism 的额外语言定义仍由应用显式导入，例如 `prismjs/components/prism-vala.js`。SSR 阶段只输出安全的原始文本，客户端挂载后生成 token 与行号 DOM。
