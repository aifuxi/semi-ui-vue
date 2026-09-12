---
title: 'Cropper'
description: 'Freely crop pictures'
locale: 'en-US'
slug: 'cropper'
category: 'show'
order: 74
englishTitle: 'Cropper'
icon: 'doc-cropper'
upstream: 'show/cropper'
---

## When to use

Cropper is used to crop pictures. It supports custom cropping box styles. The positions of the cropping box, cropped image can be adjusted by dragging. It can zoom and rotate the cropped pictures.

## Demos

Cropper is supported starting from version v2.73.0.

```vue
<script setup lang="ts">
import { Cropper } from '@aifuxi/semi-ui-vue/cropper';
import '@aifuxi/semi-theme-default/cropper.css';
</script>
```

### Basic usage

Use `src` to set the cropped image; use `shape` to set the shape of the cropping box, which defaults to square.

::demo-block{demo="cropper/en-us/Basic" title="Basic usage"}
::

### Customize crop box ratio

The initial crop box ratio can be passed through `defaultAspectRatio` (default is 1). A fixed crop box ratio can be set via `aspectRatio`.

Setting `defaultAspectRatio` only takes effect on the initial crop box ratio. When dragging, the crop box ratio will change with dragging.

When setting `aspectRatio`, the crop box ratio is fixed, and the crop box will change according to this ratio when dragging.

::demo-block{demo="cropper/en-us/AspectRatio" title="Customize crop box ratio"}
::

### Controlled rotation/zooming of images

Control image rotation and zoom through `rotate` and `zoom`, and get the latest `zoom` value through `@zoom-change`

::demo-block{demo="cropper/en-us/Controlled" title="Controlled rotation/zooming of images"}
::

### Crop box settings

The crop box style can be customized through `cropperBoxStyle`, `cropperBoxClassName`. You can use `showResizeBox` to set whether to display the adjustment blocks at the corners of the crop box.

::demo-block{demo="cropper/en-us/CropBox" title="Crop box settings"}
::

### Live Crop Preview

Use `preview` to specify a container that displays the crop result in real time.

::demo-block{demo="cropper/en-us/Preview" title="Live Crop Preview"}
::

### API Reference

### Cropper

| Property              | Description                                                   | Type                      | Default            |
| --------------------- | ------------------------------------------------------------- | ------------------------- | ------------------ |
| `aspectRatio`         | Crop box width to height ratio                                | `number`                  | `—`                |
| `class`               | Vue root class                                                | `HTMLAttributes['class']` | `—`                |
| `className`           | className                                                     | `string`                  | `—`                |
| `cropperBoxClassName` | The class name passed to the crop box                         | `string`                  | `—`                |
| `cropperBoxCls`       | Compatibility crop-box class                                  | `string`                  | `—`                |
| `cropperBoxStyle`     | The style passed to the crop box                              | `StyleValue`              | `—`                |
| `defaultAspectRatio`  | Initial crop box ratio                                        | `number`                  | `1`                |
| `fill`                | The fill color of the non-picture parts in the cropped result | `string`                  | `rgba(0, 0, 0, 0)` |
| `imgProps`            | Attributes passed through to the img tag                      | `ImgHTMLAttributes`       | `—`                |
| `maxZoom`             | Maximum zoom factor                                           | `number`                  | `3`                |
| `minZoom`             | Minimum zoom factor                                           | `number`                  | `0.1`              |
| `preview`             | The container of the preview image                            | `(() => HTMLElement)`     | `—`                |
| `rotate`              | rotation angle                                                | `number`                  | `—`                |
| `shape`               | Crop box shape                                                | `CropperShape`            | `rect`             |
| `showResizeBox`       | Whether to display the adjustment block of the cropping box   | `boolean`                 | `true`             |
| `src`                 | The address of the cropped image                              | `string`                  | `—`                |
| `style`               | Style                                                         | `StyleValue`              | `—`                |
| `zoom`                | Zoom value                                                    | `number`                  | `—`                |
| `zoomStep`            | Zoom step size                                                | `number`                  | `0.1`              |

Use `v-model:zoom`, or :zoom with `@zoom-change(zoom)`, for controlled zoom. Rotation and aspect ratio are controlled through props. `getCropperCanvas(): HTMLCanvasElement` is exposed through a CropperMethods template ref; call it after the image has loaded. A preview callback returns a real mounted container. cropperBoxCls remains a compatibility alias for cropperBoxClassName.

The component exposes no content slots. `imgProps` is declared by the pinned API, but the pinned implementation does not forward it to its internal images.

### Methods

Methods bound to component instances can be called through ref to achieve certain special interactions

| Name             | Description                         |
| ---------------- | ----------------------------------- |
| getCropperCanvas | Get the canvas of the cropped image |

## Design Token

::token-table{component="cropper"}
::

## Accessibility

Give the source and result images alternative text. Cropper dragging does not automatically provide a complete keyboard workflow; expose labeled rotation/zoom controls and an explicit crop action in your application.

## Content Guidelines

Label operations with clear verbs such as Crop, Rotate, and Zoom. Distinguish live previews from exported results.

## FAQ

**Why does the crop ratio change?** defaultAspectRatio only initializes the ratio; use aspectRatio to lock it.

**How do I export?** Call getCropperCanvas() after loading and use the standard Canvas API.

**Why is a preview missing?** The preview callback must return a mounted element with a visible size.

## React → Vue

| React                    | Vue                              |
| ------------------------ | -------------------------------- |
| `onZoomChange`           | `@zoom-change / v-model:zoom`    |
| `React ref`              | `useTemplateRef<CropperMethods>` |
| `preview document query` | `preview template ref callback`  |
