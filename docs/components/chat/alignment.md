# Chat 对齐矩阵

## 固定基线与组件边界

- 唯一基线：Semi Design `v2.102.0`，提交 `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- Adapter：`packages/semi-ui/chat/`；Foundation：`packages/semi-foundation/chat/`；主题：`chat.scss` / `variables.scss` / `rtl.scss`；文档：`content/plus/chat/`。
- Vue 组件图：`Chat` 负责受控消息、滚动/拖放和公开方法；`ChatContent` 负责消息/分割线列表；`ChatBox` 负责头像、标题、内容、操作区；`ChatInputBox` 负责文本、附件与热键；`ChatHint` 负责建议项；`ChatMarkdownContent` 负责安全 Markdown、代码块和附件内容。

## API 与 Vue 映射

| React v2.102.0                          | 默认/语义                                                             | Vue 3.5 映射                                                                    |
| --------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `chats` / `onChatsChange`               | 受控消息数组                                                          | `chats` + `update:chats` / `chats-change`，不修改调用方数组                     |
| `align`                                 | `leftRight`                                                           | 同名 prop：`leftRight` / `leftAlign`                                            |
| `mode`                                  | `bubble`                                                              | 同名 prop：`bubble` / `noBubble` / `userBubble`                                 |
| `escapeHtml`                            | `true`                                                                | 同名 Boolean prop，区分缺省、显式 false、显式 true 与全局覆盖                   |
| `enableUpload`                          | `true`；对象缺项也为 true                                             | 同名 `boolean                                                                   | { clickUpload; pasteUpload; dragUpload }`，三态门禁 |
| `showStopGenerate` / `showClearContext` | `false`                                                               | 同名 Boolean props                                                              |
| `sendHotKey`                            | `enter`                                                               | `enter` / `shift+enter`；只在匹配组合时阻止默认行为并发送                       |
| `canSend`                               | 未设置时由内容、附件状态及生成状态决定                                | 同名 prop，显式 Boolean 优先                                                    |
| `roleConfig` / `Message` / `Content`    | 角色元数据、字符串或文本/图片/文件内容                                | 保留数据形状，头像 `ReactNode` 改为 `VNodeChild`                                |
| `topSlot` / `bottomSlot`                | ReactNode                                                             | `#top` / `#bottom`，同名 prop 作为迁移兼容备选                                  |
| `renderHintBox`                         | render prop                                                           | `#hint="{ content, index, onHintClick }"`，同名函数 prop兼容                    |
| `renderDivider`                         | render prop                                                           | `#divider="{ message }"`，同名函数 prop兼容                                     |
| `renderInputArea`                       | 整体或细粒度输入区节点                                                | `#input-area` scoped slot，同名函数 prop兼容                                    |
| `chatBoxRenderConfig`                   | title/avatar/content/action/full render functions                     | 保留函数配置，并提供 `chat-box-*` scoped slots                                  |
| callbacks                               | change、send、feedback、copy、delete、reset、clear、stop、hint、input | kebab-case emits；事件顺序保持 Foundation：先业务回调，再受控数组变更（适用时） |
| ref methods                             | `resetMessage`、`scrollToBottom`、`clearContext`、`sendMessage`       | `defineExpose` 同名方法，另暴露 `getContainerElement` 便于 Vue ref 使用         |

## 状态与事件顺序

- props `chats` 是单一真源；发送/提示/清空/反馈/删除/重置都创建新数组，并先按固定 Foundation 的通知顺序发出业务事件与 `chats-change` / `update:chats`。
- 发送后清空文本和附件；`canSend` 显式值优先，否则空输入、非 success 附件或生成中禁止发送。
- 最后一条消息为 `loading` / `incomplete` 且 `showStopGenerate=true` 时隐藏回到底部按钮、显示停止按钮并禁用发送。
- 新消息、最后消息流式变化或 hints 增加时，若用户没有用滚轮脱离自动跟随，则立即滚到底部；用户滚离底部超过 100px 时显示回到底部按钮。
- 清除上下文在末尾追加 `role=divider` 消息；末项已为 divider 时不重复追加。
- 删除确认打开时操作区保持可见；确认顺序为 `message-delete` 后新消息数组；复制先发 `message-copy`，再写剪贴板与提示。
- 输入变化 payload 对齐 Foundation 的 `{ inputValue, attachment }`，文档中的 `{ value }` 是固定版本文档/实现不一致，Vue 以运行时实现为准并在迁移文档说明。

## DOM、class 与样式

- 保留 `.semi-chat`、`-inner`、`-content`、`-container`、`-action`、`-chatBox*`、`-inputBox*`、`-attachment*`、`-hints`、`-hint*`、`-divider`、`-dropArea`。
- Chat 根为纵向 flex；content 是可滚动区域；消息由 avatar + wrap(title/content/action) 构成。`leftRight` 下 user 使用 `chatBox-right`；连续同角色隐藏后续头像。
- mode 只改变内容气泡 class，不改变数据；错误、loading、user bubble 使用固定状态 class。
- 主题入口按全局 token/mixin → Button/Input/Upload/Tooltip/Avatar/Divider/Progress/CodeHighlight → Chat Foundation SCSS → Icons 编译；根主题和 `chat.css` 都必须包含固定选择器及 dark token。
- 浏览器矩阵固定 DPR 1，desktop `1440×900`、mobile `390×844`，覆盖 light/dark 与 RTL；关键 geometry 每轴差不超过 `0.5 CSS px`。

## 键盘、焦点、ARIA、Portal、动效

- textarea 保留原生焦点与多行语义；Enter/Shift+Enter 按 `sendHotKey` 分流；disabled 发送按钮不可触发。
- hint 使用原生 button 语义并可用 Enter/Space；上游 clickable div 无键盘语义，Vue 的语义增强不改变 `.semi-chat-hint-item` 样式 class。
- 每个图标按钮提供本地化 `aria-label`；删除确认使用已有 Popconfirm 的键盘/Portal 契约，弹层容器沿用稳定的消息 wrap。
- 回到底部使用 300ms `easeInOutCubic` 等价动画；测试只固定起止状态，不比较中间帧。loading 三点动画在截图前禁用。
- clipboard、ResizeObserver、requestAnimationFrame、wheel/drag 和 Portal 只在客户端生命周期/交互中创建并完整清理。

## 国际化、RTL、SSR

- 从 `LocaleProvider.Chat` 读取 deleteConfirm、clearContext、copySuccess、stop、copy、copied、dropAreaText；缺省继承 zh_CN。
- `semi-rtl` 下由固定 `rtl.scss` 翻转 hint、发送箭头和 reset 图标；React/Vue 场景在相同 ConfigProvider direction 下比较。
- SSR import 不访问 window/document/navigator；SSR render 输出消息、hint、textarea 与按钮稳定外壳，不创建 Toast、Observer、上传 input 点击或滚动监听。

## 行为门禁

- `escapeHtml` 与 `enableUpload`：缺省 / 显式 false / 显式 true；对象模式覆盖三种上传入口。
- 受控 chats：发送文本与附件转换、hint、clear、delete、like/dislike、reset 的 payload、数组不可变性和事件顺序。
- 输入：empty/success/uploading/canSend、Enter/Shift+Enter、粘贴文件、点击上传、附件删除、生成中禁用。
- 渲染：三种 mode、两种 align、连续角色、四种 status、divider、文本/图片/文件、HTML 转义、五类 render config 与 scoped slots。
- 滚动/拖放：初始底部、流式跟随、滚轮停止跟随、返回底部、resize、drop overlay、卸载清理。
- Chromium：desktop/mobile light/dark + en-US RTL；computed style、geometry、截图与工作台 smoke。
- 发布：根/`./chat` runtime 和声明、`chat.css`、SSR-safe import、tree-shaking、许可证/SBOM 与隔离 tarball consumer。

## Deviation

- React render props 映射为类型化 scoped slots，并保留同名函数 prop；这是框架原生适配。
- React `RefObject` 上传入口映射为 Vue 内部 template ref，公开方法通过组件 ref 暴露。
- hint 的 clickable div 改为原生 button，以补足键盘和可访问名称；保留固定 class、视觉和点击 payload。
- Chat 内部 Markdown 使用与后续公开 `MarkdownRender` 相同的 `markdown-it` 解析内核；`customMarkDownComponents` 在 Vue 中接受标签到 Vue 组件的映射，并可由 `chat-box-content` slot 完全替代。MDX 中的 React JSX 组件实例不能跨框架直接复用。
- 固定 React 基线在 `escapeHtml=false` 时允许 Markdown 渲染器解释原始 HTML；Vue 不使用 `v-html`，因此所有消息 HTML 仍显示为文本。该安全 deviation 避免未经清洗的消息执行脚本；可信富内容需经业务层清洗后由 `chat-box-content` slot 渲染。
