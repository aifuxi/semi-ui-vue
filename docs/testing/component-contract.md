# 组件对齐与完整验收契约

新组件按完整公开面验收；已有组件修复只更新受影响的契约和证据。固定版本、工程边界见 [AGENTS.md](../../AGENTS.md)。

## 参考与公开 API

按问题查固定源码：`packages/semi-ui/<component>` 提供 Adapter、类型和 DOM；`packages/semi-foundation/<component>` 提供状态机、SCSS、动效与 RTL；`content` 提供双语示例与 API。主题、图标和插画只在涉及它们时读取。路径均相对 `vendor/semi-design`；[Inventory](../inventory/README.md) 提供索引。

组件名、枚举值和可自然保留的 prop 名沿用 Semi；React 专属 children、render props、ref 通过 Vue slots、emits、v-model 和 expose 适配，并在组件的 React→Vue 迁移表说明。保留样式依赖的 DOM、class、placement 与 Token，现有 Vue 实现和快照不是正确性来源。

## 运行时适配

- 公开状态支持对应的受控/非受控语义、默认值、事件顺序和动态 prop 更新；provide/inject 保持实例隔离。
- 区分 prop 缺省、显式 `false` 与 `true`，保持 default/provider 优先级。读取子 VNode Boolean prop 时兼顾 SFC 裸属性的 `''` 和 `h()` 输入，不能只做 truthiness 判断。
- Foundation、DOM、Observer 等身份敏感对象避免深层代理；DOM、Observer、事件在客户端创建并清理。所有公开 JavaScript 入口支持无 DOM 导入，适用组件验证 SSR render/hydration。
- Portal/定位需要覆盖自定义容器首次挂载、capture scroll 重定位与卸载。子组件 mounted 可能早于父容器 ref 就绪；按公开契约处理首次目标，不因一次回退就引入动态迁移。scroll target 可能是 Document，不能无依据收窄为 Element。
- 插槽内容必须在渲染期读取：`slots.x?.()` 的结果不得进入 `computed`/`watch` 等跨渲染缓存，否则父级重渲染后仍会渲染旧 VNode。读取插槽的派生值统一使用 `packages/ui/src/_utils` 的 `useRenderComputed`；`pnpm check:slots` 门禁拦截直接回退。
- 默认使用 SFC 模板；必需的 DOM/VNode 合并可局部使用 render function。

## 完整切片的交付

在 `docs/components/<component>/` 维护公开 API、默认值、状态、事件、Vue 映射、DOM/样式、键盘焦点、ARIA，以及适用的 Portal、动效、RTL、Locale、SSR 契约。完成时同时具备 Vue 源码、公开类型与样式、中英文文档/迁移说明、公开行为测试、React/Vue 浏览器对照和真实包消费证据。

未实现能力保持 pending。无法等价的差异需记录固定源码依据、原因、用户影响与验收结论；未解释的差异不能标记 ready。组件状态与缺口写入对应契约，不向 README 追加逐组件流水账。

中英文说明与迁移记录保留为仓库静态文档，不要求部署文档站或运行旧逐示例验收。历史文档批次不证明当前组件契约成立；文档站退役不改变公开行为、可访问性、主题与包消费的验证责任。

## 浏览器验收门槛

使用锁定 Playwright Chromium，在同一浏览器环境对照真实 React/Vue 场景；固定字体、数据、viewport、DPR、Locale、主题和动画时刻。真实焦点、拖拽、Portal 和动效由浏览器证据证明。

| 项目        | 要求                                                                                     |
| ----------- | ---------------------------------------------------------------------------------------- |
| 计算样式    | 关键 computed style 逐项精确相等                                                         |
| 几何        | 对应 bounding rect 各轴差值 ≤ 0.5 CSS px                                                 |
| 像素        | `threshold ≤ 0.1`、`maxDiffPixelRatio ≤ 0.001`                                           |
| 默认矩阵    | 桌面 1440×900、DPR 1、light/dark                                                         |
| 专项矩阵    | 方向敏感组件加 RTL，国际化敏感组件加 zh-CN/en-US                                         |
| 窄视口/触摸 | 固定公开契约涉及响应断点、触摸或可视边界时增加 390×844、DPR 1 等专项；不作移动端兼容承诺 |

全部 57 个 Locale 另需数据完整性、公开导出和可渲染验证。状态矩阵按组件覆盖 hover、active、focus-visible、disabled、loading、validation、开关与键盘等实际能力。

裁剪组件、Portal 或最小完整场景，不能用整页面积稀释差异。数值通过仍需处理可见的集中差异；mask 仅限有证据的非确定内容并注明最小范围。不得盲目更新快照。runner、来源证明和跨平台截图规则见 [React/Vue 对照](react-vue-parity.md)，检查命令见[验证入口](validation.md)。
