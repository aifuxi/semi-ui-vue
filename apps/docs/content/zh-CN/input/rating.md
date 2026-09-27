---
title: 'Rating 评分'
description: '展示评分的组件'
type: 'input'
order: 45
icon: 'doc-rating'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/rating` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-input-rating-1" title="如何引入" kind="import" />

### 基本用法

最简单的用法，支持两种尺寸 `default`， `small`。

支持传入 number 类型自定义尺寸。具体可以参考[自定义](#自定义)

<DemoBlock id="zh-CN-input-rating-2" title="基本用法" kind="live" />

### 半星

通过设置 `allowHalf` 属性可以支持选择半星。 `allowHalf` 属性支持**展示**除0.5以外的小数。

<DemoBlock id="zh-CN-input-rating-3" title="半星" kind="live" />

### 只读

通过设置 `disabled` 属性将无法进行交互。

<DemoBlock id="zh-CN-input-rating-4" title="只读" kind="live" />

### 点击清除

通过设置 `allowClear` 属性允许再次点击时清除数值，默认为 `true`。

<DemoBlock id="zh-CN-input-rating-5" title="点击清除" kind="live" />

### 文案展现

给评分组件加上文案展示。

<DemoBlock id="zh-CN-input-rating-6" title="文案展现" kind="live" />

### 自定义

自定义评分字符、个数及尺寸。
自定义尺寸需要配合自定义的字符才能生效。

<DemoBlock id="zh-CN-input-rating-7" title="自定义" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/rating/types.ts` 的公开类型为准。

- `v-model` 对应 `modelValue` 与 `update:modelValue`；兼容入口 `value` 可通过 `v-model:value` 绑定。

#### Vue 用法

- `character` 保留 VNode prop；character 插槽优先。
- `preventScroll` 同时作用于自动聚焦、键盘移动和公开 focus() 方法。
- 方向键按 allowHalf 决定以 1 或 0.5 递增；RTL 下水平方向相反。
- `click` 保留在导出的 RatingEmits 兼容类型中；固定基线运行时不额外触发，请监听 `change`。

#### Vue 实例方法

**RatingExposed**

| 方法    | 签名          | 说明           |
| ------- | ------------- | -------------- |
| `focus` | () =&gt; void | 聚焦评分组件   |
| `blur`  | () =&gt; void | 让评分组件失焦 |

#### Vue 事件

**Rating**

| 事件              | 参数                                                | 说明                                   |
| ----------------- | --------------------------------------------------- | -------------------------------------- |
| blur              | [event: FocusEvent]                                 | 评分组件失焦                           |
| change            | [value: number]                                     | 评分值变化                             |
| click             | [event: MouseEvent \| KeyboardEvent, index: number] | 兼容类型成员；固定基线运行时不额外触发 |
| focus             | [event: FocusEvent]                                 | 评分组件聚焦                           |
| hoverChange       | [value: number \| undefined]                        | 悬浮评分值变化                         |
| keyDown           | [event: KeyboardEvent]                              | 方向键调整评分                         |
| update:modelValue | [value: number]                                     | 更新默认 v-model                       |
| update:value      | [value: number]                                     | 更新兼容 value 绑定                    |

#### Vue 插槽

**Rating**

| 插槽      | 作用域参数 | 说明           |
| --------- | ---------- | -------------- |
| character | {}         | 自定义评分字符 |

| 属性             | 说明                                                                  | 类型                    | 默认值        |
| ---------------- | --------------------------------------------------------------------- | ----------------------- | ------------- |
| ariaDescribedby  | `aria-describedby` 的类型化 Vue 映射                                  | string                  | —             |
| ariaErrormessage | `aria-errormessage` 的类型化 Vue 映射                                 | string                  | —             |
| ariaInvalid      | `aria-invalid` 的类型化 Vue 映射                                      | boolean                 | —             |
| ariaLabel        | `aria-label` 的类型化 Vue 映射                                        | string                  | —             |
| ariaLabelledby   | `aria-labelledby` 的类型化 Vue 映射                                   | string                  | —             |
| ariaRequired     | `aria-required` 的类型化 Vue 映射                                     | boolean                 | —             |
| allowClear       | 是否允许再次点击后清除                                                | boolean                 | true          |
| allowHalf        | 是否允许半选                                                          | boolean                 | false         |
| autoFocus        | 自动获取焦点                                                          | boolean                 | false         |
| character        | 评分字符 VNode；character 插槽优先                                    | VNodeChild              | —             |
| className        | 样式类名                                                              | HTMLAttributes['class'] | -             |
| count            | star 总数                                                             | number                  | 5             |
| defaultValue     | 默认值                                                                | number                  | 0             |
| disabled         | 只读，无法进行交互                                                    | boolean                 | false         |
| id               | —                                                                     | string                  | —             |
| modelValue       | `v-model` 绑定值                                                      | number \| undefined     | —             |
| prefixCls        | —                                                                     | string                  | `semi-rating` |
| preventScroll    | 指示浏览器是否应滚动文档以显示新聚焦的元素，作用于组件内的 focus 方法 | boolean                 | —             |
| size             | 尺寸， `default`， `small`，支持传入 number 类型自定义尺寸            | RatingSize              | `default`     |
| style            | 自定义样式对象                                                        | StyleValue              | -             |
| tabIndex         | —                                                                     | number                  | -1            |
| tooltips         | 自定义每项的提示信息                                                  | string[]                | -             |
| value            | 兼容受控值                                                            | number \| undefined     | -             |

## Accessibility

### ARIA

- Rating 具有 `aria-checked` 表示当前是否选中，`aria-posinset` 表示在列表的位置，`aria-setsize` 表示列表的长度。
- Semi 支持自定义 Rating 的语义:
- 可以使用 `aria-label` 来定制 Rating 的语义化；
- 若用户传入的 `character` 类型为 string，将使用这个 string 来做 Rating 的语义化；
- `aria-label`的优先级高于string的`character`。

### 键盘和焦点

- Rating 的初始焦点设置：
- 若 Rating 有选择项时，初始焦点应当设置为最后一个选择项时（如：有 3颗🌟被点亮，则初始焦点设置在第三颗被点亮的🌟上）；
- 若 Rating 没有选择项时，初始焦点应当为整个 Rating。
- 一个 Rating 组上，可以通过 `右箭头` 或 `上箭头` 选中当前焦点的下一个焦点项，`左箭头` 或 `下箭头` 选中当前焦点的上一个焦点项；
- 用户设置了 `allowHalf` 属性，按方向键只选中或取消选中半颗星；
- `disabled`的 Rating 无法被获取到焦点。
