# Banner

Banner presents page-level or container-level status and notices. This implementation uses the local Semi Design v2.102.0 source as its only baseline and preserves the four types, DOM/classes, close behavior, theme, RTL, and accessibility contracts.

## Basic usage

```vue
<script setup lang="ts">
import { Banner } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/banner.css';
</script>

<template>
  <Banner description="A new version is available" @close="handleClose" />
</template>
```

## Container mode and custom content

```vue
<template>
  <Banner :full-mode="false" bordered type="warning">
    <template #title>Configuration incomplete</template>
    <template #description>Add the application key before publishing.</template>
    <button>Configure now</button>
  </Banner>
</template>
```

Passing `null` through `:icon="null"` removes the status icon. Passing `null` through `:close-icon="null"` removes the whole close button.

## API

| Prop                  | Description                                      | Type                                           | Default     |
| --------------------- | ------------------------------------------------ | ---------------------------------------------- | ----------- |
| `type`                | Notice type                                      | `'info' \| 'success' \| 'danger' \| 'warning'` | `'info'`    |
| `fullMode`            | Whether to use full-width mode                   | `boolean`                                      | `true`      |
| `bordered`            | Shows a border in container mode                 | `boolean`                                      | `false`     |
| `title`               | Title content; the named slot wins               | `VNodeChild`                                   | -           |
| `description`         | Description content; the named slot wins         | `VNodeChild`                                   | -           |
| `icon`                | Custom status icon; `null` hides it              | `VNodeChild`                                   | by type     |
| `closeIcon`           | Custom close icon; `null` hides the close button | `VNodeChild`                                   | `IconClose` |
| `class` / `className` | Vue/compatibility class on the root alert        | Vue class                                      | -           |
| `style`               | Inline style on the root alert                   | `StyleValue`                                   | -           |

| Event   | Payload               | Description                            |
| ------- | --------------------- | -------------------------------------- |
| `close` | `(event: MouseEvent)` | Fires before the Banner DOM is removed |

| Slot          | Description                     |
| ------------- | ------------------------------- |
| `default`     | Extra actions or custom content |
| `title`       | Replaces the `title` prop       |
| `description` | Replaces the `description` prop |
| `icon`        | Replaces the `icon` prop        |
| `closeIcon`   | Replaces the `closeIcon` prop   |

## Accessibility and SSR

- The root always has `role="alert"`.
- The default close button has `aria-label="Close"` and supports Tab focus plus Enter/Space activation.
- SSR renders the complete initial Banner. Foundation initialization happens only after client mount and imports do not access DOM globals.

## React → Vue

See [react-to-vue.md](./react-to-vue.md) for the migration map and [alignment.md](./alignment.md) for source evidence and acceptance coverage.
