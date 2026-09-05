---
title: '图片'
description: '用于展示和预览图片。'
locale: 'zh-CN'
slug: 'image'
category: 'show'
order: 73
englishTitle: 'Image'
icon: 'doc-image'
upstream: 'show/image'
---

## 代码演示

### 如何引入

Image, ImagePreview 从 v2.20.0 版本开始支持

```vue
<script setup lang="ts">
import { Image, ImagePreview } from '@aifuxi/semi-ui-vue/image';
import '@aifuxi/semi-theme-default/image.css';
</script>
```

### 基本用法

通过 `src` 指定图片路径即可获取一个具有预览功能的图片，通过 `width`，`height` 指定图片的宽高

::demo-block{demo="image/zh-cn/Basic" title="基本用法"}
::

### 加载失败的占位图

可通过 `fallback` 自定义加载失败的占位图，该参数类型支持 string 和 VNodeChild

::demo-block{demo="image/zh-cn/Fallback" title="加载失败的占位图"}
::

### 渐进加载

大图可通过`placeholder`实现渐进加载

::demo-block{demo="image/zh-cn/Progressive" title="渐进加载"}
::

### 自定义预览图片

可以通过设置 Image 组件的 `src` 和 `preview` 参数中的 `src` 不同来自定义预览图片

::demo-block{demo="image/zh-cn/PreviewSource" title="自定义预览图片"}
::

### 多图预览

使用 ImagePreview 包裹 Image 即可实现多图片预览

::demo-block{demo="image/zh-cn/Group" title="多图预览"}
::

### 单独使用预览组件

预览组件 ImagePreview 可以单独使用，通过 `visible` 和 `onVisibleChange` 控制是否预览，通过 `src` 传入可以预览的图片

::demo-block{demo="image/zh-cn/Standalone" title="单独使用预览组件"}
::

### 渲染在指定容器

可以通过 `getPopupContainer` 指定预览组件的父级 DOM（需要指定 `position: relative`)，图片预览将会渲染至该 DOM 中。这会改变浮层 DOM 树位置，但不会改变视图渲染位置。

::demo-block{demo="image/zh-cn/Container" title="渲染在指定容器"}
::

### 自定义预览底部操作区

可以使用 `previewMenu 插槽` 自定义预览底部操作区域

::demo-block{demo="image/zh-cn/CustomMenu" title="自定义预览底部操作区"}
::

如果想基于默认底部操作区域自定义预览底部操作区域， 可以通过 previewMenu 插槽 的 menuItems 获取默认的 VNodeChild, menuItems 是一个 VNodeChild 数组，顺序和默认底部操作栏功能区域内容顺序一致，menuItems 参数从 v2.40.0 开始支持

::demo-block{demo="image/zh-cn/ExtendMenu" title="自定义预览底部操作区"}
::

### 自定义预览顶部展示区

通过 `header 插槽` 可以自定义预览顶部展示区

::demo-block{demo="image/zh-cn/Header" title="自定义预览顶部展示区"}
::

## API 参考

### Image

| 属性              | 说明                                           | 类型                             | 默认值 |
| ----------------- | ---------------------------------------------- | -------------------------------- | ------ |
| `alt`             | 图像描述                                       | `string`                         | `—`    |
| `class`           | Vue 根节点 class                               | `HTMLAttributes['class']`        | `—`    |
| `className`       | 自定义样式类名                                 | `string`                         | `—`    |
| `crossOrigin`     | 透传给原生 img 标签的 crossorigin              | `ImageCrossOrigin`               | `—`    |
| `fallback`        | 加载失败容错地址或者自定义加载失败时的显示内容 | `string \| VNodeChild`           | `—`    |
| `height`          | 图片显示高度                                   | `string \| number`               | `—`    |
| `imageID`         | 分组中使用的图片标识                           | `number`                         | `—`    |
| `imgCls`          | 自定义样式类名，透传给 img 节点                | `HTMLAttributes['class']`        | `—`    |
| `imgStyle`        | 自定义样式，透传给 img 节点                    | `StyleValue`                     | `—`    |
| `placeholder`     | 图片未加载时候的占位内容                       | `VNodeChild`                     | `—`    |
| `preview`         | 预览参数，为 false 时候禁用预览                | `boolean \| ImagePreviewOptions` | `true` |
| `setDownloadName` | 设置图片下载名称                               | `((src: string) => string)`      | `—`    |
| `src`             | 图片获取地址                                   | `string`                         | `—`    |
| `style`           | 自定义样式                                     | `StyleValue`                     | `—`    |
| `width`           | 图片显示宽度                                   | `string \| number`               | `—`    |

### ImagePreview

| 属性                  | 说明                                                                                                                                                      | 类型                                             | 默认值                |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | --------------------- |
| `adaptiveTip`         | 适应页面操作按钮提示                                                                                                                                      | `string`                                         | `Locale.Image`        |
| `class`               | Vue 根节点 class                                                                                                                                          | `HTMLAttributes['class']`                        | `—`                   |
| `className`           | 自定义样式类名                                                                                                                                            | `string`                                         | `—`                   |
| `closable`            | 是否显示关闭按钮                                                                                                                                          | `boolean`                                        | `true`                |
| `closeOnEsc`          | 点击 esc 关闭预览                                                                                                                                         | `boolean`                                        | `true`                |
| `crossOrigin`         | 透传给原生 img 标签的 crossorigin                                                                                                                         | `ImageCrossOrigin`                               | `—`                   |
| `currentIndex`        | 受控属性，当前预览图片下标                                                                                                                                | `number`                                         | `—`                   |
| `defaultCurrentIndex` | 首次展示图片下标                                                                                                                                          | `number`                                         | `0`                   |
| `defaultVisible`      | 首次是否开启预览                                                                                                                                          | `boolean`                                        | `false`               |
| `disableDownload`     | 禁用下载                                                                                                                                                  | `boolean`                                        | `false`               |
| `downloadTip`         | 下载操作按钮提示                                                                                                                                          | `string`                                         | `Locale.Image`        |
| `getPopupContainer`   | 指定父级 DOM，弹层将会渲染至该 DOM 中，自定义需要设置 container `position: relative` 这会改变浮层 DOM 树位置，但不会改变视图渲染位置。                    | `(() => HTMLElement)`                            | `document.body`       |
| `infinite`            | 是否无限循环                                                                                                                                              | `boolean`                                        | `false`               |
| `initialZoom`         | 预览图片初始缩放比例，仅在首次打开或切换到该图片时生效一次，会被 minZoom/maxZoom 限制                                                                     | `number`                                         | `—`                   |
| `lazyLoad`            | 是否开启懒加载                                                                                                                                            | `boolean`                                        | `true`                |
| `lazyLoadMargin`      | 传给 options 中的rootMargin 参数，参考 [Intersection Observer API](https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API#interfaces) | `string`                                         | `0px 100px 100px 0px` |
| `maskClosable`        | 点击遮罩是否可关闭                                                                                                                                        | `boolean`                                        | `true`                |
| `maxZoom`             | 预览图片最大缩放比例                                                                                                                                      | `number`                                         | `5`                   |
| `minZoom`             | 预览图片最小缩放比例                                                                                                                                      | `number`                                         | `0.1`                 |
| `nextTip`             | 下一步操作按钮提示                                                                                                                                        | `string`                                         | `Locale.Image`        |
| `originTip`           | 原始尺寸操作按钮提示                                                                                                                                      | `string`                                         | `Locale.Image`        |
| `preLoad`             | 是否开启预加载                                                                                                                                            | `boolean`                                        | `true`                |
| `preLoadGap`          | 预加载的步长                                                                                                                                              | `number`                                         | `2`                   |
| `prevTip`             | 上一步操作按钮提示                                                                                                                                        | `string`                                         | `Locale.Image`        |
| `previewCls`          | 自定义预览样式类名                                                                                                                                        | `string`                                         | `—`                   |
| `previewStyle`        | 自定义预览样式                                                                                                                                            | `StyleValue`                                     | `—`                   |
| `previewTitle`        | 自定义预览 title                                                                                                                                          | `VNodeChild`                                     | `—`                   |
| `renderCloseIcon`     | 自定义关闭icon                                                                                                                                            | `VNodeChild \| (() => VNodeChild)`               | `—`                   |
| `renderHeader`        | 自定义渲染预览顶部信息                                                                                                                                    | `((title: VNodeChild) => VNodeChild)`            | `—`                   |
| `renderLeftIcon`      | 自定义向左icon                                                                                                                                            | `VNodeChild \| ((index: number) => VNodeChild)`  | `—`                   |
| `renderPreviewMenu`   | 自定义渲染预览底部菜单信息                                                                                                                                | `((props: ImagePreviewMenuProps) => VNodeChild)` | `—`                   |
| `renderRightIcon`     | 自定义向右icon                                                                                                                                            | `VNodeChild \| ((index: number) => VNodeChild)`  | `—`                   |
| `rotateTip`           | 旋转操作按钮提示                                                                                                                                          | `string`                                         | `Locale.Image`        |
| `setDownloadName`     | 设置图片下载名称                                                                                                                                          | `((src: string) => string)`                      | `—`                   |
| `showTooltip`         | 是否展示底部操作区提示                                                                                                                                    | `boolean`                                        | `false`               |
| `src`                 | 图片获取地址                                                                                                                                              | `string \| string[]`                             | `—`                   |
| `style`               | 自定义样式                                                                                                                                                | `StyleValue`                                     | `—`                   |
| `viewerVisibleDelay`  | 隐藏预览操作按钮前的无操作时长                                                                                                                            | `number`                                         | `10000`               |
| `visible`             | 受控属性，是否预览                                                                                                                                        | `boolean`                                        | `—`                   |
| `zIndex`              | 预览层层级                                                                                                                                                | `number`                                         | `1070`                |
| `zoomInTip`           | 放大操作按钮提示                                                                                                                                          | `string`                                         | `Locale.Image`        |
| `zoomOutTip`          | 缩小操作按钮提示                                                                                                                                          | `string`                                         | `Locale.Image`        |
| `zoomStep`            | 图片每次缩小/放大比例                                                                                                                                     | `number`                                         | `0.1`                 |

### MenuProps

| 属性              | 说明                                         | 类型             | 默认值 |
| ----------------- | -------------------------------------------- | ---------------- | ------ |
| `min`             | 图片缩放最小比例                             | `number`         | `—`    |
| `max`             | 图片缩放最大比例                             | `number`         | `—`    |
| `step`            | 缩放的比例步长                               | `number`         | `—`    |
| `curPage`         | 当前图片页下标                               | `number`         | `—`    |
| `totalNum`        | 可预览的总图片数                             | `number`         | `—`    |
| `zoom`            | 当前图片缩放比例                             | `number`         | `—`    |
| `ratio`           | 原始尺寸或适应页面按钮状态                   | `ImageRatioType` | `—`    |
| `disabledPrev`    | 是否禁用向左切换按钮                         | `boolean`        | `—`    |
| `disabledNext`    | 是否禁用向右切换按钮                         | `boolean`        | `—`    |
| `disabledZoomIn`  | 是否禁用放大                                 | `boolean`        | `—`    |
| `disabledZoomOut` | 是否禁用缩小                                 | `boolean`        | `—`    |
| `disableDownload` | 禁用下载                                     | `boolean`        | `—`    |
| `onDownload`      | 图片下载回调函数                             | `() => void`     | `—`    |
| `onNext`          | 向后切换图片的回调                           | `() => void`     | `—`    |
| `onPrev`          | 向前切换图片的回调                           | `() => void`     | `—`    |
| `onZoomIn`        | 图片放大时的回调函数                         | `() => void`     | `—`    |
| `onZoomOut`       | 图片缩小时的回调函数                         | `() => void`     | `—`    |
| `onRatioClick`    | 切换原始尺寸/适应页面                        | `() => void`     | `—`    |
| `onRotateLeft`    | 旋转图片的回调                               | `() => void`     | `—`    |
| `onRotateRight`   | 顺时针旋转图片的调用函数                     | `() => void`     | `—`    |
| `menuItems`       | 默认底部预览操作区域功能按钮 VNodeChild 数组 | `VNodeChild[]`   | `—`    |

Image 支持原生图片属性，width/height 接受字符串或数字，提供 #placeholder、#fallback 插槽。事件：`@click(event: MouseEvent)`、`@load(event: Event)`、`@error(event: Event)`。

ImagePreview 支持 v-model:visible、v-model:currentIndex。事件：visible-change(visible)、change(index)、close()、next(index)、prev(index)、zoom-in(zoom)、zoom-out(zoom)、ratio-change(type)、rotate-left(angle)、download(src, index)、download-error(src)，使用 @ 绑定。Image.preview 接受 ImagePreviewOptions，其中保留对应 onX 函数回调。

插槽：default 接收 Image 子节点；`#header="{ title }"`、`#previewMenu="menu"`、`#leftIcon="{ index }"`、`#rightIcon="{ index }"`、#closeIcon 定制预览层。对应 render 属性仍可返回 Vue 节点。MenuProps 导出名为 ImagePreviewMenuProps，其操作回调仍是可调用函数；缩放状态正确名称为 disabledZoomIn/disabledZoomOut。操作提示文案随 Locale 切换。

## 设计变量

::token-table{component="image"}
::

## Accessibility

为图片提供有意义的 alt，为自定义预览操作提供名称并保留禁用状态。closeOnEsc 开启时可按 Escape 关闭，同时保留可见关闭操作。

## 文案规范

图片描述简洁地说明内容；组内预览标题应能区分图片。

## FAQ

**如何禁用预览？** 设置 preview=false。

**为什么自定义容器位置不对？** 返回实际挂载的容器，并设置 position:relative。

**为什么下载或裁切导出受限？** 远程图片需要正确的 CORS 授权；示例使用同源本地 SVG。

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
