# Chat React → Vue 迁移

| Semi React v2.102.0                            | Vue 3.5+                                       |
| ---------------------------------------------- | ---------------------------------------------- |
| `chats` + `onChatsChange`                      | `v-model:chats`，同时发出 `chats-change`       |
| `onMessageSend(content, attachment)`           | `@message-send="(content, attachment) => ..."` |
| `onInputChange({ inputValue, attachment })`    | `@input-change`，payload 形状不变              |
| `renderHintBox(props)`                         | `#hint="{ content, index, onHintClick }"`      |
| `renderDivider(message)`                       | `#divider="{ message }"`                       |
| `renderInputArea(props)`                       | `#input-area="props"`                          |
| `chatBoxRenderConfig.renderChatBoxTitle`       | `#chat-box-title`                              |
| `renderChatBoxAvatar` / `renderChatBoxContent` | `#chat-box-avatar` / `#chat-box-content`       |
| `renderChatBoxAction` / `renderFullChatBox`    | `#chat-box-action` / `#chat-box`               |
| `topSlot` / `bottomSlot` ReactNode             | `#top` / `#bottom`                             |
| React ref methods                              | Vue 模板 ref 上的同名公开方法                  |

Vue 事件统一使用 kebab-case；`Message`、`Content`、角色、状态和枚举值保持固定版本命名。默认值为 `true` 的 `escapeHtml`、`enableUpload` 会区分缺省、显式 `false` 与显式 `true`，上传对象的缺省项仍为 `true`。

上游 `customMarkDownComponents` 中的 React 组件不能直接复用，请传入 Vue 组件映射或使用 `#chat-box-content`。出于安全边界，Vue 不执行未经清洗的原始 HTML；`escapeHtml=false` 仍显示为文本，可信 HTML 应在业务层清洗后通过自定义内容 slot 渲染。
