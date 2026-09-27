---
title: 'Navigation 导航'
description: '为页面和功能提供导航的菜单列表。'
type: 'navigation'
order: 57
icon: 'doc-navigation'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/navigation` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-navigation-navigation-1" title="如何引入" kind="import" />

### 基本使用

通过传递 `items` 参数，你能够快速得到一个导航栏。

每个导航项目包括：

- `itemKey`：导航项目的唯一标识（必须）
- `text`：导航文案
- `icon`：导航图标，你可以从 `@aifuxi/semi-icons-vue`、`@aifuxi/semi-icons-lab-vue` 中自由选择你喜欢的图标，详情可查阅 [Icon 组件文档](/zh-CN/basic/icon)

参数含义详见 [Nav.Item](#Nav.Item) 或 [Nav.Sub](#Nav.Sub)

开发者可能会经常定义 Logo 区域和收起按钮区域，Navigation 则提供了这样的容器方便开发者快速定义导航头部和底部，你仅需按要求传入 `header` 或 `footer` 即可。

对于 `footer`，semi-ui 额外封装了一个收起功能按钮，开发者可以通过传递 `collapseButton = true` 开启此功能，不过该参数仅在 `mode = "vertical"` （垂直导航）生效。

参数详见 [Nav.Header](#Nav.Header) 和 [Nav.Footer](#Nav.Footer)。

<DemoBlock id="zh-CN-navigation-navigation-2" title="基本使用" kind="live" />

### 导航样式定义

Navigation 目前提供了个两个参数用于定义导航样式：`style` 和 `bodyStyle`，其中 `style` 用于定义导航组件最外层的样式，而 `bodyStyle` 用于定义导航列表的样式。（导航头部和导航底部则都接受各自的 `style` 参数）。

例如你需要一个中间列表可以滚动，导航头部和底部固定的导航组件，可以这么使用：

<DemoBlock id="zh-CN-navigation-navigation-3" title="导航样式定义" kind="live" />

### 组件写法

可以通过模板定义导航头部、导航项与底部。在 Nav 默认插槽中，除 Nav.Header、Nav.Item、Nav.Sub、Nav.Footer 外，也可以放置其他 Vue 节点。

<DemoBlock id="zh-CN-navigation-navigation-4" title="组件写法" kind="live" />

### 配合 vue-router 等路由组件

配合 vue-router 时，可使用 `#itemWrapper` 把 Nav.Item 包裹在 RouterLink 中，由路由组件处理导航。

使用 `#itemWrapper` 作用域插槽在每个导航项外包裹自定义路由组件。

<DemoBlock id="zh-CN-navigation-navigation-5" title="配合 vue-router 等路由组件" kind="code" />

### 垂直与水平布局

Navigation 目前提供两种方向的导航：

- 垂直布局（默认） `mode = "vertical"`
- 水平布局 `mode = "horizontal"`

特别注意的是，有一些功能（参数）仅在 `mode = "vertical"` 时有效：

- `isCollapsed` （导航收起到侧边）
- `defaultOpenKeys` | `openKeys` （指定默认的以及受控的展开子导航项 key 数组，这个参数仅在 `mode = "vertical"` 且 `isCollapsed = false` 有效）
- `Footer` 组件的 `collapseButton` 收起侧边栏功能按钮

#### 垂直布局

<DemoBlock id="zh-CN-navigation-navigation-6" title="垂直布局" kind="live" />

#### 水平布局

<DemoBlock id="zh-CN-navigation-navigation-7" title="水平布局" kind="live" />

#### 水平加垂直

一般的平台设计会采取水平加垂直导航的模式，这里有一个比较常见的例子。

<DemoBlock id="zh-CN-navigation-navigation-8" title="水平加垂直" kind="live" />

### 展开收起箭头位置

可通过 `toggleIconPosition` 改变 NavSub 展开收起箭头的位置，默认为 'right' 右侧展示，可改为 'left'

<DemoBlock id="zh-CN-navigation-navigation-9" title="展开收起箭头位置" kind="live" />

### 导航缩进

默认导航缩进目前仅对第一级导航有效果。
如果你希望对多级导航，按层级缩进，请先将 `limitIndent` 设置为 false (只在竖直方向生效)

- 当以 Jsx 方式用 Nav.Item 传入导航项时，请手动给 Nav.Item 传入 `level` props。
- 以 items 方式传入导航项时，无需关心 level

<DemoBlock id="zh-CN-navigation-navigation-10" title="导航缩进" kind="live" />

### 非受控属性

包括：

- `defaultSelectedKeys`（默认被选中的导航项 `key` 数组）
- `defaultOpenKeys`（默认展开的导航项 `key` 数组，仅 `mode = "vertical"` 且 `isCollapsed` | `defaultIsCollapsed = false` 的情况下有效）
- `defaultIsCollapsed`（侧边栏默认是否收起，仅 `mode = "vertical"` 时有效）

<DemoBlock id="zh-CN-navigation-navigation-11" title="非受控属性" kind="live" />

### 受控属性

Navigation 组件提供了几个受控属性，配合各种回调，可以很轻松地控制导航。

目前受控的属性为：

- `isCollapsed`（侧边栏是否收起，仅 `mode =" vertical"` 时生效）
- `selectedKeys`（当前选中的导航项 `key` 数组）
- `openKeys` （当前展开的导航项数组，仅 `mode = "vertical"` 且 `isCollapsed = false` 有效）

对应的回调为：

- `collapseChange(isCollapsed: boolean)` 事件
- `select(data: NavigationSelectData)` 事件
- `openChange(data: NavigationOpenChangeData)` 事件

<DemoBlock id="zh-CN-navigation-navigation-12" title="受控属性" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/navigation/types.ts` 的公开类型为准。

- 折叠、展开项与选中项分别支持 `v-model:isCollapsed`、`v-model:openKeys`、`v-model:selectedKeys`。

#### Vue 事件

**Navigation**

| 事件           | 参数                             | 说明               |
| -------------- | -------------------------------- | ------------------ |
| click          | [data: NavigationClickData]      | 点击任意导航项     |
| collapseChange | [isCollapsed: boolean]           | 折叠状态变化       |
| openChange     | [data: NavigationOpenChangeData] | 子导航展开状态变化 |
| select         | [data: NavigationSelectData]     | 导航项选中         |
| deselect       | [data?: unknown]                 | 导航项取消选中     |

**Nav.Item**

| 事件                    | 参数                        | 说明                 |
| ----------------------- | --------------------------- | -------------------- |
| click                   | [data: NavItemSelectedData] | 点击导航项           |
| mouseenter / mouseleave | [event: MouseEvent]         | 指针进入或离开导航项 |

**Nav.Footer**

| 事件  | 参数                | 说明         |
| ----- | ------------------- | ------------ |
| click | [event: MouseEvent] | 点击底部区域 |

#### Vue 插槽

**Navigation**

| 插槽            | 作用域参数            | 说明             |
| --------------- | --------------------- | ---------------- |
| default         | {}                    | 声明式导航子组件 |
| header / footer | {}                    | 头部或底部内容   |
| itemWrapper     | NavigationWrapperData | 包装每个导航项   |

**Nav.Item**

| 插槽           | 作用域参数 | 说明             |
| -------------- | ---------- | ---------------- |
| default / text | {}         | 导航项文本或内容 |
| icon           | {}         | 导航项图标       |

**Nav.Sub**

| 插槽                     | 作用域参数 | 说明                 |
| ------------------------ | ---------- | -------------------- |
| default                  | {}         | 子导航项             |
| text / icon / expandIcon | {}         | 标题、图标与展开图标 |

**Nav.Header**

| 插槽           | 作用域参数 | 说明     |
| -------------- | ---------- | -------- |
| default / text | {}         | 头部内容 |
| logo           | {}         | Logo     |

**Nav.Footer**

| 插槽           | 作用域参数 | 说明         |
| -------------- | ---------- | ------------ |
| default        | {}         | 底部内容     |
| collapseButton | {}         | 折叠按钮内容 |

### Nav

| 属性                | 描述                                                                                                                                           | 类型                                           | 默认值     |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ---------- |
| bodyStyle           | 导航项列表的自定义样式                                                                                                                         | StyleValue                                     | —          |
| class               | —                                                                                                                                              | HTMLAttributes['class']                        | —          |
| className           | 最外层元素的样式名                                                                                                                             | HTMLAttributes['class']                        | —          |
| defaultIsCollapsed  | 默认是否处于收起状态，仅 `mode = "vertical"` 时有效                                                                                            | boolean                                        | false      |
| defaultOpenKeys     | 初始打开的子导航 `itemKey` 数组，仅 `mode = "vertical"` 且侧边栏处于展开状态时有效                                                             | readonly ItemKey[]                             | []         |
| defaultSelectedKeys | 初始选中的导航项 `itemKey` 数组                                                                                                                | readonly ItemKey[]                             | []         |
| expandIcon          | 默认下拉箭头Icon, v&gt;=2.36                                                                                                                   | NavigationContent                              | —          |
| footer              | 底部区域配置对象或元素，详见 [Nav.Footer](#Nav.Footer)                                                                                         | NavigationContent \| NavFooterProps            | —          |
| getPopupContainer   | 垂直 Nav 折叠或 水平 Nav中 Dropdown 的 getPopupContainer 配置，可指定弹出层容器 这会改变浮层 DOM 树位置，但不会改变视图渲染位置。 v&gt;=2.24.0 | () =&gt; HTMLElement                           | —          |
| header              | 头部区域配置对象或元素，详见 [Nav.Header](#Nav.Header)                                                                                         | NavigationContent \| NavHeaderProps            | —          |
| isCollapsed         | 是否处于收起状态的受控属性，仅 `mode = "vertical"` 时有效                                                                                      | boolean                                        | —          |
| items               | 导航项目列表，每一项可以继续带有 items 属性。如果为 string 数组，则会取每一项作为 text 和 itemKey                                              | NavigationItems                                | —          |
| limitIndent         | 解除缩进限制，可使用 level 自定义导航项缩进，水平模式只能为true                                                                                | boolean                                        | true       |
| mode                | 导航类型，目前支持横向与竖直，可选值：`vertical`或`horizontal`                                                                                 | NavigationMode                                 | `vertical` |
| multiple            | —                                                                                                                                              | boolean                                        | —          |
| openKeys            | 受控的打开的子导航 `itemKey` 数组，配合 `openChange` 事件控制子导航项展开，仅 `mode = "vertical"` 且侧边栏处于展开状态时有效                   | readonly ItemKey[]                             | —          |
| prefixCls           | 类名前缀                                                                                                                                       | string                                         | `semi`     |
| renderWrapper       | —                                                                                                                                              | (data: NavigationWrapperData) =&gt; VNodeChild | —          |
| selectedKeys        | 受控的导航项 `itemKey` 数组，配合 `select` 事件控制导航项选择                                                                                  | readonly ItemKey[]                             | —          |
| style               | 最外层元素的自定义样式                                                                                                                         | StyleValue                                     | —          |
| subDropdownProps    | 用于控制 `horizontal` 或者 `vertical && isCollapsed` 下 nav.sub 中的 dropdown 参数(v &gt;= 2.69)                                               | DropdownProps                                  | —          |
| subNavCloseDelay    | 子导航浮层关闭的延迟。collapse 为 true 或 mode 为 "horizontal" 时有效，单位为 ms                                                               | number                                         | 100        |
| subNavMotion        | 子导航折叠动画                                                                                                                                 | boolean                                        | true       |
| subNavOpenDelay     | 子导航浮层显示的延迟。collapse 为 true 或 mode 为 "horizontal" 时有效，单位为 ms                                                               | number                                         | 0          |
| toggleIconPosition  | 带有子导航项的的父级导航项箭头位置，可选 `left`或 `right`                                                                                      | ToggleIconPosition                             | 'right'    |
| tooltipHideDelay    | tooltip 隐藏的延迟，collapse 为 true 时有效，单位为 ms                                                                                         | number                                         | 100        |
| tooltipShowDelay    | tooltip 显示的延迟，collapse 为 true 时有效，单位为 ms                                                                                         | number                                         | 0          |

### Nav.Item

| 属性             | 描述                                                          | 类型                                                       | 默认值 |
| ---------------- | ------------------------------------------------------------- | ---------------------------------------------------------- | ------ |
| class            | —                                                             | HTMLAttributes['class']                                    | —      |
| className        | —                                                             | HTMLAttributes['class']                                    | —      |
| disabled         | 是否禁用                                                      | boolean                                                    | false  |
| forwardRef       | —                                                             | ((element: HTMLLIElement \| null) =&gt; void) \| undefined | —      |
| icon             | 导航项目图标                                                  | NavigationContent                                          | —      |
| indent           | 如果 icon 为空，是否保留其占位，仅对一级导航生效              | boolean \| number                                          | false  |
| isCollapsed      | —                                                             | boolean                                                    | —      |
| isSubNav         | —                                                             | boolean                                                    | —      |
| itemKey          | 导航项目唯一 key                                              | ItemKey（必填）                                            | ""     |
| level            | 当前项所在嵌套层级，limitIndent 为 true时，用于自定义缩进位置 | number                                                     | —      |
| link             | 导航项 href 链接，传入时导航项整体会包裹一个 a 标签           | string                                                     | -      |
| linkOptions      | 透传给 a 标签的参数                                           | AnchorHTMLAttributes \| undefined                          | -      |
| style            | —                                                             | StyleValue                                                 | —      |
| tabIndex         | —                                                             | number                                                     | —      |
| text             | 导航项目文案或元素                                            | NavigationContent                                          | ""     |
| toggleIcon       | —                                                             | NavigationContent                                          | —      |
| tooltipHideDelay | —                                                             | number                                                     | —      |
| tooltipShowDelay | —                                                             | number                                                     | —      |

### Nav.Sub

| 属性             | 描述                                                          | 类型                       | 默认值 |
| ---------------- | ------------------------------------------------------------- | -------------------------- | ------ |
| class            | —                                                             | HTMLAttributes['class']    | —      |
| className        | —                                                             | HTMLAttributes['class']    | —      |
| disabled         | 是否禁用                                                      | boolean                    | false  |
| icon             | 导航项目图标                                                  | NavigationContent          | —      |
| indent           | 如果 icon 为空，是否保留其占位，仅对一级导航生效              | boolean \| number          | false  |
| isCollapsed      | 是否处于收起状态的受控属性，仅 `mode = "vertical"`            | boolean                    | false  |
| itemKey          | 导航项目唯一 key                                              | ItemKey（必填）            | -      |
| level            | 当前项所在嵌套层级，limitIndent 为 true时，用于自定义缩进位置 | number                     | 0      |
| style            | —                                                             | StyleValue                 | —      |
| text             | 导航项目文案或组件                                            | NavigationContent          | ""     |
| toggleIcon       | —                                                             | NavigationContent          | —      |
| tooltipHideDelay | —                                                             | number                     | —      |
| tooltipShowDelay | —                                                             | number                     | —      |
| dropdownProps    | 弹出层 `dropdown` 参数配置 (v &gt;= 2.69)                     | DropdownProps \| undefined | —      |
| dropdownStyle    | 弹出层的 style                                                | StyleValue                 | —      |
| expandIcon       | —                                                             | NavigationContent          | —      |
| isOpen           | 是否打开                                                      | boolean                    | false  |
| maxHeight        | 最大高度                                                      | number                     | 999    |
| subDropdownProps | —                                                             | DropdownProps \| undefined | —      |

### Nav.Header

| 属性        | 描述                                                | 类型                    | 默认值 |
| ----------- | --------------------------------------------------- | ----------------------- | ------ |
| class       | —                                                   | HTMLAttributes['class'] | —      |
| className   | 最外层样式名                                        | HTMLAttributes['class'] | —      |
| link        | 导航项 href 链接，传入时导航项整体会包裹一个 a 标签 | string                  | -      |
| linkOptions | 透传给 a 标签的参数                                 | AnchorHTMLAttributes    | -      |
| logo        | Logo                                                | NavigationContent       | —      |
| prefixCls   | —                                                   | string                  | —      |
| style       | 最外层样式                                          | StyleValue              | —      |
| text        | Logo 文案                                           | NavigationContent       | —      |

### Nav.Footer

| 属性           | 描述                                                                             | 类型                                                 | 默认值 |
| -------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------- | ------ |
| class          | —                                                                                | HTMLAttributes['class']                              | —      |
| className      | 最外层样式名                                                                     | HTMLAttributes['class']                              | —      |
| collapseButton | 是否展示底部“收起侧边栏”按钮，mode="vertical" 且 Nav.Footer 默认插槽为空才有效果 | boolean \| NavigationContent                         | false  |
| collapseText   | “收起”按钮的文案                                                                 | ((collapsed: boolean) =&gt; VNodeChild) \| undefined | —      |
| style          | 最外层样式                                                                       | StyleValue                                           | —      |

## Accessibility

- ### 键盘和焦点
- Navigation 内的每个可点击 item 都可以被聚焦，相互之间使用 `Tab` 及 `Shift + Tab` 切换焦点，并且可以通过 `Enter` 键激活每个链接
- 当某个 item 可被打开弹层时
- 打开弹层方式为 hover：该 item 被聚焦时，弹层打开。键盘用户可以通过下箭头将焦点移动到弹层上，`Esc` 键可以将焦点返回到 item 上
- 打开弹层的方式为 click：该 item 被聚焦时，点击 Enter 键，打开弹层。键盘用户可以通过下箭头将焦点移动到弹层上，`Esc` 键可以将焦点返回到 item 上
- 键盘交互暂未完整支持嵌套场景

## 文案规范

- 导航栏菜单使用句子大小写格式
- 尽量精简

| ✅ 推荐用法   | ❌ 不推荐用法 |
| ------------- | ------------- |
| Appeal center | Appeal Center |

## FAQ

- **导航动画丢失？**
  请保持 `items` 的引用稳定；在 Vue 中可使用 `shallowRef` 或 `computed` 管理数组。

- **当子菜单高度超过999px，部分导航消失？**
  请查看 [此 issue](https://github.com/aifuxi/semi-ui-vue/issues/563)
