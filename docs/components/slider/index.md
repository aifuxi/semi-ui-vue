# Slider 滑动选择器

Slider 对齐 Semi Design v2.102.0 的单值/范围、刻度、Tooltip、受控状态、鼠标/触摸拖拽、键盘、纵向、RTL、ARIA 与主题样式。

## 安装与基础用法

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { Slider } from '@aifuxi/semi-ui-vue/slider';
import '@aifuxi/semi-theme-default/slider.css';

const value = shallowRef(30);
</script>

<template>
  <Slider v-model="value" aria-label="音量" />
</template>
```

## 范围与刻度

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { Slider } from '@aifuxi/semi-ui-vue/slider';

const range = shallowRef<number[]>([20, 60]);
const marks = { 0: '0', 20: '20°C', 50: '50°C', 100: '100°C' };
</script>

<template>
  <Slider v-model="range" range :step="10" :marks="marks" tooltip-on-mark />
</template>
```

## API

| Prop                                | 类型                                                      | 默认值           | 说明                               |
| ----------------------------------- | --------------------------------------------------------- | ---------------- | ---------------------------------- |
| `modelValue` / `value`              | `number \| number[]`                                      | -                | 受控值；推荐 Vue 使用 `v-model`    |
| `defaultValue`                      | `number \| number[]`                                      | `0`              | 非受控初值                         |
| `min` / `max` / `step`              | `number`                                                  | `0 / 100 / 1`    | 范围与增量                         |
| `range`                             | `boolean`                                                 | `false`          | 双 handle 范围模式                 |
| `disabled`                          | `boolean`                                                 | `false`          | 禁用鼠标、触摸和键盘交互           |
| `marks`                             | `Record<number, string>`                                  | -                | 闭区间内的刻度点与标签             |
| `included`                          | `boolean`                                                 | `true`           | 是否显示已选择 track               |
| `showMarkLabel`                     | `boolean`                                                 | `true`           | 是否显示刻度文本                   |
| `tipFormatter`                      | `(value) => VNodeChild \| null`                           | `value => value` | Tooltip 内容；传 `null` 关闭       |
| `tooltipVisible` / `tooltipOnMark`  | `boolean`                                                 | - / `false`      | handle 常显 Tooltip / mark Tooltip |
| `showArrow`                         | `boolean`                                                 | `true`           | 单值 handle Tooltip 箭头           |
| `showBoundary`                      | `boolean`                                                 | `false`          | hover 时显示最小/最大值            |
| `vertical` / `verticalReverse`      | `boolean`                                                 | `false`          | 纵向与纵向反转                     |
| `handleDot`                         | `SliderHandleDot \| [SliderHandleDot?, SliderHandleDot?]` | -                | handle 内点样式                    |
| `railStyle` / `style` / `className` | Vue 样式/类类型                                           | -                | rail 与根 wrapper 自定义           |
| `getAriaValueText`                  | `(value, index?) => string`                               | -                | 为辅助技术提供可读数值             |

事件：`change`、`afterChange`、`mouseUp`、`update:modelValue`、`update:value`。range 事件值按升序输出。

## React → Vue 迁移

| React v2.102.0                                 | Vue                                          |
| ---------------------------------------------- | -------------------------------------------- |
| `<Slider value={value} onChange={setValue} />` | `<Slider v-model="value" />`                 |
| `<Slider range defaultValue={[20, 60]} />`     | `<Slider range :default-value="[20, 60]" />` |
| `onAfterChange={handler}`                      | `@after-change="handler"`                    |
| `onMouseUp={handler}`                          | `@mouse-up="handler"`                        |
| `getAriaValueText={formatter}`                 | `:get-aria-value-text="formatter"`           |

水平方向在 ConfigProvider `direction="rtl"` 下反转位置、拖拽与方向键；纵向不随 RTL 反转。方向键按 step 变化，PageUp/PageDown 按 10 倍 step，Home/End 移到允许边界。
