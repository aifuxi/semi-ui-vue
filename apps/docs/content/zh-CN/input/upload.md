---
title: 'Upload 上传'
description: '文件选择上传'
type: 'input'
order: 53
icon: 'doc-upload'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/upload` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-input-upload-1" title="如何引入" kind="import" />

### 基本

最基本的用法，在 默认插槽内容 内放置一个 Button，点击 默认插槽内容 内容（即放置的 Button）激活文件选择框，选择完成后自动开始上传

<DemoBlock id="zh-CN-input-upload-2" title="基本" kind="live" />

### 文件名超长省略

通过 `showTooltip` 属性，自定义设置文件名弹出提示

当类型为 `boolean` 时，控制是否弹出提示

<DemoBlock id="zh-CN-input-upload-3" title="文件名超长省略" kind="live" />

当类型为 `object` 时，可以自定义弹出样式

<DemoBlock id="zh-CN-input-upload-4" title="文件名超长省略" kind="live" />

### 添加提示文本

通过 `prompt` 插槽，设置自定义提示文本
通过 `promptPosition` 设置插槽位置，可选 `left`、`right`、`bottom`，默认为 `right`

<DemoBlock id="zh-CN-input-upload-5" title="添加提示文本" kind="live" />

当 listType 为 picture 时，promptPosition 位置的参照对象为图片墙列表整体

<DemoBlock id="zh-CN-input-upload-6" title="添加提示文本" kind="live" />

### 点击头像触发上传

<DemoBlock id="zh-CN-input-upload-7" title="点击头像触发上传" kind="live" />

<DemoBlock id="zh-CN-input-upload-8" title="点击头像触发上传" kind="code" />

### 自定义上传属性

通过设置 `data`、`headers` 可添加自定义上传属性

<DemoBlock id="zh-CN-input-upload-9" title="自定义上传属性" kind="live" />

### 上传文件类型

通过 `accept 属性（`input`的原生`html` 属性）可以限制上传的文件类型。

`accept` 支持传入以下两种类型字符串：

- 文件后缀名集合（推荐），如 .jpg、.png 等；
- 文件类型的 MIME types 集合，可参考[MDN 文档](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types)

例如只允许用户上传 PNG 和 PDF 文件，`accept` 可以这样写： `accept = '.pdf,.png'` 或 `accept = 'application/pdf,image/png'`（将 PNG 与 PDF 的 MIME type 通过`,`连接起来即可）。

accept 使用后缀可以避免因为浏览器或者操作系统的不同导致 file.type 与 MIME 不兼容问题。

<DemoBlock id="zh-CN-input-upload-10" title="上传文件类型" kind="live" />

### 上传文件夹

通过传入 `directory` 为 `true`，可以支持上传文件夹下的所有文件

<DemoBlock id="zh-CN-input-upload-11" title="上传文件夹" kind="live" />

### 一次选中多个文件

通过设置 `multiple` 属性可以支持同时选中多个文件上传。

<DemoBlock id="zh-CN-input-upload-12" title="一次选中多个文件" kind="live" />

### 限制文件总数量

通过设置 `limit` 属性可以限制最大可上传的文件数
当 `limit` 为1时，始终用最新上传的代替当前，并不会触发 `exceed` 事件

<DemoBlock id="zh-CN-input-upload-13" title="限制文件总数量" kind="live" />

<DemoBlock id="zh-CN-input-upload-14" title="限制文件总数量" kind="live" />

照片墙模式下，当已上传文件数量等于 limit 时，会自动隐藏上传入口

<DemoBlock id="zh-CN-input-upload-15" title="限制文件总数量" kind="live" />

### 限制上传文件大小

通过 `maxSize` 和 `minSize` 属性可以自定义上传文件大小的限制，超出限制时会触发 `sizeError` 事件。

<DemoBlock id="zh-CN-input-upload-16" title="限制上传文件大小" kind="live" />

### 自定义列表操作区

`listType` 为 `list` 时，可以通过传入 `renderFileOperation` 来自定义列表操作区

<DemoBlock id="zh-CN-input-upload-17" title="自定义列表操作区" kind="live" />

### 自定义文件列表标题

`listType` 为 `list` 时，可以通过 `fileListTitle` 自定义文件列表顶部的标题区域。支持两种形式：

#### 字符串、VNodeChild 或插槽形式

当传入字符串或 VNodeChild 时，仅替换标题文字，清空按钮保持默认样式：

<DemoBlock id="zh-CN-input-upload-18" title="字符串、VNodeChild 或插槽形式" kind="live" />

#### 函数形式

当传入函数时，可以完全自定义标题区域，包括清空按钮。函数会接收以下参数：

- `fileList`: 当前文件列表
- `clear`：清空文件时触发的事件
- `clearText`: 清空按钮的默认文案（根据当前语言环境）

<DemoBlock id="zh-CN-input-upload-19" title="函数形式" kind="live" />

### 自定义预览逻辑

`listType` 为 `list` 时，可以通过传入 `previewFile` 览逻辑
例如你不需要对图片类型进行缩略图预览时，可以在 `previewFile` 中恒定返回一个``
假如你希望点击图片时放大预览，则可以在 `previewFile`中使用 Image 组件
或者你希望使用额外的操作区来实现点击放大预览，你也可以结合 `renderFileOperation` 放置一些自定义元素例如 Icon 图标实现点击放大

<DemoBlock id="zh-CN-input-upload-20" title="自定义预览逻辑" kind="live" />

结合 renderFileOperation 与 ImagePreview 的示例，以下示例点击右侧第一个 Icon 可放大图片预览

<DemoBlock id="zh-CN-input-upload-21" title="自定义预览逻辑" kind="live" />

### 默认文件列表

通过 `defaultFileList` 可以展示已上传的文件。当需要预览默认文件的缩略图时，你可以将 `defaultFileList` 内对应 `item` 的 `preview` 属性设为 `true`

<DemoBlock id="zh-CN-input-upload-22" title="默认文件列表" kind="live" />

### 受控组件

传入 `fileList` 时组件受控；推荐使用 `v-model:fileList`，也可以监听 `change` 事件并回传新的数组对象。

<DemoBlock id="zh-CN-input-upload-23" title="受控组件" kind="live" />

### 图片墙

设置 `listType = 'picture'`，用户可以上传图片并在列表中显示缩略图
如果通过 defaultFileList 或 fileList 设置已上传的文件列表时，会自动读取对象数组中的 url 属性用于展示图片

<DemoBlock id="zh-CN-input-upload-24" title="图片墙" kind="live" />

设置 `showPicInfo`，可以查看图片基础信息

<DemoBlock id="zh-CN-input-upload-25" title="图片墙" kind="live" />

### 图片墙放大预览

配合 Image 组件，通过 renderThumbnail API，可以实现点击图片放大预览

<DemoBlock id="zh-CN-input-upload-26" title="图片墙放大预览" kind="live" />

可以通过 `#picPreviewIcon` 插槽自定义预览图标，并监听 `previewClick` 事件，当显示替换图标 `showReplace` 时，不会再显示预览图标
当需要自定义预览/替换功能时，需要关闭替换功能，使用 `#picPreviewIcon` 插槽并监听 `previewClick` 事件即可。
`previewClick` 在点击单张图片容器时触发

<DemoBlock id="zh-CN-input-upload-27" title="图片墙放大预览" kind="live" />

### 图片墙设置宽高

通过设置 picHeight, picWidth （ v2.42 后提供），可以统一设置图片墙元素的宽高
如果同时使用 `renderThumbnail` return Image 组件来实现点击放大预览，你需要同时指定 Image 组件的 width 和 height

<DemoBlock id="zh-CN-input-upload-28" title="图片墙设置宽高" kind="live" />

设置 `hotSpotLocation` 自定义点击热区的顺序，默认在照片墙列表结尾

<DemoBlock id="zh-CN-input-upload-29" title="图片墙设置宽高" kind="live" />

### 禁用

<DemoBlock id="zh-CN-input-upload-30" title="禁用" kind="live" />

### 手动触发上传

`uploadTrigger='custom'`，选中文件后将不会自动触发上传。需要手动调用 `ref` 上的 `upload` 方法触发

<DemoBlock id="zh-CN-input-upload-31" title="手动触发上传" kind="live" />

### 拖拽上传

`draggable='true'`，可以使用拖拽功能

<DemoBlock id="zh-CN-input-upload-32" title="拖拽上传" kind="live" />

可以通过 `dragIcon`、`dragMainText`、`dragSubText` 快捷设置拖拽区内容

<DemoBlock id="zh-CN-input-upload-33" title="拖拽上传" kind="live" />

还可以通过默认插槽传入内容，完全自定义拖拽区的显示

<DemoBlock id="zh-CN-input-upload-34" title="拖拽上传" kind="live" />

Scss 样式如下

<DemoBlock id="zh-CN-input-upload-35" title="拖拽上传" kind="code" />

### 上传前自定义校验

可通过 `beforeUpload` 钩子，对文件状态进行更新，这是在网络上传前，选择文件后进行校验，`({ file: FileItem, fileList: Array }) => beforeUploadResult | Promise | boolean` 同步校验时需返回 boolean（true 为校验通过，false 为校验失败，校验失败会阻止文件网络上传）或者一个 Object 对象，具体结构如下

<DemoBlock id="zh-CN-input-upload-36" title="上传前自定义校验" kind="code" />

<DemoBlock id="zh-CN-input-upload-37" title="上传前自定义校验" kind="live" />

异步校验时，需返回 Promise，Promise resolve 代表检验通过，reject 代表校验失败，不会触发上传。
resolve/reject 时可以传入 object（结构同上 beforeUploadResult）

<DemoBlock id="zh-CN-input-upload-38" title="上传前自定义校验" kind="live" />

### 上传后更新文件信息

可以通过 `afterUpload` 钩子，对文件状态，校验信息，文件名进行更新。
`({ response: any, file: FileItem, fileList: Array }) => afterUploadResult`
`afterUpload` 在上传完成后(`xhr.onload`)且没有发生错误的情况下触发，需返回一个 Object 对象（不支持异步返回），具体结构如下

<DemoBlock id="zh-CN-input-upload-39" title="上传后更新文件信息" kind="code" />

<DemoBlock id="zh-CN-input-upload-40" title="上传后更新文件信息" kind="live" />

### 自定义请求

当传入 customRequest 时, 相当于使用的自定义的请求方法替换了 upload 内置的 xhr 请求，用户需要自行接管上传行为。
可在入参中获取到当前操作的 file 对象，用户自行实现上传过程，并且在适当的时候调用 customRequest 入参中的 onProgress、onError、onSuccess 以更新 Upload 组件内部状态进而驱动 UI 更新
customRequest 包含以下入参

<DemoBlock id="zh-CN-input-upload-41" title="自定义请求" kind="code" />

<DemoBlock id="zh-CN-input-upload-42" title="自定义请求" kind="live" />

### 图片裁切

通过 `crop` 属性启用图片裁切功能。支持点击选择、拖拽、粘贴、替换文件时进行裁切。

#### 基本用法

设置 `crop={true}` 启用默认裁切配置。

<DemoBlock id="zh-CN-input-upload-43" title="基本用法" kind="live" />

#### 自定义裁切配置

通过对象形式配置裁切参数，包括宽高比、形状、质量等。

<DemoBlock id="zh-CN-input-upload-44" title="自定义裁切配置" kind="live" />

#### 圆形裁切

适用于头像上传场景，设置 `shape: 'round'` 启用圆形裁切。

<DemoBlock id="zh-CN-input-upload-45" title="圆形裁切" kind="live" />

#### 裁切前确认

通过 `beforeCrop` 回调，在裁切前进行确认或其他处理。返回 `false` 可跳过裁切直接上传。

<DemoBlock id="zh-CN-input-upload-46" title="裁切前确认" kind="live" />

#### 拖拽上传裁切

拖拽上传时也会触发裁切功能。

<DemoBlock id="zh-CN-input-upload-47" title="拖拽上传裁切" kind="live" />

#### 自定义裁切弹窗样式

通过 `cropModalProps` 自定义裁切弹窗的样式和属性。

<DemoBlock id="zh-CN-input-upload-48" title="自定义裁切弹窗样式" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/upload/types.ts` 的公开类型为准。

- `v-model` 对应 `modelValue`；也支持 `v-model:fileList`。

#### Vue 事件

**Upload**

| 事件                               | 参数                               | 说明                                      |
| ---------------------------------- | ---------------------------------- | ----------------------------------------- |
| change                             | [payload: UploadChangePayload]     | 文件列表或当前文件变化                    |
| fileChange                         | [files: File[]]                    | 选择文件                                  |
| success / error / progress         | 见 UploadEmits                     | 上传状态变化                              |
| remove / retry / clear             | 见 UploadEmits                     | 列表操作                                  |
| drop                               | [event: Event, files, fileList]    | 释放拖拽文件                              |
| exceed / acceptInvalid / sizeError | 见 UploadEmits                     | 文件限制校验                              |
| previewClick                       | [file: UploadFileItem]             | 点击文件卡片                              |
| openFileDialog                     | []                                 | 打开系统文件选择器                        |
| pastingError                       | [error: Error \| PermissionStatus] | 读取粘贴内容失败                          |
| cropError                          | [error: Error]                     | 图片裁切失败；同时保留 `onCropError` prop |

#### Vue 插槽

**Upload**

| 插槽                                  | 作用域参数                     | 说明         |
| ------------------------------------- | ------------------------------ | ------------ |
| default                               | {}                             | 上传触发区   |
| dragIcon / dragMainText / dragSubText | {}                             | 拖拽区内容   |
| prompt                                | {}                             | 提示内容     |
| fileItem                              | UploadRenderFileItemProps      | 文件项       |
| thumbnail / picInfo / picPreviewIcon  | UploadRenderFileItemProps      | 图片列表内容 |
| picClose                              | UploadRenderPictureCloseProps  | 图片关闭按钮 |
| fileOperation                         | UploadRenderFileItemProps      | 文件操作区   |
| fileListTitle                         | UploadRenderFileListTitleProps | 文件列表标题 |

---

| 属性                 | 说明                                                                                                                                                                                                                                                                                                 | 类型                                                                                                     | 默认值                         | 版本   |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------ | ------ |
| accept               | `html` 原生属性，接受上传的[文件类型](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-accept)。 `accept` 的值为你允许选择文件的[MIME types 字符串](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types)或文件后缀（.jpg等） | string                                                                                                   | —                              |        |
| action               | 文件上传地址，必填                                                                                                                                                                                                                                                                                   | string（必填）                                                                                           | —                              |        |
| afterUpload          | 文件上传后的钩子，根据 return 的 object 更新文件状态                                                                                                                                                                                                                                                 | (payload: UploadAfterProps) =&gt; UploadAfterResult \| undefined                                         | —                              |        |
| beforeUpload         | 上传文件前的钩子，根据 return 的 object 更新文件状态，控制是否上传                                                                                                                                                                                                                                   | ( payload: UploadBeforeProps, ) =&gt; UploadBeforeResult \| Promise&lt;UploadBeforeResult&gt; \| boolean | —                              |        |
| beforeClear          | 清空文件前回调，按照返回值来判断是否继续移除，返回false、Promise.resolve(false)、Promise.reject()会阻止移除                                                                                                                                                                                          | (fileList: UploadFileItem[]) =&gt; boolean \| Promise&lt;boolean&gt;                                     | —                              |        |
| beforeRemove         | 移除文件前的回调，按照返回值来判断是否继续移除，返回false、Promise.resolve(false)、Promise.reject()会阻止移除                                                                                                                                                                                        | (file: UploadFileItem, fileList: UploadFileItem[]) =&gt; boolean \| Promise&lt;boolean&gt;               | —                              |        |
| capture              | 文件上传控件中媒体拍摄的方式                                                                                                                                                                                                                                                                         | boolean \| 'user' \| 'environment'                                                                       | —                              |        |
| class                | —                                                                                                                                                                                                                                                                                                    | HTMLAttributes['class']                                                                                  | —                              |        |
| className            | 类名                                                                                                                                                                                                                                                                                                 | HTMLAttributes['class']                                                                                  | —                              |        |
| customRequest        | 自定义上传使用的异步请求方法                                                                                                                                                                                                                                                                         | (payload: UploadCustomRequestArgs) =&gt; void                                                            | —                              |        |
| data                 | 上传时附带的额外参数或返回上传额外参数的方法                                                                                                                                                                                                                                                         | Record&lt;string, unknown&gt; \| ((file: File) =&gt; Record&lt;string, unknown&gt;)                      | {}                             |        |
| defaultFileList      | 已上传的文件列表                                                                                                                                                                                                                                                                                     | UploadFileItem[]                                                                                         | []                             |        |
| directory            | 文件夹类型上传                                                                                                                                                                                                                                                                                       | boolean                                                                                                  | false                          |        |
| disabled             | 是否禁用                                                                                                                                                                                                                                                                                             | boolean                                                                                                  | false                          |        |
| dragIcon             | 拖拽区左侧 Icon                                                                                                                                                                                                                                                                                      | VNodeChild                                                                                               | ``                             |        |
| dragMainText         | 拖拽区主文本                                                                                                                                                                                                                                                                                         | VNodeChild                                                                                               | '点击上传文件或拖拽文件到这里' |        |
| dragSubText          | 拖拽区帮助文本                                                                                                                                                                                                                                                                                       | VNodeChild                                                                                               | ''                             |        |
| draggable            | 是否支持拖拽上传                                                                                                                                                                                                                                                                                     | boolean                                                                                                  | false                          |        |
| addOnPasting         | 按下 ctrl/command + v时，是否自动将剪贴板中的文件添加至 fileList，当前仅支持图片类型; 需用户授权同意                                                                                                                                                                                                 | boolean                                                                                                  | false                          | 2.43.0 |
| fileList             | 已上传的文件列表，传入该值时，upload 即为受控组件                                                                                                                                                                                                                                                    | UploadFileItem[] \| undefined                                                                            | —                              |        |
| modelValue           | —                                                                                                                                                                                                                                                                                                    | UploadFileItem[] \| undefined                                                                            | —                              |        |
| fileName             | 作用与 name 相同，主要在 Form.Upload 中使用，为了避免与 Field 的 props.name 冲突，此处另外提供一个重命名的 props                                                                                                                                                                                     | string                                                                                                   | —                              |        |
| headers              | 上传时附带的 headers 或返回上传额外 headers 的方法                                                                                                                                                                                                                                                   | Record&lt;string, unknown&gt; \| ((file: File) =&gt; Record&lt;string, string&gt;)                       | {}                             |        |
| hotSpotLocation      | 照片墙点击热区的放置位置，可选值 `start`, `end`                                                                                                                                                                                                                                                      | 'start' \| 'end'                                                                                         | 'end'                          | 2.5.0  |
| itemStyle            | fileCard 的内联样式                                                                                                                                                                                                                                                                                  | StyleValue                                                                                               | —                              |        |
| limit                | 最大允许上传文件个数                                                                                                                                                                                                                                                                                 | number                                                                                                   | —                              |        |
| listType             | 文件列表展示类型，可选`picture`、`list`                                                                                                                                                                                                                                                              | UploadListType                                                                                           | 'list'                         |        |
| maxSize              | 文件体积最大限制，单位 KB                                                                                                                                                                                                                                                                            | number                                                                                                   | —                              |        |
| minSize              | 文件体积最小限制，单位 KB                                                                                                                                                                                                                                                                            | number                                                                                                   | —                              |        |
| multiple             | 是否允许单次选中多个文件                                                                                                                                                                                                                                                                             | boolean                                                                                                  | false                          |        |
| name                 | 上传时使用的文件名                                                                                                                                                                                                                                                                                   | string                                                                                                   | ''                             |        |
| picHeight            | 图片墙模式下，可通过该 API 定制图片展示高度                                                                                                                                                                                                                                                          | string \| number                                                                                         | —                              | 2.42.0 |
| picWidth             | 图片墙模式下，可通过该 API 定制图片展示宽度                                                                                                                                                                                                                                                          | string \| number                                                                                         | —                              | 2.42.0 |
| prompt               | 自定义插槽，可用于插入提示文本。与直接在 `默认插槽内容` 中写的区别时，`prompt` 的内容在点击时不会触发上传                                                                                                                                                                                            | VNodeChild                                                                                               | —                              |        |
| promptPosition       | 提示文本的位置，当 listType 为 list 时，参照物为 默认插槽内容 元素；当 listType 为 picture 时，参照物为图片列表。可选值 `left`、`right`、`bottom`                                                                                                                                                    | UploadPromptPosition                                                                                     | 'right'                        |        |
| showClear            | 在 limit 不为 1 且当前已上传文件数大于 1 时，是否展示清空按钮                                                                                                                                                                                                                                        | boolean                                                                                                  | true                           |        |
| showPicInfo          | 是否显示图片信息，只在照片墙模式下有效                                                                                                                                                                                                                                                               | boolean                                                                                                  | false                          | 2.2.0  |
| showReplace          | 上传成功时，是否展示在 fileCard 内部展示替换按钮                                                                                                                                                                                                                                                     | boolean                                                                                                  | false                          |        |
| showRetry            | 上传失败时，是否展示在 fileCard 内部展示重试按钮                                                                                                                                                                                                                                                     | boolean                                                                                                  | true                           |        |
| showTooltip          | 文件名超长时，是否展示 tooltip 及相关配置: type，浮层内容承载的组件，支持 Tooltip \| Popover；opts，其他需要透传给浮层组件的属性； renderTooltip，自定义渲染弹出层组件                                                                                                                               | boolean \| TypographyShowTooltip                                                                         | true                           |        |
| showUploadList       | 是否显示文件列表                                                                                                                                                                                                                                                                                     | boolean                                                                                                  | true                           |        |
| style                | 样式                                                                                                                                                                                                                                                                                                 | StyleValue                                                                                               | —                              |        |
| timeout              | —                                                                                                                                                                                                                                                                                                    | number                                                                                                   | —                              |        |
| transformFile        | 选中文件后，上传文件前的回调函数，可用于对文件进行自定义转换处理                                                                                                                                                                                                                                     | (file: File) =&gt; UploadCustomFile                                                                      | —                              |        |
| uploadTrigger        | 触发上传时机，可选值 `auto`、`custom`                                                                                                                                                                                                                                                                | UploadTrigger                                                                                            | 'auto'                         |        |
| validateMessage      | Upload 整体的错误信息                                                                                                                                                                                                                                                                                | VNodeChild                                                                                               | —                              |        |
| validateStatus       | —                                                                                                                                                                                                                                                                                                    | 'default' \| 'error' \| 'warning' \| 'success'                                                           | —                              |        |
| withCredentials      | 是否带上 Cookie 信息                                                                                                                                                                                                                                                                                 | boolean                                                                                                  | false                          |        |
| crop                 | 启用图片裁切功能。传入 `true` 使用默认配置，传入对象可自定义裁切参数。支持所有上传入口（点击选择、拖拽、粘贴、替换）的图片裁切                                                                                                                                                                       | boolean \| UploadCropProps                                                                               | —                              | 2.97.0 |
| beforeCrop           | 图片裁切前的回调。返回 `false` 可跳过裁切直接上传，返回 `true` 或不返回则继续裁切。支持异步返回                                                                                                                                                                                                      | (file: File, fileList: File[]) =&gt; boolean \| Promise&lt;boolean&gt;                                   | —                              | 2.97.0 |
| onCropError          | 图片裁切失败时的回调                                                                                                                                                                                                                                                                                 | (error: Error) =&gt; void                                                                                | —                              | 2.97.0 |
| cropModalProps       | 自定义裁切弹窗的属性，可配置弹窗的样式、宽度等                                                                                                                                                                                                                                                       | ModalProps                                                                                               | —                              | 2.97.0 |
| previewFile          | 自定义预览逻辑，该函数返回内容将会替换原缩略图                                                                                                                                                                                                                                                       | (props: UploadRenderFileItemProps) =&gt; VNodeChild                                                      | —                              |        |
| renderFileItem       | fileCard 的自定义渲染                                                                                                                                                                                                                                                                                | (props: UploadRenderFileItemProps) =&gt; VNodeChild                                                      | —                              |        |
| renderPicInfo        | 自定义照片墙信息，只在照片墙模式下有效                                                                                                                                                                                                                                                               | (props: UploadRenderFileItemProps) =&gt; VNodeChild                                                      | —                              | 2.2.0  |
| renderThumbnail      | 自定义图片墙缩略图，只在照片墙模式下有效                                                                                                                                                                                                                                                             | (props: UploadRenderFileItemProps) =&gt; VNodeChild                                                      | —                              | 2.2.0  |
| renderPicPreviewIcon | 自定义照片墙hover时展示的预览图标，只在照片墙模式下有效                                                                                                                                                                                                                                              | (props: UploadRenderFileItemProps) =&gt; VNodeChild                                                      | —                              | 2.5.0  |
| renderPicClose       | 自定义照片墙 close 按钮，只在照片墙模式下有效                                                                                                                                                                                                                                                        | (props: UploadRenderPictureCloseProps) =&gt; VNodeChild                                                  | —                              | 2.75.0 |
| renderFileOperation  | 自定义列表项操作区                                                                                                                                                                                                                                                                                   | (props: UploadRenderFileItemProps) =&gt; VNodeChild                                                      | —                              | 2.5.0  |
| fileListTitle        | 自定义文件列表标题区域。支持两种形式： 1. 传入 VNodeChild 时，仅替换标题文字，清空按钮保持默认样式 2. 传入函数时，可完全自定义标题区域（包括清空按钮），函数参数为 `{ fileList, onClear, clearText }`                                                                                                | VNodeChild \| ((props: UploadRenderFileListTitleProps) =&gt; VNodeChild)                                 | —                              | 2.75.0 |

## Interfaces

### FileItem Interface

<DemoBlock id="zh-CN-input-upload-49" title="FileItem Interface" kind="code" />

### RenderFileListTitleProps Interface

`fileListTitle` 传入函数时的参数类型：

<DemoBlock id="zh-CN-input-upload-50" title="RenderFileListTitleProps Interface" kind="code" />

### CropProps Interface

`crop` 属性传入对象时的配置项：

<DemoBlock id="zh-CN-input-upload-51" title="CropProps Interface" kind="code" />

## Methods

绑定在组件实例上的方法，可以通过 ref 调用实现某些特殊交互

| 名称           | 描述                                                        | 类型                                   | 版本   |
| -------------- | ----------------------------------------------------------- | -------------------------------------- | ------ |
| insert         | 上传文件，当index传入时，会插入到指定位置，不传则插入到最后 | (files: Array, index?: number) => void | 2.2.0  |
| upload         | 手动开始上传，配合uploadTrigger="custom"使用                | () => void                             |        |
| openFileDialog | 打开文件选择窗口                                            | () => void                             | 2.21.0 |

## Accessibility

Upload组件是一个可交互的控件，在点击或拖拽时触发文件选择，文件选中后会在文件列表内展示状态。

### ARIA

- 为可点击元素添加 `role="button"`
- 文件列表添加 `role="list"`，并用 `aria-label` 描述

## 文案规范

- 上传按钮
- 关于表单按钮的文案规范，参考[按钮Button组件的文案规范](/zh-CN/basic/button#%E6%96%87%E6%A1%88%E8%A7%84%E8%8C%83)
- 帮助文本
- 帮助文本使用语句书写规范，首字母大写，可以不需要句号
- 用户出错提示
- 清晰地告诉用户为什么文件无法被上传，并且告知用户如何操作能够成功上传
- 帮助文本使用语句书写规范，首字母大写
- 简洁的用语让用户能够一眼读懂，比如 `File size must be less than 20MB`, `File type must be .gif, .jpg, .png or .svg`

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
