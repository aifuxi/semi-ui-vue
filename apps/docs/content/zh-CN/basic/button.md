---
title: 'Button 按钮'
description: '用户使用按钮来触发一个操作或者进行跳转。'
type: 'basic'
order: 22
icon: 'doc-button'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/button` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-basic-button-1" title="如何引入" kind="import" />

### 按钮类型

按钮支持以下类型：

- 主按钮（"primary"，默认）
- 次要按钮（"secondary"）
- 第三按钮（"tertiary"）
- 警告按钮（"warning"）
- 危险按钮（"danger"）

<DemoBlock id="zh-CN-basic-button-2" title="按钮类型" kind="live" />

#### 关于类型字体色值

按钮的字体色值使用的都是 [CSS Variables](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties)，分别为：

- `var(--semi-color-primary)`：主要
- `var(--semi-color-secondary)`：次要
- `var(--semi-color-tertiary)`：第三
- `var(--semi-color-warning)`：警告
- `var(--semi-color-danger)`：危险

你可以直接使用这些主题色定义你的元素。

<DemoBlock id="zh-CN-basic-button-3" title="关于类型字体色值" kind="live" />

### 按钮主题

目前可用的主题（theme）为：

- `light`：浅色背景
- `solid`：深色背景
- `borderless`：无背景
- `outline`: 边框模式

默认的主题为 `light`

#### 浅色背景

<DemoBlock id="zh-CN-basic-button-4" title="浅色背景" kind="live" />

#### 深色背景

<DemoBlock id="zh-CN-basic-button-5" title="深色背景" kind="live" />

#### 无背景

<DemoBlock id="zh-CN-basic-button-6" title="无背景" kind="live" />

#### 边框模式

<DemoBlock id="zh-CN-basic-button-7" title="边框模式" kind="live" />

### 尺寸

默认定义了三种尺寸：

- 大："large"
- 默认："default"
- 小："small"

<DemoBlock id="zh-CN-basic-button-8" title="尺寸" kind="live" />

### 块级按钮

块级按钮具有预先定义好的宽度，它的宽度与按钮里面内容的宽度无关。

<DemoBlock id="zh-CN-basic-button-9" title="块级按钮" kind="live" />

### 图标按钮

可定义按钮的图标。

<DemoBlock id="zh-CN-basic-button-10" title="图标按钮" kind="live" />

### 链接按钮

我们推荐使用 Typography 的 link 属性来实现链接型的文字按钮，具体用法详见[Typography](/zh-CN/basic/typography)

<DemoBlock id="zh-CN-basic-button-11" title="链接按钮" kind="live" />

### 禁用状态

<DemoBlock id="zh-CN-basic-button-12" title="禁用状态" kind="live" />

### 加载状态

按钮支持加载状态，通过设置 loading 参数值为 true 即可，注意：disabled 状态优先级高于 loading 状态。

<DemoBlock id="zh-CN-basic-button-13" title="加载状态" kind="live" />

### AI 风格 - 多彩按钮

设置 `colorful` 即可获得多彩按钮，多彩按钮支持所有的 `theme`， `type` 仅支持 `primary` 及 `tertiary`。

<DemoBlock id="zh-CN-basic-button-14" title="AI 风格 - 多彩按钮" kind="live" />

### 按钮组合

可以将多个按钮放入`ButtonGroup`的容器中，通过设置`size`，`disabled`，`type`可统一设置按钮组合中的按钮尺寸，是否禁用和类型。

#### 组合尺寸

<DemoBlock id="zh-CN-basic-button-15" title="组合尺寸" kind="live" />

#### 组合禁用

<DemoBlock id="zh-CN-basic-button-16" title="组合禁用" kind="live" />

#### 组合类型

<DemoBlock id="zh-CN-basic-button-17" title="组合类型" kind="live" />

### 分裂按钮组合

在`Button`和`Dropdown`结合的场景下，可以使用分裂按钮，分裂按钮添加了按钮之间的间隔，并改变了按钮的边框圆角

#### 基础使用

<DemoBlock id="zh-CN-basic-button-18" title="基础使用" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/button/types.ts` 的公开类型为准。

#### Vue 事件

**Button 原生事件**

| 事件       | 参数                | 说明                   |
| ---------- | ------------------- | ---------------------- |
| click      | [event: MouseEvent] | 点击原生 button 时触发 |
| mousedown  | [event: MouseEvent] | 按下鼠标按钮时触发     |
| mouseenter | [event: MouseEvent] | 指针进入按钮时触发     |
| mouseleave | [event: MouseEvent] | 指针离开按钮时触发     |

#### Vue 插槽

**Button**

| 插槽    | 作用域参数                    | 说明       |
| ------- | ----------------------------- | ---------- |
| default | {}                            | 按钮内容   |
| icon    | { fill, iconSize, iconStyle } | 自定义图标 |

### Button

| 属性                | 说明                                                                                                                                       | 类型                      | 默认值    |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------- | --------- |
| block               | 将按钮设置为块级按钮                                                                                                                       | boolean                   | false     |
| circle              | —                                                                                                                                          | boolean                   | —         |
| colorful            | 多彩按钮，自 2.86.0 版本开始支持                                                                                                           | boolean                   | false     |
| contentClass        | 内容区域 className                                                                                                                         | HTMLAttributes['class']   | 无        |
| disabled            | 禁用状态                                                                                                                                   | boolean                   | false     |
| htmlType            | 设置 `button` 原生的 `type` 值，可选值：`button`、`reset`、`submit`                                                                        | ButtonHtmlType            | "button"  |
| iconPosition        | 图标位置，可选值：`left`\|`right`                                                                                                          | ButtonIconPosition        | `left`    |
| iconSize            | —                                                                                                                                          | ButtonIconSize            | —         |
| iconStyle           | —                                                                                                                                          | StyleValue                | —         |
| loading             | 加载状态                                                                                                                                   | boolean                   | false     |
| noHorizontalPadding | 设置水平方向是否去掉内边距，只对设置了 icon 的 Button 有效。可选值：`true`（等效于 ["left", "right"]），"left"，"right"，["left", "right"] | ButtonNoHorizontalPadding | false     |
| prefixCls           | —                                                                                                                                          | string                    | —         |
| size                | 按钮大小，可选值：`large`、`default`、`small`                                                                                              | ButtonSize                | "default" |
| theme               | 按钮主题，可选值：`solid`（有背景色）、 `borderless`（无背景色）、 `light`（浅背景色）、`outline`(边框模式)                                | ButtonTheme               | "light"   |
| type                | 类型，可选值：`primary`、`secondary`、`tertiary`、`warning`、 `danger`                                                                     | ButtonType                | "primary" |

### ButtonGroup

| 属性      | 说明                                                                                                        | 类型        | 默认值    | 版本 |
| --------- | ----------------------------------------------------------------------------------------------------------- | ----------- | --------- | ---- |
| colorful  | 多彩按钮，自 2.86.0 版本开始支持                                                                            | boolean     | false     |      |
| disabled  | 禁用状态                                                                                                    | boolean     | false     |      |
| prefixCls | —                                                                                                           | string      | —         |      |
| size      | 按钮大小，可选值：`large`、`default`、`small`                                                               | ButtonSize  | "default" |      |
| theme     | 按钮主题，可选值：`solid`（有背景色）、 `borderless`（无背景色）、 `light`（浅背景色）、`outline`(边框模式) | ButtonTheme | "light"   |      |
| type      | 类型，可选值：`primary`、`secondary`、`tertiary`、`warning`、 `danger`                                      | ButtonType  | "primary" |      |

### SplitButtonGroup **V1.12.0新增**

| 属性      | 说明 | 类型   | 默认值 |
| --------- | ---- | ------ | ------ |
| prefixCls | —    | string | —      |

## Accessibility

### ARIA

- `aria-label` 用于表示按钮的作用，对于图标按钮，我们推荐使用此属性
- `aria-disabled` 与 disabled 属性同步，表示按钮禁用

### 键盘和焦点

- Button 的焦点管理与原生 button 一致，键盘用户可以使用 Tab 及 Shift + Tab 切换焦点
- Button 的触发与原生 button 一致，当按钮聚焦时，可以通过 Enter 或 Space 键激活
- ButtonGroup 中的按钮与单个按钮的焦点管理方式一致，可以通过 Tab 以及 Shift + Tab 进行切换

## 文案规范

- 按钮需要清晰可预测，用户应该能够预测他们点击按钮时会发生什么
- 按钮应该总是以鼓励行动的强动词开头
- 为了给用户提供足够的上下文，在按钮上使用 {动词}+{名词} 内容公式；除了常见的动作，如“Done”、“Close”、“Cancel”或“OK”

| ✅ 推荐用法 | ❌ 不推荐用法 |
| ----------- | ------------- |

- 当按钮和其他组件一起时候，如果其他组件（比如 Modal 和Sidesheet）已经提供了足够信息的上下文的话，按钮可以只展示 {动词}，如“Add”、“Create”；

| ✅ 推荐用法 | ❌ 不推荐用法 |
| ----------- | ------------- |

- 始终按句子大小写（Sentence case）原则书写

| ✅ 推荐用法    | ❌ 不推荐用法           |
| -------------- | ----------------------- |
| Create project | Create Create a project |
| Edit profile   | Edit                    |

## FAQ

- #### 为什么Button中的icon属性不起作用？

请检查你的Button import路径，正确的import路径应该为`import { Button } from '@aifuxi/semi-ui-vue;'`，如果你错误地从 @aifuxi/semi-ui-vue/button/button中import的话，获取到的是不带icon功能的基础Button组件
