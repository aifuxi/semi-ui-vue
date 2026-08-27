# Vue Adapter 对齐易错点

仅在组件具有默认 `true` 的 Boolean prop、读取子 VNode、Portal/Teleport 或滚动定位能力时读取本参考。这里记录的是会改变实现与验收决策的 React→Vue 适配差异，不是通用 Vue 教程。

## 1. 区分 Boolean 缺省与显式 false

Vue 的 Boolean prop 归一化可能让“调用方没有传入”与“调用方显式传入 `false`”在 `props` 对象中都表现为 `false`。当上游契约还包含组件默认值、全局默认值或 provider 默认值时，直接使用 `props.value ?? true` 或普通 truthiness 会破坏优先级。

需要区分显式性时：

- 从当前组件原始 VNode props 判断 camelCase/kebab-case 键是否存在，再读取归一化后的 prop 值。
- 明确记录优先级，例如“显式 prop → 全局覆盖 → 上游默认值”。
- 不要仅为绕开 Vue 转换而更改公开 prop 类型；保留 Vue 原生调用方式。

最低门禁：

- 缺省、显式 `false`、显式 `true` 三组测试。
- 存在全局/provider 覆盖时，增加“缺省采用覆盖、显式值优先”测试。
- 对视觉或定位有影响的默认值，必须在真实 Chromium 中验证最终 DOM/computed style，而不只检查内部计算结果。

## 2. 子 VNode 的裸 Boolean 不是普通 truthiness

SFC 模板中的 `<Button disabled>` 可能在子 VNode 上保存为 `disabled: ''`，而 render function 常见输入是 `h(Button, { disabled: true })`。`Boolean('')` 为 `false`，因此只用 render function 单测会漏掉真实模板分支。

读取子 VNode Boolean prop 时：

- 先判断键是否存在，再把“值不为显式 `false`”解释为启用；不要直接使用 `Boolean(node.props?.disabled)`。
- 同时覆盖缺省、裸属性、`:disabled="false"` 和 render function `true/false`。
- 若逻辑会克隆或包裹 disabled/loading 子节点，断言最终 DOM、样式、ARIA 和事件落点，不只断言 helper 返回值。

最低门禁必须同时包含真实 SFC 模板宿主与 `h()`/render function 宿主。

## 3. Portal 容器与父子挂载时序

Vue 子组件的 `onMounted` 可能早于父模板 ref 对调用方可用；若 `getPopupContainer()` 在此时用 `ref ?? document.body` 兜底，初始 Portal 会被挂到 body。React 的 ref/componentDidMount 时序不能直接作为 Vue 场景假设。

先区分两类契约：

- 对照场景只承诺稳定容器：预先创建容器，或等父 ref 可用后再挂载浮层，避免场景时序制造错误基线。
- 公开组件明确承诺容器可迟到或动态变化：依据上游证据实现重新解析/迁移，并为容器变化增加行为测试。

不要在未证明组件状态机有缺口前新增 Observer、轮询或全局监听。先记录首次调用时容器值、Portal 实际父节点和父子生命周期顺序，确认问题属于场景还是组件契约。

最低门禁：稳定自定义容器必须在首次可见时就是 Portal 父节点；只有公开契约要求时才增加“容器迟到/变化”测试。

## 4. Capture scroll 的事件目标不只 Element

在 `window.addEventListener('scroll', handler, true)` 中，`event.target` 可能是滚动 Element，也可能是 `Document` 等 Node。把目标强制缩窄为 `Element` 会漏掉页面滚动、`scrollIntoView` 和移动截图触发的重定位。

实现时：

- 以固定上游的 containment 语义为准；需要 `contains(trigger)` 时接受适用的 `Node`，不要先做 `Element` 限定。
- Element 滚动读取其自身 `scrollLeft/scrollTop`；Document 滚动按上游语义读取文档滚动节点。
- capture listener、节流 timer、RAF 和 Observer 必须在关闭或卸载时清理。

最低门禁：嵌套滚动容器、Document/page scroll、移动 viewport 的 `scrollIntoView` 后定位，以及卸载后不再响应。

## 编码前检查表

- 对齐矩阵已标记哪些 prop 需要区分“缺省”和显式 `false`。
- 读取子 VNode 时已经同时准备 template 与 render function 测试宿主。
- `getPopupContainer` 场景明确了容器在首次调用时是否已经存在。
- 滚动定位测试覆盖 Element 和 Document，且验证最终几何而不是私有状态。
- 临时诊断 Observer、日志、轮询和宽松截图阈值均未进入最终实现。
