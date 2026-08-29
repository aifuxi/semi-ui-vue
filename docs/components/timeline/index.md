# Timeline 时间轴

Timeline 按时间顺序展示事件、状态和补充信息。本实现以 Semi Design React v2.102.0 为唯一对齐基线。

## 基础用法

```vue
<script setup lang="ts">
import { Timeline, TimelineItem } from '@workspace/ui';
</script>

<template>
  <Timeline aria-label="事故处理过程">
    <TimelineItem time="09:00" type="success">创建服务现场</TimelineItem>
    <TimelineItem time="09:30" type="warning" extra="网络抖动">初步排查</TimelineItem>
    <TimelineItem time="10:20" type="ongoing">正在修复</TimelineItem>
  </Timeline>
</template>
```

## 数据与布局

`dataSource` 非空时优先于默认 slot；`center` 和 `alternate` 支持通过 Item 的 `position` 覆盖单项位置。

```vue
<script setup lang="ts">
import { Timeline, type TimelineData } from '@workspace/ui';

const data: TimelineData[] = [
  { content: '需求确认', time: '09:00', type: 'success' },
  { content: '开发完成', time: '11:30', type: 'ongoing', position: 'right' },
  { content: '发布验证', time: '14:00', extra: '等待审批' },
];
</script>

<template><Timeline mode="center" :data-source="data" /></template>
```

## Timeline API

| 属性         | 类型                                   | 默认值 | 说明                               |
| ------------ | -------------------------------------- | ------ | ---------------------------------- |
| `mode`       | `left \| right \| center \| alternate` | `left` | 时间轴和内容的相对位置             |
| `dataSource` | `TimelineData[]`                       | -      | 数据项，非空时优先于默认 slot      |
| `ariaLabel`  | `string`                               | -      | `aria-label` 的类型化 Vue 映射     |
| `className`  | `HTMLAttributes['class']`              | -      | React 迁移兼容；也可直接使用 class |
| `style`      | `StyleValue`                           | -      | 根 `ul` 的内联样式                 |

## TimelineItem API

| 属性       | 类型                                                | 默认值    | 说明                        |
| ---------- | --------------------------------------------------- | --------- | --------------------------- |
| `type`     | `default \| ongoing \| success \| warning \| error` | `default` | 节点语义类型                |
| `color`    | `string`                                            | -         | 自定义节点背景色            |
| `dot`      | `VNodeChild`                                        | -         | 自定义节点，也可使用 `#dot` |
| `extra`    | `VNodeChild`                                        | -         | 附加信息，也可使用 `#extra` |
| `time`     | `VNodeChild`                                        | `''`      | 时间内容，也可使用 `#time`  |
| `position` | `left \| right`                                     | -         | center/alternate 下覆盖位置 |
| `@click`   | `(event: MouseEvent) => void`                       | -         | 点击整个 Item               |

装饰性的连接线和节点使用 `aria-hidden`；请为 Timeline 提供描述性的 `aria-label`。
