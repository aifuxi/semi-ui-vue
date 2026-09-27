---
title: 'Popconfirm 气泡确认框'
description: '目标元素的操作需要用户进一步的确认时使用。与 Popover 相比它内置了一系列可配置的操作按钮，与 Modal 相比它不强制全屏居中显示，交互也更轻量'
type: 'feedback'
order: 90
icon: 'doc-popconfirm'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/popconfirm` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-feedback-popconfirm-1" title="如何引入" kind="import" />

### 基本使用

Popconfirm 底层基于 Tooltip 封装，默认插槽触发元素的支持类型同 Tooltip，注意事项详情可查阅 [Tooltip注意事项](/zh-CN/show/tooltip#%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9)

<DemoBlock id="zh-CN-feedback-popconfirm-2" title="基本使用" kind="live" />

### 类型搭配

开发者可以基于场景使用 `okType`/`cancelType`/`icon` 等参数搭配出不同风格的气泡式确认框。

<DemoBlock id="zh-CN-feedback-popconfirm-3" title="类型搭配" kind="live" />

### 延时关闭

`confirm`、`cancel` 事件监听器可以返回 Promise，实现点击后延时关闭（v2.19 后支持）。
事件触发后对应按钮会自动进入 loading；Promise resolve 后关闭气泡确认框，reject 时保持打开并结束 loading。

<DemoBlock id="zh-CN-feedback-popconfirm-4" title="延时关闭" kind="live" />

### 初始化弹出层焦点位置

okButtonProps 和 cancelButtonProps 支持传入 `autoFocus` 参数，传入后打开面板时会自动聚焦在该位置。2.30.0 版本支持。

content 支持传入函数，它的入参是一个对象，将 `initialFocusRef` 绑定在可聚焦 DOM 或组件上，打开面板时会自动聚焦在该位置。2.30.0 版本支持。

<DemoBlock id="zh-CN-feedback-popconfirm-5" title="初始化弹出层焦点位置" kind="live" />

### 搭配 Tooltip 或 Popover 使用

请参考[搭配使用](/zh-CN/show/tooltip#%E6%90%AD%E9%85%8D%20Popover%20%E6%88%96%20Popconfirm%20%E4%BD%BF%E7%94%A8)

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/popconfirm/types.ts`、`packages/ui/src/popover/types.ts`、`packages/ui/src/tooltip/types.ts` 的公开类型为准。

- `v-model:visible` 对应 `visible` 与 `update:visible`。

#### Vue 用法

- 未重写的浮层属性继承自 Popover / Tooltip；Portal 容器由 `getPopupContainer` 指定。
- `confirm` 与 `cancel` 监听器可返回 Promise；pending 时按钮进入 loading，resolve 后关闭，reject 时保持打开。
- `cancelButtonProps`、`okButtonProps` 中的 `onClick` 是嵌套 callback prop。
- `content`、`icon`、`title` 保留 VNode prop 入口；同名插槽优先。

#### Vue 事件

**Popconfirm**

| 事件           | 参数                   | 说明                                 |
| -------------- | ---------------------- | ------------------------------------ |
| confirm        | [event: MouseEvent]    | 点击确认；监听器可返回 Promise       |
| cancel         | [event: MouseEvent]    | 点击取消或关闭；监听器可返回 Promise |
| clickOutside   | [event: MouseEvent]    | 点击触发元素和浮层以外区域           |
| escKeydown     | [event: KeyboardEvent] | 按下 Escape                          |
| visibleChange  | [visible: boolean]     | 浮层显隐变化                         |
| update:visible | [visible: boolean]     | 更新 v-model:visible                 |

#### Vue 插槽

**Popconfirm**

| 插槽    | 作用域参数          | 说明       |
| ------- | ------------------- | ---------- |
| default | {}                  | 触发元素   |
| content | { initialFocusRef } | 确认框内容 |
| icon    | {}                  | 提示图标   |
| title   | {}                  | 确认框标题 |

| 属性                 | 说明                                                                                                                                         | 类型                     | 默认值                               | 版本      |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ------------------------------------ | --------- |
| arrowBounding        | —                                                                                                                                            | TooltipArrowBounding     | —                                    |           |
| arrowPointAtCenter   | “小三角”是否指向元素中心，需要同时传入"showArrow=true"                                                                                       | boolean                  | false                                |           |
| autoAdjustOverflow   | —                                                                                                                                            | boolean                  | —                                    |           |
| clickToHide          | —                                                                                                                                            | boolean                  | —                                    |           |
| clickTriggerToHide   | —                                                                                                                                            | boolean                  | —                                    |           |
| closeOnEsc           | 在 trigger 聚焦时或在弹出层内聚焦元素上按 Esc 键是否关闭面板，受控时不生效                                                                   | boolean                  | true                                 | **2.8.0** |
| condition            | —                                                                                                                                            | boolean                  | —                                    |           |
| disableArrowKeyDown  | —                                                                                                                                            | boolean                  | —                                    |           |
| disableFocusListener | —                                                                                                                                            | boolean                  | —                                    |           |
| getPopupContainer    | 指定父级 DOM，弹层将会渲染至该 DOM 中，自定义时容器需要设置 `position: relative` 这会改变浮层 DOM 树位置，但不会改变视图渲染位置。           | () =&gt; HTMLElement     | () =&gt; document.body               |           |
| guardFocus           | 当焦点处于弹出层内时，切换 Tab 是否让焦点在弹出层内循环                                                                                      | boolean                  | true                                 | **2.8.0** |
| keepDOM              | —                                                                                                                                            | boolean                  | —                                    |           |
| margin               | —                                                                                                                                            | number \| TooltipMargin  | —                                    |           |
| motion               | 下拉列表出现/隐藏时，是否有动画                                                                                                              | boolean                  | true                                 |           |
| mouseEnterDelay      | —                                                                                                                                            | number                   | —                                    |           |
| mouseLeaveDelay      | —                                                                                                                                            | number                   | —                                    |           |
| preventScroll        | —                                                                                                                                            | boolean                  | —                                    |           |
| rePosKey             | —                                                                                                                                            | string \| number         | —                                    |           |
| returnFocusOnClose   | 按下 Esc 键后，焦点是否回到 trigger 上，只有设置 trigger 为 click 时生效                                                                     | boolean                  | true                                 | **2.8.0** |
| spacing              | —                                                                                                                                            | number \| TooltipSpacing | —                                    |           |
| stopPropagation      | 是否阻止弹层上的点击事件冒泡                                                                                                                 | boolean                  | true                                 |           |
| transformFromCenter  | —                                                                                                                                            | boolean                  | —                                    |           |
| visible              | `v-model:visible` 绑定值                                                                                                                     | boolean                  | false                                |           |
| wrapWhenSpecial      | —                                                                                                                                            | boolean                  | —                                    |           |
| wrapperClassName     | —                                                                                                                                            | HTMLAttributes['class']  | —                                    |           |
| wrapperId            | —                                                                                                                                            | string                   | —                                    |           |
| arrowStyle           | —                                                                                                                                            | PopoverArrowStyle        | —                                    |           |
| contentClassName     | —                                                                                                                                            | HTMLAttributes['class']  | —                                    |           |
| showArrow            | 是否显示箭头三角形                                                                                                                           | boolean                  | false                                |           |
| cancelButtonProps    | 取消按钮配置；autoFocus 与嵌套 onClick callback 可用                                                                                         | PopconfirmButtonProps    | —                                    |           |
| cancelText           | 取消按钮文字                                                                                                                                 | string                   | "取消"                               |           |
| cancelType           | 取消按钮类型                                                                                                                                 | ButtonType               | `tertiary`                           |           |
| class                | Vue 原生类名                                                                                                                                 | HTMLAttributes['class']  | —                                    |           |
| className            | 样式类名                                                                                                                                     | HTMLAttributes['class']  | —                                    |           |
| content              | 内容 VNode；content 作用域插槽优先                                                                                                           | VNodeChild               | —                                    |           |
| defaultVisible       | 气泡框默认是否展示                                                                                                                           | boolean                  | false                                |           |
| disabled             | 点击 Popconfirm 子元素是否弹出气泡确认框                                                                                                     | boolean                  | false                                |           |
| icon                 | 图标 VNode；icon 插槽优先                                                                                                                    | VNodeChild               | —                                    |           |
| okButtonProps        | 确认按钮配置；autoFocus 与嵌套 onClick callback 可用                                                                                         | PopconfirmButtonProps    | —                                    |           |
| okText               | 确认按钮文字                                                                                                                                 | string                   | "确认"                               |           |
| okType               | 确认按钮类型                                                                                                                                 | ButtonType               | `primary`                            |           |
| position             | 方向，可选值：`top`,`topLeft`,`topRight`,`left`,`leftTop`,`leftBottom`, `right`,`rightTop`,`rightBottom`,`bottom`,`bottomLeft`,`bottomRight` | PopoverProps['position'] | `bottomLeft`（RTL 为 `bottomRight`） |           |
| prefixCls            | —                                                                                                                                            | string                   | —                                    |           |
| showCloseIcon        | —                                                                                                                                            | boolean                  | true                                 |           |
| style                | —                                                                                                                                            | StyleValue               | —                                    |           |
| title                | 标题 VNode；title 插槽优先                                                                                                                   | VNodeChild               | —                                    |           |
| trigger              | 触发展示的时机，可选值：hover / focus / click / custom                                                                                       | PopoverProps['trigger']  | `click`（受控时为 `custom`）         |           |
| zIndex               | 浮层 z-index 值                                                                                                                              | number                   | 1030                                 |           |

## Accessibility

### ARIA

语义化请参考 [Popover](/zh-CN/show/popover#ARIA)

### 键盘和焦点

- Popconfirm 必须带有触发器，触发器可被聚焦，使用 Enter 键打开 Popconfirm
- Popconfirm 激活后，按下方向键 ⬇️ 将焦点移动到 Popconfirm 上。Popconfirm 的初始焦点应当遵循以下几个原则：
- 如果 Popconfirm 内包含一个不可逆转过程的最后一个步骤，比如：删除数据等，那么这个初始焦点最好放在破坏性最小的可交互元素上，如：关闭按钮 ( 通过向对象 cancelButtonProps 中传入 autoFocus 实现）
- 如果 Popconfirm 内仅为阅读文本，那么建议将初始焦点设置在最可能常用的交互元素上，如：确定按钮 ( 通过向对象 okButtonProps 中传入 autoFocus 实现）
- 键盘用户能够通过按 Esc 关闭 Popconfirm，并且焦点应该返回到触发器上。用户通过 Popconfirm 内的交互元素关闭该 Pop 后，焦点也应当返回到触发器上（仅当 trigger 为 click 时）
- 打开的情况下，用户点击 Popconfirm 内的空白处 Esc 后，焦点也会回到触发器上 （仅当 trigger 为 click 时）

## FAQ

- **为什么 Popconfirm 浮层在靠近屏幕边界宽度不够时，丢失宽度意外换行?**
  在 chromium 104 后 对于屏幕边界文本宽度不够时的换行渲染策略发生变化，详细原因可查看 [issue #1022](https://github.com/aifuxi/semi-ui-vue/issues/1022)，semi侧已经在v2.17.0版本修复了这个问题。
