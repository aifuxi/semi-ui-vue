# Nuxt 文档迁移记录

状态：框架已统一为 Nuxt；内容覆盖与视觉对齐仍在实施中。

## 已实现

- Nuxt 4.5.2、Nuxt Content 3.16.0、SSR 与全量预渲染；当前 198 页双语内容。
- 独立品牌页头、分组导航、正文与目录、API/Token 表、前后篇导航、本地搜索、语言与主题切换。
- 1761 个已注册 SFC Demo，运行、源码与编辑初始内容来自同一文件；支持示例目录中的多文件依赖。
- Vue REPL 4.7.2 和 Monaco 按需加载；Vue、编译器、公共包、样式、Worker 与类型入口均从本站加载。
- 编辑 iframe 使用不透明源，无法读取文档页面 DOM；通过消息同步主题。复制、运行、重置、编译/运行错误恢复及卸载有浏览器检查。
- 本地图片、音视频与上传模拟。示例不会向真实上传服务发送文件。
- canonical/hreflang、sitemap、404 与历史大小写入口；上游样式通过只读构建适配器编译。

## 运行与验证

使用 Node.js 24.18.0、仓库锁定的 pnpm 与 Playwright Chromium。日常示例工作先按[示例验收流程](./workflow.md)选择范围；独立命令自行准备资源，联合检查优先使用 `pnpm --filter @workspace/docs check`：

```bash
pnpm --filter @workspace/docs build
pnpm --filter @workspace/docs preview
pnpm --filter @workspace/docs typecheck
pnpm --filter @workspace/docs check:content
pnpm --filter @workspace/docs test:nuxt
```

清理构建产物使用 `pnpm --filter @workspace/docs run clean`（显式 `run` 避免与 pnpm 内建命令冲突）。

预览为 `http://127.0.0.1:4321/`，静态输出为 `apps/docs/.output/public`。默认 `dev`、`build`、`preview`、`typecheck`、`check` 与浏览器测试均使用 Nuxt；页面位于 `src/pages`，正式内容位于 `content`。原 `:nuxt` 命令保留为同一实现的别名。开发、构建和类型检查会先构建公开包并准备站点资源；`check:content` 刷新内容注册表，并检查构建生成的本地 REPL import map。`check:nuxt:coverage` 会在全量验收缺失时失败，不可用结构检查结果代替它。

部署端需要为 `/repl/*` 设置 `Access-Control-Allow-Origin: *`，使不透明源 iframe 可以读取公开演示模块；产物包含 `_headers`。这仅开放公共静态演示资源，不携带凭据。区分大小写的构建环境会输出独立兼容 HTML；不区分大小写的文件系统通过 `_redirects` 保留兼容规则，部署主机需支持这些规则或配置等效 301。预览脚本执行同一重定向规则。

## 覆盖与剩余工作

[coverage.json](./coverage.json) 记录 102 组固定上游文档及每个中文 live Demo 的章节和源码行号。当前 859 个中文上游 Demo 中，748 个已建立双语内容与示例映射，有效严格验收为 43 个（Button 17 项、Icon 8 项、ConfigProvider 3 项、Locale 3 项、Dark Mode 2 项、Navigation 10 项，分别通过 84 条、48 条、16 条、16 条、8 条和 52 条双语/明暗/适用 RTL 用例）。Icon 短 fill 调色板顺序缺陷已修复，并通过全仓 Chromium 与真实发布包回归。此前补齐 Form（39）、Table（37）、Upload（42）、TreeSelect（19）、Tree（27），共新增 164 个上游 Demo 的双语映射。中英文上游章节数量与顺序不同的条目已在各组件 mapping 中注明；映射数量不代表逐项视觉验收完成。总数 859 来自固定源码的 live Demo 解析，修正了旧统计遗漏的 4 个示例。

补齐与严格验收按 [双线计划](./batch-plan.md) 独立推进，不再要求同一批同时完成：

| 工作线             | 当前统计                                                     | 下一批                                      |
| ------------------ | ------------------------------------------------------------ | ------------------------------------------- |
| 双语示例补齐       | 748/859 已映射，111 项待映射                                 | Notification 8 项 → Toast 9 项              |
| 严格视觉与行为验收 | 43/859 有效验收，705 项已映射待验收；另有 111 项待补齐后入队 | Divider 2 项 → FloatButton 7 项 → Grid 7 项 |

映射计数不追认为全部通过统一运行检查；后续补齐批次须提供内容、类型及实际站点加载运行证据，但无需等待严格矩阵即可交付。验收线独立处理已补齐示例；最终所有示例仍须严格验收，证据仍随真实依赖变化失效。完成标准与命令见 [工作流](./workflow.md)。

OverflowList 四项双语映射与八个独立 SFC 已补齐。文档联合检查通过；八个示例均实际检查了加载、宽度调整/恢复、重置、源码和编辑器修改运行。collapse 缩窄后的 `+N` 标签及 scroll 两端计数未同步更新，列为待对齐问题，不视为 accepted deviation。本轮不执行严格验收，43 项有效验收不变，详见 [OverflowList 补齐记录](../../ai-work/20260907-103119-overflow-list-documentation-content.md)。

ScrollList 一项双语示例已补齐三列 wheel、时段非循环、小时/分钟循环、禁用分钟与 `Ok` 日志。文档联合检查及中英文实际页面的选择、跨边界滚动、重置、源码、编辑器修改运行通过。随机分钟禁用改为固定交替序列，严格验收时须统一参考侧数据；编辑器 Emmet/Pug Web 支持警告保留记录，无页面异常或 console error。既有六批证据仍有效，详见 [ScrollList 补齐记录](../../ai-work/20260907-110551-scroll-list-documentation-content.md)。

Transfer 14 项双语映射、28 个自包含 SFC 已补齐，覆盖列表、分组、筛选、自定义项、禁用、分页、四种拖拽演示、头部/面板与树。全部示例通过主要操作、重置、源码与编辑器修改运行检查。修复 Transfer 自定义已选项的 drop 接收边界和函数式把手内容，英文 Demo 自包含 ConfigProvider；14 项单元/SSR、5 项组件 Chromium、真实 tarball 与 SSR import 通过。Locale 历史证据按实际依赖失效后，16 项正式矩阵重验通过；其它五批证据有效。本批仍为待严格验收，详见 [Transfer 补齐记录](../../ai-work/20260907-113702-transfer-documentation-content.md)。

Feedback 七项双语映射、14 个独立 SFC 已补齐，全部通过主要操作、重开、重置、源码与编辑器修改运行；双语两容器的四项独立时序检查通过。修复 SSR 退出动画后重开复用旧 VNode、Modal 动态 null footer 未隐藏的问题；69 项单元/SSR、15 项组件 Chromium 对照、真实 tarball 与 SSR import 通过。ConfigProvider、Locale 两批证据按实际依赖失效后，32 项正式矩阵全部重验通过；其它四批证据仍有效。REPL 的跨域自动聚焦限制与 Emmet/Pug 提示已记录，不阻断操作。本批仍待严格验收，详见 [Feedback 补齐记录](../../ai-work/20260907-161013-feedback-documentation-content.md)。

Locale 三个 live 示例已补齐双语映射并通过完整 16 项验收，包含语言菜单、日语消费者切换、文本展开、Modal、复制 Tooltip 和多文件编辑器。Pagination 的 LocaleProvider 消费、Table 空分页/ARIA、Typography 复制提示与 Select 菜单结构/焦点/滚动差异已修复；全仓 Chromium 442 项通过，既有三个批次已按当前源码刷新证据。详见 [Locale 工作记录](../../ai-work/20260906-150000-locale-documentation.md)。Dark Mode 两个示例也已完成双语映射与 8 项严格验收，覆盖全局/局部主题、Portal、键盘焦点、分页及多文件编辑器；修复 NavHeader 空节点、Navigation 语言消费、Tooltip 触发器焦点和分页切换后的焦点样式。本轮 61 项单元/SSR、442 项全仓 Chromium 及五批 172 项正式文档矩阵通过，证据已按最终源码刷新，详见 [Dark Mode 工作记录](../../ai-work/20260906-180000-dark-mode-documentation.md)。

Navigation 中文 10 个、英文 12 个 live 示例已补齐，52 项严格矩阵覆盖独立导航、水平/嵌套浮层、滚动、折叠恢复、键盘、RTL 和多文件编辑器。修复了折叠 DOM、图标插槽尺寸、嵌套菜单 class、Dropdown 焦点及 JsonViewer Worker 请求 ID 碰撞；42 项单元/SSR、442 项全仓 Chromium、六批 224 项正式文档矩阵和真实 tarball 验证通过，均无重试。详见 [Navigation 工作记录](../../ai-work/20260906-200000-navigation-documentation.md)。后续补齐线与验收线的下一批分别以上表为准。

尚需完成：其余组件的完整章节与示例；所有 API 的统一元数据审阅；特殊内容与适用指南；中英文迁移段落校订；固定 React/Nuxt 同进程视觉、计算样式与几何对照；Nuxt/REPL 内部打包传递依赖的完整许可审计；全仓库完整门禁。框架替换与上述验收分开记录；不再保留旧框架或第二套用户文档。

当前 CSS 已使用固定上游站点源，但还未形成像素级验收结论。独立品牌、Vue 语法、移除外部平台功能是明确适配；Inter Bold 暂用固定源码内的 SemiBold 字体文件，需作为视觉差异继续处理。

## 分批验收

严格验收执行顺序见 [双线计划](./batch-plan.md)，不以补齐线清空为前提。已完成矩阵见 [Button 验收要求](./button-acceptance.md)、[Icon 验收要求](./icon-acceptance.md)与 [ConfigProvider 验收要求](./config-provider-acceptance.md)。严格验收批次的范围、语言/主题、RTL 专项和源码输入在 `batches/`；双语映射与章节/API/迁移审阅在 `mappings/`。补齐线可先交付映射和运行证据，不要求同时新增严格验收批次或报告；严格验收时仍须完成全部审阅。

```bash
pnpm --filter @workspace/docs accept:nuxt:batch button
pnpm --filter @workspace/docs check:nuxt:evidence
node apps/docs/scripts/prepare-coverage.mjs --batch=button
```

调试先运行 `pnpm --filter @workspace/docs diagnose:nuxt:batch <批次>`，自动选取双语、暗色及适用 RTL 代表用例；可用 `--grep` 定位问题或用 `--plan` 只看范围。诊断不写验收记录。

批次命令支持多个批次及 `--affected --plan`。有效批次直接跳过，其余批次共享一次公开 JS、主题和 Nuxt 静态构建，运行一次类型、内容和产物检查，再以一次 Playwright 调用共享服务、默认 3 个 worker 并行运行完整浏览器矩阵；每项用例仍在同一 Chromium 进程内对照 React/Vue，验收时不复用既有服务。准备阶段按源码和产物内容哈希复用，删除、篡改或失败会自动使缓存失效。全部通过且运行前后源码指纹不变，才写入 `evidence/<batch>.json` 与包含截图/样式附件的压缩 Playwright JSON 报告。重试通过、跳过、遗漏用例、全局错误和缺少附件均不能生成新记录。

覆盖生成器重新校验当前源码指纹、映射和报告哈希。失效的证据不计入 accepted 数量；批次门禁还要求对应章节/API/迁移审阅有效。其它未完成批次不阻塞当前批次，全量内容门禁继续要求所有适用文档完成。批次完成不能替代最终站点、许可和全仓验收。

批次指纹追踪 Demo 与文档外壳真实导入的 UI 源码，Foundation 按实际命名导出递归追踪；批次独立的 React 适配器仅影响对应批次，共享图标、主题和验收基础设施仍保守纳入。无关组件改动不触发重验，未知动态依赖会扩大范围。所有选定矩阵通过后统一刷新证据；后续添加独立 Demo 不会自动获得验收。详见[依赖与证据规则](./workflow.md)。

## 归属与回退

`prepare-assets.mjs` 输出固定源码版本与样式哈希；`prepare-notices.mjs` 随静态产物保留直接依赖、字体许可、公开包的 THIRD_PARTY_NOTICES/SBOM 及文件哈希。其 `limitations` 明示仍待完成的传递依赖审计。本地演示图片、音频和视频为本项目生成的固定测试资源。

本次未发布线上站点。回退应恢复同一迁移变更中的应用源码、脚本、工程配置与 lockfile；不要仅回退依赖清单而保留新内容管线。

文档验收性能实测：同一六批 224 项完整冷启动 17 分 49 秒 → 9 分 03 秒，减少 49.24%，全部一次通过；准备复用命令墙钟 9.5 秒（不运行浏览器）。REPL 图标根入口静态请求从 526 降至 21，全部 780 个 JS 入口受 200 请求预算约束。详见 [性能记录](../../ai-work/20260906-211800-documentation-performance.md)。
