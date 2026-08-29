# Popover v2.102.0 对齐矩阵

## 路线与权威来源

- 当前路线：最近完成 `OverflowList`；`Popover` 是固定 `vendor/semi-design/content/order.js` 中紧邻其后的公开组件。
- 固定基线：Semi Design `v2.102.0`，提交 `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- Adapter、公开类型与 DOM：`packages/semi-ui/popover/index.tsx`、`Arrow.tsx`。
- 常量、样式、动效与 RTL：`packages/semi-foundation/popover/constants.ts`、`variables.scss`、`animation.scss`、`popover.scss`、`rtl.scss`。
- 默认主题与 Token：`packages/semi-theme-default/scss/index.scss`、`global.scss`、`variables.scss`。
- 文档与行为语料：`content/show/popover/index.md`、`index-en-US.md`、`packages/semi-ui/popover/__test__/popover.test.js` 与 `_story/`。
- Popover 是已进入 `ready` 的 Tooltip 的公开适配层：复用其 Portal、定位、触发、焦点、动效和清理状态机，仅增加 Popover 默认值、内容卡片 DOM、角色推导与专用箭头，因此依赖已就绪且可以独立验收。

## Vue 组件边界

| 文件               | 单一职责                                                       | 公开契约                                   |
| ------------------ | -------------------------------------------------------------- | ------------------------------------------ |
| `Popover.vue`      | 解析 Popover 默认值并把内容卡片、事件和 trigger 组合到 Tooltip | props、emits、默认/命名 slot、公开实例方法 |
| `PopoverArrow.vue` | 根据最终 placement 渲染固定两层 SVG 箭头，并继承卡片/箭头颜色  | `position`、`arrowStyle`、`popStyle`       |
| `types.ts`         | 公开 props、slots、emits、箭头和实例类型                       | 根入口与 `popover` 子路径                  |

组件保持薄适配层：状态唯一来源仍是 Tooltip/Foundation，Popover 不复制第二套 visible、Portal 或定位状态；props 向下、事件向上。内容、箭头分别拆分，避免根组件同时承担 SVG 表现职责。

## 公开 API、默认值与 Vue 映射

| React v2.102.0                                   | Vue 契约                                           | 默认值 / 映射                                           | 结论         |
| ------------------------------------------------ | -------------------------------------------------- | ------------------------------------------------------- | ------------ |
| `content` / render function                      | `content` prop 或 `#content="{ initialFocusRef }"` | slot 优先；函数映射为作用域 slot                        | Vue 原生映射 |
| `visible` / `onVisibleChange`                    | `visible`、`v-model:visible`、`@visibleChange`     | 受控值继续由调用方持有                                  | Vue 原生映射 |
| `trigger`                                        | 同名 prop                                          | `hover`；支持 hover/focus/click/custom/contextMenu      | 等价         |
| `position`                                       | 同名 prop                                          | `bottom`，保留 12 个常规与固定 Adapter 接受的 over 方位 | 等价         |
| `showArrow`                                      | 同名 Boolean prop                                  | `false`；缺省/显式 false/显式 true 分别验证             | 等价         |
| `arrowPointAtCenter`                             | 同名 Boolean prop                                  | `true`；缺省/显式 false/显式 true 分别验证              | 等价         |
| `autoAdjustOverflow`                             | 同名 Boolean prop                                  | `true`；缺省/显式 false/显式 true 分别验证              | 等价         |
| `condition`                                      | 同名 Boolean prop                                  | `true`；缺省/显式 false/显式 true 分别验证              | 等价         |
| `motion`                                         | 同名 Boolean prop                                  | `true`；缺省/显式 false/显式 true 分别验证              | 等价         |
| `closeOnEsc`                                     | 同名 Boolean prop                                  | `true`；显式值优先全局覆盖                              | 等价         |
| `guardFocus`                                     | 同名 Boolean prop                                  | `true`；显式值优先全局覆盖                              | 等价         |
| `returnFocusOnClose`                             | 同名 Boolean prop                                  | `true`；显式值优先全局覆盖                              | 等价         |
| `disableFocusListener`                           | 同名 Boolean prop                                  | `true`；显式值优先全局覆盖                              | 等价         |
| `spacing`                                        | number 或 `{ x, y }`                               | 未传时无箭头为 4、有箭头为 10；显式 `0` 保留            | 等价         |
| `arrowBounding`                                  | 同名 prop                                          | `{ width:24, height:8, offsetX:0, offsetY:6 }`          | 等价         |
| `arrowStyle`                                     | 同名 prop                                          | border/background/opacity 覆盖箭头两层 path             | 等价         |
| `contentClassName`                               | 同名 prop                                          | 合并到 `.semi-popover` 卡片                             | 等价         |
| `className` / `style`                            | `class` / `style`，并兼容 `className`              | 作用于外层定位 wrapper；`style` 同时为箭头提供颜色回退  | Vue 原生映射 |
| `getPopupContainer`                              | 同名函数 prop                                      | 显式 prop → ConfigProvider → body                       | 等价         |
| `margin` / `rePosKey` / `zIndex`                 | 同名 prop                                          | zIndex 默认 1030                                        | 等价         |
| `clickToHide` / `stopPropagation` / `keepDOM`    | 同名 prop                                          | false / false / false                                   | 等价         |
| `onClickOutSide` / `onEscKeyDown` / `afterClose` | `@clickOutside` / `@escKeydown` / `@afterClose`    | 原事件透传                                              | Vue 原生映射 |
| `focusTrigger()`                                 | 组件 ref 的同名公开方法                            | 委托 Tooltip                                            | 等价         |

Popover 具有多个默认值为 true 的可选 Boolean prop。实现必须通过当前 VNode 原始 props 区分“缺省”与显式 false，并保持 `显式 prop → semiGlobal Popover 覆盖 → 固定默认值`；不得用普通 truthiness 合并。

## DOM、class、样式、角色与事件顺序

- Tooltip Portal 内的定位根为 `.semi-popover-wrapper`，带 `x-placement`、show/hide animation class 与 `.semi-popover-with-arrow`；内容卡片为 `div.semi-popover[.semi-popover-rtl] > div.semi-popover-content`。
- showArrow=true 时渲染 `.semi-popover-icon-arrow` 两层 path；上下方位 SVG 为 24×8，左右方位最终由 Tooltip placement 渲染为 8×24。arrowStyle 优先于 popup style，未传时由固定 CSS Token 着色。
- trigger 为 click/custom 时 role=`dialog`，子节点获得 `aria-expanded`、`aria-haspopup="dialog"`、`aria-controls`；hover/focus/contextMenu 为 role=`tooltip`，子节点获得 `aria-describedby`。
- `visibleChange` 之后同步发出 `update:visible`；outside/Escape/afterClose 直接保持 Tooltip/Foundation 已验证顺序。content 内 clickToHide 与 stopPropagation 沿用 Tooltip Portal 事件集。
- mouse enter/leave 默认各 50ms；hover bridge、focus、click、contextMenu、custom、condition、keepDOM 与 motion 均由 Tooltip 状态机执行，Popover 不另建 timer 或监听器。

## Portal、定位、焦点、动效、RTL、国际化与 SSR

- 稳定自定义容器必须在首次可见时就是 Portal 父节点；场景预先创建容器。公开契约未承诺容器函数返回值动态迁移，因此不新增轮询或 Observer。
- Element capture scroll、Document/page scroll、resize、`rePosKey` 与 popup ResizeObserver 的重定位沿用 Tooltip；关闭/卸载后 listener、timer、RAF、Observer 均必须清理。移动 viewport 用 `scrollIntoView` 验证最终几何。
- ArrowDown/ArrowUp 将焦点移入面板，guardFocus 循环 Tab；Escape 通知并关闭，非 custom trigger 在 returnFocusOnClose=true 时恢复 trigger 焦点；`#content` 可绑定 `initialFocusRef`。
- 动效使用 `semi-popover-animation-show/hide`，100ms cubic-bezier；视觉取稳定帧。light/dark 颜色来自 `--semi-color-bg-3`、border 与 elevated shadow Token。
- RTL 内容添加 `.semi-popover-rtl` 并由 Portal direction/class 驱动；Popover 无 locale 文案，不改变 57 Locale 完整性。
- SSR import 不访问 DOM；SSR 只渲染 trigger，不创建 Teleport/Portal。hydration 后按客户端状态插入浮层且不得产生 hydration 警告。

## 编码前测试门禁

- 单元/SSR：默认 true Boolean 的缺省/显式 false/显式 true与 semiGlobal 覆盖优先级；默认 DOM/role/spacing/zIndex；prop 与作用域 slot 内容；箭头方向/颜色；五种 trigger；condition；v-model/outside/Escape/focus guard/initialFocusRef；keepDOM/afterClose；稳定自定义容器首次挂载；公开方法；SSR render/hydration。
- Portal/重定位：稳定自定义容器首次父节点、Element 与 Document scroll、resize/rePosKey、移动 viewport `scrollIntoView`、卸载后不再响应；断言最终 geometry，不读取私有 state。
- React/Vue 场景：bottom/right、click dialog、hover tooltip、custom container、箭头与自定义颜色、无箭头、作用域内容、RTL。
- 浏览器：同一 Chromium 的 computed style、bounding rect 与逐目标截图；桌面 1440×900、移动 390×844 的 light/dark，加 RTL；截图 `threshold <= 0.1`、`maxDiffPixelRatio <= 0.001`，并独立比较 React/Vue 图片字节。
- 发布：根与 `popover` 子路径 ESM/声明、`popover.css`、tree-shaking、SSR-safe import、真实 tarball 离线消费、许可证和 SBOM。

## Deviation

- React 的 `content={({ initialFocusRef }) => ...}` 映射为 Vue `#content="{ initialFocusRef }"`；静态 `content` prop 仍可用。该差异只改变框架表达，不减少内容或初始焦点能力。
- React `className` 公开 API 映射为 Vue `class`，同时保留 `className` 兼容输入；两者均只作用于定位 wrapper，`contentClassName` 仍作用于内部卡片。
- 当前没有 accepted visual/behavior deviation；任何未解释差异均阻止 `pending -> ready`。

## 验收结论

当前为 `ready`，验收基于固定 Semi Design `v2.102.0` / `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`：

- `pnpm check` 通过：84 个 Vitest 文件、616 项单元/SSR/应用契约测试全部通过；格式、Lint、全部 workspace 类型检查、源码边界、构建、主题根入口与逐组件入口、SSR-safe import 均通过。
- Popover 定向 Playwright 回归 10/10 通过；完整 `pnpm test:browser` 327/327 通过，锁定 Chromium 覆盖 Portal、bottom/right 定位、click/hover/custom、ArrowUp/ArrowDown、Escape、焦点恢复、Element/Document scroll 重定位、桌面/移动 light/dark 与 RTL。
- 五组 React/Vue Popover 裁剪截图已在测试中执行直接 Buffer 等值断言，并在测试外分别使用 `cmp` 复核；desktop/light、desktop/dark、mobile/light、mobile/dark、RTL 均字节完全相等。
- 真实 tarball 的安装、根与 `popover` exports、ESM、公开类型、`popover.css`、许可证/SBOM 和 SSR import 全部通过；发布声明保留 `.vue` 组件边界，不泄露全局组件映射到消费端签名。
- 当前没有 accepted visual/behavior deviation。
