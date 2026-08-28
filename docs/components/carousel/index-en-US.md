# Carousel

Carousel cycles through equally sized content panels. This Vue slice is aligned with the pinned local Semi Design v2.102.0 source, including `.semi-carousel*` DOM, themes, slide/fade motion, RTL, and public methods.

## Basic usage

```vue
<script setup lang="ts">
import { Carousel } from '@workspace/ui';
import '@workspace/theme-default/carousel.css';
</script>

<template>
  <Carousel :auto-play="false" theme="dark" :style="{ width: '600px', height: '240px' }">
    <div class="slide">Design</div>
    <div class="slide">Build</div>
    <div class="slide">Ship</div>
  </Carousel>
</template>
```

## Controlled state and methods

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
    <div>First</div>
    <div>Second</div>
  </Carousel>
  <button @click="carousel?.prev()">Previous</button>
  <button @click="carousel?.next()">Next</button>
</template>
```

## Props

| Prop                 | Type                                                       | Default    | Description                                        |
| -------------------- | ---------------------------------------------------------- | ---------- | -------------------------------------------------- |
| `activeIndex`        | `number`                                                   | -          | Controlled index                                   |
| `defaultActiveIndex` | `number`                                                   | `0`        | Initial uncontrolled index                         |
| `animation`          | `'slide' \| 'fade'`                                        | `'slide'`  | Transition animation                               |
| `autoPlay`           | `boolean \| { interval?: number; hoverToPause?: boolean }` | `true`     | Autoplay options; the cycle is interval plus speed |
| `arrowType`          | `'always' \| 'hover'`                                      | `'always'` | Arrow visibility timing                            |
| `arrowProps`         | `CarouselArrowProps`                                       | -          | Custom arrow content, attributes, and listeners    |
| `indicatorPosition`  | `'left' \| 'center' \| 'right'`                            | `'center'` | Indicator position                                 |
| `indicatorSize`      | `'small' \| 'medium'`                                      | `'small'`  | Indicator size                                     |
| `indicatorType`      | `'dot' \| 'line' \| 'columnar'`                            | `'dot'`    | Indicator type                                     |
| `theme`              | `'primary' \| 'light' \| 'dark'`                           | `'light'`  | Arrow and indicator theme                          |
| `showArrow`          | `boolean`                                                  | `true`     | Shows arrows                                       |
| `showIndicator`      | `boolean`                                                  | `true`     | Shows indicators                                   |
| `slideDirection`     | `'left' \| 'right'`                                        | `'left'`   | Slide direction                                    |
| `speed`              | `number`                                                   | `300`      | Animation duration in milliseconds                 |
| `trigger`            | `'click' \| 'hover'`                                       | `'click'`  | Indicator interaction                              |

The root also accepts Vue `class`, `style`, `aria-*`, `data-*`, and native listeners.

## Events, slots, and methods

- `change(activeIndex, preIndex)` fires on a requested change. Controlled mode waits for the parent to update `activeIndex`.
- The default slot accepts element VNodes and preserves their class, style, attributes, and listeners.
- `#leftArrow` and `#rightArrow` are Vue-native arrow slots and take precedence over `arrowProps.*.children`.
- `play()`, `stop()`, `goTo(index)`, `prev()`, and `next()` are exposed through the component ref.

## Accessibility and SSR

The pinned v2.102.0 adapter does not add a complete role/tabindex/keyboard state machine to the root, indicators, or arrow containers. This slice preserves that DOM baseline and the default arrow icons' English `aria-label`s. Imports and server rendering are SSR-safe; timers start only after client mount and are cleaned up on unmount.
