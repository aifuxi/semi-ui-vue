# 双语示例补齐与严格验收双线计划

以固定 v2.102.0 的 859 个中文上游 live Demo 索引为统计单位，每项关联双语实现。补齐线交付完整、可运行的双语示例，验收线交付与固定 React 基线一致的视觉和行为证据；两条线独立排期，不要求同一批同时关闭两类待办，最终仍须全部验收。

## 当前进度与口径

| 工作线             | 当前进度         | 剩余范围           | 下一批                     |
| ------------------ | ---------------- | ------------------ | -------------------------- |
| 双语示例补齐       | 859/859 已映射   | 0 项待映射         | 补齐队列清零，进入收尾审阅 |
| 严格视觉与行为验收 | 125/859 有效验收 | 734 项已映射待验收 | Popconfirm 4 项            |

复用 `coverage.json` 的 `unmapped`、`implemented-awaiting-parity`、`accepted` 状态，不新增状态系统。已映射数量不追认为全部通过统一运行检查；补齐批次的加载、运行和内容检查证据随交付记录，不能仅凭映射声明补齐完成。有效验收数量以当前源码对应的证据为准。

Button 17 项试点已建立独立、可追溯且随源码变化失效的验收流程。2026-09-11 的九批 352 项正式矩阵已联合通过，覆盖 Grid 新增 56 项及受 CSS 精度修复影响的历史八批，Layout 八项随后通过 64 项正式矩阵，Resizable 14 项再通过 112 项正式矩阵，Space 5 项再通过 40 项正式矩阵，Typography 10 项再通过 80 项正式矩阵，Accessibility 1 项再通过 8 项正式矩阵，Banner 4 项再通过 32 项正式矩阵，Feedback 7 项再通过 56 项正式矩阵，Notification 8 项再通过 64 项正式矩阵，并因组件内部对齐修复重验 ConfigProvider 16 项；Toast 9 项再通过 72 项正式矩阵（含英文独有 Stacking），并因 hook holder 结构修复重验 ConfigProvider、Resizable、Typography；当前十八批均有效（共 880 项用例）；只有正式验收成功才能增加 `accepted`。Typography 英文省略在宽度恢复时保留 Vue 三行布局、与固定 React 四行不同，这是用户明确确认的限定差异；断言与范围见 [Typography 验收记录](./typography-acceptance.md)。

## 补齐线：剩余 0 项待映射

初始 163 项中，Icon 8 项、ConfigProvider 3 项、Locale 3 项、Dark Mode 2 项、Navigation 10 项已完成双语映射与严格验收；OverflowList 4 项、ScrollList 1 项、Transfer 14 项、Feedback 7 项、Notification 8 项、Toast 9 项、UserGuide 8 项、DragMove 4 项和 HotKeys 5 项已完成补齐线检查，其中 Feedback 已完成严格验收，其余严格验收待办仍保留，见 [OverflowList 记录](../../ai-work/20260907-103119-overflow-list-documentation-content.md)、[ScrollList 记录](../../ai-work/20260907-110551-scroll-list-documentation-content.md)、[Transfer 记录](../../ai-work/20260907-113702-transfer-documentation-content.md)、[Feedback 记录](../../ai-work/20260907-161013-feedback-documentation-content.md)、[Notification 记录](../../ai-work/20260907-185102-notification-documentation-content.md)、[Toast 记录](../../ai-work/20260907-212444-toast-documentation-content.md)与 [UserGuide / DragMove / HotKeys 记录](../../ai-work/20260907-222000-user-guide-drag-move-hot-keys-documentation.md)。以下保留原队列，跳过已补齐条目。补齐队列已清零，后续推进严格验收和收尾审阅。

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

## 验收线：751 项已映射待验收及后续入队示例

现有 734 项队列现在即可推进，不以补齐线完成为前提。按下表分类顺序、每类内部按 `coverage.json` 固定文档顺序选择尚未有效验收的示例；Divider 2 项、FloatButton 7 项、Grid 7 项、Layout 8 项、Resizable 14 项、Space 5 项、Typography 10 项、Accessibility 1 项、Banner 4 项、Feedback 7 项、Notification 8 项与 Toast 9 项已完成，下一批为 Popconfirm 4 项。同样按组件拆批，超过 20 项时按上游索引每 15 项拆分。展示类把动态浮层、图片、轮播和 Table 放在静态展示之后，输入类把选择器、日期时间、TreeSelect、Form、Upload 放在基础输入之后。

补齐线交付的新示例按所属分类加入验收队列，在下一次选批时纳入，不中断正在验收的批次；不属于下表分类的指南、工具、媒体与 AI 示例按补齐线表格顺序接续。下表列当前 734 项，包含新入队的 OverflowList 4 项、ScrollList 1 项、Transfer 14 项、UserGuide 8 项、DragMove 4 项和 HotKeys 5 项，不是最终验收范围。选定批次仍需确认示例可运行，并完成章节/API/迁移审阅及完整严格矩阵；已有映射不代替这些检查。OverflowList 验收前需定位并修复已记录的 collapse/scroll 计数更新问题；ScrollList 须统一双侧分钟禁用数据；Transfer 须审阅原生拖放、删除按钮和自定义面板空态适配差异；UserGuide 须对照本地封面替换、完整位置/高亮/受控/动效矩阵；DragMove 须对照双语小宽度及自定义 right 定位；HotKeys 须对照默认快捷键动作和局部监听边界。

| 分类                                                                                           | 数量 |
| ---------------------------------------------------------------------------------------------- | ---: |
| 其余基础组件及 Accessibility                                                                   |    0 |
| Banner、Notification、Toast、Popconfirm、Progress、Skeleton、Spin、Feedback                    |   29 |
| 展示类（含 OverflowList 4 项、ScrollList 1 项）                                                |  220 |
| 导航类                                                                                         |   87 |
| 输入类（含 Transfer 14 项）                                                                    |  312 |
| 工具类（DragMove 4 项、HotKeys 5 项）                                                          |    9 |
| 其他 Plus（CodeHighlight、JsonViewer、MarkdownRender、AudioPlayer、VideoPlayer、Lottie、Chat） |   41 |
| AI 组件（AIChatDialogue、AIChatInput、Sidebar、AIComponent）                                   |   36 |

两条线可以并行处理无关输入。补齐若修改了已验收组件、主题或共享设施，仍按真实依赖使历史证据失效并安排重验，不保留虚假的 `accepted`。正式验收期间冻结本轮受追踪输入和准备产物；共享修改与构建须错开，独立任务不得覆盖本轮产物。具体完成标准与命令见 [工作流](./workflow.md)。

## 收尾

无 Demo 的指南、全量 API 和迁移段落审阅；站点壳视觉、搜索/链接/编辑器回归；Nuxt/REPL 传递依赖许可审计；全仓门禁。默认入口已统一为 Nuxt，剩余证据不作为保留旧框架的前提。本文不是完成声明；正式计数读取 coverage.json。
