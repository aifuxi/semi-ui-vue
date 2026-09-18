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

- 根与 `@aifuxi/semi-ui-vue/modal` 子路径的 default/named `Modal` 导出、confirm/info/success/error/warning/destroyAll 静态方法、`useModal`、`MODAL_*` 枚举和全部公开 Vue 类型均由单元用例从 `./index` 固定；`@aifuxi/semi-theme-default/modal.css` 编译固定样式。
- 静态文档：仓库内 [index.md](./index.md)、[index.en-US.md](./index.en-US.md) 与 [react-to-vue.md](./react-to-vue.md) 覆盖 props/slots/events、命令式 API、Portal/遮罩/滚动、焦点陷阱/ARIA、主题/RTL/SSR 与 React→Vue 映射；`coverage.md` 保留退役站点的历史映射。
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

## ConfigProvider 命令式反馈续验

根据固定 `Modal.tsx:377` 与 `_cssAnimation/index.tsx`，mask/content 使用独立动画结束状态；各自 animationend 后清除入场 class，motion 或 visible 变化时重新启动。新增分别结束两层动画、关闭回调只触发一次及重开的公开 DOM 测试，另用真实 Chromium 检查终态 transform/class。

## Feedback 文档运行修复（2026-09-07）

- SSR Portal 完成退出动画后重开，slot/default footer 不得复用带有已卸载 DOM 的 VNode。内容获取改为渲染期求值，保持组件状态、DOM、公开 API 与动效不变。
- 动态添加 `footer: null` 必须隐藏默认按钮，移除该 prop 后恢复；raw prop 存在性在每次 footer 渲染时判断，不缓存非响应式的 VNode props 集合。
- Feedback 单元与 SSR 回归覆盖失败前/修复后的两条路径；Modal/SideSheet/Feedback 共 30 项单元/SSR、直接消费者 39 项与三组件 15 项 Chromium 对照通过，真实发布包和 SSR import 通过。

## 文档 Draggable 对齐修复（2026-09-13）

固定 `ModalContent.tsx:getDialogElement` 将 `modalRender` 作用于带 `role="dialog"` 的 `.semi-modal-content`，外层 `.semi-modal` 继续负责尺寸与定位。原 Vue 将整个 `ModalInnerContent` 包装，导致 DragMove 的 ref/$el 落到外层，首次打开出现外层 cursor=move（基线 auto），拖动对象也错误。

现将渲染回调传入 ModalInnerContent，在外层内用无新增 DOM 的 ModalContentRenderer 包装单个内容 VNode；默认返回原内容节点，保留原模板 ref、事件与 SSR 语义。DragMove 的定位、cursor 和事件只作用于内容节点。新增公开 DOM/回调测试先红后绿，断言外层尺寸保留、内容被包装及 DragMove 生效、取消 update:visible 和卸载；原 Modal Unit/SSR 全部通过。文档矩阵改对内容节点断言拖动位移，保留外层 Portal 绝对几何与 cursor 比较。正式 Chromium 证据由本轮调度生成，历史数字不用于证明本次输入。

2026-09-17 补充修复：数字 `width`/`height` 在 `.semi-modal` 外层显式转换为 CSS `px`，字符串尺寸（如 `40vw`、`50%`）继续原样保留；公开回归覆盖数字与字符串路径。该修复不改变 `modalRender` 作用边界、默认尺寸、fullScreen 覆盖或 Portal 结构。

同轮 diagnostic-17 的 Imperative 第六个自定义 IconSend 发现 24px→16px 及蓝色→正文色差异。固定 ConfirmModal 对 elementType=Icon 的自定义节点 cloneElement，覆盖 size=extra-large 与两项 Modal 图标 className；Vue 原直接返回自定义 icon。现复用 isSemiIcon，只克隆 Semi Icon 并覆盖 size/class，保留原 VNode、其他 props 和普通节点/null。Vue cloneVNode 的 class 合并与 React 覆盖不同，故只替换克隆的 class props。公开回归先红后绿，覆盖传入 small/custom class 仍被覆盖、原 VNode 不修改、update 为普通 span 或 null 保持对应内容。Modal Unit/SSR 最终 11 项通过；不在 Demo 添加 size/class 绕过组件契约。
