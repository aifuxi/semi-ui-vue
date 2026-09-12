---
title: 'Timeline'
description: 'Timeline component is used to display a series of information vertically.'
locale: 'en-US'
slug: 'timeline'
category: 'show'
order: 83
englishTitle: 'Timeline'
icon: 'doc-timeline'
upstream: 'show/timeline'
---

## Demos

### How to import

```ts
import { Timeline, TimelineItem } from '@aifuxi/semi-ui-vue/timeline';
import '@aifuxi/semi-theme-default/timeline.css';
```

### Basic Usage

::demo-block{demo="timeline/en-us/Basic" title="Basic Usage"}
::

### Type

You can use `type` to set the type of a time node, using one of: `default`,`ongoing`, `success`, `warning`, `error`. The corresponding dot will have a corresponding color.

::demo-block{demo="timeline/en-us/Types" title="Type"}
::

### Custom node

You can use `dot` to customize icon, `color` to customize color or style the default slot content.

::demo-block{demo="timeline/en-us/Custom" title="Custom node"}
::

### Timeline Position

Use `mode` to set the position of the timeline, using one of: `left`, `center`, `alternate`, `right`.

#### Left (default)

::demo-block{demo="timeline/en-us/Left" title="Left (default)"}
::

#### Center

::demo-block{demo="timeline/en-us/Center" title="Center"}
::

#### Alternate

::demo-block{demo="timeline/en-us/Alternate" title="Alternate"}
::

#### Right

::demo-block{demo="timeline/en-us/Right" title="Right"}
::

### DataSource

::demo-block{demo="timeline/en-us/DataSource" title="DataSource"}
::

## API reference

### TimeLine

| Properties | Instruction                                                                                  | type                                   | Default |
| ---------- | -------------------------------------------------------------------------------------------- | -------------------------------------- | ------- |
| class      | Class name                                                                                   | string                                 | -       |
| mode       | The relative Position of the timeline and content                                            | `left`\|`right`\|`center`\|`alternate` | `left`  |
| style      | Inline style                                                                                 | CSSProperties                          | -       |
| dataSource | DataSource array for Timeline, Support content attribute and all attributes of TimeLine.Item | array                                  | -       |

### TimeLine.Item

| Properties | Instruction                                              | type                                                | Default   | Version |
| ---------- | -------------------------------------------------------- | --------------------------------------------------- | --------- | ------- |
| class      | Class name                                               | string                                              | -         | -       |
| color      | Color of dot                                             | string                                              | -         | -       |
| dot        | Custom dot                                               | VNodeChild                                          | -         | -       |
| extra      | Custom extra content                                     | VNodeChild                                          | -         | -       |
| position   | Custom node location to override TimeLine's mode setting | `left`\|`right`                                     | -         | -       |
| style      | Inline style                                             | CSSProperties                                       | -         | -       |
| time       | Time value                                               | VNodeChild                                          | -         | -       |
| type       | Pattern of dot                                           | `default`\|`ongoing`\|`success`\|`warning`\|`error` | `default` | -       |
| @click     | Click event                                              | (e: MouseEvent) => void                             | -         | 2.2.0   |

## Accessibility

### ARIA

- The element of dot and line between dots in TimeLine have a `aria-hidden`, indicates that they do not support Accessibility API.
- Supporting API `aria-label` to specify TimeLine's label.

```vue
<Timeline aria-label="Accident timeline">
    <TimelineItem time="2015-09-01">Accident started</TimelineItem>
    <TimelineItem time="2015-09-01">Process</TimelineItem>
</Timeline>
```

## Design Tokens

::token-table{component="timeline"}
::

## FAQ

**Can color alone describe node status?**

Include clear content or supporting text as well. A custom dot replaces the default node graphic.

## React → Vue Migration

| React                    | Vue                                     |
| ------------------------ | --------------------------------------- |
| Timeline.Item            | TimelineItem or the compound member     |
| children                 | Default slot                            |
| dot / extra / time       | Named slots or VNodeChild props         |
| dataSource content / dot | VNodeChild; use h for rich data content |
| onClick                  | TimelineItem @click with MouseEvent     |
| aria-label               | aria-label or ariaLabel                 |
| className                | class; className is also supported      |

TimelineData includes content, all TimelineItem props and an onClick callback. A non-empty data source takes precedence over the default slot. position controls individual item placement in alternate and center modes. Use text as well as node color to describe status.
