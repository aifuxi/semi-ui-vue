---
title: 'Carousel'
description: 'Carousel is a media component that can display the effect of playing multiple pictures in turn in a visualization application.'
locale: 'en-US'
slug: 'carousel'
category: 'show'
order: 66
englishTitle: 'Carousel'
icon: 'doc-carousel'
upstream: 'show/carousel'
---

## Demos

### How to import

```vue
<script setup lang="ts">
import { Carousel } from '@aifuxi/semi-ui-vue/carousel';
import '@aifuxi/semi-theme-default/carousel.css';
</script>
```

### Basic Carousel

Basic carousel

::demo-block{demo="carousel/en-us/Basic" title="Basic Carousel"}
::

### Theme Switch

Three themes are defined by default: `primary`、`light`、`dark`

::demo-block{demo="carousel/en-us/Theme" title="Theme Switch"}
::

### Indicators

Indicators can be adjusted for type, position, size  
type: `dot`、`line`、`columnar`  
position: `left`、`center`、`right`  
size: `small`、`medium`

::demo-block{demo="carousel/en-us/Indicators" title="Indicators"}
::

### Arrows

Control whether the arrow is visible through the showArrow property  
If the arrow is visible, use the arrowType property to control the timing of the arrow display

::demo-block{demo="carousel/en-us/Arrows" title="Arrows"}
::

### Custom Arrow

Customize arrow styles and click events through the arrowProps property

::demo-block{demo="carousel/en-us/CustomArrows" title="Custom Arrow"}
::

### Play Parameters

Pass the parameter interval to autoPlay to control the time interval between two pictures, and pass hoverToPause to control whether to stop playing when the mouse is placed on the picture

::demo-block{demo="carousel/en-us/AutoPlay" title="Play Parameters"}
::

### Animation and Speed

Control the animation by giving the animation property, optional values are `fade`, `slide`  
Control the switching time between two pictures by giving the speed attribute, the unit is ms

::demo-block{demo="carousel/en-us/Animation" title="Animation and Speed"}
::

### Controlled Carousel

::demo-block{demo="carousel/en-us/Controlled" title="Controlled Carousel"}
::

### API Reference

### Carousel

| Property             | Description                                                                                                                                                                                                 | Type                                 | Default  |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | -------- |
| `activeIndex`        | Controlled property                                                                                                                                                                                         | `number`                             | `—`      |
| `animation`          | Animation, optional:`fade`, `slide`                                                                                                                                                                         | `CarouselAnimation`                  | `slide`  |
| `arrowProps`         | Arrow parameters for custom arrow styles and click events                                                                                                                                                   | `CarouselArrowProps`                 | `—`      |
| `autoPlay`           | Whether to automatically display in a loop, or pass in { interval: Auto switch time interval(default: 2000), hoverToPause: Whether to pause automatic switching when the mouse is hovering(default: true) } | `boolean \| CarouselAutoPlayOptions` | `true`   |
| `arrowType`          | Arrow display timing, optional values are: `hover`、`always`                                                                                                                                                | `CarouselArrowType`                  | `always` |
| `class`              | Vue root class                                                                                                                                                                                              | `HTMLAttributes['class']`            | `—`      |
| `className`          | The className of Carousel container                                                                                                                                                                         | `HTMLAttributes['class']`            | `—`      |
| `defaultActiveIndex` | The index displayed by default when initializing                                                                                                                                                            | `number`                             | `0`      |
| `indicatorPosition`  | Indicator position, optional values are: `left`、`center`、`right`                                                                                                                                          | `CarouselIndicatorPosition`          | `center` |
| `indicatorSize`      | Indicator size, optional values are: `small`、`medium`                                                                                                                                                      | `CarouselIndicatorSize`              | `small`  |
| `indicatorType`      | Indicator type, optional values are: `dot`、`line`、`columnar`                                                                                                                                              | `CarouselIndicatorType`              | `dot`    |
| `showArrow`          | Whether to show arrows                                                                                                                                                                                      | `boolean`                            | `true`   |
| `showIndicator`      | Whether to show the indicator                                                                                                                                                                               | `boolean`                            | `true`   |
| `slideDirection`     | The direction of the slide when the animation effect is `slide`, optional: `left`、 `right`                                                                                                                 | `CarouselSlideDirection`             | `left`   |
| `speed`              | Switching speed                                                                                                                                                                                             | `number`                             | `300`    |
| `style`              | Carousel style                                                                                                                                                                                              | `StyleValue`                         | `—`      |
| `theme`              | Indicator and arrow theme, optional values are: `primary`、`light`、`dark`                                                                                                                                  | `CarouselTheme`                      | `light`  |
| `trigger`            | When the indicator is triggered, the optional values are: `hover`、`click`                                                                                                                                  | `CarouselTrigger`                    | `click`  |

### CarouselAutoPlayOptions

| Property       | Description             | Type      | Default |
| -------------- | ----------------------- | --------- | ------- |
| `hoverToPause` | Pause autoplay on hover | `boolean` | `true`  |
| `interval`     | Autoplay interval in ms | `number`  | `2000`  |

### CarouselArrow

| Property     | Description               | Type                  | Default |
| ------------ | ------------------------- | --------------------- | ------- |
| `leftArrow`  | Left arrow configuration  | `CarouselArrowButton` | `—`     |
| `rightArrow` | Right arrow configuration | `CarouselArrowButton` | `—`     |

### CarouselArrowButton

| Property   | Description                                                       | Type                                       | Default |
| ---------- | ----------------------------------------------------------------- | ------------------------------------------ | ------- |
| `children` | Arrow custom icon                                                 | `VNodeChild`                               | `—`     |
| `props`    | Parameters on the arrow div, including style, onClick events, etc | `HTMLAttributes & Record<string, unknown>` | `—`     |

Use direct default-slot children as slides. Customize arrows using `#leftArrow` / `#rightArrow` or arrowProps containing Vue nodes. `@change(index, preIndex)` reports selection changes. Controlled activeIndex requires updating the parent state; there is no activeIndex v-model. Exposed methods use the exported CarouselMethods type with a template ref. arrowProps is an object, not a function.

## Methods

Some internal methods provided by Carousel can be accessed through ref:

| Method            | Instructions         | Version |
| ----------------- | -------------------- | ------- |
| play()            | Play                 | 2.10.0  |
| stop()            | Stop                 | 2.10.0  |
| goTo(targetIndex) | Go to target index   | 2.10.0  |
| prev()            | Go to previous index | 2.10.0  |
| next()            | Go to next index     | 2.10.0  |

## Design Tokens

::token-table{component="carousel"}
::

## Accessibility

Provide descriptive slide content and meaningful names for custom arrows. Automatic animation should offer an accessible pause control in applications; hoverToPause alone does not cover keyboard users.

## Content Guidelines

Keep slide headings and supporting text short. Use consistent labels across slides.

## FAQ

**Why does a controlled slide not change?** Update activeIndex in @change.

**How do I pause autoplay?** Set autoPlay=false or call stop() on the template ref.

**How do I customize arrows?** Use the arrow slots or arrowProps objects containing Vue nodes.

## React → Vue

| React                    | Vue                                         |
| ------------------------ | ------------------------------------------- |
| `children`               | `default slot`                              |
| `arrowProps.*.children`  | `Vue VNodeChild / #leftArrow / #rightArrow` |
| `activeIndex + onChange` | `:active-index + @change`                   |
| `React ref`              | `useTemplateRef<CarouselMethods>`           |
