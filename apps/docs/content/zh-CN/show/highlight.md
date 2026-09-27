---
title: 'Highlight 高亮文本'
description: '高亮特定内容'
type: 'show'
order: 72
icon: 'doc-highlight'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/highlight` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

Highlight 从 v2.24.0 版本开始支持

<DemoBlock id="zh-CN-show-highlight-1" title="如何引入" kind="import" />

### 基本用法

你可以通过 `searchWords` 指定需要高亮的关键字，通过 `sourceString` 指定源文本

<DemoBlock id="zh-CN-show-highlight-2" title="基本用法" kind="live" />

### 指定高亮样式

默认情况下，高亮文本会自带文本样式，背景颜色 --semi-yellow-4, 文本颜色为黑色
暗色模式下，背景颜色为 --semi-yellow-2，文本颜色为白色
当你需要自定义不同的高亮样式时，你可以通过 `highlightClassName`, `highlightStyle`来指定

<DemoBlock id="zh-CN-show-highlight-3" title="指定高亮样式" kind="live" />

### 不同文本使用差异化样式

v2.71.0 后，支持针对不同的高亮文本使用不同的高亮样式
searchWords 默认为字符串数组。当传入对象数组时，可以通过 text指定高亮文本，同时单独指定 className、style

<DemoBlock id="zh-CN-show-highlight-4" title="不同文本使用差异化样式" kind="live" />

### 指定高亮标签

Semi 默认会将 sourceString 中与 searchWords 匹配的文本用 mark 标签包裹，你也可以通过 `component` 重新指定标签

<DemoBlock id="zh-CN-show-highlight-5" title="指定高亮标签" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/highlight/types.ts` 的公开类型为准。

### Highlight

| 属性               | 说明                                        | 类型                 | 默认值 |
| ------------------ | ------------------------------------------- | -------------------- | ------ |
| autoEscape         | 是否自动转义                                | boolean              | true   |
| caseSensitive      | 是否大小写敏感                              | boolean              | false  |
| sourceString       | 源文本                                      | string               | `''`   |
| searchWords        | 期望高亮显示的文本（对象数组在v2.71后支持） | HighlightSearchWords | []     |
| highlightStyle     | 高亮标签的内联样式                          | CSSProperties        | -      |
| highlightClassName | 高亮标签的样式类名                          | string               | -      |
| component          | 高亮标签                                    | string               | `mark` |
