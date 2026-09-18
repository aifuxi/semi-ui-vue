# AI 工作记录：UserGuide、DragMove、HotKeys 双语示例补齐

- 日期：2026-09-07
- 状态：补齐线完成；严格视觉与行为验收未执行

## 目标与验收

沿用补齐线，按队列完成 UserGuide 8、DragMove 4、HotKeys 5 项固定上游双语示例，章节、映射、类型、实际站点主要操作及编辑运行齐全。严格验收单独推进，不新增 accepted。

初始工作区干净。vendor 实测为 v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21，保持只读。已按 Adapter/类型、Foundation/SCSS、主题、双语内容、图标顺序核查；复用三个组件现有 alignment.md。CodeGraph 索引就绪，query 显式指定当前项目，结合公开导出、组件源码和文档注册定位影响。

## 代表与组件边界

代表浏览器通过前，只实现并注册以下双语代表：

- UserGuide NoMask（8）：单步完成、无遮罩、关闭后重开；Modal（7）：三步封面、前后退、完成/跳过及关闭动画后重开，检查内置双语按钮和图片加载。
- DragMove Basic（1）：默认拖动；CustomMove（4）：约束边界、left/right 切换、点击变宽后不越界。固定中文小宽度60px，英文50px。
- HotKeys Basic（1）：Control+Shift+A、严格修饰键、弹窗关闭重开；ListenerTarget（5）：Input公开input DOM、焦点内触发及焦点外不触发。

每例一个独立小型 SFC，只负责一项演示，不引入共享业务组件/composable；状态通过 shallowRef、props/emits 和公开 DOM ref 传递。示例依赖均从公开子路径导入。

## 接入决策

- UserGuide 目标使用 useId + 延迟 DOM getter，避免 SSR/setup 访问 document 和同页/REPL 固定 id 冲突。ConfigProvider 传完整 locale 数据，确保内置按钮语言正确。
- Modal 保留三步、Image 600px×100%、Typography 强调和导航；沿用站内 one/two/photo.svg 替代上游带品牌的 DSM 截图，文本使用独立品牌。既有资产不新增第三方代码或许可来源；与 React 严格对照时需采用相同品牌替换。
- DragMove Basic 用局部140px高容器容纳 absolute 示例，避免覆盖文档按钮；不增加 constrainer 限制。
- 上游漏写 useState/useCallback 导入不照抄；普通函数及 shallowRef 实现等价动作。HotKeys Input 取公开 exposed.input，避免将组件实例当成 HTMLElement。
- 代表静态检查发现 locale 路径须为 en_US/zh_CN、Typography 子路径导出 Text、Modal 回调须返回 void，均在首次完整构建前修正。

## 验证证据

- 初始 `accept:nuxt:batch --affected --plan`：六批历史证据有效。
- 开发准备复用 resources；未执行静态构建。

## 未验证事项与剩余风险

本记录按阶段追加证据；最终结果见末节。严格视觉与行为验收尚未执行。

## 扩展范围与双语顺序

双语代表在 `representatives-passed/summary.json` 实际通过后才创建余下11项。每项中英文索引一致：

| 组件      | 固定索引与示例                                                                      |
| --------- | ----------------------------------------------------------------------------------- |
| UserGuide | 1 Basic、2 Theme、3 Position、4 Padding、5 Buttons、6 Controlled、7 Modal、8 NoMask |
| DragMove  | 1 Basic、2 Constrainer、3 Handler、4 CustomMove                                     |
| HotKeys   | 1 Basic、2 Content、3 Render、4 PreventDefault、5 ListenerTarget                    |

原有 Example1/Example2 保留为 Vue 补充示例，不占上游映射计数。三个组件英文迁移说明中的中文残留翻译，保留已有 API、SSR、固定源码限制；新增双语章节分别解释对应示例。README 修复此前滞后的748数量与Notification下一批，和队列一起同步到782及CodeHighlight。

## 定位与阶段证据

所有基础运行材料位于 `apps/docs/.data/documentation-smoke/guide-drag-hotkeys/`，使用仓库 Node 与锁定 Playwright Chromium 151.0.7922.34、1440×900、DPR1、light，中英文独立 context 并发。临时脚本复用 Skill 的 documentation-smoke.mjs；未执行 clean，失败/成功目录分开保留。

- 交互浏览器先观察实际 DOM：UserGuide popup 为 `.semi-userGuide-popover[role=dialog]`，Modal 为 `.semi-modal-content`；拖拽元素自身设置 position/cursor，没有额外 DragMove wrapper。HotKeys Input 的真实输入位于 `.semi-input-wrapper` 内。
- 初次代表脚本把中文 Modal 确定文字当成可访问名称，并把英文 Prev 写成 Previous，造成定位失败。实际按钮 aria-label 为 confirm/cancel，按 DOM 修正后 HotKeys 双语定点 `hotkeys-targeted/` 通过。无组件修复。
- `representatives-passed/summary.json`：双语各19阶段通过，含6组代表操作、源码/重置、UserGuide Modal/NoMask、DragMove CustomMove、HotKeys ListenerTarget 编辑运行及 iframe 视口。中文/英文 Modal、NoMask 局部截图保留，英文 Modal 截图人工查看。
- 新示例注册后重启开发站；首次整批尝试早于服务就绪，`full-dev/` 留存 connection refused。确认服务就绪后执行 `full-dev-ready/summary.json`：双语各41阶段通过，覆盖17项主要操作、源码/重置和上述4类编辑运行。
- 全批 ESLint 和 Prettier 检查通过；扩展 Nuxt typecheck 和 check:content 通过，196页、1607注册Demo。
- 开发态固定预取 NUXT_E7002 与 REPL sandbox 提示精确分类保存在各运行的 warnings-*.json；开发worker失败和相关Event仅由共享runner既有规则识别，原始日志在dev.log。未修改共享runner，未统一忽略console error；最终静态检查不接受开发态fallback。

## 验收边界

本轮只补齐文档，不新增严格验收 spec、批次 accepted 或 accepted deviation。UserGuide 的本地封面替换、各位置/高亮/受控/完整动效，DragMove 的双语宽度与边界写入，HotKeys 的浏览器默认动作均仍须在后续固定 React/Vue 双语明暗及适用矩阵正式验收。

没有修改组件实现、公开类型、主题、Foundation、依赖或共享构建/运行设施，故不触发额外组件回归或真实发布包验证。现有资源/图标来自既有公开产物，本次不新增或内联第三方代码/资产。

## 最终静态检查与已知非阻断提示

- `pnpm --filter @workspace/docs check` 成功退出0；64项流程/资源测试通过，resources缓存复用，site/checks按新输入重建。最终196页、1607注册Demo、395预渲染路由、5878产物文件散列、许可与站点门禁通过，完整日志为 `check.log`。
- `static-extra/summary.json` 双语通过：UserGuide 高亮宽度相对目标精确增加20/30px（padding10/15）；在真实 Monaco 中将 Modal 第一标题改为 Edited guide title，运行后显示新标题，退出编辑仍保留原示例；Meta+S 与 Control+S 均实际 defaultPrevented=true，额外Alt不命中且不阻止；导航卸载后快捷键不再唤起弹窗。
- 初次静态整批 `full-static/` 的41阶段/语言操作断言均通过，但每种语言在 HotKeys ListenerTarget 编辑器阶段记录1条 console-error：`Blocked autofocusing on a <button> element in a cross-origin subframe.`，该轮状态失败，未当作最终通过证据。
- 直接点击输入框再发组合键仍出现该提示，`static-editor-focus/` 留存。源码证据：固定 React `modal/Modal.tsx:288` 及 Vue `ModalDefaultFooter.vue:30` 均为 cancel 按钮设置 autofocus；Vue `ModalDialog.vue` 另有程序化焦点激活。未为烟测删除 autofocus 或改变默认行为。
- 定点 `static-editor-focus-verified/` 双语通过：确认实际焦点位于 iframe 弹窗，Escape 关闭、再次 Control+Q 打开、confirm关闭均成功。因此把这一精确消息作为**已知非阻断运行提示**记录在本批 warnings-*.json，保留原始 kind/text/phase 与验证依据；不改共享runner，不忽略其他console error，也不声明浏览器零console error。这不是严格验收 accepted deviation。
- 本次只更改临时烟测断言与精确问题分类，已构建源码和产物未变化，因此不重建站点，复跑完整静态整批确认。
- 最终 `accept:nuxt:batch --affected --plan`：Button、ConfigProvider、Dark Mode、Icon、Locale、Navigation六批证据仍有效，无需重验。未运行组件发布包或全仓check:full，未提交或推送。

最终 `full-static-verified/summary.json`：中英文各41阶段全部通过，17个双语上游示例逐项操作、源码/重置与4类编辑运行完成。未分类 issues 为0；上述原生 autofocus 提示保存在 warnings-*.json，Volar提示由共享runner记录为knownIssues，静态无开发worker fallback。附加5阶段/语言在static-extra独立context通过，没有模拟时钟。最终局部截图保存于full-static-verified，另已查看full-static中的中文Buttons截图。

最终映射782/859，剩余77项；严格有效验收仍43/859，739项已映射待验收。README、队列、三个映射文件和生成注册表/覆盖账本同步；下一补齐批次为CodeHighlight 3项，随后JsonViewer 6项、MarkdownRender 4项。最终diff仅涉及这三个组件的文档示例、映射与进度记录，vendor及packages无修改；未提交或推送。

## 后续提交拆分

上述“未提交”指补齐验证完成时的状态。随后按用户要求拆为三个组件提交：UserGuide（`c6ae217`）、DragMove（`6548b74`）及本次 HotKeys 提交。共享注册表、覆盖账本、README、队列和本记录随各提交逐步更新，映射依次为773、777、782；每步已检查索引中的本批注册源文件、映射引用、数量与 diff。示例源码和最终文档内容保持上一轮验证版本，未为提交重复构建或浏览器验证，未推送。
