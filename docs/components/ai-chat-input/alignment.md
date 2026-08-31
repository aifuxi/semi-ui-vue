# AIChatInput v2.102.0 对齐矩阵

## 固定证据

- React Adapter：`vendor/semi-design/packages/semi-ui/aiChatInput/`
- Foundation：`vendor/semi-design/packages/semi-foundation/aiChatInput/`
- 主题：`vendor/semi-design/packages/semi-foundation/aiChatInput/aiChatInput.scss`
- 中英文文档：`vendor/semi-design/content/ai/aiChatInput/`
- 行为测试：`vendor/semi-design/packages/semi-ui/aiChatInput/__test__/aiChatInputFoundation.test.js`

固定基线为 Semi Design `v2.102.0`（`cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`）。

## Vue 组件边界

- `AIChatInput.vue`：公开 props/emits/slots/expose、容器状态、发送状态机、建议/技能/模板浮层和附件/引用编排。
- `AIChatInputEditor.vue`：Tiptap 生命周期、默认扩展、自定义 inline slot、IME、粘贴上传、内容转换和 SSR 延迟初始化。
- `AIChatInputConfigure.vue` 与配置项：provider 实例隔离、配置值注册/卸载、Button/Select/RadioButton/Mcp Vue 映射。
- `AIChatInputScroller.vue`：引用与附件横向滚动、滚动按钮可见性和清理。
- `foundation-integration` 私有入口：固定常量、内容转换和文件类型工具；公开声明不泄漏 `vendor/**`。

数据流保持 props down / emits up；Tiptap `Editor` 作为外部身份对象使用 `shallowRef`，不进入 Vue 深层代理。

## 公开 API 与默认值

| React v2.102.0                                                     | Vue 映射                                                                                                                        | 默认值与门禁                                                                      |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `defaultContent`, `placeholder`, `extensions`, `immediatelyRender` | 同名 props；`placeholder` 函数接收 Tiptap editor/node/pos/hasAnchor                                                             | SSR 不创建 editor；挂载后初始化并发出首个内容；`immediatelyRender` 见 deviation   |
| `onContentChange`                                                  | `contentChange(contents)`                                                                                                       | Tiptap JSON 经内置/custom transformer 转换后触发                                  |
| `onMessageSend`                                                    | `messageSend(message)`                                                                                                          | 按内容/附件或显式 `canSend` 决定；发送前关闭全部浮层                              |
| `onFocus/onBlur/onPaste`                                           | `focus/blur/paste` emits                                                                                                        | 粘贴事件先公开通知；文件同时进入 Upload                                           |
| `references`, `renderReference`                                    | prop + `#reference` scoped slot                                                                                                 | 点击/删除分别 `referenceClick/referenceDelete`                                    |
| `uploadProps`, `renderUploadButton`                                | prop + `#uploadButton` scoped slot                                                                                              | 保留文件选择、粘贴上传、beforeRemove/onRemove/onChange 顺序                       |
| `renderTopSlot`, `topSlotPosition`                                 | `#top` scoped slot                                                                                                              | `top/middle/bottom` 三个位置逐项验证                                              |
| `showReference/showUploadFile/showUploadButton`                    | 同名 Boolean props                                                                                                              | 均默认 `true`；覆盖缺省、显式 false、显式 true                                    |
| `round`                                                            | 同名 Boolean prop                                                                                                               | 默认 `true`；最终 class/computed style 门禁                                       |
| `canSend`                                                          | 同名可选 Boolean prop                                                                                                           | 显式值优先；缺省由富文本或附件决定                                                |
| `generating`, `clearContentOnGenerating`, `keepSkillAfterSend`     | 同名 props                                                                                                                      | `clearContentOnGenerating` 默认 `true`；false 不清理；keepSkill 仅保留 skill slot |
| `renderConfigureArea`, `onConfigureChange`                         | `#configure` slot + `configureChange`                                                                                           | `AIChatInputConfigure` 暴露当前 setup                                             |
| `renderActionArea`                                                 | `#action` scoped slot                                                                                                           | 接收按上游顺序排列的 upload/send 默认节点                                         |
| `suggestions`, `renderSuggestionItem`                              | prop + `#suggestion` scoped slot                                                                                                | 点击/键盘选择、active class、外部点击关闭                                         |
| `skills`, `skillHotKey`, `renderSkillItem`                         | prop + `#skill` scoped slot                                                                                                     | 空输入触发、方向键循环、Enter 选择、Backspace/Escape 关闭                         |
| `renderTemplate`, `showTemplateButton`                             | `#template` scoped slot                                                                                                         | `changeTemplateVisible` 与 `templateVisibleChange`                                |
| `dropdownMatchTriggerWidth`, `popoverProps`                        | 同名 props                                                                                                                      | 默认 true；稳定自定义容器首次可见即为 Portal 父节点                               |
| `sendHotKey`                                                       | `'enter' \| 'shift+enter'`                                                                                                      | 默认 `enter`；IME composing 不发送；另一组合创建新段落                            |
| `transformer`                                                      | `Map<string, (obj) => any>`                                                                                                     | custom node 优先使用 transformer                                                  |
| ref methods                                                        | `defineExpose`：`changeTemplateVisible/deleteContent/deleteUploadFile/focusEditor/getEditor/setContent/setContentWhileSaveTool` | 逐项使用公开效果验证                                                              |

Vue render prop 使用 scoped slots；同时保留函数 prop 作为迁移兼容入口。自定义节点由 Vue VNode 直接渲染，不读取或篡改调用方子 VNode props。

## 富文本、内容与事件顺序

- 默认 Tiptap schema 包含 `doc/paragraph/text/hardBreak`、undo/redo、`inputSlot/selectSlot/skillSlot`、placeholder 与状态扩展；调用方 extensions 追加在默认扩展之后。
- `onUpdate` 顺序：识别 skill slot 变化 → 转换 JSON → `contentChange` → 更新本地 content → 重新定位已打开浮层。
- `Suggestion` 选择后设置内容、聚焦、触发 `suggestClick` 并关闭面板；skill 选择后设置 skill slot、触发 `skillChange` 并聚焦。
- 发送顺序：检查 generating/canSend → 读取 references/attachments/inputContents/setup → 关闭浮层 → `messageSend`。
- `generating` 从 false 变 true：默认清空内容和附件；`keepSkillAfterSend=true` 时仅保留 skill slot；显式 `clearContentOnGenerating=false` 完全保留。
- 附件删除顺序：disabled no-op → await `beforeRemove` → `onRemove(file,nextList,item)` → `onUploadChange` → `uploadProps.onChange` → 更新列表。

## DOM / class / 主题

- 保留 `.semi-aiChatInput` 根、`-container`、`-content`、`-editor-content`、`-footer`、`-footer-configure`、`-footer-action` 与 `-round` 状态 class。
- 引用、附件、技能、建议、模板、上传、发送/停止按钮及 Tiptap `.ProseMirror`、`.input-slot`、`.select-slot`、`.skill-slot` 结构保持上游 class。
- 默认主题按固定依赖顺序编译 global/button/select/radio/dropdown/upload/progress/tooltip/popover 与 `aiChatInput.scss`；逐组件入口为 `ai-chat-input.css`。
- computed style 精确比较根边框/背景/radius/padding、编辑区 font/line-height/min-height、footer gap/button geometry，以及 light/dark token。

## 键盘、焦点、ARIA、Portal 与清理

- 富文本区使用真实 `contenteditable`；发送、停止、上传、模板、删除均为可聚焦 button，并提供本地化 `aria-label`。
- 建议/技能浮层使用 `role=listbox`，item 使用 `role=option` 与 `aria-selected`，触发编辑器使用 `aria-controls/aria-expanded`。
- composing 阶段不发送、不改写 inline input slot；compositionend 后清理零宽字符且保留输入。
- 稳定 `getPopupContainer` 在首次打开前解析；Teleport 到该容器，卸载/关闭后移除 document mousedown、ResizeObserver、RAF/timer 与 editor。
- `dropdownMatchTriggerWidth=true`：数字 width、非百分比字符串 width、实际 trigger rect 三条路径；false 不写浮层宽度。

## 主题、RTL、国际化与视觉矩阵

- 桌面 `1440x900` DPR 1：light/dark，默认输入、建议打开、技能/模板、引用与附件、generating。
- 移动 `390x844` DPR 1：窄宽换行、横向滚动、建议面板和 footer。
- RTL：引用/附件/底部按钮/浮层方向与滚动按钮不发生未记录漂移。
- zh-CN/en-US：上传提示、发送/停止、附件状态、MCP 配置文案使用 LocaleProvider `AIChatInput` 文案。
- React/Vue 在同一 BrowserContext 比较 runtime error、computed style、bounding rect 与组件裁剪截图；普通元素使用 document 坐标，Teleport 浮层使用 viewport 坐标。

## SSR、发布与合规

- 模块导入和 SSR render 不访问 `window/document/HTMLElement/EditorView`；Tiptap 只在客户端挂载时创建并在卸载时 destroy。
- 根导出与 `@aifuxi/semi-ui-vue/ai-chat-input` 子路径导出；Tiptap 类型可作为公开第三方类型，但声明不得出现 `vendor/**`、`@workspace/**` 或 `@douyinfe/**`。
- 新增 Tiptap/ProseMirror 运行时依赖同步 package/lockfile、源码边界、许可证/SBOM、SSR 与隔离 tarball consumer；Vue 使用 `@tiptap/vue-3` 对应 React 的 `@tiptap/react` adapter。
- 真实 tarball 验证根/子路径导入、类型、样式、SSR import、编辑/发送以及依赖可解析。

## Deviation

### `immediatelyRender` 在 Vue 中为兼容占位

- 源码证据：固定 React `richTextInput.tsx` 将该值交给 `@tiptap/react` 的 `useEditor`，用于避免 React SSR 立即创建 Editor；`@tiptap/vue-3@3.10.7` 的 `useEditor` 在 `onMounted` 创建实例，并不接受该选项。
- Vue 处理：保留同名公开 prop 和类型，但不把它传给 Vue adapter；SSR 导入与 render 均不创建 EditorView，客户端统一在 mount 后创建。
- 用户影响：服务端安全结果与 `immediatelyRender=false` 等价；在纯客户端传 true/false 不改变首帧编辑器时机。该差异来自 adapter 生命周期，不影响内容、事件、DOM/class 或水合结果，验收为 accepted deviation。
