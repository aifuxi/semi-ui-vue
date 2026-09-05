---
title: '介绍'
englishTitle: 'Introduction'
description: 'Semi UI Vue 是基于 Semi Design v2.102.0 的独立 Vue 3 组件库。'
slug: 'introduction'
locale: 'zh-CN'
category: 'start'
order: 0
upstream: 'start/introduction'
---

## 什么是 Semi UI Vue

Semi UI Vue 为桌面端中后台应用提供组件、主题、图标和插画。项目采用 Vue 3.5、TypeScript 和 Composition API，使用 Vue 原生 props、emits、slots 与 v-model。

## 设计与实现

### 统一的视觉基础

组件沿用 Semi 的布局、交互状态、`.semi-*` class 和 `--semi-*` CSS Token。主题使用独立的默认主题包，能够按组件引入。

### 跨框架架构

交互逻辑通过 Foundation 与 Adapter 分层。Foundation 的计算和状态转换来自固定的上游源码，Vue Adapter 负责渲染、响应式状态和生命周期。发布产物内联所需逻辑，使用者不需要初始化 Git submodule。

### 深色模式

在 body 上设置 `theme-mode="dark"` 可以启用暗色主题。也可在局部容器上设置此属性；文档右上角的主题按钮同时切换页面和示例。

### 国际化

LocaleProvider 提供上下文语言配置，包含全部 57 个语言源。本站提供简体中文与英文文档；切换语言会保留当前组件页面。

## 开始使用

从[快速开始](../getting-started/)安装组件和主题包，或打开[组件总览](../../components/)寻找所需能力。

## 兼容性

组件包要求 `vue >= 3.5`。发布格式为 ESM 和 TypeScript 声明，支持 SSR-safe import。浏览器验收范围为项目锁定的 Playwright Chromium，桌面默认 viewport 为 1440×900、DPR 1；不承诺移动端、Firefox 或 WebKit 兼容性。

## 项目与许可

本项目使用独立品牌 Semi UI Vue，与 Semi Design 无官方授权或合作关系。源码与发布产物保留 MIT License 和适用的第三方声明。详见[许可](../../project/license/)。
