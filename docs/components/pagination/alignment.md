# Pagination 对齐矩阵

## 选择与依赖

- 当前路线：最近完成 Breadcrumb；固定 `vendor/semi-design/content/order.js` 中下一项 Navigation 依赖尚未进入 `ready` 的完整 Dropdown 与 Collapsible 公共能力，不能独立闭环。Pagination 紧随其后。
- 已就绪依赖：Select、InputNumber、Icon、ConfigProvider、Tooltip/Portal 与默认主题基础设施均已完成。Pagination 的省略页码 Popover 复用 Tooltip 定位内核并保留固定 Popover DOM/class，不提前把完整 Popover 标记为 `ready`。
- 唯一基线：`vendor/semi-design` tag `v2.102.0`、提交 `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。

## 组件边界

| 文件/模块                   | 单一职责                                                          | 公开边界                             |
| --------------------------- | ----------------------------------------------------------------- | ------------------------------------ |
| `Pagination.vue`            | 连接 Foundation，管理受控/非受控状态、渲染默认/迷你分页和派发事件 | props / emits / slots / v-model      |
| `PaginationRestList.vue`    | 以固定 32px 行高虚拟化省略页码列表                                | 内部组件                             |
| `PaginationPopover.vue`     | 用现有 Tooltip/Portal 内核还原 Popover 容器、箭头与触发行为       | 内部组件                             |
| `PaginationNodeRenderer.ts` | 安全渲染 `prevText` / `nextText` VNodeChild                       | 内部 render function                 |
| `pagination.js`             | 从私有集成边界导出固定 Pagination Foundation                      | declaration facade + bundled runtime |
| `pagination.scss`           | 编译 Pagination、Select、InputNumber、Popover/Portal 与 Icon 样式 | `pagination.css`                     |

## 固定源码证据

- Adapter、公开类型、默认值、DOM：`packages/semi-ui/pagination/index.tsx`。
- 状态、页码截断、容量切换、快速跳页和事件顺序：`packages/semi-foundation/pagination/{foundation,constants}.ts`。
- 样式、状态与 RTL：`packages/semi-foundation/pagination/{variables,pagination,animation,rtl}.scss`。
- 默认主题：`packages/semi-theme-default/scss/index.scss` 与全局 Token。
- Locale：`packages/semi-ui/locale/source/{zh_CN,en_US}.ts`；开放的 ConfigProvider locale 结构可传入其它上游 Locale 的 `Pagination` 字段。
- 文档、测试与场景：`content/navigation/pagination/`、`packages/semi-ui/pagination/{__test__,_story}/`。

## API、默认值与 Vue 映射

| React v2.102.0                       | 默认值                                                                           | Vue 契约                                                                              |
| ------------------------------------ | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `total`                              | `1`                                                                              | 同名 number prop                                                                      |
| `pageSize`                           | `pageSizeOpts[0]`，最终回退 `10`                                                 | 同名 prop；支持外部更新                                                               |
| `pageSizeOpts`                       | `[10, 20, 40, 100]`                                                              | 同名 number[] prop；当前 pageSize 不在列表时按 Foundation 规则插入                    |
| `currentPage` / `defaultCurrentPage` | 非受控初值 `1`                                                                   | `currentPage` 与 `modelValue` 均可受控；`v-model` 映射当前页；保留 defaultCurrentPage |
| `size`                               | `'default'`                                                                      | `'default'                                                                            | 'small'` |
| `showTotal`                          | `false`                                                                          | 同名 Boolean prop                                                                     |
| `showSizeChanger`                    | `false`                                                                          | 同名 Boolean prop；small 模式不渲染容量选择                                           |
| `showQuickJumper`                    | `false`                                                                          | 同名 Boolean prop                                                                     |
| `hideOnSinglePage`                   | `false`                                                                          | 同名 Boolean prop；showSizeChanger 为 true 时不隐藏                                   |
| `hoverShowPageSelect`                | `false`                                                                          | 仅 small 且非 disabled 时启用省略页码 Popover                                         |
| `disabled`                           | `false`                                                                          | 禁用页码、前后翻页、Select 与快速跳页                                                 |
| `preventPageChangeOnPageSizeChange`  | `false`                                                                          | 同名 prop，保留容量变化时页码重算开关                                                 |
| `prevText` / `nextText`              | Chevron Icon                                                                     | 同名 VNodeChild prop；优先 `#prev` / `#next` slot                                     |
| `popoverPosition`                    | 页容量 Select 按 LTR `bottomLeft` / RTL `bottomRight`；省略 Popover 使用上游默认 | 同名 TooltipPosition prop                                                             |
| `popoverZIndex`                      | `1030`                                                                           | 同名 number prop                                                                      |
| `className` / `style` / data 属性    | 空                                                                               | 合并 Vue `class` / `style` 并透传 `data-*` 到根                                       |
| `onPageChange(page)`                 | noop                                                                             | `pageChange(page)` + `update:currentPage` + `update:modelValue`                       |
| `onPageSizeChange(size)`             | noop                                                                             | `pageSizeChange(size)` + `update:pageSize`                                            |
| `onChange(page, size)`               | noop                                                                             | `change(page, size)`；顺序保持 Foundation 通知顺序                                    |

公开类型不引用 React、`vendor/**` 或私有 workspace 包路径。`PaginationLocale` 暴露 `pageSize`、`total`、`jumpTo`、`page` 四项文案。

## 状态与事件顺序

- 非受控页码点击：先更新页码/禁用态/页码列表，再依次派发 `pageChange`、两个页码更新事件、`change`。
- 受控 `currentPage` 或 `modelValue`：点击只派发事件，激活 DOM 等待父级回写；显式控制键通过原始 VNode props 判断，不能把缺省 prop 误判为受控。
- 上一页/下一页复用 `goPage`；第一页/末页或总 disabled 时不派发。
- 容量变化：先更新 pageSize 并派发 `pageSizeChange`/`update:pageSize`；默认按当前页首条数据位置重算页码，必要时再派发 `pageChange`，最后派发 `change`。`preventPageChangeOnPageSizeChange=true` 时保留原页。
- 快速跳页：change 只更新输入；blur 或 Enter 提交，超上限钳制到末页、`<=0` 钳制到 1，随后清空输入并走标准页码事件链。
- `total/currentPage/pageSize` 外部变化重新计算禁用态、7 项截断列表和省略页范围；small hover 列表同步更新。

## DOM、class、几何与主题

- 默认根为 `ul.semi-page`；small 根为 `div.semi-page.semi-page-small`；disabled 增加 `.semi-page-disabled`。
- 前后按钮为 `li.semi-page-item.semi-page-prev|next[role=button][aria-disabled]`，保留 `x-semi-prop`。
- 页码为 `li.semi-page-item[aria-label]`；激活项增加 `-active` 与 `aria-current="page"`；disabled 增加 `-all-disabled`/`-all-disabled-active`。
- 总页数是根内 `span.semi-page-total`；容量选择包在 `.semi-page-switch`；快速跳转保持 `.semi-page-quickjump` 与 InputNumber class。
- 省略页 Popover 保留 `.semi-portal > .semi-popover-wrapper > .semi-popover-content`，内部 `.semi-page-rest-list` 宽 78px、最多显示 5 行，每行 32px；大范围页码保持窗口化渲染。
- 主题直接编译固定 Pagination SCSS，并纳入 Select/Input/InputNumber、Tooltip/Popover/Portal、Icon；light/dark 只由同一 `--semi-*` Token 链驱动。
- RTL 根由 ConfigProvider `.semi-rtl` 驱动，页码方向为 rtl，prev/next 图标 `scaleX(-1)`；页容量 Select 默认 placement 切换为 `bottomRight`。

## 键盘、焦点与 ARIA

- 上游页码与前后按钮以 click 为唯一交互入口；Foundation `handleKeyDown` 在固定版本为空。Vue 保留其 DOM/ARIA 与可聚焦性，不额外发明与基线不同的 roving tabindex 或快捷键。
- 前后按钮公开 `role=button`、`aria-label=Previous|Next`、`aria-disabled`；数字页公开 `aria-label="Page N"`，省略项 `aria-label=More`，当前页公开 `aria-current=page`。
- Select 与 InputNumber 沿用各自已验收的键盘、焦点和 ARIA；快速跳页 Enter 由 InputNumber keydown 提交。

## Portal、动效、国际化、RTL 与 SSR

- 省略项与 small 页码选择使用 hover Portal；稳定的 ConfigProvider `getPopupContainer` 必须在首次可见时就是父节点。组件不承诺迟到或动态变化的容器，也不新增 Observer/轮询。
- Tooltip 定位内核负责 Element/Document capture-scroll 重定位与卸载清理；Pagination 不重复注册定位监听。
- Popover/Select 动效沿用固定 Tooltip/Select 最终帧；视觉截图在动画稳定后采集，不使用 mask 或放宽阈值。
- 默认 zh-CN 文案与固定 locale 一致；ConfigProvider `locale.Pagination` 优先于按 `locale.code` 选择的内置 zh-CN/en-US 回退。zh-CN/en-US 均做行为与视觉场景。
- SSR 直接输出稳定分页 DOM，不访问 document/window，不创建 Portal；根与 `pagination` 子路径均 SSR-safe，hydration 不产生警告。

## 验收门禁

- 单元：默认/小尺寸 DOM，页码截断四分支，上一页/下一页，受控与非受控/v-model，事件顺序，外部 total/pageSize/currentPage，容量选项插入与 prevent 开关，快速跳页 blur/Enter/钳制，单页隐藏，disabled，prev/next slot，locale/RTL，自定义稳定 Portal 与虚拟列表。
- SSR：默认/受控/small/disabled/hide/locale/RTL 输出，无 Portal、browser global 或 vendor/private 路径；验证 hydration。
- Chromium：同一 BrowserContext 中核对固定 React 与 Vue 的请求来源、运行时错误、关键 computed style、bounding rect；desktop `1440x900`、mobile `390x844`、light/dark、RTL、zh-CN/en-US、hover Popover、Select 与 quick jump 行为。
- 视觉：组件裁剪截图 `threshold <= 0.1`、`maxDiffPixelRatio <= 0.001`，并直接比较成对 PNG；不能以阈值通过代替局部差异审计。
- 发布：根与 `pagination` 子路径、声明、`pagination.css`、tree-shaking、SSR-safe import、真实 tarball 离线安装、许可证/SBOM；产物不得含 `vendor` 或私有 workspace 运行时路径。

## Deviation

- Accepted：Vue 用 `modelValue`/`update:modelValue` 提供原生 `v-model`，同时保留 `currentPage`/`update:currentPage`；这是 React 受控 prop 的 Vue 原生映射，不改变页码与事件语义。
- Accepted：React 用 `react-window` 渲染省略页列表；Vue 使用等价固定行高窗口化组件，保持 78px 宽、32px 行高、5 行 viewport、滚动可达范围和公开 DOM class，不引入 React 运行时依赖。
- Accepted parity limitation：固定上游的 `handleKeyDown` 是空实现且页码项未提供 tabindex；Vue 不额外添加新的键盘导航契约。Select、InputNumber 与 Popover 自身的键盘/焦点能力照常保留。
