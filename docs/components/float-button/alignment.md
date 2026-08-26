# FloatButton v2.102.0 对齐矩阵

## 固定证据

- React Adapter：`vendor/semi-design/packages/semi-ui/floatButton/index.tsx`
- Group Adapter：`vendor/semi-design/packages/semi-ui/floatButton/floatButtonGroup.tsx`
- 公开类型：`vendor/semi-design/packages/semi-ui/floatButton/interface.ts`
- Badge DOM：`vendor/semi-design/packages/semi-ui/badge/index.tsx`
- Foundation 常量与样式：`vendor/semi-design/packages/semi-foundation/floatButton/`
- Badge 样式：`vendor/semi-design/packages/semi-foundation/badge/badge.scss`
- 中英文文档：`vendor/semi-design/content/basic/floatbutton/`

以上文件均来自只读 submodule 的 `v2.102.0` / `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。

## 组件边界

- `FloatButton.vue` 负责根容器、body、跳转与 click 顺序；图标使用 `icon` slot 或兼容 VNode prop。
- `FloatButtonGroup.vue` 负责 items 和固定 Adapter 的根级事件委托；`item` slot 是 ReactNode 的 Vue 原生映射。
- `FloatButtonBadge.vue` 只复现 FloatButton 所公开 `badge` 配置需要的 Badge DOM/class，不导出独立 Badge 公共组件。
- `FloatButtonNodeRenderer.ts` 仅渲染 VNode/string/number，不持有状态或副作用；没有必要引入 composable。

## 公开 API 与默认值

| 固定 React API      | v2.102.0 行为                                     | Vue API                              | 结论         |
| ------------------- | ------------------------------------------------- | ------------------------------------ | ------------ |
| `shape`             | `round / square`，默认 `round`                    | 同名 typed prop                      | 等价         |
| `size`              | `small / default / large`，默认 `default`         | 同名 typed prop                      | 等价         |
| `colorful`          | 默认 false，切换 AI 渐变背景 class                | 同名 boolean prop                    | 等价         |
| `disabled`          | body 增加 disabled class，阻止跳转和 `onClick`    | 同名 prop，阻止 `click` emit         | 等价         |
| `href / target`     | click 时先跳转；`_blank` 使用 `window.open`       | 同名 prop，相同执行顺序              | 等价         |
| `icon`              | ReactNode                                         | `icon` slot；兼容 VNode prop         | Vue 原生映射 |
| `badge`             | 完整 BadgeProps：count/dot/type/theme/position 等 | 同名 typed object prop               | 等价         |
| `onClick`           | 未禁用时在跳转后调用                              | `@click` emit                        | Vue 原生映射 |
| `className / style` | 根 div                                            | 原生 `class / style` attrs           | Vue 原生映射 |
| Group `items`       | value/content/icon/badge 数组，必填               | 同名 typed prop                      | 等价         |
| Group `disabled`    | 只增加 group disabled class，不阻止委托 click     | 保留固定行为                         | 等价         |
| Group `onClick`     | 从实际 `event.target.dataset.value` 读取 value    | `@click(value, event)`，相同读取位置 | Vue 原生映射 |

组件无受控/非受控状态，不修改调用方 props。Group 源码中的 `shape/type/size` 静态默认值没有公开 prop，也不参与 DOM，Vue 不暴露无效配置。

## DOM、class、样式与事件

- FloatButton 根节点是 `div.semi-floatButton.semi-floatButton-{size}.semi-floatButton-{shape}`；body 是直接子 `div.semi-floatButton-body`，使用相同 size/shape class。
- `colorful` 与 `disabled` class 只在 body；badge 存在时 body 位于 `span.semi-badge` 内。
- Badge 数字遵循 `overflowCount+`，dot 不渲染内容，自定义 count 使用 `semi-badge-custom`；默认位置为 `rightTop`。
- Group 根节点是 `div.semi-floatButtonGroup`，每项为 `div.semi-floatButtonGroup-item[data-value]`；badge 包裹关系与固定 Badge Adapter 一致。
- 未禁用 FloatButton 的事件顺序是 `_blank window.open` 或当前页赋值，再 emit `click`。Group 保留根级委托，因此点击 item 自身返回 value，点击没有 `data-value` 的深层节点可能返回 `undefined`；不静默修复固定行为。
- 逐组件 CSS 同时编译主题/global、FloatButton、其嵌入 Badge 和 icons 样式。

## 可访问性、主题与运行环境

- 固定 Adapter 使用不可聚焦 div，未内建 button role、tabindex 或键盘触发；Vue 保持 DOM 契约，不伪装成原生 button。调用方可通过 attrs 增加 `role`、`tabindex` 与 ARIA，后续大版本若改善语义需记录为显式变更。
- Badge 仅作视觉状态；可访问名称应放在 FloatButton 根 attrs。
- light/dark、hover、active、disabled 和 colorful 使用固定 Token；desktop/mobile 均验证，方向无专属 RTL 规则但仍验证 dir 组合。
- import 和 SSR render 不访问浏览器全局；`window` 仅在真实 click 且存在 href 时访问，hydration 无警告。

## 验收矩阵

| 证据                  | 场景                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------- |
| 单元行为              | 默认 DOM、attrs、尺寸/形状、colorful、disabled、跳转/click 顺序、Badge、Group 委托、SSR/hydration |
| Chromium 行为/无障碍  | 固定源码请求、禁用不触发、Group value、无默认键盘语义、hover/active、无运行时错误                 |
| computed style / 几何 | 八个目标的尺寸、圆角、背景、颜色、阴影、badge 与 group 布局逐项相等；各轴误差不超过 0.5px         |
| 视觉                  | desktop 1440×900 与 mobile 390×844，light/dark；额外 desktop light RTL；组件裁剪                  |
| 发布                  | 根/`float-button` 子路径 ESM 与 types、`float-button.css`、SSR import、真实 tarball 安装          |

截图门槛保持 `threshold=0.1`、`maxDiffPixelRatio=0.001`，并人工检查局部集中差异。

## Deviation

当前没有 accepted visual/behavior deviation。Vue 增加原生 attrs 透传、`icon`/`item` slots 与 emit 语法，是 ReactNode、className 和回调的 Vue 原生迁移，不改变固定场景 DOM、样式或事件顺序。
