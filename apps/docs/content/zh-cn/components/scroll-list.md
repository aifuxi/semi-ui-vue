---
title: '滚动列表'
description: '滚动列表。'
locale: 'zh-CN'
slug: 'scroll-list'
category: 'show'
order: 79
englishTitle: 'ScrollList'
icon: 'doc-scrolllist'
upstream: 'show/scrolllist'
---

ScrollList 用于在有限高度内展示一列或多列可滚动选项。本实现以本地 Semi Design v2.102.0 为唯一基线，保留 normal、wheel、循环滚动、禁用、变换、主题与 RTL 契约。

## 代码演示

### 如何引入

```ts
import { ScrollList, ScrollItem } from '@aifuxi/semi-ui-vue/scroll-list';
import '@aifuxi/semi-theme-default/scroll-list.css';
```

### 基本使用

滚动列表提供类似 iOS 的滚动选择方式，也支持点击选项。时段列不循环，小时和分钟列循环滚动；三列初始索引均为 1，即下午、2 点、1 分。

::demo-block{demo="scroll-list/zh-CN/Example1" title="基本使用"}
::

`selectedIndex` 是受控状态：组件通过 `select` 事件通知选择结果，调用方更新索引。`normal` 模式直接点击选项；`wheel` 模式会把最近的启用项滚动到选择线。`cycled` 只在 wheel 模式生效。

上游分钟列表使用 `Math.random()` 决定禁用项；这里固定禁用偶数分钟，保留可选与禁用项混排，并保证页面、重置和编辑器运行的数据一致。严格参考适配器使用相同序列；这是演示数据的确定性适配，正式状态以本批验收证据为准。

小时和分钟的选择结果输出到浏览器控制台；底部 `Ok` 按钮与上游一样只输出 `close`，不会关闭列表。React 的 `header`、`footer` 内容分别改为 `#header`、`#footer` 插槽，`onSelect` 改为 `@select`，使用 `shallowRef` 保存各列受控索引。

## API 参考

### ScrollList

| 属性                            | 类型                 | 默认值            | 说明                      |
| ------------------------------- | -------------------- | ----------------- | ------------------------- |
| `bodyHeight`                    | `number \| string`   | `300`（主题样式） | body 高度，number 按 px   |
| `header` / `#header`            | `VNodeChild`         | -                 | 标题内容，slot 优先       |
| `footer` / `#footer`            | `VNodeChild`         | -                 | 底部内容，slot 优先       |
| `prefixCls`                     | `string`             | `semi-scrolllist` | class 前缀                |
| `class` / `className` / `style` | Vue class/style 类型 | -                 | 根节点样式                |
| 默认 slot                       | `VNodeChild`         | -                 | 放置一个或多个 ScrollItem |

### ScrollItem

| 属性                            | 类型                                        | 默认值    | 说明                            |
| ------------------------------- | ------------------------------------------- | --------- | ------------------------------- |
| `list`                          | `ScrollItemData[]`                          | `[]`      | 选项数据                        |
| `mode`                          | `'normal' \| 'wheel'`                       | `'wheel'` | 展示模式                        |
| `cycled`                        | `boolean`                                   | `false`   | wheel 是否循环                  |
| `selectedIndex`                 | `number`                                    | `0`       | 受控选中索引                    |
| `motion`                        | `boolean \| ScrollMotionObject \| function` | `true`    | 是否使用固定滚动动画            |
| `transform`                     | `(value, text) => unknown`                  | -         | 仅变换选中项；item 上的函数优先 |
| `type`                          | `string \| number`                          | -         | 写入 select payload 的列标识    |
| `ariaLabel`                     | `string`                                    | -         | 模板可写为 `aria-label`         |
| `class` / `className` / `style` | Vue class/style 类型                        | -         | 列根节点样式                    |

`select` 事件参数为源 item 的浅拷贝，并附加 `index` 与 `type`。禁用项不会触发选择。

#### ItemData

| 属性        | 类型                       | 说明                                       |
| ----------- | -------------------------- | ------------------------------------------ |
| `value`     | `unknown`                  | 选项值，也是默认显示内容                   |
| `text`      | `string`                   | 可选显示文案，优先于 value                 |
| `disabled`  | `boolean`                  | 禁用选择                                   |
| `transform` | `(value, text) => unknown` | 选中时变换显示内容，优先于列上的 transform |

## Accessibility

### ARIA

每列使用 `role="listbox"`，选项使用 `role="option"` 与 `aria-disabled`。固定 v2.102.0 Adapter 没有方向键或 roving tabindex，也未输出 `aria-selected`，Vue 实现不扩展基线外的键盘状态机。light/dark 颜色来自 `--semi-color-*`，RTL 会翻转列分隔线和 wheel padding。公共入口 SSR-safe，DOM 测量与滚动只在客户端挂载后执行并在卸载时清理。

## 设计变量

ScrollList 使用固定主题的 `--semi-color-*` 变量控制文本、禁用项、分隔线与遮罩颜色，组件 SCSS 提供尺寸和间距；主题入口与独立 `scroll-list.css` 保留 `.semi-scrolllist-*` 契约。

## React → Vue

`children` 改为默认插槽，`header`/`footer` 改为同名具名插槽；`onSelect` 改为 `@select`，事件载荷保留 `index`、`type` 和源选项字段，调用方同步更新 `selectedIndex`。示例列标签使用固定上游 ARIA 章节支持的 `aria-label`。

完整源码证据、默认值、事件顺序、视觉矩阵与 deviation 见 [对齐矩阵](https://github.com/aifuxi/semi-ui-vue/blob/master/docs/components/scroll-list/alignment.md)，框架迁移见 [React → Vue](#react-vue)。
