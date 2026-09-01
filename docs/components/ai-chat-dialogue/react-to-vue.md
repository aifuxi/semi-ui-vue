# AIChatDialogue React → Vue

| React v2.102.0                               | Vue 3.5                                                         |
| -------------------------------------------- | --------------------------------------------------------------- |
| `chats={chats}` + `onChatsChange={setChats}` | `v-model:chats="chats"`，或 `:chats` + `@chats-change`          |
| `className`                                  | `class`；`className` 仍兼容                                     |
| `dialogueRenderConfig.renderDialogueAvatar`  | `#dialogue-avatar` 或同名函数配置                               |
| `renderDialogueTitle/Content/Action`         | `#dialogue-title/content/action`                                |
| `renderFullDialogue`                         | `#full-dialogue`                                                |
| `renderHintBox`                              | `#hint="{ content, index, onHintClick }"`                       |
| `messageEditRender`                          | `#message-edit="{ value }"`                                     |
| `onMessageGoodFeedback`                      | `@message-good-feedback`                                        |
| `onMessageBadFeedback`                       | `@message-bad-feedback`                                         |
| `onMessageCopy/Delete/Edit/Reset/Share`      | `@message-copy/delete/edit/reset/share`                         |
| `ref.current.selectAll()`                    | `dialogueRef.selectAll()`                                       |
| `AIChatDialogue.Reasoning`                   | `AIChatDialogue.Reasoning` 或命名导出 `AIChatDialogueReasoning` |
| `AIChatDialogue.defaultComponents.code`      | 同名静态属性或 `AIChatDialogueCode`                             |

Vue 不接受 ReactNode；头像、render 配置和内容 renderer 返回 Vue `VNodeChild`。公开消息与 OpenAI 数据形状保持不变。

```vue
<AIChatDialogue v-model:chats="chats" :role-config="roles">
  <template #dialogue-title="{ message, role }">
    <strong>{{ role?.name }} · {{ message.id }}</strong>
  </template>
</AIChatDialogue>
```

数据转换函数保持名称不变：`chatCompletionToMessage`、`streamingChatCompletionToMessage`、`responseToMessage`、`streamingResponseToMessage`、`chatInputToMessage`、`chatInputToChatCompletion` 和 `messageToChatInput`。
