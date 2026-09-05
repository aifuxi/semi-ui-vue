---
title: '开关'
description: '开关是用于切换两种互斥状态的交互形式'
locale: 'zh-CN'
slug: 'switch'
category: 'input'
order: 48
englishTitle: 'Switch'
icon: 'doc-switch'
upstream: 'input/switch'
---

## 代码演示

### 如何引入

```ts
import { Switch } from '@aifuxi/semi-ui-vue/switch';
import '@aifuxi/semi-theme-default/switch.css';
```

### 基本

通过 `@change` 监听状态变化；`defaultChecked` 指定初始状态，`v-model` 或 `checked` 提供受控状态。  
通过 `aria-label` 描述该 Switch 开关的具体作用

::demo-block{demo="switch/zh-cn/Basic" title="基本"}
::

### 尺寸

你可以通过 size 指定尺寸

::demo-block{demo="switch/zh-cn/Size" title="尺寸"}
::

### 不可用

::demo-block{demo="switch/zh-cn/Disabled" title="不可用"}
::

### 带文本

可以通过 `checkedText` 与 `uncheckedText` 设置开关时的文本  
注意：此项功能在最小的开关(即 size='small'时)无效

::demo-block{demo="switch/zh-cn/Text" title="带文本"}
::

相比于通过 checkedText 与 uncheckedText 设置内嵌的文本，我们更推荐将文本说明放置在 Switch 外部

::demo-block{demo="switch/zh-cn/ExternalText" title="带文本"}
::

### 受控组件

组件是否选中完全取决于传入的 checked 值，配合 @change 事件使用

::demo-block{demo="switch/zh-cn/Controlled" title="受控组件"}
::

### 加载中

可以通过设置 `:loading="true"` 开启加载中状态。

::demo-block{demo="switch/zh-cn/Loading" title="加载中"}
::

## API 参考

### Switch

| 属性               | 类型                                                                   | 默认值      | 说明                                                               |
| ------------------ | ---------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------ |
| `ariaLabel`        | `string`                                                               | `—`         | 可访问名称；模板写作 aria-label。                                  |
| `ariaDescribedby`  | `string`                                                               | `—`         | 关联描述节点 id，模板写作 aria-describedby。                       |
| `ariaErrormessage` | `string`                                                               | `—`         | 关联错误信息节点 id。                                              |
| `ariaInvalid`      | `boolean \| 'false' \| 'true' \| 'grammar' \| 'spelling' \| undefined` | `—`         | ARIA 无效状态。                                                    |
| `ariaLabelledby`   | `string`                                                               | `—`         | 关联标签节点 id，模板写作 aria-labelledby。                        |
| `checked`          | `boolean \| undefined`                                                 | `—`         | 受控选中状态；在 Group 中由组值决定。                              |
| `modelValue`       | `boolean \| undefined`                                                 | `—`         | 默认 v-model 的受控值；兼容 checked/value 同时传入时优先使用后者。 |
| `defaultChecked`   | `boolean \| undefined`                                                 | `false`     | 非受控初始选中状态。                                               |
| `disabled`         | `boolean`                                                              | `false`     | 禁用交互及键盘焦点；Group 对全部子项生效。                         |
| `loading`          | `boolean`                                                              | `false`     | 显示加载图标，同时禁用原生输入交互。                               |
| `size`             | `'large' \| 'default' \| 'small'`                                      | `'default'` | 预设尺寸或 Rating 数字自定义尺寸。                                 |
| `checkedText`      | `VNodeChild`                                                           | `—`         | 开启时显示的内容，small 尺寸无效；支持 #checkedText。              |
| `uncheckedText`    | `VNodeChild`                                                           | `—`         | 关闭时显示的内容，small 尺寸无效；支持 #uncheckedText。            |
| `id`               | `string`                                                               | `—`         | 组件节点 id。                                                      |

### 事件与插槽

`change(checked: boolean, event: Event)`, `update:checked(checked: boolean)`, `update:modelValue(checked: boolean)`.

插槽：`#checkedText`、`#uncheckedText`；均在 small 尺寸下隐藏。鼠标事件通过 `@mouseenter` / `@mouseleave` 监听外层容器。

`class`、`style` 使用 Vue 原生属性。ARIA 属性使用类型列中的 camelCase，模板可写为 `aria-label`、`aria-labelledby`、`aria-describedby` 等。

事件顺序：每次变更先派发 `change`，再派发 `update:checked`、`update:modelValue`。

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

## 设计变量

::token-table{component="switch"}
::

## React → Vue 迁移

| React                                        | Vue                                                                    |
| -------------------------------------------- | ---------------------------------------------------------------------- |
| `import { Switch } from '@douyinfe/semi-ui'` | `@aifuxi/semi-ui-vue/switch` + `@aifuxi/semi-theme-default/switch.css` |
| `useState` / `setState`                      | `shallowRef` / `computed`                                              |
| `className` / `style={{ ... }}`              | `class` / `:style="{ ... }"`                                           |
| `checked` + `onChange`                       | `v-model` / `v-model:checked` / `:checked` + `@change`                 |
| `defaultChecked`                             | `default-checked`                                                      |
| `checkedText` / `uncheckedText` React nodes  | `#checkedText` / `#uncheckedText` 插槽                                 |

## FAQ

### 为什么小尺寸开关不显示文字？

固定上游只在 default、large 尺寸显示 checkedText / uncheckedText。较长说明应放在开关外部并通过 aria-labelledby 或 aria-label 关联。

### 为什么绑定 checked/value 后点击状态没有变化？

受控组件只请求变更，父级必须写回新值。推荐使用 v-model；使用 @change 时注意 Checkbox/Radio 的事件对象和 Switch/Rating 的直接值签名不同。默认值仅用于初始化。
