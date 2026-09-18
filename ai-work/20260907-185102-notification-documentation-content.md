# AI 工作记录：Notification 双语示例补齐

- 日期：2026-09-07
- 状态：补齐线完成；Notification 八项严格文档验收未执行

## 目标与基线

按补齐队列完成 Notification 八项固定上游示例的双语实现、章节和逐项映射，并在实际文档站验证每个示例的主要操作、源码、重置和适用编辑器路径。本批只完成补齐线，不把基础 smoke 追认为严格视觉与行为验收。

- 开始时工作区干净；只读 vendor 实际核验为 `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21` / `v2.102.0`，未修改 vendor。
- 按本地 Notification React Adapter、Foundation/SCSS、默认主题、中英文文档与图标资源核对。两种语言均为同顺序八项 live 示例，无语言独有示例或多文件依赖。
- 代表路径选择 Basic（最简单：命令式挂载、3 秒自动关闭）和 Update（最高风险：同 id 原位更新、重启计时器、关闭动画完成后重开）。

## 修改范围

`apps/docs/src/demos/notification/{zh-CN,en-US}/` 将两个简化 `Example1` 替换为十六个独立 Vue SFC；更新双语正文、API、Accessibility、文案规范、Token、React→Vue 迁移表、逐项映射、生成注册表和覆盖账本。

| 上游索引 | SFC         | 主要契约                                    |
| -------- | ----------- | ------------------------------------------- |
| 1        | Basic       | `open`、title/content、3 秒自动关闭         |
| 2        | Position    | 两组 ButtonGroup、六种 placement            |
| 3        | Icons       | 四种默认状态图标、三种自定义图标            |
| 4        | Colored     | 四种状态与 `theme="light"`                  |
| 5        | Links       | `h()` 生成 Typography Text 链接 VNodeChild  |
| 6        | Delay       | 无标题正文、`duration: 10`                  |
| 7        | ManualClose | `duration: 0`、返回 id 队列、按顺序 `close` |
| 8        | Update      | 1 秒后复用 id 更新并将 duration 改为 10 秒  |

每个 SFC 只负责一项演示，无共享组件或 composable。ManualClose 使用 `shallowRef` 保存 id 队列；Update 记录并在卸载时清理未触发 timer，防止页面切换后写入全局通知。

## 差异与取舍

- 英文上游前两项分别将 `duration` / `position` 误写为 `with` / `Position`；Vue 示例使用真实公开 API，双语正文和映射保留说明。
- 按仓库独立品牌约束，Bytedance 文案替换为 AIFUXI，Toutiao/Vigo Logo 替换为通用 Bell/Star；三个自定义图标触发器的数量、颜色和能力保持，并补充双语 `aria-label`。
- 文案规范章节使用的内部 `NotificationCard` 非公开导出；保留规范正文，不伪造公开组件示例。
- 本批未修改组件实现、公开类型、主题、共享文档设施、依赖或第三方资产，因此无额外发布包回归。

## 验证证据

- 定点 Prettier、`pnpm --filter @workspace/docs check:content`、已准备产物上的 `nuxt typecheck` 与 `git diff --check` 通过。
- 开发站首先使用交互浏览器观察真实 DOM/ARIA：通知为 `role="alert"`，title 存在时 `aria-labelledby` 指向标题 id，placement 由 `.semi-notification-list[placement]` 表达，关闭按钮的可访问名为 `close`。中英文 Basic/Update 代表路径均通过。
- 开发站整批 smoke 通过：双语各 8/8，覆盖所有源码面板与重置、Basic 自动关闭、六种位置、七个图标操作、四种 light 背景、链接内容、10 秒延时、手动关闭、同 id 更新与退出动画后重开，以及 Basic/Links 的 REPL 编译、iframe 渲染和通知触发。
- 开发站 Monaco 请求 `/_nuxt/assets/editor.worker-icaF0yeN.js` 和 `vue.worker-NGt3bbUb.js` 失败，随后产生空栈 `Event`；其发生位置、原始消息和编辑器实际可运行证据已保留。这一例外只在开发服务的 worker 资源精确匹配上分类，没有统一忽略 console error。
- `pnpm --filter @workspace/docs check` 通过：64 项准备/证据设施检查通过，196 页、1556 个注册 Demo、395 条预渲染路由、内容、Nuxt 类型、静态产物、本地 REPL、许可和散列门禁通过。构建仍保留现有 lottie direct-eval、sideEffects 和 Lightning CSS 警告，未由本批引入。
- 最终静态站用同一 smoke 重跑后双语各 8/8 通过；Chrome 151.0.7922.34、1440×900、DPR 1、light，`console error` / `pageerror` / 本地资源 `requestfailed` 均为 0。最终摘要与两张 Basic 局部截图保留在 ignored 的 `apps/docs/.data/documentation-smoke/notification/20260907-dev/`。
- `pnpm --filter @workspace/docs accept:nuxt:batch --affected --plan` 确认 Button、ConfigProvider、Dark Mode、Icon、Locale、Navigation 六批历史证据仍有效，无需重建或重验。

## 未验证事项与后续

- Notification 八项未执行完整 React/Vue 双语、明暗、交互与截图严格矩阵；本批不新增 `accepted`。
- 映射进度从 748/859 增加到 756/859，有效严格验收仍为 43/859；已映射待验收 713 项，待映射 103 项。
- 下一补齐批次为 Toast 9 项，随后 UserGuide 8 项；严格验收下一批仍为 Divider 2 项。
- 未执行全仓 `check:full`；未提交或推送。
