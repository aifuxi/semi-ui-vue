---
title: '代码高亮'
description: '根据语法高亮页面中的代码块'
locale: 'zh-CN'
slug: 'code-highlight'
category: 'plus'
order: 29
englishTitle: 'CodeHighlight'
icon: 'doc-codehighlight'
upstream: 'plus/codehighlight'
---

`CodeHighlight` 基于固定 Semi Design v2.102.0 的 Prism 集成，对纯文本代码进行语法高亮并可显示行号。

::demo-block{demo="code-highlight/zh-CN/Example1" title="代码高亮"}
::

## 其他语言

Prism 核心默认包含 markup/html、CSS、类 C 与 JavaScript。其他语言需要由应用显式引入对应定义：

```ts
import 'prismjs/components/prism-vala.js';
```

## 固定上游示例

### 基本用法

::demo-block{demo="code-highlight/zh-CN/Basic" title="JavaScript 基础用法"}
::

### CSS

::demo-block{demo="code-highlight/zh-CN/Css" title="CSS"}
::

### 其他语言：Vala

::demo-block{demo="code-highlight/zh-CN/Vala" title="Vala"}
::

## API

| 属性                  | 说明                   | 类型            | 默认值 |
| --------------------- | ---------------------- | --------------- | ------ |
| `code`                | 要高亮的纯文本代码     | `string`        | 必填   |
| `language`            | Prism 语言名称         | `string`        | 必填   |
| `lineNumber`          | 是否显示行号           | `boolean`       | `true` |
| `defaultTheme`        | 是否启用内置主题 class | `boolean`       | `true` |
| `className` / `class` | 根节点 class           | Vue class value | -      |
| `style`               | 根节点样式             | `StyleValue`    | -      |

关闭 `defaultTheme` 后，token DOM 仍会生成；应用需自行提供 Prism 主题。代码通过文本 prop 传入，组件不会执行代码中的 HTML。

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
