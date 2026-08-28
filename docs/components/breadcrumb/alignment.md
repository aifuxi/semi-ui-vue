# Breadcrumb v2.102.0 对齐矩阵

## 基线与选择理由

- 唯一基线：`vendor/semi-design` tag `v2.102.0`，提交 `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- 当前路线：最近完成 BackTop；Breadcrumb 是固定 `content/order.js` 中紧邻其后的组件。
- 已就绪依赖：ConfigProvider、Typography、Tooltip、稳定版 IconMore 与默认主题基础设施均已完成。Breadcrumb 的内置 `moreType="popover"` 可复用 Tooltip 的定位/Portal 内核并保留固定 Popover DOM/class，不需要把后续完整 Popover 公开切片提前标记为 ready。

## 组件边界

| 模块                        | 单一职责                                                                | 契约                                 |
| --------------------------- | ----------------------------------------------------------------------- | ------------------------------------ |
| `Breadcrumb.ts`             | 规范化 routes/默认 slot、派生活跃项、折叠中间项并提供上下文             | props / emits / slots                |
| `BreadcrumbItem.vue`        | 渲染链接、图标、Typography 截断、分隔符与 item→parent 事件链            | props / click emit / slots           |
| `BreadcrumbIconRenderer.ts` | 只为任意图标 VNode 合并固定 class 与尺寸                                | VNode 输入 / cloneVNode 输出         |
| `BreadcrumbPopover.vue`     | 用已对齐 Tooltip 定位内核复现内置省略项 Popover                         | hover / Portal / Popover class       |
| `breadcrumb-context.ts`     | 在最近的 Breadcrumb 实例内传播 compact、separator、showTooltip 与父点击 | 类型化 InjectionKey，实例隔离        |
| `breadcrumb.js`             | 从私有集成边界导出固定 Breadcrumb/BreadcrumbItem Foundation             | declaration facade + bundled runtime |
| `breadcrumb.scss`           | 编译 Breadcrumb、Typography、Tooltip/Popover、Portal 与 Icon 样式       | `breadcrumb.css`                     |

## 权威源码

- Adapter、公开类型、DOM 与 children 处理：`packages/semi-ui/breadcrumb/{index,item,bread-context}.tsx`。
- 状态与事件：`packages/semi-foundation/breadcrumb/{foundation,itemFoundation,constants}.ts`。
- 样式与 RTL：`packages/semi-foundation/breadcrumb/{variables,breadcrumb,animation,rtl}.scss`。
- 主题 Token：`packages/semi-theme-default/scss/`。
- 文档、测试与场景：`content/navigation/breadcrumb/`、`packages/semi-ui/breadcrumb/{__test__,_story}/`。
- 内置浮层：`packages/semi-ui/popover/{index,Arrow}.tsx` 与 `packages/semi-foundation/popover/`。

## 公开 API 与 Vue 映射

| React v2.102.0                                  | 默认值                               | Vue 契约                                                                                                     |
| ----------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `routes`                                        | `[]`                                 | `Array<BreadcrumbRoute \| string>`；对象保留额外业务字段，字符串归一化为 `name`                              |
| `activeIndex`                                   | 末项                                 | 显式数字覆盖默认末项；越界时不擅自钳制                                                                       |
| `compact`                                       | `true`                               | 缺省、显式 `false`、显式 `true` 分别验证，并保留 compact/loose class                                         |
| `separator`                                     | `'/'`                                | `VNodeChild` prop 或 `#separator` slot；Item 的 separator prop/slot 可覆盖父级                               |
| `showTooltip`                                   | `{ width: 150, ellipsisPos: 'end' }` | `false/true/对象`；字符串 Item 交给 Typography 单行省略和 Tooltip，VNode 内容不强制截断                      |
| `autoCollapse`                                  | `true`                               | 缺省/false/true 分别验证；仅 item 数量大于 `maxItemCount` 且仍处于 collapsed 时折叠                          |
| `maxItemCount`                                  | `4`                                  | 保留上游 slice/splice 算法与首项、末尾项分配                                                                 |
| `moreType`                                      | `'default'`                          | `'default' \| 'popover'`；default 点击/Enter 后永久展开，popover 在浮层展示隐藏项                            |
| `renderItem(route)`                             | 无                                   | 兼容 `renderItem` prop，并优先提供 `#item="{ route, index }"` slot                                           |
| `renderMore(restItem)`                          | 无                                   | 兼容 `renderMore` prop，并提供 `#more="{ items, expand }"` slot；两者存在时按上游阻止隐藏项分隔符            |
| `className` / `style` / `aria-label` / `data-*` | 空 / `'Breadcrumb'`                  | 兼容 prop、Vue class/style 与 attrs 合并到 `nav`                                                             |
| `onClick(route, event)`                         | noop                                 | `click(route, event)`；Item 自身 `click` 先于父 Breadcrumb `click`                                           |
| `Breadcrumb.Item href/icon/noLink/separator`    | 空 / false                           | 保留同名 props；icon/default/separator slots；最后项或无 href 渲染 span，否则渲染 a                          |
| React `children` / cloneElement                 | —                                    | Vue 默认 slot；只克隆直接 BreadcrumbItem VNode，注入 active 与 shouldRenderSeparator，保留调用方 props/slots |

## 状态、事件与折叠顺序

- 初始 `isCollapsed=true`；默认折叠把第二项至末尾保留项之前的内容替换为一个 collapse 项。
- `moreType="default"` 的省略项 click 或 Enter 先由固定 BreadcrumbFoundation 调用 `expandCollapsed`，再同步渲染完整列表；其它按键不展开。
- Item 点击先调用自身 `click(itemInfo, event)`，再调用父 Breadcrumb `click(itemInfo, event)`。route 模式传回原始对象；children 模式传回 `{ name, href? }`。
- `activeIndex` 存在时按索引设置；否则最后一项 active。active 项即使有 href 也渲染 span，并设置 `aria-current="page"`。
- 当自定义 more 或 popover 隐藏中间项时，隐藏 Item 不输出会重复的 separator；Popover 内容按父 separator 串联。

## DOM / class / 样式

- 根为 `nav.semi-breadcrumb-wrapper`，并二选一增加 `-compact` / `-loose`。
- Item 为 `span.semi-breadcrumb-item-wrap`，内部是 `span|a.semi-breadcrumb-item`、可选 icon/title，再跟 separator。
- 文字 Item 使用 `Typography.Text`，固定单行 ellipsis、`max-width`、compact 对应 small；VNode 内容使用 `-item-title-inline`。
- collapse 保留 `.semi-breadcrumb-collapse > .semi-breadcrumb-item-wrap > .semi-breadcrumb-item-more` 与 `role=button/tabindex=0/aria-label`。
- 内置 Popover 保留 `.semi-popover-wrapper > .semi-popover > .semi-popover-content`、箭头、Portal、padding 12 与固定 hover 定位默认值。
- RTL 由 ConfigProvider 产生 `.semi-rtl`，固定 SCSS 反转 Item、separator/restItem 间距；组件无方向状态机。

## VNode、Portal 与行为门禁

- 默认 slot 允许 Fragment，但仅 BreadcrumbItem VNode 参与父级 active/separator 注入；非 Item VNode 保留上游 warning，不伪造 item DOM。
- 克隆子 VNode 时，父级只覆盖内部 `active`、`shouldRenderSeparator` 与 key；不以普通 truthiness 读取调用方 Boolean prop。
- 图标只对真实 VNode clone，合并 `.semi-breadcrumb-item-icon` 和 compact 对应 size；字符串/其它 VNodeChild 原样渲染。
- Popover 的 Portal 容器遵循 ConfigProvider `getPopupContainer`，首次挂载后解析；Breadcrumb 行为测试验证自定义容器，Element/Document capture-scroll 重定位及卸载清理由已对齐且已有独立门禁的 Tooltip 内核承担。

## 键盘、焦点、ARIA、国际化、SSR

- 根缺省 `aria-label="Breadcrumb"`；active Item wrapper 设置 `aria-current="page"`。
- collapse 省略项使用 `role="button"` 与 `tabindex="0"`；固定上游只响应 Enter keypress，不增加 Space/方向键行为。
- 普通 Item 沿用上游 click 语义，不擅自为无 href span 增加 tabindex/role；链接由原生 a 提供键盘能力。
- 组件没有 Locale 文案；缺省英文 aria-label 来自固定 Adapter。zh-CN/en-US 只改变调用方内容。
- SSR 输出静态 nav/item/collapse DOM；不解析 Portal 容器、不读取 window/document，也不创建 Tooltip Portal。根与 `breadcrumb` 子路径均须 SSR-safe import。

## 验收门禁

- 单元：根 DOM/class/style/attrs、compact 三态、separator、routes/string/自定义 item、icon/href/noLink、activeIndex、Item→parent 事件顺序、collapse click/Enter、autoCollapse 三态、maxItemCount、自定义 more、showTooltip false/true/对象、Popover 容器与 RTL。
- SSR：默认/route/slot/collapse/RTL 静态输出，无 Portal、browser global 或 vendor/private 路径；验证 hydration 无警告。
- Chromium：同 BrowserContext 的本地 React/Vue 来源、点击与 Enter 展开、链接事件、Tooltip/Popover、computed style、bounding rect、desktop/mobile light/dark/RTL 裁剪截图。
- 发布：根与 `breadcrumb` 子路径、类型、`breadcrumb.css`、tree-shaking、SSR-safe import、许可证/SBOM 与真实 tarball 安装验证。

## Deviation

- React `children`、`renderItem`、`renderMore` 与 ReactNode 映射为 Vue slots/VNodeChild，同时保留可自然调用的函数 prop。VNode 克隆仅用于固定父级注入，用户可实现能力和 DOM 插入点不变。
- Breadcrumb 内置 `moreType="popover"` 通过已完成 Tooltip 的定位/Portal 内核复现固定 Popover 默认值与 DOM/class；本切片不提前公开完整 Popover API。该内部复用不改变 Breadcrumb 的公开能力。

## 验收结果

- 状态：`ready`。
- 单元/SSR：Breadcrumb 组件 9 项行为、SSR 与 hydration 测试通过；场景路由和 test-infra 契约纳入工作区单元回归。
- Chromium：7 项 Breadcrumb 专项通过；React 参考请求直接来自本地 `vendor/semi-design` v2.102.0，事件、Enter 展开、Popover、4 个 computed-style/geometry 目标、desktop/mobile light/dark 与 RTL 均对齐。
- 视觉：desktop/mobile light/dark 和 RTL 的 React/Vue 场景裁剪图逐字节相等；Popover 共享裁剪基线在 `threshold=0.1`、`maxDiffPixelRatio=0.001` 下通过；全部 bounding rect 轴差不超过 `0.5 CSS px`。
- 发布：工作区完整门禁覆盖 root/`breadcrumb` ESM 与声明、`breadcrumb.css`、SSR-safe import、真实 tarball 离线安装、许可证与 SBOM；产物扫描不含 `vendor` 或私有 workspace 运行时路径。
- 接受的 deviation 仅为上节记录的 Vue slot/VNode 公开语义映射与内部 Tooltip 定位内核复用；无未实现公开能力。
