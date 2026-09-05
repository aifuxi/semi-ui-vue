---
title: '标签'
description: '标签是图形化标记界面上的元素的组件，达到快速识别、分组的目的。'
locale: 'zh-CN'
slug: 'tag'
category: 'show'
order: 82
englishTitle: 'Tag'
icon: 'doc-tag'
upstream: 'show/tag'
---

## 代码演示

### 如何引入

```vue
<script setup lang="ts">
import { Tag, TagGroup, SplitTagGroup } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
</script>
```

### 基本用法

基本标签用法，将内容使用 `<Tag>` 标签包裹即可。  
可以通过添加 `closable` 属性将其变为可关闭标签，此时点击 x 关闭会触发 close 事件，在 close 中阻止默认事件可以使其点击后依然显示不隐藏

::demo-block{demo="tag/zh-cn/Basic" title="基本用法"}
::

### 尺寸

默认定义了两种尺寸：大、小（默认）。

::demo-block{demo="tag/zh-cn/Size" title="尺寸"}
::

### 形状

默认定义了两种形状：`square`（默认）、`circle`。

::demo-block{demo="tag/zh-cn/Shape" title="形状"}
::

### 配置图标

v2.44 后支持通过配置 prefixIcon、suffixIcon， 可以在 children 内容前后添加 Icon 图标。

::demo-block{demo="tag/zh-cn/Icons" title="配置图标"}
::

### 颜色

标签支持默认色板的 16 种颜色和白色，包括：`amber`、 `blue`、 `cyan`、 `green`、 `grey`、 `indigo`、 `light-blue`、 `light-green`、 `lime`、 `orange`、 `pink`、 `purple`、 `red`、 `teal`、 `violet`、 `yellow`、 `white`，也可以通过 style 来自定义颜色样式。

::demo-block{demo="tag/zh-cn/Color" title="颜色"}
::

### AI 风格 - 多彩标签

设置 `colorful` 为 `true` 即可获得多彩的标签。<strong>注意: </strong> 多彩标签的字重和非多彩标签字重不同。

多彩标签可通过 `gradient` 区分是否为渐变色。

::demo-block{demo="tag/zh-cn/Colorful" title="AI 风格 - 多彩标签"}
::

### 样式类型

标签支持三种样式类型，包括浅色底色 `light`，白色底色 `ghost`，深色底色 `solid`；默认值为 `light`。通过 type 配置

::demo-block{demo="tag/zh-cn/Type" title="样式类型"}
::

### 头像标签

设置 `avatarSrc` 可以生成头像标签。结合 `avatarShape` 可以调整头像标签的形状，支持 `square` 和 `circle`。

::demo-block{demo="tag/zh-cn/Avatar" title="头像标签"}
::

### 不可见的

通过 visible 属性控制标签是否可见。

::demo-block{demo="tag/zh-cn/Visible" title="不可见的"}
::

### TagGroup 使用

在 TagGroup 内通过 `tagList` 传入 tags 配置，并且设置 `maxTagCount` 属性, 超出数量限制后，会显示为 +N  
通过设置 `showPopover` 属性，来控制 hover 到 +N Tag 时，是否通过 Popover 显示剩余内容

::demo-block{demo="tag/zh-cn/Group" title="TagGroup 使用"}
::

如果 TagGroup 中的标签可删除，用户需要在 `@tag-close` 中处理传递给 TagGroup 的 `tagList`。

::demo-block{demo="tag/zh-cn/GroupClose" title="TagGroup 使用"}
::

### SplitTagGroup 组合标签

使用 `SplitTagGroup` 可以将多个标签组合成一个整体，首尾标签会有圆角，中间标签圆角为 0，形成连续的视觉效果。

::demo-block{demo="tag/zh-cn/SplitGroup" title="SplitTagGroup 组合标签"}
::

## API 参考

### Tag

| 属性                      | 说明                                       | 类型                      | 默认值               |
| ------------------------- | ------------------------------------------ | ------------------------- | -------------------- |
| `avatarShape`             | 头像形状 square、circle                    | `TagAvatarShape`          | `square`             |
| `avatarSrc`               | 头像资源地址                               | `string`                  | `—`                  |
| `class / className`       | 样式类，className 为兼容别名               | `HTMLAttributes["class"]` | `—`                  |
| `style`                   | 内联样式                                   | `StyleValue`              | `—`                  |
| `closable`                | 显示关闭按钮                               | `boolean`                 | `false`              |
| `color`                   | 默认色板的 16 色和 white                   | `TagColor`                | `grey`               |
| `colorful`                | AI 多彩样式                                | `boolean`                 | `false`              |
| `gradient`                | colorful 下启用渐变                        | `boolean`                 | `false`              |
| `prefixIcon / suffixIcon` | 前后图标，优先使用同名插槽                 | `VNodeChild`              | `—`                  |
| `content`                 | 数据驱动的内容，默认插槽优先               | `VNodeChild`              | `—`                  |
| `shape`                   | square、circle                             | `TagShape`                | `square`             |
| `size`                    | default 与 small 均为 20px；large 为 24px  | `TagSize`                 | `default`            |
| `type`                    | light、solid、ghost                        | `TagType`                 | `light`              |
| `visible`                 | 显式传入后为受控状态；支持 v-model:visible | `boolean`                 | `uncontrolled: true` |
| `tagKey`                  | 标签唯一标识，传给 close 事件              | `string \| number`        | `—`                  |
| `tabIndex`                | 仅可交互标签使用                           | `number`                  | `0 (interactive)`    |
| `aria-label`              | 可访问名称，通过原生属性传入               | `string`                  | `—`                  |

### TagGroup

| 属性                | 说明                                     | 类型                           | 默认值    |
| ------------------- | ---------------------------------------- | ------------------------------ | --------- |
| `avatarShape`       | 组内头像默认形状                         | `TagAvatarShape`               | `square`  |
| `class / className` | 样式类，className 为兼容别名             | `HTMLAttributes["class"]`      | `—`       |
| `style`             | 内联样式                                 | `StyleValue`                   | `—`       |
| `maxTagCount`       | 最多显示数量，剩余项折叠为 +N            | `number`                       | `—`       |
| `restCount`         | 自定义 +N 数字，非零值生效               | `number`                       | `—`       |
| `popoverProps`      | 剩余内容 Popover 的配置                  | `PopoverProps`                 | `—`       |
| `showPopover`       | 悬停 +N 时显示剩余标签                   | `boolean`                      | `false`   |
| `size`              | 组内标签默认尺寸                         | `TagSize`                      | `default` |
| `tagList`           | 配置对象数组；custom 模式为 Vue 节点数组 | `Array<TagData \| VNodeChild>` | `[]`      |
| `mode`              | custom 时直接使用 tagList 中的节点       | `string`                       | `—`       |

### SplitTagGroup

| 属性                | 说明                         | 类型                      | 默认值 |
| ------------------- | ---------------------------- | ------------------------- | ------ |
| `class / className` | 样式类，className 为兼容别名 | `HTMLAttributes["class"]` | `—`    |
| `style`             | 内联样式                     | `StyleValue`              | `—`    |
| `aria-label`        | 组合标签的可访问名称         | `string`                  | `—`    |

插槽：`default`、`prefixIcon`、`suffixIcon`。事件：`@click(event)`、`@close(content, event, tagKey)`、`@keydown(event)`、`@mouseenter(event)` 和 `update:visible`。在 close 中调用 `event.preventDefault()` 可阻止隐藏。

TagGroup 派发 `@tag-close(content, event, tagKey)` 与 `@plus-n-mouseenter(event)`。`TagData` 在 TagProps 上增加 onClick、onClose、onKeydown、onMouseenter；数据内容用 content 代替 React children。删除后由父层更新 tagList。SplitTagGroup 的默认插槽接收直接 Tag 子节点。

## Accessibility

### ARIA

- `aria-label` 用于表示 `Tag` 的作用，对于可删除或者可点击的 `Tag` ，我们推荐使用此属性

### 键盘和焦点

- 如果当前 `Tag` 可交互，那么这个 `Tag` 可被聚焦到。如：
  - 使用了 `@click` 属性时，键盘用户可以通过 `Enter` 键激活此 `Tag`
  - `closable` 属性为 `true` 时，键盘用户可以通过 `Delete` 键删除此 `Tag`
  - `Tag` 被聚焦时，键盘用户可以通过 `Esc` 键使当前聚焦 `Tag` 失焦

## 文案规范

- 由于空间有限，标签文本应尽可能简短
- 避免换行
- 使用句子大小写；

## 设计变量

::token-table{component="tag"}
::

## FAQ

**为什么受控 Tag 关闭后仍可见？** 需要父层更新 visible，或使用 v-model:visible。

**如何阻止关闭？** 在 close 回调调用 event.preventDefault()。

**为什么删除后 +N 没变化？** 用唯一 tagKey 更新父层 tagList，组数量来自传入数据。

## React → Vue

| React                               | Vue                                  |
| ----------------------------------- | ------------------------------------ |
| `children`                          | default 插槽或 content 属性          |
| `prefixIcon / suffixIcon ReactNode` | 同名插槽或 VNodeChild                |
| `visible + onClose`                 | v-model:visible 或 :visible + @close |
| `tagList[].children`                | tagList[].content                    |
| `onTagClose / onPlusNMouseEnter`    | @tag-close / @plus-n-mouseenter      |
| `SplitTagGroup children`            | 直接 Tag 默认插槽                    |
| `className / CSSProperties`         | class（兼容 className）/ StyleValue  |
