# Cropper React → Vue 迁移

| React v2.102.0                           | Vue 3                                              |
| ---------------------------------------- | -------------------------------------------------- |
| `<Cropper ref={ref} />`                  | `<Cropper ref="cropper" />`                        |
| `ref.current.getCropperCanvas()`         | `cropper.value?.getCropperCanvas()`                |
| `zoom={zoom}` + `onZoomChange={setZoom}` | `v-model:zoom="zoom"`，或 `:zoom` + `@zoom-change` |
| `className`                              | `class`（也兼容 `className`）                      |
| `cropperBoxCls`                          | 同名；也接受上游文档中的 `cropperBoxClassName`     |
| `preview={() => element}`                | `:preview="() => element"`                         |

Vue 组件使用类型化 props/emits 和 `defineExpose`，没有 React children/render-prop 映射。固定源码中的 `imgProps` 虽在类型和文档出现，但 React render 没有展开；Vue 保持相同运行时限制，避免把未验证的修复伪装成对齐。
