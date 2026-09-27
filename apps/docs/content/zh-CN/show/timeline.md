---
title: 'Timeline 时间轴'
description: '时间轴是用于对一系列信息进行时间排序时，垂直展示的组件。'
type: 'show'
order: 83
icon: 'doc-timeline'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/timeline` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-show-timeline-1" title="如何引入" kind="import" />

### 基本用法

<DemoBlock id="zh-CN-show-timeline-2" title="基本用法" kind="live" />

### 节点类型

通过 type 可以设置节点类型，对应原点会变成相应的颜色，可选：`default`，`ongoing`， `success`， `warning`， `error`。

<DemoBlock id="zh-CN-show-timeline-3" title="节点类型" kind="live" />

### 自定义节点

可以通过 `dot` 自定义图标，`color` 自定义圆点色值。可以通过默认插槽内容的样式自定义节点。

<DemoBlock id="zh-CN-show-timeline-4" title="自定义节点" kind="live" />

### 时间轴位置

通过 `mode` 属性可以设置时间的位置，共有 4 种模式可选：`left`， `center`， `alternate`， `right`。

#### 时间轴在左侧（默认）

<DemoBlock id="zh-CN-show-timeline-5" title="时间轴在左侧（默认）" kind="live" />

#### 时间节点在左侧

<DemoBlock id="zh-CN-show-timeline-6" title="时间节点在左侧" kind="live" />

#### 交替展现

<DemoBlock id="zh-CN-show-timeline-7" title="交替展现" kind="live" />

#### 时间轴在右侧

<DemoBlock id="zh-CN-show-timeline-8" title="时间轴在右侧" kind="live" />

### 使用 dataSource

<DemoBlock id="zh-CN-show-timeline-9" title="使用 dataSource" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/timeline/types.ts`、`packages/ui/src/timeline/index.ts` 的公开类型为准。

#### Vue 用法

- 非空 `dataSource` 优先于默认插槽；空数组回退到声明式 `TimelineItem`。
- `TimelineData.onClick` 是数据配置中的真实 callback prop；声明式 `TimelineItem` 使用 `@click`。
- `TimelineItem` 同时作为 `Timeline.Item` 静态成员和具名导出提供。

#### Vue 事件

**TimelineItem**

| 事件  | 参数                | 说明                   |
| ----- | ------------------- | ---------------------- |
| click | [event: MouseEvent] | 点击整个时间轴项时触发 |

#### Vue 插槽

**Timeline**

| 插槽    | 作用域参数 | 说明                |
| ------- | ---------- | ------------------- |
| default | {}         | TimelineItem 子组件 |

**TimelineItem**

| 插槽    | 作用域参数 | 说明             |
| ------- | ---------- | ---------------- |
| default | {}         | 时间轴项内容     |
| dot     | {}         | 自定义时间轴节点 |
| extra   | {}         | 辅助内容         |
| time    | {}         | 时间内容         |

### Timeline

| 属性       | 说明                                                       | 类型                    | 默认值 |
| ---------- | ---------------------------------------------------------- | ----------------------- | ------ |
| ariaLabel  | `aria-label` 的类型化 Vue 映射                             | string                  | —      |
| class      | Vue 原生类名                                               | HTMLAttributes['class'] | —      |
| className  | 样式类名                                                   | HTMLAttributes['class'] | -      |
| dataSource | 时间轴数据源，支持 content 属性及 Timeline.Item 的所有属性 | readonly TimelineData[] | -      |
| mode       | 通过设置 mode 可以改变时间轴和内容的相对位置               | TimelineMode            | `left` |
| style      | 样式                                                       | StyleValue              | -      |

### Timeline.Item

| 属性      | 说明                                         | 类型                    | 默认值    | 版本 |
| --------- | -------------------------------------------- | ----------------------- | --------- | ---- |
| class     | Vue 原生类名                                 | HTMLAttributes['class'] | —         |      |
| className | 样式类名                                     | HTMLAttributes['class'] | -         | -    |
| color     | 自定义的圆圈色值                             | string                  | -         | -    |
| dot       | 自定义时间轴点                               | VNodeChild              | -         | -    |
| extra     | 自定义辅助内容                               | VNodeChild              | -         | -    |
| position  | 自定义节点位置，可以覆盖 Timeline 的模式选项 | TimelineItemPosition    | -         | -    |
| style     | 样式                                         | StyleValue              | -         | -    |
| time      | 时间文本                                     | VNodeChild              | `''`      | -    |
| type      | 当前圆圈的模式                               | TimelineItemType        | `default` | -    |

## Accessibility

### ARIA

- 组件中时间点的连线以及时间点本身被设置了 `aria-hidden`，不会响应 Accessibility API
- 可以通过传入 `aria-label` 设置 Timeline 组件的标签

<DemoBlock id="zh-CN-show-timeline-10" title="ARIA" kind="code" />
