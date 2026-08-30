# Card v2.102.0 对齐矩阵

## 路线与权威来源

- 当前路线：最近完成 Calendar；Card 是固定 `vendor/semi-design/content/order.js` 中紧邻其后的公开组件。
- 固定基线：Semi Design `v2.102.0`，提交 `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- Adapter、公开类型与 DOM：`packages/semi-ui/card/index.tsx`、`cardGroup.tsx`、`meta.tsx`。
- 常量、样式与 RTL：`packages/semi-foundation/card/constants.ts`、`variables.scss`、`card.scss`、`rtl.scss`。
- 默认主题与 Token：`packages/semi-theme-default/scss/index.scss`、`global.scss`、`variables.scss`。
- 文档与行为语料：`content/show/card/index.md`、`index-en-US.md`、`packages/semi-ui/card/__test__/card.test.js`、`_story/card.stories.tsx`。
- Card 复用已经进入 `ready` 的 Typography、Space 与 Avatar。内置 loading 只需要固定 Skeleton 的 Title/Paragraph DOM 与样式子集，由 Card 私有占位组件承载，不提前发布后续 Skeleton 公共组件，因此可以独立形成完整切片。

## Vue 组件边界

| 文件                  | 单一职责                                                  | 公开契约                                 |
| --------------------- | --------------------------------------------------------- | ---------------------------------------- |
| `Card.vue`            | 组合 header、cover、body、actions、footer 与 loading 占位 | props、命名 slots、默认 slot、原生 attrs |
| `CardMeta.vue`        | 组合 avatar、title、description                           | props、同名 slots、原生 attrs            |
| `CardGroup.vue`       | 通过 Space 排列普通或 grid 卡片组                         | props、默认 slot、原生 attrs             |
| `CardNodeRenderer.ts` | 原样承载 prop 传入的 VNodeChild                           | Card 内部                                |
| `CardSkeleton.vue`    | 复现 Card 固定内置 Title + 三行 Paragraph 占位            | Card 内部                                |
| `types.ts`            | 公开联合类型、props 与 slots                              | 根入口与 `card` 子路径                   |

Card 是纯组合容器，没有 Foundation 状态机、Portal、Observer 或全局副作用；不创建无意义 composable。Card、CardMeta、CardGroup 分别保持单一职责，props 向下、slot 内容向内组合。

## 公开 API、默认值与 Vue 映射

### Card

| React v2.102.0       | Vue 契约                                      | 默认值 / 映射                                                     | 结论         |
| -------------------- | --------------------------------------------- | ----------------------------------------------------------------- | ------------ |
| `actions`            | `actions` prop 或 `#actions`                  | prop 为 VNodeChild 数组；slot 优先                                | Vue 原生映射 |
| `bodyStyle`          | `bodyStyle`                                   | 内容区 style                                                      | 等价         |
| `bordered`           | `bordered`                                    | `true`；缺省、显式 false、显式 true 分别验证                      | 等价         |
| `className`          | `className`，另接收 Vue `class`               | 根节点合并                                                        | Vue 原生映射 |
| `cover`              | `cover` prop 或 `#cover`                      | slot 优先；固定 `x-semi-prop="cover"`                             | Vue 原生映射 |
| `headerExtraContent` | `headerExtraContent` 或 `#headerExtraContent` | slot 优先；与 title 共同渲染                                      | Vue 原生映射 |
| `footer`             | `footer` prop 或 `#footer`                    | slot 优先                                                         | Vue 原生映射 |
| `footerLine`         | `footerLine`                                  | `false`；缺省、显式 false、显式 true 分别验证                     | 等价         |
| `footerStyle`        | `footerStyle`                                 | 页脚 style                                                        | 等价         |
| `header`             | `header` prop 或 `#header`                    | slot 优先；存在时覆盖 title 与 headerExtraContent                 | Vue 原生映射 |
| `headerLine`         | `headerLine`                                  | `true`；缺省、显式 false、显式 true 分别验证                      | 等价         |
| `headerStyle`        | `headerStyle`                                 | 标题区 style                                                      | 等价         |
| `loading`            | `loading`                                     | `false`；仅替换存在默认内容的 body 内容，actions 仍渲染           | 等价         |
| `shadows`            | `shadows`                                     | `hover \| always`；未设置时无阴影 class                           | 等价         |
| `style`              | `style`，另接收 Vue attrs style               | 根节点                                                            | Vue 原生映射 |
| `title`              | `title` prop 或 `#title`                      | slot 优先；字符串 prop 用 Typography.Title heading=6 单行 Tooltip | Vue 原生映射 |
| `children`           | 默认 slot                                     | 内容存在时才进入 loading/正文分支                                 | Vue 原生映射 |
| `aria-label`         | 原生 `aria-label` attr                        | 根节点                                                            | 等价         |

### CardGroup 与 CardMeta

| React v2.102.0             | Vue 契约                              | 默认值 / 映射                                                            | 结论         |
| -------------------------- | ------------------------------------- | ------------------------------------------------------------------------ | ------------ |
| Group `spacing`            | `spacing`                             | Adapter 源码真实默认 `16`；固定中英文文档表格写 `12px`，以运行时源码为准 | 源码优先     |
| Group `type`               | `type="grid"`                         | grid 时 Space spacing 强制为 `0`，并保留 `.semi-card-group-grid`         | 等价         |
| Group class/style/children | className、Vue class/style、默认 slot | attrs 透传到 Space 根节点                                                | Vue 原生映射 |
| Meta `avatar`              | `avatar` prop 或 `#avatar`            | slot 优先；存在时渲染 avatar wrapper                                     | Vue 原生映射 |
| Meta `title`               | `title` prop 或 `#title`              | slot 优先                                                                | Vue 原生映射 |
| Meta `description`         | `description` prop 或 `#description`  | slot 优先；title/description 任一存在时渲染 wrapper                      | Vue 原生映射 |
| Meta class/style           | className、Vue class/style            | attrs 透传根节点                                                         | Vue 原生映射 |

## DOM、class、样式与事件

- Card 根为 `div.semi-card`；保留 bordered、shadows、hover/always 状态 class，固定区域顺序为 header → cover → body → footer。
- header 只有 header/title/extra 存在时渲染；header 的优先级高于 title/extra。默认 title 字符串保留 `.semi-typography-h6`、单行 ellipsis 与 Tooltip 行为。
- body 始终存在。默认内容存在且 loading=true 时渲染 `.semi-skeleton.semi-skeleton-active`、Title、`br`、三行 Paragraph；没有默认内容时与固定 Adapter 一样不渲染 Skeleton。
- actions prop 只要是数组（包括空数组）就渲染 actions wrapper；每项保留 `.semi-card-body-actions-item` 与 `x-semi-prop="actions.N"`，Space 水平间距为 12px。`#actions` 将 slot 的顶层 VNode 逐项包装。
- cover、footer、Meta 各区域保留固定 wrapper 和 `x-semi-prop`。所有未知 attrs / data-* / 原生 listener 只落到组件根节点一次。
- CardGroup 普通模式使用可换行横向 Space；grid 模式清零 gap，并由固定 -1px margin 合并相邻边框。RTL 完全复用固定 SCSS，不以 JavaScript 重排节点。
- `shadows="hover"` 的 300ms box-shadow 动效只在 hover 时出现；`always` 静态出现。截图在稳定帧采集，hover 场景等待最终 transition frame。

## 键盘、焦点、ARIA、Portal、国际化与 SSR

- Card / CardGroup / CardMeta 都是容器，没有固定键盘状态机、tabindex 或焦点管理；内部按钮、链接等交互元素遵循自身组件契约。
- `aria-label` 与其他 `aria-*` 原样落在 Card 根；`aria-busy` 始终输出 loading 的布尔状态，与固定 Adapter 一致。
- Card 不创建 Portal。字符串 title 的 Typography Tooltip 复用已就绪 Tooltip；只有文本实际溢出并 hover 时才按 Typography 契约创建 Portal。
- Card 没有 Locale 文案；light/dark 使用主题 Token，RTL 使用 `.semi-rtl` / `.semi-portal-rtl` 固定样式。
- 所有组件 SSR-safe import/render；内置 loading 无 DOM global。字符串 title 的测量和 Tooltip 资源仍由已验证 Typography 在客户端生命周期内管理并清理。

## 测试与发布门禁

- 单元测试覆盖三组默认 true Boolean 门禁、header 优先级、title 字符串/VNode、cover/body/footer、loading 有无 children、actions prop/slot/空数组、shadow、attrs、Meta、Group spacing/grid 与 RTL class。
- SSR 覆盖 Card/Meta/Group、命名 slots、loading、ARIA、默认/显式 Boolean、grid 与原生 attrs；import 不触碰 DOM。
- React/Vue 场景覆盖基础卡、完整卡、loading、actions、Meta、CardGroup 普通/grid、border/shadow、hover、RTL 与可访问属性。
- 视觉覆盖桌面 `1440×900`、移动 `390×844`、light/dark 与 RTL；关键 computed style 精确相等，bounding rect 各轴误差 `<= 0.5px`，截图阈值 `<= 0.1` / `0.001`。
- 根与 `@aifuxi/semi-ui-vue/card` 子路径导出 Card、CardGroup、CardMeta 及公开类型；`Card.Meta` 复合入口可用。
- `@aifuxi/semi-theme-default/card.css` 同时包含 Card、Space、Typography、Tooltip 与内置 Skeleton 实际样式依赖；根 CSS 继续包含全部固定样式。
- 真实 tarball 验证根/子路径 ESM、声明、逐组件 CSS、tree-shaking、SSR-safe import、许可证与 SPDX SBOM。

## Deviation

- ReactNode props 均保留 render-function 可用的 VNodeChild prop，同时提供 Vue 命名 slots；slot 优先级在迁移表逐项说明，用户能力不减少。
- `Card.Meta` 同时提供更符合 Vue 导入习惯的 `CardMeta`；`Card.Group` 不属于固定 React 入口，Vue 提供独立 `CardGroup`，不额外伪造复合属性。
- Card 内置 loading 使用私有 `CardSkeleton` 复现固定 Card 实际调用的 Skeleton DOM；不提前暴露尚未完成垂直切片的 Skeleton 公共 API。这是发布边界隔离，不改变 Card 的 DOM、样式或行为。
- 无 accepted visual/behavior deviation；任何未解释差异均阻止 `pending -> ready`。

## 验收结论

- `pnpm check` 全量通过：60 个测试文件、454 项单元测试，以及 lint、类型、构建、主题、SSR 和真实 tarball 消费验证全部通过。
- `pnpm test:browser` 全量通过，共 238 项；其中 Card 专项 7 项覆盖默认值、交互、hover、ARIA、桌面/移动端 light/dark 与 RTL。
- 5 组 React/Vue 截图既通过测试内独立 Buffer 比较，也通过逐文件 `cmp`；关键 computed style 精确相等，几何差异处于 `0.5 CSS px` 门槛内。
- 当前垂直切片状态：`ready`；无已接受的视觉或行为 deviation。
