---
title: '图标'
description: '语义化的矢量图形。'
locale: 'zh-CN'
slug: 'icon'
category: 'basic'
order: 26
englishTitle: 'Icon'
icon: 'doc-icons'
upstream: 'basic/icon'
---

## 图标列表

默认图标包提供面性、线性和 AI 图标。单色图标通过 CSS color 改色；AI 双色与多色图标使用 fill。独立的 `@aifuxi/semi-icons-lab-vue` 提供固定颜色的 Lab 图标，不支持改色。AI 图标对应上游 v2.86.0 起的能力，Lab 对应 v2.48 起的能力。

## 代码演示

### 如何引入

```typescript
import Icon, { IconHome } from '@aifuxi/semi-icons-vue';
import '@aifuxi/semi-theme-default/icon.css';
```

### 基本使用

从独立图标包引入所需图标。

::demo-block{demo="icon/zh-cn/Basic" title="基本使用"}
::

### 旋转与自旋

small 为 12px；rotate 以角度旋转，spin 持续自旋。

::demo-block{demo="icon/zh-cn/RotateSpin" title="旋转与自旋"}
::

### 尺寸

预设尺寸为 8、12、16、20、24px。size="inherit" 继承上下文字号；也可通过 style.fontSize 设置字号。

::demo-block{demo="icon/zh-cn/Sizes" title="尺寸"}
::

### 颜色

单色图标继承容器 CSS color，也可以用 style 单独设置。

::demo-block{demo="icon/zh-cn/Colors" title="颜色"}
::

### 双色图标

fill 支持颜色字符串或数组。

::demo-block{demo="icon/zh-cn/Bicolor" title="双色图标"}
::

### 多色图标

默认四色可通过 fill 覆盖；颜色不足时按固定图标逻辑补齐。

::demo-block{demo="icon/zh-cn/Multicolor" title="多色图标"}
::

### 自定义图标

默认 slot 接收自定义 SVG，并保留 size、rotate、spin 能力。

::demo-block{demo="icon/zh-cn/Custom" title="自定义图标"}
::

### 引入 SVG 组件

上游 `@svgr/webpack` 生成 React 组件，不能直接用于 Vue。可将 SVG 写入 `.vue` 组件（如本例 CustomSvg.vue），然后通过 `<Icon><CustomSvg /></Icon>` 使用；无需新增 loader。

## Accessibility

### ARIA

内置图标根节点 role="img"，默认 aria-label 为图标文件名（如 home），可按业务语义覆盖。内部 SVG 默认 aria-hidden="true"，避免重复朗读。自定义 SVG 由调用方处理可访问性；纯装饰图标可设置 aria-hidden="true"。

::demo-block{demo="icon/zh-cn/Accessibility" title="ARIA"}
::

## API

::api-table{slug="icon"}
::

## React → Vue

| React                                    | Vue                                                                                     |
| ---------------------------------------- | --------------------------------------------------------------------------------------- |
| className / style                        | 原生 class / style                                                                      |
| onClick、onMouseDown/Enter/Leave/Move/Up | @click、@mousedown / @mouseenter / @mouseleave / @mousemove / @mouseup，原生 MouseEvent |
| svg={ReactNode}                          | 默认 slot；程序化调用也可传 svg VNode                                                   |
| React.cloneElement(icon, { size })       | component :is 与 :size，使用 v-for 展示列表                                             |
| `ref<HTMLSpanElement>`                   | 组件 ref 暴露 element                                                                   |
