# Timeline

Timeline presents events, statuses, and supporting information in chronological order. The implementation baseline is Semi Design React v2.102.0.

## Basic usage

```vue
<script setup lang="ts">
import { Timeline, TimelineItem } from '@workspace/ui';
</script>

<template>
  <Timeline aria-label="Incident response">
    <TimelineItem time="09:00" type="success">Site created</TimelineItem>
    <TimelineItem time="09:30" type="warning" extra="Network jitter">Investigating</TimelineItem>
    <TimelineItem time="10:20" type="ongoing">Repairing</TimelineItem>
  </Timeline>
</template>
```

## Data and layout

A non-empty `dataSource` takes precedence over the default slot. In `center` and `alternate` modes, an Item can override its side with `position`.

```vue
<script setup lang="ts">
import { Timeline, type TimelineData } from '@workspace/ui';

const data: TimelineData[] = [
  { content: 'Requirements approved', time: '09:00', type: 'success' },
  { content: 'Development complete', time: '11:30', type: 'ongoing', position: 'right' },
  { content: 'Release verification', time: '14:00', extra: 'Awaiting approval' },
];
</script>

<template><Timeline mode="center" :data-source="data" /></template>
```

## Timeline API

| Property     | Type                                   | Default | Description                                  |
| ------------ | -------------------------------------- | ------- | -------------------------------------------- |
| `mode`       | `left \| right \| center \| alternate` | `left`  | Relative position of the axis and content    |
| `dataSource` | `TimelineData[]`                       | -       | Data items; a non-empty array wins over slot |
| `ariaLabel`  | `string`                               | -       | Typed Vue mapping for `aria-label`           |
| `className`  | `HTMLAttributes['class']`              | -       | React migration alias; native class works    |
| `style`      | `StyleValue`                           | -       | Inline style for the root `ul`               |

## TimelineItem API

| Property   | Type                                                | Default   | Description                               |
| ---------- | --------------------------------------------------- | --------- | ----------------------------------------- |
| `type`     | `default \| ongoing \| success \| warning \| error` | `default` | Semantic node type                        |
| `color`    | `string`                                            | -         | Custom node background color              |
| `dot`      | `VNodeChild`                                        | -         | Custom node; `#dot` is also available     |
| `extra`    | `VNodeChild`                                        | -         | Extra content; `#extra` is also available |
| `time`     | `VNodeChild`                                        | `''`      | Time content; `#time` is also available   |
| `position` | `left \| right`                                     | -         | Side override in center/alternate modes   |
| `@click`   | `(event: MouseEvent) => void`                       | -         | Click on the whole Item                   |

The decorative line and dot are `aria-hidden`. Provide a descriptive `aria-label` for the Timeline.
