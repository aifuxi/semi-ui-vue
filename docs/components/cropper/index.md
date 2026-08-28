# Cropper 图片裁切

基于 Semi Design `v2.102.0` 的 Vue 3 图片裁切组件，支持移动图片和裁切框、调整比例、滚轮缩放、旋转、实时预览与 canvas 导出。

```vue
<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue';
import { Cropper, type CropperMethods } from '@workspace/ui/cropper';
import '@workspace/theme-default/cropper.css';

const zoom = shallowRef(1);
const rotate = shallowRef(0);
const cropper = useTemplateRef<CropperMethods>('cropper');

function exportImage() {
  const dataUrl = cropper.value?.getCropperCanvas().toDataURL('image/png');
  console.log(dataUrl);
}
</script>

<template>
  <Cropper
    ref="cropper"
    v-model:zoom="zoom"
    src="/photo.png"
    :rotate="rotate"
    :aspect-ratio="4 / 3"
    style="width: 550px; height: 300px"
  />
  <button type="button" @click="exportImage">裁切</button>
</template>
```

## API

| 属性                                    | 类型                               | 默认值               | 说明                                                         |
| --------------------------------------- | ---------------------------------- | -------------------- | ------------------------------------------------------------ |
| `src`                                   | `string`                           | -                    | 图片地址                                                     |
| `shape`                                 | `'rect' \| 'round' \| 'roundRect'` | `'rect'`             | 裁切框形状                                                   |
| `aspectRatio`                           | `number`                           | -                    | 固定裁切比例                                                 |
| `defaultAspectRatio`                    | `number`                           | `1`                  | 初始裁切比例，之后可自由调整                                 |
| `zoom`                                  | `number`                           | 内部 `1`             | 受控缩放值                                                   |
| `rotate`                                | `number`                           | 内部 `0`             | 受控旋转角度                                                 |
| `showResizeBox`                         | `boolean`                          | `true`               | 是否显示调整块                                               |
| `cropperBoxStyle`                       | `StyleValue`                       | -                    | 裁切框样式                                                   |
| `cropperBoxCls` / `cropperBoxClassName` | `string`                           | -                    | 裁切框类名；前者与固定源码一致                               |
| `fill`                                  | `string`                           | `'rgba(0, 0, 0, 0)'` | 导出图像空白部分的填充色                                     |
| `minZoom` / `maxZoom` / `zoomStep`      | `number`                           | `0.1 / 3 / 0.1`      | 滚轮缩放边界和步长                                           |
| `preview`                               | `() => HTMLElement`                | -                    | 返回实时预览容器                                             |
| `imgProps`                              | `ImgHTMLAttributes`                | -                    | v2.102.0 固定 React 源码未实际透传，Vue 保留类型但同样不消费 |

事件：`zoomChange(zoom)` 和 `update:zoom(zoom)` 在有效滚轮缩放后依次发出。组件实例暴露 `getCropperCanvas(): HTMLCanvasElement`。

该组件沿用固定源码的鼠标/滚轮交互，没有可聚焦控制项、键盘操作或额外 ARIA。完整证据与上游差异见 [对齐矩阵](./alignment.md) 和 [React → Vue 迁移](./react-to-vue.md)。
