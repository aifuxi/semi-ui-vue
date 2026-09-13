# Table 第二批严格验收前提

固定基线为只读 `vendor/semi-design` v2.102.0 / `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。本批选择中文 live 16–28、30，共 14 个示例；29 DragSort 保留原有第三方集成待办，不认证为等价。矩阵为双语、明暗、LTR/RTL 的 112 项，Playwright `--list` 已实际发现 112 项。是否通过以正式证据为准，本记录不代表验收成功。

## 固定双语片段前提

| 中文序号 | 示例                   | 固定结构与双语差异                                                                                                                                                                                                            |
| -------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 16       | RowExpandable          | 3 行、5 业务列加独立展开/选择列；第三行设计文档 / Design docs 同时禁选和隐藏展开。展开为按行 index 的五项 Descriptions，首行 1,480,000；英文安全等级仍保留「级」。                                                            |
| 17       | Tree                   | 2 根、全展开 7 行、5 列、type 宽 400、默认分页。最深 video_url 在固定双语片段均无 key，保留前提，未添加伪造主键；生产建议仍要求稳定 key。                                                                                     |
| 18       | TreeReorder            | 初始展开数值 key 1/2，共 6 行、6 列；type 无固定宽度；每行 2 个 IconArrowUp/Down 图标按钮、无额外文本/aria-label，边界禁用。最深无 key 子项保持固定行为。                                                                     |
| 19       | TreeSelection          | 初始 2 根、5 列加选择列、type 宽 400、无分页；显式递归选择父及后代，取消子项不反推父项；无额外 aria-live 状态。                                                                                                               |
| 20       | TreeRelation           | 初始 2 根、4 列加选择列、type 宽 200、无默认值列；key 为 1/1-1/1-2/1-2-1/2/2-1/2-2；related 父子全选/半选关系、无额外状态段落。                                                                                               |
| 21       | RowEvents              | 46 条默认分页 10 行，名称筛选、大小/日期排序；全部 tr 带 my-tr-class，仅 index 2 点击日志，表头进入/离开日志；没有双击或页面状态文字。固定 import 的 semi-ui 尾斜线由参考环境修正。                                           |
| 22       | Zebra                  | 6 行、5 列、无分页；偶数 index 的 tr 内联 background 为 fill-0，不用 td 样式代替；双语保持对应文件与姓名。                                                                                                                    |
| 23       | HeaderStyle            | 中文独有：3 行、5 列、宽 280/100/200/300/auto；全部表头背景 fill-0。英文正文与示例显式翻译中文片段，参考适配器保留相同翻译映射，不声称存在英文固定片段。                                                                      |
| 24       | CellHover              | 中文独有：3 行、5 列，首列 auto，其余 100/200/300/auto。原正文 CSS 去行 background/image 与固定单元格 before 背景，当前单元格 light-green-1；英文同 23 明示派生。                                                             |
| 25       | Ellipsis               | 英文 live 23：4 行、5 列，顺序标题/所有者/大小/更新/操作；前两列过滤、前三列排序，scroll.x=1200，两边固定列；原生 title，无 Avatar。固定长英文/中文内容与重复姓名分别保留。                                                   |
| 26       | EllipsisTooltip        | 英文 live 24：同 25，前两列 showTitle=false，以 Typography.Text 的真实 Tooltip 展示；中文后两 owner 为短姓名，英文保持长姓名。悬停、关闭重开与 Portal 视口位置必须对照。                                                      |
| 27       | Resizable              | 英文 live 25：46 条默认页 10 行、5 列，宽 300(disabled)/200/200/auto/100(fixed right, disabled)，2 手柄。英文缺 IconMore import，以同基线图标补环境。真实 react-resizable 依赖不可用时不能凭无操作 shim 认证。                |
| 28       | ResizableStyle         | 英文 live 26：46 条、页 5 行、4 列宽 400/200/200/auto，3 手柄；id components-table-demo-resizable-column，开始/结束 my-resizing class 与原正文 CSS。缺失 addClass/removeClass 按固定 Foundation utils/classnames 入口补环境。 |
| 29       | DragSort（本轮不验收） | 英文 live 27：PointerSensor distance=1、restrictToVerticalAxis、autoScroll 与当前页 pageData 重排。现有 native HTML5/Alt 键盘适配并不等价，既有 dnd shim 缺失真实传感器与 modifiers；不能以静态表格替代。                     |
| 30       | Grouping               | 英文 live 28：46 条按 ((i*1000)%19)+100 产生 19 组，先按全局组序整理再分页，首屏 4 组 100/112/105/117、默认全部折叠；首组展开 3 条，次页从 117 续组。4 列首宽 400、padding 20px 0、scroll.y=480、真实整行展开与日志。         |

所有片段仅 1 个 Table wrapper。分离表头可能有两张 DOM table，不据此推导实例数。Figma/Docs PNG 沿用已记录的原始 64×64 本地字节；日期显示使用固定无参 Date 构造值，保留真实 Date.now 与计时器。REPL 使用实际源码，不继承文档 Provider。

首次独立 React 编译发现 TreeSelection 的固定 `lodash-es` 依赖未安装，早期 transpile 语法检查没有覆盖包解析。适配器仅将该片段的 `get`、`union`、`pullAll` 导入改为现有 Lodash 的同名函数子路径默认导出，不改调用、参数、返回值或原地修改数组契约。重新通过实际 reference plugin 的 publicImports/compileJsx 编译全部 28 片段，并核验 15 个直接模块的本地入口或现有 alias：React、8 个固定 Semi/locale 入口、固定 Icons、Foundation classnames、date-fns 与 3 个 Lodash 子路径；嵌套查询/缺省值、union 去重、pullAll 同数组删除契约另行断言通过。全部 28 片段的 JSX scope/no-undef 审计通过，覆盖缺失 hook 和官网 scope 绑定；这仍不替代主调度的真实 React 浏览器运行。

## 参考环境与断言

`table-2.mjs` 的 14 个参考槽只读提取上述固定源，1–13 映射中文 16–28，14 映射中文 30；英文 25–30 使用正确的偏移索引。只增加必要 import、原 CSS、语言 Provider 与本地资源地址，不复制固定组件实现。23/24 的英文翻译只修改列名、文件名和姓名；数据、宽度、样式与交互不变。

矩阵继承 table-1 的全部 DOM/class/属性/控件 property、computed style、0.5 CSS px 几何、threshold 0.1 / maxDiffPixelRatio 0.001 像素门槛。仅保留已论证的生成 id、Vue scoped 属性、checked property、本地资源 origin、LTR 缺省 direction class 归一；不忽略 ARIA、hover、resize class 或可见差异。所有后代均测量；Portal 保留视口绝对位置；挂载前固定容器实际几何，等待真实有限动效终态。

Resizable 翻页定点诊断出现样式/几何相等但像素失败，截图显示高于 900px 视口的预览被 Locator.screenshot 自动二次滚动，文档固定页头覆盖顶部 59px。仅本批改为对齐阶段将预览顶端置于真实页头下 80px，再按完整目标 document bounds 执行 `page.screenshot({ fullPage: true, clip })`；裁剪边界与锁定 Playwright 的整数包围盒一致，没有缩小目标、隐藏页头或 mask。已核对锁定 Chromium 截图实现只调用 captureBeyondViewport，不改变 1440×900 布局视口；矩阵逐次断言截图前后目标 box、滚动与视口完全不变。重验保留原默认态→下一页交互顺序及全部原门槛。

后续 Tooltip 重开定点证据显示：两端四节点完整样式/几何相同、visible/opacity=1，视口位置均为 (376,35,240,116)、scrollY=18512，但相同 fullPage document clip 的 React PNG 采到下方标题，Vue PNG 正确。trace 与固定 `_portal/portal.scss` 确认两端祖先均 absolute、相同 left/top/transform，不存在 fixed/absolute 定位差异；截图前后位置、滚动、视口也未变。该证据定位为 Portal 截图采样问题，未进一步断言 Chromium 内部合成原因。完整可见目标尝试 Locator.screenshot 后，稳定断言捕获其仍将英文默认态 scrollY 从 18663 改为 18651，因此不能使用元素截图。最终完整目标已全部位于当前视口时，使用普通 page.screenshot 的视口坐标整数包围盒 clip（省略 fullPage），超高或未完整可见目标仍用完整 document clip。已核对锁定 Playwright：普通截图将 clip 作为 viewportRect，Chromium 再加 visualViewport.pageX/pageY，且 captureBeyondViewport=false，不执行元素滚动。两个分支均保留截图前后全部稳定断言、Portal 绝对位置与完整原目标范围，不隐藏页头、改位置、mask 或放宽门槛。

43 项代表报告的压缩前 minified JSON 为 197.13 MiB，112 项完整矩阵按实测用例体积预计超过 Node 的 512 MiB 字符串上限。仅本批将交互状态的完整样式测量 JSON 无损 gzip，附件明确命名 `<state>-styles.json.gz`、类型 `application/gzip`；解读时先 base64 解码再 gunzip。正式验证器要求的 `default-styles` 继续保存完整原始 JSON，environment、acceptance、PNG、逐节点断言与全部门槛不变。离线对代表报告 221 个交互样式附件逐一压缩/解压验证原字节完全一致，附件 base64 由 140.98 MiB 降为 4.13 MiB，报告等效约 60.28 MiB；按代表平均体积估算 112 项约 157.01 MiB。未拆分完整矩阵、删除测量或修改共享证据验证器；完整正式报告仍由统一 runner 生成。

交互覆盖树的展开折叠/同级换序/父子选择、真实行及表头事件、斑马纹和单元格 hover、固定列滚动、原生 title 与 Typography Portal、三态排序、筛选打开应用关闭重开、真实鼠标拖动列宽、分组与分页。双语 light/LTR 均做源码、重置、在线编辑运行、关键交互和退出恢复。

第 27 项 RTL 跨越横向溢出时，固定 React 的根 ResizeObserver 存在实采时序限制：根高度可先达到终值，最后通知排出的 RAF 可能读到尚未溢出的表格宽度；之后仅表格宽度继续变化不保证再次通知，边缘 class 可能保持旧值，不能用延长等待定义基线未保证的终态。临时 RO/rAF 诊断只证明两端有效注册、通知及 Vue 微任务提交，诊断读取可能同步布局并影响时序，已完全移除，不作为正式通过证据。

仅第 27 项 RTL 使用确定的原生交互范围：相同 40px/5steps 先向左收窄，完整比较拖动中及松开后；再向右恢复，确认回到原列宽（差值不超过 0.5px）并完整比较拖动中及松开后；再向右扩宽跨越溢出。最后这一跨溢出拖态只保存完整原始测量 `resize-overflow-dragging-observation.json.gz`，不声称不确定的阴影已通过。松开后确认真实 scrollWidth/clientWidth 溢出，在 body 可见区域用原生 mouse.wheel 横滚到另一端再返回，等待实际 scrollLeft 改变且到达端点，再按固定 `setScrollPositionClassName` 原公式有界等待完整边缘 class，逐端执行全部 DOM、样式、几何与像素比较。边缘轮询最长 5 秒，成功失败均保存时间戳、几何、scrollLeft 与期望/实际 class。第 27 项另断言松开不改变 COL/TH 宽度或触发排序；LTR 与第 28 项保持原始拖动路径。未派发伪 scroll/resize 事件、换算拖动系数、缩减默认采样、忽略 class 或更改原门槛。

## 正文、API 与迁移审阅

保留双语全部 37 个示例章节及后续队列；修正文案中首条不可展开、双击反馈、交替 class 等与固定示例不符的说明，明确第 29 项的非等价集成边界。渲染 API 继续使用 VNodeChild、Vue DOM 事件拼写与公开 props/emits/slots。分组 renderer 的 group 是当前页成员行 key，Vue groupSection 插槽需单独说明实际 records 契约；伸缩回调支持固定基线的 customProps / handlerClassName 返回值。最终类型与审阅指纹由主调度在共享修复完成后复核冻结。

准备开始时间以主工作记录分工为准；本文件与矩阵的低成本静态检查、最终冻结时间及共享修复成本由主工作记录统一保存。正式跑完不得补写本追踪记录或回填旧证据指纹。
