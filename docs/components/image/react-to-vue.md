# Image React → Vue 迁移

| React v2.102.0                                   | Vue                                                      | 说明                                                     |
| ------------------------------------------------ | -------------------------------------------------------- | -------------------------------------------------------- |
| `import Image, { Preview }`                      | `import Image, { ImagePreview }`                         | Vue 使用语义明确的具名导出；固定上游没有 `Image.Preview` |
| `<Preview>`                                      | `<ImagePreview>`                                         | 默认 slot 递归识别 Image 子节点                          |
| `onLoad/onError/onClick`                         | `@load/@error/@click`                                    | 事件参数和通知顺序保持                                   |
| `onVisibleChange/onChange`                       | `@visible-change/@change`                                | 同时提供对应 `v-model` 更新事件                          |
| `visible/currentIndex`                           | `v-model:visible/v-model:current-index` 或同名受控 props | 受控模式只通知，不越权修改外部值                         |
| `placeholder/fallback` ReactNode                 | `#placeholder/#fallback` 或同名 VNode prop               | slot 优先                                                |
| `renderHeader`                                   | `#header="{ title }"`                                    | 同名函数 prop 仍可用于程序化调用                         |
| `renderPreviewMenu`                              | `#previewMenu="menuProps"`                               | menuProps 保留固定操作函数与状态                         |
| `renderLeftIcon/renderRightIcon/renderCloseIcon` | `#leftIcon/#rightIcon/#closeIcon`                        | 同名函数/VNode prop 仍保留                               |
| `className/style`                                | `class/style` 或兼容 `className/style`                   | 根节点 `.semi-*` 契约不变                                |

Vue 不复制 React children、render prop 或 ref 语义；它使用类型化 props、emits、slots、provide/inject 与 Teleport 表达等价能力。公开声明不会泄漏私有 Foundation 类型。
