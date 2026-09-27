---
title: 'Image 图片'
description: '用于展示和预览图片。'
type: 'show'
order: 73
icon: 'doc-image'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/image` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

Image, ImagePreview 从 v2.20.0 版本开始支持

<DemoBlock id="zh-CN-show-image-1" title="如何引入" kind="import" />

### 基本用法

通过 `src` 指定图片路径即可获取一个具有预览功能的图片，通过 `width`，`height` 指定图片的宽高

<DemoBlock id="zh-CN-show-image-2" title="基本用法" kind="live" />

### 加载失败的占位图

可通过 `fallback` 自定义加载失败的占位图，该参数类型支持 string 和 VNodeChild

<DemoBlock id="zh-CN-show-image-3" title="加载失败的占位图" kind="live" />

### 渐进加载

大图可通过`placeholder`实现渐进加载

<DemoBlock id="zh-CN-show-image-4" title="渐进加载" kind="live" />

### 自定义预览图片

可以通过设置 Image 组件的 `src` 和 `preview` 参数中的 `src` 不同来自定义预览图片

<DemoBlock id="zh-CN-show-image-5" title="自定义预览图片" kind="live" />

### 多图预览

使用 ImagePreview 包裹 Image 即可实现多图片预览

<DemoBlock id="zh-CN-show-image-6" title="多图预览" kind="live" />

### 单独使用预览组件

ImagePreview 可单独使用，通过 `v-model:visible` 控制预览显隐，并通过 `src` 传入图片列表。

<DemoBlock id="zh-CN-show-image-7" title="单独使用预览组件" kind="live" />

### 渲染在指定容器

可以通过 `getPopupContainer` 指定预览组件的父级 DOM（需要指定 `position: relative`)，图片预览将会渲染至该 DOM 中。这会改变浮层 DOM 树位置，但不会改变视图渲染位置。

<DemoBlock id="zh-CN-show-image-8" title="渲染在指定容器" kind="live" />

### 自定义预览底部操作区

优先使用 `previewMenu` 作用域插槽自定义预览底部操作区，迁移代码也可继续使用 `renderPreviewMenu` callback prop。

<DemoBlock id="zh-CN-show-image-9" title="自定义预览底部操作区" kind="live" />

基于默认底部操作区扩展时，可从 `previewMenu` 插槽参数的 `menuItems` 获取默认 VNodeChild 数组；该参数自 v2.40.0 起支持。

<DemoBlock id="zh-CN-show-image-10" title="自定义预览底部操作区" kind="live" />

### 自定义预览顶部展示区

优先使用 `header` 作用域插槽自定义预览顶部展示区，迁移代码也可继续使用 `renderHeader` callback prop。

<DemoBlock id="zh-CN-show-image-11" title="自定义预览顶部展示区" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/image/types.ts`、`packages/ui/src/image/index.ts` 的公开类型为准。

- `ImagePreview` 的 `v-model:visible` 对应 `visible` 与 `update:visible`。
- `ImagePreview` 的 `v-model:currentIndex` 对应 `currentIndex` 与 `update:currentIndex`。

#### Vue 用法

- `Image` 继续透传未占用的原生 img 属性；fallback、placeholder 同时支持 VNode prop 与同名插槽。
- `Image.preview` 对象中的 onChange、onClose、onDownload、onDownloadError、onNext、onPrev、onRatioChange、onRotateLeft、onVisibleChange、onZoomIn、onZoomOut 是嵌套 callback 配置，不是 Image 组件事件。
- `ImagePreview` 的五个 renderXxx 与 `setDownloadName` 是保留的 callback props；同名插槽优先。预览层通过 Teleport 挂载到 getPopupContainer 或 document.body。

#### Vue 事件

**Image**

| 事件  | 参数                | 说明         |
| ----- | ------------------- | ------------ |
| click | [event: MouseEvent] | 点击图片     |
| error | [event: Event]      | 图片加载失败 |
| load  | [event: Event]      | 图片加载成功 |

**ImagePreview**

| 事件                | 参数                         | 说明                 |
| ------------------- | ---------------------------- | -------------------- |
| change              | [index: number]              | 当前图片变化         |
| close               | []                           | 关闭预览             |
| download            | [src: string, index: number] | 下载图片             |
| downloadError       | [src: string]                | 图片下载失败         |
| next                | [index: number]              | 切换到下一张         |
| prev                | [index: number]              | 切换到上一张         |
| ratioChange         | [type: ImageRatioType]       | 显示比例变化         |
| rotateLeft          | [angle: number]              | 图片旋转             |
| update:currentIndex | [index: number]              | 更新当前图片下标绑定 |
| update:visible      | [visible: boolean]           | 更新预览可见性绑定   |
| visibleChange       | [visible: boolean]           | 预览可见性变化       |
| zoomIn              | [zoom: number]               | 图片放大             |
| zoomOut             | [zoom: number]               | 图片缩小             |

#### Vue 插槽

**Image**

| 插槽        | 作用域参数 | 说明         |
| ----------- | ---------- | ------------ |
| fallback    | {}         | 加载失败内容 |
| placeholder | {}         | 加载中内容   |

**ImagePreview**

| 插槽        | 作用域参数            | 说明                   |
| ----------- | --------------------- | ---------------------- |
| closeIcon   | {}                    | 关闭图标               |
| default     | {}                    | Image 子组件或其他内容 |
| header      | { title: VNodeChild } | 预览顶部信息           |
| leftIcon    | { index: number }     | 向左切换图标           |
| previewMenu | ImagePreviewMenuProps | 预览底部菜单           |
| rightIcon   | { index: number }     | 向右切换图标           |

### Image

| 属性            | 说明                                     | 类型                                        | 默认值 | 版本   |
| --------------- | ---------------------------------------- | ------------------------------------------- | ------ | ------ |
| alt             | 图像描述                                 | string \| undefined                         | -      |        |
| class           | Vue class 入口                           | HTMLAttributes['class'] \| undefined        | —      |        |
| className       | 自定义样式类名                           | string \| undefined                         | -      |        |
| crossOrigin     | 透传给原生 img 标签的 crossorigin        | ImageCrossOrigin \| undefined               | -      |        |
| fallback        | 加载失败内容；fallback 插槽优先          | string \| VNodeChild \| undefined           | -      |        |
| height          | 图片显示高度                             | string \| number \| undefined               | -      |        |
| imageID         | —                                        | number \| undefined                         | —      |        |
| imgCls          | 自定义样式类名，透传给 img 节点          | HTMLAttributes['class'] \| undefined        | -      |        |
| imgStyle        | 自定义样式，透传给 img 节点              | StyleValue \| undefined                     | -      |        |
| placeholder     | 加载中内容；placeholder 插槽优先         | VNodeChild \| undefined                     | -      |        |
| preview         | 是否启用预览，或传入 ImagePreviewOptions | boolean \| ImagePreviewOptions \| undefined | true   |        |
| setDownloadName | 下载文件名 callback prop                 | ((src: string) =&gt; string) \| undefined   | -      | 2.40.0 |
| src             | 图片获取地址                             | string \| undefined                         | -      |        |
| style           | 自定义样式                               | StyleValue \| undefined                     | -      |        |
| width           | 图片显示宽度                             | string \| number \| undefined               | -      |        |

其他支持的属性同 [img](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attributes)。其他属性将透传至底层的 img 节点。

### ImagePreview

| 属性                | 说明                                                                                                                                                      | 类型                                                           | 默认值                 | 版本   |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ---------------------- | ------ |
| adaptiveTip         | 适应页面操作按钮提示                                                                                                                                      | string \| undefined                                            | "适应页面"             |        |
| class               | Vue class 入口                                                                                                                                            | HTMLAttributes['class'] \| undefined                           | —                      |        |
| className           | 自定义样式类名                                                                                                                                            | string \| undefined                                            | -                      |        |
| closable            | 是否显示关闭按钮                                                                                                                                          | boolean \| undefined                                           | true                   |        |
| closeOnEsc          | 点击 esc 关闭预览                                                                                                                                         | boolean \| undefined                                           | true                   |        |
| crossOrigin         | 透传给预览图片的原生 img 标签的 crossorigin                                                                                                               | ImageCrossOrigin \| undefined                                  | -                      |        |
| currentIndex        | 当前图片下标，可通过 v-model:currentIndex 绑定                                                                                                            | number \| undefined                                            | -                      |        |
| defaultCurrentIndex | 首次展示图片下标                                                                                                                                          | number \| undefined                                            | 0                      |        |
| defaultVisible      | 首次是否开启预览                                                                                                                                          | boolean \| undefined                                           | false                  |        |
| disableDownload     | 禁用下载                                                                                                                                                  | boolean \| undefined                                           | false                  |        |
| downloadTip         | 下载操作按钮提示                                                                                                                                          | string \| undefined                                            | "下载"                 |        |
| getPopupContainer   | 指定父级 DOM，弹层将会渲染至该 DOM 中，自定义需要设置 container `position: relative` 这会改变浮层 DOM 树位置，但不会改变视图渲染位置。                    | (() =&gt; HTMLElement) \| undefined                            | () =&gt; document.body |        |
| infinite            | 是否无限循环                                                                                                                                              | boolean \| undefined                                           | false                  |        |
| initialZoom         | 预览图片初始缩放比例，仅在首次打开或切换到该图片时生效一次，会被 minZoom/maxZoom 限制                                                                     | number \| undefined                                            | -                      | 2.97.0 |
| lazyLoad            | 是否开启懒加载                                                                                                                                            | boolean \| undefined                                           | true                   |        |
| lazyLoadMargin      | 传给 options 中的rootMargin 参数，参考 [Intersection Observer API](https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API#interfaces) | string \| undefined                                            | `0px 100px 100px 0px`  |        |
| maskClosable        | 点击遮罩是否可关闭                                                                                                                                        | boolean \| undefined                                           | true                   |        |
| maxZoom             | 预览图片最大缩放比例                                                                                                                                      | number \| undefined                                            | 5                      | 2.97.0 |
| minZoom             | 预览图片最小缩放比例                                                                                                                                      | number \| undefined                                            | 0.1                    | 2.97.0 |
| nextTip             | 下一步操作按钮提示                                                                                                                                        | string \| undefined                                            | "下一步"               |        |
| originTip           | 原始尺寸操作按钮提示                                                                                                                                      | string \| undefined                                            | "原始尺寸"             |        |
| preLoad             | 是否开启预加载                                                                                                                                            | boolean \| undefined                                           | true                   |        |
| preLoadGap          | 预加载的步长                                                                                                                                              | number \| undefined                                            | 2                      |        |
| prevTip             | 上一步操作按钮提示                                                                                                                                        | string \| undefined                                            | "上一步"               |        |
| previewCls          | 自定义预览样式类名                                                                                                                                        | string \| undefined                                            | -                      |        |
| previewStyle        | 自定义预览样式                                                                                                                                            | StyleValue \| undefined                                        | -                      |        |
| previewTitle        | 自定义预览 title                                                                                                                                          | VNodeChild \| undefined                                        | -                      |        |
| renderCloseIcon     | 关闭图标渲染 callback prop；closeIcon 插槽优先                                                                                                            | VNodeChild \| (() =&gt; VNodeChild) \| undefined               | -                      | 2.85.0 |
| renderHeader        | 顶部信息渲染 callback prop；header 插槽优先                                                                                                               | ((title: VNodeChild) =&gt; VNodeChild) \| undefined            | -                      |        |
| renderLeftIcon      | 向左图标渲染 callback prop；leftIcon 插槽优先                                                                                                             | VNodeChild \| ((index: number) =&gt; VNodeChild) \| undefined  | -                      | 2.85.0 |
| renderPreviewMenu   | 底部菜单渲染 callback prop；previewMenu 插槽优先                                                                                                          | ((props: ImagePreviewMenuProps) =&gt; VNodeChild) \| undefined | -                      |        |
| renderRightIcon     | 向右图标渲染 callback prop；rightIcon 插槽优先                                                                                                            | VNodeChild \| ((index: number) =&gt; VNodeChild) \| undefined  | -                      | 2.85.0 |
| rotateTip           | 旋转操作按钮提示                                                                                                                                          | string \| undefined                                            | "旋转"                 |        |
| setDownloadName     | 下载文件名 callback prop                                                                                                                                  | ((src: string) =&gt; string) \| undefined                      | -                      | 2.40.0 |
| showTooltip         | 是否展示底部操作区提示                                                                                                                                    | boolean \| undefined                                           | false                  |        |
| src                 | 图片列表信息                                                                                                                                              | string \| string[] \| undefined                                | []                     |        |
| style               | 自定义样式                                                                                                                                                | StyleValue \| undefined                                        | -                      |        |
| viewerVisibleDelay  | 隐藏预览操作按钮前的无操作时长                                                                                                                            | number \| undefined                                            | 10000                  |        |
| visible             | 预览可见性，可通过 v-model:visible 绑定                                                                                                                   | boolean \| undefined                                           | -                      |        |
| zIndex              | 预览层层级                                                                                                                                                | number \| undefined                                            | 1070                   |        |
| zoomInTip           | 放大操作按钮提示                                                                                                                                          | string \| undefined                                            | "放大"                 |        |
| zoomOutTip          | 缩小操作按钮提示                                                                                                                                          | string \| undefined                                            | "缩小"                 |        |
| zoomStep            | 图片每次缩小/放大比例                                                                                                                                     | number \| undefined                                            | 0.1                    |        |

### MenuProps

| 属性            | 说明                                         | 类型                   | 版本   |
| --------------- | -------------------------------------------- | ---------------------- | ------ |
| min             | 图片缩放最小比例                             | number（必填）         | —      |
| max             | 图片缩放最大比例                             | number（必填）         | —      |
| step            | 缩放的比例步长                               | number（必填）         | —      |
| curPage         | 当前图片页下标                               | number（必填）         | —      |
| totalNum        | 可预览的总图片数                             | number（必填）         | —      |
| zoom            | 当前图片缩放比例                             | number（必填）         | —      |
| ratio           | 原始尺寸或适应页面按钮状态                   | ImageRatioType（必填） | —      |
| disabledPrev    | 是否禁用向左切换按钮                         | boolean（必填）        | —      |
| disabledNext    | 是否禁用向右切换按钮                         | boolean（必填）        | —      |
| disabledZoomIn  | —                                            | boolean（必填）        | —      |
| disabledZoomOut | —                                            | boolean（必填）        | —      |
| disableDownload | 是否禁用下载按钮                             | boolean（必填）        | —      |
| onDownload      | 图片下载的调用函数                           | () =&gt; void（必填）  | —      |
| onNext          | 向后切换图片的调用函数                       | () =&gt; void（必填）  | —      |
| onPrev          | 向前切换图片的调用函数                       | () =&gt; void（必填）  | —      |
| onZoomIn        | 图片放大时的调用函数                         | () =&gt; void（必填）  | —      |
| onZoomOut       | 图片缩小时的调用函数                         | () =&gt; void（必填）  | —      |
| onRatioClick    | —                                            | () =&gt; void（必填）  | —      |
| onRotateLeft    | 逆时针旋转图片的调用函数                     | () =&gt; void（必填）  | —      |
| onRotateRight   | 顺时针旋转图片的调用函数                     | () =&gt; void（必填）  | —      |
| menuItems       | 默认底部预览操作区域功能按钮 VNodeChild 数组 | VNodeChild[]（必填）   | 2.40.0 |
