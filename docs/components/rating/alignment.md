# Rating v2.102.0 对齐矩阵

## 选择与源码证据

Rating 是固定 `vendor/semi-design/content/order.js` 中 Radio 之后的下一项。它只依赖已经进入 `ready` 的 Icon、Tooltip、ConfigProvider 与基础主题能力，不需要提前引入 Form、日期或 Tree 依赖域，因此可以独立形成可发布、可验证的垂直切片。

- 公开 Adapter：`vendor/semi-design/packages/semi-ui/rating/index.tsx`、`item.tsx`
- Foundation：`vendor/semi-design/packages/semi-foundation/rating/{foundation,constants}.ts`
- 样式：`vendor/semi-design/packages/semi-foundation/rating/{rating,variables,animation,rtl}.scss`
- 中英文文档：`vendor/semi-design/content/input/rating/`
- 行为证据：`rating/__test__/rating.test.js`、`cypress/e2e/rating.spec.js` 与 `_story/`

## 组件边界

| Vue 模块                | 单一职责                                                      | 公开契约                                                |
| ----------------------- | ------------------------------------------------------------- | ------------------------------------------------------- |
| `Rating.vue`            | 受控/非受控评分、事件顺序、方向、焦点、Tooltip 组合与公开命令 | props、emits、`character` slot、`v-model`、`focus/blur` |
| `RatingItem.vue`        | 单个整星/半星/空值项的 DOM、ARIA、命中、尺寸与 focus-visible  | 私有 props/emits、`starFocus/getDomNode`                |
| `RatingNodeRenderer.ts` | 把 Vue `VNodeChild` 安全放入上游要求的两个星形层              | 私有 `content` prop                                     |
| Foundation integration  | 内联固定上游 Rating/Item 状态机，隔离 `vendor/**`             | 私有 Adapter 边界                                       |

## API、默认值与 Vue 映射

| React v2.102.0                             | 默认值            | Vue 契约                                            | 状态/门禁                                                                                 |
| ------------------------------------------ | ----------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `value` / `defaultValue`                   | `undefined` / `0` | 同名 props；增加 `modelValue` / `update:modelValue` | 显式 `value`（即使为 `undefined`）保持受控；缺省为非受控                                  |
| `count`                                    | `5`               | `count`                                             | 实际渲染 `count + 1` 项，最后一项代表 0 分并为 0 尺寸                                     |
| `allowHalf`                                | `false`           | `allowHalf`                                         | LTR/RTL 按真实项宽与指针位置计算半星                                                      |
| `allowClear`                               | `true`            | `allowClear`                                        | 必测缺省、显式 `false`、显式 `true`，不能用 truthiness 改写默认                           |
| `disabled`                                 | `false`           | `disabled`                                          | 禁止鼠标、键盘与公开 focus/blur，全部 radio `tabindex=-1`                                 |
| `character`                                | `IconStar`        | `character` prop；`#character` slot 优先            | 字符串同时成为 ARIA 语义前缀；VNode 不改变 `.semi-*` 层级                                 |
| `size`                                     | `default`         | `small \| default \| number`                        | 数值同步设置 width/height/font-size；默认图标 `extra-large`                               |
| `tooltips`                                 | -                 | `tooltips`                                          | 复用 ready Tooltip，`trigger=custom`；首次可见 Portal 落在既有稳定容器策略                |
| `tabIndex`                                 | `-1`              | `tabIndex`                                          | disabled 强制 -1；当前值对应子 radio 为 0                                                 |
| `autoFocus` / `preventScroll`              | `false` / -       | 同名 props                                          | mount 后聚焦当前值；0 分聚焦隐藏空值项；传递 preventScroll                                |
| `prefixCls` / `className` / `style` / `id` | `semi-rating`     | 同名 props；Vue `class/style` attrs 合并            | 保留根 DOM、data attrs 与样式兼容契约                                                     |
| `onChange`                                 | noop              | `change`、`update:modelValue`                       | 非受控先更新再通知；受控只通知，等待回写                                                  |
| `onHoverChange`                            | noop              | `hoverChange`                                       | 进入不同值时通知；离开通知 `undefined`                                                    |
| `onFocus/onBlur/onKeyDown`                 | -                 | `focus/blur/keyDown`                                | 保持 React 合成事件的后代 focus/blur 语义与键盘回调顺序                                   |
| ARIA props                                 | -                 | 同名 kebab/camel props                              | 根 label 按 `Rating: value of count ...`；子 radio 保留 posinset/setsize/checked/disabled |

`onClick` 虽出现在上游公开 TypeScript 接口中，但 v2.102.0 Adapter 从未调用该回调；Vue 类型保留对应 `click` 事件名但运行时不额外通知，以免制造与固定基线不同的事件。

## 状态、事件与交互

- 初值为 `value/modelValue`（显式且非 `undefined`）或 `defaultValue`；受控点击不修改内部显示。
- hover 通过真实 `pageX` 与项几何计算，半星在 RTL 中反向；mouse leave 清空 hover，并通知 `undefined`。
- 点击当前值且 `allowClear=true` 时变为 0；显式 `allowClear=false` 不清空。
- ArrowRight/ArrowUp 在 LTR 增加、ArrowLeft/ArrowDown 减少；RTL 水平方向与上游一样整体反转；越过 count 回到 0，低于 0 回到 count。
- 键盘步长为整星或半星；事件顺序为 `keyDown` → `change/update:modelValue` → 焦点迁移 → `hoverChange(undefined)`，并 `preventDefault()`。
- Enter 由单项 wrapper 转成同项选择；autoFocus 使用当前评分对应 radio，0 分使用隐藏空值项。

## DOM / class / 样式

- 根节点为 `ul.semi-rating`，禁用与空值 focus-visible 分别增加 `semi-rating-disabled`、`semi-rating-focus`。
- 每项为 `li.semi-rating-star[-small|-default|-half|-full] > div.semi-rating-star-wrapper`。
- 半星含绝对定位的 `.semi-rating-star-first` 与完整 `.semi-rating-star-second`；整星只含 second。
- 默认项为 `24×24`、small 为 `16×16`、项间距 6px；未选色、已选色、focus outline、hover scale 与过渡直接编译固定 SCSS。
- RTL 由 ConfigProvider 的 `.semi-rtl` 包裹与 Foundation direction 同时驱动，项间距和半星裁剪方向均反转。

## 可访问性、Portal、主题、国际化与 SSR

- 根 label、子 `role=radio`、`aria-checked`、`aria-posinset`、`aria-setsize`、`aria-disabled` 和 roving tabindex 精确对齐。
- Tooltip 只复用现有稳定 Portal/定位能力；Rating 不新增 Observer、全局 scroll 或自定义容器契约。单元测试查询真实 `document.body`，Chromium 验证实际弹层与几何。
- 视觉矩阵覆盖 desktop/mobile、light/dark；方向敏感场景另覆盖 RTL。Rating 无 Locale 文案依赖，zh-CN/en-US 复用相同静态数据即可。
- SSR 只输出 Rating DOM，不执行 autofocus、focus-visible 检测或 Tooltip Portal 挂载；公开根入口与子路径必须 SSR-safe import。

## 测试与完成门禁

- 单元：受控/非受控、allowClear 三态、半星命中、disabled、hover/leave、数值尺寸、字符 slot、Tooltip、事件顺序、focus/blur/autoFocus、ARIA、键盘环绕与 RTL。
- SSR：默认/半星/disabled/自定义字符与无 Portal 副作用。
- Chromium：同 BrowserContext 中行为、computed style、bounding rect、Portal 与截图；desktop/mobile light/dark，加 RTL。
- 发布：根/子路径导入、类型、`rating.css`、tree-shaking/SSR import、tarball 安装与合规扫描。

## Deviation

无 accepted deviation。

Vue 模板会在 `v-for` 片段边界生成注释锚点，因此不能照搬 React Adapter 中依赖 `childNodes[index]` 的焦点迁移写法；本实现仍由固定 Rating Foundation 负责评分状态机，只在 Adapter 层通过组件 ref 定位同一公开 radio。该实现差异不改变 DOM/class、焦点目标、事件顺序或键盘行为，单元测试与同一 Chromium 的 React/Vue 行为对照已验证等价。

状态：`ready`。`pnpm check` 已通过 259 个单元/SSR 测试、全包构建、主题产物、SSR import 与真实 tarball 安装验证；`pnpm test:browser` 已通过 140 个 Chromium 场景。Rating 的 desktop/mobile light/dark 与 RTL 截图、关键 computed style、bounding rect、Tooltip Portal、清空、键盘及焦点均与 React v2.102.0 参考场景一致。
