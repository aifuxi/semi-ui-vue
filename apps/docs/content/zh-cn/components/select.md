---
title: '选择器'
description: '用户可以通过 Select 选择器从一个选项集合中去选中一个或多个选项，并呈现最终选择结果'
locale: 'zh-CN'
slug: 'select'
category: 'input'
order: 46
englishTitle: 'Select'
icon: 'doc-select'
upstream: 'input/select'
---

## 代码演示

### 如何引入

```ts
import { Select } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
```

> Select的直接子元素必须为 Option 或者 OptGroup，不允许为其他Element

### 基本使用

每个 Option 标签都必须声明 value 属性，Option 的 children 或 label 将会被渲染至下拉列表中

::demo-block{demo="select/zh-cn/Basic" title="基本使用"}
::

### 以数组形式传入 Option

可以直接通过`optionList`传入一个对象数组，每个对象必须包含 value/label 属性（当然其他属性也可以通过此方式传入）

::demo-block{demo="select/zh-cn/Options" title="以数组形式传入 Option"}
::

### 多选

自 v2.28后，select 的选择器会自带 maxHeight 270，内容超出后可以通过垂直滚动查看。

配置`multiple`属性，可以支持多选

配置 `maxTagCount` 可以限制已选项展示的数量，超出部分将以+N 的方式展示

配置 `ellipsisTrigger` (>= v2.28.0) 对溢出部分的 tag 做自适应处理，当宽度不足时，最后一个tag内容作截断处理。开启该功能后会有一定性能损耗，不推荐在大表单场景下使用

配置 `expandRestTagsOnClick` (>= v2.28.0) 可以在设置 `maxTagCount` 情况下通过点击展示全剩余的tag

使用 `showRestTagsPopover` (>= v2.22.0) 可以设置在超出 `maxTagCount` 后，hover +N 是否显示 Popover，默认为 `false`。并且，还可以在 `restTagsPopoverProps` 属性中配置 Popover。

配置 `max` 属性可限制最大可选的数量，超出最大限制数量后无法选中，同时会触发`@exceed`回调

::demo-block{demo="select/zh-cn/Multiple" title="多选"}
::

### 分组

用 OptGroup 进行分组（分组功能仅支持通过 jsx 方式声明 children 使用，不支持 optionList 方式传入）

> 1. OptGroup 必须为 Select 的直接子元素，不允许有 Fragment 或 DIV 等其他元素阻隔
> 2. 若 Select 的 children 需要动态更新，OptGroup 上的 key 也需要进行更新，否则 Select 无法识别

::demo-block{demo="select/zh-cn/Groups" title="分组"}
::

::demo-block{demo="select/zh-cn/GroupData" title="分组"}
::

### 不同尺寸

通过 Size 控制选择器的大小尺寸: `small` / `default` / `large`

::demo-block{demo="select/zh-cn/Size" title="不同尺寸"}
::

### 不同校验状态样式

validateStatus: default / warning / error  
仅影响背景颜色等样式表现

::demo-block{demo="select/zh-cn/Validation" title="不同校验状态样式"}
::

### 配置前缀、后缀、清除按钮

- 可以通过`#prefix`传入选择框前缀，通过`#suffix`传入选择框后缀，可以为文本或者 VNodeChild  
  当 prefix、suffix 传入的内容为文本或者 Icon 时，会自动带上左右间隔，若为自定义 VNodeChild，则左右间隔为 0
- 通过`showClear`控制清除按钮是否展示
- 通过`showArrow`控制右侧下拉箭头是否展示

::demo-block{demo="select/zh-cn/Affixes" title="配置前缀、后缀、清除按钮"}
::

### 在顶部/底部渲染附加项

我们在弹出层顶部、底部分别预留了插槽，当你需要在弹出层中添加自定义 node 时  
可以通过`#innerBottom`或者`#outerBottom`传入，自定义 node 将会被渲染在弹出层底部；可以通过`#innerTop`或者`#outerTop`传入，自定义 node 将会被渲染在弹出层顶部。

- `#innerTop` 和 `#innerBottom`将会被渲染在 optionList 内部，当滚动到 optionList 顶部/底部时展现
- `#outerTop` 和 `#outerBottom`将会被渲染为与 optionList 平级，无论 optionList 是否滚动，都会始终展现

::demo-block{demo="select/zh-cn/BottomSlots" title="在顶部/底部渲染附加项"}
::

通过 #outerTop 将内容插入顶部插槽

::demo-block{demo="select/zh-cn/TopTabs" title="在顶部/底部渲染附加项"}
::

### 受控组件

传入 value 时 Select 为受控组件，所选中的值完全由 value 决定。

::demo-block{demo="select/zh-cn/Controlled" title="受控组件"}
::

### 动态修改 Options

如果需要动态更新 Options，应该使用受控的 value

::demo-block{demo="select/zh-cn/DynamicOptions" title="动态修改 Options"}
::

### 联动

使用受控 value，实现不同 Select 之间的联动。如果是带有层级关系的复杂联动建议直接使用`Cascader`组件

::demo-block{demo="select/zh-cn/Linkage" title="联动"}
::

### 开启搜索

将 `filter` 置为 true，开启搜索能力。默认搜索策略将为 input 输入值与 option 的 label 值进行 include 对比  
默认情况下，多选选中后会自动清空搜索关键字。若你希望保留，可以通过 autoClearSearchValue 设为 false 关闭默认行为（v2.3 后提供）

::demo-block{demo="select/zh-cn/Search" title="开启搜索"}
::

### 搜索框位置

默认搜索框展示于 Select 的 Trigger 触发器上。通过 `searchPosition` 可以指定不同的位置，可选 `dropdown`、`trigger`。 在 v2.61.0后提供
若希望定制位于 dropdown 中的 Input 搜索框的 placeholder，可以通过 `searchPlaceholder` 控制  
若 `searchPosition` 值为 `trigger`，当showClear=true 时，点击Trigger区域的清空按钮，将同时清空已选项以及搜索框中的文本  
若 `searchPosition` 值为 `dropdown`，当showClear=true 时，点击Trigger区域清空按钮，仅清空已选项。点击搜索框中的清空按钮，仅清空搜索文本

::demo-block{demo="select/zh-cn/SearchPosition" title="搜索框位置"}
::

### 远程搜索

带有远程搜索，防抖请求，加载状态的多选示例  
通过`filter`开启搜索能力  
将`remote`设置为 true 关闭对当前数据的筛选过滤
通过动态更新`optionList`更新下拉菜单中的备选项  
使用受控的 value 属性

::demo-block{demo="select/zh-cn/Remote" title="远程搜索"}
::

### 自定义搜索逻辑

可以将 `filter` 置为自定义函数，定制你想要的搜索策略  
如下例子，选项 label 值都是大写，默认的检索策略是字符串 include 对比，会区分大小写。  
通过传入自定义 `filter` 函数，检索时输入小写字母也能搜到相应内容。

::demo-block{demo="select/zh-cn/CustomFilter" title="自定义搜索逻辑"}
::

### 自定义已选项标签渲染

默认回填选项 label 或默认插槽内容。使用 `#selectedItem="{ option, index }"` 自定义已选项内容：单选直接展示插槽，多选位于内建 Tag 内容区，并保留内建关闭按钮。当前不支持 React `isRenderInTag: false` 的外层 Tag 替换。下例分别展示单选头像与邮箱、圆形头像标签、方形头像标签。

::demo-block{demo="select/zh-cn/SelectedItem" title="自定义已选项标签渲染"}
::

### 自定义弹出层样式

你可以通过 dropdownClassName、dropdownStyle 控制弹出层的样式  
例如当自定义弹出层的宽度时，可以通过 dropdownStyle 传入 width

::demo-block{demo="select/zh-cn/DropdownStyle" title="自定义弹出层样式"}
::

### 获取选项的其他属性

默认情况下`@change`只能拿到 value，如果需要拿选中节点的其他属性，可以使用`onChangeWithObject`属性  
此时`@change`函数的入参将会是 object，包含 option 的各种属性，例如 `@change({ value, label, ...rest })`

> 当 onChangeWithObject 置为 true 时，`defaultValue` / `Value` 也应为 object，且须带有 `value`、`label` key

::demo-block{demo="select/zh-cn/ObjectValue" title="获取选项的其他属性"}
::

### 创建条目

设置`allowCreate`，可以创建并选中选项中不存在的条目  
允许通过 `#createItem` 自定义创建标签时的内容显示（通过返回 VNodeChild，注意你需要自定义样式），该函数默认值为 (input, isFocus, style) => '创建' + input  
可以配合`defaultActiveFirstOption`属性使用，自动选中第一项，当输入完内容直接回车时，可立即创建

> 当开启allowCreate后，不会再响应对Children或者optionList的更新

::demo-block{demo="select/zh-cn/Create" title="创建条目"}
::

### 虚拟化

传入`virtualize`时开启列表虚拟化，用于大量 Option 节点的情况优化性能  
virtualize 是一个包含下列值的对象：

- height: Option 列表高度值，默认 270 (v2.20.8 前为 300)
- width: Option 列表宽度值，默认 100%
- itemSize: 每行 Option 的高度，必传

> Semi Select virtualize 功能是基于 react-window 的封装，虚拟化列表默认会被包裹在 `will-change: transform` 的 div 内部。
> 在某些浏览器（例如 Chrome），某些特定的屏幕尺寸下，屏幕物理像素尺寸与浏览器处理的像素无法对齐时，会自动开启抗锯齿。从而导致虚拟列表中的文本字体可能会在特定场景下存在模糊的情况。
> will-change 对于复杂元素的渲染会有性能改善，所以我们默认不会对 react-window 的样式进行覆盖。如果你希望关闭这个效果，可以通过自行覆盖 CSS，将 will-change 设置为 unset 解决

> 当 virtualize.height 大于默认值 270px 时，为了避免出现双滚动条问题，需要将 maxHeight 属性设置为与 virtualize.height 相同的值。
> 例如：当设置 virtualize.height 为 400px 时，应同时设置 maxHeight={400}。

```css
.semi-select-option-list > div {
    will-change: unset !important; // 由于 react-window自带样式是内联的，所以这里用 important 覆盖
}
```

::demo-block{demo="select/zh-cn/Virtual" title="虚拟化"}
::

### 自定义触发器

如果 Select 默认的触发器样式满足不了你的需求，可以用`#trigger`自定义选择框的展示  
如果想保留搜索筛选能力，又不希望自己渲染 Input 相关的结构，可以同时通过 searchPosition='dropdown'，将默认的搜索框置于下拉列表中

#trigger 入参如下

```ts
export interface SelectTriggerSlotProps {
  value: SelectOptionRuntime[];
  inputValue: string;
  disabled: boolean;
  placeholder: VNodeChild;
  onSearch: (value: string, event?: Event) => void;
  onClear: (event: MouseEvent) => void;
  onRemove: (option: SelectOptionRuntime) => void;
}
```

::demo-block{demo="select/zh-cn/Trigger" title="自定义触发器"}
::

下例是更复杂的例子：复用了 TagInput 拖拽排序能力，通过 #trigger 为 Select 增加排序

::demo-block{demo="select/zh-cn/DraggableTrigger" title="自定义触发器"}
::

### 自定义候选项渲染

简单自定义可在 `SelectOption` 默认插槽提供内容，保留内建选项样式。完全自定义使用 `#option="option"`：将 `option.style`、`option.class` 和 `@mouseenter="option.onMouseenter"` 绑定在外层，点击时调用 `option.onClick`，并根据 selected、focused、disabled 设置样式及 ARIA。虚拟化需要保留传入 style；不要遗漏键盘聚焦回调。

::demo-block{demo="select/zh-cn/CustomOption" title="自定义候选项渲染"}
::

```scss
.components-select-demo-renderOptionItem {
  .custom-option-render {
    display: flex;
    font-size: 14px;
    line-height: 20px;
    word-break: break-all;
    padding-left: 12px;
    padding-right: 12px;
    padding-top: 8px;
    padding-bottom: 8px;
    color: var(--semi-color-text-0);
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
    box-sizing: border-box;
    .option-right {
      margin-left: 8px;
      display: inline-flex;
      align-items: center;
    }
    &:active {
      background-color: var(--semi-color-fill-1);
    }
    &-focused {
      background-color: var(--semi-color-fill-0);
    }
    &-selected {
      //font-weight: 700;
    }
    &-disabled {
      color: var(--semi-color-disabled-text);
      cursor: not-allowed;
    }
    &:first-of-type {
      margin-top: 4px;
    }
    &:last-of-type {
      margin-bottom: 4px;
    }
  }
}
```

## API 参考

### SelectProps

| 属性                       | 类型                                                                      | 默认值      | 说明                                                                                                                                                                                                      |
| -------------------------- | ------------------------------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ariaDescribedby`          | `string`                                                                  | `—`         | 关联描述节点 id。                                                                                                                                                                                         |
| `ariaErrormessage`         | `string`                                                                  | `—`         | 关联错误信息节点 id。                                                                                                                                                                                     |
| `ariaInvalid`              | `boolean \| 'false' \| 'true' \| 'grammar' \| 'spelling'`                 | `—`         | ARIA 无效状态。                                                                                                                                                                                           |
| `ariaLabelledby`           | `string`                                                                  | `—`         | 关联标签节点 id；模板写为 aria-labelledby。                                                                                                                                                               |
| `ariaRequired`             | `boolean`                                                                 | `—`         | ARIA 必填状态。                                                                                                                                                                                           |
| `id`                       | `string`                                                                  | `—`         | 组件节点 id。                                                                                                                                                                                             |
| `autoFocus`                | `boolean`                                                                 | `—`         | 初始渲染时是否自动 focus                                                                                                                                                                                  |
| `autoClearSearchValue`     | `boolean`                                                                 | `true`      | 选中选项后，是否自动清空搜索关键字，当 mutilple、filter 都开启时生效                                                                                                                                      |
| `autoAdjustOverflow`       | `boolean`                                                                 | `true`      | 浮层被遮挡时是否自动调整方向（暂时仅支持竖直方向，且插入的父级为 body）                                                                                                                                   |
| `allowCreate`              | `boolean`                                                                 | `false`     | 是否允许用户创建新条目，需配合 filter 使用。该项为true时不再响应 optionList的变更                                                                                                                         |
| `borderless`               | `boolean`                                                                 | `false`     | 无边框模式 >=2.33.0                                                                                                                                                                                       |
| `clickToHide`              | `boolean`                                                                 | `—`         | 已展开时，点击选择框是否自动收起下拉列表                                                                                                                                                                  |
| `defaultActiveFirstOption` | `boolean`                                                                 | `true`      | 是否默认高亮第一个选项（按回车可直接选中）                                                                                                                                                                |
| `defaultOpen`              | `boolean`                                                                 | `false`     | 是否默认展开下拉列表                                                                                                                                                                                      |
| `defaultValue`             | `SelectModelValue`                                                        | `—`         | 初始选中的值                                                                                                                                                                                              |
| `disabled`                 | `boolean`                                                                 | `false`     | 是否禁用                                                                                                                                                                                                  |
| `dropdownClassName`        | `HTMLAttributes['class']`                                                 | `—`         | 弹出层的 className                                                                                                                                                                                        |
| `dropdownMargin`           | `number \| TooltipMargin`                                                 | `—`         | 弹出层计算溢出时的增加的冗余值，详见[issue#549](https://github.com/DouyinFE/semi-design/issues/549)，作用同 Tooltip margin                                                                                |
| `dropdownMatchSelectWidth` | `boolean`                                                                 | `true`      | 下拉菜单最小宽度是否等于 Select                                                                                                                                                                           |
| `dropdownStyle`            | `StyleValue`                                                              | `—`         | 弹出层的样式                                                                                                                                                                                              |
| `ellipsisTrigger`          | `boolean`                                                                 | `—`         | 当 maxTagCount 存在且为多选时，是否对溢出部分的 tag 做自适应处理(当宽度不足时，最后一个tag内容作截断处理)。开启该功能后会有一定性能损耗，不推荐在大表单场景下使用                                         |
| `emptyContent`             | `VNodeChild \| null`                                                      | `—`         | 无结果时展示的内容。设为 null 时，下拉列表将不展示                                                                                                                                                        |
| `expandRestTagsOnClick`    | `boolean`                                                                 | `—`         | 当maxTagCount存在且为多选时，select 在面板打开状态下是否展开多余的 Tag                                                                                                                                    |
| `filter`                   | `boolean \| ((inputValue: string, option: SelectOptionProps) => boolean)` | `false`     | 是否可搜索，默认为 false。传入 true 时，代表开启搜索并采用默认过滤策略（label 是否与 sugInput 匹配），传入值为函数时，会接收 sugInput, option 两个参数，当 option 符合筛选条件应返回 true，否则返回 false |
| `getPopupContainer`        | `() => HTMLElement`                                                       | `—`         | 指定父级 DOM，弹层将会渲染至该 DOM 中，自定义需要设置 `position: relative` 这会改变浮层 DOM 树位置，但不会改变视图渲染位置。                                                                              |
| `inputProps`               | `SelectInputProps`                                                        | `—`         | 内部原生 input 的额外属性，类型排除 value 和 onInput。                                                                                                                                                    |
| `insetLabelId`             | `string`                                                                  | `—`         | 内嵌标签节点 id。                                                                                                                                                                                         |
| `loading`                  | `boolean`                                                                 | `—`         | 下拉列表是否展示加载动画                                                                                                                                                                                  |
| `max`                      | `number`                                                                  | `—`         | 最多可选几项，仅在多选模式下生效                                                                                                                                                                          |
| `maxHeight`                | `string \| number`                                                        | `270`       | 下拉菜单中 `optionList` 的最大高度。**注意：当使用虚拟化列表且 virtualize.height 大于默认值 270px 时，需要将 maxHeight 设置为与 virtualize.height 相同的值，以避免出现双滚动条问题**                      |
| `maxTagCount`              | `number`                                                                  | `—`         | 多选模式下，已选项超出 maxTagCount 时，后续选项会被渲染成+N 的形式                                                                                                                                        |
| `modelValue`               | `SelectModelValue`                                                        | `—`         | v-model 的受控值。                                                                                                                                                                                        |
| `motion`                   | `boolean`                                                                 | `true`      | 启用弹层进入和退出动效。                                                                                                                                                                                  |
| `mouseEnterDelay`          | `number`                                                                  | `—`         | 鼠标进入后显示延迟。                                                                                                                                                                                      |
| `mouseLeaveDelay`          | `number`                                                                  | `—`         | 鼠标离开后隐藏延迟。                                                                                                                                                                                      |
| `multiple`                 | `boolean`                                                                 | `false`     | 是否多选                                                                                                                                                                                                  |
| `onChangeWithObject`       | `boolean`                                                                 | `false`     | 是否将选中项 option 的其他属性作为回调。设为 true 时，@change 的入参类型会从 string 变为 object: { value, label, ...rest }                                                                                |
| `optionList`               | `SelectOptionProps[]`                                                     | `—`         | 可以通过该属性传入 Option,请确保数组内每个元素都具备 label、value 属性                                                                                                                                    |
| `placeholder`              | `VNodeChild`                                                              | `''`        | 选择框默认文字                                                                                                                                                                                            |
| `position`                 | `TooltipPosition`                                                         | `—`         | 菜单展开的位置，可选项同 Tooltip position                                                                                                                                                                 |
| `preventScroll`            | `boolean`                                                                 | `—`         | 指示浏览器是否应滚动文档以显示新聚焦的元素，作用于组件内的 focus 方法                                                                                                                                     |
| `rePosKey`                 | `string \| number`                                                        | `—`         | 可以更新该项值手动触发弹出层的重新定位                                                                                                                                                                    |
| `restTagsPopoverProps`     | `Partial<TooltipProps>`                                                   | `—`         | 剩余标签提示配置，以当前公开类型为准。Select 使用 Partial。                                                                                                                                               |
| `remote`                   | `boolean`                                                                 | `false`     | 是否开启远程搜索，当 remote 为 true 时，input 内容改变后不会进行本地筛选匹配                                                                                                                              |
| `searchPlaceholder`        | `string`                                                                  | `—`         | 搜索框的占位文本。                                                                                                                                                                                        |
| `searchPosition`           | `SelectSearchPosition`                                                    | `'trigger'` | filter开启时，搜索框的位置，默认在 trigger中，可以通过设为 'dropdown' 将搜索框置于下拉列表顶部。搭配 #trigger 使用可以实现更高自由度的交互                                                                |
| `showArrow`                | `boolean`                                                                 | `true`      | 是否展示下拉箭头                                                                                                                                                                                          |
| `showClear`                | `boolean`                                                                 | `false`     | 是否展示清除按钮                                                                                                                                                                                          |
| `showRestTagsPopover`      | `boolean`                                                                 | `false`     | 当超过 maxTagCount，hover 到 +N 时，是否通过 Popover 显示剩余内容                                                                                                                                         |
| `size`                     | `SelectSize`                                                              | `'default'` | 大小，可选值 `default`/`small`/`large`                                                                                                                                                                    |
| `spacing`                  | `number \| TooltipSpacing`                                                | `—`         | 浮层与选择器的距离                                                                                                                                                                                        |
| `stopPropagation`          | `boolean`                                                                 | `true`      | 是否阻止浮层上的点击事件冒泡                                                                                                                                                                              |
| `validateStatus`           | `SelectValidateStatus`                                                    | `'default'` | 校验结果，可选`warning`、`error`、 `default`（只影响样式背景色）                                                                                                                                          |
| `value`                    | `SelectModelValue`                                                        | `—`         | 属性值                                                                                                                                                                                                    |
| `virtualize`               | `SelectVirtualizeProps`                                                   | `—`         | 列表虚拟化，用于大量节点的情况优化性能表现，由 height, width, itemSize 组成。**注意：当 height 大于默认值 270px 时，需同时设置 maxHeight 为相同值**                                                       |
| `zIndex`                   | `number`                                                                  | `1030`      | 弹层的 zIndex                                                                                                                                                                                             |

### SelectOptionProps

| 属性       | 类型                      | 默认值 | 说明                     |
| ---------- | ------------------------- | ------ | ------------------------ |
| `value`    | `SelectPrimitive`         | `—`    | 属性值                   |
| `label`    | `VNodeChild`              | `—`    | 展示的文本               |
| `disabled` | `boolean`                 | `—`    | 是否禁用                 |
| `showTick` | `boolean`                 | `true` | 被选中时，展示 √ 的 Icon |
| `class`    | `HTMLAttributes['class']` | `—`    | Vue 类名。               |
| `style`    | `StyleValue`              | `—`    | 样式                     |

### SelectOptionGroupProps

| 属性    | 类型                      | 默认值 | 说明       |
| ------- | ------------------------- | ------ | ---------- |
| `label` | `VNodeChild`              | `—`    | 展示的文本 |
| `class` | `HTMLAttributes['class']` | `—`    | Vue 类名。 |
| `style` | `StyleValue`              | `—`    | 样式       |

### SelectVirtualizeProps

| 属性       | 类型               | 默认值 | 说明                      |
| ---------- | ------------------ | ------ | ------------------------- |
| `itemSize` | `number`           | `—`    | 每项的固定高度，单位 px。 |
| `height`   | `number`           | `—`    | 虚拟列表高度。            |
| `width`    | `string \| number` | `—`    | 虚拟列表宽度。            |

### 事件

| 事件                    | 参数                                                               |
| ----------------------- | ------------------------------------------------------------------ |
| `blur`                  | `[event: FocusEvent]`                                              |
| `change`                | `[value: SelectModelValue]`                                        |
| `clear`                 | `[]`                                                               |
| `create`                | `[option: SelectOptionProps]`                                      |
| `deselect`              | `[value: SelectPrimitive \| undefined, option: SelectOptionProps]` |
| `dropdownVisibleChange` | `[visible: boolean]`                                               |
| `exceed`                | `[option: SelectOptionProps]`                                      |
| `focus`                 | `[event: FocusEvent]`                                              |
| `listScroll`            | `[event: Event]`                                                   |
| `search`                | `[value: string, event?: Event]`                                   |
| `select`                | `[value: SelectPrimitive \| undefined, option: SelectOptionProps]` |
| `update:modelValue`     | `[value: SelectModelValue]`                                        |
| `update:value`          | `[value: SelectModelValue]`                                        |

模板中使用 `@dropdown-visible-change`（AutoComplete/Select）或 `@visible-change`（Cascader），其他 camelCase 事件同样转为 kebab-case。`onChangeWithObject` 是 Boolean prop，不是事件。

### 插槽

| 插槽            | 签名                                                                                            |
| --------------- | ----------------------------------------------------------------------------------------------- |
| `#default`      | `() => VNodeChild`                                                                              |
| `#arrowIcon`    | `() => VNodeChild`                                                                              |
| `#clearIcon`    | `() => VNodeChild`                                                                              |
| `#createItem`   | `(props: { inputValue: SelectPrimitive; focused: boolean; style?: StyleValue; }) => VNodeChild` |
| `#emptyContent` | `() => VNodeChild`                                                                              |
| `#innerBottom`  | `() => VNodeChild`                                                                              |
| `#innerTop`     | `() => VNodeChild`                                                                              |
| `#insetLabel`   | `() => VNodeChild`                                                                              |
| `#option`       | `(props: SelectOptionRenderProps) => VNodeChild`                                                |
| `#outerBottom`  | `() => VNodeChild`                                                                              |
| `#outerTop`     | `() => VNodeChild`                                                                              |
| `#prefix`       | `() => VNodeChild`                                                                              |
| `#selectedItem` | `(props: { option: SelectOptionRuntime; index: number }) => VNodeChild`                         |
| `#suffix`       | `() => VNodeChild`                                                                              |
| `#trigger`      | `(props: SelectTriggerSlotProps) => VNodeChild`                                                 |

### 相关类型

```ts
export type SelectPrimitive = string | number;
export type SelectValue = SelectPrimitive | Record<string, unknown>;
export type SelectModelValue = SelectValue | SelectValue[] | undefined;
export type SelectSize = 'small' | 'default' | 'large';
export type SelectSearchPosition = 'trigger' | 'dropdown';
export type SelectValidateStatus = 'default' | 'warning' | 'error';
export interface SelectOptionRuntime extends SelectOptionProps {
  _key?: PropertyKey;
  _parentGroup?: SelectOptionGroupRuntime;
  _scrollIndex: number;
  _selected: boolean;
  _show: boolean;
  _inputCreateOnly?: boolean;
  children?: VNodeChild;
}
export interface SelectOptionGroupRuntime extends SelectOptionGroupProps {
  _key?: PropertyKey;
}
export interface SelectInputProps extends Omit<InputHTMLAttributes, 'value' | 'onInput'> {
  class?: HTMLAttributes['class'];
}
export interface SelectOptionRenderProps extends SelectOptionRuntime {
  focused: boolean;
  selected: boolean;
  inputValue: string;
  onClick: (event: MouseEvent) => void;
  onMouseenter: (event: MouseEvent) => void;
}
export interface SelectTriggerSlotProps {
  value: SelectOptionRuntime[];
  inputValue: string;
  disabled: boolean;
  placeholder: VNodeChild;
  onSearch: (value: string, event?: Event) => void;
  onClear: (event: MouseEvent) => void;
  onRemove: (option: SelectOptionRuntime) => void;
}
```

## Methods

使用模板 ref 获取组件实例，调用公开方法。

```ts
export interface SelectExposed {
  clearInput(): void;
  close(): void;
  deselectAll(): void;
  focus(): void;
  open(): void;
  rePosition(): void;
  search(value: string, event?: Event): void;
  selectAll(): void;
}
```

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
  - 当焦点在自定义 slot 的首个可交互元素上时，使用 `Shift` + `Tab` ，焦点回到 Select 框上

**带 Filter 功能的 Select：**

- Select 聚焦后，键盘用户可以通过 `上箭头` 或 `下箭头` 或 `Enter` 键打开下拉菜单。此时焦点仍然处于 Select 框，用户可以输入内容，同时也能使用 `上箭头` 或 `下箭头` 切换选项
- 当下拉菜单打开时：键盘交互与不带 Filter 功能的 Select 一致
- 当焦点在 Select 框上，且用户使用的 `#innerBottom` 或 `#outerBottom` 属性的自定义 slot 中含有可交互元素时：
  - 可以使用 `Tab` 键切换到这些可交互元素上
  - 当焦点在自定义 slot 的首个可交互元素上时，使用 `Shift` + `Tab` ，焦点回到 Select 框上

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

## 设计变量

::token-table{component="select"}
::

## TypeScript 类型

Vue Select 的公开组件类型不接收 React `<Select<T>>` 泛型参数。使用 `SelectModelValue` 声明状态，在 change 回调中按业务类型缩窄；multiple 为 true 时仍应检查数组。

```ts
import { shallowRef } from 'vue';
import type { SelectModelValue } from '@aifuxi/semi-ui-vue/select';
const selected = shallowRef<string[]>([]);
function change(value: SelectModelValue) {
  if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
    selected.value = value;
  }
}
```

## 相关物料

相关组合可查看 [Form](/zh-cn/components/form/)。

## React → Vue 迁移

| React                                                                   | Vue                                                                                    |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `@douyinfe/semi-ui`                                                     | `@aifuxi/semi-ui-vue/select` + `@aifuxi/semi-theme-default/select.css`                 |
| `useState` / `useMemo` / `useCallback`                                  | `shallowRef` / `computed` / 局部函数                                                   |
| `value` + `onChange`                                                    | `v-model` / `v-model:value` / `:value` + `@change`                                     |
| `className` / `ReactNode`                                               | Vue `class` / `VNodeChild` 与插槽                                                      |
| `ref.current`                                                           | 模板 ref 的公开方法                                                                    |
| `Select.Option` / `Select.OptGroup`                                     | `SelectOption` / `SelectOptionGroup`                                                   |
| `renderOptionItem` / `renderCreateItem`                                 | `#option` / `#createItem`                                                              |
| `renderSelectedItem`                                                    | `#selectedItem="{ option, index }"`                                                    |
| `triggerRender`                                                         | `#trigger="{ value, inputValue, disabled, placeholder, onSearch, onClear, onRemove }"` |
| `innerTopSlot` / `outerTopSlot` / `innerBottomSlot` / `outerBottomSlot` | `#innerTop` / `#outerTop` / `#innerBottom` / `#outerBottom`                            |
| `isRenderInTag: false`                                                  | 当前插槽保留内建 Tag 外层及关闭按钮；外层替换未等价                                    |

异步与动态数据示例使用固定序列、固定延迟和请求序号，并在卸载时清理定时器；不发出真实网络请求。

自定义头像改用项目自有 `/demos/photo.svg`、`one.svg`、`two.svg`。英文示例顺序与中文不同，映射按演示语义记录。头像替换与自定义 Tag 外层 DOM 差异尚未完成视觉验收。

## FAQ

### 为什么 label 应保持唯一？

Foundation 使用 label 识别选项。相同显示文字也会让用户无法区分候选项；不同应用可以共享公司 value，但 label 应各不相同。分组收起后仍需要可区分的标签。复杂 VNode 标签应使用稳定的身份，并优先为用户提供明确文本。

### 远程请求完成前为什么显示暂无数据？

配置 remote，关闭对当前 optionList 的本地匹配；通过 loading 呈现等待状态，并按最新请求序号接收结果。

### 切换语言后如何更新选项文本？

使用响应式 optionList，或让 SelectOption 的 label/文本和稳定 key 一同体现语言。Vue 收集器检测简单 label、文本和 disabled；复杂插槽或嵌套分组变化可使用包含 locale 的 key 强制更新。

### 动态修改 disabled 后如何更新？

将 disabled 绑定到响应式状态；复杂分组可以更新 key 或改用 optionList。不要依赖 React children 的刷新语义。

### 下拉菜单的宽度如何控制？

默认按选择器设置最小宽度，不固定 width；通过 dropdownStyle 设置显式 width。

### allowCreate 为什么不响应外部选项更新？

allowCreate 接管本地选项创建流程，不再响应 optionList/选项插槽的外部更新；适合本地新增条目。

### 选择完成或 Esc 后为什么没有 blur？

关闭面板仍保留触发器焦点，用户可以再次按 Enter 打开；真正离开控件时才处理失焦。

### 自定义多选 Tag 可以完全替换外层吗？

当前 selectedItem 插槽位于 Select 内建 Tag 内容区。它保留内建关闭按钮，不提供 React isRenderInTag:false 的外层替换语义。演示保留头像形状、文字和关闭交互，外层 DOM 差异尚未验收。
