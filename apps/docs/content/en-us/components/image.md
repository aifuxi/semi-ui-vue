---
title: 'Image'
description: 'Used to display and preview images.'
locale: 'en-US'
slug: 'image'
category: 'show'
order: 73
englishTitle: 'Image'
icon: 'doc-image'
upstream: 'show/image'
---

## Demos

### How to import

Image, ImagePreview supported since v2.20.0

```vue
<script setup lang="ts">
import { Image, ImagePreview } from '@aifuxi/semi-ui-vue/image';
import '@aifuxi/semi-theme-default/image.css';
</script>
```

### Basic usage

You can get an image with preview function by specifying the image path through `src`, and specify the width and height of the image through `width`, `height`

::demo-block{demo="image/en-us/Basic" title="Basic usage"}
::

### Loading failed placeholder

You can customize the placeholder for failed loading through `fallback`, which supports string and VNodeChild

::demo-block{demo="image/en-us/Fallback" title="Loading failed placeholder"}
::

### Progressive loading

Large images can be progressively loaded through `placeholder`

::demo-block{demo="image/en-us/Progressive" title="Progressive loading"}
::

### Customize the preview image

You can customize the preview image by setting the `src` of the Image component to be different from the `src` in the `preview` parameter

::demo-block{demo="image/en-us/PreviewSource" title="Customize the preview image"}
::

### Multi-image preview

Use ImagePreview to wrap Image to achieve multi-image preview

::demo-block{demo="image/en-us/Group" title="Multi-image preview"}
::

### Use the preview component alone

The preview component ImagePreview can be used alone, through `visible` and `onVisibleChange` to control whether to preview, and `src` to pass in the image that can be previewed

::demo-block{demo="image/en-us/Standalone" title="Use the preview component alone"}
::

### Render in the specified container

You can specify the parent DOM of the preview component through `getPopupContainer` (you need to specify `position: relative`), and the image preview will be rendered into this DOM. This will change the DOM tree position, but not the view's rendering position.

::demo-block{demo="image/en-us/Container" title="Render in the specified container"}
::

### Customize the bottom operation area of the preview

The bottom action area of the preview can be customized using `previewMenu slot`

::demo-block{demo="image/en-us/CustomMenu" title="Customize the bottom operation area of the preview"}
::

If you want to customize the preview bottom operation area based on the default bottom operation area, you can get the default VNodeChilds through the menuItems of previewMenu slot. menuItems is an array of VNodeChilds, and the order is consistent with the content order of the default bottom operation bar area. The menuItems parameter is supported from v2.40.0.

::demo-block{demo="image/en-us/ExtendMenu" title="Customize the bottom operation area of the preview"}
::

### Customize the preview top display area

You can customize the preview top display area through `header slot`

::demo-block{demo="image/en-us/Header" title="Customize the preview top display area"}
::

## API Reference

### Image

| Property          | Description                                               | Type                             | Default |
| ----------------- | --------------------------------------------------------- | -------------------------------- | ------- |
| `alt`             | Image description                                         | `string`                         | `—`     |
| `class`           | Vue root class                                            | `HTMLAttributes['class']`        | `—`     |
| `className`       | custom style class name                                   | `string`                         | `—`     |
| `crossOrigin`     | Passthrough to the crossorigin of the native img tag      | `ImageCrossOrigin`               | `—`     |
| `fallback`        | Custom loading failed display content                     | `string \| VNodeChild`           | `—`     |
| `height`          | Image display height                                      | `string \| number`               | `—`     |
| `imageID`         | Image identifier within a group                           | `number`                         | `—`     |
| `imgCls`          | Custom style class name, transparently passed to img node | `HTMLAttributes['class']`        | `—`     |
| `imgStyle`        | Custom styles, transparently passed to img node           | `StyleValue`                     | `—`     |
| `placeholder`     | Placeholder content when the image is not loaded          | `VNodeChild`                     | `—`     |
| `preview`         | Preview parameter, when false, disable preview            | `boolean \| ImagePreviewOptions` | `true`  |
| `setDownloadName` | Set the name of the downloaded image                      | `((src: string) => string)`      | `—`     |
| `src`             | Image acquisition address                                 | `string`                         | `—`     |
| `style`           | custom style                                              | `StyleValue`                     | `—`     |
| `width`           | Image display width                                       | `string \| number`               | `—`     |

### ImagePreview

| Property              | Description                                                                                                                                                                                                                  | Type                                             | Default               |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | --------------------- |
| `adaptiveTip`         | Adapt to page action button prompts                                                                                                                                                                                          | `string`                                         | `Locale.Image`        |
| `class`               | Vue root class                                                                                                                                                                                                               | `HTMLAttributes['class']`                        | `—`                   |
| `className`           | custom style class name                                                                                                                                                                                                      | `string`                                         | `—`                   |
| `closable`            | Whether to show the close button                                                                                                                                                                                             | `boolean`                                        | `true`                |
| `closeOnEsc`          | Hit esc to close the preview                                                                                                                                                                                                 | `boolean`                                        | `true`                |
| `crossOrigin`         | Passthrough to the crossorigin of the native img tag                                                                                                                                                                         | `ImageCrossOrigin`                               | `—`                   |
| `currentIndex`        | Controlled property, the current preview image subscript                                                                                                                                                                     | `number`                                         | `—`                   |
| `defaultCurrentIndex` | First display image subscript                                                                                                                                                                                                | `number`                                         | `0`                   |
| `defaultVisible`      | Whether to open the preview for the first time                                                                                                                                                                               | `boolean`                                        | `false`               |
| `disableDownload`     | Disable downloads                                                                                                                                                                                                            | `boolean`                                        | `false`               |
| `downloadTip`         | Download action button prompt                                                                                                                                                                                                | `string`                                         | `Locale.Image`        |
| `getPopupContainer`   | Specify the parent DOM, and the pop-up layer will be rendered into the DOM. For customization, you need to set container `position: relative` This will change the DOM tree position, but not the view's rendering position. | `(() => HTMLElement)`                            | `document.body`       |
| `infinite`            | Whether to loop infinitely                                                                                                                                                                                                   | `boolean`                                        | `false`               |
| `initialZoom`         | Initial zoom ratio for preview image, only takes effect once when first opening or switching to the image, will be clamped by minZoom/maxZoom                                                                                | `number`                                         | `—`                   |
| `lazyLoad`            | Whether to enable lazy loading                                                                                                                                                                                               | `boolean`                                        | `true`                |
| `lazyLoadMargin`      | Pass to the rootMargin parameter in options, refer to [Intersection Observer API](https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API#interfaces)                                                     | `string`                                         | `0px 100px 100px 0px` |
| `maskClosable`        | Whether the mask can be closed by clicking                                                                                                                                                                                   | `boolean`                                        | `true`                |
| `maxZoom`             | Maximum zoom ratio for preview image                                                                                                                                                                                         | `number`                                         | `5`                   |
| `minZoom`             | Minimum zoom ratio for preview image                                                                                                                                                                                         | `number`                                         | `0.1`                 |
| `nextTip`             | Next action button prompt                                                                                                                                                                                                    | `string`                                         | `Locale.Image`        |
| `originTip`           | Original size action button tips                                                                                                                                                                                             | `string`                                         | `Locale.Image`        |
| `preLoad`             | Whether to enable preloading                                                                                                                                                                                                 | `boolean`                                        | `true`                |
| `preLoadGap`          | Preloaded step size                                                                                                                                                                                                          | `number`                                         | `2`                   |
| `prevTip`             | Previous operation button prompt                                                                                                                                                                                             | `string`                                         | `Locale.Image`        |
| `previewCls`          | Custom preview style class name                                                                                                                                                                                              | `string`                                         | `—`                   |
| `previewStyle`        | Custom preview style                                                                                                                                                                                                         | `StyleValue`                                     | `—`                   |
| `previewTitle`        | Custom preview title                                                                                                                                                                                                         | `VNodeChild`                                     | `—`                   |
| `renderCloseIcon`     | custom close icon                                                                                                                                                                                                            | `VNodeChild \| (() => VNodeChild)`               | `—`                   |
| `renderHeader`        | Custom render preview top info                                                                                                                                                                                               | `((title: VNodeChild) => VNodeChild)`            | `—`                   |
| `renderLeftIcon`      | custom left icon                                                                                                                                                                                                             | `VNodeChild \| ((index: number) => VNodeChild)`  | `—`                   |
| `renderPreviewMenu`   | Custom render preview bottom menu information                                                                                                                                                                                | `((props: ImagePreviewMenuProps) => VNodeChild)` | `—`                   |
| `renderRightIcon`     | custom right icon                                                                                                                                                                                                            | `VNodeChild \| ((index: number) => VNodeChild)`  | `—`                   |
| `rotateTip`           | Tips for rotating action buttons                                                                                                                                                                                             | `string`                                         | `Locale.Image`        |
| `setDownloadName`     | Set the name of the downloaded image                                                                                                                                                                                         | `((src: string) => string)`                      | `—`                   |
| `showTooltip`         | Whether to display the bottom operation area prompt                                                                                                                                                                          | `boolean`                                        | `false`               |
| `src`                 | Image acquisition address                                                                                                                                                                                                    | `string \| string[]`                             | `—`                   |
| `style`               | custom style                                                                                                                                                                                                                 | `StyleValue`                                     | `—`                   |
| `viewerVisibleDelay`  | The length of time of inactivity before hiding the preview action button                                                                                                                                                     | `number`                                         | `10000`               |
| `visible`             | Controlled property, whether to preview                                                                                                                                                                                      | `boolean`                                        | `—`                   |
| `zIndex`              | Preview layer hierarchy                                                                                                                                                                                                      | `number`                                         | `1070`                |
| `zoomInTip`           | Zoom in action button tips                                                                                                                                                                                                   | `string`                                         | `Locale.Image`        |
| `zoomOutTip`          | Zoom out action button prompt                                                                                                                                                                                                | `string`                                         | `Locale.Image`        |
| `zoomStep`            | Image reduction/enlargement ratio each time                                                                                                                                                                                  | `number`                                         | `0.1`                 |

### MenuProps

| Property          | Description                                                            | Type             | Default |
| ----------------- | ---------------------------------------------------------------------- | ---------------- | ------- |
| `min`             | The minimum ratio of image scaling                                     | `number`         | `—`     |
| `max`             | The maximum ratio of image zoom                                        | `number`         | `—`     |
| `step`            | Step size of scaling                                                   | `number`         | `—`     |
| `curPage`         | Current image page subscript                                           | `number`         | `—`     |
| `totalNum`        | The total number of images that can be previewed                       | `number`         | `—`     |
| `zoom`            | Current image magnification ratio                                      | `number`         | `—`     |
| `ratio`           | Original size or Fit to page button state                              | `ImageRatioType` | `—`     |
| `disabledPrev`    | Whether to disable the left toggle button                              | `boolean`        | `—`     |
| `disabledNext`    | Whether to disable the right toggle button                             | `boolean`        | `—`     |
| `disabledZoomIn`  | Whether zooming in is disabled                                         | `boolean`        | `—`     |
| `disabledZoomOut` | Whether zooming out is disabled                                        | `boolean`        | `—`     |
| `disableDownload` | Disable downloads                                                      | `boolean`        | `—`     |
| `onDownload`      | Image download callback function                                       | `() => void`     | `—`     |
| `onNext`          | Callback for switching pictures backwards                              | `() => void`     | `—`     |
| `onPrev`          | Callback for switching the picture forward                             | `() => void`     | `—`     |
| `onZoomIn`        | The callback function when the image is zoomed in                      | `() => void`     | `—`     |
| `onZoomOut`       | The callback function when the image is zoomed out                     | `() => void`     | `—`     |
| `onRatioClick`    | Toggle real size and adaptation                                        | `() => void`     | `—`     |
| `onRotateLeft`    | Callback for rotating the image                                        | `() => void`     | `—`     |
| `onRotateRight`   | Call function to rotate the image clockwise                            | `() => void`     | `—`     |
| `menuItems`       | Default bottom preview operation area function button VNodeChild array | `VNodeChild[]`   | `—`     |

Image supports native image attributes, width/height as strings or numbers, and `#placeholder` / `#fallback`. It emits `@click(event: MouseEvent)`, `@load(event: Event)`, and `@error(event: Event)`.

ImagePreview supports `v-model:visible` and `v-model:currentIndex`. Events: `visible-change(visible)`, `change(index)`, `close()`, `next(index)`, `prev(index)`, `zoom-in(zoom)`, `zoom-out(zoom)`, `ratio-change(type)`, `rotate-left(angle)`, `download(src, index)`, and `download-error(src)`. Bind them with @. Image.preview accepts ImagePreviewOptions, including the matching onX function callbacks.

Slots: `default` contains Image children; `#header="{ title }"`, `#previewMenu="menu"`, `#leftIcon="{ index }"`, `#rightIcon="{ index }"`, and `#closeIcon` customize the viewer. Matching render props remain available and return Vue nodes. MenuProps is exported as ImagePreviewMenuProps; its callbacks remain callable functions, and disabledZoomIn/disabledZoomOut are the correct zoom-state names. Tip text follows the selected locale.

## Design Token

::token-table{component="image"}
::

## Accessibility

Provide meaningful alt text. Name custom preview controls and preserve disabled states. The viewer supports Escape when closeOnEsc is enabled; keep a visible close action.

## Content Guidelines

Keep image descriptions concise and describe the image itself. Viewer titles should distinguish images in a group.

## FAQ

**How do I disable preview?** Set preview=false.

**Why does a custom popup appear incorrectly?** Return a mounted container and give it position:relative.

**Why are download or crop exports blocked?** A remote image must permit the appropriate CORS access. The demos use same-origin local SVGs.

## React → Vue

| React                                                | Vue                                      |
| ---------------------------------------------------- | ---------------------------------------- |
| `children`                                           | `default slot`                           |
| `placeholder / fallback ReactNode`                   | `#placeholder / #fallback`               |
| `renderHeader`                                       | `#header="{ title }"`                    |
| `renderPreviewMenu`                                  | `#previewMenu="menu"`                    |
| `renderLeftIcon / renderRightIcon / renderCloseIcon` | `#leftIcon / #rightIcon / #closeIcon`    |
| `visible / currentIndex + callbacks`                 | `v-model:visible / v-model:currentIndex` |
| `onLoad / onError / onClick`                         | `@load / @error / @click`                |
