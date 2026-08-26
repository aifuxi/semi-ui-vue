# Layout

Layout divides a page into top-level structural regions. The implementation targets Semi Design v2.102.0 and preserves the `.semi-layout*` and `--semi-*` compatibility surface.

## Import

```ts
import { Layout, LayoutHeader, LayoutContent, LayoutFooter, LayoutSider } from '@workspace/ui';
import '@workspace/theme-default/layout.css';
```

## Three-row layout

```vue
<template>
  <Layout>
    <LayoutHeader>Header</LayoutHeader>
    <LayoutContent>Content</LayoutContent>
    <LayoutFooter>Footer</LayoutFooter>
  </Layout>
</template>
```

## Sider and nested layout

```vue
<template>
  <Layout>
    <LayoutSider style="width: 120px">Sider</LayoutSider>
    <Layout>
      <LayoutHeader>Header</LayoutHeader>
      <LayoutContent>Content</LayoutContent>
      <LayoutFooter>Footer</LayoutFooter>
    </Layout>
  </Layout>
</template>
```

A direct or nested Sider adds `semi-layout-has-sider` to its nearest Layout. Pass `has-sider` during SSR when a dynamic slot cannot expose the structure early enough and a direction flash must be avoided.

## Responsive Sider

```vue
<script setup lang="ts">
import type { LayoutBreakpoint } from '@workspace/ui';

function handleBreakpoint(screen: LayoutBreakpoint, match: boolean) {
  console.log(screen, match);
}
</script>

<template>
  <Layout>
    <LayoutSider :breakpoint="['xs', 'md']" @breakpoint="handleBreakpoint"> Sider </LayoutSider>
    <LayoutContent>Content</LayoutContent>
  </Layout>
</template>
```

## API

### Layout

| Prop        | Type                          | Default       | Description                                    |
| ----------- | ----------------------------- | ------------- | ---------------------------------------------- |
| `prefixCls` | `string`                      | `semi-layout` | Class prefix                                   |
| `hasSider`  | `boolean`                     | -             | Declare Sider presence early, commonly for SSR |
| `tagName`   | `keyof HTMLElementTagNameMap` | `section`     | Root semantic tag                              |

### LayoutHeader / LayoutContent / LayoutFooter

| Prop        | Type                          | Default              | Description       |
| ----------- | ----------------------------- | -------------------- | ----------------- |
| `prefixCls` | `string`                      | `semi-layout`        | Class prefix      |
| `tagName`   | `keyof HTMLElementTagNameMap` | `header/main/footer` | Root semantic tag |

### LayoutSider

| Prop         | Type                 | Default       | Description                       |
| ------------ | -------------------- | ------------- | --------------------------------- |
| `prefixCls`  | `string`             | `semi-layout` | Class prefix                      |
| `breakpoint` | `LayoutBreakpoint[]` | `[]`          | Responsive breakpoints to observe |

| Event        | Arguments         | Description                                                    |
| ------------ | ----------------- | -------------------------------------------------------------- |
| `breakpoint` | `(screen, match)` | Fired for the initial match and subsequent media-query changes |

Every component exposes a default slot. Layout and the three sections accept native class, style, role, aria, data, and event attrs. Matching the pinned adapter, Sider only forwards class, style, `aria-label`, and `data-*`.

## React → Vue migration

| React             | Vue                        |
| ----------------- | -------------------------- |
| `Layout.Header`   | `LayoutHeader`             |
| `Layout.Content`  | `LayoutContent`            |
| `Layout.Footer`   | `LayoutFooter`             |
| `Layout.Sider`    | `LayoutSider`              |
| `children`        | default slot               |
| `className/style` | native `class/style` attrs |
| `onBreakpoint`    | `@breakpoint`              |
| React ref         | Vue template ref           |

The `Layout.Header/Content/Footer/Sider` static members remain available on the script export object, while named components are recommended in Vue templates.
