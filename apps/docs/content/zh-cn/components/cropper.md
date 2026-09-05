---
title: '图片裁切'
description: '通过设定裁切框的宽高比例，自由裁切图片'
locale: 'zh-CN'
slug: 'cropper'
category: 'show'
order: 74
englishTitle: 'Cropper'
icon: 'doc-cropper'
upstream: 'show/cropper'
---

## 使用场景

Cropper 用于裁切图片，支持自定义裁切框样式，可通过拖动调整裁切框位置，被裁切图片位置；可缩放，旋转被裁切图片。

## 代码演示

### 如何引入

Cropper 从 v2.73.0 开始支持

```vue
<script setup lang="ts">
import { Cropper } from '@aifuxi/semi-ui-vue/cropper';
import '@aifuxi/semi-theme-default/cropper.css';
</script>
```

### 基本用法

通过 `src` 设置被裁切的图片; 可通过 `shape` 设置裁切框形状，默认为方形。

::demo-block{demo="cropper/zh-cn/Basic" title="基本用法"}
::

### 自定义裁切框比例

可通过 `defaultAspectRatio` 初始的裁切框比例（默认为 1）。可通过 `aspectRatio` 设置固定的裁切框比例。

设置 `defaultAspectRatio`仅对初始的裁切框比例生效， 拖动时，裁切框比例会随着拖动而变化。

设置 `aspectRatio` 时，裁切框比例固定，拖动时将裁切框将以此比例变化。

::demo-block{demo="cropper/zh-cn/AspectRatio" title="自定义裁切框比例"}
::

### 受控旋转/缩放图片

通过 `rotate` 和 `zoom` 控制图片旋转和缩放, 可通过 `@zoom-change` 拿到最新的 `zoom` 值。

::demo-block{demo="cropper/zh-cn/Controlled" title="受控旋转/缩放图片"}
::

### 裁切框设置

可通过 `cropperBoxStyle`, `cropperBoxClassName` 自定义裁切框样式。可通过 `showResizeBox` 设置是否展示裁切框边角的调整块。

::demo-block{demo="cropper/zh-cn/CropBox" title="裁切框设置"}
::

### 实时预览裁切效果

通过 `preview` 指定预览容器，实时预览裁切效果。

::demo-block{demo="cropper/zh-cn/Preview" title="实时预览裁切效果"}
::

### API 参考

### Cropper

| 属性                  | 说明                         | 类型                      | 默认值             |
| --------------------- | ---------------------------- | ------------------------- | ------------------ |
| `aspectRatio`         | 裁切框比例                   | `number`                  | `—`                |
| `class`               | Vue 根节点 class             | `HTMLAttributes['class']` | `—`                |
| `className`           | 类名                         | `string`                  | `—`                |
| `cropperBoxClassName` | 裁切框类名                   | `string`                  | `—`                |
| `cropperBoxCls`       | 裁切框兼容类名               | `string`                  | `—`                |
| `cropperBoxStyle`     | 裁切框样式                   | `StyleValue`              | `—`                |
| `defaultAspectRatio`  | 初始裁切框比例               | `number`                  | `1`                |
| `fill`                | 裁切结果中非图片部分的填充色 | `string`                  | `rgba(0, 0, 0, 0)` |
| `imgProps`            | 透传给 img 标签的属性        | `ImgHTMLAttributes`       | `—`                |
| `maxZoom`             | 最大缩放倍数                 | `number`                  | `3`                |
| `minZoom`             | 最小缩放倍数                 | `number`                  | `0.1`              |
| `preview`             | 指定预览容器                 | `(() => HTMLElement)`     | `—`                |
| `rotate`              | 旋转角度                     | `number`                  | `—`                |
| `shape`               | 裁切框形状                   | `CropperShape`            | `rect`             |
| `showResizeBox`       | 是否展示调整块               | `boolean`                 | `true`             |
| `src`                 | 图片地址                     | `string`                  | `—`                |
| `style`               | 样式                         | `StyleValue`              | `—`                |
| `zoom`                | 缩放比例                     | `number`                  | `—`                |
| `zoomStep`            | 缩放步长                     | `number`                  | `0.1`              |

使用 v-model:zoom，或 :zoom 配合 `@zoom-change(zoom)` 控制缩放。旋转与裁切比例通过 prop 控制。`getCropperCanvas(): HTMLCanvasElement` 通过 CropperMethods 模板 ref 暴露，图片加载后调用。preview 回调返回实际挂载的容器。cropperBoxCls 保留为 cropperBoxClassName 的兼容别名。

### Methods

绑定在组件实例上的方法，可以通过 ref 调用实现某些特殊交互

| Name             | Description           |
| ---------------- | --------------------- |
| getCropperCanvas | 获取裁剪图片的 canvas |

## 设计变量

::token-table{component="cropper"}
::

## Accessibility

为源图片与结果图提供替代文本。Cropper 拖动不会自动提供完整键盘流程，业务中应提供有标签的旋转/缩放控件和明确裁切按钮。

## 文案规范

使用裁切、旋转、缩放等明确操作文案，区分实时预览与导出结果。

## FAQ

**裁切比例为什么变化？** defaultAspectRatio 仅用于初始化，锁定比例请使用 aspectRatio。

**如何导出？** 加载后调用 getCropperCanvas()，再使用标准 Canvas API。

**为什么实时预览不可见？** preview 必须返回已挂载且有可见尺寸的元素。

## React → Vue

| React                    | Vue                              |
| ------------------------ | -------------------------------- |
| `onZoomChange`           | `@zoom-change / v-model:zoom`    |
| `React ref`              | `useTemplateRef<CropperMethods>` |
| `preview document query` | `preview template ref callback`  |
