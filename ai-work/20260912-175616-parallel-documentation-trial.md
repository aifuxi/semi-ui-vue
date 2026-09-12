# AI 工作记录：三批文档并行验收试跑

- 日期：2026-09-12
- 状态：完成

## 目标

并行准备 ScrollList 1 项、Tag 12 项、Timeline 8 项，共 21 项已有双语示例；统一冻结输入并联合执行正式验收，实测准备、构建、检查和浏览器阶段耗时。

## 验收标准

- 三批完成固定 v2.102.0 双语、明暗、适用 RTL 与真实交互矩阵及章节/API/迁移审阅。
- 正式报告完整、零失败/重试/跳过，输入指纹有效后才增加 accepted。
- 根据实际依赖复用或重验历史证据；不通过降低断言、容差或裁剪范围提速。

## 风险与假设

- 三个 agent 共享工作区，分别只修改本批文件；主 agent 负责公共文件、生成账本、构建及浏览器调度。
- 参考服务固定端口 4173 被另一项目 semi-ui-codex-theme 的开发服务占用；用户已明确允许在验收前停止该服务。
- 本轮没有串行对照实验，不把并行子任务耗时之和当作实测串行耗时，也不承诺固定加速倍数。

## 修改范围

- 各批次参考适配器、双语文档/示例、矩阵、映射审阅和验收记录。
- TagGroup 折叠计数保留两个文本节点，恢复固定 center 内容类与 ARIA；默认浮层内容每次构造新 VNode，修复生产环境关闭后再次打开内容为空；Popover 箭头移除固定参考不存在的 aria-hidden。
- 已更新覆盖账本、README、双线计划与 UI patch changeset；下一批 Carousel 8 项。

## 关键决策与权衡

- 三个独立 agent 同时准备；完整验收仅由一个 runner 启动，复用默认 3 workers。
- 新增依赖或共享组件问题集中处理，冻结后所有 agent 停止修改被验收输入。

## 验证证据

- 起始 `accept:nuxt:batch --affected --plan`：33 批历史证据全部有效，覆盖账本为 240/859。
- 固定 vendor 提交：`cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`。
- 准备计时从首个子任务报告的 2026-09-12T09:56:03Z 开始，至三批首次冻结 10:01:17Z，共 314 秒。ScrollList 259 秒、Tag 301 秒、Timeline 166 秒是各自任务墙钟时间；三者重叠，不能直接当作实测串行基准。
- 输入清单独立复核：三批 paths/globs 均非空，精确大小写、imports-v2 无 fallback，Playwright 实际发现 168 项，与声明集合一致；发现并修正 Tag review 指纹页面顺序错误。
- 代表诊断01至07保存在 ignored 的 `apps/docs/.data/documentation-smoke/parallel-trial/`：日志、退出码、原始 JSON、计时摘要分次保存。ScrollList 顶边/中心断言和禁用项真实点击修正后 4 项代表通过；Timeline 25 项代表通过。Tag 依次发现颜色字符串空白、TagGroup 内容类型和 Popover 箭头 ARIA 差异，均保留失败证据。
- 箭头等价假设被真实 Chromium AX 否定：固定 React 是无名 image、Vue aria-hidden 隐藏；取消等价过滤，按组件缺陷修复，不把失败改为忽略。
- TagGroup 新增回归旧实现先失败，修复后 Tag 单元/SSR 12/12；Tag 组件 Chromium 5/5 通过，无截图基线更新。初次 UI typecheck 发现测试显式 undefined 与 exactOptionalPropertyTypes 冲突，改用固定支持的 restCount=0 回退语义后通过。
- TagGroup 产物的 SSR import、86 个主题入口、真实 tarball 安装/exports/ESM/类型/样式/SSR/Worker 与 tree-shaking 检查通过。后续所有组件修改冻结并重建后，这三项产物门禁再次全部通过。

- 诊断08首次浮层正常、第二次 Vue 内容为空，React 正常。三个独立生产探针分别使用冻结动画/真实动画/等待旧浮层彻底卸载，旧产物均复现第二次为空，排除采样与关闭等待假设。jsdom 原实现未复现，不能声称重开单元测试先红；生产探针是该修复的失败/成功依据。修复后同三探针全部通过，分别保存于 `reopen-probe/` 与 `reopen-probe-fixed/`。
- 诊断09定点3/3、诊断10 Tag代表37/37通过；ScrollList与Timeline代表合计29项也已通过。最新Tag单元/SSR13项、UI类型、修改文件格式/lint通过；最终Tag与Popover Chromium 10/10通过，未更新截图基线。
- 最终独立自审发现浮层内部比较未覆盖根本身与锚点位置，正式前补齐root属性/样式/尺寸、相对trigger几何≤0.5px；诊断11双语明暗LTR/RTL共16/16通过。三批局部截图已人工复看，无空白或遮挡异常。
- 组件修复后的影响计划为24批1384项：3个新批168项、21个历史批1216项，其余12个历史批证据可复用。历史按6组236/248/248/180/224/80分组，避免既有大JSON报告字符串上限；顺序调度且输入冻结，组内仍用3workers。

- 第一轮新三批正式168/168通过，浏览器91.9秒。历史第一组发现Button文件名作为未锚定正则还匹配FloatButton，计划236而实际292；主动停止，保留formal-01失败/中止记录，未生成该组证据。修复共享runBrowserMatrices文件参数为转义并锚定basename；工具16/16通过，实际Playwright清单逐组核对共1964项。
- 共享正式入口修改后全部36批指纹失效，不能继续沿用此前新三批或历史报告。最终分10组168/236/248/248/180/224/80/248/232/100重验1964项；范围扩大来自真实验收基础设施修改。

- 最终轮前4组900项通过，第5组179通过/1失败，整组未写证据。OverflowList Scroll zh-cn dark在60%收窄后像素差600（0.004595），截图唯一差异为Slider Portal数值提示偏移约一步。根内styles/geometry未包含Portal，故没捕获。
- 简单单页probe未复现，进一步3并发context保留焦点、按相同键盘路径更新后复现8.609/8.8125px偏移，120个绘制帧后两context仍保持偏移，否定仅等待不足。日志与截图保留于 `overflow-failure/`、`slider-position-repeated/`、`slider-position-settled/`；探针绘制帧只用于诊断持续性，不作为正式等待策略。
- Tooltip rePosKey默认pre watcher同步calcPosition读取slot触发器旧DOM，而固定React在componentDidUpdate后重定位。初版单元fixture对Portal宽度的mock与jsdom clientWidth=0不匹配，会引入额外缩放干扰，因此删除该mock重新验证；更正后单元仅根据真实button.style.left映射触发器rect，同次更新位置100→180与key，DOM已更新而气泡位置差仍0（应80），pre红/post绿均实跑且日志归档。修复仅该watch为flush:post，保留其它状态机；OverflowList补Portal锚点可观察终态与几何证据。

- Tooltip修复冻结后24项单元/SSR/hydration、UI类型、格式和lint通过。

- Tooltip最终产物：OverflowList代表13/13、原失败Scroll zh-cn dark定点1/1、同三个生产探针3/3通过；Tooltip/Slider/Popover组件Chromium15/15、SSR import/主题/真实tarball门禁再次通过。输入冻结后以verified-00至09顺序恢复全36批1964项，前轮阶段因共享Tooltip变化全部失效，不混用旧通过结果。

- verified前5组1080项通过并归档；第6组Resizable Basic zh-cn light rtl在toast-start-0因React尚保留animation-show、Vue已移除而失败，主动中断组并保留resizable-failure/trace.zip及样式。固定show动画300ms，两侧animationend均清类；原freeze300未等待事件和渲染提交。只在Resizable采样补等待show类消失，再执行原严格比较，不修改产品、业务时钟、Toast时长或容差；定点诊断14原失败用例通过。此前1080项不因独立spec修改失效，剩余5组884项使用resumed-05至09继续。

## 未验证事项与剩余风险

- 本轮新增21项有效验收，240/859→261/859（30.4%），剩余598项；36批1964项正式证据全部有效，零失败/重试/跳过。
- List的ScrollLoad/Virtualized/DragSort仍因原记录的参考依赖问题待验收，本轮未纳入。
- 本轮未执行全仓check:full或release:check，未发布或推送；剩余文档与发布审计仍需完成。

## 最终结果与耗时

- 最终有效记录来自 `verified-00` 至 `verified-04` 和 `resumed-05` 至 `resumed-09`，其余formal/final/diagnostic均为调查或已失效运行，不计入最终有效证据。全部36批完整报告与散列已归档至 `docs/documentation/evidence/`；最终 `--affected --plan` 全部有效，三个新批章节/API/迁移及覆盖门禁通过。
- 新三批最终联合正式运行168项：总114秒，其中浏览器90秒，构建缓存经实际内容校验复用。最终10组有效运行墙钟耗时合计2362.573秒（39分23秒），其中浏览器2090.415秒（34分50秒）；此合计不包含前期构建、诊断、失败/失效重跑与人工排查。
- 整轮从17:56准备开始至20:04完成正式验收与门禁，约2小时8分钟；这是真实缺陷修复试跑，不是纯验收吞吐基准。准备并行完成约5分14秒，不能据此宣称整轮三倍加速。
- 通过验证包括：1964项文档正式矩阵、Tooltip相关24项单元/SSR/hydration、Tag相关13项单元/SSR、最终相关组件浏览器、验收工具39项、UI/文档类型、内容与静态产物检查、SSR/86主题入口/真实tarball、边界与改动文件格式/lint。组件浏览器分两次按影响验证：Tag/Popover 10项在Tag修复后通过；Tooltip/Slider/Popover 15项在最终Tooltip修复后通过。文档矩阵最终再次覆盖Tag消费者。

| 有效运行组  | 用例数 | 总耗时（秒） | 浏览器（秒） |
| ----------- | -----: | -----------: | -----------: |
| verified-00 |    168 |          114 |           90 |
| verified-01 |    236 |          200 |          175 |
| verified-02 |    248 |          212 |          185 |
| verified-03 |    248 |          329 |          299 |
| verified-04 |    180 |          333 |          304 |
| resumed-05  |    224 |          359 |          330 |
| resumed-06  |     80 |          140 |          114 |
| resumed-07  |    248 |          186 |          156 |
| resumed-08  |    232 |          411 |          384 |
| resumed-09  |    100 |           78 |           54 |

## 并行试跑结论

三agent分别准备组件批次、主agent统一处理共享缺陷并冻结构建输入的方式可以工作；批次文件与证据没有互相覆盖。继续采用3个准备任务和一个共享runner。当前主要成本是对齐缺陷发现与共享变更后的必要回归，而不是单个组件排队准备。本轮修复了精确选取测试文件和两个Portal盲点，后续应在代表诊断中检查浮层根、锚点与动画终态，再扩大矩阵。没有串行对照数据，不给固定提速倍数。
