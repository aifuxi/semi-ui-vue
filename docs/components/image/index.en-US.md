# Image

Vue 3 image display and preview components aligned with Semi Design v2.102.0. `Image` is the default export; grouped preview is the named `ImagePreview` export.

```vue
<script setup lang="ts">
import { Image, ImagePreview } from '@workspace/ui';
import '@workspace/theme-default/image.css';
</script>

<template>
  <ImagePreview :lazy-load="false">
    <Image src="/one.png" :width="160" :height="100" :preview="{ previewTitle: 'First' }" />
    <Image src="/two.png" :width="160" :height="100" :preview="{ previewTitle: 'Second' }" />
  </ImagePreview>
</template>
```

## Image API

| Prop                       | Type                             | Default | Description                                                  |
| -------------------------- | -------------------------------- | ------- | ------------------------------------------------------------ |
| `src`                      | `string`                         | -       | Image source                                                 |
| `width` / `height`         | `string \| number`               | -       | Size both root and img; numbers use CSS px semantics         |
| `alt` / `crossOrigin`      | native image types               | -       | Forwarded to img                                             |
| `className` / `style`      | Vue class / style                | -       | React-compatible root props; native `class` is also accepted |
| `imgCls` / `imgStyle`      | Vue class / style                | -       | Applied only to the inner img                                |
| `placeholder` / `fallback` | `VNodeChild`                     | -       | Same-named slots take precedence                             |
| `preview`                  | `boolean \| ImagePreviewOptions` | `true`  | Disable, enable, or configure single-image preview           |
| `setDownloadName`          | `(src) => string`                | -       | Customize the downloaded filename                            |

Events are `click`, `load`, and `error`. Unconsumed native attributes such as `aria-*`, `data-*`, and `decoding` are forwarded to the img.

## ImagePreview API

- Data and state: `src`, `visible/defaultVisible`, `currentIndex/defaultCurrentIndex`, plus `v-model:visible` and `v-model:currentIndex`.
- Navigation: `infinite=false`, `closable=true`, `closeOnEsc=true`, and `maskClosable=true`.
- Zoom: `zoomStep=0.1`, `minZoom=0.1`, `maxZoom=5`, and `initialZoom`.
- Loading: `lazyLoad=true`, `lazyLoadMargin="0px 100px 100px 0px"`, `preLoad=true`, and `preLoadGap=2`.
- Portal: `getPopupContainer` and `zIndex=1070`; the default body portal locks body scrolling while open.
- Menu and copy: `showTooltip`, the `*Tip` props, `disableDownload`, and `setDownloadName`.

Events include `visibleChange`, `change`, `close`, `prev`, `next`, `zoomIn`, `zoomOut`, `ratioChange`, `rotateLeft`, `download`, and `downloadError`. Customize content through `#header`, `#previewMenu`, `#leftIcon`, `#rightIcon`, and `#closeIcon`.

See [alignment.md](./alignment.md) for source, DOM, keyboard, theme, RTL, SSR, and acceptance evidence, and [react-to-vue.md](./react-to-vue.md) for migration.
