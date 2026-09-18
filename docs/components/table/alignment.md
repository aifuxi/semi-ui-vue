# Table v2.102.0 对齐矩阵

## 路线与权威来源

- 当前路线：实时提交历史已完成 `SideSheet`；`Table` 是固定 `vendor/semi-design/content/order.js` 中紧邻其后的公开组件。
- 已就绪依赖：Pagination、Checkbox/Radio、Dropdown、Empty、Icon、Resizable、ConfigProvider/Locale、默认主题与滚动测试基础设施均已进入 `ready`。Table 不依赖后续 Tag、Timeline、Notification 或 Feedback，可独立形成发布与 Chromium 验收闭环。
- 唯一基线：`vendor/semi-design` 的 `v2.102.0` / `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- Adapter/公开类型/DOM：`packages/semi-ui/table/`；Foundation/常量/样式：`packages/semi-foundation/table/`；默认主题：`packages/semi-theme-default/scss/`；中英文 API、示例与测试：`content/show/table/`、`packages/semi-ui/table/__test__/table.test.js` 与 `_story/`。

## Vue 组件边界

| 文件                        | 单一职责                                                           | 公开契约                         |
| --------------------------- | ------------------------------------------------------------------ | -------------------------------- |
| `Table.vue`                 | 公开入口及 resizable 模式切换，透传原始 props、slots 与单一事件    | props、emits、slots、公开实例    |
| `TableCore.vue`             | 归一化 columns、排序/过滤/分页/选择/展开状态，组合标题、表体与分页 | Table 私有实例                   |
| `TableHeader.vue`           | 分层表头、排序/过滤入口、固定列和 resize handle                    | Table 内部                       |
| `TableBody.vue`             | 树/分组行、普通/展开/空态/加载 DOM，委托单元格与行事件             | Table 内部                       |
| `TableCell.vue`             | 执行公开 render/onCell，处理 span、ellipsis、固定位置与内容        | Table 内部                       |
| `TableColumn.ts`            | 仅声明式承载 `Table.Column` props；不产生 DOM                      | `Table.Column` 与命名导出        |
| `TableNodeRenderer.ts`      | 安全承载 `VNodeChild`/render 返回值                                | Table 内部                       |
| `useTableVirtualization.ts` | 逐行测量缓存、虚拟窗口、滚动定位与滚动状态清理                     | Table 内部，承载公开虚拟列表 ref |
| `table-utils.ts`            | 无状态的列/树/键/几何计算；不伪装 composable                       | Table 内部                       |
| `types.ts`                  | Vue 原生公开类型、render/slot/event/实例合同                       | 根入口和 `table` 子路径          |

排序、过滤、分页、选择与展开状态由私有 `TableCore.vue` 保存；`Table.vue` 按 resizable 真假切换重建实例。虚拟列表的偏移、滚动状态与逐行测量缓存由 `useTableVirtualization.ts` 管理。数据源、columns、rowSelection 配置和调用方记录均只读。DOM/ResizeObserver/拖拽句柄使用浅层模板引用或普通句柄，不进入深层代理。

## 公开 API 与 Vue 映射

- 基础：`dataSource`、`columns`/`Table.Column`、`rowKey`、`childrenRecordName`、`size`、`bordered`、`showHeader`、`loading`、`prefixCls`、`className`/`class`、`style`、`id`、`direction`。
- 内容：`title`/`#title`、`footer`/`#footer`、`empty`/`#empty`；slot 优先于同名静态 prop，函数收到当前页数据。
- 列：嵌套 `children`、`title`、`dataIndex`、`key`、`width`、`align`、`fixed`、`ellipsis`、`className`、`colSpan`、`render`、`onCell`、`onHeaderCell`、`sorter`/`sortOrder`/`defaultSortOrder`、`filters`/`filteredValue`/`defaultFilteredValue`/`onFilter`、`resize`。
- Vue 额外提供 `#cell="{ text, record, rowIndex, column }"`、`#headerCell="{ column }"`、`#expandedRow` 和 `#groupSection` 作为 React render prop 的模板映射；column 上显式函数仍完整保留。
- 选择：`rowSelection` 的 selected/defaultSelected keys、checkbox/radio、disabled、hidden、fixed、width、title、clickRow、getCheckboxProps、renderCell、onCell/onHeaderCell 及 change/select/selectAll 回调；Vue 同时 emit `selectChange`、`select`、`selectAll`。
- 展开/树：`expandedRowRender`/`#expandedRow`、`expandedRowKeys`、`defaultExpandedRowKeys`、`defaultExpandAllRows`、`expandAllRows`、`rowExpandable`、`expandIcon`、`expandRowByClick`、`hideExpandedColumn`、`indentSize`、`onExpand`、`onExpandedRowsChange`；Vue emit `expand`、`expandedRowsChange`。
- 分页：`pagination=false/true/object`、`position=top/bottom/both`、`renderPagination`/`#pagination`；受控 `currentPage/pageSize` 不被组件改写，变化通过 `change` 与 `pageChange` 上报。
- 行：`onRow`、`onHeaderRow`、`onGroupedRow` 返回的 class/style/data/aria/原生监听落到对应行节点；普通表体使用 tr，虚拟表体使用 div；`groupBy`/`renderGroupSection`；`rowSpanHover`。
- 布局：`scroll.x/y/scrollToFirstRowOnChange`、固定列、sticky、`resizable` 回调、`virtualized` itemSize/estimatedItemSize/overscanCount/onScroll、`components` DOM tag/component 覆盖、`keepDOM`、`getVirtualizedListRef`；虚拟列表 ref 提供 `scrollTo`、`scrollToItem`、`resetAfterIndex`。
- `getCurrentPageData()` 通过公开实例暴露；常量 `DEFAULT_KEY_COLUMN_SELECTION` / `DEFAULT_KEY_COLUMN_EXPAND` 保留在 Table compound component。

默认值与受控优先级以固定 Adapter 为准：`dataSource=[]`、`childrenRecordName='children'`、`size='default'`、`loading=false`、`bordered=false`、`hideExpandedColumn=true`、`showHeader=true`、`indentSize=20`、`pagination=true`、`rowKey='key'`、展开相关布尔值为 false。`hideExpandedColumn` 与 `showHeader` 是默认 true 的可选 Boolean；缺省/显式 false/显式 true 必须分别验证，不能用普通 truthiness 代替“是否显式传入”。

## 状态、事件顺序与数据处理

- columns 和 records 始终克隆/派生，不修改调用方对象；`Table.Column` 只识别真实 Column VNode，递归展开 Fragment，忽略空白/注释/意外子节点。声明式 Column 不挂载，读取 VNode 时按其声明将 kebab-case props 转为 camelCase，并遵循 String/Boolean 类型顺序转换裸 Boolean；保留缺省、显式 false 与 true 的区别。真实 SFC 与 `h()` 均有门禁。
- 排序顺序为 `false -> ascend -> descend -> false`；受控 `sortOrder` 只上报，非受控保存内部 query。过滤先于排序，树节点在配置允许时递归过滤/排序。
- `onChange` 在 sorter/filter/pagination 完成内部派生后触发，payload 保留 `pagination/filters/sorter/extra.changeType`；设置 `scroll.y` 时回到 body 顶部，否则只在客户端调用 table wrapper `scrollIntoView`。
- 选择先计算 keys/rows，再依次调用 rowSelection 对应回调和 change；受控 `selectedRowKeys` 不被内部覆盖。全选跳过 disabled 行；radio 仅保留一项；`clickRow` 与 checkbox 原生事件不重复触发。
- 展开点击先计算新 keys，再触发 `onExpand`/`expand`，最后触发 `onExpandedRowsChange`/emit；受控 keys 只上报。树子行与 expandedRow 都在父行之后，DOM key 稳定。
- 分页默认 pageSize=10/currentPage=1；本地过滤/排序后再切页。受控页码变化上报但渲染继续服从 prop。默认分页入口统一调用 Table 的处理器，再依次通知配置 `onChange`、`pageChange` 与 Table `change`；top/bottom/both 每次操作只调用一次配置回调。

## DOM、样式、主题、滚动、动效与 RTL

- 根为 `.semi-table-wrapper`；标题、分页、`.semi-table-container`、row/head/cell class 与固定 `x-semi-prop/x-type/data-*` 保持 v2.102.0 结构。普通表体使用 table/thead/tbody，虚拟表体使用独立 header table 与 div 表体。
- 非虚拟模式下，未设置 `scroll.y` 时使用单表结构；设置时保持同宽 header/body 容器、colgroup 与同步 scrollLeft。body scroll 位置产生 `-scroll-position-left/middle/right`；ResizeObserver/window resize 只在客户端创建并完整清理。
- fixed 列使用固定源码的 sticky class、left/right offset 和边界阴影；RTL 方向下偏移与滚动位置语义翻转。`sticky` 仅改变 header top 与 sticky class。
- `resizable` 只在允许列显示固定 `.react-resizable-handle`；pointer 拖动按物理指针水平位移更新（RTL 不反转 delta）临时宽度并依序回调 start/resize/stop，不修改 column。
- `virtualized` 使用 `.semi-table-virtualized` 与 div 表体窗口，表体没有 table/colgroup 或上下 spacer 行；行按各自累计偏移绝对定位，LTR 从 left、RTL 从 right 起算，单元格宽度与实际列宽同步。默认尺寸行高取固定常量 53px，small/middle 使用各自固定常量；显式数字或函数 `itemSize` 决定逐行高度，函数接收虚拟索引及 expandedRow/sectionRow 元数据。
- 虚拟高度按 react-window 1.8.10 的已测前缀与估算后缀计算，默认 `estimatedItemSize=50`、`overscanCount=2`；滚动方向决定前后缓冲，原生滚动期间暂时关闭表体 pointer events。筛选缩短数据仅限制当前总高，保留已测缓存供数据恢复后复用；调用 `resetAfterIndex` 才使指定索引后的测量失效。`scrollToItem` 支持 auto/start/end/center/smart，已可见目标在 auto 下保持当前位置。程序定位、原生纵向滚动和纯横向滚动分别通知 requested=true、requested=false 和 horizontalScrolling，横向位置同步表头。
- 根/独立 `table.css` 直接编译固定 Table SCSS，以及其公开选择、分页、空态、图标所需样式。light/dark 由固定 `--semi-*` Token 驱动；默认视觉矩阵覆盖桌面/移动 light/dark 与 RTL。

## 键盘、焦点、ARIA、国际化与 SSR

- 普通表体以 table/thead/tbody/tr/th/td 承载表格语义；虚拟 div 行/单元格保留 row/gridcell 与完整虚拟索引。排序 th 输出 `aria-sort`，选择控件保留 checkbox/radio 可访问名称，展开按钮输出 `aria-expanded`。不新增上游不存在的 grid/roving tabindex。
- Table locale 使用 ConfigProvider `locale.Table` 的 `emptyText/pageText`；没有 provider 时遵循固定 zh-CN/en-US 默认内容。57 Locale 继续由 ConfigProvider 数据完整性门禁覆盖。
- SSR import/render 不访问 document/window/ResizeObserver；滚动、测量、observer、scrollIntoView 与虚拟列表 ref 只在客户端生命周期执行，hydrate 不产生 warning。

## 测试、发布与 Deviation 门禁

- 单元：默认 DOM、columns prop/真实 SFC Column/h() Column、默认 true Boolean 三态、render/span、排序/过滤事件顺序、受控/非受控选择与展开、树/分组、分页、空态/加载、row/cell attrs、scroll/fixed/resizable/virtualized、RTL 与清理。
- SSR：根入口/子路径 import、基础/空态/树/选择 renderToString 与 hydration。
- Chromium：同一固定 Chromium 进程的 React/Vue 来源、公开行为、computed style、几何；桌面/移动 light/dark 与 RTL 成对最小截图，Playwright 阈值后再直接比较独立 PNG buffer。
- 发布：根/`table` default/named ESM 与声明、复合 `Table.Column` 与 `DEFAULT_KEY_COLUMN_*` 常量（单元用例从 `./index` 固定）、tree-shaking、根/独立样式、SSR-safe import、真实 tarball 离线消费、许可证和 SPDX SBOM。
- 静态文档：仓库内 [index.md](./index.md)、[index.en-US.md](./index.en-US.md) 与 [react-to-vue.md](./react-to-vue.md) 覆盖 props/Table.Column/slots/events/exposed、选择/排序过滤/分页/展开/树形分组/固定列/虚拟化、可访问性与 React→Vue 映射；`coverage.md` 保留退役站点的历史映射。
- ReactNode/render props/children/className 映射为 Vue VNodeChild/函数/slots/class；`v-model` 不替代上游受控状态。这些是框架原生映射，不构成能力损失。
- 验证结果：`pnpm check` 全链通过（90 个测试文件、657 项单元/SSR 测试）；Table 自身 15 项公开行为/SSR 测试通过；7 项 Table 专属 Chromium 测试覆盖来源、DOM、computed style、几何、桌面/移动 light/dark 与 RTL，5 组 React/Vue 独立 PNG buffer 直接字节相等。
- 发布结果：根/`table` ESM 与声明、根/独立 `table.css`、SSR-safe import、许可证、第三方声明和 SPDX SBOM 均通过真实 tarball 离线安装消费；公开 `.d.ts` 不含私有 Foundation 或 vendor 路径。
- Deviation：ReactNode、render props、children、className 按上表映射为 Vue 原生 VNode/slot/props 语义。第三批消费者复核发现的 `expandedRowRender` 对象附加 ColumnProps 公开边界已在下方“展开行附加列属性对齐”小节闭合，不再是待修项。
- 当前状态：`ready`。

## Locale 文档消费者回归（2026-09-06）

固定 TablePagination 在 total <= 0 时保留外层和两个 span，省略 Pagination；Foundation.formatPaginationInfo 默认文本为空，自定义 formatPageText 仍调用。固定头表不添加显式 role，普通 body 为 grid，分组/展开/非空 children 数据为 treegrid。新增空数据→有数据、双端分页位置、自定义分页文案与表格语义回归，严格对照公开 DOM/ARIA。

## Table 文档首批消费者修复（2026-09-13）

固定 Foundation 以 pagination.currentPage != null 判断受控分页，此时 dataSource 已由调用方分页，不能再次 slice；移除 currentPage 后恢复内部分页。排序通知携带本次点击请求的下一方向（含 false），受控行序保持至调用方回写。sorter 的第三参数为当前 ascend/descend，返回值仍按固定 withOrderSort 做方向变换。新增公开行为测试覆盖远程页数据、受控排序往返与空值双方向置后；18项单元/SSR通过，浏览器与产物验收在本轮文档记录中核验。

Basic严格属性对照暴露缺失的ARIA行列计数、头行/单元格索引与最终字符串title。计数分别使用当前页数据和顶层展示列；普通非树行不带aria-level，可展开父行保持level+1。单元格自动title来自render后的字符串，显式onCell.title优先；不是只在ellipsis启用时才生成。新增分组列计数、展开父行与自定义title回归，正式状态以本轮记录为准。

首批还补齐默认筛选项与确认区结构、整表头排序热区、取消排序通知、展开图标与 synthetic cell、受控选择的跨页表头状态，以及固定列缺省宽度的实际表头测量。自定义样式依照定位、onCell/onHeaderCell、显式列对齐与render结果的顺序合并，缺省值不覆盖调用方样式。滚动中间态保留固定 `semi-table-scroll-position-middle` 类，RTL 保持固定位置语义并以真实负向scrollLeft验证。文档页真实 locale provider 参与分页文案解析，消费者无须额外重复声明 ConfigProvider。

## Table 第二批文档消费者修复（2026-09-13）

固定 Foundation.getCurrentPageData 先对过滤/排序后的完整数据按首见分组顺序整理，再分页；分组标题只覆盖当前页成员，renderGroupSection 的第二参数为该页成员键数组，Vue groupSection slot 仍按其公开契约提供记录数组。SectionRow 使用 semi-table-row-section 与展开态 on，保留 groupKey、一级 ARIA、组标题索引、section-inner 容器和默认尺寸 ChevronRight 展开图标；组内和每层树行使用同级索引，缺少 key 的叶子按同级索引回退。分组展开事件报告 groupKey，折叠重开保留页成员。

固定 ResizableTable 仅给数字 width 列提供 handle，东南向 handle 以物理水平位移更新，默认最小宽度 20；开始拖动清除浏览器文本选择并添加 handlerClassName（默认 resizing），终止时删除该类，各阶段回调返回的列属性合并到列状态，表头与正文同步消费。交互与视觉有效性以本轮统一文档验收记录为准，公开行为定点单测覆盖分组跨页、折叠重开、树索引以及 resize 的列宽和样式回写。

第二批定点诊断补充：内嵌展开列的树叶子保留一层图标占位；expandIcon=false 时移除图标及额外占位，独立展开列的 rowExpandable=false 单元格不带展开列 class。expandIcon 的 Vue 默认值显式为 undefined，模板直接读取响应式 prop，确保缺省→false 后立即更新，不用原始 VNode 属性存在性短路跳过依赖订阅。分组行使用独立 ChevronRight 图标与 semi-table-section-inner，不沿用树形三角图标。上述公开契约由 6 项树/分组/展开定点单测及 UI 类型检查验证，精细视觉仍由统一矩阵认证。

ResizableStyle 拖动态对照确认：scroll-position 类的更新遵守固定 Table 的首屏、真实横滚及容器 resize 时机；改变列宽或 direction 本身不主动重算边界类。列变化仍刷新固定列宽度测量，拖动产生溢出后保留既有边界状态，下一次横滚再更新为 middle/left/right。公开测试以 DOM 尺寸模拟及真实 scroll 事件验证该顺序，复用 5 项 resize 回归共同通过，UI 类型检查通过。

固定列 resize 的 RTL 定点证据进一步确认容器监听目标与采样阶段：初始需要固定列/固定表头测量的实例观察根 wrapper，在 ResizeObserver 通知后的 animation frame 再测量列宽和滚动边界；非固定模式不增加该监听。卸载断开 observer、取消未执行的 frame，并忽略迟到通知。公开测试通过根容器通知验证后续帧的边界更新及卸载清理，与 resize 回调回归共 9 项通过，UI 类型检查通过；动态切换监听模式未在本轮扩展。

固定基线的根容器 ResizeObserver 不观察内部 table 宽度：RTL 列扩宽时，最后一次根高度变化可能早于内部横向溢出，最后一次 rAF 因时序可读到溢出前或溢出后宽度。因而跨溢出拖动中的边缘阴影不保证确定终态，不能靠固定等待声明对齐。本轮矩阵对收窄拖态与恢复原宽完整比较，扩宽后通过真实横向滚动验证两端和返回状态；该限定见第二批严格验收前提。Observer 透明诊断已移除，不将其偶然通过计入正式证据。

## Table 第三批文档消费者修复（2026-09-13）

Virtualized 与 InfiniteScroll 消费者使用真实 div 窗口和固定 react-window 1.8.10 的测量规则。默认 53px 行高、400px 视口、1000 条记录的首屏测量 10 行，总高为 `10 × 53 + 990 × 50 = 50030px`；`scrollToItem(100)` 的 auto 定位为 4953px，目标已可见时再次调用保持位置。显式 56px 行高、600px 视口的 20 条记录首屏总高为 1078px，滚至 168px 后已测前缀扩至 16 行，总高为 1096px；返回顶部、缩短为 10 行再恢复 20 行后继续保留 1096px。展开内容占据独立虚拟索引，参与 itemSize 计算、行定位与 ARIA 索引。

GroupedDeclarative 的真实 SFC 使用 `data-index`、`on-filter`、裸 `fixed` 与 `use-full-render`；规范化直接依据 Table.Column 的 props 声明，未知属性不改名，缺省属性不补成 false。嵌套表头、排序过滤以及自定义 render 中的选择控件保持公开交互。`expandedRowRender` 的对象结果把 `children` 之外的 ColumnProps（`className`/`onCell`/`render`/`align`/`colSpan` 等）应用到展开单元格，`fixed` 仍只作为固定列元数据；列 render 的 `{ children }` 合法，公开 `TableRenderReturnObject.props` 可省略，传入 props 时继续合并 rowSpan/colSpan，跨度 0 隐藏对应单元格。

FullRender 的函数表头获得带 `.semi-table-selection-wrap` 的完整选择节点，与正文选择节点保持相同包装。分组表头逐层切分完整列树，跨行叶子仍参与该层列宽和固定边缘计算；固定父组使用本层所有前置或后置列的宽度求偏移，不从子列继承固定位置。父组省略自动 rowSpan，叶子按剩余层数补齐；显式 rowSpan 保留，rowSpan/colSpan 为 0 时省略该表头单元格。

GroupedColumns/GroupedDeclarative 的固定列展开内容使用根 `.semi-table-wrapper` 的实际宽度，减去固定左右 padding/border 共 34px 及独立测量的系统垂直滚动条宽度。宽度在挂载及已有根 ResizeObserver 的 rAF 回调中更新，保留小于 0.5px 的变化阈值；测量结果经私有 Body prop 落到 expand-inner，取消固定列后移除该宽度。此修复复用原有观察器和卸载清理，保持滚动边界更新时机；挂载后同一 tick 卸载也会取消待发的初始虚拟滚动通知。

## 展开行附加列属性对齐（2026-09-18）

- 源码证据：固定 `Body/ExpandedRow.tsx:96-131` 把 `expandedRowRender` 对象结果的 `children`/`fixed` 拆出后，将其余 ColumnProps 展开在默认 `render` 之后，因此 `className`、`onCell`、`render`、`align` 等都会作用于展开列，自定义 `render` 覆盖默认展开内容；`ExpandedRow` 只在该行展开时渲染，因此每次渲染只调用一次。
- Vue 处理：`TableExpandedRowRenderResult` 放宽为 `Omit<TableColumn, 'children'> & { children; fixed? }`，`TableBody` 用对象结果合成展开列并交给公开 `TableCell` 渲染，class/onCell/style/align/render/`TableRenderReturnObject.props` 沿用普通单元格同一套合并规则；`fixed` 保持元数据，不落到 DOM。展开行改用 `computed` 映射按行求值，折叠且非 `keepDOM` 的行不再调用 `expandedRowRender`，每次渲染每条展开行只调用一次。
- 验收证据：`TableExpansion.public.test.ts` 新增两条公开回归覆盖附加列属性（class/onCell/style/align/colSpan、`fixed` 不进入 DOM）与 `render` 覆盖并合并返回 props，同时断言折叠态 0 次调用、展开后 1 次调用；Table 全部 93 项单元/SSR 通过，Table 专项 Chromium 5/5 通过（覆盖场景未含展开行，用于确认共享 `TableBody` 未回归）。

Dynamic 的默认 Pagination 通过一个合并后的 `onChange` 入口进入 Table 处理器，避免 Vue 将配置中的 onChange 与模板监听合并后再次调用配置函数。配置回调先于 Table 的 pageChange/change 通知，受控数据和 loading 门控继续由调用方管理；top、bottom 与 both 均使用相同入口。其 14 个功能切换项同时消费 Switch 的受控状态与移除控制状态后的切换语义，依赖契约见 [Switch 对齐说明](../switch/alignment.md)。表格固定布局依据声明列的 fixed/ellipsis 或固定表头条件决定；单独注入固定选择列、展开列仍保留自动布局，固定单元格自身继续生效。

固定 Foundation 的 `change.filters` 和 `change.sorter` 返回整列查询对象，保留 title、render、sorter 等公开属性及函数引用；通过原声明溯源排除规范化生成的 key、__width 等内部字段，原声明的显式 key 和 __remoteId 等自定义字段继续保留。查询初始化补齐空 filteredValue，sortable 列补齐 false 排序状态；filters 仅包含非空过滤值或显式数组控制的列，不依赖该列是否配置筛选菜单。非数组 filteredValue 不构成受控过滤；清除时回调报告本次请求的空数组，受控正文继续保持调用方值。payload 的列对象及数组与 props 分离，pagination=false 时报告空 pagination 对象。

排序和过滤先保存操作前的查询快照，再更新内部状态并通知。排序请求只替换 sorter，filters 内同列的 sortOrder 仍为点击前值；过滤请求只替换 filters 内该列的 filteredValue，默认 sorter 保留清除前的过滤数组。此快照限定于查询，pagination 继续沿用既有通知路径与页码重置处理。

Dynamic 首次排序的完整 sorter 经消费者回填 columns 后，其空 filteredValue 使该列成为受控过滤列。再次点击上报 descend 请求，但 filters 同时携带旧 ascend 查询；示例先合并 sorter 再合并 filters，所以最终仍为 ascend。切换到日期排序后，两列也可同时保留 ascend，后续日期请求继续是 descend。此行为来自固定查询和示例回填顺序，不能通过裁剪回调字段或替消费者重排合并顺序来消除。

固定公开入口按 resizable 的真假选择 NormalTable 或 ResizableTable，真假变化会卸载旧内部实例。Vue 的公开 Table 保留完整 props、emits、slots 和 getCurrentPageData，再按该模式重建私有 TableCore：非受控查询、选择、展开及分页重新读取当前默认值；受控值继续服从当前 props；拖动列宽、过滤菜单临时状态、滚动位置、虚拟测量缓存和监听器均随内部实例清理。true 与配置对象之间切换保持实例。原始 VNode props 在每次 render 透传，缺省 Boolean 不被包装层补成显式值；保留原有 data 属性、class/style 与 slot 行为，保留公开 ref 和 Table.Column/常量。公开事件只经一个 emit 入口，普通展开和分组展开不再同时直接调用同名 prop，模式切换本身不产生选择、展开或 change 通知。

本轮定向单测对应以下公开契约。旧文档批次与覆盖账本已[退役](../../documentation/README.md)；浏览器、视觉和产物有效性需按[验证入口](../../testing/validation.md)核对当前输入，历史文档结果不替代组件证据。

| 定向单测                                                                                              | 覆盖契约                                                                                                                    |
| ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| [TableVirtualized.public.test.ts](../../../packages/ui/src/table/TableVirtualized.public.test.ts)     | div 窗口、53px 默认与 50px 估算、筛选恢复缓存、逐行高度、auto 定位、程序/纵向/横向通知、RTL、resetAfterIndex 与独立展开索引 |
| [TableDeclarative.public.test.ts](../../../packages/ui/src/table/TableDeclarative.public.test.ts)     | 编译 SFC 的 kebab-case/Boolean、嵌套表头、排序过滤和 use-full-render 选择交互                                               |
| [TableGroupedHeader.public.test.ts](../../../packages/ui/src/table/TableGroupedHeader.public.test.ts) | LTR/RTL 固定父组、逐层列偏移与边缘、父组和叶子的 rowSpan 及显式覆盖                                                         |
| [TableExpansion.public.test.ts](../../../packages/ui/src/table/TableExpansion.public.test.ts)         | 对象展开结果、根宽度及滚动条扣减、rAF 更新阈值、取消固定列、卸载清理与折叠重开                                              |
| [TableCellRender.public.test.ts](../../../packages/ui/src/table/TableCellRender.public.test.ts)       | render 对象省略 props、VNode 内容及后续跨度合并                                                                             |
| [TablePagination.public.test.ts](../../../packages/ui/src/table/TablePagination.public.test.ts)       | top/bottom/both 分页配置回调每次只执行一次，页码和 pageChange 正常更新                                                      |
| [TableLayout.public.test.ts](../../../packages/ui/src/table/TableLayout.public.test.ts)               | 动态固定选择与展开列不强制整表布局；声明列 fixed/ellipsis、固定表头启用及移除                                               |
| [TableChangeInfo.public.test.ts](../../../packages/ui/src/table/TableChangeInfo.public.test.ts)       | 完整列查询、原声明 key/自定义字段、操作前查询快照、连续两列排序回填、非筛选列空数组控制、受控与非受控清除及 props 只读      |
| [TableResizableMode.public.test.ts](../../../packages/ui/src/table/TableResizableMode.public.test.ts) | 真假模式重建、同真值保留、默认与受控状态、列宽/监听清理、虚拟 ref、props 缺省、attrs/slots/公开 ref 和事件单次转发          |
