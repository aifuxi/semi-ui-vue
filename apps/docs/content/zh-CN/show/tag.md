---
title: 'Tag 标签'
description: '标签是图形化标记界面上的元素的组件，达到快速识别、分组的目的。'
type: 'show'
order: 82
icon: 'doc-tag'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/tag` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-show-tag-1" title="如何引入" kind="import" />

### 基本用法

基本标签用法，将内容使用 `` 标签包裹即可。
添加 `closable` 属性可显示关闭按钮；点击按钮会触发 `close` 事件，在事件中调用 `preventDefault()` 可阻止标签隐藏。

<DemoBlock id="zh-CN-show-tag-2" title="基本用法" kind="live" />

### 尺寸

默认定义了两种尺寸：大、小（默认）。

<DemoBlock id="zh-CN-show-tag-3" title="尺寸" kind="live" />

### 形状

默认定义了两种形状：`square`（默认）、`circle`。

<DemoBlock id="zh-CN-show-tag-4" title="形状" kind="live" />

### 配置图标

v2.44 后支持通过配置 prefixIcon、suffixIcon， 可以在 children 内容前后添加 Icon 图标。

<DemoBlock id="zh-CN-show-tag-5" title="配置图标" kind="live" />

### 颜色

标签支持默认色板的 16 种颜色和白色，包括：`amber`、 `blue`、 `cyan`、 `green`、 `grey`、 `indigo`、 `light-blue`、 `light-green`、 `lime`、 `orange`、 `pink`、 `purple`、 `red`、 `teal`、 `violet`、 `yellow`、 `white`，也可以通过 style 来自定义颜色样式。

<DemoBlock id="zh-CN-show-tag-6" title="颜色" kind="live" />

### AI 风格 - 多彩标签

设置 `colorful` 为 `true` 即可获得多彩的标签。注意: 多彩标签的字重和非多彩标签字重不同。

多彩标签可通过 `gradient` 区分是否为渐变色。

<DemoBlock id="zh-CN-show-tag-7" title="AI 风格 - 多彩标签" kind="live" />

### 样式类型

标签支持三种样式类型，包括浅色底色 `light`，白色底色 `ghost`，深色底色 `solid`；默认值为 `light`。通过 type 配置

<DemoBlock id="zh-CN-show-tag-8" title="样式类型" kind="live" />

### 头像标签

设置 `avatarSrc` 可以生成头像标签。结合 `avatarShape` 可以调整头像标签的形状，支持 `square` 和 `circle`。

<DemoBlock id="zh-CN-show-tag-9" title="头像标签" kind="live" />

### 不可见的

通过 visible 属性控制标签是否可见。

<DemoBlock id="zh-CN-show-tag-10" title="不可见的" kind="live" />

### TagGroup 使用

在 TagGroup 内通过 `tagList` 传入 tags 配置，并且设置 `maxTagCount` 属性, 超出数量限制后，会显示为 +N
通过设置 `showPopover` 属性，来控制 hover 到 +N Tag 时，是否通过 Popover 显示剩余内容

<DemoBlock id="zh-CN-show-tag-11" title="TagGroup 使用" kind="live" />

如果 TagGroup 中的标签可删除，需要监听 `tagClose` 事件并更新传给 TagGroup 的 `tagList`。

<DemoBlock id="zh-CN-show-tag-12" title="TagGroup 使用" kind="live" />

### SplitTagGroup 组合标签

使用 `SplitTagGroup` 可以将多个标签组合成一个整体，首尾标签会有圆角，中间标签圆角为 0，形成连续的视觉效果。

<DemoBlock id="zh-CN-show-tag-13" title="SplitTagGroup 组合标签" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/tag/types.ts`、`packages/ui/src/tag/index.ts` 的公开类型为准。

- `v-model:visible` 对应标签的可见状态。

#### Vue 事件

**Tag**

| 事件       | 参数                                                                                             | 说明               |
| ---------- | ------------------------------------------------------------------------------------------------ | ------------------ |
| click      | [event: MouseEvent \| KeyboardEvent]                                                             | 点击或键盘激活标签 |
| close      | [content: VNodeChild, event: MouseEvent \| KeyboardEvent, tagKey: string \| number \| undefined] | 关闭标签           |
| keydown    | [event: KeyboardEvent]                                                                           | 标签触发键盘事件   |
| mouseenter | [event: MouseEvent]                                                                              | 指针进入标签       |

**TagGroup**

| 事件            | 参数                                                                                             | 说明               |
| --------------- | ------------------------------------------------------------------------------------------------ | ------------------ |
| plusNMouseenter | [event: MouseEvent]                                                                              | 指针进入 +N 标签   |
| tagClose        | [content: VNodeChild, event: MouseEvent \| KeyboardEvent, tagKey: string \| number \| undefined] | 关闭标签组中的标签 |

#### Vue 插槽

**Tag**

| 插槽       | 作用域参数 | 说明     |
| ---------- | ---------- | -------- |
| default    | {}         | 标签内容 |
| prefixIcon | {}         | 前缀图标 |
| suffixIcon | {}         | 后缀图标 |

**SplitTagGroup**

| 插槽    | 作用域参数 | 说明       |
| ------- | ---------- | ---------- |
| default | {}         | Tag 子组件 |

### Tag

| 属性        | 说明                                                                                                                                                                                             | 类型                    | 默认值    | 版本   |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- | --------- | ------ |
| avatarShape | 头像 Tag 形状，可选 `square` 和 `circle`                                                                                                                                                         | TagAvatarShape          | `square`  | -      |
| avatarSrc   | 头像的资源地址                                                                                                                                                                                   | string                  | -         | -      |
| class       | —                                                                                                                                                                                                | HTMLAttributes['class'] | —         |        |
| className   | 类名                                                                                                                                                                                             | HTMLAttributes['class'] | —         |        |
| closable    | 标签是否可以关闭                                                                                                                                                                                 | boolean                 | false     |        |
| color       | 标签的颜色，可选 `amber`、 `blue`、 `cyan`、 `green`、 `grey`、 `indigo`、 `light-blue`、 `light-green`、 `lime`、 `orange`、 `pink`、 `purple`、 `red`、 `teal`、 `violet`、 `yellow`、 `white` | TagColor                | `grey`    |        |
| colorful    | 多彩标签                                                                                                                                                                                         | boolean                 | false     | 2.86.0 |
| content     | —                                                                                                                                                                                                | VNodeChild              | —         |        |
| gradient    | 是否为渐变色，需在 colorful 为 true 时生效                                                                                                                                                       | boolean                 | false     | 2.86.0 |
| prefixIcon  | 前缀图标                                                                                                                                                                                         | VNodeChild              | —         | 2.44.0 |
| shape       | 标签的形状，可选 `square`、 `circle`                                                                                                                                                             | TagShape                | `square`  | 2.20.0 |
| size        | 标签的尺寸，可选 `small`、 `default`、 `large`                                                                                                                                                   | TagSize                 | `default` |        |
| style       | 样式                                                                                                                                                                                             | StyleValue              | —         |        |
| suffixIcon  | 后缀图标                                                                                                                                                                                         | VNodeChild              | —         | 2.44.0 |
| tabIndex    | —                                                                                                                                                                                                | number                  | —         |        |
| tagKey      | 标签的唯一标识，不允许重复                                                                                                                                                                       | string \| number        | —         |        |
| type        | 标签的样式类型，可选 `ghost`、 `solid`、 `light`                                                                                                                                                 | TagType                 | `light`   |        |
| visible     | 标签是否可见                                                                                                                                                                                     | boolean                 | true      |        |

### TagGroup

| 属性         | 说明                                                                                                         | 类型                               | 默认值    | 版本 |
| ------------ | ------------------------------------------------------------------------------------------------------------ | ---------------------------------- | --------- | ---- |
| avatarShape  | 头像 Tag 形状，可选 `square` 和 `circle`                                                                     | TagAvatarShape                     | `square`  | -    |
| class        | —                                                                                                            | HTMLAttributes['class']            | —         |      |
| className    | 类名                                                                                                         | HTMLAttributes['class']            | —         |      |
| maxTagCount  | 最大数量限制，超出后显示为 +N                                                                                | number                             | —         |      |
| mode         | —                                                                                                            | string                             | —         |      |
| popoverProps | popover 的配置属性，可以控制 direction, zIndex, trigger 等，具体参考 [Popover](/zh-CN/show/popover#API_参考) | PopoverProps                       | {}        |      |
| restCount    | —                                                                                                            | number                             | —         |      |
| showPopover  | hover 到 +N 时，是否通过 Popover 显示剩余内容                                                                | boolean                            | false     |      |
| size         | 标签的尺寸，可选 `small`、 `default`、 `large`                                                               | TagSize                            | `default` |      |
| style        | 样式                                                                                                         | StyleValue                         | —         |      |
| tagList      | 标签组                                                                                                       | Array&lt;TagData \| VNodeChild&gt; | —         |      |

### SplitTagGroup

| 属性      | 说明 | 类型                    | 默认值 | 版本   |
| --------- | ---- | ----------------------- | ------ | ------ |
| class     | —    | HTMLAttributes['class'] | —      |        |
| className | 类名 | HTMLAttributes['class'] | —      | 2.97.0 |
| style     | 样式 | StyleValue              | —      | 2.97.0 |

## Accessibility

### ARIA

- `aria-label` 用于表示 `Tag` 的作用，对于可删除或者可点击的 `Tag`，我们推荐使用此属性

### 键盘和焦点

- 如果当前 `Tag` 可交互，那么这个 `Tag` 可被聚焦到。如：
- 监听 `click` 事件时，键盘用户可以通过 `Enter` 键激活此 `Tag`
- `closable` 属性为 `true` 时，键盘用户可以通过 `Delete` 键删除此 `Tag`
- `Tag` 被聚焦时，键盘用户可以通过 `Esc` 键使当前聚焦 `Tag` 失焦

## 文案规范

- 由于空间有限，标签文本应尽可能简短
- 避免换行
- 使用句子大小写；
