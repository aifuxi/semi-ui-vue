---
title: 'Cropper 图片裁切'
description: '通过设定裁切框的宽高比例，自由裁切图片'
type: 'show'
order: 74
icon: 'doc-cropper'
---

## 使用场景

Cropper 用于裁切图片，支持自定义裁切框样式，可通过拖动调整裁切框位置，被裁切图片位置；可缩放，旋转被裁切图片。

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/cropper` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

Cropper 从 v2.73.0 开始支持

<DemoBlock id="zh-CN-show-cropper-1" title="如何引入" kind="code" />

### 基本用法

通过 `src` 设置被裁切的图片; 可通过 `shape` 设置裁切框形状，默认为方形。

<DemoBlock id="zh-CN-show-cropper-2" title="基本用法" kind="live" />

### 自定义裁切框比例

可通过 `defaultAspectRatio` 初始的裁切框比例（默认为 1）。可通过 `aspectRatio` 设置固定的裁切框比例。

设置 `defaultAspectRatio`仅对初始的裁切框比例生效， 拖动时，裁切框比例会随着拖动而变化。

设置 `aspectRatio` 时，裁切框比例固定，拖动时将裁切框将以此比例变化。

<DemoBlock id="zh-CN-show-cropper-3" title="自定义裁切框比例" kind="live" />

### 受控旋转/缩放图片

通过 `rotate` 和 `zoom` 控制图片旋转和缩放；可监听 `zoomChange` 事件获取最新的 `zoom` 值，也可使用 `v-model:zoom`。

<DemoBlock id="zh-CN-show-cropper-4" title="受控旋转/缩放图片" kind="live" />

### 裁切框设置

可通过 `cropperBoxStyle`, `cropperBoxClassName` 自定义裁切框样式。可通过 `showResizeBox` 设置是否展示裁切框边角的调整块。

<DemoBlock id="zh-CN-show-cropper-5" title="裁切框设置" kind="live" />

### 实时预览裁切效果

通过 `preview` 指定预览容器，实时预览裁切效果。

<DemoBlock id="zh-CN-show-cropper-6" title="实时预览裁切效果" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/cropper/types.ts` 的公开类型为准。

- `v-model:zoom` 对应 `zoom` 与 `update:zoom`；`rotate` 是单向 prop。

#### Vue 用法

- `preview` 是返回预览容器的真实 callback prop，不转换为事件。
- `cropperBoxCls` 是 `cropperBoxClassName` 的兼容别名，前者优先。

#### Vue 实例方法

**CropperMethods**

| 方法               | 签名                       | 说明                |
| ------------------ | -------------------------- | ------------------- |
| `getCropperCanvas` | () =&gt; HTMLCanvasElement | 获取裁剪结果 canvas |

#### Vue 事件

**Cropper**

| 事件        | 参数           | 说明              |
| ----------- | -------------- | ----------------- |
| zoomChange  | [zoom: number] | 缩放比例变化      |
| update:zoom | [zoom: number] | 更新 v-model:zoom |

| 属性                | 说明                             | 类型                                 | 默认值             |
| ------------------- | -------------------------------- | ------------------------------------ | ------------------ |
| aspectRatio         | 裁切框比例                       | number \| undefined                  | -                  |
| class               | Vue 原生类名                     | HTMLAttributes['class'] \| undefined | -                  |
| className           | 样式类名                         | string \| undefined                  | -                  |
| cropperBoxClassName | 裁切框类名                       | string \| undefined                  | -                  |
| cropperBoxCls       | `cropperBoxClassName` 的兼容别名 | string \| undefined                  | -                  |
| cropperBoxStyle     | 裁切框样式                       | StyleValue \| undefined              | -                  |
| defaultAspectRatio  | 初始裁切框比例                   | number \| undefined                  | 1                  |
| fill                | 裁切结果中非图片部分的填充色     | string \| undefined                  | `rgba(0, 0, 0, 0)` |
| imgProps            | 透传给 img 标签的属性            | ImgHTMLAttributes \| undefined       | -                  |
| maxZoom             | 最大缩放倍数                     | number \| undefined                  | 3                  |
| minZoom             | 最小缩放倍数                     | number \| undefined                  | 0.1                |
| preview             | 返回实时预览容器的函数           | (() =&gt; HTMLElement) \| undefined  | -                  |
| rotate              | 旋转角度                         | number \| undefined                  | -                  |
| shape               | 裁切框形状                       | CropperShape \| undefined            | `rect`             |
| showResizeBox       | 是否展示调整块                   | boolean \| undefined                 | true               |
| src                 | 图片地址                         | string \| undefined                  | -                  |
| style               | 样式                             | StyleValue \| undefined              | -                  |
| zoom                | 缩放比例                         | number \| undefined                  | -                  |
| zoomStep            | 缩放步长                         | number \| undefined                  | 0.1                |

### 实例方法

绑定在组件实例上的方法，可以通过 ref 调用实现某些特殊交互

| 方法             | 签名                      | 说明                  |
| ---------------- | ------------------------- | --------------------- |
| getCropperCanvas | `() => HTMLCanvasElement` | 获取裁剪图片的 canvas |
