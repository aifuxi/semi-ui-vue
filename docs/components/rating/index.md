# Rating 评分

Rating 对齐 Semi Design v2.102.0 的整星/半星评分、清空、禁用、尺寸、字符、Tooltip、键盘、ARIA、RTL 与受控状态。

## 基本用法

```vue
<script setup lang="ts">
import { Rating } from '@workspace/ui/rating';
import '@workspace/theme-default/rating.css';
import { shallowRef } from 'vue';

const value = shallowRef(3.5);
</script>

<template>
  <Rating v-model="value" allow-half :tooltips="['很差', '较差', '一般', '满意', '很好']" />
</template>
```

## API

| 属性                   | 类型                             | 默认值      | 说明                              |
| ---------------------- | -------------------------------- | ----------- | --------------------------------- |
| `modelValue` / `value` | `number`                         | -           | Vue v-model / React 兼容受控值    |
| `defaultValue`         | `number`                         | `0`         | 非受控初值                        |
| `count`                | `number`                         | `5`         | 评分项数量                        |
| `allowHalf`            | `boolean`                        | `false`     | 允许半星                          |
| `allowClear`           | `boolean`                        | `true`      | 再次选择当前值时清空              |
| `disabled`             | `boolean`                        | `false`     | 禁止交互与聚焦                    |
| `character`            | `VNodeChild`                     | `IconStar`  | 自定义字符，也可使用 `#character` |
| `size`                 | `'small' \| 'default' \| number` | `'default'` | 预设或自定义尺寸                  |
| `tooltips`             | `string[]`                       | -           | 每项悬停提示                      |
| `autoFocus`            | `boolean`                        | `false`     | 挂载后聚焦当前项                  |
| `preventScroll`        | `boolean`                        | -           | focus 时是否阻止滚动              |

事件：`change(value)`、`hoverChange(value | undefined)`、`focus(event)`、`blur(event)`、`keyDown(event)`、`update:modelValue(value)`。

## React → Vue

| React                                          | Vue                                       |
| ---------------------------------------------- | ----------------------------------------- |
| `<Rating value={value} onChange={setValue} />` | `<Rating v-model="value" />`              |
| `character={<IconLikeHeart />}`                | `#character` slot 或 `:character="vnode"` |
| `onHoverChange`                                | `@hover-change`                           |
| `ref.current.focus()`                          | 模板 ref 的 `focus()`                     |

键盘使用方向键移动；LTR 下右/上增加、左/下减少，RTL 按固定上游逻辑反转。当前值为 0 时，roving focus 落在不可见的空值 radio 上。
