# Table 文档首批严格验收

固定参考：只读 Semi v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21，`show/table`。本轮 `table-1` 仅覆盖中文索引 1–15 及相同序号的英文片段；中文总 37、英文总 35，后续 22 项中文及其英文映射不计入本批。完整矩阵为 15 × 双语 × 明暗 × LTR/RTL = 120 用例，代表诊断不生成 accepted。

## 全部双语片段前提审阅

| 索引 | 示例               | 固定前提                                                                                                                                             |
| ---- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Basic              | 3 行固定文件记录，中 6 / 英 5 列；无显式宽度。                                                                                                       |
| 2    | DeclarativeColumns | 3 行、5 列、无宽度；中文更新列为「更新时间」。                                                                                                       |
| 3    | Selection          | 6 条数据、每页 3 条，第三条禁选；中文独有状态列。原 selectedKeys 未参与渲染，不增加可见状态段落。                                                    |
| 4    | CustomRendering    | 4 行、400/150/300/200 宽度、中文独有状态列，图标删除按钮、minHeight 350、标题 Tooltip、明暗 Empty 与重置。                                           |
| 5    | Pagination         | 46 条、默认页 10、scroll.y=300、行选择、名称过滤、大小/日期排序；中文独有状态列。                                                                    |
| 6    | RemoteData         | 46 总数、每页 5、300ms 本地请求，受控页码；中文独有状态列。Vue 分页回调为 onChange。                                                                 |
| 7    | Fixed              | 46 条、x=1200/y=300、复选列和首末列固定；宽度 250/200/200/200/100。                                                                                  |
| 8    | SortFilter         | 46 条、scroll.y=300、复选、名称筛选和三列排序；中文独有状态列。                                                                                      |
| 9    | UndefinedSort      | 6 条，大小 3/undefined/1/5/undefined/2，第三排序参数确保未知项置后；中文独有整表头排序 Tooltip，英文不加提示；英文专属 Jiang/Hao 与文件名。          |
| 10   | HeaderFilter       | 46 条、Space/Input、组合输入过滤；中文日期 2024-01-25、D2C 首页及状态列，英文当前日期/design draft。                                                 |
| 11   | CustomFilter       | 46 条、owner 默认筛选 23 条；标题面板确认/清除后关闭，owner 面板不关闭。英文 owner 按钮仍写 Filter+Close/Clear+Close，保留实际 closeDropdown=false。 |
| 12   | FilterConfirm      | 20 条、2024-01-25、Semi Pro 首页、标题列宽 300，两列确认筛选；英文 Update Date。                                                                     |
| 13   | FilterItem         | 46 条、scroll.y=300、复选，自定义 Dropdown.Item、showTick=true，三列排序。                                                                           |
| 14   | Expanded           | 3 条、rowKey=name、名称宽 500、第三条禁选；展开固定五项 Descriptions。                                                                               |
| 15   | SeparateExpand     | 同 14，显式 hideExpandedColumn=false；英文安全等级保留「级」。                                                                                       |

锁定 `@vue/repl` 的相对导入解析不以当前文件目录为起点；上层共享 fixture 会将虚拟根提升到 `table/`，使 `en-us/Basic.vue` 的 `./first-batch-data` 无法解析。首批按语言各保留一份本批自有列适配 fixture，与该语言 SFC/data 同目录，避免嵌套虚拟入口；不修改公共 REPL、不内联 30 份示例，也不复制固定 React 实现。

所有片段只有一个 Table wrapper；带 scroll.y 的片段包含分离表头与表体两张 table，不把 DOM table 数误当示例数量。status 仅在中文 1/3/4/5/6/8/10 出现。静态记录以专属数据 fixture 保存，没有复制 React 组件、函数或类；Vue 列使用 h()、默认插槽和公开类型，根 Table 保持模板写法。

## 参考适配与确定性

参考适配器直接编译固定片段，只补缺失 hooks、映射固定插画入口和两个原始 PNG 本地 URL，英文注入完整 locale；不改变记录、宽度、排序器、过滤器或异步时序。PNG 为原始字节的 64×64 本地副本，来源及哈希见资产归属记录。仅编译首 15 段，不用后续复杂片段的缺失依赖阻断本批。

浏览器仅固定无参 Date 构造与 Date() 显示值为 2024-08-15T10:24:30+08:00，保留原生 Date.now、带参日期、真实计时器、编辑器和异步请求。冻结 Date.now 会触发 Vue 冒泡事件时间戳保护，导致父级点击被丢弃；本批不冻结事件时钟。资源真实解码后比较全部后代节点的 tag/class/属性、文本、控件值与 checked、computed style，几何各轴 ≤0.5px；截图 threshold=0.1、maxDiffPixelRatio=0.001。参考壳按真实 Vue box 与滚动位置做绝对定位；Portal 对比保留视口坐标。

限定框架等价项：生成 id 按本根定义顺序及引用归一；关闭 Portal 尚无定义的 id 按当前示例触发器位置归一，data-popupid 与 ARIA 引用保留一致映射，打开后的 Portal 仍使用其宿主示例映射；Vue scoped data-v-* 不比较但计算样式仍比较；checked 属性交给 checked property 对比；图片 src 仅归一本地服务 origin、保留资源路径。ARIA false 不统一忽略。不裁剪可见差异、不 mask、不放宽阈值。

固定中文片段无 ConfigProvider，React Table 因缺省 direction 输出 `semi-table-wrapper-undefined`，Vue 公开缺省为 `semi-table-wrapper-ltr`；沿用 Skeleton 的限定来源，仅在 LTR 用例将这一个 class 字符串映射为后者，不改变实际方向、其它 class 或计算样式。LTR 中须由完整样式/几何/像素断言证明等价；合成 RTL 的方向差异仍会失败，不能由此归一消除。中文状态列原例 spread `tagProps` 的 `text` 会透传到 Tag DOM，本批所有 7 个相关示例保留该属性与同一可见文字。

## 行为和编辑器

覆盖选择/禁用/跨页、删除全部/Empty/重置、Tooltip 悬停关闭重开、分页往返、固定列双轴滚动、升序降序取消与空值尾部、组合输入过滤清空、默认/自定义/确认筛选 Portal、owner 面板不关闭及清除、展开折叠重开。全部双语 light/LTR 验证源码/工具栏重置/多文件编辑运行/退出恢复；有交互的编辑器示例再执行主要操作。

## 章节、API 与迁移审阅

保留双语全部现有章节和后续示例注册；本批只恢复首 15 示例的固定数据与演示结构，不追认后续示例。正文同步受控页码直接消费当前页、Vue pagination.onChange、三参数 sorter、Selection 控制台结果及 grid/treegrid；列 render 返回 VNodeChild/TableRenderReturnObject，不使用 React 返回类型。API 基于公开 `table/types.ts`，包括 Table、Column、rowSelection、scroll、pagination、Resizable、方法、slots/emits；迁移区保留 props/事件/作用域插槽差异。

准备检查及当前有效正式状态以主调度记录、最终 review 指纹与 `evidence/table-1.json` 为准。没有完整证据时本文件不声明通过；后续批次仍在队列中。

### 显式方向预览环境

文档预览支持通用 `direction=rtl` / `direction=ltr` 查询参数：仅合法单值使用真实 ConfigProvider，传入当前文档语言；未指定、非法值或重复值保持原组件树。此能力只作用于预览，源码与在线编辑不变。Table 首批矩阵仅 RTL 导航附带参数，并在挂载前设定页面方向；React 中文仅显式 RTL 增加同一 Provider，英文既有语言 Provider 明确传入方向。两端 Provider 原生 RTL 容器、Table 内部方向、固定列与 Portal 样式均继续按原门槛比较，不归一化方向差异。矩阵仍为 120 项；通用方向预览另有 3 项公开页面行为测试，实际执行结果由统一验收记录。

### 交互诊断前提

参考壳在组件挂载前获得 Vue 实际预览宽度，避免固定表头首次测量缓存不同视口宽度。Portal 几何在真实有限动画结束后比较，保留视口绝对坐标。Fixed 按 LTR/RTL 分别设置正负水平滚动值，并同时断言真实水平及垂直位置。删除光标下方的行会产生不同的框架进入事件序列，重置后先真实悬停同一首行、比较悬停终态，再移出并确认双方悬停清除；不忽略 hovered class。

独立 REPL 直接运行示例源码，不继承文档页的 LocaleProvider；编辑器自身语言不等于 Semi 组件语言。因此 FilterConfirm 的 REPL 确认按钮使用包的缺省中文「确定」，页面矩阵仍严格验证英文「OK」。不向编辑源码注入隐藏 Provider。

自定义筛选器的 `confirm({ closeDropdown: false })` / `clear({ closeDropdown: false })` 须保持面板打开，只有显式关闭请求才关闭；Table 不强制覆盖 `filterDropdownProps.clickToHide`。该路径同时比较空结果与恢复结果后的 Portal 位置，不将退出动画仍可见误判为稳定打开。

owner 面板首次打开后，先等待双方真实入场动画结束，再填写并点击；否则 Playwright 在不稳定元素上的重试会改变参考页滚动对齐。窄分栏 REPL 中 CustomFilter 的宽面板受 iframe 边界裁剪，编辑器以真实 Tab 聚焦首个确认按钮、断言焦点后 Enter 激活，并验证过滤终态；主页面全部鼠标点击与 Portal 视觉对照不变。
