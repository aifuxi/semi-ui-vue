# Avatar v2.102.0 对齐矩阵

## 路线与固定证据

- 当前路线：最近完成 Tree；Avatar 是固定 `vendor/semi-design/content/order.js` 中紧邻其后的公开组件。
- 固定基线：`vendor/semi-design` tag `v2.102.0`，提交 `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- Adapter、公开类型与 DOM：`packages/semi-ui/avatar/index.tsx`、`avatarGroup.tsx`、`interface.ts`、`TopSlotSvg.tsx`。
- 状态机、常量、样式与 RTL：`packages/semi-foundation/avatar/foundation.ts`、`constants.ts`、`avatar.scss`、`animation.scss`、`rtl.scss`。
- 默认主题与 Token：`packages/semi-theme-default/scss/index.scss`、`global.scss`、`animation.scss`。
- 文档与行为证据：`content/show/avatar/index.md`、`index-en-US.md`、`packages/semi-ui/avatar/__test__/`、`cypress/e2e/avatar.spec.js`。
- Avatar 仅依赖既有主题与浏览器测量能力，不依赖后续 Badge、Popover 或 Image 公共组件，因此可以独立形成可发布、可验证的垂直切片。

## Vue 组件边界

| 模块             | 单一职责                                                         | 公开边界                              |
| ---------------- | ---------------------------------------------------------------- | ------------------------------------- |
| `Avatar.vue`     | 渲染文字/图片头像，管理缩放、失败回退、hover、焦点与装饰层       | props、emits、slots、原生 attrs       |
| `AvatarGroup.ts` | 收集直接 Avatar VNode，应用 Group 尺寸/形状/层叠并生成 more 节点 | props、`#more` scoped slot、默认 slot |
| `TopSlotSvg.vue` | 生成每实例唯一渐变 ID 的顶部直播装饰 SVG                         | Avatar 内部                           |
| `types.ts`       | 定义 Vue 原生 Avatar/Group 公开类型与 React→Vue 适配类型         | 根入口与 `avatar` 子路径导出          |
| `avatar.js`      | 私有边界导出固定 Avatar Foundation                               | declaration facade + bundled runtime  |

## Avatar API、默认值与 Vue 映射

| Semi React v2.102.0                  | 默认值   | Vue 契约                                                                            | 对齐门禁                                                   |
| ------------------------------------ | -------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `size`                               | `medium` | 七个预设字符串或任意 CSS 长度字符串                                                 | 全尺寸、任意长度、Group 覆盖、computed width/height        |
| `shape`                              | `circle` | `circle \| square`                                                                  | 根 class、圆角、装饰边框                                   |
| `color`                              | `grey`   | 固定 17 色联合类型                                                                  | 图片成功时隐藏色 class；失败后恢复                         |
| `children`                           | 无       | 默认 slot；字符串进入自适应缩放路径，其它 VNode 原样渲染                            | 文本/图标/VNode、动态文本、`gap` 测量                      |
| `src` / `srcSet` / `alt` / `imgAttr` | 无       | 同名 props；`imgAttr` 为原生 img attrs，组件 class 与事件按上游优先级合并           | 成功、error/abort、src 更新、alt、原生属性                 |
| `onError`                            | 无       | `error(event)` emit；返回 `false` 的兼容回调 prop 可阻止默认 fallback               | 默认回退、阻止回退、事件顺序                               |
| `onClick` / mouse enter/leave        | noop     | `click`、`mouseenter`、`mouseleave` emits；可点击由显式 click listener/兼容回调判定 | 鼠标、Enter、Escape、focus-visible、不可点击不入 tab 序列  |
| `hoverMask`                          | 无       | 同名 VNodeChild prop或 `#hoverMask` slot，slot 优先                                 | enter 后挂载、leave 后卸载、wrapper/非 wrapper 事件落点    |
| `bottomSlot`                         | 无       | 配置对象；另提供 `#bottomSlot` slot                                                 | circle/square、颜色、class/style、六个适用尺寸             |
| `topSlot`                            | 无       | 配置对象；另提供 `#topSlot` slot                                                    | 唯一 SVG gradient id、渐变、文本、class/style、circle 限制 |
| `border`                             | `false`  | `boolean \| { color?, motion? }`                                                    | 缺省/显式 false/true/对象；第二条 motion 边框              |
| `contentMotion`                      | `false`  | Boolean                                                                             | 缺省/显式 false/true；截图前冻结动画                       |
| `className` / `style`                | 无       | 同名兼容 prop并合并 Vue `class` / `style`                                           | wrapper 与非 wrapper 的样式落点                            |

## AvatarGroup API 与子 VNode 门禁

| Semi React v2.102.0 | 默认值   | Vue 契约                                                              | 对齐门禁                                              |
| ------------------- | -------- | --------------------------------------------------------------------- | ----------------------------------------------------- |
| `size`              | `medium` | 同 Avatar size，并覆盖每个直接 Avatar 子节点                          | SFC 裸/绑定 props 与 `h()` 子节点都验证               |
| `shape`             | `circle` | 同 Avatar shape，并覆盖每个直接 Avatar 子节点                         | 子节点自带 shape 仍由 Group 覆盖                      |
| `overlapFrom`       | `start`  | `start \| end`                                                        | 每项 z-index class、LTR/RTL margin 与视觉层叠         |
| `maxCount`          | 无       | number                                                                | 截断、0、等于/大于长度、默认 `+N` 与剩余 alt          |
| `renderMore`        | 无       | 兼容函数 prop；优先 `#more="{ restNumber, restAvatars }"` scoped slot | 返回 VNode、剩余 VNode 保持原 props/slot 信息         |
| `children`          | 无       | 默认 slot，仅 Avatar 直接子节点参与克隆                               | Fragment/空白/注释过滤；模板与 render function 双路径 |
| 其余 attrs          | 无       | 传给克隆后的 Avatar，与 Group size/shape/class 合并                   | `data-*`、事件与 style 不泄漏到 Group 根              |

Group 读取子 VNode 时以“键是否存在 + 值不为显式 `false`”解释裸 Boolean，并保留子节点已有 class/style/事件；不能用普通 truthiness。Group 自己的 `size`、`shape` 与 overlap class 按固定 React `cloneElement({ ...rest, className, size, shape })` 优先级覆盖子 Avatar。测试必须同时使用真实 SFC 模板宿主与 `h()` 宿主。

## 状态、事件顺序与 DOM

- 根头像为 `span.semi-avatar[role=listitem]`；文字内容是 `.semi-avatar-content > .semi-avatar-label[role=img][aria-label]`，图片内容为直接 `img`。
- 可点击文字或图片把 `tabindex=0`、keydown、focus/blur 放在 label/img，而不是外层头像；Enter 先派发 click 再 `preventDefault/stopPropagation`，Escape 使当前目标失焦。
- 图片 `error` 先通知用户；返回值不是 `false` 时设置失败并回退到 slot。`src` 更新在客户端预加载，新图成功恢复图片，失败/abort 保持 fallback；卸载后不得写状态。
- hover enter 先显示 mask，再在 Vue 更新周期后派发 `mouseenter`；leave 先清空 mask，再派发 `mouseleave`，以匹配 React `setState(..., callback)` 可观察顺序。
- 文字首次挂载及字符串内容、`gap`、`size` 变化后读取头像和文字宽度；仅在客户端 `nextTick` 后测量。公式为 `min(1, (avatarWidth - 2 * gap) / textWidth)`，零宽或间距无效时保持 1。
- 无装饰时自定义尺寸/style 和鼠标事件位于 `.semi-avatar`；存在 top/bottom/border 时返回 `.semi-avatar-wrapper`，尺寸/style/鼠标事件移到 wrapper，内部 Avatar 不重复响应。
- border 生成相对定位壳与一条 `.semi-avatar-additionalBorder`；`motion=true` 再生成一条 animated border。topSlot 仅在 circle 且适用预设尺寸渲染，bottomSlot 不限制 shape 但限制适用预设尺寸。
- Group 根为 `div.semi-avatar-group[role=list]`。克隆后的每个 Avatar 带 `semi-avatar-item-start-N` 或 `semi-avatar-item-end-N`，默认 more 是 `semi-avatar-item-more` Avatar。

## 样式、主题、RTL、国际化与动效

- 逐组件样式直接编译固定 `semi-foundation/avatar/avatar.scss`，根主题仍按上游 import 顺序提供全局 Token；发布 CSS 不包含 vendor 路径。
- light/dark 使用固定 Token；默认场景覆盖 desktop `1440×900`、mobile `390×844`、light/dark。Avatar 无 Locale 文案；默认 more 的英文 aria-label 固定来自 v2.102.0 源码。
- RTL 由 `.semi-rtl` 驱动：头像 direction 为 rtl、hover 从右侧定位，Group 重叠 margin 切换到右侧；增加 RTL 行为与视觉门禁。
- content/border animation 保留固定 1000ms/800ms keyframes。行为测试校验 class 与 computed animation；视觉对照统一暂停到同一动画时刻，不 mask、不放宽阈值。

## 无障碍、SSR 与发布

- 文字/图片 Avatar 提供图片语义和 alt；可点击时 aria-label 使用固定 `clickable Avatar: ` 前缀，Group 使用 `role=list`，头像使用 `role=listitem`。
- SSR import/render 不读取 `window`、`document`、`Image` 或布局；客户端挂载后再测量、预加载和判断 `:focus-visible`。销毁时清理预加载回调和待执行测量。
- 根与 `@workspace/ui/avatar` 子路径导出 Avatar、AvatarGroup 和全部公开类型；真实 tarball 验证 ESM、声明、根/`avatar.css`、tree-shaking、SSR-safe import、许可证与 SPDX SBOM。
- Foundation 只从 `packages/foundation-integration` 私有边界进入，公开运行时和声明不得泄漏 `vendor/**`、React 或私有 workspace 路径。

## React → Vue deviation

- Accepted：React `hoverMask`/`children`/topSlot/bottomSlot 接收 ReactNode；Vue 使用 VNodeChild prop并提供同名 slot，节点结构和触发时机不变。
- Accepted：React `renderMore` 映射为 `#more` scoped slot，同时保留同名函数 prop；输入仍是剩余数量与剩余 Avatar VNode。
- Accepted：React SyntheticEvent 映射为 Vue 原生 `MouseEvent | KeyboardEvent | Event`；DOM、默认行为与回调顺序保持一致。

除上述框架原生映射外，没有 accepted deviation 或未解释差异。

## 验收门禁

- 单元/SSR：七尺寸与任意尺寸、两 shape、全色板、文字缩放、图片/srcSet/imgAttr/失败阻止/src 更新、hover、click/Enter/Escape/focus-visible、top/bottom slot、border/content motion、attrs/style、Group 克隆/maxCount/more/overlap、template/render-function 子 VNode、RTL、SSR/hydration。
- Chromium：同 BrowserContext 校验本地 React 源码请求、无运行时错误、computed style、bounding rect、鼠标/键盘/图片失败/hover、desktop/mobile light/dark/RTL 与成对局部截图。
- 发布：完整 `pnpm check:full`，主题根/逐组件入口与真实 tarball 安装验证。

## 验收结论

- 状态：`ready`（2026-08-28）。
- 完整 `pnpm check:full` 通过：54 个 Vitest 文件、418 个单元/SSR 测试，以及 217 个 Chromium 行为与视觉测试全部通过。
- Avatar 定向 Chromium 场景 7/7 通过；desktop/mobile 的 light/dark 与 RTL 共 5 组成对截图均通过严格阈值，且 React/Vue PNG 逐组字节一致。
- 默认主题、`avatar.css` 逐组件入口、`@workspace/ui/avatar` SSR import、真实 tarball 的 ESM/声明/样式/类型/合规门禁均通过；公开产物未泄漏 `vendor/**` 或私有 workspace 路径。
