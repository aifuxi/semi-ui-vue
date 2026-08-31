# Feedback React → Vue 迁移

| Semi React v2.102.0                           | Vue                                                   |
| --------------------------------------------- | ----------------------------------------------------- |
| `<Feedback visible={visible} />`              | `<Feedback v-model:visible="visible" />`              |
| `mode="popup"` / `mode="modal"`               | 同名 `mode` prop                                      |
| `type="emoji"` 等五种类型                     | 同名 `type` prop                                      |
| `onValueChange={handleValue}`                 | `@value-change="handleValue"`                         |
| `onOk={handleOk}` / `onCancel={handleCancel}` | `@ok="handleOk"` / `@cancel="handleCancel"`           |
| `children` 且 `type="custom"`                 | 默认 slot 且 `type="custom"`                          |
| `renderContent={content => ...}`              | `#content="{ content }"`，或保留 `renderContent` prop |
| `footer={<Footer />}`                         | `#footer`，或 `footer` prop                           |
| `title={<Title />}`                           | `#title`，或 `title` prop                             |
| `className` / `style`                         | 优先使用 Vue 原生 `class` / `style`                   |

`visible` 仍是父级受控状态。popup 的默认按钮只调用 `onOk` / `onCancel`，不会替调用方关闭；Modal 的 Promise 关闭流程由 Modal 处理。回调若必须返回 Promise，请使用 `:on-ok="handler"` / `:on-cancel="handler"`，以保留返回值给内部异步状态机。

固定 React Adapter 的 `className` 拼接存在字面 `.className` 行为，本实现为了像素兼容予以保留；普通 Vue 代码应使用 `class`。emoji 项保持上游可点击 `span` 的语义，没有额外创造键盘角色。
