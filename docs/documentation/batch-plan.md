# 双语示例补齐与严格验收双线计划

以固定 v2.102.0 的 859 个中文上游 live Demo 索引为统计单位，每项关联双语实现。补齐线交付完整、可运行的双语示例，验收线交付与固定 React 基线一致的视觉和行为证据；两条线独立排期，不要求同一批同时关闭两类待办，最终仍须全部验收。

## 当前进度与口径

| 工作线             | 当前进度        | 剩余范围                   | 下一批                           |
| ------------------ | --------------- | -------------------------- | -------------------------------- |
| 双语示例补齐       | 859/859 已映射  | 0 项待映射                 | 补齐队列清零，进入收尾审阅       |
| 严格视觉与行为验收 | 23/859 当前有效 | 309 项待恢复；527 项未验收 | 恢复历史；新增 Table 第 16–30 项 |

复用 `coverage.json` 的 `unmapped`、`implemented-awaiting-parity`、`accepted` 状态，不新增状态系统。已映射数量不追认为全部通过统一运行检查；补齐批次的加载、运行和内容检查证据随交付记录，不能仅凭映射声明补齐完成。有效验收数量以当前源码对应的证据为准。

2026-09-13 正式验收工具增加前置审阅门禁与失败即停，当时 44 批旧报告因工具输入变化待重验，历史累计通过仍为332项，尚未验收527项。新门禁发现 Divider、Notification、Popconfirm、Toast 缺少章节/API/迁移审阅，见[改进记录](../../ai-work/20260913-074247-documentation-acceptance-guardrails.md)。本轮由三个子 agent 准备并交叉审阅这四批，补齐真实语义审阅及正文 API 边界，73 项代表诊断与 184 项完整历史矩阵全部通过，恢复 23 个有效示例，四批审阅和浏览器证据均有效。未新增示例验收范围；其余 40 批旧报告及指纹保留，309 项历史示例待恢复，详见[四批恢复记录](../../ai-work/20260913-4-batch-historical-review.md)。下文历次通过数字保留当时事实。

Button 17 项试点已建立独立、可追溯且随源码变化失效的验收流程。2026-09-11 的九批 352 项正式矩阵已联合通过，覆盖 Grid 新增 56 项及受 CSS 精度修复影响的历史八批，Layout 八项随后通过 64 项正式矩阵，Resizable 14 项再通过 112 项正式矩阵，Space 5 项再通过 40 项正式矩阵，Typography 10 项再通过 80 项正式矩阵，Accessibility 1 项再通过 8 项正式矩阵，Banner 4 项再通过 32 项正式矩阵，Feedback 7 项再通过 56 项正式矩阵，Notification 8 项再通过 64 项正式矩阵，并因组件内部对齐修复重验 ConfigProvider 16 项；Toast 9 项再通过 72 项正式矩阵（含英文独有 Stacking），并因 hook holder 结构修复重验 ConfigProvider、Resizable、Typography；Popconfirm 4 项通过 32 项正式矩阵，其 `RadioGroup` 片段修复与站点焦点环改动使全部 19 批证据失效，按完整失效集合重验 19 批共 912 项；Progress 12 项随后通过 96 项正式矩阵，章节/API/迁移审阅与本批门禁有效，历史十九批证据未失效；Skeleton 8 项再通过 60 项正式矩阵（Table 仅 LTR，理由见记录），历史二十批证据未失效；Spin 5 项再通过 40 项正式矩阵（含英文独有 Controlled），历史二十一批证据未失效；Avatar 15 项通过 120 项正式矩阵，其 slot VNode 克隆修复使 8 个真实消费批次（accessibility、config-provider、dark-mode、layout、locale、navigation、skeleton、space）按依赖重验 264 项，合计 9 批 384 项一次通过；Badge 6 项通过 48 项正式矩阵，只新增批次配置、参考适配器与矩阵，未使历史批次证据失效；Calendar 9 项通过 72 项正式矩阵，其月视图 DOM 修复按真实依赖重验 Locale 16 项，并因 Badge 验收文档在验收后补写使该批证据失效一并重验，合计 3 批 136 项一次通过；Card 14 项通过 112 项正式矩阵（封面与头像资源、英文引导文案对齐固定上游，未修改组件），未使历史批次证据失效；Collapse 6 项通过 48 项正式矩阵（修复 CollapsePanel 的 aria-owns 渲染传播，并对齐上游 ItemKey 笔误与 extra 子节点形式），未使历史批次证据失效；Collapsible 4 项通过 32 项正式矩阵（示例按固定上游恢复内联样式锚点与文案，并补上固定 Nested 片段的 useState 导入），未使历史批次证据失效；Descriptions 8 项通过 64 项正式矩阵（英文示例数据按固定上游重写，英文纵向示例复用同一份数据切换 layout），未使历史批次证据失效；Empty 5 项通过 40 项正式矩阵（参考适配器把插画包指向固定 vendor 入口，示例与固定片段逐字一致），未使历史批次证据失效；Highlight 4 项通过 32 项正式矩阵（逐片段裁剪改为固定裁剪区域，并对固定 Adapter 的 searchWords propTypes 告警做精确豁免），未使历史批次证据失效；List 11 项通过 88 项正式矩阵（英文示例数据与文案按固定片段重写，添加删除项与响应键盘事件按上游行为收敛，ScrollLoad/Virtualized/DragSort 因参考壳缺少第三方依赖、补依赖会使全部历史批次失效而记录后排除），未使历史批次证据失效；OverflowList 4 项通过 32 项正式矩阵（修复折叠与滚动模式隐藏项计数滞后：在渲染期调用 overflow 渲染器并以隐藏项键重建包装节点与滚动边缘片段，示例去掉迁移时额外添加的 Slider aria-label），未使历史批次证据失效；ScrollList 1 项、Tag 12 项与 Timeline 8 项通过并行准备和 168 项正式矩阵；共享修复后全三十六批 1964 项重新验收通过，详见 [并行试跑记录](../../ai-work/20260912-175616-parallel-documentation-trial.md)；本轮 Carousel 8 项、Cropper 5 项、Dropdown 6 项新增 152 项正式矩阵全部通过；Dropdown 触发器属性与回焦修复使全部历史三十六批按真实依赖重验 1964 项，最终三十九批 2116 项均有效，新增 19 个有效示例，详见[本轮并行验收记录](../../ai-work/20260912-204000-parallel-documentation-acceptance.md)；只有正式验收成功才能增加 `accepted`。Typography 英文省略在宽度恢复时保留 Vue 三行布局、与固定 React 四行不同，这是用户明确确认的限定差异；断言与范围见 [Typography 验收记录](./typography-acceptance.md)。Skeleton 的 Table 示例记录固定站无 ConfigProvider 造成的 `semi-table-wrapper-undefined` 与 Vue 缺省 `ltr` 的限定差异，见 [Skeleton 验收记录](./skeleton-acceptance.md)。

接续一轮由三个子 agent 并行准备 Image 10 项、Modal 12 项、Popover 9 项，新增 31 项有效验收（248 项正式用例）。修复 Image 页码/分组标识、Modal 渲染边界/静态图标、Tooltip 初始焦点，以及文档构建文件名冲突与局部浮层裁剪；按实际失效范围恢复历史 39 批 2116 项用例。最终 42 批 2364 项完整矩阵全部通过，证据均有效，下一批 SideSheet 6 项，详见[本轮工作记录](../../ai-work/20260912-232400-parallel-documentation-acceptance.md)。

本轮由最多三个子 agent 分工准备和复核，SideSheet 6 项与 Table 第 1–15 项新增 21 项有效验收，168 项正式用例通过。修复 Table 分页、排序、筛选、展开、固定列及相关组件契约，并修复共享参考 Date 复制和方向预览环境；按实际失效范围恢复历史 42 批 2364 项。最终 44 批 2532 项完整矩阵全部通过，证据均有效，下一批为 Table 第 16–30 项，详见[本轮工作记录](../../ai-work/20260913-014200-parallel-documentation-acceptance.md)。

## 补齐线：剩余 0 项待映射

初始 163 项中，Icon 8 项、ConfigProvider 3 项、Locale 3 项、Dark Mode 2 项、Navigation 10 项已完成双语映射与严格验收；OverflowList 4 项、ScrollList 1 项、Transfer 14 项、Feedback 7 项、Notification 8 项、Toast 9 项、UserGuide 8 项、DragMove 4 项和 HotKeys 5 项已完成补齐线检查，其中 OverflowList、ScrollList、Feedback、Notification、Toast 已完成严格验收，其余严格验收待办仍保留，见 [OverflowList 记录](../../ai-work/20260907-103119-overflow-list-documentation-content.md)、[ScrollList 记录](../../ai-work/20260907-110551-scroll-list-documentation-content.md)、[Transfer 记录](../../ai-work/20260907-113702-transfer-documentation-content.md)、[Feedback 记录](../../ai-work/20260907-161013-feedback-documentation-content.md)、[Notification 记录](../../ai-work/20260907-185102-notification-documentation-content.md)、[Toast 记录](../../ai-work/20260907-212444-toast-documentation-content.md)与 [UserGuide / DragMove / HotKeys 记录](../../ai-work/20260907-222000-user-guide-drag-move-hot-keys-documentation.md)。以下保留原队列，跳过已补齐条目。补齐队列已清零，后续推进严格验收和收尾审阅。

本轮已补齐 CodeHighlight 3 项、JsonViewer 6 项、MarkdownRender 4 项、AudioPlayer 3 项、VideoPlayer 10 项，运行证据见[接续批次记录](../../ai-work/20260907-231500-next-five-documentation.md)。本轮补齐不新增 accepted。

接续批次 Lottie 4 项、Chat 11 项、AIChatDialogue 13 项、AIChatInput 13 项、Sidebar 8 项双语示例已完成静态运行、源码重置与在线编辑检查，见[工作记录](../../ai-work/20260908-103000-next-five-documentation.md)。

最后 AIComponent 2 项双语示例已完成静态站主要操作、源码/重置及真实在线编辑验证，见[工作记录](../../ai-work/20260908-231743-ai-component-documentation.md)。补齐不新增 accepted。

一个组件一个批次；组件超过 20 项时按上游索引每 15 项拆分，最后一批收尾。按表格从上到下、每行从左到右推进。

| 顺序 | 文档及上游示例数                                | 小计 |
| ---- | ----------------------------------------------- | ---: |
| 1    | Icon 8、ConfigProvider 3、Locale 3、Dark Mode 2 |   16 |
| 2    | Navigation 10、OverflowList 4、ScrollList 1     |   15 |
| 3    | Transfer 14                                     |   14 |
| 4    | Feedback 7、Notification 8、Toast 9             |   24 |
| 5    | UserGuide 8、DragMove 4、HotKeys 5              |   17 |
| 6    | CodeHighlight 3、JsonViewer 6、MarkdownRender 4 |   13 |
| 7    | AudioPlayer 3、VideoPlayer 10、Lottie 4         |   17 |
| 8    | Chat 11、AIChatDialogue 13                      |   24 |
| 9    | AIChatInput 13、Sidebar 8、AIComponent 2        |   23 |

## 验收线：527 项已映射待验收及后续入队示例

现有 527 项队列现在即可推进，不以补齐线完成为前提。按下表分类顺序、每类内部按 `coverage.json` 固定文档顺序选择尚未有效验收的示例；Divider 2 项、FloatButton 7 项、Grid 7 项、Layout 8 项、Resizable 14 项、Space 5 项、Typography 10 项、Accessibility 1 项、Banner 4 项、Feedback 7 项、Notification 8 项、Toast 9 项、Popconfirm 4 项、Progress 12 项、Skeleton 8 项、Spin 5 项与展示类静态组件 Avatar 15 项、Badge 6 项、Calendar 9 项、Card 14 项、Collapse 6 项、Collapsible 4 项、Descriptions 8 项、Empty 5 项、Highlight 4 项、List 11 项、OverflowList 4 项、ScrollList 1 项、Tag 12 项、Timeline 8 项、Carousel 8 项、Cropper 5 项、Dropdown 6 项、Image 10 项、Modal 12 项、Popover 9 项、SideSheet 6 项与 Table 第 1–15 项已完成（ScrollLoad、Virtualized、DragSort 因第三方依赖记录后排除，仍留在队列中），下一批为展示类 Table 第 16–30 项。同样按组件拆批，超过 20 项时按上游索引每 15 项拆分。展示类把动态浮层、图片、轮播和 Table 放在静态展示之后，输入类把选择器、日期时间、TreeSelect、Form、Upload 放在基础输入之后。

补齐线交付的新示例按所属分类加入验收队列，在下一次选批时纳入，不中断正在验收的批次；不属于下表分类的指南、工具、媒体与 AI 示例按补齐线表格顺序接续。下表列当前 527 项，包含新入队的 Transfer 14 项、UserGuide 8 项、DragMove 4 项和 HotKeys 5 项，不是最终验收范围。选定批次仍需确认示例可运行，并完成章节/API/迁移审阅及完整严格矩阵；已有映射不代替这些检查。Transfer 须审阅原生拖放、删除按钮和自定义面板空态适配差异；UserGuide 须对照本地封面替换、完整位置/高亮/受控/动效矩阵；DragMove 须对照双语小宽度及自定义 right 定位；HotKeys 须对照默认快捷键动作和局部监听边界。

| 分类                                                                                           | 数量 |
| ---------------------------------------------------------------------------------------------- | ---: |
| 其余基础组件及 Accessibility                                                                   |    0 |
| Banner、Notification、Toast、Popconfirm、Progress、Skeleton、Spin、Feedback                    |    0 |
| 展示类                                                                                         |   42 |
| 导航类                                                                                         |   87 |
| 输入类（含 Transfer 14 项）                                                                    |  312 |
| 工具类（DragMove 4 项、HotKeys 5 项）                                                          |    9 |
| 其他 Plus（CodeHighlight、JsonViewer、MarkdownRender、AudioPlayer、VideoPlayer、Lottie、Chat） |   41 |
| AI 组件（AIChatDialogue、AIChatInput、Sidebar、AIComponent）                                   |   36 |

两条线可以并行处理无关输入。补齐若修改了已验收组件、主题或共享设施，仍按真实依赖使历史证据失效并安排重验，不保留虚假的 `accepted`。正式验收期间冻结本轮受追踪输入和准备产物；共享修改与构建须错开，独立任务不得覆盖本轮产物。具体完成标准与命令见 [工作流](./workflow.md)。

## 收尾

无 Demo 的指南、全量 API 和迁移段落审阅；站点壳视觉、搜索/链接/编辑器回归；Nuxt/REPL 传递依赖许可审计；全仓门禁。默认入口已统一为 Nuxt，剩余证据不作为保留旧框架的前提。本文不是完成声明；正式计数读取 coverage.json。
