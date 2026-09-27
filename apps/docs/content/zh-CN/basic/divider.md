---
title: 'Divider 分割线'
description: '分割线是一个呈线状的轻量化组件，用于有逻辑的组织元素内容和页面结构或区域。'
type: 'basic'
order: 25
icon: 'doc-divider'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/divider` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-basic-divider-1" title="如何引入" kind="import" />

### 基本用法

<DemoBlock id="zh-CN-basic-divider-2" title="基本用法" kind="live" />

### 包含内容

<DemoBlock id="zh-CN-basic-divider-3" title="包含内容" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/divider/types.ts` 的公开类型为准。

#### Vue 插槽

**Divider**

| 插槽    | 作用域参数 | 说明           |
| ------- | ---------- | -------------- |
| default | {}         | 分割线中的内容 |

| 属性   | 说明                                        | 类型             | 默认值     | 版本  |
| ------ | ------------------------------------------- | ---------------- | ---------- | ----- |
| align  | 带内容时，内容对齐方式                      | DividerAlign     | center     | 2.9.0 |
| dashed | 是否为虚线                                  | boolean          | false      | 2.9.0 |
| layout | 分割线方向                                  | DividerLayout    | horizontal | 2.9.0 |
| margin | 分割线上下 margin (垂直方向时为左右 margin) | number \| string | 无         | 2.9.0 |
