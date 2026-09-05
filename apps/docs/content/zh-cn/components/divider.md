---
title: '分割线'
description: '分割线是一个呈线状的轻量化组件，用于有逻辑的组织元素内容和页面结构或区域。'
locale: 'zh-CN'
slug: 'divider'
category: 'basic'
order: 25
englishTitle: 'Divider'
upstream: 'basic/divider'
---

以下章节与示例逐项对应只读 Semi Design v2.102.0 文档。API 表中的版本号指上游版本；运行与源码均来自当前 Vue SFC。

## 代码演示

### 如何引入

```ts
import { Divider } from '@aifuxi/semi-ui-vue/divider';
import '@aifuxi/semi-theme-default/divider.css';
```

### 基本用法

::demo-block{demo="divider/zh-cn/Basic" title="基本用法"}
::

### 包含内容

::demo-block{demo="divider/zh-cn/WithContent" title="包含内容"}
::

## API参考

| 属性         | 说明                                        | 类型                    | 默认值     | 版本  |
| ------------ | ------------------------------------------- | ----------------------- | ---------- | ----- |
| align        | 带内容时，内容对齐方式                      | left \| center \| right | center     | 2.9.0 |
| default slot | 内容                                        | VNodeChild              | 无         | 2.9.0 |
| class        | 类名                                        | string                  | 无         | 2.9.0 |
| dashed       | 是否为虚线                                  | boolean                 | false      | 2.9.0 |
| layout       | 分割线方向                                  | horizontal \| vertical  | horizontal | 2.9.0 |
| margin       | 分割线上下 margin (垂直方向时为左右 margin) | number \| string        | 无         | 2.9.0 |
| style        | 自定义样式                                  | CSSProperties           | 无         | 2.9.0 |

## 设计变量

::token-table{component="divider"}
::

## 无障碍

使用原生 `class`、`style`、`id`、`role`、`aria-*` 与 `data-*` 属性。布局不应改变阅读顺序；有交互的子组件应提供明确名称，且能用键盘操作。

## React → Vue 迁移

| React                 | Vue                              |
| --------------------- | -------------------------------- |
| `children`            | `default` 插槽，仅水平分割线渲染 |
| `className` / `style` | 原生 `class` / `style`           |
| React ref             | Vue template ref                 |

垂直模式不渲染默认插槽。`style` 会覆盖 `margin` 生成的同名轴向值。分割线本身不自动添加 separator 语义；具有语义的分割使用 `role="separator"`，垂直分割另设 `aria-orientation="vertical"`。
