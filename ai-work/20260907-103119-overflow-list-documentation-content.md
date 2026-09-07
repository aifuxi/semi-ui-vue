# AI 工作记录：OverflowList 双语示例补齐

- 日期：2026-09-07
- 状态：补齐线完成；严格视觉与行为验收未执行，存在待对齐问题

## 目标

补齐固定 Semi Design v2.102.0 的 OverflowList 四项双语示例，完成内容、类型及实际站点运行检查。只交付双语映射与运行证据，不创建严格验收批次或增加 accepted。

## 验收标准

- 默认折叠、从起始端折叠、最少三项和滚动模式各有独立中英文 SFC，章节与上游索引一一关联。
- 文档内容、类型、构建与静态产物检查通过；八个示例在实际站点可加载、调整宽度、恢复、查看源码及在线编辑运行。
- 观察到的行为差异如实记录；不把基础运行检查当成严格验收，也不把未修复问题标记为 accepted deviation。
- 映射数更新为 726/859；严格有效验收仍为 43/859；补齐下一批为 ScrollList 1 项，验收下一批仍为 Divider 2 项。

## 风险与假设

- 唯一参考为只读 `vendor/semi-design`：提交 `cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`，tag `v2.102.0`，本轮实际核验一致。
- 中文四项 live Demo 位于 `content/show/overflowlist/index.md` 的 22、67、117、167 行；英文位于 `index-en-US.md` 的 22、67、117、168 行，顺序和数据一致，无独有示例或多文件依赖。
- 原有组件 ready 状态与当前文档示例的正确性分开判断；本轮运行确实发现溢出标签计数问题，不能声明行为完全一致。

## 修改范围

- `apps/docs/src/demos/overflow-list/{zh-CN,en-US}/`：新增 `Collapse.vue`、`CollapseFromStart.vue`、`MinVisibleItems.vue`、`Scroll.vue`，共八个自包含示例。各 SFC 只负责一种演示模式及其宽度状态，不新增共享组件或 composable。
- `apps/docs/content/{zh-cn,en-us}/components/overflow-list.md`：用四项 live Demo 替换静态片段，补充操作说明与 scroll 插槽迁移，修正英文页末尾残留中文。
- `docs/documentation/mappings/overflow-list.json` 与生成的注册表/覆盖账本：关联上游索引、章节与双语文件；四项均为 `implemented-awaiting-parity`，没有写入 review 完成标记或 accepted。
- 根 README、文档进度和双线计划：726 项已映射、683 项已映射待验收、133 项待映射、1504 个已注册 SFC Demo；196 页与 43 项有效验收不变。
- 未修改组件库、Foundation、主题、图标、验收脚本和历史 evidence。

## 关键决策与权衡

### 保留上游演示结构，使用 Vue 原生插槽

- 保留六个图标标签、100% 初始宽度、step=1 滑块、标签间距、折叠方向和 minVisibleItems=3。
- React `visibleItemRenderer` 改为 `#visibleItem`；scroll 的 `[startItems, endItems]` 改为两次 `#overflow` 调用，两端无溢出时仍显示 `+0`。scroll item 保留 `.item-cls` 单元素根，供组件附加 `data-scrollkey`。
- 图标组件存放在非响应式数组中，宽度用 `shallowRef`；只从公开组件及主题入口导入。为滑块补充本地化 `aria-label`，不改变演示数据。
- 图标和样式沿用现有公开包及固定上游归属，没有复制 Foundation/SCSS 或引入新第三方资产。联合检查重新生成静态站点归属与散列记录：13 个直接包、5655 个文件。

### 记录对齐差异，不扩大为共享组件修复

- 选择：保留当前真实可运行示例，将以下问题交给严格验收线定位修复。
- 理由：没有阻断加载、编译或运行的异常，调整宽度、重排、恢复和横向滚动均能执行；用户明确要求记录待对齐差异，不执行严格视觉验收。修复共享组件会扩展本轮范围及历史证据影响面。
- 代价：当前示例的溢出计数不可信，不能作为正确数量逻辑或完全对齐的证明。
- 回退：撤回本批示例、章节映射与生成统计，恢复补齐线的前一进度；不需要改动组件库或历史严格证据。

## 验证证据

### 命令检查

- `git submodule status vendor/semi-design`、`git -C vendor/semi-design describe --tags --exact-match`：固定提交与 tag 一致。
- `pnpm --filter @workspace/docs check`：成功。63 项证据/准备基础设施测试通过；resources 按内容校验复用，site 与 checks 因新示例重建；Nuxt typecheck、内容检查和静态产物门禁均通过。生成 395 条预渲染路由、196 页内容、1504 个已注册 Demo；账本输出 726/859 映射和 43 项有效验收。
- `pnpm --filter @workspace/docs accept:nuxt:batch --affected --plan`：补齐前后六个历史批次均显示证据有效；命令仅检查影响范围，没有运行正式浏览器矩阵。
- 本轮没有新增永久测试或严格批次；基础运行检查通过浏览器工具直接操作真实页面和 REPL，不把观察结果转换为 accepted。

### 实际站点运行

- 服务：`node apps/docs/scripts/preview-static.mjs`，访问 `/zh-cn/components/overflow-list/` 和 `/en-us/components/overflow-list/`。
- 环境：锁定的 Playwright `chromium-1234`，Chrome `151.0.7922.34`，1440×900、DPR 1、light。浏览器工具启动时未应用请求的 viewport，随后用实际 page.setViewport 固定并读取 `innerWidth/innerHeight/devicePixelRatio` 确认为 1440/900/1。
- 八个示例均完成：初始加载；真实鼠标拖动宽度滑块；重新扩大到 100% 恢复六项；重置恢复；展开/收起源码。
- 两个 scroll 示例均完成：缩窄到约 35%，滚轮横向滚动 `scrollLeft: 0 → 286 → 0`；全部六项仍在滚动容器中。
- 八个示例均完成：打开在线编辑器，实际键盘替换 SFC 的 `shallowRef(100)` 为 `shallowRef(60)`，点击运行，iframe 中滑块值变为 60；关闭编辑器后原页面示例恢复 100。无多文件依赖需要额外检查。
- 完整双语页面交互和编辑器检查均未收集到 pageerror、console error/warning 或编辑器错误；已用页面截图目视检查中文缩窄状态、英文恢复态和编辑器。
- 本地临时产物：`apps/docs/test-results/overflow-list-content/smoke.json` 及四张 WebP。它们位于 ignored 的 test-results，供本地复查，不属于持久严格验收 evidence；关键结果保留在本记录。

## 未验证事项与剩余风险

### 待对齐：collapse 溢出标签计数滞后

中英文实际页面均观察到：

| 示例              | 操作后宽度值 | 可见标签                | 实际溢出标签 | 按六项总数应显示 |
| ----------------- | -----------: | ----------------------- | ------------ | ---------------- |
| Collapse          |           24 | alarm、bookmark         | +1           | +4               |
| CollapseFromStart |           24 | folder                  | +1           | +5               |
| MinVisibleItems   |            9 | alarm、bookmark、camera | +1           | +3               |

- 可见项重排、起始端保留尾项、最少三项和重新展开均已观察到；数值标签没有同步跟随当前可见项数量。
- 上游示例使用 `items.length`；固定 Foundation `overflowList/foundation.ts:155-164` 按 pivot 分割完整 items。当前 Vue 示例同样渲染 `hidden.length`，没有硬编码数量。
- 尚未定位是插槽更新、Tag 内容刷新还是其它集成边界导致，不能在缺少证据时归因，也不能通过替换 Tag、强制 key 重建或手动计算计数掩盖。
- 复查方法：进入中文或英文页面，将前三个示例的滑块分别拖至约 24%、24%、9%，观察可见标签与 +N；重新扩大到 100% 可恢复六项。

### 待对齐：scroll 两端计数没有跟随可见性更新

- 中英文示例缩窄到 35% 后，实际滚动容器约 210px、内容约 496px，存在横向溢出，但两端仍显示 `+0`。
- 从 `scrollLeft=0` 滚到 286 后，两端仍为 `+0`；横向滚动本身可用。
- 固定上游 renderer 以首尾两组数组的 length 渲染计数，Foundation 使用 IntersectionObserver 可见状态切分；当前 Vue 插槽也使用对应数组的 `hidden.length`。具体更新链路留待严格验收定位。
- 这两类问题只是待修差异，不是 accepted deviation；本批四项不得进入 accepted。

### 本轮未执行

- React/Vue 同进程对照、关键 computed style 精确比较、几何差门禁、截图 diff，以及双语明暗/RTL/键盘焦点/动效严格矩阵。
- 新的组件库单元/SSR、全仓 Chromium 或 npm pack 验证：本轮没有修改组件库或发布契约。
- 全量 API/迁移审阅的正式闭环。已有表格继续保留，没有写入审阅通过状态。

补齐线下一批：ScrollList 1 项；严格验收线下一批：Divider 2 项。OverflowList 四项已进入展示类的待验收队列，需先解决上述计数问题再生成正式证据。
