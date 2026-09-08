---
title: 'AIComponent overview'
description: 'AI styles and a multi-agent conversation example'
locale: 'en-US'
slug: 'ai-component'
category: 'ai'
order: 100
englishTitle: 'AIComponent'
icon: 'doc-aiComponent'
upstream: 'ai/aiComponent'
---

AI capabilities include 20 base color tokens, 25 AI icons, colorful Button / Tag / FloatButton styles, and AIChatInput, AIChatDialogue and Sidebar for rich input, multimodal messages and reference details. These examples follow the pinned Semi Design v2.102.0. This is a composition guide; there is no separate AIComponent export.

## AI basic components

Enable AI styles with `colorful`, and add `gradient` to Tag. The example covers tokens, multicolor icons, loading/disabled buttons, six tag styles and a VIP float button.

::demo-block{demo="ai-component/en-US/Basic" title="AI basic components"}
::

## Build a conversation with AI Chat components

Combine the input and dialogue components for Product Manager, Designer and Front-end agents. Try model/MCP/thinking configuration, uploads, references and reference removal, message editing, annotation details and the PRD artifact sidebar. Clicking the same item toggles the sidebar; another item opens its details.

Sending uses a local mock (generation ends after 100ms; a reply arrives after 1s). Uploads also use a local mock; no model service is called. Avatars and source logos use existing local demo images, and stack text uses Vue. The sample conversation's product ideas are not library feature promises. Editing keeps earlier history and resends that message. Both languages retain the upstream order and language-specific content.

::demo-block{demo="ai-component/en-US/Conversation" title="Multi-agent conversation"}
::

## React → Vue migration

| React                                                       | Vue                                                                                             |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `renderConfigureArea`                                       | `#configure`, with the same-language ConfigurationControls.vue helper                           |
| `chats` / `onChatsChange`                                   | `v-model:chats`                                                                                 |
| `messageEditRender`                                         | `#message-edit="{ value }"`, passing converted input, attachments and references to AIChatInput |
| `renderDialogueContentItem`                                 | Function map using `h()` for custom resources                                                   |
| `onMessageSend` / `onReferenceDelete` / `onAnnotationClick` | `@message-send` / `@reference-delete` / `@annotation-click`                                     |
| `icon` / `prefixIcon` ReactNode                             | Named Vue slots                                                                                 |

## FAQ

Use [Chat](/en-us/components/chat/) for simple text conversations and basic file/image displays. Combine [AIChatInput](/en-us/components/ai-chat-input/) and [AIChatDialogue](/en-us/components/ai-chat-dialogue/) for rich input, skills/templates, tool configuration, custom multimodal messages and data conversion. Add [Sidebar](/en-us/components/sidebar/) for reference and artifact workspaces.
