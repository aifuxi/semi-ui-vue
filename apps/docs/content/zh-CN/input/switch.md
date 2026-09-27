---
title: 'Switch 开关'
description: '开关是用于切换两种互斥状态的交互形式'
type: 'input'
order: 48
icon: 'doc-switch'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/switch` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-input-switch-1" title="如何引入" kind="import" />

### 基本

你可以通过 `change` 事件监听状态变化，也可以使用 `v-model`、`defaultChecked` 或受控的 `checked` 管理选中状态。
通过 `aria-label` 描述该 Switch 开关的具体作用

<DemoBlock id="zh-CN-input-switch-2" title="基本" kind="live" />

### 尺寸

你可以通过 size 指定尺寸

<DemoBlock id="zh-CN-input-switch-3" title="尺寸" kind="live" />

### 不可用

<DemoBlock id="zh-CN-input-switch-4" title="不可用" kind="live" />

### 带文本

可以通过 `checkedText` 与 `uncheckedText` 设置开关时的文本
注意：此项功能在最小的开关(即 size='small'时)无效

<DemoBlock id="zh-CN-input-switch-5" title="带文本" kind="live" />

相比于通过 checkedText 与 uncheckedText 设置内嵌的文本，我们更推荐将文本说明放置在 Switch 外部

<DemoBlock id="zh-CN-input-switch-6" title="带文本" kind="live" />

### 受控组件

受控模式下，组件是否选中完全取决于 `checked`，并通过 `change` 事件通知变化。

<DemoBlock id="zh-CN-input-switch-7" title="受控组件" kind="live" />

### 加载中

可以通过设置 `:loading="true"` 开启加载中状态。

<DemoBlock id="zh-CN-input-switch-8" title="加载中" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/switch/types.ts` 的公开类型为准。

- `v-model` 对应 `modelValue`，`v-model:checked` 对应 `checked`。

#### Vue 事件

**Switch**

| 事件   | 参数                             | 说明         |
| ------ | -------------------------------- | ------------ |
| change | [checked: boolean, event: Event] | 开关状态变化 |

#### Vue 插槽

**Switch**

| 插槽          | 作用域参数 | 说明             |
| ------------- | ---------- | ---------------- |
| checkedText   | {}         | 打开时展示的内容 |
| uncheckedText | {}         | 关闭时展示的内容 |

| 属性             | 说明                                                                                                                                                                                                                                       | 类型                                                                 | 默认值    | 版本  |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- | --------- | ----- |
| ariaLabel        | [aria-label](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute)属性，用来给当前元素加上的标签描述, 提升可访问性                                                               | string                                                               | —         | 2.2.0 |
| ariaDescribedby  | —                                                                                                                                                                                                                                          | string                                                               | —         |       |
| ariaErrormessage | —                                                                                                                                                                                                                                          | string                                                               | —         |       |
| ariaInvalid      | —                                                                                                                                                                                                                                          | boolean \| 'false' \| 'true' \| 'grammar' \| 'spelling' \| undefined | —         |       |
| ariaLabelledby   | [aria-labelledby](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-labelledby_attribute)属性，表明某些元素的 id 是某一对象的标签。它被用来确定控件或控件组与它们标签之间的联系, 提升可访问性 | string                                                               | —         | 2.2.0 |
| checked          | 指示当前是否选中,配合 `v-model` 或 `change` 事件使用                                                                                                                                                                                       | boolean \| undefined                                                 | false     |       |
| modelValue       | —                                                                                                                                                                                                                                          | boolean \| undefined                                                 | —         |       |
| defaultChecked   | 初始是否选中                                                                                                                                                                                                                               | boolean \| undefined                                                 | false     |       |
| disabled         | 是否禁用                                                                                                                                                                                                                                   | boolean                                                              | false     |       |
| loading          | 设置加载状态                                                                                                                                                                                                                               | boolean                                                              | false     | -     |
| size             | 尺寸,可选值`large`,`default`,`small`                                                                                                                                                                                                       | SwitchSize                                                           | 'default' |       |
| checkedText      | 打开时展示的内容, size 为 small 时无效                                                                                                                                                                                                     | VNodeChild                                                           | —         |       |
| uncheckedText    | 关闭时展示的内容, size 为 small 时无效                                                                                                                                                                                                     | VNodeChild                                                           | —         |       |
| id               | —                                                                                                                                                                                                                                          | string                                                               | —         |       |

## Accessibility

### ARIA

- Switch 具有 `switch` role，当 checked 为 true 时，`aria-checked` 将被自动设置为 true，反之亦然
- 作为表单控件应该带有 Label，当你使用 Form.Switch 时会自动被带上
- 如果你单独使用 Switch，建议使用 `aria-label` 描述当前标签作用

### 键盘和焦点

- 键盘用户可以使用 `Tab` 及 `Shift + Tab` 切换焦点
- 聚焦时可以通过 `Space` 键切换开启或关闭状态

## 文案规范

- 开关描述
- 首字母大写，不需要标点符号
- 间接明了地说明该设置的开启或关闭状态
- 如果需要，解释给用户开启和关闭状态所代表的情况
