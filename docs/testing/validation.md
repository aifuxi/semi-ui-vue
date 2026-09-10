# 验证入口与范围

以用户目标和受影响契约决定范围。发布标准保持完整，日常反馈避免反复清理、构建和安装。

| 入口                                            | 验证内容                                                         | 何时使用                                 |
| ----------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------- |
| `pnpm check`                                    | 固定基线/生成漂移/源码边界、格式、lint、源码类型、单测、工具测试 | 日常集成；局部修改可先跑对应检查         |
| `pnpm check:docs`                               | 缓存校验后的公开包/资源、静态站、Nuxt 类型、内容与产物           | 文档或构建输入变化                       |
| `pnpm check:artifacts`                          | 一次准备公开包/文档，构建工作台；主题、SSR、tarball 消费         | 公开 API、样式、依赖、构建与发布脚本变化 |
| `pnpm check:full`                               | 日常检查、产物检查、组件与文档 Chromium 回归                     | 共享变更、全量审计                       |
| `pnpm release:check`                            | 依赖审计、全量回归、隔离 tarball 安装、发布元数据                | 发布前                                   |
| `pnpm test:coverage` / `pnpm test:coverage:all` | 相对 origin/master 变更文件 / 全量覆盖报告                       | 排查测试缺口，不作为统一 100% 阻断       |
| `pnpm --filter @workspace/docs check:links`     | 已构建静态站的正文、链接与锚点诊断                               | 文档链接审计；既有断链不自动扩展当前任务 |

`check` 不包括 Nuxt 类型与完整生产构建；需要这些证据时显式执行 `check:docs` 或 `check:artifacts`。`typecheck` 保留全 workspace 的独立准备语义，`typecheck:source` 用于避免日常检查隐式构建文档。`typecheck:clean` 只用于排查缓存或验证干净构建，会清理临时证据，不作为日常入口。

`build` 复用文档三阶段准备，再构建两个工作台，公开包和主题只由 resources 阶段准备一次。缓存按输入和输出内容校验；丢失或过期时重建，不提供跳过新鲜度检查的开关。`check:full` 在产物检查后直接运行文档测试，不再次构建文档站。独立 `test:browser:docs` 自行准备。

CSS 产物和安装包共用 `scripts/theme-contracts.json`；条目来自原主题与安装包断言的并集，源码 SCSS 导入及顺序仍由 `verify-theme.mjs` 校验。新增组件样式要求只维护一份。SSR 根据 package exports 枚举公开 JavaScript 入口，包含通配入口，缺失产物不能静默跳过。

日常 tarball 验证默认复用已安装的外部依赖以支持离线运行。`pnpm verify:pack-isolated` 或 `PACK_ISOLATED=1 pnpm check:artifacts` 使用独立临时 store，从官方 registry 解析依赖，不链接 workspace 的 Vue/运行时依赖，并启用严格 peer 校验。发布入口使用隔离模式；它验证打包消费，不会发布包。网络不可用时应明确记录未完成隔离验证，不能把离线结果称为干净消费环境验证。

测试工具变更运行 `pnpm test:tooling` 与相应 Rstest spec；需要验证筛选时使用 Playwright `--list`，不为更改计时、日志或诊断规则重跑页面矩阵。改变实际断言、环境或构建内容时才重验对应行为。历史 accepted 失效由账本自动反映，不改写旧报告；工具精简任务不以恢复所有历史 accepted 为完成条件。

单测配置位于 `rstest.config.ts`；默认 jsdom，Node 注解保留 SSR 模板编译。`test:coverage` 使用 V8 并统计相对 `origin/master` 的改动文件，`test:coverage:all` 统计完整包源码范围。当前 V8 provider 的版本锁定补丁修复 Vue 多编译模块的覆盖率合并，背景及移除条件见 [Rstack 迁移记录](../../ai-work/20260910-103000-rstack-migration.md#第四阶段单测迁移到-rstest)。

CI 的 PR 源码检查包含工具测试；相关构建输入变化时才执行产物检查。发布 job 在其独立环境验证将要发布的产物，因此不能直接借用另一 job 的未传递构建结果。视觉矩阵与阈值本轮保持不变；后续按实际耗时和故障证据决定是否收敛历史快照。
