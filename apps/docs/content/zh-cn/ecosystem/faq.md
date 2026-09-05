---
title: '常见问题'
englishTitle: 'FAQ'
description: '处理安装、样式、SSR 和 Vue 迁移中的常见问题。'
slug: 'faq'
locale: 'zh-CN'
category: 'ecosystem'
order: 0
upstream: 'ecosystem/faq'
---

## 为什么组件没有样式？

组件包与默认主题包分开发布。请引入对应组件 CSS，或完整的 `@aifuxi/semi-theme-default/index.css`，并核对相关包的版本。

## 为什么弹层没有继承局部主题？

弹层通常通过 Teleport 渲染到 body。为弹层指定局部容器，或在 Portal 容器同步主题变量。

## 可以直接复制 Semi React 示例吗？

不能。ReactNode、JSX、children、render props 和 React ref 需要改写为 Vue API。本站示例使用真实 Vue 组件；每页的 React → Vue 说明列出差异。

## SSR 时如何访问 DOM？

公开包支持 SSR-safe import。将 document、window、Observer 等操作放到 onMounted 或用户事件中，卸载时清理监听。浏览器专属编辑器只在客户端加载。

## 文档编辑器会保存代码吗？

编辑仅在当前页面的本地沙箱运行，不会上传或写回仓库。重置恢复文档原始示例，离开页面后不保留修改。
