---
title: 'AIChatDialogue AI对话'
description: '用户展示 AI 聊天中的对话信息'
type: 'ai'
order: 102
icon: 'doc-aiDialogue'
---

## 使用场景

AIChatDialogue 组件可搭配 AIChatInput 使用，实现更丰富的、功能覆盖更全面、定制更加便捷的 AI 会话场景。
组件消息格式以 OpenAI 的 [Response Object](https://platform.openai.com/docs/api-reference/responses/object) 为原型，默认支持 OpenAI 社区 [Response](https://platform.openai.com/docs/api-reference/responses/create) / [Chat Completion](https://platform.openai.com/docs/api-reference/chat/create) 格式标准，对 GPT-5、GPT-4o 系列模型的响应均支持开箱即用，详见[消息数据转换](/zh-CN/ai/aiChatDialogue#%E6%B6%88%E6%81%AF%E6%95%B0%E6%8D%AE%E8%BD%AC%E6%8D%A2)。

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/ai-chat-dialogue` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-ai-aiChatDialogue-1" title="如何引入" kind="import" />

### 基本用法

通过 `v-model:chats` 实现基础对话显示和交互。

使用 `align` 属性可以设置对话的布局，支持左右分布（`leftRight`， 默认）和左对齐（`leftAlign`）。

<DemoBlock id="zh-CN-ai-aiChatDialogue-2" title="基本用法" kind="live" />

### 消息状态

chats 类型为 `Message[]`， `Message` 包含对话的各种信息，如角色 `role`、内容 `content`、状态 `status`
、唯一标识 `id`、创建时间 `createdAt` 等，具体见 [Message](#Message)。其中 status 和 [Response API Status](https://platform.openai.com/docs/api-reference/responses/object#responses/object-status) 相同，存在 6 种状态，对应 3 种官方样式（成功 / 请求中 / 失败）。

<DemoBlock id="zh-CN-ai-aiChatDialogue-3" title="消息状态" kind="live" />

### 消息展示

消息内容展示的类型为 [ContentItem[]](https://platform.openai.com/docs/api-reference/responses/list#responses/list-data)，支持文本 `text`、文件 `file`、图片 `image`、代码 `code`、思考块 `reasoning`、参考来源 `annotation`、工具调用 `tool call` 等消息块的展示，同时提供 `AIChatDialogue.Step` 组件用于步骤等信息的分步展示。

<DemoBlock id="zh-CN-ai-aiChatDialogue-4" title="消息展示" kind="live" />

### 引用

通过 `references` 字段定义当前消息引用的文件或者文本， `showReference` 配置当前消息是否显示可被引用样式，并通过 `reference-click` 事件监听引用按钮点击。具体和 AIChatInput 的搭配使用见 [AI 组件构建对话](https://semi.design/zh-CN/ai/aiComponent#AI%20%E7%BB%84%E4%BB%B6%E6%9E%84%E5%BB%BA%E5%AF%B9%E8%AF%9D)

<DemoBlock id="zh-CN-ai-aiChatDialogue-5" title="引用" kind="live" />

### 选择

<DemoBlock id="zh-CN-ai-aiChatDialogue-6" title="选择" kind="live" />

### 提示

通过 `hints` 可设置提示区域内容, 点击提示内容后，提示内容将成为新的用户输入内容，并触发 `hint-click` 事件。

<DemoBlock id="zh-CN-ai-aiChatDialogue-7" title="提示" kind="live" />

### 自定义渲染提示

通过 `hint` 插槽可自定义提示区域内容；迁移代码也可继续使用 `renderHintBox` callback prop。

<DemoBlock id="zh-CN-ai-aiChatDialogue-8" title="自定义渲染提示" kind="code" />

<DemoBlock id="zh-CN-ai-aiChatDialogue-9" title="自定义渲染提示" kind="live" />

### 自定义渲染会话框

通过 `dialogueRenderConfig` 传入自定义渲染配置，或使用对应作用域插槽。

<DemoBlock id="zh-CN-ai-aiChatDialogue-10" title="自定义渲染会话框" kind="code" />

自定义渲染头像和标题，可使用 `dialogue-avatar` 和 `dialogue-title` 插槽。

<DemoBlock id="zh-CN-ai-aiChatDialogue-11" title="自定义渲染会话框" kind="live" />

### 自定义渲染消息内容

通过 `renderDialogueContentItem` 按照消息类型返回内容渲染，用法如下

<DemoBlock id="zh-CN-ai-aiChatDialogue-12" title="自定义渲染消息内容" kind="live" />

### 消息数据转换

当前组件的对话消息以 OpenAI 的 [Response Object](https://platform.openai.com/docs/api-reference/responses/object) 为原型，为了支持用户更好地无缝集成 [Chat Completion API](https://platform.openai.com/docs/api-reference/chat/create) 和 [Response API](https://platform.openai.com/docs/api-reference/responses/create)，我们提供了四种 `Adapter` 转换函数，用户可直接使用该函数转换 API 的返回结果，得到可直接用于消息展示的数据，提供两种 `Adapter` 用于将 `ChatInput` 组件的数据处理成适配于 `Response API` 的 `input Message` 或者 `Chat Completion API` 中的 `Input Message` 格式。

<DemoBlock id="zh-CN-ai-aiChatDialogue-13" title="消息数据转换" kind="code" />

比如，当用户使用 [Chat Completion API](https://platform.openai.com/docs/api-reference/chat/create) 接口返回非流式数据时，可以通过 `chatCompletionToMessage` 函数将 Chat Completion Object 转换为 Dialogue Message 消息块格式。注意，因为 `Chat Completion API` 可以通过 `n` 来控制每条输入消息生成多少个结果所以该函数的返回值为数组。(注意：如果 n > 1，用户需要自行决定将哪条数据添加到 message 中展示)

<DemoBlock id="zh-CN-ai-aiChatDialogue-14" title="消息数据转换" kind="live" />

比如，当用户使用 [Chat Completion API](https://platform.openai.com/docs/api-reference/chat/create) 接口返回流式数据时，可以通过 `streamingChatCompletionToMessage` 函数将 Chat Completion Chunk Object List 转换为 Dialogue Message 消息块格式。

<DemoBlock id="zh-CN-ai-aiChatDialogue-15" title="消息数据转换" kind="live" />

当用户使用 [Response API](https://platform.openai.com/docs/api-reference/responses/create) 接口返回非流式数据时，可以通过 `responseToMessage` 函数将 Response Object 转换为 Dialogue Message 消息块格式。

<DemoBlock id="zh-CN-ai-aiChatDialogue-16" title="消息数据转换" kind="live" />

当用户使用 [Response API](https://platform.openai.com/docs/api-reference/responses/create) 接口返回流式数据时，可以通过 `streamingResponseToMessage` 函数将 Response Chunk Object List 转换为 Dialogue Message 消息块格式。

<DemoBlock id="zh-CN-ai-aiChatDialogue-17" title="消息数据转换" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/ai-chat-dialogue/types.ts`、`packages/ui/src/ai-chat-dialogue/index.ts` 的公开类型为准。

- `v-model:chats` 对应 `chats` 与 `update:chats`；列表变更时同时触发 `chats-change`。

#### Vue 用法

- `dialogueRenderConfig`、`renderDialogueContentItem`、`renderHintBox` 与 `messageEditRender` 是保留的 callback props，不是组件事件。
- Reasoning、Step、Annotation 与 defaultComponents.code 同时作为静态成员提供；Reasoning、Step、Annotation、Code 也可使用具名导出。
- Reasoning 接受 `status/summary/content/markdownRenderProps/completedText/thinkingText`；Step 接受 `steps`；Annotation 接受 `annotation/maxCount/description/annotationText`。

#### Vue 实例方法

**AIChatDialogueExpose**

| 方法                  | 签名                             | 说明             |
| --------------------- | -------------------------------- | ---------------- |
| `selectAll`           | () =&gt; void                    | 全选所有消息     |
| `deselectAll`         | () =&gt; void                    | 取消全选所有消息 |
| `scrollToBottom`      | (animation?: boolean) =&gt; void | 滚动到列表底部   |
| `scrollToTop`         | (animation?: boolean) =&gt; void | 滚动到列表顶部   |
| `getContainerElement` | () =&gt; HTMLDivElement \| null  | 获取滚动容器     |

#### Vue 事件

**AIChatDialogue**

| 事件                  | 参数                       | 说明             |
| --------------------- | -------------------------- | ---------------- |
| update:chats          | [chats: Message[]]         | 更新 chats 绑定  |
| chats-change          | [chats: Message[]]         | 对话消息列表变化 |
| select                | [selectedIds: string[]]    | 选择项变化       |
| annotation-click      | [annotation: Annotation[]] | 点击注释资料     |
| file-click            | [file: InputFile]          | 点击附件文件     |
| image-click           | [image: InputImage]        | 点击图片         |
| hint-click            | [hint: string]             | 点击提示词       |
| reference-click       | [reference: Reference]     | 点击引用         |
| message-bad-feedback  | [message: Message]         | 提交消息负向反馈 |
| message-copy          | [message: Message]         | 复制消息         |
| message-delete        | [message: Message]         | 删除消息         |
| message-edit          | [message: Message]         | 编辑消息         |
| message-good-feedback | [message: Message]         | 提交消息正向反馈 |
| message-reset         | [message: Message]         | 重置消息         |
| message-share         | [message: Message]         | 分享消息         |

**AIChatDialogueAnnotation**

| 事件  | 参数                       | 说明         |
| ----- | -------------------------- | ------------ |
| click | [annotation: Annotation[]] | 点击注释资料 |

#### Vue 插槽

**AIChatDialogue**

| 插槽             | 作用域参数                                                     | 说明             |
| ---------------- | -------------------------------------------------------------- | ---------------- |
| dialogue-avatar  | RenderAvatarProps                                              | 自定义头像       |
| dialogue-title   | RenderTitleProps                                               | 自定义标题       |
| dialogue-content | RenderContentProps                                             | 自定义消息内容   |
| dialogue-action  | RenderActionProps                                              | 自定义操作区     |
| full-dialogue    | RenderFullDialogueProps                                        | 自定义完整对话项 |
| hint             | { content: string, index: number, onHintClick: () =&gt; void } | 自定义提示项     |
| message-edit     | { value: unknown }                                             | 自定义消息编辑器 |

**AIChatDialogueReasoning**

| 插槽    | 作用域参数                       | 说明           |
| ------- | -------------------------------- | -------------- |
| default | { raw: string, status?: string } | 自定义思考内容 |

| 属性                      | 说明                                                                                                                                                                                                                                                                                                                                  | 类型                                                                                           | 默认值      |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ----------- |
| align                     | 对话布局方式                                                                                                                                                                                                                                                                                                                          | 'leftRight' \| 'leftAlign'                                                                     | `leftRight` |
| chats                     | 受控对话消息列表                                                                                                                                                                                                                                                                                                                      | Message[]                                                                                      | []          |
| class                     | Vue class 入口                                                                                                                                                                                                                                                                                                                        | HTMLAttributes['class']                                                                        | —           |
| className                 | 自定义类名                                                                                                                                                                                                                                                                                                                            | string                                                                                         | -           |
| disabledFileItemClick     | 是否禁用文件点击                                                                                                                                                                                                                                                                                                                      | boolean                                                                                        | false       |
| escapeHtml                | 是否对用户消息中的 HTML 标签进行转义，防止被 Markdown 解析器当作 HTML 处理导致内容丢失                                                                                                                                                                                                                                                | boolean                                                                                        | true        |
| hintCls                   | 提示区最外层样式类名                                                                                                                                                                                                                                                                                                                  | string                                                                                         | -           |
| hints                     | 提示信息                                                                                                                                                                                                                                                                                                                              | string[]                                                                                       | []          |
| hintStyle                 | 提示区最外层样式                                                                                                                                                                                                                                                                                                                      | CSSProperties                                                                                  | -           |
| selecting                 | 是否开启选择模式                                                                                                                                                                                                                                                                                                                      | boolean                                                                                        | false       |
| markdownRenderProps       | 该参数将透传给对话框渲染所用的 MarkdownRender 组件，详见 [MarkdownRenderProps](/zh-CN/plus/markdownrender#API)。注意：当自定义 `markdownRenderProps.components` 时，如果包含 `code` 组件，会覆盖默认的代码块渲染组件。如需在自定义代码块渲染时保留默认功能，可通过 `AIChatDialogue.defaultComponents.code` 获取默认组件进行二次封装。 | MarkdownRenderProps                                                                            | -           |
| messageEditRender         | 消息编辑渲染 callback prop；message-edit 插槽优先                                                                                                                                                                                                                                                                                     | (properties: unknown) =&gt; VNodeChild                                                         | -           |
| mode                      | 对话模式                                                                                                                                                                                                                                                                                                                              | 'bubble' \| 'noBubble' \| 'userBubble'                                                         | `bubble`    |
| roleConfig                | 角色配置（user/assistant/system 等元数据）                                                                                                                                                                                                                                                                                            | RoleConfig（必填）                                                                             | 必填        |
| style                     | 样式                                                                                                                                                                                                                                                                                                                                  | CSSProperties                                                                                  | -           |
| showReset                 | 是否展示重置操作                                                                                                                                                                                                                                                                                                                      | boolean                                                                                        | true        |
| showReference             | 是否在文字或者文件消息中展示可被引用图标，仅对用户消息生效                                                                                                                                                                                                                                                                            | boolean                                                                                        | false       |
| dialogueRenderConfig      | 各对话区块的渲染 callback 配置；同名插槽优先                                                                                                                                                                                                                                                                                          | DialogueRenderConfig                                                                           | -           |
| renderDialogueContentItem | 按消息类型配置内容渲染 callback                                                                                                                                                                                                                                                                                                       | DialogueContentItemRendererMap                                                                 | -           |
| renderHintBox             | 提示项渲染 callback prop；hint 插槽优先                                                                                                                                                                                                                                                                                               | (properties: { content: string; index: number; onHintClick: () =&gt; void; }) =&gt; VNodeChild | -           |

### RoleConfig

| 属性      | 说明     | 类型                                                                | 默认值 |
| --------- | -------- | ------------------------------------------------------------------- | ------ |
| user      | 用户信息 | AIChatDialogueMetadata \| Map&lt;string, AIChatDialogueMetadata&gt; | -      |
| assistant | 助手信息 | AIChatDialogueMetadata \| Map&lt;string, AIChatDialogueMetadata&gt; | -      |
| system    | 系统信息 | AIChatDialogueMetadata \| Map&lt;string, AIChatDialogueMetadata&gt; | -      |

### MetaData

| 属性   | 说明                                                                                                                                                                                                                | 类型                 | 默认值 |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ------ |
| name   | 名称                                                                                                                                                                                                                | string               | -      |
| avatar | 头像地址或 VNode                                                                                                                                                                                                    | string \| VNodeChild | -      |
| color  | 头像背景色，同 Avatar 组件的 color 参数, 支持 `amber`、 `blue`、 `cyan`、 `green`、 `grey`、 `indigo`、 `light-blue`、 `light-green`、 `lime`、 `orange`、 `pink`、 `purple`、 `red`、 `teal`、 `violet`、 `yellow` | string               | `grey` |

### Message

| 属性        | 说明                                                                                                   | 类型                    | 默认值    |
| ----------- | ------------------------------------------------------------------------------------------------------ | ----------------------- | --------- |
| id          | 唯一标识                                                                                               | string（必填）          | -         |
| content     | 消息内容                                                                                               | string \| ContentItem[] | -         |
| output_text | Response API 聚合文本                                                                                  | string                  | —         |
| role        | 角色                                                                                                   | string（必填）          | -         |
| name        | 名称                                                                                                   | string                  | -         |
| createdAt   | 创建时间                                                                                               | number                  | -         |
| updatedAt   | 更新时间                                                                                               | number                  | —         |
| model       | 模型名称                                                                                               | string                  | -         |
| status      | 消息状态，可选值为 `queued` \| `in_progress` \| `incomplete` \| `completed` \| `failed` \| `cancelled` | string                  | completed |
| references  | 消息引用列表                                                                                           | Reference[]             | —         |
| like        | 是否已提交正向反馈                                                                                     | boolean                 | —         |
| dislike     | 是否已提交负向反馈                                                                                     | boolean                 | —         |
| editing     | 消息是否处于编辑状态                                                                                   | boolean                 | —         |

### Reference

| 属性    | 说明     | 类型             | 默认值 |
| ------- | -------- | ---------------- | ------ |
| id      | 唯一标识 | string \| number | -      |
| type    | 类型     | string           | -      |
| name    | 名称     | string           | -      |
| url     | 地址     | string           | -      |
| content | 文本内容 | string           | -      |

### Methods

| 方法                               | 说明                                                  |
| ---------------------------------- | ----------------------------------------------------- |
| selectAll                          | 全选所有消息                                          |
| deselectAll                        | 取消全选所有消息                                      |
| scrollToBottom(animation: boolean) | 滚动到最底部, animation 为 true，则有动画，反之无动画 |
| scrollToTop(animation: boolean)    | 滚动到最顶部, animation 为 true，则有动画，反之无动画 |

### Static Properties

| 属性              | 说明                                                                                                                                              | 类型                |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| defaultComponents | 默认的 Markdown 渲染组件集合，包含增强版的 Code 组件，支持代码语言标识和复制功能。可用于 `markdownRenderProps.components` 的二次封装 **>=2.94.0** | { code: Component } |

**使用示例：**

当需要在自定义代码块渲染时保留默认功能，可以通过 `AIChatDialogue.defaultComponents.code` 获取默认组件：

<DemoBlock id="zh-CN-ai-aiChatDialogue-18" title="Static Properties" kind="code" />

### ContentItem

`ContentItem` 支持所有 OpenAI Response [InputItem](https://platform.openai.com/docs/api-reference/responses/create#responses-create-input) 和 [OutputItem](https://platform.openai.com/docs/api-reference/responses/object#responses/object-output) 类型，具体类型定义如下

<DemoBlock id="zh-CN-ai-aiChatDialogue-19" title="ContentItem" kind="code" />
