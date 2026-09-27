---
title: 'Slider 滑动选择器'
description: '滑动选择器，使用拖动交互快速选择数值或数值范围，与 InputNumber 相比更直观'
type: 'input'
order: 47
icon: 'doc-slider'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/slider` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-input-slider-1" title="如何引入" kind="import" />

### 基本用法

基本滑动条。当 `range` 为 `true` 时，支持两侧滑动。当 `disabled` 为 `true` 时，滑块处于不可用状态。

<DemoBlock id="zh-CN-input-slider-2" title="基本用法" kind="live" />

### 带输入框的

滑动条的滑块和输入框组件保持同步。

<DemoBlock id="zh-CN-input-slider-3" title="带输入框的" kind="live" />

### 自定义提示

使用 `tipFormatter` 可以设置 Tooltip 的显示的格式。设置 `:tip-formatter="null"`，则隐藏 Tooltip。`getAriaValueText`用于给滑块的当前值提供一个用户友好的名称，对屏幕阅读器用户很重要。

<DemoBlock id="zh-CN-input-slider-4" title="自定义提示" kind="live" />

### 带标签的

使用 `marks` 属性标注滑块的刻度，使用 `value` / `defaultValue` 指定滑块位置。

<DemoBlock id="zh-CN-input-slider-5" title="带标签的" kind="live" />

### 分段背景

通过使用 `linear-gradient` 及 `railStyle`，配合 `change` 事件可以实现动态的分段背景效果。

<DemoBlock id="zh-CN-input-slider-6" title="分段背景" kind="live" />

### 受控组件

使用 `v-model` 控制滑块值，也可使用兼容的 `v-model:value`。

<DemoBlock id="zh-CN-input-slider-7" title="受控组件" kind="live" />

### 垂直

<DemoBlock id="zh-CN-input-slider-8" title="垂直" kind="live" />

### 滑块带圆点

<DemoBlock id="zh-CN-input-slider-9" title="滑块带圆点" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/slider/types.ts` 的公开类型为准。

- `v-model` 对应 `modelValue` 与 `update:modelValue`；兼容入口 `value` 可通过 `v-model:value` 绑定。

#### Vue 用法

- `tipFormatter` 与 `getAriaValueText` 是格式化 callback props，不转换为事件。
- `SliderValue` 在普通模式为 number，在 range 模式为 number[]。

#### Vue 事件

**Slider**

| 事件              | 参数                 | 说明                   |
| ----------------- | -------------------- | ---------------------- |
| change            | [value: SliderValue] | 滑块值变化             |
| afterChange       | [value: SliderValue] | 一次拖动或键盘操作结束 |
| mouseUp           | [event: MouseEvent]  | 鼠标松开滑块           |
| update:modelValue | [value: SliderValue] | 更新默认 v-model       |
| update:value      | [value: SliderValue] | 更新兼容 value 绑定    |

| 属性             | 说明                                                                                                             | 类型                                                                    | 默认值              | 版本   |
| ---------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------- | ------ |
| ariaLabel        | `aria-label` 的类型化 Vue 映射                                                                                   | string                                                                  | -                   | -      |
| ariaLabelledby   | `aria-labelledby` 的类型化 Vue 映射                                                                              | string                                                                  | -                   | -      |
| ariaValueText    | `aria-valuetext` 的类型化 Vue 映射                                                                               | string                                                                  | -                   | -      |
| className        | 样式类名                                                                                                         | HTMLAttributes['class']                                                 | —                   |        |
| defaultValue     | 设置初始取值                                                                                                     | SliderValue                                                             | 0                   | -      |
| disabled         | 滑块是否禁用                                                                                                     | boolean                                                                 | false               | -      |
| getAriaValueText | 用于给滑块的当前值提供一个用户友好的名称，对屏幕阅读器用户很重要，参数value为当前滑块的值，index为当前滑块的顺序 | (value: number, index?: number) =&gt; string                            | -                   | -      |
| handleDot        | 滑块是否带有圆点                                                                                                 | SliderHandleDot \| [SliderHandleDot?, SliderHandleDot?]                 | -                   | 2.52.0 |
| included         | `marks` 不为空对象时有效，值为 true 时表示值为包含关系，false 表示并列                                           | boolean                                                                 | true                | -      |
| marks            | 刻度，key 的类型必须为 `number` 且取值在闭区间 [min, max] 内                                                     | SliderMarks                                                             | 无                  | -      |
| max              | 最大值                                                                                                           | number                                                                  | 100                 | -      |
| min              | 最小值                                                                                                           | number                                                                  | 0                   | -      |
| modelValue       | `v-model` 绑定值                                                                                                 | SliderValue \| undefined                                                | —                   |        |
| railStyle        | 滑块轨道的样式                                                                                                   | StyleValue                                                              | -                   | -      |
| range            | 是否支持两边同时可滑动                                                                                           | boolean                                                                 | false               | -      |
| showArrow        | tooltip 是否带箭头                                                                                               | boolean                                                                 | true                | 2.48.0 |
| showBoundary     | 是否在 hover 时展示最大值最小值                                                                                  | boolean                                                                 | false               | -      |
| showMarkLabel    | 是否隐藏标签                                                                                                     | boolean                                                                 | true                | 2.48.0 |
| step             | 步长                                                                                                             | number                                                                  | 1                   | -      |
| style            | —                                                                                                                | StyleValue                                                              | —                   |        |
| tipFormatter     | 设置Tooltip的展示格式，默认显示当前选值                                                                          | ((value: string \| number \| boolean \| null) =&gt; VNodeChild) \| null | `value =&gt; value` | -      |
| tooltipOnMark    | 滑轨上的 mark 是否带有 tooltip                                                                                   | boolean                                                                 | false               |        |
| tooltipVisible   | 是否始终显示Tooltip                                                                                              | boolean \| undefined                                                    | 无                  | -      |
| value            | 兼容受控值                                                                                                       | SliderValue \| undefined                                                | —                   | -      |
| vertical         | 是否设置方向为垂直                                                                                               | boolean                                                                 | false               | -      |
| verticalReverse  | 反转垂直方向，即上大下小                                                                                         | boolean                                                                 | false               | -      |

## RTL/LTR

- Slider 的水平方向支持 RTL，可通过 [ConfigProvider](/zh-CN/other/configprovider) 配置 `direction="rtl"` 启用。
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
- Windows 用户： `Home`；
- Mac 用户： `Fn` + `左箭头`；
- 当用户使用 `range` 属性时，后一个滑块的 `Home`(`Fn` + `左箭头`) 键仅支持到与前一个滑块相遇，重合后再次使用 `Home`(`Fn` + `左箭头`) 键无响应。
- 若想将滑块移动到滑杆的最大值处：
- Windows 用户：`End`；
- Mac 用户：`Fn` + `右箭头`；
- 当用户使用 `range` 属性时，前一个滑块的 `End`(`Fn` + `右箭头`) 键仅支持到与后一个滑块相遇，重合后再次使用 `End`(`Fn` + `右箭头`) 键无响应。

Slider 组件有两个与聚焦相关的设计变量，分别对应不同的交互场景：

| 变量名                      | CSS 变量                            | 触发场景               | 说明                                                           |
| --------------------------- | ----------------------------------- | ---------------------- | -------------------------------------------------------------- |
| 圆形按钮轮廓 - 聚焦         | `--semi-color-primary-light-active` | 键盘导航（Tab 键聚焦） | 使用 `:focus-visible` 伪类，仅在键盘聚焦时显示 outline         |
| 滑动条圆形描边颜色 - 激活态 | `--semi-color-focus-border`         | 鼠标点击/拖动          | 使用 `.semi-slider-handle-clicked` 类，在鼠标交互时显示 border |

如果你希望在主题配置中修改圆形按钮的聚焦样式，请注意上述两个变量对应不同的交互场景。
