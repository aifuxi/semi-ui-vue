# IconButton v2.102.0 对齐矩阵

## 固定证据

- React Adapter 与公开类型：`vendor/semi-design/packages/semi-ui/iconButton/index.tsx`
- Button 基础实现：`vendor/semi-design/packages/semi-ui/button/Button.tsx`
- Button 公开分派入口：`vendor/semi-design/packages/semi-ui/button/index.tsx`
- Foundation 常量：`vendor/semi-design/packages/semi-foundation/button/constants.ts`
- Foundation 样式：`vendor/semi-design/packages/semi-foundation/button/button.scss`、`iconButton.scss`、`rtl.scss`
- 默认主题：`vendor/semi-design/packages/semi-theme-default/scss/index.scss`、`global.scss`、`animation.scss`
- 中英文 Button 文档：`vendor/semi-design/content/basic/button/index.md`、`index-en-US.md`
- 上游故事：`vendor/semi-design/packages/semi-ui/iconButton/_story/iconButton.stories.tsx`
- 上游变更记录：固定 changelog 明确 IconButton 已不再推荐，但仍保留公开导出。

固定版本为 `v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。IconButton
没有独立 Foundation 类；它是 Button Adapter 与 `button/iconButton.scss` 之上的公开轻量层。本实现
复用已经进入 `ready` 的 Vue Button，不复制 Foundation，也不形成运行时 `vendor/**` 依赖。

## 组件边界

| Vue 模块             | 单一职责                                                                      | 状态/副作用                      |
| -------------------- | ----------------------------------------------------------------------------- | -------------------------------- |
| `IconButton.ts`      | 固定启用 Button 图标布局，转发 Button props/attrs/events/default 与 icon slot | 无内部状态；props down/events up |
| `IconButtonScenario` | 覆盖 icon-only、图文、loading、disabled、尺寸、主题和彩色图标                 | 只记录公开 click 结果            |

IconButton 是一个单职责包装器，不需要额外 composable、provider、Portal 或 Observer。由于模板 slot
出口会额外创建 Fragment，破坏上游 colorful `fill` 对直接 icon VNode 的克隆语义，这里只在该组件内部使用
范围受限的 Composition API render function，直接转发调用方 slot 函数；没有引入 JSX 或 Options API 状态。

## 公开 API 与默认值

| 维度                                                          | React v2.102.0                                                | Vue 契约                                            | 结论                     |
| ------------------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------- | ------------------------ |
| `icon`                                                        | `ReactNode`，仅有效 React element 会进入 DOM                  | `#icon="{ fill, iconSize, iconStyle }"`             | Vue 原生 slot 映射       |
| `children`                                                    | 可选 ReactNode                                                | 可选默认 slot                                       | Vue 原生映射             |
| `iconPosition`                                                | `left / right`，默认 `left`                                   | 同名 prop、同枚举和默认值                           | 等价                     |
| `iconSize`                                                    | 公开 IconSize；Adapter 未写入最终图标                         | 同名 prop，作为 icon slot prop 暴露                 | 保留公开输入，不伪造 DOM |
| `iconStyle`                                                   | 公开 style；Adapter 未写入最终图标                            | 同名 prop，作为 icon slot prop 暴露                 | 保留公开输入，不伪造 DOM |
| `loading`                                                     | 默认 `false`；未 disabled 时替换 icon；总是增加 loading class | 同名 prop、同优先级                                 | 等价                     |
| `noHorizontalPadding`                                         | `false / true / left / right / array`，默认 `false`           | 同名 prop与枚举；作用于根 button inline style       | 等价                     |
| `type / theme / size`                                         | 继承 Button；默认 `primary / light / default`                 | 复用 Button 同名契约                                | 等价                     |
| `block / circle / colorful / disabled / htmlType / prefixCls` | 继承 Button                                                   | 复用 Button 同名契约                                | 等价                     |
| `contentClassName`                                            | 内容 span class                                               | `contentClass`                                      | React→Vue 命名迁移       |
| `className / style / id / aria-* / data-*`                    | React 原生属性                                                | Vue `$attrs` 的原生属性                             | Vue 原生映射             |
| `onClick / onMouseDown / onMouseEnter / onMouseLeave`         | React handlers                                                | `click / mousedown / mouseenter / mouseleave` emits | Vue 原生映射             |
| `HorizontalPaddingType`                                       | `left / right`                                                | 保留同名类型别名，并提供 Button 既有类型            | 类型等价                 |

## DOM、class 与事件顺序

- 根节点保持 `button.semi-button.semi-button-with-icon`，icon-only 增加
  `semi-button-with-icon-only`，loading 增加 `semi-button-loading`。
- 内容节点保持 `span.semi-button-content`。存在文字时按 `iconPosition` 增加
  `semi-button-content-right` 或 `semi-button-content-left`。
- icon 左右顺序、loading 替换、disabled 保留原 icon 的优先级与固定 Adapter 一致。
- `noHorizontalPadding` 只覆盖请求的方向，并保留调用方其余 inline style。
- Button 先执行 disabled 门禁；未 disabled 时 IconButton 再向调用方发出公开事件，单次原生事件只发出一次。
- `class/style/id/data-*/aria-*` 落到原生 button；声明的组件事件不会重复混入 `$attrs`。

## VNode 与显式性门禁

- IconButton 总是向 Button 提供 icon slot，即使调用方省略 `#icon`，以保持上游空 IconButton
  仍具有 `with-icon / with-icon-only` class 的行为。
- 默认 slot 仅在调用方实际提供时转发，不能因为包装器产生空 slot 而丢失 icon-only 判定。
- template 宿主与 `h()` 宿主都验证 icon VNode、default slot、disabled/loading 和 attrs 最终落点。
- colorful fill 继续由 Button 的范围受限 VNode 克隆边界注入；IconButton 不深层代理或保存 VNode。
- 本组件没有默认 `true` Boolean、子 VNode Boolean 读取、Portal 或 scroll/resize 定位逻辑。

## 可访问性、键盘与焦点

- icon-only 按钮不根据图标猜测可访问名称；调用方必须传入 `aria-label`。
- 根节点为原生 button，Enter/Space、tab focus 和 `:focus-visible` 由浏览器与 Button 样式提供。
- disabled 同时输出原生 `disabled` 与 `aria-disabled=true`，并阻止 click/mousedown/mouseenter/mouseleave emits。
- `htmlType` 映射到原生 `type`，默认保持 `button`，避免表单中的隐式提交。

## 样式、主题、RTL、国际化与动效

- `icon-button.css` 按 theme index → global → animation → button → iconButton → icons 顺序编译；
  根主题入口已包含相同固定源码。
- light/dark 由 `--semi-*` token 切换；IconButton 不创建额外主题状态。
- RTL 复用 Button 的固定 `rtl.scss`；左右 icon/文字结构保持上游 Adapter 顺序，由固定样式处理方向。
- 组件没有 locale 文案；zh-CN/en-US 只影响对照场景说明，不改变组件 DOM。
- loading spinner 使用固定 Button/IconButton rotate 动效；截图场景在固定动画时刻采样。
- 作为紧凑输入控件，视觉矩阵覆盖桌面/移动、light/dark 与 RTL。

## SSR 与发布边界

- import 和 render 不访问 `window/document`；服务端输出完整 button/content/icon DOM。
- 根包与 `./icon-button` 子路径同时导出组件和公开类型。
- 默认主题根 CSS 与 `./icon-button.css` 子路径均包含所需编译样式。
- 真实 tarball 消费验证覆盖根导入、子路径导入、类型、样式入口、SSR-safe import 与源码边界。

## 验收矩阵

| 层级                  | 门禁                                                                                                                              |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 单元                  | 缺省/空 icon-only、slot 与文字顺序、所有默认值、padding、loading/disabled、colorful fill、attrs、事件顺序、template 与 `h()` 宿主 |
| SSR                   | icon-only、图文、loading、class/style/data/ARIA、无 browser global                                                                |
| Chromium 行为         | click、disabled、Enter/Space、focus-visible、ARIA、loading、无运行时错误                                                          |
| computed style / 几何 | icon-only、图文、尺寸、主题、loading 对应节点逐项相等；rect 每轴差不超过 `0.5 CSS px`                                             |
| 视觉                  | 桌面与移动、light/dark、RTL；`threshold <= 0.1`、`maxDiffPixelRatio <= 0.001`，并独立检查 React/Vue PNG 字节                      |
| 发布                  | typecheck、构建、主题产物、SSR dist、真实 tarball 安装/导入/类型/样式/合规                                                        |

## Deviation

- React `icon`、`children`、`className` 和 `onXxx` 按 Vue 原生 slot、attrs 与 emits 迁移，属于框架 API
  映射，不是行为 deviation。
- 固定 React Adapter 的 `iconSize/iconStyle` 没有可观察 DOM 输出；Vue 将值交给 icon slot 使用，但组件自身不
  强制改写任意 VNode。这避免伪造上游不存在的行为，也为 Vue 调用方保留类型化扩展点。
- IconButton 在固定 changelog 中已标记“不再推荐但保留导出”。本切片完整保留兼容入口；新业务仍建议直接使用
  `Button` 的 `#icon` slot。

当前没有 accepted visual 或 behavior deviation。
