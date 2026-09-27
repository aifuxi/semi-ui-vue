---
title: 'Skeleton 骨架屏'
description: '在需要等待加载内容的位置提供的占位组件。'
type: 'feedback'
order: 92
icon: 'doc-skeleton'
---

## 概述

- `Avatar`：占位头像，默认为圆形，默认尺寸：Avatar medium: `width: 48px`，`height: 48px`。支持 Avatar 的 size、shape 属性 (v2.20后支持)
- `Image`：占位图像，默认尺寸：`width: 100%`，`height: 100%`。
- `Title`：占位标题，默认尺寸：`width: 100%`， `height: 24px`。
- `Paragraph`：占位内容部分，默认尺寸：`width: 100%`，`height: 16px`，`margin-bottom: 10px`。
- `Button`：占位按钮，默认尺寸：`width: 115px`，`height: 32px`。

> 注意：默认样式均可通过 `className` 或 `style` 进行自定义。

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/skeleton` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-feedback-skeleton-1" title="如何引入" kind="import" />

### 基本使用

<DemoBlock id="zh-CN-feedback-skeleton-2" title="基本使用" kind="live" />

### 组合使用

图片和标题。

<DemoBlock id="zh-CN-feedback-skeleton-3" title="组合使用" kind="live" />

统计数字。

<DemoBlock id="zh-CN-feedback-skeleton-4" title="组合使用" kind="live" />

头像和标题。

<DemoBlock id="zh-CN-feedback-skeleton-5" title="组合使用" kind="live" />

居中段落和按钮。

<DemoBlock id="zh-CN-feedback-skeleton-6" title="组合使用" kind="live" />

头像、标题和段落。

<DemoBlock id="zh-CN-feedback-skeleton-7" title="组合使用" kind="live" />

表格。

<DemoBlock id="zh-CN-feedback-skeleton-8" title="组合使用" kind="live" />

### 加载动画

通过设置 `active` 属性可以展示动画效果。

<DemoBlock id="zh-CN-feedback-skeleton-9" title="加载动画" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/skeleton/types.ts`、`packages/ui/src/skeleton/index.ts` 的公开类型为准。

#### Vue 用法

- `SkeletonButton`、`SkeletonImage`、`SkeletonTitle` 只使用 `SkeletonBasicProps`；`SkeletonAvatar` 和 `SkeletonParagraph` 分别在此基础上增加自有 props。
- `loading` 是单向 prop，不映射为 `v-model`；为 false 时只渲染默认插槽。
- `placeholder` 同时支持 VNode prop 和同名插槽，插槽优先。

#### Vue 插槽

**Skeleton**

| 插槽        | 作用域参数 | 说明             |
| ----------- | ---------- | ---------------- |
| default     | {}         | 加载完成后的内容 |
| placeholder | {}         | 加载时的占位内容 |

### Skeleton

| 属性        | 说明                                       | 类型                    | 默认值 |
| ----------- | ------------------------------------------ | ----------------------- | ------ |
| active      | 是否展示动画效果                           | boolean                 | false  |
| class       | Vue 原生类名                               | HTMLAttributes['class'] | —      |
| className   | 样式类名                                   | HTMLAttributes['class'] | -      |
| loading     | 为 true 时，显示占位元素。反之则显示子组件 | boolean                 | true   |
| placeholder | 加载等待时的占位元素                       | VNodeChild              | -      |
| style       | 样式                                       | StyleValue              | -      |

### Skeleton.Avatar

> `Skeleton.Image`、`Skeleton.Title`、`Skeleton.Button` 使用公共 item props；`size` 和 `shape` 仅 `Skeleton.Avatar` 支持。

| 属性      | 说明                                                                                               | 类型                    | 默认值          |
| --------- | -------------------------------------------------------------------------------------------------- | ----------------------- | --------------- |
| class     | Vue 原生类名                                                                                       | HTMLAttributes['class'] | —               |
| className | 样式类名                                                                                           | HTMLAttributes['class'] | -               |
| prefixCls | 样式类名前缀                                                                                       | string                  | `semi-skeleton` |
| style     | 样式                                                                                               | StyleValue              | -               |
| shape     | 指定头像的形状，支持 `circle`、`square`                                                            | SkeletonAvatarShape     | `circle`        |
| size      | 设置头像的大小，支持 `extra-extra-small`, `extra-small`、`small`、`medium`、`large`、`extra-large` | SkeletonAvatarSize      | `medium`        |

### Skeleton.Paragraph

| 属性      | 说明                 | 类型                    | 默认值          |
| --------- | -------------------- | ----------------------- | --------------- |
| class     | Vue 原生类名         | HTMLAttributes['class'] | —               |
| className | 样式类名             | HTMLAttributes['class'] | -               |
| prefixCls | 样式类名前缀         | string                  | `semi-skeleton` |
| style     | 样式                 | StyleValue              | -               |
| rows      | 设置段落占位图的行数 | number                  | 4               |

## 文案规范

- 不变的固定内容直接展示固定内容，可变的内容使用骨架屏展示
