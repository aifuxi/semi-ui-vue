---
title: '时间轴'
description: '时间轴是用于对一系列信息进行时间排序时，垂直展示的组件。'
locale: 'zh-CN'
slug: 'timeline'
category: 'show'
order: 83
englishTitle: 'Timeline'
icon: 'doc-timeline'
upstream: 'show/timeline'
---

## 代码演示

### 如何引入

```ts
import { Timeline, TimelineItem } from '@aifuxi/semi-ui-vue/timeline';
import '@aifuxi/semi-theme-default/timeline.css';
```

### 基本用法

::demo-block{demo="timeline/zh-cn/Basic" title="基本用法"}
::

### 节点类型

通过 type 可以设置节点类型，对应原点会变成相应的颜色，可选：`default`，`ongoing`， `success`， `warning`， `error`。

::demo-block{demo="timeline/zh-cn/Types" title="节点类型"}
::

### 自定义节点

可以通过 `dot` 自定义图标，`color` 自定义圆点色值。通过设置默认插槽内容的样式可以自定义节点样式。

::demo-block{demo="timeline/zh-cn/Custom" title="自定义节点"}
::

### 时间轴位置

通过 `mode` 属性可以设置时间的位置，共有 4 种模式可选：`left`， `center`， `alternate`， `right`。

#### 时间轴在左侧（默认）

::demo-block{demo="timeline/zh-cn/Left" title="时间轴在左侧（默认）"}
::

#### 时间节点在左侧

::demo-block{demo="timeline/zh-cn/Center" title="时间节点在左侧"}
::

#### 交替展现

::demo-block{demo="timeline/zh-cn/Alternate" title="交替展现"}
::

#### 时间轴在右侧

::demo-block{demo="timeline/zh-cn/Right" title="时间轴在右侧"}
::

### 使用 dataSource

::demo-block{demo="timeline/zh-cn/DataSource" title="使用 dataSource"}
::

## API 参考

### TimeLine

| 属性       | 说明                                                       | 类型                                   | 默认值 |
| ---------- | ---------------------------------------------------------- | -------------------------------------- | ------ |
| class      | 类名                                                       | string                                 | -      |
| mode       | 通过设置 mode 可以改变时间轴和内容的相对位置               | `left`\|`right`\|`center`\|`alternate` | `left` |
| style      | 样式                                                       | CSSProperties                          | -      |
| dataSource | 时间轴数据源，支持 content 属性及 TimeLine.Item 的所有属性 | array                                  | -      |

### TimeLine.Item

| 属性     | 说明                                         | 类型                                                | 默认值    | 版本  |
| -------- | -------------------------------------------- | --------------------------------------------------- | --------- | ----- |
| class    | 类名                                         | string                                              | -         | -     |
| color    | 自定义的圆圈色值                             | string                                              | -         | -     |
| dot      | 自定义时间轴点                               | VNodeChild                                          | -         | -     |
| extra    | 自定义辅助内容                               | VNodeChild                                          | -         | -     |
| position | 自定义节点位置，可以覆盖 TimeLine 的模式选项 | `left`\|`right`                                     | -         | -     |
| style    | 样式                                         | CSSProperties                                       | -         | -     |
| time     | 时间文本                                     | VNodeChild                                          | -         | -     |
| type     | 当前圆圈的模式                               | `default`\|`ongoing`\|`success`\|`warning`\|`error` | `default` | -     |
| @click   | 鼠标点击事件的回调                           | (e: MouseEvent) => void                             | -         | 2.2.0 |

## Accessibility

### ARIA

- 组件中时间点的连线以及时间点本身被设置了 `aria-hidden`，不会响应 Accessibility API
- 可以通过传入 `aria-label` 设置 TimeLine 组件的标签

```vue
<Timeline aria-label="xx事故处理过程时间线">
    <TimelineItem time="2015-09-01">创建服务现场</TimelineItem>
    <TimelineItem time="2015-09-02">初步排除网络异常</TimelineItem>
    <TimelineItem time="2015-09-03">技术测试异常</TimelineItem>
    <TimelineItem time="2015-09-05">网络异常正在修复</TimelineItem>
</Timeline>
```

## 设计变量

::token-table{component="timeline"}
::

## FAQ

**节点状态可以通过颜色单独表达吗？**

同时提供清晰的内容或辅助说明；自定义 dot 会替换默认节点图形。

## React → Vue 迁移

| React                       | Vue                                     |
| --------------------------- | --------------------------------------- |
| Timeline.Item               | TimelineItem，保留组合成员              |
| children                    | 默认插槽                                |
| dot / extra / time          | 同名插槽或 VNodeChild prop              |
| dataSource 的 content / dot | VNodeChild；复杂数据内容可用 h 创建     |
| onClick                     | TimelineItem 的 @click，参数 MouseEvent |
| aria-label                  | aria-label 或 ariaLabel                 |
| className                   | class，兼容 className                   |

TimelineData 支持 content、TimelineItem 的全部属性以及 onClick 回调；非空数据源优先于默认插槽。position 在 alternate 和 center 模式控制单个节点位置。类型色值与 time/extra 文案分别表达状态和辅助信息。
