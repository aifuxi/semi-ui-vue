# Breadcrumb

Breadcrumb shows the current page within a hierarchy and provides navigation back to ancestor pages. The implementation uses the pinned local Semi Design v2.102.0 source as its sole parity baseline.

## Basic usage

```vue
<script setup lang="ts">
import { Breadcrumb, BreadcrumbItem } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/breadcrumb.css';
</script>

<template>
  <Breadcrumb aria-label="Documentation path">
    <BreadcrumbItem href="/">Home</BreadcrumbItem>
    <BreadcrumbItem href="/components">Components</BreadcrumbItem>
    <BreadcrumbItem>Breadcrumb</BreadcrumbItem>
  </Breadcrumb>
</template>
```

The compound form is also available: `<Breadcrumb.Item>Content</Breadcrumb.Item>`.

## Icons, size, and separator

```vue
<Breadcrumb :compact="false">
  <template #separator><IconChevronRight size="small" /></template>
  <BreadcrumbItem>
    <template #icon><IconHome /></template>
    Home
  </BreadcrumbItem>
  <BreadcrumbItem>Detail</BreadcrumbItem>
</Breadcrumb>
```

## Routes and custom rendering

```vue
<Breadcrumb :routes="routes">
  <template #item="{ route }">
    <strong>{{ route.name }}</strong>
  </template>
</Breadcrumb>
```

`routes` accepts strings or `{ name, path, href, icon }` objects and preserves extra business fields. The `item` slot is the Vue-native mapping of React `renderItem`; the function prop remains available for programmatic callers.

## Collapse and Popover

Intermediate paths collapse when their count exceeds `maxItemCount`. With `moreType="default"`, click or press Enter to expand. With `moreType="popover"`, hover to inspect the hidden items.

```vue
<Breadcrumb :max-item-count="4" more-type="popover">
  <BreadcrumbItem v-for="item in paths" :key="item">{{ item }}</BreadcrumbItem>
</Breadcrumb>
```

Use `#more="{ items, expand }"` to customize the ellipsis area. It maps React `renderMore(restItem)` and receives hidden BreadcrumbItem VNodes with parent state already injected.

## API

### Breadcrumb

| Prop                  | Description                                    | Type                               | Default                              |
| --------------------- | ---------------------------------------------- | ---------------------------------- | ------------------------------------ |
| `activeIndex`         | Controlled active item index                   | `number`                           | last item                            |
| `autoCollapse`        | Collapse when the item count exceeds the limit | `boolean`                          | `true`                               |
| `compact`             | Use compact sizing                             | `boolean`                          | `true`                               |
| `maxItemCount`        | Maximum item count before collapse             | `number`                           | `4`                                  |
| `moreType`            | Built-in ellipsis presentation                 | `'default' \| 'popover'`           | `'default'`                          |
| `routes`              | Route strings or objects                       | `Array<BreadcrumbRoute \| string>` | `[]`                                 |
| `separator`           | Parent separator                               | `VNodeChild`                       | `'/'`                                |
| `showTooltip`         | Single-line ellipsis and Tooltip options       | `boolean \| BreadcrumbShowTooltip` | `{ width: 150, ellipsisPos: 'end' }` |
| `className` / `style` | Compatibility class and style                  | `string` / `CSSProperties`         | -                                    |

Event: `click(item, event)`. The default slot accepts BreadcrumbItem. `separator`, `item`, and `more` slots customize their corresponding React insertion points.

### BreadcrumbItem / Breadcrumb.Item

| Prop        | Description                                                           | Type             | Default |
| ----------- | --------------------------------------------------------------------- | ---------------- | ------- |
| `href`      | Link target; the active item still renders as a span                  | `string \| null` | -       |
| `icon`      | Icon content; the `icon` slot is also available                       | `VNodeChild`     | -       |
| `noLink`    | Remove link hover/active styling                                      | `boolean`        | `false` |
| `separator` | Override the parent separator; the `separator` slot is also available | `VNodeChild`     | -       |

Event: `click(item, event)`, emitted before the parent Breadcrumb `click` event.

## Accessibility and SSR

- The root is a `nav` with the default `aria-label="Breadcrumb"`; provide a business-specific label when possible.
- The current item wrapper receives `aria-current="page"`.
- The collapse control has `role="button"`, `tabindex="0"`, and responds to Enter.
- SSR produces a static list or collapsed DOM without creating a Portal. Both root and `breadcrumb` subpath imports are SSR safe.

## React to Vue migration

| React v2.102.0         | Vue                                                 |
| ---------------------- | --------------------------------------------------- |
| `<Breadcrumb.Item>`    | `<BreadcrumbItem>` or `<Breadcrumb.Item>`           |
| `children`             | default slot                                        |
| `icon={<IconHome />}`  | `icon` slot, or `:icon="h(IconHome)"`               |
| `separator={<Icon />}` | `separator` slot, or `:separator="h(Icon)"`         |
| `renderItem(route)`    | `#item="{ route, index }"`, with the prop retained  |
| `renderMore(restItem)` | `#more="{ items, expand }"`, with the prop retained |
| `onClick(item, event)` | `@click="(item, event) => ..."`                     |

See `alignment.md` for source evidence, event order, VNode/Portal gates, and deviations.
