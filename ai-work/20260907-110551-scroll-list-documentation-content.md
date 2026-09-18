# AI 工作记录：ScrollList 双语示例补齐

- 日期：2026-09-07
- 状态：补齐线完成；严格视觉与行为验收未执行

## 目标

继续 OverflowList 后的下一补齐批次，按固定 Semi Design v2.102.0 恢复 ScrollList 一项双语示例的完整演示结构，并提供实际站点及在线编辑器运行证据。不增加 accepted，不扩展到 Transfer 或共享组件修复。

## 验收标准

- 中文与英文各一个自包含 SFC，关联上游唯一 live Demo；保留三列 wheel、受控索引、循环差异、分钟禁用及底部按钮。
- 文档联合检查通过；双语示例实际完成加载、点击、禁用项检查、循环滚动、重置、源码与编辑器修改运行。
- 映射更新为 727/859，待映射 132 项；严格有效验收保持 43/859，已映射待验收 684 项。

## 风险与假设

- 实际核验 `git submodule status vendor/semi-design` 和 `git -C vendor/semi-design describe --tags --exact-match`：提交为 `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`，tag 为 `v2.102.0`。
- 唯一 live Demo 位于 `content/show/scrolllist/index.md:22-119` 与 `index-en-US.md:23-96`；无独有示例或多文件依赖。中文时段为上午/下午，英文为 AM/PM；标题分别为无限滚动列表、Infinite Scroll List。两侧底部均为 Ok。
- 现有单列示例没有覆盖上游完整结构；组件 ready 状态不作为此次文档正确性的证据。
- 开始时工作区已有上一批 OverflowList 和工作流修改；本次保留，不提交或回退。

## 修改范围

- `apps/docs/src/demos/scroll-list/{zh-CN,en-US}/Example1.vue`：原文件内更新为三列示例，不新增共用组件或 composable；每个 SFC 只承担一个完整选择演示。
- `apps/docs/content/{zh-cn,en-us}/components/scroll-list.md`：加入导入方式、三列操作说明、数据适配说明和本示例 React→Vue 迁移；既有 API 与无障碍说明保留，未声明全量审阅完成。
- `docs/documentation/mappings/scroll-list.json`：新增唯一上游索引、双语路径和章节关联，不写入 review 完成或 accepted。
- 生成覆盖账本，更新根 README、文档进度及双线计划；Demo 注册总数仍为 1504，内容仍为 196 页，本批复用已有两个文件。
- 未修改组件库、Foundation、主题、图标、共享编辑器、验收脚本或历史 evidence。

## 关键决策与权衡

### 保留演示契约，使用 Vue 原生状态与插槽

- 三个 `shallowRef(1)` 分别控制时段、小时、分钟；保留 type=1/2/3 及事件内的列标识判断。
- 时段 `cycled=false`；小时 1–12、分钟 0–59 使用循环 wheel。保持默认 300px body、unset 边框/阴影、小时和分钟选择日志、Ok 的 close 日志；按钮不关闭列表。
- `header` / `footer` 使用具名插槽，`onSelect` 使用 `@select`；补充本地化 aria-label，仅从公开组件与逐组件 CSS 入口导入。

### 分钟禁用数据固定化

- 上游每次执行示例时使用 `Math.random()` 生成分钟禁用状态。本批沿用仓库示例固定化惯例，使用 `index % 2 === 0` 禁用偶数分钟，使初始索引 1 可选，并保留启用/禁用混排。
- 代价：不是某次上游随机结果的逐值复制；已在双语正文与 mapping 注明。严格验收须统一参考侧分钟数据，不属于已经 accepted 的视觉 deviation。
- 备选为保留随机值，但会令重置、页面与编辑器呈现不同数据，不利于复查。
- 没有复制 Foundation/SCSS 或新增第三方资产；静态联合构建仍生成现有归属与散列清单（13 个直接包、5655 个文件）。
- 回退边界：恢复本批两个 SFC 和正文，删除本批 mapping，重新生成覆盖账本并恢复进度；无需回退共享组件或历史证据。

## 验证证据

### 命令与产物

- `pnpm --filter @workspace/docs check`：成功，约 97 秒。63 项证据/准备基础设施测试通过；resources 按内容校验复用，site/checks 重建；Nuxt 类型、内容、静态产物检查通过。生成 395 条预渲染路由、196 页、1504 个注册 Demo，覆盖输出为 727/859 映射、43 项有效验收。
- `node apps/docs/scripts/prepare-coverage.mjs`：成功，727/859，43 项有效验收。
- `pnpm --filter @workspace/docs accept:nuxt:batch --affected --plan`：补齐前后均显示 Button、Icon、ConfigProvider、Locale、Dark Mode、Navigation 六批证据有效；没有执行正式矩阵。
- `pnpm exec prettier --write`（仅本批九个交付文件）：成功，仅双线计划的表格格式发生变化；示例与页面源码未变化，不重复构建。
- `pnpm exec eslint apps/docs/src/demos/scroll-list/zh-CN/Example1.vue apps/docs/src/demos/scroll-list/en-US/Example1.vue --max-warnings=0`：成功。临时 smoke 脚本已删除，浏览器与预览服务已关闭。

### 实际双语页面和编辑器

- 启动 `node apps/docs/scripts/preview-static.mjs`，访问 `/zh-cn/components/scroll-list/` 和 `/en-us/components/scroll-list/`。
- 浏览器工具打开并截图观察真实页面；其 wheel 调用发生工具超时，已报告工具问题。完整可复查交互改由临时 Playwright smoke 脚本直接启动锁定 Chromium 执行，不修改业务代码规避工具问题。
- 环境：Playwright Chromium 1234，Chrome 151.0.7922.34，1440×900、DPR 1、light、浏览器 locale=en-US；页面分别使用中英文路径。
- 两页初态分别为 `[下午, 2, 1]`、`[PM, 2, 1]`；点击时段和小时后为 `[上午/AM, 3, 1]`。点击禁用分钟 2 后仍为 1，点击启用分钟 3 后更新为 3。
- 真实鼠标滚轮向下滚动小时 360px，从 3 跨越 12 回到 1；另外两列保持 `[上午/AM, 3]`。
- 点击 Ok 确实输出 close，列表仍可见；重置恢复 `[下午/PM, 2, 1]`。
- 双语源码展开/收起正常；在线编辑器通过真实键盘将小时索引 `shallowRef(1)` 改为 `shallowRef(4)`，点击运行，iframe 实际选中小时 5。退出编辑后正文示例恢复小时 2，三个列表均可见。
- 完整运行未捕获 pageerror 或 console error。页面与编辑器截图已目视检查。
- 首次 smoke 将 warning 与 error 混为一组，行为断言全部通过，但最后的零错误断言被编辑器警告触发。随后按日志级别分别记录，未屏蔽任何警告；完整重跑成功（约 6.3 秒）。
- 临时本地证据：`apps/docs/test-results/scroll-list-content/smoke.json` 和双语页面/编辑器 PNG；均位于 ignored test-results，不是持久严格验收 evidence。临时 smoke 脚本在验证后移除，不新增永久测试。

## 未验证事项与剩余风险

- 编辑器实际输出六条 warning，来自 `[volar-service-emmet]` 与 `[volar-service-pug] this module is not yet supported for web.`。构建后的 `apps/docs/public/repl/workers/vue.worker-NGt3bbUb.js:45795` 可定位 Emmet 的 console.warn。编辑器修改、编译及运行已成功；不把警告描述为无警告通过，也不在本批修改共享编辑器。
- 未执行 React/Vue 同进程严格对照、明暗/RTL/键盘/动效矩阵、computed style/几何门禁或截图 diff；分钟固定数据仍待严格验收时适配参考侧。
- 未执行新的组件单元/SSR、全仓浏览器或 npm pack 验证：没有改动组件或发布契约。没有写入章节/API/迁移的正式 review 完成标记。
- 上一批 OverflowList 计数待对齐问题仍保留，本批未处理。

下一补齐批次：Transfer 14 项，随后 Feedback 7 项。严格验收下一批仍为 Divider 2 项。
