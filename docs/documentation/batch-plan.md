# 双语示例补齐与严格验收双线计划

以固定 v2.102.0 的 859 个中文上游 live Demo 索引为统计单位，每项关联双语实现。补齐线交付完整、可运行的双语示例，验收线交付与固定 React 基线一致的视觉和行为证据；两条线独立排期，不要求同一批同时关闭两类待办，最终仍须全部验收。

## 当前进度与口径

| 工作线             | 当前进度        | 剩余范围                                       | 下一批                                         |
| ------------------ | --------------- | ---------------------------------------------- | ---------------------------------------------- |
| 双语示例补齐       | 765/859 已映射  | 94 项待映射                                    | UserGuide 8 项，然后 DragMove 4 项             |
| 严格视觉与行为验收 | 43/859 有效验收 | 722 项已映射待验收，另有 94 项待补齐后进入验收 | Divider 2 项，然后 FloatButton 7 项、Grid 7 项 |

复用 `coverage.json` 的 `unmapped`、`implemented-awaiting-parity`、`accepted` 状态，不新增状态系统。已映射数量不追认为全部通过统一运行检查；补齐批次的加载、运行和内容检查证据随交付记录，不能仅凭映射声明补齐完成。有效验收数量以当前源码对应的证据为准。

Button 17 项试点已建立独立、可追溯且随源码变化失效的验收流程。现有六批有效证据继续保留；只有正式验收成功才能增加 `accepted`。

## 补齐线：剩余 94 项待映射

初始 163 项中，Icon 8 项、ConfigProvider 3 项、Locale 3 项、Dark Mode 2 项、Navigation 10 项已完成双语映射与严格验收；OverflowList 4 项、ScrollList 1 项、Transfer 14 项、Feedback 7 项、Notification 8 项和 Toast 9 项已完成补齐线检查，严格验收待办仍保留，见 [OverflowList 记录](../../ai-work/20260907-103119-overflow-list-documentation-content.md)、[ScrollList 记录](../../ai-work/20260907-110551-scroll-list-documentation-content.md)、[Transfer 记录](../../ai-work/20260907-113702-transfer-documentation-content.md)、[Feedback 记录](../../ai-work/20260907-161013-feedback-documentation-content.md)、[Notification 记录](../../ai-work/20260907-185102-notification-documentation-content.md)与 [Toast 记录](../../ai-work/20260907-212444-toast-documentation-content.md)。以下保留原队列，跳过已补齐条目。从 UserGuide 开始继续补齐，无需等待本批严格验收后再推进下一批。

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

## 验收线：722 项已映射待验收及后续入队示例

现有 722 项队列现在即可推进，不以补齐线完成为前提。按下表分类顺序、每类内部按 `coverage.json` 固定文档顺序选择尚未有效验收的示例；下一批为 Divider 2 项。同样按组件拆批，超过 20 项时按上游索引每 15 项拆分。展示类把动态浮层、图片、轮播和 Table 放在静态展示之后，输入类把选择器、日期时间、TreeSelect、Form、Upload 放在基础输入之后。

补齐线交付的新示例按所属分类加入验收队列，在下一次选批时纳入，不中断正在验收的批次；不属于下表分类的指南、工具、媒体与 AI 示例按补齐线表格顺序接续。下表列当前 722 项，包含新入队的 OverflowList 4 项、ScrollList 1 项、Transfer 14 项、Feedback 7 项、Notification 8 项和 Toast 9 项，不是最终验收范围。选定批次仍需确认示例可运行，并完成章节/API/迁移审阅及完整严格矩阵；已有映射不代替这些检查。OverflowList 验收前需定位并修复已记录的 collapse/scroll 计数更新问题；ScrollList 须统一双侧分钟禁用数据；Transfer 须审阅原生拖放、删除按钮和自定义面板空态适配差异；Feedback 须审阅自定义示例的上游初始化/闭包修正及完整动效对照；Notification 须审阅全局 wrapper 共享、同 id 更新、关闭动效、六种位置及自定义图标的完整对照；Toast 须审阅节流适配、同 id 更新计时、stack hover、holder 上下文、自定义容器与完整关闭动效（英文独有堆叠示例亦纳入）。

| 分类                                                                        | 数量 |
| --------------------------------------------------------------------------- | ---: |
| 其余基础组件及 Accessibility                                                |   54 |
| Banner、Notification、Toast、Popconfirm、Progress、Skeleton、Spin、Feedback |   57 |
| 展示类（含 OverflowList 4 项、ScrollList 1 项）                             |  212 |
| 导航类                                                                      |   87 |
| 输入类（含 Transfer 14 项）                                                 |  312 |

两条线可以并行处理无关输入。补齐若修改了已验收组件、主题或共享设施，仍按真实依赖使历史证据失效并安排重验，不保留虚假的 `accepted`。正式验收期间冻结本轮受追踪输入和准备产物；共享修改与构建须错开，独立任务不得覆盖本轮产物。具体完成标准与命令见 [工作流](./workflow.md)。

## 收尾

无 Demo 的指南、全量 API 和迁移段落审阅；站点壳视觉、搜索/链接/编辑器回归；Nuxt/REPL 传递依赖许可审计；全仓门禁。默认入口已统一为 Nuxt，剩余证据不作为保留旧框架的前提。本文不是完成声明；正式计数读取 coverage.json。
