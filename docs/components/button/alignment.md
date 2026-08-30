# Button v2.102.0 对齐矩阵

## 固定证据

- React 公开入口：`vendor/semi-design/packages/semi-ui/button/index.tsx`
- 基础 Button：`vendor/semi-design/packages/semi-ui/button/Button.tsx`
- IconButton Adapter：`vendor/semi-design/packages/semi-ui/iconButton/index.tsx`
- ButtonGroup：`vendor/semi-design/packages/semi-ui/button/buttonGroup.tsx`
- SplitButtonGroup：`vendor/semi-design/packages/semi-ui/button/splitButtonGroup.tsx`
- Foundation 常量：`vendor/semi-design/packages/semi-foundation/button/constants.ts`
- Foundation 样式：`vendor/semi-design/packages/semi-foundation/button/button.scss`、`iconButton.scss`、`rtl.scss`
- 中文文档：`vendor/semi-design/content/basic/button/index.md`
- 英文文档：`vendor/semi-design/content/basic/button/index-en-US.md`

固定版本为 `v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。以上文件只读，本实现没有运行时 `vendor/**` 依赖。

## 组件边界

| Vue 组件              | 单一职责                                 | 状态/副作用                                        |
| --------------------- | ---------------------------------------- | -------------------------------------------------- |
| `Button`              | 渲染一个原生按钮及文字、图标、加载布局   | 无内部业务状态；所有事件向上发出                   |
| `ButtonGroup`         | 向直接子 Button 合并组合属性并插入分隔线 | 无持久状态；范围受限的 VNode 克隆                  |
| `SplitButtonGroup`    | 标记后代中首尾按钮的 split class         | 仅 mounted 后创建 MutationObserver，unmount 时断开 |
| `ButtonTypesScenario` | 复现中英文档首个按钮类型示例             | 只记录最近一次公开 click 输出                      |

## Button 公开契约

| 维度                                                  | React v2.102.0                                                      | Vue 契约                                                    | 结论             |
| ----------------------------------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------- | ---------------- |
| `type`                                                | `primary / secondary / tertiary / warning / danger`，默认 `primary` | 同名 prop、同枚举和默认值                                   | 等价             |
| `theme`                                               | `solid / borderless / light / outline`，默认 `light`                | 同名 prop、同枚举和默认值                                   | 等价             |
| `size`                                                | `default / small / large`，默认 `default`                           | 同名 prop、同枚举和默认值                                   | 等价             |
| `block / circle / disabled / loading / colorful`      | boolean；除 `loading` 的 icon 分支外均反映为状态 class              | 同名 typed props；保留相同 class 条件                       | 等价             |
| `htmlType`                                            | 映射原生 `button.type`，默认 `button`                               | 同名 prop                                                   | 等价             |
| `children`                                            | ReactNode                                                           | 默认 slot                                                   | Vue 原生映射     |
| `icon`                                                | ReactNode，存在时走 IconButton                                      | `#icon` slot；提供 `fill / iconSize / iconStyle` slot props | Vue 原生映射     |
| `iconPosition`                                        | `left / right`，默认 `left`                                         | 同名 prop                                                   | 等价             |
| `noHorizontalPadding`                                 | boolean、单方向或方向数组                                           | 同名 prop、同枚举                                           | 等价             |
| `contentClassName`                                    | 内容 span class                                                     | `contentClass`                                              | React→Vue 重命名 |
| `className / style / id / aria-* / data-*`            | React 原生属性                                                      | Vue `$attrs` 中的 `class / style / id / aria-* / data-*`    | Vue 原生映射     |
| `onClick / onMouseDown / onMouseEnter / onMouseLeave` | 原生 MouseEvent 回调                                                | `click / mousedown / mouseenter / mouseleave` emits         | Vue 原生映射     |
| `prefixCls`                                           | 默认 `semi-button`                                                  | 同名 prop、同默认值                                         | 等价             |
| `iconSize / iconStyle`                                | 固定源码公开类型存在，但 Adapter 未读取到输出                       | 作为 `#icon` slot props 交给 Vue 图标实现                   | 明确迁移         |

Button 不存在受控/非受控双态；props 只读，组件不修改调用方数据。

## DOM、class 与事件顺序

- 根节点保持原生 `<button>`，原生 `disabled`、`type` 和 `aria-disabled` 同步。
- 内容节点保持 `<span class="semi-button-content">`；纯文本路径保留 `x-semi-prop="children"`。
- 图标路径保留 `semi-button-with-icon`、`semi-button-with-icon-only`、`semi-button-loading`、`semi-button-content-left/right`。
- 类型、主题、尺寸、禁用、block、circle、colorful 的 `.semi-button-*` class 与固定源码同名。
- click、mousedown、mouseenter、mouseleave 由根原生按钮产生后立即 emit，不增加异步队列或额外状态更新。
- disabled 使用原生不可交互语义，并在组件事件边界再次阻止 emit；键盘 Enter/Space、Tab 顺序和焦点保留原生 button 行为。

## ButtonGroup 与 SplitButtonGroup

- ButtonGroup 根为 `div.semi-button-group[role=group]`，`aria-label` 通过 attrs 传入。
- `size / disabled / type` 先作为组合默认值，再由直接子 Button 自身 props 覆盖；`theme / colorful` 在调用方显式传入组合时覆盖直接子 Button，与固定源码的 clone 顺序一致。
- 非 outline 的直接子 Button 之间插入 `.semi-button-group-line-*`；outline 不插入分隔线。
- SplitButtonGroup 根为 `div.semi-button-split[role=group]`。mounted 后标记首个/末个后代按钮为 `semi-button-first/last`，监听固定源码相同的 class/新增 button 变化，unmount 时断开 Observer。

## 样式、主题、方向与动效

- 默认主题根入口仍为 `@aifuxi/semi-theme-default/index.css`；逐组件入口为 `@aifuxi/semi-theme-default/button.css`。
- Button 入口按 theme index → global → animation → button → iconButton → icons 的顺序编译固定 SCSS。
- light/dark 都由 `body[theme-mode]` 中相同 `--semi-*` Token 驱动。
- LTR/RTL 保留 `.semi-rtl` / `.semi-portal-rtl` 上游选择器。当前对照工作台同时设置原生 `dir`；RTL 专项证据检查原生方向、键盘和左右图标间距。
- 背景和边框状态 transition 使用固定 Token，v2.102.0 默认持续时间为 0；加载图标旋转为 600ms linear infinite。
- Button 无 Portal、国际化数据、异步资源或浏览器全局监听。

## 可访问性、SSR 与发布

- 图标按钮由调用方提供 `aria-label`；组件不根据图标猜测可访问名称。
- disabled 同时输出原生 `disabled` 与 `aria-disabled=true`。
- ButtonGroup/SplitButtonGroup 输出 `role=group` 并透传 `aria-label`。
- Button 和 ButtonGroup 可直接 SSR render；SplitButtonGroup 只在 mounted 创建 Observer，因此 import 与 SSR render 安全。
- `@aifuxi/semi-ui-vue` 根与 `@aifuxi/semi-ui-vue/button` 均导出 ESM/声明；真实 tarball 验证两种导入、类型、SSR 和 `button.css`。

## 验收矩阵

| 证据                  | 场景                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------ |
| 单元行为              | 默认值、attrs/slots/emits、类型/主题/尺寸、disabled、icon/loading、padding、colorful fill、Group、Split、SSR |
| Chromium 行为         | 五种类型 click、disabled、loading、Enter/Space、focus-visible、ARIA、Group、Split、无运行时错误              |
| computed style / 几何 | 五种类型逐节点精确比较；bounding rect 每轴差不超过 0.5 CSS px                                                |
| 视觉                  | desktop 1440×900 与 mobile 390×844，light/dark；组件裁剪，threshold 0.1，diff ratio 0.001                    |
| RTL                   | desktop light，原生 direction、键盘和图标间距行为                                                            |
| 发布                  | build、SSR import、真实 pack 安装、根/子路径 ESM 与 types、根/逐组件 CSS、许可证/SBOM                        |

## Deviation

当前没有 accepted visual/behavior deviation。ReactNode、className 和 `onXxx` 只按 Vue 原生 slots、attrs、emits 迁移，不作为差异；`iconSize/iconStyle` 在固定 React Adapter 中没有可观察输出，Vue 将其作为 icon slot props 暴露，避免伪造上游不存在的 DOM 行为。
