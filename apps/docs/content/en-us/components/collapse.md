---
title: 'Collapse'
description: 'Display content areas can be expanded or folded.'
locale: 'en-US'
slug: 'collapse'
category: 'show'
order: 67
englishTitle: 'Collapse'
icon: 'doc-accordion'
upstream: 'show/collapse'
---

## Demos

### How to import

```vue
<script setup lang="ts">
import { Collapse, CollapsePanel } from '@aifuxi/semi-ui-vue/collapse';
import '@aifuxi/semi-theme-default/collapse.css';
</script>
```

### Basic Usage

You can expand multiple panels at the same time, and use `defaultActiveKey` to set the panel to expand by default.

::demo-block{demo="collapse/en-us/Basic" title="Basic Usage"}
::

### Accordion

Use `accordion` to restrict one panel only to be expanded at one time.

::demo-block{demo="collapse/en-us/Accordion" title="Accordion"}
::

### Disable Panel

Use `disabled` to disabled panel.

::demo-block{demo="collapse/en-us/Disabled" title="Disable Panel"}
::

### Hide The Panel Icon

Use `showArrow` to hide the panel icon.

::demo-block{demo="collapse/en-us/HideIcon" title="Hide The Panel Icon"}
::

### Custom Icon

You can use `expandIcon` to set the expanding icon and `collapseIcon` for folded icon.

::demo-block{demo="collapse/en-us/CustomIcon" title="Custom Icon"}
::

### Custom Extra Content on the Right-upper Corner

You can use `extra` to set extra content on the right-upper corner.

**Only works when `header` is string. If `header` is a VNodeChild, it will take the entire header part including extra so that you could render whatever you need.**

::demo-block{demo="collapse/en-us/Extra" title="Custom Extra Content on the Right-upper Corner"}
::

## API Reference

### Collapse

| Property              | Description                                                  | Type                      | Default           |
| --------------------- | ------------------------------------------------------------ | ------------------------- | ----------------- |
| `accordion`           | Accordion mode opens one panel at a time                     | `boolean`                 | `false`           |
| `activeKey`           | Controlled expanded keys; supports v-model:activeKey         | `string / string[]`       | `—`               |
| `class / className`   | Vue class and compatibility class name                       | `HTMLAttributes["class"]` | `—`               |
| `style`               | Root styles                                                  | `StyleValue`              | `—`               |
| `clickHeaderToExpand` | Click the header to expand; false responds only to the arrow | `boolean`                 | `true`            |
| `collapseIcon`        | Collapse icon shown when expanded                            | `VNodeChild`              | `IconChevronUp`   |
| `defaultActiveKey`    | Initially expanded keys                                      | `string / string[]`       | `none`            |
| `expandIcon`          | Expand icon shown when collapsed                             | `VNodeChild`              | `IconChevronDown` |
| `expandIconPosition`  | left, right                                                  | `CollapseIconPosition`    | `right`           |
| `keepDOM`             | Keep content DOM after collapsing                            | `boolean`                 | `false`           |
| `lazyRender`          | With keepDOM, defer rendering until first expansion          | `boolean`                 | `false`           |
| `motion`              | Enable expand/collapse animation                             | `boolean`                 | `true`            |

### CollapsePanel

| Property            | Description                                                  | Type                      | Default    |
| ------------------- | ------------------------------------------------------------ | ------------------------- | ---------- |
| `class / className` | Vue class and compatibility class name                       | `HTMLAttributes["class"]` | `—`        |
| `style`             | Root styles                                                  | `StyleValue`              | `—`        |
| `disabled`          | Disable panel toggling                                       | `boolean`                 | `false`    |
| `extra`             | Extra content when header is a string                        | `VNodeChild`              | `—`        |
| `header`            | Panel header; node content occupies the entire header region | `VNodeChild`              | `—`        |
| `itemKey`           | Required unique key matching activeKey/defaultActiveKey      | `string`                  | `required` |
| `reCalcKey`         | Recalculate content height when changed                      | `string / number`         | `—`        |
| `showArrow`         | Show the arrow                                               | `boolean`                 | `true`     |

Collapse slots: `default`, `expandIcon`, `collapseIcon`. CollapsePanel slots: `default`, `header`, `extra`. Events: `@change(activeKey, event: MouseEvent)` and `update:activeKey`; CollapsePanel emits `@motion-end()` when motion finishes. Even accordion mode emits the expanded-key array. `Collapse.Panel` is retained; named CollapsePanel is preferred in templates.

## Accessibility

### ARIA

- The button on the right side of the panel header is set to `aria-hidden=true`
- The interactive part of the panel header is set to the `aria-owns` value corresponding to the panel content
- The content of the panel is set with `aria-hidden`, and its value is automatically switched between true and false with the display of the panel content
- The panel `aria-disabled` is synchronized with the `disabled` property, indicating that the panel is disabled

## Content Guidelines

The essence of the folding panel is that the card container adds the function of folding and unfolding, so the copywriting specification of the folding panel needs to be the same as the [Card copywriting specification](/en-us/components/card/)

## Design Tokens

::token-table{component="collapse"}
::

## FAQ

- ##### Why is the data in Form cleared when using Collapse?

  When Collapse is collapsed, the related DOM is destroyed and so are the fields data stored in Form. You could set `keepDOM=true` to keep the DOM from being destroyed.

- ##### the panel header as a whole is used as a click hot zone for folding and expanding. If a custom element (such as Input) is placed in the Header, it will cause Collapse to collapse/expand when clicked. How to avoid it?
  You can prevent the event from bubbling to the panel header in the click event callback of the custom element. If the custom element does not provide an event object, wrap a layer of div to prevent bubbling in the div click.

```vue
<script setup lang="ts">
import { Collapse, CollapsePanel } from '@aifuxi/semi-ui-vue/collapse';
import { Input } from '@aifuxi/semi-ui-vue/input';
import '@aifuxi/semi-theme-default/collapse.css';
import '@aifuxi/semi-theme-default/input.css';
</script>
<template>
  <Collapse
    ><CollapsePanel item-key="1">
      <template #header
        ><div style="display: inline-flex" @click.stop><span>Panel header</span><Input /></div
      ></template>
      <p>Hi, bytedance dance dance. This is the docsite of Semi UI.</p>
    </CollapsePanel></Collapse
  >
</template>
```

## React → Vue

| React                                                  | Vue                                        |
| ------------------------------------------------------ | ------------------------------------------ |
| `Collapse.Panel`                                       | CollapsePanel                              |
| `activeKey + onChange`                                 | v-model:activeKey or :active-key + @change |
| `children`                                             | default slot                               |
| `header / extra / expandIcon / collapseIcon ReactNode` | Matching slots or VNodeChild               |
| `onMotionEnd`                                          | @motion-end                                |
| `onClick={e => e.stopPropagation()}`                   | @click.stop                                |
| `className`                                            | class (className alias retained)           |
