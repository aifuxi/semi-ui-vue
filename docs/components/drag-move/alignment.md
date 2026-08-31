# DragMove v2.102.0 对齐矩阵

## 基线与选择理由

- 固定基线：`vendor/semi-design` 的 `v2.102.0`，提交
  `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- 路线：CodeHighlight 已完成；固定 `content/order.js` 在 Chat、CodeHighlight、
  MarkdownRender 后列出 DragMove。Chat/MarkdownRender 仍依赖较重的 Markdown/AI
  链路，DragMove 只依赖独立 Foundation，能够单独验证鼠标、触摸、约束、SSR
  与发布边界，因此作为下一垂直切片。
- React Adapter 与公开类型：
  `vendor/semi-design/packages/semi-ui/dragMove/index.ts`。
- Foundation：
  `vendor/semi-design/packages/semi-foundation/dragMove/foundation.ts`。
- 上游没有 DragMove 专属常量、SCSS、动效或图标资产。
- 中英文文档：`vendor/semi-design/content/plus/dragMove/`；行为补充来自
  `vendor/semi-design/packages/semi-ui/dragMove/__test__/dragMove.test.js` 与 `_story/`。

## Vue 组件边界

| 模块                               | 单一职责                                                                    | 契约                                       |
| ---------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------ |
| `DragMove.vue`                     | 归一化公开 props/emits，提供固定 Foundation Adapter，并管理挂载、更新和卸载 | props、默认 slot、鼠标/触摸 emits          |
| `DragMoveRenderer.ts`              | 校验唯一可渲染子 VNode、克隆它并合并 DOM ref                                | 不增加 DOM wrapper；保留调用方 ref         |
| `foundation-integration/drag-move` | 隔离固定 DragMove Foundation 与 `clampValueInRange`                         | 私有运行时边界；公开声明不泄漏 vendor 路径 |

组件必须接受且只接受一个可解析为 `HTMLElement` 的默认 slot 根节点。render function
只用于“无 wrapper 克隆单子节点并合并 ref”这一模板无法精确表达的边界；拖拽状态机仍由
固定 Foundation 负责。

## 公开 API 与默认值

| React v2.102.0     | Vue API                                              | 默认值/优先级                                              | 结论                            |
| ------------------ | ---------------------------------------------------- | ---------------------------------------------------------- | ------------------------------- |
| `children`         | `default` slot                                       | 必须为单个元素或根节点为 HTMLElement 的组件                | Vue 原生映射                    |
| `allowInputDrag`   | 同名 Boolean prop                                    | 显式 prop → `overrideDefaultProps.DragMove` → `false`      | 等价；覆盖缺省、显式 false/true |
| `allowMove`        | 同名函数 prop                                        | 未提供时允许                                               | 等价                            |
| `constrainer`      | 同名 prop，`() => HTMLElement \| null` 或 `'parent'` | 无约束                                                     | 文档与运行时并集                |
| `customMove`       | 同名函数 prop                                        | 未提供时写入 `top/left`                                    | 等价                            |
| `handler`          | 同名函数 prop                                        | 拖拽元素自身                                               | 等价                            |
| `positionStrategy` | 同名 prop                                            | 显式 prop → `overrideDefaultProps.DragMove` → `'absolute'` | 等价；运行中更新只刷新 position |
| `onMouseDown`      | `@mouse-down`                                        | 无                                                         | Vue emit                        |
| `onMouseMove`      | `@mouse-move`                                        | 无                                                         | Vue emit                        |
| `onMouseUp`        | `@mouse-up`                                          | 无                                                         | Vue emit                        |
| `onTouchStart`     | `@touch-start`                                       | 无                                                         | Vue emit                        |
| `onTouchMove`      | `@touch-move`                                        | 无                                                         | Vue emit                        |
| `onTouchEnd`       | `@touch-end`                                         | 无                                                         | Vue emit                        |
| `onTouchCancel`    | `@touch-cancel`                                      | 无                                                         | Vue emit                        |

React 类型漏写但 `propTypes`、`defaultProps`、Foundation 和文档均公开使用
`allowInputDrag`，Vue 类型按全部固定证据保留该 prop。React `propTypes` 中遗留的
`constrainNode` 不在 TypeScript 公开接口、文档或运行时读取路径中，不作为公开 API。

## 状态、事件顺序与移动算法

- 挂载时解析拖拽元素；无有效元素时抛出 `drag element must be a valid element`。
- `positionStrategy` 缺省为 absolute，挂载时直接写入元素 `style.position`；relative
  保留原布局位置并基于 computed `left/top` 累加指针位移。
- handler 缺省为拖拽元素本身；初始化时写入 `cursor: move`，并只在 handler 上注册
  `mousedown` / `touchstart`。
- pointer start 顺序固定为：计算约束范围 → 通知 start → 检查 input/textarea 与
  `allowMove` → 注册 document move/end/cancel → 记录偏移 → `preventDefault()`。
- `allowInputDrag=false` 时从原生 input/textarea 开始仍通知 start，但不阻止默认行为、
  不注册 document 监听，也不产生 move/end 回调；显式 true 恢复拖拽。
- move 先通知回调，再计算新位置；有 constrainer 时分别 clamp x/y；位置写入或
  `customMove` 在 `requestAnimationFrame` 中执行。
- mouseup/touchend/touchcancel 先通知，再移除对应 document 监听；卸载时同时移除
  handler start 与所有 document 监听。
- `positionStrategy` 更新只调用固定 `updatePositionStrategy()`；与 React
  `componentDidUpdate` 一致，不扩展成 handler/constrainer 动态重绑。

## DOM、class、样式与主题

- DragMove 自身不创建 DOM、不注入 class/ARIA，也不改变子节点 attrs/listeners；只克隆
  唯一子 VNode并合并 ref。
- 调用方的原始 ref 必须与内部 DOM 捕获同时生效；模板宿主与 `h()` 宿主各有门禁。
- 固定源码没有 `.semi-*` class 或专属 SCSS。逐组件 `drag-move.css` 只按固定主题
  `index.scss → global.scss` 编译 Token/暗色模式，场景视觉由共享、同源 harness CSS
  明确提供，不伪造组件选择器。
- 关键 computed style：position、cursor、left、top、width、height、backgroundColor、
  color；拖动前后 bounding rect 各轴 React/Vue 差值不超过 0.5 CSS px。

## 键盘、焦点、ARIA、Portal、动效、RTL、国际化

- 固定 Adapter 是指针拖拽工具，不添加键盘、tabIndex、role 或 ARIA；子节点既有键盘、
  焦点和 ARIA 保持不变。
- 无 Portal、Teleport、Observer、resize/scroll 重定位或组件动效。
- Foundation 坐标按物理 `left/top` 工作，不根据 RTL 反转；RTL 场景验证相同物理拖动
  和最终几何，不新增方向语义。
- 无 locale 文本或国际化分支；共享中性场景在 zh-CN 下验收即可。

## SSR 与 hydration

- import 与 SSR render 不访问 `window`、`document`、`HTMLElement` 或
  `requestAnimationFrame`；服务端只输出原 slot 根节点及调用方 attrs/style。
- hydration 后才初始化 Foundation、写入 position/cursor 并注册事件；必须无 hydration
  warning，卸载后 document 事件不再触发。

## 验收矩阵

- 单元：唯一 DOM/组件子节点与原 ref、无效多子节点、absolute/relative 更新、默认
  handler/自定义 handler、parent/函数 constrainer、absolute/relative clamp、
  input 三态、allowMove、customMove、鼠标/触摸顺序、preventDefault、RAF 与卸载清理。
- SSR/hydration：纯 slot 输出、无 browser global、hydration 后 position/cursor/拖动、
  无警告与卸载清理。
- Chromium：固定源码请求来源；React/Vue 默认与 handler 场景；鼠标拖动、约束、
  relative、自定义移动、input 禁止/允许；computed style/几何；desktop/mobile 的
  light/dark 与 RTL 裁剪截图。
- 发布：根导出和 `./drag-move` 子路径 ESM/声明、`./drag-move.css`、tree-shaking、
  SSR-safe import、真实 tarball consumer、许可证/SBOM 与无 vendor/private 路径。

## Deviation

- `children` 采用 Vue 默认 slot，回调采用 Vue emits，属于框架原生映射，不改变行为。
- React 可用 class component 或 `forwardRef` 解析 DOM；Vue 对应支持原生元素和根节点为
  HTMLElement 的组件，并通过合并 VNode ref 保留调用方 ref。
- 除上述框架语法映射外，无 accepted deviation。

## 完成证据

- Foundation/UI/Test Infra/React/Vue 工作台定向 typecheck 通过。
- DragMove 单元与 SSR/hydration 共 10 项通过；共享场景与两端工作台定向测试通过。
- Chromium 当前组件 7 项在更新快照后以无更新参数复跑通过，覆盖固定源码请求、5 个
  computed-style/几何目标、交互，以及 desktop/mobile light/dark 与 RTL；工作台 smoke
  2 项通过。React/Vue 截图通过逐像素阈值比较，不宣称 PNG 文件字节一致。
- 受影响链路通过：源码边界、UI ESM/声明构建、主题构建与逐组件入口、SSR dist import。
- 真实 tarball consumer 的安装、根/子路径 ESM 与声明、类型、样式、SSR import、许可和
  SBOM 验证通过，公开产物未泄漏 vendor 或私有包路径。
- 未运行全仓 `pnpm test:browser`：本切片只新增 DragMove 组件、场景注册和组件作用域
  harness CSS，没有修改共享运行时、全局主题、Playwright 配置或比较算法。
