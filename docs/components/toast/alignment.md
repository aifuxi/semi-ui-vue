# Toast v2.102.0 对齐矩阵

## 权威源码

- React 公开入口与命令式容器：`vendor/semi-design/packages/semi-ui/toast/index.tsx`
- 单条 Toast DOM、图标、timer 与 ConfigProvider：`vendor/semi-design/packages/semi-ui/toast/toast.tsx`
- Hook holder：`vendor/semi-design/packages/semi-ui/toast/useToast/index.tsx`、`HookToast.tsx`
- Foundation：`vendor/semi-design/packages/semi-foundation/toast/toastFoundation.ts`、`toastListFoundation.ts`、`constants.ts`
- 样式：`vendor/semi-design/packages/semi-foundation/toast/toast.scss`、`animation.scss`、`rtl.scss`、`variables.scss`
- 中英文文档：`vendor/semi-design/content/feedback/toast/index.md`、`index-en-US.md`

## 组件边界

- `ToastNotice`：渲染单条 `role=alert`，管理自动关闭 timer、hover 暂停、关闭回调和默认/自定义图标。
- `ToastHost`：组合活动项和离场项，维护 enter/leave 动画、stack 折叠与 hover 展开，不拥有公开默认值。
- `ToastStore`：以私有 Foundation Adapter 管理增删改、同 id 更新和离场清理。
- `Toast` / `ToastFactory` / `useToast`：分别提供默认命令式实例、隔离工厂实例和 Vue 上下文 holder。

## API 与 Vue 映射

| React v2.102.0                                        | 默认值 / 行为                                            | Vue 公开契约                                                      |
| ----------------------------------------------------- | -------------------------------------------------------- | ----------------------------------------------------------------- |
| `Toast.info/warning/error/success(options \| string)` | 创建指定 type，返回 id                                   | 同名方法；内容可传字符串或 `ToastOptions`                         |
| `Toast.close(id)`                                     | 单条离场，wrapper 保留                                   | 等价，返回 id 便于组合调用                                        |
| `Toast.destroyAll()`                                  | 所有条目离场并卸载 wrapper                               | 等价，立即清理实例 wrapper 和 timer                               |
| `Toast.config(config)`                                | 修改当前实例默认位置、duration、theme、zIndex、container | 等价；只接受源码实际消费字段                                      |
| `ToastFactory.create(config?)`                        | 创建配置和 wrapper 隔离的新 Toast 类                     | 返回独立的 `ToastStaticMethods` 对象                              |
| `Toast.useToast()`                                    | `[methods, ReactElement]`，holder 就地渲染               | `[methods, Component]`，模板中 `<ContextHolder />`                |
| Hook `open(options)`                                  | type=`default`                                           | `useToast` methods 保留 `open`；静态实例不扩展 `open`             |
| `content`                                             | `''`                                                     | `VNodeChild`；命令式字符串简写保留                                |
| `icon`                                                | 缺省按 type 渲染状态图标                                 | `VNodeChild`；默认图标与 class/size 对齐                          |
| `showClose`                                           | `true`                                                   | 可选 Boolean；必须区分缺省、显式 false/true                       |
| `textMaxWidth`                                        | `450`                                                    | `string \| number`，绑定到文本 `max-width`                        |
| `duration`                                            | `3` 秒，0 不自动关闭                                     | 等价                                                              |
| `theme`                                               | `normal`，另支持 `light`                                 | 等价                                                              |
| `stack`                                               | `false`；同一实例最后一次调用可切换                      | 等价；hover 展开全部 zero-height wrapper                          |
| `direction`                                           | 显式 prop > ConfigProvider > `ltr`                       | hook holder 读取 Vue ConfigProvider；命令式默认 LTR               |
| `id`                                                  | 缺省生成；相同 id 更新                                   | `string \| number` 输入，公开返回值统一为 string                  |
| `motion`                                              | 内部开关，默认 true                                      | 保留在 options 以对齐命令式测试，不作为文档主 API                 |
| `className/style/onClose`                             | 透传单条节点                                             | class 使用 Vue `HTMLAttributes['class']`，style 使用 `StyleValue` |
| `top/right/bottom/left`                               | number 转 px，string 原样                                | 等价；后续调用只更新显式出现的 wrapper offset                     |
| `zIndex`                                              | 默认 1010，仅 wrapper 首次创建时生效                     | 等价                                                              |
| `getPopupContainer`                                   | 首次创建 wrapper 时求值                                  | 等价；`destroyAll` 后的新实例重新求值                             |

默认合并顺序为：单次 options > `semiGlobal.config.overrideDefaultProps.Toast` > 当前 ToastFactory 实例 config > 内置默认值。`info/warning/error/success` 的强制 type 最终优先。

## 状态、事件顺序与生命周期

1. 第一次命令式调用同步创建 `.semi-toast-wrapper` 并直接挂到自定义容器或 `document.body`。
2. 新条目追加到列表；相同 id 合并更新、不新增 DOM，并重启完整 duration timer。
3. duration 为正数时启动 timer；mouseenter 清除，mouseleave 从完整 duration 重新开始。
4. 关闭按钮先阻止冒泡，再从活动列表移入离场列表，随后执行 `onClose`；自动关闭执行相同移除和回调。
5. `motion=false` 直接清理离场节点；有动画时在 `animationend` 或 340ms fallback 后清理。
6. `close` 不卸载 wrapper；`destroyAll` 卸载当前实例 wrapper。不同 `ToastFactory` 实例互不影响。
7. stack 状态取实例最后一次命令式调用值；折叠时条目 wrapper 高度为 0，hover 后以真实高度展开。

## DOM、class、样式与动效

- wrapper：`.semi-toast-wrapper`，fixed、宽 100%、height 0、居中、默认 z-index 1010。
- 内层：`.semi-toast-innerWrapper`，hover 增加 `.semi-toast-innerWrapper-hover`。
- stack 外层：`.semi-toast-zero-height-wrapper`；单条本体 `.semi-toast`。
- 本体状态：`.semi-toast-{type}`、light 时 `.semi-toast-light`、RTL 时 `.semi-toast-rtl`、进入/离开动画 class。
- 内容：`.semi-toast-content`，随后是可选状态图标、`.semi-toast-content-text`、可选 `.semi-toast-close-button` 和现有 Button DOM。
- 每条按列表保留位置写入 `translate3d(0,0,-N*10px)`；进入/离开均为 300ms 上移动画，stack 展开同为 300ms。
- 默认图标为 `IconAlertTriangle/IconTickCircle/IconInfoCircle/IconAlertCircle` large；`default` 无图标。
- 关键样式以固定 SCSS 为准：8px 12px padding、8px margin、3px radius、bold 14px 文本、elevated shadow、light/dark token。

## 键盘、焦点、ARIA、Portal、RTL、国际化与 SSR

- 每条固定 `role="alert"`、`aria-label="{type || default} type"`；close 复用 Button 的原生键盘与焦点契约。
- Toast 不声明 Escape、焦点捕获、焦点归还或 roving focus。
- 自定义容器首次调用必须立即成为 wrapper 父节点；同一实例后续 container/zIndex 不迁移，factory 实例必须隔离。
- RTL 增加 `.semi-toast-rtl`，文本右对齐并交换左右 margin；wrapper 位置仍由 top/right/bottom/left 决定。
- 无 locale 文案，不增加 57 Locale 行为矩阵。
- 根入口和子路径 import 必须 SSR-safe；命令式方法在 SSR 调用时抛出明确错误；空 holder 可 SSR 渲染且不创建 document 或 timer。

## 编码前行为门禁

- `showClose` 缺省、显式 false、显式 true，以及全局覆盖与单次显式优先。
- 四种静态 type、字符串简写、Hook `open`、默认图标/自定义 icon、theme、class/style、textMaxWidth、role/label。
- duration 自动关闭、0 常驻、hover 暂停、mouseleave 重启、更新同 id 内容/type/timer、close 回调仅一次。
- 自定义容器首次父节点、number→px/string offset、首次 zIndex、后续不迁移、destroyAll 后重建。
- `ToastFactory` 默认值和 wrapper 隔离；默认 Toast 与 factory destroyAll 互不影响。
- stack 开关、zero-height DOM、hover 展开高度、离场清理、motion=false。
- 显式 direction、ConfigProvider holder direction 和 RTL DOM/style。
- root/subpath SSR import、空 holder SSR、真实 tarball import/type/style/tree-shaking。
- Chromium desktop/mobile light/dark/RTL：行为、computed style、geometry、裁剪截图独立对照 React。

## Deviation

- React hook 返回 ReactElement；Vue 返回可直接渲染的 `Component`，这是框架原生 holder 映射，不损失上下文能力。
- ReactNode 映射为 Vue `VNodeChild`；React component ref 不进入公开契约。
- 当前无 accepted visual/behavior deviation。

## 验收结论

- 单元与 SSR 覆盖静态 API、Factory 隔离、holder 上下文、默认值优先级、同 id 更新、timer/hover、关闭回调、Portal、stack、RTL、自定义图标和 SSR-safe import。
- Chromium 定向验收覆盖桌面 `1440×900` 与移动 `390×844`、DPR 1、light/dark、RTL、关闭交互、ARIA、关键 computed style 和 bounding rect。
- 18 张 Toast 裁剪基线均由 React/Vue 独立截图生成并通过严格阈值，未使用截图 mask；每个场景还会在同一稳定时刻独立抓取 React/Vue buffer，并以 `Buffer.equals` 验证直接字节相同。
- 根入口、`@aifuxi/semi-ui-vue/toast` 子路径、`@aifuxi/semi-theme-default/toast.css`、声明文件、SSR import 和隔离 tarball 消费均验证通过。
