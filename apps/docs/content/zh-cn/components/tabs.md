---
title: '标签栏'
description: '当内容需要分组并在不同模块页面中展示，可使用 Tabs 标签栏目对不同的组/页之间进行切换'
locale: 'zh-CN'
slug: 'tabs'
category: 'navigation'
order: 60
englishTitle: 'Tabs'
icon: 'doc-tabs'
upstream: 'navigation/tabs'
---

## 代码演示

### 如何引入

```vue
<script setup lang="ts">
import { Tabs, TabPane } from '@aifuxi/semi-ui-vue/tabs';
import '@aifuxi/semi-theme-default/tabs.css';
</script>
```

### 基本用法

标签栏支持四种样式：线条式、按钮式、卡片式、斜线式。默认选中第一项。  
标签页支持两种传入方式，两者渲染流程上有所区别：

- 通过 `tabList` 传入标签页对象的数组，当使用 `tabList` 时每次只渲染当前传入的节点
- 或使用 `<TabPane>` 逐项显式传入，使用 `<TabPane>` 时默认会渲染所有面板，可以通过设置 `:keep-dom="false"` 只渲染当前面板，此时不会有动画效果。

> **注意事项**
>
> 1. tabList 与 TabPane 默认插槽 同时使用时，会优先渲染通过 tabList 传入的数据。不建议同时配置
> 2. 使用 TabPane 默认插槽 时，TabPane 必须为 Tabs 的直接子元素，否则 Tabs 将无法正确收集子组件如 itemKey 等相关属性

::demo-block{demo="tabs/zh-cn/Basic" title="基本用法"}
::

::demo-block{demo="tabs/zh-cn/Button" title="基本用法"}
::

::demo-block{demo="tabs/zh-cn/Card" title="基本用法"}
::

::demo-block{demo="tabs/zh-cn/Slash" title="基本用法"}
::

### 带图标的

有图标的标签栏。

::demo-block{demo="tabs/zh-cn/Icons" title="带图标的"}
::

### 更多选项收入 More 展示

支持将多余 Tab 合并为 ”更多“ 下拉菜单，`more` 传入数字即可，数字表示收入下拉菜单的 Tab 数量。**（>=v2.59.0）**

::demo-block{demo="tabs/zh-cn/More" title="更多选项收入 More 展示"}
::

也支持高级配置，向 `more` 传入对象，内可传入

- `count`: 表示收入下拉菜单的 Tab 数量
- `render`: 自定义 Trigger 的渲染函数，返回的 VNodeChild 会被渲染为下拉菜单的 Trigger
- `dropdownProps`: 配置 trigger、position、className、style；完整可用字段见 API

::demo-block{demo="tabs/zh-cn/CustomMore" title="更多选项收入 More 展示"}
::

### 垂直的标签栏

`type` 为 `line`, `card`, `button` 支持水平和垂直两种模式，`tabPosition='left|top'`， 默认为 `top`。`type` 为 `slash` 仅支持水平模式，无需设置。

::demo-block{demo="tabs/zh-cn/Vertical" title="垂直的标签栏"}
::

### 滚动折叠

通过设置 `collapsible` 可以支持滚动折叠，目前只支持 horizontal 模式。

::demo-block{demo="tabs/zh-cn/Collapsible" title="滚动折叠"}
::

**自定义滚动箭头渲染**

通过 `#arrow="{ items, position, click, defaultNode }"` 修改滚动箭头，作用域包含溢出项、位置、点击处理函数与默认 Vue 节点。

**注**：arrow 插槽 的前三个参数自 2.61.0 支持，defaultNode 自 2.66.0 支持。

::demo-block{demo="tabs/zh-cn/CustomArrow" title="滚动折叠"}
::

**修改切换箭头的渲染位置**

通过 `arrowPosition` 来修改溢出指示器的位置，可选 `start` `both` `end`

::demo-block{demo="tabs/zh-cn/ArrowPosition" title="滚动折叠"}
::

### 自动溢出检测

**v>= 2.97.0**

通过设置 `collapsible="auto"` 可以启用自动溢出检测功能。组件会自动检测 Tab 是否溢出容器：

- 当 Tab 超出容器宽度或发生换行时，自动启用折叠模式（显示左右箭头）
- 当容器宽度增加或 Tab 数量减少后，所有 Tab 可以完整显示时，自动退出折叠模式

这个功能避免了开发者需要手动判断是否需要折叠的问题，特别适用于响应式布局场景。

::demo-block{demo="tabs/zh-cn/AutoOverflow" title="自动溢出检测"}
::

### 禁用

禁用标签栏中的某一个标签页。

::demo-block{demo="tabs/zh-cn/Disabled" title="禁用"}
::

### 标签栏内容扩展

传入 `tabBarExtraContent` 属性可以在标签栏右侧添加附加操作。

::demo-block{demo="tabs/zh-cn/Extra" title="标签栏内容扩展"}
::

### 标签栏二次封装

通过 `#tabBar="{ activeKey, list, onTabClick }"` 作用域插槽和公开 `TabItem` 可对标签栏进行二次封装。

::demo-block{demo="tabs/zh-cn/CustomBar" title="标签栏二次封装"}
::

### 拖拽排序

通过 `#tabBar` 作用域插槽与公开 `TabItem` 可以实现标签栏拖拽排序。本示例使用 Pointer Events，保留 5px 激活距离、拖动透明度和排序后的选中状态。

> **使用前提**
>
> 原上游示例依赖 React dnd-kit；Vue 实现改用组件内 Pointer Events：
>
> Vue 示例使用原生 Pointer Events，无需额外拖拽库依赖。

::demo-block{demo="tabs/zh-cn/Draggable" title="拖拽排序"}
::

### 动态更新

通过绑定事件，可以使标签栏动态更新。

::demo-block{demo="tabs/zh-cn/Dynamic" title="动态更新"}
::

### 关闭

关闭标签栏中的某一个标签页。  
只有卡片样式的页签支持关闭选项。使用 `closable` 来开启。

::demo-block{demo="tabs/zh-cn/Closable" title="关闭"}
::

## API 参考

### Tabs

| 属性                     | 说明                                          | 类型                       | 默认值               |
| ------------------------ | --------------------------------------------- | -------------------------- | -------------------- |
| `activeKey / modelValue` | 受控激活键；支持 v-model:activeKey 或 v-model | `string`                   | `—`                  |
| `arrowPosition`          | 折叠模式下箭头位置 start、end、both           | `TabArrowPosition`         | `both`               |
| `class / className`      | Vue class 与兼容类名                          | `string`                   | `—`                  |
| `style`                  | 根节点样式对象                                | `CSSProperties`            | `—`                  |
| `collapsible`            | 启用横向折叠；auto 自动检测溢出               | `boolean / auto`           | `false`              |
| `contentStyle`           | 内容容器样式                                  | `CSSProperties`            | `—`                  |
| `defaultActiveKey`       | 初始激活键；缺省取首个未禁用项                | `string`                   | `first enabled item` |
| `dropdownProps`          | 折叠两端下拉菜单配置，结构见下表              | `TabsDropdownProps`        | `—`                  |
| `keepDOM`                | 保留未激活面板 DOM                            | `boolean`                  | `true`               |
| `lazyRender`             | 面板首次激活时才渲染                          | `boolean`                  | `false`              |
| `more`                   | 收起末尾 N 个标签，或使用高级配置             | `number / TabsMoreOptions` | `—`                  |
| `preventScroll`          | focus 时阻止浏览器滚动文档                    | `boolean`                  | `false`              |
| `showRestInDropdown`     | 折叠时显示溢出项下拉菜单                      | `boolean`                  | `true`               |
| `size`                   | 线性标签尺寸 large、medium、small             | `TabSize`                  | `large`              |
| `tabBarClassName`        | 标签栏类名                                    | `string`                   | `—`                  |
| `tabBarExtraContent`     | 标签栏右侧额外内容                            | `VNodeChild`               | `—`                  |
| `tabBarStyle`            | 标签栏样式                                    | `CSSProperties`            | `—`                  |
| `tabList`                | 标签配置数组；与 TabPane 二选一               | `PlainTab[]`               | `—`                  |
| `tabPaneMotion`          | 启用内容切换动画                              | `boolean`                  | `true`               |
| `tabPosition`            | top、left；slash 只支持 top                   | `TabPosition`              | `top`                |
| `type`                   | line、card、button、slash                     | `TabType`                  | `line`               |
| `visibleTabsStyle`       | 整体滚动区域样式                              | `CSSProperties`            | `—`                  |

### TabPane / PlainTab

| 属性                | 说明                        | 类型            | 默认值     |
| ------------------- | --------------------------- | --------------- | ---------- |
| `closable`          | card 模式下允许关闭         | `boolean`       | `false`    |
| `class / className` | Vue class 与兼容类名        | `string`        | `—`        |
| `style`             | 根节点样式对象              | `CSSProperties` | `—`        |
| `disabled`          | 禁用标签                    | `boolean`       | `false`    |
| `icon`              | 标签图标                    | `VNodeChild`    | `—`        |
| `itemKey`           | 唯一标识，对应 activeKey    | `string`        | `required` |
| `tab`               | 标签标题                    | `VNodeChild`    | `—`        |
| `tabIndex`          | TabPane 内容区域的 tabindex | `number`        | `0`        |

### TabsMoreOptions

| 属性            | 说明                                | 类型                  | 默认值     |
| --------------- | ----------------------------------- | --------------------- | ---------- |
| `count`         | 收起的标签数量                      | `number`              | `required` |
| `render`        | 自定义触发器，也可以使用 #more 插槽 | `() => VNodeChild`    | `—`        |
| `dropdownProps` | More 下拉菜单配置                   | `TabsDropdownOptions` | `—`        |

### TabsDropdownProps / TabsDropdownOptions

| 属性                | 说明                             | 类型                     | 默认值       |
| ------------------- | -------------------------------- | ------------------------ | ------------ |
| `start / end`       | 两端分别配置 TabsDropdownOptions | `TabsDropdownOptions`    | `—`          |
| `className / style` | 菜单类名和样式                   | `string / CSSProperties` | `—`          |
| `trigger`           | 触发方式 hover、click            | `string`                 | `hover`      |
| `position`          | bottomLeft、bottomRight          | `string`                 | `bottomLeft` |

### TabItem

| 属性                                         | 说明                   | 类型                              | 默认值               |
| -------------------------------------------- | ---------------------- | --------------------------------- | -------------------- |
| `itemKey / tab / icon / disabled / closable` | 与 PlainTab 一致       | `PlainTab fields`                 | `—`                  |
| `selected`                                   | 当前项是否激活         | `boolean`                         | `false`              |
| `size / type / tabPosition`                  | 与 Tabs 的同名属性一致 | `TabSize / TabType / TabPosition` | `large / line / top` |
| `class / className`                          | Vue class 与兼容类名   | `string`                          | `—`                  |
| `style`                                      | 根节点样式对象         | `CSSProperties`                   | `—`                  |

事件：`@change(activeKey)`、`@tab-click(key, event: MouseEvent / KeyboardEvent)`、`@tab-close(key)`、`@visible-tabs-change(state: Map<string, boolean>)`、update:activeKey、update:modelValue。切换时 change 先于 tabClick；关闭事件只发出请求，需要父层移除对应数据。

插槽：default 接收直接 TabPane 子节点或当前 tabList 内容；`#tabBarExtraContent` 扩展标签栏；`#tabBar="{ activeKey, list, onTabClick }"` 替换标签栏；`#more="{ hiddenTabs }"` 自定义 More 触发器；`#arrow="{ items, position, click, defaultNode }"` 自定义滚动箭头。defaultNode 是 Vue 节点，组合时使用 h/cloneVNode。

TabPane 提供 default、tab、icon 插槽。TabItem 提供 tab、icon 插槽，派发 `@click(itemKey, event)`、`@key-down(event, itemKey, closable)`、`@close(itemKey, event)`。PlainTab 仅包含 disabled、icon、itemKey、tab、closable，class/style/tabIndex 属于 TabPane。Vue API 不导出 React DefaultTabBar，也不接受任意 Dropdown render prop。

## Accessibility

### ARIA

- 关于 role
  - TabBar 对应的 role 为 `tablist`
  - TabBar 中的 Tab 对应的 role 为 `tab`
  - TabPane 对应的 role 为 `tabpanel`
- aria-orientation: 表明 TabBar 的方向，有 `vertical` 和 `horizontal` 两种。当传入 tabPosition 为 left 时, aria-orientation 会被设置为 `vertical`，tabPosition 为 top 时，设置为 `horizontal`
- aria-disabled: 当 TabPane 设置为 disabled 时，对应 Tab 的 aria-disabled 会被设置为 true
- aria-selected: 表明 Tab 是否被选中
- aria-controls: 指向 Tab 标签所控制的 TabPane
- aria-labelledby: 指向设置 TabPane 标签的元素

### 键盘和焦点

WAI-ARIA: https://www.w3.org/WAI/ARIA/apg/patterns/tabpanel/

- 选项卡可以被获取到焦点，但禁用的选项卡除外
- 键盘用户可以使用 `Tab` 键，将焦点移动到已被选择的选项卡元素的选项卡面板上
- 当焦点位于水平选项卡列表中的选项卡元素上时，使用 `左右箭头` 来切换选项
- 当焦点位于垂直选项卡列表中的选项卡元素上时，使用 `上下箭头` 来切换选项
- 当焦点位于选项卡列表中的未被激活的选项卡元素上时，可以使用 `Space` 或 `Enter` 键来激活该选项卡
- 当键盘用户想要直接将焦点聚焦到选项卡列表中的最后一个选项卡元素时：
  - Mac 用户：`fn` + `右箭头`
  - Windows 用户：`End`
- 当键盘用户想要直接将焦点聚焦到选项卡列表中的第一个选项卡元素时：
  - Mac 用户：`fn` + `左箭头`
  - Windows 用户：`Home`
- 当选项卡允许被删除时：
  - 用户可以使用 `Delete` 键删除选项卡
  - 删除后，焦点转移到被删除选项卡元素的后一个元素上；若被删除元素无后一个元素则转移到前一个元素上

## 设计变量

::token-table{component="tabs"}
::

## 文案规范

- 标签文案需要准确清晰地解释标签内容
- 用简短的，易区分的标签
- 尽量保持在一个词以内

## FAQ

- **为什么在 Tabs 中使用 Typography 的省略 ellipsis 失效？**

  因为 Tabs 渲染 TabPane 时，默认是全部渲染 display: none。此时这些组件无法获取到正确的宽度或高度值。建议开启 lazyRender，或者关闭 keepDOM。

- **为什么在 Tabs 中使用 Collapse/Collapsible/Resizable Table 等组件的高度或宽度值不对？**

  原因同上，另外如果 collapse 不需要动画，也可以通过设置 motion=false 来关闭动画效果。此时无需获取组件的高度。

## React → Vue

| React                                           | Vue                                                  |
| ----------------------------------------------- | ---------------------------------------------------- |
| `children / TabPane`                            | 直接 TabPane 默认插槽                                |
| `activeKey + onChange`                          | v-model:activeKey / v-model                          |
| `tabBarExtraContent ReactNode`                  | #tabBarExtraContent                                  |
| `renderTabBar(tabBarProps, DefaultTabBar)`      | #tabBar="{ activeKey, list, onTabClick }" + TabItem  |
| `renderArrow(items, pos, click, defaultNode)`   | #arrow="{ items, position, click, defaultNode }"     |
| `more.render`                                   | #more 或返回 VNodeChild 的 render                    |
| `Tabs.TabItem`                                  | TabItem                                              |
| `onTabClick / onTabClose / onVisibleTabsChange` | @tab-click / @tab-close / @visible-tabs-change       |
| `React dnd-kit`                                 | Pointer Events + Vue shallowRef（保留 5px 激活距离） |
| `className`                                     | class（兼容 className）                              |
