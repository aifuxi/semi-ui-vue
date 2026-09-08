# AIComponent 双语示例补齐

开始：2026-09-08 23:17:43 +08:00（首次记录时间；此前已完成队列调查）。状态：完成。

固定 vendor v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21，初始工作区干净。剩余两项均作为代表：Basic（20 Token、9 展示图标、12 按钮、6 标签和 1 FloatButton），Conversation（模型/MCP/思考、输入上传发送、引用删除、消息编辑、annotation/resource 侧栏关闭/重开）。双语各两项；同语言 messages.ts、mockUpload.ts、ConfigurationControls.vue 为完整 REPL 依赖。默认文档站 1440×900、DPR1、Chromium、双语 light，补齐不计 accepted。

基础展示依据固定 Button/Tag/FloatButton Adapter 及文档 JSX。组合依据 aiChatInput Adapter/configure-area、aiChatDialogue interface/widgets/dialogueContent 与 Foundation messageToChatInput，SCSS/global AI Token、固定双语文档与现有公开图标。头像/来源图片复用本地资产，模拟上传不发送外部请求，数据保留上游结构和语言差异，技术栈文本改为 Vue。

阻塞缺陷：Vue 编辑 payload 原为 {content, attachment:[]}；固定 dialogueContent.tsx:342 调用 messageToChatInput(message)，应提供 inputContents/attachments/references。新增公开编辑渲染回调测试先失败（/tmp/semi-ai-component-before.log），后通过公共转换入口修正。不复制 Foundation 或引入新第三方资产。

代表预检：资源准备时已有4321静态服务（PID27833），本次开发站自动使用3000。Nuxt内容检查198页/1761注册Demo通过；初轮类型发现自定义resource数据的上下文类型限制，改为推断数据后赋给Message[]，再次Nuxt typecheck通过。首次配置插槽名误用configure-area，已按公开实现改为configure；内链补尾斜杠。

首轮烟测Basic和双语侧栏关闭/重开通过。单选按钮原生input被图标遮挡，应点击label；二次has定位器因重复包含根scope匹配不到，保存失败DOM后改直接定位实际label。上传原生input动态生成，改捕获filechooser。固定Configure.Mcp仅展示已有工具，无选中切换，确认源码后用打开/内容/关闭断言。以上为烟测定位/错误假设修正，不修改组件语义。

operations2双语全部操作断言通过，但上传每次产生File chooser user activation警告，不能作为最终通过证据。原因：默认按钮主动openFileDialog后冒泡触发外层Upload再次打开；固定aiChatInput/index.tsx:528无按钮click。新增原生文件选择器公开行为测试先失败（semi-ai-component-upload-before.log），移除重复回调后AIChatInput单元/SSR10项通过。AIChatDialogue单元/SSR11项通过。两组件变动需刷新resources和最终浏览器/发布证据。

representatives-ready 双语各10阶段通过，issues为空，覆盖全部两项主要操作、源码/重置和真实修改源码后运行（Basic修改标题；Conversation修改模拟回复、复跑附件引用编辑链路）。截图已复核。REPL固定sandbox提示逐条保存在sandbox-warnings-*.json，不过滤console error；普通Volar提示由共享runner精确分类。

冻结后联合检查一次通过（/tmp/semi-ai-component-check.log）：复用最新resources，67流程测试、Nuxt类型、198页/1761 Demo、6305静态文件、REPL及许可散列检查通过。完整pack与组件矩阵在静态全批通过后启动，不与资源重建重叠。

第一次full-static-final双语交互断言全部通过，但英文的两个异步Volar提示落入下一source-reset阶段。属于前一编辑器worker延迟事件；阶段名明确标记after-editor以沿用共享runner精确分类，未增加错误过滤。static-editor-targeted定点英文通过，full-static-ready双语各10阶段通过且issues为空；这是最终完整运行证据。源码未变，不重建站点。最终烟测目录：apps/docs/.data/documentation-smoke/ai-component/full-static-ready/。

MCP保持固定上游只展示工具列表的行为，配置入口上游未绑定业务动作；本示例不声称可编辑MCP配置。精细视觉/行为差异留待正式验收，本次不生成accepted。原有六批正式证据保持有效；859/859 mapped、43 accepted、816待严格验收。README与双线计划同步，补齐下一批为空，严格验收下一批Divider2项。

最终验证：AIChatDialogue单元/SSR11项、AIChatInput单元/SSR10项、两个组件Chromium对照10/10（含light/dark/RTL）、真实tarball安装/exports/ESM/类型/样式/SSR/Worker均通过。日志分别为/tmp/semi-ai-component-unit.log、semi-ai-component-input-unit.log、semi-ai-component-browser.log、semi-ai-component-pack.log。本批ESLint通过。未运行全仓pnpm check；资源构建仍输出此前记录的Transfer类型诊断，本次不宣称全仓类型门禁通过。

结束：2026-09-08 23:39:10 +08:00。上游索引2项、双语4个入口。短smoke共10次、7次失败（含定位错误与警告归类，不隐藏早期失败），10轮执行耗时合计90.029s；各轮内部语言并发，未将语言耗时相加冒充墙钟。联合check1次、完整pack1次、组件矩阵1次。开发resources准备2次（初次编辑payload修正、后续上传重复调用修正）。最终通过完整smoke为full-static-ready（11.271s），英文定点为static-editor-targeted；这些目录及失败目录保留，未运行clean。
