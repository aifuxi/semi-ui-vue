---
title: '评分'
description: '展示评分的组件'
locale: 'zh-CN'
slug: 'rating'
category: 'input'
order: 45
englishTitle: 'Rating'
icon: 'doc-rating'
upstream: 'input/rating'
---

## 代码演示

### 如何引入

```ts
import { Rating } from '@aifuxi/semi-ui-vue/rating';
import '@aifuxi/semi-theme-default/rating.css';
```

### 基本用法

最简单的用法，支持两种尺寸 `default`， `small`。

支持传入 number 类型自定义尺寸。具体可以参考[自定义](#自定义)

::demo-block{demo="rating/zh-cn/Basic" title="基本用法"}
::

### 半星

通过设置 `allowHalf` 属性可以支持选择半星。 `allowHalf` 属性支持**展示**除0.5以外的小数。

::demo-block{demo="rating/zh-cn/Half" title="半星"}
::

### 只读

通过设置 `disabled` 属性将无法进行交互。
::demo-block{demo="rating/zh-cn/Disabled" title="只读"}
::

### 点击清除

通过设置 `allowClear` 属性允许再次点击时清除数值，默认为 `true`。
::demo-block{demo="rating/zh-cn/Clear" title="点击清除"}
::

### 文案展现

给评分组件加上文案展示。使用 tooltips 时，独立样式入口还需引入 `@aifuxi/semi-theme-default/tooltip.css`。

::demo-block{demo="rating/zh-cn/Tooltips" title="文案展现"}
::

### 自定义

自定义评分字符、个数及尺寸。  
自定义尺寸需要配合自定义的字符才能生效。

::demo-block{demo="rating/zh-cn/Custom" title="自定义"}
::

## API 参考

### Rating

| 属性               | 类型                             | 默认值          | 说明                                                               |
| ------------------ | -------------------------------- | --------------- | ------------------------------------------------------------------ |
| `ariaDescribedby`  | `string`                         | `—`             | 关联描述节点 id，模板写作 aria-describedby。                       |
| `ariaErrormessage` | `string`                         | `—`             | 关联错误信息节点 id。                                              |
| `ariaInvalid`      | `boolean`                        | `—`             | ARIA 无效状态。                                                    |
| `ariaLabel`        | `string`                         | `—`             | 可访问名称；模板写作 aria-label。                                  |
| `ariaLabelledby`   | `string`                         | `—`             | 关联标签节点 id，模板写作 aria-labelledby。                        |
| `ariaRequired`     | `boolean`                        | `—`             | ARIA 必填状态。                                                    |
| `allowClear`       | `boolean`                        | `true`          | 再次点击当前分值时清零。                                           |
| `allowHalf`        | `boolean`                        | `false`         | 以半星步长交互，也可显示任意小数填充。                             |
| `autoFocus`        | `boolean`                        | `false`         | 挂载后自动聚焦。                                                   |
| `character`        | `VNodeChild`                     | `—`             | 自定义字符，默认星形图标；支持 #character 插槽。                   |
| `className`        | `HTMLAttributes['class']`        | `—`             | 兼容 className；模板优先使用 class。                               |
| `count`            | `number`                         | `5`             | 评分项总数。                                                       |
| `defaultValue`     | `number`                         | `0`             | 非受控初始值。                                                     |
| `disabled`         | `boolean`                        | `false`         | 禁用交互及键盘焦点；Group 对全部子项生效。                         |
| `id`               | `string`                         | `—`             | 组件节点 id。                                                      |
| `modelValue`       | `number \| undefined`            | `—`             | 默认 v-model 的受控值；兼容 checked/value 同时传入时优先使用后者。 |
| `prefixCls`        | `string`                         | `'semi-rating'` | CSS class 前缀；自定义前缀需要提供对应样式。                       |
| `preventScroll`    | `boolean`                        | `—`             | 聚焦时禁止自动滚动文档。                                           |
| `size`             | `'small' \| 'default' \| number` | `'default'`     | 预设尺寸或 Rating 数字自定义尺寸。                                 |
| `style`            | `StyleValue`                     | `—`             | Vue 内联样式。                                                     |
| `tabIndex`         | `number`                         | `-1`            | 容器焦点顺序；禁用状态不会成为键盘焦点目标。                       |
| `tooltips`         | `string[]`                       | `—`             | 各评分项的提示文案。                                               |
| `value`            | `number \| undefined`            | `—`             | 受控值或组内选项标识，见下方状态说明。                             |

### 事件与插槽

`change(value: number)`, `update:value(value: number)`, `update:modelValue(value: number)`, `hoverChange(value: number | undefined)`, `focus(event: FocusEvent)`, `blur(event: FocusEvent)`, `keyDown(event: KeyboardEvent)`.

模板中使用 `@hover-change`、`@key-down`；鼠标离开时 hoverChange 值为 undefined。`#character` 插槽提供自定义图标。

`class`、`style` 使用 Vue 原生属性。ARIA 属性使用类型列中的 camelCase，模板可写为 `aria-label`、`aria-labelledby`、`aria-describedby` 等。

Rating 当前根节点只输出 label、labelledby、describedby；invalid、errormessage、required 虽在公开类型中声明，但不输出到根节点。

## 方法

通过模板 ref 调用 `focus()` 和 `blur()`。

`click` 虽在 RatingEmits 类型中声明，但当前 Vue 及固定上游的评分点击路径不派发此回调；业务监听分值变化应使用 `@change`。

事件顺序：每次变更先派发 `change`，再派发 `update:modelValue`、`update:value`。

## Accessibility

### ARIA

- Rating 具有 `aria-checked` 表示当前是否选中，`aria-posinset` 表示在列表的位置，`aria-setsize` 表示列表的长度。
- Semi 支持自定义 Rating 的语义:
  - 可以使用 `aria-label` 来定制 Rating 的语义化；
  - 若用户传入的 `character` 类型为 string，将使用这个 string 来做 Rating 的语义化；
  - `aria-label`的优先级高于字符串 `character`。

### 键盘和焦点

- Rating 的初始焦点设置：
  - 若 Rating 有选择项时，初始焦点应当设置为最后一个选择项时（如：有 3颗🌟被点亮，则初始焦点设置在第三颗被点亮的🌟上）；
  - 若 Rating 没有选择项时，初始焦点应当为整个 Rating。
- 一个 Rating 组上，可以通过 `右箭头` 或 `上箭头` 选中当前焦点的下一个焦点项，`左箭头` 或 `下箭头` 选中当前焦点的上一个焦点项；
  - 用户设置了 `allowHalf` 属性，按方向键只选中或取消选中半颗星；
- `disabled`的 Rating 无法被获取到焦点。

方向键在 LTR 中按上述方向调整；RTL 中增减方向反转。到达最大值后继续增加会回到 0，从 0 继续减少会回到 count。值为 0 时使用不可见的空评分项承接焦点。

## 设计变量

::token-table{component="rating"}
::

## React → Vue 迁移

| React                                        | Vue                                                                    |
| -------------------------------------------- | ---------------------------------------------------------------------- |
| `import { Rating } from '@douyinfe/semi-ui'` | `@aifuxi/semi-ui-vue/rating` + `@aifuxi/semi-theme-default/rating.css` |
| `useState` / `setState`                      | `shallowRef` / `computed`                                              |
| `className` / `style={{ ... }}`              | `class` / `:style="{ ... }"`                                           |
| `value` + `onChange`                         | `v-model` / `v-model:value` / `:value` + `@change`                     |
| `character={<IconLikeHeart />}`              | `#character` 插槽                                                      |
| `onHoverChange` / `onKeyDown`                | `@hover-change` / `@key-down`                                          |
| `ref.current.focus()` / `.blur()`            | 模板 ref 的 `focus()` / `blur()`                                       |

## FAQ

### 为什么设置数字 size 后星形图标没有按预期变大？

数字 size 需要配合自定义 character，并为自定义图标设置对应 font-size。allowHalf 控制交互步长为 0.5，disabled 小数示例仍能显示 3.65 的填充。

### 为什么绑定 checked/value 后点击状态没有变化？

受控组件只请求变更，父级必须写回新值。推荐使用 v-model；使用 @change 时注意 Checkbox/Radio 的事件对象和 Switch/Rating 的直接值签名不同。默认值仅用于初始化。
