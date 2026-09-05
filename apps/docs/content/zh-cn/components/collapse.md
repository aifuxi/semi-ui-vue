---
title: '折叠面板'
description: '可以展开或折叠展示内容区域。'
locale: 'zh-CN'
slug: 'collapse'
category: 'show'
order: 67
englishTitle: 'Collapse'
icon: 'doc-accordion'
upstream: 'show/collapse'
---

## 代码演示

### 如何引入

```vue
<script setup lang="ts">
import { Collapse, CollapsePanel } from '@aifuxi/semi-ui-vue/collapse';
import '@aifuxi/semi-theme-default/collapse.css';
</script>
```

### 基本用法

可以同时展开多个面板，可以通过 `defaultActiveKey` 设置默认展开的面板。

::demo-block{demo="collapse/zh-cn/Basic" title="基本用法"}
::

### 手风琴效果

可以通过设置 `accordion` 使每次只允许展开一个面板。

::demo-block{demo="collapse/zh-cn/Accordion" title="手风琴效果"}
::

### 禁用面板

可以通过设置 `disabled` 禁用面板。

::demo-block{demo="collapse/zh-cn/Disabled" title="禁用面板"}
::

### 隐藏面板展开/收起图标

可以通过设置 `showArrow` 隐藏面板展开/收起图标。

::demo-block{demo="collapse/zh-cn/HideIcon" title="隐藏面板展开/收起图标"}
::

### 自定义展开图标

可以通过 `expandIcon` 设置展开图标，`collapseIcon` 设置折叠图标。

::demo-block{demo="collapse/zh-cn/CustomIcon" title="自定义展开图标"}
::

### 自定义右上角辅助区域内容

通过 `extra` 设置右上角辅助区域内容。

**仅在 header 为 string 时生效， 如果 header 为 VNodeChild 会包含 extra 所在的区域，可以自行渲染**

::demo-block{demo="collapse/zh-cn/Extra" title="自定义右上角辅助区域内容"}
::

## API 参考

### Collapse

| 属性                  | 说明                               | 类型                      | 默认值            |
| --------------------- | ---------------------------------- | ------------------------- | ----------------- |
| `accordion`           | 手风琴模式，只展开一个面板         | `boolean`                 | `false`           |
| `activeKey`           | 受控展开键，支持 v-model:activeKey | `string / string[]`       | `—`               |
| `class / className`   | Vue class 与兼容类名               | `HTMLAttributes["class"]` | `—`               |
| `style`               | 根节点样式                         | `StyleValue`              | `—`               |
| `clickHeaderToExpand` | 点击标题展开；false 时只响应箭头   | `boolean`                 | `true`            |
| `collapseIcon`        | 展开状态下的收起图标               | `VNodeChild`              | `IconChevronUp`   |
| `defaultActiveKey`    | 初始展开键                         | `string / string[]`       | `none`            |
| `expandIcon`          | 折叠状态下的展开图标               | `VNodeChild`              | `IconChevronDown` |
| `expandIconPosition`  | left、right                        | `CollapseIconPosition`    | `right`           |
| `keepDOM`             | 折叠后保留内容 DOM                 | `boolean`                 | `false`           |
| `lazyRender`          | 配合 keepDOM，首次展开前不渲染     | `boolean`                 | `false`           |
| `motion`              | 启用展开和收起动画                 | `boolean`                 | `true`            |

### CollapsePanel

| 属性                | 说明                                        | 类型                      | 默认值     |
| ------------------- | ------------------------------------------- | ------------------------- | ---------- |
| `class / className` | Vue class 与兼容类名                        | `HTMLAttributes["class"]` | `—`        |
| `style`             | 根节点样式                                  | `StyleValue`              | `—`        |
| `disabled`          | 禁止切换面板                                | `boolean`                 | `false`    |
| `extra`             | 标题为字符串时显示右上角额外内容            | `VNodeChild`              | `—`        |
| `header`            | 面板标题；节点内容占满标题区域              | `VNodeChild`              | `—`        |
| `itemKey`           | 必填且唯一，匹配 activeKey/defaultActiveKey | `string`                  | `required` |
| `reCalcKey`         | 变化时重新计算内容高度                      | `string / number`         | `—`        |
| `showArrow`         | 显示箭头                                    | `boolean`                 | `true`     |

Collapse 插槽：default、expandIcon、collapseIcon；CollapsePanel 插槽：default、header、extra。事件：`@change(activeKey, event: MouseEvent)` 与 update:activeKey；CollapsePanel 的 `@motion-end()` 在动画结束时触发。手风琴模式同样派发展开键数组。兼容 Collapse.Panel，模板推荐具名 CollapsePanel。

## Accessibility

### ARIA

- 面板 header 右侧按钮 设置了 `aria-hidden=true`
- 面板 header 可交互部分 设置了 `aria-owns` 值为对应面板内容
- 面板内容 设置了 `aria-hidden` 随面板内容展现隐藏其值在 true 和 false 之间自动切换
- 面板 `aria-disabled` 与 `disabled` 属性同步，表示面板禁用

## 文案规范

折叠面板本质是卡片容器增加了收起和展开的功能，所以折叠面板的文案规范需要和 [卡片文案规范](/zh-cn/components/card/) 保持一致

## 设计变量

::token-table{component="collapse"}
::

## FAQ

- ##### Collapse 内嵌表单收起后表单数据会清空 ?

  Collapse 收起之后，默认会销毁相应的 DOM 。所以相应的 field 被卸载了，数据也被清空。可以通过给 collapse 增加 `keepDOM=true`，保留对应的 DOM 节点。

- ##### Collapse 中 Typography 截断逻辑失效 ?

  如果开启了 `keepDOM` 会导致面板样式 `display: none`，此时会影响截断长度的计算。

- ##### 面板标题 整体作为折叠、展开的点击热区， 如果在 Header 中放置了自定义元素（例如 Input），点击时候会导致 Collapse 收起/展开。如何避免？
  可以在自定义元素的 click 事件回调中，阻止事件冒泡至 面板标题 即可。若自定义元素未提供 event 对象，再包裹一层 div，于 div click 中阻止冒泡亦可。

```vue
<script setup lang="ts">
import { Collapse, CollapsePanel } from '@aifuxi/semi-ui-vue/collapse';
import { Input } from '@aifuxi/semi-ui-vue/input';
import '@aifuxi/semi-theme-default/collapse.css';
import '@aifuxi/semi-theme-default/input.css';
</script>
<template>
  <Collapse
    ><CollapsePanel item-key="1">
      <template #header
        ><div style="display: inline-flex" @click.stop><span>Panel header</span><Input /></div
      ></template>
      <p>Hi, bytedance dance dance. This is the docsite of Semi UI.</p>
    </CollapsePanel></Collapse
  >
</template>
```

## React → Vue

| React                                                  | Vue                                        |
| ------------------------------------------------------ | ------------------------------------------ |
| `Collapse.Panel`                                       | CollapsePanel                              |
| `activeKey + onChange`                                 | v-model:activeKey 或 :active-key + @change |
| `children`                                             | default slot                               |
| `header / extra / expandIcon / collapseIcon ReactNode` | 同名插槽或 VNodeChild                      |
| `onMotionEnd`                                          | @motion-end                                |
| `onClick={e => e.stopPropagation()}`                   | @click.stop                                |
| `className`                                            | class（兼容 className）                    |
