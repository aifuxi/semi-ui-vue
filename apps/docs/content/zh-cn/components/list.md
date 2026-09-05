---
title: '列表'
description: '基础列表组件'
locale: 'zh-CN'
slug: 'list'
category: 'show'
order: 75
englishTitle: 'List'
icon: 'doc-list'
upstream: 'show/list'
---

## 代码演示

### 如何引入

```ts
import { List, ListItem } from '@aifuxi/semi-ui-vue/list';
import '@aifuxi/semi-theme-default/list.css';
```

### 基本用法

列表的基本用法。可以通过 size 设置尺寸，支持`large`, `default`, `small`。可设置 header 和 footer，来自定义列表头部和尾部。

::demo-block{demo="list/zh-cn/Basic" title="基本用法"}
::

### 模板用法

列表的 List.Item 内置了简单的结构包含：header，main 和 extra 。其中 header 和 main 的对齐方式可以通过 align 属性设置，支持 `flex-start`（默认）, `flex-end`, `center`, `baseline`, 和 `stretch` 。

::demo-block{demo="list/zh-cn/Template" title="模板用法"}
::

### 布局

通过 layout 属性可以设置列表的布局，支持`vertical`（默认）和`horizontal`。

::demo-block{demo="list/zh-cn/Layout" title="布局"}
::

### 栅格列表

通过 grid 属性可以实现栅格列表，`span` 可设置每项的占格数，`gutter`可设置栅格间隔。

::demo-block{demo="list/zh-cn/Grid" title="栅格列表"}
::

### 响应式的栅格列表

响应式的栅格列表。响应尺寸与 [Grid](/zh-cn/components/grid/) 保持一致。

::demo-block{demo="list/zh-cn/Responsive" title="响应式的栅格列表"}
::

### 加载更多

可通过 loadMore 属性实现加载更多的功能。

::demo-block{demo="list/zh-cn/LoadMore" title="加载更多"}
::

### 滚动加载

通过原生 scroll 事件与 Vue 状态实现滚动加载。遵循上游交互规范，三次滚动加载后显示加载更多按钮。

::demo-block{demo="list/zh-cn/ScrollLoad" title="滚动加载"}
::

### 滚动加载无限长列表

通过可见窗口计算与绝对定位实现带异步加载的虚拟列表，只渲染当前窗口和预加载行，提高长列表性能。

::demo-block{demo="list/zh-cn/Virtualized" title="滚动加载无限长列表"}
::

### 拖拽排序

通过 Pointer Events 实现纵向拖动与释放排序，并在页面边缘自动滚动。

::demo-block{demo="list/zh-cn/DragSort" title="拖拽排序"}
::

### 带分页器

你可以组合使用 Pagination， 实现一个分页的 List

::demo-block{demo="list/zh-cn/Pagination" title="带分页器"}
::

### 带筛选器

你可以通过组装 Input 使用，实现对 List 列表的筛选

::demo-block{demo="list/zh-cn/Filter" title="带筛选器"}
::

### 添加删除项

::demo-block{demo="list/zh-cn/AddRemove" title="添加删除项"}
::

### 单选或多选

你可以通过组合使用 Radio 或 Checkbox 将 List 增强为一个列表选择器

::demo-block{demo="list/zh-cn/Selection" title="单选或多选"}
::

### 响应键盘事件

你可以自行监听对应按键的键盘事件，实现不同 Item 的选择。如下面这个例子，可以使用上下方向键选择不同Item

::demo-block{demo="list/zh-cn/Keyboard" title="响应键盘事件"}
::

以上书单例子的Demo中涉及到的自定义样式如下

```scss
.component-list-demo-booklist {
  .list-item {
    &:hover {
      background-color: var(--semi-color-fill-0);
    }
    &:active {
      background-color: var(--semi-color-fill-1);
    }
  }
}

body > .component-list-demo-drag-item {
  font-size: 14px;
}

.component-list-demo-booklist-active-item {
  background-color: var(--semi-color-fill-0);
}
```

## API 参考

### List

| 属性         | 说明                                                     | 类型                                    | 默认值     |
| ------------ | -------------------------------------------------------- | --------------------------------------- | ---------- |
| bordered     | 是否显示边框                                             | boolean                                 | `false`    |
| class        | 自定义样式类名                                           | string                                  | -          |
| dataSource   | 列表数据源                                               | any[]                                   | -          |
| emptyContent | 空列表的展示内容                                         | VNodeChild                              | -          |
| footer       | 列表底部                                                 | VNodeChild                              | -          |
| grid         | 列表栅格配置                                             | [Grid](/zh-cn/components/grid/#API参考) | -          |
| header       | 列表头部                                                 | VNodeChild                              | -          |
| layout       | 列表布局，支持`vertical`, `horizontal`                   | string                                  | `vertical` |
| loadMore     | 加载更多的按钮                                           | VNodeChild                              | -          |
| loading      | 是否处于加载中，为`true`时会显示 spin                    | boolean                                 | `false`    |
| renderItem   | 当使用 dataSource 时，可以用 renderItem 自定义渲染列表项 | (item, ind) => VNodeChild               | -          |
| size         | 列表尺寸，支持 `small`, `default`, `large`               | string                                  | `default`  |
| split        | 是否展示分割线                                           | boolean                                 | `true`     |
| style        | 自定义样式对象                                           | CSSProperties                           | -          |
| @click       | 点击回调事件                                             | (e: event) => void                      | -          |
| @right-click | 右键点击回调事件                                         | (e: event) => void                      | -          |

### List grid props

其他 grid 参数，请参考 [Grid](/zh-cn/components/grid/)

| 属性   | 说明                                                     | 类型           | 默认值 |
| ------ | -------------------------------------------------------- | -------------- | ------ |
| span   | 栅格占位格数                                             | number         | -      |
| gutter | 栅格间隔                                                 | number         | 0      |
| xs     | `<576px` 响应式栅格，可为栅格数或一个包含其他属性的对象  | number\|object | -      |
| sm     | `≥576px` 响应式栅格，可为栅格数或一个包含其他属性的对象  | number\|object | -      |
| md     | `≥768px` 响应式栅格，可为栅格数或一个包含其他属性的对象  | number\|object | -      |
| lg     | `≥992px` 响应式栅格，可为栅格数或一个包含其他属性的对象  | number\|object | -      |
| xl     | `≥1200px` 响应式栅格，可为栅格数或一个包含其他属性的对象 | number\|object | -      |
| xxl    | `≥1600px` 响应式栅格，可为栅格数或一个包含其他属性的对象 | number\|object | -      |

### List.Item

| 属性         | 说明                                                                                                 | 类型               | 默认值       |
| ------------ | ---------------------------------------------------------------------------------------------------- | ------------------ | ------------ |
| align        | 列表项头内容和主体内容的垂直对齐方式，支持 `flex-start`, `flex-end`, `center`, `baseline`, `stretch` | string             | `flex-start` |
| class        | 自定义样式类名                                                                                       | string             | -            |
| extra        | 列表项附加内容                                                                                       | VNodeChild         | -            |
| header       | 列表项头内容                                                                                         | VNodeChild         | -            |
| main         | 列表项主体内容                                                                                       | VNodeChild         | -            |
| style        | 自定义样式对象                                                                                       | CSSProperties      | -            |
| @click       | 点击回调事件                                                                                         | (e: event) => void | -            |
| @right-click | 右键点击回调事件                                                                                     | (e: event) => void | -            |

## 文案规范

- 首字母大写
- 结尾不跟随标点符号
- 语法平行：如主动态与被动态、陈述句与祈使句混合使用

## 设计变量

::token-table{component="list"}
::

## Accessibility

List 不增加键盘选择状态。使用 Checkbox/Radio 提供选择语义；可点击行应包含原生按钮或链接。键盘示例的容器可聚焦，上下方向键循环高亮。

## FAQ

**如何改变列表数据？**

更新绑定的 dataSource 或控制默认插槽；List 本身不维护分页、过滤或排序后的数据。

## React → Vue 迁移

| React                                     | Vue                                                        |
| ----------------------------------------- | ---------------------------------------------------------- |
| children                                  | 默认插槽，直接放置 ListItem                                |
| renderItem(item, index)                   | `#item="{ item, index }"`，或返回 VNodeChild 的 renderItem |
| header / footer / loadMore / emptyContent | 同名具名插槽或 VNodeChild prop                             |
| List.Item                                 | ListItem，也保留 List.Item                                 |
| ListItem header / main / extra            | 同名插槽或 VNodeChild prop                                 |
| onClick / onRightClick                    | @click / @right-click，参数 MouseEvent                     |
| ListItem onMouseEnter / onMouseLeave      | @mouse-enter / @mouse-leave，参数 MouseEvent               |
| className                                 | class；兼容 className                                      |

List 不内置分页、筛选、选择、拖拽或虚拟化状态；示例通过公开组合组件和 Vue 状态实现这些能力。滚动加载使用原生 scroll 事件；虚拟列表示例只渲染可见窗口和预加载行，并异步填充记录；拖拽使用 Pointer Events 保持纵向移动、释放排序和页面边缘滚动。无需安装 React 专属集成包。加载计时器和动画帧在卸载时清理。

筛选示例响应完整输入值，适用于中文输入法与英文输入。多选初值是完整书名数组，新增操作不会重复已有书籍。键盘示例在自身获得焦点后响应上下方向键，不占用文档页其他控件的键盘输入。
