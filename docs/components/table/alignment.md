# Table v2.102.0 对齐矩阵

## 路线与权威来源

- 当前路线：实时提交历史已完成 `SideSheet`；`Table` 是固定 `vendor/semi-design/content/order.js` 中紧邻其后的公开组件。
- 已就绪依赖：Pagination、Checkbox/Radio、Dropdown、Empty、Icon、Resizable、ConfigProvider/Locale、默认主题与滚动测试基础设施均已进入 `ready`。Table 不依赖后续 Tag、Timeline、Notification 或 Feedback，可独立形成发布与 Chromium 验收闭环。
- 唯一基线：`vendor/semi-design` 的 `v2.102.0` / `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- Adapter/公开类型/DOM：`packages/semi-ui/table/`；Foundation/常量/样式：`packages/semi-foundation/table/`；默认主题：`packages/semi-theme-default/scss/`；中英文 API、示例与测试：`content/show/table/`、`packages/semi-ui/table/__test__/table.test.js` 与 `_story/`。

## Vue 组件边界

| 文件                   | 单一职责                                                           | 公开契约                      |
| ---------------------- | ------------------------------------------------------------------ | ----------------------------- |
| `Table.vue`            | 归一化 columns、排序/过滤/分页/选择/展开状态，组合标题、表体与分页 | props、emits、slots、公开实例 |
| `TableHeader.vue`      | 分层表头、排序/过滤入口、固定列和 resize handle                    | Table 内部                    |
| `TableBody.vue`        | 树/分组行、普通/展开/空态/加载 DOM，委托单元格与行事件             | Table 内部                    |
| `TableCell.vue`        | 执行公开 render/onCell，处理 span、ellipsis、固定位置与内容        | Table 内部                    |
| `TableColumn.ts`       | 仅声明式承载 `Table.Column` props；不产生 DOM                      | `Table.Column` 与命名导出     |
| `TableNodeRenderer.ts` | 安全承载 `VNodeChild`/render 返回值                                | Table 内部                    |
| `table-utils.ts`       | 无状态的列/树/键/几何计算；不伪装 composable                       | Table 内部                    |
| `types.ts`             | Vue 原生公开类型、render/slot/event/实例合同                       | 根入口和 `table` 子路径       |

状态只在 `Table.vue` 保存；数据源、columns、rowSelection 配置和调用方记录均只读。DOM/ResizeObserver/拖拽句柄使用浅层模板引用或普通句柄，不进入深层代理。

## 公开 API 与 Vue 映射

- 基础：`dataSource`、`columns`/`Table.Column`、`rowKey`、`childrenRecordName`、`size`、`bordered`、`showHeader`、`loading`、`prefixCls`、`className`/`class`、`style`、`id`、`direction`。
- 内容：`title`/`#title`、`footer`/`#footer`、`empty`/`#empty`；slot 优先于同名静态 prop，函数收到当前页数据。
- 列：嵌套 `children`、`title`、`dataIndex`、`key`、`width`、`align`、`fixed`、`ellipsis`、`className`、`colSpan`、`render`、`onCell`、`onHeaderCell`、`sorter`/`sortOrder`/`defaultSortOrder`、`filters`/`filteredValue`/`defaultFilteredValue`/`onFilter`、`resize`。
- Vue 额外提供 `#cell="{ text, record, rowIndex, column }"`、`#headerCell="{ column }"`、`#expandedRow` 和 `#groupSection` 作为 React render prop 的模板映射；column 上显式函数仍完整保留。
- 选择：`rowSelection` 的 selected/defaultSelected keys、checkbox/radio、disabled、hidden、fixed、width、title、clickRow、getCheckboxProps、renderCell、onCell/onHeaderCell 及 change/select/selectAll 回调；Vue 同时 emit `selectChange`、`select`、`selectAll`。
- 展开/树：`expandedRowRender`/`#expandedRow`、`expandedRowKeys`、`defaultExpandedRowKeys`、`defaultExpandAllRows`、`expandAllRows`、`rowExpandable`、`expandIcon`、`expandRowByClick`、`hideExpandedColumn`、`indentSize`、`onExpand`、`onExpandedRowsChange`；Vue emit `expand`、`expandedRowsChange`。
- 分页：`pagination=false/true/object`、`position=top/bottom/both`、`renderPagination`/`#pagination`；受控 `currentPage/pageSize` 不被组件改写，变化通过 `change` 与 `pageChange` 上报。
- 行：`onRow`、`onHeaderRow`、`onGroupedRow` 返回的 class/style/data/aria/原生监听落到真实 tr；`groupBy`/`renderGroupSection`；`rowSpanHover`。
- 布局：`scroll.x/y/scrollToFirstRowOnChange`、固定列、sticky、`resizable` 回调、`virtualized` itemSize/onScroll、`components` DOM tag/component 覆盖、`keepDOM`、`getVirtualizedListRef`。
- `getCurrentPageData()` 通过公开实例暴露；常量 `DEFAULT_KEY_COLUMN_SELECTION` / `DEFAULT_KEY_COLUMN_EXPAND` 保留在 Table compound component。

默认值与受控优先级以固定 Adapter 为准：`dataSource=[]`、`childrenRecordName='children'`、`size='default'`、`loading=false`、`bordered=false`、`hideExpandedColumn=true`、`showHeader=true`、`indentSize=20`、`pagination=true`、`rowKey='key'`、展开相关布尔值为 false。`hideExpandedColumn` 与 `showHeader` 是默认 true 的可选 Boolean；缺省/显式 false/显式 true 必须分别验证，不能用普通 truthiness 代替“是否显式传入”。

## 状态、事件顺序与数据处理

- columns 和 records 始终克隆/派生，不修改调用方对象；`Table.Column` 只识别真实 Column VNode，递归展开 Fragment，忽略空白/注释/意外子节点。真实 SFC 裸 Boolean 与 `h()` true/false 都有门禁。
- 排序顺序为 `false -> ascend -> descend -> false`；受控 `sortOrder` 只上报，非受控保存内部 query。过滤先于排序，树节点在配置允许时递归过滤/排序。
- `onChange` 在 sorter/filter/pagination 完成内部派生后触发，payload 保留 `pagination/filters/sorter/extra.changeType`；设置 `scroll.y` 时回到 body 顶部，否则只在客户端调用 table wrapper `scrollIntoView`。
- 选择先计算 keys/rows，再依次调用 rowSelection 对应回调和 change；受控 `selectedRowKeys` 不被内部覆盖。全选跳过 disabled 行；radio 仅保留一项；`clickRow` 与 checkbox 原生事件不重复触发。
- 展开点击先计算新 keys，再触发 `onExpand`/`expand`，最后触发 `onExpandedRowsChange`/emit；受控 keys 只上报。树子行与 expandedRow 都在父行之后，DOM key 稳定。
- 分页默认 pageSize=10/currentPage=1；本地过滤/排序后再切页。受控页码变化上报但渲染继续服从 prop。

## DOM、样式、主题、滚动、动效与 RTL

- 根为 `.semi-table-wrapper`；标题、分页、`.semi-table-container`、header/body table、thead/tbody、row/head/cell class 与固定 `x-semi-prop/x-type/data-*` 保持 v2.102.0 结构。
- 未设置 `scroll.y` 时使用单表结构；设置时保持同宽 header/body 容器、colgroup 与同步 scrollLeft。body scroll 位置产生 `-scroll-position-left/middle/right`；ResizeObserver/window resize 只在客户端创建并完整清理。
- fixed 列使用固定源码的 sticky class、left/right offset 和边界阴影；RTL 方向下偏移与滚动位置语义翻转。`sticky` 仅改变 header top 与 sticky class。
- `resizable` 只在允许列显示固定 `.react-resizable-handle`；pointer 拖动按方向更新临时宽度并依序回调 start/resize/stop，不修改 column。
- `virtualized` 保持公开滚动/ref/onScroll 合同与行语义；固定高度模式按 viewport 裁剪并用上下占位承载偏移，动态 itemSize 使用调用方函数。
- 根/独立 `table.css` 直接编译固定 Table SCSS，以及其公开选择、分页、空态、图标所需样式。light/dark 由固定 `--semi-*` Token 驱动；默认视觉矩阵覆盖桌面/移动 light/dark 与 RTL。

## 键盘、焦点、ARIA、国际化与 SSR

- table/thead/tbody/tr/th/td 使用原生表格语义；排序 th 输出 `aria-sort`，选择控件保留 checkbox/radio 可访问名称，展开按钮输出 `aria-expanded`。不新增上游不存在的 grid/roving tabindex。
- Table locale 使用 ConfigProvider `locale.Table` 的 `emptyText/pageText`；没有 provider 时遵循固定 zh-CN/en-US 默认内容。57 Locale 继续由 ConfigProvider 数据完整性门禁覆盖。
- SSR import/render 不访问 document/window/ResizeObserver；滚动、测量、observer、scrollIntoView 与虚拟列表 ref 只在客户端生命周期执行，hydrate 不产生 warning。

## 测试、发布与 Deviation 门禁

- 单元：默认 DOM、columns prop/真实 SFC Column/h() Column、默认 true Boolean 三态、render/span、排序/过滤事件顺序、受控/非受控选择与展开、树/分组、分页、空态/加载、row/cell attrs、scroll/fixed/resizable/virtualized、RTL 与清理。
- SSR：根入口/子路径 import、基础/空态/树/选择 renderToString 与 hydration。
- Chromium：同一固定 Chromium 进程的 React/Vue 来源、公开行为、computed style、几何；桌面/移动 light/dark 与 RTL 成对最小截图，Playwright 阈值后再直接比较独立 PNG buffer。
- 发布：根/`table` ESM 与声明、tree-shaking、根/独立样式、SSR-safe import、真实 tarball 离线消费、许可证和 SPDX SBOM。
- ReactNode/render props/children/className 映射为 Vue VNodeChild/函数/slots/class；`v-model` 不替代上游受控状态。这些是框架原生映射，不构成能力损失。
- 验证结果：`pnpm check` 全链通过（90 个测试文件、657 项单元/SSR 测试）；Table 自身 15 项公开行为/SSR 测试通过；7 项 Table 专属 Chromium 测试覆盖来源、DOM、computed style、几何、桌面/移动 light/dark 与 RTL，5 组 React/Vue 独立 PNG buffer 直接字节相等。
- 发布结果：根/`table` ESM 与声明、根/独立 `table.css`、SSR-safe import、许可证、第三方声明和 SPDX SBOM 均通过真实 tarball 离线安装消费；公开 `.d.ts` 不含私有 Foundation 或 vendor 路径。
- Deviation：无能力损失或已接受差异；ReactNode、render props、children、className 仅按上表映射为 Vue 原生 VNode/slot/props 语义。
- 当前状态：`ready`。
