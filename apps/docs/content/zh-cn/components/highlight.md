---
title: '高亮文本'
description: '高亮特定内容'
locale: 'zh-CN'
slug: 'highlight'
category: 'show'
order: 72
englishTitle: 'Highlight'
icon: 'doc-highlight'
upstream: 'show/highlight'
---

## 代码演示

### 如何引入

Highlight 从 v2.24.0 版本开始支持

```ts
import { Highlight } from '@aifuxi/semi-ui-vue/highlight';
import '@aifuxi/semi-theme-default/highlight.css';
```

### 基本用法

你可以通过 `searchWords` 指定需要高亮的关键字，通过 `sourceString` 指定源文本

Highlight 组件会将文本被拆分成多个独立的行内元素，任何分割文本流的 CSS 布局（如 flex 布局）可能会将高亮文本断开，为避免高亮内容被浏览器拆分到不同行或列，请按需使用元素包裹 Highlight 组件。

::demo-block{demo="highlight/zh-cn/Basic" title="基本用法"}
::

### 指定高亮样式

默认情况下，高亮文本会自带文本样式，背景颜色 --semi-yellow-4, 文本颜色为黑色  
暗色模式下，背景颜色为 --semi-yellow-2，文本颜色为白色  
当你需要自定义不同的高亮样式时，你可以通过 `highlightClassName`, `highlightStyle`来指定

::demo-block{demo="highlight/zh-cn/Style" title="指定高亮样式"}
::

### 不同文本使用差异化样式

v2.71.0 后，支持针对不同的高亮文本使用不同的高亮样式
searchWords 默认为字符串数组。当传入对象数组时，可以通过 text指定高亮文本，同时单独指定 className、style

::demo-block{demo="highlight/zh-cn/Keywords" title="不同文本使用差异化样式"}
::

### 指定高亮标签

Semi 默认会将 sourceString 中与 searchWords 匹配的文本用 mark 标签包裹，你也可以通过 `component` 重新指定标签

::demo-block{demo="highlight/zh-cn/Tag" title="指定高亮标签"}
::

## API 参考

### Highlight

| 属性               | 说明                                                     | 类型                                 | 默认值 |
| ------------------ | -------------------------------------------------------- | ------------------------------------ | ------ |
| searchWords        | 高亮关键词，支持字符串或含 text、className、style 的对象 | Array<string \| HighlightSearchWord> | -      |
| sourceString       | 原始文本                                                 | string                               | ''     |
| component          | 高亮标签                                                 | string                               | `mark` |
| highlightClassName | 高亮标签类名                                             | string                               | -      |
| highlightStyle     | 高亮标签内联样式                                         | CSSProperties                        | -      |
| caseSensitive      | 是否区分大小写                                           | boolean                              | false  |
| autoEscape         | 是否自动转义关键词                                       | boolean                              | true   |

## 设计变量

::token-table{component="highlight"}
::

## Accessibility

默认 mark 标签表达文字与当前上下文相关，不改变原始阅读顺序。自定义颜色时保持对比度，并避免仅用颜色传递额外含义。

## FAQ

**为什么高亮文字被拆成不同列？**

Highlight 渲染多个行内片段；在外层增加 h2、p 或 span，避免直接作为 flex 容器的多个子项。

## React → Vue 迁移

| React                      | Vue                                      |
| -------------------------- | ---------------------------------------- |
| sourceString / searchWords | 同名 props，通过冒号绑定数组             |
| highlightStyle             | CSSProperties，尺寸属性使用合法 CSS 单位 |
| highlightClassName         | 字符串 class，不是 ReactNode             |
| component                  | HTML 标签名，默认 mark                   |
| 关键词 style / className   | 保留对象字段，对应匹配区间的独立样式     |

searchWords 支持字符串或 `{ text, className?, style? }` 对象，默认不传；sourceString 默认空字符串。autoEscape 默认 true，caseSensitive 默认 false。组件不渲染统一外层，不使用默认插槽或 v-model；文字必须传入 sourceString。
