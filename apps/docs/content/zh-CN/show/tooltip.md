---
title: 'Tooltip 工具提示'
description: '工具提示用于对一个元素进行标识或者附上少量辅助信息，最典型的场景是向用户解释图标的含义、展示被截断的文本、显示图片的描述等。'
type: 'show'
order: 84
icon: 'doc-tooltip'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/tooltip` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-show-tooltip-1" title="如何引入" kind="import" />

### 注意事项

Tooltip 会把 DOM 事件监听器合并到默认插槽的触发元素；使用自定义组件时，需要将 attrs 透传到底层 DOM 元素。

定位计算需要取得触发元素的真实 DOM 节点，因此默认插槽应提供以下类型的内容：

1. 能够透传 attrs，并最终渲染为单个 DOM 根节点的 Vue 组件
2. 原生 DOM 元素，例如 `span`、`div`、`p`
3. 多个根节点或特殊节点会按 `wrapWhenSpecial` 的设置使用包装元素。

<DemoBlock id="zh-CN-show-tooltip-2" title="注意事项" kind="live" />

### 位置

可以通过 position 配置弹出层方向以及对齐位置，position 详细可选值请参考下方 API 文档
配置为 `top` 时 向上弹出
配置为 `topLeft` 时，向上弹出，且弹出层与 触发元素 左对齐（当arrowPointAtCenter=false时）
配置为 `topRight` 时，向上弹出，且弹出层与 触发元素 右对齐（当arrowPointAtCenter=false时）
其他方向同理

<DemoBlock id="zh-CN-show-tooltip-3" title="位置" kind="live" />

### 指向元素中心

默认情况下 `arrowPointAtCenter=true`，小三角始终指向 触发元素 元素中心位置。
你可以将其设置为 false，此时小三角将不再保持指向元素中心。弹出层与 触发元素 边缘对齐

<DemoBlock id="zh-CN-show-tooltip-4" title="指向元素中心" kind="live" />

### 触发时机

- 配置触发展示的时机，默认为 `hover`，可选 `hover`/`focus`/`click`/`custom`/ 'contextMenu'
- 设为 `custom` 时，需要配合 `visible` 属性使用，此时显示与否完全受控
- contextMenu 右键触发在 v 2.42.0 后开始提供

<DemoBlock id="zh-CN-show-tooltip-5" title="触发时机" kind="live" />

### condition 条件触发

当 `condition={false}` 时，Tooltip 不响应 hover/click/focus 等触发行为（`trigger='custom'` 不受影响）。

<DemoBlock id="zh-CN-show-tooltip-6" title="condition 条件触发" kind="live" />

### 覆盖特定样式

你可以通过 className、style 为弹出层配置特定样式，例如覆盖默认的 maxWidth （240px）

<DemoBlock id="zh-CN-show-tooltip-7" title="覆盖特定样式" kind="live" />

### 渲染至指定 DOM

传入 `getPopupContainer`，弹层将会渲染至该函数返回的 DOM 中。 这会改变浮层 DOM 树位置，但不会改变视图渲染位置。

**需要注意的是：** 返回的容器如果不是 `document.body`，**`position` 需要设为 `"relative"`**

<DemoBlock id="zh-CN-show-tooltip-8" title="渲染至指定 DOM" kind="live" />

### 搭配 Popover 或 Popconfirm 使用

Tooltip、Popconfirm、Popover 会在默认插槽的触发元素上合并鼠标或点击监听器，用于实现 `trigger`；触发元素需要能够接收并透传 DOM 事件。
如果直接嵌套使用的话，会使外层 trigger 失效。
需要在中间加一层元素（div 或 span）以防止 trigger 的事件劫持失效。

<DemoBlock id="zh-CN-show-tooltip-9" title="搭配 Popover 或 Popconfirm 使用" kind="live" />

### 仅当内容宽度超出时展示 Tooltip

Semi 为这种场景提供了 Typography 组件，可以更简单快捷地满足需求。不需要自己再对 Tooltip 的出现做条件判断，详细的使用请参考[Typography 组件文档](/zh-CN/basic/typography#%E7%9C%81%E7%95%A5%E6%96%87%E6%9C%AC)

<DemoBlock id="zh-CN-show-tooltip-10" title="仅当内容宽度超出时展示 Tooltip" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/tooltip/types.ts` 的公开类型为准。

- `v-model:visible` 对应 `visible` 与 `update:visible`。

#### Vue 事件

**Tooltip**

| 事件          | 参数                   | 说明                     |
| ------------- | ---------------------- | ------------------------ |
| visibleChange | [visible: boolean]     | 显隐状态变化             |
| clickOutside  | [event: MouseEvent]    | 点击触发器和浮层以外区域 |
| afterClose    | []                     | 关闭动画完成             |
| escKeydown    | [event: KeyboardEvent] | 按下 Escape              |

#### Vue 插槽

**Tooltip**

| 插槽    | 作用域参数          | 说明       |
| ------- | ------------------- | ---------- |
| default | {}                  | 触发元素   |
| content | { initialFocusRef } | 浮层内容   |
| arrow   | {}                  | 自定义箭头 |

---

| 属性                 | 说明                                                                                                                                                             | 类型                     | 默认值                 | 版本       |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ---------------------- | ---------- |
| arrowBounding        | —                                                                                                                                                                | TooltipArrowBounding     | —                      |            |
| arrowPointAtCenter   | “小三角”是否指向元素中心，需要同时传入"showArrow=true"                                                                                                           | boolean                  | true                   |            |
| autoAdjustOverflow   | 弹出层被遮挡时是否自动调整方向                                                                                                                                   | boolean                  | true                   |            |
| class                | —                                                                                                                                                                | HTMLAttributes['class']  | —                      |            |
| clickToHide          | 点击弹出层及内部任一元素时是否自动关闭弹层                                                                                                                       | boolean                  | false                  |            |
| clickTriggerToHide   | —                                                                                                                                                                | boolean                  | —                      |            |
| closeOnEsc           | —                                                                                                                                                                | boolean                  | —                      |            |
| condition            | 是否允许 Tooltip 触发显示。仅当显式设置为 false 时，hover/click/focus 等触发行为不生效（trigger='custom' 场景不受影响）                                          | boolean                  | true                   |            |
| content              | 弹出层内容                                                                                                                                                       | VNodeChild               | —                      |            |
| disableArrowKeyDown  | —                                                                                                                                                                | boolean                  | —                      |            |
| disableFocusListener | trigger为`hover`时，不响应键盘聚焦弹出浮层事件，详见[issue#977](https://github.com/aifuxi/semi-ui-vue/issues/977)                                                | boolean                  | false                  | **2.17.0** |
| getPopupContainer    | 指定父级 DOM，弹层将会渲染至该 DOM 中，自定义需要设置 `position: relative` 这会改变浮层 DOM 树位置，但不会改变视图渲染位置。                                     | () =&gt; HTMLElement     | () =&gt; document.body |            |
| guardFocus           | —                                                                                                                                                                | boolean                  | —                      |            |
| keepDOM              | 关闭时是否保留内部组件不销毁                                                                                                                                     | boolean                  | false                  | **2.31.0** |
| margin               | —                                                                                                                                                                | number \| TooltipMargin  | —                      |            |
| motion               | 是否展示弹出层动画                                                                                                                                               | boolean                  | true                   |            |
| mouseEnterDelay      | 鼠标移入后，延迟显示的时间，单位毫秒（仅当 trigger 为 hover/focus 时生效）                                                                                       | number                   | 50                     |            |
| mouseLeaveDelay      | 鼠标移出后，延迟消失的时间，单位毫秒（仅当 trigger 为 hove/focus 时生效），不小于 mouseEnterDelay                                                                | number                   | 50                     |            |
| position             | 弹出层展示位置，可选值：`top`, `topLeft`, `topRight`, `left`, `leftTop`, `leftBottom`, `right`, `rightTop`, `rightBottom`, `bottom`, `bottomLeft`, `bottomRight` | TooltipPosition          | 'top'                  |            |
| prefixCls            | 弹出层 wrapper div 的 `className` 前缀，设置该项时，弹出层将不再带 Tooltip 的样式                                                                                | string                   | 'semi-tooltip'         |            |
| preventScroll        | 指示浏览器是否应滚动文档以显示新聚焦的元素，作用于组件内的 focus 方法                                                                                            | boolean                  | —                      |            |
| rePosKey             | 可以更新该项值手动触发弹出层的重新定位                                                                                                                           | string \| number         | —                      |            |
| returnFocusOnClose   | —                                                                                                                                                                | boolean                  | —                      |            |
| role                 | —                                                                                                                                                                | string                   | —                      |            |
| showArrow            | 是否显示箭头三角形                                                                                                                                               | boolean \| VNodeChild    | true                   |            |
| spacing              | —                                                                                                                                                                | number \| TooltipSpacing | —                      |            |
| stopPropagation      | 是否阻止弹层上的点击事件冒泡                                                                                                                                     | boolean                  | false                  |            |
| style                | 弹出层的内联样式                                                                                                                                                 | StyleValue               | —                      |            |
| transformFromCenter  | 是否从包裹的元素水平或垂直中心处变换，该参数仅影响动效变换的 `transform-origin`，一般无需改动                                                                    | boolean                  | true                   |            |
| trigger              | 触发展示的时机，可选值：`hover` / `focus` / `click` / `custom` / `contextMenu` (v2.42后提供)                                                                     | TooltipTrigger           | 'hover'                |            |
| visible              | 是否展示弹出层, 需配合 trigger='custom' 使用                                                                                                                     | boolean                  | —                      |            |
| wrapWhenSpecial      | —                                                                                                                                                                | boolean                  | —                      |            |
| wrapperClassName     | 当 触发元素 为 disabled，或者 触发元素 为多个元素时，外层将会包裹一层 span 元素，该 api 用于设置此 span 的样式类名                                               | HTMLAttributes['class']  | —                      |            |
| wrapperId            | 弹出层 wrapper 节点的 id，trigger 的 aria 属性指向此 id，若不设置组件会随机生成一个 id                                                                           | string                   | —                      | **2.11.0** |
| zIndex               | 弹层层级                                                                                                                                                         | number                   | 1060                   |            |

## Accessibility

### ARIA

- Tooltip 具有 `tooltip` role，遵循 [WAI-ARIA](https://www.w3.org/TR/wai-aria-practices/#tooltip) 规范中对于 Tooltip 的定义
- Tooltip 的 content 与 触发元素
- 关于 content
- content 的 wrapper 会被自动添加 id 属性，用于与 触发元素 的 `aria-describedby` 匹配，关联 content 与 触发元素
- 关于 触发元素
- Tooltip 的内容（content）与其触发器（触发元素）之间应当具有显式联系。Tooltip 会自动为 触发元素 元素添加 `aria-describedby` 属性，值为 content wraper的 id
- 若你 Tooltip的触发元素 是Icon，不包含可见文本，我们推荐你在 触发元素 上添加 `aria-label` 属性进行相应描述

<DemoBlock id="zh-CN-show-tooltip-11" title="ARIA" kind="code" />

## 文案规范

- 只展示信息说明和引导，不展示报错信息
- 不在 tooltip 里只能是额外的链接和按钮
- 尽量精简至一句话进行说明，不展示标点符号

## FAQ

- **为什么 Tooltip content 配置很长很长的内容时，某些情况下内容会超出显示区域?**
  在 v2.36.0 版本以前，考虑到不同语言内容（纯英文、中文、中英文混合、其他语种混合）对换行的需求不太一致，所以组件层没有做这个预设。在接收到较多使用反馈后，自 v2.36.0 版本，Tooltip 内部通过设置 word-wrap 为 break-word 处理文本换行。对于任意版本，如果默认设置不符合预期，使用方都可以通过 style/className API 设置换行相关 CSS 属性进行调整。
