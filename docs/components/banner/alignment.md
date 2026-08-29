# Banner v2.102.0 对齐矩阵

## 固定源码证据

- React Adapter：`vendor/semi-design/packages/semi-ui/banner/index.tsx`
- Foundation：`vendor/semi-design/packages/semi-foundation/banner/foundation.ts`
- 常量与样式：`vendor/semi-design/packages/semi-foundation/banner/constants.ts`、`banner.scss`、`variables.scss`、`rtl.scss`
- 默认主题：`vendor/semi-design/packages/semi-theme-default/scss/index.scss`、`global.scss`
- 图标：`vendor/semi-design/packages/semi-icons/src/icons/IconClose.tsx`、`IconAlertTriangle.tsx`、`IconInfoCircle.tsx`、`IconTickCircle.tsx`、`IconAlertCircle.tsx`
- 中英文文档：`vendor/semi-design/content/feedback/banner/index.md`、`index-en-US.md`
- 上游测试与场景：`vendor/semi-design/packages/semi-ui/banner/__test__/banner.test.js`、`_story/Demo.tsx`、`_story/banner.stories.tsx`

## 组件边界

- `Banner.vue`：公开 props/emits/slots、固定 DOM/class、默认图标、关闭按钮、ARIA 与 attrs。
- `BannerNodeRenderer.ts`：只负责把 `VNodeChild` prop 或 slot 内容渲染为 Vue 节点，不承载状态。
- `packages/foundation-integration/src/banner.js`：固定 Banner Foundation 的唯一运行时入口；公开构建内联该逻辑且声明不泄漏 `vendor/**`。

## 公开 API 与 Vue 映射

| 维度        | Semi React v2.102.0                                            | Vue 公开契约                                            | 结论                      |
| ----------- | -------------------------------------------------------------- | ------------------------------------------------------- | ------------------------- |
| 类型        | `type?: 'info' \| 'success' \| 'danger' \| 'warning'`          | 同枚举，默认 `info`                                     | 等价                      |
| 布局        | `fullMode?: boolean`，默认 `true`                              | 同名 prop；缺省/显式 `false`/显式 `true` 分别验证       | 等价                      |
| 边框        | `bordered` 只在 `fullMode=false` 时生成 `semi-banner-bordered` | 同名 prop，默认 `false`                                 | 等价                      |
| 标题/描述   | `title`、`description: ReactNode`                              | 同名 `VNodeChild` props，另提供同名 slots               | Vue 原生映射              |
| 图标        | `icon` 缺省按 type 取默认图标；显式 `null` 不渲染图标          | 同名 prop 或 `#icon`；`null` 保留关闭默认图标的特殊语义 | Vue 原生映射              |
| 关闭图标    | `closeIcon` 缺省使用 IconClose；显式 `null` 不渲染关闭按钮     | 同名 prop 或 `#closeIcon`；显式 `null` 不渲染按钮       | Vue 原生映射              |
| 额外内容    | `children`                                                     | 默认 slot                                               | Vue 原生映射              |
| 关闭事件    | `onClose(event)`                                               | `close(event)` emit                                     | Vue 原生事件              |
| class/style | `className`、`style` 作用于根 alert                            | `class`/`className`、`style` 作用于根 alert             | 兼容映射                  |
| data 属性   | Adapter 只通过 `getDataAttr` 透传 `data-*`                     | `data-*` 透传；额外 Vue 原生 attrs 保持在根节点         | Vue 增强，不改变 Semi DOM |

默认值：`type='info'`、`fullMode=true`、`bordered=false`、`closeIcon=undefined`、`icon=undefined`。

## Vue Adapter 风险与门禁

| 风险                           | 本组件结论                                                                                                                                              | 防回归证据                                                                            |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 默认 `true` 的 Boolean prop    | `fullMode` 使用 Vue 原生 Boolean 默认值；显式 `false` 不能被普通 truthiness 覆盖                                                                        | 单元测试同时覆盖缺省、SFC 裸 `full-mode`、`:full-mode="false"` 与 `h()` 的 true/false |
| `VNodeChild` 的 Boolean 归一化 | `icon`/`closeIcon` 的公开类型包含 Boolean，Vue 会把缺省值归一化为 `false`；Adapter 必须通过原始 VNode 的 camelCase/kebab-case 键区分缺省与显式 false    | 单元测试分别覆盖缺省、`false`、`null`、自定义 VNode 和 slot                           |
| slot 与 VNode truthy           | React 对数组（包括空数组与仅含 falsy 节点的数组）仍视为 truthy，而 `null/false/0/''` 不生成 title/description/extra wrapper；Vue slot 存在时优先于 prop | 单元测试覆盖字符串、VNode、空值、数组与 slot 覆盖                                     |
| `icon`/`closeIcon` 的 null     | `icon=null` 移除左图标；`closeIcon=null` 移除整个关闭按钮；两者的缺省值仍生成默认节点                                                                   | 单元测试断言最终 DOM、ARIA 与事件落点                                                 |
| 关闭顺序                       | 固定 Foundation 先 `notifyClose(event)` 再 `setVisible()`                                                                                               | 测试在 close 回调执行时确认 alert 仍存在，随后确认 DOM 被移除且 click 不冒泡          |

## 状态、事件与 Foundation

1. 初始 `visible=true`；组件 setup 时创建固定 `BannerFoundation`，mount 后调用 `init()`。
2. 点击关闭按钮时先停止冒泡，再调用 `foundation.removeBanner(event)`。
3. Foundation 先通知 `close(event)`，再把内部 `visible` 设为 `false`；下一次 Vue 更新移除整个 alert DOM。
4. 卸载时调用 `foundation.destroy()`；Foundation 当前没有额外监听器或计时器，但仍保留完整生命周期边界。
5. Banner 没有受控 visible API；关闭后需要调用方重新挂载组件才能再次显示。

## DOM、样式、键盘与可访问性

| 层级/状态 | 固定契约                                                                                                                     |
| --------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 根节点    | `div.semi-banner.semi-banner-{type}[role=alert]`；full 为 `semi-banner-full`，容器模式为 `semi-banner-in-container`          |
| 边框      | 仅 `!fullMode && bordered` 添加 `semi-banner-bordered`                                                                       |
| 主体      | `semi-banner-content-wrapper > semi-banner-content > icon + content-body`                                                    |
| 标题      | `div.semi-typography.semi-typography-primary.semi-banner-title`，Typography heading 5 语义但 component 为 div                |
| 描述      | `div.semi-typography.semi-typography-primary.semi-banner-description`，Paragraph component 为 div                            |
| 默认图标  | info/warning/danger/success 分别为 InfoCircle/AlertTriangle/AlertCircle/TickCircle，size large，公开 aria-label 与 type 对应 |
| 关闭按钮  | `button.semi-button.semi-banner-close`，borderless/small/tertiary，`aria-label=Close`，Tab 可聚焦，Enter/Space 触发 click    |
| 额外内容  | truthy children 位于 `div.semi-banner-extra[x-semi-prop=children]`                                                           |
| RTL       | `.semi-rtl` 或 `.semi-portal-rtl` 下 direction=rtl，close/icon 的左右 margin 对换                                            |

四种类型背景、文本和可选边框使用固定 `--semi-color-*-light-default`、`--semi-color-*` Token；全屏内容居中，非全屏内容 body 占满剩余宽度，标题与描述相距 2px。

## 暗色、国际化、Portal、动效与 SSR

- light/dark 均由固定默认主题 Token 驱动；组件不读取主题状态。
- Banner 没有 locale 文案；默认关闭按钮沿用固定英文 `Close` aria-label，57 Locale 数据不受影响。
- 没有 Portal、定位或动效；移动端使用同一 DOM/CSS 响应容器宽度。
- SSR import 不访问 DOM；SSR 输出完整 visible alert、默认图标、内容与关闭按钮。Foundation 构造过程不访问 DOM，`init()` 只在客户端 mount 后调用。

## 验证矩阵

- 单元/SSR：四 type、full/container/bordered、布尔 prop 四种 Vue 输入、title/description/extra truthy、slot 覆盖、自定义/空图标、关闭顺序/冒泡/键盘、attrs/class/style、Foundation init/destroy、SSR render/import。
- React/Vue 场景：四种 full banner、带边框容器 banner、无图标/无关闭按钮、自定义图标/关闭图标、额外操作与关闭状态。
- Chromium：同进程固定源码请求、computed style、bounding rect、DOM/class、关闭键盘行为，以及桌面/移动 light/dark/RTL 截图。
- 发布包：根/`banner` 子路径 ESM 与声明、`banner.css`、SSR-safe import、tree-shaking、许可证/SBOM 与真实 tarball 离线安装。

## Deviation

没有已接受差异。真实 React/Vue 对照没有使用 mask；截图阈值门禁通过后，5 组独立 PNG 又通过 `cmp` 字节比较。

## 当前状态

`ready`（2026-08-29）：

- `pnpm check` 通过：固定 vendor/inventory/资产/边界、格式、lint、全部 workspace 类型检查、96 个 Vitest 文件共 699 项测试、全量构建、主题、SSR import 与真实 tarball 离线消费全部通过。
- Banner 定向单元与 SSR 测试 2 个文件共 10 项通过。
- `pnpm test:browser` 完整 Chromium 回归 368 项通过；Banner 覆盖固定源码来源、computed style、bounding rect、ARIA、Space 键关闭，以及 desktop/mobile 的 light/dark 和 RTL。
- 5 组 Banner React/Vue PNG（desktop light/dark、mobile light/dark、RTL）逐对 `cmp` 相等，未共享截图文件名或 buffer。
- 中英文文档、React→Vue 迁移表、根与 `banner` 子路径 ESM/声明、`banner.css`、许可证与 SBOM 均进入真实发布包验证。
