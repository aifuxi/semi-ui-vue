---
title: '轮播图'
description: '轮播图是一种媒体组件，可以在可视化应用中展示多张图片轮流播放的效果。'
locale: 'zh-CN'
slug: 'carousel'
category: 'show'
order: 66
englishTitle: 'Carousel'
icon: 'doc-carousel'
upstream: 'show/carousel'
---

## 代码演示

### 如何引入

```vue
<script setup lang="ts">
import { Carousel } from '@aifuxi/semi-ui-vue/carousel';
import '@aifuxi/semi-theme-default/carousel.css';
</script>
```

### 基本用法

基本用法

::demo-block{demo="carousel/zh-cn/Basic" title="基本用法"}
::

### 主题切换

默认定义了三种主题： `primary`、`light`、`dark`

::demo-block{demo="carousel/zh-cn/Theme" title="主题切换"}
::

示例中的 RadioGroup 使用每个示例独立的 name，避免同页其他示例通过原生单选组影响 checked；同一示例内部的组名关系保持不变。

### 指示器

指示器可以调节类型、位置、尺寸  
类型： `dot`、`line`、`columnar`  
位置： `left`、`center`、`right`  
尺寸： `small`、`medium`

::demo-block{demo="carousel/zh-cn/Indicators" title="指示器"}
::

### 箭头

通过 showArrow 属性控制箭头是否可见  
如果箭头可见，通过 arrowType 属性控制箭头展示的时机

::demo-block{demo="carousel/zh-cn/Arrows" title="箭头"}
::

### 定制箭头

通过 arrowProps 属性定制箭头样式和点击事件

::demo-block{demo="carousel/zh-cn/CustomArrows" title="定制箭头"}
::

### 播放参数

通过给 autoPlay 传入参数 interval 控制两张图片之间的时间间隔，传入 hoverToPause 控制鼠标放置在图片上时是否停止播放

::demo-block{demo="carousel/zh-cn/AutoPlay" title="播放参数"}
::

### 动画效果与切换速度

通过给 animation 属性控制动画，可选值有 `fade`，`slide`  
通过给 speed 属性控制两张图片之间的切换时间，单位为ms

::demo-block{demo="carousel/zh-cn/Animation" title="动画效果与切换速度"}
::

### 受控的轮播图

::demo-block{demo="carousel/zh-cn/Controlled" title="受控的轮播图"}
::

### API 参考

### Carousel

| 属性                 | 说明                                                                                                                        | 类型                                 | 默认值   |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | -------- |
| `activeIndex`        | 受控属性                                                                                                                    | `number`                             | `—`      |
| `animation`          | 切换动画，可选值：`fade`，`slide`                                                                                           | `CarouselAnimation`                  | `slide`  |
| `arrowProps`         | 箭头参数，用于自定义箭头样式和点击事件                                                                                      | `CarouselArrowProps`                 | `—`      |
| `autoPlay`           | 是否自动循环展示，或者传入 { interval: 自动切换时间间隔(默认: 2000), hoverToPause: 鼠标悬浮时是否暂停自动切换(默认: true) } | `boolean \| CarouselAutoPlayOptions` | `true`   |
| `arrowType`          | 箭头展示时机，可选值有： `hover`、`always`                                                                                  | `CarouselArrowType`                  | `always` |
| `class`              | Vue 根节点 class                                                                                                            | `HTMLAttributes['class']`            | `—`      |
| `className`          | 样式类名                                                                                                                    | `HTMLAttributes['class']`            | `—`      |
| `defaultActiveIndex` | 初始化时默认展示的索引                                                                                                      | `number`                             | `0`      |
| `indicatorPosition`  | 指示器位置，可选值有： `left`、`center`、`right`                                                                            | `CarouselIndicatorPosition`          | `center` |
| `indicatorSize`      | 指示器尺寸，可选值有： `small`、`medium`                                                                                    | `CarouselIndicatorSize`              | `small`  |
| `indicatorType`      | 指示器类型，可选值有： `dot`、`line`、`columnar`                                                                            | `CarouselIndicatorType`              | `dot`    |
| `showArrow`          | 是否展示箭头                                                                                                                | `boolean`                            | `true`   |
| `showIndicator`      | 是否展示指示器                                                                                                              | `boolean`                            | `true`   |
| `slideDirection`     | 动画效果为`slide`时的滑动的方向，可选值有： `left`、`right`                                                                 | `CarouselSlideDirection`             | `left`   |
| `speed`              | 切换速度，单位ms                                                                                                            | `number`                             | `300`    |
| `style`              | 内联样式                                                                                                                    | `StyleValue`                         | `—`      |
| `theme`              | 指示器和箭头主题，可选值有： `primary`、`light`、`dark`                                                                     | `CarouselTheme`                      | `light`  |
| `trigger`            | 指示器触发的时机，可选值有： `hover`、`click`                                                                               | `CarouselTrigger`                    | `click`  |

### CarouselAutoPlayOptions

| 属性           | 说明                  | 类型      | 默认值 |
| -------------- | --------------------- | --------- | ------ |
| `hoverToPause` | 悬停暂停自动播放      | `boolean` | `true` |
| `interval`     | 自动轮播间隔，单位 ms | `number`  | `2000` |

### CarouselArrow

| 属性         | 说明         | 类型                  | 默认值 |
| ------------ | ------------ | --------------------- | ------ |
| `leftArrow`  | 左侧箭头配置 | `CarouselArrowButton` | `—`    |
| `rightArrow` | 右侧箭头配置 | `CarouselArrowButton` | `—`    |

### CarouselArrowButton

| 属性       | 说明                                          | 类型                                       | 默认值 |
| ---------- | --------------------------------------------- | ------------------------------------------ | ------ |
| `children` | 箭头自定义Icon                                | `VNodeChild`                               | `—`    |
| `props`    | 箭头div上的可传参数，包括style, onClick事件等 | `HTMLAttributes & Record<string, unknown>` | `—`    |

默认插槽的直接子节点作为每张轮播内容。通过 #leftArrow/#rightArrow 或包含 Vue 节点的 arrowProps 定制箭头。`@change(index, preIndex)` 通知切换；受控 activeIndex 需要父层更新，没有 activeIndex v-model。实例方法可通过 CarouselMethods 类型的模板 ref 调用。arrowProps 是对象，不是函数。

自动播放相邻切换的实际周期是 `interval + speed`；悬停与离开通过 400 ms 防抖处理。默认 `trigger="click"`。

## Methods

绑定在组件实例上的方法，可以通过 ref 调用实现某些特殊交互

| 方法              | 说明           | 版本   |
| ----------------- | -------------- | ------ |
| play()            | 播放           | 2.10.0 |
| stop()            | 停止播放       | 2.10.0 |
| goTo(targetIndex) | 切换到指定位置 | 2.10.0 |
| prev()            | 切换到上一位置 | 2.10.0 |
| next()            | 切换到下一位置 | 2.10.0 |

## 设计变量

::token-table{component="carousel"}
::

## Accessibility

为轮播内容与自定义箭头提供明确名称。业务中自动播放应提供键盘可操作的暂停控制，仅 hoverToPause 不能覆盖键盘用户。

## 文案规范

轮播标题与说明保持简短，各页使用一致的表达。

## FAQ

**受控轮播为何不切换？** 在 @change 中更新 activeIndex。

**如何暂停？** 设置 autoPlay=false，或通过模板 ref 调用 stop()。

**如何定制箭头？** 使用箭头插槽或包含 Vue 节点的 arrowProps 对象。

## React → Vue

| React                    | Vue                                         |
| ------------------------ | ------------------------------------------- |
| `children`               | `default slot`                              |
| `arrowProps.*.children`  | `Vue VNodeChild / #leftArrow / #rightArrow` |
| `activeIndex + onChange` | `:active-index + @change`                   |
| `React ref`              | `useTemplateRef<CarouselMethods>`           |
