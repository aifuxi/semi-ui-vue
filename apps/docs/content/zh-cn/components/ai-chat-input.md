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

## 固定上游示例

上传均使用本地customRequest模拟，不发往上游接口。公开配置适配使用Configure.Item插槽替代React getConfigureItem，保留field/initValue与发送setup。自定义扩展复用公开SkillSlot.extend，Vue面板提供@两级选择、键盘导航和transformer；不引入第二份编辑器运行时。Actions补充清空输入行为；模板修正上游未闭合的input-slot属性，双语数据差异保留。

### 基本用法

::demo-block{demo="ai-chat-input/zh-CN/Basic" title="基本用法"}
::

### 消息发送

::demo-block{demo="ai-chat-input/zh-CN/SendMessage" title="消息发送"}
::

### 富文本输入区

::demo-block{demo="ai-chat-input/zh-CN/RichText" title="富文本输入区"}
::

### 引用

::demo-block{demo="ai-chat-input/zh-CN/References" title="引用"}
::

### 配置区域

::demo-block{demo="ai-chat-input/zh-CN/Configure" title="配置区域"}
::

### 自定义配置

::demo-block{demo="ai-chat-input/zh-CN/CustomConfigure" title="自定义配置"}
::

### 操作区域

::demo-block{demo="ai-chat-input/zh-CN/Actions" title="操作区域"}
::

### 自定义上传按钮

::demo-block{demo="ai-chat-input/zh-CN/UploadButton" title="自定义上传按钮"}
::

### 底部按钮形状

::demo-block{demo="ai-chat-input/zh-CN/Shape" title="底部按钮形状"}
::

### 建议

::demo-block{demo="ai-chat-input/zh-CN/Suggestions" title="建议"}
::

### 技能及模版

::demo-block{demo="ai-chat-input/zh-CN/Skills" title="技能及模版"}
::

### 自定义顶部区域

::demo-block{demo="ai-chat-input/zh-CN/TopSlot" title="自定义顶部区域"}
::

### 自定义扩展

::demo-block{demo="ai-chat-input/zh-CN/Extensions" title="自定义扩展"}
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

`#reference`、`#uploadButton`、`#top`、`#configure`、`#action`、`#suggestion`、`#skill`、`#template` 分别替代 React render props。`AIChatInput.Configure` 提供 `Button`、`Select`、`RadioButton`、`Mcp` 与 `Item` 配置项，provider 按组件实例隔离。

## SSR 与无障碍

SSR 导入和渲染不会创建 EditorView、Portal 或 document 监听器；客户端挂载后创建 Tiptap 并在卸载时销毁。编辑器为真实 `contenteditable`，建议和技能使用 listbox/option 语义，发送、停止、上传和删除操作均提供可访问名称。

逐项迁移见 [React → Vue 指南](#react-vue)，固定源码证据与完整矩阵见 [对齐矩阵](https://github.com/aifuxi/semi-ui-vue/blob/master/docs/components/ai-chat-input/alignment.md)。

`Configure.Item` 通过 `field`、`initValue` 和默认插槽 `{ value, onChange }` 接入任意配置控件；变更同步到 `configureChange` 和发送数据的 `setup`，卸载时移除字段。

默认上传按钮由外层 Upload trigger 统一打开文件选择器，一次点击只触发一次；自定义上传插槽仍可使用公开 `openFileDialog` 回调。固定依据：`aiChatInput/index.tsx:528` 的默认按钮没有额外 click 回调。
