# Upload React → Vue 迁移

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
