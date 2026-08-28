# Collapsible v2.102.0 对齐矩阵

## 固定源码与组件边界

- React Adapter：`vendor/semi-design/packages/semi-ui/collapsible/index.tsx`。
- Foundation：`vendor/semi-design/packages/semi-foundation/collapsible/foundation.ts` 与 `constants.ts`。
- 样式：`vendor/semi-design/packages/semi-foundation/collapsible/collapsible.scss`、`animation.scss`、`variables.scss`，默认主题 Token 来自 `semi-theme-default/scss`。
- 文档与测试：`vendor/semi-design/content/show/collapsible/index.md`、`index-en-US.md` 与 `packages/semi-ui/collapsible/__test__/collapsible.test.js`。
- `Collapsible.vue` 只负责开合状态、DOM 保留策略、高度测量和过渡；React/Vue 场景只组织稳定内容与交互验收入口。公开运行时通过 `@workspace/foundation-integration` 使用固定 Foundation，声明不泄漏 `vendor/**`。

## API 与 Vue 映射

| React v2.102.0           | Vue API                                             | 默认值 / 行为                                                             | 结论         |
| ------------------------ | --------------------------------------------------- | ------------------------------------------------------------------------- | ------------ |
| `isOpen`                 | `isOpen`                                            | `false`；受控开关                                                         | 等价         |
| `duration`               | `duration`                                          | `250ms`；只在 `motion && isTransitioning` 时写入                          | 等价         |
| `motion`                 | `motion`                                            | `true`；缺省、显式 `false`、显式 `true` 分别验证                          | 等价         |
| `keepDOM`                | `keepDOM`                                           | `false`；关闭且终态后销毁 slot DOM                                        | 等价         |
| `lazyRender`             | `lazyRender`                                        | `false`；仅与 `keepDOM` 联用，首次打开前不渲染                            | 等价         |
| `collapseHeight`         | `collapseHeight`                                    | `0`；非零时关闭状态仍渲染内容                                             | 等价         |
| `collapseHeightAdaptive` | `collapseHeightAdaptive`                            | `false`；开启时关闭高度为 `min(contentHeight, collapseHeight)`            | 等价         |
| `fade`                   | `fade`                                              | `false`；只在 `collapseHeight=0` 且关闭时令 opacity 为 0                  | 等价         |
| `reCalcKey`              | `reCalcKey`                                         | 变化后读取当前内容 `scrollHeight` 重新测量                                | 等价         |
| `className` / `style`    | `className` / `style`，另接收 Vue `class` / `style` | 合并到外层 wrapper；调用方 style 保留上游覆盖内建高度/透明度/时长的优先级 | Vue 原生映射 |
| `id`                     | `id`                                                | 按固定 Adapter 落在内层内容节点，而非外层 wrapper                         | 等价         |
| `children`               | 默认 slot                                           | 依据保留/懒渲染状态挂载或销毁                                             | Vue 原生映射 |
| `onMotionEnd`            | `@motion-end`，兼容 `onMotionEnd` listener          | 每次 wrapper `transitionend` 后触发；关闭时先隐藏内容再通知               | Vue emit     |
| `data-*`                 | 原生 attrs                                          | 固定 Adapter 只把 `data-*` 转发到 wrapper                                 | 等价         |

## 默认 Boolean 与全局默认门禁

- `motion` 是默认 `true` 的可选 Boolean，必须按原始 VNode key 区分缺省、显式 `false` 和显式 `true`；SFC 裸 `motion` 视为启用。
- 缺省 prop 允许读取 `semiGlobal.config.overrideDefaultProps.Collapsible`，显式 prop 优先于全局覆盖；`isOpen`、`keepDOM`、`lazyRender`、`collapseHeightAdaptive`、`fade` 同样保留这一固定 `getDefaultPropsFromGlobalConfig` 优先级。
- 不以普通 truthiness 判断调用方是否显式传入 Boolean。

## 状态、DOM、测量与动效

- 初始状态为 `domInRenderTree=false`、`domHeight=0`、`visible=isOpen`、`isTransitioning=false`、`cacheIsOpen=isOpen`；是否渲染内容由 `keepDOM/lazyRender/collapseHeight/visible/isOpen` 共同决定。
- 打开时先把内容置为可见并进入 transitioning，再于挂载/更新后测量内层 `scrollHeight`；关闭且 `motion=true` 时保留内容至 `transitionend`，`motion=false` 时立即隐藏。
- 外层固定为 `div.semi-collapsible-wrapper`，动效期增加 `.semi-collapsible-transition`；内层固定 `x-semi-prop="children"` 与 `overflow:hidden`。
- 高度为打开时测得的 `domHeight`，关闭时为 `collapseHeight`，自适应模式取两者最小值；Vue style 显式输出 `px` 以匹配 React 数值样式，opacity 与 transitionDuration 完全遵循固定 Adapter 条件。
- 客户端挂载后只在 `ResizeObserver` 可用时创建并 observe 内层节点；支持 `borderBoxSize` 与 `contentRect/clientHeight` 两条读取路径。`reCalcKey`、从 `display:none` 恢复、内容 resize 都会重算高度；卸载必须 disconnect。
- `ResizeObserver` 不可用时安全降级为 mount/update 后的 `scrollHeight` 测量，不影响 SSR import/render。

## 键盘、焦点、ARIA、主题、RTL、国际化与 SSR

- Collapsible 是无交互行为容器，不创建 button、tabindex 或键盘状态；控制器应由调用方提供。
- 固定 Adapter 只转发 `data-*`，不把任意 `aria-*` 放到 wrapper；`id` 按源码位于内层内容节点，调用方可从控制器使用 `aria-controls` 指向它。
- 组件无 Locale 文案。默认样式只有高度/透明度过渡，不含方向选择器，但仍覆盖 light/dark、桌面/移动和 RTL 场景，确认主题与方向包装不会改变几何和行为。
- 模块求值与 SSR render 不访问 `window`、DOM 或 `ResizeObserver`；hydration 后建立 Observer、同步真实高度且无警告，卸载完整清理。

## 测试与发布门禁

- 单元测试覆盖默认值、Boolean 三态与全局覆盖、打开/关闭终态、`motion=false`、`keepDOM/lazyRender`、非零/自适应折叠高度、fade、style 覆盖、`reCalcKey`、两种 ResizeObserver entry、从隐藏树恢复、transition 事件、data attrs、id 和卸载清理。
- SSR 覆盖默认关闭、打开、keepDOM/lazyRender、非零折叠高度、class/style/data/id，以及无 browser global 的 import/render/hydration。
- React/Vue 场景覆盖基础开合、keepDOM、lazyRender、fade、自适应高度和动态重算；行为先进入相同过渡终态，再比较 computed style 与几何。
- 视觉覆盖桌面 `1440x900`、移动 `390x844`、light/dark 与 RTL；关键 computed style 精确相等，bounding rect 各轴误差 `<= 0.5px`，截图使用 `threshold <= 0.1` / `maxDiffPixelRatio <= 0.001`，并独立比较成对 PNG 字节。
- 根与 `@workspace/ui/collapsible` 子路径导出组件和公开类型；`@workspace/theme-default/collapsible.css` 包含固定过渡样式。真实 tarball 验证 ESM、声明、样式入口、tree-shaking、SSR-safe import、许可证和 SPDX SBOM。

## Deviation

- Vue 额外提供 `@motion-end` 事件名作为 `onMotionEnd` 的原生映射；事件时序与参数不变。
- 无 accepted visual/behavior deviation；任一未解释差异均阻止 `pending -> ready`。

## 验收结论

- 当前状态：`ready`。
- `pnpm check` 全量通过：64 个单元/SSR 测试文件、482 项测试，以及 lint、类型、构建、主题产物、SSR import 和真实 tarball 消费门禁均通过。
- `pnpm test:browser` 全量通过：固定 Chromium 中 252 项测试全部通过；其中 Collapsible 专项 7 项，覆盖运行时来源、开合动效终态、DOM 保留、懒渲染、动态重测、桌面/移动 light/dark 与 RTL。
- 5 组 React/Vue 成对截图既通过 Playwright 阈值，也通过独立 `cmp` 字节相等验证；未使用 mask，未共享截图文件名。
- 固定 vendor 仍为 `v2.102.0` / `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`，且没有修改。
