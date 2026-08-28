# Carousel 轮播图

Carousel 用于循环展示一组同尺寸内容。本实现以本地只读 Semi Design v2.102.0 为唯一基线，保留 `.semi-carousel*` DOM、主题、滑动/淡入动效、RTL 和实例方法。

## 基本用法

```vue
<script setup lang="ts">
import { Carousel } from '@workspace/ui';
import '@workspace/theme-default/carousel.css';
</script>

<template>
  <Carousel :auto-play="false" theme="dark" :style="{ width: '600px', height: '240px' }">
    <div class="slide">设计</div>
    <div class="slide">开发</div>
    <div class="slide">交付</div>
  </Carousel>
</template>
```

## 受控与实例方法

```vue
<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue';
import { Carousel, type CarouselMethods } from '@workspace/ui';

const activeIndex = shallowRef(0);
const carousel = useTemplateRef<CarouselMethods>('carousel');
</script>

<template>
  <Carousel
    ref="carousel"
    :active-index="activeIndex"
    :auto-play="false"
    @change="activeIndex = $event"
  >
    <div>第一页</div>
    <div>第二页</div>
  </Carousel>
  <button @click="carousel?.prev()">上一页</button>
  <button @click="carousel?.next()">下一页</button>
</template>
```

## Props

| 属性                 | 类型                                                       | 默认值     | 说明                                       |
| -------------------- | ---------------------------------------------------------- | ---------- | ------------------------------------------ |
| `activeIndex`        | `number`                                                   | -          | 受控索引                                   |
| `defaultActiveIndex` | `number`                                                   | `0`        | 非受控初始索引                             |
| `animation`          | `'slide' \| 'fade'`                                        | `'slide'`  | 切换动效                                   |
| `autoPlay`           | `boolean \| { interval?: number; hoverToPause?: boolean }` | `true`     | 自动播放参数；轮换周期为 interval 加 speed |
| `arrowType`          | `'always' \| 'hover'`                                      | `'always'` | 箭头展示时机                               |
| `arrowProps`         | `CarouselArrowProps`                                       | -          | 自定义箭头内容、属性与事件                 |
| `indicatorPosition`  | `'left' \| 'center' \| 'right'`                            | `'center'` | 指示器位置                                 |
| `indicatorSize`      | `'small' \| 'medium'`                                      | `'small'`  | 指示器尺寸                                 |
| `indicatorType`      | `'dot' \| 'line' \| 'columnar'`                            | `'dot'`    | 指示器类型                                 |
| `theme`              | `'primary' \| 'light' \| 'dark'`                           | `'light'`  | 箭头与指示器主题                           |
| `showArrow`          | `boolean`                                                  | `true`     | 是否显示箭头                               |
| `showIndicator`      | `boolean`                                                  | `true`     | 是否显示指示器                             |
| `slideDirection`     | `'left' \| 'right'`                                        | `'left'`   | slide 动画方向                             |
| `speed`              | `number`                                                   | `300`      | 动画时长，单位 ms                          |
| `trigger`            | `'click' \| 'hover'`                                       | `'click'`  | 指示器切换触发方式                         |

根节点同时接受 Vue `class`、`style`、`aria-*`、`data-*` 与原生事件。

## Events、Slots 与 Methods

- `change(activeIndex, preIndex)`：切换时触发；受控模式只通知，父级更新 `activeIndex` 后才改变可见项。
- 默认 slot：只把真实元素 VNode 作为轮播项；原 class/style/attrs/listener 会保留。
- `#leftArrow`、`#rightArrow`：Vue 原生自定义箭头，优先于 `arrowProps.*.children`。
- `play()`、`stop()`、`goTo(index)`、`prev()`、`next()`：通过组件 ref 调用。

## 可访问性与 SSR

固定 v2.102.0 没有为轮播根、指示器和箭头添加完整 role/tabindex/键盘状态机；本实现不擅自改变该 DOM 基线，并保留默认箭头 Icon 的英文 `aria-label`。组件支持 SSR-safe import/render，定时器仅在客户端挂载后创建并在卸载时清理。
