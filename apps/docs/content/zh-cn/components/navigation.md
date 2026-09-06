---
title: '导航'
description: '为页面和功能提供导航的菜单列表。'
locale: 'zh-CN'
slug: 'navigation'
category: 'navigation'
order: 57
englishTitle: 'Navigation'
icon: 'doc-navigation'
upstream: 'navigation/navigation'
---

基于只读 Semi Design v2.102.0 的导航菜单。中文 10 个与英文 12 个上游示例分别保留；独立图标与品牌在 React/Vue 参考场景中一致替换。

## 如何引入

```ts
import { Nav, NavItem, SubNav, NavHeader, NavFooter } from '@aifuxi/semi-ui-vue/navigation';
import '@aifuxi/semi-theme-default/navigation.css';
```

## 代码演示

### 基本使用

用 items 定义稳定的菜单数据，header/footer 分别配置头部与底部。内置 collapseButton 仅在垂直模式有效。

::demo-block{demo="navigation/zh-CN/Basic" title="基本使用"}
::

### 固定头尾与滚动列表

style 控制外层高度，bodyStyle 控制列表高度。列表内部滚动时头尾保持位置。

::demo-block{demo="navigation/zh-CN/Scrollable" title="固定头尾与滚动列表"}
::

### 模板组合写法

使用 Nav.Header、Nav.Item、Nav.Sub 与 Nav.Footer 组合；自定义内容通过默认插槽传递。

::demo-block{demo="navigation/zh-CN/Template" title="模板组合写法"}
::

### 垂直布局

mode 默认为 vertical。展开、选中与折叠状态相互独立。

::demo-block{demo="navigation/zh-CN/Vertical" title="垂直布局"}
::

### 水平布局

水平模式的子导航通过 Dropdown 弹层展示；右侧头像打开操作菜单。

::demo-block{demo="navigation/zh-CN/Horizontal" title="水平布局"}
::

### 水平加垂直

头部、侧栏与页脚各自放在独立 SFC 中，由入口组合。该示例保持固定中文上游的 Layout、Breadcrumb 与 Skeleton 结构。

::demo-block{demo="navigation/zh-CN/Combined" title="水平加垂直"}
::

### 展开图标位置

toggleIconPosition="left" 将展开图标置于左侧。

::demo-block{demo="navigation/zh-CN/TogglePosition" title="展开图标位置"}
::

### 多级缩进

limitIndent=false 时按层级缩进。items 自动推导层级；手写 Nav.Item 时用 level 声明层级。

::demo-block{demo="navigation/zh-CN/Indentation" title="多级缩进"}
::

### 非受控状态

defaultSelectedKeys、defaultOpenKeys 和 defaultIsCollapsed 只指定初始状态。

::demo-block{demo="navigation/zh-CN/Uncontrolled" title="非受控状态"}
::

### 受控状态

使用三个 v-model 绑定 selectedKeys、openKeys、isCollapsed，items 保持稳定引用。select 先于 click；openChange 先于子导航 click。

::demo-block{demo="navigation/zh-CN/Controlled" title="受控状态"}
::

## 路由集成

使用 `#item-wrapper="{ itemElement, props }"` 或 `renderWrapper` 在导航项外包装 RouterLink。`itemElement` 是 VNode，可用 `<component :is="itemElement" />` 渲染。路由目标由应用决定，示例不依赖外部路由沙箱。

## API

下表保留上游 API 命名便于查阅。`onSelect`、`onOpenChange`、`onCollapseChange` 等回调在模板中对应 `@select`、`@open-change`、`@collapse-change` 事件；所有带尺寸的 style/bodyStyle 值须显式写单位，如 `height: '320px'`。

事件数据使用上述公开类型：click/openChange 的原始事件字段为 `domEvent`；select 另含 `selectedKeys` 和 `selectedItems`。

### Nav

| 属性                | 描述                                                                                                                                        | 类型                                                       | 默认值            |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ----------------- |
| bodyStyle           | 导航项列表的自定义样式                                                                                                                      | CSSProperties                                              |                   |
| className           | 最外层元素的样式名                                                                                                                          | string                                                     |                   |
| defaultIsCollapsed  | 默认是否处于收起状态，仅 `mode = "vertical"` 时有效                                                                                         | boolean                                                    | false             |
| defaultOpenKeys     | 初始打开的子导航 `itemKey` 数组，仅 `mode = "vertical"` 且侧边栏处于展开状态时有效                                                          | string[]                                                   | []                |
| defaultSelectedKeys | 初始选中的导航项 `itemKey` 数组                                                                                                             | string[]                                                   | []                |
| subDropdownProps    | 用于控制 `horizontal` 或者 `vertical && isCollapsed` 下 nav.sub 中的 dropdown 参数(v >= 2.69)                                               | DropdownProps                                              |                   |
| expandIcon          | 默认下拉箭头Icon, v>=2.36                                                                                                                   | VNodeChild                                                 |                   |
| footer              | 底部区域配置对象或元素，详见 [Nav.Footer](#navfooter)                                                                                       | object\|VNodeChild                                         |                   |
| getPopupContainer   | 垂直 Nav 折叠或 水平 Nav中 Dropdown 的 getPopupContainer 配置，可指定弹出层容器 这会改变浮层 DOM 树位置，但不会改变视图渲染位置。 v>=2.24.0 | Function                                                   |                   |
| header              | 头部区域配置对象或元素，详见 [Nav.Header](#navheader)                                                                                       | object\|VNodeChild                                         |                   |
| isCollapsed         | 是否处于收起状态的受控属性，仅 `mode = "vertical"` 时有效                                                                                   | boolean                                                    |                   |
| items               | 导航项目列表，每一项可以继续带有 items 属性。如果为 string 数组，则会取每一项作为 text 和 itemKey                                           | object\| string[]\| [Item](#navitem)[] \| [Sub](#navsub)[] |                   |
| limitIndent         | 解除缩进限制，可使用 level 自定义导航项缩进，水平模式只能为true                                                                             | boolean                                                    | true              |
| mode                | 导航类型，目前支持横向与竖直，可选值：`vertical`或`horizontal`                                                                              | string                                                     | `vertical`        |
| openKeys            | 受控的打开的子导航 `itemKey` 数组，配合 `onOpenChange` 回调控制子导航项展开，仅 `mode = "vertical"` 且侧边栏处于展开状态时有效              | string[]                                                   |                   |
| prefixCls           | 类名前缀                                                                                                                                    | string                                                     | `semi-navigation` |
| renderWrapper       | 自定义导航项外层组件，v>=2.24.0                                                                                                             | (data) => VNodeChild                                       |                   |
| selectedKeys        | 受控的导航项 `itemKey` 数组，配合 `onSelect` 回调控制导航项选择                                                                             | string[]                                                   |                   |
| style               | 最外层元素的自定义样式                                                                                                                      | CSSProperties                                              |                   |
| subNavCloseDelay    | 子导航浮层关闭的延迟。collapse 为 true 或 mode 为 "horizontal" 时有效，单位为 ms                                                            | number                                                     | 100               |
| subNavMotion        | 子导航折叠动画                                                                                                                              | boolean                                                    | true              |
| subNavOpenDelay     | 子导航浮层显示的延迟。collapse 为 true 或 mode 为 "horizontal" 时有效，单位为 ms                                                            | number                                                     | 0                 |
| toggleIconPosition  | 带有子导航项的的父级导航项箭头位置，可选 `left`或 `right`                                                                                   | string                                                     | 'right'           |
| tooltipHideDelay    | tooltip 隐藏的延迟，collapse 为 true 时有效，单位为 ms                                                                                      | number                                                     | 100               |
| tooltipShowDelay    | tooltip 显示的延迟，collapse 为 true 时有效，单位为 ms                                                                                      | number                                                     | 0                 |
| onClick             | 点击任意导航项时触发                                                                                                                        | (data: NavigationClickData) => void                        | () => {}          |
| onCollapseChange    | 收起状态变化时的回调                                                                                                                        | (isCollapsed)=> void                                       | () => {}          |
| onOpenChange        | 切换某个子导航项目显隐状态时触发                                                                                                            | (data: NavigationOpenChangeData) => void                   | () => {}          |
| onSelect            | 第一次选中某个可选中导航项目时触发                                                                                                          | (data: NavigationSelectData) => void                       | () => {}          |

### Nav.Item

| 属性         | 描述                                                           | 类型                                | 默认值   |
| ------------ | -------------------------------------------------------------- | ----------------------------------- | -------- |
| disabled     | 是否禁用                                                       | boolean                             | false    |
| icon         | 导航项目图标                                                   | VNodeChild                          |          |
| indent       | 如果 icon 为空，是否保留其占位，仅对一级导航生效               | boolean                             | false    |
| itemKey      | 导航项目唯一 key                                               | string                              | ""       |
| level        | 当前项所在嵌套层级，limitIndent 为 false时，用于自定义缩进位置 | number                              |          |
| link         | 导航项 href 链接，传入时导航项整体会包裹一个 a 标签            | string                              | -        |
| linkOptions  | 透传给 a 标签的参数                                            | object                              | -        |
| text         | 导航项目文案或元素                                             | string\|VNodeChild                  | ""       |
| onClick      | 点击任意导航项时触发                                           | (data: NavItemSelectedData) => void | () => {} |
| onMouseEnter | mouse enter 时触发                                             | function(e) => {}                   | () => {} |
| onMouseLeave | mouse leave 时触发                                             | function(e) => {}                   | () => {} |

### Nav.Sub

| 属性          | 描述                                                           | 类型               | 默认值   |
| ------------- | -------------------------------------------------------------- | ------------------ | -------- |
| disabled      | 是否禁用                                                       | boolean            | false    |
| dropdownProps | 弹出层 `dropdown` 参数配置 (v >= 2.69)                         | DropdownProps      |          |
| dropdownStyle | 弹出层的 style                                                 | CSSProperties      |          |
| icon          | 导航项目图标                                                   | VNodeChild         |          |
| indent        | 如果 icon 为空，是否保留其占位，仅对一级导航生效               | boolean            | false    |
| isCollapsed   | 是否处于收起状态的受控属性，仅 `mode = "vertical"`             | boolean            | false    |
| isOpen        | 是否打开                                                       | boolean            | false    |
| itemKey       | 导航项目唯一 key                                               | string             | -        |
| level         | 当前项所在嵌套层级，limitIndent 为 false时，用于自定义缩进位置 | number             | 0        |
| maxHeight     | 最大高度                                                       | number             | 999      |
| text          | 导航项目文案或组件                                             | string\|VNodeChild | ""       |
| onMouseEnter  | mouse enter 时触发                                             | function(e) => {}  | () => {} |
| onMouseLeave  | mouse leave 时触发                                             | function(e) => {}  | () => {} |

### Nav.Header

| 属性         | 描述                                                | 类型          | 默认值 |
| ------------ | --------------------------------------------------- | ------------- | ------ |
| default slot | 子元素                                              | VNodeChild    |        |
| className    | 最外层样式名                                        | string        |        |
| link         | 导航项 href 链接，传入时导航项整体会包裹一个 a 标签 | string        | -      |
| linkOptions  | 透传给 a 标签的参数                                 | object        | -      |
| logo         | Logo                                                | VNodeChild    |        |
| style        | 最外层样式                                          | CSSProperties |        |
| text         | Logo 文案                                           | VNodeChild    |        |

### Nav.Footer

| 属性           | 描述                                                                                         | 类型                              | 默认值 |
| -------------- | -------------------------------------------------------------------------------------------- | --------------------------------- | ------ |
| default slot   | 子元素                                                                                       | VNodeChild                        |        |
| className      | 最外层样式名                                                                                 | string                            |        |
| collapseButton | 是否展示底部“收起侧边栏”按钮，mode="vertical" 且 Footer 组件的 default slot 参数为空才有效果 | boolean\|VNodeChild               | false  |
| collapseText   | “收起”按钮的文案                                                                             | (collapsed:boolean) => VNodeChild |        |
| style          | 最外层样式                                                                                   | CSSProperties                     |        |
| onClick        | 点击事件回调                                                                                 | (event) => void                   |        |

## 键盘、主题与 SSR

Tab / Shift+Tab 切换焦点，Enter 激活。hover 弹层的焦点监听默认启用；指针也在触发器上时，ArrowDown 进入已打开菜单，Escape 返回触发器。仅靠 focus 打开但指针不在触发器上时，固定上游会在插入浮层后再次关闭；固定上游未完整支持嵌套键盘场景。保留 menu/menuitem、aria-disabled、aria-expanded 与方向属性。默认覆盖桌面 light/dark 与适用 RTL；组件支持 SSR import/render/hydration，Portal 仅在客户端创建。

## 文案规范

菜单文案尽量简短，英文采用句子大小写，如 `Appeal center`，不使用 `Appeal Center`。

## 相关物料

固定上游的物料平台入口不嵌入 Vue 文档；页面组合可参考本页的水平加垂直示例以及 [Layout](/zh-cn/components/layout/)、[Breadcrumb](/zh-cn/components/breadcrumb/) 和 [Dropdown](/zh-cn/components/dropdown/)。

## 设计变量

::token-table{component="navigation"}
::

## FAQ

items 应保持稳定引用，避免重复初始化影响展开动画。固定版本虽公开 SubNav.maxHeight（默认 999），但未将它传给 Collapsible，不应依赖该参数放宽高度限制。菜单文案尽量简短。

## React → Vue

| React v2.102.0                     | Vue                                                                   |
| ---------------------------------- | --------------------------------------------------------------------- |
| `<Navigation items={items} />`     | `<Nav :items="items" />`                                              |
| `<Navigation.Item />`              | `<NavItem />` 或 `<Nav.Item />`                                       |
| `<Navigation.Sub />`               | `<SubNav />` 或 `<Nav.Sub />`                                         |
| `children`                         | 默认 slot                                                             |
| `onSelect={fn}`                    | `@select="fn"`                                                        |
| `onOpenChange={fn}`                | `@open-change="fn"`                                                   |
| `onCollapseChange={fn}`            | `@collapse-change="fn"`                                               |
| `selectedKeys` + `onSelect`        | `v-model:selected-keys` 或 `:selected-keys` + `@update:selected-keys` |
| `openKeys` + `onOpenChange`        | `v-model:open-keys`                                                   |
| `isCollapsed` + `onCollapseChange` | `v-model:is-collapsed`                                                |
| `renderWrapper(info)`              | `#item-wrapper="info"` 或 `renderWrapper`                             |
| ReactNode `icon` / `text`          | VNode/function prop 或 `#icon` / `#text`                              |
| React ref / `forwardRef`           | Vue template ref；`NavItem.forwardRef` 仅作 DOM 回调兼容              |

Vue 不复制 `children`、React render props 或 ref 对象语义。默认值为 `true` 的 `limitIndent` / `subNavMotion` 会区分缺省、显式 `false` 与显式 `true`。Portal 容器应在首次打开前稳定存在。

`multiple`、`deselect` 与 `SubNav.isOpen` 在固定 v2.102.0 类型中可见，但该版本 Adapter/Foundation 没有形成独立公开行为；迁移时不要据此依赖额外多选能力。
