---
title: 'Progress 进度条'
description: '用于展示用户操作的当前进度和状态，一般在操作耗时较长时使用。也可用来表示任务/对象的完成度'
type: 'feedback'
order: 91
icon: 'doc-progress'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/progress` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-feedback-progress-1" title="如何引入" kind="import" />

### 标准的进度条

通过`stroke`属性来控制进度条的填充色
通过`percent`属性控制已完成的进度
通过`size`属性控制进度条尺寸
通过`aria-label`说明进度条具体代表含义
如果`size`预设的尺寸不满足，可以通过`style`传入 height 自定义进度条高度

<DemoBlock id="zh-CN-feedback-progress-2" title="标准的进度条" kind="live" />

### 展示百分比文本

通过`showInfo`控制是否展示百分比数字，可以通过`format`格式化展示文本

<DemoBlock id="zh-CN-feedback-progress-3" title="展示百分比文本" kind="live" />

### 垂直的进度条

设置`direction='vertical'`，展示垂直进度条，可以通过`style`传入 width 控制进度条宽度

<DemoBlock id="zh-CN-feedback-progress-4" title="垂直的进度条" kind="live" />

### 环形进度条

将 type 设为`circle`，进度条将会展示成环状。进度条默认尺寸为 72 x 72

<DemoBlock id="zh-CN-feedback-progress-5" title="环形进度条" kind="live" />

你可以通过修改`width`来控制环形进度条的大小

<DemoBlock id="zh-CN-feedback-progress-6" title="环形进度条" kind="live" />

### 小号的环形进度条

小号进度条默认尺寸为 24 x 24

<DemoBlock id="zh-CN-feedback-progress-7" title="小号的环形进度条" kind="live" />

### 动态改变进度

<DemoBlock id="zh-CN-feedback-progress-8" title="动态改变进度" kind="live" />

<DemoBlock id="zh-CN-feedback-progress-9" title="动态改变进度" kind="live" />

### 自定义中心文字内容

你可以通过传入 `format` 函数自定义中心文字，`format` 的入参为当前百分比
如果不需要中心文本内容，你可以将 `showInfo` 设为 false，或者在 `format` 中直接返回空字符串

<DemoBlock id="zh-CN-feedback-progress-10" title="自定义中心文字内容" kind="live" />

### 圆角/方角边缘

通过 strokeLinecap 属性，你可以控制环形进度条边缘形状

<DemoBlock id="zh-CN-feedback-progress-11" title="圆角/方角边缘" kind="live" />

### 自定义进度条颜色

可通过设置 `stroke` 属性，自定义具体 `percent` 的颜色

<DemoBlock id="zh-CN-feedback-progress-12" title="自定义进度条颜色" kind="live" />

### 自动补齐颜色区间

可通过设置 `strokeGradient` 属性，属性为 `true` 时自动补齐颜色区间，生成渐变色

<DemoBlock id="zh-CN-feedback-progress-13" title="自动补齐颜色区间" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/progress/types.ts` 的公开类型为准。

#### Vue 用法

- `format` 是保留的内容格式化 callback prop；也可使用 `#format` 作用域插槽，插槽优先。
- `stroke` 数组按 percent 选择颜色；启用 `strokeGradient` 后补齐颜色区间。

#### Vue 插槽

**Progress**

| 插槽   | 作用域参数  | 说明               |
| ------ | ----------- | ------------------ |
| format | { percent } | 自定义进度文本内容 |

| 属性           | 说明                                                                                                                                                                                                  | 类型                               | 默认值                              |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ----------------------------------- |
| ariaLabel      | `aria-label` 的类型化 Vue 映射                                                                                                                                                                        | string                             | —                                   |
| ariaLabelledby | `aria-labelledby` 的类型化 Vue 映射                                                                                                                                                                   | string                             | —                                   |
| ariaValuetext  | `aria-valuetext` 的类型化 Vue 映射                                                                                                                                                                    | string                             | —                                   |
| class          | Vue 原生类名                                                                                                                                                                                          | HTMLAttributes['class']            | —                                   |
| className      | 样式类名                                                                                                                                                                                              | HTMLAttributes['class']            | —                                   |
| direction      | 条状进度条方向 `horizontal`、`vertical`                                                                                                                                                               | ProgressDirection                  | `horizontal`                        |
| format         | 格式化函数，入参为当前百分比，return 的结果将会直接渲染在圆形进度条中心                                                                                                                               | (percent: number) =&gt; VNodeChild | `${percent}%`                       |
| id             | id 标识 **v2.2.0 后提供**                                                                                                                                                                             | string                             | —                                   |
| motion         | 是否启用进度变化动画，或提供动画配置                                                                                                                                                                  | ProgressMotion                     | true                                |
| orbitStroke    | 进度条轨道填充色 **v1.0.0 后提供**                                                                                                                                                                    | string                             | 'var(--semi-color-fill-0)'          |
| percent        | 进度百分比                                                                                                                                                                                            | number                             | 0                                   |
| showInfo       | 环形进度条是否显示中间文本，条状进度条后右侧是否显示文本                                                                                                                                              | boolean                            | false                               |
| size           | 尺寸,可选`default`、`small`(仅 type=circle 生效)、`large`(仅 type=line 生效)                                                                                                                          | ProgressSize                       | `default`                           |
| stroke         | 进度条填充色，类型为 `Array&lt;{percent:number; color:string }&gt;` 时，`color` 参数支持颜色类型：`'Hex'` &#124; `'Hsl'` &#124; `'Hsla'` &#124; `'Rgb'` &#124; `'Rgba'` &#124; `'Semi Design Tokens'` | string \| ProgressStrokePoint[]    | 'var(--semi-color-success)'         |
| strokeGradient | 是否自动生成渐变色补齐区间颜色，需要 `stroke` 设置至少一个颜色区间                                                                                                                                    | boolean                            | false                               |
| strokeLinecap  | 圆角`round`/方角`square`(仅在 type='circle'模式下生效)                                                                                                                                                | ProgressStrokeLinecap              | `round`                             |
| strokeWidth    | type 为`circle`时，该属性控制进度条宽度                                                                                                                                                               | number                             | 4                                   |
| style          | 样式                                                                                                                                                                                                  | StyleValue                         | —                                   |
| type           | 类型，可选`line`、`circle`                                                                                                                                                                            | ProgressType                       | `line`                              |
| width          | 环形进度条宽度                                                                                                                                                                                        | number                             | size='default'时为 72，'small'为 24 |

## Accessibility

### ARIA

- Progress 具有 `progressbar` role 来表示它是一个进度条组件。
- Progress 会自动将 `aria-valuenow` 设置为传递给组件的进度百分比（`percent`），以确保屏幕阅读器可以获取正确的百分比数值。另外，Progress 支持传入 `aria-valuetext`，当你传入时，根据 W3C 规范，`aria-valuetext` 将优先被屏幕阅读器使用消费，而不是 `aria-valuenow`
- Progress 支持传入 `aria-label`、`aria-labelledby`
- 当 Progress 外部存在关于 Progress 作用的描述元素时，你可以通过 aria-labelledby 显式指定某些元素的 id 是 Progress 的标签
- 否则你应当通过 aria-label 说明 Progress 所代表的具体数值含义

<DemoBlock id="zh-CN-feedback-progress-14" title="ARIA" kind="code" />

## 文案规范

- 如果进度条过程复杂，或者有很长的等待时间，可以使用帮助文本来做说明。这样可以让用户知道正在发生的进度进展
