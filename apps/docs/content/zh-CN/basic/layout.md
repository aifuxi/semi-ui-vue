---
title: 'Layout 布局'
description: '用于快捷划分页面整体布局'
type: 'basic'
order: 19
icon: 'doc-layout'
---

## 概述

- `Layout`：布局容器，其下可嵌套 `Header` `Sider` `Content` `Footer` 或 `Layout` 本身，可以放在任何父容器中。
- `Header`：顶部布局，其下可嵌套任何元素，只能放在 `Layout` 中。
- `Sider`：侧边栏，其下可嵌套任何元素，只能放在 `Layout` 中。
- `Content`：内容部分，其下可嵌套任何元素，只能放在 `Layout` 中。
- `Footer`：底部布局，其下可嵌套任何元素，只能放在 `Layout` 中。

2、Layout 组件仅会帮你实现布局，但不会附带背景色、文本色、宽高度等样式。你可以根据自己实际需求传入 style 或给定特定 className 另行编写css实现

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/layout` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-basic-layout-1" title="如何引入" kind="import" />

### 三行布局

<DemoBlock id="zh-CN-basic-layout-2" title="三行布局" kind="live" />

### 左侧边栏布局

<DemoBlock id="zh-CN-basic-layout-3" title="左侧边栏布局" kind="live" />

### 右侧边栏布局

<DemoBlock id="zh-CN-basic-layout-4" title="右侧边栏布局" kind="live" />

### 侧边栏布局

<DemoBlock id="zh-CN-basic-layout-5" title="侧边栏布局" kind="live" />

### 响应式布局

侧边栏预设了六个响应尺寸：`xs`、`sm`、`md`、`lg`、`xl`、`xxl`。可以通过 `breakpoint` prop 设置断点，通过 `@breakpoint` 监听初始匹配和后续变化。

<DemoBlock id="zh-CN-basic-layout-6" title="响应式布局" kind="live" />

## 布局示例

### 顶部导航布局

<DemoBlock id="zh-CN-basic-layout-7" title="顶部导航布局" kind="live" />

### 顶部导航-侧边布局

<DemoBlock id="zh-CN-basic-layout-8" title="顶部导航-侧边布局" kind="live" />

### 侧边导航

<DemoBlock id="zh-CN-basic-layout-9" title="侧边导航" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/layout/types.ts`、`packages/ui/src/layout/index.ts` 的公开类型为准。

#### Vue 事件

**LayoutSider**

| 事件       | 参数                                       | 说明                         |
| ---------- | ------------------------------------------ | ---------------------------- |
| breakpoint | [screen: LayoutBreakpoint, match: boolean] | 初始匹配和媒体查询变化时触发 |

#### Vue 插槽

**Layout**

| 插槽    | 作用域参数 | 说明     |
| ------- | ---------- | -------- |
| default | {}         | 布局子树 |

**LayoutHeader**

| 插槽    | 作用域参数 | 说明     |
| ------- | ---------- | -------- |
| default | {}         | 页头内容 |

**LayoutContent**

| 插槽    | 作用域参数 | 说明   |
| ------- | ---------- | ------ |
| default | {}         | 主内容 |

**LayoutFooter**

| 插槽    | 作用域参数 | 说明     |
| ------- | ---------- | -------- |
| default | {}         | 页脚内容 |

**LayoutSider**

| 插槽    | 作用域参数 | 说明       |
| ------- | ---------- | ---------- |
| default | {}         | 侧边栏内容 |

### Layout

`LayoutHeader`、`LayoutContent`、`LayoutFooter` 共用下表的 Vue props。

| 属性      | 说明                             | 类型          | 默认值        |
| --------- | -------------------------------- | ------------- | ------------- |
| prefixCls | 样式类名前缀                     | string        | `semi-layout` |
| hasSider  | 预先声明子树含 Sider，常用于 SSR | boolean       | -             |
| tagName   | 根语义标签                       | LayoutTagName | `section`     |

### LayoutHeader / LayoutContent / LayoutFooter

| 属性      | 说明         | 类型          | 默认值                       |
| --------- | ------------ | ------------- | ---------------------------- |
| prefixCls | 样式类名前缀 | string        | `semi-layout`                |
| tagName   | 根语义标签   | LayoutTagName | `header` / `main` / `footer` |

### Layout.Sider

| 属性       | 说明               | 类型                        | 默认值        |
| ---------- | ------------------ | --------------------------- | ------------- |
| prefixCls  | 样式类名前缀       | string                      | `semi-layout` |
| breakpoint | 需监听的响应式断点 | readonly LayoutBreakpoint[] | `[]`          |

### responsive map

<DemoBlock id="zh-CN-basic-layout-10" title="responsive map" kind="code" />

## Accessibility

### ARIA

- Sider 可传入 aria-label props，描述该 Sider 作用。
- Header Content Main Footer 可传入 role aria-label 描述对应元素作用。
