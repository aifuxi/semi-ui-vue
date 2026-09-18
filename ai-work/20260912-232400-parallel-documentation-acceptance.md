# AI 工作记录：Image、Modal、Popover 文档严格验收

- 日期：2026-09-12
- 状态：正式验收与最终证据复核通过

## 起点与分工

工作区干净，固定 vendor 为 v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。起始影响计划退出 0，历史 39 批证据全部有效；280/859 项有效验收，剩余 579 项。

按当前展示类队列选取 Image 10 项、Modal 12 项、Popover 9 项；List 的三项既有第三方依赖阻塞保持原记录。三个子 agent 分别准备本批参考适配、示例、章节/API/迁移审阅和完整矩阵。共享源码、构建、浏览器、账本、证据与提交由主 agent 调度。全部被站点消费的源码在每次构建/诊断/正式运行期间冻结，跨批只读复核后进入正式验收。

WebStorm 只读确认项目为 semi-ui-vue，Run Configuration 为空，使用 IDE 终端执行命令。并行准备于北京时间约 23:26 开始；最终计时使用实际 runner 记录，不将子 agent 自报时间相加。

## 运行与证据

运行日志、退出码、报告与计时统一归档到 ignored 的 apps/docs/.data/documentation-smoke/parallel-round-20260912-next/。每次失败先保留现场，再按新证据确定最小重跑范围；正式证据仅由现有完整验收入口生成。

- 固定 vendor 检查通过，退出 0。三批首次准备的实际 Playwright 清单为 Image 80、Modal 96、Popover 72，共 248 项；全部固定双语片段经过适配后转译检查。
- 首次准备后影响计划确认历史 39 批仍有效，只有本轮三批待验收。
- 跨批只读复核先于浏览器：Popover 补默认主体视觉对照、保留输入焦点直接按 Escape 检查回焦，同时发现英文 Controlled 缺固定双层容器并恢复。Image 原本 800×450 替代素材与固定 abstract.jpg 1440×800 比例不同，width=200 时高差超过 0.5px，转为逐项核验原尺寸并建立本批专属资产；补自定义菜单前后按钮、REPL 主要操作、预览根绝对几何及真实卸载断言。Modal 补源码精确内容断言并核查首次焦点。
- 这些修正均在首次构建前进行，没有用失败浏览器重复发现同类前提问题，也没有新增历史 accepted。
- diagnostic-01：静态站构建失败，Rspack 报多个不同内容资产映射到 450e41c.js。已安装 Nuxt schema 默认 app/chunk 都为七位 contenthash；生产 getCache 返回 false，故没有清缓存重试。生产客户端改用 [id].[contenthash:12].js；diagnostic-02 静态构建通过（46.5s），类型/内容/产物检查通过。共享配置使历史 39 批 2116 用例证据自然失效，本轮需完整恢复，不能计作新增进度。
- diagnostic-02/03：Image Progressive 与 Modal FooterFill 默认 DOM 比较通过但截图比例差异为 1。查看保留截图确认 React 页面被 Rsbuild 编译错误遮罩覆盖：Popover 固定片段的 @douyinfe/semi-illustrations 未映射至已有固定 vendor 别名。先修 Popover 批 adapter 的依赖，未改像素/几何门槛，也没有把遮罩解释为 Image/Modal 产品缺陷。两次退出均为 1，浏览器与服务已结束，失败现场分别归档。
- diagnostic-04：Popover 的 Position 找不到 aria-controls；固定 hover 使用 aria-describedby/tooltip，click/custom 才使用 controls/expanded/dialog。按固定例与索引修正整批关联断言，不单纯放宽定位器。
- diagnostic-05：Image 默认图通过，预览页码 React 的三个文本节点与 Vue 单个节点显示同为 1/1，测量却按 TEXT_NODE 数组比较；改为完整文本的 CSS 空白语义，不改组件。
- diagnostic-06：Modal Basic 弹窗几何样式比较进入正文，测量忽略 br 后拼接文本导致换行旁空白误判。按行分段保留文本与换行语义。三次失败均退出 1、现场已归档；所有服务停止后集中修正三批测试，不在运行期间修改输入。
- diagnostic-07：Image 页码最内层宽度为 React 20.59375px、Vue 20.578125px，差异向 footer 宽度与居中位置传播。trace 确认固定 React 页码为三个文本节点、Vue 为单字串。ImagePreviewFooter 改为三个明确的 createTextVNode，保持公开文本与行为，后续用真实浏览器证伪该定位；另外以 data-popupid 作为生成关系声明同时规范 Slider 随机 id 和 ARIA 引用，不删除属性。
- diagnostic-08：Modal MaskClosable 主要行为完成后，测试主题 addInitScript 在 sandbox iframe 访问 localStorage 抛错；限定为顶层页面初始化，不修改 sandbox 或屏蔽错误。
- diagnostic-09：Popover 默认 Tag aria-label 因 Vue 模板多出的前导空格不同；逐项核对并清理双语十个 Demo 的同类空白，不归一化 aria-label。
- 全仓 pnpm check 退出 0；此时已包含 Image 文本节点修复，后续 Modal 修改另做定向检查及最终集成检查。
- diagnostic-10：Image Basic 全部预览样式/几何通过，证明页码修复有效；像素差异 8084 全在半透明预览外围，图像主体 1,017,456px 阈值差异为零。只在 viewer 截图统一外部页面背景，不修改原始样式/几何或内部可见状态。
- diagnostic-11：Modal 前序中文代表继续通过，Draggable 外层 cursor=move 与固定 auto 不同。固定 modalRender 仅包 .semi-modal-content；Vue 原包了外层。新增公开行为测试先红后绿，将私有无 DOM 渲染边界放入外层内部，Modal Unit/SSR 10 项、UI 类型与限定静态检查通过；未修复另发现且不影响本批的数字 width 既有问题。
- diagnostic-12：Popover Position 浮层内部完全一致，后置绝对 y 差 10px。trace 显示 Vue scroll-padding-top=92px 使 locator.screenshot 把 scrollY 从1171改1161，参考不变。改用显式 viewport clip，并保留截图前后触发器/浮层几何、滚动不变与无遮挡断言。
- diagnostic-13：Image Basic 默认、打开/重开、放大缩小对照通过，比例按钮定位错误：真实class为 real_size_stroked，测试误写连字符。按固定两态图标修正并验证比例往返，不改产品。
- diagnostic-14：Modal Draggable 中文明亮定点完整通过（1/1，浏览器8.3s），含修复后的真实内容拖动、确认不关闭/取消、重置及编辑路径。
- diagnostic-15：Popover 受控中文入口尚无预期ARIA关联属性，继续按固定 custom 分支审查测试前提；未把该失败当成产品缺陷。
- diagnostic-15 后核对确认是中文 RadioGroup 按固定公开边界过滤关联 ARIA，但保留 data-popupid；以该字段定位，逐种触发器严格检查应有/缺省属性，不能泛化为 custom 不注入 ARIA。
- diagnostic-16：Image Group 默认容器缺实例 ID。恢复 useId 生成稳定默认 ID、保留显式 attrs.id 和 Observer ref 隔离；双语 Container 补固定外层 id。公开 DOM 唯一/稳定/覆盖与 SSR 回归合计 14 项通过。
- diagnostic-17：Modal Imperative 前五类通过，第六类自定义 IconSend 缺固定24px与状态类。固定 ConfirmModal 对 Semi Icon 克隆尺寸/类，Vue原样返回。恢复 isSemiIcon 克隆覆盖，保留调用方 VNode、普通节点与 null；新增回归先红后绿，Modal Unit/SSR 11项、UI类型与限定检查通过。
- diagnostic-18：Popover InitialFocus 中 Vue Input 未获得蓝色焦点状态。共享 Tooltip 把组件 ref 变成不可聚焦 $el，忽略了公开 focus()；按固定适配器保存可聚焦实例的语义修复并补关闭重开回归，真实结果待下一轮诊断。
- Tooltip 组件焦点回归先红后绿，Tooltip/Popover/Popconfirm 42 项通过；组件修复交叉只读审阅全部通过，未改调用方 VNode、DOM ref 或 SSR 生命周期。
- diagnostic-19：Image 18 个完整代表通过（中文10项、Basic暗色及前7个英文），ExtendMenu英文默认截图高165/166。trace暴露 align 先写top再parseFloat读取CSS序列化数值的精度往返；改从原始bbox和scroll直接计算，保留完整裁剪与全部门槛，根坐标补入附件以复核。
- diagnostic-20：Modal Custom 开放态样式通过但关闭定位超时。固定 header=null 视作显式header，实际没有close按钮，只有Continue/Learn more features；纠正前提记录，首次/重置/REPL走取消按钮，重开走确认，断言两按钮且无close。
- diagnostic-21：Popover 21个代表完整通过，包括初始Input焦点修复；Condition英文暗色RTL仅Switch knob的x不同，父Switch/Text/Button/Space完全一致。固定transform过渡在测试切换body方向后尚未结束；等待真实动画完成并加入transform精确对比，不加固定延时或关闭动画。

## 结果与交付

- diagnostic-22：Image 19个代表通过，RTL默认根x差514；原参考根relative定位叠加RTL正常流右对齐，改absolute物理坐标定位，不移动Vue或降低门槛。
- diagnostic-23：Modal 37个代表全部通过，浏览器53.8s，退出0。
- diagnostic-24：Popover 24个代表通过，Condition动效终态修复通过；Color英文暗色RTL的完整面板无遮挡断言失败，按trace调查，未删除该断言。
- 最终共享组件Chromium回归20/20通过，浏览器16.3s，退出0；Image、Modal、Popover、Tooltip的明暗、RTL、Portal和行为均覆盖，未更新截图基线。主题86入口、四包780个公开入口无DOM导入及真实tarball安装/exports/ESM/类型/样式/SSR/Worker检查全部通过，退出0。
- Color裁剪是文档外壳overflow:hidden造成的真实问题。DemoBlock新增可选overflow配置，仅双语Color显式visible；没有用测试覆盖隐藏问题。章节审阅指纹按更新后的双语内容重算，其他示例默认配置不变。
- 最终pnpm check全部通过，退出0。42批实际Playwright --list的2364项file/title集合逐条核对一致，缺失/额外/重复均为0；不是仅比较声明数量。
- diagnostic-25：Image 31个代表全部通过，浏览器55.2s，退出0；最新静态构建46.6s通过。正式18组按实际用例数与历史压缩报告大小分组，分别验收新增三批，再恢复39批历史；保持现有3 workers，正式失败停止后续组并保存完整现场。

- diagnostic-26：Popover 28个代表全部通过，浏览器79.5s；真实Color裁剪修复经跨批只读复核通过，测试没有临时overflow覆盖。
- 正式18组全部退出0，无正式失败、重试或中途修改。新增Image 10项（80用例）、Modal 12项（96用例）、Popover 9项（72用例），新增共31项/248用例；历史39批完整重验2116用例，共42批2364用例全部通过。
- 最终覆盖311/859，剩548项。章节/API/迁移审阅、本批覆盖门禁及最终影响计划通过；42批证据全部有效，计划全部跳过构建和浏览器。下一批SideSheet 6项；List三项既有第三方依赖阻塞保留。README概览和入口仍准确，不把动态计数写回README。
- 实际验证：最终pnpm check通过（177个测试文件、1227项单元测试及工具测试）；组件Chromium20项、公开包SSR导入、主题产物、真实tarball、全部文档严格矩阵、覆盖和证据门禁均通过。未运行check:full或发布检查，不宣称全仓全部浏览器场景通过。
- 范围外问题：Modal数字width的既有转换问题不影响本轮固定12例，已在组件alignment记录；未扩大修复。Image素材仅恢复固定固有尺寸与加载契约，不能声称复现原CDN图像内容或传输延迟。

## 计时与返工成本

- 首次并行准备及主汇总从约23:26至23:39首次诊断，墙钟约14分钟；没有独立采样每个agent的净工作时间，不相加作为串行基准。
- 26次诊断累计runner墙钟1395.55s，其中22次失败累计1086.01s。构建资源/公开包/REPL阶段累计96.98s，站点生成及相关阶段267.27s，类型/内容/产物检查147.27s；诊断浏览器累计617.33s。以上构建阶段包含失败与因真实输入变化而必要的重建。
- 正式调度从2026-09-13 00:41:42至01:36:41，墙钟54分58秒；18组runner内部累计3272.63s，浏览器累计2749.37s（45分49秒）。准备产物每组均经内容核验复用，freshness核验累计16.45s，覆盖刷新累计413.10s；没有正式重建或失败重跑。
- 从本记录23:24起至正式验收结束约2小时13分钟，另有最终证据/差异检查与提交时间。纯定位、沟通、单独静态和组件检查未各自完整计时，不能用诊断runner耗时代表全部返工墙钟；不声明未经测量的加速倍数。
- 原始日志、退出码、失败trace/截图、诊断计时、正式各组计时与实际用例集合保留在上述ignored归档目录；成功正式压缩报告和指纹由标准runner写入docs/documentation/evidence。
- 收尾误调用全量check:nuxt:coverage，因311/859未全量完成按预期退出1；随后误传逗号分隔批次被单批CLI拒绝，退出1。两次均未重跑浏览器或改变证据，原日志保留；改为分别执行三个--batch门禁及最终affected计划，不把这两次误用记作通过。

## 提交

最终仅暂存本轮已验收修改，按项目规则创建独立commit；提交结果以Git历史为准。
