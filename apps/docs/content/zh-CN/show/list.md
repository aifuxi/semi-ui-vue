---
title: 'List 列表'
description: '基础列表组件'
type: 'show'
order: 75
icon: 'doc-list'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/list` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-show-list-1" title="如何引入" kind="import" />

### 基本用法

列表的基本用法。可以通过 size 设置尺寸，支持`large`, `default`, `small`。可设置 header 和 footer，来自定义列表头部和尾部。

<DemoBlock id="zh-CN-show-list-2" title="基本用法" kind="live" />

### 模板用法

列表的 List.Item 内置了简单的结构包含：header，main 和 extra。其中 header 和 main 的对齐方式可以通过 align 属性设置，支持 `flex-start`（默认）, `flex-end`, `center`, `baseline`, 和 `stretch`。

<DemoBlock id="zh-CN-show-list-3" title="模板用法" kind="live" />

### 布局

通过 layout 属性可以设置列表的布局，支持`vertical`（默认）和`horizontal`。

<DemoBlock id="zh-CN-show-list-4" title="布局" kind="live" />

### 栅格列表

通过 grid 属性可以实现栅格列表，`span` 可设置每项的占格数，`gutter`可设置栅格间隔。

<DemoBlock id="zh-CN-show-list-5" title="栅格列表" kind="live" />

### 响应式的栅格列表

响应式的栅格列表。响应尺寸与 [Grid](/zh-CN/basic/grid) 保持一致。

<DemoBlock id="zh-CN-show-list-6" title="响应式的栅格列表" kind="live" />

### 加载更多

可通过 loadMore 属性实现加载更多的功能。

<DemoBlock id="zh-CN-show-list-7" title="加载更多" kind="live" />

### 滚动加载

可以结合滚动事件与分批加载实现滚动加载列表。交互建议符合 semi 交互设计规范，这里采用三次滚加载后出现 load more 按钮的形式。

<DemoBlock id="zh-CN-show-list-8" title="滚动加载" kind="live" />

### 滚动加载无限长列表

可以结合虚拟列表实现无限长列表，在数据量较大时减少实际渲染的列表项。

<DemoBlock id="zh-CN-show-list-9" title="滚动加载无限长列表" kind="live" />

### 拖拽排序

使用 [dnd-kit](https://github.com/clauderic/dnd-kit/tree/master) 可轻松实现拖拽排序。

<DemoBlock id="zh-CN-show-list-10" title="拖拽排序" kind="live" />

### 带分页器

你可以组合使用 Pagination， 实现一个分页的 List

<DemoBlock id="zh-CN-show-list-11" title="带分页器" kind="live" />

### 带筛选器

你可以通过组装 Input 使用，实现对 List 列表的筛选

<DemoBlock id="zh-CN-show-list-12" title="带筛选器" kind="live" />

### 添加删除项

<DemoBlock id="zh-CN-show-list-13" title="添加删除项" kind="live" />

### 单选或多选

你可以通过组合使用 Radio 或 Checkbox 将 List 增强为一个列表选择器

<DemoBlock id="zh-CN-show-list-14" title="单选或多选" kind="live" />

### 响应键盘事件

你可以自行监听对应按键的键盘事件，实现不同 Item 的选择。如下面这个例子，可以使用上下方向键选择不同Item

<DemoBlock id="zh-CN-show-list-15" title="响应键盘事件" kind="live" />

以上书单例子的Demo中涉及到的自定义样式如下

<DemoBlock id="zh-CN-show-list-16" title="响应键盘事件" kind="code" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/list/types.ts`、`packages/ui/src/grid/types.ts` 的公开类型为准。

#### Vue 用法

- `List.Item` 同时作为静态成员和 `ListItem` 具名导出；SFC 模板推荐使用 `ListItem`。
- `renderItem` 是保留的 callback prop；typed `#item="{ item, index }"` 插槽存在时优先。
- header、footer、loadMore、emptyContent 与 ListItem 的 header、main、extra 都支持同名插槽，插槽优先。
- `loading` 只控制列表加载态；分页由外部 Pagination 组合，不是 List prop。

#### Vue 事件

**List**

| 事件       | 参数                | 说明                                         |
| ---------- | ------------------- | -------------------------------------------- |
| click      | [event: MouseEvent] | 列表项未监听同名事件时，由 List 接收点击     |
| rightClick | [event: MouseEvent] | 列表项未监听同名事件时，由 List 接收右键点击 |

**ListItem**

| 事件       | 参数                | 说明           |
| ---------- | ------------------- | -------------- |
| click      | [event: MouseEvent] | 点击列表项     |
| rightClick | [event: MouseEvent] | 右键点击列表项 |
| mouseEnter | [event: MouseEvent] | 指针进入列表项 |
| mouseLeave | [event: MouseEvent] | 指针离开列表项 |

#### Vue 插槽

**List**

| 插槽         | 作用域参数      | 说明                   |
| ------------ | --------------- | ---------------------- |
| default      | {}              | 声明式 ListItem 子组件 |
| emptyContent | {}              | 空态内容               |
| footer       | {}              | 列表底部               |
| header       | {}              | 列表头部               |
| item         | { item, index } | 逐项渲染 dataSource    |
| loadMore     | {}              | 加载更多内容           |

**ListItem**

| 插槽    | 作用域参数 | 说明       |
| ------- | ---------- | ---------- |
| default | {}         | 列表项内容 |
| extra   | {}         | 附加内容   |
| header  | {}         | 头部内容   |
| main    | {}         | 主体内容   |

### List

| 属性         | 说明                                          | 类型                                      | 默认值     |
| ------------ | --------------------------------------------- | ----------------------------------------- | ---------- |
| bordered     | 是否显示边框                                  | boolean                                   | false      |
| class        | Vue 原生类名                                  | HTMLAttributes['class']                   | —          |
| className    | 样式类名                                      | HTMLAttributes['class']                   | -          |
| dataSource   | 只读列表数据源                                | readonly T[]                              | -          |
| emptyContent | 空态 VNode；emptyContent 插槽优先             | VNodeChild                                | -          |
| footer       | 列表底部 VNode；footer 插槽优先               | VNodeChild                                | -          |
| grid         | 列表栅格配置                                  | ListGrid                                  | -          |
| header       | 列表头部 VNode；header 插槽优先               | VNodeChild                                | -          |
| layout       | 列表布局，支持`vertical`, `horizontal`        | ListLayout                                | `vertical` |
| loading      | 是否处于加载中，为`true`时会显示 spin         | boolean                                   | false      |
| loadMore     | 根节点底部的加载更多 VNode；loadMore 插槽优先 | VNodeChild                                | -          |
| renderItem   | 数据项渲染 callback；item 插槽优先            | (item: T, index: number) =&gt; VNodeChild | -          |
| size         | 列表尺寸，支持 `small`, `default`, `large`    | ListSize                                  | `default`  |
| split        | 是否展示分割线                                | boolean                                   | true       |
| style        | 自定义样式对象                                | StyleValue                                | -          |

### List grid props

其他 grid 参数，请参考 [Grid](/zh-CN/basic/grid)

| 属性    | 说明                                                       | 类型                                            | 默认值 |
| ------- | ---------------------------------------------------------- | ----------------------------------------------- | ------ |
| type    | 行布局类型                                                 | GridRowType                                     | `flex` |
| align   | 行内项目的垂直对齐方式                                     | GridRowAlign                                    | —      |
| justify | 行内项目的水平排列方式                                     | GridRowJustify                                  | —      |
| gutter  | 栅格间隔                                                   | GridGutter \| readonly [GridGutter, GridGutter] | 0      |
| span    | 栅格占位格数                                               | number                                          | -      |
| order   | 栅格顺序                                                   | number                                          | —      |
| offset  | 左侧间隔格数                                               | number                                          | —      |
| push    | 向右移动格数                                               | number                                          | —      |
| pull    | 向左移动格数                                               | number                                          | —      |
| xs      | `&lt;576px` 响应式栅格，可为栅格数或一个包含其他属性的对象 | GridResponsiveCol                               | -      |
| sm      | `≥576px` 响应式栅格，可为栅格数或一个包含其他属性的对象    | GridResponsiveCol                               | -      |
| md      | `≥768px` 响应式栅格，可为栅格数或一个包含其他属性的对象    | GridResponsiveCol                               | -      |
| lg      | `≥992px` 响应式栅格，可为栅格数或一个包含其他属性的对象    | GridResponsiveCol                               | -      |
| xl      | `≥1200px` 响应式栅格，可为栅格数或一个包含其他属性的对象   | GridResponsiveCol                               | -      |
| xxl     | `≥1600px` 响应式栅格，可为栅格数或一个包含其他属性的对象   | GridResponsiveCol                               | -      |

### List.Item

| 属性      | 说明                                                                                                 | 类型                    | 默认值       |
| --------- | ---------------------------------------------------------------------------------------------------- | ----------------------- | ------------ |
| align     | 列表项头内容和主体内容的垂直对齐方式，支持 `flex-start`, `flex-end`, `center`, `baseline`, `stretch` | ListItemAlign           | `flex-start` |
| class     | Vue 原生类名                                                                                         | HTMLAttributes['class'] | —            |
| className | 样式类名                                                                                             | HTMLAttributes['class'] | -            |
| extra     | 附加内容 VNode；extra 插槽优先                                                                       | VNodeChild              | -            |
| header    | 头部内容 VNode；header 插槽优先                                                                      | VNodeChild              | -            |
| main      | 主体内容 VNode；main 插槽优先                                                                        | VNodeChild              | -            |
| style     | 自定义样式对象                                                                                       | StyleValue              | -            |

## 文案规范

- 首字母大写
- 结尾不跟随标点符号
- 语法平行：如主动态与被动态、陈述句与祈使句混合使用
