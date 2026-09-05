---
title: '布局'
description: '用于快捷划分页面整体布局'
locale: 'zh-CN'
slug: 'layout'
category: 'basic'
order: 19
englishTitle: 'Layout'
icon: 'doc-layout'
upstream: 'basic/layout'
---

## 概述

- `Layout`：布局容器，其下可嵌套 `Header` `Sider` `Content` `Footer` 或 `Layout` 本身，可以放在任何父容器中。
- `Header`：顶部布局，其下可嵌套任何元素，只能放在 `Layout` 中。
- `Sider`：侧边栏，其下可嵌套任何元素，只能放在 `Layout` 中。
- `Content`：内容部分，其下可嵌套任何元素，只能放在 `Layout` 中。
- `Footer`：底部布局，其下可嵌套任何元素，只能放在 `Layout` 中。

1、布局组件采用 Flex 布局实现，无法在非现代浏览器中工作 <br/>
2、Layout 组件仅会帮你实现布局，但不会附带背景色、文本色、宽高度等样式。你可以根据自己实际需求传入 style 或给定特定 class 另行编写 CSS实现

## 代码演示

### 如何引入

```ts
import {
  Layout,
  LayoutHeader,
  LayoutFooter,
  LayoutContent,
  LayoutSider,
} from '@aifuxi/semi-ui-vue/layout';
import '@aifuxi/semi-theme-default/layout.css';
```

### 三行布局

::demo-block{demo="layout/zh-cn/ThreeSections" title="三行布局"}
::

### 左侧边栏布局

::demo-block{demo="layout/zh-cn/LeftSidebar" title="左侧边栏布局"}
::

### 右侧边栏布局

::demo-block{demo="layout/zh-cn/RightSidebar" title="右侧边栏布局"}
::

### 侧边栏布局

::demo-block{demo="layout/zh-cn/Sidebar" title="侧边栏布局"}
::

### 响应式布局

侧边栏预设了六个响应尺寸：`xs`、`sm`、`md`、`lg`、`xl`、`xxl`。可以通过设置 `breakpoint` 属性设置断点，通过 `@breakpoint` 监听断点变化。

::demo-block{demo="layout/zh-cn/Responsive" title="响应式布局"}
::

## 布局示例

### 顶部导航布局

::demo-block{demo="layout/zh-cn/TopNavigation" title="顶部导航布局"}
::

### 顶部导航-侧边布局

::demo-block{demo="layout/zh-cn/TopSidebar" title="顶部导航-侧边布局"}
::

### 侧边导航

::demo-block{demo="layout/zh-cn/SideNavigation" title="侧边导航"}
::

## API 参考

### Layout

> `Layout.Header`、`Layout.Footer`、`Layout.Content` 共享样式与语义属性；`hasSider` 仅用于 Layout。

| 属性       | 说明                                                                                                                                                                                  | 类型          | 默认值 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ------ |
| class      | 类名                                                                                                                                                                                  | string        | -      |
| hasSider   | 表示子元素里有 Sider，一般不用指定。可用于服务端渲染时避免样式闪动                                                                                                                    | boolean       | -      |
| style      | 样式                                                                                                                                                                                  | CSSProperties | -      |
| aria-label | [aria-label](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute) 属性，用来给当前元素加上的标签描述, 提升可访问性 >=2.3.0 | string        | -      |
| role       | [role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles) 属性, 提升可访问性 >=2.3.0                                                                              | string        | -      |

### Layout.Sider

| 属性        | 说明                                                                                                                                                                                 | 类型                                   | 默认值 |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- | ------ |
| breakpoint  | 触发响应式布局的断点，可选值'xs', 'sm', 'md', 'lg', 'xl', 'xxl'                                                                                                                      | string[]                               | -      |
| class       | 类名                                                                                                                                                                                 | string                                 | -      |
| style       | 样式                                                                                                                                                                                 | CSSProperties                          | -      |
| @breakpoint | 触发响应式布局断点时的回调                                                                                                                                                           | (screen: string, broken: bool) => void | -      |
| aria-label  | [aria-label](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute)属性，用来给当前元素加上的标签描述, 提升可访问性 >=2.3.0 | string                                 | -      |

### responsive map

```text
{
    xs: '(max-width: 575px)',
    sm: '(min-width: 576px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 992px)',
    xl: '(min-width: 1200px)',
    xxl: '(min-width: 1600px)',
};
```

## Accessibility

### ARIA

- Sider 可传入 aria-label props，描述该 Sider 作用。
- Header Content Main Footer 可传入 role aria-label 描述对应元素作用。

## 设计变量

Layout 自身不定义专属设计变量；示例颜色使用默认主题全局 Token，宽高与背景由业务样式设置。

## React → Vue 迁移

| React                                | Vue                                                                                      |
| ------------------------------------ | ---------------------------------------------------------------------------------------- |
| `Layout.Header/Footer/Content/Sider` | 可保留组合成员，或导入 `LayoutHeader` / `LayoutFooter` / `LayoutContent` / `LayoutSider` |
| `children`                           | 默认插槽                                                                                 |
| `className` / `style`                | 原生 `class` / `style`                                                                   |
| `onBreakpoint(screen, matches)`      | `@breakpoint="onBreakpoint"`                                                             |
| React ref                            | Vue template ref                                                                         |

Layout、Header、Footer、Content 公开 `tagName`（默认分别为 section、header、footer、main）和 `prefixCls`（默认 `semi-layout`）。`hasSider` 仅属于 Layout；Header、Footer、Content 不公开此属性。Sider 使用 aside，支持 `class`、`style`、`data-*` 和 `aria-label`；固定 Adapter 不转发 `role`，本页已移除上游表格中无效的承诺。

断点回调报告对应媒体查询是否匹配，不自动折叠侧栏；需要折叠时由调用方根据回调调整布局。SSR 可显式设置 `hasSider` 避免初始布局闪动。

组合示例中的 Semi/ByteDance 品牌 Logo 已替换为通用图标与独立名称，保留导航和布局能力。上游「相关物料」是外部物料平台入口，本地文档不接入该平台。
