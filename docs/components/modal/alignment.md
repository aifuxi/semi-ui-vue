# Modal v2.102.0 对齐矩阵

## 路线与固定证据

- 当前路线：最近完成 `List`；`Modal` 是固定 `vendor/semi-design/content/order.js` 中紧邻其后的公开组件。
- 已就绪依赖：Button、Typography、稳定 Icons、ConfigProvider、默认主题 Token 与 Teleport 测试基础设施均已 ready；Modal 不依赖后续 OverflowList、Popover、SideSheet 或 Table，可独立形成发布与浏览器验收闭环。
- React Adapter：`vendor/semi-design/packages/semi-ui/modal/Modal.tsx`、`ModalContent.tsx`、`ConfirmModal.tsx`、`confirm.tsx` 与 `useModal/`。
- Foundation：`vendor/semi-design/packages/semi-foundation/modal/modalFoundation.ts`、`modalContentFoundation.ts`、`constants.ts` 与 `utils/FocusHandle.ts`。
- 样式：`vendor/semi-design/packages/semi-foundation/modal/modal.scss`、`variables.scss`、`animation.scss`、`rtl.scss` 及 `_portal/portal.scss`，Token 来自固定 `semi-theme-default/scss`。
- 文档与测试：`vendor/semi-design/content/show/modal/index.md`、`index-en-US.md` 与 `packages/semi-ui/modal/__test__/`。

## Vue 组件边界

| 文件                             | 单一职责                                                                                        | 公开边界                                 |
| -------------------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `Modal.vue`                      | 解析公开 props/global/config 优先级，管理 visible、Teleport、body scroll、动效终态与 afterClose | props、emits、slots、v-model:visible     |
| `ModalDialog.vue`                | 渲染 mask/wrap/dialog，管理 ESC、遮罩鼠标状态、焦点陷阱与焦点回归                               | Modal 内部                               |
| `ModalInnerContent.vue`          | 稳定输出 header/body/footer、close/icon/title、尺寸与全屏 DOM                                   | Modal 内部                               |
| `ModalDefaultFooter.vue`         | 渲染 locale 按钮、loading、footerFill 与用户按钮 props                                          | Modal 内部                               |
| `ConfirmModal.vue`               | 实现五类命令式 Modal 的图标、Promise 自动关闭和 confirm DOM                                     | 静态 API/useModal 内部                   |
| `imperative.ts` / `use-modal.ts` | 管理独立 Vue app 或调用方上下文内实例的 create/update/destroy 生命周期                          | `Modal.method`、`destroyAll`、`useModal` |
| `types.ts`                       | 定义 Vue 原生公开 props/emits/slots 与命令式类型                                                | 根入口及 `modal` 子路径                  |
| `modal.js`                       | 私有边界导出固定两个 Foundation 与 FocusTrapHandle                                              | declaration facade + bundled runtime     |

## API、默认值与 Vue 映射

| React v2.102.0                                                     | 默认值         | Vue 公开契约                                                             | 对齐结论                                              |
| ------------------------------------------------------------------ | -------------- | ------------------------------------------------------------------------ | ----------------------------------------------------- |
| `visible`                                                          | `false`        | `visible` + `v-model:visible` / `update:visible`                         | 受控 prop 保留；关闭请求先发 update，再调用 cancel    |
| `mask` / `closable` / `maskClosable`                               | `true`         | 同名 Boolean props                                                       | 缺省、显式 false、显式 true 和全局覆盖分别验证        |
| `motion` / `closeOnEsc` / `hasCancel`                              | `true`         | 同名 Boolean props                                                       | 同上；motion=false 同步进入隐藏终态                   |
| `keepDOM` / `centered` / `maskFixed` / `fullScreen` / `footerFill` | `false`        | 同名 Boolean props                                                       | keepDOM 与 lazyRender 组合覆盖首次和再次显示          |
| `lazyRender`                                                       | `true`         | 同名 Boolean prop                                                        | 仅与 keepDOM 协作；显式 false 可预渲染隐藏 DOM        |
| `size`                                                             | `small`        | `small \| medium \| large \| full-width`                                 | 保留 `.semi-modal-{size}`                             |
| `width` / `height`                                                 | 无             | `string \| number`；number 按 Vue style 转 px                            | fullScreen 覆盖二者                                   |
| `zIndex` / `maskStyle` / `bodyStyle` / `style`                     | `1000` / 无    | 同名；style 落 dialog，zIndex 落 portal                                  | 自定义容器 portal position 为 static                  |
| `title` / `header` / `footer` / `icon` / `closeIcon` / `content`   | 无             | 同名 VNodeChild prop，并提供对应命名 slot；默认 slot 为 body             | slot 优先；显式 null 可移除 header/footer             |
| `okText` / `cancelText`                                            | Locale         | 同名 string；读取 `ConfigProvider.locale.Modal`                          | zh-CN/en-US 与用户 locale 覆盖                        |
| `okType`                                                           | `primary`      | ButtonType                                                               | error 命令式默认 danger，显式 okButtonProps 仍优先    |
| `okButtonProps` / `cancelButtonProps`                              | 无             | Vue Button props 与原生 attrs                                            | cancel 默认 autofocus；用户值覆盖                     |
| `onOk` / `onCancel`                                                | noop           | `@ok` / `@cancel`，返回 Promise 时按钮 pending                           | 同一 target 100ms leading debounce；rejected 保持打开 |
| `afterClose`                                                       | noop           | `@after-close`                                                           | 仅在隐藏动效终态、body/focus 清理后触发一次           |
| `getPopupContainer`                                                | body           | prop → ConfigProvider → body                                             | 稳定自定义容器首次可见时即为 portal 父节点            |
| `modalRender`                                                      | 无             | 同名 `(dialogVNode) => VNodeChild`                                       | 保留函数能力；公开声明只引用 Vue 类型                 |
| `direction`                                                        | ConfigProvider | 显式 prop → ConfigProvider                                               | portal、dialog、confirm 同步 RTL class                |
| `Modal.info/success/error/warning/confirm`                         | -              | 同名静态方法，返回 `{ update, destroy }`                                 | DOM API 只在调用时访问，import SSR-safe               |
| `Modal.destroyAll`                                                 | -              | 同名静态方法                                                             | 关闭所有命令式实例并释放 host/app                     |
| `Modal.useModal`                                                   | React hook     | Vue composable，返回 `[methods, contextHolder]`，holder 作为动态组件渲染 | 保留调用上下文，不创建独立 app                        |

所有默认值继续遵循 `显式 prop > semiGlobal.overrideDefaultProps.Modal > 固定上游默认值`。Boolean prop 必须从当前 VNode 的 camelCase/kebab-case 键判断显式性，不能把 Vue 缺省归一化的 false 当成显式 false。

## DOM、事件、焦点与 ARIA

- Portal 根为 `.semi-portal`；其内顺序为 mask、wrap、dialog。dialog 固定为 `.semi-modal > .semi-modal-content`，header/body/footer class 与 v2.102.0 相同。
- `role="dialog"`、`aria-modal="true"`、`aria-labelledby="semi-modal-title"`、`aria-describedby="semi-modal-body"` 保留；无标题/自定义 header 时不制造可见空 header。
- close、mask、ESC 都走 cancel 顺序：发出 `update:visible(false)`，再调用 `onCancel(event)`；OK 发出 `onOk(event)`，不替受控调用方自动关闭。
- 点击从 dialog 内 mousedown、在 mask mouseup/click 的序列不得误关；只有 wrap 自身 target 且未记录 dialog mousedown 才关闭。
- 打开时记录先前 activeElement，锁定 body（仅 body portal），创建固定 FocusTrapHandle，并优先聚焦用户 autofocus/默认 cancel；Tab/Shift+Tab 循环。关闭终态或卸载时移除 keydown、销毁 trap、恢复焦点和 body 样式。
- `closeOnEsc=false`、`maskClosable=false`、`closable=false` 分别不创建对应关闭路径；缺省/显式值门禁均覆盖。

## Portal、动效、主题、RTL、国际化与 SSR

- 自定义 `getPopupContainer` 必须在首次 visible 时将 `.semi-portal` 放入稳定容器；不得先挂 body 再迁移。自定义容器使用 popup/absolute 语义，`maskFixed=true` 恢复 fixed。
- show content 动画 120ms、mask 90ms；hide 终态由真实 animationend 收敛。`motion=false` 同步隐藏；keepDOM 使用 `.semi-modal-displayNone`。
- 默认主题直接编译固定 Modal + Portal SCSS。light/dark 由 `--semi-color-bg-2`、overlay、text、border、shadow Token 驱动；RTL 保留 `.semi-modal-rtl`、`.semi-modal-confirm-rtl`、`.semi-portal-rtl`。
- 默认视觉矩阵覆盖 desktop `1440×900`、mobile `390×844`、light/dark 与 RTL；交互证据覆盖 open、mask、ESC、focus trap/restore、自定义容器和 Promise loading。
- Locale 默认 zh-CN `确定/取消`，en-US 场景由 ConfigProvider 提供；命令式独立 app 继续要求显式文本或默认 zh-CN，useModal holder 可消费调用方上下文。
- 模块 import 不访问 window/document。SSR visible=false 不输出 portal；SSR visible=true 输出稳定 inline Teleport 内容并可 hydration，客户端挂载后进入目标容器。

## 发布与 deviation

- 根与 `@workspace/ui/modal` 子路径导出 Modal、静态方法、useModal 和全部公开 Vue 类型；`@workspace/theme-default/modal.css` 编译固定样式。
- 真实 tarball 验证 ESM、声明、根/子路径、根 CSS/`modal.css`、tree-shaking、SSR-safe import、许可证与 SPDX SBOM；公开 `.d.ts` 不得出现 `vendor/**` 或私有 workspace Foundation 类型。
- React `children` 映射默认 slot，ReactNode props 同时提供 Vue 命名 slot；React `useModal` 的 ReactNode holder 映射为 Vue 动态组件 holder，能力与上下文语义保留。
- 暂无 accepted deviation；任何浏览器或静态 API 差异必须在完成状态前补录证据与影响。

## 完成证据

- 状态：`ready`。
- Unit/SSR：Modal 聚焦测试 2 个文件、9 个用例通过，覆盖 Boolean/global 优先级、Portal、关闭顺序、Promise loading、keepDOM/lazyRender、焦点陷阱、静态 API、useModal、SSR render 与 hydration；全仓 81 个文件、594 个用例通过。
- Chromium：Modal 来源、交互、desktop/mobile light/dark 与 RTL 共 7 个场景通过；全量 313 个 Chromium 场景通过。6 个不透明节点逐项完成 computed style、`≤0.5 CSS px` 几何与独立字节对照，遮罩透明层单独比较 computed style；正文裁剪的 React/Vue PNG 在全部矩阵直接字节相等。
- 视觉基线：React/Vue 分别保留 desktop/mobile light/dark 与 RTL 裁剪截图，阈值继续为 `threshold ≤ 0.1`、`maxDiffPixelRatio ≤ 0.001`，无 mask。
- 发布：完整 `pnpm check` 通过，包含 vendor/inventory/assets/source-boundary、format、lint、typecheck、unit、全部 workspace build、主题入口、Modal 子路径 SSR import 与真实 tarball 安装/ESM/声明/样式/SBOM consumer 验证。
- Deviation：无 accepted deviation。
