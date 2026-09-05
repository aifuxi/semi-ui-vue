---
title: '复选框'
description: '复选框允许用户选中多个选项'
locale: 'zh-CN'
slug: 'checkbox'
category: 'input'
order: 37
englishTitle: 'Checkbox'
icon: 'doc-checkbox'
upstream: 'input/checkbox'
---

## 使用场景

- 勾选框可以让用户在两种相反的状态、行为或取值之间选择;
- 适用于在列表中选择单个或多个选项，开启或关闭某个选项

## 代码演示

### 如何引入

```ts
import { Checkbox, CheckboxGroup } from '@aifuxi/semi-ui-vue/checkbox';
import '@aifuxi/semi-theme-default/checkbox.css';
```

### 基本用法

Checkbox单个使用，可以通过`defaultChecked`、`checked`属性控制是否勾选。  
当传入`checked`时，为受控使用。

::demo-block{demo="checkbox/zh-cn/Basic" title="基本用法"}
::

::demo-block{demo="checkbox/zh-cn/DefaultChecked" title="基本用法"}
::

带辅助文本的checkbox。通过`extra`传入辅助文本。辅助文本会更长一些，甚至还可能换行。

::demo-block{demo="checkbox/zh-cn/Extra" title="基本用法"}
::

### 禁用

通过设置 `disabled` 属性，禁用 Checkbox

::demo-block{demo="checkbox/zh-cn/Disabled" title="禁用"}
::

### 模板方式声明 Checkbox 组

通过在CheckboxGroup内部放置 Checkbox元素，可以声明Checkbox组  
使用Checkbox组，你可以更便捷地通过CheckboxGroup的`defaultValue`、`value`属性去控制一组Checkbox的选中与否
此时Checkbox不需要再声明`defaultChecked`、`checked`属性

::demo-block{demo="checkbox/zh-cn/Group" title="模板方式声明 Checkbox 组"}
::

### 数组方式声明 Checkbox 组

也可以将数组通过 `options` 属性直接传入 CheckboxGroup，直接生成 Checkbox 组

::demo-block{demo="checkbox/zh-cn/Options" title="数组方式声明 Checkbox 组"}
::

### 水平排列

通过设置 `direction` 为 `horizontal` 或者 `vertical` 可以调整 CheckboxGroup 内的布局

::demo-block{demo="checkbox/zh-cn/Direction" title="水平排列"}
::

### 受控

联动 checkbox。

::demo-block{demo="checkbox/zh-cn/Controlled" title="受控"}
::

### 全选

在实现全选效果时，你可能会用到 `indeterminate` 属性。

::demo-block{demo="checkbox/zh-cn/CheckAll" title="全选"}
::

### 卡片样式

可以给 CheckboxGroup 设置 `type='card'`，实现带有背景的卡片样式。

::demo-block{demo="checkbox/zh-cn/Card" title="卡片样式"}
::

### 无 checkbox 的纯卡片样式

可以给 CheckboxGroup 设置 `type='pureCard'`，实现带有背景且无 checkbox 的纯卡片样式。

::demo-block{demo="checkbox/zh-cn/PureCard" title="无 checkbox 的纯卡片样式"}
::

### 配合grid布局

CheckboxGroup 内嵌 Checkbox 并与 Grid 组件一起使用，可以实现灵活的布局。

::demo-block{demo="checkbox/zh-cn/Grid" title="配合grid布局"}
::

## API 参考

### Checkbox

| 属性               | 类型                                                      | 默认值      | 说明                                                               |
| ------------------ | --------------------------------------------------------- | ----------- | ------------------------------------------------------------------ |
| `ariaDescribedby`  | `string`                                                  | `—`         | 关联描述节点 id，模板写作 aria-describedby。                       |
| `ariaErrormessage` | `string`                                                  | `—`         | 关联错误信息节点 id。                                              |
| `ariaInvalid`      | `boolean \| 'false' \| 'true' \| 'grammar' \| 'spelling'` | `—`         | ARIA 无效状态。                                                    |
| `ariaLabel`        | `string`                                                  | `—`         | 可访问名称；模板写作 aria-label。                                  |
| `ariaLabelledby`   | `string`                                                  | `—`         | 关联标签节点 id，模板写作 aria-labelledby。                        |
| `ariaRequired`     | `boolean \| 'false' \| 'true'`                            | `—`         | ARIA 必填状态。                                                    |
| `addonId`          | `string`                                                  | `—`         | 标签容器 id；未设置时由组件生成。                                  |
| `autoFocus`        | `boolean`                                                 | `false`     | 挂载后自动聚焦。                                                   |
| `checked`          | `boolean \| undefined`                                    | `—`         | 受控选中状态；在 Group 中由组值决定。                              |
| `modelValue`       | `boolean \| undefined`                                    | `—`         | 默认 v-model 的受控值；兼容 checked/value 同时传入时优先使用后者。 |
| `defaultChecked`   | `boolean`                                                 | `false`     | 非受控初始选中状态。                                               |
| `disabled`         | `boolean`                                                 | `false`     | 禁用交互及键盘焦点；Group 对全部子项生效。                         |
| `extra`            | `VNodeChild`                                              | `—`         | 辅助文本，支持 VNodeChild 或 #extra 插槽。                         |
| `extraId`          | `string`                                                  | `—`         | 辅助文本容器 id；未设置时由组件生成。                              |
| `id`               | `string`                                                  | `—`         | 组件节点 id。                                                      |
| `indeterminate`    | `boolean`                                                 | `false`     | 显示部分选中状态，不自动计算组值。                                 |
| `prefixCls`        | `string`                                                  | `—`         | CSS class 前缀；自定义前缀需要提供对应样式。                       |
| `preventScroll`    | `boolean`                                                 | `—`         | 聚焦时禁止自动滚动文档。                                           |
| `role`             | `string`                                                  | `—`         | Checkbox 外层容器 role。                                           |
| `tabIndex`         | `number`                                                  | `—`         | 容器焦点顺序；禁用状态不会成为键盘焦点目标。                       |
| `type`             | `'default' \| 'card' \| 'pureCard'`                       | `'default'` | 样式类型，枚举见类型列。                                           |
| `value`            | `unknown`                                                 | `—`         | 受控值或组内选项标识，见下方状态说明。                             |
| `className`        | `string`                                                  | `—`         | 兼容 className；模板优先使用 class。                               |

### CheckboxGroup

| 属性               | 类型                                                      | 默认值       | 说明                                                               |
| ------------------ | --------------------------------------------------------- | ------------ | ------------------------------------------------------------------ |
| `ariaDescribedby`  | `string`                                                  | `—`          | 关联描述节点 id，模板写作 aria-describedby。                       |
| `ariaErrormessage` | `string`                                                  | `—`          | 关联错误信息节点 id。                                              |
| `ariaInvalid`      | `boolean \| 'false' \| 'true' \| 'grammar' \| 'spelling'` | `—`          | ARIA 无效状态。                                                    |
| `ariaLabel`        | `string`                                                  | `—`          | 可访问名称；模板写作 aria-label。                                  |
| `ariaLabelledby`   | `string`                                                  | `—`          | 关联标签节点 id，模板写作 aria-labelledby。                        |
| `ariaRequired`     | `boolean \| 'false' \| 'true'`                            | `—`          | ARIA 必填状态。                                                    |
| `defaultValue`     | `unknown[]`                                               | `[]`         | 非受控初始值。                                                     |
| `direction`        | `'horizontal' \| 'vertical'`                              | `'vertical'` | 组内排列方向；Radio button 类型忽略垂直布局。                      |
| `disabled`         | `boolean`                                                 | `false`      | 禁用交互及键盘焦点；Group 对全部子项生效。                         |
| `id`               | `string`                                                  | `—`          | 组件节点 id。                                                      |
| `modelValue`       | `unknown[] \| undefined`                                  | `—`          | 默认 v-model 的受控值；兼容 checked/value 同时传入时优先使用后者。 |
| `name`             | `string`                                                  | `'default'`  | 组内原生 input 的 name；独立组使用不同名称。                       |
| `options`          | `Array<string \| CheckboxOption>`                         | `—`          | 字符串或选项对象数组；设置后优先于默认插槽。                       |
| `prefixCls`        | `string`                                                  | `—`          | CSS class 前缀；自定义前缀需要提供对应样式。                       |
| `type`             | `'default' \| 'card' \| 'pureCard'`                       | `'default'`  | 样式类型，枚举见类型列。                                           |
| `value`            | `unknown[] \| undefined`                                  | `—`          | 受控值或组内选项标识，见下方状态说明。                             |

### CheckboxOption

| 属性        | 类型                                   | 默认值 | 说明                                       |
| ----------- | -------------------------------------- | ------ | ------------------------------------------ |
| `label`     | `VNodeChild`                           | `—`    | 选项显示内容。                             |
| `value`     | `unknown`                              | `—`    | 受控值或组内选项标识，见下方状态说明。     |
| `disabled`  | `boolean`                              | `—`    | 禁用交互及键盘焦点；Group 对全部子项生效。 |
| `extra`     | `VNodeChild`                           | `—`    | 辅助文本，支持 VNodeChild 或 #extra 插槽。 |
| `className` | `string`                               | `—`    | 兼容 className；模板优先使用 class。       |
| `style`     | `CSSProperties`                        | `—`    | Vue 内联样式。                             |
| `@change`   | `(event: CheckboxChangeEvent) => void` | `—`    | 选项变化回调。                             |

### 事件与插槽

`Checkbox`: `change(event: CheckboxChangeEvent)`, `update:checked(checked: boolean)`, `update:modelValue(checked: boolean)`.

`CheckboxGroup`: `change(value: unknown[])`, `update:value(value)`, `update:modelValue(value)`.

默认插槽提供标签或组内组件，`#extra` 提供辅助内容。

事件的 `target.checked` 是下一选中状态，`target.value` 是选项值；包含 `stopPropagation()` / `preventDefault()`。Checkbox 还提供 `nativeEvent.stopImmediatePropagation()`。

Group 控制组值；无需再设置子项 checked。Checkbox 子项只有显式传入 value 才加入 Group。Radio advanced 模式取消选择时组值为 undefined。

`class`、`style` 使用 Vue 原生属性。ARIA 属性使用类型列中的 camelCase，模板可写为 `aria-label`、`aria-labelledby`、`aria-describedby` 等。

CheckboxGroup 当前 DOM 与上游一样只转发 label、labelledby、describedby；虽然类型声明包含 invalid、errormessage、required，组根节点不输出这三项。

## 方法

通过模板 ref 调用 `focus()` 和 `blur()`。Checkbox / Radio 另公开只读 `input` 引用。

事件顺序：每次变更先派发 `change`，再派发 `update:checked`（Group 为 `update:value`）、`update:modelValue`。 组内交互先通知 Checkbox 子项，再通知 Group。

## Accessibility

### ARIA

- Checkbox 的 role 为 `checkbox`，CheckboxGroup 的 role 为 `list`，它的直接子元素为 `listitem`
- `aria-label`：单独使用 Checkbox 时，如果 默认插槽 没有文本，建议传入 `aria-label` prop，用一句话描述 Checkbox 的作用，这会让屏幕阅读器读出这个标签的内容。如果你使用的是 Form.Checkbox，可以使用 Form 提供的 label 而无需传入 `aria-label`
- `aria-labelledby` 指向 `addon` 节点，用于解释当前 Checkbox 的作用
- `aria-describedby` 指向 `extra` 节点，用于补充解释当前 Checkbox 的作用
- `aria-disabled` 表示当前的禁用状态，与 `disabled` prop 的值保持一致
- `aria-checked` 表示当前的选中状态

### 键盘和焦点

- Checkbox 可被获取焦点，键盘用户可以使用 Tab 及 Shift + Tab 切换焦点。
- 当前获取的焦点为 Checkbox 时，可以通过 Space 切换选中和未选状态。
- Checkbox 的点击区域大于框本身，包含了框后的文案；带辅助文本的 checkbox，辅助文本也包含在点击区域内。
- 禁用的 Checkbox 不可获取焦点。

## 文案规范

::demo-block{demo="checkbox/zh-cn/ContentGuidelines" title="Checkbox Content Demo"}
::

- 首字母大写
- 不使用标点符号

| ✅ 推荐用法 | ❌ 不推荐用法 |
| ----------- | ------------- |
| Call        | call          |
| Call        | Call;         |

## 设计变量

::token-table{component="checkbox"}
::

## 相关物料

相关表单组合可继续查看 [Radio](/zh-cn/components/radio/)、[Switch](/zh-cn/components/switch/) 与 [Form](/zh-cn/components/form/)。

## React → Vue 迁移

| React                                                         | Vue                                                                        |
| ------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `import { Checkbox, CheckboxGroup } from '@douyinfe/semi-ui'` | `@aifuxi/semi-ui-vue/checkbox` + `@aifuxi/semi-theme-default/checkbox.css` |
| `useState` / `setState`                                       | `shallowRef` / `computed`                                                  |
| `className` / `style={{ ... }}`                               | `class` / `:style="{ ... }"`                                               |
| `checked` + `onChange`                                        | `v-model` / `v-model:checked` / `:checked` + `@change`                     |
| `defaultChecked`                                              | `default-checked`                                                          |
| `Checkbox.Group`                                              | `CheckboxGroup`                                                            |
| Group `value` + `onChange`                                    | `v-model` / `v-model:value` / `:value` + `@change`                         |
| `children` / `extra={<Node />}`                               | 默认插槽 / `#extra` 插槽                                                   |
| `ref.current.focus()` / `.blur()`                             | 模板 ref 的 `focus()` / `blur()`                                           |

## FAQ

### 为什么全选框需要 indeterminate？

它只呈现部分选中，不会自动修改组值。示例用 computed 从 checkedList 派生全选与半选状态，避免三份状态不同步。

### 为什么绑定 checked/value 后点击状态没有变化？

受控组件只请求变更，父级必须写回新值。推荐使用 v-model；使用 @change 时注意 Checkbox/Radio 的事件对象和 Switch/Rating 的直接值签名不同。默认值仅用于初始化。
