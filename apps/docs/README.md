# 组件库文档站

`apps/docs` 是基于 VitePress 的私有文档应用。92 个页面（其中 82 个组件页）、855 个可运行 Vue 示例与 200 个仅展示源码的示例均由本仓库维护。文档站构建只读取本地页面、示例与静态资源，不从 `vendor/semi-design` 生成内容。

## 常用命令

| 命令                                      | 用途                                                  |
| ----------------------------------------- | ----------------------------------------------------- |
| `pnpm docs:prepare`                       | 构建文档站使用的公开包与主题包                        |
| `pnpm docs:prepare:ui`                    | 只重建 UI 与主题包                                    |
| `pnpm docs:dev`                           | 生成本地索引并在 <http://127.0.0.1:4321> 启动开发服务 |
| `pnpm docs:build`                         | 生成本地索引并构建到 `apps/docs/dist`                 |
| `pnpm --filter @workspace/docs typecheck` | 检查文档主题及示例类型                                |
| `DOCS_EXAMPLE_TIER=t3 pnpm test:docs`     | 运行指定梯次的文档浏览器测试，支持 `t1` 至 `t5`       |

首次使用或修改 `packages/**` 后先运行 `pnpm docs:prepare`。此命令构建组件库，组件库的 Foundation 集成仍遵循仓库的固定基线契约；`docs:dev` 与 `docs:build` 只构建文档站，不隐式重建公开包。

## 编辑文档

- 直接编辑 `content/**/*.md`。每页的 `title`、`description`、`type`、`order` 和可选 `icon` 写在 frontmatter 中；页面路径即站点路由。首页为 `content/index.md`。
- 分类名称及侧栏顺序在 `data/categories.json` 中维护。`scripts/prepare-index.mjs` 从本地 Markdown 生成导航和搜索索引，并检查路由、分类、图标及示例引用。
- 可运行示例放在 `.vitepress/theme/demo/examples/`，文件名就是 `<DemoBlock id="…" kind="live" />` 的 ID；非运行示例源码在 `data/code-sources.json` 中维护。修改示例时保持 Markdown 引用与源码一致。
- 站点样式与字体位于 `content/public/site/`，侧栏图标位于 `content/public/doc-icons/`，其余演示资源位于 `content/public/demos/`。历史素材的来源与许可见 [第三方归属](THIRD_PARTY.md)。

`content/public/search-index.json`、`.vitepress/theme/generated/nav.json`、`cache/` 和 `dist/` 是可再生的忽略产物。`pnpm --filter @workspace/docs clean` 只清理这些产物，不删除正文或静态资源。

## 验收

执行 `pnpm docs:build`、`pnpm --filter @workspace/docs typecheck`，并按影响范围运行 `DOCS_EXAMPLE_TIER=t1` 至 `t5` 的 `pnpm test:docs`。测试固定使用 3 个 Playwright worker；结果位于已忽略的 `test-results/docs` 与 `playwright-report/docs`。
