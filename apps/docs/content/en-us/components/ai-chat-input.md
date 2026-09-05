---
title: 'AIChatInput'
description: 'Input box used in AI chat scenarios'
locale: 'en-US'
slug: 'ai-chat-input'
category: 'ai'
order: 101
englishTitle: 'AIChatInput'
icon: 'doc-aiInput'
upstream: 'ai/aiChatInput'
---

AIChatInput matches Semi Design v2.102.0 for rich-text input, skills, suggestions, templates, references, attachments, and generating state. It uses Tiptap 3.10.7 and maps the React contract to Vue props, emits, scoped slots, and exposed methods.

```ts
import { AIChatInput } from '@aifuxi/semi-ui-vue/ai-chat-input';
import '@aifuxi/semi-theme-default/ai-chat-input.css';
```

::demo-block{demo="ai-chat-input/en-US/Example1" title="AIChatInput"}
::

## Core API

| Prop                                                    | Description                                               | Default            |
| ------------------------------------------------------- | --------------------------------------------------------- | ------------------ |
| `defaultContent` / `placeholder` / `extensions`         | Initial Tiptap content, placeholder, and extra extensions | -                  |
| `references` / `uploadProps`                            | References and Upload configuration                       | `[]` / `{}`        |
| `suggestions` / `skills` / `skillHotKey`                | Suggestions, skills, and the skill shortcut               | -                  |
| `showReference` / `showUploadFile` / `showUploadButton` | Shows references, attachments, and upload control         | `true`             |
| `generating` / `canSend`                                | Generating state and optional send override               | `false` / inferred |
| `sendHotKey`                                            | `'enter'` or `'shift+enter'`                              | `'enter'`          |
| `round` / `dropdownMatchTriggerWidth`                   | Rounded footer and trigger-width popup                    | `true`             |
| `clearContentOnGenerating` / `keepSkillAfterSend`       | Clears on generation and optionally preserves the skill   | `true` / `false`   |

Emits include `contentChange`, `messageSend`, `stopGenerate`, `focus`, `blur`, `paste`, `referenceClick`, `referenceDelete`, `uploadChange`, `configureChange`, `suggestClick`, `skillChange`, and `templateVisibleChange`. Exposed methods are `setContent`, `getEditor`, `focusEditor`, `deleteContent`, `deleteUploadFile`, `changeTemplateVisible`, and `setContentWhileSaveTool`.

## Slots and Configure

`#reference`, `#uploadButton`, `#top`, `#configure`, `#action`, `#suggestion`, `#skill`, and `#template` replace React render props. `AIChatInput.Configure` supplies `Button`, `Select`, `RadioButton`, and `Mcp` items with per-instance provider state.

## SSR and accessibility

SSR import and rendering do not create an EditorView, Portal, or document listener. Tiptap starts after client mount and is destroyed on unmount. The editor is a real `contenteditable`; suggestion and skill panels use listbox/option semantics, and send, stop, upload, and delete controls expose accessible names.

See the [React-to-Vue guide](#react-vue) and the [alignment matrix](https://github.com/aifuxi/semi-ui-vue/blob/master/docs/components/ai-chat-input/alignment.md).

## React → Vue

| Semi React v2.102.0                        | Vue                                      | 说明                                                    |
| ------------------------------------------ | ---------------------------------------- | ------------------------------------------------------- |
| `onContentChange={fn}`                     | `@content-change="fn"`                   | 事件参数保持转换后的内容数组                            |
| `onMessageSend={fn}`                       | `@message-send="fn"`                     | payload 保留 references/attachments/inputContents/setup |
| `renderReference`                          | `#reference="{ reference }"`             | 返回 Vue VNode                                          |
| `renderUploadButton`                       | `#uploadButton="props"`                  | 可用 `defaultNode` 与 `openFileDialog`                  |
| `renderTopSlot`                            | `#top="props"`                           | `topSlotPosition` 值不变                                |
| `renderConfigureArea`                      | `#configure`                             | 配合 `AIChatInput.Configure.*`                          |
| `renderActionArea`                         | `#action="{ menuItem, className }"`      | `menuItem` 已包含可工作的 Upload/Send VNode             |
| `renderSuggestionItem` / `renderSkillItem` | `#suggestion` / `#skill`                 | slot props 提供 class 与点击/悬浮回调                   |
| `renderTemplate`                           | `#template="{ skill, onTemplateClick }"` | 模板选择回写编辑器                                      |
| `ref.current.setContent(...)`              | 组件 ref `.setContent(...)`              | 不暴露私有 Foundation                                   |

`immediatelyRender` 为迁移兼容 prop：React adapter 用它避免 SSR 立即创建 Editor；Vue adapter 天然在 `onMounted` 后创建，因此 true/false 不改变 Vue 的首帧时机，SSR 结果与 React 的 false 路径等价。

```vue
<AIChatInput :references="references" :upload-props="{ action: '/upload' }">
  <template #reference="{ reference }">
    <a :href="reference.url">{{ reference.name }}</a>
  </template>
  <template #action="{ menuItem, className }">
    <div :class="className"><component :is="item" v-for="(item, i) in menuItem" :key="i" /></div>
  </template>
</AIChatInput>
```

所有默认值为 `true` 的 Boolean prop 都区分缺省与显式 `false`；模板中的裸属性、`:prop="false"` 与 render function 输入均遵循 Vue 原生语义。Tiptap 扩展继续通过 `extensions` 追加，公开 Tiptap 类型来自已声明的运行时依赖，不需要消费方初始化 `vendor/semi-design`。
