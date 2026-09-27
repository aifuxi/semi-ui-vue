---
title: 'Empty 空状态'
description: '空状态时的展示占位图。'
type: 'show'
order: 71
icon: 'doc-empty'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/empty` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-show-empty-1" title="如何引入" kind="import" />

### 基本用法

通过 `image` 设置占位图片，可以从 `@aifuxi/semi-illustrations-vue` 中手动引入对应的插画（插画默认宽高是200x200），也可以传入自定义的插画。目前拥有的插画可以查看[占位图插画](#占位图插画_建设中_)。

增加一系列暗色模式的插画，并支持通过 `darkModeImage` 传入暗色模式下需要使用的插画，以更好地适配暗色模式。

<DemoBlock id="zh-CN-show-empty-2" title="基本用法" kind="live" />

### 自定义

通过默认插槽可以自定义底部操作内容，描述内容使用 `description` prop 或同名插槽。

<DemoBlock id="zh-CN-show-empty-3" title="自定义" kind="live" />

也可以不使用图片。

<DemoBlock id="zh-CN-show-empty-4" title="自定义" kind="live" />

### 不同布局

支持 2 种类型的布局：`vertical`、`horizontal`。默认为 `vertical`。

<DemoBlock id="zh-CN-show-empty-5" title="不同布局" kind="live" />

### 占位图插画(建设中)

目前 `@aifuxi/semi-illustrations-vue` 中支持以下插画。

<DemoBlock id="zh-CN-show-empty-6" title="占位图插画(建设中)" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/empty/types.ts` 的公开类型为准。

#### Vue 用法

- `image`、`darkModeImage`、`title`、`description` 同时支持 VNode prop 和同名插槽，插槽内容优先。
- 默认插槽渲染在底部操作区。

#### Vue 插槽

**Empty**

| 插槽          | 作用域参数 | 说明           |
| ------------- | ---------- | -------------- |
| default       | {}         | 底部操作区     |
| darkModeImage | {}         | 暗色模式占位图 |
| description   | {}         | 内容描述       |
| image         | {}         | 占位图         |
| title         | {}         | 标题           |

| 属性          | 说明                                                              | 类型                    | 默认值     |
| ------------- | ----------------------------------------------------------------- | ----------------------- | ---------- |
| class         | Vue 原生类名                                                      | HTMLAttributes['class'] | —          |
| className     | 样式类名                                                          | HTMLAttributes['class'] | -          |
| darkModeImage | 暗色模式开启后的占位图，响应 document.body 的 theme-mode 属性变化 | EmptyImage              | -          |
| description   | 内容描述                                                          | VNodeChild              | -          |
| image         | 占位图                                                            | EmptyImage              | -          |
| imageStyle    | 占位图样式                                                        | StyleValue              | -          |
| layout        | 布局方式，支持 `vertical`, `horizontal`                           | EmptyLayout             | `vertical` |
| style         | 样式名                                                            | StyleValue              | -          |
| title         | 标题                                                              | VNodeChild              | -          |

## Accessibility

### ARIA

- Empty 插图的 aria-hidden 为 true

## 文案规范

- 标题
- 标题应该简洁易懂
- 正文
- 可以展示展示空状态的具体原因，也可以展示后续的操作行为去帮助用户消除空状态
- 不要重复标题上的内容
- 尽量保持正文在 1-2 句话内
- 动作按钮
- 按钮文案需要足够清晰和容易理解
- 使用 动词 + 名词 的格式

## FAQ
