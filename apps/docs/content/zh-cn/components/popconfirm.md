---
title: '气泡确认框'
description: '目标元素的操作需要用户进一步的确认时使用。与 Popover 相比它内置了一系列可配置的操作按钮，与 Modal 相比它不强制全屏居中显示，交互也更轻量'
locale: 'zh-CN'
slug: 'popconfirm'
category: 'feedback'
order: 90
englishTitle: 'Popconfirm'
icon: 'doc-popconfirm'
upstream: 'feedback/popconfirm'
---

## 代码演示

### 如何引入

```ts
import { Popconfirm } from '@aifuxi/semi-ui-vue/popconfirm';
import '@aifuxi/semi-theme-default/popconfirm.css';
```

### 基本使用

Popconfirm 底层基于 Tooltip 封装，Children 支持类型同 Tooltip，注意事项详情可查阅 [Tooltip注意事项](/zh-cn/components/tooltip/#%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9)

::demo-block{demo="popconfirm/zh-cn/Basic" title="基本使用"}
::

### 类型搭配

开发者可以基于场景使用 `okType`/`cancelType`/`icon` 等参数搭配出不同风格的气泡式确认框。

::demo-block{demo="popconfirm/zh-cn/Types" title="类型搭配"}
::

### 延时关闭

@confirm、@cancel 可以通过 return Promise 实现点击后延时关闭 （v2.19后支持）  
@cancel、@confirm 被触发时，对应的 Button 会自动切换为 loading: true, Promise resolve 会关闭气泡确认框， promise reject时气泡依然保留，同时 button loading 自动切换为 false

::demo-block{demo="popconfirm/zh-cn/Async" title="延时关闭"}
::

### 初始化弹出层焦点位置

okButtonProps 和 cancelButtonProps 支持传入 `autoFocus` 参数，传入后打开面板时会自动聚焦在该位置。2.30.0 版本支持。

content 作用域插槽提供 `initialFocusRef`，将其通过 callback ref 绑定在可聚焦 DOM 或组件上，打开面板时会自动聚焦在该位置。2.30.0 版本支持。

::demo-block{demo="popconfirm/zh-cn/InitialFocus" title="初始化弹出层焦点位置"}
::

### 搭配 Tooltip 或 Popover 使用

请参考[搭配使用](/zh-cn/components/tooltip/#%E6%90%AD%E9%85%8D%20Popover%20%E6%88%96%20Popconfirm%20%E4%BD%BF%E7%94%A8)

## API 参考

| 属性               | 说明                                                                                                                               | 类型                             | 默认值                                     | 版本      |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ------------------------------------------ | --------- |
| arrowPointAtCenter | “小三角”是否指向元素中心，需要同时传入"showArrow=true"                                                                             | boolean                          | true                                       |           |
| cancelText         | 取消按钮文字                                                                                                                       | string                           | "取消"                                     |
| cancelButtonProps  | 取消按钮的 props                                                                                                                   | object                           |                                            |           |
| cancelType         | 取消按钮类型                                                                                                                       | string                           | "tertiary"                                 |
| closeOnEsc         | 在 trigger 聚焦时或在弹出层内聚焦元素上按 Esc 键是否关闭面板，受控时不生效                                                         | boolean                          | true                                       | **2.8.0** |
| content            | 显示内容；复杂内容使用 content 作用域插槽                                                                                          | VNodeChild                       | -                                          | -         |
| defaultVisible     | 非受控初始显示状态                                                                                                                 | boolean                          | false                                      | -         |
| disabled           | 点击 Popconfirm 子元素是否弹出气泡确认框                                                                                           | boolean                          | false                                      |
| getPopupContainer  | 指定父级 DOM，弹层将会渲染至该 DOM 中，自定义时容器需要设置 `position: relative` 这会改变浮层 DOM 树位置，但不会改变视图渲染位置。 | Function():HTMLElement           | () => document.body                        |
| guardFocus         | 当焦点处于弹出层内时，切换 Tab 是否让焦点在弹出层内循环                                                                            | boolean                          | true                                       | **2.8.0** |
| icon               | 自定义弹出气泡 Icon 图标                                                                                                           | VNodeChild                       | `<IconAlertTriangle size="extra-large" />` |
| motion             | 下拉列表出现/隐藏时，是否有动画                                                                                                    | boolean                          | true                                       |
| okText             | 确认按钮文字                                                                                                                       | string                           | "确定"                                     |
| okType             | 确认按钮类型                                                                                                                       | string                           | "primary"                                  |
| okButtonProps      | 确认按钮的 props                                                                                                                   | object                           |                                            |           |
| position           | 方向；LTR 默认为 bottomLeft，RTL 默认为 bottomRight                                                                                | TooltipPosition                  | bottomLeft                                 | -         |
| returnFocusOnClose | 按下 Esc 键后，焦点是否回到 trigger 上，只有设置 trigger 为 click 时生效                                                           | boolean                          | true                                       | **2.8.0** |
| showArrow          | 是否显示箭头三角形                                                                                                                 | boolean                          | false                                      |           |
| stopPropagation    | 是否阻止弹层上的点击事件冒泡                                                                                                       | boolean                          | true                                       |           |
| title              | 显示的标题                                                                                                                         | VNodeChild                       |                                            |
| trigger            | 触发展示的时机，可选值：hover / focus / click / custom                                                                             | string                           | 'click'                                    |
| visible            | 气泡框是否展示的受控属性                                                                                                           | boolean                          |                                            |           |
| zIndex             | 浮层 z-index 值                                                                                                                    | number                           | 1030                                       |
| @confirm           | 点击确认按钮回调                                                                                                                   | Function(e)                      |                                            |
| @cancel            | 点击取消按钮回调                                                                                                                   | Function(e)                      |                                            |
| @click-outside     | 当弹出层处于展示状态，点击非 Children、非浮层内部区域时的回调                                                                      | Function(e)                      |                                            | **2.1.0** |
| @esc-keydown       | 在 trigger 或弹出层按 Esc 键时调用                                                                                                 | Function(e:event)                |                                            | **2.8.0** |
| @visible-change    | 气泡框切换显示隐藏的回调                                                                                                           | Function(visible: boolean): void | () => {}                                   |           |

## Accessibility

### ARIA

语义化请参考 [Popover](/zh-cn/components/popover/#ARIA)

### 键盘和焦点

- Popconfirm 必须带有触发器，触发器可被聚焦，使用 Enter 键打开 Popconfirm
- Popconfirm 激活后，按下方向键 ⬇️ 将焦点移动到 Popconfirm 上。Popconfirm 的初始焦点应当遵循以下几个原则：
  - 如果 Popconfirm 内包含一个不可逆转过程的最后一个步骤，比如：删除数据等，那么这个初始焦点最好放在破坏性最小的可交互元素上，如：关闭按钮 ( 通过向对象 cancelButtonProps 中传入 autoFocus 实现）
  - 如果 Popconfirm 内仅为阅读文本，那么建议将初始焦点设置在最可能常用的交互元素上，如：确定按钮 ( 通过向对象 okButtonProps 中传入 autoFocus 实现）
- 键盘用户能够通过按 Esc 关闭 Popconfirm，并且焦点应该返回到触发器上。用户通过 Popconfirm 内的交互元素关闭该 Pop 后，焦点也应当返回到触发器上（仅当 trigger 为 click 时）
- 打开的情况下，用户点击 Popconfirm 内的空白处 Esc 后，焦点也会回到触发器上 （仅当 trigger 为 click 时）

## 设计变量

::token-table{component="popconfirm"}
::

## FAQ

- **为什么 Popconfirm 浮层在靠近屏幕边界宽度不够时，丢失宽度意外换行?**  
  在 chromium 104 后 对于屏幕边界文本宽度不够时的换行渲染策略发生变化，详细原因可查看 [issue #1022](https://github.com/DouyinFE/semi-design/issues/1022)，semi侧已经在v2.17.0版本修复了这个问题。

## React → Vue 迁移

| React                         | Vue                                                 |
| ----------------------------- | --------------------------------------------------- |
| children                      | 默认触发器插槽                                      |
| title / icon                  | 同名插槽或 VNodeChild prop                          |
| content ReactNode / function  | VNodeChild prop 或 `#content="{ initialFocusRef }"` |
| initialFocusRef               | `:ref="initialFocusRef"` callback ref               |
| onConfirm / onCancel          | @confirm / @cancel，监听函数可返回 Promise          |
| visible / onVisibleChange     | v-model:visible 或 visible + @visible-change        |
| onClickOutSide / onEscKeyDown | @click-outside / @esc-keydown                       |
| className                     | class，兼容 className                               |

组件读取 confirm/cancel 监听器的返回值：Promise 等待时对应按钮进入 loading，resolve 关闭，reject 保持打开并恢复按钮。不是 onOk，原延时关闭说明中的 onOk 已修正。defaultVisible 默认 false；传 visible 时受控。showCloseIcon 默认 true，arrowPointAtCenter 继承 Tooltip 默认 true。position 在 LTR 默认 bottomLeft，RTL 默认 bottomRight。其余 Portal、溢出、延迟与焦点参数继承 Popover。

浮层默认通过 Teleport 渲染到 document.body。自定义 getPopupContainer 使用本实例 template ref，容器设置 position: relative；需要限制显示区域时设置 overflow: hidden。不要在 setup 顶层查询 document 或调用静态弹窗方法。组件会清理自身的监听、焦点与定位资源，业务创建的计时器、静态句柄仍由业务在卸载时清理。
