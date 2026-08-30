# Image 图片

Vue 3 对齐 Semi Design v2.102.0 的图片展示与预览组件。默认导出 `Image`，分组预览使用具名导出 `ImagePreview`。

```vue
<script setup lang="ts">
import { Image, ImagePreview } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/image.css';
</script>

<template>
  <ImagePreview :lazy-load="false">
    <Image src="/one.png" :width="160" :height="100" :preview="{ previewTitle: '第一张' }" />
    <Image src="/two.png" :width="160" :height="100" :preview="{ previewTitle: '第二张' }" />
  </ImagePreview>
</template>
```

## Image API

| 属性                       | 类型                             | 默认值 | 说明                                             |
| -------------------------- | -------------------------------- | ------ | ------------------------------------------------ |
| `src`                      | `string`                         | -      | 原图地址                                         |
| `width` / `height`         | `string \| number`               | -      | 同时约束根节点和 img；数字按 px 处理             |
| `alt` / `crossOrigin`      | 原生图片类型                     | -      | 透传到 img                                       |
| `className` / `style`      | Vue class / style                | -      | React 兼容命名，作用于根节点；也接受原生 `class` |
| `imgCls` / `imgStyle`      | Vue class / style                | -      | 仅作用于内部 img                                 |
| `placeholder` / `fallback` | `VNodeChild`                     | -      | 也可使用同名 slot，slot 优先                     |
| `preview`                  | `boolean \| ImagePreviewOptions` | `true` | 禁用、启用或配置单图预览                         |
| `setDownloadName`          | `(src) => string`                | -      | 自定义下载文件名                                 |

事件：`click`、`load`、`error`。未消费的 `aria-*`、`data-*`、`decoding` 等原生属性落到内部 img。

## ImagePreview API

- 数据与状态：`src`、`visible/defaultVisible`、`currentIndex/defaultCurrentIndex`，支持 `v-model:visible` 与 `v-model:currentIndex`。
- 浏览：`infinite=false`、`closable=true`、`closeOnEsc=true`、`maskClosable=true`。
- 缩放：`zoomStep=0.1`、`minZoom=0.1`、`maxZoom=5`、`initialZoom`。
- 加载：`lazyLoad=true`、`lazyLoadMargin="0px 100px 100px 0px"`、`preLoad=true`、`preLoadGap=2`。
- Portal：`getPopupContainer`、`zIndex=1070`；默认挂载 body 并在打开期间锁定 body 滚动。
- 菜单与文本：`showTooltip`、各 `*Tip`、`disableDownload`、`setDownloadName`。

事件包括 `visibleChange`、`change`、`close`、`prev`、`next`、`zoomIn`、`zoomOut`、`ratioChange`、`rotateLeft`、`download`、`downloadError`。自定义内容可使用 `#header`、`#previewMenu`、`#leftIcon`、`#rightIcon`、`#closeIcon`。

完整基线、DOM、键盘、主题、RTL、SSR 与验收结论见 [alignment.md](./alignment.md)，React 迁移见 [react-to-vue.md](./react-to-vue.md)。
