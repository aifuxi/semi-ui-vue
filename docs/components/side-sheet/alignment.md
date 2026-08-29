# SideSheet v2.102.0 对齐矩阵

## 路线与权威来源

- 当前路线：实时提交历史已完成 `ScrollList`；`SideSheet` 是固定 `vendor/semi-design/content/order.js` 中紧邻其后的公开组件。
- 已就绪依赖：Button/IconButton、Icons、ConfigProvider、Portal/Teleport、Modal 的 body scroll 与动效测试基础设施均已进入 `ready`。SideSheet 不依赖后续 Table、Tag、Notification 或 Feedback，可独立形成发布与 Chromium 验收闭环。
- 唯一基线：`vendor/semi-design` 的 `v2.102.0` / `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- Adapter/DOM：`packages/semi-ui/sideSheet/index.tsx`、`SideSheetContent.tsx`；Foundation/常量/样式：`packages/semi-foundation/sideSheet/`；中英文 API 与示例：`content/show/sidesheet/`。

## 组件边界

- `SideSheet.vue`：只负责公开 props/emits/slots、全局默认值、可见周期、Foundation、body scroll、Teleport 容器与动效结束时机。
- `SideSheetContent.vue`：只负责固定 mask/header/dialog/body/footer DOM、class、style、data 属性与关闭事件。
- `SideSheetNodeRenderer.ts`：只把 prop/slot 的 `VNodeChild` 安全渲染到固定 DOM 位置。

## 公开 API 与 Vue 映射

| v2.102.0 React API                      | 默认值               | Vue API / 验收                                                                                     |
| --------------------------------------- | -------------------- | -------------------------------------------------------------------------------------------------- |
| `visible`                               | `false`              | 同名 prop + `v-model:visible`；取消时先 emit `update:visible(false)`，再 emit `cancel(event)`      |
| `placement`                             | `right`              | `top/right/bottom/left`；保留 `.semi-sidesheet-{placement}` 与对应位移动效                         |
| `size`                                  | `small`              | `small/medium/large`；垂直位置为 448/684/920px                                                     |
| `width`                                 | size 宽度            | left/right 设置 inner；top/bottom 固定 `100%`；`mask=false` 时外层持有宽度、inner 为 `100%`        |
| `height`                                | 水平位置 `448`       | top/bottom 生效；left/right 为 `100%`                                                              |
| `mask`                                  | `true`               | 同名 prop；保留 `.semi-sidesheet-mask` 与 `aria-hidden=true`                                       |
| `maskClosable`                          | `true`               | 仅点击 mask 自身关闭，子内容冒泡不关闭                                                             |
| `closable`                              | `true`               | 标题栏 IconButton；`closeIcon` prop 或 `#closeIcon`，显式 null 保留上游默认 IconClose 语义         |
| `closeOnEsc`                            | `false`              | Window keydown；仅显式/全局开启时拦截 Escape 并取消                                                |
| `disableScroll`                         | `true`               | 仅默认 body Portal 锁定 body；自定义容器不锁；关闭/卸载完整恢复 overflow 与 width                  |
| `motion`                                | `true`               | 保留 mask/content 180ms class；`false` 立即卸载；离场结束后触发隐藏回调                            |
| `keepDOM`                               | `false`              | 关闭后保留并添加 `.semi-sidesheet-hidden`                                                          |
| `getPopupContainer`                     | body                 | 显式 prop > ConfigProvider；稳定容器首次可见即为 Portal 父节点，Portal style 为 `position: static` |
| `zIndex`                                | `1000`               | 应用于 `.semi-portal`                                                                              |
| `title/footer/children`                 | 无/null              | `#title/#footer/default` 优先于同名 prop；保留 `x-semi-prop`                                       |
| `bodyStyle/headerStyle/maskStyle/style` | 无                   | 同名 StyleValue；`style` 落在 inner，attrs style 不吞掉固定布局                                    |
| `className`                             | 无                   | `class`/`className` 合并到 `.semi-sidesheet`                                                       |
| `afterVisibleChange`                    | noop                 | prop 回调 + `afterVisibleChange` emit；打开进入渲染态、关闭完成离场后触发                          |
| `onCancel`                              | 无                   | `cancel` emit；兼容同名 prop，并避免同一函数重复调用                                               |
| `aria-label`                            | 无                   | 透传到 `role=dialog` 的 inner 节点                                                                 |
| `canVerticalSetWidth`                   | 无，内部公开类型存在 | 保留同名 prop；为 true 时允许 top/bottom 使用显式 width                                            |

默认值优先级统一为：当前 VNode 显式 camelCase/kebab-case prop > `semiGlobal.overrideDefaultProps.SideSheet` > 固定上游默认值。`closable/mask/maskClosable/motion/disableScroll/keepDOM/closeOnEsc/visible` 均覆盖缺省、显式 false、显式 true；不得使用 truthiness 推断是否传入。

## 状态与事件顺序

- 初始 `visible=false` 不渲染；初始 `visible=true` 挂载后执行 `beforeShow`，但不伪造一次 React 未产生的 prop-transition 回调。
- `false -> true`：先解除 `displayNone`、解析稳定容器并执行 Foundation `beforeShow`，随后触发 `afterVisibleChange(true)`。
- close/mask/Escape：Foundation `notifyCancel` -> `update:visible(false)` -> `cancel(event)`；受控父级决定实际关闭。
- `true -> false`：立即执行 Foundation `afterHide`（恢复 body 与移除 keydown）；`motion=false` 立即隐藏，`motion=true` 在 mask/content animationend 或 180ms 兜底后隐藏；只触发一次 `afterVisibleChange(false)`。
- `keepDOM=true` 时关闭后 DOM 保留但 `.semi-sidesheet-hidden { display:none }`；再次打开复用内容。

## DOM、样式、主题、RTL 与动效

- Portal -> `.semi-sidesheet` -> mask + `.semi-sidesheet-inner.semi-sidesheet-inner-wrap` -> content -> header/body/footer；不引入额外布局 wrapper。
- header 恒存在并有 `role=heading aria-level=1`；inner 有 `role=dialog tabindex=-1`。上游未设置 `aria-modal`、自动焦点或 focus trap，Vue 侧不借用 Modal 的额外语义。
- `direction=rtl` 仅添加 `.semi-sidesheet-rtl`；固定 SCSS 反转 direction 与标题对齐，placement 本身不交换。
- 独立 `side-sheet.css` 编译 theme/global/animation、Portal、Button/IconButton、SideSheet 与 Icons；根 CSS 已包含固定 SideSheet SCSS。
- light/dark 依赖固定 `--semi-*` Token；截图不使用 mask，动效场景固定为 `motion=false`，另用行为测试验证 180ms class/卸载时机。

## 键盘、Portal、国际化与 SSR 门禁

- closeOnEsc 缺省 false；开启时只在可见周期监听 window，Escape `stopPropagation` 后取消，关闭/卸载移除监听。
- 稳定自定义容器在首次可见时就是 `.semi-portal` 的父节点；自定义容器不修改 body scroll；ConfigProvider RTL 生效。
- 组件无 locale 文案；zh-CN/en-US 场景用相同结构、不同内容证明 VNode 内容可渲染。
- SSR import 和 render 不访问 document/window；可见态在服务端以内联稳定 Portal/dialog 结构输出，hydration 后再迁移至 body/稳定容器且无 hydration warning。

## 测试与发布证据

- 单元：默认 DOM/尺寸/位置、样式/data、slot 优先级、四个默认 true Boolean 的缺省/false/true、全局默认覆盖、mask/close/Escape 事件顺序、body scroll、稳定容器、keepDOM、motion 周期、RTL。
- Chromium：同进程 React/Vue 的来源、公开行为、computed style 与 bounding rect；桌面/移动 light/dark 和 RTL 成对局部 PNG，并直接比较独立 buffer。
- 发布：根/`side-sheet` ESM 与声明、逐组件 CSS、SSR-safe import、tree-shaking、合规产物和真实 tarball 消费。

## Deviation 与状态

- React `children/ReactNode/className` 映射为 Vue `slots/VNodeChild/class`，并增加原生 `v-model:visible` 与 emits；这是框架原生映射，不构成能力损失。
- 当前没有 accepted visual/behavior deviation。任一未解释的 DOM、样式、几何、事件或截图差异均阻止 `pending -> ready`。
- 当前状态：`ready`；固定源码、单元/SSR、主题/打包与 Chromium 全量门禁均已通过。
