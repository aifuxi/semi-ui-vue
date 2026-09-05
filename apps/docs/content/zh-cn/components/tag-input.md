---
title: '标签输入框'
description: '标签输入框能够将输入的内容生成标签。'
locale: 'zh-CN'
slug: 'tag-input'
category: 'input'
order: 49
englishTitle: 'TagInput'
icon: 'doc-tagInput'
upstream: 'input/taginput'
---

## 代码演示

### 如何引入

```ts
import { TagInput } from '@aifuxi/semi-ui-vue/tag-input';
import '@aifuxi/semi-theme-default/tag-input.css';
```

### 基本演示

敲击回车键后，输入内容将成为标签。标签内容如果为空串或者纯空格时，则会被过滤。

::demo-block{demo="tag-input/zh-cn/Basic" title="基本演示"}
::

### 批量添加

可以使用 `separator` 设置分隔符，来实现批量输入，它的默认值为英文逗号。支持多个分隔符以 string[] 格式传入。

::demo-block{demo="tag-input/zh-cn/BatchAdd" title="批量添加"}
::

### 批量删除

可使用 `showClear` 设置是否支持一键删除所有标签和输入框内容。

::demo-block{demo="tag-input/zh-cn/Clear" title="批量删除"}
::

### 禁用

::demo-block{demo="tag-input/zh-cn/Disabled" title="禁用"}
::

### 尺寸大小

通过 `size` 控制标签输入框的大小尺寸，可选: `small` 、 `default` 、 `large`。

::demo-block{demo="tag-input/zh-cn/Size" title="尺寸大小"}
::

### 不同校验状态样式

可以使用 `validateStatus` 设置不同校验状态的样式，它仅影响背景颜色等样式表现，可选值: `default` 、 `warning` 、 `error`。

::demo-block{demo="tag-input/zh-cn/Validation" title="不同校验状态样式"}
::

### 前缀 / 后缀

可以通过 `prefix` 传入输入框前缀，通过 `suffix` 传入输入框后缀，可以为文本或者 VNodeChild。  
当 `prefix`、`suffix` 传入的内容为 string 或者 Icon 时，会自动带上左右间隔；若为自定义 VNodeChild，则左右间隔为 0，如需可以在你传入的 VNodeChild中自行设置。

::demo-block{demo="tag-input/zh-cn/Affixes" title="前缀 / 后缀"}
::

### 失焦后自动创建标签

可使用 `addOnBlur`，设置是否在 blur 事件触发时，将当前 input 的值自动创建成 tag。

::demo-block{demo="tag-input/zh-cn/AddOnBlur" title="失焦后自动创建标签"}
::

### 过滤重复标签

可使用 `allowDuplicates`，设置是否允许创建相同 tag，默认为 true。

::demo-block{demo="tag-input/zh-cn/Unique" title="过滤重复标签"}
::

### 输入限制

可使用 `max` 限制输入的标签数量，超出后将不允许再输入，并且触发 `@exceed()` 回调。

可使用 `maxLength` 限制单个标签的最大长度，超出后将不允许再输入，并且触发 `@input-exceed()` 回调。

::demo-block{demo="tag-input/zh-cn/Limits" title="输入限制"}
::

### 限制标签展示数量

利用 `maxTagCount` 可以限制展示的标签数量，超出部分将以 +N 的方式展示。使用 `showRestTagsPopover` 可以设置在超出 `maxTagCount` 后，hover +N 是否显示 `Popover`，并且可以在 `restTagsPopoverProps` 属性中配置 `Popover`。

::demo-block{demo="tag-input/zh-cn/MaxTagCount" title="限制标签展示数量"}
::

### 标签受控

可使用 `value` 设置标签内容，并配合 `@change` 实现标签内容受控。

::demo-block{demo="tag-input/zh-cn/Controlled" title="标签受控"}
::

### 输入受控

可使用 `inputValue` 设置输入框内容，并配合 `@input-change` 实现输入内容受控。

::demo-block{demo="tag-input/zh-cn/ControlledInput" title="输入受控"}
::

### 回调

::demo-block{demo="tag-input/zh-cn/Callbacks" title="回调"}
::

### 焦点管理

可以使用 `blur()` 和 `focus()` 方法对焦点进行管理。

::demo-block{demo="tag-input/zh-cn/Focus" title="焦点管理"}
::

### 自定义标签渲染

可以使用 `renderTagItem` 自定义标签渲染。 `renderTagItem(value: string, index: number, onClose: function ) => VNodeChild` 第三个参数 `onClose` 于 2.23.0 版本开始提供。

::demo-block{demo="tag-input/zh-cn/Custom" title="自定义标签渲染"}
::

### 拖拽排序

将 `draggable`设为 true，开启拖拽排序功能。v2.17.0 后支持。拖拽排序下不允许添加相同 Tag， 因此需要将 `allowDuplicates` 设置为 false。
拖拽功能开启后，点击 TagInput，Tag 可拖拽。点击 TagInput 外任意区域，Tag 不可拖拽。

::demo-block{demo="tag-input/zh-cn/Draggable" title="拖拽排序"}
::

## API 参考

### TagInput

| 属性                    | 类型                                                                | 默认值      | 说明                                                                  |
| ----------------------- | ------------------------------------------------------------------- | ----------- | --------------------------------------------------------------------- |
| `ariaLabel`             | `string`                                                            | `—`         | 可访问名称；模板写为 aria-label。                                     |
| `addOnBlur`             | `boolean`                                                           | `false`     | 是否在 blur 事件触发时，将当前 input 的值自动创建成 tag               |
| `allowDuplicates`       | `boolean`                                                           | `true`      | 是否允许添加相同 tag                                                  |
| `autoFocus`             | `boolean`                                                           | `false`     | 初始渲染时是否自动 focus                                              |
| `className`             | `HTMLAttributes['class']`                                           | `—`         | 样式类名                                                              |
| `clearIcon`             | `VNodeChild`                                                        | `—`         | 自定义清除按钮内容，仅 showClear 开启时显示。                         |
| `defaultValue`          | `string[]`                                                          | `—`         | 初始标签                                                              |
| `disabled`              | `boolean`                                                           | `false`     | 是否禁用                                                              |
| `draggable`             | `boolean`                                                           | `false`     | 设置是否可拖拽                                                        |
| `expandRestTagsOnClick` | `boolean`                                                           | `true`      | 在不可拖拽的情况下，在 TagInput 被点击后是否展开多余的 Tag            |
| `inputValue`            | `string`                                                            | `—`         | 当前输入框，配合 @input-change 实现受控                               |
| `insetLabel`            | `VNodeChild`                                                        | `—`         | 内嵌标签，支持 insetLabel 插槽。                                      |
| `insetLabelId`          | `string`                                                            | `—`         | 内嵌标签节点 id。                                                     |
| `max`                   | `number`                                                            | `—`         | 允许标签的最大数量                                                    |
| `maxLength`             | `number`                                                            | `—`         | 单个标签的最大长度                                                    |
| `maxTagCount`           | `number`                                                            | `—`         | 标签的最大展示数量，超出后将以 +N 形式展示                            |
| `modelValue`            | `string[] \| undefined`                                             | `—`         | v-model 的受控值。                                                    |
| `placeholder`           | `string`                                                            | `—`         | 占位默认值                                                            |
| `prefix`                | `VNodeChild`                                                        | `—`         | 前缀标签                                                              |
| `preventScroll`         | `boolean`                                                           | `—`         | 指示浏览器是否应滚动文档以显示新聚焦的元素，作用于组件内的 focus 方法 |
| `renderTagItem`         | `(value: string, index: number, close: () => void) => VNodeChild`   | `—`         | 自定义标签渲染, 参数 onClose 于版本2.23.0版本提供                     |
| `restTagsPopoverProps`  | `TagInputRestPopoverProps`                                          | `—`         | 剩余标签弹层配置，以本页 TagInputRestPopover 类型为准。               |
| `separator`             | `TagInputSeparator`                                                 | `','`       | 设置批量输入时的分隔符                                                |
| `showClear`             | `boolean`                                                           | `false`     | 是否支持一键删除所有标签和输入内容                                    |
| `showContentTooltip`    | `boolean \| TagInputTooltipOptions`                                 | `true`      | 标签截断时显示完整文本；可用 opts 配置 Tooltip 或 Popover。           |
| `showRestTagsPopover`   | `boolean`                                                           | `true`      | 当超过 maxTagCount，hover 到 +N 时，是否通过 Popover 显示剩余内容     |
| `size`                  | `TagInputSize`                                                      | `'default'` | 设置输入框尺寸,可选: `small`、`large`、`default`                      |
| `split`                 | `(originString: string, separators: TagInputSeparator) => string[]` | `—`         | 自定义分隔符处理函数                                                  |
| `style`                 | `StyleValue`                                                        | `—`         | 内联样式                                                              |
| `suffix`                | `VNodeChild`                                                        | `—`         | 后缀标签                                                              |
| `validateStatus`        | `TagInputValidateStatus`                                            | `'default'` | 设置校验状态样式,可选: `default`、`warning`、`error`                  |
| `value`                 | `string[] \| undefined`                                             | `—`         | 当前标签，配合 @change 实现受控                                       |

### TagInputRestPopover

| 属性                 | 类型                      | 默认值 | 说明                       |
| -------------------- | ------------------------- | ------ | -------------------------- |
| `autoAdjustOverflow` | `boolean`                 | `—`    | 溢出时自动调整弹层位置。   |
| `className`          | `HTMLAttributes['class']` | `—`    | 样式类名                   |
| `getPopupContainer`  | `() => HTMLElement`       | `—`    | 返回挂载弹层的容器。       |
| `mouseEnterDelay`    | `number`                  | `—`    | 进入后展示延迟，单位毫秒。 |
| `mouseLeaveDelay`    | `number`                  | `—`    | 离开后隐藏延迟，单位毫秒。 |
| `position`           | `TooltipPosition`         | `—`    | 弹层方向。                 |
| `style`              | `StyleValue`              | `—`    | 内联样式                   |
| `zIndex`             | `number`                  | `—`    | 弹层层级。                 |

### 事件

#### TagInput

| 事件                | 参数                                  |
| ------------------- | ------------------------------------- |
| `add`               | `addedValue: string[]`                |
| `blur`              | `event: FocusEvent`                   |
| `change`            | `value: string[]`                     |
| `exceed`            | `value: string[]`                     |
| `focus`             | `event: FocusEvent`                   |
| `inputChange`       | `value: string, event: Event`         |
| `inputExceed`       | `value: string`                       |
| `keyDown`           | `event: KeyboardEvent`                |
| `remove`            | `removedValue: string, index: number` |
| `update:inputValue` | `value: string`                       |
| `update:modelValue` | `value: string[]`                     |
| `update:value`      | `value: string[]`                     |

### 插槽与类型

插槽：`#clearIcon`、`#insetLabel`、`#prefix`、`#suffix`、`#tag="{ value, index, close }"`。`#tag` 替代 React 的 renderTagItem；也保留返回 VNodeChild 的 renderTagItem 函数。`TagInputSeparator = string | string[] | null`，尺寸为 small/default/large，校验状态为 default/error/warning。
`showContentTooltip` 接受 boolean 或 `{ type?: string, opts?: Omit<TooltipProps, "condition" | "content"> & { className? } }`。Popover 配置以本页 TagInputRestPopover 类型为准。

Vue 模板中 camelCase 事件使用 kebab-case：如 `@enter-press`、`@number-change`、`@after-change`、`@input-change`。TagInput 的 `keyDown` 事件写为 `@key-down`。`class` 与 `style` 使用 Vue 原生属性。

## Methods

绑定在组件实例上的方法，可以通过 ref 调用实现某些特殊交互

| 名称    | 描述     | 版本 |
| ------- | -------- | ---- |
| blur()  | 移出焦点 | -    |
| focus() | 获取焦点 | -    |

## Accessibility

### ARIA

- TagInput 支持传入 `aria-label` 来表示该 TagInput 作用；
- TagInput 会依据 disabled 及 validateStatus props 来分别设置 `aria-disabled`、`aria-invalid`；
- TagInput 的输入框和清空按钮均具有 `aria-label` 来表明元素作用。

### 键盘和焦点

Tab / Shift + Tab 切换焦点。Enter 将当前输入创建为标签；空白输入会被过滤。空输入时 Backspace 删除最后一个标签；禁用状态不接收输入。

## 设计变量

::token-table{component="tagInput"}
::

## React → Vue 迁移

| React                                  | Vue                                                                          |
| -------------------------------------- | ---------------------------------------------------------------------------- |
| `@douyinfe/semi-ui`                    | `@aifuxi/semi-ui-vue/tag-input` + `@aifuxi/semi-theme-default/tag-input.css` |
| `value` + `onChange`                   | `v-model` / `v-model:value` / `:value` + `@change`                           |
| `defaultValue`                         | `default-value`                                                              |
| `useState` / `useMemo`                 | `shallowRef` / `computed`                                                    |
| `className` / `style={{ ... }}`        | `class` / `:style="{ ... }"`                                                 |
| `ref.current.focus()` / `.blur()`      | 模板 ref 上的 `focus()` / `blur()`                                           |
| `inputValue` + `onInputChange`         | `v-model:input-value`                                                        |
| `renderTagItem(value, index, onClose)` | `#tag="{ value, index, close }"`                                             |

自定义标签的头像使用本项目本地示意图，避免远程资源失效或许可不明确；保留标签文案、关闭交互及两语言原有布局。原始引用记录在迁移映射中，这一资源替换不代表已完成视觉验收。

## FAQ

### 标签和输入文字如何分别受控？

标签使用 v-model，编辑中的文本使用 v-model:input-value。TagInput 同时显式传入 modelValue 和 value 时优先 modelValue，建议只使用一个入口。

### 为什么拖拽前要禁止重复值？

标签值是排序的识别依据。draggable 应与 :allow-duplicates="false" 一起使用；点击控件进入可拖拽状态，点击外部退出。
