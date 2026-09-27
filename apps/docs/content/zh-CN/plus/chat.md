---
title: 'Chat 对话'
description: '用于快速搭建对话内容'
type: 'plus'
order: 28
icon: 'doc-chat'
---

## 使用场景

Chat 组件可用于普通会话，AI 会话等场景。

对话内容渲染基于 [MarkdownRender](/zh-CN/plus/markdownrender) 组件，支持 Markdown 和 MDX (注：Chat 中的 MarkdownRender 的默认 format 模式是 md，如果需要使用 MDX 格式，可通过 markdownRenderProps API 设置)，可实现图片，表格，链接，加粗，代码区等常用富文本功能。也可通过 Vue 组件映射实现更复杂的文档撰写与展示需求。

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/chat` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

Chat 从 v2.63.0 版本开始支持。

<DemoBlock id="zh-CN-plus-chat-1" title="如何引入" kind="code" />

### 基本用法

通过 `v-model:chats` 展示并更新对话列表，通过 `message-send` 事件处理消息发送。

附件支持通过点击上传按钮，输入框粘贴，拖拽文件至 Chat 区域上传。通过 `uploadProps` 设置上传参数，详情参考 [Upload](/zh-CN/input/upload#API%20%E5%8F%82%E8%80%83)。

上传按钮的提示文案可通过 `uploadTipProps` 设置，详情参考 [Tooltip](/zh-CN/show/tooltip#API%20%E5%8F%82%E8%80%83)。

对话是多方参与，多轮交互的场景。可通过 `roleConfig` 传入角色信息（包括名称，头像等），具体参数细节 [RoleConfig](#roleConfig)。

使用 `align` 属性可以设置对话的布局，支持左右分布（`leftRight`， 默认）和左对齐（`leftAlign`）。

<DemoBlock id="zh-CN-plus-chat-2" title="基本用法" kind="live" />

### 消息状态

chats 类型为 `Message[]`， `Message` 包含对话的各种信息，如角色（role）、内容（content）、附件（attachment）、状态（status）
、唯一标识（id）、创建时间（createAt）等，具体见 [Message](#Message)。其中 status 不同，会话样式不同。

<DemoBlock id="zh-CN-plus-chat-3" title="消息状态" kind="live" />

### 动态更新数据

对于后台返回 Serve Side Event 数据情况，可将获取到的数据用于更新 `chats`，对话内容将实时更新。

`showStopGenerate` 可设置是否展示停止生成按钮，默认为 `false`；通过 `stop-generator` 事件处理停止生成逻辑。

<DemoBlock id="zh-CN-plus-chat-4" title="动态更新数据" kind="live" />

### 清除上下文

通过 `showClearContext` 可以开启在输入框中显示清除上下文按钮，默认为 `false`。
也可以通过模板 ref 调用 `clearContext` 方法清除上下文。

<DemoBlock id="zh-CN-plus-chat-5" title="清除上下文" kind="live" />

### 自定义渲染会话框

通过 `chatBoxRenderConfig` 传入自定义渲染配置, chatBoxRenderConfig 类型如下

<DemoBlock id="zh-CN-plus-chat-6" title="自定义渲染会话框" kind="code" />

自定义头像和标题优先使用 `chat-box-avatar` 与 `chat-box-title` 插槽；迁移代码也可继续使用对应 callback。

<DemoBlock id="zh-CN-plus-chat-7" title="自定义渲染会话框" kind="live" />

鼠标移动到会话上即可显示操作区；优先使用 `chat-box-action` 插槽自定义，迁移代码也可继续使用 `renderChatBoxAction` callback prop。

<DemoBlock id="zh-CN-plus-chat-8" title="自定义渲染会话框" kind="live" />

优先使用 `chat-box-content` 插槽自定义会话内容，迁移代码也可继续使用 `renderChatBoxContent` callback prop。

<DemoBlock id="zh-CN-plus-chat-9" title="自定义渲染会话框" kind="live" />

优先使用 `chat-box` 插槽自定义完整会话项，迁移代码也可继续使用 `renderFullChatBox` callback prop。

<DemoBlock id="zh-CN-plus-chat-10" title="自定义渲染会话框" kind="live" />

### 自定义渲染输入框

优先使用 `input-area` 作用域插槽自定义输入区，迁移代码也可继续使用 `renderInputArea` callback prop。

<DemoBlock id="zh-CN-plus-chat-11" title="自定义渲染输入框" kind="code" />

`detailProps` 的使用示例如下

<DemoBlock id="zh-CN-plus-chat-12" title="自定义渲染输入框" kind="code" />

其他使用示例如下

<DemoBlock id="zh-CN-plus-chat-13" title="自定义渲染输入框" kind="live" />

### 提示信息

通过 `hints` 设置提示区域内容；点击提示项后会触发 `hint-click` 事件。

<DemoBlock id="zh-CN-plus-chat-14" title="提示信息" kind="live" />

### 自定义提示信息渲染

优先使用 `hint` 作用域插槽自定义提示项；迁移代码也可继续使用 `renderHintBox` callback prop。

<DemoBlock id="zh-CN-plus-chat-15" title="自定义提示信息渲染" kind="code" />

使用示例如下：

<DemoBlock id="zh-CN-plus-chat-16" title="自定义提示信息渲染" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/chat/types.ts`、`packages/ui/src/chat/index.ts` 的公开类型为准。

- `v-model:chats` 对应 `chats` 与 `update:chats`；列表变更时同时触发 `chats-change`。

#### Vue 用法

- `chatBoxRenderConfig`、`renderDivider`、`renderHintBox` 与 `renderInputArea` 是保留的 callback props，不是组件事件。
- topSlot、bottomSlot 兼容 VNode prop；Vue 代码优先使用 top、bottom 及其他作用域插槽。
- `enableUpload` 对象可分别控制 pasteUpload、dragUpload、clickUpload；`uploadProps` 与 `uploadTipProps` 继续作为嵌套配置传入。

#### Vue 实例方法

**ChatExposed**

| 方法                  | 签名                                                        | 说明             |
| --------------------- | ----------------------------------------------------------- | ---------------- |
| `resetMessage`        | () =&gt; void                                               | 重置最后一条消息 |
| `clearContext`        | () =&gt; void                                               | 清除上下文       |
| `scrollToBottom`      | (animation?: boolean) =&gt; void                            | 滚动到列表底部   |
| `sendMessage`         | (content: string, attachment?: UploadFileItem[]) =&gt; void | 发送消息         |
| `getContainerElement` | () =&gt; HTMLDivElement \| null                             | 获取滚动容器     |

#### Vue 事件

**Chat**

| 事件                  | 参数                                            | 说明               |
| --------------------- | ----------------------------------------------- | ------------------ |
| update:chats          | [chats: ChatMessage[]]                          | 更新 chats 绑定    |
| chats-change          | [chats: ChatMessage[]]                          | 对话消息列表变化   |
| message-delete        | [message?: ChatMessage]                         | 删除消息           |
| message-reset         | [message?: ChatMessage]                         | 重置消息           |
| message-copy          | [message?: ChatMessage]                         | 复制消息           |
| message-good-feedback | [message?: ChatMessage]                         | 提交消息正向反馈   |
| message-bad-feedback  | [message?: ChatMessage]                         | 提交消息负向反馈   |
| message-send          | [content: string, attachment: UploadFileItem[]] | 发送消息           |
| input-change          | [payload: ChatInputChangePayload]               | 输入内容或附件变化 |
| hint-click            | [hint: string]                                  | 点击提示词         |
| clear                 | []                                              | 清除上下文         |
| stop-generator        | [event?: Event]                                 | 停止生成           |

#### Vue 插槽

**Chat**

| 插槽             | 作用域参数                                                     | 说明             |
| ---------------- | -------------------------------------------------------------- | ---------------- |
| top              | {}                                                             | 顶部内容         |
| bottom           | {}                                                             | 底部内容         |
| hint             | { content: string, index: number, onHintClick: () =&gt; void } | 自定义提示项     |
| divider          | { message: ChatMessage }                                       | 自定义分割线     |
| input-area       | ChatRenderInputAreaProps                                       | 自定义输入区     |
| chat-box-title   | ChatRenderTitleProps                                           | 自定义会话标题   |
| chat-box-avatar  | ChatRenderAvatarProps                                          | 自定义会话头像   |
| chat-box-content | ChatRenderContentProps                                         | 自定义会话内容   |
| chat-box-action  | ChatRenderActionProps                                          | 自定义会话操作区 |
| chat-box         | ChatRenderFullBoxProps                                         | 自定义完整会话项 |

| 属性                     | 说明                                                                                                                                                                                                | 类型                                                                                      | 默认值      |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ----------- |
| class                    | Vue class 入口                                                                                                                                                                                      | HTMLAttributes['class']                                                                   | —           |
| className                | 自定义类名                                                                                                                                                                                          | HTMLAttributes['class']                                                                   | -           |
| style                    | —                                                                                                                                                                                                   | CSSProperties                                                                             | —           |
| align                    | 对话布局方式，支持 `leftRight`、`leftAlign`                                                                                                                                                         | ChatAlign                                                                                 | `leftRight` |
| mode                     | 对话模式，支持 `bubble` \| `noBubble` \| `userBubble`                                                                                                                                               | ChatMode                                                                                  | `bubble`    |
| chats                    | 受控对话列表                                                                                                                                                                                        | ChatMessage[]                                                                             | []          |
| canSend                  | 发送按钮是否可以发送。通常无需设置，由内部逻辑决定。如有设置，以此设置为准，v2.90.0 新增                                                                                                            | boolean                                                                                   | —           |
| hints                    | 提示信息                                                                                                                                                                                            | string[]                                                                                  | []          |
| roleConfig               | 角色信息配置，具体见 [RoleConfig](#RoleConfig)                                                                                                                                                      | ChatRoleConfig                                                                            | -           |
| chatBoxRenderConfig      | 会话框各区域的渲染 callback 配置；同名插槽优先                                                                                                                                                      | ChatBoxRenderConfig                                                                       | -           |
| customMarkDownComponents | 传给 MarkdownRender 的自定义 Vue 组件映射                                                                                                                                                           | Record&lt;string, unknown&gt;                                                             | -           |
| markdownRenderProps      | 该参数将透传给对话框渲染所用的 MarkdownRender 组件，详见 [MarkdownRenderProps](/zh-CN/plus/markdownrender#API)，Chat 中的 markdownRender 默认 format 为 md，如果需要使用 mdx 格式，可通过此参数设置 | ChatMarkdownRenderProps                                                                   | -           |
| escapeHtml               | 是否对用户消息中的 HTML 标签进行转义，防止被 Markdown 解析器当作 HTML 处理导致内容丢失                                                                                                              | boolean                                                                                   | true        |
| enableUpload             | 是否启用上传, 自 v2.76.0 支持，支持 boolean 类型及对象类型，传入 boolean 类型将同时控制拖拽，点击上传按钮，在输入框中粘贴的上传行为，传入对象可分别设置，传入对象类型时未设置的项默认为 true        | boolean \| ChatEnableUploadProps                                                          | true        |
| uploadProps              | 上传组件属性, 详情参考 [Upload](/zh-CN/input/upload#API%20%E5%8F%82%E8%80%83)                                                                                                                       | Partial&lt;UploadProps&gt;                                                                | -           |
| uploadTipProps           | 上传组件提示属性, 详情参考 [Tooltip](/zh-CN/show/tooltip#API%20%E5%8F%82%E8%80%83)                                                                                                                  | Record&lt;string, unknown&gt;                                                             | -           |
| renderHintBox            | 提示项渲染 callback prop；hint 插槽优先                                                                                                                                                             | (props: { content: string; index: number; onHintClick: () =&gt; void; }) =&gt; VNodeChild | -           |
| renderDivider            | 分割线渲染 callback prop；divider 插槽优先                                                                                                                                                          | (message?: ChatMessage) =&gt; VNodeChild                                                  | -           |
| renderInputArea          | 输入区渲染 callback prop；input-area 插槽优先                                                                                                                                                       | (props: ChatRenderInputAreaProps) =&gt; VNodeChild                                        | -           |
| topSlot                  | 顶部 VNode；top 插槽优先                                                                                                                                                                            | VNodeChild                                                                                | -           |
| bottomSlot               | 底部 VNode；bottom 插槽优先                                                                                                                                                                         | VNodeChild                                                                                | -           |
| showStopGenerate         | 是否展示停止生成按钮                                                                                                                                                                                | boolean                                                                                   | false       |
| showClearContext         | 是否展示清除上下文按钮                                                                                                                                                                              | boolean                                                                                   | false       |
| sendHotKey               | 发送输入内容的键盘快捷键，支持 `enter` \| `shift+enter`。前者在单独按下 enter 将发送输入框中的消息， shift 和 enter 按键同时按下时，仅换行，不发送。后者相反                                        | ChatSendHotKey                                                                            | `enter`     |
| placeholder              | 输入框占位符                                                                                                                                                                                        | string                                                                                    | -           |
| inputBoxStyle            | 输入框样式                                                                                                                                                                                          | CSSProperties                                                                             | -           |
| inputBoxCls              | 输入框类名                                                                                                                                                                                          | string                                                                                    | -           |
| hintStyle                | 提示区最外层样式                                                                                                                                                                                    | CSSProperties                                                                             | -           |
| hintCls                  | 提示区最外层样式类名                                                                                                                                                                                | string                                                                                    | -           |

### RoleConfig

| 属性      | 说明     | 类型             | 默认值 |
| --------- | -------- | ---------------- | ------ |
| user      | 用户信息 | ChatRoleMetadata | -      |
| assistant | 助手信息 | ChatRoleMetadata | -      |
| system    | 系统信息 | ChatRoleMetadata | -      |

### Metadata

| 属性   | 说明                                                                                                                                                                                                                | 类型                 | 默认值 |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ------ |
| name   | 名称                                                                                                                                                                                                                | string               | -      |
| avatar | 头像地址或 VNode                                                                                                                                                                                                    | string \| VNodeChild | -      |
| color  | 头像背景色，同 Avatar 组件的 color 参数, 支持 `amber`、 `blue`、 `cyan`、 `green`、 `grey`、 `indigo`、 `light-blue`、 `light-green`、 `lime`、 `orange`、 `pink`、 `purple`、 `red`、 `teal`、 `violet`、 `yellow` | string               | `grey` |

### Message

| 属性     | 说明                                                                  | 类型                        | 默认值     |
| -------- | --------------------------------------------------------------------- | --------------------------- | ---------- |
| role     | 角色                                                                  | string                      | -          |
| name     | 名称                                                                  | string                      | -          |
| id       | 唯一标识                                                              | string \| number            | -          |
| content  | 文本内容                                                              | string \| ChatContentItem[] | —          |
| parentId | 父节点id                                                              | string                      | -          |
| createAt | 创建时间                                                              | number                      | -          |
| status   | 消息状态，可选值为 `loading` \| `incomplete` \| `complete` \| `error` | ChatMessageStatus           | `complete` |
| like     | 是否已提交正向反馈                                                    | boolean                     | —          |
| dislike  | 是否已提交负向反馈                                                    | boolean                     | —          |

### Content

| 属性      | 说明                                            | 类型                                                      | 默认值 |
| --------- | ----------------------------------------------- | --------------------------------------------------------- | ------ |
| type      | 类型, 可选值`text` \| `image_url` \| `file_url` | string                                                    | -      |
| text      | 当类型为 `text` 时的内容数据                    | string                                                    | -      |
| image_url | 当类型为 `image_url` 时的内容数据               | { url: string }                                           | -      |
| file_url  | 当类型为 `file_url` 时的内容数据                | { url: string; name: string; size: string; type: string } | -      |

### Methods

| 方法                                                        | 说明                                       |
| ----------------------------------------------------------- | ------------------------------------------ |
| resetMessage                                                | 重置消息                                   |
| scrollToBottom(animation?: boolean)                         | 滚动到最底部，animation 为 true 时使用动画 |
| clearContext                                                | 清除上下文                                 |
| sendMessage(content: string, attachment?: UploadFileItem[]) | 发送消息                                   |
| getContainerElement                                         | 获取滚动容器                               |
