---
title: '面包屑'
description: '面包屑是用户界面中的一种辅助导航，可以显示当前页面在层级架构中的位置，并能返回之前的页面。'
locale: 'zh-CN'
slug: 'breadcrumb'
category: 'navigation'
order: 56
englishTitle: 'Breadcrumb'
icon: 'doc-breadcrumb'
upstream: 'navigation/breadcrumb'
---

## 代码演示

### 如何引入

```ts
import { Breadcrumb, BreadcrumbItem } from '@aifuxi/semi-ui-vue/breadcrumb';
import '@aifuxi/semi-theme-default/breadcrumb.css';
```

### 基本用法

::demo-block{demo="breadcrumb/zh-cn/Basic" title="基本用法"}
::

### 带图标的

支持标题只显示图标或者同时显示图标和文本。

::demo-block{demo="breadcrumb/zh-cn/Icons" title="带图标的"}
::

### 尺寸

默认为 `compact`，设置属性为 `false` 可使图标和文字尺寸增加。

::demo-block{demo="breadcrumb/zh-cn/Size" title="尺寸"}
::

### 自定义的分隔符

默认为 `/`。

::demo-block{demo="breadcrumb/zh-cn/Separator" title="自定义的分隔符"}
::

### 截断逻辑

在 **0.34.0** 版本之后，当级别名字溢出设定宽度后省略截断。可以通过 `showTooltip` 属性设置相关参数。默认宽度150px，鼠标悬停时显示 Tooltip 完整显示级别名称。

::demo-block{demo="breadcrumb/zh-cn/Truncation" title="截断逻辑"}
::

当路径层级超过 4 个级别，则：第二层至倒数第三层省略，点击省略号展开显示全部级别；如果过长则自动换行。
在 **v>=1.9.0** 之后，可以通过 `maxItemCount` 来控制超过多少个级别进行折叠。

::demo-block{demo="breadcrumb/zh-cn/Collapse" title="截断逻辑"}
::

### 自定义省略号区域

组件内部提供了两种省略号区域渲染的类型，可通过 `moreType` 来设置，`moreType` 的可选值为 `default` 和 `popover`。

::demo-block{demo="breadcrumb/zh-cn/Popover" title="自定义省略号区域"}
::

如果想要为省略号区域自定义其他形式的渲染，则可以使用 `renderMore()` 方法。

::demo-block{demo="breadcrumb/zh-cn/CustomMore" title="自定义省略号区域"}
::

### 路由对象

Breadcrumb 支持通过 routes 传入路由对象 `route: { name, path, href, icon }` 或字符串组成的数组。可以配合 renderItem 来渲染节点。通过这样实现的 Breadcrumb 同样会进行截断处理。

- name 为展示的名称，不传入时为空字符串。当 route 为字符串时，默认将字符串设置为名称。
- path 为路由路径
- href 为链接目的地，挂载在 a 标签上。
- icon 为标签的显示图标

::demo-block{demo="breadcrumb/zh-cn/Routes" title="路由对象"}
::

## API 参考

### Breadcrumb

| 属性         | 说明                                                                                                              | 类型                                       | 默认值                                                                                       | 版本   |
| ------------ | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------- | ------ |
| activeIndex  | 受控的当前导航序号                                                                                                | number                                     | -                                                                                            | 2.61.0 |
| autoCollapse | 是否超出maxItemCount后自动折叠                                                                                    | boolean                                    | true                                                                                         | 1.9.0  |
| class        | 类名                                                                                                              | string                                     | -                                                                                            |        |
| compact      | 显示尺寸，是否紧凑                                                                                                | boolean                                    | true                                                                                         |        |
| maxItemCount | 超出多少个进行自动折叠                                                                                            | number                                     | 4                                                                                            | 1.9.0  |
| moreType     | 内置的...区域的渲染类型，可选值为 'default'、'popover'                                                            | string                                     | 'default'                                                                                    | 1.27.0 |
| renderItem   | 自定义链接函数，配合 routes 使用                                                                                  | (Route: [Route](#route)) => VNodeChild     | -                                                                                            | 0.27.0 |
| renderMore   | 自定义...区域的渲染                                                                                               | (restItem: VNodeChild[]) => VNodeChild     | -                                                                                            | 1.27.0 |
| routes       | router 的路由信息，由路由对象或字符串组成的数组，路由对象格式参考: [Route](#route)                                | Array<Route \| string>                     | -                                                                                            |        |
| separator    | 自定义的分隔符                                                                                                    | VNodeChild                                 | '/'                                                                                          |        |
| showTooltip  | 是否展示 Tooltip 及相关配置: width，溢出宽度； ellipsisPos，截断方式，从中间/末尾截断； opts，透传给Tooltip的属性 | boolean \| showToolTipProps                | {width: 150, ellipsisPos: 'end', opts: { autoAdjustOverflow: true, position: "bottomLeft" }} | 0.34.0 |
| style        | 内联样式                                                                                                          | CSSProperties                              | -                                                                                            |        |
| @click       | 单击事件                                                                                                          | (item: [Route](#route) , e: Event) => void | -                                                                                            | 0.27.0 |

### Breadcrumb.Item

| 属性      | 说明                         | 类型                            | 默认值 | 版本   |
| --------- | ---------------------------- | ------------------------------- | ------ | ------ |
| href      | 链接的目的地                 | string                          | -      |        |
| icon      | 标签的显示图标               | VNodeChild                      | -      |        |
| @click    | 单击事件                     | function(item: Route, e: Event) | -      | 0.27.0 |
| separator | 分隔符，可以覆盖父级的分隔符 | VNodeChild                      | -      | 1.16.0 |
| noLink    | 移除 hover 和 active 的样式  | boolean                         | false  | 1.16.0 |

### Route

| 属性 | 说明           | 类型       | 默认值 | 版本   |
| ---- | -------------- | ---------- | ------ | ------ |
| href | 链接目的地     | string     | -      | 0.27.0 |
| icon | 标签的显示图标 | VNodeChild | -      |        |
| name | 路由名         | string     | -      |        |
| path | 路由路径       | string     | -      |        |

**v>=1.16.0** 之后 Route 支持 Breadcrumb.Item 上的相应属性。

## Accessibility

- Breadcrumb 支持传入 `aria-label` 来表示该 Breadcrumb 作用
- Breadcrumb 会对当前项设置 `aria-current='page'`

## 文案规范

- 每个页面链接都应该很简短，并且清楚地反映它链接到的位置或链接的实体
- 按句子大小写书写

## 设计变量

::token-table{component="breadcrumb"}
::

## React → Vue 迁移

| React                          | Vue                                                          |
| ------------------------------ | ------------------------------------------------------------ |
| `Breadcrumb.Item`              | `BreadcrumbItem`，也保留组合成员                             |
| `children`                     | 默认插槽，直接子节点为 BreadcrumbItem                        |
| `icon` / `separator` ReactNode | 同名插槽或 VNodeChild prop                                   |
| `renderItem(route)`            | `#item="{ route, index }"`，或返回 VNodeChild 的 renderItem  |
| `renderMore(restItems)`        | `#more="{ items, expand }"`，或返回 VNodeChild 的 renderMore |
| `onClick(item, event)`         | `@click`；鼠标或 Enter 激活事件                              |
| `className`                    | 原生 `class`，兼容保留 className                             |

`routes` 的 name、icon 支持 VNodeChild。路由对象的 `href` 才决定导航目的地，`path` 是传给业务回调的数据。自定义更多区域接收到实际的隐藏节点，请保留事件处理；`expand()` 可主动展开全部层级。

BreadcrumbItem 还公开 `active`、`route` 和 `shouldRenderSeparator`；放在 Breadcrumb 内时这些状态由父组件统一设置。`autoCollapse`、`compact` 默认 true，显式传 false 可关闭。上游 Separator 示例的 `size` 不是有效公开属性，使用默认 compact 布局。所有站内示例链接均指向带尾斜线的本地页面。
