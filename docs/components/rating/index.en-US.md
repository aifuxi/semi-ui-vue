# Rating

Rating matches Semi Design v2.102.0 for full/half values, clearing, disabled state, sizes, custom characters, tooltips, keyboard access, ARIA, RTL, and controlled state.

## Basic usage

```vue
<script setup lang="ts">
import { Rating } from '@aifuxi/semi-ui-vue/rating';
import '@aifuxi/semi-theme-default/rating.css';
import { shallowRef } from 'vue';

const value = shallowRef(3.5);
</script>

<template>
  <Rating
    v-model="value"
    allow-half
    :tooltips="['Terrible', 'Bad', 'Normal', 'Good', 'Wonderful']"
  />
</template>
```

## API

| Prop                   | Type                             | Default     | Description                                              |
| ---------------------- | -------------------------------- | ----------- | -------------------------------------------------------- |
| `modelValue` / `value` | `number`                         | -           | Vue v-model / React-compatible controlled value          |
| `defaultValue`         | `number`                         | `0`         | Uncontrolled initial value                               |
| `count`                | `number`                         | `5`         | Number of rating items                                   |
| `allowHalf`            | `boolean`                        | `false`     | Enables half values                                      |
| `allowClear`           | `boolean`                        | `true`      | Clears when the current value is selected again          |
| `disabled`             | `boolean`                        | `false`     | Disables interaction and focus                           |
| `character`            | `VNodeChild`                     | `IconStar`  | Custom character; the `character` slot is also available |
| `size`                 | `'small' \| 'default' \| number` | `'default'` | Preset or custom size                                    |
| `tooltips`             | `string[]`                       | -           | Hover hint for each item                                 |
| `autoFocus`            | `boolean`                        | `false`     | Focuses the selected item after mount                    |
| `preventScroll`        | `boolean`                        | -           | Prevents scrolling during focus                          |

Events: `change(value)`, `hoverChange(value | undefined)`, `focus(event)`, `blur(event)`, `keyDown(event)`, and `update:modelValue(value)`.

## React → Vue

| React                                          | Vue                                      |
| ---------------------------------------------- | ---------------------------------------- |
| `<Rating value={value} onChange={setValue} />` | `<Rating v-model="value" />`             |
| `character={<IconLikeHeart />}`                | `character` slot or `:character="vnode"` |
| `onHoverChange`                                | `@hover-change`                          |
| `ref.current.focus()`                          | call `focus()` on a template ref         |

Arrow keys move through values. Right/up increases and left/down decreases in LTR; RTL follows the pinned upstream reversal. A zero rating uses the invisible empty radio as its roving-focus target.
