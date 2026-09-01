# AIChatDialogue 对齐矩阵

## 固定基线与组件边界

- 唯一基线：Semi Design `v2.102.0`，提交 `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- Adapter：`packages/semi-ui/aiChatDialogue/`；Foundation：`packages/semi-foundation/aiChatDialogue/`；主题：`aiChatDialogue.scss` / `variables.scss` / `rtl.scss`；文档：`content/ai/aiChatDialogue/`。
- Vue 组件图：`AIChatDialogue` 负责受控消息、选择和滚动；`AIChatDialogueItem` 负责单条消息布局；`AIChatDialogueContent` 负责 Markdown、多模态、推理、annotation 与 reference；`AIChatDialogueAction` 负责复制、反馈、重置、分享、编辑和删除；`AIChatDialogueHint` 负责建议项；`AIChatDialogueCode` 提供默认代码块渲染。

## API 与 Vue 映射

| React v2.102.0                                               | 默认/语义                                                                          | Vue 3.5 映射                                                                                                                         |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `chats` / `onChatsChange`                                    | 受控消息数组                                                                       | `chats` + `update:chats` / `chats-change`；操作始终创建新数组                                                                        |
| `align`                                                      | `leftRight`                                                                        | 同名 prop：`leftRight` / `leftAlign`                                                                                                 |
| `mode`                                                       | `bubble`                                                                           | 同名 prop：`bubble` / `noBubble` / `userBubble`                                                                                      |
| `escapeHtml`                                                 | `true`                                                                             | 同名 Boolean prop，覆盖缺省、显式 false、显式 true                                                                                   |
| `disabledFileItemClick`                                      | `false`                                                                            | 同名 Boolean prop；仍先触发 `file-click`，再决定是否阻止链接导航                                                                     |
| `selecting`                                                  | `false`                                                                            | 同名 prop；checkbox 变更后发出完整选中 id 列表                                                                                       |
| `showReset`                                                  | `true`                                                                             | 同名 Boolean prop，区分缺省与显式 false                                                                                              |
| `showReference`                                              | `false`                                                                            | 同名 Boolean prop；仅用户文字和文件消息显示引用入口                                                                                  |
| `roleConfig`                                                 | 必填；角色可为 metadata 或按 message.name 索引的 Map                               | 保留数据形状；ReactNode 头像改为 `VNodeChild`                                                                                        |
| `markdownRenderProps`                                        | 透传 MarkdownRender，默认 code renderer 可覆盖                                     | 透传公开 Vue MarkdownRender props；`defaultComponents.code` 暴露 Vue renderer                                                        |
| `messageEditRender`                                          | 编辑用户消息 render prop                                                           | 同名函数 prop及 `#message-edit` scoped slot                                                                                          |
| `dialogueRenderConfig`                                       | avatar/title/content/action/full 五类 render 函数                                  | 保留函数配置并提供对应 scoped slots                                                                                                  |
| `renderDialogueContentItem`                                  | 按 item.type 或工具名嵌套匹配                                                      | 保留映射；`default` 处理字符串消息                                                                                                   |
| `renderHintBox`                                              | 自定义 hint render prop                                                            | 同名函数 prop及 `#hint` scoped slot                                                                                                  |
| callbacks                                                    | annotation/file/image/hint/reference、copy/share/edit/delete/reset/feedback/select | 对应 kebab-case emits；原回调顺序保持 Foundation 语义                                                                                |
| ref methods                                                  | `selectAll`、`deselectAll`、`scrollToBottom`、`scrollToTop`                        | `defineExpose` 同名方法，并提供只读容器元素 getter                                                                                   |
| `AIChatDialogue.Reasoning/Step/Annotation/defaultComponents` | 静态组件与默认 code                                                                | Vue 命名导出 `AIChatDialogueReasoning`、`AIChatDialogueStep`、`AIChatDialogueAnnotation`、`AIChatDialogueCode`；主组件附同名静态属性 |
| data adapters                                                | Chat Completion / Response / AIChatInput 转换                                      | `./ai-chat-dialogue/data-adapter` 子路径及组件入口命名导出                                                                           |

## 状态与事件顺序

- `chats` 是单一真源；内部只缓存选择集合、回到底部可见性和用户滚轮脱离自动跟随状态。
- like/dislike：先发对应 feedback 事件，再发不可变的新 chats；两者互斥并可再次点击取消。
- copy：先发 `message-copy`，再写剪贴板并显示本地化成功提示；非字符串内容按文本项顺序拼接。
- reset：末条消息替换为新 id、`in_progress`、空内容，再发 `chats-change`，最后发 `message-reset`；仅最后一条 assistant 展示。
- edit：先发 `message-edit`，再切换目标消息 editing，同时关闭其他编辑项，不修改调用方原对象。
- delete：确认后先发 `message-delete`，再发过滤后的 chats；share 只发业务事件。
- hint：先追加 user 消息并发 chats 更新，再发 `hint-click`。
- 新消息、最后一条流式内容/状态变化或 hints 增加时，用户未滚轮脱离自动跟随则滚到底部；离底部超过 100px 显示返回按钮。

## DOM、class 与样式

- 保留 `.semi-ai-chat-dialogue`、`-list`、`-wrapper`、`-container`、`-avatar`、`-title`、`-content*`、`-action*`、`-reasoning*`、`-annotation*`、`-references*`、`-reference*`、`-step*`、`-code*`、`-hints`、`-hint*` 与全部状态 class。
- 每条消息结构为 checkbox（选择模式）+ container；container 内为 avatar + inner(title/content/action)。`leftRight` 下 user 使用 `container-right`。
- 三种 mode 只改变内容气泡 class；failed/cancelled 显示错误状态，queued/in_progress/incomplete 且无内容显示三点 loading。
- 主题入口按固定 token/mixin → Button/Checkbox/Avatar/Image/MarkdownRender/CodeHighlight/Chat/Dropdown/Modal/Toast → AIChatDialogue → Icons 编译；根主题和 `ai-chat-dialogue.css` 均包含 dark/RTL 规则。
- Chromium 矩阵固定 DPR 1，desktop `1440×900`、mobile `390×844`，覆盖 light/dark 与 RTL；关键几何每轴差不超过 `0.5 CSS px`。

## 键盘、焦点、ARIA、Portal 与动效

- hint、annotation、reference、reasoning header、复制和操作按钮具备 button 语义、可访问名称与 Enter/Space 激活；checkbox 使用已有公开 Checkbox。
- more 下拉和删除确认复用现有 Dropdown/Modal Portal 契约；outside listener 只在打开时注册，关闭与卸载完整清理。
- 返回底部按钮提供可访问名称；滚动动画为 300ms `easeInOutCubic` 等价实现，测试固定起止状态而不比较中间帧。
- loading 三点动画与 reasoning 展开只在客户端交互；截图前禁用动画。clipboard、wheel、RAF、timer 和 document listener 仅客户端创建并清理。

## 国际化、RTL 与 SSR

- 从 `LocaleProvider.AIChatDialogue` 读取 delete、deleteConfirm、deleteContent、copySuccess、loading、reasoning.completed/thinking、annotationText；缺省继承生成的 zh_CN locale。
- `.semi-rtl` 使用固定 `rtl.scss` 的 wrapper、avatar、content 和 reset 图标方向规则；同场景对照 en-US + RTL。
- SSR import 不读取 window/document/navigator；SSR render 输出消息、附件、hint 与操作区稳定外壳，不创建 Portal、Toast、clipboard 或滚动监听。

## 行为门禁

- 默认 true Boolean：`escapeHtml`、`showReset` 的缺省 / 显式 false / 显式 true；默认 false props 也覆盖显式 true。
- 受控 chats：hint、select/selectAll/deselectAll、like/dislike、reset、edit、delete 的 payload、数组不可变性与事件顺序。
- 内容：字符串/output_text、message/text/refusal、image/file、reasoning、function/custom tool、annotation/reference、failed/cancelled/loading、三 mode、两 align、Map role。
- 自定义：五类 dialogue render、content item 的 default/type/tool-name 三级路径、hint/edit slots 与默认静态 code renderer。
- 滚动：初始底部、流式跟随、wheel 停止跟随、返回底部、公开滚动方法、卸载清理。
- 数据适配：非流式和流式 Chat Completion/Response、ChatInput 双向转换的公开样例与增量状态。
- Chromium：desktop/mobile light/dark + en-US RTL；computed style、geometry、行为、截图与工作台 smoke。
- 发布：根/`./ai-chat-dialogue`/`./ai-chat-dialogue/data-adapter` runtime 与声明、`ai-chat-dialogue.css`、SSR-safe import、tree-shaking、许可证/SBOM 和隔离 tarball consumer。

## Deviation

- React render props 映射为类型化 scoped slots，并保留同名函数 prop；这是 Vue 原生适配。
- React 静态子组件同时提供 Vue 命名导出，避免模板无法自然访问构造函数静态属性。
- 上游 hint 与部分图标入口使用 clickable div；Vue 保留固定 DOM/class，并补齐可聚焦、可访问名称与 Enter/Space 键盘处理。
- Markdown/MDX 中的 React 组件不能跨框架复用；自定义映射接受 Vue 组件或 VNode renderer。
