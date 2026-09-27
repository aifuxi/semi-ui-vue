---
title: 'ScrollList 滚动列表'
description: '滚动列表。'
type: 'show'
order: 79
icon: 'doc-scrolllist'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/scroll-list` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-show-scrolllist-1" title="如何引入" kind="import" />

### 基本使用

滚动列表提供了一个类似于 iOS 操作系统的滚动选择模式，同时支持滚动至指定窗口位置选择与点击选择。

<DemoBlock id="zh-CN-show-scrolllist-2" title="基本使用" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/scroll-list/types.ts`、`packages/ui/src/scroll-list/index.ts` 的公开类型为准。

#### Vue 用法

- `ScrollItem` 同时作为 `ScrollList.Item` 静态成员和具名导出提供。
- `ScrollList` 的 header、footer 同时支持 VNode prop 和同名插槽，插槽优先。
- `ScrollItem.transform` 与 `ItemData.transform` 是显示值转换 callback props；ItemData 中的配置优先。

#### Vue 实例方法

**ScrollItemExposed**

| 方法             | 签名                                                                                    | 说明                     |
| ---------------- | --------------------------------------------------------------------------------------- | ------------------------ |
| `scrollToCenter` | (selectedNode?: HTMLElement, scrollWrapper?: HTMLElement, duration?: number) =&gt; void | 将指定节点滚动到容器中心 |
| `scrollToIndex`  | (selectedIndex?: number, duration?: number) =&gt; void                                  | 滚动到指定索引           |
| `scrollToNode`   | (node: HTMLElement, duration?: number) =&gt; void                                       | 滚动到指定节点           |
| `scrollToPos`    | (targetTop: number, duration?: number) =&gt; void                                       | 滚动到指定纵向位置       |

#### Vue 事件

**ScrollItem**

| 事件   | 参数                         | 说明                       |
| ------ | ---------------------------- | -------------------------- |
| select | [data: ScrollItemSelectData] | 点击或滚动选中可用项时触发 |

#### Vue 插槽

**ScrollList**

| 插槽    | 作用域参数 | 说明              |
| ------- | ---------- | ----------------- |
| default | {}         | ScrollItem 子组件 |
| header  | {}         | 列表头部内容      |
| footer  | {}         | 列表底部内容      |

### ScrollList

| 属性       | 说明         | 类型                    | 默认值            |
| ---------- | ------------ | ----------------------- | ----------------- |
| bodyHeight | body高度     | number \| string        | —                 |
| class      | Vue 原生类名 | HTMLAttributes['class'] | —                 |
| className  | 样式类名     | HTMLAttributes['class'] | —                 |
| footer     | 底部 addon   | VNodeChild              | —                 |
| header     | 头部 addon   | VNodeChild              | —                 |
| prefixCls  | 样式类名前缀 | string                  | `semi-scrolllist` |
| style      | 内联样式     | StyleValue              | —                 |

### ScrollItem

| 属性          | 说明                                        | 类型                                         | 默认值  |
| ------------- | ------------------------------------------- | -------------------------------------------- | ------- |
| ariaLabel     | `aria-label` 的类型化 Vue 映射              | string                                       | —       |
| class         | Vue 原生类名                                | HTMLAttributes['class']                      | —       |
| className     | 样式类名                                    | HTMLAttributes['class']                      | ''      |
| cycled        | 是否为无限循环，仅在 mode 为 "wheel" 时生效 | boolean                                      | false   |
| list          | 列表内容                                    | Item[]                                       | []      |
| mode          | 模式选择                                    | ScrollItemMode                               | `wheel` |
| motion        | 是否开启滚动动画                            | ScrollMotion                                 | true    |
| selectedIndex | 选中项的索引                                | number                                       | 0       |
| style         | 内联样式                                    | StyleValue                                   | {}      |
| transform     | 对选中项的变换，返回值会作为文案进行显示    | (value: unknown, text: string) =&gt; unknown | —       |
| type          | —                                           | number \| string                             | —       |

#### ItemData

| 属性      | 说明                                                                                                                   | 类型                                         | 默认值 |
| --------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ------ |
| disabled  | 该项是否被禁止选择                                                                                                     | boolean                                      | —      |
| text      | 每一项的文案                                                                                                           | string                                       | —      |
| transform | 该项处于选中状态时的变换，返回值会作为文案进行显示，ScrollItem 组件如果同时传入会优先选择 ItemData 中的 transform 方法 | (value: unknown, text: string) =&gt; unknown | —      |
| value     | 每一项的值                                                                                                             | unknown（必填）                              | —      |

## Accessibility

### ARIA

- `ScrollItem` 支持传入 `aria-label`, 指定该列标签
- `ScrollItem` 使用 `aria-disabled` 表示该项目是否被禁用
- `ScrollItem` 使用 `aria-selected` 表示该项目是否被选中
