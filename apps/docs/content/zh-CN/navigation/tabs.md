---
title: 'Tabs 标签栏'
description: '当内容需要分组并在不同模块页面中展示，可使用 Tabs 标签栏目对不同的组/页之间进行切换'
type: 'navigation'
order: 60
icon: 'doc-tabs'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/tabs` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-navigation-tabs-1" title="如何引入" kind="import" />

### 基本用法

标签栏支持三种样式的显示：线条式，按钮式，卡片式，斜线式。默认选中第一项。
标签页支持两种传入方式，两者渲染流程上有所区别：

- 通过 `tabList` 传入标签页对象的数组，当使用 `tabList` 时每次只渲染当前传入的节点
- 或通过 `TabPane` 子组件逐项声明；默认会渲染所有面板，可以设置 `:keep-d-o-m="false"` 只渲染当前面板，此时不会有动画效果。

<DemoBlock id="zh-CN-navigation-tabs-2" title="基本用法" kind="live" />

<DemoBlock id="zh-CN-navigation-tabs-3" title="基本用法" kind="live" />

<DemoBlock id="zh-CN-navigation-tabs-4" title="基本用法" kind="live" />

<DemoBlock id="zh-CN-navigation-tabs-5" title="基本用法" kind="live" />

### 带图标的

有图标的标签栏。

<DemoBlock id="zh-CN-navigation-tabs-6" title="带图标的" kind="live" />

### 更多选项收入 More 展示

支持将多余 Tab 合并为 ”更多“ 下拉菜单，`more` 传入数字即可，数字表示收入下拉菜单的 Tab 数量。**（>=v2.59.0）**

<DemoBlock id="zh-CN-navigation-tabs-7" title="更多选项收入 More 展示" kind="live" />

也支持高级配置，向 `more` 传入对象，内可传入

- `count`: 表示收入下拉菜单的 Tab 数量
- `render`: 自定义 Trigger 的渲染函数，返回的 VNodeChild 会被渲染为下拉菜单的 Trigger
- `dropdownProps`: 传入 DropDown Props，会被透传到下拉菜单，如果需要自定义下拉菜单，使用 dropdownProps 中的 render 方法

<DemoBlock id="zh-CN-navigation-tabs-8" title="更多选项收入 More 展示" kind="live" />

### 垂直的标签栏

`type` 为 `line`, `card`, `button` 支持水平和垂直两种模式，`tabPosition='left|top'`， 默认为 `top`。`type` 为 `slash` 仅支持水平模式，无需设置。

<DemoBlock id="zh-CN-navigation-tabs-9" title="垂直的标签栏" kind="live" />

### 滚动折叠

通过设置 `collapsible` 可以支持滚动折叠，目前只支持 horizontal 模式。

<DemoBlock id="zh-CN-navigation-tabs-10" title="滚动折叠" kind="live" />

**自定义滚动箭头渲染**

通过 `#arrow` 插槽修改滚动折叠模式下，左右切换箭头的渲染，入参为溢出的 items 和 位置, 点击处理函数，以及 defaultNode。

**注**：`arrow` 插槽 的前三个参数自 2.61.0 支持，defaultNode 自 2.66.0 支持。

<DemoBlock id="zh-CN-navigation-tabs-11" title="滚动折叠" kind="live" />

**修改切换箭头的渲染位置**

通过 `arrowPosition` 来修改溢出指示器的位置，可选 `start` `both` `end`

<DemoBlock id="zh-CN-navigation-tabs-12" title="滚动折叠" kind="live" />

### 自动溢出检测

**v>= 2.97.0**

通过设置 `collapsible="auto"` 可以启用自动溢出检测功能。组件会自动检测 Tab 是否溢出容器：

- 当 Tab 超出容器宽度或发生换行时，自动启用折叠模式（显示左右箭头）
- 当容器宽度增加或 Tab 数量减少后，所有 Tab 可以完整显示时，自动退出折叠模式

这个功能避免了开发者需要手动判断是否需要折叠的问题，特别适用于响应式布局场景。

<DemoBlock id="zh-CN-navigation-tabs-13" title="自动溢出检测" kind="live" />

### 禁用

禁用标签栏中的某一个标签页。

<DemoBlock id="zh-CN-navigation-tabs-14" title="禁用" kind="live" />

### 标签栏内容扩展

传入 `tabBarExtraContent` 属性可以在标签栏右侧添加附加操作。

<DemoBlock id="zh-CN-navigation-tabs-15" title="标签栏内容扩展" kind="live" />

### 标签栏二次封装

使用 `#tabBar` 作用域插槽可对标签栏进行二次封装。

<DemoBlock id="zh-CN-navigation-tabs-16" title="标签栏二次封装" kind="live" />

### 拖拽排序

通过 `tabBar` 作用域插槽 结合第三方拖拽库（如 [@dnd-kit](https://docs.dndkit.com/)）可以实现标签栏的拖拽排序功能。

<DemoBlock id="zh-CN-navigation-tabs-17" title="拖拽排序" kind="code" />

<DemoBlock id="zh-CN-navigation-tabs-18" title="拖拽排序" kind="live" />

### 动态更新

通过绑定事件，可以使标签栏动态更新。

<DemoBlock id="zh-CN-navigation-tabs-19" title="动态更新" kind="live" />

### 关闭

关闭标签栏中的某一个标签页。
只有卡片样式的页签支持关闭选项。使用 `closable={true}` 来开启。

<DemoBlock id="zh-CN-navigation-tabs-20" title="关闭" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/tabs/types.ts` 的公开类型为准。

- `v-model` 对应 `modelValue`；也可用 `v-model:activeKey` 显式绑定当前标签页。

#### Vue 事件

**Tabs**

| 事件              | 参数                                                    | 说明                     |
| ----------------- | ------------------------------------------------------- | ------------------------ |
| change            | [activeKey: string]                                     | 当前标签页变化           |
| tabClick          | [activeKey: string, event: MouseEvent \| KeyboardEvent] | 点击或键盘激活标签页     |
| tabClose          | [tabKey: string]                                        | 关闭标签页               |
| visibleTabsChange | [visibleState: Map&lt;string, boolean&gt;]              | 滚动折叠模式下可见项变化 |

#### Vue 插槽

**Tabs**

| 插槽               | 作用域参数                 | 说明                 |
| ------------------ | -------------------------- | -------------------- |
| default            | {}                         | TabPane 子组件       |
| tabBarExtraContent | {}                         | 标签栏扩展内容       |
| tabBar             | TabsTabBarSlotProps        | 自定义整个标签栏     |
| more               | { hiddenTabs: PlainTab[] } | 自定义更多菜单触发器 |
| arrow              | TabsArrowSlotProps         | 自定义滚动折叠箭头   |

**TabPane**

| 插槽    | 作用域参数 | 说明           |
| ------- | ---------- | -------------- |
| default | {}         | 标签页面板内容 |
| icon    | {}         | 标签图标       |
| tab     | {}         | 标签文本或内容 |

### Tab

| 属性               | 说明                                                                                             | 类型                      | 默认值  |
| ------------------ | ------------------------------------------------------------------------------------------------ | ------------------------- | ------- |
| activeKey          | 当前激活的 tab 页的 itemKey 值                                                                   | string                    | 无      |
| modelValue         | —                                                                                                | string                    | —       |
| class              | —                                                                                                | HTMLAttributes['class']   | —       |
| className          | 类名                                                                                             | string                    | 无      |
| collapsible        | 折叠的 Tabs，**&gt;=1.1.0**，支持 `auto` 自动判断是否溢出                                        | boolean \| 'auto'         | false   |
| contentStyle       | 内容区域外层样式对象                                                                             | CSSProperties             | 无      |
| defaultActiveKey   | 初始化选中的 tab 页的 key 值                                                                     | string                    | '1'     |
| keepDOM            | 使用 TabPane 写法时是否渲染隐藏面板的 DOM 结构                                                   | boolean                   | true    |
| lazyRender         | 懒渲染，仅当面板激活过才被渲染在 DOM 树中                                                        | boolean                   | false   |
| showRestInDropdown | 是否将收起的 Tab 展示在下拉菜单中（仅当 collapsible 为 true 时生效） **&gt;= 2.61.0**            | boolean                   | true    |
| size               | 大小，提供 `large`、`medium`、`small` 三种类型，**&gt;=1.11.0，目前仅支持线性 Tabs**             | TabSize                   | `large` |
| style              | 样式对象                                                                                         | CSSProperties             | 无      |
| tabBarClassName    | —                                                                                                | string                    | —       |
| tabBarExtraContent | 用于扩展标签栏的内容                                                                             | VNodeChild                | 无      |
| tabBarStyle        | —                                                                                                | CSSProperties             | —       |
| tabList            | 标签页对象组成的数组，该对象支持 itemKey（对应 activeKey，tab（标签页文字）及 icon（标签页图标） | PlainTab[]                | 无      |
| tabPaneMotion      | 是否使用动画切换 tabs                                                                            | boolean                   | true    |
| tabPosition        | tab 的位置，支持`top`(水平), `left`(垂直)                                                        | TabPosition               | `top`   |
| type               | 标签栏的样式，可选`line`、 `card`、 `button`、`slash`                                            | TabType                   | `line`  |
| preventScroll      | 指示浏览器是否应滚动文档以显示新聚焦的元素，作用于组件内的 focus 方法                            | boolean                   | —       |
| more               | 将一部分 Tab 渲染到下拉菜单中 ** &gt;= 2.59.0**                                                  | number \| TabsMoreOptions | -       |
| visibleTabsStyle   | 整体滚动区域 Style **&gt;=2.61.0**                                                               | CSSProperties             | 无      |
| arrowPosition      | 折叠模式下，左右切换箭头渲染位置 **&gt;=2.61.0**                                                 | TabArrowPosition          | 无      |
| dropdownProps      | 用于在折叠模式下透传参数到下拉菜单的 Dropdown 组件                                               | TabsDropdownProps         | 无      |

### TabPane

| 属性      | 说明                        | 类型                    | 默认值 |
| --------- | --------------------------- | ----------------------- | ------ |
| disabled  | 标签页栏是否禁用            | boolean                 | 无     |
| icon      | 标签页栏 icon               | VNodeChild              | 无     |
| itemKey   | 对应 `activeKey`            | string（必填）          | 无     |
| tab       | 标签页栏显示文字            | VNodeChild              | 无     |
| closable  | 允许关闭 tab **&gt;=2.1.0** | boolean                 | false  |
| class     | —                           | HTMLAttributes['class'] | —      |
| className | 类名                        | string                  | 无     |
| style     | 样式对象                    | CSSProperties           | 无     |
| tabIndex  | —                           | number                  | —      |

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

## 文案规范

- 标签文案需要准确清晰地解释标签内容
- 用简短的，易区分的标签
- 尽量保持在一个词以内

## FAQ

- **为什么在 Tabs 中使用 Typography 的省略 ellipsis 失效？**

因为 Tabs 渲染 TabPane 时，默认是全部渲染 display: none。此时这些组件无法获取到正确的宽度或高度值。建议开启 lazyRender，或者关闭 keepDOM。

- **为什么在 Tabs 中使用 Collapse/Collapsible/Resizable Table 等组件的高度或宽度值不对？**

原因同上，另外如果 collapse 不需要动画，也可以通过设置 :motion="false" 来关闭动画效果。此时无需获取组件的高度。
