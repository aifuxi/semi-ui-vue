# AI 工作记录：Icon 示例补齐与严格视觉验收

- 日期：2026-09-06
- 状态：历史负向验收记录；用户随后已确认应用，修复与有效证据见 [后续记录](20260906-101246-icon-fill-acceptance.md)

## 目标

继续既定文档批次顺序，补齐 Icon 8 项上游示例的双语映射并形成有效严格证据，Icon 验收闭合后，下一批为 ConfigProvider 3 项。

## 验收标准

- 固定 v2.102.0 React 文档直接编译；zh-CN/en-US × light/dark 以及 RotateSpin/Colors/Multicolor/Custom RTL，共 48 条。
- 样式精确比较、几何 <=0.5 CSS px、每个图标单独截图（threshold=0.1、maxDiffPixelRatio=0.001）、动效 0/150/300ms、ARIA 与在线编辑。
- 完整批次命令构建、类型、内容、浏览器全部通过且源码指纹一致，才生成证据。

## 风险与假设

- 不改变公开运行时 API、依赖与共享主题，不修改 vendor，不部署、不自动提交。
- 扩展参考文档加载器及 Icon API 元数据会使 Button 指纹失效，必须重跑 Button，不能沿用旧计数。

## 修改范围

- Icon 双语示例、内容、API、映射、批次与浏览器 spec；固定 React 参考编译入口；归属与进度记录。

## 关键决策与权衡

- 每个独立示例使用小型 SFC，自定义 SVG 子组件作为可编辑依赖；保留双语上游 SVG 属性差别。
- Icon 专项 SVG 颜色、动画和 ARIA 断言放在自身 spec，不扩大通用比较器。
- 参考加载器保留 Button 入口，新增 Icon 按需入口；上游匿名箭头转为 ESM 导出，不维护第二份 React 场景。
- 自定义 SVG 与文档适配的 MIT 来源、文件哈希随站点 licenses 发布，既有 artifacts.json 覆盖生成产物。
- 回退可恢复本任务相关变更集，无数据迁移。

## 验证证据

- 基线 tag/SHA、Node.js v24.18.0 与 pnpm 11.19.0 已核验，开始时工作区干净。
- `pnpm --filter @workspace/docs build`：公开包、主题、Nuxt 静态构建通过，196 页。
- `pnpm --filter @workspace/docs exec nuxt typecheck`、`pnpm typecheck:root`、参考应用 typecheck、源码边界与定向 ESLint 通过。
- `pnpm --filter @workspace/docs check:nuxt:evidence`：10 项通过。
- 初轮误复用已有 Nuxt dev（PID 75965），参考字体请求被 CORS 拒绝，整轮失败。记录后暂时停止该开发服务，全部后续浏览器命令使用 DOCS_ACCEPTANCE=1，不复用服务；结束后恢复开发服务。
- Sizes 的 MinusCircle 20px 局部截图有 8 个差异像素。SVG outerHTML、计算样式关键项与屏幕坐标一致；改为整数坐标未解决，已撤掉此实验。匹配参考页与 Nuxt 的文档高度和 scrollY 后，35 个图标局部截图通过。最终保留滚动环境对齐与逐图标坐标附件。
- 上游中文 Custom 的 React maskType 警告按精确内容单独记录，要求仅该参考用例恰好一次；其它控制台错误继续失败。
- 多色 SVG 引用随机 id，测试验证 paint server 存在并按 SVG 内定义序号比较，保留 stop 计算颜色检查和无 mask 截图。
- 回归补丁负向单测：`pnpm exec vitest run packages/icons/src/Icon.test.ts`，2 失败、7 通过；2 色/3 色填充错误均复现。补丁保存于 `ai-work/20260906-095242-icon-fill-fix.patch`（同时保留 `/tmp/icon-fill-fix.patch`），包含最小运行时条件修正和 DOM/SSR/prop 更新回归；等待人工确认，未应用到组件源码。

## 未验证事项与剩余风险

- 全量 859 项验收仍按批次推进；本轮未改变组件运行时或全局主题，未执行全仓浏览器回归、全仓 pnpm check、tarball 重验或发布。
- 唯一未关闭的 Icon 视觉缺陷为短 fill 调色板顺序；候选修复尚未获人工确认，因此未应用，不生成 Icon accepted 证据。

- 最终 Icon 完整浏览器矩阵（不重试）：40 通过、8 失败，失败均为 Multicolor 双语/明暗/RTL 的 stop-color 顺序。诊断报告保存为 `ai-work/20260906-095242-icon-matrix.report.json.gz`；这是失败报告，不是 accepted 证据。

## 最终交付核验

- CustomSvg 补齐仓库要求的 script setup，16 个主示例显式引入 icon.css；每个示例可连同样式入口复制。18 个示例源文件的 MIT 归属和哈希一致。
- 首次 Button 正式批次被 CustomSvg 缺少 script setup 的内容门禁拒绝，未写入证据。补齐后 `pnpm --filter @workspace/docs check:content` 通过（196 页、1466 个 Demo）。
- `pnpm --filter @workspace/docs accept:nuxt:batch button` 最终通过：公开包/主题/Nuxt 构建、类型、内容和 Chromium 84/84；重新生成有效证据。覆盖为 704/859 已映射、17/859 已验收。
- 最终 Icon Chromium 48 条：40 通过、8 失败、0 跳过、0 flaky、无重试；失败全部为 Multicolor 的双语/明暗/RTL stop-color 顺序。诊断运行前后源码指纹一致：`81f5024ff67647cafc87622fa483655e5898ca9221ee821efa32dc5b5b488398`。
- 最终失败报告 SHA-256：`815a2dcdbe77c32b3c181c32bf95b11a55da9415338c757c9faf2bb4501c960d`，保存在同目录 `20260906-095242-icon-matrix.report.json.gz`。不作为 accepted 证据。
- `pnpm --filter @workspace/docs check:dist` 通过：196 页、搜索、历史入口、本地 REPL、许可和产物哈希。
- 未应用候选补丁时，既有 `packages/icons/src/Icon.test.ts` 6/6 通过；新增失败回归仅保留在待确认 patch。
- 定向 ESLint、Prettier、git diff --check 通过；vendor 无修改；未暂存、未提交。
- 浏览器验收服务已清理，恢复原 `pnpm --filter @workspace/docs exec nuxt dev --port 4321 --host 127.0.0.1` 开发服务。
