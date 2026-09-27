---
title: 'Dropdown 下拉框'
description: '向下弹出的菜单。'
type: 'show'
order: 70
icon: 'doc-dropdown'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/dropdown` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-show-dropdown-1" title="如何引入" kind="import" />

### 基本用法

- Dropdown 的默认插槽是触发元素：默认 hover 展示，可通过 `trigger` 改为 `click`、`custom`、`contextMenu` 等触发方式。
- 通过 render 指定下拉框的具体内容：使用 `Dropdown.Menu` 作为父容器，组合使用 `Dropdown.Item`、`Dropdown.Divider`、`Dropdown.Title`。
  当然简单场景你也可以仅搭配 `Dropdown.Menu` 与 `Dropdown.Item`，其他元素不是必须的。
- `Dropdown.Item` 通过设置 `disabled` 可以禁用某个选项，配置 `type`，可以展示不同颜色的文本，上设置 `icon` 可以快速配置图标。更复杂的结构可以通过默认插槽自定义渲染。

<DemoBlock id="zh-CN-show-dropdown-2" title="基本用法" kind="live" />

### 嵌套使用

用户可以对 `Dropdown` 进行嵌套使用，此类情况适合具有多个子级选项的情况。

<DemoBlock id="zh-CN-show-dropdown-3" title="嵌套使用" kind="live" />

### 弹出位置

支持的位置同 [Tooltip](/zh-CN/show/tooltip#%E4%BD%8D%E7%BD%AE)，常用的是："bottom", "bottomLeft", "bottomRight" 这三种。

<DemoBlock id="zh-CN-show-dropdown-4" title="弹出位置" kind="live" />

### 触发方式

默认是移入触发，可通过获取焦点(focus)，点击(click)或自定义事件触发菜单展开。
contextMenu 方式在 v2.42 后提供

<DemoBlock id="zh-CN-show-dropdown-5" title="触发方式" kind="live" />

### 触发事件

菜单项支持 `click`、`mouseenter`、`mouseleave` 与 `contextmenu` 事件。

<DemoBlock id="zh-CN-show-dropdown-6" title="触发事件" kind="live" />

### JSON 配置用法

可以通过 menu 属性，传入 JSON Array 快速配置出下拉框菜单

<DemoBlock id="zh-CN-show-dropdown-7" title="JSON 配置用法" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/dropdown/types.ts`、`packages/ui/src/tooltip/types.ts` 的公开类型为准。

- `v-model:visible` 对应 `visible` 与 `update:visible`。

#### Vue 事件

**Dropdown**

| 事件          | 参数                   | 说明                     |
| ------------- | ---------------------- | ------------------------ |
| visibleChange | [visible: boolean]     | 浮层显隐变化             |
| clickOutside  | [event: MouseEvent]    | 点击触发器和浮层以外区域 |
| escKeydown    | [event: KeyboardEvent] | 按下 Escape              |
| afterClose    | []                     | 关闭动画完成             |

**Dropdown.Item**

| 事件                    | 参数                   | 说明                 |
| ----------------------- | ---------------------- | -------------------- |
| click / contextmenu     | [event: MouseEvent]    | 点击或右键点击菜单项 |
| mouseenter / mouseleave | [event: MouseEvent]    | 指针进入或离开菜单项 |
| keydown                 | [event: KeyboardEvent] | 菜单项键盘事件       |

#### Vue 插槽

**Dropdown**

| 插槽    | 作用域参数 | 说明     |
| ------- | ---------- | -------- |
| default | {}         | 触发元素 |
| content | {}         | 下拉内容 |

**Dropdown.Menu / Title**

| 插槽    | 作用域参数 | 说明             |
| ------- | ---------- | ---------------- |
| default | {}         | 菜单项或标题内容 |

**Dropdown.Item**

| 插槽    | 作用域参数 | 说明       |
| ------- | ---------- | ---------- |
| default | {}         | 菜单项内容 |
| icon    | {}         | 菜单项图标 |

### Dropdown

| 属性                 | 说明                                                                                                                         | 类型                                | 默认值                 | 版本       |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ---------------------- | ---------- |
| arrowBounding        | —                                                                                                                            | TooltipArrowBounding                | —                      |            |
| arrowPointAtCenter   | —                                                                                                                            | boolean                             | —                      |            |
| autoAdjustOverflow   | 弹出层被遮挡时是否自动调整方向                                                                                               | boolean                             | true                   |            |
| clickToHide          | 在弹出层内点击时是否自动关闭弹出层                                                                                           | boolean                             | —                      |            |
| clickTriggerToHide   | —                                                                                                                            | boolean                             | —                      |            |
| closeOnEsc           | 在 trigger 或 弹出层按 Esc 键是否关闭面板，受控时不生效                                                                      | boolean                             | true ｜ **2.13.0**     |            |
| condition            | —                                                                                                                            | boolean                             | —                      |            |
| disableArrowKeyDown  | —                                                                                                                            | boolean                             | —                      |            |
| disableFocusListener | trigger为`hover`时，不响应键盘聚焦弹出浮层事件，详见[issue#977](https://github.com/aifuxi/semi-ui-vue/issues/977)            | boolean                             | false                  | **2.17.0** |
| getPopupContainer    | 指定父级 DOM，弹层将会渲染至该 DOM 中，自定义需要设置 `position: relative` 这会改变浮层 DOM 树位置，但不会改变视图渲染位置。 | () =&gt; HTMLElement                | () =&gt; document.body |            |
| guardFocus           | —                                                                                                                            | boolean                             | —                      |            |
| keepDOM              | 关闭时是否保留内部组件 DOM 不销毁                                                                                            | boolean                             | false                  | **2.31.0** |
| margin               | 弹出层计算溢出时的增加的冗余值，详见[issue#549](https://github.com/aifuxi/semi-ui-vue/issues/549)，作用同 Tooltip margin     | number \| TooltipMargin             | —                      | **2.25.0** |
| motion               | —                                                                                                                            | boolean                             | —                      |            |
| mouseEnterDelay      | 鼠标移入 Trigger 后，延迟显示的时间，单位毫秒（仅当 trigger 为 hover/focus 时生效）                                          | number                              | 50                     |            |
| preventScroll        | —                                                                                                                            | boolean                             | —                      |            |
| rePosKey             | 可以更新该项值手动触发弹出层的重新定位                                                                                       | string \| number                    | —                      |            |
| stopPropagation      | 是否阻止弹出层上的点击事件冒泡                                                                                               | boolean                             | false                  |            |
| transformFromCenter  | —                                                                                                                            | boolean                             | —                      |            |
| wrapWhenSpecial      | —                                                                                                                            | boolean                             | —                      |            |
| wrapperId            | —                                                                                                                            | string                              | —                      |            |
| zIndex               | 弹出层 z-index 值                                                                                                            | number                              | 1050                   |            |
| class                | —                                                                                                                            | HTMLAttributes['class']             | —                      |            |
| contentClassName     | 下拉菜单根元素类名                                                                                                           | HTMLAttributes['class']             | —                      |            |
| menu                 | 通过传入 JSON Array 来快速配置 Dropdown 内容                                                                                 | readonly DropdownMenuItem[]         | []                     |            |
| mouseLeaveDelay      | 鼠标移出弹出层后，延迟消失的时间，单位毫秒（仅当 trigger 为 hover/focus 时生效）                                             | number                              | 50                     |            |
| position             | 弹出菜单的位置，常用："bottom", "bottomLeft", "bottomRight"，更多详见[Tooltip 位置](/zh-CN/show/tooltip#%E4%BD%8D%E7%BD%AE)  | TooltipPosition                     | "bottom"               |            |
| prefixCls            | —                                                                                                                            | string                              | —                      |            |
| render               | 弹出层的内容，由 `Dropdown.Menu` 及 `Dropdown.Item`、`Dropdown.Title` 构成                                                   | VNodeChild \| (() =&gt; VNodeChild) | —                      |            |
| returnFocusOnClose   | —                                                                                                                            | boolean                             | —                      |            |
| role                 | —                                                                                                                            | string                              | —                      |            |
| showArrow            | —                                                                                                                            | boolean \| VNodeChild               | —                      |            |
| showTick             | 是否自动在 active 的 Dropdown.Item 项左侧展示表示选中的勾                                                                    | boolean                             | false                  |            |
| spacing              | 弹出层与 触发元素（即默认插槽内容）的距离，单位 px                                                                           | number \| TooltipSpacing            | 4                      |            |
| style                | 弹出层内联样式                                                                                                               | StyleValue                          | —                      |            |
| trigger              | 触发下拉的行为，可选 "hover", "focus", "click", "custom", "contextMenu"(v2.42 后提供)                                        | TooltipTrigger                      | "hover"                |            |
| visible              | 是否显示菜单，需配合 trigger custom 使用                                                                                     | boolean                             | 无                     |            |

### Dropdown.Menu

| 属性  | 说明             | 类型                    | 默认值 | 版本 |
| ----- | ---------------- | ----------------------- | ------ | ---- |
| class | —                | HTMLAttributes['class'] | —      |      |
| style | 下拉弹层菜单样式 | StyleValue              | —      |      |

### Dropdown.Item

| 属性       | 说明                                                                                                                                                | 类型                                        | 默认值     | 版本 |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ---------- | ---- |
| active     | 当前项是否处于激活态，激活态时左侧有 √，字体加粗，颜色加深。当 Dropdown 的 showTick 为 false 时，即使 Dropdown.Item 的 active 为 true，√ 也不会展示 | boolean                                     | false      |      |
| class      | —                                                                                                                                                   | HTMLAttributes['class']                     | —          |      |
| disabled   | 是否禁用菜单                                                                                                                                        | boolean                                     | false      |      |
| forwardRef | —                                                                                                                                                   | (element: HTMLLIElement \| null) =&gt; void | —          |      |
| hover      | —                                                                                                                                                   | boolean                                     | —          |      |
| icon       | 图标                                                                                                                                                | VNodeChild \| (() =&gt; VNodeChild)         | —          |      |
| showTick   | —                                                                                                                                                   | boolean                                     | —          |      |
| style      | 内联样式                                                                                                                                            | StyleValue                                  | —          |      |
| type       | 类型，可选值："primary"、"secondary"、"tertiary"、"warning"、"danger"                                                                               | DropdownItemType                            | "tertiary" |      |

### Dropdown.Title

| 属性  | 说明     | 类型                    | 默认值 |
| ----- | -------- | ----------------------- | ------ |
| class | —        | HTMLAttributes['class'] | —      |
| style | 内联样式 | StyleValue              | {}     |

### DropdownMenuItem

| 属性                                     | 说明                                       | 类型   | 默认值 |
| ---------------------------------------- | ------------------------------------------ | ------ | ------ |
| node                                     | 按钮类型，可选：`title`，`item`，`divider` | string |        |
| name                                     | 菜单文本，标题或 Item 的内容               | string |        |
| 其他属性与 Title、Item、Divider 属性对应 |                                            |        |        |

## Accessibility

### ARIA

- Dropdown.Menu `role` 设置为 `menu`，`aria-orientatio` 设置为 `vertical`
- Dropdown.Item `role` 设置为 `menuitem`
- ### 键盘和焦点
- Dropdown 的触发器可被聚焦，目前支持 3 种触发方式：
- 触发方式设置为 hover 或 focus 时：鼠标悬浮或聚焦时打开 Dropdown，Dropdown 打开后，用户可以使用 `下箭头` 将焦点移动到 Dropdown 内
- 触发方式设置为 click 时：点击触发器或聚焦时使用 `Enter` 或 `Space` 键可以打开 Dropdown，此时焦点自动聚焦到 Dropdown 中的第一个非禁用项上
- 当焦点位于 Dropdown 内的菜单项上时：
- 键盘用户可以使用键盘 `上箭头` 或 `下箭头` 切换可交互元素
- 使用 `Enter` 键 或 `Space` 键可以激活聚焦的菜单项, 若菜单项监听了 `click`，事件会被触发
- 键盘用户可以通过按 `Esc` 关闭 Dropdown，关闭后焦点返回到触发器上
- 键盘交互暂未完整支持嵌套场景

## 文案规范

- 下拉框内选项内容需要表述准确且包含信息，使用户在浏览时更加容易在选项中选择
- 使用语句式的大小写，并且简洁明了地书写选项
- 如果是动作选项，使用动词或者动词短语来描述用户选择该选项后会发生的动作。举个例子，"Move", "Log time", or "Hide labels"
- 不使用介词

| ✅ 推荐用法 | ❌ 不推荐用法 |
| ----------- | ------------- |

## FAQ

- **为什么 Dropdown 浮层在靠近屏幕边界宽度不够时，丢失宽度意外换行?**
  在 chromium 104 后 对于屏幕边界文本宽度不够时的换行渲染策略发生变化，详细原因可查看 [issue #1022](https://github.com/aifuxi/semi-ui-vue/issues/1022)，semi 侧已经在 v2.17.0 版本修复了这个问题。
