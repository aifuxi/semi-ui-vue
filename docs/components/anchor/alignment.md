# Anchor v2.102.0 对齐矩阵

## 基线与选择理由

- 唯一基线：`vendor/semi-design` tag `v2.102.0`，提交 `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- 组件顺序：最近完成 TimePicker。其后的 Transfer 依赖未完成的 Tree/Pagination/Spin，TreeSelect 依赖 Tree/Tag/Popover，Upload 依赖 Modal/Cropper，均无法独立完成公开切片；Anchor 是这些阻塞项之后首个可独立验收的组件。
- 已就绪依赖：ConfigProvider 提供方向，Typography 提供单行省略与 Tooltip，默认主题已包含 Anchor 上游 SCSS；本切片不把 BackTop、Breadcrumb 等后续组件标记为 ready。

## 组件边界

| 模块                | 单一职责                                           | 契约                                   |
| ------------------- | -------------------------------------------------- | -------------------------------------- |
| `Anchor.vue`        | 管理链接注册、滚动容器、激活态、滑轨位置与监听清理 | props / emits / default slot           |
| `AnchorLink.vue`    | 渲染单个链接、缩进、禁用态、Tooltip 与嵌套链接     | href/title/disabled/default+title slot |
| `anchor-context.ts` | 在 Anchor 实例内传递响应式状态和显式注册/点击动作  | 类型化 `InjectionKey`，实例隔离        |
| `anchor.js`         | 从私有集成边界导出固定 Anchor/Link Foundation      | declaration facade + bundled runtime   |

## 权威源码

- Adapter、公开类型与 DOM：`packages/semi-ui/anchor/{index,link,anchor-context}.tsx`。
- 状态机：`packages/semi-foundation/anchor/{foundation,linkFoundation,constants}.ts`。
- 样式与 RTL：`packages/semi-foundation/anchor/{variables,anchor,animation,rtl}.scss`。
- 主题 Token：`packages/semi-theme-default/scss/`。
- 文档与测试：`content/navigation/anchor/{index,index-en-US}.md`、`packages/semi-ui/anchor/__test__/anchor.test.js`。

## 公开 API 与 Vue 映射

| React v2.102.0                                  | 默认值              | Vue 契约                                                                         |
| ----------------------------------------------- | ------------------- | -------------------------------------------------------------------------------- |
| `size`                                          | `'default'`         | `'small' \| 'default'`，保留 size class、字体与滑块高度                          |
| `railTheme`                                     | `'primary'`         | `'primary' \| 'tertiary' \| 'muted'`；muted 隐藏整条滑轨                         |
| `defaultAnchor`                                 | `''`                | 首次客户端挂载后激活并滚动，不发出 `change` / `click`                            |
| `getContainer`                                  | `window`            | 返回 `HTMLElement \| Window`；空返回值回退 window，只在客户端调用                |
| `offsetTop` / `targetOffset`                    | `0 / 0`             | 前者参与滚动激活判定，后者参与点击后的目标滚动                                   |
| `scrollMotion`                                  | `false`             | 支持浏览器平滑滚动时使用 `smooth`，否则直接设置 `scrollTop`                      |
| `autoCollapse`                                  | `false`             | 只展示当前链接、其祖先链和对应后代；缺省/显式 false/显式 true 均覆盖             |
| `showTooltip`                                   | `false`             | `boolean \| TypographyShowTooltip`；保留缺省/false/true，对象配置转给 Typography |
| `position`                                      | `undefined`         | 覆盖 `showTooltip.opts.position`，保留固定 14 个 Anchor placement                |
| `maxWidth` / `maxHeight`                        | `'200px' / '750px'` | `string \| number`，数值由 Vue style 归一化为 px                                 |
| `className` / `style` / `data-*` / `aria-label` | 空                  | 合并 Vue `class`/`style`，其余 attrs 透传到 navigation 根节点                    |
| `onChange` / `onClick`                          | noop                | emits：`change(current, previous)`、`click(event, current)`                      |
| `Anchor.Link href/title/disabled`               | `'#' / '' / false`  | 保留同名 props；`title` 接受 `VNodeChild`，并提供 `#title` slot                  |
| React `children`                                | —                   | `Anchor` 与 `AnchorLink` 的默认 slot；复合导出继续支持 `Anchor.Link`             |

## 状态、事件与注册顺序

- Link 挂载时通过 LinkFoundation 注册 href，href 更新时先移除旧值再注册新值，卸载时移除；重复 href 按上游数组语义保留。
- Anchor 维护注册顺序与父 href，派生每个祖先的后代集合；不读取或克隆子 VNode，从而避免 Vue slot 函数和 React children 结构的错误等同。
- 点击可用链接时，先更新 activeLink；DOM 更新后的微任务中设置滑块 top 并滚动目标；随后依次发出 `change`、`click`。点击同一链接不重复发出 `change`，仍发出 `click`。
- 禁用链接保留 focusable `role=link`，但点击和 keypress 均不改变状态或发事件。
- 滚动期间 clickLink 为 true 时不重算；防抖结束后恢复。普通滚动按链接内容节点相对容器顶部减 `offsetTop` 的最后一个负值确定 activeLink。
- `defaultAnchor` 走同一激活与滚动路径，但 `shouldNotify=false`，不污染用户事件序列。

## DOM / class / 样式

- 根：`div.semi-anchor[role=navigation]`，缺省 `aria-label="Side navigation"`，尺寸增加 `.semi-anchor-size-{size}`。
- 滑轨：`div.semi-anchor-slide.semi-anchor-slide-{railTheme}[aria-hidden=true] > span.semi-anchor-slide-bar-*`；存在 activeLink 时增加 `-active`。
- 链接容器：`.semi-anchor-link-wrapper[role=list]`；每项 `.semi-anchor-link[role=listitem]`，可交互标题 `.semi-anchor-link-title[role=link][tabindex=0]`。
- active/disabled/Tooltip 分别保留 `-active`、`-disabled`、`.semi-anchor-link-tooltip*` class；active 标题保留 `aria-details="active"`。
- LTR 使用每层 `padding-left: 8px`，RTL 使用 `padding-right: 8px`；滑轨由固定 `.semi-rtl` SCSS 移到右侧。
- 逐组件 CSS 编译 theme/global、Anchor、Typography、Tooltip、Popover 与 Portal 依赖，保留 `.semi-*` 和 `--semi-*`。

## 键盘、焦点、ARIA、滚动与清理

- 固定上游使用 `onKeyPress`：可用链接在 Enter keypress 时与鼠标点击相同；不额外实现上游没有的方向键 roving tabindex。
- 标题保留 focus-visible outline；禁用标题 `aria-disabled=true`，普通字符串 title 且未开 Tooltip 时保留原生 `title` 属性。
- 容器支持 Window 与 Element。点击滚动选择包含目标的最内层可滚动祖先，应用 `targetOffset`；滚动激活使用容器自身 bounding top。
- Anchor 挂载时注册两个 scroll 监听（节流状态更新、防抖 clickLink 复位）和可用时的 ResizeObserver；容器变更或卸载时取消 listener、timer 和 observer。
- ResizeObserver 只在链接 wrapper 可见时重算轨道高度；无 ResizeObserver 时正常降级。

## RTL、国际化、SSR

- direction 来自 ConfigProvider，作用于链接层级缩进和 `.semi-rtl` 样式；显式 attrs `dir` 不替代 provider 的适配语义。
- Anchor 无组件内置文案，只有缺省英文 `aria-label="Side navigation"`；中文/英文标题由调用方 slot/prop 提供。
- SSR 只输出静态 Anchor/Link DOM；不读取 window/document、容器、ResizeObserver、滚动几何或定时器。公开根与 `anchor` 子路径均须 SSR-safe import。

## 验收门禁

- 单元：固定 DOM/class/ARIA、尺寸/主题/数值尺寸、动态注册和 href 更新、点击事件顺序、同链接、禁用、defaultAnchor、autoCollapse 三态、showTooltip 三态、nested level/RTL、Element/Window scroll、ResizeObserver 与卸载清理。
- SSR：默认、嵌套、禁用、RTL/Tooltip 静态输出与无警告 hydration，无 browser global、Portal 或 vendor/private 路径。
- Chromium：同 BrowserContext 的 React/Vue 来源、点击/keypress、滚动激活、autoCollapse、disabled、computed style、bounding rect，以及 desktop/mobile light/dark/RTL 裁剪截图。
- 发布：根与 `anchor` 子路径导入、类型、`anchor.css`、tree-shaking、SSR-safe import、许可证/SBOM 与真实 tarball 安装验证。

## Deviation

- React `children`/`ReactNode title` 分别映射为 Vue 默认 slot 与 `VNodeChild`/`#title` slot；不复制 React element 或 cloneElement 语义。用户可实现能力、嵌套结构和 DOM 插入点不变。
- 上游 AnchorFoundation 使用 `scroll-into-view-if-needed@2.2.31` 计算滚动动作。本项目精确锁定同一版本并由组件产物内联其运行时逻辑；许可证、SBOM 与真实 tarball 均覆盖该依赖，公开声明不泄漏私有 Foundation 路径。

## 验收结果

- Anchor 单元与 SSR 共 10 项通过，覆盖固定 DOM/class/ARIA、默认值、尺寸/主题、注册更新、嵌套/RTL、defaultAnchor、autoCollapse、Tooltip、事件顺序、禁用态、Element/Window 容器、ResizeObserver 清理、SSR-safe 输出与无警告 hydration。
- React/Vue 固定 Chromium 专项 7 项通过：点击、keypress、滚动激活、disabled、computed style 与 bounding rect 均对齐；桌面/移动 light/dark 与 RTL 共 5 组裁剪截图不使用 mask，React/Vue 原始 PNG 逐字节一致。
- 全仓 `pnpm check` 通过：固定 vendor/inventory/icons/source-boundary、格式、lint、全部 workspace 类型检查、40 个测试文件共 316 项 Vitest、全量构建、主题产物与 SSR import 均通过。
- 全量 Chromium 168 项单次通过；根/`anchor` ESM 与声明、`anchor.css`、tree-shaking、许可证/SBOM、真实 tarball 安装/导入/类型/样式验证均通过。

上述 React → Vue slot 映射为已解释 deviation，不损失公开可实现能力；没有 accepted 视觉或行为 deviation。Anchor 状态为 `ready`。
