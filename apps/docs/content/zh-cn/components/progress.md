---
title: '进度条'
description: '用于展示用户操作的当前进度和状态，一般在操作耗时较长时使用。也可用来表示任务/对象的完成度'
locale: 'zh-CN'
slug: 'progress'
category: 'feedback'
order: 91
englishTitle: 'Progress'
icon: 'doc-progress'
upstream: 'feedback/progress'
---

## 代码演示

### 如何引入

```vue
<script setup lang="ts">
import { Progress } from '@aifuxi/semi-ui-vue/progress';
import '@aifuxi/semi-theme-default/progress.css';
</script>
```

### 标准的进度条

通过`stroke`属性来控制进度条的填充色  
通过`percent`属性控制已完成的进度  
通过`size`属性控制进度条尺寸  
通过`aria-label`说明进度条具体代表含义  
如果`size`预设的尺寸不满足，可以通过`style`传入 height 自定义进度条高度

::demo-block{demo="progress/zh-cn/Basic" title="标准的进度条"}
::

### 展示百分比文本

通过`showInfo`控制是否展示百分比数字，可以通过`format`格式化展示文本

::demo-block{demo="progress/zh-cn/Percentage" title="展示百分比文本"}
::

### 垂直的进度条

设置`direction='vertical'`，展示垂直进度条，可以通过`style`传入 width 控制进度条宽度

::demo-block{demo="progress/zh-cn/Vertical" title="垂直的进度条"}
::

### 环形进度条

将 type 设为`circle`，进度条将会展示成环状。进度条默认尺寸为 72 x 72

::demo-block{demo="progress/zh-cn/Circle" title="环形进度条"}
::

你可以通过修改`width`来控制环形进度条的大小

::demo-block{demo="progress/zh-cn/CircleWidth" title="环形进度条"}
::

### 小号的环形进度条

小号进度条默认尺寸为 24 x 24

::demo-block{demo="progress/zh-cn/SmallCircle" title="小号的环形进度条"}
::

### 动态改变进度

::demo-block{demo="progress/zh-cn/DynamicLine" title="动态改变进度"}
::

::demo-block{demo="progress/zh-cn/DynamicCircle" title="动态改变进度"}
::

### 自定义中心文字内容

你可以通过传入 `format` 函数自定义中心文字，`format` 的入参为当前百分比  
如果不需要中心文本内容，你可以将 `showInfo` 设为 false，或者在 `format` 中直接返回空字符串

::demo-block{demo="progress/zh-cn/Format" title="自定义中心文字内容"}
::

### 圆角/方角边缘

通过 strokeLinecap 属性，你可以控制环形进度条边缘形状

::demo-block{demo="progress/zh-cn/Linecap" title="圆角/方角边缘"}
::

### 自定义进度条颜色

可通过设置 `stroke` 属性，自定义具体 `percent` 的颜色

::demo-block{demo="progress/zh-cn/Stroke" title="自定义进度条颜色"}
::

### 自动补齐颜色区间

可通过设置 `strokeGradient` 属性，属性为 `true` 时自动补齐颜色区间，生成渐变色

::demo-block{demo="progress/zh-cn/Gradient" title="自动补齐颜色区间"}
::

## API 参考

| 属性                               | 说明                                            | 类型                              | 默认值                           |
| ---------------------------------- | ----------------------------------------------- | --------------------------------- | -------------------------------- |
| `ariaLabel / aria-label`           | 进度条的可访问名称                              | `string`                          | `—`                              |
| `ariaLabelledby / aria-labelledby` | 描述元素的 id，多个 id 以空格分隔               | `string`                          | `—`                              |
| `ariaValuetext / aria-valuetext`   | 替代数字的状态说明                              | `string`                          | `—`                              |
| `class / className`                | 样式类                                          | `HTMLAttributes["class"]`         | `—`                              |
| `direction`                        | 条状进度条方向 horizontal、vertical             | `ProgressDirection`               | `horizontal`                     |
| `format`                           | 格式化当前动画百分比；支持 format 作用域插槽    | `(percent: number) => VNodeChild` | `percent => percent + '%'`       |
| `id`                               | 元素标识                                        | `string`                          | `—`                              |
| `motion`                           | 控制数字过渡动画；false 立即更新数值            | `ProgressMotion`                  | `true`                           |
| `orbitStroke`                      | 轨道填充色                                      | `string`                          | `CSS: var(--semi-color-fill-0)`  |
| `percent`                          | 进度百分比，显示值限制在 0–100；不得传 NaN      | `number`                          | `0`                              |
| `showInfo`                         | 显示圆环中心或条状进度旁的文本                  | `boolean`                         | `false`                          |
| `size`                             | default；small 适用于 circle；large 适用于 line | `ProgressSize`                    | `default`                        |
| `stroke`                           | 进度色；颜色断点支持 CSS 色值和 Semi 调色板名称 | `string / ProgressStrokePoint[]`  | `CSS: var(--semi-color-success)` |
| `strokeGradient`                   | 在颜色断点之间插值，需要提供 stroke 数组        | `boolean`                         | `false`                          |
| `strokeLinecap`                    | 圆环端点 round 或 square                        | `ProgressStrokeLinecap`           | `round`                          |
| `strokeWidth`                      | 圆环描边宽度                                    | `number`                          | `4`                              |
| `style`                            | 外层样式；可定制线形高度或宽度                  | `StyleValue`                      | `—`                              |
| `type`                             | line、circle                                    | `ProgressType`                    | `line`                           |
| `width`                            | 圆环直径                                        | `number`                          | `default: 72; small: 24`         |

`#format="{ percent }"` 作用域插槽优先于 `format` 属性。`ProgressStrokePoint` 为 `{ percent: number; color: string }`。通过 `:percent` 受控传值，没有 `v-model` 或 change 事件。

## Accessibility

### ARIA

- Progress 具有 `progressbar` role 来表示它是一个进度条组件。
- Progress 会自动将 `aria-valuenow` 设置为传递给组件的进度百分比（`percent`），以确保屏幕阅读器可以获取正确的百分比数值。另外，Progress 支持传入 `aria-valuetext`，当你传入时，根据 W3C 规范，`aria-valuetext` 将优先被屏幕阅读器使用消费，而不是 `aria-valuenow`
- Progress 支持传入 `aria-label`、`aria-labelledby`
  - 当 Progress 外部存在关于 Progress 作用的描述元素时，你可以通过 aria-labelledby 显式指定某些元素的 id 是 Progress 的标签
  - 否则你应当通过 aria-label 说明 Progress 所代表的具体数值含义

```vue
<p id="progressbar-label">磁盘使用量</p>
<Progress aria-labelledby="progressbar-label" :percent="80" />
<Progress aria-label="文件下载" :percent="80" />
<Progress aria-label="磁盘使用量" :percent="80" aria-valuetext="步骤 2：正在复制文件…" />
```

## 文案规范

- 如果进度条过程复杂，或者有很长的等待时间，可以使用帮助文本来做说明。这样可以让用户知道正在发生的进度进展

## 设计变量

::token-table{component="progress"}
::

## FAQ

**为什么圆环没有文本？** showInfo 默认为 false；size="small" 时不渲染圆环中心文本。

**strokeGradient 是空间渐变吗？** 它随 percent 在断点之间插值得到当前进度色。

**如何修改条状粗细？** 横向使用 size="large" 或 height 样式；strokeWidth 作用于圆环。

## React → Vue

| React                                           | Vue                                                    |
| ----------------------------------------------- | ------------------------------------------------------ |
| `format(percent) => ReactNode`                  | format(percent) => VNodeChild 或 #format="{ percent }" |
| `useState + setPercent`                         | shallowRef + :percent                                  |
| `useEffect + setTimeout`                        | onMounted 启动、onBeforeUnmount 清理                   |
| `aria-label / aria-labelledby / aria-valuetext` | 保留同名 ARIA 属性，也支持 camelCase props             |
| `className / CSSProperties`                     | class（兼容 className）/ StyleValue                    |

示例使用公开 Vue 组件子路径；预览和源码编辑器读取同一个 SFC。参考基线为本地 Semi Design v2.102.0 submodule（`cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`）。
