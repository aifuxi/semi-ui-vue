# AI 工作记录：SideSheet 与 Table 首批文档严格验收

- 日期：2026-09-13
- 状态：完成

## 起点与分工

工作区干净；起始 affected plan 退出 0，42 批历史证据有效，311/859 项，剩余548项。vendor检查退出0，固定 v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。

本轮选择 SideSheet 6项与 Table 第1批（索引1–15）。Table共37项，后续拆批共享映射、参考适配及数据，采用两个子agent避免共享编辑。子agent负责专属Demo、文档、adapter、审阅与矩阵；主agent负责共享组件、调度、账本与最终证据。准备墙钟起点约01:45，未单独精确采样任务起点。

WebStorm确认项目且Run Configuration为空；使用IDE终端。IDE build提示有限诊断，不能替代实际类型与构建门禁。部分独立静态命令使用CLI以保留独立进程输出；不绕过权限拒绝。

## 诊断与修复

- 首次静态核查确认 Table pageData 无条件切片，与固定 Foundation.limitPageDataSource 在 currentPage 受控时不切片不同；排序通知读取旧受控值且取消排序丢失sorter对象。新增两项公开行为测试先失败（exit1），修复后17项Table unit/SSR通过。
- 固定withOrderSort向sorter传第三方向参数；补充公开类型与调用，并以空值在升降序均置后测试验证。18项Table unit/SSR通过，限定ESLint退出0；UI类型检查另行记录。
- 本轮资产按固定文档明确URL获取两张PNG，HTTP200、64×64，来源/哈希/商标归属见apps/docs/public/demos/table/assets.md。
- Table修复经另一子agent对固定Foundation与utils/array只读复核，未发现新增阻断；UI类型检查退出0。实际affected plan仅Locale/Skeleton历史两批失效（76项），其余40批有效。
- side-01于01:54:22启动，resources/site通过（静态生成51.3s）；Nuxt类型检查因新Table示例泛型与分页回调名称错误失败，退出1，runner105.8s，未进入浏览器。进程结束后恢复子agent写入集中修正，未重复启动。该目录遗留diagnostic.json/diagnostic并非本次浏览器证据，README.txt已明确标记；后续归档仅复制本次启动后更新的报告。
- SideSheet固定双语12段经实际docs-reference-plugin.load转译、直接依赖链接与默认导出检查全部通过；不是递归运行时/浏览器证明。归档在apps/docs/.data/documentation-smoke/side-sheet/parallel-20260913-preflight/compile-dependencies.json。两个子agent交叉审阅Table首15片段、fixture与矩阵，修正插画alias、RTL/小数坐标处理与完整编辑交互前提。

## 运行归档

side-11 统一准备与诊断共136.3s，静态站49.7s、Nuxt类型17.0s、浏览器16.6s；资源/内容/产物检查通过，4个代表通过（含 Outside），Custom 在 Select 标签缺 `semi-tag-square` 与 max-width 处失败，Date 错误已消失。报告和trace归档后确认端口空闲，再修复新差异。完整 Selection 附件137节点集中比较同时发现非当前 Pagination 缺 aria-current=false，按固定代码补齐，未过滤 ARIA 差异。

Table 跨批复核补齐表头排序/筛选真实 DOM 与点击热区、一次公开 change 通知、展开行标识/列索引、RTL 固定类和 align 的 flex 对齐；Table19、Header5、Checkbox9、Pagination10的最近定点测试均通过。SideSheet 双实例锚点修复不重建子树，14项 unit/SSR 验证 hydration 前输入值、原节点、目标切换与 keepDOM 保留。最终联合检查与浏览器仍待统一执行。

RTL前提复核发现仅body.dir不会激活Table的ConfigProvider方向。保留全部120项矩阵，改用显式方向预览环境，默认无query仍保留固定文档树；这属于环境对齐，不忽略class/计算样式或削减矩阵。

后续归档：table-02 参数拆分失败；table-03 标题与实际用例不匹配导致零用例，已核对修正；side-04 发现数字尺寸缺 CSS 单位；table-05 集中修复默认 ARIA/title；side-06 Basic/Size/Placement 通过，Outside 跨实例 Teleport 锚点异常，Custom 参考 Date 值异常；table-07 默认视觉通过但 REPL 相对依赖失败，改成本语言目录内依赖。prepare-08 统一准备退出0，table-probe-09 Basic 双语完整通过（含 REPL，2/2）；table-probe-10 Selection 暴露 name 与选择状态无障碍名称差异，保留失败现场后停止服务修复。

check-01 止于 changeset 格式，已修；check-02 前序检查通过但 tooling 的 Table 历史依赖硬编码未包含新批次，修正后定点24项工具测试通过。上述结果均非最终完整检查。

SideSheet Outside 的真实浏览器 insertBefore 轨迹显示 BODY 接收的新 Portal 使用了 Container 内的 Comment 锚点。Vue Teleport target change 将 end 锚点移走而 start 留在 body，污染后续实例；单实例测试不能复现，增加并列实例验证。Custom 参考错误通过固定时钟/真实时钟两次 CDP 探针均复现：fastCopy 把 Date 展开为 {}，全局 Date 正常。授权第三子 agent 最小修复参考复制适配，Date 时间值/副本隔离与无效日期测试2/2通过。这项共享参考输入使历史42批2364用例全部需要重验；历史回归不计作本轮新增21项。

昂贵运行启动前确定日志和退出码，统一保留于ignored目录 apps/docs/.data/documentation-smoke/parallel-round-20260913/；每轮诊断/正式运行结束归档计时、报告及失败trace，避免下一runner覆盖。正式期间冻结全部消费源码与产物。

## 后续诊断归档

- check-03 的格式、lint、源码类型与1246项单元测试通过；工具测试在并行 Nuxt generate 时因临时缺少 `.nuxt/tsconfig.app.json` 失败。停止争用后 tooling-14 串行重跑80项全部通过。后续构建与工具检查串行。
- prepare-12、15、16 退出0。representatives-13 为23通过/42失败；修复表头结构、展开图标、选择状态、语言上下文及固定列布局后，representatives-17 为41通过/24失败，65代表耗时约1.7分钟。SideSheet 19代表全部通过，均不是 accepted 证据。
- representatives-17 剩余差异集中在 Table 首次测量宽度环境、Portal 动画终态、筛选自定义节点多余包装和展开重开后的 Tag 丢失。参考页改为挂载前获得与 Vue 相同容器几何；Portal 测量等待实际有限动画结束，保留原样式、几何及像素门槛。
- 生产探针复现 Descriptions 重用已卸载 Tag VNode：首次展开2个标签，重开0个，数据仍持有旧组件实例。渲染边界改为克隆调用方 VNode；单元未复现生产故障，不作为红绿证明，生产修复后探针待执行。
- prepare-18 在资源声明编译处失败，耗时13.6秒：TableFilterMenu 对 Checkbox/Radio 的联合组件调用 h 不满足重载；未进入浏览器，定点修复后重新准备。
- 当前完整实际用例清单已核对44批2532项，无缺失、额外或重复；其中新增两批168项、历史42批2364项。共享输入已使历史证据失效，正式恢复尚未完成。

- prepare-20 完成全部构建/类型/产物检查，但末尾拒绝输入变化；prepare-21 复用有效资源/站点，重新校验检查阶段，退出0。生产同探针修复后 opened/reopened 均2个 Tag，原0标签问题消除。
- representatives-19 为50通过/15失败，122.4秒，新增成功包括Expanded/SeparateExpand全部代表和FilterItem。余下五类分别定位：middle滚动类缺失；删除光标下方行后框架hover事件序列差异；SortFilter点击未生效待生产探针；确认footer缺Space且位置应在UL内部；CustomFilter实际焦点把Vue scrollY从7751降到0，非参考壳坐标误差。
- Dropdown requestVisible曾在Tooltip定位前同步发送visibleChange，造成示例聚焦临时offscreen输入。改为仅立即回写update:visible，真正定位回调发送visibleChange；23项unit/SSR、源码类型/lint通过，新增定位后聚焦测试有红绿证据。确认footer单元测试首次点击前未等首次visibleChange，修正为等待公开回调后9项Header通过，未加固定延时或降门槛。

## 结果

新增 SideSheet 6 项与 Table 第 1–15 项，共21项有效验收；总计332/859，剩余527项，下一批Table第16–30项。历史42批2364项全部恢复，新两批168项通过；最终44批2532项证据有效。原始工作区干净，本次变更包含必要组件修复、文档/测试、UI patch changeset及完整证据。

代表23归档：prepare-22退出0；生产SortFilter小探针在排序三次后点击文本，筛出0/2fig且事件各一次。完整65代表仍为56通过/9失败（132.4秒）：CustomRendering/Fixed全代表通过，筛选应用的SortFilter、CustomFilter、FilterConfirm各三个语境失败。不能以小探针通过替代完整路径。CustomFilter定位/焦点已通过，后续发现临时筛选值读旧值；SortFilter与FilterConfirm继续按完整点击前提探查。

filter-probe-24 在原完整路径暂录DOM事件，证实两端各一次完整mousedown/up/click，但Vue父项未应用。核对锁定Vue runtime-dom的e._vts与invoker.attached保护发现setFixedTime固定Date.now使冒泡父级事件被拒绝。移除临时诊断，以Date Proxy仅固定无参当前日期、保留原生Date.now/计时器；使用明确的prepare22旧静态产物验证（不认证最新Header修复），filter-probe-25两原失败完整路径SortFilter/FilterConfirm均通过，13.5秒。

check-26完整退出0：1263项unit/SSR与80项tooling通过。artifacts-27退出0：文档/工作台构建、主题、全部公开SSR入口、tree-shaking和真实tarball消费通过。随后Header去除强制clickToHide的单行运行时修复另有10项公开测试、源码类型/lint通过，prepare-29重建最新UI/静态站并校验通过，最终产物复核仍需运行。

representatives-28为61通过/4失败（140.8秒）；remaining-30三项方向预览和英文FilterConfirm REPL通过，owner面板3项失败。placement-31记录根、触发器及Portal绝对坐标，owner确认后参考滚动232px、Vue不滚；anchor-32排除scroll anchoring假设，已撤其配置。trace精确证明Playwright在真实点击前因入场动画两次重试，第三次采用center滚动；owner初开先等真实动画结束，owner-34的三语境页面路径均通过，RTL完整代表通过，双语light在REPL鼠标遮挡处失败。editor-35编辑脚本断言失败后误启动，已立即中断并确认端口退出，非有效证据。editor-36使用真实Tab/Enter编辑器确认路径，两双语完整代表通过（12.3秒）。临时事件/scroll探针均已撤销，保留有助定位的标准Portal坐标附件，不改变断言。

### 历史第三组 SVG 文字差异调查

historical-43 正式 224 用例中 223 通过、Card Cover en-us light 失败，退出码 1；后续组停止。219 个显著差异像素仅位于同一 poster.svg 内文字区域，DOM、属性、样式和精确几何一致。同页 root 与 card crop 图像对应区域逐像素一致，排除裁剪引入差异。未修改输入的 card-probe-44 定点诊断 1/1 通过：参考图与失败参考逐像素相同，Vue 前后差异仅在文字区域。首帧字体/栅格路径未被 trace 记录，根因未确认，不据此声称已修复。保存原失败和诊断报告；基于定点恢复证据，完整重验 card/carousel/collapse 三批，保持源码、资源与全部门槛不变。

### 冻结后的最终检查与正式验收

- components-37：Table、SideSheet、Select、Input、InputNumber、Checkbox、Pagination、Descriptions、Dropdown 共45项 Chromium 对照通过，未更新快照。
- check-38：`pnpm check` 退出0，1263项 unit/SSR 与80项 tooling 通过，格式、lint、源码类型与生成/依赖边界通过。
- pack-39：`pnpm verify:pack-dist` 退出0，最新 UI 真实 tarball 的 exports、ESM、类型、样式、SSR、worker与tree-shaking通过；随后 `pnpm verify:ssr-dist` 退出0，525 icons、86 icons-lab、18 illustrations、151 UI入口及Chat/Markdown通过。artifacts-27整体验证后唯一Header运行时变更已由prepare-29重建和本次包检查覆盖。
- formal-new-40：SideSheet48 + Table120 = 168项正式矩阵全部通过，浏览器275.8秒，新增21项已写有效证据。
- historical-41：accessibility/avatar/badge/banner 208项通过；historical-42：button/calendar 156项通过。
- historical-45：card/carousel/collapse 224项完整通过，浏览器162.5秒，原historical-43失败仍保留。
- 最终跨批只读复核：Table运行时、公开测试、30个双语示例、adapter与120项矩阵无新增阻断；无临时console/debugger/only/skip等残留，`git diff --check`退出0，未改动冻结输入。

historical-46 第四组224项中223通过、ConfigProvider Direction en-us light rtl失败，浏览器281.4秒、退出1，未写该组新证据；保留日志/trace并停止后续组。差异为Toast仍带semi-toast-animation-show：固定React与Vue均依赖真实CSS animationend移除，JS clock.runFor(300)不保证该事件已处理，随后freezeAnimations会暂停尚未完成的动画。对本spec的Toast及同类Notification统一补齐freeze前真实有限animation.finished与show类移除终态断言；不修改产品、资源、阈值或共享helper。此前只读取进度末尾遗漏较早失败，已纠正用户进度；之后同时检查整份日志失败摘要。

config-probe-47：Direction全部8语境诊断通过（39.8秒）；只改ConfigProvider spec，Prettier、ESLint与diff检查通过。historical-48：第四组224项完整通过（281.1秒），7批证据恢复。最终非Table共享代码只读复核未见新增阻断：SideSheet pendingTarget客户端且实例私有；Dropdown即时受控回写/定位后通知分开；ARIA缺省与显式false保留；Descriptions不缓存调用方mounted VNode；DemoBlock方向Provider仅合法query启用。没有为通过验收扩展范围外的旧问题。

historical-49：empty/feedback/float-button/grid/highlight 240项通过，浏览器191.1秒；historical-50：icon/image/layout 192项通过，248.2秒；historical-51：list/locale/modal 200项通过，185.5秒。上述均退出0并写完整批次证据，复用未失效的准备产物，未改变冻结输入。

historical-52：navigation/notification/overflow-list/popconfirm 180项通过，浏览器300.5秒；historical-53：popover/progress 168项通过，495.8秒；historical-54：resizable/scroll-list/skeleton/space 220项通过，219.1秒。全部退出0并恢复正式证据，其中Skeleton既有Table场景亦通过。

historical-55：spin/tag/timeline 200项通过，浏览器99.7秒；historical-56：toast/typography 152项通过，257.1秒。均退出0，历史42批2364项完整恢复。final-plan-57退出0，44批全部证据有效并跳过构建/浏览器；coverage-side-58退出0，Table首批门禁及最终差异检查随后记录。

## 计时与交付边界

- 并行准备约01:45开始，子任务中途按缺陷回到准备与交叉审阅，未单独精确采样纯准备墙钟；不将各子agent时长相加推算串行基准。
- 新增正式浏览器168项耗时275.8秒（4.6分钟）；最终通过的历史12组2364项浏览器合计2687.3秒（44.8分钟），两者分开统计。
- 最终`pnpm check`墙钟98秒；完整产物检查artifacts-27为171秒，最新pack-39为9秒；components-37为22秒。这些检查与浏览器时间不混记。
- 失败排查没有独立连续计时，具体失败与探针耗时见上文及归档；尤其历史第三组223/224、第四组223/224均没有抽取通过项认证，已完整重验。Card SVG文字差异根因仍未确定，未改资源/阈值，无修改定点及完整重验均通过；ConfigProvider则有明确CSS动画终态前提修复。
- 从工作记录01:42起至含Table审阅返工的最终核验约05:28，整轮约3小时46分钟，包含准备、诊断、等待、检查与正式恢复；不是净浏览器耗时，不宣称并行加速倍数。
- 全部正式证据位于`docs/documentation/evidence/`，运行日志、退出码、计时与失败trace保留于ignored目录`apps/docs/.data/documentation-smoke/parallel-round-20260913/`。下一轮只接续Table第16–30项，本轮未扩展该批。

### 最终审阅门禁返工

coverage-table-59退出1：15项示例浏览器证据有效，但Table的章节/API/迁移review指纹仍为早期正文指纹。final-plan-57仅证明44份浏览器证据有效，不足以替代审阅门禁。停止提交，重新对最终双语正文、固定基线与API/迁移契约只读审阅；审阅后更新mapping的review指纹，令Table首批旧证据正常失效并完整重验120项。不会改写旧验收指纹或跳过门禁，其余43批继续复用。

最终正文复核发现并修正3项陈旧说明：英文Basic不含status Tag；英文UndefinedSort未开启showSortTip；双语无障碍说明改为排序按钮名称中的顺序语义，去掉已按固定实现删除的aria-sort声明。子agent复核最终正文、API与迁移通过，当前review指纹重新计算为d9887cd50de9d51269d2105e576daf7c80578bdf1b86957238c5e206f5124bcd。新正文和mapping使Table首批证据正常失效，重跑前格式与diff检查通过；重新核验影响范围后只重建失效站点/检查阶段并完整验收Table120项。

table-review-plan-60退出0，仅Table首批失效，其余43批证据有效。table-final-61重建变化的站点内容与检查阶段后，120项完整矩阵全部通过，浏览器195.3秒（这是审阅返工额外成本，不计为新增示例）；章节全部reviewed，首15项全部accepted，总计仍332/859。最终两批覆盖门禁、全局证据计划及格式/差异检查用于提交收尾，未运行发布流程或触发新标签。

最终收尾结果：coverage-side-58、coverage-table-62均退出0；final-plan-63退出0，44批全部证据有效。全仓`pnpm format:check`退出0，最终队列/工作记录相对链接检查与`git diff --check`退出0。仅暂存本轮197个文件（含44批88个证据文件），以独立中文Conventional commit交付；未将诊断临时产物或个人连接配置入库。
