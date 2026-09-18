# AI 工作记录：Carousel、Cropper、Dropdown 文档严格验收

- 日期：2026-09-12
- 状态：已完成；39 批正式证据有效，按本轮范围提交

## 目标与调度

按维护队列并行准备 Carousel 8 项、Cropper 5 项、Dropdown 6 项；三个子 agent 各维护本批材料，主 agent 统一构建、浏览器诊断、正式验收、历史回归与提交。起始工作区干净，vendor 提交为 cdfba6e520fc83ad871b30f51f36d8af3aaa5a21，36 批历史证据全部有效，261/859 项有效、598 项待验收。

静态用例清单实际为 64/40/48 项，共 152 项。格式、lint、固定片段编译及跨批只读审阅先于浏览器；本轮正式结果在下方交付记录与逐批 evidence 中。共享 Dropdown 修复明确由 Dropdown agent 单独负责，其余 agent 不修改共享组件。构建与诊断期间所有被消费源码冻结。

## 准备与诊断记录

日志、原始报告、trace、截图和阶段计时按运行分别保存在 ignored 的 `apps/docs/.data/documentation-smoke/parallel-round-20260912/`。

- 初始影响计划：36 批均有效，无历史证据需提前重验。
- 专用 Cropper 图像保留既有自有素材替换；核对固定文档 CDN 原图为 720×400 与 1440×800，修正旧 800×450 示意图的固有尺寸偏差。照片未入库，资产内容差异继续明确记录，新增归属文件随静态站携带。
- 跨批审阅修正 Carousel 全量删除 id/for/name 的测量盲点；Dropdown 增加实际 trigger 到 popup 的 ID/ARIA 引用验证与 JSON 菜单回调检查。
- diagnostic-01：resources 复用，静态站构建成功；Dropdown 数组索引类型导致 Nuxt typecheck 失败，未进入浏览器，退出 1。修复类型并纠正 Carousel/Dropdown review 指纹的页面顺序。同时核对锁定 Playwright 实现，修复 context 共享时钟的重复推进和编辑器隔离。
- diagnostic-02：准备检查通过；Carousel Indicators 的生成式 aria-labelledby 未正确归一导致失败。报告还显示整页默认 Radio name 相互影响原生 checked；保留 checked 断言，以本批 Demo 独立组名隔离实例。Basic 默认与 next 比较通过，但该用例被全局失败中断，不计通过。
- diagnostic-03：Cropper 固定 React 独立加载失败，原因是 adapter 未移除原文末尾的 render 调用；保留 Demo 函数，仅把运行入口转换为默认导出，10 个固定片段静态验证通过。
- diagnostic-04：Dropdown Position 默认态发现 Tag 触发器少 tabindex/aria-describedby，以及示例文本空白差异；保存完整失败证据后进入定点修复。
- diagnostic-05：Carousel Basic/Theme 完整通过，Indicators 操作误将组件受控选中态等同原生 checked；保留实时 checked 对照，按可见 Radio 标签操作并检查演示终态。
- diagnostic-06：Cropper Basic 导出图片底部出现差异。独立完整路径探针确认两侧 dataURL、样式、几何相同，900px 视口使 426×400 导出图底部 28px 位于视口外；双侧改 1200px 后完整目标差异从 11928 像素降为 0。正式保留完整根、所有内容和门槛，并断言实际视口及无遮挡。
- diagnostic-07：Dropdown Nested 的 Item 额外透传 ARIA，与固定 getDataAttr 边界不符。共享 Item 只保留 data-* attrs，普通触发器仍保留描述关联；回归先红后绿，Dropdown 单元与 SSR 19 项通过。
- diagnostic-08/09：修正 Carousel 相对 has 定位器重复嵌套 root；定点 Indicators 1/1 完整通过，未删除原生 checked 或放宽截图。
- diagnostic-10：Cropper Basic/Controlled 完整通过，Preview 空 src 图片 opacity 不同；本批引入既有 image.css，恢复原站全局样式依赖，保留空节点测量。
- diagnostic-11：Dropdown Basic/Nested 完整通过；Events 采样时 React 入场 class 尚未清理。固定动画为 100ms，300ms 采样后等待 animationend 的真实 class 终态，不关闭动效或归一化 transform；Position/Trigger 被停止中断，Menu 未运行，不计通过。
- diagnostic-12：Carousel 8 项代表执行通过后，Theme 英文标签大小写差异阻断；逐项核验 16 个固定片段，修正 6 处标签。Animation 另发现独立编辑页面在 ClientOnly 挂载前点击 SSR 工具栏；增加实际预览挂载就绪等待。
- diagnostic-13：Cropper Basic/Controlled 完整通过；AspectRatio 初始 225×300 框已满高，向外拖动被固定 Foundation 正确钳制。改为先收缩再扩大，分别检查尺寸、3:4 比例及完整对照。

共享 Dropdown 修复被全部历史 36 批实际导入，未触发保守 fallback；旧证据按真实输入自然失效，本轮必须恢复这些批次的完整矩阵。历史用例 1964 项与本轮新增 152 项分开记录，不将重验计为新增进度。

- diagnostic-14：Dropdown Basic/Nested/Position 完整通过，Events 重开首菜单项出现 focus-visible 背景差异；动画 class 已正确结束，不能继续归因于动画。
- diagnostic-15：Carousel 25/25 代表通过（浏览器 34.4s）。
- diagnostic-16：Cropper 16/16 代表通过（浏览器 24.8s）。
- Dropdown 既有组件 Chromium 五项全部通过（11.5s），未更新截图基线。SSR 公开入口、86 个主题入口、真实 tarball 安装/exports/类型/SSR/Worker/tree-shaking 全部通过；这些结果先于后续焦点修复，受影响部分须补验。
- 焦点探针 original 与 blur-after 均退出 0：原路径 Vue 在显式失焦到浮层卸载间新增 focusin BUTTON，重开首项 focus-visible=true、背景灰，React 为 false/透明。卸载后失焦的对照两侧均透明，证明额外聚焦是原因。固定 Tooltip 在 Escape 隐藏前恢复焦点，动画结束只卸载并发出 afterClose；修复组件末尾重复聚焦，正式矩阵不移动失焦操作掩盖缺陷。
- 焦点修复同时去除 visibleChange(false) 通知的无条件回焦，保留 Escape 隐藏前回焦及 false 配置；退出动画中外部移焦的回归先红后绿。独立复核再补 trigger=custom 排除边界，合成 Escape 回归先红后绿，专项单元/SSR 增至 22 项。
- diagnostic-17：新产物下 Basic/Nested/Position/Trigger/Events 中文代表及 Basic 暗色、英文共 7 项完整通过；Menu 的精确 accessible name 定位未匹配带 tick 图标的菜单项，控制台监听先超时。保留原失败报告（trace 因未处理 Promise 拒绝截断），菜单项改按 role 与完整可见文字定位；并行 await 点击和 console，仍精确验证 click primary，不修改示例回调或 ARIA。
- diagnostic-18：Dropdown 全部六个中文代表（含 Menu 回调）、Basic 暗色及英文共 8 项通过；英文 Nested 已实际打开双层，但断言错误沿用中文片段的 Nested Menu Item 1，固定英文为 Menu Item 1。测试按固定语言精确定位，逐项复核其余双语硬编码断言，保留截图、样式及回调门槛。
- diagnostic-19：三批联合 60 项代表中 54 项通过，包括最终共享源码下 Carousel 25 项与 Cropper 16 项全部通过；Dropdown 英文 Nested 通过，英文 Trigger 因固定片段只有 hover/focus/click 三项而测试误操作第四项 contextMenu 失败。测试显式绑定固定双语触发方式列表并断言数量，中文仍完整验证四项，逐项补审其它数量和索引前提；未增加英文基线不存在的演示或减少完整矩阵。
- diagnostic-20：Dropdown 英文 Trigger 全部行为已完成，但最终严格 console 门禁捕获固定英文 JSX 的 tabindex 属性警告。适配器仅限定英文第 4 个片段，将唯一 Dropdown.Menu tabindex={-1} 改为 tabIndex={-1}，断言匹配恰好一次，保留 DOM tabindex=-1；不屏蔽错误，不改 vendor，映射注明原文笔误和双语触发方式差异。
- diagnostic-21：Dropdown 19/19 代表全部通过（浏览器 44.5s、退出 0）。最终 Carousel/Cropper 代表复用 diagnostic-19 的 25/16 项完整通过结果；后续仅 Dropdown 测试、局部参考适配与本批说明变化，未改变前两批消费者输入。三批均具备最终代表证据，正式 39 批分 13 组（单组 40–240 用例），实际 Playwright 清单与批次集合无缺失或重复。

`pnpm check` 的工具链、vendor、生成资产、边界、全仓格式/lint、源码类型及 177 文件/1220 单元测试通过；最后工具阶段发现既有断言错误地假设每批仅一个适配器，而 Descriptions 已在 c94a930 引入本地 vertical helper。只修正该测试的明确依赖预期，仍逐批精确比较，未改变输入算法或删除真实依赖。全链首次退出 1，耗时 real 108.90s；补验工具阶段单独保存日志和退出码。

## 验证与交付

新增正式三组已通过：Carousel 64、Cropper 40、Dropdown 48，共 152 用例；三批正式退出 0，无失败、重试或跳过。对应 19 个上游示例已写入有效证据。历史 36 批的 1964 用例也全部恢复；13 组共 39 批、2116 用例，所有正式运行退出 0，无失败、重试或跳过。最终影响计划逐一确认 39 批证据有效、无待验收批次。覆盖账本为 280/859，剩余 579；展示类剩余 94 项，下一队列 Image 10 项。

最终共享源码的 Dropdown 浏览器 5/5 通过（12.1s、退出 0），SSR 与真实 tarball 验证再次通过；主题源码未变，复用已通过的 86 根入口检查。全仓工具测试补验为 74+6 项通过、退出 0；源码全仓检查前序与后续受影响文件的格式/lint/类型、Dropdown 22 项单元/SSR 回归共同覆盖最终变更。未声称首次 `pnpm check` 失败的整条命令退出 0。

准备开始时未保存秒级时间，不把子 agent 自报时长之和作为串行基准或声称固定加速倍数。最终耗时按归档 timing.json 的实际阶段汇总。

## 正式分组与计时

| 组  | 批次                                                          | 用例 | 浏览器墙钟（秒） | runner 墙钟（秒） |
| --- | ------------------------------------------------------------- | ---: | ---------------: | ----------------: |
| 1   | Carousel                                                      |   64 |             70.5 |              95.5 |
| 2   | Cropper                                                       |   40 |             47.3 |              69.2 |
| 3   | Dropdown                                                      |   48 |             97.1 |             118.8 |
| 4   | Accessibility、Avatar、Badge、Banner                          |  208 |            103.8 |             128.3 |
| 5   | Button、Calendar                                              |  156 |            136.8 |             162.5 |
| 6   | Card、Collapse、Collapsible、ConfigProvider                   |  208 |            164.0 |             190.6 |
| 7   | DarkMode、Descriptions、Divider、Empty、Feedback、FloatButton |  240 |            199.7 |             227.1 |
| 8   | Grid、Highlight、Icon、Layout                                 |  200 |            185.5 |             212.2 |
| 9   | List、Locale、Navigation、Notification                        |  220 |            293.8 |             322.2 |
| 10  | OverflowList、Popconfirm、Progress                            |  160 |            391.9 |             417.5 |
| 11  | Resizable、ScrollList、Skeleton、Space                        |  220 |            216.1 |             244.7 |
| 12  | Spin、Tag、Timeline                                           |  200 |            100.6 |             130.4 |
| 13  | Toast、Typography                                             |  152 |            257.0 |             284.6 |

- 并行准备：三个 agent 同时负责三批，初始准备约在 20:39–20:46 之间；未单独记录精确墙钟，不将其自报时长相加。
- 诊断与修复：21 次诊断 runner 累计 21.23 分钟，其中浏览器 6.74 分钟；准备构建阶段累计 7.89 分钟，类型/内容/产物检查累计 3.18 分钟，另有新鲜度、覆盖与输入校验。17 次失败运行累计 18.15 分钟，是上述诊断总量的子集，不重复相加。
- 失败排查还包括三次具体探针（Cropper 视口、Dropdown original/blur-after 焦点）、agent 审阅、代码修复与独立检查；与 runner 的交错墙钟未另行拆分。全仓源码检查首次 108.90 秒，后续工具补验与各次定点检查保留日志和退出码。
- 正式浏览器累计 37.73 分钟；13 次 runner 累计 43.39 分钟。正式调度窗口为北京时间 21:52:29–22:40:46，共 48.28 分钟，包含串行归档、调度间隔。全部 39 次准备阶段新鲜度检查均命中已核验缓存；正式阶段未重建资源/站点或重做准备检查。
- 最早可核验诊断至正式结束为 20:46:16–22:40:46，共 114.49 分钟；加上此前并行初备，整轮验收约两小时。提交整理在该窗口之后，不把未秒级记录的准备与排查包装为精确加速数据。

最终仅更新 README 的流程入口、队列、覆盖账本、必要 UI Changeset 和本工作记录；未在正式验收后补写受指纹追踪的三批 acceptance 文件。未运行完整 release:check 或发布操作；剩余 579 项继续保留在维护队列中。
