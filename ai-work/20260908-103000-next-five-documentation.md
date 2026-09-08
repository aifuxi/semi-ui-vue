# AI 工作记录：Lottie 与后续四个组件示例补齐

- 日期：2026-09-08
- 状态：进行中

## 目标与验收

依现有队列完成 Lottie 4、Chat 11、AIChatDialogue 13、AIChatInput 13、Sidebar 8 项双语示例。代表先行，每组件逐项静态运行、主要操作及源码/重置/适用在线编辑通过后独立提交。不新增 accepted。

## 基线与范围

初始工作区干净，vendor 固定 v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。CodeGraph status 索引就绪，query 使用当前绝对路径。六批历史正式证据有效。

## Lottie 代表

已依固定 Adapter、Foundation、主题、双语文档、现有 alignment 核查；无组件专属 SCSS 或图标依赖。先实现 Path（1）、Global（4）双语：URL 真实 SVG 动画、全局播放器与静态方法身份一致、暂停/恢复、源码/重置和在线编辑。每例单一小型模板 SFC，无需拆分。复用既有 Example1 自有动画数据为本地 JSON；不新增第三方资产。中文无单位高度修正为与英文一致的300px，记录到双语说明。

Lottie 代表 `representatives-dom` 双语通过。首轮烟测错误地用path查找solid层，实际DOM是rect，已修正而未改动画。扩展 Data（2）、Instance（3）后 `full-dev-restarted` 全部通过；新增文件的开发HMR源码注册为空，重启服务后恢复。代表Nuxt类型、全批ESLint、内容注册通过。开始最终联合检查，未修改组件或共享设施，无需重复发布包验证。运行使用锁定Chromium151.0.7922.34，1440×900/DPR1/light/双语独立context和真实时钟。

Lottie 收尾：`pnpm --filter @workspace/docs check` 退出0，67流程测试、196页、1667注册Demo、6015静态文件与Nuxt类型/内容/REPL/许可散列通过（日志/tmp/semi-lottie-check.log）。`full-static/summary.json` 双语各7阶段通过，issues为空；动画URL、异步data、实例/全局控制、源码重置与两个代表的真实Monaco编辑运行均通过，英文局部截图已检查。证据位于apps/docs/.data/documentation-smoke/lottie/。affected plan六批均有效；覆盖812/859、accepted43不变。无组件、共享运行时或第三方资产变更。

## Chat 代表

已读取固定Adapter/接口、Foundation事件、SCSS、默认主题、双语11项文档与既有alignment；保留原始双语消息文本，头像替换为本地one/two.svg，上传通过customRequest/afterUpload返回本地素材URL。Basic（1）验证三种mode/两种align、文本/附件发送及异步回复/重置；Streaming（3）验证loading→incomplete→complete、停止与再次发送。源码明确notifyChatsChange在message-send之前，mock保留异步时序并清理timeout/interval。每个代表一个独立SFC，仅承担一个示例状态机，暂不抽象共享逻辑。

Chat 代表：页面阶段由representatives-editor前六阶段通过，编辑器由representatives-editor-placeholder双语通过；停止按钮可访问名称含disc图标，上传有普通/替换两个input，TextArea有隐藏测量节点，均按DOM修正。在线编辑先误匹配ChatMessage泛型，随后改用公开placeholder验证。基础消息内React包名触发内容边界门禁，因此展示代码也迁移为Vue SFC，并记录语言说明。

扩展发现FullBox缺失defaultNodes.action，实际浏览器仅有上传/发送按钮。新增公开slot反馈/重置测试先失败（/tmp/semi-chat-action-before.log），抽取共享actionNode后15项Chat单元/SSR通过。固定源码chatBox/index.tsx:112-116包含action，未改事件、样式或Foundation。UI全包类型仍失败于既有Transfer两处VNodeChild/RawChildren重载（/tmp/semi-chat-ui-types.log）；不宣称全包类型通过。组件修改使resources失效，已停止开发服务重建公开包/REPL。

Chat扩展页面操作已通过：Status/ClearContext在full-dev-targeted；AvatarTitle在full-dev-avatar；Actions在full-dev-actions；Sources/FullBox/InputArea/Hints/CustomHints在full-dev-content。AvatarTitle沿用固定上游key=avatar+title，恢复默认slot；菜单项无自动关闭，验证触发按钮关闭/重开。FullBox反馈和删除取消/确认均通过。

Chat Chromium组件对照5/5通过（/tmp/semi-chat-browser.log；服务日志有ResizeObserver通知警告，浏览器断言仍通过），真实tarball安装/exports/ESM/类型/样式/SSR与Worker消费验证通过（/tmp/semi-chat-pack.log）。扩展Nuxt类型发现Form.Upload action必填，补显式空action供customRequest使用后通过。编辑器多文件根目录因跨语言共享helper提升到chat层，入口改名App.vue后局部import找不到；将两份helper放回各语言目录，与已有REPL约定一致，不更改共享设施。

Chat多文件REPL第二处阻断是helper的外部defineProps类型解析；CustomActions/CustomInput改为实际使用字段的局部类型后，Actions与其余复杂编辑路径双语定点通过。full-dev-final整批双语通过。未改共享编辑器或额外组件，准备最终静态检查。

Chat静态full-static-ready双语各30阶段通过、issues为空，但截图揭示代码块白字浅底。仅增加Basic的markdown-render.css未解决（full-static-style仍可复现）。DOM/computed style证明原ChatMarkdownContent直接pre/code缺失CodeHighlight容器；固定chatBox/code.tsx→markdownRender/components/code.tsx使用CodeHighlight。修正为公开CodeHighlight并保留lineNumber=true；新增公开Chat代码文本/主题容器测试，Chat单元/SSR 16项通过。此组件变动使之前包/浏览器证据需刷新，最终结果尚待后续记录。

Chat代码块开发定点双语通过，computed style确认为前景rgb(249,249,249)、背景rgb(22,22,26)，区别于原来的白字浅底。最终Chat单元/SSR 16/16、Chromium对照5/5和真实tarball验证均通过（/tmp/semi-chat-code-final-unit.log、/tmp/semi-chat-final-browser.log、/tmp/semi-chat-final-pack.log）。联合门禁/tmp/semi-chat-final-check.log通过；未新增第三方代码/素材，CodeHighlight复用现有公开组件与许可链。

Chat最终证据为apps/docs/.data/documentation-smoke/chat/full-static-final/summary.json：双语各31阶段通过、issues为空，代码块截图已复核可读。先前full-static连接拒绝是预览启动竞态，保留失败结果，不作为证据。affected plan六批有效；823/859已映射、accepted43不变，README与队列同步，下一批AIChatDialogue。

## AIChatDialogue 代表

按固定Adapter/interface/dialogue→Foundation/SCSS/token→双语13例和本地图标核查，选择Basic(1)与MessageTypes(3)。复杂消息包含文本、图像、三个文件、推理、function_call、annotation与自定义plan/Step，PlanContent为同语言多文件依赖。先保留完整数据和语言差异，React代码文本迁移Vue，头像/图像本地化，文件点击使用disabledFileItemClick配合事件状态避免虚构链接导航。representatives-icon证明Basic模式/布局/反馈；representatives-collapse证明MessageTypes交互。烟测分别修正aria-pressed不存在、Collapsible关闭通过高度0而非子节点visibility、嵌套pre选择器和Radio label点击，未为烟测修改组件。

representatives-editor-labels双语两个源码/重置/真实编辑器路径通过后，才生成剩余11例。多文件数据adapterData保留固定双语4种转换数据；StreamingChatCompletion从头转换当前前缀，避免上游闭包/重复增量，沿用上游仅显示首个choice；StreamingResponse保留固定乱序重复延迟索引和nextState，所有定时器卸载清理。上游渲染遗漏hook/Toast导入以Vue生命周期和可见事件状态补齐。

公开streamingResponseToMessage原声明messages/state与运行时message/nextState不一致，已按固定Foundation返回结构修正为可null的message/nextState；空输入null、进行中state、完成nextState=null的公开测试通过。仅修正类型断言，不改Foundation或运行时逻辑。AIChatDialogue单元/SSR 9项通过（/tmp/semi-dialogue-unit.log）；将在最终docs类型与真实包消费验证声明。Step的action.icon目前未渲染，属于不阻断本批演示的精细差异，严格验收需审阅，不计accepted。

AIChatDialogue full-dev-final双语全批通过，初次联合门禁通过（1715注册Demo、836/859映射、43 accepted），真实包通过。首次full-static通过全部页面操作，但CustomBox-editor复制被iframe Permissions Policy阻断：console-error与NotAllowedError均记录，未过滤。固定上游使用copy-text-to-clipboard同步复制；改为用户激活下execCommand优先，临时textarea finally清理/恢复焦点，必要时Clipboard API回退并捕获拒绝；失败不显示虚假成功。需刷新此运行时改动的组件/发布与静态证据。

复制修正后CustomBox-editor开发定点通过。初步组件对照与resources准备时间重叠，不能作为最终固定资源证据；资源与site生成结束后重新运行组件Chromium与真实包验证，最终日志以semi-dialogue-final-browser.log和semi-dialogue-final-pack.log为准。

AIChatDialogue最终联合门禁通过（/tmp/semi-dialogue-final-check.log，196页/1715注册Demo/6149静态文件）；复制定点full-static-copy双语通过且无Clipboard权限错误。固定资源下组件Chromium5/5、真实tarball安装/类型/样式/SSR通过。AIChatDialogue运行时仅新增复制兼容路径，类型修正未改转换执行逻辑。

最终full-static-final双语各20阶段通过、issues为空，涵盖13例操作/源码/重置及6条编辑器路径。复杂消息初始长图被站点fixed header遮挡，额外截图types-en-US-isolated.png仅用截图style隐藏非组件.site-header，未遮盖组件内容；截图复核完成。六批历史正式证据有效，836/859 mapped、43 accepted，README/队列同步。

## AIChatInput 代表与扩展

按固定 Adapter/interface、Foundation、SCSS/theme、双语13例与公开扩展核查。Basic(1)与Extensions(13)先验证本地上传/发送、@两级菜单、Enter/Escape、引用/节点删除及transformer。representatives页面与representatives-editors双语通过后扩展其余11例；所有上传为本地customRequest，示例不发往上游接口，NodeView复用公开SkillSlot.extend，不新增Tiptap运行时或第三方资产。REPL helper采用局部类型，避免外部defineProps解析；编辑器placeholder位于p节点，修正烟测定位。

固定getConfigureItem没有现成Vue公开入口，新增Configure.Item scoped slot（field/initValue、value/onChange），注册/变更/卸载沿用实例provider。新增黑盒双实例隔离与发送setup测试，AIChatInput单元/SSR9项通过（/tmp/semi-input-configure-unit2.log）。双语API、迁移与对齐矩阵同步，真实包类型consumer增加compound和独立导出验证。

扩展采用13个入口与同语言helper：配置控件、模板面板、引用项、NodeContent、mockUpload与自定义扩展。模板使用setContentWhileSaveTool保留技能；英文富文本原例缺data-label，补为AI Coding使技能可见；原模板缺失input-slot闭合属性已修正。slot名称使用公开#uploadButton。SendMessage status先收窄success字面量，但第二个预置附件仍缺必填status，Nuxt类型未通过（/tmp/semi-input-full-types2.log）；联合检查再次指出该遗漏，现将两张本地已有图片均标为success，保留文件名/尺寸/percent数据与发送链路。开发热更新状态不作最终证据；最终整批在固定静态产物验证。

模板快速切换调查：固定Tooltip Foundation.show()在getAnimatingState()为真时直接return；技能菜单尚在入场或退出期间重开模板会被忽略。500ms诊断间隔可成功，最终烟测改为断言真实semi-tooltip-animation-*类消失后再关闭/重开，不用固定睡眠、force点击或重试。保持与固定基线相同的动画边界，此补齐不新增严格accepted；快速反向切换仍需严格矩阵同环境审阅。仅toBeHidden不足以代表动画完成，失败证据保留在full-dev-editors。

AIChatInput收尾：新增Item导出最初导致tarball消费方GlobalComponents泛型约束错误；改显式公共组件声明后真实包通过（/tmp/semi-input-final-pack2.log）。Nuxt类型最终/tmp/semi-input-full-types3.log退出0，联合门禁/tmp/semi-input-final-check2.log退出0（196页/1741注册Demo）；单元SSR9/9、Chromium5/5、ESLint通过。最终仅类型声明收窄，不重复运行已通过且运行代码未变化的浏览器矩阵。

full-static-final双语各32阶段通过，issues为空，覆盖13例全部主要操作/源码/重置及7条编辑器路径。扩展局部截图复核，六批历史证据有效；849/859映射、43 accepted，README和队列更新，下一批Sidebar。临时脚本与摘要保存在apps/docs/.data/documentation-smoke/ai-chat-input/。
