---
title: '滑动选择器'
description: '滑动选择器，使用拖动交互快速选择数值或数值范围，与 InputNumber 相比更直观'
locale: 'zh-CN'
slug: 'slider'
category: 'input'
order: 47
englishTitle: 'Slider'
icon: 'doc-slider'
upstream: 'input/slider'
---

## 代码演示

### 如何引入

```ts
import { Slider } from '@aifuxi/semi-ui-vue/slider';
import '@aifuxi/semi-theme-default/slider.css';
```

### 基本用法

基本滑动条。当 `range` 为 `true` 时，支持两侧滑动。当 `disabled` 为 `true` 时，滑块处于不可用状态。
::demo-block{demo="slider/zh-cn/Basic" title="基本用法"}
::

### 带输入框的

滑动条的滑块和输入框组件保持同步。
::demo-block{demo="slider/zh-cn/WithInput" title="带输入框的"}
::

### 自定义提示

使用 `tipFormatter` 可以设置 Tooltip 的显示的格式。设置 `tipFormatter={null}`，则隐藏 Tooltip。`getAriaValueText`用于给滑块的当前值提供一个用户友好的名称，对屏幕阅读器用户很重要。
::demo-block{demo="slider/zh-cn/Tooltip" title="自定义提示"}
::

### 带标签的

使用 `marks` 属性标注滑块的刻度，使用 `value` / `defaultValue` 指定滑块位置。
::demo-block{demo="slider/zh-cn/Marks" title="带标签的"}
::

### 分段背景

通过使用 `linear-gradient` 及 `railStyle` ，配合 @change 可以实现动态的分段背景效果。
::demo-block{demo="slider/zh-cn/Gradient" title="分段背景"}
::

### 受控组件

滑块位置即 `Slider` 的值由 value 控制，配合 @change 使用。
::demo-block{demo="slider/zh-cn/Controlled" title="受控组件"}
::

### 垂直

::demo-block{demo="slider/zh-cn/Vertical" title="垂直"}
::

### 滑块带圆点

::demo-block{demo="slider/zh-cn/HandleDot" title="滑块带圆点"}
::

## API 参考

### Slider

| 属性               | 类型                                                                   | 默认值  | 说明                                                                                                             |
| ------------------ | ---------------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------- |
| `ariaLabel`        | `string`                                                               | `—`     | 可访问名称；模板写为 aria-label。                                                                                |
| `ariaLabelledby`   | `string`                                                               | `—`     | 关联标签节点 id；模板写为 aria-labelledby。                                                                      |
| `ariaValueText`    | `string`                                                               | `—`     | 当前数值的可读描述，模板写为 aria-value-text。                                                                   |
| `className`        | `HTMLAttributes['class']`                                              | `—`     | 兼容类名；Vue 模板优先使用 class。                                                                               |
| `defaultValue`     | `SliderValue`                                                          | `—`     | 设置初始取值                                                                                                     |
| `disabled`         | `boolean`                                                              | `false` | 滑块是否禁用                                                                                                     |
| `getAriaValueText` | `(value: number, index?: number) => string`                            | `—`     | 用于给滑块的当前值提供一个用户友好的名称，对屏幕阅读器用户很重要，参数value为当前滑块的值，index为当前滑块的顺序 |
| `handleDot`        | `SliderHandleDot \| [SliderHandleDot?, SliderHandleDot?]`              | `—`     | 滑块是否带有圆点                                                                                                 |
| `included`         | `boolean`                                                              | `true`  | `marks` 不为空对象时有效，值为 true 时表示值为包含关系，false 表示并列                                           |
| `marks`            | `SliderMarks`                                                          | `—`     | 刻度，key 的类型必须为 `number` 且取值在闭区间 \[min, max] 内                                                    |
| `max`              | `number`                                                               | `100`   | 最大值                                                                                                           |
| `min`              | `number`                                                               | `0`     | 最小值                                                                                                           |
| `modelValue`       | `SliderValue \| undefined`                                             | `—`     | v-model 的受控值。                                                                                               |
| `railStyle`        | `StyleValue`                                                           | `—`     | 滑块轨道的样式                                                                                                   |
| `range`            | `boolean`                                                              | `false` | 是否支持两边同时可滑动                                                                                           |
| `showArrow`        | `boolean`                                                              | `true`  | tooltip 是否带箭头                                                                                               |
| `showBoundary`     | `boolean`                                                              | `false` | 是否在 hover 时展示最大值最小值                                                                                  |
| `showMarkLabel`    | `boolean`                                                              | `true`  | 是否隐藏标签                                                                                                     |
| `step`             | `number`                                                               | `1`     | 步长                                                                                                             |
| `style`            | `StyleValue`                                                           | `—`     | Vue 内联样式。                                                                                                   |
| `tipFormatter`     | `((value: string \| number \| boolean \| null) => VNodeChild) \| null` | `—`     | 设置Tooltip的展示格式，默认显示当前选值                                                                          |
| `tooltipOnMark`    | `boolean`                                                              | `false` | 滑轨上的 mark 是否带有 tooltip                                                                                   |
| `tooltipVisible`   | `boolean \| undefined`                                                 | `—`     | 是否始终显示Tooltip                                                                                              |
| `value`            | `SliderValue \| undefined`                                             | `—`     | 设置当前取值                                                                                                     |
| `vertical`         | `boolean`                                                              | `false` | 是否设置方向为垂直                                                                                               |
| `verticalReverse`  | `boolean`                                                              | `false` | 反转垂直方向，即上大下小                                                                                         |

### SliderHandleDot

| 属性    | 类型     | 默认值 | 说明               |
| ------- | -------- | ------ | ------------------ |
| `color` | `string` | `—`    | 滑块内部圆点颜色。 |
| `size`  | `string` | `—`    | 圆点尺寸，如 4px。 |

### 事件

#### Slider

| 事件                | 参数                 |
| ------------------- | -------------------- |
| `afterChange`       | `value: SliderValue` |
| `change`            | `value: SliderValue` |
| `mouseUp`           | `event: MouseEvent`  |
| `update:modelValue` | `value: SliderValue` |
| `update:value`      | `value: SliderValue` |

### 插槽与类型

`SliderValue = number | number[]`；`SliderMarks = Record<number, string>`；`handleDot` 可以是单个对象或左右两个圆点对象组成的数组；`tipFormatter` 返回 VNodeChild，传 null 隐藏提示。

Vue 模板中 camelCase 事件使用 kebab-case：如 `@enter-press`、`@number-change`、`@after-change`、`@input-change`。`keydown`、`keypress`、`keyup` 保持小写。`class` 与 `style` 使用 Vue 原生属性。

## RTL/LTR

- Slider 的水平方向支持 RTL，可通过 [ConfigProvider](/zh-cn/components/config-provider/) 配置 `direction="rtl"` 启用。
- RTL 模式下，Slider 水平方向的最小值在右侧，最大值在左侧，滑块拖动方向与 LTR 相反。
- 垂直方向（`vertical`）不受 RTL 影响。
- RTL 模式下，键盘方向键的行为会镜像：`左箭头`/`下箭头` 增加值，`右箭头`/`上箭头` 减少值。

## Accessibility

### ARIA

- Slider 可聚焦的控制元素 role 为 `slider`。
- 元素的 `aria-valuenow` 属性为当前值的十进制数值。
- 元素的 `aria-valuemin` 属性为最小允许值的十进制数值。
- 元素的 `aria-valuemax` 属性为最大允许值的十进制数值。
- 当 Slider 为纵向时，元素的 `aria-orientation` 属性为 'vertical'。
- 当 `aria-valuenow` 的值不容易被理解时，支持通过 API `aria-valuetext` 传递一个字符串使其更友好。也可以通过 API `getAriaValueText(value, index)` 方法得到 `aria-valuetext` 的值。
- 支持通过 API `aria-label` 或者 `aria-labelledby` 确定 slider 的标签。

### 键盘和焦点

- Slider 的滑块可被获取到焦点，并展示当前滑块的提示信息，且这些信息需要被辅助技术读取到。
- 当用户使用 `range` 属性时，可以使用 `Tab` 及 `Shift` + `Tab` 切换左右两个滑块的焦点。
- 键盘用户可以通过 `上箭头` 或 `右箭头` 来增加滑块值，`下箭头` 或 `左箭头` 来减少滑块值。
- 若想要滑块高于步长的变化量时， slider支持 10*step 的变化量：
  - Windows 用户： `Page Up` 用于增加，`Page Down` 用于减少；
  - Mac 用户使用： `Fn` + `上箭头` 用于增加，`Fn` + `下箭头` 用于按键；
  - 当用户使用 `range` 属性时，前一个滑块的 `Page Up`(`Fn` + `上箭头`) 键仅支持到与后一个滑块相遇，重合后再对前一个滑块使用 Page Up 键则无响应。后一个滑块同理，相遇后，对`Page Down`(`Fn` + `下箭头`) 键无响应。
- 若想将滑块移动到滑杆的最小值处：
  - Windows 用户： `Home` ；
  - Mac 用户： `Fn` + `左箭头`；
  - 当用户使用 `range` 属性时，后一个滑块的 `Home`(`Fn` + `左箭头`) 键仅支持到与前一个滑块相遇，重合后再次使用 `Home`(`Fn` + `左箭头`) 键无响应。
- 若想将滑块移动到滑杆的最大值处：
  - Windows 用户：`End` ；
  - Mac 用户：`Fn` + `右箭头`；
  - 当用户使用 `range` 属性时，前一个滑块的 `End`(`Fn` + `右箭头`) 键仅支持到与后一个滑块相遇，重合后再次使用 `End`(`Fn` + `右箭头`) 键无响应。

## 设计变量

### 聚焦样式说明

Slider 组件有两个与聚焦相关的设计变量，分别对应不同的交互场景：

| 变量名                      | CSS 变量                            | 触发场景               | 说明                                                           |
| --------------------------- | ----------------------------------- | ---------------------- | -------------------------------------------------------------- |
| 圆形按钮轮廓 - 聚焦         | `--semi-color-primary-light-active` | 键盘导航（Tab 键聚焦） | 使用 `:focus-visible` 伪类，仅在键盘聚焦时显示 outline         |
| 滑动条圆形描边颜色 - 激活态 | `--semi-color-focus-border`         | 鼠标点击/拖动          | 使用 `.semi-slider-handle-clicked` 类，在鼠标交互时显示 border |

如果你希望在主题配置中修改圆形按钮的聚焦样式，请注意上述两个变量对应不同的交互场景。

::token-table{component="slider"}
::

## React → Vue 迁移

| React                           | Vue                                                                    |
| ------------------------------- | ---------------------------------------------------------------------- |
| `@douyinfe/semi-ui`             | `@aifuxi/semi-ui-vue/slider` + `@aifuxi/semi-theme-default/slider.css` |
| `value` + `onChange`            | `v-model` / `v-model:value` / `:value` + `@change`                     |
| `defaultValue`                  | `default-value`                                                        |
| `useState` / `useMemo`          | `shallowRef` / `computed`                                              |
| `className` / `style={{ ... }}` | `class` / `:style="{ ... }"`                                           |

## FAQ

### 为什么受控示例拖动后会回到原位？

该演示有意只由按钮更新 value，拖动产生的 change 没有写回。需要拖动更新值时使用 v-model 或在 @change 写回。同时显式传入 modelValue 与 value 时优先 modelValue，建议只使用一个受控入口。

### 如何隐藏提示？

传入 :tip-formatter="null"。需要读屏友好值时通过 getAriaValueText 提供描述，不依赖 Tooltip 文案。
