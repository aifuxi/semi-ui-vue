# Table 第 16–30 项并行严格验收

- 状态：完成；本记录随已验收变更统一提交
- 起点：2026-09-13 12:32:47 +0800（选批记录；此前规范读取未单独计时）
- 目标：按队列推进 table-2，最多三个子 agent 并行准备，主任务统一冻结、诊断、正式验收与提交；不启动下一轮。
- 初始工作区干净；固定 vendor HEAD 为 cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。
- 初始 `pnpm --filter @workspace/docs accept:nuxt:batch --affected --plan` 退出 0：44 批审阅及浏览器证据有效，332/859 有效，527 项尚未首次验收。

## 分工与风险

- 三个准备职责：16–22 示例；23–30 示例；参考适配、矩阵与双语正文/API/迁移审阅。每份文件只有一个写入负责人。
- 主任务维护批次配置、映射、账本、队列、工作记录、证据及提交。构建与浏览器只由主任务调度；运行前取得全部冻结回执。
- 树表选择关联、拖动与列宽调整具有共享组件风险；DragSort 已有第三方集成差异，先核查固定依赖再判断完成边界，不将不等价实现认证。
- 比较门槛与失败即停规则使用现有 runner；历史重验按最终影响计划决定。

## 验证与计时

各阶段失败与重验见下文；最终独立计时见文末，不把并行 agent 时间相加。

## 参考环境前提与范围确认

- `reactResizable.tsx` 仅返回 children，不能验收索引 27/28 的拖动。按固定 vendor/yarn.lock 引入 react-resizable 3.0.5、react-draggable 4.4.6 并将参考 alias 指向真实包。显式锁定 draggable 是为了保持固定基线的传递实现版本。
- `pnpm --filter @workspace/reference-react add --save-exact react-resizable@3.0.5 react-draggable@4.4.6` 退出 0；参考配置 ESLint 与 reference-react typecheck 退出 0。
- 共享 lock 与参考配置变化预计令全部 44 个历史批次失效，正式冻结后重算并恢复完整矩阵；不得将这些历史用例算作新增。
- 索引 29 DragSort 保留既有待办：固定 PointerSensor distance=1、垂直约束、自动滚动/拖动动画及仅当前页重排；现有参考 shim 缺事件实现与 modifiers，Vue 原生 drag/drop 与键盘集成也不等价。本轮不以空壳参考认证，不改该示例或添加虚假 accepted；其余 14 项保留完整双语/明暗/RTL 验收目标。

## 准备交付与共享修复

- 样式组（23–28、30）于 12:37:40 完成 14 个双语 SFC 和 2 个 fixture，Prettier、ESLint、diff 检查退出 0；29 未修改。随后转入 Header/类型/resize 公开测试，未等待构建。
- 树表组（16–22）约 12:39 完成 14 个双语 SFC 和 2 个 fixture，Prettier、ESLint、diff 检查退出 0，固定静态/树数据脚本对比一致；随后转入 Table/Body/utils 分组及 resize 状态修复，整体输入尚未冻结。
- 固定 Foundation 先 groupDataSource 后 limitPageDataSource，Vue 原实现先分页再分组；固定分组行 class、展开图标、ARIA 与行索引也存在源码可确认差异。由树表组统一修复。
- 固定 ResizableTable 合并 resize 回调返回的列属性，并在开始/停止维护 handlerClassName；Header 仅数值列宽可拖动，真实库保留最小 20px 与原始横向增量。由两负责人按文件边界协作修复，不共享写入。
- `pnpm check:vendor`、`pnpm check:boundaries` 退出 0。已创建 Changeset，并因公开 Table 修复声明 UI patch。

## 冻结前检查与返工

- 三方约 12:48 全部重新冻结。并行准备墙钟约 15 分钟，包括共享组件修复与低成本返工；起点以分派记录为准，不把各 agent 耗时相加。参考适配、112 项矩阵和正文/API 审阅完成后，实际 `--list` 为 112；本批 `--preflight` 退出 0、默认代表计划 43 项。
- 交叉审阅在浏览器前修复树示例多余外层、CellHover scoped 根选择器、拖动态 my-resizing 表头定位；resize 后父级列属性更新与删除/重加也补有测试。相关公开测试 31 项有效通过，日志 `unit-initial.log` 与 `unit-final.log`；初轮旧测试漏 mouse button 前提已修复。
- 现有 Table.Column setup 读取 slot 会产生警告。HEAD 中已存在同样 initialQueryState→declaredColumns→slots.default 调用链；本轮新 watch 已避免读取 slot，14 项目标均显式 columns。保留警告，未过滤或声称已验证旧树运行。
- 首次 `pnpm check` 退出 1，完成工具链、基线/生成/边界、全仓格式与 lint 后，在 UI typecheck 发现 resize 返回 children 未规范化及测试 className 显式 undefined 两项类型错误。确认进程结束后定点修复，公开 children 递归 normalize，测试返回实际字符串。检查点前已通过且输入未变的阶段复用，重新执行 source 类型及尚未执行的单测/工具测试；日志和退出状态保留 `root-check.*` / `source-check.*`。
- 影响计划确认 44 个历史批次及新增 table-2 待验收。适配器原动态 URL 造成保守扩展；改为两个静态 URL 后完整保留固定双语来源追踪，table-2 输入由 1885 缩至 1056，未修改指纹算法或移除依赖。该改动单文件格式/lint 已过，审阅仍有效。
- 第二次 source 类型检查继续暴露内部 start/stop className 的可选类型推断，负责人改为实际空字符串后自行运行 UI vue-tsc，退出 0（12.3 秒），其余 source 类型阶段此前已通过。全量 183 文件、1270 项 Rstest 单测通过。
- 工具测试首次仅有一项失败：真实依赖断言尚未登记 table-2 复用 table-1 适配器，以及 Table 的新增真实消费批次。更新准确期望并断言 table-1 变动影响 table-1/table-2，重跑 `pnpm test:tooling` 退出 0，日志 `tooling-final.log`。保留首次失败日志，不改生产输入算法。
- 正式预检前已由主任务使用 JSON `--list` 与 expectedCaseTitles 逐项比对，本批 112 项清单完全一致，存于 `table-2-list.json`。统一 `--prepare-only` 开始准备实际产物，日志/计时/退出状态存于 `prepare.*`。

## 独立参考与第一轮浏览器诊断

- `prepare-only` 退出 0；实际 Playwright 清单逐项对照全部 45 批 2644 项一致（本批 112，历史 2532）。三个诊断逻辑组串行共享准备缓存，运行期间全部源码冻结，结束后确认 4173/4321 及 runner 退出才修复。
- 独立 React 首次编译发现 TreeSelection 固定片段的 lodash-es 缺依赖；保留失败日志，参考负责人改用现有 Lodash 同名子路径并核对调用语义。全部 28 双语片段实际加载通过，真实 27/28 列宽拖动、28 class 开始/停止、30 分组展开通过，smoke 无运行错误或警告；Chromium 151.0.7922.34，报告 `reference-smoke/summary.json`。
- `diagnostic-style` 12 项全部通过、零失败/跳过/重试，墙钟 34377ms。`diagnostic-tree` 首个 TreeReorder 默认结构失败（154/118 节点），21 项未完成；根因为 Vue Button 图标必须使用 icon slot，固定 React icon prop 不能原样传给 Vue。另从完整失败附件核查树叶节点缩进、RowExpandable 第三行空展开格多余 class。
- `diagnostic-resize-group` 首个 Grouping 默认结构失败（106/102），8 项未完成；固定 section-inner、ChevronRight 图标和 JSX 文本节点边界分别由负责人修复。仅独立运行 resize 已知完整路径，Resizable next-page 样式/几何通过，但像素差 1311/0.0015093462 超过 0.001；图片证实 Locator.screenshot 自动滚动使文档固定页头盖住目标上沿。保留截图/报告，使用本批完整 document bounds 截图解决，不隐藏页头、不 mask、不缩裁剪、不调布局 viewport 或阈值。
- 固定 Playwright 1.62.1 源码确认 page.screenshot fullPage+clip 不二次滚动且 Chromium captureBeyondViewport 不改变布局 viewport。矩阵在 align 阶段把根放到页头下，截图前后断言滚动、目标 bounds 与 1440×900 viewport 稳定。该变更需用原 27 完整分页/拖动顺序定点验证，不能把截图原因当作已通过。
- 树叶占位和不可展开空格补公开测试时暴露缺省 expandIcon→false 响应式问题；第一次排除旧 DOMWrapper 引用，第二次 compiler-sfc 确认 Boolean 缺省 false，第三次公开 DOM 探针确认 hasRawProp 短路未读取 prop。以显式 default undefined 配合直接 prop 传递修复，保留失败日志和原前序交互，不靠延时或重试掩盖。
- 最终定点公开测试 2 文件 6 项通过（1.50s），UI 类型检查通过（11.8s）；三方 13:15 前全部冻结。交叉审阅确认当前固定路径的分组事件、全局分组分页、同级索引、列宽 customProps 与 props 刷新契约。范围外保留两个已有边界：缺 key 的 DOM 后备索引不等于 Foundation 业务 key；不可展开行配固定/自定义展开列尚未按固定默认空 TableCell 的全部属性组合验证。本轮不声称这些组合已认证。
- 集中修复后按原前序安排 3 个独立定点组：RowExpandable/Tree/TreeReorder 中文 light、Grouping 中文 light、Resizable/ResizableStyle 中文 light。因 Table 源码变化，资源与静态站缓存实际失效并自动重建；记录在 `fixed-tree.*`，后续组仍校验缓存，不盲目重复构建。
- 集中修复后 `fixed-tree` 3 项、`fixed-group` 1 项完整路径通过（各 runner 浏览器阶段 11.6s / 11.0s）。`fixed-resize` 失败：28 拖动态 131 个节点只有 scroll-position-right class 一项差异，其余全部属性/样式/几何一致；27 已越过原 next-page 像素失败并通过分页/排序/筛选大部分路径，但受 fail-fast 中断，不能算该项完整通过。
- 新差异根因是 Vue flatColumns watcher 对列宽变化立即重算边缘 class，固定组件只在挂载/真实滚动/容器尺寸变化更新。交由 Table 负责人最小修复并补公开滚动终态测试，先运行原 27/28 完整序列，不立即重复 43 项代表。
- 最终正文/API 复核修正英文 rowExpandable 签名及缺省行为说明，mapping.review.notes 补齐第二批 28 段审阅范围；主任务在真实语义审阅后重新签正文指纹 52c36f818c4fb728a4ed7ddb7e294ec3ceb21f00abc63aa1875e5d4c372412ae。此正文变化会使静态站缓存实际失效，不能复用旧站。
- 最终 `pnpm check` 13:23:03–13:24:45 退出 0：184 文件 1272 单测全部通过，工具测试 88+6 通过，基线/生成/边界、格式、lint、源码类型全部通过。随后 `fixed-resize-scroll` 第 28 项完整通过，原拖动 class 差异已消除；第 27 项推进至最后 resized 状态才失败，Vue 数据意外按大小升序，参考保持原序，交由 Header 负责人核查拖动结束 click 冒泡，保留完整前序和失败报告。尚未开始正式认证。
- 表头误排序由固定 Foundation #2802 的手柄按下起点保护直接证实。修复保留 onHeaderCell click 回调，记录 pointerdown/mousedown 起点，忽略该手势的自动排序，下一次普通按下可正常排序。修前定点 1/6 准确失败，修后 resize 6 项 + Header 10 项共 16 项通过，类型与静态检查通过；负责人 13:30:53 冻结。
- `fixed-resize-click` 第 27 项中文 light 的原完整分页→三态排序→筛选重开/清除→拖动终态通过，零跳过/重试（浏览器 19.4s）。至此已知定点问题全部验证，恢复本批自动 43 项代表集合；此后仍不得把代表报告算作 accepted。
- 首轮完整代表 43 项：41 通过、1 失败、1 被中断，无重试，浏览器墙钟 124807ms。失败为第 27 项 en-us dark RTL 的拖动态：filter-cleared 两侧 251 节点完全一致；拖动后 size col 由 200 变为 React 320 / Vue 240，导致 TABLE 920/877 与其他几何连锁差异。wrapper/root 的位置、尺寸、页面 scrollY 完全相同；原 trace 两侧均由 x752.5 移至 792.5，steps=5，排除操作/截图前提。
- 固定 react-draggable 的局部坐标 clientX+offsetParent.scrollLeft-offsetParentRect.left 在 RTL 表头扩宽左移时产生 8/16/24/32/40 增量，合计 120；Vue 固定 clientX 起点只增 40。两个负责人独立源码/附件复核后由 Header 负责人恢复局部增量契约，不改方向、步数、门槛或归一。已取消无必要的额外采样 instrumentation，原 trace 足以验证假设。先定点 RTL 第 27 项原完整路径，随后恢复代表集合。
- Header 局部坐标修复于 13:41:17 冻结：每步按活 offsetParent 的 rect.left/scrollLeft 换算，与上步相减，再基于最新列宽计算；保留最小 20 与越界回拖 slack，stop 不额外改宽。公开 geometry stub 用原五步输入验证 200→208/224/248/280/320（修前实际208/216/224/232/240，准确失败），并覆盖 offsetParent 滚动与双向最小宽回拖。修后 17 项定点测试及 UI 类型/静态检查通过，日志 `resize-parent-*`。先运行两项 en-us dark RTL 原完整路径，资源按实际源变化重建。
- `fixed-resize-rtl` 第 28 项完整通过；27 的 250 个节点几何、标签、属性与文本已全一致，表宽 920、目标列宽 320。剩余仅 scroll-position-right 多余以及其派生的 11 处固定边缘阴影；固定基线观察根容器并在 rAF 内更新，Vue 观察 body 且同步更新。交由 Table 负责人最小对齐观察目标和下一帧更新，保留非 fixed 不监听及卸载清理，不扩大到未证实的动态模式注册问题。
- 正式前按真实报告体积规划发现单批 112 项原 JSON 预计 528.3MiB，超过 Node 512MiB 单字符串上限。仅在新矩阵将交互 styles 附件全量无损 gzip，默认 default-styles 原 JSON、全部断言和 PNG 保持不变；不改共享验收器或旧报告。221 个附件离线解压逐字节一致，代表等效报告 197.13→60.282MiB，按最大样本预测完整约164.64MiB。矩阵及前提说明 13:45:59 冻结，格式/lint/diff通过，后续读取交互附件明确 gunzip。
- 根容器 Observer 修复已冻结：初始固定模式观察 wrapperRef，回调在 rAF 中测量和重算边缘；pending frame 可取消，卸载断开 observer 并防止迟到通知。新公开测试修前精确失败，修后 observer/resize 共9项通过，UI 类型及静态检查通过；动态模式注册未扩展。真实第27项RTL再次使用原完整路径定点验证，日志 `fixed-observer-rtl.*`；这次也验证新附件格式的实际运行。
- `fixed-observer-rtl` 再次失败但参考 class 反向：同一固定 React 上轮 left、此轮 both，而 body877/table920、scrollLeft0 与全部250节点几何完全相同。暂停产品猜测式修复，两个负责人只读复核：measureHeaderWidths 的 Map 在该例不反向改变列宽；固定 RO 在布局后另排 rAF，双 rAF 动画 settle 不保证此状态已收敛。
- 新矩阵仅为固定列27增加公开终态有界等待：每端按固定源码 body/table 几何与 scrollLeft 公式等待完整实际边缘class集合，保存时间戳和几何/class样本；不手动触发scroll/resize、不固定延时、不增加重试。旧Vue若持续保留both会超时，不能被等待掩盖；28非fixed不应用此条件。等待后仍独立执行全部DOM/样式/几何/PNG对照，此条件本身不能自证像素通过或证明具体Observer链。
- `fixed-edge-settlement` 的5秒有界等待准确失败：7次样本中 reference 始终 left，Vue 始终 both，body877/table920/scrollLeft0完全稳定，trace无console warning/error。说明不能只按先前一次参考瞬态解释，Vue仍存在实际未收敛问题。只读源码未发现初始fixed条件、ref/Spin或挂载替换导致漏注册；暂停进一步产品猜测，临时对原生RO注册/通知与其RAF排队/执行/cancel做透明采样，保留原参数、this、异常和事件，不改等待。诊断完成后恢复矩阵备份，临时instrumentation不入最终提交。
- `observer-probe` 1项通过只作诊断：两端注册/目标连接均正常；最后根高度通知时table877/body877，后续RAF恰好读table880。React同步改left，Vue下一微任务改left；最终table920但根尺寸不再变，无必然新RO。额外几何读取可能强制布局改变时序，故probe不能认证。透明采样已移除，正式matrix备份逐字节恢复；注册/通知/RAF证据保留ignored，不再猜测产品注册问题。
- 固定基线自身对跨溢出拖动中的阴影没有确定终态保证。基于实采明确选择可重复的原生交互范围：仅27RTL以相同40px/5steps先收窄，完整对照拖态/松开，再恢复原宽完整对照；再扩宽，松开后真实wheel横滚到另一端/返回，等待真实scrollLeft变化及固定公式边缘状态后全量比较。保留原分页/排序/筛选前序、列宽算法、全部样式/几何/像素门槛；不声称不确定的跨溢出拖态阴影已认证，不派发伪造事件。其余27LTR/28路径不变。
- `stable-resize-rtl` 在收窄拖态全部DOM/样式/几何通过，像素900/0.0013667426超限。主任务实际查看两张PNG确认固定React的Owner表头有原生文本蓝色选区，Vue无；固定ResizableHeaderCell明确enableUserSelectHack:false，ResizableTable仅在start清除已有选区。Header的pointerdown.preventDefault疑阻止鼠标随后建立原生选区，交由负责人核对锁定draggable鼠标/触摸事件后最小修复；不在矩阵清选区、mask或降低像素门槛。
- 锁定DraggableCore鼠标mousedown不preventDefault，仅touchstart禁止滚动；Header据此移除pointerdown无条件取消，保留start清已有选区及#2802起点记录，handle touchstart.prevent保留对应触摸契约。新增公开cancelable事件回归修前准确失败，修后Resizable8+Header10共18项通过，UI类型与静态检查通过；负责人14:18:24冻结。真实选区像素与wheel终态仍由原完整RTL路径验证，日志`stable-resize-selection.*`。
- `stable-resize-selection` 原27RTL完整前序及确定性新增路径通过，1项、零跳过/重试，浏览器24.9s：原生选区像素、收窄拖态/松开、恢复原宽、扩宽后真实wheel两端与返回均严格通过。临时RO instrumentation已经移除；此正式源码状态下的定点通过可用作代表恢复依据，开始`representatives-final`43项自动代表。
- `representatives-final` 9通过/1失败/33未完成，未认证。新增失败为EllipsisTooltip zh-cn light重开浮层：DOM/样式/几何全部通过，像素ratio0.966；两张PNG实看reference裁剪到了Table标题/空白，Vue为正确Tooltip。交由矩阵负责人核查fullPage document clip在Portal采样上的问题，先读定位/trace，不因像素失败直接改Tooltip产品；保留该失败与已过RTL列宽定点证据。

- `representatives-final` 9 项通过、1 项失败、33 项未完成：Tooltip reopened 两端 DOM/样式/几何完全一致，但参考 fullPage document clip 错截下层标题，像素差 0.966；完整报告和 trace 保留。两端 Portal 均 absolute，不能断言 Chromium 内部合成原因。首个最小修复对完整可见目标用 Locator.screenshot，`fixed-tooltip-capture` 又被前后稳定断言准确阻止：en light 默认态 scrollY 18663→18651、目标 top 相差 12px，未认证。
- 核对锁定 Playwright 实现后，完整可见目标改普通 page.screenshot 的 viewport clip，避免元素自动滚动；超高目标仍完整 document clip。始终保留完整目标范围、前后 box/scroll/viewport/document 断言和原像素门槛，不隐藏、不 mask。原失败完整归档，使用新前缀 `fixed-tooltip-viewport` 复验三项原完整路径。
- 冻结间隙只读交叉审阅发现最小列宽下无变化仍触发 onResize，与锁定 react-resizable 3.0.5 的 dimensionsChanged 条件不符。Header 最小修复只在宽度变化时 emit，继续更新 lastX/slack；LTR/RTL 零位移、持续越界及回拖 callback 次数新增断言先 2 项失败，再 8 项全部通过，格式/lint/diff 检查通过（`resize-zero-change-before/verified.log`）。未增加浏览器重试或修改拖动路径。

## 最终检查与正式验收

- 最终截图定点 `fixed-tooltip-viewport` 三项完整路径通过，随后 `representatives-final-2` 43 项全部通过，零失败、跳过、重试；浏览器阶段分别 16.5s、119.3s。产品交叉审阅除已修复的无变化 resize 回调外无新增阻塞，矩阵改动未放宽任何门槛。
- `check-final-2` 的 `pnpm check` 退出 0：184 文件、1276 单测通过；全仓格式/lint/源码类型、基线/生成/边界及工具测试通过。`artifacts-final` 的 `pnpm check:artifacts` 退出 0，实际产物、主题、SSR 公开入口、真实 tarball 的 exports/ESM/类型/样式/Worker 和 tree-shaking 验证通过；pack 使用默认离线已有依赖方式，未运行 isolated pack 或 release:check。
- `component-browser-final` 的 Table 5 项与工作台 3 项全部通过，零重试，12.0s；保留默认 dev 源码入口断言、锁定 Chromium、原快照与像素规则。`preflight-final-2` 退出 0，全部 45 批审阅有效；diff check 通过，服务端口清场。
- `formal-new` 正式 112 项全部通过，零失败、跳过、重试，浏览器阶段 266.5s，runner 退出 0；工具已生成 table-2 有效证据，新增 14 项。历史 44 批恢复继续按既定 16 组串行执行，不能把历史数计作新增，也不从失败报告抽取通过项。

- 历史 16 组共 44 批、2532 项正式矩阵全部通过，全部 runner exit 0；连同新增批次共 45 批、2644 项，逐份 timing 核对 expected=cases、skipped/unexpected/flaky 均为 0，命令全部 retries=0。`formal-groups` 退出 0，完整报告分别 gzip 归档，未合并成超大 JSON。
- 最终 `--affected --plan` 退出 0：45 条审阅有效、45 条浏览器证据有效；覆盖账本 346/859 当前有效，历史 332 项已全恢复，新增 14 项，剩余 513 项。README 和队列已更新为 Table 第 31–37 项，第 29 项继续待办。

### 正式分组结果

| 分组              | 批次                                                       | 用例 | 结果              |
| ----------------- | ---------------------------------------------------------- | ---: | ----------------- |
| formal-new        | table-2                                                    |  112 | 通过，零跳过/重试 |
| formal-history-01 | accessibility, avatar, badge, banner                       |  208 | 通过，零跳过/重试 |
| formal-history-02 | button, calendar                                           |  156 | 通过，零跳过/重试 |
| formal-history-03 | card                                                       |  112 | 通过，零跳过/重试 |
| formal-history-04 | carousel                                                   |   64 | 通过，零跳过/重试 |
| formal-history-05 | collapse, collapsible, config-provider, cropper, dark-mode |  144 | 通过，零跳过/重试 |
| formal-history-06 | descriptions, divider, dropdown, empty, feedback           |  224 | 通过，零跳过/重试 |
| formal-history-07 | float-button, grid, highlight, icon                        |  192 | 通过，零跳过/重试 |
| formal-history-08 | image                                                      |   80 | 通过，零跳过/重试 |
| formal-history-09 | layout, list                                               |  152 | 通过，零跳过/重试 |
| formal-history-10 | locale, modal, navigation                                  |  164 | 通过，零跳过/重试 |
| formal-history-11 | notification, overflow-list, popconfirm, popover           |  200 | 通过，零跳过/重试 |
| formal-history-12 | progress, resizable, scroll-list                           |  216 | 通过，零跳过/重试 |
| formal-history-13 | side-sheet, skeleton, space, spin                          |  188 | 通过，零跳过/重试 |
| formal-history-14 | table-1                                                    |  120 | 通过，零跳过/重试 |
| formal-history-15 | tag, timeline, toast                                       |  232 | 通过，零跳过/重试 |
| formal-history-16 | typography                                                 |   80 | 通过，零跳过/重试 |

### 计时与交付边界

- 并行准备墙钟约 15 分钟（约 12:33–12:48，含共享修复），仅统计共同墙钟；没有可比的串行基准，不声称加速倍数。
- 已归档准备/诊断 timing 的构建、检查与缓存校验阶段合计 1114.7s，浏览器阶段合计 564.4s（包含失败尝试和透明 Observer probe，probe 不认证）；这些为已记录阶段的合计，不冒充完整排查耗时。
- 最终 `pnpm check` 99s、`pnpm check:artifacts` 61s；Table/工作台浏览器 12s。它们与诊断 timing 分开统计。
- 正式统一验收墙钟 14:43:45–15:47:33，共 3828s（63分48秒）：浏览器阶段合计 3260.295s，构建产物新鲜度核验与覆盖账本阶段 425.653s；其余为报告、归档及 runner 开销。期间 resources/site/checks 输入与产物校验后全部复用。
- 失败排查墙钟约 12:48–14:40，含构建、检查与诊断运行，不与上项相加。整轮截至 15:50:27 为 197.7 分钟，含最后整理；正式统计文件为本轮 ignored 目录 `final-summary.json`，各次 started/ended/exit、完整报告和失败附件保留。
- 第 29 项 DragSort 未认证。第 27 项 RTL 跨溢出瞬间的固定基线阴影并非确定终态，不认证该瞬间；收窄/恢复与真实滚动到两端后仍执行完整 DOM/样式/几何/像素比较。第 17/18 项缺业务 key、范围外固定/自定义展开列及动态 fixed Observer 注册边界按前文保留，不扩大完成声明。
- 完整检查包括源码、真实产物和受影响组件浏览器，不声称执行了 `check:full`、发布门禁或隔离联网 pack。
