---
title: 'AutoComplete 自动完成'
description: '输入框自动填充。'
type: 'input'
order: 35
icon: 'doc-autocomplete'
---

## 使用场景

用于对输入框提供输入建议，进行自动补全的操作

与可搜索的 Select 组件的区别：

- AutoComplete 本质上是一个增强型的提供了输入建议的 Input 组件，而 Select 是一个选择器
- 点击展开时，Select 会将输入框的值全部清空，而 AutoComplete 会保留上次选中的值
- Select 的已选项渲染（renderSelectedItem）可定制化程度更高，可以为任意类型的 VNodeChild，而 AutoComplete 只允许为字符串

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/auto-complete` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-input-autocomplete-1" title="如何引入" kind="import" />

### 基本用法

通过 `search` 事件监听用户输入并更新 `data`，使用 `v-model` 保持受控；输入或选中候选项时会触发 `change` 事件。

<DemoBlock id="zh-CN-input-autocomplete-2" title="基本用法" kind="live" />

### 自定义候选项渲染

需要自定义候选项渲染时，data 可以传入一个对象数组（每个 Object 必须含有 label、value 两个 key，value 为候选项选中的值，label 为候选项展示的内容）
优先使用 `option` 作用域插槽自定义候选项；迁移代码也可继续使用 `renderItem` callback prop。

<DemoBlock id="zh-CN-input-autocomplete-3" title="自定义候选项渲染" kind="live" />

### 远程搜索

从 `search` 事件获取用户输入值，动态更新 `data`。

<DemoBlock id="zh-CN-input-autocomplete-4" title="远程搜索" kind="live" />

### 尺寸

通过设置 size 可设置输入框尺寸，可选`small`，`default`(默认)，`large`

<DemoBlock id="zh-CN-input-autocomplete-5" title="尺寸" kind="live" />

### 下拉菜单的位置

通过设置 position 可设置下拉菜单位置，可选值参考 Tooltip position

<DemoBlock id="zh-CN-input-autocomplete-6" title="下拉菜单的位置" kind="live" />

### 禁用

<DemoBlock id="zh-CN-input-autocomplete-7" title="禁用" kind="live" />

### 校验状态

可设置不同校验状态，展示不同样式

<DemoBlock id="zh-CN-input-autocomplete-8" title="校验状态" kind="live" />

### 自定义空内容

可设置自定义展示空内容

<DemoBlock id="zh-CN-input-autocomplete-9" title="自定义空内容" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/auto-complete/types.ts`、`packages/ui/src/auto-complete/index.ts` 的公开类型为准。

- `v-model` 对应 `modelValue` 与 `update:modelValue`；兼容入口 `value` 可通过 `v-model:value` 绑定，两个值同时存在时 `modelValue` 优先。

#### Vue 用法

- `renderItem` 与 `renderSelectedItem` 是保留的 callback props，不是组件事件。
- clearIcon、emptyContent、insetLabel、prefix、suffix 同时支持 VNode prop 和同名插槽；option 与 trigger 提供 Vue 原生作用域插槽。
- AutoComplete.Option 同时作为静态成员和 `AutoCompleteOption` 具名导出。

#### Vue 实例方法

**AutoCompleteExposed**

| 方法     | 签名                       | 说明         |
| -------- | -------------------------- | ------------ |
| `close`  | () =&gt; void              | 关闭下拉菜单 |
| `focus`  | () =&gt; void              | 聚焦输入框   |
| `open`   | () =&gt; void              | 打开下拉菜单 |
| `search` | (value: string) =&gt; void | 更新搜索输入 |

#### Vue 事件

**AutoComplete**

| 事件                  | 参数                                                   | 说明                |
| --------------------- | ------------------------------------------------------ | ------------------- |
| blur                  | [event: FocusEvent]                                    | 输入框失焦          |
| change                | [value: AutoCompletePrimitive]                         | 输入值或选中项变化  |
| clear                 | []                                                     | 清除输入值          |
| dropdownVisibleChange | [visible: boolean]                                     | 下拉菜单显隐变化    |
| focus                 | [event: FocusEvent]                                    | 输入框聚焦          |
| keydown               | [event: KeyboardEvent]                                 | 输入框键盘事件      |
| search                | [value: string]                                        | 搜索输入变化        |
| select                | [value: AutoCompletePrimitive \| AutoCompleteDataItem] | 选择候选项          |
| update:modelValue     | [value: AutoCompletePrimitive]                         | 更新默认 v-model    |
| update:value          | [value: AutoCompletePrimitive]                         | 更新兼容 value 绑定 |

#### Vue 插槽

**AutoComplete**

| 插槽         | 作用域参数                   | 说明             |
| ------------ | ---------------------------- | ---------------- |
| clearIcon    | {}                           | 清除图标         |
| emptyContent | {}                           | 无候选项内容     |
| insetLabel   | {}                           | 内嵌标签         |
| option       | AutoCompleteOptionSlotProps  | 自定义候选项     |
| prefix       | {}                           | 输入框前缀       |
| suffix       | {}                           | 输入框后缀       |
| trigger      | AutoCompleteTriggerSlotProps | 自定义完整触发器 |

| 属性                     | 说明                                                                                                                                               | 类型                                                    | 默认值                 | 版本   |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ---------------------- | ------ |
| ariaDescribedby          | 输入框 aria-describedby                                                                                                                            | string                                                  | —                      |        |
| ariaErrormessage         | 输入框 aria-errormessage                                                                                                                           | string                                                  | —                      |        |
| ariaInvalid              | 输入框 aria-invalid；error 校验状态会强制为 true                                                                                                   | boolean \| 'false' \| 'true' \| 'grammar' \| 'spelling' | —                      |        |
| ariaLabel                | 输入框 aria-label                                                                                                                                  | string                                                  | —                      |        |
| ariaLabelledby           | 输入框 aria-labelledby                                                                                                                             | string                                                  | —                      |        |
| ariaRequired             | 输入框 aria-required                                                                                                                               | boolean                                                 | —                      |        |
| autoAdjustOverflow       | 浮层被遮挡时是否自动调整方向                                                                                                                       | boolean                                                 | true                   |        |
| autoFocus                | 是否自动聚焦                                                                                                                                       | boolean                                                 | false                  | -      |
| clearIcon                | 可用于自定义清除按钮, showClear为true时有效                                                                                                        | VNodeChild                                              | —                      | 2.25.0 |
| data                     | 候选项的数据源，可以为字符串数组或对象数组                                                                                                         | AutoCompleteItem[]                                      | []                     |        |
| defaultActiveFirstOption | 是否默认高亮第一个选项（按回车可直接选中）                                                                                                         | boolean                                                 | false                  |        |
| defaultOpen              | 是否默认展开下拉菜单                                                                                                                               | boolean                                                 | false                  |        |
| defaultValue             | 默认值                                                                                                                                             | AutoCompletePrimitive                                   | —                      |        |
| disabled                 | 是否禁用                                                                                                                                           | boolean                                                 | false                  |        |
| dropdownClassName        | 下拉列表的 CSS 类名                                                                                                                                | HTMLAttributes['class']                                 | —                      |        |
| dropdownMatchSelectWidth | 下拉菜单最小宽度是否匹配触发器                                                                                                                     | boolean                                                 | true                   |        |
| dropdownStyle            | 下拉列表的内联样式                                                                                                                                 | StyleValue                                              | —                      |        |
| emptyContent             | data 为空时自定义下拉内容                                                                                                                          | VNodeChild \| null                                      | null                   | -      |
| getPopupContainer        | 指定下拉列表浮层的父级容器，浮层将会渲染至该 DOM 中。自定义该项时需给容器设置 `position: relative` 这会改变浮层 DOM 树位置，但不会改变视图渲染位置 | () =&gt; HTMLElement                                    | () =&gt; document.body |        |
| id                       | 触发器 id                                                                                                                                          | string                                                  | —                      |        |
| insetLabel               | 内嵌标签 VNode；insetLabel 插槽优先                                                                                                                | VNodeChild                                              | —                      |        |
| insetLabelId             | 内嵌标签元素 id                                                                                                                                    | string                                                  | —                      |        |
| loading                  | 下拉列表是否展示加载动画                                                                                                                           | boolean                                                 | false                  |        |
| maxHeight                | 下拉列表的最大高度                                                                                                                                 | string \| number                                        | 300                    |        |
| modelValue               | 默认 v-model 值                                                                                                                                    | AutoCompleteModelValue                                  | —                      |        |
| motion                   | 下拉列表出现/隐藏时，是否有动画                                                                                                                    | boolean                                                 | true                   |        |
| mouseEnterDelay          | 浮层鼠标进入延时，单位毫秒                                                                                                                         | number                                                  | 0                      |        |
| mouseLeaveDelay          | 浮层鼠标离开延时，单位毫秒                                                                                                                         | number                                                  | 0                      |        |
| onChangeWithObject       | change 事件是否返回完整选项对象                                                                                                                    | boolean                                                 | false                  |        |
| onSelectWithObject       | 点击候选项时，是否将选中项 option 的其他属性也作为回调入参。设为 true 时，onSelect 的入参类型会从 `string` 变为 object: { value, label, ...rest }  | boolean                                                 | false                  | -      |
| placeholder              | 输入框默认提示文案                                                                                                                                 | string                                                  | —                      |        |
| position                 | 下拉菜单的显示位置，可选值同 tooltip 组件                                                                                                          | TooltipPosition                                         | `bottomLeft`           |        |
| prefix                   | 选择框的前缀标签                                                                                                                                   | VNodeChild                                              | —                      | -      |
| renderItem               | 候选项渲染 callback prop；option 插槽优先                                                                                                          | (item: AutoCompleteItem) =&gt; VNodeChild               | —                      |        |
| renderSelectedItem       | 选中项文本渲染 callback prop                                                                                                                       | (option: AutoCompleteOptionRuntime) =&gt; string        | —                      |        |
| showClear                | 是否展示清除按钮                                                                                                                                   | boolean                                                 | false                  |        |
| size                     | 尺寸，可选`small`, `default`, `large`                                                                                                              | AutoCompleteSize                                        | `default`              |        |
| style                    | 样式                                                                                                                                               | StyleValue                                              | —                      |        |
| stopPropagation          | 浮层事件是否停止冒泡                                                                                                                               | boolean \| string                                       | true                   |        |
| suffix                   | 选择框的前缀标签                                                                                                                                   | VNodeChild                                              | —                      |        |
| validateStatus           | 校验状态，可选值`default`、`error`、`warning`，默认 default。仅影响展示样式                                                                        | AutoCompleteValidateStatus                              | `default`              | -      |
| value                    | 兼容受控值，可通过 v-model:value 绑定                                                                                                              | AutoCompleteModelValue                                  | 无                     |        |
| zIndex                   | 下拉菜单的 zIndex                                                                                                                                  | number                                                  | 1030                   |        |

## Accessibility

### 键盘和焦点

- AutoComplete 的 input 框可被聚焦，聚焦后，键盘用户可以通过 `上箭头` 或 `下箭头` 打开选项面板（如有）
- AutoComplete 也支持通过 `Enter` 键打开和收起面板
- 若用户将 defaultActiveFirstOption 属性设置为 true 时，选项面板打开后默认高亮第一个选项
- 若下拉菜单打开时：
- 使用 `Esc` 可以关闭菜单
- 使用 `上箭头` 或 `下箭头` 可以切换选项
- 被聚焦的选项可以通过 `Enter` 键选中，并收起面板

## 文案规范

- 需要清晰地展示内容，让用户显而易见地感知到可用的各个选项
- 限制一次性展示的选项数量
