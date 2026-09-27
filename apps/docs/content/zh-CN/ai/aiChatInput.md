---
title: 'AIChatInput 聊天输入框'
description: '用于 AI 聊天场景下的输入框'
type: 'ai'
order: 101
icon: 'doc-aiInput'
---

## 使用场景

在 AI 聊天场景下，用户可通过 `AIChatInput`实现富文本输入、上传、引用、建议、模版、功能配置、及丰富自定义展示等需求。

`AIChatInput` 的富文本输入是基于 [tiptap](https://tiptap.dev/docs/editor/getting-started/overview) 实现，`tiptap` 是一款现代的富文本编辑器开发框架，支持 React、Vue 前端框架，具备极强的可定制性和扩展性。其组件化能力优秀，性能优良，内置多种常用拓展，并支持用户自定义节点、命令、插件与菜单，使复杂 AI 场景下的富文本输入能力能够灵活适配和扩展。Semi 的 `AIChatInput` 组件对 tiptap 进行了封装，开发者可开箱即用或按需按业务扩展。

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/ai-chat-input` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-ai-aiChatInput-1" title="如何引入" kind="import" />

### 基本用法

支持文本输入以及文件上传，使用时可按需配置以下参数：

- `uploadProps` 配置文件上传相关的参数，详见 [UploadProps](/zh-CN/input/upload#API)
- `upload-change` 事件获取文件上传变化
- 删除上传文件时，会触发 `uploadProps.onRemove`，并遵循 `uploadProps.beforeRemove`（支持 Promise）
- `placeholder` 输入框的占位符
- `defaultContent` 输入框的默认内容
- `content-change` 事件在输入框内容变化时返回当前富文本内容

<DemoBlock id="zh-CN-ai-aiChatInput-2" title="基本用法" kind="live" />

### 消息发送

当输入框中有内容（包括输入文本，上传内容，[引用内容](/zh-CN/ai/aiChatInput#%E5%BC%95%E7%94%A8)），将允许发送消息。点击消息发送按钮，会触发 `message-send` 事件，参数为当前输入框的内容，包括输入区域的文本，引用内容，上传文件，配置区域内容。

用户可在 `message-send` 监听器中按需设置 `generating` 表示消息正在处理中，如果 `generating` 为 `true`，则 AIChatInput 会在发送按钮位置显示停止生成按钮，并清空输入区的消息，以及上传文件，另外，引用内容需要用户自行清除。

点击停止生成按钮，会触发 `stop-generate` 事件，用户可在监听器中处理停止生成逻辑， 如将 `generating` 设为 `false`。

<DemoBlock id="zh-CN-ai-aiChatInput-3" title="消息发送" kind="live" />

### 富文本输入区

AIChatInput 使用 [tiptap](https://tiptap.dev/docs/editor/getting-started/overview) 作为富文本输入框的编辑器，用户可以在输入框中输入文本，使用 AIChatInput 内置的 extensions（包括 `input-slot`，`select-slot`，`skill-slot`）。用户也可以自定义 extensions 来扩展编辑器的功能。

- `input-slot` 支持用户输入文本，并支持 placeholder 占位符。
- `select-slot` 支持用户进行简单的选择，选项仅支持 string 类型。
- `skill-slot` 是用于技能展示的块，方便用户理解当前输入框中的技能。

可以通过模板 ref 的公开方法 `setContent` 来设置输入框的内容，使用 `focusEditor` 方法可以将输入框的焦点设置到编辑器中。

<DemoBlock id="zh-CN-ai-aiChatInput-4" title="富文本输入区" kind="live" />

### 引用

用户可以 `references` 传入引用内容，引用内容会展示在输入框的顶部。

- `reference` 作用域插槽自定义单个引用内容；迁移代码也可继续使用 `renderReference` callback prop。
- `reference-delete` 事件处理引用内容的删除。
- `reference-click` 事件处理引用内容的点击。

<DemoBlock id="zh-CN-ai-aiChatInput-5" title="引用" kind="live" />

### 配置区域

用户可以通过配置区域设置使用模型参数、联网搜索、深度思考等配置项，展示或者查看 MCP 工具。

可通过 `configure` 插槽自定义输入框的配置区；迁移代码也可继续使用 `renderConfigureArea` callback prop。

使用 `Configure` 中的 `Select`、`Button`、`Mcp`、`RadioButton` 等组件可以自定义配置项。

`Configure` 将管理配置项的状态，用户可以通过 `configure-change` 事件监听配置项的变化。一定要配置 `field` 属性，用于标识配置项的唯一标识。如需设置初始值，可通过 `initValue` 属性设置。

如果用户有其他形式的配置需求，可以通过 `getConfigureItem` 将自定义组件扩展成 `Configure` 类型组件。

<DemoBlock id="zh-CN-ai-aiChatInput-6" title="配置区域" kind="live" />

使用 `getConfigureItem` 扩展自定义组件为 `Configure` 类型组件。

<DemoBlock id="zh-CN-ai-aiChatInput-7" title="配置区域" kind="code" />

使用示例如下：

<DemoBlock id="zh-CN-ai-aiChatInput-8" title="配置区域" kind="live" />

### 操作区域

输入框右下角为操作区域，用户可以通过 `action` 作用域插槽自定义操作区域；迁移代码也可继续使用 `renderActionArea` callback prop，展示自定义的操作按钮。

<DemoBlock id="zh-CN-ai-aiChatInput-9" title="操作区域" kind="code" />

使用示例如下：

<DemoBlock id="zh-CN-ai-aiChatInput-10" title="操作区域" kind="live" />

### 自定义上传按钮

底部操作区左侧默认会渲染上传按钮。你可以通过 `renderUploadButton` **仅自定义按钮 UI**（例如改成图标按钮、加 Tooltip 等）。

注意：这不会影响上传/粘贴上传逻辑（`Upload` 仍由组件内部托管），`openFileDialog` 会触发内部 Upload 的文件选择。

<DemoBlock id="zh-CN-ai-aiChatInput-11" title="自定义上传按钮" kind="live" />

### 底部按钮形状

用户可以通过 `round` API 配置底部按钮的形状，默认是 `true`，是圆角按钮， 可以设置为 `false` 来配置为方形按钮。

<DemoBlock id="zh-CN-ai-aiChatInput-12" title="底部按钮形状" kind="live" />

### 建议

用户可通过 `suggestion` API 配置建议列表，功能类似于 AutoComplete 组件，用户可以根据输入的内容实现根据输入的内容动态展示建议列表。

使用鼠标上下按键切换建议列表的选项。按下 `ESC` 或者点击非建议列表，输入框区域，建议列表将关闭。

还可通过 `suggestion` 作用域插槽自定义建议项；迁移代码也可继续使用 `renderSuggestionItem` callback prop。

<DemoBlock id="zh-CN-ai-aiChatInput-13" title="建议" kind="live" />

### 技能及模版

用户可以通过 `skills` API 配置技能列表，使用 `skillHotKey` 配置技能的触发键。

`skills` 的格式如下

<DemoBlock id="zh-CN-ai-aiChatInput-14" title="技能及模版" kind="code" />

由于模版的展示形式丰富，因此我们不提供默认的展示形式，用户可以通过 `template` 作用域插槽自定义模板展示；迁移代码也可继续使用 `renderTemplate` callback prop。模版面板的展示和关闭可通过点击模版按钮实现。

<DemoBlock id="zh-CN-ai-aiChatInput-15" title="技能及模版" kind="code" />

使用示例如下：

<DemoBlock id="zh-CN-ai-aiChatInput-16" title="技能及模版" kind="live" />

### 自定义渲染顶部区域

用户可以通过 `top` 作用域插槽自定义顶部区域；迁移代码也可继续使用 `renderTopSlot` callback prop，可自行渲染引用，上传内容以及配置项。可结合 `showReference` 和 `showUploadFile` API 控制是否展示引用和上传文件。另外，可通过 `topSlotPosition` API 配置自定义渲染内容相对于引用区域，上传展示区域的相对位置。

<DemoBlock id="zh-CN-ai-aiChatInput-17" title="自定义渲染顶部区域" kind="code" />

使用用例如下：

<DemoBlock id="zh-CN-ai-aiChatInput-18" title="自定义渲染顶部区域" kind="live" />

### 自定义扩展

富文本区域可以自定义扩展，自定义扩展的实现可参考 [Tiptap 自定义扩展](https://tiptap.dev/docs/editor/extensions/custom-extensions/create-new)。通过 `extensions` API 可将自定义扩展添加到 `AIChatInput` 组件中。如果添加了自定义扩展，需要在 `transformer` 中添加对应的转换规则， 以保证在 `content-change` 事件中得到的该节点数据符合用户预期。

添加自定义扩展时有以下注意事项：

- 请在自定义扩展中添加 `isCustomSlot` 的属性，该属性和自定义扩展前后的光标高度有关
- 由于 `AIChatInput` 使用 `Enter` 作为发送热键，如果自定义扩展有使用 `Enter` 作为快捷操作，需要自行设置 `editor.storage` 中的 `AIChatInput.allowHotKeySend` 用于表示热键是否应该被 AIChatInput 用于发送，避免热键冲突

自定义扩展定义及注意事项的示例如下：

<DemoBlock id="zh-CN-ai-aiChatInput-19" title="自定义扩展" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/ai-chat-input/types.ts`、`packages/ui/src/ai-chat-input/index.ts` 的公开类型为准。

#### Vue 用法

- renderReference、renderUploadButton、renderTopSlot、renderConfigureArea、renderActionArea、renderSuggestionItem、renderSkillItem 与 renderTemplate 是保留的迁移 callback props；Vue 代码优先使用对应作用域插槽。
- `placeholder` 函数、`transformer` 映射以及 uploadProps、popoverProps、uploadTipProps 内部函数均为配置 callback，不是组件事件。
- `AIChatInput.Configure` 提供 Item、Button、Mcp、RadioButton、Select 静态成员；配置容器的 `value` 可通过 `v-model:value` 绑定。

#### Vue 静态方法

**包导出**

| 方法               | 签名                                                                                                         | 说明                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------ | ------------------------------------ |
| `getConfigureItem` | (component: Component, options?: AIChatInputGetConfigureItemOptions) =&gt; AIChatInputConfigureItemComponent | 将自定义 Vue 组件接入 Configure 状态 |

**AIChatInput 静态成员**

| 方法                     | 签名                                   | 说明                            |
| ------------------------ | -------------------------------------- | ------------------------------- |
| `getCustomSlotAttribute` | () =&gt; Record&lt;string, unknown&gt; | 返回自定义 Tiptap slot 节点属性 |

#### Vue 实例方法

**AIChatInputExposed**

| 方法                      | 签名                                                                | 说明               |
| ------------------------- | ------------------------------------------------------------------- | ------------------ |
| `changeTemplateVisible`   | (visible: boolean) =&gt; void                                       | 切换模板面板       |
| `deleteContent`           | (content: AIChatInputContent) =&gt; void                            | 删除富文本内容项   |
| `deleteUploadFile`        | (item: Attachment) =&gt; void                                       | 删除附件           |
| `focusEditor`             | (pos?: Parameters&lt;Editor['commands']['focus']&gt;[0]) =&gt; void | 聚焦编辑器         |
| `getEditor`               | () =&gt; Editor \| undefined                                        | 获取 Tiptap Editor |
| `setContent`              | (content: TiptapContent) =&gt; void                                 | 设置编辑器内容     |
| `setContentWhileSaveTool` | (content: string) =&gt; void                                        | 保留技能并设置内容 |

**AIChatInputConfigureExposed**

| 方法                | 签名                         | 说明           |
| ------------------- | ---------------------------- | -------------- |
| `getConfigureValue` | () =&gt; LeftMenuChangeProps | 获取当前配置值 |

#### Vue 事件

**AIChatInput**

| 事件                  | 参数                                                             | 说明                   |
| --------------------- | ---------------------------------------------------------------- | ---------------------- |
| contentChange         | [contents: AIChatInputContent[]]                                 | 富文本内容变化         |
| focus / blur          | [event: FocusEvent]                                              | 富文本编辑器聚焦或失焦 |
| paste                 | [event: ClipboardEvent]                                          | 富文本编辑器发生粘贴   |
| referenceDelete       | [reference: Reference]                                           | 删除引用               |
| referenceClick        | [reference: Reference]                                           | 点击引用               |
| uploadChange          | [payload: UploadChangePayload]                                   | 附件列表变化           |
| messageSend           | [content: MessageContent]                                        | 发送消息               |
| stopGenerate          | []                                                               | 停止生成               |
| configureChange       | [value: LeftMenuChangeProps, changedValue?: LeftMenuChangeProps] | 配置值变化             |
| suggestClick          | [suggestion: Suggestion]                                         | 选择建议项             |
| skillChange           | [skill: Skill \| undefined]                                      | 技能变化               |
| templateVisibleChange | [visible: boolean]                                               | 模板面板显隐变化       |

**AIChatInput.Configure**

| 事件         | 参数                                                             | 说明            |
| ------------ | ---------------------------------------------------------------- | --------------- |
| change       | [value: LeftMenuChangeProps, changedValue?: LeftMenuChangeProps] | 配置值变化      |
| update:value | [value: LeftMenuChangeProps]                                     | 更新 value 绑定 |

**AIChatInput.Configure.Mcp**

| 事件                 | 参数 | 说明              |
| -------------------- | ---- | ----------------- |
| configureButtonClick | []   | 点击 MCP 配置按钮 |

#### Vue 插槽

**AIChatInput**

| 插槽         | 作用域参数                                                            | 说明           |
| ------------ | --------------------------------------------------------------------- | -------------- |
| reference    | { reference: Reference }                                              | 自定义引用项   |
| uploadButton | RenderUploadButtonProps                                               | 自定义上传按钮 |
| top          | RenderTopSlotProps                                                    | 自定义顶部区域 |
| configure    | { className: string }                                                 | 自定义配置区   |
| action       | ActionAreaProps                                                       | 自定义操作区   |
| suggestion   | RenderSuggestionItemProps                                             | 自定义建议项   |
| skill        | RenderSkillItemProps                                                  | 自定义技能项   |
| template     | { skill: Skill \| undefined; onTemplateClick(content: string): void } | 自定义模板面板 |

**AIChatInput.Configure.Item**

| 插槽    | 作用域参数                                         | 说明           |
| ------- | -------------------------------------------------- | -------------- |
| default | { value: unknown; onChange(value: unknown): void } | 自定义配置控件 |

### AIChatInput

| 属性                         | 说明                                                                                                                                                         | 类型                                                                                           | 默认值                     |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- | -------------------------- |
| dropdownMatchTriggerWidth    | 下拉弹出层是否是否与输入框宽度一致                                                                                                                           | boolean                                                                                        | true                       |
| keepSkillAfterSend           | 生成态清空内容时是否保留当前技能                                                                                                                             | boolean                                                                                        | false                      |
| class                        | Vue class 入口                                                                                                                                               | HTMLAttributes['class']                                                                        | —                          |
| className                    | 自定义类名                                                                                                                                                   | HTMLAttributes['class']                                                                        | -                          |
| style                        | 自定义样式                                                                                                                                                   | StyleValue                                                                                     | -                          |
| placeholder                  | 输入框占位符或 Tiptap placeholder callback                                                                                                                   | PlaceholderProps                                                                               | —                          |
| showPlaceholderWhenSkillOnly | 当仅选中技能（无其他内容）时是否显示 placeholder，开启后 placeholder 会显示在 skill 后方                                                                     | boolean                                                                                        | false                      |
| extensions                   | 自定义扩展，类型同 tiptap 的 Extension 类型相同                                                                                                              | Extensions                                                                                     | -                          |
| defaultContent               | 输入框默认内容，支持 html string 以及 json 格式，同 Tiptap 的 Content                                                                                        | TiptapContent                                                                                  | -                          |
| references                   | 输入框引用列表                                                                                                                                               | Reference[]                                                                                    | -                          |
| renderReference              | 引用项渲染 callback prop；reference 插槽优先                                                                                                                 | (reference: Reference) =&gt; VNodeChild                                                        | -                          |
| uploadProps                  | 上传文件相关配置                                                                                                                                             | Partial&lt;UploadProps&gt;                                                                     | -                          |
| renderUploadButton           | 上传按钮渲染 callback prop；uploadButton 插槽优先                                                                                                            | (props: RenderUploadButtonProps) =&gt; VNodeChild                                              | —                          |
| renderTopSlot                | 顶部区域渲染 callback prop；top 插槽优先                                                                                                                     | (props: RenderTopSlotProps) =&gt; VNodeChild                                                   | -                          |
| topSlotPosition              | 顶部 slot 位置，相对于引用内容，上传内容                                                                                                                     | 'top' \| 'middle' \| 'bottom'                                                                  | `top`                      |
| showUploadFile               | 是否展示上传文件区域，用于配合 renderTopSlot 使用                                                                                                            | boolean                                                                                        | true                       |
| showReference                | 是否展示引用区域，用于配合 renderTopSlot 使用                                                                                                                | boolean                                                                                        | true                       |
| showUploadButton             | 是否显示右侧上传按钮，自 2.90.0 支持                                                                                                                         | boolean                                                                                        | true                       |
| round                        | 底部的配置区域和操作区域是否形状是否为全圆角                                                                                                                 | boolean                                                                                        | true                       |
| canSend                      | 是否可以发送，未设置时，根据输入框内容，上传内容，引用内容决定是否可发送                                                                                     | boolean                                                                                        | 由输入内容、附件和引用决定 |
| uploadTipProps               | 上传文件相关提示配置                                                                                                                                         | TooltipProps                                                                                   | -                          |
| generating                   | 是否正在生成中                                                                                                                                               | boolean                                                                                        | false                      |
| renderConfigureArea          | 配置区渲染 callback prop；configure 插槽优先                                                                                                                 | (className?: string) =&gt; VNodeChild                                                          | -                          |
| renderActionArea             | 操作区渲染 callback prop；action 插槽优先                                                                                                                    | (props: ActionAreaProps) =&gt; VNodeChild                                                      | -                          |
| suggestions                  | 建议列表                                                                                                                                                     | Suggestion[]                                                                                   | -                          |
| renderSuggestionItem         | 建议项渲染 callback prop；suggestion 插槽优先                                                                                                                | (props: RenderSuggestionItemProps) =&gt; VNodeChild                                            | —                          |
| skills                       | 技能列表                                                                                                                                                     | Skill[]                                                                                        | -                          |
| skillHotKey                  | 输入框中触发技能的热键                                                                                                                                       | string                                                                                         | -                          |
| templatesStyle               | 模版的样式                                                                                                                                                   | StyleValue                                                                                     | -                          |
| templatesCls                 | 模版的样式类名称                                                                                                                                             | string                                                                                         | -                          |
| renderSkillItem              | 技能项渲染 callback prop；skill 插槽优先                                                                                                                     | (props: RenderSkillItemProps) =&gt; VNodeChild                                                 | —                          |
| renderTemplate               | 模板渲染 callback prop；template 插槽优先                                                                                                                    | ( skill: Skill \| undefined, onTemplateClick: (content: string) =&gt; void, ) =&gt; VNodeChild | -                          |
| showTemplateButton           | 是否展示模板按钮，未设置时，将根据当前选中技能中的 hasTemplate 决定是否展示模版按钮                                                                          | boolean                                                                                        | false                      |
| transformer                  | 自定义 Tiptap 节点转换 callback 映射                                                                                                                         | Map&lt;string, (obj: unknown) =&gt; unknown&gt;                                                | —                          |
| popoverProps                 | 下拉弹出层的配置参数                                                                                                                                         | PopoverProps                                                                                   | -                          |
| sendHotKey                   | 发送输入内容的键盘快捷键，支持 `enter` \| `shift+enter`。前者在单独按下 enter 将发送输入框中的消息， shift 和 enter 按键同时按下时，仅换行，不发送。后者相反 | 'enter' \| 'shift+enter'                                                                       | `enter`                    |
| immediatelyRender            | 兼容 prop；Vue Tiptap 仅在 mounted 后创建编辑器                                                                                                              | boolean                                                                                        | -                          |
| clearContentOnGenerating     | 当 generating 从 false 变为 true 时，是否清空输入框内容和附件。设为 false 可保留输入内容（适用于无限画布等非对话场景） **&gt;=2.94.0**                       | boolean                                                                                        | true                       |

### Configure.Select

同 [ButtonProps](/zh-CN/input/select)

### Configure.Button

同 [ButtonProps](/zh-CN/basic/button#Button)

### Configure.RadioButton

同 [RadioGroupProps](/zh-CN/input/radio#RadioGroup)

### Configure.Mcp

| 属性          | 说明                           | 类型      | 默认值 |
| ------------- | ------------------------------ | --------- | ------ |
| options       | mcp 选项                       | McpOption | -      |
| showConfigure | 是否显示配置按钮, v2.89.0 新增 | boolean   | true   |

## Methods

| 属性                    | 说明                                                          | 类型                             | 默认值 |
| ----------------------- | ------------------------------------------------------------- | -------------------------------- | ------ |
| changeTemplateVisible   | 切换模板弹出层的可见性                                        | (visible: boolean) => void       | -      |
| deleteContent           | 删除富文本中的某一项，删除逻辑依赖的是 content 中的 uniqueKey | (content: Content) => void       | -      |
| deleteUploadFile        | 删除上传文件中的某一项                                        | (item: Attachment) => void       | -      |
| focusEditor             | 聚焦输入框，默认聚焦到输入框的末尾                            | (pos?: string) => void           | -      |
| getEditor               | 获取当前的 tiptap 的 editor 实例                              | () => Editor                     | -      |
| setContent              | 设置输入框内容                                                | (content: TiptapContent) => void | -      |
| setContentWhileSaveTool | 保留技能项的同时设置输入框内容                                | (content: string) => void        | -      |
