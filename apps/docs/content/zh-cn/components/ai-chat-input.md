---
title: '聊天输入框'
description: '用于 AI 聊天场景下的输入框'
locale: 'zh-CN'
slug: 'ai-chat-input'
category: 'ai'
order: 101
englishTitle: 'AIChatInput'
icon: 'doc-aiInput'
upstream: 'ai/aiChatInput'
---

AIChatInput 对齐 Semi Design v2.102.0 的富文本输入、技能、建议、模板、引用、附件和生成态。组件使用 Tiptap 3.10.7，并在 Vue 中以 props、emits、scoped slots 与公开实例方法表达原 React 契约。

```ts
import { AIChatInput } from '@aifuxi/semi-ui-vue/ai-chat-input';
import '@aifuxi/semi-theme-default/ai-chat-input.css';
```

::demo-block{demo="ai-chat-input/zh-CN/Example1" title="聊天输入框"}
::

## 核心 API

| 属性                                                    | 说明                               | 默认值             |
| ------------------------------------------------------- | ---------------------------------- | ------------------ |
| `defaultContent` / `placeholder` / `extensions`         | 初始 Tiptap 内容、占位符和附加扩展 | -                  |
| `references` / `uploadProps`                            | 引用和 Upload 配置                 | `[]` / `{}`        |
| `suggestions` / `skills` / `skillHotKey`                | 建议、技能和技能快捷键             | -                  |
| `showReference` / `showUploadFile` / `showUploadButton` | 显示引用、附件和上传按钮           | `true`             |
| `generating` / `canSend`                                | 生成状态和可选发送覆盖值           | `false` / 自动计算 |
| `sendHotKey`                                            | `'enter'` 或 `'shift+enter'`       | `'enter'`          |
| `round` / `dropdownMatchTriggerWidth`                   | 圆角 footer、浮层匹配触发器宽度    | `true`             |
| `clearContentOnGenerating` / `keepSkillAfterSend`       | 开始生成时清理；可只保留技能       | `true` / `false`   |

事件包括 `contentChange`、`messageSend`、`stopGenerate`、`focus`、`blur`、`paste`、`referenceClick`、`referenceDelete`、`uploadChange`、`configureChange`、`suggestClick`、`skillChange` 和 `templateVisibleChange`。实例公开 `setContent`、`getEditor`、`focusEditor`、`deleteContent`、`deleteUploadFile`、`changeTemplateVisible` 与 `setContentWhileSaveTool`。

## 插槽与 Configure

`#reference`、`#uploadButton`、`#top`、`#configure`、`#action`、`#suggestion`、`#skill`、`#template` 分别替代 React render props。`AIChatInput.Configure` 提供 `Button`、`Select`、`RadioButton` 与 `Mcp` 配置项，provider 按组件实例隔离。

## SSR 与无障碍

SSR 导入和渲染不会创建 EditorView、Portal 或 document 监听器；客户端挂载后创建 Tiptap 并在卸载时销毁。编辑器为真实 `contenteditable`，建议和技能使用 listbox/option 语义，发送、停止、上传和删除操作均提供可访问名称。

逐项迁移见 [React → Vue 指南](#react-vue)，固定源码证据与完整矩阵见 [对齐矩阵](https://github.com/aifuxi/semi-ui-vue/blob/master/docs/components/ai-chat-input/alignment.md)。
