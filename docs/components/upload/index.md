# Upload 上传

Vue 3.5 对齐 Semi Design v2.102.0 的文件选择、拖放、粘贴、上传、文件卡、图片墙和裁剪组件。

## 基础用法

```vue
<script setup lang="ts">
import { Button, Upload } from '@workspace/ui';
import '@workspace/theme-default/upload.css';
</script>

<template>
  <Upload action="/api/upload" accept=".png,.pdf" :limit="3" @change="console.log">
    <Button>选择文件</Button>
  </Upload>
</template>
```

## v-model 与手动上传

```vue
<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue';
import { Upload, type UploadExposed, type UploadFileItem } from '@workspace/ui';

const files = shallowRef<UploadFileItem[]>([]);
const upload = useTemplateRef<UploadExposed>('upload');
</script>

<template>
  <Upload ref="upload" v-model="files" action="/api/upload" upload-trigger="custom">
    选择文件
  </Upload>
  <button @click="upload?.upload()">开始上传</button>
</template>
```

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

`showClear`、`showRetry`、`showUploadList`、`showTooltip` 的默认值均为 `true`；显式传入 `false` 不会被缺省值覆盖。完整证据见 [alignment.md](./alignment.md)，React 迁移见 [react-to-vue.md](./react-to-vue.md)。
