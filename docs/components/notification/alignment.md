# Notification v2.102.0 对齐矩阵

状态：`ready`。基线固定为 Semi Design `v2.102.0` / `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。

## 路线与边界

- Notification 是固定 `vendor/semi-design/content/order.js` 中 Banner 之后的下一项。
- 已就绪依赖：Button/Icon、ConfigProvider、Portal/命令式挂载、默认主题与 Chromium 测试基础设施均已完成；本切片不提前声明 Feedback、Popconfirm、Progress、Skeleton、Spin 或 Toast ready。
- 公开根导出只有 `Notification`；`notice.tsx`、`HookNotice` 与列表容器是内部实现，不新增公开 `NotificationCard`。
- Vue 内部组件图：`NotificationNotice` 负责单条 alert、timer 和关闭事件；`NotificationHost` 负责六个位置、顺序和离场动效；命令式单例负责 wrapper 生命周期；`useNotification` 返回局部 methods 与 context holder。

## 固定源码证据

- React Adapter/公开类型/DOM：`packages/semi-ui/notification/index.tsx`、`notice.tsx`、`useNotification/*`。
- Foundation：`packages/semi-foundation/notification/notificationFoundation.ts`、`notificationListFoundation.ts`、`constants.ts`。
- 主题：`packages/semi-foundation/notification/{notification,variables,animation,rtl}.scss` 与默认主题 tokens。
- 文档/测试：`content/feedback/notification/index*.md`、`packages/semi-ui/notification/__test__/notification.test.js`。

## API、默认值与优先级

| 固定 React API                             | 默认值/行为                                                                                | Vue 对齐                                           |
| ------------------------------------------ | ------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| `open/info/success/warning/error(options)` | 返回 id；语义方法覆盖 `type`                                                               | `Notification` 同名方法                            |
| `close(id)`                                | 标记离场并返回 id                                                                          | 同名方法                                           |
| `destroyAll()`                             | 销毁全部通知和 wrapper                                                                     | 同名方法                                           |
| `config(config)`                           | 仅更新 position/offset/duration/zIndex                                                     | 同名方法；必须在首次 open 前调用                   |
| `useNotification()`                        | `[methods, contextHolder]`                                                                 | 同名 composable，holder 为 Vue `Component`         |
| `duration`                                 | `3` 秒；`0` 不自动关闭                                                                     | 等价                                               |
| `position`                                 | 合并默认始终为 `topRight`；只有 position 真正缺省/undefined 时 RTL fallback 才是 `topLeft` | 等价                                               |
| `showClose`                                | `true`                                                                                     | 等价，显式 `false` 必须隐藏按钮                    |
| `theme`                                    | `normal`；可选 `light`                                                                     | 等价                                               |
| `type`                                     | `default`；语义方法为四种状态                                                              | 等价                                               |
| `content/title/icon`                       | ReactNode                                                                                  | Vue `VNodeChild`；命令式 options 映射              |
| `getPopupContainer`                        | 第一次创建 wrapper 时调用一次                                                              | 稳定容器首次显示就是父节点；后续通知不迁移 wrapper |
| `zIndex`                                   | `1010`，只在首次创建 wrapper 时生效                                                        | 等价                                               |
| `direction`                                | 显式值优先；否则 holder 上下文；静态调用缺省 LTR                                           | 等价                                               |

合并优先级固定为：单次 options > `semiGlobal.config.overrideDefaultProps.Notification` > `Notification.config`/内置默认值。`Notification.config` 类型虽然含 `direction`，固定实现没有消费该字段，因此不把它宣传为方向配置入口。

## 状态、顺序与生命周期

1. 新通知加入对应位置列表头部；不同位置共享首个命令式 wrapper。
2. 相同 id 再次 open 时合并 options，不增加 DOM，并重启自动关闭 timer。
3. hover 清除 timer，mouseleave 重新开始完整 duration。
4. 点击关闭按钮顺序为 `onCloseClick(id)` → 阻止冒泡 → 标记离场 → `onClose()`；自动关闭只执行后两步。
5. 单条 `close` 保留 wrapper；`destroyAll` 立即卸载 wrapper。Hook holder 的关闭不经过命令式 wrapper。
6. 固定 Adapter 没有把 notice 的 `motion` 传给 CSSAnimation；该内部字段不是文档公开能力，Vue 不扩展为新的无动效承诺。

## DOM、class 与样式

- wrapper：`.semi-notification-wrapper`，固定定位，首次 z-index。
- 每个非空位置：`.semi-notification-list[placement=...]`；top/bottom 居中，其余贴角。
- notice：`.semi-notification-notice`、type/theme/RTL/animation 状态 class。
- 内部顺序固定为图标外层、`.semi-notification-notice-inner`、content wrapper、可选 close Button。
- 默认状态图标分别为 `IconAlertTriangle/IconTickCircle/IconInfoCircle/IconAlertCircle` large；`default` 无图标。
- 关键 computed style：最小宽 320px、padding `16px 12px 16px 20px`、margin 20px、3px radius、elevated shadow、300ms placement 动画；light/dark token 与上游 SCSS 相同。

## 可访问性、键盘、Portal、RTL 与 SSR

- notice 固定 `role="alert"`，`aria-labelledby` 指向存在 title 时的标题 id；无 title 时保留上游空引用行为。
- close 使用既有 Button/Icon DOM；没有组件自建 roving focus、Escape 或快捷键契约。
- 稳定 `getPopupContainer` 必须在首次 open 时直接承载 wrapper；只有 `destroyAll` 后的新 wrapper 才重新解析容器。
- RTL notice 增加 `.semi-notification-notice-rtl`。固定静态/hook 默认配置已经写入 `topRight`，所以仅传 direction 仍落在 `topRight`；调用方显式给出 position 时优先，position 为 undefined 时才采用源码中的 RTL `topLeft` fallback。
- 根模块 import 必须 SSR-safe；命令式方法仅浏览器可用并给出明确错误。Hook holder 可 SSR 渲染空节点，不创建 document、timer 或 wrapper。
- Notification 没有 locale 文案，也不增加国际化矩阵。

## 编码前行为门禁

- `showClose` 缺省、显式 false、显式 true，以及全局覆盖/单次显式优先。
- 稳定自定义容器首次 open 父节点、首次 zIndex、后续容器/zIndex 不迁移、destroyAll 后重新解析。
- 六种 position、RTL 默认 `topRight`/undefined fallback `topLeft`/显式位置、offset number→px/string 原样保留。
- 五种 open 方法、同 id 更新/重启 timer、prepend 顺序、hover 暂停、close/destroyAll。
- click/onCloseClick/onClose 的顺序与冒泡、role/label、默认/自定义 icon、theme、class/style。
- root/subpath SSR import、空 hook holder SSR、真实 tarball 的 import/type/style/tree-shaking 验证。
- Chromium desktop/mobile light/dark/RTL：行为、computed style、geometry 和组件裁剪截图均独立对照 React。

## Deviation

- React hook 返回 ReactElement；Vue 返回可直接渲染的 `Component`，这是框架原生 holder 映射，不损失上下文能力。
- ReactNode 改为 Vue `VNodeChild`；callback 名称保留，不增加 slots 或 `v-model`。
- 当前无 accepted visual/behavior deviation。

## 验收结论

- `pnpm check` 通过：98 个测试文件、711 项单元/SSR/基础设施测试，以及全仓构建、主题产物、SSR import 与真实 tarball 消费验证。
- `pnpm test:browser` 通过：375 项 Chromium 测试；Notification 覆盖 desktop/mobile、light/dark、RTL、ARIA、键盘关闭、computed style、几何与组件裁剪截图。
- Notification 的 5 组 React/Vue 基线 PNG 经独立 `cmp` 校验，字节完全一致；对应节点各轴几何差值不超过 `0.5 CSS px`。
