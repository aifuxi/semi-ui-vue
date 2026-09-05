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

Vue 3.5 对齐 Semi Design v2.102.0 的文件选择、拖放、粘贴、上传、文件卡、图片墙和裁剪组件。

## 基础用法

::demo-block{demo="upload/zh-CN/Example1" title="基础用法"}
::

## v-model 与手动上传

::demo-block{demo="upload/zh-CN/Example2" title="v-model 与手动上传"}
::

## 拖拽与图片墙

```vue
<template>
  <Upload action="/api/upload" draggable drag-sub-text="支持 PNG/JPEG" />
  <Upload action="/api/upload" list-type="picture" :show-pic-info="true">+</Upload>
</template>
```

## Vue 公开契约

- 受控状态：`fileList` 或 `modelValue`；非受控初值：`defaultFileList`。
- 文件入口：`accept`、`multiple`、`directory`、`capture`、`draggable`、`addOnPasting`。
- 流程：`beforeUpload`、`afterUpload`、`customRequest`、`transformFile`、`uploadTrigger`、`beforeRemove`、`beforeClear`。
- 列表：`listType`、`showUploadList`、`showClear`、`showRetry`、`showReplace`、`showPicInfo`、`showTooltip`、`fileListTitle`。
- slots：`default`、`prompt`、`dragIcon`、`dragMainText`、`dragSubText`、`fileItem`、`thumbnail`、`picInfo`、`picPreviewIcon`、`picClose`、`fileOperation`、`fileListTitle`。
- emits：`change`、`update:fileList`、`update:modelValue`、`fileChange`、`progress`、`success`、`error`、`remove`、`retry`、`clear`、`drop`、`acceptInvalid`、`sizeError`、`exceed`、`previewClick`、`pastingError`、`openFileDialog`。
- 暴露方法：`insert(files, index?)`、`upload()`、`openFileDialog()`、`clear()`、`remove(file)`。

`showClear`、`showRetry`、`showUploadList`、`showTooltip` 的默认值均为 `true`；显式传入 `false` 不会被缺省值覆盖。完整证据见 [alignment.md](https://github.com/aifuxi/semi-ui-vue/blob/master/docs/components/upload/alignment.md)，React 迁移见 [react-to-vue.md](#react-vue)。

## React → Vue

| Semi React v2.102.0                      | Vue 3.5                                                                  |
| ---------------------------------------- | ------------------------------------------------------------------------ |
| `<Upload action="...">{button}</Upload>` | `<Upload action="..."><Button>...</Button></Upload>`                     |
| `fileList` + `onChange({ fileList })`    | `v-model="fileList"`，也保留 `fileList` + `@change`                      |
| `onFileChange(files)`                    | `@file-change="handler"`                                                 |
| `onProgress(percent, file, list)`        | `@progress="handler"`                                                    |
| `renderFileItem(props)`                  | `:render-file-item="fn"` 或 `#fileItem="props"`                          |
| `renderThumbnail/renderPicInfo`          | 同名函数 prop 或 `#thumbnail/#picInfo`                                   |
| `renderPicClose/renderFileOperation`     | 同名函数 prop 或 `#picClose/#fileOperation`                              |
| `fileListTitle={node/function}`          | `file-list-title` 或 `#fileListTitle="{ fileList, onClear, clearText }"` |
| `ref.current.upload()`                   | `useTemplateRef<UploadExposed>()` 后调用 `upload()`                      |
| `Upload.FileCard`                        | `UploadFileCard` 命名导出；`Upload.FileCard` 组合属性也保留              |
| `ReactNode`                              | `VNodeChild` / Vue slot                                                  |
| React synthetic events                   | 原生 DOM `Event` / `MouseEvent`                                          |

Vue 的 `change` payload 仍为 `{ currentFile, fileList }`，并额外发出 `update:fileList` 与 `update:modelValue`。受控模式下组件等待父级回传列表；不会把一次内部上传结果偷偷提交到 DOM。

默认真值项应显式使用 `:show-upload-list="false"`、`:show-clear="false"`、`:show-retry="false"` 或 `:show-tooltip="false"` 关闭。模板裸布尔属性和 `h()` 输入均按 Vue 原生语义处理。
