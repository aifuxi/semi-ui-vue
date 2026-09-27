---
title: 'Carousel 轮播图'
description: '轮播图是一种媒体组件，可以在可视化应用中展示多张图片轮流播放的效果。'
type: 'show'
order: 66
icon: 'doc-carousel'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/carousel` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-show-carousel-1" title="如何引入" kind="import" />

### 基本用法

基本用法

<DemoBlock id="zh-CN-show-carousel-2" title="基本用法" kind="live" />

### 主题切换

默认定义了三种主题： `primary`、`light`、`dark`

<DemoBlock id="zh-CN-show-carousel-3" title="主题切换" kind="live" />

### 指示器

指示器可以调节类型、位置、尺寸
类型： `dot`、`line`、`columnar`
位置： `left`、`center`、`right`
尺寸： `small`、`medium`

<DemoBlock id="zh-CN-show-carousel-4" title="指示器" kind="live" />

### 箭头

通过 showArrow 属性控制箭头是否可见
如果箭头可见，通过 arrowType 属性控制箭头展示的时机

<DemoBlock id="zh-CN-show-carousel-5" title="箭头" kind="live" />

### 定制箭头

通过 `arrowProps` 定制箭头属性，也可使用 `#leftArrow` 与 `#rightArrow` 插槽定制内容。

<DemoBlock id="zh-CN-show-carousel-6" title="定制箭头" kind="live" />

### 播放参数

通过给 autoPlay 传入参数 interval 控制两张图片之间的时间间隔，传入 hoverToPause 控制鼠标放置在图片上时是否停止播放

<DemoBlock id="zh-CN-show-carousel-7" title="播放参数" kind="live" />

### 动画效果与切换速度

通过给 animation 属性控制动画，可选值有 `fade`，`slide`
通过给 speed 属性控制两张图片之间的切换时间，单位为ms

<DemoBlock id="zh-CN-show-carousel-8" title="动画效果与切换速度" kind="live" />

### 受控的轮播图

<DemoBlock id="zh-CN-show-carousel-9" title="受控的轮播图" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/carousel/types.ts` 的公开类型为准。

#### Vue 用法

- `activeIndex` 是单向受控 prop；索引变化通过 `change` 事件通知。
- `arrowProps.leftArrow/rightArrow.children` 是公开兼容配置，不是组件 children；具名插槽优先。
- 默认插槽中的每个根 VNode 作为一个轮播项。

#### Vue 实例方法

**CarouselMethods**

| 方法   | 签名                             | 说明           |
| ------ | -------------------------------- | -------------- |
| `play` | () =&gt; void                    | 开始自动播放   |
| `stop` | () =&gt; void                    | 停止自动播放   |
| `goTo` | (targetIndex: number) =&gt; void | 切换到指定索引 |
| `prev` | () =&gt; void                    | 切换到上一项   |
| `next` | () =&gt; void                    | 切换到下一项   |

#### Vue 事件

**Carousel**

| 事件   | 参数                                    | 说明         |
| ------ | --------------------------------------- | ------------ |
| change | [activeIndex: number, preIndex: number] | 轮播索引变化 |

#### Vue 插槽

**Carousel**

| 插槽       | 作用域参数 | 说明           |
| ---------- | ---------- | -------------- |
| default    | {}         | 轮播项列表     |
| leftArrow  | {}         | 上一项箭头内容 |
| rightArrow | {}         | 下一项箭头内容 |

### Carousel

| 属性               | 说明                                                                                                                        | 类型                               | 默认值   | 版本   |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | -------- | ------ |
| activeIndex        | 受控索引                                                                                                                    | number \| undefined                | -        | 2.10.0 |
| animation          | 切换动画，可选值：`fade`，`slide`                                                                                           | CarouselAnimation                  | `slide`  | 2.10.0 |
| arrowProps         | 左右箭头的嵌套配置；具名插槽优先                                                                                            | CarouselArrowProps \| undefined    | -        | 2.10.0 |
| autoPlay           | 是否自动循环展示，或者传入 { interval: 自动切换时间间隔(默认: 2000), hoverToPause: 鼠标悬浮时是否暂停自动切换(默认: true) } | boolean \| CarouselAutoPlayOptions | true     | 2.10.0 |
| arrowType          | 箭头展示时机，可选值有： `hover`、`always`                                                                                  | CarouselArrowType                  | `always` | 2.10.0 |
| class              | Vue 原生类名                                                                                                                | HTMLAttributes['class']            | —        |        |
| className          | 样式类名                                                                                                                    | HTMLAttributes['class']            | -        | 2.10.0 |
| defaultActiveIndex | 初始化时默认展示的索引                                                                                                      | number                             | 0        | 2.10.0 |
| indicatorPosition  | 指示器位置，可选值有： `left`、`center`、`right`                                                                            | CarouselIndicatorPosition          | `center` | 2.10.0 |
| indicatorSize      | 指示器尺寸，可选值有： `small`、`medium`                                                                                    | CarouselIndicatorSize              | `small`  | 2.10.0 |
| indicatorType      | 指示器类型，可选值有： `dot`、`line`、`columnar`                                                                            | CarouselIndicatorType              | `dot`    | 2.10.0 |
| showArrow          | 是否展示箭头                                                                                                                | boolean                            | true     | 2.10.0 |
| showIndicator      | 是否展示指示器                                                                                                              | boolean                            | true     | 2.10.0 |
| slideDirection     | 动画效果为`slide`时的滑动的方向，可选值有： `left`、`right`                                                                 | CarouselSlideDirection             | `left`   | 2.10.0 |
| speed              | 切换速度，单位ms                                                                                                            | number                             | 300      | 2.10.0 |
| style              | 内联样式                                                                                                                    | StyleValue                         | -        | 2.10.0 |
| theme              | 指示器和箭头主题，可选值有： `primary`、`light`、`dark`                                                                     | CarouselTheme                      | `light`  | 2.10.0 |
| trigger            | 指示器触发的时机，可选值有： `hover`、`click`                                                                               | CarouselTrigger                    | `click`  | 2.10.0 |

### ArrowButton

| 属性     | 说明                                             | 类型                                           | 默认值 | 版本   |
| -------- | ------------------------------------------------ | ---------------------------------------------- | ------ | ------ |
| children | 箭头 VNode 内容；leftArrow / rightArrow 插槽优先 | VNodeChild                                     | -      | 2.10.0 |
| props    | 箭头 div 的 Vue HTMLAttributes 与扩展属性        | HTMLAttributes & Record&lt;string, unknown&gt; | -      | 2.10.0 |

## 实例方法

通过模板 ref 调用以下实例方法。

| 方法              | 说明           | 版本   |
| ----------------- | -------------- | ------ |
| play()            | 播放           | 2.10.0 |
| stop()            | 停止播放       | 2.10.0 |
| goTo(targetIndex) | 切换到指定位置 | 2.10.0 |
| prev()            | 切换到上一位置 | 2.10.0 |
| next()            | 切换到下一位置 | 2.10.0 |
