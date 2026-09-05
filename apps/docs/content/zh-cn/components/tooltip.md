---
title: '工具提示'
description: '工具提示用于对一个元素进行标识或者附上少量辅助信息，最典型的场景是向用户解释图标的含义、展示被截断的文本、显示图片的描述等。'
locale: 'zh-CN'
slug: 'tooltip'
category: 'show'
order: 84
englishTitle: 'Tooltip'
icon: 'doc-tooltip'
upstream: 'show/tooltip'
---

## 代码演示

### 如何引入

```ts
import { Tooltip } from '@aifuxi/semi-ui-vue/tooltip';
import '@aifuxi/semi-theme-default/tooltip.css';
```

### 注意事项

Tooltip 需要将事件、ARIA 属性和焦点能力关联到触发器的真实 DOM。触发器可以是原生元素，也可以是只有一个原生根节点的 Vue 组件。自定义组件使用原生属性继承，或通过 useAttrs 与 v-bind 显式透传属性和事件；多根组件应在外层包裹 span。无需 React forwardRef 或 Class Component。

::demo-block{demo="tooltip/zh-cn/TriggerChildren" title="注意事项"}
::

### 位置

可以通过 position 配置弹出层方向以及对齐位置，position 详细可选值请参考下方 API 文档  
配置为 `top` 时 向上弹出  
配置为 `topLeft` 时，向上弹出，且弹出层与 默认插槽触发器 左对齐（当arrowPointAtCenter=false时）  
配置为 `topRight` 时，向上弹出，且弹出层与 默认插槽触发器 右对齐（当arrowPointAtCenter=false时）  
其他方向同理

::demo-block{demo="tooltip/zh-cn/Position" title="位置"}
::

### 指向元素中心

默认情况下 `arrowPointAtCenter=true`，小三角始终指向 默认插槽触发器 元素中心位置。
你可以将其设置为 false，此时小三角将不再保持指向元素中心。弹出层与 默认插槽触发器 边缘对齐

::demo-block{demo="tooltip/zh-cn/ArrowCenter" title="指向元素中心"}
::

### 触发时机

- 配置触发展示的时机，默认为 `hover`，可选 `hover`/`focus`/`click`/`custom`/ 'contextMenu'
- 设为 `custom` 时，需要配合 `visible` 属性使用，此时显示与否完全受控
- contextMenu 右键触发在 v 2.42.0 后开始提供

::demo-block{demo="tooltip/zh-cn/Trigger" title="触发时机"}
::

### condition 条件触发

当 `:condition="false"` 时，Tooltip 不响应 hover/click/focus 等触发行为（`trigger='custom'` 不受影响）。

::demo-block{demo="tooltip/zh-cn/Condition" title="condition 条件触发"}
::

### 覆盖特定样式

你可以通过 class、style 为弹出层配置特定样式，例如覆盖默认的 maxWidth （240px）

::demo-block{demo="tooltip/zh-cn/Style" title="覆盖特定样式"}
::

### 渲染至指定 DOM

传入 `getPopupContainer`，弹层将会渲染至该函数返回的 DOM 中。 这会改变浮层 DOM 树位置，但不会改变视图渲染位置。

**需要注意的是：** 返回的容器如果不是 `document.body`，**`position` 需要设为 `"relative"`**

::demo-block{demo="tooltip/zh-cn/Container" title="渲染至指定 DOM"}
::

### 搭配 Popover 或 Popconfirm 使用

Tooltip、Popconfirm、Popover 都需要劫持 默认插槽触发器 的相关事件（onMouseEnter/onMouseLeave/onClick....），用于配置 trigger。  
如果直接嵌套使用的话，会使外层 trigger 失效。  
需要在中间加一层元素（div 或 span）以防止 trigger 的事件劫持失效。

::demo-block{demo="tooltip/zh-cn/Popconfirm" title="搭配 Popover 或 Popconfirm 使用"}
::

### 仅当内容宽度超出时展示 Tooltip

Semi 为这种场景提供了 Typography 组件，可以更简单快捷地满足需求。不需要自己再对 Tooltip 的出现做条件判断，详细的使用请参考[Typography 组件文档](/zh-cn/components/typography/#%E7%9C%81%E7%95%A5%E6%96%87%E6%9C%AC)

::demo-block{demo="tooltip/zh-cn/Overflow" title="仅当内容宽度超出时展示 Tooltip"}
::

## API 参考

---

| 属性                 | 说明                                                                                                                                                             | 类型                                                                                             | 默认值              | 版本       |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------- | ---------- |
| autoAdjustOverflow   | 弹出层被遮挡时是否自动调整方向                                                                                                                                   | boolean                                                                                          | true                |            |
| arrowPointAtCenter   | “小三角”是否指向元素中心，需要同时传入"showArrow=true"                                                                                                           | boolean                                                                                          | true                |            |
| condition            | 是否允许 Tooltip 触发显示。仅当显式设置为 false 时，hover/click/focus 等触发行为不生效（trigger='custom' 场景不受影响）                                          | boolean                                                                                          | true                |            |
| content              | 弹出层内容                                                                                                                                                       | VNodeChild                                                                                       | -                   | -          |
| class                | 弹出层的样式名                                                                                                                                                   | string                                                                                           |                     |            |
| clickToHide          | 点击弹出层及内部任一元素时是否自动关闭弹层                                                                                                                       | boolean                                                                                          | false               |            |
| disableFocusListener | trigger为`hover`时，不响应键盘聚焦弹出浮层事件，详见[issue#977](https://github.com/DouyinFE/semi-design/issues/977)                                              | boolean                                                                                          | false               | **2.17.0** |
| getPopupContainer    | 指定父级 DOM，弹层将会渲染至该 DOM 中，自定义需要设置 `position: relative` 这会改变浮层 DOM 树位置，但不会改变视图渲染位置。                                     | function():HTMLElement                                                                           | () => document.body |            |
| keepDOM              | 关闭时是否保留内部组件不销毁                                                                                                                                     | boolean                                                                                          | false               | **2.31.0** |
| margin               | 计算溢出时的增加的冗余值，详见[issue#549](https://github.com/DouyinFE/semi-design/issues/549)                                                                    | number ｜ `{ marginLeft: number; marginTop: number; marginRight: number; marginBottom: number }` | 0                   | **2.23.0** |
| mouseEnterDelay      | 鼠标移入后，延迟显示的时间，单位毫秒（仅当 trigger 为 hover/focus 时生效）                                                                                       | number                                                                                           | 50                  |            |
| mouseLeaveDelay      | 鼠标移出后，延迟消失的时间，单位毫秒（仅当 trigger 为 hove/focus 时生效），不小于 mouseEnterDelay                                                                | number                                                                                           | 50                  |            |
| motion               | 是否展示弹出层动画                                                                                                                                               | boolean                                                                                          | true                |            |
| position             | 弹出层展示位置，可选值：`top`, `topLeft`, `topRight`, `left`, `leftTop`, `leftBottom`, `right`, `rightTop`, `rightBottom`, `bottom`, `bottomLeft`, `bottomRight` | string                                                                                           | 'top'               |            |
| prefixCls            | 弹出层 wrapper div 的 `class` 前缀，设置该项时，弹出层将不再带 Tooltip 的样式                                                                                    | string                                                                                           | 'semi-tooltip'      |            |
| preventScroll        | 指示浏览器是否应滚动文档以显示新聚焦的元素，作用于组件内的 focus 方法                                                                                            | boolean                                                                                          |                     |            |
| rePosKey             | 可以更新该项值手动触发弹出层的重新定位                                                                                                                           | string\|number                                                                                   |                     |            |
| style                | 弹出层的内联样式                                                                                                                                                 | object                                                                                           |                     |            |
| spacing              | 弹出层与 `默认插槽触发器` 元素的距离，单位 px（object类型自 v2.45后支持）                                                                                        | number ｜ `{ x: number; y: number }`                                                             | 8                   |            |
| showArrow            | 是否显示箭头三角形                                                                                                                                               | boolean                                                                                          | true                |            |
| stopPropagation      | 是否阻止弹层上的点击事件冒泡                                                                                                                                     | boolean                                                                                          | false               |            |
| transformFromCenter  | 是否从包裹的元素水平或垂直中心处变换，该参数仅影响动效变换的 `transform-origin`，一般无需改动                                                                    | boolean                                                                                          | true                |            |
| trigger              | 触发展示的时机，可选值：`hover` / `focus` / `click` / `custom` / `contextMenu` (v2.42后提供)                                                                     | string                                                                                           | 'hover'             |            |
| visible              | 是否展示弹出层, 需配合 trigger='custom' 使用                                                                                                                     | boolean                                                                                          |                     |            |
| wrapperClassName     | 当 默认插槽触发器 为 disabled ，或者 默认插槽触发器 为多个元素时，外层将会包裹一层 span 元素，该 api 用于设置此 span 的样式类名                                  | string                                                                                           |                     |            |
| wrapperId            | 弹出层 wrapper 节点的 id，trigger 的 aria 属性指向此 id，若不设置组件会随机生成一个 id                                                                           | string                                                                                           |                     | **2.11.0** |
| zIndex               | 弹层层级                                                                                                                                                         | number                                                                                           | 1060                |            |
| @visible-change      | 弹出层展示/隐藏时触发的回调                                                                                                                                      | function(isVisible:boolean)                                                                      |                     |            |
| @click-outside       | 当弹出层处于展示状态，点击非Children、非浮层内部区域时的回调（仅trigger为custom、click时有效）                                                                   | function(e:event)                                                                                |                     | **2.1.0**  |

## Accessibility

### ARIA

- Tooltip 具有 `tooltip` role，遵循 [WAI-ARIA](https://www.w3.org/TR/wai-aria-practices/#tooltip) 规范中对于 Tooltip 的定义
- Tooltip 的 content 与 默认插槽触发器
  - 关于 content
    - content 的 wrapper 会被自动添加 id 属性，用于与 默认插槽触发器 的 `aria-describedby` 匹配，关联 content 与 默认插槽触发器
  - 关于 默认插槽触发器
    - Tooltip 的内容（content）与其触发器（默认插槽触发器）之间应当具有显式联系。Tooltip 会自动为 默认插槽触发器 元素添加 `aria-describedby` 属性，值为 content wraper的 id
    - 若你 Tooltip的默认插槽触发器 是Icon，不包含可见文本，我们推荐你在 默认插槽触发器 上添加 `aria-label` 属性进行相应描述

```vue
<Tooltip>
  <template #content><p>Edit your setting</p></template>
  <IconSetting aria-label="Settings" />
</Tooltip>
```

## 文案规范

- 只展示信息说明和引导，不展示报错信息
- 不在 tooltip 里只能是额外的链接和按钮
- 尽量精简至一句话进行说明，不展示标点符号

## 设计变量

::token-table{component="tooltip"}
::

## FAQ

- **为什么 Tooltip content 配置很长很长的内容时，某些情况下内容会超出显示区域?**  
  在 v2.36.0 版本以前，考虑到不同语言内容（纯英文、中文、中英文混合、其他语种混合）对换行的需求不太一致，所以组件层没有做这个预设。在接收到较多使用反馈后，自 v2.36.0 版本，Tooltip 内部通过设置 <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-wrap" target="_blank" rel="noopener noreferrer">word-wrap</a> 为 break-word 处理文本换行。对于任意版本，如果默认设置不符合预期，使用方都可以通过 style/class API 设置换行相关 CSS 属性进行调整。

## React → Vue 迁移

| React                                      | Vue                                                           |
| ------------------------------------------ | ------------------------------------------------------------- |
| children                                   | 默认插槽中的触发器；自定义组件透传原生属性和事件              |
| content ReactNode / function               | VNodeChild prop 或 `#content="{ initialFocusRef }"`           |
| showArrow ReactNode                        | arrow 插槽；boolean prop 控制显示                             |
| visible / onVisibleChange                  | v-model:visible 或 visible + @visible-change                  |
| onClickOutSide / onEscKeyDown / afterClose | @click-outside / @esc-keydown / @after-close                  |
| className                                  | 原生 class                                                    |
| React ref                                  | template ref，公开 focusTrigger()、getPopupId()、rePosition() |

Tooltip 还支持 closeOnEsc=false、guardFocus=false、returnFocusOnClose=false、disableArrowKeyDown=false、wrapWhenSpecial=true 和 clickTriggerToHide。content 中的初始焦点使用 callback ref。position 类型还包括 leftTopOver、rightTopOver、leftBottomOver、rightBottomOver。spacing 可以是数值或 { x, y }；margin 可为数值或四边对象。

condition=false 不限制 trigger=custom 的显式显示。英语上游缺少「仅当内容宽度超出」章节，本页补充了中文对应示例的英文版本。Tooltip 自身不测量文字溢出；该能力由 Typography 的 ellipsis 提供。

浮层默认通过 Teleport 渲染到 document.body。自定义 getPopupContainer 使用本实例 template ref，容器设置 position: relative；需要限制显示区域时设置 overflow: hidden。不要在 setup 顶层查询 document 或调用静态弹窗方法。组件会清理自身的监听、焦点与定位资源，业务创建的计时器、静态句柄仍由业务在卸载时清理。
