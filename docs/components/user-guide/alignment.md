# UserGuide 对齐矩阵

状态：`ready`。唯一基线为 Semi Design `v2.102.0` / `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。

## 路线与依赖

- 当前 README 已完成 76/85，最新为 Feedback。固定 `content/order.js` 中 UserGuide 位于 Tooltip 之后；当前剩余路线里的 AIChatInput 需要新增 Tiptap/ProseMirror 链，Sidebar 依赖尚未 ready 的 JsonViewer 与相同富文本链。
- UserGuide 的 Button、Popover、Modal、Locale、Portal 与默认主题依赖均已 `ready`，没有新增第三方运行时，可在当前工作区独立完成源码、SSR、浏览器和真实包验收，因此作为本次切片。
- 固定源码证据：`packages/semi-ui/userGuide/index.tsx`、`packages/semi-foundation/userGuide/{foundation,constants,userGuide,variables,animation}.*`、`content/show/userGuide/` 与 `_story/`。

## 组件边界

| 边界                        | 单一职责                                                      | 状态与副作用                                               |
| --------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------- |
| `UserGuide.vue`             | 接入固定 Foundation，维护 current/spotlight，编排 popup/modal | 持有非受控 current、目标矩形、body scroll 锁与测量生命周期 |
| `UserGuidePopupContent.vue` | 渲染 popup 的 cover/title/description/indicator/buttons       | 无持久状态；只通过事件上抛 prev/next/skip                  |
| `UserGuideModalContent.vue` | 在既有 Modal 中渲染 cover/indicator/body/footer               | 无持久状态；只通过事件上抛 prev/next/skip                  |
| `UserGuideNodeRenderer.ts`  | 把 `VNodeChild` 安全渲染到模板树                              | 无状态                                                     |
| Foundation facade           | 隔离固定上游状态机和常量                                      | 不把 `vendor/**` 泄漏到公开声明或运行时导入                |

## API 与 Vue 映射

| React v2.102.0                        | 默认值        | Vue 契约                                      | 门禁                                                           |
| ------------------------------------- | ------------- | --------------------------------------------- | -------------------------------------------------------------- |
| `current`                             | `0`           | `current`；`v-model:current` / `@change`      | 缺省为非受控；显式 `0` 仍是受控；prev/next 事件顺序            |
| `visible`                             | `false`       | `visible`                                     | 打开重置非受控 current；关闭恢复 body；不擅自自动关闭          |
| `mask`                                | `true`        | `mask`                                        | 缺省、显式 false/true；popup SVG 与 modal mask                 |
| `mode`                                | `popup`       | `mode="popup                                  | modal"`                                                        | 两种模式，隐藏/空 steps 不渲染                           |
| `steps`                               | `[]`          | `UserGuideStepItem[]`                         | target Element/函数，step 覆盖，VNodeChild 内容                |
| `finishText`                          | locale.finish | `finishText`                                  | 最后一步覆盖；否则跟随 Locale                                  |
| `nextButtonProps` / `prevButtonProps` | `{}`          | Vue Button props + attrs + `content`          | 用户 props 按上游 spread 顺序覆盖默认；内容单独映射            |
| `showPrevButton` / `showSkipButton`   | `true`        | 同名 Boolean props                            | 缺省、显式 false/true；首步/末步条件                           |
| `spotlightPadding`                    | `5`           | 同名 number                                   | 固定 Adapter 使用 truthy fallback；step/global 的 0 均回退为 5 |
| `theme`                               | `default`     | `default                                      | primary`                                                       | 全局或 step 任一为 primary 即启用 primary 颜色与按钮主题 |
| `position`                            | `bottom`      | Popover position                              | step position 优先；showArrow=false                            |
| `className` / `style`                 | -             | `class`/`className`、`style`                  | 仅作用于 popup Popover，与上游一致                             |
| `getPopupContainer`                   | -             | 同名函数                                      | 固定 Adapter 仅用它决定是否锁 body，不把其误宣称为 Portal 容器 |
| `zIndex`                              | `1030`        | 同名 number                                   | 固定 Adapter 只施加于 spotlight SVG                            |
| callbacks                             | noop          | `@change/@next/@prev/@skip/@finish`           | 参数与顺序一致；`update:current` 与 change 同步发出            |
| ReactNode 字段                        | -             | step VNodeChild；`#cover/#title/#description` | scoped slot 优先于当前 step 字段，模板调用无需 JSX             |

## 状态与事件顺序

- 受控判定必须读取原始 VNode props，不能以 `props.current !== undefined` 代替；显式 `current=0` 是受控，缺省才是非受控。
- 非受控 next：先发 `change(newCurrent)` 与 `update:current`，再发 `next(newCurrent)`，随后写 current；末步只发 `finish`，不再发 change/next。
- 非受控 prev：固定 Foundation 在 React 批处理语义下表现为写入请求、再发 change、最后 prev；Vue Adapter 必须保留该外部事件顺序，不能因同步赋值吞掉 change。
- 受控 next/prev 不直接写 current，只发 change/update 与 next/prev，等待父级回写。
- visible 从 false 变 true 时，非受控 current 回到 0、锁 body 并测量；变 false 或卸载时恢复 body。已有 hidden body 不得被错误恢复。
- `step.mask` 在 v2.102.0 类型和文档中存在，但固定 Adapter 的 popup spotlight 实际只读取全局 `mask`；这是源码事实，见 Deviation。

## DOM、class、视觉与动效

- popup 保留 `.semi-userGuide-popover`、`.semi-userGuide-popup-content*`、cover/body/title/description/footer/buttons/indicator；Popover 的外层、箭头与定位由已 ready Popover 负责。
- spotlight 保留固定全屏 SVG、唯一 mask id、圆角 4、四块 transparent rect；spotlight rect 采用 200ms `cubic-bezier(0.4, 0, 0.2, 1)` 过渡。
- modal 复用已 ready Modal，保留 `.semi-userGuide-modal*` 的 cover、圆点 indicator、body、footer 与按钮顺序。
- 默认 popup 宽 400px、cover 高 200px、body padding 24px；modal cover/content 宽 600px、高 300px。light/dark 只依赖固定 Token；RTL 没有 UserGuide 专属选择器，沿用 Button/Popover/Modal 方向能力。
- 桌面 1440x900、移动 390x844 均覆盖 light/dark；方向敏感的 popup 再覆盖 RTL。

## 测量、滚动、Portal 与清理

- popup 打开和 current 变化时解析 target；目标不在 viewport 时调用 `scrollIntoView({ behavior: 'auto', block: 'center' })`，随后测量并在 RAF 写 spotlight rect。
- 目标函数返回空值时不创建 popup/spotlight，也不抛错；这是对固定 changelog 所述空目标修复意图的安全适配，浏览器与单测均覆盖。
- 固定 UserGuide 不注册 resize/capture-scroll listener；Popover 自身按既有契约重定位。不得新增无源码依据的 Observer/轮询。
- `getPopupContainer` 在固定 UserGuide 仅影响 body scroll 锁；Popover/Modal 没有接收该 prop。Vue 保留这一事实并在迁移文档明确，不伪造自定义 Portal 承诺。
- 默认 body 容器场景锁定 overflow/width；自定义 getter 场景不锁；隐藏和卸载必须无残留 RAF、mask 或 body 样式。

## 键盘、焦点、ARIA、国际化与 SSR

- 按钮沿用原生 Button 的键盘与 disabled/loading 行为；Popover dialog role、箭头、焦点与 Modal `role=dialog`/Escape/焦点恢复沿用已 ready 组件。
- spotlight 的 transparent rect 按固定 DOM 拦截遮罩区域指针；无遮罩时不生成这些 rect。UserGuide 不新增独立 tab stop。
- 文案读取 `locale.UserGuide.skip/next/prev/finish`，zh-CN/en-US 与 57 locale 生成数据均可渲染；缺失配置回退固定默认文案。
- SSR import 不访问 DOM；不可见或空 steps 不输出 Portal。服务端显式 visible 也不解析 Element，hydration 后再测量。
- 根导出、`./user-guide` 子路径、`user-guide.css`、SSR-safe dist、tree-shaking、真实 tarball consumer 和合规清单必须通过。

## React/Vue 对照场景

- popup 场景：三步、默认/primary、cover、step position/showArrow/spotlightPadding 覆盖、next/prev/skip/finish、遮罩与滚动测量。
- modal 场景：三步 cover/indicator/title/description、按钮定制、mask true/false、Locale。
- computed style 精确比较 popup/spotlight/modal 的颜色、字号、行高、padding、gap、宽高、圆角、z-index；对应节点 bounding rect 各轴差 `<=0.5 CSS px`。
- 截图覆盖 desktop/narrow light/dark 与 RTL；窄视口只验证弹层可视边界，不表示移动端兼容。仓库阈值通过后另做 React/Vue 成对解码像素比较。

## Deviation

- `StepItem.mask`：固定 v2.102.0 类型和文档声明“覆盖全局”，但 `renderSpotlight()` 只读取 `this.props.mask`，从未读取 `step.mask`。Vue 为保持运行时对齐也只使用全局 mask；用户影响是 step 级 mask 无效。验收结论：记录为 accepted source deviation，不把文档声明伪装成已实现行为。
- `getPopupContainer`：固定 Adapter 只用它跳过 body scroll 锁，并未传给内部 Popover/Modal。Vue 保留该运行时行为；用户影响是该 prop 不改变 Portal 父节点。验收结论：记录为 accepted source deviation，并在迁移文档建议使用 ConfigProvider 的 `getPopupContainer` 控制既有浮层容器。

## 验收证据

- 单元与 SSR：UserGuide 11 条用例覆盖 Boolean 缺省/显式值、受控父级回写、非受控事件顺序、空目标、源码 deviation、modal、slots、body 清理与 hydration。
- React/Vue Chromium：7 条场景覆盖 pinned source 请求、Portal、popup/modal 行为、desktop/narrow light/dark 与 RTL；关键节点样式精确相等，几何差值不超过 `0.5 CSS px`，成对像素阈值保持 `0.1 / 0.001`。
- 固定弹层宽 400px、大于 390px 窄 viewport；为避免 `locator.screenshot()` 自动滚动改变 fixed 弹层底图，测试对当前 viewport 内的共同裁剪区域做像素比较，并继续对完整节点做样式与几何断言。
- 发布边界：`user-guide` 根导出、子路径声明、`user-guide.css`、主题依赖顺序、SSR-safe dist、真实 tarball 安装/导入/类型/样式与合规产物均已纳入仓库门禁。
