---
title: 'Upload'
description: 'File selection and upload'
locale: 'en-US'
slug: 'upload'
category: 'input'
order: 53
englishTitle: 'Upload'
icon: 'doc-upload'
upstream: 'input/upload'
---

These Vue 3.5 examples follow Semi Design v2.102.0. Every example uses a local `customRequest`; files stay in your browser. Progress and responses are simulated. Preview assets are served from `/demos/`. Cropping processes the images you select in the browser.

## Demos

### How to import

```ts
import { Upload } from '@aifuxi/semi-ui-vue/upload';
import '@aifuxi/semi-theme-default/upload.css';
```

### Basic usage

The most basic usage is to place a Button in default slot, click on the default slot content (the placed Button) to activate the file selection box, and the upload will start automatically after the selection is completed

::demo-block{demo="upload/en-US/Basic" title="Basic"}
::

### File name too long ellipsis

Customize the file name tooltip using the `showTooltip` property

When the type is `boolean`, control whether to show the tooltip

::demo-block{demo="upload/en-US/NoTooltip" title="No Tooltip"}
::

When the type is `object`, you can customize the tooltip style.

The upstream example uses `renderTooltip` only to set the bottom position. The current public Vue type exposes `type` and `opts`, so this example uses `opts.position = "bottom"`. Arbitrary `renderTooltip` callbacks are not supported.

::demo-block{demo="upload/en-US/CustomTooltip" title="Custom Tooltip"}
::

### Add prompt text

Set a custom prompt text through the `prompt` slot
Set the slot position by `promptPosition`, optional `left`, `right`, `bottom`, the default is `right`

::demo-block{demo="upload/en-US/Prompt" title="Prompt"}
::

When listType is picture, the reference object at promptPosition is the whole picture wall list

::demo-block{demo="upload/en-US/PicturePrompt" title="Picture Prompt"}
::

### Click on the avatar to trigger upload

::demo-block{demo="upload/en-US/AvatarUpload" title="Avatar Upload"}
::

```css
.avatar-upload .semi-upload-add {
    border-radius: 50%; // Make sure that only the circle is clicked on the hot zone
}
```

### Custom upload attributes

Custom upload attributes can be added by setting `data`, `headers`

::demo-block{demo="upload/en-US/RequestAttributes" title="Request Attributes"}
::

### Upload file type

The type of files uploaded can be restricted through the `accept` attribute (the native `html` attribute of `input`).

`accept` supports the following two types of strings:

- A collection of file extensions (recommended), such as .jpg, .png, etc.;
- MIME types collection of file types, please refer to [MDN document](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types)

For example, only allowing users to upload PNG and PDF files, `accept` can be written like this: `accept ='.pdf,.png'` or `accept ='application/pdf,image/png'` (the MIME type of PNG and PDF Connect through `,`).

> Upload will intercept files that do not meet the accept format internally. When files that do not meet the format requirements are intercepted, the @accept-invalid method (provided by v1.24) will be triggered;
> accept uses the suffix to avoid the incompatibility between file.type and MIME due to different browsers or operating systems.

::demo-block{demo="upload/en-US/Accept" title="Accept"}
::

### Upload folder

By passing in `directory` as `true`, all files in the folder can be uploaded

::demo-block{demo="upload/en-US/Directory" title="Directory"}
::

### Select multiple files at once

You can select multiple files to upload at the same time by setting the `multiple` attribute.

::demo-block{demo="upload/en-US/Multiple" title="Multiple"}
::

### Limit the total number of files

You can limit the maximum number of files that can be uploaded by setting the `limit` property
When `limit` is 1, always replace the current one with the latest upload, and will not trigger the @exceed callback

::demo-block{demo="upload/en-US/SingleLimit" title="Single Limit"}
::

::demo-block{demo="upload/en-US/DisableAtLimit" title="Disable At Limit"}
::

In the photo wall mode, when the number of uploaded files is equal to the limit, the upload entry will be automatically hidden

::demo-block{demo="upload/en-US/PictureLimit" title="Picture Limit"}
::

### Limit upload file size

The upload file size limit can be customized through the `maxSize` and `minSize` properties, and the callback when the limit is exceeded can be set by setting `@size-error`.

::demo-block{demo="upload/en-US/SizeLimit" title="Size Limit"}
::

### Custom list operation area

When `listType` is `list`, you can customize the list operation area by passing in `renderFileOperation`

::demo-block{demo="upload/en-US/FileOperations" title="File Operations"}
::

### Custom file list title

When `listType` is `list`, you can customize the title area at the top of the file list through `fileListTitle`. Two forms are supported:

#### String or VNodeChild form

When passing a string or VNodeChild, only the title text is replaced, and the clear button retains its default style:

::demo-block{demo="upload/en-US/ListTitle" title="List Title"}
::

#### Function form

When passing a function, you can fully customize the title area, including the clear button. The function receives the following parameters:

- `fileList`: Current file list
- `onClear`: Callback function to clear files
- `clearText`: Default text for the clear button (based on current locale)

::demo-block{demo="upload/en-US/ListTitleSlot" title="List Title Slot"}
::

### Custom preview logic

When `listType` is list, the preview logic can be implemented by passing in `previewFile`.

For example, when you don't need thumbnail preview for image types, you can constantly return a `<IconFile />` in previewFile.

If you want to enlarge and preview the image when clicked, you can use the `Image` component in `previewFile`.

Or if you want to use an additional operation area to achieve enlarged preview when clicked, you can also combine `renderFileOperation` to place some custom elements such as Icon to achieve enlarged preview when clicked.

::demo-block{demo="upload/en-US/PreviewFile" title="Preview File"}
::
The following is an example of combining `renderFileOperation` and `ImagePreview`. In this example, clicking the first Icon on the right can enlarge the image for preview.
::demo-block{demo="upload/en-US/PreviewOperations" title="Preview Operations"}
::

### Default file list

The uploaded files can be displayed through `defaultFileList`. When you need to preview the thumbnail of the default file, you can set the `preview` attribute of the corresponding `item` in `defaultFileList` to `true`

::demo-block{demo="upload/en-US/DefaultList" title="Default List"}
::

### Controlled component

When `fileList` is passed in, it is used as a controlled component. Need to listen to the @change callback, and pass the fileList back to Upload (note that a new array object needs to be passed in)

::demo-block{demo="upload/en-US/Controlled" title="Controlled"}
::

### Photo Wall

Set `listType ='picture'`, users can upload pictures and display thumbnails in the list

::demo-block{demo="upload/en-US/PictureWall" title="Picture Wall"}
::

Set `showPicInfo`, you can view the basic information of the picture

::demo-block{demo="upload/en-US/PictureInfo" title="Picture Info"}
::

You can customize the preview icon through `renderPicPreviewIcon`, `@preview-click`, when the replacement icon `showReplace` is displayed, the preview icon will no longer be displayed. <br />
When you need to customize the preview/replacement function, you need to turn off the replacement function and use `renderPicPreviewIcon` to listen for icon click events. <br />
`@preview-click` listens for the click event of the single image container

::demo-block{demo="upload/en-US/PreviewIcon" title="Preview Icon"}
::

Set `hotSpotLocation` to customize the order of click hotspots, the default is at the end of the photo wall list

::demo-block{demo="upload/en-US/HotSpot" title="Hot Spot"}
::

### Photo Wall With Preview

With the Image component, through the renderThumbnail API, you can click on the image to enlarge the preview

::demo-block{demo="upload/en-US/ThumbnailPreview" title="Thumbnail Preview"}
::

### Photo Wall Width/Height

By setting picHeight, picWidth (provided after v2.42), the width and height of picture wall elements can be uniformly set

::demo-block{demo="upload/en-US/PictureSize" title="Picture Size"}
::

### Disabled

::demo-block{demo="upload/en-US/Disabled" title="Disabled"}
::

### Manually trigger upload

`uploadTrigger='custom'`, the upload will not be triggered automatically after the file is selected. Need to manually call the upload method on the ref to trigger

::demo-block{demo="upload/en-US/Manual" title="Manual"}
::

### Drag and drop upload

`draggable='true'`, you can use the drag and drop function

> When the directory is true, because the browser automatically imposes restrictions, it is not allowed to select a single file when clicking upload. When dragging, we think it is more reasonable to allow folders and files to be dragged, so no additional interception processing is performed.

::demo-block{demo="upload/en-US/Drag" title="Drag"}
::

You can quickly set the content of the drag area through `dragIcon`, `dragMainText`, `dragSubText`

::demo-block{demo="upload/en-US/DragIcon" title="Drag Icon"}
::

You can also pass in VNodeChild through `default slot` to completely customize the display of the drag area

::demo-block{demo="upload/en-US/DragContent" title="Drag Content"}
::

The scss style is as follows

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

### Custom check before upload

The file status can be updated through the `beforeUpload` hook, which is to verify the file after selecting the file before uploading online, `({ file: FileItem, fileList: Array<FileItem> }) => beforeUploadResult | Promise | boolean` During synchronization verification, a boolean (true means the verification passed, false means the verification failed, and the verification failure will prevent the file from uploading online) or an Object object. The specific structure is as follows

```ts
interface UploadBeforeResult {
  shouldUpload?: boolean;
  status?: UploadFileStatus;
  autoRemove?: boolean;
  validateMessage?: VNodeChild;
  fileInstance?: UploadCustomFile;
}
```

::demo-block{demo="upload/en-US/BeforeUpload" title="Before Upload"}
::

In the case of asynchronous verification, a Promise must be returned. Promise resolve means that the verification is passed, and reject means that the verification fails and the upload will not be triggered.
Object can be passed in when resolve/reject (the structure is the same as beforeUploadResult)

::demo-block{demo="upload/en-US/AsyncBeforeUpload" title="Async Before Upload"}
::

### Update file information after upload

The file status, verification information, and file name can be updated through the `afterUpload` hook.
`({ response: any, file: FileItem, fileList: Array<FileItem> }) => afterUploadResult`
afterUpload is triggered when the upload is completed (xhr.onload) and no error occurs, it needs to return an Object object (asynchronous return is not supported), the specific structure is as follows

```ts
interface UploadAfterResult {
  autoRemove?: boolean;
  status?: UploadFileStatus;
  validateMessage?: VNodeChild;
  name?: string;
  url?: string;
}
```

::demo-block{demo="upload/en-US/AfterUpload" title="After Upload"}
::

### Custom request

When customRequest is passed in, it is equivalent to using the custom request method to replace the upload built-in xhr request, and the user needs to take over the upload behavior by himself.
The file object of the current operation can be obtained in the input parameters, and the user implements the upload process by himself, and calls onProgress, onError, and onSuccess in the customRequest input parameters when appropriate to update the internal state of the Upload component
customRequest contains the following input parameters

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

::demo-block{demo="upload/en-US/CustomRequest" title="Custom Request"}
::

### Image Cropping

Enable image cropping functionality through the `crop` property. Supports cropping when clicking to select, dragging, pasting, and replacing files.

#### Basic Usage

Set `crop={true}` to enable default cropping configuration.

The cropping demos set `cropModalProps.bodyStyle.height` to 400px. The current Vue cropper uses 100% of its parent height, so the modal body needs an explicit height; the custom modal demo uses 500px.

::demo-block{demo="upload/en-US/CropBasic" title="Crop Basic"}
::

#### Custom Cropping Configuration

Configure cropping parameters through object form, including aspect ratio, shape, quality, etc.

::demo-block{demo="upload/en-US/CropOptions" title="Crop Options"}
::

#### Round Cropping

Suitable for avatar upload scenarios, set `shape: 'round'` to enable round cropping.

::demo-block{demo="upload/en-US/CropRound" title="Crop Round"}
::

#### Confirm Before Cropping

Use the `beforeCrop` callback to confirm or perform other processing before cropping. Return `false` to skip cropping and upload directly.

::demo-block{demo="upload/en-US/BeforeCrop" title="Before Crop"}
::

#### Drag and Drop Upload with Cropping

Cropping is also triggered when uploading via drag and drop.

::demo-block{demo="upload/en-US/CropDrag" title="Crop Drag"}
::

#### Custom Cropping Modal Style

Customize the style and properties of the cropping modal through `cropModalProps`.

::demo-block{demo="upload/en-US/CropModal" title="Crop Modal"}
::

## API Reference

Event types below are Vue emits argument tuples. Version labels refer to the upstream Semi React version, not this Vue package version.

---

| Property             | Description                                                                                                                                                                                                                                                                                                                                                     | Type                                                                                                     | Default Value                                             | Version |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ------- |
| accept               | `html` Native attribute, accept uploaded [file type](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-accept). <br/>The value of `accept` is the [MIME types string](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types) or file that you allow to select the file Suffix (.jpg, etc.) | `string`                                                                                                 |                                                           |         |
| action               | File upload address, required                                                                                                                                                                                                                                                                                                                                   | `string`                                                                                                 |                                                           |         |
| afterUpload          | Hook after the file upload, update the file status according to the returned object                                                                                                                                                                                                                                                                             | `(payload: UploadAfterProps) => UploadAfterResult \| undefined`                                          |                                                           | -       |
| beforeClear          | Call back before clearing the file, judge whether to continue removing according to the return value, return false, Promise.resolve(false), Promise.reject() will prevent removal                                                                                                                                                                               | `(fileList: UploadFileItem[]) => boolean \| Promise<boolean>`                                            |                                                           | -       |
| beforeCrop           | Callback before opening the crop modal. Returning `false` (or resolving to `false`) skips cropping and uploads directly. Async returns are supported.                                                                                                                                                                                                           | `(file: File, fileList: File[]) => boolean \| Promise<boolean>`                                          |                                                           | 2.97.0  |
| beforeRemove         | Callback before removing the file, judge whether to continue removing according to the return value, return false, Promise.resolve(false), Promise.reject() will prevent removal                                                                                                                                                                                | `(file: UploadFileItem, fileList: UploadFileItem[]) => boolean \| Promise<boolean>`                      |                                                           | -       |
| beforeUpload         | The hook before uploading the file, according to the return object to update the file status, control whether to upload                                                                                                                                                                                                                                         | `( payload: UploadBeforeProps, ) => UploadBeforeResult \| Promise<UploadBeforeResult> \| boolean`        |                                                           | -       |
| capture              | The way of media shooting in the file upload control                                                                                                                                                                                                                                                                                                            | `boolean \| 'user' \| 'environment'`                                                                     |                                                           |         |
| className            | class name                                                                                                                                                                                                                                                                                                                                                      | `HTMLAttributes['class']`                                                                                |                                                           |         |
| crop                 | Enable image cropping. Pass `true` to use defaults, or a `CropProps` object to customize parameters. Works for click / drag-and-drop / paste / replace upload entries.                                                                                                                                                                                          | `boolean \| UploadCropProps`                                                                             |                                                           | 2.97.0  |
| cropModalProps       | Extra props forwarded to the underlying crop Modal (style, width, etc.)                                                                                                                                                                                                                                                                                         | `ModalProps`                                                                                             |                                                           | 2.97.0  |
| customRequest        | Asynchronous request method for custom upload                                                                                                                                                                                                                                                                                                                   | `(payload: UploadCustomRequestArgs) => void`                                                             |                                                           | -       |
| data                 | Additional parameters attached to the upload or the method to return the uploaded additional parameters                                                                                                                                                                                                                                                         | `Record<string, unknown> \| ((file: File) => Record<string, unknown>)`                                   | {}                                                        |         |
| defaultFileList      | List of uploaded files                                                                                                                                                                                                                                                                                                                                          | `UploadFileItem[]`                                                                                       | []                                                        |         |
| directory            | Folder type upload                                                                                                                                                                                                                                                                                                                                              | `boolean`                                                                                                | false                                                     | -       |
| disabled             | Whether to disable                                                                                                                                                                                                                                                                                                                                              | `boolean`                                                                                                | false                                                     |         |
| dragIcon             | Icon on the left side of the drag area                                                                                                                                                                                                                                                                                                                          | `VNodeChild`                                                                                             | `<IconUpload />`                                          | -       |
| dragMainText         | Main text of the drag area                                                                                                                                                                                                                                                                                                                                      | `VNodeChild`                                                                                             | 'Click to upload the file or drag and drop the file here' | -       |
| dragSubText          | Drag area help text                                                                                                                                                                                                                                                                                                                                             | `VNodeChild`                                                                                             | ''                                                        | -       |
| draggable            | Whether to support drag and drop upload                                                                                                                                                                                                                                                                                                                         | `boolean`                                                                                                | false                                                     | -       |
| fileList             | A list of uploaded files. When this value is passed in, upload is a controlled component                                                                                                                                                                                                                                                                        | `UploadFileItem[] \| undefined`                                                                          |                                                           | -       |
| fileListTitle        | Customize the file list title area. Two forms are supported:<br/>1. When passing a VNodeChild, only the title text is replaced, and the clear button retains its default style<br/>2. When passing a function, you can fully customize the title area (including the clear button). The function parameters are `{ fileList, onClear, clearText }`              | `VNodeChild \| ((props: UploadRenderFileListTitleProps) => VNodeChild)`                                  |                                                           | 2.75.0  |
| fileName             | has the same function as name and is mainly used in Form.Upload. In order to avoid conflicts with the props.name of Field, a renamed props is provided here                                                                                                                                                                                                     | `string`                                                                                                 |                                                           | -       |
| headers              | The headers attached to the upload or the method to return the uploaded additional headers                                                                                                                                                                                                                                                                      | `Record<string, unknown> \| ((file: File) => Record<string, string>)`                                    | {}                                                        |         |
| hotSpotLocation      | 照片墙点击热区的放置位置，可选值 `start`, `end`                                                                                                                                                                                                                                                                                                                 | `'start' \| 'end'`                                                                                       | 'end'                                                     | 2.5.0   |
| itemStyle            | Inline style of fileCard                                                                                                                                                                                                                                                                                                                                        | `StyleValue`                                                                                             |                                                           | -       |
| limit                | Maximum number of files allowed to be uploaded                                                                                                                                                                                                                                                                                                                  | `number`                                                                                                 |                                                           |         |
| listType             | File list display type, optional `picture` / `list` / `none`                                                                                                                                                                                                                                                                                                    | `UploadListType`                                                                                         | 'list'                                                    |         |
| maxSize              | Maximum file size limit, in KB                                                                                                                                                                                                                                                                                                                                  | `number`                                                                                                 |                                                           |         |
| minSize              | Minimum file size limit, unit KB                                                                                                                                                                                                                                                                                                                                | `number`                                                                                                 |                                                           |         |
| multiple             | Whether to allow multiple files to be selected at a time                                                                                                                                                                                                                                                                                                        | `boolean`                                                                                                | false                                                     |         |
| name                 | File name used when uploading                                                                                                                                                                                                                                                                                                                                   | `string`                                                                                                 | ''                                                        |         |
| @accept-invalid      | Triggered when the received file does not conform to the accept specification (generally because the folder selects all types of files / drags and drops files that do not conform to the format)                                                                                                                                                               | `[files: File[]]`                                                                                        |                                                           | 1.24 .0 |
| @change              | Called when the file status changes, including upload success, failure, upload, the callback input parameter is Object, including fileList, currentFile, etc.                                                                                                                                                                                                   | `[payload: UploadChangePayload]`                                                                         |                                                           | -       |
| @clear               | Callback when click to clear                                                                                                                                                                                                                                                                                                                                    | `[]`                                                                                                     |                                                           | -       |
| @crop-error          | Callback when image cropping fails                                                                                                                                                                                                                                                                                                                              | `[error: Error]`                                                                                         |                                                           | 2.97.0  |
| @drop                | Triggered when the dragged element is released on the drag area                                                                                                                                                                                                                                                                                                 | `[event: Event, files: File[], fileList: UploadFileItem[]]`                                              |                                                           | -       |
| @error               | Callback when uploading error                                                                                                                                                                                                                                                                                                                                   | `[ error: UploadCustomError, file: UploadCustomFile, fileList: UploadFileItem[], xhr: XMLHttpRequest, ]` |                                                           |         |
| @exceed              | Callback when the total number of uploaded files exceeds `limit`                                                                                                                                                                                                                                                                                                | `[files: File[]]`                                                                                        |                                                           |         |
| @file-change         | Callback after file selection                                                                                                                                                                                                                                                                                                                                   | `[files: File[]]`                                                                                        |                                                           |         |
| @open-file-dialog    | Triggered when opening the system file system file selection pop-up window                                                                                                                                                                                                                                                                                      | `[]`                                                                                                     |                                                           | -       |
| @preview-click       | Callback when the file card is clicked                                                                                                                                                                                                                                                                                                                          | `[file: UploadFileItem]`                                                                                 |                                                           | -       |
| @progress            | Callback when uploading files                                                                                                                                                                                                                                                                                                                                   | `[percent: number, file: UploadCustomFile, fileList: UploadFileItem[]]`                                  |                                                           |         |
| @remove              | Callback for removing files                                                                                                                                                                                                                                                                                                                                     | `[file: UploadCustomFile, fileList: UploadFileItem[], fileItem: UploadFileItem]`                         |                                                           |         |
| @retry               | Upload retry callback                                                                                                                                                                                                                                                                                                                                           | `[file: UploadFileItem]`                                                                                 |                                                           | -       |
| @size-error          | File size invalid callback                                                                                                                                                                                                                                                                                                                                      | `[file: UploadCustomFile, fileList: UploadFileItem[]]`                                                   |                                                           |         |
| @success             | Callback after successful upload                                                                                                                                                                                                                                                                                                                                | `[response: unknown, file: UploadCustomFile, fileList: UploadFileItem[]]`                                |                                                           |
| picHeight            | Set picture display height when listType='picture'                                                                                                                                                                                                                                                                                                              | `string \| number`                                                                                       |                                                           | 2.42.0  |
| picWidth             | Set picture display width when listType='picture'                                                                                                                                                                                                                                                                                                               | `string \| number`                                                                                       |                                                           | 2.42.0  |
| previewFile          | Customize the preview logic, the content returned by this function will replace the original thumbnail                                                                                                                                                                                                                                                          | `(props: UploadRenderFileItemProps) => VNodeChild`                                                       |                                                           |         |
| prompt               | Custom slot, which can be used to insert prompt text. Different from writing directly in `default slot`, the content of `prompt` will not trigger upload when clicked.                                                                                                                                                                                          | `VNodeChild`                                                                                             |                                                           |         |
| promptPosition       | The position of the prompt text. When the listType is list, the reference object is the default slot element; when the listType is picture, the reference object is the picture list. Optional values ​​`left`, `right`, `bottom`                                                                                                                               | `UploadPromptPosition`                                                                                   | 'right'                                                   |         |
| renderFileItem       | Custom rendering of fileCard                                                                                                                                                                                                                                                                                                                                    | `(props: UploadRenderFileItemProps) => VNodeChild`                                                       |                                                           | -       |
| renderFileOperation  | Custom list item operation area                                                                                                                                                                                                                                                                                                                                 | `(props: UploadRenderFileItemProps) => VNodeChild`                                                       |                                                           | 2.5.0   |
| renderPicClose       | Customize the photo wall close button, only valid in photo wall mode                                                                                                                                                                                                                                                                                            | `(props: UploadRenderPictureCloseProps) => VNodeChild`                                                   |                                                           | 2.75.0  |
| renderPicInfo        | Custom photo wall information, only valid in photo wall mode                                                                                                                                                                                                                                                                                                    | `(props: UploadRenderFileItemProps) => VNodeChild`                                                       |                                                           | 2.2.0   |
| renderPicPreviewIcon | The preview icon displayed when customizing the photo wall hover, only valid in photo wall mode                                                                                                                                                                                                                                                                 | `(props: UploadRenderFileItemProps) => VNodeChild`                                                       |                                                           | 2.5.0   |
| renderThumbnail      | Custom picture wall thumb, only valid in photo wall mode                                                                                                                                                                                                                                                                                                        | `(props: UploadRenderFileItemProps) => VNodeChild`                                                       |                                                           | 2.2.0   |
| showClear            | When limit is not 1 and the current number of uploaded files is greater than 1, whether to show the clear button                                                                                                                                                                                                                                                | `boolean`                                                                                                | true                                                      | -       |
| showPicInfo          | Whether to display picture information, only valid in photo wall mode                                                                                                                                                                                                                                                                                           | `boolean`                                                                                                | false                                                     | 2.2.0   |
| showReplace          | When the upload is successful, whether to display the replace button inside the fileCard                                                                                                                                                                                                                                                                        | `boolean`                                                                                                | false                                                     | -       |
| showRetry            | When uploading fails, whether to display the retry button inside the fileCard                                                                                                                                                                                                                                                                                   | `boolean`                                                                                                | true                                                      | -       |
| showTooltip          | Show a tooltip for truncated names. Supports type and opts; custom renderTooltip is not a public Vue prop.                                                                                                                                                                                                                                                      | `boolean \| TypographyShowTooltip`                                                                       | true                                                      |         |
| showUploadList       | Whether to display the file list                                                                                                                                                                                                                                                                                                                                | `boolean`                                                                                                | true                                                      |         |
| style                | Style                                                                                                                                                                                                                                                                                                                                                           | `StyleValue`                                                                                             |                                                           |         |
| transformFile        | After selecting the file, the callback function before uploading the file can be used to customize the conversion processing of the file                                                                                                                                                                                                                        | `(file: File) => UploadCustomFile`                                                                       |                                                           | -       |
| uploadTrigger        | Trigger upload timing, optional values ​​`auto`, `custom`                                                                                                                                                                                                                                                                                                       | `UploadTrigger`                                                                                          | 'auto'                                                    |         |
| validateMessage      | Upload the overall error message                                                                                                                                                                                                                                                                                                                                | `VNodeChild`                                                                                             |                                                           | 1.0.0   |
| withCredentials      | Whether to bring cookie information                                                                                                                                                                                                                                                                                                                             | `boolean`                                                                                                | false                                                     |         |

## Accessibility

The Upload component is an interactive control that can trigger file selection when clicking or dragging. After the file is selected, the status will be displayed in the file list.

### ARIA

- Add `role="button"` to clickable elements
- Add `role="list"` to the file list and describe it with `aria-label`

## Interfaces

### FileItem Interface

> uid is the unique identifier of the file, and upload update and delete logic strongly relies on this value.
> If the current file is selected and added by upload, uid will be automatically generated.
> If it is passed in by props.defaultFileList or props.fileList, it must be passed, and you need to ensure that it will not be repeated

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

The parameter type when `fileListTitle` is passed as a function:

```ts
interface UploadRenderFileListTitleProps {
  fileList: UploadFileItem[];
  onClear(): void;
  clearText: string;
}
```

### CropProps Interface

Configuration object accepted by the `crop` prop:

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

Some internal methods provided by Upload can be accessed through ref:

| Name           | Description                                                                                                                     | Type                                          | Version |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ------- |
| insert         | Upload file, when index is passed, it will be inserted at the specified position, if not passed, it will be inserted at the end | (files: Array<File\>, index?: number) => void | 2.2.0   |
| upload         | Start upload manually, use with uploadTrigger="custom"                                                                          | () => void                                    |         |
| openFileDialog | open file select Dialog                                                                                                         | `[]`                                          | 2.21.0  |

## Content Guidelines

- Upload button
  - For the copywriting specification of the form button, refer to [The content Guidelines of the Button component](/en-us/components/button/)
- Help text
  - The help text is written in sentences, the first letter is capitalized, and periods may not be required
- Error message
  - Clearly tell the user why the file cannot be uploaded, and tell the user how to upload it successfully
  - Help texts are written using sentences, capitalized
  - Concise language that users can read at a glance, such as `File size must be less than 20MB`, `File type must be .gif, .jpg, .png or .svg`

## Design Tokens

The default theme preserves `--semi-*` tokens. Upload uses `--semi-color-border`, `--semi-color-fill-0`, `--semi-color-danger-light-default`, `--semi-color-primary-light-default` and the standard radius tokens. Default list cards are 250 × 52 CSS px; picture cards are 96 × 96 CSS px.

## FAQ

- When will the retry button appear?
  - When `showRetry` is true and the upload of the current file fails due to a network error, the retry button will be displayed. Other statuses such as verification failed, upload successful, etc. will not display the retry button.
- When will the replace button appear?
  - When `showReplace` is true and the current file status is uploaded, the replace button will be displayed.
- Where did Semi save the pictures?
  - Semi is not responsible for the preservation of the image, you need to customize the action when you use the Upload component. You can choose to set action as your own server address or image service address.
- Didn’t call the XXX method after uploading the picture?
  - If you set `accept`, you can try to remove the accept attribute, and then see if the modified method is called. After removing it, the method is called to explain that the file type obtained by accept in the current environment does not match the set accept, and the upload behavior is terminated early. You can make a breakpoint to upload/foundation.js checkFileFormat function to see if the actual value of file.type obtained meets expectations.

> The progress bar indicates the upload progress. The upload progress is divided into two parts: data upload and server return. If all the data has been sent, but the server does not return a response, the progress bar will stay at 95%. The user upload is not completed. At this time, the request in the developer tool will be pending, which is normal.

## Vue contracts and React → Vue

Use `v-model` or `v-model:file-list` for controlled files; `defaultFileList` initializes uncontrolled state. Do not bind both controlled inputs. Each change emits `change({ currentFile, fileList })`, `update:modelValue` and `update:fileList`; the parent must return the list. File objects and upload instances should stay in `shallowRef`.

| React v2.102.0                                         | Vue 3.5                                                |
| ------------------------------------------------------ | ------------------------------------------------------ |
| children                                               | default slot                                           |
| prompt / dragIcon / dragMainText / dragSubText         | Same VNode props or named slots                        |
| renderFileItem                                         | fileItem scoped slot or renderFileItem function        |
| renderThumbnail / renderPicInfo / renderPicPreviewIcon | thumbnail / picInfo / picPreviewIcon scoped slots      |
| renderPicClose / renderFileOperation                   | picClose / fileOperation scoped slots                  |
| previewFile                                            | Function returning a Vue VNode; use h() when necessary |
| fileListTitle node / function                          | VNode prop / fileListTitle scoped slot                 |
| onChange / onProgress / onSuccess / onError            | @change / @progress / @success / @error                |
| ref.current                                            | useTemplateRef<UploadExposed>() and .value             |
| Upload.FileCard                                        | UploadFileCard from the upload subpath                 |
| ReactNode / SyntheticEvent                             | VNodeChild / native DOM events                         |

All render slots receive the existing public `UploadRenderFileItemProps`, including `onRemove`, `onRetry`, `onReplace` and file data. `picClose` receives `{ className, remove }`; `fileListTitle` receives `{ fileList, onClear, clearText }`. Slots replace their corresponding renderer without changing upload state.

Additional public props are `modelValue`, `timeout` and `validateStatus: 'default' | 'error' | 'warning' | 'success'`. The default-true options `showClear`, `showRetry`, `showTooltip` and `showUploadList` are disabled with explicit bound false, for example `:show-upload-list="false"`.

The exposed methods also include `clear(): void` and `remove(file: UploadFileItem): void`. Both respect the existing before hooks. `insert(files, index?)` uses the same format, size and count validation as file selection.

### Keyboard, cropping and lifecycle

Prefer a native Button inside the trigger. The inherited role/button wrappers do not independently implement Enter/Space activation; do not describe them as a complete keyboard interaction. Custom operation icons need accessible names. File lists keep list/listitem roles and image alternatives use file names.

The crop modal opens for supported images from selection, drop, paste and replacement. `beforeCrop` returning false skips cropping and uploads the original. Cancellation and errors must be handled separately; use `@crop-error` for failures. ConfigProvider supplies locale and direction.

Do not construct File, read document or create timers at module import time. These demos create simulation timers only on a request and release them on unmount. Their local assets replace upstream remote illustrations; visual parity has not been accepted. The English source orders picture examples differently from Chinese; each locale keeps its original order and the mapping pairs equivalent examples.
