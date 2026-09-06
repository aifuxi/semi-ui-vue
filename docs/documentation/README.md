# Nuxt 文档迁移记录

状态：框架已统一为 Nuxt；内容覆盖与视觉对齐仍在实施中。

## 已实现

- Nuxt 4.5.2、Nuxt Content 3.16.0、SSR 与全量预渲染；当前 196 页双语内容。
- 独立品牌页头、分组导航、正文与目录、API/Token 表、前后篇导航、本地搜索、语言与主题切换。
- 1466 个已注册 SFC Demo，运行、源码与编辑初始内容来自同一文件；支持示例目录中的多文件依赖。
- Vue REPL 4.7.2 和 Monaco 按需加载；Vue、编译器、公共包、样式、Worker 与类型入口均从本站加载。
- 编辑 iframe 使用不透明源，无法读取文档页面 DOM；通过消息同步主题。复制、运行、重置、编译/运行错误恢复及卸载有浏览器检查。
- 本地图片、音视频与上传模拟。示例不会向真实上传服务发送文件。
- canonical/hreflang、sitemap、404 与历史大小写入口；上游样式通过只读构建适配器编译。

## 运行与验证

使用 Node.js 24.18.0、仓库锁定的 pnpm 与 Playwright Chromium。先按仓库流程构建公开包，再运行：

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

[coverage.json](./coverage.json) 记录 102 组固定上游文档及每个中文 live Demo 的章节和源码行号。当前 859 个中文上游 Demo 中，707 个已建立双语内容与示例映射，有效严格验收为 28 个（Button 17 项、Icon 8 项、ConfigProvider 3 项，分别通过 84 条、48 条和 16 条双语/明暗/适用 RTL 用例）。Icon 短 fill 调色板顺序缺陷已修复，并通过全仓 Chromium 与真实发布包回归。此前补齐 Form（39）、Table（37）、Upload（42）、TreeSelect（19）、Tree（27），共新增 164 个上游 Demo 的双语映射。中英文上游章节数量与顺序不同的条目已在各组件 mapping 中注明；映射数量不代表逐项视觉验收完成。总数 859 来自固定源码的 live Demo 解析，修正了旧统计遗漏的 4 个示例。

尚需完成：其余组件的完整章节与示例；所有 API 的统一元数据审阅；特殊内容与适用指南；中英文迁移段落校订；固定 React/Nuxt 同进程视觉、计算样式与几何对照；Nuxt/REPL 内部打包传递依赖的完整许可审计；全仓库完整门禁。框架替换与上述验收分开记录；不再保留旧框架或第二套用户文档。

当前 CSS 已使用固定上游站点源，但还未形成像素级验收结论。独立品牌、Vue 语法、移除外部平台功能是明确适配；Inter Bold 暂用固定源码内的 SemiBold 字体文件，需作为视觉差异继续处理。

## 分批验收

执行顺序见 [批次计划](./batch-plan.md)，已完成矩阵见 [Button 验收要求](./button-acceptance.md)、[Icon 验收要求](./icon-acceptance.md)与 [ConfigProvider 验收要求](./config-provider-acceptance.md)。每个批次的范围、语言/主题、RTL 专项和源码输入在 `batches/`；双语映射与章节/API/迁移审阅在 `mappings/`。

```bash
pnpm --filter @workspace/docs accept:nuxt:batch button
pnpm --filter @workspace/docs check:nuxt:evidence
node apps/docs/scripts/prepare-coverage.mjs --batch=button
```

批次命令重新构建公开 JS、主题和 Nuxt 静态产物，运行类型、内容及完整浏览器矩阵；验收时不复用既有服务。全部通过且运行前后源码指纹不变，才写入 `evidence/<batch>.json` 与包含截图/样式附件的压缩 Playwright JSON 报告。重试通过、跳过、遗漏用例、全局错误和缺少附件均不能生成新记录。

覆盖生成器重新校验当前源码指纹、映射和报告哈希。失效的证据不计入 accepted 数量；批次门禁还要求对应章节/API/迁移审阅有效。其它未完成批次不阻塞当前批次，全量内容门禁继续要求所有适用文档完成。批次完成不能替代最终站点、许可和全仓验收。

为稳妥处理共享依赖，首批指纹包含 UI/图标源码及文档公共框架；这些输入变更可能使此前证据失效，届时应重跑对应批次。后续添加独立 Demo 不会因目录数量增加而自动获得验收。

## 归属与回退

`prepare-assets.mjs` 输出固定源码版本与样式哈希；`prepare-notices.mjs` 随静态产物保留直接依赖、字体许可、公开包的 THIRD_PARTY_NOTICES/SBOM 及文件哈希。其 `limitations` 明示仍待完成的传递依赖审计。本地演示图片、音频和视频为本项目生成的固定测试资源。

本次未发布线上站点。回退应恢复同一迁移变更中的应用源码、脚本、工程配置与 lockfile；不要仅回退依赖清单而保留新内容管线。
