---
title: '对话'
description: '用于快速搭建对话内容'
locale: 'zh-CN'
slug: 'chat'
category: 'plus'
order: 28
englishTitle: 'Chat'
icon: 'doc-chat'
upstream: 'plus/chat'
---

`Chat` 对齐 Semi Design `v2.102.0`，提供受控消息、角色气泡、Markdown、附件、建议问题、反馈操作、上下文分隔和输入区。

::demo-block{demo="chat/zh-CN/Example1" title="对话"}
::

## 上游示例

保留固定基线的双语消息与状态；头像/图片使用仓库自有素材，上传通过 customRequest 本地模拟成功，不发送文件到远程服务。

### 基本用法

::demo-block{demo="chat/zh-CN/Basic" title="基本用法"}
::

### 消息状态

::demo-block{demo="chat/zh-CN/Status" title="消息状态"}
::

### 动态更新数据

::demo-block{demo="chat/zh-CN/Streaming" title="动态更新数据"}
::

### 清除上下文

::demo-block{demo="chat/zh-CN/ClearContext" title="清除上下文"}
::

### 自定义头像和标题

::demo-block{demo="chat/zh-CN/AvatarTitle" title="自定义头像和标题"}
::

### 自定义操作区

::demo-block{demo="chat/zh-CN/Actions" title="自定义操作区"}
::

### 自定义来源内容

::demo-block{demo="chat/zh-CN/Sources" title="自定义来源内容"}
::

### 自定义整个会话框

::demo-block{demo="chat/zh-CN/FullBox" title="自定义整个会话框"}
::

### 自定义输入框

::demo-block{demo="chat/zh-CN/InputArea" title="自定义输入框"}
::

### 提示信息

::demo-block{demo="chat/zh-CN/Hints" title="提示信息"}
::

### 自定义提示信息

::demo-block{demo="chat/zh-CN/CustomHints" title="自定义提示信息"}
::

基础回答中的 Button 代码改为 Vue SFC。头像、操作、来源卡片、完整消息与表单输入分别用 scoped slots 和局部子组件适配；保留上游双语 hints 差异。来源卡片使用按钮支持键盘展开/收起；图片问答对应本地插画。

## Vue API

| 属性                                    | 说明                                             | 默认值      |
| --------------------------------------- | ------------------------------------------------ | ----------- |
| `chats` / `v-model:chats`               | 受控消息数组                                     | `[]`        |
| `align`                                 | `leftRight` 或 `leftAlign`                       | `leftRight` |
| `mode`                                  | `bubble`、`noBubble`、`userBubble`               | `bubble`    |
| `hints`                                 | 建议问题                                         | `[]`        |
| `roleConfig`                            | user/assistant/自定义角色名称、头像和颜色        | -           |
| `enableUpload`                          | 总开关或点击/粘贴/拖放三个上传开关               | `true`      |
| `sendHotKey`                            | `enter` 或 `shift+enter`                         | `enter`     |
| `canSend`                               | 显式覆盖发送可用状态                             | 自动计算    |
| `showStopGenerate` / `showClearContext` | 显示停止生成/清空上下文入口                      | `false`     |
| `escapeHtml`                            | 转义 user 消息中的 HTML                          | `true`      |
| `uploadProps` / `uploadTipProps`        | Upload 与上传提示配置                            | -           |
| `markdownRenderProps`                   | Markdown `breaks`、`linkify`、`typographer` 配置 | -           |

消息 `content` 可以是字符串，也可以是 `text`、`image_url`、`file_url` 内容数组。事件包括 `chats-change`、`message-send`、`input-change`、`hint-click`、`message-copy`、`message-delete`、`message-reset`、正/负反馈、`clear` 与 `stop-generator`。

React render props 映射为 `#top`、`#bottom`、`#hint`、`#divider`、`#input-area` 和 `#chat-box-*` scoped slots；原函数 prop 也保留用于渐进迁移。组件 ref 暴露 `sendMessage`、`resetMessage`、`clearContext`、`scrollToBottom` 和 `getContainerElement`。

## SSR、安全与可访问性

SSR import/render 不创建 Observer、拖放、剪贴板或滚动监听。textarea 保留多行输入语义，默认 hint 使用原生 button，图标按钮具有 aria-label。Vue 实现不通过 `v-html` 执行消息 HTML：即使显式设置 `escapeHtml=false`，原始 HTML 仍作为文本显示；这是为避免未清洗内容执行脚本而保留的安全 deviation。可信富内容可通过 `#chat-box-content` 自定义渲染。

完整证据见 [alignment.md](https://github.com/aifuxi/semi-ui-vue/blob/master/docs/components/chat/alignment.md)，迁移说明见 [react-to-vue.md](#react-vue)。

## React → Vue

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
