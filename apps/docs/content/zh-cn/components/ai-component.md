---
title: 'AIComponent 能力介绍'
description: 'AI 基础样式与多 Agent 对话组合示例'
locale: 'zh-CN'
slug: 'ai-component'
category: 'ai'
order: 100
englishTitle: 'AIComponent'
icon: 'doc-aiComponent'
upstream: 'ai/aiComponent'
---

AI 场景能力包括 20 个基础颜色 Token、25 个 AI 图标、多彩 Button / Tag / FloatButton，以及用于富文本输入、多模态消息和资料查看的 AIChatInput、AIChatDialogue 与 Sidebar。以下两个示例对应固定 Semi Design v2.102.0；这是组件组合指南，没有独立的 AIComponent 组件导出。

## AI 基础组件

通过 `colorful` 开启 AI 风格，Tag 可叠加 `gradient`。示例保留上游 Token、图标多色填充、按钮 loading/disabled、六种标签与 VIP 浮动按钮。

::demo-block{demo="ai-component/zh-CN/Basic" title="AI 基础组件"}
::

## AI Chat 组件构建对话

组合输入框与消息列表，演示产品经理、设计师和前端开发的多 Agent 对话。支持模型/MCP/思考配置、上传、引用及删除引用、编辑消息、参考资料和 PRD 产物侧栏；再次点击相同资料可收起，切换资料会打开新内容。

发送使用本地模拟回复（100ms 结束生成态，1s 追加回复），上传使用本地模拟成功，不连接模型服务。头像和来源 Logo 使用已有本地演示图片，技术栈文案改为 Vue；示例对话中的产品设想不构成本库能力承诺。编辑后保留编辑消息之前的历史，重新发送该条消息。中英文顺序和数据结构一致，各自保留上游语言内容。

::demo-block{demo="ai-component/zh-CN/Conversation" title="多 Agent 对话"}
::

## React → Vue 迁移

| React                                                       | Vue                                                                     |
| ----------------------------------------------------------- | ----------------------------------------------------------------------- |
| `renderConfigureArea`                                       | `#configure`，同语言 ConfigurationControls.vue 多文件依赖               |
| `chats` / `onChatsChange`                                   | `v-model:chats`                                                         |
| `messageEditRender`                                         | `#message-edit="{ value }"`，将转换后的输入、附件和引用交给 AIChatInput |
| `renderDialogueContentItem`                                 | 同名函数映射，使用 `h()` 渲染自定义 resource                            |
| `onMessageSend` / `onReferenceDelete` / `onAnnotationClick` | `@message-send` / `@reference-delete` / `@annotation-click`             |
| `icon` / `prefixIcon` ReactNode                             | 对应 Vue 命名插槽                                                       |

## FAQ

简单文本对话和基本文件/图片展示可使用 [Chat](/zh-cn/components/chat/)。需要富文本输入、技能/模板、工具配置、自定义多模态消息与转换时，组合 [AIChatInput](/zh-cn/components/ai-chat-input/) 和 [AIChatDialogue](/zh-cn/components/ai-chat-dialogue/)；资料与产物工作区可配合 [Sidebar](/zh-cn/components/sidebar/)。
