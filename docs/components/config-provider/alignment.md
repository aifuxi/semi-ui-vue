# ConfigProvider v2.102.0 对齐矩阵

## 固定源码证据

- React Adapter：`vendor/semi-design/packages/semi-ui/configProvider/index.tsx`
- Context：`vendor/semi-design/packages/semi-ui/configProvider/context.tsx`
- 响应式类型：`vendor/semi-design/packages/semi-ui/configProvider/responsiveTypes.ts`
- 默认 Locale：`vendor/semi-design/packages/semi-ui/locale/source/zh_CN.ts`
- 中文/英文文档：`vendor/semi-design/content/other/configprovider/`
- 场景语料：`vendor/semi-design/packages/semi-ui/configProvider/_story/`

固定版本为 `v2.102.0` / `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。ConfigProvider 没有独立 Foundation 或组件 SCSS；它只消费基础常量并提供 Context。

## 组件边界

- `ConfigProvider.vue`：合并公开 props，提供实例隔离的配置上下文，处理 RTL 包装并桥接 Typography locale。
- `ConfigConsumer.vue`：把最近 Provider 的公开上下文映射为 Vue scoped slot。
- `use-responsive-observe.ts`：管理断点快照、懒注册、两种订阅签名、动态配置与完整清理。
- `config-context.ts` / `types.ts`：维护类型化 InjectionKey、公开类型和默认六断点。
- `semi-global.ts`：保留与上游一致的进程级单例配置入口。

## 公开 API

| React v2.102.0                        | Vue 3.5                              | 结论                                                         |
| ------------------------------------- | ------------------------------------ | ------------------------------------------------------------ |
| `direction="ltr                       | rtl"`                                | 同名 prop                                                    | 等价；RTL 增加 `.semi-rtl` div，LTR 不增加元素 |
| `timeZone`                            | 同名 `string \| number` prop         | 等价透传到 Context                                           |
| `locale`                              | 同名对象 prop                        | 等价透传；当前已完成 Typography 直接消费其 `Typography` 字段 |
| `getPopupContainer`                   | 同名函数 prop                        | 等价透传，为后续 Portal 组件消费                             |
| `responsiveObserve=false`             | 同名 boolean prop                    | 等价；未启用时不访问 `matchMedia`                            |
| `responsiveMap`                       | 完整六断点对象                       | 等价；默认值与固定源码完全相同                               |
| `ConfigProvider.defaultResponsiveMap` | 同名静态属性                         | 等价                                                         |
| `ConfigConsumer` render function      | `ConfigConsumer` scoped default slot | Vue 原生映射                                                 |
| `children`                            | 默认 slot                            | Vue 原生映射                                                 |
| `semiGlobal.config`                   | 同名单例导出                         | 等价配置容器；具体组件在各自切片按固定源码支持清单接入       |

## 状态、订阅与生命周期

- 每个 Provider 拥有独立的 `screensListeners`、`changeListeners` 和 media-query 清理函数；嵌套 Provider 不共享状态。
- `onBreakpoint(callback)` 立即返回完整快照；`onBreakpoint(breakpoints, callback)` 按调用方断点顺序立即回调一次。
- 只有 `responsiveObserve=true` 且至少存在一个订阅时才注册六个监听；最后一个订阅取消后立即清理。
- `responsiveObserve` 从 true 变 false 时清理；重新开启且仍有订阅时重新注册。已注册期间替换 `responsiveMap` 会用新查询重新注册。
- 初始读取和监听注册均只在浏览器能力存在时执行；SSR 使用全 false 快照，不访问 `window`。

## DOM、样式、键盘与无障碍

- LTR 返回 slot Fragment；RTL 输出唯一的 `<div class="semi-rtl">`，子树顺序不变。
- 组件本身没有焦点、键盘、ARIA、Portal 或动效节点；相关契约由消费组件负责。
- 上游没有 ConfigProvider 专属 SCSS。`config-provider.css` 仅发布固定主题 Token/global，使逐组件样式入口可独立安装；RTL 效果来自各消费组件的固定 RTL 选择器。
- dark 不改变 Provider DOM；场景通过 Typography 和共享壳层分别验证 light/dark。移动视口用于验证断点快照变化。

## Locale、RTL、SSR 与迁移

- 默认配置保留 `zh-CN`、`CNY` 和当前已公开组件所需的 Typography 文案。完整 57 Locale 的数据导出、完整性和可渲染验证属于独立 Locale 垂直切片，不在 ConfigProvider 中复制上游数据。
- 用户传入的 Locale 对象保持开放结构，后续组件可按原字段直接消费，不需要修改 ConfigProvider 公共 API。
- React Context.Consumer 的 render function 在 Vue 中迁移为 `v-slot="context"`；Context 值只读消费，更新仍由 Provider props 和内部断点观察驱动。
- SSR import/render 不创建 DOM、media query 或全局监听；hydration 后首次订阅才读取真实断点。

## 验收证据

| 层级           | 覆盖                                                                                                                 |
| -------------- | -------------------------------------------------------------------------------------------------------------------- |
| 单元/SSR       | LTR/RTL DOM、公开/默认 Context、嵌套隔离、动态 locale、两类断点订阅、过滤、取消、默认禁用、静态属性、semiGlobal、SSR |
| React/Vue 场景 | 固定 React Adapter 请求、RTL 包装、Consumer、timeZone、en-US Typography、嵌套 LTR、桌面/移动断点                     |
| Chromium       | 公开 DOM、计算样式、几何、响应式 viewport、无 console/page error、桌面/移动 light/dark 截图                          |
| 发布包         | 根/`config-provider` ESM 与声明、`config-provider.css`、SSR import、真实 tarball 离线安装                            |

当前没有 accepted visual/behavior deviation。Vue scoped slot、InjectionKey 和响应式只读上下文属于框架原生映射。
