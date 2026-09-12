---
title: '气泡卡片'
description: '点击/鼠标移入元素，弹出气泡式的卡片浮层。'
locale: 'zh-CN'
slug: 'popover'
category: 'show'
order: 78
englishTitle: 'Popover'
icon: 'doc-popover'
upstream: 'show/popover'
---

## 使用场景

Popover 气泡卡片是由用户自主打开的临时性浮层卡片，能够承载一些额外内容和交互行为而不影响原页面。

和 Tooltip 的区别是，它可以承载更复杂的内容，而不仅仅是提示文本。

## 代码演示

### 如何引入

```ts
import { Popover } from '@aifuxi/semi-ui-vue/popover';
import '@aifuxi/semi-theme-default/popover.css';
```

### 注意事项

Popover 需要将事件、ARIA 属性和焦点能力关联到触发器的真实 DOM。触发器可以是原生元素，也可以是只有一个原生根节点的 Vue 组件。自定义组件使用原生属性继承，或通过 useAttrs 与 v-bind 显式透传属性和事件；多根组件应在外层包裹 span。无需 React forwardRef 或 Class Component。

::demo-block{demo="popover/zh-cn/TriggerChildren" title="注意事项"}
::

### 基本使用

将浮层的触发器 Trigger 作为`默认插槽触发器`，使用 Popover 包裹（如下的例子中触发器为 Tag 元素）。浮层内容通过`content`传入  
注意事项同 [Tooltip](/zh-cn/components/tooltip/#%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9)

::demo-block{demo="popover/zh-cn/Basic" title="基本使用"}
::

### 弹出位置

支持通过`position`设置浮层弹出方向，共支持十二个方向。

::demo-block{demo="popover/zh-cn/Position" title="弹出位置"}
::

### 受控显示

设置`trigger='custom'`，此场景下，Popover 的显示与否完全受到参数 `visible` 的控制。

::demo-block{demo="popover/zh-cn/Controlled" title="受控显示"}
::

### condition 条件触发

当 `:condition="false"` 时，Popover 不响应 hover/click/focus 等触发行为（`trigger='custom'` 不受影响）。

::demo-block{demo="popover/zh-cn/Condition" title="condition 条件触发"}
::

### 显示小三角

通过设置`showArrow`, Popover 同样也支持展示一个小三角。

> 这种模式下浮层会拥有一个默认的样式，你可以通过传递 style 参数来覆盖掉。

::demo-block{demo="popover/zh-cn/Arrow" title="显示小三角"}
::

### 指向元素中心

在**显示小三角**的条件（`showArrow=true`）下，可以传入 `arrowPointAtCenter=true` 使得小三角始终指向元素中心位置。

::demo-block{demo="popover/zh-cn/ArrowCenter" title="指向元素中心"}
::

### 设置浮层背景色

如果你需要定制浮层的背景色或边框颜色，请**务必单独声明 `style` 中的 `backgroundColor` 和 `borderColor` 属性**，这样能够使得“小三角”也能应用相同的背景色和边框颜色。

::demo-block{demo="popover/zh-cn/Color" title="设置浮层背景色" overflow="visible"}
::

### 初始化弹出层焦点位置

Popover content 作用域插槽提供 `initialFocusRef`，将其通过 callback ref 绑定在可聚焦 DOM 或组件上，打开面板时会自动聚焦在该位置。

::demo-block{demo="popover/zh-cn/InitialFocus" title="初始化弹出层焦点位置"}
::

### 搭配 Tooltip 或 Popconfirm 使用

请参考[搭配使用](/zh-cn/components/tooltip/#%E6%90%AD%E9%85%8D%20Popover%20%E6%88%96%20Popconfirm%20%E4%BD%BF%E7%94%A8)

## API 参考

| 属性                 | 说明                                                                                                                                        | 类型                                | 默认值                                      | 版本       |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------- | ---------- |
| autoAdjustOverflow   | 是否自动调整弹出层展开方向，用于边缘遮挡时自动调整展开方向                                                                                  | boolean                             | true                                        |            |
| arrowPointAtCenter   | "小三角"是否指向元素中心，需要同时传入"showArrow=true"                                                                                      | boolean                             | true                                        | -          |
| class                | 弹出层的样式名                                                                                                                              | string                              |                                             |            |
| closeOnEsc           | 在 trigger 或 弹出层按 Esc 键是否关闭面板，受控时不生效                                                                                     | boolean                             | true                                        | **2.8.0**  |
| condition            | 是否允许 Popover 触发显示。仅当显式设置为 false 时，hover/click/focus 等触发行为不生效（trigger='custom' 场景不受影响）                     | boolean                             | true                                        |            |
| content              | 显示内容；复杂内容使用 content 作用域插槽                                                                                                   | VNodeChild                          | -                                           | -          |
| clickToHide          | 点击弹出层及内部任一元素时是否自动关闭弹层                                                                                                  | boolean                             | false                                       | -          |
| disableFocusListener | trigger为`hover`时，不响应键盘聚焦弹出浮层事件，详见[issue#977](https://github.com/DouyinFE/semi-design/issues/977)                         | boolean                             | true                                        | **2.17.0** |
| getPopupContainer    | 指定父级 DOM，弹层将会渲染至该 DOM 中，自定义需要设置 `position: relative` 这会改变浮层 DOM 树位置，但不会改变视图渲染位置。                | function():HTMLElement              | () => document.body                         |            |
| guardFocus           | 当焦点处于弹出层内时，切换 Tab 是否让焦点在弹出层内循环                                                                                     | boolean                             | true                                        | **2.8.0**  |
| keepDOM              | 关闭时是否保留内部组件不销毁                                                                                                                | boolean                             | false                                       | **2.31.0** |
| margin               | 弹出层计算溢出时的增加的冗余值，详见[issue#549](https://github.com/DouyinFE/semi-design/issues/549)，作用同 Tooltip margin                  | number\|object                      |                                             | **2.25.0** |
| mouseEnterDelay      | 鼠标移入后，延迟显示的时间，单位毫秒（仅当 trigger 为 hover/focus 时生效）                                                                  | number                              | 50                                          |            |
| mouseLeaveDelay      | 鼠标移出后，延迟消失的时间，单位毫秒（仅当 trigger 为 hover/focus 时生效）                                                                  | number                              | 50                                          |            |
| rePosKey             | 可以更新该项值手动触发弹出层的重新定位                                                                                                      | string\|number                      |                                             |            |
| returnFocusOnClose   | 按下 Esc 键后，焦点是否回到 trigger 上，设置 trigger 为 hover, focus, click 时生效                                                          | boolean                             | true                                        | **2.8.0**  |
| position             | 方向，可选值：`top`,`topLeft`,`topRight`,`left`,`leftTop`,`leftBottom`,`right`,`rightTop`,`rightBottom`,`bottom`,`bottomLeft`,`bottomRight` | string                              | "bottom"                                    |            |
| spacing              | 弹出层与 默认插槽触发器 元素的距离，单位 px（object类型自 v2.45后支持）                                                                     | number｜ `{ x: number; y: number }` | 4(showArrow=false 时) 10(showArrow=true 时) |            |
| showArrow            | 是否显示“小三角”                                                                                                                            | boolean                             | false                                       | -          |
| stopPropagation      | 是否阻止弹出层上的点击事件冒泡                                                                                                              | boolean                             | false                                       | -          |
| style                | 弹出层的内联样式                                                                                                                            | object                              |                                             |            |
| trigger              | 触发方式，可选值：`hover`, `focus`, `click`, `custom`, `contextMenu`（v2.42支持）                                                           | string                              | 'hover'                                     |            |
| visible              | 是否显示，配合trigger='custom'可实现完全受控                                                                                                | boolean                             |                                             |            |
| zIndex               | 弹出层 z-index 值                                                                                                                           | number                              | 1030                                        |            |
| @click-outside       | 当弹出层处于展示状态，点击非Children、非浮层内部区域时的回调（仅trigger为custom、click时有效）                                              | function(e:event)                   |                                             | **2.1.0**  |
| @esc-keydown         | 在 trigger 或 弹出层按 Esc 键时调用                                                                                                         | function(e:event)                   |                                             | **2.8.0**  |
| @visible-change      | 弹出层展示/隐藏时触发的回调                                                                                                                 | function(isVisible:boolean)         |                                             |            |

## Accessibility

### ARIA

- 关于 role
  - 当 Popover 的 trigger 为 click、custom时，Popover的 content 具有 `dialog` role
  - 当trigger为hover时，Popover的content 具有 `tooltip` role
- Popover 的 content
  - content 的 wrapper 会被自动添加 `id` 属性
- Popover 的 默认插槽触发器
  - 会被自动添加 [aria-expanded](https://www.w3.org/TR/wai-aria-1.1/#aria-expanded) 属性，当 Popover 可见时，属性值为 `true`，不可见时为 `false`
  - 会被自动添加 [aria-haspopup](https://www.w3.org/TR/wai-aria-1.1/#aria-haspopup) 属性，为 `dialog`
  - 会被自动添加 [aria-controls](https://www.w3.org/TR/wai-aria-1.1/#aria-controls) 属性，为 content 的 wrapper 的 id

### 键盘和焦点

- Popover 触发方式设置为 hover 时：鼠标悬浮时打开 Popover；设 disableFocusListener=false 后支持聚焦触发
- Popover 触发方式设置为 click 时：点击触发器或聚焦时并使用 Enter 键打开 Popover
- Popover 激活后，按下方向键 ⬇️ 将焦点移动到 Popover 上，此时焦点默认处于 Popover 中第一个可交互元素上，用户也可自定义焦点位置（若 Popover 内无可交互元素则表现为无响应）
- 焦点处于 Popover 内时使用 Tab 键，焦点会在 Popover 内循环，使用 Shift + Tab 会反方向移动焦点
- 键盘用户能够通过按 Esc 关闭 Popover，关闭后焦点返回到触发器上（仅当 trigger 为 click 时）

## 设计变量

::token-table{component="popover"}
::

## FAQ

- **为什么 Popover 浮层卡片的位置和浮层的触发器的相对位置不符合预期?**  
  确认触发器是完整的定位容器，并将事件和属性透传到真实根 DOM。Input 有前后缀时，可以在外层包裹 div，使定位范围包含完整控件。

- **为什么 Popover 浮层卡片在靠近屏幕边界宽度不够时，丢失宽度意外换行?**  
  在 chromium 104 后 对于屏幕边界文本宽度不够时的换行渲染策略发生变化，详细原因可查看 [issue #1022](https://github.com/DouyinFE/semi-design/issues/1022)，semi侧已经在v2.17.0版本修复了这个问题。

## React → Vue 迁移

| React                                      | Vue                                                 |
| ------------------------------------------ | --------------------------------------------------- |
| children                                   | 默认插槽中的触发器                                  |
| content ReactNode / render function        | VNodeChild prop 或 `#content="{ initialFocusRef }"` |
| initialFocusRef                            | 用 `:ref="initialFocusRef"` 绑定可聚焦 DOM 或组件   |
| visible / onVisibleChange                  | v-model:visible 或 visible + @visible-change        |
| onClickOutSide / onEscKeyDown / afterClose | @click-outside / @esc-keydown / @after-close        |
| className                                  | class，Popover 同时兼容 className                   |
| ref.focusTrigger()                         | template ref 的 focusTrigger()                      |

content 不接受 React 风格函数 prop，使用作用域插槽。Popover 继承 Tooltip 的布局、Portal 与焦点参数；额外支持 arrowStyle、arrowBounding、contentClassName。showArrow 默认 false。hover 模式的 disableFocusListener 默认 true；需要聚焦触发时显式设为 false。condition=false 仅禁用内置触发逻辑，custom 显示由 visible 决定。

浮层默认通过 Teleport 渲染到 document.body。自定义 getPopupContainer 使用本实例 template ref，容器设置 position: relative；需要限制显示区域时设置 overflow: hidden。不要在 setup 顶层查询 document 或调用静态弹窗方法。组件会清理自身的监听、焦点与定位资源，业务创建的计时器、静态句柄仍由业务在卸载时清理。
