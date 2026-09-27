---
title: 'UserGuide 用户引导'
description: '用于页面对新用户进行功能引导'
type: 'show'
order: 85
icon: 'doc-userGuide'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/user-guide` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-show-userGuide-1" title="如何引入" kind="import" />

### 基本用法

<DemoBlock id="zh-CN-show-userGuide-2" title="基本用法" kind="live" />

### 主题

`popup` 气泡卡片模式下提供两种主题 `default` 和 `primary`，通过 `theme` 属性设置。

<DemoBlock id="zh-CN-show-userGuide-3" title="主题" kind="live" />

### 气泡卡片弹出位置

`popup` 气泡卡片模式下提供 12 种弹出位置，可选值有`top`, `topLeft`, `topRight`, `left`, `leftTop`, `leftBottom`, `right`, `rightTop`, `rightBottom`, `bottom`, `bottomLeft`, `bottomRight`，还可以通过 `showArrow` 属性设置是否显示箭头。

<DemoBlock id="zh-CN-show-userGuide-4" title="气泡卡片弹出位置" kind="live" />

### 设置高亮区域大小

通过 `spotlightPadding` 属性设置。

<DemoBlock id="zh-CN-show-userGuide-5" title="设置高亮区域大小" kind="live" />

### 定制按钮

通过 `nextButtonProps` 和 `prevButtonProps` 属性设置按钮的样式。

<DemoBlock id="zh-CN-show-userGuide-6" title="定制按钮" kind="live" />

### 受控

通过 `v-model:current` 双向绑定当前引导步骤。

<DemoBlock id="zh-CN-show-userGuide-7" title="受控" kind="live" />

### 弹窗式引导

通过 `mode` 属性设置为 `modal` 开启弹窗式引导。

<DemoBlock id="zh-CN-show-userGuide-8" title="弹窗式引导" kind="live" />

### 无遮罩

通过 `mask` 属性设置为 `false` 开启无遮罩引导。

<DemoBlock id="zh-CN-show-userGuide-9" title="无遮罩" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/user-guide/types.ts`、`packages/ui/src/button/types.ts` 的公开类型为准。

- `v-model:current` 对应 `current` 与 `update:current`；`visible` 是单向受控 prop。

#### Vue 用法

- `nextButtonProps` 与 `prevButtonProps` 继承 ButtonProps；其中 `onClick` 是嵌套 callback prop。
- `steps[].target` 可传 Element 或返回 Element 的函数；Portal 容器由 `getPopupContainer` 指定。
- 步骤中的 cover、title、description 保留 VNode 配置；同名作用域插槽优先。

#### Vue 事件

**UserGuide**

| 事件           | 参数              | 说明                 |
| -------------- | ----------------- | -------------------- |
| change         | [current: number] | 步骤索引变化         |
| next           | [current: number] | 点击下一步后触发     |
| prev           | [current: number] | 点击上一步后触发     |
| finish         | []                | 完成全部步骤         |
| skip           | []                | 跳过引导             |
| update:current | [current: number] | 更新 v-model:current |

#### Vue 插槽

**UserGuide**

| 插槽        | 作用域参数               | 说明         |
| ----------- | ------------------------ | ------------ |
| cover       | { current, index, step } | 当前步骤封面 |
| title       | { current, index, step } | 当前步骤标题 |
| description | { current, index, step } | 当前步骤描述 |

| 属性              | 说明                                                                                                                                                                         | 类型                         | 默认值    | 版本 |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | --------- | ---- |
| class             | Vue 原生类名                                                                                                                                                                 | HTMLAttributes['class']      | —         |      |
| className         | 样式类名                                                                                                                                                                     | HTMLAttributes['class']      | -         |      |
| current           | `v-model:current` 绑定的步骤索引                                                                                                                                             | number                       | 0         |      |
| finishText        | 最后一步完成按钮的文本                                                                                                                                                       | string                       | '完成'    |      |
| getPopupContainer | 指定父级 DOM，弹层将会渲染至该 DOM 中                                                                                                                                        | () =&gt; HTMLElement         | -         |      |
| mask              | 是否显示蒙层                                                                                                                                                                 | boolean                      | true      |      |
| mode              | 引导模式，可选值：`popup`（气泡卡片）或 `modal`（弹窗式）                                                                                                                    | UserGuideMode                | `popup`   |      |
| nextButtonProps   | 下一步按钮配置；onClick 是嵌套 callback prop                                                                                                                                 | UserGuideButtonProps         | {}        |      |
| position          | 弹出层相对于目标元素的位置，可选值：`top`, `topLeft`, `topRight`, `left`, `leftTop`, `leftBottom`, `right`, `rightTop`, `rightBottom`, `bottom`, `bottomLeft`, `bottomRight` | PopoverPosition              | `bottom`  |      |
| prevButtonProps   | 上一步按钮配置；onClick 是嵌套 callback prop                                                                                                                                 | UserGuideButtonProps         | {}        |      |
| showPrevButton    | 是否显示上一步按钮                                                                                                                                                           | boolean                      | true      |      |
| showSkipButton    | 是否显示跳过按钮                                                                                                                                                             | boolean                      | true      |      |
| spotlightPadding  | 高亮区域的内边距，单位为像素                                                                                                                                                 | number                       | 5         |      |
| steps             | 引导步骤配置，必填                                                                                                                                                           | readonly UserGuideStepItem[] | []        |      |
| style             | 自定义样式                                                                                                                                                                   | StyleValue                   | -         |      |
| theme             | 主题样式，可选值：`default` 或 `primary`                                                                                                                                     | UserGuideTheme               | `default` |      |
| visible           | 是否显示；单向受控 prop                                                                                                                                                      | boolean                      | false     |      |
| zIndex            | 弹层层级                                                                                                                                                                     | number                       | 1030      |      |

### Steps.Step

| 属性             | 说明                                       | 类型                    | 默认值 | 版本 |
| ---------------- | ------------------------------------------ | ----------------------- | ------ | ---- |
| className        | 步骤的自定义类名                           | HTMLAttributes['class'] | -      |      |
| cover            | 封面 VNode；cover 插槽优先                 | VNodeChild              | -      |      |
| target           | 目标元素，高亮区域会聚焦到这个元素上       | UserGuideTarget         | -      |      |
| title            | 标题 VNode；title 插槽优先                 | VNodeChild              | -      |      |
| description      | 描述 VNode；description 插槽优先           | VNodeChild              | -      |      |
| mask             | 是否显示此步骤的蒙层，会覆盖全局配置       | boolean                 | -      |      |
| showArrow        | 是否显示箭头（仅在 mode=`popup` 时有效）   | boolean                 | true   |      |
| spotlightPadding | 此步骤高亮区域区域的内边距，会覆盖全局配置 | number                  | -      |      |
| theme            | 此步骤的主题，会覆盖全局配置               | UserGuideTheme          | -      |      |
| position         | 此步骤弹出层的位置，会覆盖全局配置         | PopoverPosition         | -      |      |
