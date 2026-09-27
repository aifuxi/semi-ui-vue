---
title: 'Anchor 锚点'
description: '创建超链接导航栏。'
type: 'navigation'
order: 54
icon: 'doc-anchor'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/anchor` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-navigation-anchor-1" title="如何引入" kind="import" />

### 基本示例

使用 Link 可以创建锚点，点击它会跳转到指定位置。

<DemoBlock id="zh-CN-navigation-anchor-2" title="基本示例" kind="live" />

### 综合使用

你可以搭配 `getContainer`，`targetOffset`，`style`，`offsetTop` 完成一个拆箱即用的超链接导航栏。

- 滚动容器：你可以通过 `getContainer` 设置滚动内容的容器，默认值为 `window`。

- 距离顶部的距离：可以通过设置 `targetOffset` 设置文档滚动结束时，锚点距离容器顶部的距离。**v>=1.9**

- 自定义定位方式：Anchor 的默认定位方式为 `relative`，你可以通过 `style` 对象自定义它的定位方式。

- 偏移距离：`offsetTop` 可以在滚动内容距离容器顶部达到指定偏移量时触发当前 Link 切换。

<DemoBlock id="zh-CN-navigation-anchor-3" title="综合使用" kind="code" />

### 尺寸

Anchor 设置 `size` 可以控制锚点的尺寸。

<DemoBlock id="zh-CN-navigation-anchor-4" title="尺寸" kind="live" />

<DemoBlock id="zh-CN-navigation-anchor-5" title="尺寸" kind="live" />

### 滑轨主题

Anchor 设置 `railTheme` 可以控制滑轨的主题色。默认值为 `primary`。

<DemoBlock id="zh-CN-navigation-anchor-6" title="滑轨主题" kind="live" />

<DemoBlock id="zh-CN-navigation-anchor-7" title="滑轨主题" kind="live" />

<DemoBlock id="zh-CN-navigation-anchor-8" title="滑轨主题" kind="live" />

### 动态展示

Anchor 设置 `autoCollapse` 可以动态展示下一级锚点。默认值为 `false`。

<DemoBlock id="zh-CN-navigation-anchor-9" title="动态展示" kind="live" />

<DemoBlock id="zh-CN-navigation-anchor-10" title="动态展示" kind="live" />

### 显示工具提示

Anchor 设置 `showTooltip` 可以在 Link 超出最大宽度时显示 Link 的文字内容。默认值为 `false`, 更多使用参考 API 说明。

<DemoBlock id="zh-CN-navigation-anchor-11" title="显示工具提示" kind="live" />

### 工具提示位置

Anchor 设置 `position` 可以设置Tooltip的显示位置。它仅在 `showTooltip` 为 `true` 时起作用。

<DemoBlock id="zh-CN-navigation-anchor-12" title="工具提示位置" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/anchor/types.ts`、`packages/ui/src/anchor/index.ts` 的公开类型为准。

#### Vue 事件

**Anchor**

| 事件   | 参数                                                      | 说明         |
| ------ | --------------------------------------------------------- | ------------ |
| change | [currentLink: string, previousLink: string]               | 当前锚点变化 |
| click  | [event: MouseEvent \| KeyboardEvent, currentLink: string] | 点击锚点     |

#### Vue 插槽

**Anchor**

| 插槽    | 作用域参数 | 说明               |
| ------- | ---------- | ------------------ |
| default | {}         | Anchor.Link 子组件 |

**Anchor.Link**

| 插槽    | 作用域参数 | 说明                    |
| ------- | ---------- | ----------------------- |
| default | {}         | 嵌套 Anchor.Link 子组件 |
| title   | {}         | 链接标题                |

### Anchor

| 属性          | 说明                                                                                                                                                                    | 类型                                                | 默认值    | 版本   |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | --------- | ------ |
| autoCollapse  | 滚动时动态显示下一级锚点                                                                                                                                                | boolean                                             | false     |        |
| className     | 类名                                                                                                                                                                    | string                                              | -         |        |
| defaultAnchor | 默认高亮锚点                                                                                                                                                            | string                                              | -         | 1.20.0 |
| getContainer  | 指定滚动的容器                                                                                                                                                          | () =&gt; HTMLElement \| Window \| null \| undefined | window    |        |
| maxHeight     | 组件的 max-height，超出时显示滚动条                                                                                                                                     | string \| number                                    | `750px`   |        |
| maxWidth      | 组件的 max-width，超出时显示...                                                                                                                                         | string \| number                                    | `200px`   |        |
| offsetTop     | 滚动内容距离容器顶部达到指定偏移量时触发                                                                                                                                | number                                              | 0         |        |
| position      | Tooltip 显示位置，可选值同 Tooltip 组件 position                                                                                                                        | AnchorPosition                                      | -         |        |
| railTheme     | 滑轨主题，可选值：`primary`，`tertiary`，`muted`                                                                                                                        | AnchorRailTheme                                     | `primary` |        |
| scrollMotion  | 是否开启滚动动画                                                                                                                                                        | boolean                                             | false     |        |
| showTooltip   | 文字缩略时是否显示 Tooltip 及相关配置, type，浮层内容承载的组件，支持 Tooltip（默认） \| Popover；opts，其他需要透传给浮层组件的属性, object 形式设置自 2.36.0 版本提供 | AnchorShowTooltip                                   | false     |        |
| size          | 锚点尺寸，可选值： `small`，`default`                                                                                                                                   | AnchorSize                                          | `default` |        |
| style         | 样式对象                                                                                                                                                                | CSSProperties                                       | -         |        |
| targetOffset  | 锚点滚动时距离顶部偏移量                                                                                                                                                | number                                              | 0         | 1.9.0  |

### Anchor.Link

| 属性      | 说明                 | 类型          | 默认值 | 版本   |
| --------- | -------------------- | ------------- | ------ | ------ |
| className | 类名                 | string        | -      |        |
| disabled  | 禁用，不响应点击跳转 | boolean       | false  | 1.20.0 |
| href      | 跳转的链接           | string        | -      |        |
| style     | 样式对象             | CSSProperties | -      |        |
| title     | 文字内容             | VNodeChild    | -      |        |

## 文案规范

- 按句子大小写书写
- 保持简洁，避免换行

## FAQ

1. **为何我的 Link 没有高亮和滑动跟随？**
   检查下点击锚点是否可以滚动到指定位置：

- 不可以，说明 href 有问题，检查文档中是否存在该 id；
- 可以，可能是滚动容器设置不正确，确保文档内容被包裹在滚动容器内。滚动容器默认为 window，如果你的容器是 .my-container 的 div，则应该将滚动容器设置为该 div。

```text
// 将函数传给 Anchor 的 getContainer prop
const getContainer = () => document.querySelector<HTMLElement>('.my-container');
```
