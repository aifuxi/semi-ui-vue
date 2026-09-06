# 双语文档分批交付顺序

以固定 v2.102.0 的 859 个中文上游 live Demo 索引为统计单位，每项关联双语实现。每批同时关闭内容、交互与视觉待办；不能把映射数量当验收数量。

## 第一阶段

Button 17 项试点，建立可独立运行、可追溯且随源码变化失效的验收流程。当前实际状态以 coverage.json 的有效证据为准，入口是 `pnpm --filter @workspace/docs accept:nuxt:batch button`。

## 第二阶段：初始 163 项待映射

Icon 8 项、ConfigProvider 3 项、Locale 3 项均已完成双语映射与严格验收，本阶段剩余 149 项待映射；下一验收批次为 Dark Mode 2 项。

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

## 第三阶段：其余 679 项已映射示例

不重复计算 Button 17 项，同样按组件拆批。每类内部按 coverage.json 中的固定文档顺序执行；展示类把动态浮层、图片、轮播和 Table 放在静态展示之后，输入类把选择器、日期时间、TreeSelect、Form、Upload 放在基础输入之后。

| 分类                                         | 数量 |
| -------------------------------------------- | ---: |
| 其余基础组件及 Accessibility                 |   54 |
| Banner、Popconfirm、Progress、Skeleton、Spin |   33 |
| 展示类                                       |  207 |
| 导航类                                       |   87 |
| 输入类                                       |  298 |

## 收尾

无 Demo 的指南、全量 API 和迁移段落审阅；站点壳视觉、搜索/链接/编辑器回归；Nuxt/REPL 传递依赖许可审计；全仓门禁。默认入口已统一为 Nuxt，剩余证据不作为保留旧框架的前提。本文不是完成声明；正式计数读取 coverage.json。
