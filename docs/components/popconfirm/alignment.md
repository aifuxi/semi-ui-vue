# Popconfirm v2.102.0 对齐矩阵

状态：`ready`。基线固定为 Semi Design `v2.102.0` / `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。

## 路线与组件边界

- `feedback` 是 `content/order.js` 的文档分组，不是公开根组件；Notification 之后首个未完成公开组件是 Popconfirm。
- 已就绪依赖：Popover/Tooltip 的 Portal、定位、焦点守卫和 scroll 重定位，Button、Icon、ConfigProvider direction/locale 与默认主题均已完成。
- `Popconfirm.vue` 负责公开 props/emits/slots、受控/非受控显隐、Promise loading、焦点语义及固定 DOM/class；定位与 Portal 委托给公开 `Popover`。
- Foundation 仅经 `packages/foundation-integration` 隔离入口使用；公开类型不泄漏 `vendor/**` 或私有 Foundation 类型。

## 固定源码证据

- React Adapter/公开类型/DOM：`vendor/semi-design/packages/semi-ui/popconfirm/index.tsx`。
- Foundation/常量：`vendor/semi-design/packages/semi-foundation/popconfirm/popconfirmFoundation.ts`、`constants.ts`。
- 样式：`vendor/semi-design/packages/semi-foundation/popconfirm/{popconfirm,variables,rtl}.scss` 与默认主题变量。
- 文档/测试：`vendor/semi-design/content/feedback/popconfirm/index*.md`、`packages/semi-ui/popconfirm/__test__/popconfirm.test.js`、`cypress/e2e/popconfirm.spec.js`。

## 公开 API、默认值与 Vue 映射

| 固定 React API                    | 默认值/行为                                                                                    | Vue 对齐                                                                                   |
| --------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `visible` / `defaultVisible`      | `visible` 显式存在即受控；非受控初值等价于 `Boolean(defaultVisible)`                           | `visible` + `update:visible` 支持 `v-model:visible`，并保留 `defaultVisible`               |
| `disabled`                        | `false`；直接返回 trigger，不创建 Popover                                                      | 同名 prop                                                                                  |
| `trigger`                         | `click`；受控时 Adapter 强制内部 `custom`                                                      | 同名 prop；受控时仅由 `visible` 驱动                                                       |
| `position`                        | LTR `bottomLeft`，RTL `bottomRight`                                                            | 同名 prop；显式值优先                                                                      |
| `title/content/icon`              | ReactNode；默认 icon 为 extra-large AlertTriangle                                              | Vue `VNodeChild` prop，并提供 `#title/#content/#icon`；content slot 暴露 `initialFocusRef` |
| `okText/cancelText`               | locale `confirm/cancel`                                                                        | 同名 prop，显式非空文本优先；缺省读 ConfigProvider locale                                  |
| `okType/cancelType`               | `primary` / `tertiary`                                                                         | 复用 Button 枚举                                                                           |
| `okButtonProps/cancelButtonProps` | 透传 Button，唯独 `autoFocus` 不落 DOM；调用方字段在内部默认后展开，可显式覆盖 loading/onClick | 同名对象并保持相同覆盖顺序；顶层确认/取消动作使用 Vue emits/callback                       |
| `showCloseIcon`                   | `true`                                                                                         | 同名 prop；缺省/显式 false/true 与全局覆盖分别验证                                         |
| `showArrow`                       | 继承 Popover，默认 `false`                                                                     | 同名 prop                                                                                  |
| `motion`                          | 继承 Popover，默认 `true`                                                                      | 同名 prop                                                                                  |
| `stopPropagation`                 | `true`                                                                                         | 同名 prop；浮层卡片 click 额外 stopImmediatePropagation                                    |
| `zIndex`                          | `1030`                                                                                         | 同名 prop                                                                                  |
| `onConfirm/onCancel`              | 同步返回立即关闭；Promise resolve 后关闭，reject 保持打开并结束 loading                        | `confirm/cancel` emit 的 handler 返回值进入相同 Promise 状态机                             |
| `onVisibleChange`                 | 每次显隐请求通知，即使受控                                                                     | `visibleChange` + `update:visible`                                                         |
| `onClickOutSide/onEscKeyDown`     | 继承 Popover 事件                                                                              | `clickOutside` / `escKeydown` emits                                                        |
| `className/style`                 | 作用于 `.semi-popconfirm`，不是 Portal wrapper                                                 | `class/className/style` 保持同落点                                                         |

默认值与全局覆盖优先级：调用方显式 prop > `semiGlobal.config.overrideDefaultProps.Popconfirm` > 固定 Adapter 默认。需要区分缺省与显式值的 Boolean 包括 `disabled`、`showCloseIcon`、`stopPropagation`，并为继承 Popover 的 `showArrow/motion/closeOnEsc/guardFocus/returnFocusOnClose` 保留原始显式性。

## 状态、事件顺序与焦点

1. 非受控打开时先更新 visible，再执行初始焦点选择并通知 `visibleChange/update:visible`；受控模式不改内部源状态，只通知调用方。
2. 取消：先执行 `cancel(event)`；同步结果立即请求关闭，Promise resolve 后请求关闭，reject 只清除 cancel loading。
3. 确认与取消同构，使用独立 confirm/cancel loading；loading 必须落到对应按钮，不能互相阻塞。
4. 初始焦点优先级为可用的 `cancelButtonProps.autoFocus` > 可用的 `okButtonProps.autoFocus`；content 的 `initialFocusRef` 仍由 Popover 焦点守卫处理。
5. 非受控 click 模式关闭时委托 Popover 把焦点恢复到 trigger；显式 `visible` 与 React 基线一样强制 custom trigger，因此不自动恢复；关闭按钮复用 cancel 状态机。
6. 点击卡片内部不触发 outside；点击外部只通知 `clickOutside`，实际 visible 变化由 Popover/受控调用方决定。

## DOM、class 与样式

- Popup wrapper 由 Popover 生成，并追加 `.semi-popconfirm-popover`；无箭头时默认间距 4px，z-index 1030。
- 卡片根为 `.semi-popconfirm[.semi-popconfirm-rtl]`，内部顺序固定为 `inner > header + body? + footer`。
- 有效 icon 包在 `i.semi-popconfirm-header-icon[x-semi-prop=icon]`；只有存在 icon 时 body 增加 `semi-popconfirm-body-withIcon`。
- title/content 分别保留 `x-semi-prop=title/content`；close 为 small/borderless/cancelType Button；footer 顺序 cancel → ok。
- 最大宽度 400px；默认 padding `24px 24px 24px 20px`、footer margin-top 25px、按钮间距 8px；有箭头时 inner padding 收缩 12px。
- RTL 改为默认 `bottomRight`、增加 `semi-popconfirm-rtl`，交换左右 padding、icon/button margin；light/dark 由固定 `--semi-*` Token 驱动。

## Portal、滚动定位、键盘、ARIA、国际化与 SSR

- 稳定 `getPopupContainer` 在首次显示时必须直接成为 Portal 父节点；不为场景挂载时序新增 Observer/轮询。
- Element capture-scroll 与 Document scroll 由本切片直接改变 trigger 几何验证重定位；page scroll、`scrollIntoView`、Node containment 和卸载清理由已就绪的 Tooltip/Popover 回归门禁继续约束。
- trigger 保留 Popover 的 `aria-haspopup=dialog`、`aria-expanded`、Enter/Space/click、Escape 与 focus guard；returnFocus 仅适用于非受控 click 模式；操作按钮使用原生 button 键盘语义。
- locale 从 `ConfigProvider.locale.Popconfirm` 读取；本切片固定验证默认 zh-CN“取消/确定”与注入 en-US“Cancel/Confirm”。完整 57 Locale 数据包不在当前 Popconfirm 切片中虚构，留待独立 Locale 切片补齐。
- 根/子路径 import 必须 SSR-safe；SSR 只输出 trigger，不访问 document、不创建 Portal、不执行焦点或 Promise 状态机；hydration 后可正常打开且无 warning。

## 编码前行为门禁

- 缺省/显式 `false`/显式 `true` 和 global override 优先级，重点覆盖 `showCloseIcon`、`disabled`、`stopPropagation`。
- 非受控/defaultVisible、受控 `visible`、`v-model:visible`、disabled 直接 trigger。
- confirm/cancel 同步、Promise resolve/reject、独立 loading、close button 共用 cancel 链路与事件顺序。
- title/content/icon prop 与 slot、空值、content `initialFocusRef`、中英文 locale、自定义 Button props。
- cancel/ok/content 初始焦点、Escape/操作关闭后的焦点语义、Tab guard、ARIA，并分别覆盖非受控 click 与受控 custom trigger。
- 稳定自定义容器首次 Portal 父节点，Element/Document scroll 后几何更新，卸载清理。
- desktop/mobile light/dark/RTL 的同进程 React/Vue computed style、bounding rect 和裁剪截图。
- root/subpath ESM/声明、`popconfirm.css`、SSR import、tree-shaking、真实 tarball 离线安装与合规扫描。

## Deviation

- React callback props 映射为 Vue emits；Vue 事件监听器的返回值用于 Promise loading/关闭状态机，这是保留 `onConfirm/onCancel` 返回 Promise 能力所需的框架原生映射。
- ReactNode 映射为 `VNodeChild`，render-prop content 映射为 `#content="{ initialFocusRef }"`。
- 当前没有 accepted visual/behavior deviation。

## 验收结果

- `pnpm check`：通过；固定 vendor/inventory、格式、lint、类型、100 个测试文件 / 724 项测试、全 workspace 构建、主题产物、SSR import 和真实 tarball 消费均通过。
- `pnpm test:browser`：382/382 通过；Popconfirm 新增 7 项，覆盖固定源码、DOM/Portal/ARIA/键盘、desktop/mobile × light/dark 与 RTL。
- 5 组 React/Vue Popconfirm 裁剪 PNG（desktop light/dark、mobile light/dark、RTL）均经独立 `cmp` 验证字节完全相等；对应 computed style 精确相等，bounding rect 各轴差值不超过 0.5 CSS px。
- 默认主题产物验证覆盖 86 个根入口、4,248,543 字节 CSS；`popconfirm.css` 根/子路径、ESM 声明与 SSR-safe import 均由真实打包产物验证。
