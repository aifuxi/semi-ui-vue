# Sidebar React → Vue 迁移

| Semi React v2.102.0                       | Vue 3.5+                                                                  |
| ----------------------------------------- | ------------------------------------------------------------------------- |
| `renderHeader()`                          | `#header`                                                                 |
| `renderOptionItem(option, onChange)`      | `#option="{ option, onChange }"`                                          |
| `renderMainContent(activeKey)`            | `#main-content="{ activeKey }"`                                           |
| `renderDetailHeader(mode, detailContent)` | `#detail-header="{ mode, detailContent }"`                                |
| `renderDetailContent(mode)`               | `#detail-content="{ mode }"`                                              |
| `renderItem(annotation)`                  | `Annotation` 的 `#item`                                                   |
| `renderItem({ option, custom })`          | `MCPConfigure` 的 `#item`                                                 |
| `onActiveOptionChange`                    | `@active-option-change`                                                   |
| `onBackWard`                              | `@back-ward`                                                              |
| `onDetailContentCopy`                     | `@detail-content-copy`                                                    |
| `onFileContentChange`                     | `@file-content-change`                                                    |
| `containerRef` RefObject                  | 模板 `ref` + `getContainerElement()`；也支持 `containerRef(element)` 回调 |
| React Tiptap `Extension[]`                | Vue Tiptap `Extensions`；React node view 不能直接复用                     |

默认值为 `true` 的 `motion`、`resizable`、`showClose`、`fileEditable` 在 Vue 中保留原名，并区分缺省与显式 `false`。Compound API 可以继续写成 `Sidebar.Container` / `Sidebar.CodeContent` / `Sidebar.FileItem`，也可以使用同名具名导出。

`CodeItemProps` / `FileItemProps` 的上游 `key` 在 React 中同时承担列表 key；Vue 的 `key` 是保留 VNode 属性，列表使用组件自身数组项的 `key`，不要期望它作为子组件普通 prop 读取。
