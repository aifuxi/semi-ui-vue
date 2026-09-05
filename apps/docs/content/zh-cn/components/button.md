---
title: '按钮'
description: '用户使用按钮来触发一个操作或者进行跳转。'
locale: 'zh-CN'
slug: 'button'
category: 'basic'
order: 22
englishTitle: 'Button'
icon: 'doc-button'
upstream: 'basic/button'
---

## 代码演示

### 如何引入

```typescript
import { Button, ButtonGroup, SplitButtonGroup } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
```

### 按钮类型

按钮支持 primary（默认）、secondary、tertiary、warning 和 danger 五种语义类型。

::demo-block{demo="button/zh-cn/Types" title="按钮类型"}
::

### 关于类型字体色值

按钮的语义色由 CSS Variables 定义，也可在自定义元素中使用。

::demo-block{demo="button/zh-cn/TypeColors" title="关于类型字体色值"}
::

### 浅色背景

theme 默认是 light；其他主题为 solid、borderless 和 outline。

::demo-block{demo="button/zh-cn/Themelight" title="浅色背景"}
::

### 深色背景

::demo-block{demo="button/zh-cn/Themesolid" title="深色背景"}
::

### 无背景

::demo-block{demo="button/zh-cn/Themeborderless" title="无背景"}
::

### 边框模式

::demo-block{demo="button/zh-cn/Themeoutline" title="边框模式"}
::

### 尺寸

支持 large、default（默认）和 small 三种尺寸。

::demo-block{demo="button/zh-cn/Sizes" title="尺寸"}
::

### 块级按钮

block 按钮占满父容器宽度，不随文本长度改变。

::demo-block{demo="button/zh-cn/Block" title="块级按钮"}
::

### 图标按钮

通过 icon 插槽设置图标，iconPosition 设置图标位置。纯图标按钮需要可访问名称。

::demo-block{demo="button/zh-cn/Icons" title="图标按钮"}
::

### 链接按钮

使用 [Typography](/zh-cn/components/typography/) 的 link 属性呈现文字链接。

::demo-block{demo="button/zh-cn/Links" title="链接按钮"}
::

### 禁用状态

::demo-block{demo="button/zh-cn/Disabled" title="禁用状态"}
::

### 加载状态

loading 为 true 时显示加载状态并阻止点击。disabled 状态的优先级高于 loading。

::demo-block{demo="button/zh-cn/Loading" title="加载状态"}
::

### AI 风格 - 多彩按钮

colorful 支持所有 theme；type 仅支持 primary 和 tertiary。

::demo-block{demo="button/zh-cn/Colorful" title="AI 风格 - 多彩按钮"}
::

### 组合尺寸

ButtonGroup 的 size、disabled、type、theme 和 colorful 可统一设置组内按钮。

::demo-block{demo="button/zh-cn/GroupSizes" title="组合尺寸"}
::

### 组合禁用

::demo-block{demo="button/zh-cn/GroupDisabled" title="组合禁用"}
::

### 组合类型

::demo-block{demo="button/zh-cn/GroupTypes" title="组合类型"}
::

### 分裂按钮组合

Button 与 Dropdown 组合时使用 SplitButtonGroup，保留按钮间距和圆角。菜单在本站内演示，不提交业务操作。

::demo-block{demo="button/zh-cn/Split" title="分裂按钮组合"}
::

## API 参考

::api-table{slug="button"}
::

## React → Vue

| React                 | Vue                                      |
| --------------------- | ---------------------------------------- |
| `children`            | 默认 slot                                |
| `icon={<Icon />}`     | `#icon` slot                             |
| `className` / `style` | 原生 `class` / `style` attrs             |
| `contentClassName`    | `contentClass`                           |
| `onClick` 等回调      | `@click` 等 Vue 事件                     |
| React ref             | Vue template ref；焦点通常直接使用根 DOM |

## Accessibility

### ARIA

图标按钮使用 aria-label 说明操作。aria-disabled 与 disabled 同步。按钮组可使用 aria-label 描述整组操作。

### 键盘和焦点

Tab 和 Shift + Tab 在可聚焦按钮之间切换。Enter 或 Space 激活当前按钮。ButtonGroup 内的每个按钮仍使用原生焦点顺序。

## 文案规范

用明确的动词开头，让用户可以预测操作结果。优先使用「动词 + 名词」；当弹窗等上下文已经明确对象时，可只使用动词。英文采用 Sentence case。

| 推荐             | 不推荐           |
| ---------------- | ---------------- |
| Apply permission | Apply            |
| Create project   | Create a project |
| Edit profile     | Edit             |

## 设计变量

::token-table{component="button"}
::

## FAQ

### 为什么图标不显示？

从公开子路径 @aifuxi/semi-ui-vue/button 引入 Button，并通过 #icon 插槽提供图标。不要使用内部 BaseButton。
