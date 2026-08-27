# Tooltip v2.102.0 对齐矩阵

## 固定源码证据

- React Adapter：`vendor/semi-design/packages/semi-ui/tooltip/index.tsx`、`TriangleArrow.tsx`、`TriangleArrowVertical.tsx`
- Portal 与动效 Adapter：`vendor/semi-design/packages/semi-ui/_portal/index.tsx`、`_cssAnimation/index.tsx`
- Foundation：`vendor/semi-design/packages/semi-foundation/tooltip/foundation.ts`
- 常量与样式：`vendor/semi-design/packages/semi-foundation/tooltip/constants.ts`、`tooltip.scss`、`variables.scss`、`arrow.scss`、`animation.scss`、`rtl.scss`、`semi-foundation/_portal/portal.scss`
- 默认主题：`vendor/semi-design/packages/semi-theme-default/scss/index.scss`、`global.scss`、`animation.scss`
- 中英文文档：`vendor/semi-design/content/show/tooltip/index.md`、`index-en-US.md`
- 上游测试：`vendor/semi-design/packages/semi-ui/tooltip/__test__/tooltip.test.js`、`vendor/semi-design/cypress/e2e/tooltip.spec.js`

## 组件边界

- `Tooltip.vue`：公开 props/emits/slots、受控 visible 同步、Foundation 生命周期和公开 `focusTrigger`/`rePosition`/`getPopupId` 方法。
- `use-tooltip-foundation.ts`：固定 Tooltip Foundation 的唯一 Vue Adapter，集中管理 window 事件、延迟、ResizeObserver、容器测量、定位回调和完整清理。
- `TooltipTriggerRenderer.ts`：克隆单个 Vue VNode 并合并触发事件、ref 与 ARIA；文本、多节点、disabled/loading 节点按固定 Adapter 规则包裹 span。
- `TooltipPortal.vue`：只负责 Teleport、`.semi-portal`/`.semi-portal-inner`、弹层 wrapper、动效事件和内容 slot。
- `TooltipArrow.vue`、`TooltipNodeRenderer.ts`：分别隔离固定箭头 SVG 与 VNodeChild prop 渲染。
- `packages/foundation-integration/src/tooltip.js`：公开组件访问固定 Tooltip Foundation 的唯一入口；构建后内联且不泄漏 vendor/私有路径。

## 公开 API 与 Vue 映射

| 维度      | Semi React v2.102.0                                                    | Vue 公开契约                                                       | 结论                           |
| --------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------ |
| 触发元素  | 单个 `children`，非元素/多节点/特殊状态自动包 span                     | 默认 slot；单 VNode 原位克隆，其余按相同规则包 span                | Vue 原生映射                   |
| 内容      | `content: ReactNode \| RenderContent`                                  | `content: VNodeChild` 或 `#content="{ initialFocusRef }"`          | render prop 映射为 scoped slot |
| 可见状态  | `visible`；`onVisibleChange` 通知                                      | `visible`；`visibleChange` 与 `update:visible`                     | 增加原生 `v-model:visible`     |
| trigger   | `hover/focus/click/custom/contextMenu`，默认 `hover`                   | 同枚举与默认值                                                     | 等价                           |
| placement | 12 个公开方位加 4 个 `*Over` 方位                                      | 同 16 个枚举值，默认 `top`                                         | 等价                           |
| 延迟      | enter/leave 均 `50ms`                                                  | 同毫秒值和取消顺序                                                 | 等价                           |
| 定位      | spacing、margin、arrow bounding、容器滚动、viewport/container overflow | 同名 props；复用固定 Foundation 计算                               | 等价                           |
| Portal    | prop → ConfigProvider → body；独立 `.semi-portal` 节点                 | 同优先级，Vue `Teleport` 挂载独立容器节点                          | 框架原生映射                   |
| 箭头      | `showArrow: boolean \| ReactNode`                                      | `showArrow: boolean \| VNodeChild`，另有 `#arrow`                  | 框架原生映射                   |
| 样式      | `className/style` 作用于弹层，`wrapperClassName` 作用于特殊触发器 span | `class/style` 作为明确 props 作用于弹层；`wrapperClassName` 同语义 | 避免 Vue attrs 错落到触发器    |
| 回调      | `onClickOutSide`、`onEscKeyDown`、`afterClose`                         | `clickOutside`、`escKeydown`、`afterClose` emits                   | Vue 事件映射                   |
| 方法      | `focusTrigger()`、`rePosition()`、`getPopupId()`                       | `defineExpose` 同名方法                                            | 等价                           |
| 全局默认  | `semiGlobal.config.overrideDefaultProps.Tooltip`                       | 同名单例键在显式 prop 缺省时参与默认解析                           | 等价                           |

默认值：`autoAdjustOverflow=true`、`arrowPointAtCenter=true`、`condition=true`、`motion=true`、`position='top'`、`prefixCls='semi-tooltip'`、`role='tooltip'`、`spacing=8`、`margin=0`、`showArrow=true`、`transformFromCenter=true`、`wrapWhenSpecial=true`、`zIndex=1060`、`closeOnEsc=false`、`guardFocus=false`、`returnFocusOnClose=false`、`disableFocusListener=false`、`disableArrowKeyDown=false`、`keepDOM=false`。

## Vue Adapter 风险记录

| 风险                        | 本组件结论                                                                                                                                                     | 防回归证据                                                                                                                                 |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 默认 `true` 的 Boolean prop | Vue 归一化后的 `props` 不能单独区分缺省与显式 `false`；`Tooltip.vue` 依据原始 VNode 的 camelCase/kebab-case 键解析“显式 prop → `semiGlobal` 覆盖 → 上游默认值” | 单元测试覆盖默认箭头/触发行为和显式关闭；Chromium 验证最终 Portal DOM、箭头与 placement                                                    |
| 子 VNode 裸 Boolean         | SFC `<Button disabled>` 的 VNode 值可能是空字符串，不能使用 `Boolean(value)`；`TooltipTriggerRenderer` 以“键存在且值不为显式 `false`”判断 disabled/loading     | 同一单测同时使用模板裸 `disabled` 与 `h(Button, { disabled: true })`，并断言 span、cursor 与 pointer-events                                |
| 自定义 Portal 容器时序      | Vue 子组件 mount 时父模板 ref 可能尚不可用；本对照场景只承诺稳定容器，因此在 `host` ref 可用后才挂载 Tooltip，不把场景兜底到 body 误当成组件缺陷               | Vue 场景的 `v-if="host"` 与 ConfigProvider 自定义容器单测共同确认首次 Portal 父节点；没有为未承诺的动态容器引入额外 Observer               |
| capture scroll 目标         | 上游 containment 语义允许 `Document`；Adapter 接受任意适用 `Node`，Element 读取自身滚动量，Document 读取文档滚动节点                                           | Chromium 移动矩阵以 `scrollIntoViewIfNeeded()` 触发实际页面滚动后继续比较 React/Vue 裁剪截图与像素；卸载路径清理 capture listener 和 timer |

这些规则只在对应契约存在时应用；不能把对照场景的 ref 时序问题泛化成组件必须支持动态容器，也不能用新增 Observer 掩盖尚未定位的生命周期差异。

## 状态与事件顺序

1. mount 时生成/采用 popup id，注册 trigger 与 resize 监听；只有 `visible=true` 才开始插入 Portal。
2. show 先清理延迟计时器并离屏插入 `.semi-portal-inner`（`left/top=-9999`），真实宽高就绪后计算 placement。
3. 定位完成后设置 `x-placement`、left/top/transform/transform-origin，再进入 visible 状态并依次发出 `visibleChange(true)`、`update:visible(true)`。
4. hover/focus 使用 50ms enter/leave 延迟；移入弹层会取消 leave，`clickToHide` 可在内部点击后直接关闭。
5. click/contextMenu 在显示期间监听 window mousedown；trigger 与 portal 内部不算 outside，关闭时注销。
6. hide 先进入 leave；100ms 动画结束后移除 Portal，或在 `keepDOM=true` 时保留 DOM 并 `display:none`，随后发出 `afterClose`。
7. `visible` 外部变化：hover/focus 仍走延迟，其它 trigger 立即 show/hide；`rePosKey` 变化立即重新定位。

## DOM、样式、键盘与可访问性

| 层级/状态        | 固定契约                                                                                                                         |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Portal 容器      | 自建 `div.semi-portal`（RTL 为 `.semi-portal-rtl`），`position:absolute;width:100%`，style z-index 默认 1060                     |
| 定位节点         | `div.semi-portal-inner[tabindex=-1]`，absolute、透明背景、`min-width:max-content`                                                |
| 弹层             | `div.semi-tooltip-wrapper[role=tooltip][x-placement][id]`；visible 追加 `-wrapper-show`，箭头追加 `-with-arrow`，RTL 追加 `-rtl` |
| 内容             | `div.semi-tooltip-content`；默认 max-width 240px、14px/20px、12px×8px padding、medium radius                                     |
| 箭头             | 上下方位为 24×7 SVG，左右方位为 7×24 SVG；placement 决定旋转和定位                                                               |
| trigger ARIA     | role tooltip 时为 `aria-describedby=id`、`data-popupid=id`；role dialog 时为 expanded/haspopup/controls                          |
| trigger tabindex | 固定 Adapter 在缺省时补 `tabindex=0`；保留调用方显式值                                                                           |
| disabled/loading | 子节点 pointer-events none，外层 span 承担触发；disabled span cursor not-allowed                                                 |
| 动效             | `semi-tooltip-animation-show/hide`，zoom 0.8↔1 与 opacity，进入/离开均 100ms cubic-bezier(0.215,0.61,0.355,1)                    |

Escape 在 `closeOnEsc=true` 时关闭并通知；ArrowDown/ArrowUp 将焦点移动到弹层首/末可聚焦元素；`guardFocus=true` 时 Tab/Shift+Tab 在弹层内部循环。`initialFocusRef` 在显示完成后聚焦，`preventScroll` 透传给 focus。`returnFocusOnClose` 仅对非 custom trigger 生效。所有全局事件、timer、RAF 与 ResizeObserver 在关闭/卸载时清理。

## 主题、暗色、RTL、国际化与 SSR

- 独立 `tooltip.css` 编译顺序为默认主题 index → global → animation → `_portal` → Tooltip SCSS；light/dark 颜色均来自固定 `--semi-*` Token。
- RTL 同时保留 `.semi-portal-rtl` 与 `.semi-tooltip-rtl`，内容 direction、padding 和箭头/定位属性与固定 SCSS 一致。
- Tooltip 本身无 locale 文案；仍消费 ConfigProvider 的 direction、getPopupContainer 和 `semiGlobal` 默认配置。57 Locale 数据不因本切片改变。
- SSR import 不访问 DOM；SSR 只渲染 trigger，显式 `wrapperId` 可稳定输出 ARIA。Teleport、容器创建、Foundation、Observer 和 window 监听均只在客户端 mount 后创建。

## 验证矩阵

- 单元/SSR：默认值、VNode/文本/多节点/disabled 包裹、五 trigger、延迟与 condition、custom visible、outside/clickToHide、ARIA、focus guard/Escape、keepDOM/afterClose、容器优先级、公开方法与 SSR import/render。
- React/Vue 场景：top/right/bottom/left、edge placement、hover/click/focus/contextMenu/custom、无箭头、自定义样式、disabled trigger、RTL 和自定义容器。
- Chromium：固定源码请求、真实 Portal、computed style/几何、placement 与箭头、hover bridge、click outside、focus/Escape、overflow flip、resize/rePosKey、桌面/移动 light/dark 与 RTL 截图。
- 发布包：根/`tooltip` 子路径 ESM 与声明、`tooltip.css`、SSR-safe import、tree-shaking 与真实 tarball 离线安装。

## React → Vue 迁移

| React                                          | Vue                                                       |
| ---------------------------------------------- | --------------------------------------------------------- |
| `<Tooltip content="说明"><Button /></Tooltip>` | `<Tooltip content="说明"><Button /></Tooltip>`            |
| `visible={open} onVisibleChange={setOpen}`     | `v-model:visible="open"`                                  |
| `content={({ initialFocusRef }) => ...}`       | `<template #content="{ initialFocusRef }">...</template>` |
| `showArrow={<CustomArrow />}`                  | `<template #arrow><CustomArrow /></template>`             |
| `onClickOutSide={handler}`                     | `@click-outside="handler"`                                |
| `onEscKeyDown={handler}`                       | `@esc-keydown="handler"`                                  |
| `className` / `style`                          | `class` / `style`（均作用于弹层）                         |

## 验收结果

- 组件单测 11 项通过，直接覆盖 SSR render/hydration、五种 trigger、延迟、Portal、受控状态、outside、Escape、focus guard、特殊节点包裹、自定义箭头、dialog ARIA 与公开实例方法。
- React/Vue 固定 Chromium 专项 7 项通过：8 个目标的 computed style、几何和逐节点截图一致；桌面/移动 light/dark 与 RTL 共 5 组场景截图字节一致。
- 全仓 155 项 Vitest、85 项 Chromium、格式、lint、全部 workspace 类型检查、vendor/inventory/icons/source-boundary 均通过。
- 根/`tooltip` ESM 与声明、`tooltip.css`、SSR-safe import、主题顺序、许可证/SBOM 和真实 tarball 离线安装均通过。

当前没有 accepted deviation，Tooltip 状态为 `ready`。
