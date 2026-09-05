---
title: '上传'
description: '文件选择上传'
locale: 'zh-CN'
slug: 'upload'
category: 'input'
order: 53
englishTitle: 'Upload'
icon: 'doc-upload'
upstream: 'input/upload'
---

以下 Vue 3.5 示例以 Semi Design v2.102.0 为基线。每例均通过本地 `customRequest` 模拟进度与响应，文件不会发送到服务器。预览图片来自本站 `/demos/` 资源，裁切会在浏览器中处理实际选择的图片。

## 代码演示

### 如何引入

```ts
import { Upload } from '@aifuxi/semi-ui-vue/upload';
import '@aifuxi/semi-theme-default/upload.css';
```

### 基本

最基本的用法，在默认插槽内放置一个 Button，点击默认插槽内容（即放置的 Button）激活文件选择框，选择完成后自动开始上传

::demo-block{demo="upload/zh-CN/Basic" title="基本"}
::

### 文件名超长省略

通过 `showTooltip` 属性，自定义设置文件名弹出提示

当类型为 `boolean` 时，控制是否弹出提示

::demo-block{demo="upload/zh-CN/NoTooltip" title="关闭文件名提示"}
::

当类型为 `object` 时，可以自定义弹出样式

上游此例通过 `renderTooltip` 把浮层放在 bottom；当前 Vue 公开类型仅支持 `type` 与 `opts`，因此使用 `opts.position = "bottom"` 保留本例意图。任意 `renderTooltip` 自定义渲染不属于当前公开契约。

::demo-block{demo="upload/zh-CN/CustomTooltip" title="自定义文件名提示位置"}
::

### 添加提示文本

通过 `prompt` 插槽，设置自定义提示文本

通过 `promptPosition` 设置插槽位置，可选 `left`、`right`、`bottom`，默认为 `right`

::demo-block{demo="upload/zh-CN/Prompt" title="提示文本位置"}
::

当 listType 为 picture 时，promptPosition 位置的参照对象为图片墙列表整体

::demo-block{demo="upload/zh-CN/PicturePrompt" title="图片墙提示文本"}
::

### 点击头像触发上传

::demo-block{demo="upload/zh-CN/AvatarUpload" title="头像上传"}
::

```css
.avatar-upload .semi-upload-add {
  border-radius: 50%; /* 确保只有圆是点击热区 */
}
```

### 自定义上传属性

通过设置 `data`、`headers` 可添加自定义上传属性

::demo-block{demo="upload/zh-CN/RequestAttributes" title="自定义上传参数"}
::

### 上传文件类型

通过 `accept` 属性（`input` 的原生 `html` 属性）可以限制上传的文件类型。

`accept` 支持传入以下两种类型字符串：

- 文件后缀名集合（推荐），如 .jpg、.png 等；
- 文件类型的 MIME types 集合，可参考[MDN 文档](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types)

例如只允许用户上传 PNG 和 PDF 文件，`accept` 可以这样写： `accept = '.pdf,.png'` 或 `accept = 'application/pdf,image/png'`（将 PNG 与 PDF 的 MIME type 通过`,`连接起来即可）。

> Upload 会在内部拦截掉不符合 accept 格式的文件，当拦截到不符合格式要求的文件时，会触发 @accept-invalid 方法；
> accept 使用后缀可以避免因为浏览器或者操作系统的不同导致 file.type 与 MIME 不兼容问题。

::demo-block{demo="upload/zh-CN/Accept" title="文件格式"}
::

### 上传文件夹

通过传入 `directory` 为 `true`，可以支持上传文件夹下的所有文件

::demo-block{demo="upload/zh-CN/Directory" title="上传文件夹"}
::

### 一次选中多个文件

通过设置 `multiple` 属性可以支持同时选中多个文件上传。

::demo-block{demo="upload/zh-CN/Multiple" title="一次选择多个文件"}
::

### 限制文件总数量

通过设置 `limit` 属性可以限制最大可上传的文件数

当 `limit` 为1时，始终用最新上传的代替当前，并不会触发@exceed回调

::demo-block{demo="upload/zh-CN/SingleLimit" title="最多一个文件"}
::

::demo-block{demo="upload/zh-CN/DisableAtLimit" title="达到上限禁用"}
::

照片墙模式下，当已上传文件数量等于 limit 时，会自动隐藏上传入口

::demo-block{demo="upload/zh-CN/PictureLimit" title="图片墙数量上限"}
::

### 限制上传文件大小

通过 `maxSize` 和 `minSize` 属性可以自定义上传文件大小的限制，通过设置 `@size-error` 可以设置超出限制时的回调。

::demo-block{demo="upload/zh-CN/SizeLimit" title="文件大小限制"}
::

### 自定义列表操作区

`listType` 为 `list` 时，可以通过传入 `renderFileOperation` 来自定义列表操作区

::demo-block{demo="upload/zh-CN/FileOperations" title="自定义操作区"}
::

### 自定义文件列表标题

`listType` 为 `list` 时，可以通过 `fileListTitle` 自定义文件列表顶部的标题区域。支持两种形式：

#### 字符串或 VNodeChild 形式

当传入字符串或 VNodeChild 时，仅替换标题文字，清空按钮保持默认样式：

::demo-block{demo="upload/zh-CN/ListTitle" title="自定义标题文字"}
::

#### 函数形式

当传入函数时，可以完全自定义标题区域，包括清空按钮。函数会接收以下参数：

- `fileList`: 当前文件列表
- `onClear`: 清空文件的回调函数
- `clearText`: 清空按钮的默认文案（根据当前语言环境）

::demo-block{demo="upload/zh-CN/ListTitleSlot" title="自定义完整标题区"}
::

### 自定义预览逻辑

`listType` 为 `list` 时，可以通过传入 `previewFile` 自定义预览逻辑

例如你不需要对图片类型进行缩略图预览时，可以在 `previewFile` 中恒定返回一个`<IconFile />`

假如你希望点击图片时放大预览，则可以在 `previewFile`中使用 Image 组件

或者你希望使用额外的操作区来实现点击放大预览，你也可以结合 `renderFileOperation` 放置一些自定义元素例如 Icon 图标实现点击放大

::demo-block{demo="upload/zh-CN/PreviewFile" title="自定义缩略预览"}
::

结合 renderFileOperation 与 ImagePreview 的示例，以下示例点击右侧第一个 Icon 可放大图片预览
::demo-block{demo="upload/zh-CN/PreviewOperations" title="操作区放大预览"}
::

### 默认文件列表

通过 `defaultFileList` 可以展示已上传的文件。当需要预览默认文件的缩略图时，你可以将 `defaultFileList` 内对应 `item` 的 `preview` 属性设为 `true`

> defaultFileList中 uid 必须唯一，不可重复

::demo-block{demo="upload/zh-CN/DefaultList" title="默认文件列表"}
::

### 受控组件

当传入`fileList`时，作为受控组件使用。需要监听 @change 回调，并且将 fileList 回传给 Upload（注意需传入一个新的数组对象）

::demo-block{demo="upload/zh-CN/Controlled" title="受控列表"}
::

### 图片墙

设置 `listType = 'picture'`，用户可以上传图片并在列表中显示缩略图

如果通过 defaultFileList 或 fileList 设置已上传的文件列表时，会自动读取对象数组中的 url 属性用于展示图片

::demo-block{demo="upload/zh-CN/PictureWall" title="图片墙"}
::

设置 `showPicInfo`，可以查看图片基础信息

::demo-block{demo="upload/zh-CN/PictureInfo" title="显示图片信息"}
::

### 图片墙放大预览

配合 Image 组件，通过 renderThumbnail API ，可以实现点击图片放大预览

::demo-block{demo="upload/zh-CN/ThumbnailPreview" title="缩略图放大预览"}
::

可以通过 `renderPicPreviewIcon`，`@preview-click` 来自定义预览图标，当显示替换图标 `showReplace` 时，不会再显示预览图标<br />
当需要自定义预览/替换功能时，需要关闭替换功能，使用 `renderPicPreviewIcon` 监听图标点击事件即可。<br />
`@preview-click` 监听的是单张图片容器的点击事件

::demo-block{demo="upload/zh-CN/PreviewIcon" title="自定义预览图标"}
::

### 图片墙设置宽高

通过设置 picHeight, picWidth （ v2.42 后提供），可以统一设置图片墙元素的宽高
如果同时使用 `renderThumbnail` return Image 组件来实现点击放大预览，你需要同时指定 Image 组件的 width 和 height

::demo-block{demo="upload/zh-CN/PictureSize" title="图片宽高"}
::

设置 `hotSpotLocation` 自定义点击热区的顺序，默认在照片墙列表结尾

::demo-block{demo="upload/zh-CN/HotSpot" title="上传热区位置"}
::

### 禁用

::demo-block{demo="upload/zh-CN/Disabled" title="禁用"}
::

### 手动触发上传

`uploadTrigger='custom'`，选中文件后将不会自动触发上传。需要手动调用 `ref` 上的 `upload` 方法触发

::demo-block{demo="upload/zh-CN/Manual" title="手动上传"}
::

### 拖拽上传

`draggable='true'`，可以使用拖拽功能

> 在directory为true的情况下，因为浏览器自动做了限制，所以点击上传时不允许选单个文件，拖拽时我们认为同时允许文件夹、文件都能拖动更合理，所以不做另外的拦截处理。

::demo-block{demo="upload/zh-CN/Drag" title="拖拽上传"}
::

可以通过 `dragIcon`、`dragMainText`、`dragSubText` 快捷设置拖拽区内容

::demo-block{demo="upload/zh-CN/DragIcon" title="拖拽图标"}
::

还可以通过 `默认插槽` 传入 VNodeChild，完全自定义拖拽区的显示

::demo-block{demo="upload/zh-CN/DragContent" title="自定义拖拽区域"}
::

Scss 样式如下

```scss
.components-upload-demo-drag-area {
  border-radius: var(--semi-border-radius-small);
  border: 2px dashed var(--semi-color-border);
  width: 100%;
  padding: 12px;
  background-color: var(--semi-color-tertiary-light-default);
  display: flex;
  cursor: pointer;
  flex-wrap: wrap;
  justify-content: center;
  &:hover {
    background-color: var(--semi-color-primary-light-default);
    border-color: var(--semi-color-primary);
  }
}
```

### 上传前自定义校验

可通过 `beforeUpload` 钩子，对文件状态进行更新，这是在网络上传前，选择文件后进行校验，`({ file: FileItem, fileList: Array<FileItem> }) => beforeUploadResult | Promise | boolean` 同步校验时需返回 boolean（true 为校验通过，false 为校验失败，校验失败会阻止文件网络上传）或者一个 Object 对象，具体结构如下

```ts
interface UploadBeforeResult {
  shouldUpload?: boolean;
  status?: UploadFileStatus;
  autoRemove?: boolean;
  validateMessage?: VNodeChild;
  fileInstance?: UploadCustomFile;
}
```

::demo-block{demo="upload/zh-CN/BeforeUpload" title="同步校验"}
::

异步校验时，需返回 Promise，Promise resolve 代表检验通过，reject 代表校验失败，不会触发上传。

resolve/reject 时可以传入 object（结构同上 beforeUploadResult）

::demo-block{demo="upload/zh-CN/AsyncBeforeUpload" title="异步校验"}
::

### 上传后更新文件信息

可以通过 `afterUpload` 钩子，对文件状态，校验信息，文件名进行更新。

`({ response: any, file: FileItem, fileList: Array<FileItem> }) => afterUploadResult`

`afterUpload` 在上传完成后(`xhr.onload`)且没有发生错误的情况下触发，需返回一个 Object 对象（不支持异步返回），具体结构如下

```ts
interface UploadAfterResult {
  autoRemove?: boolean;
  status?: UploadFileStatus;
  validateMessage?: VNodeChild;
  name?: string;
  url?: string;
}
```

::demo-block{demo="upload/zh-CN/AfterUpload" title="上传后更新信息"}
::

### 自定义请求

当传入 customRequest 时, 相当于使用的自定义的请求方法替换了 upload 内置的 xhr 请求，用户需要自行接管上传行为。

可在入参中获取到当前操作的 file 对象，用户自行实现上传过程，并且在适当的时候调用 customRequest 入参中的 onProgress、onError、onSuccess 以更新 Upload 组件内部状态进而驱动 UI 更新

customRequest 包含以下入参

```ts
interface UploadCustomRequestArgs {
  fileName: string;
  data: Record<string, unknown>;
  file: UploadFileItem;
  fileInstance: File;
  onProgress(event?: { total: number; loaded: number }): void;
  onError(xhr: { status?: number }, event?: Event): void;
  onSuccess(response: unknown, event?: Event): void;
  withCredentials: boolean;
  action: string;
}
```

::demo-block{demo="upload/zh-CN/CustomRequest" title="本地模拟请求"}
::

### 图片裁切

通过 `crop` 属性启用图片裁切功能。支持点击选择、拖拽、粘贴、替换文件时进行裁切。

#### 基本用法

设置 `crop={true}` 启用默认裁切配置。

裁切示例通过 `cropModalProps.bodyStyle.height` 显式设置 400px 内容区高度。当前 Vue 裁切器使用父容器的 100% 高度，因此需要为弹窗内容区提供确定高度；自定义弹窗示例使用 500px。

::demo-block{demo="upload/zh-CN/CropBasic" title="基础裁切"}
::

#### 自定义裁切配置

通过对象形式配置裁切参数，包括宽高比、形状、质量等。

::demo-block{demo="upload/zh-CN/CropOptions" title="自定义裁切配置"}
::

#### 圆形裁切

适用于头像上传场景，设置 `shape: 'round'` 启用圆形裁切。

::demo-block{demo="upload/zh-CN/CropRound" title="圆形裁切"}
::

#### 裁切前确认

通过 `beforeCrop` 回调，在裁切前进行确认或其他处理。返回 `false` 可跳过裁切直接上传。

::demo-block{demo="upload/zh-CN/BeforeCrop" title="裁切前确认"}
::

#### 拖拽上传裁切

拖拽上传时也会触发裁切功能。

::demo-block{demo="upload/zh-CN/CropDrag" title="拖拽裁切"}
::

#### 自定义裁切弹窗样式

通过 `cropModalProps` 自定义裁切弹窗的样式和属性。

::demo-block{demo="upload/zh-CN/CropModal" title="裁切弹窗样式"}
::

## API 参考

下表事件类型采用 Vue emits 参数元组表示。版本列表示上游 Semi React 引入版本，不表示本 Vue 包版本。

---

| 属性                 | 说明                                                                                                                                                                                                                                                                                                     | 类型                                                                                                     | 默认值                         | 版本   |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------ | ------ |
| accept               | `html` 原生属性，接受上传的[文件类型](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-accept)。<br/>`accept` 的值为你允许选择文件的[MIME types 字符串](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types)或文件后缀（.jpg等） | `string`                                                                                                 |                                |        |
| action               | 文件上传地址，必填                                                                                                                                                                                                                                                                                       | `string`                                                                                                 |                                |        |
| addOnPasting         | 按下 ctrl/command + v时，是否自动将剪贴板中的文件添加至 fileList，当前仅支持图片类型; 需用户授权同意                                                                                                                                                                                                     | `boolean`                                                                                                | false                          | 2.43.0 |
| afterUpload          | 文件上传后的钩子，根据 return 的 object 更新文件状态                                                                                                                                                                                                                                                     | `(payload: UploadAfterProps) => UploadAfterResult \| undefined`                                          |                                |        |
| beforeClear          | 清空文件前回调，按照返回值来判断是否继续移除，返回false、Promise.resolve(false)、Promise.reject()会阻止移除                                                                                                                                                                                              | `(fileList: UploadFileItem[]) => boolean \| Promise<boolean>`                                            |                                |        |
| beforeCrop           | 图片裁切前的回调。返回 `false` 可跳过裁切直接上传，返回 `true` 继续裁切。支持异步返回                                                                                                                                                                                                                    | `(file: File, fileList: File[]) => boolean \| Promise<boolean>`                                          |                                | 2.97.0 |
| beforeRemove         | 移除文件前的回调，按照返回值来判断是否继续移除，返回false、Promise.resolve(false)、Promise.reject()会阻止移除                                                                                                                                                                                            | `(file: UploadFileItem, fileList: UploadFileItem[]) => boolean \| Promise<boolean>`                      |                                |        |
| beforeUpload         | 上传文件前的钩子，根据 return 的 object 更新文件状态，控制是否上传                                                                                                                                                                                                                                       | `( payload: UploadBeforeProps, ) => UploadBeforeResult \| Promise<UploadBeforeResult> \| boolean`        |                                |        |
| capture              | 文件上传控件中媒体拍摄的方式                                                                                                                                                                                                                                                                             | `boolean \| 'user' \| 'environment'`                                                                     |                                |        |
| className            | 类名                                                                                                                                                                                                                                                                                                     | `HTMLAttributes['class']`                                                                                |                                |        |
| crop                 | 启用图片裁切功能。传入 `true` 使用默认配置，传入对象可自定义裁切参数。支持所有上传入口（点击选择、拖拽、粘贴、替换）的图片裁切                                                                                                                                                                           | `boolean \| UploadCropProps`                                                                             |                                | 2.97.0 |
| cropModalProps       | 自定义裁切弹窗的属性，可配置弹窗的样式、宽度等                                                                                                                                                                                                                                                           | `ModalProps`                                                                                             |                                | 2.97.0 |
| customRequest        | 自定义上传使用的异步请求方法                                                                                                                                                                                                                                                                             | `(payload: UploadCustomRequestArgs) => void`                                                             |                                |        |
| data                 | 上传时附带的额外参数或返回上传额外参数的方法                                                                                                                                                                                                                                                             | `Record<string, unknown> \| ((file: File) => Record<string, unknown>)`                                   | {}                             |        |
| defaultFileList      | 已上传的文件列表                                                                                                                                                                                                                                                                                         | `UploadFileItem[]`                                                                                       | []                             |        |
| directory            | 文件夹类型上传                                                                                                                                                                                                                                                                                           | `boolean`                                                                                                | false                          |        |
| disabled             | 是否禁用                                                                                                                                                                                                                                                                                                 | `boolean`                                                                                                | false                          |        |
| dragIcon             | 拖拽区左侧 Icon                                                                                                                                                                                                                                                                                          | `VNodeChild`                                                                                             | `<IconUpload />`               |        |
| dragMainText         | 拖拽区主文本                                                                                                                                                                                                                                                                                             | `VNodeChild`                                                                                             | '点击上传文件或拖拽文件到这里' |        |
| dragSubText          | 拖拽区帮助文本                                                                                                                                                                                                                                                                                           | `VNodeChild`                                                                                             | ''                             |        |
| draggable            | 是否支持拖拽上传                                                                                                                                                                                                                                                                                         | `boolean`                                                                                                | false                          |        |
| fileList             | 已上传的文件列表，传入该值时，upload 即为受控组件                                                                                                                                                                                                                                                        | `UploadFileItem[] \| undefined`                                                                          |                                |        |
| fileListTitle        | 自定义文件列表标题区域。支持两种形式：<br/>1. 传入 VNodeChild 时，仅替换标题文字，清空按钮保持默认样式<br/>2. 传入函数时，可完全自定义标题区域（包括清空按钮），函数参数为 `{ fileList, onClear, clearText }`                                                                                            | `VNodeChild \| ((props: UploadRenderFileListTitleProps) => VNodeChild)`                                  |                                | 2.75.0 |
| fileName             | 作用与 name 相同，主要在 Form.Upload 中使用，为了避免与 Field 的 props.name 冲突，此处另外提供一个重命名的 props                                                                                                                                                                                         | `string`                                                                                                 |                                |        |
| headers              | 上传时附带的 headers 或返回上传额外 headers 的方法                                                                                                                                                                                                                                                       | `Record<string, unknown> \| ((file: File) => Record<string, string>)`                                    | {}                             |        |
| hotSpotLocation      | 照片墙点击热区的放置位置，可选值 `start`, `end`                                                                                                                                                                                                                                                          | `'start' \| 'end'`                                                                                       | 'end'                          | 2.5.0  |
| itemStyle            | fileCard 的内联样式                                                                                                                                                                                                                                                                                      | `StyleValue`                                                                                             |                                |        |
| limit                | 最大允许上传文件个数                                                                                                                                                                                                                                                                                     | `number`                                                                                                 |                                |        |
| listType             | 文件列表展示类型，可选`picture` / `list` / `none`                                                                                                                                                                                                                                                        | `UploadListType`                                                                                         | 'list'                         |        |
| maxSize              | 文件体积最大限制，单位 KB                                                                                                                                                                                                                                                                                | `number`                                                                                                 |                                |        |
| minSize              | 文件体积最小限制，单位 KB                                                                                                                                                                                                                                                                                | `number`                                                                                                 |                                |        |
| multiple             | 是否允许单次选中多个文件                                                                                                                                                                                                                                                                                 | `boolean`                                                                                                | false                          |        |
| name                 | 上传时使用的文件名                                                                                                                                                                                                                                                                                       | `string`                                                                                                 | ''                             |        |
| @accept-invalid      | 当接收到的文件不符合accept规范时触发（一般是因为文件夹选择了全部类型文件/拖拽不符合格式的文件时触发）                                                                                                                                                                                                    | `[files: File[]]`                                                                                        |                                |        |
| @change              | 文件状态发生变化时调用，包括上传成功，失败，上传中，回调入参为 Object，包含 fileList、currentFile 等值                                                                                                                                                                                                   | `[payload: UploadChangePayload]`                                                                         |                                |        |
| @clear               | 点击清空时的回调                                                                                                                                                                                                                                                                                         | `[]`                                                                                                     |                                |        |
| @crop-error          | 图片裁切失败时的回调                                                                                                                                                                                                                                                                                     | `[error: Error]`                                                                                         |                                | 2.97.0 |
| @drop                | 当拖拽的元素在拖拽区上被释放时触发                                                                                                                                                                                                                                                                       | `[event: Event, files: File[], fileList: UploadFileItem[]]`                                              |                                |        |
| @error               | 上传错误时的回调                                                                                                                                                                                                                                                                                         | `[ error: UploadCustomError, file: UploadCustomFile, fileList: UploadFileItem[], xhr: XMLHttpRequest, ]` |                                |        |
| @exceed              | 上传文件总数超出 `limit` 时的回调                                                                                                                                                                                                                                                                        | `[files: File[]]`                                                                                        |                                |        |
| @file-change         | 选中文件后的回调                                                                                                                                                                                                                                                                                         | `[files: File[]]`                                                                                        |                                |        |
| @open-file-dialog    | 打开系统文系统文件选择弹窗时触发                                                                                                                                                                                                                                                                         | `[]`                                                                                                     |                                |        |
| @preview-click       | 点击文件卡片时的回调                                                                                                                                                                                                                                                                                     | `[file: UploadFileItem]`                                                                                 |                                |        |
| @progress            | 上传文件时的回调                                                                                                                                                                                                                                                                                         | `[percent: number, file: UploadCustomFile, fileList: UploadFileItem[]]`                                  |                                |        |
| @pasting-error       | addOnPasting为true时，粘贴读取失败时的回调                                                                                                                                                                                                                                                               | `[error: Error \| PermissionStatus]`                                                                     |                                | 2.43.0 |
| @remove              | 移除文件的回调                                                                                                                                                                                                                                                                                           | `[file: UploadCustomFile, fileList: UploadFileItem[], fileItem: UploadFileItem]`                         |                                |        |
| @retry               | 上传重试的回调                                                                                                                                                                                                                                                                                           | `[file: UploadFileItem]`                                                                                 |                                |        |
| @size-error          | 文件尺寸非法的回调                                                                                                                                                                                                                                                                                       | `[file: UploadCustomFile, fileList: UploadFileItem[]]`                                                   |                                |        |
| @success             | 上传成功后的回调                                                                                                                                                                                                                                                                                         | `[response: unknown, file: UploadCustomFile, fileList: UploadFileItem[]]`                                |                                |
| picHeight            | 图片墙模式下，可通过该 API 定制图片展示高度                                                                                                                                                                                                                                                              | `string \| number`                                                                                       |                                | 2.42.0 |
| picWidth             | 图片墙模式下，可通过该 API 定制图片展示宽度                                                                                                                                                                                                                                                              | `string \| number`                                                                                       |                                | 2.42.0 |
| previewFile          | 自定义预览逻辑，该函数返回内容将会替换原缩略图                                                                                                                                                                                                                                                           | `(props: UploadRenderFileItemProps) => VNodeChild`                                                       |                                |        |
| prompt               | 自定义插槽，可用于插入提示文本。与直接在 `默认插槽` 中写的区别时，`prompt` 的内容在点击时不会触发上传                                                                                                                                                                                                    | `VNodeChild`                                                                                             |                                |        |
| promptPosition       | 提示文本的位置，当 listType 为 list 时，参照物为默认插槽元素；当 listType 为 picture 时，参照物为图片列表。可选值 `left`、`right`、`bottom`                                                                                                                                                              | `UploadPromptPosition`                                                                                   | 'right'                        |        |
| renderFileItem       | fileCard 的自定义渲染                                                                                                                                                                                                                                                                                    | `(props: UploadRenderFileItemProps) => VNodeChild`                                                       |                                |        |
| renderFileOperation  | 自定义列表项操作区                                                                                                                                                                                                                                                                                       | `(props: UploadRenderFileItemProps) => VNodeChild`                                                       |                                | 2.5.0  |
| renderPicClose       | 自定义照片墙 close 按钮，只在照片墙模式下有效                                                                                                                                                                                                                                                            | `(props: UploadRenderPictureCloseProps) => VNodeChild`                                                   |                                | 2.75.0 |
| renderPicInfo        | 自定义照片墙信息，只在照片墙模式下有效                                                                                                                                                                                                                                                                   | `(props: UploadRenderFileItemProps) => VNodeChild`                                                       |                                | 2.2.0  |
| renderPicPreviewIcon | 自定义照片墙hover时展示的预览图标，只在照片墙模式下有效                                                                                                                                                                                                                                                  | `(props: UploadRenderFileItemProps) => VNodeChild`                                                       |                                | 2.5.0  |
| renderThumbnail      | 自定义图片墙缩略图，只在照片墙模式下有效                                                                                                                                                                                                                                                                 | `(props: UploadRenderFileItemProps) => VNodeChild`                                                       |                                | 2.2.0  |
| showClear            | 在 limit 不为 1 且当前已上传文件数大于 1 时，是否展示清空按钮                                                                                                                                                                                                                                            | `boolean`                                                                                                | true                           |        |
| showPicInfo          | 是否显示图片信息，只在照片墙模式下有效                                                                                                                                                                                                                                                                   | `boolean`                                                                                                | false                          | 2.2.0  |
| showReplace          | 上传成功时，是否展示在 fileCard 内部展示替换按钮                                                                                                                                                                                                                                                         | `boolean`                                                                                                | false                          |        |
| showRetry            | 上传失败时，是否展示在 fileCard 内部展示重试按钮                                                                                                                                                                                                                                                         | `boolean`                                                                                                | true                           |        |
| showTooltip          | 文件名超长时展示提示；对象支持 type 和 opts；当前 Vue 公开类型不支持 renderTooltip。                                                                                                                                                                                                                     | `boolean \| TypographyShowTooltip`                                                                       | true                           |        |
| showUploadList       | 是否显示文件列表                                                                                                                                                                                                                                                                                         | `boolean`                                                                                                | true                           |        |
| style                | 样式                                                                                                                                                                                                                                                                                                     | `StyleValue`                                                                                             |                                |        |
| transformFile        | 选中文件后，上传文件前的回调函数，可用于对文件进行自定义转换处理                                                                                                                                                                                                                                         | `(file: File) => UploadCustomFile`                                                                       |                                |        |
| uploadTrigger        | 触发上传时机，可选值 `auto`、`custom`                                                                                                                                                                                                                                                                    | `UploadTrigger`                                                                                          | 'auto'                         |        |
| validateMessage      | Upload 整体的错误信息                                                                                                                                                                                                                                                                                    | `VNodeChild`                                                                                             |                                |        |
| withCredentials      | 是否带上 Cookie 信息                                                                                                                                                                                                                                                                                     | `boolean`                                                                                                | false                          |        |

## Interfaces

### FileItem Interface

> uid为文件唯一标识符，Upload的更新、删除等逻辑对该值强依赖。
> 如果当前文件是通过upload选中添加的，会自动生成uid。
> 如果是props.defaultFileList或者props.fileList传入的, 必传，且需要自行保证不会重复

```ts
interface UploadFileItem {
  status: UploadFileStatus;
  name: string;
  size: string | number;
  uid: string;
  url?: string;
  fileInstance?: File;
  percent?: number;
  _sizeInvalid?: boolean;
  preview?: boolean;
  validateMessage?: VNodeChild;
  shouldUpload?: boolean;
  showReplace?: boolean;
  showRetry?: boolean;
  response?: unknown;
  event?: Event;
}
```

### RenderFileListTitleProps Interface

`fileListTitle` 传入函数时的参数类型：

```ts
interface UploadRenderFileListTitleProps {
  fileList: UploadFileItem[];
  onClear(): void;
  clearText: string;
}
```

### CropProps Interface

`crop` 属性传入对象时的配置项：

```ts
interface UploadCropProps {
  aspectRatio?: number;
  shape?: 'rect' | 'round' | 'roundRect';
  minZoom?: number;
  maxZoom?: number;
  zoomStep?: number;
  quality?: number;
  fill?: string;
  modalTitle?: string;
  modalOkText?: string;
  modalCancelText?: string;
}
```

## Methods

绑定在组件实例上的方法，可以通过 ref 调用实现某些特殊交互

| 名称           | 描述                                                        | 类型                                          | 版本   |
| -------------- | ----------------------------------------------------------- | --------------------------------------------- | ------ |
| insert         | 上传文件，当index传入时，会插入到指定位置，不传则插入到最后 | (files: Array<File\>, index?: number) => void | 2.2.0  |
| upload         | 手动开始上传，配合uploadTrigger="custom"使用                | () => void                                    |        |
| openFileDialog | 打开文件选择窗口                                            | `[]`                                          | 2.21.0 |

## Accessibility

Upload组件是一个可交互的控件，在点击或拖拽时触发文件选择，文件选中后会在文件列表内展示状态。

### ARIA

- 为可点击元素添加 `role="button"`
- 文件列表添加 `role="list"`，并用 `aria-label` 描述

## 文案规范

- 上传按钮
  - 关于表单按钮的文案规范，参考[按钮Button组件的文案规范](/zh-cn/components/button/)
- 帮助文本
  - 帮助文本使用语句书写规范，首字母大写，可以不需要句号
- 用户出错提示
  - 清晰地告诉用户为什么文件无法被上传，并且告知用户如何操作能够成功上传
  - 帮助文本使用语句书写规范，首字母大写
  - 简洁的用语让用户能够一眼读懂，比如 `File size must be less than 20MB`, `File type must be .gif, .jpg, .png or .svg`

## 设计变量

默认主题保留 `--semi-*` Token。上传组件使用 `--semi-color-border`、`--semi-color-fill-0`、`--semi-color-danger-light-default`、`--semi-color-primary-light-default` 和标准圆角 Token；列表卡默认 250 × 52 CSS px，图片卡默认 96 × 96 CSS px。

## FAQ

- 什么时候会展示重试按钮？
  - 当 `showRetry` 为 true，且当前文件是由于网络原因错误导致的上传失败时，会展示重试按钮。其他如校验失败，上传成功等状态是不会展示重试按钮的。
- 什么时候会展示替换按钮？
  - 当 `showReplace` 为true，且当前文件状态为已上传时，会展示替换按钮。
- Semi Upload把图片存到哪里了？
  - Semi Upload不负责图片的保存，当你使用 Upload 组件时需要自定义 action。你可以选择把 action 设置为自己的服务器地址或者图片服务地址。
- Form.Upload props.name无效？
  - Form.Field 中有 props.name，Upload也有 props.name，同名 props 会冲突。使用 Form.Upload 时，可以转为使用 props.fileName，避免冲突
- 上传图片后没有调用 XXX 方法？
  - 如果你设置了 `accept`，可以尝试把 accept 属性去掉，然后再看是否调用了改方法。去掉后调用了该方法说明，accept 在当前环境下获取的 file type 与设置的 accept 不符，上传行为提前终止。可以打个断点到 upload/foundation.js checkFileFormat 函数，看下获取的 file.type 真实值是否符合预期。

> 进度条表示上传进度，上传进度分为数据上载和服务器返回两部分，如果数据已经全部发出，但是服务器没有返回响应，进度条会停留在95%提示用户上传并没有完成，此时开发者工具中请求会处于 pending, 这是正常现象。仅当服务器返回响应，上传流程才真正结束，上传进度会达到100%

## Vue 公开契约与 React → Vue

受控列表使用 `v-model` 或 `v-model:file-list`，不要同时绑定两者；非受控初始值使用 `defaultFileList`。每次变更发出 `change({ currentFile, fileList })`、`update:modelValue` 和 `update:fileList`，父级需要回传列表。File 和组件实例等身份敏感对象使用 `shallowRef` 保存。

| React v2.102.0                                         | Vue 3.5                                         |
| ------------------------------------------------------ | ----------------------------------------------- |
| children                                               | 默认插槽                                        |
| prompt / dragIcon / dragMainText / dragSubText         | 同名 VNode prop 或具名插槽                      |
| renderFileItem                                         | fileItem 作用域插槽或同名函数 prop              |
| renderThumbnail / renderPicInfo / renderPicPreviewIcon | thumbnail / picInfo / picPreviewIcon 作用域插槽 |
| renderPicClose / renderFileOperation                   | picClose / fileOperation 作用域插槽             |
| previewFile                                            | 返回 Vue VNode 的函数；必要时用 h()             |
| fileListTitle 节点 / 函数                              | VNode prop / fileListTitle 作用域插槽           |
| onChange / onProgress / onSuccess / onError            | @change / @progress / @success / @error         |
| ref.current                                            | useTemplateRef<UploadExposed>() 后读取 .value   |
| Upload.FileCard                                        | upload 子路径导出的 UploadFileCard              |
| ReactNode / SyntheticEvent                             | VNodeChild / 原生 DOM 事件                      |

文件渲染插槽接收现有公开类型 `UploadRenderFileItemProps`，包含文件数据、`onRemove`、`onRetry` 与 `onReplace`；`picClose` 接收 `{ className, remove }`，`fileListTitle` 接收 `{ fileList, onClear, clearText }`。替换渲染不会改变文件上传流程。

其他公开 prop 包括 `modelValue`、`timeout` 和 `validateStatus: 'default' | 'error' | 'warning' | 'success'`。`showClear`、`showRetry`、`showTooltip`、`showUploadList` 默认均为 true；关闭时传显式绑定 false，例如 `:show-upload-list="false"`。

实例另暴露 `clear(): void` 和 `remove(file: UploadFileItem): void`，都遵守 before hook。`insert(files, index?)` 会经过与选择文件相同的格式、大小和数量校验。

### 键盘、裁切与生命周期

触发区内优先使用原生 Button。沿用上游的 role/button 包装本身没有独立实现 Enter/Space 激活，不应将其描述为完整键盘交互。自定义图标操作必须提供可访问名称。文件列表保留 list/listitem 角色，图片替代文本为文件名。

选择、拖拽、粘贴、替换入口均可对支持的图片打开裁切弹窗；`beforeCrop` 返回 false 会跳过裁切并上传原图。取消与裁切失败需区分，失败通过 `@crop-error` 处理。ConfigProvider 提供语言与方向配置。

不要在模块导入时构造 File、读取 document 或创建计时器。这里的模拟计时器仅在请求时创建，卸载时清理。本地示意图片替代上游远程素材，本次不作视觉验收结论。中英文上游图片墙示例顺序不同，各语言保留原顺序，映射按功能对应。
