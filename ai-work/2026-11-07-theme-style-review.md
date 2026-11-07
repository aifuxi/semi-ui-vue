# 主题改动、文档与组件 UI 视觉复核

## 问题与复现

本次从 `c5575ddd` 排版入口、`da74d73f` 颜色生成器、`1a8888aa` 主题文档到 `f0de1b1a` 工作台迁移的改动范围回查。用户进一步指出文档站代码块样式异常。

1. 打开文档站 `/zh-CN/advanced/customize-theme`，查看「从默认主题开始」的 TS 代码块：所有 token 同色，代码贴边，行内代码背景覆盖在整段源码中。
2. 切换暗色：仍无语法高亮；复制按钮仅约 `16×6px`，没有可见文案。这里缺少完整的代码块工具栏与排版。
3. 打开 `/zh-CN/basic/button` 并展开示例源码：Prism 高亮本身有效，但源码背景重复叠加，和新文档围栏不一致。

预期是两种文档代码入口均有清晰的代码区、正确的模式高亮、可操作的复制入口和局部横向滚动。

## 已确认根因与修复

- 新主题文档使用 VitePress/Shiki 围栏；站点采用自定义 Layout，并未导入 VitePress 默认主题样式。已有 CSS 仅限制围栏宽度，没有消费 `--shiki-light` / `--shiki-dark`，也没有工具栏和块级 code 样式。
- 旧 DemoBlock 使用 Prism 与 `.semi-codeHighlight`；已有测试仅断言该入口生成 token，没有覆盖 Shiki 计算色值、代码布局或复制行为。此前的主题交付因此遗漏了真实文档消费场景。
- 在 `apps/docs/.vitepress/theme/styles/code.css` 集中适配文档围栏和示例源码，使用站点的 `body[theme-mode]` 切换 Shiki 颜色，隔离行内背景，统一留白与滚动，并恢复语言标签、复制按钮、键盘焦点和成功反馈。
- 复制仍使用 VitePress 原有行为；配置中文标题，按钮显示同一标题。组件库 CodeHighlight、固定 vendor 与公开主题默认值均未修改。

## 验证与证据

- Chromium 实际截图检查：定制主题文档的浅色、暗色及 `390×844` 手机布局；Typography 默认六级标题、Button 示例与主题工作台初始预览。
- 文档生产构建及 11 项浏览器回归通过：双模式与动态切换、键盘复制与真实剪贴板、手机局部滚动、Prism 示例、主题文档入口及静态指南。
- 主题工作台生产构建、类型检查和 11 项浏览器回归通过：颜色选择器、品牌、排版、局部主题、打开中的 Tooltip/Modal、路由清理及四档视口。
- 5 个主题相关单测文件共 161 项通过，覆盖排版编译、颜色生成器、作用域桥接及省略失效。
- 文档 `vue-tsc`、修改文件 ESLint/Prettier、`git diff --check` 通过。
- 对全量主题 CSS 额外按公开变量实际默认值解析，与固定基线编译结果比较，除新增声明及空白外无默认排版差异。临时对照脚本保存在已忽略的 `test-results/theme-review/`。

- `pnpm test:consumer tests/consumer/typography-theme.spec.ts tests/consumer/color-theme.spec.ts` 共 16 项真实 tarball 浏览器消费通过，覆盖代表组件、深浅/强制模式、默认与自定义弹层容器、打开中更新、卸载清理及动态省略；复用已有外部依赖，未启用隔离安装。
- 消费者首轮误用 `pnpm exec playwright`，在准备 fixture 时被项目要求使用 pnpm script 的前置检查拒绝；按标准 `pnpm test:consumer` 入口重新执行后通过，前置失败未计为浏览器验收。文档首轮发现复制按钮可访问名称被伪元素文案覆盖，已将可见文字与配置标题统一，随后完整 11 项回归通过。

截图均为本次实际捕获，位于已忽略的 `test-results/`：

- [暗色修复前](../test-results/theme-review-fences-dark-before.png)
- [暗色修复后](../test-results/theme-review-fences-dark-after.png)
- [浅色修复后](../test-results/theme-review-fences-light-after.png)
- [手机修复后](../test-results/theme-review-fences-mobile-after.png)
- [Typography 默认标题](../test-results/theme-review-typography-default.png)
- [工作台初始预览](../test-results/theme-review-studio-initial.png)

## 首轮结论边界

本次修复的是文档消费层的确定缺陷，并复核主题关键链路；没有运行全库全部组件的像素对照矩阵，也没有完成完整辅助技术审计。历史发布审计中的 Button/Modal 视觉失败不在本次被重新判定为通过。构建期间已有的运行时 eval 与大 chunk 提示仍存在，与本次 CSS 修复无关。

## 第二轮：完整组件库 UI 视觉复核

本轮继续用户要求，实际打开固定 React 基线和 Vue 对照页面，并逐对查看截图。固定参考仍是只读 `vendor/semi-design` 的 `v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`，不取在线最新版。范围覆盖注册表中的 85 个功能场景（另一个 harness-calibration 只校准测试工具），没有只抽查 Typography 或 Button。

基准视口为桌面 Chromium、LTR、zh-CN；每一行均实看 light/dark。尺寸、主题、状态通过真实公开 props 和鼠标/键盘交互呈现，两端场景对称增加 query 入口，保留默认场景。无离散 size API 的组件不虚构尺寸；任意数值尺寸选取实际代表值。弹层同时检查触发器与完整页面，不能只裁正文而漏掉位置、遮罩或焦点。

### 发现并修复

| 问题                                  | 现场表现与修复                                                                                                                                                                                                                                                                                                                 |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 共享 Typography 普通字重覆盖组件语义  | Upload 文件名由固定 600 变为 400；把普通 Text 可选字重放入零优先级 `:where(.semi-typography)`，保留组件语义类覆盖，不靠导入先后碰运气。上传六状态双模式复看。                                                                                                                                                                  |
| Storybook 漏载 iconButton 样式        | 加载图标 48px、缺间距，禁用 cursor / pointer-events 与 Modal 标题图标异常；补齐独立虚拟 CSS 入口。没有修改旧快照或像素阈值。                                                                                                                                                                                                   |
| Sidebar 覆盖顺序                      | CB 工具栏字体 14px、宽约 43.6px，参考为 12px、约 32.8px；把专用 CSS 放到基础 Button 后，再 fresh goto 实看。链接按钮移除固定基线没有的禁用条件。                                                                                                                                                                               |
| DatePicker 多种真实面板缺失或布局错误 | 移除强制 36px 日期行高；compact 导航使用 small；恢复固定 YearAndMonthFoundation 与真实 ScrollList、年月禁用与范围规则；恢复内嵌输入解析/焦点、直接呈现时间滚动列、保留 locale 与禁用回调优先级。全部七 type × 两密度 × 双模式实看，另看清除、确认、时间切换和范围编辑。最后补齐两端曾聚焦后的禁用日期灰色及固定 4px 弹层间距。 |
| Select / Cascader 展开态              | Select 空 loading span 改为真实 Spin；Cascader disabled 不再抹掉固定构造器允许的 defaultOpen 初始态。                                                                                                                                                                                                                          |
| Table 选择与结构                      | 全局 rowSelection.disabled 错误禁用所有行 Checkbox；改为固定的表头/行点击语义，逐行禁用由 getCheckboxProps 决定。虚拟表恢复 scroll.x 外框与数值列宽缓存；分组 prop 返回原始字符串时遵循固定不渲染规则，保留 Vue slot。                                                                                                         |
| Tree 加载与虚拟列表                   | 自画 8px 圆圈改为真实 Spin16；恢复 AutoSizer 包装与父列表测量，修复 viewport 与末项偏移。拖拽三种插入位置及虚拟首/中/尾均复看。                                                                                                                                                                                                |
| AIChatInput / AIChatDialogue          | 数值 popupWidth 补 px，技能/模板/建议面板宽度恢复；Configure.Button 转发 icon slot，恢复模板图标。更多菜单恢复固定的受控 custom 触发与 12px 间距，删除确认打开前关闭菜单。                                                                                                                                                     |
| Chat 默认 Markdown                    | 原生 p 导致 16px、气泡高度和文字颜色错误；复用公开 Markdown 的 Typography 默认映射，保留自定义覆盖。移除 React 参考中的 raw Markdown 替身，补齐真实默认渲染对照；公开 Chat / AIInput CSS 入口补内部样式依赖。                                                                                                                  |
| JsonViewer 搜索                       | 高亮更新夺取搜索框焦点；按固定行为在 nextTick 恢复输入焦点，实际连续键入、正则/大小写/全词与错误 token 复看。                                                                                                                                                                                                                  |
| Audio / Video 音量菜单                | 原生 style 的数值 width/height 被丢弃，轨道零尺寸；显式 px 修复轨道与 Tooltip offset。两端测试 Portal 容器补真实定位上下文后再看菜单，未为夹具改产品 Portal。真实播放及 MediaError 状态双模式实看。                                                                                                                            |

私有 Foundation 集成只增加固定源码的编译边界和类型，未改 vendor、未复制成独立维护版本。查询场景是可复用的审查入口，临时捕获脚本、日志和截图均留在已忽略目录。

### 基础与布局

| 组件 / 场景             | 实际查看的尺寸、可见状态与操作（两端均含 light/dark）                                                                                                                            |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Button types / contract | small/default/large × solid/light/outline/borderless × 5语义类型 × normal/disabled/loading；同尺寸主题下5类型逐个真实 hover/focus/active；group/block/图标左右/仅图标见 contract |
| IconButton              | 三尺寸，普通/图标文字/小号solid/disabled/loading/AIloading/colorful，三尺寸 hover/focus/active                                                                                   |
| FloatButton             | 三尺寸、round/square/colorful/disabled/badge/group；三尺寸真实 hover/active（div本无键盘focus公开契约）                                                                          |
| Typography              | 6级标题、5个命名字重、normal/small/inherit、7种type、各装饰、disabled、link/disabled link、普通/extended段落、单行/两行省略与展开、Numeral、复制前/成功反馈、link hover          |
| Tooltip                 | 12方位、有/无箭头、custom/hover/click/focus、disabled trigger                                                                                                                    |
| Modal                   | small/medium/large/full-width、fullScreen、confirmLoading、关闭/重开及默认Portal标题正文footer遮罩                                                                               |
| SideSheet               | 三尺寸×四方位（body portal）、自定义72%容器、标题/正文/footer/遮罩、关闭/重开                                                                                                    |
| Divider                 | 场景内水平/竖直、文字/无文字、不同对齐/虚线                                                                                                                                      |
| Grid                    | 场景内24格、gutter/flex/order、1440与390宽响应式                                                                                                                                 |
| Layout                  | 三行/侧栏/嵌套/自定义语义标签、1440与390断点                                                                                                                                     |
| Resizable               | 单体8方向手柄、横/纵组合；实际right拖动中和拖动后                                                                                                                                |
| ConfigProvider          | direction/locale/timeZone/嵌套配置及consumer输出                                                                                                                                 |
| Locale                  | en-GB/ja-JP、动态切换后的文本                                                                                                                                                    |
| Space                   | tight/medium/loose/数值/数组、horizontal/vertical、wrap与start/center/end/baseline                                                                                               |
| Icon                    | 5尺寸、旋转、动画、颜色、AI fill、Lab图标                                                                                                                                        |
| Illustrations           | 全16 light/dark插画及背景/主题色                                                                                                                                                 |
| Lottie                  | 内部/调用方容器、默认blue与真实操作后的orange                                                                                                                                    |
| DragMove                | absolute/relative/handler/input guard/customMove默认，实际basic拖动后                                                                                                            |

### 表单与输入

| 组件 / 场景          | 实际查看的尺寸、可见状态与操作（两端均含 light/dark）                                                                                                                                           |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Input（含 TextArea） | 三尺寸；普通、error、warning、disabled、readOnly、hover、focus、active；前后缀、placeholder、清除、计数、多行                                                                                   |
| InputNumber          | 三尺寸；普通/error/warning/disabled/readOnly、hover/focus/active；前后缀、min/max、独立按钮                                                                                                     |
| PinCode              | 三尺寸，已填/空值/部分填、mixed、disabled、hover/focus/active                                                                                                                                   |
| Checkbox             | 无离散 size API；checked/unchecked/indeterminate/disabled、extra、group、card/pureCard                                                                                                          |
| Radio                | 普通 radio/card、checked/unchecked/disabled、button small/middle/large（query default 映射 middle）；hover/focus/active/click                                                                   |
| Switch               | 三尺寸；checked/unchecked、文字、disabled/loading、hover/focus/active                                                                                                                           |
| Rating               | small/default/数值32、自定义 S、半星、disabled；三尺寸 hover/active，真实 radio 节点 focus；Tooltip good                                                                                        |
| Slider               | 无离散 size API；普通/range/vertical、disabled、marks；hover/focus/active/drag 与数值 Tooltip                                                                                                   |
| TagInput             | 三尺寸；普通/error/warning/disabled/readOnly、hover/focus/active；已有标签、可删除、多标签                                                                                                      |
| TimePicker           | 三尺寸输入、普通/error/warning/disabled/readOnly、hover/focus/active；普通时间、range、12h                                                                                                      |
| DatePicker           | 三尺寸触发器及普通/error/warning/disabled/readOnly、hover/focus/active；全部七 type × default/compact × 双模式实际看过；选中日、范围背景、禁用年月、monthRange focus/clear、year 空 placeholder |
| Select               | 三尺寸；普通/error/warning/disabled/loading、hover/focus/active；基础/占位/多选/分组搜索                                                                                                        |
| AutoComplete         | 三尺寸；普通/error/warning/disabled、hover/focus/active；基础、后缀、分组                                                                                                                       |
| Cascader             | 三尺寸；普通/error/warning/disabled、hover/focus/active；已选路径、多选、默认展开、搜索空结果                                                                                                   |
| TreeSelect           | 三尺寸；普通/error/warning/disabled、hover/focus/active；单/多选、搜索、选中/禁用节点                                                                                                           |
| ColorPicker          | 数值尺寸220×140内联、180×110浮层；已选颜色/透明度                                                                                                                                               |
| Form                 | 组合输入三尺寸；label、必填、extra、help、error/warning、disabled/readOnly、hover/focus/active、布局与按钮                                                                                      |
| Transfer             | 无离散 size API；未选/已选/禁用项、disabled/loading、搜索空态、hover/focus/active                                                                                                               |
| Upload               | 无离散 size API；文本文件/图片列表、disabled/error/warning；wait/validating/uploading45%/success/uploadFail/validateFail；触发按钮 hover/focus/active                                           |

### 内容与数据

| 组件 / 场景   | 实际查看的尺寸、可见状态与操作（两端均含 light/dark）                                                                                                           |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| avatar        | xxs/xs/small/default/medium/large/xl、缺省尺寸、circle/square、颜色、图片、头像组与溢出、顶部/底部装饰、hover/focus、图片失败                                   |
| badge         | 六 type × solid/light/inverted；count/dot/overflow/string、自定义内容、四角、独立徽章                                                                           |
| card          | 默认/完整 cover/actions/footer、borderless、always/hover shadow、loading、grid group                                                                            |
| calendar      | week/day/month/range、周末、全天/时段事件、月份跨月格、更多入口/事件浮层                                                                                        |
| carousel      | slide/fade、dot/line/columnar、small/medium indicator、三 theme、always/hover arrow、single、切换后 active                                                      |
| collapse      | 多面板、accordion、disabled、左右/自定义图标、受控展开、切换后状态                                                                                              |
| collapsible   | open/closed、72px preview、140px adaptive、lazy 初次未挂载/打开后、动态内容增长                                                                                 |
| descriptions  | small/medium/large 双行、四 align、horizontal/vertical、span/hidden、Item/节点内容                                                                              |
| empty         | vertical/horizontal、light/dark illustration、无图、字符串图、SVG 对象、标题/描述/操作                                                                          |
| highlight     | 文本、自定义样式、regex、case、重叠匹配                                                                                                                         |
| image         | success/loading/error、单图/分组、预览首/末项箭头禁用、title/footer、切图、rotate                                                                               |
| cropper       | rectangle 八 handles、round 1:1 四 handles、拖动后状态                                                                                                          |
| list          | small/default/large × normal/empty/loading；vertical/horizontal/grid；header/footer、头像、正文与操作                                                           |
| overflow-list | end/start collapse、min visible、scroll render                                                                                                                  |
| scroll-list   | normal/wheel、多列、selected/disabled、时间单位、自定义 transform、点击切换后                                                                                   |
| table         | small/default/middle × normal/empty/loading/disabled/sort-filter；选中/半选、边框、行 hover；排序后、筛选打开/选中/过滤结果；展开行/三级树/分组/虚拟滚动/列伸缩 |
| tag           | small/default/large × light/solid/ghost；circle/rect、可关闭、group overflow、split、close hover/关闭                                                           |
| timeline      | left/right/center/alternate、success/warning/error/ongoing/default、自定义 color、extra、左右位置                                                               |
| progress      | small/default/large × normal/0/100，line/vertical/circle、info、warning、自定义渐变/宽度/linecap、50→80 更新后                                                  |
| skeleton      | avatar 七枚举值、circle/square、active/static、title/paragraph/button/image、loading/content                                                                    |
| spin          | small/middle/large、内置/自定义 indicator、tip、子内容遮罩、spinning false                                                                                      |

### 导航、反馈与复杂内容

| 组件 / 场景      | 实际查看的尺寸、可见状态与操作（两端均含 light/dark）                                                                                                                                                                  |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| anchor           | default/small；父子层级、disabled；rail/高亮                                                                                                                                                                           |
| back-top         | 缺省图标、自定义内容；隐藏/滚动后可见                                                                                                                                                                                  |
| breadcrumb       | compact/loose、三层、长文本折叠                                                                                                                                                                                        |
| pagination       | default/small、完整 total/quick jumper/page size、disabled、ellipsis                                                                                                                                                   |
| steps            | fill/default、basic/small、basic/vertical/error、nav；finish/process/wait/warning/error；fill/basic/nav 的 default与small，包含vertical error/warning；两模式均实际看                                                  |
| tabs             | small/medium/large × line/card/button/slash/left/more/collapsible 七例；disabled、active                                                                                                                               |
| tree             | 基本树、checkable、disabled/readonly、搜索、目录树                                                                                                                                                                     |
| navigation       | vertical/horizontal、展开/折叠、selected、disabled、header/footer                                                                                                                                                      |
| banner           | info/success/warning/danger；contained title/actions；关闭按钮                                                                                                                                                         |
| feedback         | emoji/text/radio/checkbox/custom × popup/modal；提交区                                                                                                                                                                 |
| notification     | info/success/warning/error × normal/light；标题、内容、close                                                                                                                                                           |
| toast            | info/success/warning/error × normal/light；close；另实际看 stack=true 重叠堆叠态                                                                                                                                       |
| popconfirm       | 常规/danger、箭头、确认/取消、底部浮层；另普通/danger的okButtonProps.loading=true                                                                                                                                      |
| popover          | 默认下方、custom蓝色右侧箭头；标题与内容                                                                                                                                                                               |
| user-guide       | popup 三步（default/primary/last）、modal；spotlight、遮罩、标题/描述/步骤按钮                                                                                                                                         |
| audio-player     | playlist/单曲 compact无toolbar；metadata后时间；light/dark组件theme；真实播放playing、浏览器MediaError错误禁用/刷新态已实际看双模式                                                                                    |
| video-player     | 720×405全控件与480×270 compact；固定poster/章节；两主题；真实播放playing、浏览器MediaError错误提示/图标态已实际看双模式                                                                                                |
| json-viewer      | 可编辑默认、readonly自定义token、固定两宽度；搜索/替换栏                                                                                                                                                               |
| code-highlight   | JS/lineNumber、CSS/plain、自定义markup；代码字体/行号/背景                                                                                                                                                             |
| hot-keys         | mac/windows 修饰键、组合键、键帽间距                                                                                                                                                                                   |
| ai-chat-input    | 有内容、真实empty placeholder、canSend=false、generating、round=false；引用/附件；已实际打开 suggestions 三项与template 面板，模板图标修后复拍                                                                         |
| ai-chat-dialogue | 三种mode、leftRight/leftAlign；completed、queued、in_progress、incomplete、failed、cancelled；selecting；编辑Input/保存取消、删除菜单与Modal确认双模式实看；另用真实默认Markdown renderer补看noBubble/userBubble两模式 |
| chat             | 三种mode、leftRight/leftAlign；默认真实Markdown strong/paragraph；complete/loading/incomplete/error；另用真实默认Markdown renderer补看noBubble/userBubble两模式                                                        |
| markdown-render  | heading、strong、link、inline code、list、table/pagination；light/dark                                                                                                                                                 |
| sidebar          | main/code/file；标题/选项、代码内容与折叠框、只读文件内容                                                                                                                                                              |
| dropdown         | 基本菜单、active/tick/disabled/danger/title/divider；打开与关闭                                                                                                                                                        |

### 结构与交互补齐

- Table：三尺寸与 normal / empty / loading / disabled / sort-filter；另实际展开/折叠行、三级树、字符串与节点分组标题、虚拟首/中/尾、真实拖列宽。结构最终 48 张两端图片逐对查看。
- Tree：真实拖节点的 gap-top / over / gap-bottom；异步 loadData pending 的旋转图标；虚拟列表三滚动位置。
- JsonViewer：大小写不敏感、大小写限制、正则、全词各选项的激活与结果高亮；真实不合法 JSON 的错误 token / 波浪线。固定默认行为没有额外错误弹窗，不虚构该状态。
- Sidebar：main / code / file；可编辑文件修改前后、工具栏激活与灰度、真实拖动 resize。样式重排后重新导航复拍。
- Steps small 的 fill / basic / nav，Toast stack，Popconfirm 普通 / danger 的 loading，AI 建议 / 模板 / 编辑 / 删除确认，Audio / Video playing / error 均补看，不能用默认页面推断这些分支。

### 证据与验证的区别

实际视觉记录和自动化回归分开保留。图片先打开查看，再归入覆盖表；错误选择器、离屏弹层、过渡中间帧和未解码图片不计作最终证据。动画按实际结束或布局稳定条件复拍，未加固定 sleep 制造通过。

本地原图和对照板位于 `test-results/ui-theme-review/{root,inputs,content,navigation}/`；各组 `coverage.md` 记录原始文件名、query 和操作。React URL 为 `/?scenario=<id>&theme=<light|dark>&direction=ltr&locale=zh-CN`；Vue 为 `/iframe.html?id=parity-<id>--scenario&viewMode=story&globals=theme:<light|dark>;direction:ltr;locale:zh-CN`，表中扩展分支由场景 query 提供。

正式生产回归首轮为 490 通过 / 9 失败，失败日志与原图保留在 `browser-production-first.log` 和 `production-first/`。其中发现真实 DatePicker 范围禁用差异、审查场景误给默认 Chat 设置 canSend，以及截图前真实滚动/悬停未结束、Modal 断言选错零布局 Portal 容器；逐项纠正实现或状态准备后重新运行，没有放宽像素阈值或更新旧快照。

生产构建后又实际打开 DatePicker 的 12 张完整页面：年月范围选中行居中、起止焦点对应的灰色禁用范围及 trigger / popup 间距在双模式一致；两端 trigger 底部为 271.796875px、弹层顶部为 276px。Chat 默认场景及真实默认 Markdown 各两模式也重新打开查看，空输入按钮均为灰色禁用态，段落、粗体和气泡文字匹配。这些观察独立于下面的测试结果。

提交前还发现 Tree 新包装层的数值高度没有转换为 px：固定 wrapper 始终 180px，Vue 初帧靠子内容撑起 180px，测量后却被 232px viewport 撑大；两端子 viewport 相同掩盖了包装层问题。现对数值补 px、字符串原样保留，并新增初始原生 style 单元回归与正式包装层 / viewport 双重断言。固定 AutoSizer 使用 entries[1] 的观察顺序保持原样，未改变基线算法。修正后生产产物顶部 / 中部 / 底部 × 深浅模式 × 两端共 12 张完整页面再次逐张实看，wrapper 180px、viewport 232px、父列表 248px，四相邻面板几何与可见内容一致；记录为 content/tree-wrapper-production.log 与对应 PNG。

### 自动化验证结果

- 正常生产构建 `pnpm test:browser`：499 项通过，3 workers、无重试；旧 7 项 Button/Modal 失败包含在内。最后 Tree 包装层修正后，正常配置重新构建并执行 `pnpm test:browser --grep 'Tree '`，7 项通过，含包装层 / viewport 和双模式对照。第一次 Tree 筛选错误使用开头锚点，未匹配含文件路径的完整测试名，仅构建成功、没有执行测试，不计为验收。
- 单元 / SSR：受影响组件首轮 37 文件 214 项、补充组件 13 文件 83 项；最后 DatePicker 2 文件 17 项、Tree 全目录 7 文件 42 项通过。各组有重叠，不相加冒充独立测试总数。排版 / 颜色相关 6 文件 164 项及实际 CSS 编译 / 级联脚本 2 文件 15 项通过。
- 公开包 JS、声明与两套主题 CSS 构建通过；主题产物校验通过，覆盖 83 个模块入口及全量主题。最后 Tree 修正后重新构建 UI 并验证 780 个无 DOM 公开入口及真实 Chat SSR 语义。
- 真实 tarball 排版 / 颜色消费者浏览器 16 项通过；复用已有外部运行依赖，未启用隔离安装。它验证公开主题消费，不声称覆盖每个组件。
- tools、UI、React 参考、Vue Storybook 类型检查，修改文件 ESLint / Prettier、源码边界、插槽调用检查及差异空白检查通过。Changesets 检查在新记录暂存后通过；第一次检查没有纳入未跟踪记录的失败未记为通过。

### 本轮边界

完成的是本次主题影响范围内上述真实页面、公开离散尺寸、可见状态与结构分支的视觉复核。未声称穷尽任意数值宽高、所有业务 slot / renderer / 数据量、所有语言时区、所有 props 的笛卡尔积；本轮人工逐图主体为桌面 LTR zh-CN，Grid / Layout 另看手机宽度。正式 RTL / en-US 和消费者测试用于防回归，不冒充这些组合的人工视觉验收。原生媒体 fullscreen / PiP、逐帧运动和完整辅助技术审计未作为已完成项目。构建已有的 eval / 大 chunk 提示保留。
