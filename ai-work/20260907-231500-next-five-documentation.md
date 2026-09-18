# AI 工作记录：接续五个组件双语示例补齐

- 日期：2026-09-07
- 状态：完成

## 目标与验收

依队列完成 CodeHighlight 3、JsonViewer 6、MarkdownRender 4、AudioPlayer 3、VideoPlayer 10 项双语示例。每个组件独立提交；代表路径先通过，再扩展其余示例，最终静态站逐项操作、源码/重置与适用编辑器运行。补齐线不新增 accepted。

## 基线与范围

初始工作区干净；vendor 为 v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21。CodeGraph 索引就绪，query 指定当前绝对路径，结合文本搜索核查注册与公开子路径依赖。首次 affected plan 的六批历史证据均有效。

## CodeHighlight 代表与边界

只先实现双语 Basic（索引1）与 Vala（索引3），每例一个仅展示代码文本的小型 SFC，无需拆分子组件。已读取固定 Adapter、Foundation、SCSS、默认主题、双语文档及现有 alignment.md；无图标依赖。保留上游示例的展示代码文本（包括非执行文本中的引号拼写），不把代码示例改写成可执行 React。

- Basic：真实 Prism token、行号、安全文本展示、源码与重置。
- Vala：额外语法加载、token、行号，以及双语在线编辑与运行。
- 代表 ESLint/Prettier 通过。开发资源准备命中缓存。
- 交互浏览器复现 Vala 文档页加载成功，但 REPL 显示 Failed to resolve module specifier prismjs/components/prism-vala.js。需增加本地映射及 Prism 许可清单；不引入新版本，不复制到源码独立修改。

## 进度

五个组件共26项双语示例完成，最终静态操作与受影响历史矩阵通过；每个组件独立提交。

## CodeHighlight 实施与静态验证

- 最终三个索引为 1 Basic / 2 Css / 3 Vala，双语顺序相同。原 Example1 保留为 Vue 补充示例。新增映射，不新增严格验收 spec。
- REPL 将已锁定 Prism 1.30.0 的 Vala 语法文件原样复制到生成资源，并映射 bare import；CodeHighlight 初始化 Prism 后加载该扩展。Prism 已是根开发依赖和组件依赖，本次没有升级依赖。静态 notices 同步增加 Prism MIT 归属；产物摘要包含语法文件散列。
- `representatives-fixed` 的首次烟测定位属性误写成 data-demo；依据实际 DOM 的 data-demo-id 修正。`representatives-locators` 全部操作断言通过，但 REPL sandbox 警告尚未分类，该次仍记为失败。
- `representatives-passed/summary.json` 双语各5阶段通过；开发态 NUXT_E7002 预取提示与精确 sandbox 警告保存到 warnings 文件。共享 runner 继续只按已有规则处理 Volar/开发 worker 提示，不忽略其他错误。
- 代表通过后才新增 Css 并注册映射。全批 ESLint/Prettier、check:content 通过。
- `pnpm --filter @workspace/docs check` 退出0：64项流程测试通过，196页、1613个注册Demo、5894个静态产物，Nuxt类型、内容、REPL、许可与散列门禁通过。日志 `/tmp/semi-code-check.log`。
- `full-static/summary.json` 双语各7阶段通过：三个示例逐项token/行号/源码/重置，并在真实 Monaco 编辑 SFC 增加 data-edited 属性后运行、验证iframe内新属性及token。没有未分类issues，两份 warnings 均为空。已查看英文Vala局部截图。
- 基础运行证据在 `apps/docs/.data/documentation-smoke/code-highlight/`；Chromium 151.0.7922.34、1440×900、DPR1、light、独立双语context，无模拟时钟。
- 共享脚本导致六批历史证据失效，已启动一次完整 affected 验收（224用例）。验收期间 JsonViewer 草稿仅暂存临时目录，不更新文档注册或任何构建产物；本轮采样始终消费 CodeHighlight 最终静态产物。

CodeHighlight 收尾：`accept:nuxt:batch --affected` 退出0，224/224通过、无重试或跳过，六批历史正式证据已重新生成，统计为785/859映射、43/859有效验收。代码、主题、Foundation和包导出未修改，因此不额外运行组件发布包门禁；共享REPL变更由最终静态运行、资源门禁与受影响完整矩阵验证。剩余四批继续按队列执行。

## JsonViewer 代表与范围

按固定 Adapter/公开类型、Foundation/core、SCSS、主题与双语文档及现有 alignment.md 核查，选择 Basic（1）、CustomRender（5）、CustomSearch（6）双语代表。基础例验证非受控编辑与搜索；自定义渲染验证只读、Rating/Tag、hover文本和图片；搜索按钮验证slot提供的defaultSearchButton与controls切换、查找替换、关闭重开。英文通过完整ConfigProvider locale数据提供搜索文案。

每例一个小型SFC；customRenderRule要求返回任意VNode，因此仅该回调使用范围受限的h()；搜索slot里的任意默认VNode通过局部函数组件渲染。其他结构保持模板。图片复用已有photo.svg，并将URL匹配规则改为本地/demos路径；后续严格验收需对齐双侧素材。六个固定索引双语顺序一致，无多文件上游依赖。

JsonViewer 代表失败证据：`representatives/summary.json` 双语 Basic 替换后 `.lines-content` 消失；`replace-probe.mjs` 读取到 DemoBlock 捕获的 notifyChangeModelContent 异常。Worker探针显示多个真实Worker收到 init/foldRange/validate却未返回；公开dist实际 inline代码为 `rt = ""`。根因是固定core sideEffects:false裁掉顶层消息处理器。现有静态React/Vue工作台已通过scripts/parity-build-runtime.mjs保留该入口，公开UI包缺失规则。本次在Foundation构建插件导出精确入口保留规则，并接入公开包worker.plugins；新增上游源码仍仅从固定vendor编译，既有core MIT归属和SBOM来源不变，由构建重新生成产物许可证据。

JsonViewer 收尾验证：

- 代表 `representatives-worker/summary.json` 与扩展 `full-dev/summary.json` 双语均通过，之后仅完善公开 Worker 构建隔离及 tarball 门禁。首次准备期间修改了验证脚本，缓存按设计拒绝保存；稳定后重新执行最终联合检查，未复用失败准备。
- 独立 Worker 构建将固定 `common/worker.ts` 的环境判断固定为 true，并排除该环境永远不会调用的嵌套 Worker manager 模板；保留原 init/update/format/fold/validate 协议，不改 vendor。最初只有保留入口时仍携带 `%WORKER_RAW%`，已由原发布门禁发现并消除。
- 新构建测试实际编译 pinned Worker 并验证 init/format/foldRange/validate 四个响应及无模板残留，1/1通过；JsonViewer 公开行为/SSR与 manager 隔离测试10/10通过；既有 Chromium 组件矩阵5/5通过。
- `pnpm verify:pack-dist` 退出0：五个真实 tarball 安装、exports、ESM、类型、样式、SSR import，以及新加的真实浏览器搜索替换全部通过。pack 辅助脚本修正 Vite 多输出格式返回值后通过；未放松原门禁。日志 `/tmp/semi-json-pack.log`。
- 本批 ESLint 通过。UI全包typecheck失败：未改动的Transfer.vue:375与TransferNodeRenderer.ts:33存在VNodeChild/RawChildren重载不匹配；记录为本次范围外已有问题，不宣称该检查通过。日志 `/tmp/semi-json-ui-types.log`。
- 最终 `pnpm --filter @workspace/docs check` 退出0：64流程测试、196页、1625 Demo、5918静态产物，Nuxt类型与内容/资源/许可检查通过。日志 `/tmp/semi-json-check.log`。
- 最终 `full-static/summary.json` 双语逐项通过6例加载、主要操作、源码/重置，三个代表在线运行，Basic还在Monaco实际修改SFC后运行。issues为空，已查看CustomRender英文截图。证据目录 `apps/docs/.data/documentation-smoke/json-viewer/`。
- 本次构建集成修改使六批历史证据失效，随后集中重验受影响矩阵；本批只增加映射，不增加accepted。

JsonViewer 历史证据重验完成：224/224通过，5.9分钟，无重试或跳过；六批证据刷新，覆盖791/859，有效严格验收仍43/859。日志 `/tmp/semi-json-affected.log`。本组件单独提交后继续下批。

## MarkdownRender 代表

已依固定 Adapter/components、Foundation、SCSS、主题、双语文档与alignment核查4项。先实现PureMarkdown（3）与CustomComponent（4）：分别验证无需转义的md文本，以及多文件Vue自定义按钮的slot、emits、MDX事件和alert。两个子组件PrimaryHeading/MarkdownButton只承担元素渲染，主例保留原始Markdown文案；后续再扩展基本富文本和h2颜色差异。

MarkdownRender 双语代表和全批开发检查均通过。新增Basic的HMR源码映射为空，重启开发服务后定点验证恢复；初版烟测把表头计为数据行，依据真实tbody收窄定位后四行断言通过，中文额外删除线按固定正文计为2处。完整结果在 `apps/docs/.data/documentation-smoke/markdown-render/full-dev-passed/summary.json`。本批ESLint及代表Nuxt类型通过。4项映射保留中英文原文、h2颜色差异，基础表格传完整Locale；使用自有photo.svg替换DSM远程图片并在双语文档注明。主例+元素子组件按SFC边界拆分，在线编辑器验证依赖文件与MDX点击事件。未修改组件与共享构建，不重复发布包验证。

MarkdownRender 收尾：联合check退出0，64流程测试、196页/1633注册Demo/5946产物，Nuxt类型和内容资源门禁通过。最终 `full-static-ready/summary.json` 双语各10阶段通过、issues为空；首次full-static因预览服务尚未监听连接被拒，确认监听后执行，未改源码或重建。静态编辑器修改md文本与重跑MDX按钮均正常，已查看英文局部截图。affected检查六批均有效并跳过，覆盖795/859、accepted43不变。日志 `/tmp/semi-md-check.log`、`/tmp/semi-md-affected.log`。

## AudioPlayer 代表

已依固定Adapter/公开类型、Foundation、SCSS、主题、双语文档及现有alignment核查3项。先Basic（1）和NoToolbar（2）双语：四种audioUrl输入，真实播放暂停、曲目切换、菜单关闭重开、音量和源码/在线编辑；紧凑例保留显式false工具栏。每例一个模板SFC，无需额外子组件。素材使用已有4秒tone.wav和one/two.svg，标题遵循中英文原文，ConfigProvider传完整Locale。

AudioPlayer 代表初次失败于Basic在线预览：iframe x=810，而播放按钮x=678，固定控件宽度在窄视口居中溢出到左侧。Basic外层增加横向滚动，每个桌面场景min-width:1000px；不改组件，并在双语文档/映射说明。实际iframe按钮x=920.5后真实点击通过，`representatives-fixed`双语全部通过才扩展Theme。完整开发检查初次英文Theme切回太快取消two.svg，定点改为先确认封面complete/naturalWidth再继续切换；不忽略requestfailed。`theme-probe`和`full-dev-passed`通过，三个示例的播放、暂停、切曲、主题/工具栏、速率/音量、源码重置、在线SFC修改运行均有证据。代表Nuxt类型和本批ESLint通过。无组件/共享设施变更，采用文档门禁，不重复tarball。

AudioPlayer 视觉复核补充：900px在文档正文中仍有右侧溢出，尝试850px导致完整播放列表的上一曲在iframe中不可点击。停止尚未完成的首次check，最终采用1000px完整桌面场景+外层横向滚动，并记录与上游示例容器的适配差异。`full-dev-final`双语全部通过；这不改变组件API/样式源码，也不声称精细视觉对齐。最终静态检查还验证横向滚动后的刷新按钮可点击。

AudioPlayer 收尾：最终check退出0，64流程测试、196页、1639注册Demo、5958静态产物，Nuxt类型与内容/许可/资源门禁通过。修正mapping的上游路径大小写为plus/audioPlayer（映射不属于静态构建输入），prepare-coverage验证798/859。`full-static/summary.json`双语各9阶段通过、issues为空，确认刷新按钮可随容器横向滚动点击。历史六批证据有效全部跳过；accepted43不变。日志 `/tmp/semi-audio-check-final.log`、`/tmp/semi-audio-affected.log`。

## VideoPlayer 代表

固定Adapter/公开ref、Foundation、SCSS、主题、双语文档与alignment核查10项。先实现Basic（1）、Quality（7）、RefControl（10）双语：真实播放暂停，清晰度源更新和菜单重开，公开element对两个video同步控制，以及在线运行。每例模板SFC，双播放器共享的按钮回调属于单一用例，无需拆分。复用约4秒motion.webm和poster.svg，清晰度以不同查询URL演示源切换，不声称实际分辨率变化。完整Locale数据传入。

VideoPlayer 代表通过后扩展10项：Basic/Controls/Loop/Seek/Rate/Muted/Quality/Markers/Theme/RefControl。完整dev结果 `full-dev-passed/summary.json` 双语通过；未篡改duration/currentTime媒体属性，循环通过真实进度条接近片尾后观察继续播放验证。视频约4.047秒，章节按0/0.7/1.7/2.7秒放入短片，保留双语标题；seekTime仍5/10/15，验证原生边界夹紧。完整Locale、媒体/封面替换和质量URL说明已加入映射与双语文档。

烟测定位修正均保留失败摘要：REPL清晰度菜单在进入动画时点击会关闭，先确认trigger在iframe视口内，再等待祖先CSS动画完成后点击，未关闭动效；主题class在内部wrapper；固定Foundation静音通过video.volume=0实现，不写video.muted；Select实际option名含tick图标，依据DOM用10s后缀匹配。上述路径先定点验证再回归全批。代表/扩展Nuxt类型与ESLint通过，已查看英文双播放器局部截图。

RefControl实际运行确认Vue公开实例自动解包expose中的ref，因此同步修复双语迁移表与docs/components/video-player/react-to-vue.md中的旧element.value示例，改为player.value?.element?.pause()并让useTemplateRef推断类型。未改组件/共享设施或新增第三方资产，本批不重复发布包验证。

## VideoPlayer 静态预览 Range 修复与收尾验证

首次静态键盘跳转失败，原生事件探针确认readyState=4但seekable=[0,0]，不是片尾重置。静态预览未提供Content-Length和HTTP Range；加入static-file-response.mjs，以200/206/416响应完整、首段、开放结束、后缀及非法范围，HEAD不发送body并忽略Range。3个协议测试覆盖这些边界。修复后同一视频seekable=[0,4.047554]，ArrowRight真实跳到4.047554，双语定点回归通过。新增的是开发/验收预览服务能力，不修改组件或发布包。

静态整批检查还修正了时序：选择器option可访问名含tick；先等待listbox卸载，再聚焦播放器；等待timeupdate反映的00:04/00:04与原生seeking结束，再发下一按键。初次请求取消保留失败摘要；浏览器媒体请求对同URL作Range加载时会出现ERR_ABORTED，单独记录media-readiness文件，只有准确URL/阶段、成功206和全部相关媒体readyState=4、无error、完整seekable的证据齐全才分类为非阻断取消。音频额外限定resourceType=media，包含Basic-editor四个媒体都已实际就绪的情况；不忽略其它请求、控制台或页面错误，共享runner未改。

- `pnpm --filter @workspace/docs check` 最初最终站点通过：64流程测试、196页、1659注册Demo、5998产物及Nuxt类型/内容/许可门禁。Range修复后的联合check再次退出0，67流程测试通过，resources/site/checks经指纹检查全部复用；预览脚本不是构建输入，因此不无谓重建。
- `full-static-final/summary.json` 双语各23阶段通过，运行错误为空；真实循环、键盘seek、章节、静音、速率、质量切换、ref与三个代表REPL均通过。
- 共享预览影响的AudioPlayer `full-static-range-verified/summary.json` 双语各9阶段通过，运行错误为空；原生媒体取消与就绪证据单独存档。
- 代码/示例ESLint、3个Range协议测试通过。日志 `/tmp/semi-video-check-range.log`、`/tmp/semi-video-static-final.log`、`/tmp/semi-audio-range-verified.log`。没有更改公共包，因此不重复此前已通过的真实tarball验证。
- 预览协议是六批正式验收的共享输入，需刷新全部历史证据；在此次矩阵结束前冻结相关源码及产物。

## 全站资源预取回归

历史224项矩阵发现net::ERR_INSUFFICIENT_RESOURCES，停止该次运行并将日志、trace、截图归档至video-player/historical-range-failure。trace中4894个请求、549个失败均指向脚本预取，静态HTML实际含4026条prefetch提示。新增双语navigation-loading回归准确复现；仅关闭NuxtLink预取仍失败，因为SSR也从共享文档路由的动态导入生成整站提示。依据已安装Nuxt 4.5.2的build:manifest hook及vue-bundle-renderer 2.3.2的prefetch过滤逻辑，将清单entry.prefetch设为false，同时关闭链接自动预取；保留preload、SSR hydration和点击导航/示例按需导入。没有忽略浏览器资源错误、降低worker数或增加重试。

清单修复后静态HTML预取0条、modulepreload仍58条；最终check通过67流程测试、196页/1659 Demo/5998产物及Nuxt类型门禁。CI三项导航/此前失败Button回归3/3通过，无重试。全五批统一静态复验发现既有Volar emmet/pug提示异步到达后续非editor阶段；所有示例操作通过，但共享runner依阶段分类使摘要失败。局部烟测仅在已有成功editor阶段时单独保存精确匹配的这两条已知web不支持提示，不修改共享runner或忽略其它警告。

最终共享设施静态复验：五批full-static-manifest-verified摘要均通过；CodeHighlight/JsonViewer/MarkdownRender/AudioPlayer/VideoPlayer每种语言分别7/16/10/9/23阶段，共130阶段，未分类issues为空。所有已知Volar与媒体取消证据独立保存。最终源码ESLint/Prettier检查通过。日志分别为/tmp/semi-verified-<component>.log；新导航回归为/tmp/semi-video-manifest-regression.log。

## 最终交付

CI模式历史矩阵224/224通过（4.5分钟），无重试或跳过；六批正式证据刷新，覆盖808/859、accepted43/859。README与队列同步更新，剩余51项，下一批Lottie4项随后Chat。日志/tmp/semi-video-affected-final.log；已验证内容未为提交重复检查。vendor仍为固定v2.102.0提交且未修改。

本轮解决Vala在线模块缺失、JsonViewer发布包Worker初始化、VideoPlayer公开ref文档、静态媒体Range以及SSR/导航整站预取问题。五批均有双语静态运行证据；JsonViewer实际发布包安装和Worker浏览器验证通过。范围外已知限制仍为Transfer两处全包类型错误；不宣称全仓库typecheck通过，也不将新增映射计为严格视觉验收。

前四批提交：e8f89b6、65a4369、a26dffc、9cdf071。第五批包含VideoPlayer示例、共享预览/资源加载修复、回归与全部必要进度/证据。
