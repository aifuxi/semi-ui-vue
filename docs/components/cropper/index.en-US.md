# Cropper

A Vue 3 image cropper aligned with Semi Design `v2.102.0`. It supports moving the image and crop box, ratio resizing, wheel zoom, rotation, live preview, and canvas export.

```vue
<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue';
import { Cropper, type CropperMethods } from '@workspace/ui/cropper';
import '@workspace/theme-default/cropper.css';

const zoom = shallowRef(1);
const cropper = useTemplateRef<CropperMethods>('cropper');

function exportImage() {
  console.log(cropper.value?.getCropperCanvas().toDataURL('image/png'));
}
</script>

<template>
  <Cropper
    ref="cropper"
    v-model:zoom="zoom"
    src="/photo.png"
    :rotate="0"
    :aspect-ratio="4 / 3"
    style="width: 550px; height: 300px"
  />
  <button type="button" @click="exportImage">Crop</button>
</template>
```

## API

| Property                                | Type                               | Default              | Description                                                                                              |
| --------------------------------------- | ---------------------------------- | -------------------- | -------------------------------------------------------------------------------------------------------- |
| `src`                                   | `string`                           | -                    | Image URL                                                                                                |
| `shape`                                 | `'rect' \| 'round' \| 'roundRect'` | `'rect'`             | Crop-box shape                                                                                           |
| `aspectRatio`                           | `number`                           | -                    | Fixed crop ratio                                                                                         |
| `defaultAspectRatio`                    | `number`                           | `1`                  | Initial ratio before free resizing                                                                       |
| `zoom`                                  | `number`                           | internal `1`         | Controlled zoom                                                                                          |
| `rotate`                                | `number`                           | internal `0`         | Controlled rotation angle                                                                                |
| `showResizeBox`                         | `boolean`                          | `true`               | Shows resize handles                                                                                     |
| `cropperBoxStyle`                       | `StyleValue`                       | -                    | Crop-box styles                                                                                          |
| `cropperBoxCls` / `cropperBoxClassName` | `string`                           | -                    | Crop-box class; the first name matches the pinned source                                                 |
| `fill`                                  | `string`                           | `'rgba(0, 0, 0, 0)'` | Fill for exported areas outside the image                                                                |
| `minZoom` / `maxZoom` / `zoomStep`      | `number`                           | `0.1 / 3 / 0.1`      | Wheel zoom limits and step                                                                               |
| `preview`                               | `() => HTMLElement`                | -                    | Returns the live-preview container                                                                       |
| `imgProps`                              | `ImgHTMLAttributes`                | -                    | The pinned v2.102.0 React render does not forward it; Vue retains the type and the same runtime behavior |

`zoomChange(zoom)` and `update:zoom(zoom)` are emitted in that order after a valid wheel zoom. The component instance exposes `getCropperCanvas(): HTMLCanvasElement`.

The pinned component is pointer/wheel-only and adds no focus target, keyboard contract, or ARIA. See the [alignment matrix](./alignment.md) and [React → Vue migration](./react-to-vue.md) for evidence and source discrepancies.
