# Upload

Vue 3.5 parity implementation of Semi Design v2.102.0 file selection, drag-and-drop, clipboard paste, upload lifecycle, file cards, picture wall, and cropping.

## Basic usage

```vue
<script setup lang="ts">
import { Button, Upload } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/upload.css';
</script>

<template>
  <Upload action="/api/upload" accept=".png,.pdf" :limit="3" @change="console.log">
    <Button>Select files</Button>
  </Upload>
</template>
```

## v-model and manual upload

```vue
<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue';
import { Upload, type UploadExposed, type UploadFileItem } from '@aifuxi/semi-ui-vue';

const files = shallowRef<UploadFileItem[]>([]);
const upload = useTemplateRef<UploadExposed>('upload');
</script>

<template>
  <Upload ref="upload" v-model="files" action="/api/upload" upload-trigger="custom">
    Select files
  </Upload>
  <button @click="upload?.upload()">Start upload</button>
</template>
```

## Vue contract

- Controlled state: `fileList` or `modelValue`; uncontrolled initial state: `defaultFileList`.
- Inputs: `accept`, `multiple`, `directory`, `capture`, `draggable`, and `addOnPasting`.
- Lifecycle: `beforeUpload`, `afterUpload`, `customRequest`, `transformFile`, `uploadTrigger`, `beforeRemove`, and `beforeClear`.
- Lists: `listType`, `showUploadList`, `showClear`, `showRetry`, `showReplace`, `showPicInfo`, `showTooltip`, and `fileListTitle`.
- Slots: `default`, `prompt`, `dragIcon`, `dragMainText`, `dragSubText`, `fileItem`, `thumbnail`, `picInfo`, `picPreviewIcon`, `picClose`, `fileOperation`, and `fileListTitle`.
- Emits: `change`, both model updates, selection/progress/success/error/remove/retry/clear/drop/validation/preview/paste/open notifications.
- Exposed methods: `insert(files, index?)`, `upload()`, `openFileDialog()`, `clear()`, and `remove(file)`.

`showClear`, `showRetry`, `showUploadList`, and `showTooltip` default to `true`; an explicit `false` always wins. See [alignment.md](./alignment.md) for evidence and [react-to-vue.md](./react-to-vue.md) for migration details.
