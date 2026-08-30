# BackTop

BackTop reveals a scroll-to-top entry after the page or a custom scroll container crosses a threshold. The local Semi Design v2.102.0 source is the sole baseline.

## Basic usage

```vue
<script setup lang="ts">
import { BackTop } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/back-top.css';
</script>

<template>
  <main>
    <p>Scroll down to reveal the bottom-right button.</p>
    <BackTop @click="console.log('Back to top')" />
  </main>
</template>
```

The default content is a light IconButton fixed `100px` from the viewport's right edge and `50px` from the bottom.

## Custom target and content

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { BackTop } from '@aifuxi/semi-ui-vue';

const panel = useTemplateRef<HTMLElement>('panel');
const getTarget = () => panel.value;
</script>

<template>
  <div ref="panel" class="scroll-panel">
    <div class="long-content">...</div>
    <BackTop
      aria-label="Back to panel top"
      role="button"
      tabindex="0"
      :duration="300"
      :target="getTarget"
      :visibility-height="160"
      :style="{ right: '40px', bottom: '40px' }"
    >
      <span class="custom-back-top">TOP</span>
    </BackTop>
  </div>
</template>
```

`target` must return the Window or Element that actually scrolls. The pinned v2.102.0 root has no button role or keyboard handler; pass `role`, `tabindex`, and `aria-*` as above and add the required application-level keyboard behavior when a fully custom semantic control is needed.

## API

| Prop                                      | Description                                                  | Type                                  | Default        |
| ----------------------------------------- | ------------------------------------------------------------ | ------------------------------------- | -------------- |
| `className`                               | Semi-compatible class; Vue `class` is also supported         | `string`                              | `''`           |
| `duration`                                | Scroll animation duration and click-throttle window          | `number`                              | `450`          |
| `style`                                   | Root style; Vue `style` is also supported                    | `CSSProperties`                       | -              |
| `target`                                  | Returns the scroll event target                              | `() => Window \| HTMLElement \| null` | `() => window` |
| `visibilityHeight`                        | Reveal threshold; comparison is strictly `scrollTop > value` | `number`                              | `400`          |
| `data-*` / `aria-*` / `role` / `tabindex` | Forwarded to the `.semi-backtop` root                        | matching HTML attributes              | -              |

| Event   | Payload               | Description                                                        |
| ------- | --------------------- | ------------------------------------------------------------------ |
| `click` | `(event: MouseEvent)` | Emitted synchronously after Foundation starts the scroll animation |

| Slot      | Description                             |
| --------- | --------------------------------------- |
| `default` | Replaces the default IconButton content |

## React → Vue migration

| React v2.102.0                              | Vue                                                         |
| ------------------------------------------- | ----------------------------------------------------------- |
| `<BackTop target={getTarget}>...</BackTop>` | `<BackTop :target="getTarget">...</BackTop>`                |
| `children`                                  | Default slot                                                |
| `onClick`                                   | `@click`                                                    |
| `className` / `style`                       | Compatibility props remain; Vue `class` / `style` also work |

See the [alignment matrix](./alignment.md) for source evidence, event ordering, animation, RTL, SSR, and deviations.
