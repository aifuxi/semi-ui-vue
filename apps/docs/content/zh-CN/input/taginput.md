---
title: 'TagInput 标签输入框'
description: '标签输入框能够将输入的内容生成标签。'
type: 'input'
order: 49
icon: 'doc-tagInput'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/tag-input` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-input-taginput-1" title="如何引入" kind="import" />

### 基本演示

敲击回车键后，输入内容将成为标签。标签内容如果为空串或者纯空格时，则会被过滤。

<DemoBlock id="zh-CN-input-taginput-2" title="基本演示" kind="live" />

### 批量添加

可以使用 `separator` 设置分隔符，来实现批量输入，它的默认值为英文逗号。支持多个分隔符以 string[] 格式传入。

<DemoBlock id="zh-CN-input-taginput-3" title="批量添加" kind="live" />

### 批量删除

可使用 `showClear` 设置是否支持一键删除所有标签和输入框内容。

<DemoBlock id="zh-CN-input-taginput-4" title="批量删除" kind="live" />

### 禁用

<DemoBlock id="zh-CN-input-taginput-5" title="禁用" kind="live" />

### 尺寸大小

通过 `size` 控制标签输入框的大小尺寸，可选: `small` 、 `default` 、 `large`。

<DemoBlock id="zh-CN-input-taginput-6" title="尺寸大小" kind="live" />

### 不同校验状态样式

可以使用 `validateStatus` 设置不同校验状态的样式，它仅影响背景颜色等样式表现，可选值: `default` 、 `warning` 、 `error`。

<DemoBlock id="zh-CN-input-taginput-7" title="不同校验状态样式" kind="live" />

### 前缀 / 后缀

可以通过 `prefix` 传入输入框前缀，通过 `suffix` 传入输入框后缀，可以为文本或者 VNodeChild。
当 `prefix`、`suffix` 传入的内容为 string 或者 Icon 时，会自动带上左右间隔；若为自定义 VNodeChild，则左右间隔为 0，如需可以在你传入的 VNodeChild中自行设置。

<DemoBlock id="zh-CN-input-taginput-8" title="前缀 / 后缀" kind="live" />

### 失焦后自动创建标签

可使用 `addOnBlur`，设置是否在 blur 事件触发时，将当前 input 的值自动创建成 tag。

<DemoBlock id="zh-CN-input-taginput-9" title="失焦后自动创建标签" kind="live" />

### 过滤重复标签

可使用 `allowDuplicates`，设置是否允许创建相同 tag，默认为 true。

<DemoBlock id="zh-CN-input-taginput-10" title="过滤重复标签" kind="live" />

### 输入限制

可使用 `max` 限制输入的标签数量，超出后将不允许再输入，并且触发 `exceed` 事件。

可使用 `maxLength` 限制单个标签的最大长度，超出后将不允许再输入，并且触发 `inputExceed` 事件。

<DemoBlock id="zh-CN-input-taginput-11" title="输入限制" kind="live" />

### 限制标签展示数量

利用 `maxTagCount` 可以限制展示的标签数量，超出部分将以 +N 的方式展示。使用 `showRestTagsPopover` 可以设置在超出 `maxTagCount` 后，hover +N 是否显示 `Popover`，并且可以在 `restTagsPopoverProps` 属性中配置 `Popover`。

<DemoBlock id="zh-CN-input-taginput-12" title="限制标签展示数量" kind="live" />

### 标签受控

可使用 `v-model` 双向绑定标签内容。

<DemoBlock id="zh-CN-input-taginput-13" title="标签受控" kind="live" />

### 输入受控

可使用 `v-model:inputValue` 双向绑定输入框内容。

<DemoBlock id="zh-CN-input-taginput-14" title="输入受控" kind="live" />

### 回调

<DemoBlock id="zh-CN-input-taginput-15" title="回调" kind="live" />

### 焦点管理

可以使用 `blur()` 和 `focus()` 方法对焦点进行管理。

<DemoBlock id="zh-CN-input-taginput-16" title="焦点管理" kind="live" />

### 自定义标签渲染

优先使用 `tag` 作用域插槽自定义标签渲染；迁移代码也可继续使用 `renderTagItem(value, index, close)` callback prop。

<DemoBlock id="zh-CN-input-taginput-17" title="自定义标签渲染" kind="live" />

### 拖拽排序

将 `draggable`设为 true，开启拖拽排序功能。v2.17.0 后支持。拖拽排序下不允许添加相同 Tag， 因此需要将 `allowDuplicates` 设置为 false。
拖拽功能开启后，点击 TagInput，Tag 可拖拽。点击 TagInput 外任意区域，Tag 不可拖拽。

<DemoBlock id="zh-CN-input-taginput-18" title="拖拽排序" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/tag-input/types.ts` 的公开类型为准。

- `v-model` 对应 `modelValue` 与 `update:modelValue`；兼容入口 `value` 可通过 `v-model:value` 绑定，两个值同时存在时 `modelValue` 优先。
- `v-model:inputValue` 对应受控输入内容与 `update:inputValue`。

#### Vue 用法

- `renderTagItem` 与 `split` 是保留的 callback props，不是组件事件。
- clearIcon、insetLabel、prefix、suffix 同时支持 VNode prop 和同名插槽；tag 插槽提供 Vue 原生标签渲染入口，插槽优先。

#### Vue 实例方法

**TagInputExposed**

| 方法    | 签名          | 说明         |
| ------- | ------------- | ------------ |
| `focus` | () =&gt; void | 聚焦输入框   |
| `blur`  | () =&gt; void | 让输入框失焦 |

#### Vue 事件

**TagInput**

| 事件              | 参数                                  | 说明                   |
| ----------------- | ------------------------------------- | ---------------------- |
| add               | [addedValue: string[]]                | 添加标签               |
| blur              | [event: FocusEvent]                   | 输入框失焦             |
| change            | [value: string[]]                     | 标签数组变化           |
| exceed            | [value: string[]]                     | 标签数量超过 max       |
| focus             | [event: FocusEvent]                   | 输入框聚焦             |
| inputChange       | [value: string, event: Event]         | 输入内容变化           |
| inputExceed       | [value: string]                       | 输入内容超过 maxLength |
| keyDown           | [event: KeyboardEvent]                | 输入框键盘事件         |
| remove            | [removedValue: string, index: number] | 移除标签               |
| update:inputValue | [value: string]                       | 更新输入内容绑定       |
| update:modelValue | [value: string[]]                     | 更新默认 v-model       |
| update:value      | [value: string[]]                     | 更新兼容 value 绑定    |

#### Vue 插槽

**TagInput**

| 插槽       | 作用域参数                                             | 说明           |
| ---------- | ------------------------------------------------------ | -------------- |
| clearIcon  | {}                                                     | 清除图标       |
| insetLabel | {}                                                     | 内嵌标签       |
| prefix     | {}                                                     | 输入框前缀     |
| suffix     | {}                                                     | 输入框后缀     |
| tag        | { value: string, index: number, close: () =&gt; void } | 自定义标签内容 |

| 属性                  | 说明                                                                                                                                 | 类型                                                                  | 默认值    | 版本   |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- | --------- | ------ |
| ariaLabel             | 根元素 aria-label                                                                                                                    | string                                                                | —         |        |
| addOnBlur             | 是否在 blur 事件触发时，将当前 input 的值自动创建成 tag                                                                              | boolean                                                               | false     | -      |
| allowDuplicates       | 是否允许添加相同 tag                                                                                                                 | boolean                                                               | true      | -      |
| autoFocus             | 初始渲染时是否自动 focus                                                                                                             | boolean                                                               | false     | -      |
| className             | 样式类名                                                                                                                             | HTMLAttributes['class']                                               | -         | -      |
| clearIcon             | 清除图标 VNode；clearIcon 插槽优先                                                                                                   | VNodeChild                                                            | —         |        |
| defaultValue          | 初始标签                                                                                                                             | string[]                                                              | []        | -      |
| disabled              | 是否禁用                                                                                                                             | boolean                                                               | false     | -      |
| draggable             | 设置是否可拖拽                                                                                                                       | boolean                                                               | false     | 2.17.0 |
| expandRestTagsOnClick | 在不可拖拽的情况下，在 TagInput 被点击后是否展开多余的 Tag                                                                           | boolean                                                               | true      | 2.17.0 |
| inputValue            | 受控输入内容，可通过 v-model:inputValue 绑定                                                                                         | string                                                                | -         | -      |
| insetLabel            | 内嵌标签 VNode；insetLabel 插槽优先                                                                                                  | VNodeChild                                                            | —         |        |
| insetLabelId          | 内嵌标签元素 id                                                                                                                      | string                                                                | —         |        |
| max                   | 允许标签的最大数量                                                                                                                   | number                                                                | -         | -      |
| maxLength             | 单个标签的最大长度                                                                                                                   | number                                                                | -         | -      |
| maxTagCount           | 标签的最大展示数量，超出后将以 +N 形式展示                                                                                           | number                                                                | -         | -      |
| modelValue            | 默认 v-model 标签数组                                                                                                                | string[] \| undefined                                                 | —         |        |
| placeholder           | 占位默认值                                                                                                                           | string                                                                | `''`      | -      |
| prefix                | 前缀 VNode；prefix 插槽优先                                                                                                          | VNodeChild                                                            | -         | -      |
| preventScroll         | 指示浏览器是否应滚动文档以显示新聚焦的元素，作用于组件内的 focus 方法                                                                | boolean                                                               | —         |        |
| renderTagItem         | 标签渲染 callback prop；tag 插槽优先                                                                                                 | (value: string, index: number, close: () =&gt; void) =&gt; VNodeChild | —         |        |
| restTagsPopoverProps  | Popover 的配置属性，可以控制弹出方向、zIndex、trigger等，具体参考[Popover](/zh-CN/show/popover#API_参考)                             | TagInputRestPopoverProps                                              | {}        | -      |
| separator             | 设置批量输入时的分隔符                                                                                                               | TagInputSeparator                                                     | `','`     | -      |
| showClear             | 是否支持一键删除所有标签和输入内容                                                                                                   | boolean                                                               | false     | -      |
| showContentTooltip    | 当标签长度过长发生截断时，hover 标签的时候，是否通过 Tooltip 显示全部内容, 支持 Tooltip\|Popover；opts，其他需要透传给浮层组件的属性 | boolean \| TagInputTooltipOptions                                     | true      | -      |
| showRestTagsPopover   | 当超过 maxTagCount，hover 到 +N 时，是否通过 Popover 显示剩余内容                                                                    | boolean                                                               | true      | -      |
| size                  | 设置输入框尺寸,可选: `small`、`large`、`default`                                                                                     | TagInputSize                                                          | `default` | -      |
| split                 | 自定义批量输入切分 callback prop                                                                                                     | (originString: string, separators: TagInputSeparator) =&gt; string[]  | -         | 2.90.0 |
| style                 | 内联样式                                                                                                                             | StyleValue                                                            | -         | -      |
| suffix                | 后缀 VNode；suffix 插槽优先                                                                                                          | VNodeChild                                                            | -         | -      |
| validateStatus        | 设置校验状态样式,可选: `default`、`warning`、`error`                                                                                 | TagInputValidateStatus                                                | `default` | -      |
| value                 | 兼容受控标签数组                                                                                                                     | string[] \| undefined                                                 | -         | -      |

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
