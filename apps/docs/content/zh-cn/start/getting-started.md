---
title: '快速开始'
englishTitle: 'Getting Started'
description: '安装组件、主题和图标，在 Vue 或 Nuxt 项目中开始使用。'
slug: 'getting-started'
locale: 'zh-CN'
category: 'start'
order: 1
upstream: 'start/getting-started'
---

## 安装

```bash
pnpm add @aifuxi/semi-ui-vue @aifuxi/semi-theme-default @aifuxi/semi-icons-vue
```

项目需要 Vue 3.5 或更新版本。组件和样式独立发布，请保持相关包版本一致。

## 引入组件

推荐显式导入组件子路径和对应样式：

::demo-block{demo="guides/zh-cn/GettingStarted1" title="引入组件"}
::

也可从根入口导入组件。按组件导入样式有助于控制 CSS 体积；需要全部样式时使用 `@aifuxi/semi-theme-default/index.css`。

## Nuxt

在 Nuxt 页面或组件的 script setup 中直接导入公开组件。全局样式可通过 Nuxt 的 `css` 配置声明。普通组件保留服务端渲染；依赖浏览器环境的编辑器或媒体示例在客户端挂载，避免在模块顶层访问 window 和 document。

## 事件与状态

使用 Vue 事件和 v-model 维护状态。具体组件可能提供 `v-model:visible`、`v-model:value` 等命名模型，请以组件 API 表为准。

::demo-block{demo="guides/zh-cn/state/Counter" title="事件与状态"}
::

## 图标

图标通过具名导出和组件插槽使用：

::demo-block{demo="guides/zh-cn/GettingStarted2" title="使用图标"}
::

## 从 React 迁移

React children 对应默认 slot，render props 对应具名或作用域 slot，onChange 一般对应 Vue 事件。不要直接复制 ReactNode、JSX 或 React ref；每个组件页面都有对应迁移说明。
