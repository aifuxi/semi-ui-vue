# Lottie Animation

Lottie manages the `lottie-web` container, instance creation, parameter updates, and teardown in
Vue. It follows the pinned local Semi Design v2.102.0 source and locks `lottie-web@5.13.0`.

## Basic usage

Import animation JSON with the application when possible instead of relying on a remote demo CDN.

```vue
<script setup lang="ts">
import animationData from './loading.json';
import { Lottie } from '@aifuxi/semi-ui-vue';
</script>

<template>
  <Lottie :params="{ animationData, autoplay: true, loop: true }" width="300px" height="300px" />
</template>
```

`params` is completed with `renderer: 'svg'`, `loop: true`, and `autoplay: true`. Explicit caller
values win, so `loop: false` and `autoplay: false` are preserved. A `path` can be used instead of
`animationData`.

## Control the animation instance

```vue
<script setup lang="ts">
import type { LottieAnimationItem } from '@aifuxi/semi-ui-vue';

let animation: LottieAnimationItem | null = null;
</script>

<template>
  <Lottie
    :params="{ animationData }"
    :get-animation-instance="(instance) => (animation = instance)"
  />
  <button @click="animation?.pause()">Pause</button>
</template>
```

The pinned v2.102.0 Adapter calls `getAnimationInstance` twice with the same instance during the
initial mount. When `params` is replaced with a deeply different value, the old instance is
destroyed before one callback with the new instance. Keep the callback idempotent.

## Caller-owned container

Set `params.container` to render into an Element owned by the caller. Lottie then renders no
internal root and does not copy class, style, data, or ARIA attributes to that Element. The caller
owns the container DOM and semantics; the component still destroys the animation instance.

## API

| Property               | Description                                                                      | Type                 | Default  |
| ---------------------- | -------------------------------------------------------------------------------- | -------------------- | -------- |
| `params`               | `lottie.loadAnimation` parameters; `container` is optional for the internal mode | `LottieParams`       | required |
| `width`                | Internal container width                                                         | `string`             | -        |
| `height`               | Internal container height                                                        | `string`             | -        |
| `className` / `class`  | Internal container classes                                                       | Vue class value      | -        |
| `style`                | Internal container style; overrides width/height                                 | Vue style value      | -        |
| `getAnimationInstance` | Receives the current AnimationItem                                               | `(instance) => void` | -        |
| `getLottie`            | Receives the global LottiePlayer                                                 | `(lottie) => void`   | -        |

`Lottie.getLottie()` provides the same static access point as the reference Adapter. The player is
a browser runtime capability: SSR renders only the empty internal container and creates the
animation after hydration.

## Accessibility and SSR

The component does not invent a role, tabindex, or keyboard behavior. ARIA/data attributes pass to
the internal container; configure generated SVG titles, descriptions, and focusability through
`params.rendererSettings`. Both the root package and `@aifuxi/semi-ui-vue/lottie` are SSR-safe to
import.

See the [alignment matrix](./alignment.md) for the complete API, DOM, lifecycle, visual, and
deviation evidence, and [React → Vue](./react-to-vue.md) for migration details.
