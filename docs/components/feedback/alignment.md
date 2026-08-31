# Feedback 对齐矩阵

状态：`ready`。唯一基线为 Semi Design `v2.102.0` / `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。

## 路线与依赖

- `content/order.js` 在 VideoPlayer 后进入 AIChatInput，但 AIChatInput 需要新的 Tiptap/ProseMirror 富文本运行时、多个自定义 Node/Plugin 与公开依赖；Sidebar 又依赖尚未 ready 的 JsonViewer 和同一富文本链，当前不能独立验收。
- Feedback 是剩余公开根模块中依赖已闭合的一项：TextArea、RadioGroup、CheckboxGroup、Button、Modal、SideSheet、Locale 和默认主题均已 `ready`，且不增加第三方运行时，因此作为本次垂直切片。
- 固定源码证据：`packages/semi-ui/feedback/index.tsx`、`packages/semi-foundation/feedback/{foundation,constants,feedback,variables,rtl}.*`、`content/feedback/feedback/` 与对应 stories。

## 组件边界

| 边界                      | 单一职责                                                   | 状态与副作用                                            |
| ------------------------- | ---------------------------------------------------------- | ------------------------------------------------------- |
| `Feedback.vue`            | 在 Modal/SideSheet 两种容器中编排反馈内容、按钮和公开事件  | 持有当前反馈值与异步确定/取消状态；不复制容器可见性状态 |
| `FeedbackContent.vue`     | 渲染 text/emoji/radio/checkbox/custom 内容并把输入事件上抛 | 无持久状态；props 只读                                  |
| `FeedbackNodeRenderer.ts` | 把 `VNodeChild`/`renderContent` 结果安全放回 Vue 渲染树    | 无状态                                                  |
| Foundation facade         | 隔离固定上游状态机、常量和工具                             | 不泄漏 `vendor/**` 到公开声明/运行时                    |

## API 与 Vue 映射

| React v2.102.0           | 默认值               | Vue 契约                                       | 门禁                                                     |
| ------------------------ | -------------------- | ---------------------------------------------- | -------------------------------------------------------- |
| `mode`                   | `popup`              | `mode="popup                                   | modal"`                                                  | 两种 Portal 容器和默认参数 |
| `type`                   | `emoji`              | `type="text                                    | emoji                                                    | radio                      | checkbox | custom"` | 五种内容、class 与提交禁用 |
| `visible`                | 容器默认 `false`     | `visible` + `v-model:visible`                  | 受控可见性只由父级回写                                   |
| `onValueChange`          | noop                 | `@value-change` / `onValueChange`              | 子控件回调先于总值回调                                   |
| `textAreaProps`          | `{}`                 | `textAreaProps`                                | 用户 placeholder/onChange 覆盖默认值                     |
| `radioGroupProps`        | `{}`                 | `radioGroupProps`                              | 强制 vertical；用户 `direction` 可按上游 spread 顺序覆盖 |
| `checkboxGroupProps`     | `{}`                 | `checkboxGroupProps`                           | 同上；空数组禁用提交                                     |
| `renderContent(content)` | -                    | `renderContent`；推荐 `#content="{ content }"` | 可包裹五类默认内容                                       |
| React `children`         | -                    | `#default`，仅 `type=custom` 作为原始内容      | 不克隆/修改调用方 VNode                                  |
| `footer`                 | falsy 时默认 footer  | `footer` prop / `#footer`                      | popup 自定义 footer；默认按钮顺序取消→提交               |
| `onOk/onCancel`          | noop，可返回 Promise | `onOk/onCancel` 回调 prop                      | pending loading、resolve 清值、reject 保值               |
| Modal/SideSheet props    | 各容器默认值         | 同名透传                                       | 用户显式值按固定 spread 顺序覆盖 Feedback 默认值         |

## 状态、事件与异步顺序

- text：固定 JSX 的 spread 顺序使显式 `textAreaProps.onChange` 覆盖内部 handler；缺省该回调时才写入值并通知 `onValueChange(value)`。这是 v2.102.0 实际 Adapter 行为，不按 Foundation 中未到达的 notify 分支推测。
- emoji：点击写入 `{ emoji }`；只有坏评 `😞` 显示可选原因 TextArea，原因输入先通知 TextArea 回调，再写入 `{ emoji, text }`。
- radio/checkbox：先调用对应 group `onChange`，再写值并通知总 `onValueChange`。
- popup 确定/取消：同步返回时立即清空内部值；Promise pending 时只显示对应按钮 loading，resolve 后清值，reject 后结束 loading 并保留值。容器关闭仍由调用方更新 `visible`。
- modal 确定/取消：把 Promise 原样交给 Modal 的既有异步关闭状态机；只有 resolve 或同步完成时清空值，reject 保持内容和可见状态。
- 内部值不是第二套公开受控值；每次成功操作只复位下一次打开的反馈内容。

## DOM、class、样式与响应式

- Feedback 不增加根 wrapper；类挂在 `.semi-modal` 或 `.semi-sidesheet`：`.semi-feedback` 与 `.semi-feedback-{type}`。固定 React Adapter 的 `cls(..., { className })` 会把 truthy `className` 变成字面 `.className`；Vue 同时接受原生 `class` 作为框架映射。
- emoji 保留 `.semi-feedback-emoji-container`、三个 `.semi-feedback-emoji-item` 和 selected class；默认 36px、24px gap/margin、灰度 hover/selected。
- radio/checkbox 保留对应 container；popup 默认 footer 为 `.semi-feedback-footer`，按钮顺序取消、提交。
- modal 常规宽度 400px；popup text 宽度 600px，其余 400px；popup 固定 bottom、`height=auto`、右 20px、底 50px、12px 圆角。
- light/dark 由已有 Token 和子组件样式驱动；移动端不新增断点，按固定宽度与 viewport 自然裁剪；RTL 沿用 Modal/SideSheet/Radio/Checkbox 的 ConfigProvider 方向和固定 `.semi-rtl` 样式。

## 键盘、焦点、ARIA、Portal 与清理

- Modal/SideSheet 的 Escape、mask、焦点恢复、body scroll、Teleport 和 ARIA 沿用已 ready 容器；Feedback 不新增全局监听器。
- 自定义 `getPopupContainer` 必须在首次可见时就是 Portal 父节点，并在卸载后无残留；同时覆盖 body 默认容器。
- emoji 在固定 Adapter 中是可点击 `span`，没有 role/tabIndex/键盘处理；Vue 不擅自创造不同于基线的键盘状态机。Modal/SideSheet 内的原生按钮、Radio、Checkbox 和 TextArea 保留已有键盘/ARIA 行为。
- popup 默认 `mask=false`、`disableScroll=false`、`canVerticalSetWidth=true`、`placement=bottom`、`height=auto`；调用方显式覆盖仍生效。

## 国际化、SSR 与发布

- 取消/提交文字读取 `locale.Feedback.cancel/submit`；57 个固定 locale 的生成数据继续作为完整性来源，缺失时回退 zh-CN。
- SSR import 不访问 DOM；不可见 Feedback 不输出 Portal。hydration 后打开不得产生 hydration warning。
- 根导出与 `./feedback` 子路径、`feedback.css`、SSR-safe dist、tree-shaking 和真实 tarball consumer 必须通过；公开声明不得出现 `vendor/**` 或私有 Foundation 路径。

## React/Vue 对照场景

- 主视觉：同一场景使用两个独立受控实例覆盖 popup emoji 与 modal radio，避免把动态切换容器当成公开状态；覆盖桌面 `1440×900` / 移动 `390×844`、light/dark、LTR/RTL。
- 行为：emoji 选择与坏评原因、text/radio/checkbox/custom、同步与 Promise 确定/取消、Escape、custom container、footer/button props 覆盖。
- computed style 精确比较关键颜色、filter、font、gap、宽高、圆角和定位；对应节点 bounding rect 各轴差 `<=0.5 CSS px`；截图阈值遵守仓库上限并另做 React/Vue 成对像素比较。

## Deviation

无 accepted deviation。React/Vue 关键 computed style 与几何精确对照，桌面/移动 light/dark 与 RTL 截图均通过仓库阈值和解码像素比较。
