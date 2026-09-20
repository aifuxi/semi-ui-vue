# 组件库文档站

`apps/docs` 是基于 [VitePress](https://vitepress.dev/) 的私有文档应用，用自定义主题复刻 Semi 官网外壳，
正文说明从只读基线 `vendor/semi-design/content` 在构建期生成。首版只交付结构、导航与组件使用说明：
不包含示例代码、不接入 `@vue/repl`、没有自动化测试，验收由人工 UI 走查完成。

## 常用命令

| 命令                                      | 用途                                                  |
| ----------------------------------------- | ----------------------------------------------------- |
| `pnpm docs:prepare`                       | 先构建公开包与主题包，生成产物依赖它们                |
| `pnpm docs:dev`                           | 生成站点内容并在 <http://127.0.0.1:4321> 启动开发服务 |
| `pnpm docs:build`                         | 生成站点内容并做一次生产构建，输出到 `apps/docs/dist` |
| `pnpm --filter @workspace/docs preview`   | 预览已构建的产物                                      |
| `pnpm --filter @workspace/docs typecheck` | 生成内容后做 `.vitepress` 主题类型检查                |

首次使用或更新了 `packages/**` 之后先执行一次 `pnpm docs:prepare`；`docs:dev` 与 `docs:build` 只做站点侧生成，
不会隐式重建公开包，避免每次启动都触发整库构建。

## 目录职责

| 路径                            | 职责                                                                        |
| ------------------------------- | --------------------------------------------------------------------------- |
| `.vitepress/config.ts`          | VitePress 站点配置：路由、Markdown 行为、外部样式与首帧主题脚本             |
| `.vitepress/theme/**`           | 自定义主题：Layout、头部、侧栏、页内目录、搜索、示例占位与站点样式          |
| `scripts/upstream-config.mjs`   | 收录规则、侧栏分组来源、基线版本读取                                        |
| `scripts/upstream-rewrites.mjs` | 上游包名、链接与 React 措辞改写表                                           |
| `scripts/vue-api-contracts.mjs` | 已人工核对页面的 Vue props、emits、slots、v-model、命令式方法与正文定向改写 |
| `scripts/prepare-assets.mjs`    | 编译基线站点 SCSS、复制字体与侧栏图标                                       |
| `scripts/prepare-content.mjs`   | 生成 Markdown 正文、导航数据、检索索引与来源清单                            |
| `overrides/**`                  | 手工维护页；同名路由优先于生成结果                                          |
| `assets/**`                     | 站点自有静态资源（当前为 favicon）                                          |

以下路径全部是生成产物，不进入 Git：`content/`、`cache/`、`dist/`、`.vitepress/theme/generated/`。

## 内容生成规则

- 收录范围：`packages/ui/src` 有对应目录的组件页，加上通用指南页白名单
  （introduction、getting-started、customize-theme、dark-mode、accessibility、internationalization、
  content-guidelines）。其余上游页面（`show/chart`、`ai/aiComponent`、`basic/tokens`、`start/mcp-skills`、
  `advanced/design-source`、`advanced/design-to-code`、`ecosystem/*`）首版不收录。
- 路由与官网一致：`/zh-CN/<上游目录>/<组件目录名>`，例如 `/zh-CN/basic/button`。
- 正文转换：代码块（含“如何引入”的 import）变成 `<DemoBlock />` 占位卡片；上游 MDX 专属组件与
  “设计变量 / 相关物料”章节整块丢弃；表格与段落里的行内 JSX 只保留文本。
- 链接：站内链接按 slug 归一到本站路由（上游存在 `/zh-CN/input/button` 这类历史路径）；无法归一的链接
  保留为上游官网绝对地址；`[联系我们]()` 这类空地址降级为纯文本。
- 改写：包名 `@douyinfe/semi-ui` → `@aifuxi/semi-ui-vue` 等，React 措辞按显式规则表替换；
  `{{` 会转义成 HTML 实体，避免被 Vue 模板当成插值。
- 组件页顶部额外补一行引入说明，写明本组件对应的 `@aifuxi/semi-ui-vue/<子路径>`。
- 每页页脚标注基线版本、commit 与上游源文件路径；完整改写与裁剪记录写入
  `.vitepress/theme/generated/sources.json`。

## 手工维护

需要偏离生成结果时，把同名文件放进 `overrides/`（例如 `overrides/zh-CN/start/getting-started.md`），
`prepare:content` 会先复制覆盖页再生成其余页面，并在导航与页脚来源里标记为手工页。

## 样式来源

站点外壳的 CSS 由 `prepare-assets` 从只读基线编译：`vendor/semi-design/src/styles/{layout,index,doc,docDemo}.scss`、
`PageAnchor/index.scss`，加上 `@douyinfe/semi-site-doc-style` 的正文排版。正文元素需要的 `md` / `gatsby-*`
class 由 `.vitepress/theme/markdown/prose-classes.ts` 在 markdown-it 渲染阶段补上，项目不复制上游 CSS。
组件自身的样式来自 `@aifuxi/semi-theme-default`，站点控件直接使用 `@aifuxi/semi-ui-vue`。

## 首版边界

- 不写示例代码、不接 REPL；`DemoBlock` 只渲染占位卡片，示例清单契约见
  `.vitepress/theme/demo/types.ts`。
- 只提供中文，路由保留 `/zh-CN/` 前缀；英文内容源已存在，后续按同一管线开启。
- Button、Input、Select、Form、Table、Modal、Tooltip、Upload、Tabs、Pagination、Navigation、Breadcrumb、
  Steps、Anchor、Dropdown、Popover、Toast、Notification、Checkbox、Radio、Switch、DatePicker、TimePicker、
  Tree、TreeSelect、Cascader、Avatar、Badge、Tag、Divider、Space、Highlight、CodeHighlight、BackTop、Icon、
  Lottie、Locale、MarkdownRender、Spin、Collapsible、Grid、ConfigProvider、HotKeys、Empty、AudioPlayer、
  Layout、Descriptions、Banner、Timeline、Skeleton、OverflowList、Progress、DragMove 共 53 个页面的 API 已按公开 Vue 类型校准；
  其余页面仍保留上游 API 表，生成时会明确标记契约状态。
- 上游 CDN 图片保留远程地址，自托管与离线资源留待后续版本。
- 不新增 CI 与部署配置，`base` 固定为 `/`。
