# Card

Card is a container for a title, cover, body, actions, and footer. This Vue implementation matches the local Semi Design `v2.102.0` DOM/classes, defaults, loading state, dark theme, and RTL behavior.

## Basic usage

```vue
<script setup lang="ts">
import { Card, Text } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/card.css';
</script>

<template>
  <Card title="Semi Design" :style="{ maxWidth: '360px' }">
    <template #headerExtraContent><Text link>More</Text></template>
    Semi Design helps teams build consistent, high-quality web applications.
  </Card>
</template>
```

## Full content and Meta

```vue
<Card footer-line shadows="always">
  <template #title>
    <CardMeta title="Semi Doc" description="Complete, usable, and polished">
      <template #avatar><Avatar color="blue">SD</Avatar></template>
    </CardMeta>
  </template>
  <template #cover><img src="/cover.png" alt="Example cover" /></template>
  Card body
  <template #actions>
    <Button theme="borderless">Details</Button>
    <Button theme="solid">Start</Button>
  </template>
  <template #footer>Footer</template>
</Card>
```

`#header` overrides `#title` and `#headerExtraContent`. Every top-level node in `#actions` receives the fixed action-item wrapper and 12px spacing.

## Loading and groups

```vue
<Card :loading="loading">Loaded content</Card>

<CardGroup :spacing="[12, 20]">
  <Card title="A">Content A</Card>
  <Card title="B">Content B</Card>
</CardGroup>

<CardGroup type="grid">
  <Card title="A">Content A</Card>
  <Card title="B">Content B</Card>
</CardGroup>
```

Loading replaces only an existing body; actions remain visible. Grid mode overrides `spacing` and merges adjacent borders with the fixed -1px margins.

## API

Card exposes `actions`, `bodyStyle`, `bordered=true`, `cover`, `footer`, `footerLine=false`, `footerStyle`, `header`, `headerExtraContent`, `headerLine=true`, `headerStyle`, `loading=false`, `shadows`, `title`, `className`, and `style`. VNode props remain available to render functions; named slots are the preferred template mapping and take precedence.

`CardMeta` exposes `avatar`, `title`, and `description` as props or named slots, and is also available as `Card.Meta`. `CardGroup` exposes `spacing` and `type="grid"`. The fixed Adapter source defaults spacing to 16 even though the upstream documentation table says 12px; this port follows runtime source.

Native `class`, `style`, `aria-*`, `data-*`, and DOM listeners fall through to the root. Card supports `aria-label`, reports loading through `aria-busy`, adds no container keyboard state, supports light/dark and RTL, and is SSR-safe.
