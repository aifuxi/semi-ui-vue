---
title: 'Checkbox 复选框'
description: '复选框允许用户选中多个选项'
type: 'input'
order: 37
icon: 'doc-checkbox'
---

## 使用场景

- 勾选框可以让用户在两种相反的状态、行为或取值之间选择;
- 适用于在列表中选择单个或多个选项，开启或关闭某个选项

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/checkbox` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-input-checkbox-1" title="如何引入" kind="import" />

### 基本用法

Checkbox单个使用，可以通过`defaultChecked`、`checked`属性控制是否勾选。
当传入`checked`时，为受控使用。

<DemoBlock id="zh-CN-input-checkbox-2" title="基本用法" kind="live" />

<DemoBlock id="zh-CN-input-checkbox-3" title="基本用法" kind="live" />

带辅助文本的checkbox。通过`extra`传入辅助文本。辅助文本会更长一些，甚至还可能换行。

<DemoBlock id="zh-CN-input-checkbox-4" title="基本用法" kind="live" />

### 禁用

通过设置 `disabled` 属性，禁用 Checkbox

<DemoBlock id="zh-CN-input-checkbox-5" title="禁用" kind="live" />

### 模板方式声明 Checkbox 组

通过在 Checkbox.Group 的默认插槽中放置 Checkbox，可以声明 Checkbox 组。
使用 Checkbox.Group，可以通过 `defaultValue`、`value` 或 `v-model` 管理组选中值。
组内 Checkbox 不需要再声明 `defaultChecked` 或 `checked`。

<DemoBlock id="zh-CN-input-checkbox-6" title="模板方式声明 Checkbox 组" kind="live" />

### 数组方式声明 Checkbox 组

也可以将数组通过 `options` 属性直接传入 CheckboxGroup，直接生成 Checkbox 组

<DemoBlock id="zh-CN-input-checkbox-7" title="数组方式声明 Checkbox 组" kind="live" />

### 水平排列

通过设置 `direction` 为 `horizontal` 或者 `vertical` 可以调整 CheckboxGroup 内的布局

<DemoBlock id="zh-CN-input-checkbox-8" title="水平排列" kind="live" />

### 受控

联动 checkbox。

<DemoBlock id="zh-CN-input-checkbox-9" title="受控" kind="live" />

### 全选

在实现全选效果时，你可能会用到 `indeterminate` 属性。

<DemoBlock id="zh-CN-input-checkbox-10" title="全选" kind="live" />

### 卡片样式

可以给 CheckboxGroup 设置 `type='card'`，实现带有背景的卡片样式。

<DemoBlock id="zh-CN-input-checkbox-11" title="卡片样式" kind="live" />

### 无 checkbox 的纯卡片样式

可以给 CheckboxGroup 设置 `type='pureCard'`，实现带有背景且无 checkbox 的纯卡片样式。

<DemoBlock id="zh-CN-input-checkbox-12" title="无 checkbox 的纯卡片样式" kind="live" />

### 配合grid布局

Checkbox.Group 内嵌 Checkbox 并与 Grid 组件一起使用，可以实现灵活的布局。

<DemoBlock id="zh-CN-input-checkbox-13" title="配合grid布局" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/checkbox/types.ts` 的公开类型为准。

- `Checkbox`：`v-model` 对应 `modelValue`，`v-model:checked` 对应 `checked`。
- `Checkbox.Group`：`v-model` 对应 `modelValue`，同时支持 `v-model:value`。

#### Vue 事件

**Checkbox**

| 事件   | 参数                         | 说明         |
| ------ | ---------------------------- | ------------ |
| change | [event: CheckboxChangeEvent] | 选中状态变化 |

**Checkbox.Group**

| 事件   | 参数                     | 说明         |
| ------ | ------------------------ | ------------ |
| change | [value: CheckboxValue[]] | 组选中值变化 |

#### Vue 插槽

**Checkbox**

| 插槽    | 作用域参数 | 说明       |
| ------- | ---------- | ---------- |
| default | {}         | 复选框内容 |
| extra   | {}         | 辅助文本   |

**Checkbox.Group**

| 插槽    | 作用域参数 | 说明            |
| ------- | ---------- | --------------- |
| default | {}         | Checkbox 子组件 |

### Checkbox

| 参数             | 说明                                                                                     | 类型                                                    | 默认值    |
| ---------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------- | --------- |
| ariaDescribedby  | —                                                                                        | string                                                  | —         |
| ariaErrormessage | —                                                                                        | string                                                  | —         |
| ariaInvalid      | —                                                                                        | boolean \| 'false' \| 'true' \| 'grammar' \| 'spelling' | —         |
| ariaLabel        | 定义 Checkbox 的作用                                                                     | string                                                  | -         |
| ariaLabelledby   | —                                                                                        | string                                                  | —         |
| ariaRequired     | —                                                                                        | boolean \| 'false' \| 'true'                            | —         |
| addonId          | addon 节点 id，aria-labelledby 指向这个 id，若无设置会随机生成一个 id **v2.11.0 后提供** | string                                                  | —         |
| autoFocus        | —                                                                                        | boolean                                                 | —         |
| checked          | 指定当前Checkbox是否选中（在Group中使用时无效）                                          | boolean \| undefined                                    | false     |
| modelValue       | —                                                                                        | boolean \| undefined                                    | —         |
| name             | —                                                                                        | string                                                  | —         |
| defaultChecked   | 初始是否选中（在Group中使用时无效）                                                      | boolean                                                 | false     |
| disabled         | 失效状态                                                                                 | boolean                                                 | false     |
| extra            | 副文本                                                                                   | VNodeChild                                              | -         |
| extraId          | 副文本的 id，aria-describedby 指向这个 id，若无设置会随机生成一个 id **v2.11.0 后提供**  | string                                                  | -         |
| id               | —                                                                                        | string                                                  | —         |
| indeterminate    | 设置 indeterminate 状态，只负责样式控制                                                  | boolean                                                 | false     |
| prefixCls        | —                                                                                        | string                                                  | —         |
| preventScroll    | 指示浏览器是否应滚动文档以显示新聚焦的元素，作用于组件内的 focus 方法                    | boolean                                                 | —         |
| role             | —                                                                                        | string                                                  | —         |
| tabIndex         | —                                                                                        | number                                                  | —         |
| type             | 设置checkbox 的样式类型，可选值为: `default`、`card`、`pureCard` **v2.18.0 后提供**      | CheckboxType                                            | `default` |
| value            | 该checkbox在CheckboxGroup中代表的value                                                   | CheckboxValue                                           | -         |
| className        | —                                                                                        | string                                                  | —         |

### Checkbox Group

| 参数             | 说明                                                                  | 类型                                                    | 默认值     |
| ---------------- | --------------------------------------------------------------------- | ------------------------------------------------------- | ---------- |
| ariaDescribedby  | —                                                                     | string                                                  | —          |
| ariaErrormessage | —                                                                     | string                                                  | —          |
| ariaInvalid      | —                                                                     | boolean \| 'false' \| 'true' \| 'grammar' \| 'spelling' | —          |
| ariaLabel        | —                                                                     | string                                                  | —          |
| ariaLabelledby   | —                                                                     | string                                                  | —          |
| ariaRequired     | —                                                                     | boolean \| 'false' \| 'true'                            | —          |
| defaultValue     | 组内默认选中的选项，会与Checkbox的value值做匹配                       | CheckboxValue[]                                         | []         |
| direction        | 组内checkbox布局，可选水平`horizontal`或`vertical`                    | CheckboxDirection                                       | `vertical` |
| disabled         | 整组失效                                                              | boolean                                                 | false      |
| id               | —                                                                     | string                                                  | —          |
| modelValue       | —                                                                     | CheckboxValue[] \| undefined                            | —          |
| name             | CheckboxGroup 下所有 `input[type="checkbox"]` 的 `name` 属性          | string                                                  | -          |
| options          | 指定可选项                                                            | Array&lt;string \| CheckboxOption&gt;                   | []         |
| prefixCls        | —                                                                     | string                                                  | —          |
| type             | 设置所有 checkbox 的样式类型，可选值为: `default`、`card`、`pureCard` | CheckboxType                                            | `default`  |
| value            | 指定选中的选项                                                        | CheckboxValue[] \| undefined                            | []         |

### 方法

#### Checkbox

| 名称    | 描述     |
| ------- | -------- |
| blur()  | 移除焦点 |
| focus() | 获取焦点 |

## Accessibility

### ARIA

- Checkbox 的 role 为 `checkbox`，CheckboxGroup 的 role 为 `list`，它的直接子元素为 `listitem`
- `aria-label`：单独使用 Checkbox 时，如果默认插槽没有文本，建议传入 `aria-label` prop，用一句话描述 Checkbox 的作用，这会让屏幕阅读器读出这个标签的内容。如果你使用的是 Form.Checkbox，可以使用 Form 提供的 label 而无需传入 `aria-label`
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

- 首字母大写
- 不使用标点符号

| ✅ 推荐用法 | ❌ 不推荐用法 |
| ----------- | ------------- |
| Call        | call          |
| Call        | Call;         |
