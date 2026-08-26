# Layout v2.102.0 对齐矩阵

## 固定证据

- React Adapter：`vendor/semi-design/packages/semi-ui/layout/index.tsx`
- Sider Adapter：`vendor/semi-design/packages/semi-ui/layout/Sider.tsx`
- 上下文：`vendor/semi-design/packages/semi-ui/layout/layout-context.ts`
- Foundation 常量：`vendor/semi-design/packages/semi-foundation/layout/constants.ts`
- Foundation 样式与 RTL：`vendor/semi-design/packages/semi-foundation/layout/layout.scss`、`rtl.scss`
- 中英文文档：`vendor/semi-design/content/basic/layout/`
- 上游单测：`vendor/semi-design/packages/semi-ui/layout/__test__/layout.test.js`

以上文件均来自只读 submodule 的 `v2.102.0` / `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。

## 组件边界

- `Layout.vue`：根容器、直接 Sider 识别、嵌套 Sider 注册与 `semi-layout-has-sider`。
- `LayoutSection.vue`：Header、Content、Footer 共享的动态语义标签、attrs 与 class 逻辑；三个公开 SFC 只固定各自默认标签和 type。
- `LayoutSider.vue`：固定 aside/children DOM、data/ARIA 过滤、断点注册和卸载清理。
- `layout-context.ts`：类型化 provider/inject，保证嵌套 Layout 的 Sider 只注册到最近父容器。
- `media-query.ts`：SSR-safe 的 matchMedia 注册与新旧监听 API 清理。

Layout 不需要 Foundation 状态机或额外 composable；断点副作用留在 Sider 组件生命周期内。

## 公开 API 与默认值

| 固定 React API    | v2.102.0 行为                                          | Vue API                                           | 结论         |
| ----------------- | ------------------------------------------------------ | ------------------------------------------------- | ------------ |
| `Layout`          | 默认 `section.semi-layout`                             | `Layout`                                          | 等价         |
| `Layout.Header`   | 默认 `header.semi-layout-header`                       | `LayoutHeader`；同时保留 `Layout.Header` 静态成员 | Vue 原生映射 |
| `Layout.Content`  | 默认 `main.semi-layout-content`                        | `LayoutContent`；同时保留 `Layout.Content`        | Vue 原生映射 |
| `Layout.Footer`   | 默认 `footer.semi-layout-footer`                       | `LayoutFooter`；同时保留 `Layout.Footer`          | Vue 原生映射 |
| `Layout.Sider`    | `aside > div.semi-layout-sider-children`               | `LayoutSider`；同时保留 `Layout.Sider`            | Vue 原生映射 |
| `prefixCls`       | 默认 `semi-layout`                                     | 同名 typed prop、相同默认值                       | 等价         |
| `hasSider`        | true 时立即输出横向 class；false 不阻止实际 Sider 注册 | 同名 typed prop                                   | 等价         |
| `tagName`         | Layout 默认 section；分区有各自默认值，可覆盖          | 同名 typed prop                                   | 等价         |
| `breakpoint`      | `xs/sm/md/lg/xl/xxl` 数组；按固定枚举顺序注册          | 同名 typed prop                                   | 等价         |
| `onBreakpoint`    | 初始化与 match 状态改变时 `(screen, match)`            | `breakpoint` emit / `@breakpoint`                 | Vue 事件映射 |
| `className/style` | 根节点 class/style                                     | 原生 `class/style` attrs                          | Vue 原生映射 |
| `children`        | 直接子节点                                             | 默认 slot                                         | Vue 原生映射 |

组件没有受控/非受控状态，也不修改调用方 props。

## DOM、class 与布局

- Layout 根节点为可配置 tag，默认 `section.semi-layout`；display 为 flex，方向默认 column。
- `hasSider=true`、直接子节点为 Sider，或挂载后的后代 Sider 向最近 Layout 注册时，根节点增加 `semi-layout-has-sider` 并切换为 row。
- `semi-layout-has-sider` 的直接 Layout/Content 子节点保留 `overflow-x: hidden`。
- Header/Footer 为 `flex: 0 0 auto`；Content 为 `flex: auto` 且 `min-height: auto`。
- Sider 为相对定位，children 容器为 100% 高，并保留 `margin-top: -0.1px` / `padding-top: 0.1px`。
- 自定义 `prefixCls` 同时影响根、分区、Sider 与 Sider children class。

## 响应式、事件与清理

- 固定查询：xs `max-width:575px`；sm/md/lg/xl/xxl 分别从 576/768/992/1200/1600px 起。
- 不论调用方数组顺序，实际注册与初始回调都按 `xs → sm → md → lg → xl → xxl`。
- 浏览器挂载时立即以当前 match 状态 emit；变更时再次 emit；卸载时移除全部监听。
- 同固定 React Adapter 一致，挂载后改变 `breakpoint` 不重建监听。
- SSR 或环境缺少 `matchMedia` 时不访问浏览器 API，也不 emit。

## attrs、可访问性与固定源码差异

- Layout/Header/Content/Footer 将 role、aria、data、id 与原生事件透传到根节点。
- Sider 固定源码实际只将 `data-*`、`aria-label`、class、style 写入 aside；尽管文档列出 `role`，Adapter 的 `getDataAttr()` 会过滤掉 role。本实现以固定运行时为准，同样不输出 Sider role。
- 默认语义已经分别是 section/header/main/footer/aside；组件不增加 tabindex、键盘处理或焦点状态。
- `.semi-rtl` / `.semi-portal-rtl` 下 Layout 写入 `direction: rtl`，子布局继承方向。

## 验收矩阵

| 证据                  | 场景                                                                                                        |
| --------------------- | ----------------------------------------------------------------------------------------------------------- |
| 单元行为              | 静态/具名导出、默认与自定义 tag/prefix、attrs、直接/动态 Sider、过滤规则、断点顺序/变更/清理、无 matchMedia |
| SSR/hydration         | 直接 Sider 在服务端输出 has-sider；无浏览器全局访问；客户端无 hydration 警告                                |
| Chromium 行为/ARIA    | 固定源码请求、语义标签、直接/嵌套 Sider、desktop/mobile 断点、role 与 aria-label                            |
| computed style / 几何 | 8 个目标逐项比较 display/flex/direction/box-sizing/position/overflow/尺寸；每轴误差不超过 0.5px             |
| 视觉                  | desktop 1440×900 与 mobile 390×844，light/dark；额外 desktop light RTL；组件裁剪                            |
| 发布                  | 根/`layout` 子路径 ESM 与 types、根/`layout.css`、SSR import、真实 tarball 安装                             |

截图阈值保持 `threshold=0.1`、`maxDiffPixelRatio=0.001`，并要求同一 Chromium 中 React/Vue 组件截图字节完全一致。

## Deviation

当前没有 accepted visual/behavior deviation。React 静态子组件在 Vue 中增加具名 SFC 导出，以支持模板原生写法；`Layout.Header/Content/Footer/Sider` 仍保留在 `Layout` 导出对象上，供 render function 与脚本调用。
