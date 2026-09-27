---
title: 'Popover 气泡卡片'
description: '点击/鼠标移入元素，弹出气泡式的卡片浮层。'
type: 'show'
order: 78
icon: 'doc-popover'
---

## 使用场景

Popover 气泡卡片是由用户自主打开的临时性浮层卡片，能够承载一些额外内容和交互行为而不影响原页面。

和 Tooltip 的区别是，它可以承载更复杂的内容，而不仅仅是提示文本。

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/popover` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-show-popover-1" title="如何引入" kind="import" />

### 注意事项

Popover 会把 DOM 事件监听器合并到默认插槽的触发元素；使用自定义组件时，需要将 attrs 透传到底层 DOM 元素。

定位计算需要取得触发元素的真实 DOM 节点，因此默认插槽应提供以下类型的内容：

1. 能够透传 attrs，并最终渲染为单个 DOM 根节点的 Vue 组件
2. 原生 DOM 元素，例如 `span`、`div`、`p`
3. 特殊节点会按 `wrapWhenSpecial` 使用包装元素

<DemoBlock id="zh-CN-show-popover-2" title="注意事项" kind="live" />

### 基本使用

将触发元素放入默认插槽，并通过 `#content` 插槽提供浮层内容。
注意事项同 [Tooltip](/zh-CN/show/tooltip#%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9)

<DemoBlock id="zh-CN-show-popover-3" title="基本使用" kind="live" />

### 弹出位置

支持通过`position`设置浮层弹出方向，共支持十二个方向。

<DemoBlock id="zh-CN-show-popover-4" title="弹出位置" kind="live" />

### 受控显示

设置`trigger='custom'`，此场景下，Popover 的显示与否完全受到参数 `visible` 的控制。

<DemoBlock id="zh-CN-show-popover-5" title="受控显示" kind="live" />

### condition 条件触发

当 `:condition="false"` 时，Popover 不响应 hover/click/focus 等触发行为（`trigger='custom'` 不受影响）。

<DemoBlock id="zh-CN-show-popover-6" title="condition 条件触发" kind="live" />

### 显示小三角

通过设置`showArrow`, Popover 同样也支持展示一个小三角。

> 这种模式下浮层会拥有一个默认的样式，你可以通过传递 style 参数来覆盖掉。

<DemoBlock id="zh-CN-show-popover-7" title="显示小三角" kind="live" />

### 指向元素中心

在**显示小三角**的条件（`showArrow=true`）下，可以传入 `arrowPointAtCenter=true` 使得小三角始终指向元素中心位置。

<DemoBlock id="zh-CN-show-popover-8" title="指向元素中心" kind="live" />

### 设置浮层背景色

如果你需要定制浮层的背景色或边框颜色，请**务必单独声明 `style` 中的 `backgroundColor` 和 `borderColor` 属性**，这样能够使得“小三角”也能应用相同的背景色和边框颜色。

<DemoBlock id="zh-CN-show-popover-9" title="设置浮层背景色" kind="live" />

### 初始化弹出层焦点位置

Popover content 支持传入函数，它的入参是一个对象，将 `initialFocusRef` 绑定在可聚焦 DOM 或组件上，打开面板时会自动聚焦在该位置。

<DemoBlock id="zh-CN-show-popover-10" title="初始化弹出层焦点位置" kind="live" />

### 搭配 Tooltip 或 Popconfirm 使用

请参考[搭配使用](/zh-CN/show/tooltip#%E6%90%AD%E9%85%8D%20Popover%20%E6%88%96%20Popconfirm%20%E4%BD%BF%E7%94%A8)

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/popover/types.ts`、`packages/ui/src/tooltip/types.ts` 的公开类型为准。

- `v-model:visible` 对应 `visible` 与 `update:visible`。

#### Vue 事件

**Popover**

| 事件          | 参数                   | 说明                     |
| ------------- | ---------------------- | ------------------------ |
| visibleChange | [visible: boolean]     | 浮层显隐变化             |
| clickOutside  | [event: MouseEvent]    | 点击触发器和浮层以外区域 |
| escKeydown    | [event: KeyboardEvent] | 按下 Escape              |
| afterClose    | []                     | 关闭动画完成             |

#### Vue 插槽

**Popover**

| 插槽    | 作用域参数          | 说明     |
| ------- | ------------------- | -------- |
| default | {}                  | 触发元素 |
| content | { initialFocusRef } | 浮层内容 |

| 属性                 | 说明                                                                                                                                        | 类型                     | 默认值                 | 版本       |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ---------------------- | ---------- |
| arrowBounding        | —                                                                                                                                           | TooltipArrowBounding     | —                      |            |
| arrowPointAtCenter   | "小三角"是否指向元素中心，需要同时传入"showArrow=true"                                                                                      | boolean                  | true                   | -          |
| autoAdjustOverflow   | 是否自动调整弹出层展开方向，用于边缘遮挡时自动调整展开方向                                                                                  | boolean                  | true                   |            |
| clickToHide          | 点击弹出层及内部任一元素时是否自动关闭弹层                                                                                                  | boolean                  | false                  | -          |
| clickTriggerToHide   | —                                                                                                                                           | boolean                  | —                      |            |
| closeOnEsc           | 在 trigger 或 弹出层按 Esc 键是否关闭面板，受控时不生效                                                                                     | boolean                  | true                   | **2.8.0**  |
| condition            | 是否允许 Popover 触发显示。仅当显式设置为 false 时，hover/click/focus 等触发行为不生效（trigger='custom' 场景不受影响）                     | boolean                  | true                   |            |
| disableArrowKeyDown  | —                                                                                                                                           | boolean                  | —                      |            |
| disableFocusListener | trigger为`hover`时，不响应键盘聚焦弹出浮层事件，详见[issue#977](https://github.com/aifuxi/semi-ui-vue/issues/977)                           | boolean                  | true                   | **2.17.0** |
| getPopupContainer    | 指定父级 DOM，弹层将会渲染至该 DOM 中，自定义需要设置 `position: relative` 这会改变浮层 DOM 树位置，但不会改变视图渲染位置。                | () =&gt; HTMLElement     | () =&gt; document.body |            |
| guardFocus           | 当焦点处于弹出层内时，切换 Tab 是否让焦点在弹出层内循环                                                                                     | boolean                  | true                   | **2.8.0**  |
| keepDOM              | 关闭时是否保留内部组件不销毁                                                                                                                | boolean                  | false                  | **2.31.0** |
| margin               | 弹出层计算溢出时的增加的冗余值，详见[issue#549](https://github.com/aifuxi/semi-ui-vue/issues/549)，作用同 Tooltip margin                    | number \| TooltipMargin  | —                      | **2.25.0** |
| motion               | —                                                                                                                                           | boolean                  | —                      |            |
| mouseEnterDelay      | 鼠标移入后，延迟显示的时间，单位毫秒（仅当 trigger 为 hover/focus 时生效）                                                                  | number                   | 50                     |            |
| mouseLeaveDelay      | 鼠标移出后，延迟消失的时间，单位毫秒（仅当 trigger 为 hover/focus 时生效）                                                                  | number                   | 50                     |            |
| position             | 方向，可选值：`top`,`topLeft`,`topRight`,`left`,`leftTop`,`leftBottom`,`right`,`rightTop`,`rightBottom`,`bottom`,`bottomLeft`,`bottomRight` | TooltipPosition          | "bottom"               |            |
| preventScroll        | —                                                                                                                                           | boolean                  | —                      |            |
| rePosKey             | 可以更新该项值手动触发弹出层的重新定位                                                                                                      | string \| number         | —                      |            |
| returnFocusOnClose   | 按下 Esc 键后，焦点是否回到 trigger 上，设置 trigger 为 hover, focus, click 时生效                                                          | boolean                  | true                   | **2.8.0**  |
| spacing              | —                                                                                                                                           | number \| TooltipSpacing | —                      |            |
| stopPropagation      | 是否阻止弹出层上的点击事件冒泡                                                                                                              | boolean                  | false                  | -          |
| transformFromCenter  | —                                                                                                                                           | boolean                  | —                      |            |
| trigger              | 触发方式，可选值：`hover`, `focus`, `click`, `custom`, `contextMenu`（v2.42支持）                                                           | TooltipTrigger           | 'hover'                |            |
| visible              | 是否显示，配合trigger='custom'可实现完全受控                                                                                                | boolean                  | —                      |            |
| wrapWhenSpecial      | —                                                                                                                                           | boolean                  | —                      |            |
| wrapperClassName     | —                                                                                                                                           | HTMLAttributes['class']  | —                      |            |
| wrapperId            | —                                                                                                                                           | string                   | —                      |            |
| arrowStyle           | —                                                                                                                                           | PopoverArrowStyle        | —                      |            |
| class                | —                                                                                                                                           | HTMLAttributes['class']  | —                      |            |
| className            | 弹出层的样式名                                                                                                                              | HTMLAttributes['class']  | —                      |            |
| content              | 显示内容；需要 initialFocusRef 时使用 content 插槽                                                                                          | VNodeChild               | —                      |            |
| contentClassName     | —                                                                                                                                           | HTMLAttributes['class']  | —                      |            |
| prefixCls            | —                                                                                                                                           | string                   | —                      |            |
| showArrow            | 是否显示“小三角”                                                                                                                            | boolean                  | —                      |            |
| style                | 弹出层的内联样式                                                                                                                            | StyleValue               | —                      |            |
| zIndex               | 弹出层 z-index 值                                                                                                                           | number                   | 1030                   |            |

## Accessibility

### ARIA

- 关于 role
- 当 Popover 的 trigger 为 click、custom时，Popover的 content 具有 `dialog` role
- 当trigger为hover时，Popover的content 具有 `tooltip` role
- Popover 的 content
- content 的 wrapper 会被自动添加 `id` 属性
- Popover 的默认插槽触发元素
- 会被自动添加 [aria-expanded](https://www.w3.org/TR/wai-aria-1.1/#aria-expanded) 属性，当 Popover 可见时，属性值为 `true`，不可见时为 `false`
- 会被自动添加 [aria-haspopup](https://www.w3.org/TR/wai-aria-1.1/#aria-haspopup) 属性，为 `dialog`
- 会被自动添加 [aria-controls](https://www.w3.org/TR/wai-aria-1.1/#aria-controls) 属性，为 content 的 wrapper 的 id

### 键盘和焦点

- Popover 触发方式设置为 hover 时：鼠标悬浮或聚焦时打开 Popover
- Popover 触发方式设置为 click 时：点击触发器或聚焦时并使用 Enter 键打开 Popover
- Popover 激活后，按下方向键 ⬇️ 将焦点移动到 Popover 上，此时焦点默认处于 Popover 中第一个可交互元素上，用户也可自定义焦点位置（若 Popover 内无可交互元素则表现为无响应）
- 焦点处于 Popover 内时使用 Tab 键，焦点会在 Popover 内循环，使用 Shift + Tab 会反方向移动焦点
- 键盘用户能够通过按 Esc 关闭 Popover，关闭后焦点返回到触发器上（仅当 trigger 为 click 时）

## FAQ

- **为什么 Popover 浮层卡片的位置和浮层的触发器的相对位置不符合预期?**
  Popover 底层依赖 Tooltip 定位，需要取得默认插槽触发元素的真实 DOM 节点：

1.  能够透传 attrs，并最终渲染为单个 DOM 根节点的 Vue 组件
2.  原生 DOM 元素，例如 `span`、`div`、`p`
3.  特殊节点会按 `wrapWhenSpecial` 使用包装元素

若触发元素根节点的宽高并未覆盖全部可见内容，则位置可能有出入。例如设置了 prefix、suffix 的 Input，Popover位置仍是相对于不包含前缀部分的 input 框进行定位，此时只要在 Input 外层再套一个 div 就能解决问题。

- **为什么 Popover 浮层卡片在靠近屏幕边界宽度不够时，丢失宽度意外换行?**
  在 chromium 104 后 对于屏幕边界文本宽度不够时的换行渲染策略发生变化，详细原因可查看 [issue #1022](https://github.com/aifuxi/semi-ui-vue/issues/1022)，semi侧已经在v2.17.0版本修复了这个问题。
