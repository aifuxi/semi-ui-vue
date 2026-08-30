# ColorPicker 颜色选择器

ColorPicker 对齐 Semi Design v2.102.0 的颜色区域、色相/透明度滑条、格式输入、滴管与 Popover 模式。组件公开 Vue 原生 `v-model`、事件和插槽，同时保留固定版本可自然复用的名称与色彩类型。

## 基本用法

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { ColorPicker, colorStringToValue, type ColorValue } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/color-picker.css';

const color = shallowRef<ColorValue>(colorStringToValue('#39c5bb'));
</script>

<template>
  <ColorPicker v-model="color" alpha />
</template>
```

## Popover 与插槽

```vue
<ColorPicker v-model="color" use-popover :popover-props="{ trigger: 'click', position: 'bottom' }">
  <button>选择颜色</button>
  <template #top><strong>品牌色</strong></template>
  <template #bottom><small>{{ color.hex }}</small></template>
</ColorPicker>
```

稳定的自定义 Portal 容器可通过 `popoverProps.getPopupContainer` 提供。容器应在首次打开前存在；关闭、Escape、outside click、capture scroll 与卸载清理由公开 Popover 契约承担。

## 受控值与格式

`ColorValue` 同时包含 `hsva`、`rgba` 与 `hex`，避免格式往返导致信息丢失。`modelValue`/`value` 为受控输入；`defaultValue` 为非受控初值。`defaultFormat` 只决定手动输入区的初始格式：

```ts
const value = ColorPicker.colorStringToValue('rgba(57, 197, 187, 0.5)');
// 也可独立导入 colorStringToValue
```

支持 `#rrggbb[aa]`、`rgb(a)` 与 `hsv(a)` 字符串；非法输入会抛出带 `Semi ColorPicker` 前缀的错误。

## API

| 参数                     | 类型                        | 默认值    | 说明                                                     |
| ------------------------ | --------------------------- | --------- | -------------------------------------------------------- |
| `modelValue` / `value`   | `ColorValue`                | -         | 受控颜色；分别对应 `update:modelValue` / `update:value`  |
| `defaultValue`           | `ColorValue`                | `#39c5bb` | 非受控初值                                               |
| `alpha`                  | `boolean`                   | `true`    | 显示透明度滑条与百分比输入                               |
| `eyeDropper`             | `boolean`                   | `true`    | 显示 EyeDropper 按钮；仅安全上下文和支持的 Chromium 可用 |
| `defaultFormat`          | `'hex' \| 'rgba' \| 'hsva'` | `'hex'`   | 手动输入的初始格式                                       |
| `width` / `height`       | `number`                    | `280`     | 颜色区域尺寸；滑条与数据区共享 width                     |
| `usePopover`             | `boolean`                   | `false`   | 使用 Popover 承载 picker                                 |
| `popoverProps`           | `PopoverProps`              | `{}`      | 透传给 Popover，class 会与固定 picker class 合并         |
| `className` / `class`    | Vue class                   | -         | picker 根 class                                          |
| `style`                  | `StyleValue`                | -         | picker 根样式                                            |
| `topSlot` / `bottomSlot` | `VNodeChild`                | -         | ReactNode 兼容 prop；优先使用同名 Vue slot               |

事件：`change(value)`、`update:modelValue(value)`、`update:value(value)`，顺序与固定 Adapter 的通知链一致。

插槽：默认插槽是 Popover trigger；`top` 与 `bottom` 在 picker 内容前后渲染。

## 可访问性与 SSR

- 颜色区保留 `aria-label="Color"` 与饱和度/明度 `aria-valuetext`。
- 透明度条保留 `aria-label="Alpha"` 与百分比 `aria-valuetext`。
- 包可在 SSR 中安全 import；内联模式可渲染，Popover 模式 SSR 只输出 trigger。
- 固定 v2.102.0 没有 ColorPicker 专属 RTL 数学，RTL 下仍按从左到右计算色相与透明度。

完整源码证据、默认值冲突、DOM/class、Portal、视觉矩阵与 deviation 见 [alignment.md](./alignment.md)，React 迁移见 [react-to-vue.md](./react-to-vue.md)。
