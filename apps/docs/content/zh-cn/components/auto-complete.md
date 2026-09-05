---
title: '自动完成'
description: '输入框自动填充。'
locale: 'zh-CN'
slug: 'auto-complete'
category: 'input'
order: 35
englishTitle: 'AutoComplete'
icon: 'doc-autocomplete'
upstream: 'input/autocomplete'
---

## 使用场景

用于对输入框提供输入建议，进行自动补全的操作

与可搜索的 Select 组件的区别：

- AutoComplete 本质上是一个增强型的提供了输入建议的 Input 组件，而 Select 是一个选择器
- 点击展开时，Select 会将输入框的值全部清空，而 AutoComplete 会保留上次选中的值
- Select 的已选项渲染（renderSelectedItem）可定制化程度更高，可以为任意类型的 VNodeChild，而 AutoComplete 只允许为字符串

## 代码演示

### 如何引入

```ts
import { AutoComplete } from '@aifuxi/semi-ui-vue/auto-complete';
import '@aifuxi/semi-theme-default/auto-complete.css';
```

### 基本用法

通过 @search 监听用户输入，将输入建议通过更新 props.data 传入。通过 @change 保持受控，当输入框变化/选中输入项时会触发 @change

::demo-block{demo="auto-complete/zh-cn/Basic" title="基本用法"}
::

### 自定义候选项渲染

需要自定义候选项渲染时，data 可以传入一个对象数组（每个 Object 必须含有 label、value 两个 key，value 为候选项选中的值，label 为候选项展示的内容）  
通过 renderItem 可以自定义候选项的渲染

::demo-block{demo="auto-complete/zh-cn/CustomOption" title="自定义候选项渲染"}
::

### 远程搜索

从 @search 中获取用户输入值，动态更新 data 值

::demo-block{demo="auto-complete/zh-cn/Remote" title="远程搜索"}
::

### 尺寸

通过设置 size 可设置输入框尺寸，可选`small`，`default`(默认)，`large`

::demo-block{demo="auto-complete/zh-cn/Size" title="尺寸"}
::

### 下拉菜单的位置

通过设置 position 可设置下拉菜单位置，可选值参考 Tooltip position

::demo-block{demo="auto-complete/zh-cn/Position" title="下拉菜单的位置"}
::

### 禁用

::demo-block{demo="auto-complete/zh-cn/Disabled" title="禁用"}
::

### 校验状态

可设置不同校验状态，展示不同样式

::demo-block{demo="auto-complete/zh-cn/Validation" title="校验状态"}
::

### 自定义空内容

可设置自定义展示空内容

::demo-block{demo="auto-complete/zh-cn/Empty" title="自定义空内容"}
::

## API 参考

### AutoCompleteProps

| 属性                       | 类型                                                      | 默认值         | 说明                                                                                                                                               |
| -------------------------- | --------------------------------------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ariaDescribedby`          | `string`                                                  | `—`            | 关联描述节点 id。                                                                                                                                  |
| `ariaErrormessage`         | `string`                                                  | `—`            | 关联错误信息节点 id。                                                                                                                              |
| `ariaInvalid`              | `boolean \| 'false' \| 'true' \| 'grammar' \| 'spelling'` | `—`            | ARIA 无效状态。                                                                                                                                    |
| `ariaLabel`                | `string`                                                  | `—`            | 无障碍名称，模板使用 aria-label。                                                                                                                  |
| `ariaLabelledby`           | `string`                                                  | `—`            | 关联标签节点 id；模板写为 aria-labelledby。                                                                                                        |
| `ariaRequired`             | `boolean`                                                 | `—`            | ARIA 必填状态。                                                                                                                                    |
| `autoAdjustOverflow`       | `boolean`                                                 | `true`         | 浮层被遮挡时是否自动调整方向                                                                                                                       |
| `autoFocus`                | `boolean`                                                 | `false`        | 是否自动聚焦                                                                                                                                       |
| `clearIcon`                | `VNodeChild`                                              | `—`            | 可用于自定义清除按钮, showClear为true时有效                                                                                                        |
| `data`                     | `AutoCompleteItem[]`                                      | `[]`           | 候选项的数据源，可以为字符串数组或对象数组                                                                                                         |
| `defaultActiveFirstOption` | `boolean`                                                 | `false`        | 是否默认高亮第一个选项（按回车可直接选中）                                                                                                         |
| `defaultOpen`              | `boolean`                                                 | `false`        | 是否默认展开下拉菜单                                                                                                                               |
| `defaultValue`             | `AutoCompletePrimitive`                                   | `—`            | 默认值                                                                                                                                             |
| `disabled`                 | `boolean`                                                 | `false`        | 是否禁用                                                                                                                                           |
| `dropdownClassName`        | `HTMLAttributes['class']`                                 | `—`            | 下拉列表的 CSS 类名                                                                                                                                |
| `dropdownMatchSelectWidth` | `boolean`                                                 | `true`         | 下拉菜单最小宽度与选择框一致。                                                                                                                     |
| `dropdownStyle`            | `StyleValue`                                              | `—`            | 下拉列表的内联样式                                                                                                                                 |
| `emptyContent`             | `VNodeChild \| null`                                      | `null`         | data 为空时自定义下拉内容                                                                                                                          |
| `getPopupContainer`        | `() => HTMLElement`                                       | `—`            | 指定下拉列表浮层的父级容器，浮层将会渲染至该 DOM 中。自定义该项时需给容器设置 `position: relative` 这会改变浮层 DOM 树位置，但不会改变视图渲染位置 |
| `id`                       | `string`                                                  | `—`            | 组件节点 id。                                                                                                                                      |
| `insetLabel`               | `VNodeChild`                                              | `—`            | 内嵌标签，支持 insetLabel 插槽。                                                                                                                   |
| `insetLabelId`             | `string`                                                  | `—`            | 内嵌标签节点 id。                                                                                                                                  |
| `loading`                  | `boolean`                                                 | `false`        | 下拉列表是否展示加载动画                                                                                                                           |
| `maxHeight`                | `string \| number`                                        | `300`          | 下拉列表的最大高度                                                                                                                                 |
| `modelValue`               | `AutoCompleteModelValue`                                  | `—`            | v-model 的受控值。                                                                                                                                 |
| `motion`                   | `boolean`                                                 | `true`         | 下拉列表出现/隐藏时，是否有动画                                                                                                                    |
| `mouseEnterDelay`          | `number`                                                  | `—`            | 鼠标进入后显示延迟。                                                                                                                               |
| `mouseLeaveDelay`          | `number`                                                  | `—`            | 鼠标离开后隐藏延迟。                                                                                                                               |
| `onChangeWithObject`       | `boolean`                                                 | `—`            | 开启时回调携带完整选项对象；AutoComplete 的 change 保持文本类型，请用 onSelectWithObject 配置 select。                                             |
| `onSelectWithObject`       | `boolean`                                                 | `false`        | 点击候选项时，是否将选中项 option 的其他属性也作为回调入参。设为 true 时，@select 的入参类型会从 `string` 变为 object: { value, label, ...rest }   |
| `placeholder`              | `string`                                                  | `—`            | 输入框默认提示文案                                                                                                                                 |
| `position`                 | `TooltipPosition`                                         | `'bottomLeft'` | 下拉菜单的显示位置，可选值同 tooltip 组件                                                                                                          |
| `prefix`                   | `VNodeChild`                                              | `—`            | 选择框的前缀标签                                                                                                                                   |
| `renderItem`               | `(item: AutoCompleteItem) => VNodeChild`                  | `—`            | 自定义候选项内容；推荐 option 作用域插槽。                                                                                                         |
| `renderSelectedItem`       | `(option: AutoCompleteOptionRuntime) => string`           | `—`            | 通过 renderSelectedItem 自定义下拉列表候选项被点击选中后，在选择框中的渲染内容 **仅支持 String 类型的返回值**                                      |
| `showClear`                | `boolean`                                                 | `false`        | 是否展示清除按钮                                                                                                                                   |
| `size`                     | `AutoCompleteSize`                                        | `'default'`    | 尺寸，可选`small`, `default`, `large`                                                                                                              |
| `style`                    | `StyleValue`                                              | `—`            | 样式                                                                                                                                               |
| `stopPropagation`          | `boolean \| string`                                       | `true`         | 控制弹层事件冒泡。                                                                                                                                 |
| `suffix`                   | `VNodeChild`                                              | `—`            | 选择框的前缀标签                                                                                                                                   |
| `validateStatus`           | `AutoCompleteValidateStatus`                              | `'default'`    | 校验状态，可选值`default`、`error`、`warning`，默认 default。仅影响展示样式                                                                        |
| `value`                    | `AutoCompleteModelValue`                                  | `—`            | 当前值                                                                                                                                             |
| `zIndex`                   | `number`                                                  | `1030`         | 下拉菜单的 zIndex                                                                                                                                  |

### AutoCompleteDataItem

| 属性        | 类型                      | 默认值 | 说明               |
| ----------- | ------------------------- | ------ | ------------------ |
| `value`     | `AutoCompletePrimitive`   | `—`    | 当前值             |
| `label`     | `VNodeChild`              | `—`    | 展示文本或 VNode。 |
| `disabled`  | `boolean`                 | `—`    | 是否禁用           |
| `class`     | `HTMLAttributes['class']` | `—`    | Vue 类名。         |
| `className` | `string`                  | `—`    | 样式类名           |
| `style`     | `StyleValue`              | `—`    | 样式               |

### AutoCompleteOptionProps

| 属性           | 类型                      | 默认值 | 说明                         |
| -------------- | ------------------------- | ------ | ---------------------------- |
| `value`        | `AutoCompletePrimitive`   | `—`    | 当前值                       |
| `label`        | `VNodeChild`              | `—`    | 展示文本或 VNode。           |
| `disabled`     | `boolean`                 | `—`    | 是否禁用                     |
| `class`        | `HTMLAttributes['class']` | `—`    | Vue 类名。                   |
| `className`    | `string`                  | `—`    | 样式类名                     |
| `style`        | `StyleValue`              | `—`    | 样式                         |
| `empty`        | `boolean`                 | `—`    | 空内容状态。                 |
| `emptyContent` | `VNodeChild \| null`      | `—`    | data 为空时自定义下拉内容    |
| `focused`      | `boolean`                 | `—`    | 当前键盘焦点状态。           |
| `inputValue`   | `string`                  | `—`    | 当前搜索文本。               |
| `selected`     | `boolean`                 | `—`    | 选中状态。                   |
| `showTick`     | `boolean`                 | `true` | 是否显示选中图标，默认开启。 |

### 事件

| 事件                    | 参数                                                     |
| ----------------------- | -------------------------------------------------------- |
| `blur`                  | `[event: FocusEvent]`                                    |
| `change`                | `[value: AutoCompletePrimitive]`                         |
| `clear`                 | `[]`                                                     |
| `dropdownVisibleChange` | `[visible: boolean]`                                     |
| `focus`                 | `[event: FocusEvent]`                                    |
| `keydown`               | `[event: KeyboardEvent]`                                 |
| `search`                | `[value: string]`                                        |
| `select`                | `[value: AutoCompletePrimitive \| AutoCompleteDataItem]` |
| `update:modelValue`     | `[value: AutoCompletePrimitive]`                         |
| `update:value`          | `[value: AutoCompletePrimitive]`                         |

模板中使用 `@dropdown-visible-change`（AutoComplete/Select）或 `@visible-change`（Cascader），其他 camelCase 事件同样转为 kebab-case。`onChangeWithObject` 是 Boolean prop，不是事件。

### 插槽

| 插槽            | 签名                                                  |
| --------------- | ----------------------------------------------------- |
| `#clearIcon`    | `() => VNodeChild`                                    |
| `#emptyContent` | `() => VNodeChild`                                    |
| `#insetLabel`   | `() => VNodeChild`                                    |
| `#option`       | `(props: AutoCompleteOptionSlotProps) => VNodeChild`  |
| `#prefix`       | `() => VNodeChild`                                    |
| `#suffix`       | `() => VNodeChild`                                    |
| `#trigger`      | `(props: AutoCompleteTriggerSlotProps) => VNodeChild` |

### 相关类型

```ts
export type AutoCompletePrimitive = string | number;
export type AutoCompleteItem = AutoCompleteDataItem | AutoCompletePrimitive;
export type AutoCompleteModelValue = AutoCompletePrimitive | undefined;
export interface AutoCompleteOptionRuntime extends AutoCompleteDataItem {
  _key?: PropertyKey;
  _renderedLabel?: VNodeChild;
  show?: boolean;
  value?: AutoCompletePrimitive;
}
export interface AutoCompleteOptionSlotProps {
  focused: boolean;
  inputValue: AutoCompletePrimitive;
  item: AutoCompleteItem;
  onClick: (event: MouseEvent) => void;
  onMouseenter: (event: MouseEvent) => void;
  option: AutoCompleteOptionRuntime;
}
export interface AutoCompleteTriggerSlotProps {
  componentProps: AutoCompleteProps;
  inputValue: AutoCompletePrimitive;
  onClear: (event: MouseEvent) => void;
  onSearch: (value: string) => void;
  value: AutoCompleteOptionRuntime[];
}
export type AutoCompleteSize = 'small' | 'default' | 'large';
export type AutoCompleteValidateStatus = 'default' | 'warning' | 'error';
```

## Methods

使用模板 ref 获取组件实例，调用公开方法。

```ts
export interface AutoCompleteExposed {
  close(): void;
  focus(): void;
  open(): void;
  search(value: string): void;
}
```

## Accessibility

### ARIA

外层 role 为 combobox，选项列表为 listbox；aria-expanded、aria-controls 与 aria-activedescendant 表示展开和焦点关系。通过 aria-label 或 aria-labelledby 为原生输入框命名。

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

## 设计变量

::token-table{component="autoComplete"}
::

## React → Vue 迁移

| React                                  | Vue                                                                                  |
| -------------------------------------- | ------------------------------------------------------------------------------------ |
| `@douyinfe/semi-ui`                    | `@aifuxi/semi-ui-vue/auto-complete` + `@aifuxi/semi-theme-default/auto-complete.css` |
| `useState` / `useMemo` / `useCallback` | `shallowRef` / `computed` / 局部函数                                                 |
| `value` + `onChange`                   | `v-model` / `v-model:value` / `:value` + `@change`                                   |
| `className` / `ReactNode`              | Vue `class` / `VNodeChild` 与插槽                                                    |
| `ref.current`                          | 模板 ref 的公开方法                                                                  |
| `renderItem(item)`                     | `#option="{ item, option, focused, inputValue }"`                                    |
| `renderSelectedItem`                   | 保留返回 string 的函数                                                               |
| `triggerRender`                        | `#trigger="{ value, inputValue, componentProps, onSearch, onClear }"`                |
| `onSelectWithObject`                   | `on-select-with-object` + `@select`                                                  |

异步与动态数据示例使用固定序列、固定延迟和请求序号，并在卸载时清理定时器；不发出真实网络请求。

## FAQ

### 输入文本和选项值有什么区别？

输入会先派发 search，再派发 change；选择选项后使用 renderSelectedItem 返回的字符串回填。renderSelectedItem 不支持 VNode。

### 如何获取完整选项？

通过 on-select-with-object 开启 select 对象回调。change 仍返回 string 或 number，不能按 Select 的对象 change 契约处理。

### 异步搜索如何避免旧结果覆盖？

在请求开始时递增序号，只接收最新序号；组件卸载时取消定时器。示例将随机值替换为确定性序列。
