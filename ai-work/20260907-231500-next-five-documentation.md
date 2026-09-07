# AI 工作记录：接续五个组件双语示例补齐

- 日期：2026-09-07
- 状态：进行中

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

## 未完成事项

代表复验、其余示例、最终检查、静态运行、受影响历史证据重验和各批提交尚待执行。

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
