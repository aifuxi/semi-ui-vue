---
title: '定制主题'
englishTitle: 'Customized Themes'
description: '使用 CSS Token 为应用定制视觉样式。'
slug: 'customize-theme'
locale: 'zh-CN'
category: 'advanced'
order: 0
upstream: 'advanced/customize-theme'
---

## 默认主题

安装 `@aifuxi/semi-theme-default`，按组件导入 CSS 或导入完整的 `index.css`。公开样式已编译，消费应用不需要 Sass 或上游源码。

## 覆盖设计变量

在主题 CSS 之后声明覆盖。作用于根元素的变量影响整个应用，容器上的变量仅影响其后代。

```css
:root {
  --semi-color-primary: #0064fa;
  --semi-color-primary-hover: #0052d6;
  --semi-border-radius-small: 3px;
}
```

## 状态与对比度

自定义主题时同时检查默认、hover、active、disabled、focus-visible 和暗色状态。只修改主色而不核对状态色可能造成文本对比度不足。

## Portal

默认渲染到 body 的浮层不继承局部容器的变量。局部主题需要通过组件公开的 getPopupContainer 指定容器，或在 Portal 容器设置同一主题变量。

## 变量索引

[设计变量](../../components/tokens/)提供固定基线的变量名称和默认值。不要通过更名 `.semi-*` class 改写主题契约。
