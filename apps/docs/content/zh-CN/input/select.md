---
title: 'Select 选择器'
description: '用户可以通过 Select 选择器从一个选项集合中去选中一个或多个选项，并呈现最终选择结果'
type: 'input'
order: 46
icon: 'doc-select'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/select` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-input-select-1" title="如何引入" kind="import" />

### 基本使用

每个 Option 标签都必须声明 value 属性，Option 的默认插槽或 label 将会被渲染至下拉列表中

<DemoBlock id="zh-CN-input-select-2" title="基本使用" kind="live" />

### 以数组形式传入 Option

可以直接通过`optionList`传入一个对象数组，每个对象必须包含 value/label 属性（当然其他属性也可以通过此方式传入）

<DemoBlock id="zh-CN-input-select-3" title="以数组形式传入 Option" kind="live" />

### 多选

自 v2.28后，select 的选择器会自带 maxHeight 270，内容超出后可以通过垂直滚动查看。

配置`multiple`属性，可以支持多选

配置 `maxTagCount` 可以限制已选项展示的数量，超出部分将以+N 的方式展示

配置 `ellipsisTrigger` (>= v2.28.0) 对溢出部分的 tag 做自适应处理，当宽度不足时，最后一个tag内容作截断处理。开启该功能后会有一定性能损耗，不推荐在大表单场景下使用

配置 `expandRestTagsOnClick` (>= v2.28.0) 可以在设置 `maxTagCount` 情况下通过点击展示全剩余的tag

使用 `showRestTagsPopover` (>= v2.22.0) 可以设置在超出 `maxTagCount` 后，hover +N 是否显示 Popover，默认为 `false`。并且，还可以在 `restTagsPopoverProps` 属性中配置 Popover。

配置 `max` 属性可限制最大可选的数量，超出最大限制数量后无法选中，同时会触发 `exceed` 事件

<DemoBlock id="zh-CN-input-select-4" title="多选" kind="live" />

### 分组

用 OptGroup 进行分组（分组功能仅支持通过模板声明 Option 子组件 使用，不支持 optionList 方式传入）

<DemoBlock id="zh-CN-input-select-5" title="分组" kind="live" />

<DemoBlock id="zh-CN-input-select-6" title="分组" kind="live" />

### 不同尺寸

通过 Size 控制选择器的大小尺寸: `small` / `default` / `large`

<DemoBlock id="zh-CN-input-select-7" title="不同尺寸" kind="live" />

### 不同校验状态样式

validateStatus: default / warning / error
仅影响背景颜色等样式表现

<DemoBlock id="zh-CN-input-select-8" title="不同校验状态样式" kind="live" />

### 配置前缀、后缀、清除按钮

- 可以通过`prefix`传入选择框前缀，通过`suffix`传入选择框后缀，可以为文本或者 VNodeChild
  当 prefix、suffix 传入的内容为文本或者 Icon 时，会自动带上左右间隔，若为自定义 VNodeChild，则左右间隔为 0
- 通过`showClear`控制清除按钮是否展示
- 通过`showArrow`控制右侧下拉箭头是否展示

<DemoBlock id="zh-CN-input-select-9" title="配置前缀、后缀、清除按钮" kind="live" />

### 在顶部/底部渲染附加项

我们在弹出层顶部、底部分别预留了插槽，当你需要在弹出层中添加自定义 node 时
可以通过`#innerBottom`或者`#outerBottom`传入，自定义 node 将会被渲染在弹出层底部；可以通过`#innerTop`或者`#outerTop`传入，自定义 node 将会被渲染在弹出层顶部。

- `#innerTop` 和 `#innerBottom`将会被渲染在 optionList 内部，当滚动到 optionList 顶部/底部时展现
- `#outerTop` 和 `#outerBottom`将会被渲染为与 optionList 平级，无论 optionList 是否滚动，都会始终展现

<DemoBlock id="zh-CN-input-select-10" title="在顶部/底部渲染附加项" kind="live" />

通过 #outerTop 将内容插入顶部插槽

<DemoBlock id="zh-CN-input-select-11" title="在顶部/底部渲染附加项" kind="live" />

### 受控组件

传入 value 时 Select 为受控组件，所选中的值完全由 value 决定。

<DemoBlock id="zh-CN-input-select-12" title="受控组件" kind="live" />

### 动态修改 Options

如果需要动态更新 Options，应该使用受控的 value

<DemoBlock id="zh-CN-input-select-13" title="动态修改 Options" kind="live" />

### 联动

使用受控 value，实现不同 Select 之间的联动。如果是带有层级关系的复杂联动建议直接使用`Cascader`组件

<DemoBlock id="zh-CN-input-select-14" title="联动" kind="live" />

### 开启搜索

将 `filter` 置为 true，开启搜索能力。默认搜索策略将为 input 输入值与 option 的 label 值进行 include 对比
默认情况下，多选选中后会自动清空搜索关键字。若你希望保留，可以通过 autoClearSearchValue 设为 false 关闭默认行为（v2.3 后提供）

<DemoBlock id="zh-CN-input-select-15" title="开启搜索" kind="live" />

### 搜索框位置

默认搜索框展示于 Select 的 Trigger 触发器上。通过 `searchPosition` 可以指定不同的位置，可选 `dropdown`、`trigger`。 在 v2.61.0后提供
若希望定制位于 dropdown 中的 Input 搜索框的 placeholder，可以通过 `searchPlaceholder` 控制
若 `searchPosition` 值为 `trigger`，当showClear=true 时，点击Trigger区域的清空按钮，将同时清空已选项以及搜索框中的文本
若 `searchPosition` 值为 `dropdown`，当showClear=true 时，点击Trigger区域清空按钮，仅清空已选项。点击搜索框中的清空按钮，仅清空搜索文本

<DemoBlock id="zh-CN-input-select-16" title="搜索框位置" kind="live" />

### 远程搜索

带有远程搜索，防抖请求，加载状态的多选示例
通过`filter`开启搜索能力
将`remote`设置为 true 关闭对当前数据的筛选过滤
通过动态更新`optionList`更新下拉菜单中的备选项
使用受控的 value 属性

<DemoBlock id="zh-CN-input-select-17" title="远程搜索" kind="live" />

### 自定义搜索逻辑

可以将 `filter` 置为自定义函数，定制你想要的搜索策略
如下例子，选项 label 值都是大写，默认的检索策略是字符串 include 对比，会区分大小写。
通过传入自定义 `filter` 函数，检索时输入小写字母也能搜到相应内容。

<DemoBlock id="zh-CN-input-select-18" title="自定义搜索逻辑" kind="live" />

### 自定义已选项标签渲染

默认情况下，选中选项后会将 option.label 或 Option 默认插槽 的内容回填到选择框中
可以通过 `#selectedItem="{ option, index }"` 自定义选择框中已选项标签的渲染结构

- 插槽参数 `option` 是当前选项，`index` 是已选项索引
- 多选项的移除和交互仍由 Select 管理，插槽只负责内容渲染
- isRenderInTag 为 true 时，会自动将 content 包裹在 Tag 中渲染（带有背景色以及关闭按钮）
- isRenderInTag 为 false 时，将直接渲染返回的 content

<DemoBlock id="zh-CN-input-select-19" title="自定义已选项标签渲染" kind="live" />

### 自定义弹出层样式

你可以通过 dropdownClassName、dropdownStyle 控制弹出层的样式
例如当自定义弹出层的宽度时，可以通过 dropdownStyle 传入 width

<DemoBlock id="zh-CN-input-select-20" title="自定义弹出层样式" kind="live" />

### 获取选项的其他属性

默认情况下 `change` 事件只返回 value；如果需要选中节点的其他属性，可以启用 `onChangeWithObject`。
此时 `change` 事件的入参是包含 option 属性的对象，例如 `{ value, label, ...rest }`。

<DemoBlock id="zh-CN-input-select-21" title="获取选项的其他属性" kind="live" />

### 创建条目

设置`allowCreate`，可以创建并选中选项中不存在的条目
允许通过 `#createItem="{ inputValue, focused, style }"` 自定义创建项；使用虚拟列表时应将作用域中的 style 绑定到根元素。
可以配合`defaultActiveFirstOption`属性使用，自动选中第一项，当输入完内容直接回车时，可立即创建

<DemoBlock id="zh-CN-input-select-22" title="创建条目" kind="live" />

### 虚拟化

传入`virtualize`时开启列表虚拟化，用于大量 Option 节点的情况优化性能
virtualize 是一个包含下列值的对象：

- height: Option 列表高度值，默认 270 (v2.20.8 前为 300)
- width: Option 列表宽度值，默认 100%
- itemSize: 每行 Option 的高度，必传

<DemoBlock id="zh-CN-input-select-23" title="虚拟化" kind="code" />

<DemoBlock id="zh-CN-input-select-24" title="虚拟化" kind="live" />

### 自定义触发器

如果默认触发器不能满足需求，可以使用 `#trigger` 作用域插槽自定义展示。
如果想保留搜索筛选能力，又不希望自己渲染 Input 相关的结构，可以同时通过 searchPosition='dropdown'，将默认的搜索框置于下拉列表中

`trigger` 插槽参数如下

<DemoBlock id="zh-CN-input-select-25" title="自定义触发器" kind="code" />

<DemoBlock id="zh-CN-input-select-26" title="自定义触发器" kind="live" />

下例是更复杂的例子：复用了 TagInput 拖拽排序能力，通过 `trigger` 插槽为 Select 增加排序

<DemoBlock id="zh-CN-input-select-27" title="自定义触发器" kind="live" />

### 自定义候选项渲染

- 简单的自定义：通过 Option 的 label 属性或默认插槽传入内容，你可以控制候选项的渲染，此时内容会自动带上内边距、背景色等样式
- 完全自定义：通过 `#option` 作用域插槽可以接管候选项渲染，并从插槽参数中获取相关状态。实现更高自由度的结构渲染
  注意事项：

1.  插槽参数中的 `style` 需要绑定到自定义内容的根元素，否则虚拟化场景无法正确定位。
2.  插槽参数中的 `class` 与 `onMouseenter` 也需要绑定到根元素，确保键盘高亮与鼠标交互一致。
3.  选中（`selected`）、聚焦（`focused`）、禁用（`disabled`）等状态可从插槽参数读取，自定义内容需自行应用相应样式。
4.  自定义根元素需要调用插槽参数提供的 `onClick`；不要在 `#option` 中再次嵌套 `Select.Option`。

<DemoBlock id="zh-CN-input-select-28" title="自定义候选项渲染" kind="live" />

<DemoBlock id="zh-CN-input-select-29" title="自定义候选项渲染" kind="code" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/select/types.ts` 的公开类型为准。

- `v-model` 对应 `modelValue`；单选和多选值由 `SelectModelValue` 统一约束。

#### Vue 事件

**Select**

| 事件                  | 参数                           | 说明                 |
| --------------------- | ------------------------------ | -------------------- |
| change                | [value: SelectModelValue]      | 选中值变化           |
| select / deselect     | [value, option]                | 选择或取消选择候选项 |
| create                | [option: SelectOptionProps]    | 创建候选项           |
| clear                 | []                             | 清除当前值           |
| dropdownVisibleChange | [visible: boolean]             | 下拉层显隐变化       |
| search                | [value: string, event?: Event] | 搜索文本变化         |
| listScroll            | [event: Event]                 | 候选列表滚动         |
| exceed                | [option: SelectOptionProps]    | 选择数量超过 max     |
| focus / blur          | [event: FocusEvent]            | 获得或失去焦点       |

#### Vue 插槽

**Select**

| 插槽                   | 作用域参数                                                                | 说明                     |
| ---------------------- | ------------------------------------------------------------------------- | ------------------------ |
| default                | {}                                                                        | Option / OptGroup 子组件 |
| trigger                | { value, inputValue, disabled, placeholder, onSearch, onClear, onRemove } | 自定义触发器             |
| option                 | SelectOptionRenderProps                                                   | 自定义候选项             |
| selectedItem           | { option, index }                                                         | 自定义已选项             |
| createItem             | { inputValue, focused, style }                                            | 自定义创建项             |
| prefix / suffix        | {}                                                                        | 触发器前缀或后缀         |
| arrowIcon / clearIcon  | {}                                                                        | 下拉或清除图标           |
| emptyContent           | {}                                                                        | 空状态内容               |
| innerTop / innerBottom | {}                                                                        | 候选列表内部附加内容     |
| outerTop / outerBottom | {}                                                                        | 候选列表外部附加内容     |
| insetLabel             | {}                                                                        | 内嵌标签                 |

### Select Props

| 属性                     | 说明                                                                                                                                                                                                      | 类型                                                                       | 默认值                 | 版本   |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------- | ------ |
| ariaDescribedby          | —                                                                                                                                                                                                         | string                                                                     | —                      |        |
| ariaErrormessage         | —                                                                                                                                                                                                         | string                                                                     | —                      |        |
| ariaInvalid              | —                                                                                                                                                                                                         | boolean \| 'false' \| 'true' \| 'grammar' \| 'spelling'                    | —                      |        |
| ariaLabelledby           | —                                                                                                                                                                                                         | string                                                                     | —                      |        |
| ariaRequired             | —                                                                                                                                                                                                         | boolean                                                                    | —                      |        |
| id                       | —                                                                                                                                                                                                         | string                                                                     | —                      |        |
| autoFocus                | 初始渲染时是否自动 focus                                                                                                                                                                                  | boolean                                                                    | false                  |        |
| autoClearSearchValue     | 选中选项后，是否自动清空搜索关键字，当 mutilple、filter 都开启时生效                                                                                                                                      | boolean                                                                    | true                   | 2.3.0  |
| autoAdjustOverflow       | 浮层被遮挡时是否自动调整方向（暂时仅支持竖直方向，且插入的父级为 body）                                                                                                                                   | boolean                                                                    | true                   |        |
| allowCreate              | 是否允许用户创建新条目，需配合 filter 使用。该项为true时不再响应 optionList的变更                                                                                                                         | boolean                                                                    | false                  |        |
| borderless               | 无边框模式 &gt;=2.33.0                                                                                                                                                                                    | boolean                                                                    | —                      |        |
| clickToHide              | 已展开时，点击选择框是否自动收起下拉列表                                                                                                                                                                  | boolean                                                                    | false                  |        |
| defaultActiveFirstOption | 是否默认高亮第一个选项（按回车可直接选中） **v2.17.0 之后默认值从 false 变为 true**                                                                                                                       | boolean                                                                    | true                   |        |
| defaultOpen              | 是否默认展开下拉列表                                                                                                                                                                                      | boolean                                                                    | false                  |        |
| defaultValue             | 初始选中的值                                                                                                                                                                                              | SelectModelValue                                                           | —                      |        |
| disabled                 | 是否禁用                                                                                                                                                                                                  | boolean                                                                    | false                  |        |
| dropdownClassName        | 弹出层的 className                                                                                                                                                                                        | HTMLAttributes['class']                                                    | —                      |        |
| dropdownMargin           | 弹出层计算溢出时的增加的冗余值，详见[issue#549](https://github.com/aifuxi/semi-ui-vue/issues/549)，作用同 Tooltip margin                                                                                  | number \| TooltipMargin                                                    | —                      | 2.25.0 |
| dropdownMatchSelectWidth | 下拉菜单最小宽度是否等于 Select                                                                                                                                                                           | boolean                                                                    | true                   |        |
| dropdownStyle            | 弹出层的样式                                                                                                                                                                                              | StyleValue                                                                 | —                      |        |
| ellipsisTrigger          | 当 maxTagCount 存在且为多选时，是否对溢出部分的 tag 做自适应处理(当宽度不足时，最后一个tag内容作截断处理)。开启该功能后会有一定性能损耗，不推荐在大表单场景下使用                                         | boolean                                                                    | false                  | 2.28.0 |
| emptyContent             | 无结果时展示的内容。设为 null 时，下拉列表将不展示                                                                                                                                                        | VNodeChild \| null                                                         | —                      |        |
| expandRestTagsOnClick    | 当maxTagCount存在且为多选时，select 在面板打开状态下是否展开多余的 Tag                                                                                                                                    | boolean                                                                    | false                  | 2.28.0 |
| filter                   | 是否可搜索，默认为 false。传入 true 时，代表开启搜索并采用默认过滤策略（label 是否与 sugInput 匹配），传入值为函数时，会接收 sugInput, option 两个参数，当 option 符合筛选条件应返回 true，否则返回 false | boolean \| ((inputValue: string, option: SelectOptionProps) =&gt; boolean) | false                  |        |
| getPopupContainer        | 指定父级 DOM，弹层将会渲染至该 DOM 中，自定义需要设置 `position: relative` 这会改变浮层 DOM 树位置，但不会改变视图渲染位置。                                                                              | () =&gt; HTMLElement                                                       | () =&gt; document.body |        |
| inputProps               | filter 为 true 时, input 输入框的额外配置参数，具体可配置属性请参考 Input 组件（注意：请不要传入 value、ref、change 或 focus 监听器，否则会覆盖 Select 的内部交互）                                       | SelectInputProps                                                           | —                      | 2.2.0  |
| insetLabelId             | —                                                                                                                                                                                                         | string                                                                     | —                      |        |
| loading                  | 下拉列表是否展示加载动画                                                                                                                                                                                  | boolean                                                                    | false                  |        |
| max                      | 最多可选几项，仅在多选模式下生效                                                                                                                                                                          | number                                                                     | —                      |        |
| maxHeight                | 下拉菜单中 `optionList` 的最大高度。**注意：当使用虚拟化列表且 virtualize.height 大于默认值 270px 时，需要将 maxHeight 设置为与 virtualize.height 相同的值，以避免出现双滚动条问题**                      | string \| number                                                           | 270                    |        |
| maxTagCount              | 多选模式下，已选项超出 maxTagCount 时，后续选项会被渲染成+N 的形式                                                                                                                                        | number                                                                     | —                      |        |
| modelValue               | —                                                                                                                                                                                                         | SelectModelValue                                                           | —                      |        |
| motion                   | —                                                                                                                                                                                                         | boolean                                                                    | —                      |        |
| mouseEnterDelay          | —                                                                                                                                                                                                         | number                                                                     | —                      |        |
| mouseLeaveDelay          | —                                                                                                                                                                                                         | number                                                                     | —                      |        |
| multiple                 | 是否多选                                                                                                                                                                                                  | boolean                                                                    | false                  |        |
| onChangeWithObject       | 是否将选中项 option 的其他属性作为回调。设为 true 时，change 事件的入参会从 string 变为 object: { value, label, ...rest }                                                                                 | boolean                                                                    | false                  |        |
| optionList               | 可以通过该属性传入 Option,请确保数组内每个元素都具备 label、value 属性                                                                                                                                    | SelectOptionProps[]                                                        | —                      |        |
| placeholder              | 选择框默认文字                                                                                                                                                                                            | VNodeChild                                                                 | —                      |        |
| position                 | 菜单展开的位置，可选项同 Tooltip position                                                                                                                                                                 | TooltipPosition                                                            | 'bottomLeft'           |        |
| preventScroll            | 指示浏览器是否应滚动文档以显示新聚焦的元素，作用于组件内的 focus 方法                                                                                                                                     | boolean                                                                    | —                      |        |
| rePosKey                 | 可以更新该项值手动触发弹出层的重新定位                                                                                                                                                                    | string \| number                                                           | —                      |        |
| restTagsPopoverProps     | Popover 的配置属性，可以控制 position、zIndex、trigger 等，具体参考[Popover](/zh-CN/show/popover#API%20%E5%8F%82%E8%80%83)                                                                                | Partial&lt;TooltipProps&gt;                                                | {}                     | 2.22.0 |
| remote                   | 是否开启远程搜索，当 remote 为 true 时，input 内容改变后不会进行本地筛选匹配                                                                                                                              | boolean                                                                    | false                  |        |
| searchPlaceholder        | —                                                                                                                                                                                                         | string                                                                     | —                      |        |
| searchPosition           | filter开启时，搜索框的位置，默认在 trigger中，可以通过设为 'dropdown' 将搜索框置于下拉列表顶部。搭配 `trigger` 插槽 使用可以实现更高自由度的交互                                                          | SelectSearchPosition                                                       | 'trigger'              | 2.61.0 |
| showArrow                | 是否展示下拉箭头                                                                                                                                                                                          | boolean                                                                    | true                   |        |
| showClear                | 是否展示清除按钮                                                                                                                                                                                          | boolean                                                                    | false                  |        |
| showRestTagsPopover      | 当超过 maxTagCount，hover 到 +N 时，是否通过 Popover 显示剩余内容                                                                                                                                         | boolean                                                                    | false                  | 2.22.0 |
| size                     | 大小，可选值 `default`/`small`/`large`                                                                                                                                                                    | SelectSize                                                                 | 'default'              |        |
| spacing                  | 浮层与选择器的距离                                                                                                                                                                                        | number \| TooltipSpacing                                                   | 4                      |        |
| stopPropagation          | 是否阻止浮层上的点击事件冒泡                                                                                                                                                                              | boolean                                                                    | true                   |        |
| validateStatus           | 校验结果，可选`warning`、`error`、 `default`（只影响样式背景色）                                                                                                                                          | SelectValidateStatus                                                       | 'default'              |        |
| value                    | 当前选中的的值,传入该值时将作为受控组件，配合 `v-model` 或 `change` 事件使用                                                                                                                              | SelectModelValue                                                           | —                      |        |
| virtualize               | 列表虚拟化，用于大量节点的情况优化性能表现，由 height, width, itemSize 组成。**注意：当 height 大于默认值 270px 时，需同时设置 maxHeight 为相同值**                                                       | SelectVirtualizeProps                                                      | —                      |        |
| zIndex                   | 弹层的 zIndex                                                                                                                                                                                             | number                                                                     | 1030                   |        |

### Option Props

---

> **不同 Option 的 label 必须唯一，不允许重复**

| 属性     | 说明                                                              | 类型                    | 默认值 |
| -------- | ----------------------------------------------------------------- | ----------------------- | ------ |
| value    | 属性值                                                            | SelectPrimitive         | —      |
| label    | 展示的文本。渲染时优先取 label，若无则取默认插槽、value，依次降级 | VNodeChild              | —      |
| disabled | 是否禁用                                                          | boolean                 | false  |
| showTick | 被选中时，展示 √ 的 Icon                                          | boolean                 | true   |
| class    | 样式类名                                                          | HTMLAttributes['class'] | —      |
| style    | 样式                                                              | StyleValue              | —      |

### OptGroup Props

---

| 属性  | 说明       | 类型                    |
| ----- | ---------- | ----------------------- |
| label | 展示的文本 | VNodeChild              |
| class | 样式类名   | HTMLAttributes['class'] |
| style | 样式       | StyleValue              |

## Methods

绑定在组件实例上的方法，可以通过 ref 调用实现某些特殊交互

| 方法                                | 说明                                                  | 版本    |
| ----------------------------------- | ----------------------------------------------------- | ------- |
| close                               | 调用时可以手动关闭下拉列表                            |         |
| open                                | 调用时可以手动展开下拉列表                            |         |
| focus                               | 调用时可以手动聚焦                                    |         |
| clearInput                          | 调用时可以手动清空 input 搜索框的值                   |         |
| deselectAll                         | 调用时可以手动清空所有已选项                          |         |
| selectAll                           | 调用时可以选中所有 Option                             |         |
| search(value: string, event: event) | 可通过 ref 调用该方法进行搜索，该搜索值会被置给 Input | v2.35.0 |
| rePosition                          | 调用时可以手动触发下拉层重新定位                      |         |

## Accessibility

### ARIA

- Select trigger 的 role 为 combobox，弹出层的 role 为 listbox，可选项的 role 为 option
- Select trigger 具有 aria-haspopup、aria-expanded、aria-controls 属性，表示 trigger 与弹出层的关系
- 多选时，listbox aria-multiselectable 为 true，表示当前可以多选
- Option 选中时，aria-selected 为 true；当 Option 禁用时，aria-disabled 为 true
- 属性 aria-activedescendant 能够保证在朗读旁白时识别到当前的选择的 option(更多用法请参考[Managing Focus in Composites Using aria-activedescendant](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_focus_activedescendant))

### 键盘和焦点

**不带 Filter 功能的 Select：**

- Select 聚焦后，键盘用户可以通过 `上箭头` 或 `下箭头` 或 `Enter` 键打开下拉菜单，并将焦点自动聚焦到下拉菜单中的第一个选项上（`defaultActiveFirstOption` 默认为 true）
- 当下拉菜单打开时：
- 使用 `Esc` 键或 `Tab` 键可以关闭菜单
- 使用 `上箭头` 或 `下箭头` 可以切换选项
- 被聚焦的选项可以通过 Enter 键选中，并收起面板
- 当焦点在下拉菜单中，且用户使用的 `#innerBottom` 或 `#outerBottom` 属性的自定义 slot 中含有可交互元素时：
- 可以使用 `Tab` 键切换到这些可交互元素上
- 当焦点在自定义 slot 的首个可交互元素上时，使用 `Shift` + `Tab`，焦点回到 Select 框上

**带 Filter 功能的 Select：**

- Select 聚焦后，键盘用户可以通过 `上箭头` 或 `下箭头` 或 `Enter` 键打开下拉菜单。此时焦点仍然处于 Select 框，用户可以输入内容，同时也能使用 `上箭头` 或 `下箭头` 切换选项
- 当下拉菜单打开时：键盘交互与不带 Filter 功能的 Select 一致
- 当焦点在 Select 框上，且用户使用的 `#innerBottom` 或 `#outerBottom` 属性的自定义 slot 中含有可交互元素时：
- 可以使用 `Tab` 键切换到这些可交互元素上
- 当焦点在自定义 slot 的首个可交互元素上时，使用 `Shift` + `Tab`，焦点回到 Select 框上

## 文案规范

- 选择器标签
- 用 1-3 个词描述需要用户所做的输入
- 使用语句书写规范（首字母大写，其余小写）
- 避免使用标点符号和介词（“the”, “an”, “a”）
- 标签需是独立语句。不要让标签是前半句语句，选项是后半句语句。
- 使用描述性语句，而不是指示性语句。如果选项需要更多解释，可以在选择框下使用帮助文本。
- 选择器选项
- 如果没有默认选项，就使用“Select”做占位文案
- 选项要按首字母顺序或者其他有逻辑的排列顺序，使用户更好地找到选项
- 使用语句书写规范（首字母大写，其余小写），避免在句尾使用逗号和分号
- 清晰表达出选项所表示的选择目的

## TypeScript 泛型支持

Vue 模板不能传入组件泛型；请用 `SelectModelValue` 收窄 `change` 事件或 `v-model` 的值类型。

<DemoBlock id="zh-CN-input-select-30" title="TypeScript 泛型支持" kind="code" />

根据单选或多选模式对 `SelectModelValue` 做类型收窄后，再写入业务状态。

## FAQ

- **为什么 Semi 的 Select 要求 label 必须唯一，而不是 value 必须唯一?**

- 首先，我们一定需要一个唯一标识符用来做选中的判断。几乎所有 UI 库，对 Select.Option 使用时，最低要求都只会要求传入 label、value 两个值，而不会再单独要求传入一个 key（过于繁琐）。Semi 延续了这个设定
- 那么为什么在 Semi 中 用 label 而不是 value 呢？
- 以 value 还是 label 作为唯一判断符，**本质上是 用户直觉 vs 研发直觉 的取舍**。以 value 为唯一判断比较符合工程师直觉，但站在用户视角来看，他们能看到的只有 label，对 value 基本上是无感知的。
- label 是用户唯一能感知的内容。从交互的角度而言，如果出现两个或多个展示上一模一样的选项，对用户而言，他们看上去是一样的，无法进行区分。用户第一反应往往是重复了，这个系统是不是出 bug 了。其次如果两个 option 展示上一模一样，但选中的作用又不一样（例如一个 value 为 0，另一个为 1，他们的处理逻辑完全不同）的话，也会让用户非常困惑。在现实生活的线下实体表单里，基本不可能出现两个一模一样的选项。
- 假如我们以 value 作为判断符，以下例子，用户点击了 A 进行选中，实际上却看到 A、B、C 都被同时选中了。同样也会非常困惑，第一反应也往往是系统出 bug 了。

```

```

- label 唯一、value 重复，在日常使用中会更为常见。例如，一个根据 app 名称选择公司 id 的选择器，value 是 app 对应的公司 id，label 是 app 的名称。

```

```

- 分组情况下，重复 label 并不会造成用户困惑为什么仍要求 label 必须唯一？
- 选择面板打开情况下，确实不会造成用户使用上的困惑，但是选择面板收起后，重复 label 属于哪个分组对用户而言仍具有迷惑性。
- 我的数据里确实就有多个 label 一样的选项，无法避免。这个交互能绕过吗？
- 可以。我们不推荐向用户展示重复的 label option，但如果你确定你需要这么做，当你往 label 传入 VNodeChild 类型时，可以绕过这个限制。

- **可搜索的 Select，使用远程数据动态更新`optionList`，为什么在异步请求完成之前有时候会出现暂无数据？**
  请检查是否设置了`:remote="true"`，不设置 remote 的情况下，默认会将 input 框输入值与当前的 optionList 进行一次对比筛选，如果无匹配时，就会显示暂无数据。
  可以通过设置 remote 为 true 关闭对本地当前数据的匹配筛选。

- **通过 Option 子组件声明 Option，label 为 i18n 后的内容，切换 locale 后未能重新渲染**

- 通过 Option 子组件声明 Options 时，由于是 VNodeChild，不可能用 deepEqual 来做对比判断内容是否有更新（性能消耗过大），所以会收集 Option 子组件的 key，当 key 不变时，就认为 Options 都没有发生变化，不会走重新收集数据的流程。你可以将 locale 也作为 Option key 的一部分。
- 使用 optionList 方式传入，也可以解决问题。因为对于 object 形式传入，key 相对有限，Select 内部会使用 isEqual 来判断是否发生变化

- **通过 Option 子组件声明 Option，动态切换 disabled 属性后未能重新渲染**

- 原因同上，你可以重新给 Option 设定不同的 key 值，或者使用 optionList 方式声明候选项

- **Select 会自动限制下拉菜单的宽度吗？**

- 会给 minWidth，但不会写死 width。如果有需要的话，可以自己通过 dropdownStyle 来添加。

- **设置 allowCreate 后，动态更新 optionList 或 Option 子组件 不生效**
- allowCreate 主要用于本地创建的场景，开启该项后，相当于强接管了 optionList / Option 子组件，不会再响应外部对这两类值的更新。
- **为什么单选选择选项后没有触发 blur 事件？**
- 在 V2.17.0 前，Select 单选选择后，会触发 Select 的 blur 事件。
- 在 V2.17.0 后，Select 增加了 A11y 支持，不会触发 Select 的 blur 事件。
- 单选选择中，Select 浮层关闭，依然保持焦点在 trigger（此时可以通过 Enter 回车键再次打开 Select 浮层）
- 无论单选或多选，按下 Esc，仅 Select 浮层关闭，trigger 保持焦点（此时可以通过 Enter 回车键再次打开 Select 浮层）
