---
title: '锚点'
description: '创建超链接导航栏。'
locale: 'zh-CN'
slug: 'anchor'
category: 'navigation'
order: 54
englishTitle: 'Anchor'
icon: 'doc-anchor'
upstream: 'navigation/anchor'
---

## 代码演示

### 如何引入

```vue
<script setup lang="ts">
import { Anchor, AnchorLink } from '@aifuxi/semi-ui-vue/anchor';
import '@aifuxi/semi-theme-default/anchor.css';
</script>
```

### 基本示例

每个 live Demo 自带可滚动目标，链接可在独立预览中工作。标签、层级、滑轨和偏移配置保留对应上游示例。
使用 Link 可以创建锚点，点击它会跳转到指定位置。

::demo-block{demo="anchor/zh-cn/Basic" title="基本示例"}
::

### 综合使用

你可以搭配 `getContainer`，`targetOffset`，`style`，`offsetTop` 完成一个拆箱即用的超链接导航栏。

- 滚动容器：你可以通过 `getContainer` 设置滚动内容的容器，默认值为 `window` 。

- 距离顶部的距离：可以通过设置 `targetOffset` 设置文档滚动结束时，锚点距离容器顶部的距离。**v>=1.9**

- 自定义定位方式：Anchor 的默认定位方式为 `relative`，你可以通过 `style` 对象自定义它的定位方式。

- 偏移距离：`offsetTop` 可以在滚动内容距离容器顶部达到指定偏移量时触发当前 Link 切换。

```vue
<script setup lang="ts">
import { Anchor, AnchorLink } from '@aifuxi/semi-ui-vue/anchor';
import '@aifuxi/semi-theme-default/anchor.css';
const getContainer = () => window;
</script>
<template>
  <Anchor
    :get-container="getContainer"
    :offset-top="100"
    :target-offset="100"
    :style="{ position: 'fixed', right: '20px', top: '100px', width: '200px', zIndex: 3 }"
  >
    <AnchorLink href="#基本示例" title="我是固定的 Anchor" />
    <AnchorLink href="#综合使用" title="综合使用" />
    <AnchorLink href="#尺寸" title="尺寸" />
    <AnchorLink href="#滑轨主题" title="滑轨主题" />
    <AnchorLink href="#动态展示" title="动态展示" />
    <AnchorLink href="#显示工具提示" title="显示工具提示" />
    <AnchorLink href="#工具提示位置" title="工具提示位置" />
    <AnchorLink href="#api-参考" title="API参考">
      <AnchorLink href="#anchor" title="Anchor" />
      <AnchorLink href="#anchorlink" title="AnchorLink" />
    </AnchorLink>
  </Anchor>
</template>
```

### 尺寸

Anchor 设置 `size` 可以控制锚点的尺寸。

::demo-block{demo="anchor/zh-cn/DefaultSize" title="尺寸"}
::

::demo-block{demo="anchor/zh-cn/SmallSize" title="尺寸"}
::

### 滑轨主题

Anchor 设置 `railTheme` 可以控制滑轨的主题色。默认值为 `primary`。

::demo-block{demo="anchor/zh-cn/PrimaryRail" title="滑轨主题"}
::

::demo-block{demo="anchor/zh-cn/TertiaryRail" title="滑轨主题"}
::

::demo-block{demo="anchor/zh-cn/MutedRail" title="滑轨主题"}
::

### 动态展示

Anchor 设置 `autoCollapse` 可以动态展示下一级锚点。默认值为 `false`。

::demo-block{demo="anchor/zh-cn/AutoCollapse" title="动态展示"}
::

::demo-block{demo="anchor/zh-cn/Expanded" title="动态展示"}
::

### 显示工具提示

Anchor 设置 `showTooltip` 可以在 Link 超出最大宽度时显示 Link 的文字内容。默认值为 `false`, 更多使用参考 API 说明。

::demo-block{demo="anchor/zh-cn/Tooltip" title="显示工具提示"}
::

### 工具提示位置

Anchor 设置 `position` 可以设置Tooltip的显示位置。它仅在 `showTooltip` 为 `true` 时起作用。

::demo-block{demo="anchor/zh-cn/TooltipPosition" title="工具提示位置"}
::

## API 参考

### Anchor

| 属性                | 说明                                      | 类型                                            | 默认值    |
| ------------------- | ----------------------------------------- | ----------------------------------------------- | --------- |
| `autoCollapse`      | 动态显示当前链接的后代                    | `boolean`                                       | `false`   |
| `class / className` | Vue class 与兼容类名                      | `string`                                        | `—`       |
| `style`             | 根节点样式对象                            | `CSSProperties`                                 | `—`       |
| `defaultAnchor`     | 初始高亮链接，包含 #                      | `string`                                        | `—`       |
| `getContainer`      | 返回文档内容的滚动容器                    | `() => HTMLElement / Window / null / undefined` | `window`  |
| `maxHeight`         | 锚点最大高度                              | `string / number`                               | `750px`   |
| `maxWidth`          | 锚点最大宽度                              | `string / number`                               | `200px`   |
| `offsetTop`         | 滚动高亮切换时的顶部偏移                  | `number`                                        | `0`       |
| `position`          | 工具提示位置，同 Tooltip 支持的位置       | `AnchorPosition`                                | `—`       |
| `railTheme`         | primary、tertiary、muted                  | `AnchorRailTheme`                               | `primary` |
| `scrollMotion`      | 启用滚动动画                              | `boolean`                                       | `false`   |
| `showTooltip`       | 超出宽度时展示提示；对象配置 type 与 opts | `boolean / TypographyShowTooltip`               | `false`   |
| `size`              | small、default                            | `AnchorSize`                                    | `default` |
| `targetOffset`      | 点击后目标距滚动容器顶部的偏移            | `number`                                        | `0`       |

### AnchorLink

| 属性                | 说明                             | 类型            | 默认值  |
| ------------------- | -------------------------------- | --------------- | ------- |
| `class / className` | Vue class 与兼容类名             | `string`        | `—`     |
| `style`             | 根节点样式对象                   | `CSSProperties` | `—`     |
| `disabled`          | 禁用链接                         | `boolean`       | `false` |
| `href`              | 目标元素的片段链接，如 #overview | `string`        | `—`     |
| `title`             | 链接标题                         | `VNodeChild`    | `—`     |

事件：`@change(currentLink, previousLink)` 和 `@click(event: MouseEvent / KeyboardEvent, currentLink)`。Anchor 默认插槽接收 AnchorLink；AnchorLink 默认插槽接收后代，title 插槽定制标题。兼容 Anchor.Link，模板推荐具名 AnchorLink。showTooltip 对象形式为 `{ type: "tooltip" / "popover", opts }`。getContainer 必须返回内容滚动容器，可以与锚点组件容器不同。没有当前链接 v-model。

## 文案规范

- 按句子大小写书写
- 保持简洁，避免换行

## 设计变量

::token-table{component="anchor"}
::

## FAQ

1. **为何我的 Link 没有高亮和滑动跟随？**  
   检查下点击锚点是否可以滚动到指定位置：
   - 不可以，说明 href 有问题，检查文档中是否存在该 id；
   - 可以，可能是滚动容器设置不正确，确保文档内容被包裹在滚动容器内。滚动容器默认为 window，如果你的容器是 .my-container 的 div，则应该将滚动容器设置为该 div。

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { Anchor, AnchorLink } from '@aifuxi/semi-ui-vue/anchor';
import '@aifuxi/semi-theme-default/anchor.css';
const content = useTemplateRef<HTMLElement>('content');
const getContainer = () => content.value;
</script>
<template>
  <Anchor :get-container="getContainer"><AnchorLink href="#overview" title="Overview" /></Anchor>
  <div ref="content" class="my-container" style="height: 240px; overflow: auto">
    <section id="overview" style="min-height: 480px">Overview</section>
  </div>
</template>
```

## Accessibility

Anchor 提供名称为 Side navigation 的 navigation 地标。目标 id 应唯一，每个 href 都应指向实际元素。标题保持简洁，截断时可启用工具提示。链接参与键盘导航，禁用链接不会激活。需要键盘滚动时，为自定义滚动容器提供可访问名称和可聚焦 tabindex。

## React → Vue

| React                              | Vue                             |
| ---------------------------------- | ------------------------------- |
| `Anchor.Link`                      | AnchorLink                      |
| `children`                         | 嵌套 AnchorLink 默认插槽        |
| `title ReactNode`                  | #title 或 VNodeChild            |
| `onChange / onClick`               | @change / @click                |
| `document.querySelector('window')` | () => window（客户端调用）      |
| `getContainer with document query` | useTemplateRef + 返回容器的函数 |
| `className`                        | class（兼容 className）         |
