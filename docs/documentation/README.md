# 文档站

文档应用使用 Nuxt Rspack builder、Nuxt Content 与全量预渲染，输出 `apps/docs/.output/public`。页面在 `apps/docs/src/pages`，正式双语内容在 `apps/docs/content`；可运行 Demo、源码和编辑初始内容来自同一组 SFC 文件。

## 开发与维护

`pnpm dev` 启动 `http://127.0.0.1:4321`；`pnpm check:docs` 联合准备资源、构建、类型和内容检查；`pnpm --filter @workspace/docs preview` 预览已有静态产物。工具版本与 IDE 见[工具链](../architecture/toolchain.md)。

| 工作                        | 入口                                       |
| --------------------------- | ------------------------------------------ |
| 示例补齐、修复、严格验收    | [文档流程](workflow.md)                    |
| 当前队列与下一批            | [批次计划](batch-plan.md)                  |
| 映射和当前有效验收          | [覆盖账本](coverage.json)                  |
| 双语映射与章节/API/迁移审阅 | [mappings](mappings/)                      |
| 正式批次范围、报告与指纹    | [batches](batches/)、[evidence](evidence/) |
| 页头与品牌适配              | [页头契约](site-header.md)                 |
| 稳定版剩余工作              | [发布审计](../release-audit-1.0.md)        |

映射、运行检查和严格验收分别计数。批次状态只在计划与账本维护；历史实施过程保留在 Git、对应验收记录与 `ai-work/`，不在本入口累计流水账。

## 静态部署契约

REPL/Monaco 按需加载，编译器、Vue、公开包、样式、Worker 和类型均从本站读取。编辑 iframe 使用不透明源，通过消息同步主题；部署需支持产物 `_headers` 中 `/repl/*` 的公开 CORS 规则，不携带凭据。

产物包含 canonical/hreflang、sitemap、404 与兼容重定向。部署主机需支持 `_redirects` 或配置等效 301；本地 preview 执行同一规则。文档站为静态站，不依赖分析追踪、外部搜索或核心 CDN。

构建记录固定上游版本、样式哈希、直接依赖及字体许可，并携带公开包的第三方声明/SBOM；`limitations` 中未完成的传递依赖审计仍需在发布前闭环。发布产物和实际线上可访问性分别验证，具体上线范围按任务执行。
