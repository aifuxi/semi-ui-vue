---
title: 'CodeHighlight 代码高亮'
description: '根据语法高亮页面中的代码块'
type: 'plus'
order: 29
icon: 'doc-codehighlight'
---

## 使用场景

Semi 代码高亮组件基于 prismjs 封装，支持297 种编程语言的高亮（已自动配置 `JavaScript` `CSS` `类 C` `html` `svg` 等，其他语言需要手动引入），同时具有高扩展性和丰富的插件生态。
需要展示代码片段时推荐使用 CodeHighlight 组件

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/code-highlight` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

CodeHighlight 从 v2.62.0 开始支持

<DemoBlock id="zh-CN-plus-codehighlight-1" title="如何引入" kind="code" />

### 基本用法

向 `code` props 传入代码纯文本，并在 `language` 传入编程语言名称。支持的编程语言和对应名称在 [Prismjs 官网](https://prismjs.com/#supported-languages) 查看

<DemoBlock id="zh-CN-plus-codehighlight-2" title="基本用法" kind="live" />

**CSS**

<DemoBlock id="zh-CN-plus-codehighlight-3" title="基本用法" kind="live" />

### 支持其他语言

支持 297 种语言，除去 `JavaScript` `CSS` `类 C` `html` `svg` 外，支持其他语言需要手动引入配置。

例如，高亮用于编写 GTK 程序前端 UI 的 Vala 语言，需要引入 `prism-vala.js`

<DemoBlock id="zh-CN-plus-codehighlight-4" title="支持其他语言" kind="code" />

<DemoBlock id="zh-CN-plus-codehighlight-5" title="支持其他语言" kind="live" />

### 自定义主题

设置 `:default-theme="false"` 关闭默认主题，然后手动将需要的主题的 css 文件拷贝并放入项目中引入即可。
一些主题可在 node_modules 内 prismjs/themes 下找到，你也可以在网上搜索其他中意的主题。

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/code-highlight/types.ts` 的公开类型为准。

#### Vue 用法

- 默认内置 JavaScript、CSS、类 C、HTML、SVG 语法；其他语言需由使用者显式引入对应的 Prism 语言模块。
- 组件支持浏览器原生选择与复制，不提供内置复制按钮或复制事件。

| 属性         | 说明                                         | 类型                    | 默认值 |
| ------------ | -------------------------------------------- | ----------------------- | ------ |
| code         | 代码纯文本                                   | string（必填）          | -      |
| language     | 语言类型                                     | string（必填）          | -      |
| lineNumber   | 是否开启行数显示                             | boolean                 | true   |
| defaultTheme | 是否使用默认主题，添加自己的主题时设置 false | boolean                 | true   |
| class        | Vue 原生类名                                 | HTMLAttributes['class'] | —      |
| className    | 类名                                         | HTMLAttributes['class'] | -      |
| style        | 样式                                         | StyleValue              | -      |
