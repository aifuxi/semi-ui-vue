---
title: 'Breadcrumb 面包屑'
description: '面包屑是用户界面中的一种辅助导航，可以显示当前页面在层级架构中的位置，并能返回之前的页面。'
type: 'navigation'
order: 56
icon: 'doc-breadcrumb'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/breadcrumb` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-navigation-breadcrumb-1" title="如何引入" kind="import" />

### 基本用法

<DemoBlock id="zh-CN-navigation-breadcrumb-2" title="基本用法" kind="live" />

### 带图标的

支持标题只显示图标或者同时显示图标和文本。

<DemoBlock id="zh-CN-navigation-breadcrumb-3" title="带图标的" kind="live" />

### 尺寸

默认为 `compact`，设置属性为 `false` 可使图标和文字尺寸增加。

<DemoBlock id="zh-CN-navigation-breadcrumb-4" title="尺寸" kind="live" />

### 自定义的分隔符

默认为 `/`。

<DemoBlock id="zh-CN-navigation-breadcrumb-5" title="自定义的分隔符" kind="live" />

### 截断逻辑

在 **0.34.0** 版本之后，当级别名字溢出设定宽度后省略截断。可以通过 `showTooltip` 属性设置相关参数。默认宽度150px，鼠标悬停时显示 Tooltip 完整显示级别名称。

<DemoBlock id="zh-CN-navigation-breadcrumb-6" title="截断逻辑" kind="live" />

当路径层级超过 4 个级别，则：第二层至倒数第三层省略，点击省略号展开显示全部级别；如果过长则自动换行。
在 **v>=1.9.0** 之后，可以通过 `maxItemCount` 来控制超过多少个级别进行折叠。

<DemoBlock id="zh-CN-navigation-breadcrumb-7" title="截断逻辑" kind="live" />

### 自定义省略号区域

组件内部提供了两种省略号区域渲染的类型，可通过 `moreType` 来设置，`moreType` 的可选值为 `default` 和 `popover`。

<DemoBlock id="zh-CN-navigation-breadcrumb-8" title="自定义省略号区域" kind="live" />

如果想要为省略号区域自定义其他形式的渲染，则可以使用 `renderMore()` 方法。

<DemoBlock id="zh-CN-navigation-breadcrumb-9" title="自定义省略号区域" kind="live" />

### 路由对象

Breadcrumb 支持通过 routes 传入路由对象 `route: { name, path, href, icon }` 或字符串组成的数组。可以配合 renderItem 来渲染节点。通过这样实现的 Breadcrumb 同样会进行截断处理。

- name 为展示的名称，不传入时为空字符串。当 route 为字符串时，默认将字符串设置为名称。
- path 为路由路径
- href 为链接目的地，挂载在 a 标签上。
- icon 为标签的显示图标

<DemoBlock id="zh-CN-navigation-breadcrumb-10" title="路由对象" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/breadcrumb/types.ts`、`packages/ui/src/breadcrumb/index.ts` 的公开类型为准。

#### Vue 事件

**Breadcrumb**

| 事件  | 参数                                                           | 说明             |
| ----- | -------------------------------------------------------------- | ---------------- |
| click | [item: BreadcrumbItemInfo, event: MouseEvent \| KeyboardEvent] | 点击任一面包屑项 |

**Breadcrumb.Item**

| 事件  | 参数                                                           | 说明             |
| ----- | -------------------------------------------------------------- | ---------------- |
| click | [item: BreadcrumbItemInfo, event: MouseEvent \| KeyboardEvent] | 点击当前面包屑项 |

#### Vue 插槽

**Breadcrumb**

| 插槽      | 作用域参数                                                                        | 说明                   |
| --------- | --------------------------------------------------------------------------------- | ---------------------- |
| default   | {}                                                                                | Breadcrumb.Item 子组件 |
| item      | { index: number; route: BreadcrumbRoute }                                         | 自定义路由项           |
| more      | { expand: (event?: MouseEvent \| KeyboardEvent) =&gt; void; items: VNodeChild[] } | 自定义折叠项           |
| separator | {}                                                                                | 自定义分隔符           |

**Breadcrumb.Item**

| 插槽      | 作用域参数 | 说明         |
| --------- | ---------- | ------------ |
| default   | {}         | 面包屑项内容 |
| icon      | {}         | 图标         |
| separator | {}         | 分隔符       |

### Breadcrumb

| 属性         | 说明                                                                                                              | 类型                                                     | 默认值                                                                                       | 版本   |
| ------------ | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------ |
| activeIndex  | 受控使用，当前选择的导航序号                                                                                      | number                                                   | -                                                                                            | 2.61.0 |
| autoCollapse | 是否超出maxItemCount后自动折叠                                                                                    | boolean                                                  | true                                                                                         | 1.9.0  |
| class        | —                                                                                                                 | HTMLAttributes['class']                                  | —                                                                                            |        |
| className    | 类名                                                                                                              | string                                                   | -                                                                                            |        |
| compact      | 显示尺寸，是否紧凑                                                                                                | boolean                                                  | true                                                                                         |        |
| maxItemCount | 超出多少个进行自动折叠                                                                                            | number                                                   | 4                                                                                            | 1.9.0  |
| moreType     | 内置的...区域的渲染类型，可选值为 'default'、'popover'                                                            | BreadcrumbMoreType                                       | 'default'                                                                                    | 1.27.0 |
| renderItem   | 自定义链接函数，配合 routes 使用                                                                                  | (route: BreadcrumbRoute, index: number) =&gt; VNodeChild | -                                                                                            | 0.27.0 |
| renderMore   | 自定义...区域的渲染                                                                                               | (items: VNodeChild[]) =&gt; VNodeChild                   | -                                                                                            | 1.27.0 |
| routes       | router 的路由信息，由路由对象或字符串组成的数组，路由对象格式参考: [Route](#Route)                                | Array&lt;BreadcrumbRoute \| string&gt;                   | -                                                                                            |        |
| separator    | 自定义的分隔符                                                                                                    | VNodeChild                                               | '/'                                                                                          |        |
| showTooltip  | 是否展示 Tooltip 及相关配置: width，溢出宽度； ellipsisPos，截断方式，从中间/末尾截断； opts，透传给Tooltip的属性 | boolean \| BreadcrumbShowTooltip                         | {width: 150, ellipsisPos: 'end', opts: { autoAdjustOverflow: true, position: "bottomLeft" }} | 0.34.0 |
| style        | 内联样式                                                                                                          | CSSProperties                                            | -                                                                                            |        |

### Breadcrumb.Item

| 属性                  | 说明                         | 类型            | 默认值 | 版本   |
| --------------------- | ---------------------------- | --------------- | ------ | ------ |
| active                | —                            | boolean         | —      |        |
| className             | —                            | string          | —      |        |
| href                  | 链接的目的地                 | string \| null  | -      |        |
| icon                  | 标签的显示图标               | VNodeChild      | -      |        |
| noLink                | 移除 hover 和 active 的样式  | boolean         | false  | 1.16.0 |
| route                 | —                            | BreadcrumbRoute | —      |        |
| separator             | 分隔符，可以覆盖父级的分隔符 | VNodeChild      | -      | 1.16.0 |
| shouldRenderSeparator | —                            | boolean         | —      |        |
| style                 | —                            | CSSProperties   | —      |        |

### Route

| 属性 | 说明           | 类型       | 默认值 | 版本   |
| ---- | -------------- | ---------- | ------ | ------ |
| href | 链接目的地     | string     | -      | 0.27.0 |
| icon | 标签的显示图标 | VNodeChild | -      |        |
| name | 路由名         | VNodeChild | -      |        |
| path | 路由路径       | string     | -      |        |

**v>=1.16.0** 之后 Route 支持 Breadcrumb.Item 上的相应属性。

## Accessibility

- Breadcrumb 支持传入 `aria-label` 来表示该 Breadcrumb 作用
- Breadcrumb 会对当前项设置 `aria-current='page'`

## 文案规范

- 每个页面链接都应该很简短，并且清楚地反映它链接到的位置或链接的实体
- 按句子大小写书写
